/**
 * Formatting utilities for currency, percentages, and numbers
 */

/**
 * Format a number as South African Rand currency
 * @param value - The number to format
 * @param compact - If true, use compact notation (e.g., R1.2M)
 */
export function formatCurrency(value: number, compact?: boolean): string {
  if (compact) {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absValue >= 1_000_000) {
      return `${sign}R${(absValue / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 1_000) {
      return `${sign}R${(absValue / 1_000).toFixed(0)}K`;
    }
    return `${sign}R${absValue.toFixed(0)}`;
  }
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get risk-level DaisyUI badge variant class.
 *
 * Returns just the variant ("badge-success" / "badge-warning" /
 * "badge-error" / "badge-info"); ResultPanel applies the base `badge`
 * class automatically. Earlier values ("badge-green" / "badge-amber" /
 * "badge-red" / "badge-blue") were stale — those classes don't exist in
 * DaisyUI v5, so risk badges rendered styleless. After the DaisyUI
 * semantic-token migration, risk levels use the same palette as the
 * rest of the app.
 */
export function getRiskBadgeClass(level: string): string {
  switch (level.toLowerCase()) {
    case 'low':
      return 'badge-success';
    case 'medium':
      return 'badge-warning';
    case 'high':
      return 'badge-error';
    default:
      return 'badge-info';
  }
}

/**
 * Get value color class based on positive/negative
 */
export function getValueClass(value: number, options?: { invert?: boolean }): string {
  const isPositive = options?.invert ? value < 0 : value >= 0;
  return isPositive ? 'result-value-positive' : 'result-value-negative';
}
