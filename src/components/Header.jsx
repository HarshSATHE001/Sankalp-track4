import React from 'react';
import { L, t } from '../i18n';

const LANGUAGES = [
  ['en', 'English'],
  ['hi', 'हिन्दी'],
  ['mr', 'मराठी']
];

export const Header = ({ lang, setLang }) => {
  const T_ = (obj, val) => t(obj, lang, val);

  return (
    <header className="bar">
      <div>
        <h1>SANKALP</h1>
        <div className="tag">{T_(L.app)}</div>
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
    </header>
  );
};
