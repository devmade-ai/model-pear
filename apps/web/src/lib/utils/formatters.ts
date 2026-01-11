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
 * Format a number with thousands separators
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Get risk level badge class
 */
export function getRiskBadgeClass(level: string): string {
  switch (level.toLowerCase()) {
    case 'low':
      return 'badge-green';
    case 'medium':
      return 'badge-amber';
    case 'high':
      return 'badge-red';
    default:
      return 'badge-blue';
  }
}

/**
 * Get value color class based on positive/negative
 */
export function getValueClass(value: number, options?: { invert?: boolean }): string {
  const isPositive = options?.invert ? value < 0 : value >= 0;
  return isPositive ? 'result-value-positive' : 'result-value-negative';
}
