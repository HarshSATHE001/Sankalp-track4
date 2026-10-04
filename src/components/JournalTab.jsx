import React from 'react';
import { L, WHY, HZ, t } from '../i18n';
import { Toggle } from './Toggle';

const NAMES = {
  A: 'Practice Index A',
  B: 'Practice Index B',
  C: 'Practice Index C'
};

export const JournalTab = ({ db, lang, raw, setRaw }) => {
  const T_ = (obj, val) => t(obj, lang, val);

  return (
    <div className="card">
      <h2>{T_(L.logT)}</h2>
      
      {!db.j.length && <p className="mut">{T_(L.empty)}</p>}
      
      <ul className="log">
        {db.j.slice().reverse().map((j, i) => (
          <li key={i} className={j.lock ? 'lk' : ''}>
            <b>{new Date(j.t).toLocaleTimeString()}</b> {j.lock ? '⏸ ' : ''}
            {NAMES[j.inst] || ''} · {T_(L[j.side + 'S'] || L.buyS)} · {T_(WHY[j.why] || WHY.other)} · {T_(HZ[j.hz] || HZ.weeks)}
            {j.note && <q>{j.note}</q>}
          </li>
        ))}
      </ul>

      <Toggle on={raw} set={setRaw}>
        {T_(L.raw)}
      </Toggle>
      
      {raw && (
        <code className="raw">
          {(localStorage.getItem('sk_log') || '').slice(0, 160)}…
        </code>
      )}
    </div>
  );
};
