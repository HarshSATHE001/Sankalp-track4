import React from 'react';

export default function Toggle({ id, checked, onChange, disabled, label, sublabel }) {
  return (
    <div className="toggle-wrapper">
      <div className="toggle-text">
        <label htmlFor={id} className="toggle-label">{label}</label>
        {sublabel && <span className="toggle-sublabel">{sublabel}</span>}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`toggle-btn ${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}
