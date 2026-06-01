import {
  AcquisitionChannel,
  KPICard,
  RevenueDataPoint,
  User,
  createKPIId,
  createPercentage,
  createUserId,
} from '../types';

export const kpiCards: KPICard[] = [
  {
    id: createKPIId('kpi-revenue'),
    label: 'Total revenue',
    value: '$124,592',
    change: '+12.5%',
    trend: 'up',
    chartData: [35, 35, 15, 5],
    chartColor: '#137fec',
  },
  {
    id: createKPIId('kpi-users'),
    label: 'Active users',
    value: '12,842',
    change: '+5.4%',
    trend: 'up',
    chartData: [30, 10, 25, 15],
    chartColor: '#137fec',
  },
  {
    id: createKPIId('kpi-mrr'),
    label: 'MRR growth',
    value: '24.3%',
    change: '+2.1%',
    trend: 'up',
    chartData: [35, 25, 30, 10, 15, 5],
    chartColor: '#137fec',
  },
  {
    id: createKPIId('kpi-conversion'),
    label: 'Conversion rate',
    value: '3.18%',
    change: '-0.4%',
    trend: 'down',
    chartData: [10, 25, 20, 35],
    chartColor: '#f43f5e',
  },
];

export const users: User[] = [
  {
    id: createUserId('user-martina-alvarez'),
    name: 'Martina Alvarez',
    email: 'martina.alvarez@northwindlabs.com',
    plan: 'Enterprise',
    status: 'Active',
    joinDate: '2 mins ago',
    joinedAt: '2026-05-30T22:33:00.000Z',
    initials: 'MA',
  },
  {
    id: createUserId('user-rafael-moreno'),
    name: 'Rafael Moreno',
    email: 'rafael.moreno@lumaops.io',
    plan: 'Professional',
    status: 'Active',
    joinDate: '14 mins ago',
    joinedAt: '2026-05-30T22:21:00.000Z',
    initials: 'RM',
  },
  {
    id: createUserId('user-lucia-torres'),
    name: 'Lucia Torres',
    email: 'lucia.torres@atelierdata.co',
    plan: 'Free tier',
    status: 'Away',
    joinDate: '1 hour ago',
    joinedAt: '2026-05-30T21:35:00.000Z',
    initials: 'LT',
  },
];

export const acquisitionChannels: AcquisitionChannel[] = [
  { name: 'Direct search', percentage: createPercentage(42), opacity: 1 },
  { name: 'Social media', percentage: createPercentage(28), opacity: 0.6 },
  { name: 'Paid advertisements', percentage: createPercentage(18), opacity: 0.4 },
  { name: 'Referral programs', percentage: createPercentage(12), opacity: 0.2 },
];

export const weeklyRevenueData: RevenueDataPoint[] = [
  { month: 'MON', value: 250 },
  { month: 'TUE', value: 240 },
  { month: 'WED', value: 120 },
  { month: 'THU', value: 260 },
  { month: 'FRI', value: 180 },
  { month: 'SAT', value: 80 },
  { month: 'SUN', value: 150 },
];

export const monthlyRevenueData: RevenueDataPoint[] = [
  { month: 'Jan', value: 160 },
  { month: 'Feb', value: 140 },
  { month: 'Mar', value: 150 },
  { month: 'Apr', value: 110 },
  { month: 'May', value: 130 },
  { month: 'Jun', value: 60 },
  { month: 'Jul', value: 80 },
  { month: 'Aug', value: 30 },
  { month: 'Sep', value: 90 },
  { month: 'Oct', value: 70 },
  { month: 'Nov', value: 50 },
  { month: 'Dec', value: 40 },
];
