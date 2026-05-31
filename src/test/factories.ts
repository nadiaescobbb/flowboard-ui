import {
  AcquisitionChannel,
  KPICard,
  User,
  createKPIId,
  createPercentage,
  createUserId,
} from '../types';

export const createMockKPICard = (overrides: Partial<KPICard> = {}): KPICard => ({
  id: createKPIId('test-kpi-1'),
  label: 'Test metric',
  value: '$1,000',
  change: '+5%',
  trend: 'up',
  chartData: [10, 20, 15, 25, 30],
  chartColor: '#137fec',
  ...overrides,
});

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: createUserId('test-user-1'),
  name: 'Test user',
  email: 'test@example.com',
  plan: 'Pro',
  status: 'Active',
  joinDate: '2024-01-01',
  joinedAt: '2024-01-01T00:00:00.000Z',
  initials: 'TU',
  ...overrides,
});

export const createMockChannel = (
  overrides: Partial<AcquisitionChannel> = {}
): AcquisitionChannel => ({
  name: 'Test channel',
  percentage: createPercentage(42),
  opacity: 1,
  ...overrides,
});
