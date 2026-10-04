import React from 'react';
import { L, t } from '../i18n.js';

export default function Navbar({ activeTab, setActiveTab, lang, journalCount }) {
  const tabs = [
    { id: 'practice', label: t(L.practiceTab, lang), icon: '📊' },
    { id: 'journal', label: t(L.journalTab, lang), icon: '📓', badge: journalCount },
    { id: 'insights', label: t(L.insightsTab, lang), icon: '📈' },
    { id: 'trust', label: t(L.trustTab, lang), icon: '🛡️' }
  ];

  return (
    <nav className="tab-nav">
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-text">{tab.label}</span>
            {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
