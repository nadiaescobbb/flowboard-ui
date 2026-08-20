import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage } from './formatters';

describe('Legacy utils compatibility', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
  });

  it('formats percentage correctly', () => {
    expect(formatPercentage(10.5)).toBe('10.5%');
  });
});
