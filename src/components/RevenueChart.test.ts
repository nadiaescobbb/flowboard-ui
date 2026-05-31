import { describe, expect, it } from 'vitest';
import { getSeriesStats } from './RevenueChart';

describe('getSeriesStats', () => {
  it('returns zero growth when the first value is zero', () => {
    const stats = getSeriesStats([
      { month: 'MON', value: 0 },
      { month: 'TUE', value: 120 },
    ]);

    expect(stats.growth).toBe(0);
    expect(Number.isFinite(stats.growth)).toBe(true);
  });
});
