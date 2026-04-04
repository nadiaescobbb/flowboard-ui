export interface KPICard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  chartData: number[];
  chartColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'Active' | 'Trial' | 'Cancelled' | 'Away';
  joinDate: string;
  avatar?: string;
  initials: string;
}

export interface AcquisitionChannel {
  name: string;
  percentage: number;
  opacity: number;
}

export interface RevenueDataPoint {
  month: string;
  value: number;
}

export type Theme = 'light' | 'dark';
