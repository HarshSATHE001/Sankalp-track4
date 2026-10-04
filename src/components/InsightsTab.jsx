import React from 'react';
import { L, t } from '../i18n';
import { replay } from '../engine';

export const InsightsTab = ({ db, lang, last, TH }) => {
  const T_ = (obj, val) => t(obj, lang, val);

  const h = db.h;
  const m = db.m;
  const ms = m.ms || [];
  const pct = m.locks ? Math.round(100 * m.jl / m.locks) : 0;
  const rp = replay();
  const late = h.filter(x => {
    const q = new Date(x.t).getHours();
    return q >= 23 || q < 5;
  }).length;

  const fired = k => last?.reasons.some(r => r.k === k);

  const RULES = [
    ['streak', `${TH.streak} losses in a row`],
    ['cum', `recent loss > ${TH.cumLoss}% of capital`],
    ['lev', `leverage > ${TH.maxLev}x`],
    ['size', `size > ${TH.sizeX}x average after a loss`],
    ['burst', `${TH.burstN}+ trades in ${TH.burstMin} min`],
    ['night', `11 PM – 5 AM`]
  ];

  return (
    <>
      <div className="card">
        <h2>{T_(L.report)}</h2>
        <div className="kpis">
          <div><b>{m.locks}</b>{T_(L.pauses)}</div>
          <div><b>{pct}%</b>{T_(L.refl)}</div>
          <div><b>{late}</b>{T_(L.late)}</div>
          <div><b>{m.cancel}</b>{T_(L.canc)}</div>
        </div>
        <p className="mut" style={{ marginTop: '10px' }}>{T_(L.noAdv)}</p>
      </div>

      <div className="card">
        <h2>Behaviour stream <small>(on-device)</small></h2>
        <div className="gauge">
          <i style={{ width: Math.min(100, Math.max(0, (last?.z || 0) / 3 * 100)) + '%' }} />
        </div>
        <p className="mut">
          Unusual-pattern score (z-score of size vs your history): {last?.z ?? '—'} {last?.nudge && '· unusual pattern'}. It only adds a notice; rules decide.
        </p>
        <table>
          <tbody>
            {h.slice(-6).reverse().map((x, i) => (
              <tr key={i}>
                <td>{new Date(x.t).toLocaleTimeString()}</td>
                <td>₹{x.size}</td>
                <td>{x.lev}x</td>
                <td className={x.pnl < 0 ? 'neg' : 'pos'}>{x.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Safety engine <small>(rules override ML)</small></h2>
        <ul className="rules">
          {RULES.map(([k, d]) => (
            <li key={k} className={fired(k) ? 'hit' : ''}>
              {fired(k) ? '⚠' : '✓'} {d}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Impact measures</h2>
        <table>
          <tbody>
            <tr>
              <td>Time to lock</td>
              <td>{ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length) : '—'} ms</td>
            </tr>
            <tr>
              <td>Locks followed by a reason</td>
              <td>{pct}%</td>
            </tr>
            <tr>
              <td>False-lock reports</td>
              <td>{m.fl || 0}</td>
            </tr>
            <tr>
              <td>Scripted session: orders executed</td>
              <td>{rp.n} without · {rp.n - rp.skip} with SANKALP</td>
            </tr>
            <tr>
              <td>Practice P&amp;L (₹)</td>
              <td>{rp.without} → {rp.withS}</td>
            </tr>
          </tbody>
        </table>
        <p className="mut" style={{ marginTop: '10px' }}>{T_(L.rep)}</p>
      </div>
    </>
  );
};
