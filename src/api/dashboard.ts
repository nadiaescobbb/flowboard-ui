import {
  kpiCardsDark as kpiCards,
  usersDark as users,
  acquisitionChannelsDark as acquisitionChannels,
  revenueDataDark as revenueData,
} from '../data/mockData';

interface DashboardData {
  kpiCards: typeof kpiCards;
  users: typeof users;
  channels: typeof acquisitionChannels;
  revenueData: typeof revenueData;
  theme: 'light' | 'dark';
}

interface FetchDashboardDataOptions {
  shouldFail?: boolean;
  delayMs?: number;
}

export async function fetchDashboardData(
  theme: 'light' | 'dark',
  options: FetchDashboardDataOptions = {}
): Promise<DashboardData> {
  const { shouldFail = false, delayMs = 1500 } = options;

  await new Promise(resolve => setTimeout(resolve, delayMs));

  if (shouldFail) {
    throw new Error('The dashboard service did not return weekly revenue data. Try loading it again.');
  }

  return {
    kpiCards,
    users,
    channels: acquisitionChannels,
    revenueData,
    theme,
  };
}
