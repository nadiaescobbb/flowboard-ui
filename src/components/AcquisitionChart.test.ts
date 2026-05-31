import { describe, expect, it } from 'vitest';
import { getAllocationLabel } from './AcquisitionChart';

describe('getAllocationLabel', () => {
  it('labels complete channel allocation', () => {
    expect(getAllocationLabel(100)).toBe('100% allocated');
  });

  it('labels partial channel totals as reported data', () => {
    expect(getAllocationLabel(95)).toBe('95% reported');
  });
});
