import {
  KPICard,
  User,
  AcquisitionChannel,
  DashboardData,
  RevenueDataPoint,
  RevenueDataSeries,
  Result,
  ok,
  err,
  TypeGuard,
  UserStatus,
  TrendDirection,
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
  if (!isString(v.joinedAt) || Number.isNaN(Date.parse(v.joinedAt))) return false;
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

export const validateRevenueDataSeries: TypeGuard<RevenueDataSeries> = (
  v
): v is RevenueDataSeries => {
  if (!isObject(v)) return false;
  if (!Array.isArray(v.weekly)) return false;
  if (!Array.isArray(v.monthly)) return false;
  if (!v.weekly.every(validateRevenueDataPoint)) return false;
  if (!v.monthly.every(validateRevenueDataPoint)) return false;
  return true;
};

export const validateDashboardData = (v: unknown): Result<DashboardData> => {
  if (!isObject(v)) return err(new TypeError('Dashboard payload must be an object'));
  if (!validateRevenueDataSeries(v.revenueData)) {
    return err(new TypeError('Dashboard payload has invalid revenueData'));
  }

  const kpiCards = validateArrayOf(v.kpiCards, validateKPICard);
  if (!kpiCards.ok) return err(new TypeError(`Dashboard payload has invalid kpiCards: ${kpiCards.error.message}`));

  const users = validateArrayOf(v.users, validateUser);
  if (!users.ok) return err(new TypeError(`Dashboard payload has invalid users: ${users.error.message}`));

  const channels = validateArrayOf(v.channels, validateAcquisitionChannel);
  if (!channels.ok) return err(new TypeError(`Dashboard payload has invalid channels: ${channels.error.message}`));

  return ok({
    kpiCards: kpiCards.value,
    users: users.value,
    channels: channels.value,
    revenueData: v.revenueData,
  });
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
  const range = max - min || 1;

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
