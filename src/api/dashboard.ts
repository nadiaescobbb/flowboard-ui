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

export async function fetchDashboardData(theme: 'light' | 'dark'): Promise<DashboardData> {
  // Simula delay de red (como una API real)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simula posible error (10% de chance)
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch dashboard data');
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