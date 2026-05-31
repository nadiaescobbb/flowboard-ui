// ============================================================
// BRANDED TYPES
// ============================================================
declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

export type UserId = Brand<string, 'UserId'>;
export type KPIId = Brand<string, 'KPIId'>;
export type Percentage = Brand<number, 'Percentage'>;

export const createUserId = (id: string): UserId => id as UserId;
export const createKPIId = (id: string): KPIId => id as KPIId;
export const createPercentage = (n: number): Percentage => {
  if (n < 0 || n > 100 || isNaN(n)) throw new RangeError(`Percentage must be 0-100, got ${n}`);
  return n as Percentage;
};

// ============================================================
// DOMAIN TYPES
// ============================================================
export type TrendDirection = 'up' | 'down' | 'neutral';
export type UserStatus = 'Active' | 'Trial' | 'Cancelled' | 'Away';
export type Theme = 'light' | 'dark';

// ============================================================
// ENTITY TYPES
// ============================================================
export interface KPICard {
  id: KPIId;
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  chartData: readonly number[];
  chartColor: string;
}

export interface User {
  id: UserId;
  name: string;
  email: string;
  plan: string;
  status: UserStatus;
  joinDate: string;
  joinedAt: string;
  avatar?: string;
  initials: string;
}

export interface AcquisitionChannel {
  name: string;
  percentage: Percentage;
  opacity: number;
}

export interface RevenueDataPoint {
  month: string;
  value: number;
}

export interface RevenueDataSeries {
  weekly: readonly RevenueDataPoint[];
  monthly: readonly RevenueDataPoint[];
}

// ============================================================
// API / RESPONSE TYPES
// ============================================================
export interface DashboardData {
  kpiCards: readonly KPICard[];
  users: readonly User[];
  channels: readonly AcquisitionChannel[];
  revenueData: RevenueDataSeries;
}

// ============================================================
// UTILITY TYPES
// ============================================================
export type TypeGuard<T> = (value: unknown) => value is T;

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <E = Error>(error: E): Result<never, E> => ({ ok: false, error });
