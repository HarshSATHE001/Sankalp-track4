import React, { useState } from 'react';
import { WHY, HZ, L, t } from '../i18n.js';

export default function JournalTab({ vault, lang }) {
  const [filterLockOnly, setFilterLockOnly] = useState(false);
  const journalEntries = vault?.j || [];

  const filtered = filterLockOnly
    ? journalEntries.filter(entry => entry.lock)
    : journalEntries;

  return (
    <div className="tab-pane journal-pane">
      <div className="journal-header">
        <div>
          <h2 className="section-title">{t(L.journalTab, lang)}</h2>
          <p className="section-subtitle">
            Your private voice & text decision records. Encrypted locally with PBKDF2 + AES-GCM.
          </p>
        </div>

        <div className="filter-controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filterLockOnly}
              onChange={(e) => setFilterLockOnly(e.target.checked)}
            />
            <span>Show Circuit-Breaker Pauses Only</span>
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">📓</div>
          <h3>No Journal Entries Yet</h3>
          <p>When you place trades or pause for reflection during a circuit-breaker, your thoughts are recorded here.</p>
        </div>
      ) : (
        <div className="journal-list">
          {filtered.slice().reverse().map((entry, idx) => (
            <div key={idx} className={`journal-card ${entry.lock ? 'lock-card' : ''}`}>
              <div className="card-top-bar">
                <div className="entry-meta">
                  <span className={`badge-side ${entry.side === 'buy' ? 'badge-buy' : 'badge-sell'}`}>
                    {entry.side?.toUpperCase()}
                  </span>
                  <span className="entry-inst">{entry.inst}</span>
                  <span className="entry-time">{new Date(entry.t).toLocaleString()}</span>
                </div>
                {entry.lock && (
                  <span className="badge-lock">🛑 Circuit-Breaker Active</span>
                )}
              </div>

              <div className="entry-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Motivation:</span>
                  <span className="detail-value">{entry.why ? t(WHY[entry.why], lang) : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Horizon:</span>
                  <span className="detail-value">{entry.hz ? t(HZ[entry.hz], lang) : 'N/A'}</span>
                </div>
              </div>

              {entry.note && (
                <div className="entry-reflection-quote">
                  <span className="quote-icon">💭</span>
                  <p className="quote-text">"{entry.note}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
