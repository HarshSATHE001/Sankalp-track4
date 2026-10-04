import assert from 'node:assert';
import { evaluate, submitOrder, setLocked, isLocked, replay, PRESETS, T } from './engine.js';

console.log('Running SANKALP Safety Engine Unit Tests...');

// Reset lock state before tests
setLocked(false);
assert.strictEqual(isLocked(), false, 'Engine should start unlocked');

// Test 1: Safe order with no history
const safeOrder = { inst: 'NIFTY', side: 'buy', size: 5000, lev: 2, src: 'plan' };
const res1 = evaluate(safeOrder, [], 50000, Date.parse('2026-10-04T10:00:00Z'), T);
assert.strictEqual(res1.lock, false, 'Safe order must not trigger lock');
assert.strictEqual(res1.score, 0, 'Safe order should have score 0');

// Test 2: Consecutive loss streak (3 losses)
const lossHistory = [
  { t: 1, size: 5000, lev: 2, pnl: -1200, src: 'plan' },
  { t: 2, size: 5000, lev: 2, pnl: -800, src: 'plan' },
  { t: 3, size: 5000, lev: 2, pnl: -1500, src: 'plan' }
];
const res2 = evaluate(safeOrder, lossHistory, 50000, Date.parse('2026-10-04T10:00:00Z'), T);
assert.strictEqual(res2.score, 1, '3 losses must add score 1 for streak');
assert.strictEqual(res2.lock, false, 'Score 1 alone must not trigger lock (rules require score >= 2)');
assert.strictEqual(res2.nudge, true, 'Score 1 triggers protective nudge');

// Test 3: Loss streak + High Leverage escalation (Revenge trade scenario)
const revengeOrder = { inst: 'NIFTY', side: 'buy', size: 10000, lev: 12, src: 'plan' };
const res3 = evaluate(revengeOrder, lossHistory, 50000, Date.parse('2026-10-04T10:00:00Z'), T);
assert.ok(res3.score >= 2, `Score must be >= 2 for streak + high leverage (got ${res3.score})`);
assert.strictEqual(res3.lock, true, 'Score >= 2 MUST trigger circuit breaker lock');

// Test 4: submitOrder integration
setLocked(false);
const subRes = submitOrder(revengeOrder, lossHistory, 50000, Date.parse('2026-10-04T10:00:00Z'), T);
assert.strictEqual(subRes.accepted, false, 'Impulsive order must be rejected');
assert.strictEqual(subRes.locked, true, 'Impulsive order must activate lock');
assert.strictEqual(isLocked(), true, 'Module state must reflect circuit breaker lock');

// Test 5: Reject subsequent orders while locked
const blockedOrder = submitOrder(safeOrder, [], 50000, Date.parse('2026-10-04T10:00:00Z'), T);
assert.strictEqual(blockedOrder.accepted, false, 'All orders blocked while circuit breaker active');

// Reset lock
setLocked(false);
assert.strictEqual(isLocked(), false);

// Test 6: Replay Lab
const sampleLog = [
  { t: 1, size: 5000, lev: 2, pnl: -1000, src: 'plan' },
  { t: 2, size: 5000, lev: 2, pnl: -1000, src: 'plan' },
  { t: 3, size: 5000, lev: 2, pnl: -1000, src: 'plan' },
  { t: 4, size: 15000, lev: 12, pnl: -8000, src: 'social' } // Impulse trade
];
const rep = replay(sampleLog, T);
assert.strictEqual(rep.locksTriggered, 1, 'Replay should identify 1 impulsive trade');
assert.strictEqual(rep.lossPrevented, 8000, 'Replay should calculate avoided loss');

console.log('ALL ENGINE TESTS PASSED.');
