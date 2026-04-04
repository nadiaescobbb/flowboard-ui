import {
  KPICard,
  User,
  AcquisitionChannel,
  RevenueDataPoint,
  Result,
  ok,
  err,
  TypeGuard,
  UserStatus,
  TrendDirection,
  createUserId,
  createKPIId,
  createPercentage,
} from '../types';

// ============================================================
// TYPE GUARDS
// ============================================================
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isString = (v: unknown): v is string => typeof v === 'string';
const isNumber = (v: unknown): v is number =>
  typeof v === 'number' && isFinite(v);

const USER_STATUSES: readonly UserStatus[] = [
  'Active',
  'Trial',
  'Cancelled',
  'Away',
] as const;

const TREND_DIRECTIONS: readonly TrendDirection[] = [
  'up',
  'down',
  'neutral',
] as const;

export const isUserStatus = (v: unknown): v is UserStatus =>
  isString(v) && (USER_STATUSES as readonly string[]).includes(v);

export const isTrendDirection = (v: unknown): v is TrendDirection =>
  isString(v) && (TREND_DIRECTIONS as readonly string[]).includes(v);


export const validateKPICard: TypeGuard<KPICard> = (v): v is KPICard => {
  if (!isObject(v)) return false;
  if (!isString(v.id) || v.id.length === 0) return false;
  if (!isString(v.label) || v.label.length === 0) return false;
  if (!isString(v.value)) return false;
  if (!isString(v.change)) return false;
  if (!isTrendDirection(v.trend)) return false;
  if (!Array.isArray(v.chartData) || v.chartData.length === 0) return false;
  if (!v.chartData.every(isNumber)) return false;
  if (!isString(v.chartColor)) return false;
  return true;
};

export const validateUser: TypeGuard<User> = (v): v is User => {
  if (!isObject(v)) return false;
  if (!isString(v.id) || v.id.length === 0) return false;
  if (!isString(v.name) || v.name.length === 0) return false;
  if (!isString(v.email) || !v.email.includes('@')) return false;
  if (!isString(v.plan)) return false;
  if (!isUserStatus(v.status)) return false;
  if (!isString(v.joinDate)) return false;
  if (!isString(v.initials)) return false;
  if (v.avatar !== undefined && !isString(v.avatar)) return false;
  return true;
};

export const validateAcquisitionChannel: TypeGuard<AcquisitionChannel> = (
  v
): v is AcquisitionChannel => {
  if (!isObject(v)) return false;
  if (!isString(v.name) || v.name.length === 0) return false;
  if (!isNumber(v.percentage) || v.percentage < 0 || v.percentage > 100)
    return false;
  if (!isNumber(v.opacity) || v.opacity < 0 || v.opacity > 1) return false;
  return true;
};

export const validateRevenueDataPoint: TypeGuard<RevenueDataPoint> = (
  v
): v is RevenueDataPoint => {
  if (!isObject(v)) return false;
  if (!isString(v.month) || v.month.length === 0) return false;
  if (!isNumber(v.value) || v.value < 0) return false;
  return true;
};


export const validateArrayOf = <T>(
  data: unknown,
  guard: TypeGuard<T>,
  minLength = 0
): Result<T[]> => {
  if (!Array.isArray(data)) {
    return err(new TypeError('Expected an array'));
  }
  if (data.length < minLength) {
    return err(
      new RangeError(`Array must have at least ${minLength} items, got ${data.length}`)
    );
  }
  const invalid = data.findIndex((item) => !guard(item));
  if (invalid !== -1) {
    return err(new TypeError(`Item at index ${invalid} failed validation`));
  }
  return ok(data as T[]);
};


export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercentage = (value: number, decimals = 1): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;

export const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);


export interface ChartPoint {
  x: number;
  y: number;
  value: number;
  label: string;
}

export const normalizeDataPoints = (
  data: readonly RevenueDataPoint[],
  width: number,
  height: number,
  padding = 0.1
): ChartPoint[] => {
  if (data.length === 0) return [];

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1; // evita división por cero

  return data.map((point, index) => ({
    x: data.length === 1 ? width / 2 : (index / (data.length - 1)) * width,
    y: height - ((point.value - min) / range) * height * (1 - padding * 2) - height * padding,
    value: point.value,
    label: point.month,
  }));
};

export const buildSvgPath = (points: ChartPoint[]): string => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
};

export const buildAreaPath = (linePath: string, height: number, width: number): string => {
  if (!linePath) return '';
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
};


export const createMockKPICard = (overrides: Partial<KPICard> = {}): KPICard => ({
  id: createKPIId('test-kpi-1'),
  label: 'Test Metric',
  value: '$1,000',
  change: '+5%',
  trend: 'up',
  chartData: [10, 20, 15, 25, 30],
  chartColor: '#137fec',
  ...overrides,
});

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: createUserId('test-user-1'),
  name: 'Test User',
  email: 'test@example.com',
  plan: 'Pro',
  status: 'Active',
  joinDate: '2024-01-01',
  initials: 'TU',
  ...overrides,
});

export const createMockChannel = (
  overrides: Partial<AcquisitionChannel> = {}
): AcquisitionChannel => ({
  name: 'Test Channel',
  percentage: createPercentage(42),
  opacity: 1,
  ...overrides,
});