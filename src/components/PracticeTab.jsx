import React, { useState } from 'react';
import { SRC, WHY, HZ, L, t } from '../i18n.js';

export default function PracticeTab({
  vault,
  onPlaceOrder,
  onLoadRameshDemo,
  lang,
  marketPrices
}) {
  const [inst, setInst] = useState('NIFTY');
  const [side, setSide] = useState('buy');
  const [size, setSize] = useState('10000');
  const [lev, setLev] = useState('10');
  const [src, setSrc] = useState('tip');
  const [why, setWhy] = useState('recovery');
  const [hz, setHz] = useState('intraday');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder({
      inst,
      side,
      size: Number(size),
      lev: Number(lev),
      src,
      why,
      hz,
      time: Date.now()
    });
  };

  const capital = vault?.g?.amt || 50000;
  const recentTrades = (vault?.h || []).slice(-5).reverse();

  return (
    <div className="tab-pane practice-pane">
      <div className="practice-header-grid">
        <div className="stat-card">
          <span className="stat-label">Capital Guard</span>
          <span className="stat-value">₹{capital.toLocaleString()}</span>
          <span className="stat-sub">Protected by SANKALP</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Simulation Notice</span>
          <span className="stat-value highlight-blue">Live Sandbox</span>
          <span className="stat-sub">{t(L.simulatedNotice, lang)}</span>
        </div>
        <div className="stat-card demo-card">
          <span className="stat-label">Quick Demonstration</span>
          <button
            type="button"
            className="btn btn-demo-action"
            onClick={onLoadRameshDemo}
          >
            ⚡ {t(L.rameshDemoBtn, lang)}
          </button>
          <span className="stat-sub">3 losses then 10x revenge trade</span>
        </div>
      </div>

      <div className="trading-layout">
        <div className="order-form-card">
          <h3 className="section-title">Practice Order Terminal</h3>
          <p className="section-subtitle">Simulate real trades through the behavioral safety engine.</p>

          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-row">
              <div className="form-group">
                <label className="field-label">Instrument</label>
                <select
                  className="form-select"
                  value={inst}
                  onChange={(e) => setInst(e.target.value)}
                >
                  <option value="NIFTY">NIFTY 50</option>
                  <option value="BANKNIFTY">BANK NIFTY</option>
                  <option value="RELIANCE">RELIANCE</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Side</label>
                <div className="btn-group-toggle">
                  <button
                    type="button"
                    className={`btn-toggle ${side === 'buy' ? 'active-buy' : ''}`}
                    onClick={() => setSide('buy')}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    className={`btn-toggle ${side === 'sell' ? 'active-sell' : ''}`}
                    onClick={() => setSide('sell')}
                  >
                    SELL / SHORT
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">Position Size (₹)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  className="form-input"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label">Leverage ({lev}x)</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  className="form-range"
                  value={lev}
                  onChange={(e) => setLev(e.target.value)}
                />
                <div className="range-marks">
                  <span>1x (Cash)</span>
                  <span>10x</span>
                  <span>20x (Max)</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="field-label">Trade Source</label>
                <select
                  className="form-select"
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                >
                  {Object.entries(SRC).map(([k, v]) => (
                    <option key={k} value={k}>{t(v, lang)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Primary Motivation</label>
                <select
                  className="form-select"
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                >
                  {Object.entries(WHY).map(([k, v]) => (
                    <option key={k} value={k}>{t(v, lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Planned Time Horizon</label>
              <select
                className="form-select"
                value={hz}
                onChange={(e) => setHz(e.target.value)}
              >
                {Object.entries(HZ).map(([k, v]) => (
                  <option key={k} value={k}>{t(v, lang)}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-submit-order">
              🚀 {t(L.placeOrder, lang)}
            </button>
          </form>
        </div>

        <div className="recent-history-card">
          <h3 className="section-title">Recent Session Trades</h3>
          <p className="section-subtitle">Real-time telemetry tracked locally in vault.</p>

          {recentTrades.length === 0 ? (
            <div className="empty-state">
              <span>No trades placed yet. Use the terminal or run Ramesh Demo.</span>
            </div>
          ) : (
            <div className="trades-table-wrapper">
              <table className="trades-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Size</th>
                    <th>Lev</th>
                    <th>Source</th>
                    <th>Result (P&L)</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((tr, idx) => (
                    <tr key={idx}>
                      <td>{new Date(tr.t).toLocaleTimeString()}</td>
                      <td>₹{Number(tr.size || 0).toLocaleString()}</td>
                      <td>{tr.lev}x</td>
                      <td><span className="badge-src">{tr.src}</span></td>
                      <td className={tr.pnl >= 0 ? 'pnl-green' : 'pnl-red'}>
                        {tr.pnl >= 0 ? `+₹${tr.pnl}` : `-₹${Math.abs(tr.pnl)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
