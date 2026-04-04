import { describe, it, expect } from 'vitest';
import {
  validateKPICard,
  validateUser,
  validateAcquisitionChannel,
  validateRevenueDataPoint,
  validateArrayOf,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  normalizeDataPoints,
  buildSvgPath,
  buildAreaPath,
  createMockKPICard,
  createMockUser,
  createMockChannel,
  isUserStatus,
  isTrendDirection,
} from '../utils';
import { ok, err, createPercentage, createUserId, createKPIId } from '../types';

// ============================================================
// TYPE GUARDS
// ============================================================
describe('isUserStatus', () => {
  it('accepts valid statuses', () => {
    expect(isUserStatus('Active')).toBe(true);
    expect(isUserStatus('Trial')).toBe(true);
    expect(isUserStatus('Cancelled')).toBe(true);
    expect(isUserStatus('Away')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isUserStatus('active')).toBe(false); // case-sensitive
    expect(isUserStatus('Inactive')).toBe(false);
    expect(isUserStatus(null)).toBe(false);
    expect(isUserStatus(42)).toBe(false);
    expect(isUserStatus('')).toBe(false);
  });
});

describe('isTrendDirection', () => {
  it('accepts valid directions', () => {
    expect(isTrendDirection('up')).toBe(true);
    expect(isTrendDirection('down')).toBe(true);
    expect(isTrendDirection('neutral')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isTrendDirection('Up')).toBe(false);
    expect(isTrendDirection('sideways')).toBe(false);
    expect(isTrendDirection(undefined)).toBe(false);
  });
});

// ============================================================
// BRANDED TYPES
// ============================================================
describe('createPercentage', () => {
  it('creates valid percentages', () => {
    expect(createPercentage(0)).toBe(0);
    expect(createPercentage(50)).toBe(50);
    expect(createPercentage(100)).toBe(100);
  });

  it('throws on out-of-range values', () => {
    expect(() => createPercentage(-1)).toThrow(RangeError);
    expect(() => createPercentage(101)).toThrow(RangeError);
    expect(() => createPercentage(NaN)).toThrow(RangeError);
  });
});

// ============================================================
// VALIDATORS
// ============================================================
describe('validateKPICard', () => {
  it('validates a correct KPI card', () => {
    const card = createMockKPICard();
    expect(validateKPICard(card)).toBe(true);
  });

  it('rejects null and primitives', () => {
    expect(validateKPICard(null)).toBe(false);
    expect(validateKPICard('string')).toBe(false);
    expect(validateKPICard(42)).toBe(false);
    expect(validateKPICard(undefined)).toBe(false);
  });

  it('rejects card with empty id', () => {
    const card = { ...createMockKPICard(), id: createKPIId('') };
    expect(validateKPICard(card)).toBe(false);
  });

  it('rejects card with invalid trend', () => {
    const card = { ...createMockKPICard(), trend: 'sideways' };
    expect(validateKPICard(card)).toBe(false);
  });

  it('rejects card with empty chartData', () => {
    const card = { ...createMockKPICard(), chartData: [] };
    expect(validateKPICard(card)).toBe(false);
  });

  it('rejects chartData with non-numeric values', () => {
    const card = { ...createMockKPICard(), chartData: [1, 'two', 3] };
    expect(validateKPICard(card)).toBe(false);
  });

  it('rejects chartData with Infinity', () => {
    const card = { ...createMockKPICard(), chartData: [1, Infinity] };
    expect(validateKPICard(card)).toBe(false);
  });
});

describe('validateUser', () => {
  it('validates a correct user', () => {
    const user = createMockUser();
    expect(validateUser(user)).toBe(true);
  });

  it('validates user with optional avatar', () => {
    const userWithAvatar = createMockUser({ avatar: 'https://example.com/pic.jpg' });
    const userWithoutAvatar = createMockUser({ avatar: undefined });
    expect(validateUser(userWithAvatar)).toBe(true);
    expect(validateUser(userWithoutAvatar)).toBe(true);
  });

  it('rejects invalid email (no @)', () => {
    const user = createMockUser({ email: 'notanemail' });
    expect(validateUser(user)).toBe(false);
  });

  it('rejects invalid status', () => {
    const user = { ...createMockUser(), status: 'Pending' };
    expect(validateUser(user)).toBe(false);
  });

  it('rejects empty name', () => {
    const user = createMockUser({ name: '' });
    expect(validateUser(user)).toBe(false);
  });

  it('rejects avatar that is not a string', () => {
    const user = { ...createMockUser(), avatar: 123 };
    expect(validateUser(user)).toBe(false);
  });
});

describe('validateAcquisitionChannel', () => {
  it('validates a correct channel', () => {
    const channel = createMockChannel();
    expect(validateAcquisitionChannel(channel)).toBe(true);
  });

  it('rejects negative percentage', () => {
    // Percentage branded type prevents this at compile time,
    // but we test the validator's runtime check
    const channel = { name: 'Test', percentage: -1, opacity: 1 };
    expect(validateAcquisitionChannel(channel)).toBe(false);
  });

  it('rejects percentage > 100', () => {
    const channel = { name: 'Test', percentage: 101, opacity: 1 };
    expect(validateAcquisitionChannel(channel)).toBe(false);
  });

  it('rejects opacity outside 0-1', () => {
    const channel = { name: 'Test', percentage: 50, opacity: 1.5 };
    expect(validateAcquisitionChannel(channel)).toBe(false);
  });

  it('rejects empty name', () => {
    const channel = createMockChannel({ name: '' });
    expect(validateAcquisitionChannel(channel)).toBe(false);
  });
});

describe('validateRevenueDataPoint', () => {
  it('validates a correct data point', () => {
    expect(validateRevenueDataPoint({ month: 'Jan', value: 100 })).toBe(true);
    expect(validateRevenueDataPoint({ month: 'MON', value: 0 })).toBe(true);
  });

  it('rejects negative values', () => {
    expect(validateRevenueDataPoint({ month: 'Jan', value: -1 })).toBe(false);
  });

  it('rejects empty month', () => {
    expect(validateRevenueDataPoint({ month: '', value: 100 })).toBe(false);
  });

  it('rejects non-numeric values', () => {
    expect(validateRevenueDataPoint({ month: 'Jan', value: '100' })).toBe(false);
  });
});

// ============================================================
// ARRAY VALIDATOR
// ============================================================
describe('validateArrayOf', () => {
  it('validates an array of valid items', () => {
    const cards = [createMockKPICard(), createMockKPICard({ id: createKPIId('kpi-2') })];
    const result = validateArrayOf(cards, validateKPICard);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toHaveLength(2);
  });

  it('returns error for non-array input', () => {
    const result = validateArrayOf('not an array', validateKPICard);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(TypeError);
  });

  it('returns error when array is shorter than minLength', () => {
    const result = validateArrayOf([], validateKPICard, 1);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(RangeError);
  });

  it('returns error with index info when item is invalid', () => {
    const items = [createMockKPICard(), { invalid: true }];
    const result = validateArrayOf(items, validateKPICard);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain('index 1');
  });
});

// ============================================================
// FORMATTERS
// ============================================================
describe('formatCurrency', () => {
  it('formats integers without decimals', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('rounds to nearest dollar', () => {
    // Intl.NumberFormat rounds to nearest integer with minimumFractionDigits: 0
    expect(formatCurrency(1000.7)).toBe('$1,001');
    expect(formatCurrency(1000.4)).toBe('$1,000');
  });

  it('supports other currencies', () => {
    expect(formatCurrency(1000, 'EUR', 'de-DE')).toContain('1.000');
  });
});

describe('formatPercentage', () => {
  it('adds + sign for positive values', () => {
    expect(formatPercentage(5)).toBe('+5.0%');
    expect(formatPercentage(0)).toBe('+0.0%');
  });

  it('keeps - sign for negative values', () => {
    expect(formatPercentage(-2.5)).toBe('-2.5%');
  });

  it('respects decimals parameter', () => {
    expect(formatPercentage(12.345, 2)).toBe('+12.35%');
    expect(formatPercentage(12.345, 0)).toBe('+12%');
  });
});

describe('formatCompactNumber', () => {
  it('formats thousands', () => {
    expect(formatCompactNumber(1000)).toBe('1K');
    expect(formatCompactNumber(1500)).toBe('1.5K');
  });

  it('formats millions', () => {
    expect(formatCompactNumber(1000000)).toBe('1M');
  });

  it('handles small numbers', () => {
    expect(formatCompactNumber(42)).toBe('42');
  });
});

// ============================================================
// CHART UTILITIES
// ============================================================
describe('normalizeDataPoints', () => {
  const mockData = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 200 },
    { month: 'Mar', value: 150 },
  ];

  it('returns empty array for empty input', () => {
    expect(normalizeDataPoints([], 800, 300)).toEqual([]);
  });

  it('returns single centered point for single item', () => {
    const result = normalizeDataPoints([{ month: 'Jan', value: 100 }], 800, 300);
    expect(result).toHaveLength(1);
    expect(result[0].x).toBe(400); // centered
  });

  it('maps values to correct array length', () => {
    const result = normalizeDataPoints(mockData, 800, 300);
    expect(result).toHaveLength(3);
  });

  it('first point x is 0, last point x is width', () => {
    const result = normalizeDataPoints(mockData, 800, 300);
    expect(result[0].x).toBe(0);
    expect(result[result.length - 1].x).toBe(800);
  });

  it('preserves original values and labels', () => {
    const result = normalizeDataPoints(mockData, 800, 300);
    expect(result[0].value).toBe(100);
    expect(result[0].label).toBe('Jan');
    expect(result[1].value).toBe(200);
    expect(result[1].label).toBe('Feb');
  });

  it('y coordinates are within [0, height] bounds', () => {
    const result = normalizeDataPoints(mockData, 800, 300);
    result.forEach(({ y }) => {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(300);
    });
  });

  it('handles all-equal values without crashing (zero range)', () => {
    const equalData = [
      { month: 'A', value: 50 },
      { month: 'B', value: 50 },
    ];
    expect(() => normalizeDataPoints(equalData, 800, 300)).not.toThrow();
  });
});

describe('buildSvgPath', () => {
  it('returns empty string for empty points', () => {
    expect(buildSvgPath([])).toBe('');
  });

  it('returns M command for single point', () => {
    const points = [{ x: 10, y: 20, value: 100, label: 'A' }];
    expect(buildSvgPath(points)).toBe('M 10 20');
  });

  it('starts with M command', () => {
    const points = [
      { x: 0, y: 150, value: 100, label: 'A' },
      { x: 400, y: 100, value: 150, label: 'B' },
    ];
    expect(buildSvgPath(points)).toMatch(/^M/);
  });

  it('uses cubic bezier curves (C command)', () => {
    const points = [
      { x: 0, y: 150, value: 100, label: 'A' },
      { x: 400, y: 100, value: 150, label: 'B' },
      { x: 800, y: 120, value: 130, label: 'C' },
    ];
    expect(buildSvgPath(points)).toContain('C');
  });
});

describe('buildAreaPath', () => {
  it('returns empty string for empty linePath', () => {
    expect(buildAreaPath('', 300, 800)).toBe('');
  });

  it('closes area to bottom of chart', () => {
    const path = buildAreaPath('M 0 150 C 400 150, 400 100, 800 100', 300, 800);
    expect(path).toContain('L 800 300'); // goes to bottom-right
    expect(path).toContain('L 0 300');   // goes to bottom-left
    expect(path).toEndWith('Z');         // closes path
  });
});

// ============================================================
// RESULT TYPE
// ============================================================
describe('Result type helpers', () => {
  it('ok wraps a success value', () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(42);
  });

  it('err wraps an error', () => {
    const error = new Error('failed');
    const result = err(error);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(error);
  });
});