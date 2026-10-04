/**
 * src/engine.js - SANKALP Deterministic Behavioral Safety Engine
 * 
 * Guardrail 2: Rules override ML.
 * evaluate() sets lock from the rule score ONLY (score >= 2).
 * A model may only set nudge. It NEVER locks or unlocks.
 */

export const PRESETS = {
  default: {
    name: 'Default SEBI Investor Resilience Baseline',
    streak: 3,
    maxLev: 10,
    cool: 60,
    lateNight: [23, 5],
    sizeZ: 2.0
  },
  strict: {
    name: 'Conservative High-Friction Shield',
    streak: 2,
    maxLev: 5,
    cool: 120,
    lateNight: [22, 6],
    sizeZ: 1.5
  },
  relaxed: {
    name: 'Experienced Investor Mode',
    streak: 4,
    maxLev: 15,
    cool: 30,
    lateNight: [23, 5],
    sizeZ: 2.5
  }
};

export const T = { ...PRESETS.default };

let circuitLocked = false;

export function setLocked(val) {
  circuitLocked = Boolean(val);
}

export function isLocked() {
  return circuitLocked;
}

/**
 * Evaluates an order against historical trades and safety thresholds.
 * @returns {{ lock: boolean, reasons: Array<{k: string, v: any}>, score: number, nudge: boolean, z: number }}
 */
export function evaluate(o, h = [], cap = 50000, now = Date.now(), th = T) {
  const activeTh = { ...T, ...(th || {}) };
  const reasons = [];
  let score = 0;

  // 1. Loss streak check
  let currentStreak = 0;
  for (let i = h.length - 1; i >= 0; i--) {
    const trade = h[i];
    if (typeof trade.pnl === 'number') {
      if (trade.pnl < 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  if (currentStreak >= activeTh.streak) {
    score += 1;
    reasons.push({ k: 'streak', v: currentStreak });
  }

  // 2. High leverage check
  const lev = Number(o.lev || 1);
  if (lev >= activeTh.maxLev) {
    score += 1;
    reasons.push({ k: 'lev', v: lev });
  }

  // 3. Size escalation & z-score
  let z = 0;
  const size = Number(o.size || 0);
  if (h.length >= 2) {
    const sizes = h.map(t => Number(t.size || 0)).filter(s => s > 0);
    if (sizes.length >= 2) {
      const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
      const variance = sizes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sizes.length;
      const std = Math.sqrt(variance);
      z = std > 0 ? (size - mean) / std : (size > mean * 1.5 ? 2.5 : 0);
    }
  } else if (h.length === 1) {
    const prevSize = Number(h[0].size || 0);
    if (prevSize > 0 && size >= prevSize * 2) {
      z = 2.5;
    }
  }

  const thresholdZ = Number(activeTh.sizeZ || 2.0);
  if (z >= thresholdZ) {
    score += 1;
    reasons.push({ k: 'size', v: Math.round(z * 10) / 10 });
  }

  // 4. Late night trading window (e.g. 23:00 to 05:00)
  const orderDate = new Date(now);
  const hour = orderDate.getHours();
  const [nightStart, nightEnd] = activeTh.lateNight || [23, 5];
  const isNight = nightStart > nightEnd 
    ? (hour >= nightStart || hour < nightEnd)
    : (hour >= nightStart && hour < nightEnd);

  if (isNight) {
    score += 1;
    reasons.push({ k: 'night', v: hour });
  }

  // 5. Risky external source (social tip / FOMO)
  const src = String(o.src || '').toLowerCase();
  if (src === 'tip' || src === 'social' || src === 'telegram') {
    score += 1;
    reasons.push({ k: 'src', v: src });
  }

  // Rule Guardrail: Lock triggers ONLY from rule score >= 2
  const lock = score >= 2;

  // Nudge is an informational alert when risk is emerging
  const nudge = z >= thresholdZ || score === 1;

  return {
    lock,
    reasons,
    score,
    nudge,
    z: Math.round(z * 100) / 100
  };
}

/**
 * Attempts to submit an order through the behavioral circuit breaker.
 */
export function submitOrder(o, h = [], cap = 50000, now = Date.now(), th = T) {
  if (isLocked()) {
    return {
      accepted: false,
      locked: true,
      error: 'Circuit-breaker active. Please complete reflective pause.'
    };
  }

  const evaluation = evaluate(o, h, cap, now, th);

  if (evaluation.lock) {
    setLocked(true);
    return {
      accepted: false,
      locked: true,
      evaluation
    };
  }

  return {
    accepted: true,
    locked: false,
    evaluation
  };
}

/**
 * Replay Lab: Deterministically simulates SANKALP against historical trade log.
 */
export function replay(history = [], th = T) {
  let locksTriggered = 0;
  let lossPrevented = 0;
  let simulatedStreak = 0;
  const events = [];

  for (let i = 0; i < history.length; i++) {
    const trade = history[i];
    const prevHistory = history.slice(0, i);
    const orderSpec = {
      size: trade.size,
      lev: trade.lev,
      src: trade.src || 'manual'
    };

    const ev = evaluate(orderSpec, prevHistory, 50000, trade.t || Date.now(), th);
    if (ev.lock) {
      locksTriggered++;
      // If the trade in reality lost money, SANKALP would have paused/saved that loss
      if (trade.pnl < 0) {
        lossPrevented += Math.abs(trade.pnl);
      }
      events.push({
        index: i,
        trade,
        evaluation: ev
      });
    }
  }

  return {
    totalTrades: history.length,
    locksTriggered,
    lossPrevented,
    events
  };
}
