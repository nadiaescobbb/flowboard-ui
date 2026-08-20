import { Customer, MonthlyMetric, ChannelShare, KpiSummary } from '../types';

export const INITIAL_MRR_DATA: MonthlyMetric[] = [
  { month: 'Jan', mrr: 112000, arr: 1344000, churn: 1.8 },
  { month: 'Feb', mrr: 118500, arr: 1422000, churn: 2.1 },
  { month: 'Mar', mrr: 122300, arr: 1467600, churn: 1.6 },
  { month: 'Apr', mrr: 119800, arr: 1437600, churn: 2.4 },
  { month: 'May', mrr: 128400, arr: 1540800, churn: 1.9 },
  { month: 'Jun', mrr: 131200, arr: 1574400, churn: 1.7 },
  { month: 'Jul', mrr: 135600, arr: 1627200, churn: 2.0 },
  { month: 'Aug', mrr: 140100, arr: 1681200, churn: 1.5 },
  { month: 'Sep', mrr: 143800, arr: 1725600, churn: 1.8 },
  { month: 'Oct', mrr: 141200, arr: 1694400, churn: 2.2 },
  { month: 'Nov', mrr: 146900, arr: 1762800, churn: 1.6 },
  { month: 'Dec', mrr: 148450, arr: 1781400, churn: 2.1 },
];

export const INITIAL_CHANNEL_DATA: ChannelShare[] = [
  { name: 'Direct / Inbound', value: 54200, pct: 36.5, color: '#D9532F' },
  { name: 'Organic Search', value: 32800, pct: 22.1, color: '#2E6B4E' },
  { name: 'Partner Referral', value: 24600, pct: 16.6, color: '#D97706' },
  { name: 'Paid Social', value: 19400, pct: 13.1, color: '#4A6FA5' },
  { name: 'Product-Led Growth', value: 17450, pct: 11.7, color: '#7C6FAA' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'USR-00291', name: 'Meridian Analytics', email: 'ops@meridian.io', plan: 'Enterprise', mrr: 4200, status: 'Paid', lastActive: '12m ago', initials: 'MA', color: '#2E6B4E' },
  { id: 'USR-00347', name: 'Vertex Systems', email: 'billing@vertex.co', plan: 'Pro', mrr: 890, status: 'Retrying', lastActive: '3h ago', initials: 'VS', color: '#D97706' },
  { id: 'USR-00412', name: 'Foundry Labs', email: 'team@foundry.dev', plan: 'Enterprise', mrr: 6100, status: 'Paid', lastActive: '1h ago', initials: 'FL', color: '#4A6FA5' },
  { id: 'USR-00158', name: 'Sable Commerce', email: 'admin@sablecommerce.com', plan: 'Pro', mrr: 450, status: 'Failed', lastActive: '2d ago', initials: 'SC', color: '#C53030' },
  { id: 'USR-00589', name: 'Northgate Capital', email: 'finance@northgate.vc', plan: 'Enterprise', mrr: 8800, status: 'Paid', lastActive: '34m ago', initials: 'NC', color: '#2E6B4E' },
  { id: 'USR-00633', name: 'Prismatic Studio', email: 'hello@prismatic.io', plan: 'Free', mrr: 0, status: 'Paid', lastActive: '5h ago', initials: 'PS', color: '#9B9690' },
  { id: 'USR-00701', name: 'Cascade Data', email: 'ops@cascadedata.com', plan: 'Pro', mrr: 670, status: 'Retrying', lastActive: '18h ago', initials: 'CD', color: '#D97706' },
  { id: 'USR-00822', name: 'Helios Robotics', email: 'dev@heliosrobotics.io', plan: 'Enterprise', mrr: 5400, status: 'Paid', lastActive: '2h ago', initials: 'HR', color: '#4A6FA5' },
  { id: 'USR-00944', name: 'Onyx Research', email: 'contact@onyxresearch.ai', plan: 'Pro', mrr: 340, status: 'Paid', lastActive: '6h ago', initials: 'OR', color: '#2E6B4E' },
  { id: 'USR-01012', name: 'Pelican Finance', email: 'accounts@pelican.finance', plan: 'Free', mrr: 0, status: 'Failed', lastActive: '4d ago', initials: 'PF', color: '#C53030' },
];

export const INITIAL_KPI_SUMMARY: KpiSummary = {
  mrr: 148450,
  mrrGrowth: 12.4,
  arrRunRate: 1781400,
  nrr: 108.2,
  nrrTarget: 110.0,
  activeSubscriptions: 3420,
  newThisMonth: 148,
  planBreakdown: {
    enterprise: 312,
    pro: 1840,
    free: 1268,
  },
  churnRiskScore: 2.1,
  flaggedAccountsCount: 14,
};
