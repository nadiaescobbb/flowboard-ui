import { Customer } from '../types';

export const createMockCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: 'USR-001',
  name: 'Test Corp',
  email: 'test@corp.com',
  plan: 'Pro',
  mrr: 500,
  status: 'Paid',
  lastActive: '10m ago',
  initials: 'TC',
  color: '#2E6B4E',
  ...overrides,
});
