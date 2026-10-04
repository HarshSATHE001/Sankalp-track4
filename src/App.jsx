import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import GateScreen from './components/GateScreen.jsx';
import PracticeTab from './components/PracticeTab.jsx';
import JournalTab from './components/JournalTab.jsx';
import InsightsTab from './components/InsightsTab.jsx';
import TrustTab from './components/TrustTab.jsx';
import LockModal from './components/LockModal.jsx';

import { EMPTY, unlock, save, wipe } from './vault.js';
import { evaluate, submitOrder, setLocked, isLocked, PRESETS, T } from './engine.js';
import { getStatic, subscribeCounters, recordNetworkEvent } from './data.js';
import { L, t } from './i18n.js';

function clamp(val, min, max, defaultVal) {
  const n = Number(val);
  if (isNaN(n)) return defaultVal;
  return Math.min(Math.max(n, min), max);
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [pin, setPin] = useState('1234');
  const [unlocked, setUnlocked] = useState(false);
  const [vault, setVault] = useState(null);
  const [gateError, setGateError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const [activeTab, setActiveTab] = useState('practice');
  const [lockModal, setLockModal] = useState(null);

  const [reqN, setReqN] = useState({ own: 0, external: 0, unexpected: 0, history: [] });
  const [bhashiniTts, setBhashiniTts] = useState(false);
  const [voiceInput, setVoiceInput] = useState(true);

  // Boot-time merge of thresholds.json with clamping
  useEffect(() => {
    getStatic('config/thresholds.json')
      .then((cfg) => {
        if (cfg?.presets) {
          for (const [key, p] of Object.entries(cfg.presets)) {
            if (PRESETS[key]) {
              PRESETS[key].streak = clamp(p.streak, 2, 6, PRESETS[key].streak);
              PRESETS[key].maxLev = clamp(p.maxLev, 2, 20, PRESETS[key].maxLev);
              PRESETS[key].cool = clamp(p.cool, 10, 600, PRESETS[key].cool);
            }
          }
          Object.assign(T, PRESETS.default);
        }
      })
      .catch((err) => {
        // Range clamping on threshold configuration
        console.warn('Thresholds config load skipped:', err.message);
      });
  }, []);

  // Network counters & firewall monitoring
  useEffect(() => {
    const unsub = subscribeCounters(setReqN);

    // Keep fetch/XHR counter wrapper feeding same counters
    if (typeof window !== 'undefined' && !window.__sankalp_firewall_installed) {
      window.__sankalp_firewall_installed = true;
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const targetUrl = String(args[0]?.url || args[0] || '');
        const isExternal = /^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith(window.location.origin);
        if (isExternal) {
          recordNetworkEvent('external', targetUrl);
          throw new Error(`[Privacy Firewall] External network call blocked: ${targetUrl}`);
        }
        return originalFetch.apply(window, args);
      };
    }

    return () => unsub();
  }, []);

  const speak = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback
    }
  };

  const handleUnlock = async (enteredPin) => {
    setIsBusy(true);
    setGateError('');
    try {
      const data = await unlock(enteredPin);
      setPin(enteredPin);
      setVault(data);
      setUnlocked(true);
    } catch (err) {
      setGateError(err.message || 'Incorrect PIN');
    } finally {
      setIsBusy(false);
    }
  };

  const handleLockVault = () => {
    setUnlocked(false);
    setVault(null);
    setLockModal(null);
  };

  const persistVault = async (updated) => {
    setVault(updated);
    if (pin) {
      try {
        await save(pin, updated);
      } catch (err) {
        console.error('Vault auto-save failed:', err);
      }
    }
  };

  const placeOrder = (order) => {
    const history = vault?.h || [];
    const capital = vault?.g?.amt || 50000;
    const ev = evaluate(order, history, capital, Date.now(), T);

    if (ev.lock) {
      setLocked(true);
      setLockModal({
        open: true,
        evaluation: ev,
        order
      });
      return;
    }

    // Safe order placed
    const simulatedPnl = Math.round((Math.random() - 0.45) * 500 * (order.lev || 1));
    const newTrade = {
      t: Date.now(),
      size: order.size,
      lev: order.lev,
      pnl: simulatedPnl,
      src: order.src
    };

    const newJournal = {
      t: Date.now(),
      inst: order.inst,
      side: order.side,
      why: order.why,
      hz: order.hz,
      lock: false,
      note: ''
    };

    const updated = {
      ...vault,
      h: [...(vault.h || []), newTrade],
      j: [...(vault.j || []), newJournal]
    };

    persistVault(updated);
  };

  const endLock = (action, reflectionNote = '') => {
    setLocked(false);

    if (!lockModal) return;
    const { order, evaluation } = lockModal;

    const currentMetrics = vault?.m || { locks: 0, cancel: 0, proceed: 0, jl: 0 };
    let newTrades = [...(vault?.h || [])];
    let newJournals = [...(vault?.j || [])];

    if (action === 'cancel') {
      currentMetrics.locks = (currentMetrics.locks || 0) + 1;
      currentMetrics.cancel = (currentMetrics.cancel || 0) + 1;

      newJournals.push({
        t: Date.now(),
        inst: order.inst,
        side: order.side,
        why: order.why,
        hz: order.hz,
        lock: true,
        note: reflectionNote || 'Reflected and chose to step back from impulsive trade.'
      });
    } else if (action === 'proceed') {
      currentMetrics.locks = (currentMetrics.locks || 0) + 1;
      currentMetrics.proceed = (currentMetrics.proceed || 0) + 1;

      const simulatedPnl = Math.round((Math.random() - 0.55) * 600 * (order.lev || 1));
      newTrades.push({
        t: Date.now(),
        size: order.size,
        lev: order.lev,
        pnl: simulatedPnl,
        src: order.src
      });

      newJournals.push({
        t: Date.now(),
        inst: order.inst,
        side: order.side,
        why: order.why,
        hz: order.hz,
        lock: true,
        note: reflectionNote || 'Proceeded after 60s reflection window.'
      });
    }

    if (reflectionNote) {
      currentMetrics.jl = (currentMetrics.jl || 0) + 1;
    }

    persistVault({
      ...vault,
      h: newTrades,
      j: newJournals,
      m: currentMetrics
    });

    setLockModal(null);
  };

  const loadRameshDemo = async () => {
    // Ramesh, 24, Kolhapur, Marathi speaker
    setLang('mr');
    const rameshHistory = [
      { t: Date.now() - 3600000 * 3, size: 5000, lev: 2, pnl: -1200, src: 'plan' },
      { t: Date.now() - 3600000 * 2, size: 8000, lev: 3, pnl: -2400, src: 'plan' },
      { t: Date.now() - 3600000 * 1, size: 12000, lev: 5, pnl: -3500, src: 'tip' }
    ];

    const rameshVault = {
      h: rameshHistory,
      j: [
        { t: Date.now() - 3600000 * 3, inst: 'NIFTY', side: 'buy', why: 'setup', hz: 'intraday', lock: false, note: 'Initial plan' },
        { t: Date.now() - 3600000 * 2, inst: 'BANKNIFTY', side: 'buy', why: 'breakout', hz: 'intraday', lock: false, note: 'Trying breakout' },
        { t: Date.now() - 3600000 * 1, inst: 'NIFTY', side: 'sell', why: 'recovery', hz: 'intraday', lock: false, note: 'Saw a tip to recover' }
      ],
      m: { locks: 0, cancel: 0, proceed: 0, jl: 3 },
      g: { name: 'Emergency Family Fund', amt: 50000 }
    };

    setVault(rameshVault);
    setUnlocked(true);
    setActiveTab('practice');

    // Escalate order: 10x leverage on ₹25,000 to trigger circuit-breaker!
    const rameshOrder = {
      inst: 'NIFTY',
      side: 'buy',
      size: 25000,
      lev: 10,
      src: 'tip',
      why: 'recovery',
      hz: 'intraday'
    };

    const ev = evaluate(rameshOrder, rameshHistory, 50000, Date.now(), T);
    if (ev.lock) {
      setLocked(true);
      setLockModal({
        open: true,
        evaluation: ev,
        order: rameshOrder
      });
    }
  };

  const handleCsvImport = async (file) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const newTrades = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 4) {
          newTrades.push({
            t: Date.now() - (lines.length - i) * 60000,
            size: Number(parts[1]) || 5000,
            lev: Number(parts[2]) || 1,
            pnl: Number(parts[3]) || 0,
            src: parts[4]?.trim() || 'import'
          });
        }
      }

      if (newTrades.length > 0) {
        const updated = {
          ...vault,
          h: [...(vault.h || []), ...newTrades]
        };
        persistVault(updated);
        alert(`Successfully imported ${newTrades.length} trades.`);
      }
    } catch (err) {
      alert('Failed to import CSV: ' + err.message);
    }
  };

  const handleWipeData = () => {
    if (confirm('Permanently wipe local encrypted vault? This cannot be undone.')) {
      wipe();
      setVault(JSON.parse(JSON.stringify(EMPTY)));
      setUnlocked(false);
      alert('Local vault wiped clean.');
    }
  };

  const handleLoadSampleLog = (type) => {
    if (type === 'ramesh') {
      loadRameshDemo();
    } else if (type === 'calm') {
      const calmVault = {
        h: [
          { t: Date.now() - 86400000 * 2, size: 5000, lev: 1, pnl: 450, src: 'plan' },
          { t: Date.now() - 86400000, size: 5000, lev: 1, pnl: 600, src: 'plan' },
          { t: Date.now() - 3600000, size: 5000, lev: 1, pnl: -300, src: 'plan' }
        ],
        j: [],
        m: { locks: 0, cancel: 0, proceed: 0, jl: 0 },
        g: { name: 'Disciplined Growth', amt: 50000 }
      };
      setVault(calmVault);
      setUnlocked(true);
      setActiveTab('practice');
    } else if (type === 'nightowl') {
      const nightVault = {
        h: [
          { t: Date.now() - 3600000 * 2, size: 8000, lev: 5, pnl: -800, src: 'social' },
          { t: Date.now() - 3600000, size: 10000, lev: 8, pnl: -1500, src: 'social' }
        ],
        j: [],
        m: { locks: 1, cancel: 1, proceed: 0, jl: 1 },
        g: { name: 'Night Trader', amt: 50000 }
      };
      setVault(nightVault);
      setUnlocked(true);
      setActiveTab('practice');
    }
  };

  return (
    <div className="sankalp-app">
      <Header
        lang={lang}
        setLang={setLang}
        onLockVault={handleLockVault}
        unlocked={unlocked}
        networkCounters={reqN}
      />

      <main className="app-main">
        {!unlocked ? (
          <GateScreen
            lang={lang}
            onUnlock={handleUnlock}
            onLoadDemo={loadRameshDemo}
            error={gateError}
            isBusy={isBusy}
          />
        ) : (
          <div className="workspace-container">
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              lang={lang}
              journalCount={(vault?.j || []).length}
            />

            <div className="tab-viewport">
              {activeTab === 'practice' && (
                <PracticeTab
                  vault={vault}
                  onPlaceOrder={placeOrder}
                  onLoadRameshDemo={loadRameshDemo}
                  lang={lang}
                />
              )}

              {activeTab === 'journal' && (
                <JournalTab
                  vault={vault}
                  lang={lang}
                />
              )}

              {activeTab === 'insights' && (
                <InsightsTab
                  vault={vault}
                  lang={lang}
                />
              )}

              {activeTab === 'trust' && (
                <TrustTab
                  lang={lang}
                  networkCounters={reqN}
                  bhashiniTts={bhashiniTts}
                  setBhashiniTts={setBhashiniTts}
                  voiceInput={voiceInput}
                  setVoiceInput={setVoiceInput}
                  onWipeData={handleWipeData}
                  onImportCsv={handleCsvImport}
                  onLoadSampleLog={handleLoadSampleLog}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {lockModal && lockModal.open && (
        <LockModal
          evaluation={lockModal.evaluation}
          order={lockModal.order}
          lang={lang}
          onCancel={() => endLock('cancel')}
          onProceed={() => endLock('proceed')}
          onSaveReflection={(note) => endLock('cancel', note)}
          bhashiniTts={bhashiniTts}
          voiceInput={voiceInput}
          speak={speak}
        />
      )}
    </div>
  );
}
