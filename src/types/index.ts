// ============================================================
// BRANDED TYPES — previenen mezclas accidentales de IDs/valores
// ============================================================
declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

export type UserId = Brand<string, 'UserId'>;
export type KPIId = Brand<string, 'KPIId'>;
export type Percentage = Brand<number, 'Percentage'>;
export type CurrencyUSD = Brand<number, 'CurrencyUSD'>;

// Helper para crear branded values con validación en runtime
export const createUserId = (id: string): UserId => id as UserId;
export const createKPIId = (id: string): KPIId => id as KPIId;
export const createPercentage = (n: number): Percentage => {
  if (n < 0 || n > 100 || isNaN(n)) throw new RangeError(`Percentage must be 0-100, got ${n}`);
  return n as Percentage;
};

// ============================================================
// DISCRIMINATED UNIONS — estados explícitos y exhaustivos
// ============================================================
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Fuerza manejo exhaustivo en switch
export const assertNever = (x: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
};

// ============================================================
// DOMAIN TYPES
// ============================================================
export type TrendDirection = 'up' | 'down' | 'neutral';
export type UserStatus = 'Active' | 'Trial' | 'Cancelled' | 'Away';
export type Theme = 'light' | 'dark';
export type TimeRange = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type SortDirection = 'asc' | 'desc';

export type SortableUserField = Extract<
  keyof User,
  'name' | 'email' | 'plan' | 'status' | 'joinDate'
>;

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

// ============================================================
// API / RESPONSE TYPES
// ============================================================
export interface DashboardData {
  kpiCards: readonly KPICard[];
  users: readonly User[];
  channels: readonly AcquisitionChannel[];
  revenueData: readonly RevenueDataPoint[];
  theme: Theme;
  fetchedAt: number;
}

// ============================================================
// UTILITY TYPES propios
// ============================================================

// Como Required pero solo para ciertas keys
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Hace readonly en profundidad
export type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// Extrae el tipo de un array
export type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer U)[] ? U : never;

// Type guard helper tipado
export type TypeGuard<T> = (value: unknown) => value is T;

// Resultado de operaciones que pueden fallar (sin excepciones)
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <E = Error>(error: E): Result<never, E> => ({ ok: false, error });