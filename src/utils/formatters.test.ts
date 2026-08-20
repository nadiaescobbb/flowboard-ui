import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatCompactNumber } from './formatters';

describe('formatters utility', () => {
  describe('formatCurrency', () => {
    it('formats standard USD numbers', () => {
      expect(formatCurrency(148450)).toContain('$148,450');
      expect(formatCurrency(0)).toContain('$0');
    });

    it('formats compact values when requested', () => {
      expect(formatCurrency(1781400, true)).toBe('$1.78M');
      expect(formatCurrency(148450, true)).toBe('$148k');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage values with decimal places', () => {
      expect(formatPercentage(108.2)).toBe('108.2%');
      expect(formatPercentage(2.14, 2)).toBe('2.14%');
    });
  });

  describe('formatCompactNumber', () => {
    it('formats compact number notation', () => {
      expect(formatCompactNumber(3420)).toBe('3.4K');
    });
  });
});
