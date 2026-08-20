import { describe, it, expect } from 'vitest';
import { INITIAL_CHANNEL_DATA } from '../data/mockData';

describe('Acquisition Channel Data', () => {
  it('contains channel shares totaling ~100%', () => {
    const totalPct = INITIAL_CHANNEL_DATA.reduce((acc, curr) => acc + curr.pct, 0);
    expect(Math.round(totalPct)).toBe(100);
  });
});
