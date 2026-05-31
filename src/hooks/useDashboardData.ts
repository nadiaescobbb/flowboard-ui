import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../api/dashboard';

interface UseDashboardDataOptions {
  shouldFail?: boolean;
  delayMs?: number;
}

export const useDashboardData = (options: UseDashboardDataOptions = {}) => {
  const { shouldFail = false, delayMs } = options;

  return useQuery({
    queryKey: ['dashboard', shouldFail, delayMs],
    queryFn: async () => {
      const result = await fetchDashboardData({ shouldFail, delayMs });

      if (!result.ok) {
        throw result.error;
      }

      return result.value;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: shouldFail ? false : 2,
  });
};
