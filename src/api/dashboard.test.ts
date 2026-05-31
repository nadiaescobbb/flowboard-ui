import { describe, expect, it } from 'vitest';
import { fetchDashboardData } from './dashboard';

describe('fetchDashboardData', () => {
  it('returns dashboard data as an ok Result', async () => {
    const result = await fetchDashboardData({ delayMs: 0 });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.kpiCards.length).toBeGreaterThan(0);
    expect(result.value.users.length).toBeGreaterThan(0);
    expect(result.value.channels.length).toBeGreaterThan(0);
    expect(result.value.revenueData.length).toBeGreaterThan(0);
  });

  it('returns an error Result when the dashboard fetch fails', async () => {
    const result = await fetchDashboardData({ delayMs: 0, shouldFail: true });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toContain('dashboard service');
  });
});
