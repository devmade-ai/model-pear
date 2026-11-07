/**
 * ApexCharts axis / label formatters.
 *
 * Requirement: Prevent duplicated tick text and document overflow on mobile.
 * Approach: format finite numbers only; detect Apex concatenation artifacts
 *   (whole label repeated twice) and already-formatted currency strings.
 */

const FORMATTED_TICK =
  /^-?R[\s\u00a0]?[\d.,]+(?:[KMB])?%?$/i;

const LABEL_LIKE = /Case|Worst|Best|Base/i;

/** Split a string that is exactly two identical halves (Apex tick artifact). */
function dedupeDoubledLabel(text: string): string {
  if (text.length > 1 && text.length % 2 === 0) {
    const half = text.length / 2;
    const a = text.slice(0, half);
    const b = text.slice(half);
    if (a === b) return a;
  }
  const m = text.match(/^(.+)\1$/);
  if (m) return m[1];
  return text;
}

export function apexAxisFormat(
  val: string | number,
  formatFinite: (n: number) => string
): string {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? formatFinite(val) : '';
  }
  const trimmed = dedupeDoubledLabel(val.trim());
  if (FORMATTED_TICK.test(trimmed) || LABEL_LIKE.test(trimmed) || /^R[\s\u00a0]/.test(trimmed)) {
    return trimmed;
  }
  const n = Number(trimmed.replace(/[^\d.-]/g, ''));
  if (Number.isFinite(n)) return formatFinite(n);
  return trimmed;
}

/** Compact numeric-only ticks (equilibrium x-axis) — avoids wide currency SVG text. */
export function apexEquilibriumTick(val: string | number): string {
  if (typeof val === 'string') {
    const t = dedupeDoubledLabel(val.trim());
    if (/^\d/.test(t) || /^-?\d/.test(t)) {
      const n = Number(t.replace(/[^\d.-]/g, ''));
      if (Number.isFinite(n)) return apexCompactNumber(n);
    }
    if (/k$/i.test(t)) return t;
    return t;
  }
  if (typeof val === 'number' && Number.isFinite(val)) return apexCompactNumber(val);
  return '';
}

function apexCompactNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (abs >= 10_000) return `${Math.round(n / 1_000)}k`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(Math.round(n));
}
