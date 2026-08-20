import {
  Customer,
  MonthlyMetric,
  ChannelShare,
  KpiSummary,
  SimulationState,
  CustomerSchema,
} from '../types';
import { Result, ok, err } from '../utils/result';
import {
  INITIAL_CUSTOMERS,
  INITIAL_MRR_DATA,
  INITIAL_CHANNEL_DATA,
  INITIAL_KPI_SUMMARY,
} from '../data/mockData';

export interface IDashboardRepository {
  getKpiSummary(simState?: SimulationState): Promise<Result<KpiSummary>>;
  getMonthlyMetrics(simState?: SimulationState): Promise<Result<MonthlyMetric[]>>;
  getChannelShares(simState?: SimulationState): Promise<Result<ChannelShare[]>>;
  getCustomers(simState?: SimulationState): Promise<Result<Customer[]>>;
}

export class DashboardRepository implements IDashboardRepository {
  private async simulateNetwork(simState?: SimulationState): Promise<void> {
    const delay = simState?.slowNetwork ? 2000 : 250;
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (simState?.error500 || simState?.mode === 'error500') {
      throw new Error('500 Internal Server Error: Mock API simulation failure');
    }
  }

  async getKpiSummary(simState?: SimulationState): Promise<Result<KpiSummary>> {
    try {
      await this.simulateNetwork(simState);
      return ok(INITIAL_KPI_SUMMARY);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async getMonthlyMetrics(simState?: SimulationState): Promise<Result<MonthlyMetric[]>> {
    try {
      await this.simulateNetwork(simState);
      return ok(INITIAL_MRR_DATA);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async getChannelShares(simState?: SimulationState): Promise<Result<ChannelShare[]>> {
    try {
      await this.simulateNetwork(simState);
      return ok(INITIAL_CHANNEL_DATA);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async getCustomers(simState?: SimulationState): Promise<Result<Customer[]>> {
    try {
      await this.simulateNetwork(simState);
      if (simState?.emptyState) {
        return ok([]);
      }
      // Runtime validation via Zod
      const validated = INITIAL_CUSTOMERS.map((c) => CustomerSchema.parse(c));
      return ok(validated);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}

export const dashboardRepository = new DashboardRepository();
