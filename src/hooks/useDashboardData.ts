import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { fetchDashboardData } from '../api/dashboard';

export const useDashboardData = () => {
  const { theme } = useTheme();

  return useQuery({
    queryKey: ['dashboard', theme],
    queryFn: () => fetchDashboardData(theme),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
};