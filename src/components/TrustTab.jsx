import React from 'react';
import { L, t } from '../i18n';
import { PRESETS } from '../engine';
import { Toggle } from './Toggle';
import * as V from '../vault';

export const TrustTab = ({
  reqN,
  lang,
  sens,
  setSens,
  cool,
  setCool,
  big,
  setBig,
  web,
  setWeb,
  bh,
  setBh,
  ok,
  setOk,
  csv,
  db,
  up,
  put,
  setPin
}) => {
  const T_ = (obj, val) => t(obj, lang, val);

  return (
    <>
      <div className="card trust">
        <h2>{T_(L.zero, reqN)}</h2>
        <p className="mut">Counts fetch/XHR calls made by this app. Verify in your browser’s Network tab.</p>
        <p>{T_(L.priv)}</p>
      </div>

      <div className="card">
        <label>{T_(L.sens)}</label>
        <div className="chips">
          {Object.keys(PRESETS).map((k, i) => (
            <button
              key={k}
              className={sens === k ? 'on' : 'ghost'}
              onClick={() => setSens(k)}
              aria-pressed={sens === k}
            >
              {T_(L.sensO).split('|')[i]}
            </button>
          ))}
        </div>

        <label htmlFor="c">Cooling-off: {cool}s</label>
        <input
          id="c"
          type="range"
          min="10"
          max="600"
          step="10"
          value={cool}
          onChange={e => setCool(+e.target.value)}
        />

        <Toggle on={big} set={setBig}>
          {T_(L.big)}
        </Toggle>
      </div>

      <div className="card">
        <Toggle on={web} set={setWeb}>
          Voice via browser speech service (opt-in)
        </Toggle>
        <p className="mut">
          Sends audio to your browser vendor (e.g. Google in Chrome). Off by default. On-device speech (Whisper-tiny/Vosk) is not bundled in this build.
        </p>

        <Toggle on={bh} set={setBh} dis>
          Bhashini translation and spoken replies (opt-in)
        </Toggle>
        <p className="mut">
          Not connected: needs an API key. When enabled, only text (never audio) would be sent.
        </p>
      </div>

      <div className="card">
        <p className="mut">{T_(L.csv)}</p>
        <Toggle on={ok} set={setOk}>
          {T_(L.consent)}
        </Toggle>
        <input type="file" accept=".csv" disabled={!ok} onChange={csv} style={{ margin: '8px 0 16px' }} />

        <label htmlFor="g">{T_(L.goal)}</label>
        <input
          id="g"
          value={db.g?.name || ''}
          onChange={e => up(d => { d.g = { name: e.target.value, amt: d.g?.amt || 50000 }; })}
        />

        <label htmlFor="ga">{T_(L.goalAmt)}</label>
        <input
          id="ga"
          type="number"
          value={db.g?.amt || ''}
          onChange={e => up(d => { d.g = { name: d.g?.name || '', amt: +e.target.value || 1 }; })}
        />

        <button
          className="ghost"
          style={{ marginTop: '16px', color: '#dc2626', borderColor: '#fca5a5' }}
          onClick={() => {
            V.wipe();
            put(null);
            setPin('');
          }}
        >
          {T_(L.wipe)}
        </button>
      </div>
    </>
  );
};
