import React from 'react';
import { L, t } from '../i18n.js';

export default function Header({ lang, setLang, onLockVault, unlocked, networkCounters }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">
          <svg viewBox="0 0 100 100" className="logo-svg">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#0ea5e9" strokeWidth="6" />
            <path d="M50 24 v26 l18 12" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="brand-titles">
          <h1 className="brand-name">{t(L.appName, lang)}</h1>
          <p className="brand-tagline">{t(L.tagline, lang)}</p>
        </div>
      </div>

      <div className="header-controls">
        <div className="privacy-pill" title="Zero personal data leaves your device">
          <span className="dot pulse-green" />
          <span className="privacy-text">{t(L.zero, lang)}</span>
        </div>

        <div className="lang-switcher">
          <button
            type="button"
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
            onClick={() => setLang('hi')}
          >
            हिन्दी
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
            onClick={() => setLang('mr')}
          >
            मराठी
          </button>
        </div>

        {unlocked && (
          <button
            type="button"
            className="btn btn-secondary lock-btn"
            onClick={onLockVault}
            title={t(L.lockNow, lang)}
          >
            🔒 {t(L.lockNow, lang)}
          </button>
        )}
      </div>
    </header>
  );
}
