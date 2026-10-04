import React, { useState, useEffect } from 'react';
import { L, RS, t } from '../i18n.js';

export default function LockModal({
  evaluation,
  order,
  lang,
  onCancel,
  onProceed,
  onSaveReflection,
  bhashiniTts,
  voiceInput,
  speak
}) {
  const [timer, setTimer] = useState(60);
  const [reasoning, setReasoning] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Speak calm message on lock
    if (speak) {
      speak(t(L.lockM, lang));
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVoiceRecord = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setReasoning((prev) => (prev ? prev + ' ' + transcript : transcript));
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSaveAndExit = () => {
    onSaveReflection(reasoning);
  };

  return (
    <div className="modal-backdrop">
      <div className="lock-modal-card">
        <div className="lock-header">
          <div className="lock-badge-icon">🛑</div>
          <div>
            <h2 className="lock-title">{t(L.circuitActive, lang)}</h2>
            <p className="lock-subtitle">{t(L.lockM, lang)}</p>
          </div>
        </div>

        <div className="timer-section">
          <div className="timer-ring">
            <span className="timer-number">{timer}s</span>
            <span className="timer-sub">{t(L.coolingDown, lang)}</span>
          </div>
        </div>

        <div className="lock-reasons-box">
          <h4 className="reasons-heading">Flagged Behavioral Patterns:</h4>
          <ul className="reasons-list">
            {evaluation?.reasons?.map((r, i) => (
              <li key={i} className="reason-item">
                <span className="reason-bullet">⚠️</span>
                <span>
                  <strong>{r.k.toUpperCase()}:</strong> {r.v} – {t(RS[r.k], lang)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reflection-form">
          <label className="field-label">
            {t(L.speakReason, lang)}:
          </label>
          <div className="textarea-wrapper">
            <textarea
              className="reflection-textarea"
              rows={3}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="e.g. Felt urgent to recover recent loss, but I should stick to my risk rules."
            />
          </div>

          <div className="voice-actions">
            <button
              type="button"
              className={`btn btn-secondary ${isRecording ? 'recording' : ''}`}
              onClick={handleVoiceRecord}
            >
              🎤 {isRecording ? t(L.stopRecord, lang) : t(L.recordAudio, lang)}
            </button>
            {reasoning.trim().length > 0 && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleSaveAndExit}
              >
                💾 {t(L.saveJournal, lang)}
              </button>
            )}
          </div>
        </div>

        <div className="lock-actions">
          <button
            type="button"
            className="btn btn-cancel-trade"
            onClick={onCancel}
          >
            🛡️ {t(L.cancelTrade, lang)}
          </button>

          <button
            type="button"
            className="btn btn-proceed"
            disabled={timer > 0}
            onClick={onProceed}
          >
            {timer > 0 ? `Wait ${timer}s to proceed` : t(L.proceedTrade, lang)}
          </button>
        </div>

        <div className="lock-footer-notice">
          <span>{t(L.patternsNotice, lang)}</span>
        </div>
      </div>
    </div>
  );
}
