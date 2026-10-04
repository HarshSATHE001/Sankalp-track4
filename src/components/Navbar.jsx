import React from 'react';
import { L, t } from '../i18n';

const ICONS = ['📈', '📓', '📊', '🛡️'];

export const Navbar = ({ tab, setTab, lang }) => {
  const T_ = (obj, val) => t(obj, lang, val);

  return (
    <nav className="nav" aria-label="Main Navigation">
      {T_(L.tabsN).split('|').map((x, i) => (
        <button
          key={i}
          className={tab === i ? 'on' : ''}
          onClick={() => setTab(i)}
          aria-current={tab === i}
        >
          <span aria-hidden="true">{ICONS[i]}</span>
          {x}
        </button>
      ))}
    </nav>
  );
};
