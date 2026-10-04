/**
 * src/data.js - Zero-backend static asset loader and privacy firewall
 * 
 * Rules:
 * - 100% in-browser, no telemetry, no tracking.
 * - getStatic(path) is the ONLY place that initiates fetch.
 * - Strict allow-list: config/thresholds.json, data/*.csv, model/anomaly.int8.json, tts/**
 * - Counts: own (same-origin static), external (must stay 0), unexpected (must stay 0).
 */

const ALLOWED_PATTERNS = [
  /^config\/thresholds\.json$/,
  /^data\/[a-zA-Z0-9_\-]+\.csv$/,
  /^model\/anomaly\.int8\.json$/,
  /^tts\/[a-zA-Z0-9_\-\/]+\.wav$/
];

const counters = {
  own: 0,
  external: 0,
  unexpected: 0,
  history: []
};

const listeners = new Set();

function notify() {
  const snapshot = { ...counters, history: [...counters.history] };
  for (const listener of listeners) {
    try {
      listener(snapshot);
    } catch {
      // ignore listener errors
    }
  }
}

export function getCounters() {
  return { ...counters, history: [...counters.history] };
}

export function subscribeCounters(fn) {
  listeners.add(fn);
  fn(getCounters());
  return () => listeners.delete(fn);
}

export function recordNetworkEvent(category, url) {
  if (category === 'own') counters.own++;
  else if (category === 'external') counters.external++;
  else counters.unexpected++;

  counters.history.push({
    category,
    url: String(url),
    timestamp: Date.now()
  });

  notify();
}

export function isAllowedPath(cleanPath) {
  return ALLOWED_PATTERNS.some(regex => regex.test(cleanPath));
}

/**
 * Fetch a static asset within 1 second timeout.
 * Rejects if path is external or not in allow-list.
 */
export async function getStatic(path) {
  // Normalize path
  const cleanPath = String(path).replace(/^\.?\//, '').trim();

  // Guard against any external URL
  if (/^https?:\/\//i.test(path)) {
    recordNetworkEvent('external', path);
    throw new Error(`[Privacy Firewall] External network call blocked: ${path}`);
  }

  // Check allow-list
  if (!isAllowedPath(cleanPath)) {
    recordNetworkEvent('unexpected', path);
    throw new Error(`[Privacy Firewall] Path not in static allow-list: ${path}`);
  }

  // Same-origin static fetch with 1-second timeout
  recordNetworkEvent('own', cleanPath);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000);

  try {
    // Resolve relative to current base
    const url = new URL(cleanPath, window.location?.href || 'http://localhost/').href;
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'default'
    });

    if (!response.ok) {
      throw new Error(`Failed to load ${cleanPath}: status ${response.status}`);
    }

    if (cleanPath.endsWith('.json')) {
      return await response.json();
    }
    if (cleanPath.endsWith('.csv')) {
      return await response.text();
    }
    if (cleanPath.endsWith('.wav')) {
      return await response.blob();
    }
    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}
