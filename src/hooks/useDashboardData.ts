import { useQuery } from '@tanstack/react-query';
import { dashboardRepository } from '../api/dashboard';
import { useSimulation } from '../contexts/SimulationContext';
import { isErr } from '../utils/result';

export function useKpiSummary() {
  const { simState } = useSimulation();
  return useQuery({
    queryKey: ['kpiSummary', simState],
    queryFn: async () => {
      const res = await dashboardRepository.getKpiSummary(simState);
      if (isErr(res)) {
        throw res.error;
      }
      return res.value;
    },
    retry: 1,
  });
}

export function useMonthlyMetrics() {
  const { simState } = useSimulation();
  return useQuery({
    queryKey: ['monthlyMetrics', simState],
    queryFn: async () => {
      const res = await dashboardRepository.getMonthlyMetrics(simState);
      if (isErr(res)) {
        throw res.error;
      }
      return res.value;
    },
    retry: 1,
  });
}

export function useChannelShares() {
  const { simState } = useSimulation();
  return useQuery({
    queryKey: ['channelShares', simState],
    queryFn: async () => {
      const res = await dashboardRepository.getChannelShares(simState);
      if (isErr(res)) {
        throw res.error;
      }
      return res.value;
    },
    retry: 1,
  });
}

export function useCustomers() {
  const { simState } = useSimulation();
  return useQuery({
    queryKey: ['customers', simState],
    queryFn: async () => {
      const res = await dashboardRepository.getCustomers(simState);
      if (isErr(res)) {
        throw res.error;
      }
      return res.value;
    },
    retry: 1,
  });
}
