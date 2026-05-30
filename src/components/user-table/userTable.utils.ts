import { User } from '../../types';
import { SortDirection, SortField, StatusFilter, UserAction } from './types';

export const filterAndSortUsers = (
  users: readonly User[],
  searchQuery: string,
  statusFilter: StatusFilter,
  sortField: SortField,
  sortDirection: SortDirection
): User[] => {
  const query = searchQuery.trim().toLowerCase();

  const filtered = users.filter((user) => {
    const matchesQuery =
      query.length === 0 ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.plan.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return [...filtered].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getUserActionMessage = (type: UserAction, user?: User): string => {
  const subject = user ? user.name : 'a new user';

  const messages: Record<UserAction, string> = {
    invite: 'Invite flow queued for a new user. In production this would open an invitation modal.',
    view: `Profile preview selected for ${subject}.`,
    edit: `Edit flow selected for ${subject}.`,
    delete: `Delete confirmation selected for ${subject}.`,
  };

  return messages[type];
};
