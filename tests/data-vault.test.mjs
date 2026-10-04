import test from 'node:test';
import assert from 'node:assert';
import { isAllowedPath, recordNetworkEvent, getCounters } from '../src/data.js';
import { EMPTY, unlock, save, wipe } from '../src/vault.js';
import { PRESETS } from '../src/engine.js';

test('src/data.js allow-list filtering', () => {
  assert.strictEqual(isAllowedPath('config/thresholds.json'), true);
  assert.strictEqual(isAllowedPath('data/ramesh.csv'), true);
  assert.strictEqual(isAllowedPath('data/calm.csv'), true);
  assert.strictEqual(isAllowedPath('data/nightowl.csv'), true);
  assert.strictEqual(isAllowedPath('model/anomaly.int8.json'), true);
  assert.strictEqual(isAllowedPath('tts/hi/lockM.wav'), true);
  assert.strictEqual(isAllowedPath('tts/mr/breathe.wav'), true);

  // Denied paths
  assert.strictEqual(isAllowedPath('api/telemetry'), false);
  assert.strictEqual(isAllowedPath('users/profile.json'), false);
  assert.strictEqual(isAllowedPath('admin/config.env'), false);
});

test('src/data.js counter verification', () => {
  const initial = getCounters();
  recordNetworkEvent('own', 'config/thresholds.json');
  const afterOwn = getCounters();
  assert.strictEqual(afterOwn.own, initial.own + 1);
  assert.strictEqual(afterOwn.external, 0, 'External requests must stay 0');
  assert.strictEqual(afterOwn.unexpected, 0, 'Unexpected requests must stay 0');
});

test('Threshold preset configuration & boundaries', () => {
  for (const [key, preset] of Object.entries(PRESETS)) {
    assert.ok(preset.streak >= 2 && preset.streak <= 6, `${key}.streak out of bounds 2..6`);
    assert.ok(preset.maxLev >= 2 && preset.maxLev <= 20, `${key}.maxLev out of bounds 2..20`);
    assert.ok(preset.cool >= 10 && preset.cool <= 600, `${key}.cool out of bounds 10..600`);
  }
});

test('src/vault.js encrypted storage lifecycle', async () => {
  wipe();
  const pin = '1234';

  // 1. Initial unlock returns EMPTY clone
  const fresh = await unlock(pin);
  assert.deepStrictEqual(fresh.h, []);
  assert.deepStrictEqual(fresh.j, []);
  assert.strictEqual(fresh.g.amt, 50000);

  // 2. Save data with PBKDF2/AES-GCM
  fresh.h.push({ t: 100, size: 5000, lev: 5, pnl: -500, src: 'plan' });
  fresh.m.locks = 1;
  await save(pin, fresh);

  // 3. Unlock with correct PIN
  const restored = await unlock(pin);
  assert.strictEqual(restored.h.length, 1);
  assert.strictEqual(restored.h[0].pnl, -500);
  assert.strictEqual(restored.m.locks, 1);

  // 4. Incorrect PIN throws
  await assert.rejects(async () => {
    await unlock('9999');
  }, /Incorrect PIN/);

  // Clean up
  wipe();
});
