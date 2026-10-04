import React, { useState } from 'react';
import { replay, T } from '../engine.js';
import { L, t } from '../i18n.js';

export default function InsightsTab({ vault, lang }) {
  const [replayResult, setReplayResult] = useState(null);

  const metrics = vault?.m || { locks: 0, cancel: 0, proceed: 0, jl: 0 };
  const history = vault?.h || [];

  const handleRunReplay = () => {
    const result = replay(history, T);
    setReplayResult(result);
  };

  const totalTrades = history.length;
  const netPnl = history.reduce((acc, tr) => acc + (tr.pnl || 0), 0);
  const lossTrades = history.filter(tr => (tr.pnl || 0) < 0).length;

  return (
    <div className="tab-pane insights-pane">
      <div className="insights-header">
        <h2 className="section-title">{t(L.insightsTab, lang)}</h2>
        <p className="section-subtitle">{t(L.patternsNotice, lang)}</p>
      </div>

      <div className="metrics-grid">
        <div className="stat-card">
          <span className="stat-label">Total Circuit Pauses</span>
          <span className="stat-value">{metrics.locks || 0}</span>
          <span className="stat-sub">High-risk momentum interruptions</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Reflective Cancellations</span>
          <span className="stat-value highlight-green">{metrics.cancel || 0}</span>
          <span className="stat-sub">Trades stepped back during cool-down</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Reflections Logged</span>
          <span className="stat-value highlight-blue">{metrics.jl || (vault?.j || []).length}</span>
          <span className="stat-sub">Vernacular voice/text entries</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Recorded Trades</span>
          <span className="stat-value">{totalTrades}</span>
          <span className="stat-sub">Net session P&L: ₹{netPnl.toLocaleString()}</span>
        </div>
      </div>

      <div className="replay-lab-section">
        <div className="card replay-card">
          <div className="replay-header">
            <div>
              <h3 className="section-title">Replay Lab (Simulation Engine)</h3>
              <p className="section-subtitle">
                Replay your historical trade log against SANKALP's deterministic circuit-breaker rules to see risk mitigation in action.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRunReplay}
              disabled={history.length === 0}
            >
              🔄 Run Replay Simulation
            </button>
          </div>

          {replayResult ? (
            <div className="replay-results-box">
              <div className="replay-stats-grid">
                <div className="stat-box">
                  <span className="stat-num">{replayResult.totalTrades}</span>
                  <span className="stat-desc">Trades Analyzed</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num highlight-yellow">{replayResult.locksTriggered}</span>
                  <span className="stat-desc">Circuit Pauses Identified</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num highlight-green">₹{replayResult.lossPrevented.toLocaleString()}</span>
                  <span className="stat-desc">Impulsive Loss Shielded</span>
                </div>
              </div>

              {replayResult.events.length > 0 && (
                <div className="replay-events-table">
                  <h4>Identified Interception Points:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Trade #</th>
                        <th>Size</th>
                        <th>Lev</th>
                        <th>P&L</th>
                        <th>Triggered Rules</th>
                      </tr>
                    </thead>
                    <tbody>
                      {replayResult.events.map((ev, i) => (
                        <tr key={i}>
                          <td>#{ev.index + 1}</td>
                          <td>₹{ev.trade.size}</td>
                          <td>{ev.trade.lev}x</td>
                          <td className={ev.trade.pnl < 0 ? 'pnl-red' : 'pnl-green'}>
                            ₹{ev.trade.pnl}
                          </td>
                          <td>
                            {ev.evaluation.reasons.map(r => r.k).join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="replay-placeholder">
              <span>Click "Run Replay Simulation" to evaluate your active history against the safety engine.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
