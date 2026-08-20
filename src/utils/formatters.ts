/**
 * Pure, testable formatting utilities for currency, percentages, and compact numbers.
 */

export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}k`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(val: number, decimals = 1): string {
  return `${val.toFixed(decimals)}%`;
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
}
