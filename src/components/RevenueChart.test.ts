import { describe, it, expect } from 'vitest';
import { INITIAL_MRR_DATA } from '../data/mockData';

describe('RevenueChart data processing', () => {
  it('has valid 12-month data series', () => {
    expect(INITIAL_MRR_DATA.length).toBe(12);
    expect(INITIAL_MRR_DATA[0].mrr).toBeGreaterThan(0);
  });
});
