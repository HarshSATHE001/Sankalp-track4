import React, { useState } from 'react';
import { L, t } from '../i18n.js';

export default function GateScreen({ lang, onUnlock, onLoadDemo, error, isBusy }) {
  const [pin, setPin] = useState('1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length >= 4) {
      onUnlock(pin);
    }
  };

  return (
    <div className="gate-container">
      <div className="gate-card">
        <div className="gate-shield-icon">🛡️</div>
        <h2 className="gate-title">{t(L.pinTitle, lang)}</h2>
        <p className="gate-subtitle">{t(L.pinSub, lang)}</p>

        {error && <div className="alert-box alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="gate-form">
          <div className="input-group">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              className="pin-input"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={pin.length < 4 || isBusy}
          >
            {isBusy ? 'Verifying Key...' : t(L.unlockBtn, lang)}
          </button>
        </form>

        <div className="gate-divider">
          <span>OR QUICK DEMO</span>
        </div>

        <button
          type="button"
          className="btn btn-demo btn-block"
          onClick={onLoadDemo}
        >
          🚀 {t(L.rameshDemoBtn, lang)}
        </button>

        <div className="gate-footer-note">
          <p className="privacy-badge">🔒 100% In-Browser Privacy</p>
          <p className="micro-text">
            No accounts, no OTP, no telemetry. Data lives purely in encrypted local storage.
          </p>
        </div>
      </div>
    </div>
  );
}
