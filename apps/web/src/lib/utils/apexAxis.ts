/**
 * ApexCharts axis label formatters.
 *
 * Requirement: Stop duplicated tick text (e.g. "R 5R 5") without guessing
 *   a single root cause — Apex may re-invoke formatters with already-formatted
 *   strings on some axes.
 * Approach: Format only finite numeric values; if the tick value already
 *   looks like our currency/compact/label output, return it unchanged.
 */

const FORMATTED_TICK =
  /^-?R[\s\u00a0]?[\d.,]+(?:[KMB])?%?$/i;

const LABEL_LIKE = /Case|Worst|Best|Base/i;

export function apexAxisFormat(
  val: string | number,
  formatFinite: (n: number) => string
): string {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    const duplicated = trimmed.match(/^(.+)\1$/);
    if (duplicated) return duplicated[1];
    if (FORMATTED_TICK.test(trimmed) || LABEL_LIKE.test(trimmed) || /^R[\s\u00a0]/.test(trimmed)) {
      return trimmed;
    }
    const n = Number(trimmed);
    if (Number.isFinite(n)) return formatFinite(n);
    return trimmed;
  }
  if (typeof val === 'number' && Number.isFinite(val)) return formatFinite(val);
  return '';
}
