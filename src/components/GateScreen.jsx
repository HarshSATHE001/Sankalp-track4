import React from 'react';
import { L, t } from '../i18n';
import * as V from '../vault';

const LANGUAGES = [
  ['en', 'English'],
  ['hi', 'हिन्दी'],
  ['mr', 'मराठी']
];

export const GateScreen = ({ lang, setLang, pin, setPin, err, setErr, put }) => {
  const T_ = (obj, val) => t(obj, lang, val);

  const handleUnlock = async () => {
    const data = await V.unlock(pin);
    if (data) {
      put(data);
    } else {
      setErr(true);
    }
  };

  return (
    <main className="gate">
      <h1>SANKALP</h1>
      <p className="tag">{T_(L.app)}</p>
      
      <div className="card">
        <label htmlFor="p">{T_(L.pin)}</label>
        <input
          id="p"
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="e.g. 1234"
        />
        <button
          disabled={pin.length < 4}
          onClick={handleUnlock}
          style={{ marginTop: '12px' }}
        >
          {T_(L.open)}
        </button>
        {err && <p role="alert" style={{ color: '#dc2626', marginTop: '8px' }}>{T_(L.badpin)}</p>}
      </div>

      <div className="lg">
        <select
          aria-label="Language"
          value={lang}
          onChange={e => setLang(e.target.value)}
        >
          {LANGUAGES.map(([k, n]) => (
            <option key={k} value={k}>{n}</option>
          ))}
        </select>
      </div>
    </main>
  );
};
