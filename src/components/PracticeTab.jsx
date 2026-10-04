import React from 'react';
import { L, SRC, WHY, HZ, t } from '../i18n';

const NAMES = {
  A: 'Practice Index A',
  B: 'Practice Index B',
  C: 'Practice Index C'
};

const spark = v => {
  const a = Math.min(...v), b = Math.max(...v), d = b - a || 1;
  return v.map((y, i) => `${i * 4},${30 - (y - a) / d * 28}`).join(' ');
};

export const PracticeTab = ({ lang, cap, demo, f, setF, px, place, msg }) => {
  const T_ = (obj, val) => t(obj, lang, val);

  const renderChips = (optionsObj, key) => (
    <div className="chips" role="group">
      {Object.keys(optionsObj).map(x => (
        <button
          key={x}
          className={f[key] === x ? 'on' : 'ghost'}
          onClick={() => setF({ ...f, [key]: x })}
          aria-pressed={f[key] === x}
        >
          {T_(optionsObj[x])}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <p className="mut">{T_(L.practice)}</p>
      
      <div className="card">
        <div className="bar">
          <b>{T_(L.cap)}: ₹{cap.toLocaleString('en-IN')}</b>
          <button className="ghost" onClick={demo}>
            {T_(L.demo)}
          </button>
        </div>

        {/* Instruments selector */}
        <div className="inst" role="group">
          {Object.keys(NAMES).map(k => (
            <button
              key={k}
              className={f.inst === k ? 'on' : 'ghost'}
              onClick={() => setF({ ...f, inst: k })}
              aria-pressed={f.inst === k}
            >
              <span>{NAMES[k]}</span>
              <b>{px[k][px[k].length - 1]}</b>
              <svg viewBox="0 0 156 32" aria-hidden="true">
                <polyline points={spark(px[k])} fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          ))}
        </div>

        {/* Order Side */}
        <div className="chips side" role="group">
          {['buy', 'sell'].map(s => (
            <button
              key={s}
              className={f.side === s ? 'on' : 'ghost'}
              onClick={() => setF({ ...f, side: s })}
              aria-pressed={f.side === s}
            >
              {T_(L[s + 'S'])}
            </button>
          ))}
        </div>

        {/* Size and Leverage */}
        <div className="row">
          <div>
            <label htmlFor="s">{T_(L.size)}</label>
            <input
              id="s"
              type="number"
              value={f.size}
              onChange={e => setF({ ...f, size: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="l">{T_(L.lev)}: {f.lev}x</label>
            <input
              id="l"
              type="range"
              min="1"
              max="20"
              value={f.lev}
              onChange={e => setF({ ...f, lev: e.target.value })}
            />
          </div>
        </div>

        <label>{T_(L.src)}</label>
        {renderChips(SRC, 'src')}

        <label>{T_(L.why)}</label>
        {renderChips(WHY, 'why')}

        <label>{T_(L.hz)}</label>
        {renderChips(HZ, 'hz')}

        <button className="go" onClick={place}>
          {T_(L.place2)}
        </button>
        
        {msg && <p role="status" className="mut" style={{ marginTop: '10px' }}>{msg}</p>}
      </div>
    </>
  );
};
