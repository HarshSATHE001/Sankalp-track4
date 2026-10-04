/**
 * scripts/guardrail-check.mjs - SANKALP Compliance Guardrail Checker
 * 
 * Verifies that src/i18n.js contains NO financial advice, targets, or certainty claims.
 * Checks for prohibited phrases:
 * - buy now, sell now, target, guaranteed, will lose, will gain, sure shot, and bare tip (except "Saw a tip").
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const i18nPath = path.resolve(__dirname, '../src/i18n.js');

const content = fs.readFileSync(i18nPath, 'utf8');

const PROHIBITED_RULES = [
  { name: 'buy now', regex: /\bbuy\s+now\b/i },
  { name: 'sell now', regex: /\bsell\s+now\b/i },
  { name: 'target', regex: /\btarget\b/i },
  { name: 'guaranteed', regex: /\bguaranteed\b/i },
  { name: 'will lose', regex: /\bwill\s+lose\b/i },
  { name: 'will gain', regex: /\bwill\s+gain\b/i },
  { name: 'sure shot', regex: /\bsure\s+shot\b/i },
  // Bare "tip" (allow-list "Saw a tip")
  { name: 'bare tip', regex: /(?<!saw a\s+)\btip\b/i }
];

let failed = false;

// Extract string literals from file
const stringRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`/g;
let match;

while ((match = stringRegex.exec(content)) !== null) {
  const str = match[1] || match[2] || match[3] || '';
  
  // Allow-list the specific option "Saw a tip"
  if (/saw a tip/i.test(str)) {
    continue;
  }

  for (const rule of PROHIBITED_RULES) {
    if (rule.regex.test(str)) {
      console.error(`[Guardrail Violation] Prohibited term "${rule.name}" found in string: "${str}"`);
      failed = true;
    }
  }
}

if (failed) {
  console.error('\nFAIL: Guardrail checks failed. Do not provide advice or promise returns.');
  process.exit(1);
} else {
  console.log('PASS: Guardrail checks passed. No financial advice or prohibited terms found.');
  process.exit(0);
}
