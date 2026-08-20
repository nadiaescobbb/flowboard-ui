import { Customer } from '../../types';

export function filterCustomers(customers: Customer[], query: string): Customer[] {
  if (!query) return customers;
  const q = query.toLowerCase();
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
  );
}
