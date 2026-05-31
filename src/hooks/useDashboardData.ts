import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../api/dashboard';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const result = await fetchDashboardData();

      if (!result.ok) {
        throw result.error;
      }

      return result.value;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
};
