/**
 * src/vault.js - Client-Side Encrypted Behavioral Vault
 * 
 * Guardrail 1: Zero data leaves browser.
 * Uses Web Crypto PBKDF2 (150,000 iterations) -> AES-GCM (256-bit).
 * Stored in localStorage keys: 'sk_salt' and 'sk_log'.
 */

export const EMPTY = {
  h: [],
  j: [],
  m: { locks: 0, cancel: 0, proceed: 0, jl: 0, ms: 0, fl: 0 },
  g: { name: 'Capital Guard', amt: 50000 }
};

// Fallback storage for Node environments or headless tests
const memStore = new Map();

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (k) => memStore.get(k) ?? null,
    setItem: (k, v) => memStore.set(k, String(v)),
    removeItem: (k) => memStore.delete(k),
    clear: () => memStore.clear()
  };
}

function getCrypto() {
  if (typeof crypto !== 'undefined') return crypto;
  throw new Error('Web Crypto API is required for SANKALP vault');
}

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

async function deriveKey(pin, saltBytes) {
  const webCrypto = getCrypto();
  const enc = new TextEncoder();
  const baseKey = await webCrypto.subtle.importKey(
    'raw',
    enc.encode(String(pin)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return webCrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 150000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Unlocks the vault using the user PIN.
 * If vault is not yet initialized, returns a clone of EMPTY.
 */
export async function unlock(pin) {
  if (!pin || String(pin).length < 4) {
    throw new Error('PIN must be at least 4 digits');
  }

  const storage = getStorage();
  const saltHex = storage.getItem('sk_salt');
  const logData = storage.getItem('sk_log');

  if (!saltHex || !logData) {
    return JSON.parse(JSON.stringify(EMPTY));
  }

  const webCrypto = getCrypto();
  const saltBuf = hexToBuf(saltHex);
  const key = await deriveKey(pin, saltBuf);

  try {
    const parsedLog = JSON.parse(logData);
    const iv = hexToBuf(parsedLog.iv);
    const ct = hexToBuf(parsedLog.ct);

    const decryptedBuf = await webCrypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      ct
    );

    const decryptedStr = new TextDecoder().decode(decryptedBuf);
    return JSON.parse(decryptedStr);
  } catch (err) {
    throw new Error('Incorrect PIN or corrupted vault data');
  }
}

/**
 * Encrypts and saves the vault data with the user PIN.
 */
export async function save(pin, data) {
  if (!pin || String(pin).length < 4) {
    throw new Error('PIN must be at least 4 digits');
  }

  const storage = getStorage();
  const webCrypto = getCrypto();

  let saltHex = storage.getItem('sk_salt');
  let saltBytes;
  if (saltHex) {
    saltBytes = new Uint8Array(hexToBuf(saltHex));
  } else {
    saltBytes = new Uint8Array(16);
    webCrypto.getRandomValues(saltBytes);
    storage.setItem('sk_salt', bufToHex(saltBytes));
  }

  const key = await deriveKey(pin, saltBytes);
  const iv = new Uint8Array(12);
  webCrypto.getRandomValues(iv);

  const plainText = JSON.stringify(data || EMPTY);
  const encData = new TextEncoder().encode(plainText);

  const cipherBuf = await webCrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encData
  );

  const payload = {
    iv: bufToHex(iv),
    ct: bufToHex(cipherBuf)
  };

  storage.setItem('sk_log', JSON.stringify(payload));
  return true;
}

/**
 * Permanently wipes the local encrypted vault.
 */
export function wipe() {
  const storage = getStorage();
  storage.removeItem('sk_salt');
  storage.removeItem('sk_log');
  return true;
}
