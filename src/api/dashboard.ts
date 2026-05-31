import {
  kpiCardsDark as kpiCards,
  usersDark as users,
  acquisitionChannelsDark as acquisitionChannels,
  revenueDataDark as revenueData,
} from '../data/mockData';
import { err, ok, Result } from '../types';

interface DashboardData {
  kpiCards: typeof kpiCards;
  users: typeof users;
  channels: typeof acquisitionChannels;
  revenueData: typeof revenueData;
}

interface FetchDashboardDataOptions {
  shouldFail?: boolean;
  delayMs?: number;
}

export async function fetchDashboardData(
  options: FetchDashboardDataOptions = {}
): Promise<Result<DashboardData>> {
  const { shouldFail = false, delayMs = 1500 } = options;

  await new Promise(resolve => setTimeout(resolve, delayMs));

  if (shouldFail) {
    return err(new Error('The dashboard service did not return weekly revenue data. Try loading it again.'));
  }

  return ok({
    kpiCards,
    users,
    channels: acquisitionChannels,
    revenueData,
  });
}
