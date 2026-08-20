import { z } from 'zod';

// ─── Branded Types (Compile-Time Domain Safety) ──────────────────────────────
export type UserId = string & { readonly __brand: unique symbol };
export type CurrencyAmount = number & { readonly __brand: unique symbol };
export type Percentage = number & { readonly __brand: unique symbol };

export const makeUserId = (id: string): UserId => id as UserId;
export const makeCurrencyAmount = (val: number): CurrencyAmount => val as CurrencyAmount;
export const makePercentage = (val: number): Percentage => {
  if (val < 0 || val > 100) {
    throw new RangeError(`Percentage must be between 0 and 100. Received: ${val}`);
  }
  return val as Percentage;
};

// ─── Domain Union & Literal Types ────────────────────────────────────────────
export type Theme = 'light' | 'dark';
export type SimMode = 'live' | 'error500' | 'latency';
export type MetricTab = 'MRR' | 'ARR' | 'Net Churn';
export type DateRange = 'Last 30 Days' | 'YTD' | 'Custom';
export type StatusFilter = 'All' | 'Active' | 'Past Due' | 'Canceled';
export type PaymentStatus = 'Paid' | 'Retrying' | 'Failed';
export type PlanTier = 'Enterprise' | 'Pro' | 'Free';

// ─── Zod Schemas (Runtime Boundary Validation) ────────────────────────────────
export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  plan: z.enum(['Enterprise', 'Pro', 'Free']),
  mrr: z.number().nonnegative(),
  status: z.enum(['Paid', 'Retrying', 'Failed']),
  lastActive: z.string(),
  initials: z.string().max(3),
  color: z.string(),
});

export const MonthlyMetricSchema = z.object({
  month: z.string(),
  mrr: z.number(),
  arr: z.number(),
  churn: z.number(),
});

export const ChannelShareSchema = z.object({
  name: z.string(),
  value: z.number(),
  pct: z.number(),
  color: z.string(),
});

export const KpiSummarySchema = z.object({
  mrr: z.number(),
  mrrGrowth: z.number(),
  arrRunRate: z.number(),
  nrr: z.number(),
  nrrTarget: z.number(),
  activeSubscriptions: z.number(),
  newThisMonth: z.number(),
  planBreakdown: z.object({
    enterprise: z.number(),
    pro: z.number(),
    free: z.number(),
  }),
  churnRiskScore: z.number(),
  flaggedAccountsCount: z.number(),
});

export type Customer = z.infer<typeof CustomerSchema>;
export type MonthlyMetric = z.infer<typeof MonthlyMetricSchema>;
export type ChannelShare = z.infer<typeof ChannelShareSchema>;
export type KpiSummary = z.infer<typeof KpiSummarySchema>;

export interface SimulationState {
  mode: SimMode;
  slowNetwork: boolean;
  error500: boolean;
  emptyState: boolean;
}
