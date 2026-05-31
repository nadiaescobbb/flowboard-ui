import {
  acquisitionChannels as channels,
  kpiCards,
  monthlyRevenueData,
  users,
  weeklyRevenueData,
} from '../data/mockData';
import { DashboardData, Result, err, ok } from '../types';
import { validateDashboardData } from '../utils';

interface FetchDashboardDataOptions {
  shouldFail?: boolean;
  delayMs?: number;
}

export async function fetchDashboardData(
  options: FetchDashboardDataOptions = {}
): Promise<Result<DashboardData>> {
  const { shouldFail = false, delayMs = 1500 } = options;

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (shouldFail) {
    return err(new Error('The dashboard service did not return weekly revenue data. Try loading it again.'));
  }

  const dashboardData: DashboardData = {
    kpiCards,
    users,
    channels,
    revenueData: {
      weekly: weeklyRevenueData,
      monthly: monthlyRevenueData,
    },
  };

  const validation = validateDashboardData(dashboardData);
  if (!validation.ok) return err(validation.error);

  return ok(validation.value);
}
