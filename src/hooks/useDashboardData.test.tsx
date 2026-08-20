import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKpiSummary, useCustomers } from './useDashboardData';
import { SimulationProvider } from '../contexts/SimulationContext';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SimulationProvider>{children}</SimulationProvider>
    </QueryClientProvider>
  );
};

describe('useDashboardData hooks', () => {
  it('fetches KPI summary successfully via TanStack Query', async () => {
    const { result } = renderHook(() => useKpiSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.mrr).toBe(148450);
  });

  it('fetches customers list successfully via TanStack Query', async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});
