import React from 'react';
import { L, RS, SRC, t } from '../i18n';
import { submitOrder } from '../engine';

export const LockModal = ({ lock, lang, note, setNote, msg, setMsg, mic, end, goal, history }) => {
  const T_ = (obj, val) => t(obj, lang, val);

  return (
    <div className="veil" role="alertdialog" aria-modal="true" aria-live="assertive">
      <div className="inner">
        <h2>{T_(L.lockT)}</h2>
        
        <div className="ring" aria-hidden="true">
          {lock.left > 0 ? lock.left : '✓'}
        </div>
        
        <p className="mut2">{T_(L.breathe)}</p>
        <p>{T_(L.lockM)}</p>
        
        <p><b>{T_(L.poss)}</b></p>
        <ul>
          {lock.r.reasons.map((r, i) => (
            <li key={i}>
              {T_(RS[r.k], r.k === 'src' ? T_(SRC[r.v]) : r.v)}
            </li>
          ))}
        </ul>

        {goal?.name && (
          <p>
            {T_(L.goalOf, (lock.o.size / goal.amt * 100).toFixed(1))} ({goal.name})
          </p>
        )}

        {lock.left > 0 ? (
          <p><b>{T_(L.wait, lock.left)}</b></p>
        ) : (
          <>
            <label htmlFor="n">{T_(L.say)}</label>
            <textarea 
              id="n" 
              rows="3" 
              value={note} 
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. I am entering this trade to follow my planned strategy..."
            />
            
            <button className="ghost" onClick={mic}>
              {T_(L.mic)}
            </button>
            {msg && <span className="mut2"> {msg}</span>}
            
            <div style={{ marginTop: '14px' }}>
              <button className="go" disabled={!note.trim()} onClick={() => end('save')}>
                {T_(L.save)}
              </button>
              <button className="ghost" onClick={() => end('skip')}>
                {T_(L.exitNo)}
              </button>
            </div>
          </>
        )}

        <div style={{ marginTop: '14px' }}>
          <button className="ghost" onClick={() => end('cancel')}>
            {T_(L.cancel)}
          </button>
          <button className="ghost" onClick={() => end('fp')}>
            {T_(L.falseLock)}
          </button>
        </div>

        <button 
          className="link" 
          onClick={() => {
            try {
              submitOrder(lock.o, history);
            } catch (e) {
              setMsg(e.message + ' — request blocked');
            }
          }}
        >
          {T_(L.bypass)}
        </button>
      </div>
    </div>
  );
};
