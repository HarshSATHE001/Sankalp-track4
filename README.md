# SANKALP (संकल्प) — Investor Resilience Engine
**SANGYAN Hackathon — Track D: Investor Resilience & Protection**

SANKALP is a privacy-first, zero-runtime-backend Progressive Web Application (PWA) designed to protect retail investors and traders from impulsive, revenge, and FOMO trading behaviors through deterministic guardrails, encrypted local journaling, and in-browser anomaly detection.

---

## 🌟 Core Highlights

- **100% In-Browser & Zero-Backend**: All trading evaluations, lockouts, encrypted storage, and anomaly scoring occur locally. No financial data, trades, P&L, PINs, or reasons ever leave the user's browser.
- **Rules Override ML**: Safety lockouts are strictly governed by transparent, deterministic behavioral rules (`score >= 2`). Machine learning is purely advisory and only issues subtle nudges—it never locks or unlocks accounts.
- **Zero Financial Advice**: SANKALP does not provide buy/sell signals, target prices, or outcome predictions. Market patterns are flagged neutrally to promote deliberate decision-making.
- **Multilingual Support**: Fully localized in English, Hindi (हिन्दी), and Marathi (मराठी), including offline-ready localized voice alerts.
- **Encrypted Vault**: Trade journal and lock history are encrypted client-side using PBKDF2 (150,000 iterations) and AES-GCM 256-bit encryption.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- npm >= 9.0.0

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/HarshSATHE001/Sankalp-track4.git
cd Sankalp-track4

# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Run full test suite (Engine + Data + Vault + Guardrail validation)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Synthetic Data & Machine Learning Scripts

```bash
# Generate synthetic trader profiles & sample CSV logs
npm run gen

# Train in-browser anomaly detection model (outputs int8 weights to public/model/)
npm run train

# Pre-generate Bhashini TTS audio assets (dev only, requires credentials in .env)
npm run warm-tts
```

---

## 🛡️ Architecture & Guardrails

```
                    ┌──────────────────────────────────────────────┐
                    │               SANKALP PWA                    │
                    │   (Vite + React, Vanilla CSS, Zero-Backend)   │
                    └───────┬──────────────────────────────┬───────┘
                            │                              │
             ┌──────────────▼─────────────┐ ┌──────────────▼─────────────┐
             │    Deterministic Engine    │ │   Encrypted Storage Vault   │
             │   (streak, sizing, cool)   │ │  (PBKDF2 150k + AES-GCM)   │
             └──────────────┬─────────────┘ └────────────────────────────┘
                            │
             ┌──────────────▼─────────────┐
             │   Int8 Anomaly Detector    │
             │    (Advisory Nudges Only)  │
             └────────────────────────────┘
```

1. **Deterministic Lock Mechanism**: Evaluates order frequency, leverage limits, streak losses, and late-night trading bursts.
2. **Cool-down Pause**: Enforces a temporary pause window before impulsive trades execute.
3. **Local Journal**: Prompts the trader to document reasons and emotional triggers during locked periods.

---

## 📋 Third-Party Disclosure & Limits

### Third-Party Disclosures
- **Frontend Framework**: React 18 & Vite
- **Voice Synthesis**: Standard Browser Web Speech API (opt-in) with fallback to pre-rendered static Bhashini audio assets.
- **Data & Network Requests**: Zero external telemetry or analytics. All static resources loaded from same-origin bundle.

### Honest Limits
- **Encrypted Local Storage**: SANKALP uses AES-GCM with PBKDF2 encrypted `localStorage`. While robust for client-side privacy, user PIN strength dictates key resilience.
- **Anomaly Detection Scope**: In-browser anomaly model is trained on synthetic behavioral archetypes and acts strictly as an early-warning nudge, not an absolute predictor.

---

## 📄 License
MIT License. Created for the SANGYAN Investor Resilience Hackathon.
