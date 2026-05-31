import {
  kpiCardsLight,
  kpiCardsDark,
  usersLight,
  usersDark,
  acquisitionChannelsLight,
  acquisitionChannelsDark,
  revenueDataLight,
  revenueDataDark,
} from '../data/mockData';

interface DashboardData {
  kpiCards: typeof kpiCardsLight;
  users: typeof usersLight;
  channels: typeof acquisitionChannelsLight;
  revenueData: typeof revenueDataLight;
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

  const isLight = theme === 'light';

  return {
    kpiCards: isLight ? kpiCardsLight : kpiCardsDark,
    users: isLight ? usersLight : usersDark,
    channels: isLight ? acquisitionChannelsLight : acquisitionChannelsDark,
    revenueData: isLight ? revenueDataLight : revenueDataDark,
    theme,
  };
}
