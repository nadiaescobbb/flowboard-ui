import { describe, it, expect } from 'vitest';
import { DashboardRepository } from './dashboard';
import { isOk, isErr } from '../utils/result';

describe('DashboardRepository API', () => {
  const repo = new DashboardRepository();

  it('fetches KPI summary successfully', async () => {
    const res = await repo.getKpiSummary({ mode: 'live', slowNetwork: false, error500: false, emptyState: false });
    expect(isOk(res)).toBe(true);
    if (isOk(res)) {
      expect(res.value.mrr).toBe(148450);
      expect(res.value.activeSubscriptions).toBe(3420);
    }
  });

  it('returns valid customer list with Zod validation', async () => {
    const res = await repo.getCustomers({ mode: 'live', slowNetwork: false, error500: false, emptyState: false });
    expect(isOk(res)).toBe(true);
    if (isOk(res)) {
      expect(res.value.length).toBeGreaterThan(0);
      expect(res.value[0].email).toContain('@');
    }
  });

  it('returns error result when error500 simulation is enabled', async () => {
    const res = await repo.getKpiSummary({ mode: 'error500', slowNetwork: false, error500: true, emptyState: false });
    expect(isErr(res)).toBe(true);
    if (isErr(res)) {
      expect(res.error.message).toContain('500 Internal Server Error');
    }
  });

  it('returns empty list when emptyState simulation is enabled', async () => {
    const res = await repo.getCustomers({ mode: 'live', slowNetwork: false, error500: false, emptyState: true });
    expect(isOk(res)).toBe(true);
    if (isOk(res)) {
      expect(res.value.length).toBe(0);
    }
  });
});
