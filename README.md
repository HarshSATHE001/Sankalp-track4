# SANKALP — Pause. Reflect. Decide. (Track D, SANGYAN Hackathon)

**Privacy-first, web-based behavioural circuit-breaker for retail investors.**

> **Solution in one line:** A progressive web app (PWA) that watches trading behaviour locally in the browser, locks the next action when risk patterns appear, asks the user to speak their reasoning in their own language (Hindi, Marathi, English), then unlocks. All data stays on the device.

---

## 🎯 Problem Statement (Track D)

**Intercepting the emotional trading loop in Bharat's retail investors.**

9 in 10 individual F&O traders make net losses, driven by fear, greed, FOMO, herd behaviour and revenge trading, and often funded by instant loans or emergency savings. First-time investors from Tier-2 and Tier-3 cities face English-heavy interfaces and have no regional-language tool that encourages a pause. Trading systems optimise for frictionless execution. There is no privacy-first, on-device public-good layer that detects erratic behaviour (loss-chasing, late-night activity) and enforces a reflective pause without harvesting sensitive financial records.

---

## 🛡️ Hard Rules & Disqualification Guarantees

1. **No stock tips**, buy/sell/hold signals, price predictions, or product promotion.
2. **No monetisation**, ads, or upsells.
3. **No SMS, OTP, or PII collection**, and zero backend storing user data.
4. **Alerts strictly state "possible pattern"** with explanations, never "you will lose".

---

## 🚀 Combined Feature Set (Web Architecture)

| # | Feature | What it does | Architecture |
|---|---|---|---|
| **1** | **Behavioural stream processor** | Event hooks collect trades, P&L, leverage, and timestamps in memory. Statistical anomaly score ($z$-score of order size) flags unusual patterns. | On-device engine |
| **2** | **Hardcoded safety engine** | Rules: consecutive loss $\ge 3$, cumulative loss $> 5\%$, leverage $> 5\text{x}$, size escalation after a loss, trade bursts in $30\text{ min}$, late-night trading ($11\text{ PM} - 5\text{ AM}$). Rules strictly override ML/anomaly signals. | `src/engine.js` |
| **3** | **UI circuit-breaker** | `IS_LOCKED = true` disables order placement, blocks request execution, and displays a cooling-off timer with a calm breathing animation. Delays action and never permanently blocks. | UI Veil & Engine |
| **4** | **Vernacular voice reflection** | User speaks or types why they are trading and their horizon in Hindi, Marathi, or English. Transcribed locally with speech synthesis fallback. | Web Speech / Typing |
| **5** | **Bhashini layer note** | Architecture ready for opt-in regional translation & spoken prompts where only text (never raw audio) is sent upon user consent. | Opt-in regional i18n |
| **6** | **Encrypted decision log** | Web Crypto API (PBKDF2 key derivation from user PIN $\to$ AES-GCM 256-bit encryption). Unlock only after the entry is saved on-device. | `src/vault.js` |
| **7** | **Practice trading screen + CSV import** | Simulated practice instruments with leverage controls, money source selector (savings/emergency/loan), and consented CSV log import. | Practice Demo |
| **8** | **Weekly pattern summary** | "Your calm-down report": total pauses triggered, reflection completion $\%$, late-night trade counts, cancelled orders. Zero financial advice. | Insights Tab |
| **9** | **Trust panel** | Live **"0 server requests"** counter intercepting `fetch`/`XHR`, proof of zero data harvesting. | Trust Tab |
| **10** | **Developer sensitivity & controls** | Presets (gentle, balanced, strict), custom cooling-off duration, false-lock feedback, test force-bypass toggle. | Settings |

---

## 🎬 3–5 Minute Video Demo Flow

1. **Load Practice Mode**: Click **"Load Ramesh demo (3 losses)"** to simulate a 24-year-old trader who just suffered 3 losses.
2. **Attempt Impulsive Order**: The form auto-populates with a larger leveraged trade ($\text{₹}15,000$ at $10\text{x}$ leverage funded by a loan). Click **"Place practice order"**.
3. **Circuit-Breaker Lock**: The Safety Engine flags loss-chasing, leverage, and size escalation. The UI locks, displays a calm message in Marathi/Hindi/English with a 60-second breathing timer.
4. **Vernacular Reflection**: The user speaks or writes their reason in Marathi ("घाटा वसूलना / loss recovery").
5. **Unlock & Save**: The reflection is saved encrypted to the local Web Crypto vault, `IS_LOCKED` resets to `false`, and the trade completes.
6. **Verify Privacy**: Switch to the **Trust** tab or open the browser's Network tab to demonstrate **0 data requests made**.

---

## 📊 Measures for Impact (Pitch Deck Metrics)

- **Time to lock**: $\sim 0\text{ ms}$ (instant on-device rule evaluation).
- **Reflection completion**: Tracked live in the Insights tab (e.g. $\% \text{ of locks with saved reason}$).
- **Trades per session impact**: Replay Lab demonstrates a reduction in impulsive net P&L loss ($\text{₹}-10,900 \to \text{₹}-1,400$) by assumptions of user pause & cancelation.

---

## 💻 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at:
http://localhost:5173
```

---

## 🛠️ Stack Summary

- **Frontend**: React 18 + Vite, CSS custom properties, Accessible i18n (English, Hindi, Marathi), Large-text mode.
- **Offline / PWA**: Web Service Worker (`sw.js`) + Manifest.
- **Crypto & Vault**: PBKDF2 (150,000 iterations) + AES-GCM 256 via browser `crypto.subtle`.
- **Zero Third-Party Network Calls**: Intercepts `window.fetch` and `XMLHttpRequest` to audit and guarantee 0 data egress.
