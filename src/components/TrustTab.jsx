import React from 'react';
import Toggle from './Toggle.jsx';
import { L, t } from '../i18n.js';

export default function TrustTab({
  lang,
  networkCounters,
  bhashiniTts,
  setBhashiniTts,
  voiceInput,
  setVoiceInput,
  onWipeData,
  onImportCsv,
  onLoadSampleLog
}) {
  const ownLoaded = networkCounters?.own || 0;
  const externalSent = networkCounters?.external || 0;
  const unexpected = networkCounters?.unexpected || 0;

  return (
    <div className="tab-pane trust-pane">
      <div className="trust-header">
        <h2 className="section-title">{t(L.trustTab, lang)}</h2>
        <p className="section-subtitle">
          Transparent, verifiable, zero-knowledge privacy. No servers, no tracking, 100% on-device.
        </p>
      </div>

      <div className="firewall-audit-grid">
        <div className="stat-card audit-card highlight-border-green">
          <div className="audit-icon-wrap">🛡️</div>
          <span className="stat-label">Privacy Shield Status</span>
          <span className="stat-value text-green">{t(L.zero, lang)}</span>
          <span className="stat-sub">Trades, reasons & PIN never leave device</span>
        </div>

        <div className="stat-card audit-card">
          <div className="audit-icon-wrap">📦</div>
          <span className="stat-label">{t(L.staticLoaded, lang)}</span>
          <span className="stat-value">{ownLoaded}</span>
          <span className="stat-sub">Pre-bundled static assets only</span>
        </div>

        <div className="stat-card audit-card">
          <div className="audit-icon-wrap">🌐</div>
          <span className="stat-label">External Network Calls</span>
          <span className="stat-value text-green">{externalSent}</span>
          <span className="stat-sub">Blocked by built-in static firewall</span>
        </div>
      </div>

      <div className="trust-sections-grid">
        <div className="trust-card">
          <h3 className="card-heading">Vernacular & Voice Settings</h3>
          <p className="card-subtext">Control audio feedback and on-device transcription options.</p>

          <div className="settings-list">
            <Toggle
              id="bhashini-tts"
              checked={bhashiniTts}
              onChange={setBhashiniTts}
              disabled={true}
              label={t(L.bhashiniTtsLabel, lang)}
              sublabel="Offline pre-recorded Hindi & Marathi phrases (Enabled in Phase 4)"
            />

            <Toggle
              id="voice-input"
              checked={voiceInput}
              onChange={setVoiceInput}
              disabled={false}
              label={t(L.voiceInputLabel, lang)}
              sublabel="Optional speech-to-text; voice processing handled by your browser"
            />
          </div>
        </div>

        <div className="trust-card">
          <h3 className="card-heading">{t(L.sampleLogs, lang)}</h3>
          <p className="card-subtext">Load verified behavioural datasets without typing.</p>

          <div className="sample-btn-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onLoadSampleLog('ramesh')}
            >
              📊 Ramesh (3 Losses + Escalation)
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onLoadSampleLog('calm')}
            >
              🧘 Calm Disciplined Trader
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onLoadSampleLog('nightowl')}
            >
              🦉 Night-Owl Impulse Trader
            </button>
          </div>
        </div>

        <div className="trust-card">
          <h3 className="card-heading">Data Sovereignty & Controls</h3>
          <p className="card-subtext">You have absolute control over your local encrypted vault.</p>

          <div className="data-controls">
            <div className="csv-import-box">
              <label className="btn btn-outline file-input-label">
                📂 {t(L.importCsvBtn, lang)}
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImportCsv(file);
                  }}
                />
              </label>
              <span className="micro-text">Supports Zerodha/Groww trade history format</span>
            </div>

            <button
              type="button"
              className="btn btn-danger"
              onClick={onWipeData}
            >
              ⚠️ {t(L.wipeDataBtn, lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
