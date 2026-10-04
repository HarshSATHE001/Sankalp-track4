import React, { useState, useEffect, useRef } from 'react';
import { PRESETS, evaluate, submitOrder, setLocked } from './engine';
import { L, t } from './i18n';
import * as V from './vault';

import { Header } from './components/Header';
import { GateScreen } from './components/GateScreen';
import { PracticeTab } from './components/PracticeTab';
import { JournalTab } from './components/JournalTab';
import { InsightsTab } from './components/InsightsTab';
import { TrustTab } from './components/TrustTab';
import { LockModal } from './components/LockModal';
import { Navbar } from './components/Navbar';

let reqN = 0;
{
  const origFetch = window.fetch;
  window.fetch = (...args) => {
    reqN++;
    return origFetch.apply(window, args);
  };
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    reqN++;
    return origSend.apply(this, args);
  };
}

const CAPITAL_DEFAULT = 100000;
const BCP47 = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

export default function App() {
  const [lang, setLang] = useState('mr');
  const [big, setBig] = useState(false);
  const [db, setDb] = useState(null);
  const dbRef = useRef(null);
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState(0);

  const [form, setForm] = useState({
    inst: 'A',
    side: 'buy',
    size: 5000,
    lev: 2,
    src: 'own',
    why: '',
    hz: 'weeks'
  });

  const [lock, setLock] = useState(null);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  const [sens, setSens] = useState('balanced');
  const [cool, setCool] = useState(60);
  const [web, setWeb] = useState(false);
  const [bh, setBh] = useState(false);
  const [raw, setRaw] = useState(false);
  const [last, setLast] = useState(null);

  const [prices, setPrices] = useState({ A: [100], B: [250], C: [50] });

  const TH = { ...PRESETS[sens], cool };
  const T_ = (obj, val) => t(obj, lang, val);

  const put = data => {
    dbRef.current = data;
    setDb(data);
  };

  const updateVault = async fn => {
    const d = structuredClone(dbRef.current);
    fn(d);
    put(d);
    await V.save(d);
  };

  useEffect(() => {
    document.documentElement.className = big ? 'big' : '';
  }, [big]);

  useEffect(() => {
    const id = setInterval(() => {
      setPrices(p =>
        Object.fromEntries(
          Object.entries(p).map(([k, v]) => [
            k,
            [
              ...v.slice(-39),
              +(v[v.length - 1] * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)
            ]
          ])
        )
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (lock && lock.left > 0) {
      const id = setTimeout(() => {
        setLock(l => ({ ...l, left: l.left - 1 }));
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [lock]);

  const speak = text => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = BCP47[lang];
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {}
  };

  const startMic = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!web || !SpeechRec) {
      setMsg(T_(L.voiceOff));
      return;
    }
    const r = new SpeechRec();
    r.lang = BCP47[lang];
    r.onresult = e => setNote(n => (n + ' ' + e.results[0][0].transcript).trim());
    r.onerror = () => setMsg(T_(L.voiceOff));
    r.start();
  };

  if (!db) {
    return (
      <GateScreen
        lang={lang}
        setLang={setLang}
        pin={pin}
        setPin={setPin}
        err={err}
        setErr={setErr}
        put={put}
      />
    );
  }

  const history = db.h;
  const currentCapital = CAPITAL_DEFAULT + history.reduce((a, x) => a + x.pnl, 0);

  const executeOrder = async (orderObj, journalNote) => {
    const pnl = Math.round(orderObj.size * orderObj.lev * (Math.random() - 0.5) * 0.04);
    let newHistory;
    try {
      newHistory = submitOrder({ ...orderObj, pnl }, dbRef.current.h);
    } catch (e) {
      setMsg(e.message);
      return;
    }

    await updateVault(d => {
      d.h = newHistory;
      d.j.push({
        t: orderObj.t,
        inst: orderObj.inst,
        side: orderObj.side,
        why: orderObj.why,
        hz: orderObj.hz,
        lock: journalNote != null,
        note: journalNote || ''
      });
    });
  };

  const placeOrder = () => {
    if (!form.why) {
      setMsg(T_(L.needwhy));
      return;
    }
    setMsg('');

    const orderObj = { ...form, size: +form.size, lev: +form.lev, t: Date.now() };
    const t0 = performance.now();
    const evaluation = evaluate(orderObj, history, currentCapital, orderObj.t, TH);
    const dt = Math.round(performance.now() - t0);

    setLast(evaluation);

    if (evaluation.lock) {
      setLocked(true);
      updateVault(d => {
        d.m.locks++;
        d.m.ms = [...(d.m.ms || []), dt];
      });
      setNote('');
      setLock({ o: orderObj, r: evaluation, left: TH.cool });
      speak(T_(L.lockM));
    } else {
      if (evaluation.nudge) {
        setMsg(T_(L.nudge));
      }
      executeOrder(orderObj);
    }
  };

  const endLock = async actionKey => {
    setLocked(false);
    const orderObj = lock.o;
    const currentNote = note;
    setLock(null);

    await updateVault(d => {
      if (actionKey === 'cancel') d.m.cancel++;
      else d.m.proceed++;

      if (actionKey === 'save') d.m.jl++;
      if (actionKey === 'fp') d.m.fl = (d.m.fl || 0) + 1;
    });

    if (actionKey === 'save') await executeOrder(orderObj, currentNote);
    if (actionKey === 'skip' || actionKey === 'fp') await executeOrder(orderObj, null);
  };

  const loadRameshDemo = async () => {
    const n = Date.now();
    await updateVault(d => {
      d.h = [-400, -700, -900].map((p, i) => ({
        t: n - (3 - i) * 3e5,
        size: 5000,
        lev: 2,
        pnl: p,
        src: 'own'
      }));
    });
    setForm({ ...form, size: 15000, lev: 10, src: 'loan', why: 'recover', hz: 'day' });
  };

  const handleCsvImport = async e => {
    const text = await e.target.files[0].text();
    const rows = text
      .trim()
      .split('\n')
      .slice(1)
      .map(l => l.split(','))
      .filter(c => c.length >= 5)
      .map(c => ({
        t: Date.parse(c[0]) || Date.now(),
        size: +c[2] || 0,
        lev: +c[3] || 1,
        pnl: +c[4] || 0,
        src: 'own'
      }));

    await updateVault(d => {
      d.h = [...d.h, ...rows];
    });
  };

  return (
    <>
      <main>
        <Header lang={lang} setLang={setLang} />

        {tab === 0 && (
          <PracticeTab
            lang={lang}
            cap={currentCapital}
            demo={loadRameshDemo}
            f={form}
            setF={setForm}
            px={prices}
            place={placeOrder}
            msg={msg}
          />
        )}

        {tab === 1 && (
          <JournalTab
            db={db}
            lang={lang}
            raw={raw}
            setRaw={setRaw}
          />
        )}

        {tab === 2 && (
          <InsightsTab
            db={db}
            lang={lang}
            last={last}
            TH={TH}
          />
        )}

        {tab === 3 && (
          <TrustTab
            reqN={reqN}
            lang={lang}
            sens={sens}
            setSens={setSens}
            cool={cool}
            setCool={setCool}
            big={big}
            setBig={setBig}
            web={web}
            setWeb={setWeb}
            bh={bh}
            setBh={setBh}
            ok={ok}
            setOk={setOk}
            csv={handleCsvImport}
            db={db}
            up={updateVault}
            put={put}
            setPin={setPin}
          />
        )}
      </main>

      <Navbar tab={tab} setTab={setTab} lang={lang} />

      {lock && (
        <LockModal
          lock={lock}
          lang={lang}
          note={note}
          setNote={setNote}
          msg={msg}
          setMsg={setMsg}
          mic={startMic}
          end={endLock}
          goal={db.g}
          history={history}
        />
      )}
    </>
  );
}
