import { KPICard, User, AcquisitionChannel, RevenueDataPoint } from '../types';

export const kpiCardsLight: KPICard[] = [
  {
    id: '1',
    label: 'Total Revenue',
    value: '$124,500',
    change: '12%',
    trend: 'up',
    chartData: [25, 5, 20, 10, 22, 5, 15],
    chartColor: '#10b981',
  },
  {
    id: '2',
    label: 'Monthly Growth',
    value: '+8.4%',
    change: '8.4%',
    trend: 'up',
    chartData: [28, 15, 22, 10, 5],
    chartColor: '#10b981',
  },
  {
    id: '3',
    label: 'Active Users',
    value: '1,240',
    change: '5%',
    trend: 'up',
    chartData: [20, 25, 15, 10, 5],
    chartColor: '#137fec',
  },
  {
    id: '4',
    label: 'Conversion Rate',
    value: '3.2%',
    change: '0.5%',
    trend: 'down',
    chartData: [5, 15, 10, 25],
    chartColor: '#f43f5e',
  },
];

export const kpiCardsDark: KPICard[] = [
  {
    id: '1',
    label: 'Total Revenue',
    value: '$124,592',
    change: '+12.5%',
    trend: 'up',
    chartData: [35, 35, 15, 5],
    chartColor: '#137fec',
  },
  {
    id: '2',
    label: 'Active Users',
    value: '12,842',
    change: '+5.4%',
    trend: 'up',
    chartData: [30, 10, 25, 15],
    chartColor: '#137fec',
  },
  {
    id: '3',
    label: 'MRR Growth',
    value: '24.3%',
    change: '+2.1%',
    trend: 'up',
    chartData: [35, 25, 30, 10, 15, 5],
    chartColor: '#137fec',
  },
  {
    id: '4',
    label: 'Conversion Rate',
    value: '3.18%',
    change: '-0.4%',
    trend: 'down',
    chartData: [10, 25, 20, 35],
    chartColor: '#f43f5e',
  },
];

export const usersLight: User[] = [
  {
    id: '1',
    name: 'Sarah Koenig',
    email: 'sarah.k@flow.com',
    plan: 'Enterprise',
    status: 'Active',
    joinDate: 'Oct 12, 2023',
    initials: 'SK',
  },
  {
    id: '2',
    name: 'James Dalton',
    email: 'j.dalton@startup.io',
    plan: 'Pro Monthly',
    status: 'Trial',
    joinDate: 'Oct 14, 2023',
    initials: 'JD',
  },
  {
    id: '3',
    name: 'Elena Loft',
    email: 'elena@design.com',
    plan: 'Free Tier',
    status: 'Cancelled',
    joinDate: 'Sep 28, 2023',
    initials: 'EL',
  },
  {
    id: '4',
    name: 'Marcus Brown',
    email: 'marcus@tech.com',
    plan: 'Pro Yearly',
    status: 'Active',
    joinDate: 'Oct 10, 2023',
    initials: 'MB',
  },
];

export const usersDark: User[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah@acme.com',
    plan: 'Enterprise',
    status: 'Active',
    joinDate: '2 mins ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQxGWe2ZmdgK78zfBV6KvJ_8HcepPpGhh7nN2DMmliYn5PWiazRqvoq7L5pDUWvIbusQ50x73JWzUyMQUvK849hkHGGfOWBeiMjR05oLhK8Esrna-2CAVUNw7zIFRjGYWWNINyaQGRBPJoaXWGCtDAR_AdnrIBOYdNxT6GhMBjoIWFGvRGvHKb8wz3MFRgN8RN0sW-Kc2YonbcXTvKz0i4afz8FTFYnqKJjNqtqogYtYSbVGZDs-KzpZCITqEFt712tGOypfgYals',
    initials: 'SJ',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@stripe.co',
    plan: 'Professional',
    status: 'Active',
    joinDate: '14 mins ago',
    initials: 'MC',
  },
  {
    id: '3',
    name: 'David Miller',
    email: 'david.miller@tech.io',
    plan: 'Free Tier',
    status: 'Away',
    joinDate: '1 hour ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrgEprxCB-aQL2wppJZn90pJIjIu-Z0ng3tQq-KxcpbodDhHQvGdx-vakjFrPFJGjURy3ORc-fZQY4kMDUxnfcXwrNqXJVK85z4CLiPEL8Ig5wH89RTqHQmly_iLyuSmnX60fRrCW2kav-Iv2yC48Yf6tlPoVhYxeQIVwEPCFPBhwLXTNoSE7ABaTzupKDcDvqK5dIeyreNXlbywANlULpRu2zlMQ1g3CQsXyRR_hQzOBZPcYGrBNqjVh09SlsLOPztAQVD1YsUUI',
    initials: 'DM',
  },
];

export const acquisitionChannelsLight: AcquisitionChannel[] = [
  { name: 'Organic Search', percentage: 42, opacity: 1 },
  { name: 'Social Media', percentage: 28, opacity: 0.7 },
  { name: 'Direct Visit', percentage: 18, opacity: 0.5 },
  { name: 'Paid Ads', percentage: 12, opacity: 0.3 },
];

export const acquisitionChannelsDark: AcquisitionChannel[] = [
  { name: 'Direct Search', percentage: 42, opacity: 1 },
  { name: 'Social Media', percentage: 28, opacity: 0.6 },
  { name: 'Paid Advertisements', percentage: 18, opacity: 0.4 },
  { name: 'Referral Programs', percentage: 12, opacity: 0.2 },
];

export const revenueDataLight: RevenueDataPoint[] = [
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

export const revenueDataDark: RevenueDataPoint[] = [
  { month: 'MON', value: 250 },
  { month: 'TUE', value: 240 },
  { month: 'WED', value: 120 },
  { month: 'THU', value: 260 },
  { month: 'FRI', value: 180 },
  { month: 'SAT', value: 80 },
  { month: 'SUN', value: 150 },
];