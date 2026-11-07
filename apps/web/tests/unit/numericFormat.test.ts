import { describe, expect, it } from 'vitest';
import {
  apexAxisFormat,
  formatCurrency,
  formatCurrencySafe,
  parseFiniteNumber,
  validateNumberBounds,
} from '../../src/lib/utils';

describe('numericInput helpers', () => {
  it('parseFiniteNumber treats empty as null', () => {
    expect(parseFiniteNumber('')).toBeNull();
    expect(parseFiniteNumber(null)).toBeNull();
  });

  it('validateNumberBounds rejects negatives with clear message', () => {
    const issue = validateNumberBounds('cost', 'Cost to Serve', -5, { min: 0 });
    expect(issue?.message).toMatch(/cannot be negative/i);
  });

  it('formatCurrencySafe handles null without throwing', () => {
    expect(formatCurrencySafe(null)).toBe('—');
  });

  it('formatCurrency rejects non-finite', () => {
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe('—');
  });
});

describe('apexAxisFormat', () => {
  it('formats finite numbers once', () => {
    expect(apexAxisFormat(5000, (n) => formatCurrency(n, true))).toBe('R5K');
  });

  it('does not double-format currency ticks', () => {
    expect(apexAxisFormat('R5K', (n) => formatCurrency(n, true))).toBe('R5K');
    expect(apexAxisFormat('R 5', (n) => `R ${n}`)).toBe('R 5');
    expect(apexAxisFormat('R 2\u00a0400R 2\u00a0400', (n) => formatCurrency(n))).toBe('R 2\u00a0400');
  });
});
