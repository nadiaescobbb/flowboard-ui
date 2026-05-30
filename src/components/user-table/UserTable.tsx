import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '../../types';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { Icon } from '../Icon';
import { Pagination } from './Pagination';
import { SortableHeader } from './SortableHeader';
import { UserMenu } from './UserMenu';
import { SortField, StatusFilter, UserTableAction } from './types';
import { filterAndSortUsers, getUserActionMessage } from './userTable.utils';

interface UserTableProps {
  users: User[];
}

export const UserTable = memo(({ users }: UserTableProps) => {
  const classes = useThemeClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [lastAction, setLastAction] = useState<UserTableAction | null>(null);
  const itemsPerPage = 5;

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const filteredAndSortedUsers = useMemo(
    () => filterAndSortUsers(users, searchQuery, statusFilter, sortField, sortDirection),
    [users, searchQuery, statusFilter, sortField, sortDirection]
  );

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleAction = useCallback((action: UserTableAction) => {
    setLastAction(action);
  }, []);

  const getStatusColor = useCallback((status: User['status']): string => {
    const colors: Record<User['status'], string> = {
      Active: classes.isLight
        ? 'bg-olive/15 text-olive'
        : 'bg-olive/20 text-[#b6c297]',
      Trial: classes.isLight
        ? 'bg-blue/15 text-[#4d789e]'
        : 'bg-blue/20 text-blue',
      Cancelled: classes.isLight
        ? 'bg-primary/15 text-primary'
        : 'bg-primary/20 text-primary',
      Away: classes.isLight
        ? 'bg-[#d9b857]/18 text-[#9a7b27]'
        : 'bg-[#d9b857]/20 text-[#d9b857]',
    };
    return colors[status];
  }, [classes.isLight]);

  const tableHeadClass = classes.isLight
    ? 'bg-[#f6f1e7] text-text-secondary-light'
    : 'bg-white/[0.03] text-text-secondary-dark';

  if (users.length === 0) {
    return (
      <div className={`rounded-md border overflow-hidden ${classes.surface}`}>
        <div className="p-12 text-center">
          <Icon name="group" className={`text-4xl mb-3 ${classes.subtitle}`} aria-hidden="true" />
          <p className={`text-sm font-medium ${classes.title}`}>No Users Yet</p>
          <p className={`text-xs mt-1 ${classes.subtitle}`}>
            Start by inviting your first user
          </p>
          <button
            onClick={() => handleAction({ type: 'invite' })}
            className="mt-4 px-4 py-2 bg-primary text-[#fffdf8] rounded-md text-sm font-display font-semibold hover:bg-primary/90 transition-all"
          >
            Invite User
          </button>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`rounded-md border overflow-hidden ${classes.surface}`}
      aria-labelledby="users-table-title"
    >
      <header className="p-4 md:p-5 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.26em] ${classes.subtitle}`}>
              People
            </p>
            <h3 id="users-table-title" className={`mt-1 text-xl font-display font-bold ${classes.title}`}>
              Recent Users
            </h3>
            <p className={`text-xs mt-1 ${classes.subtitle}`}>
              {filteredAndSortedUsers.length} of {users.length} users
            </p>
          </div>

          <button
            onClick={() => handleAction({ type: 'invite' })}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-[#fffdf8] rounded-md text-sm font-display font-semibold transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <Icon name="add" className="!text-sm" aria-hidden="true" />
            <span>Invite User</span>
          </button>
        </div>

        {lastAction && (
          <div className="mb-4 rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary" role="status">
            {getUserActionMessage(lastAction.type, lastAction.user)}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Icon
              name="search"
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${classes.subtitle} !text-lg pointer-events-none`}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md pl-10 pr-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
              aria-label="Search users"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className={`rounded-md px-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Away">Away</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </header>

      <div className="overflow-x-auto">
        {paginatedUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="search_off" className={`text-4xl mb-3 ${classes.subtitle}`} />
            <p className={`text-sm font-medium ${classes.title}`}>No users found</p>
            <p className={`text-xs mt-1 ${classes.subtitle}`}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[640px]">
            <thead className={tableHeadClass}>
              <tr>
                <SortableHeader field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                  User
                </SortableHeader>
                <SortableHeader field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                  Status
                </SortableHeader>
                <SortableHeader field="plan" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                  Plan
                </SortableHeader>
                <SortableHeader field="joinDate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                  Joined
                </SortableHeader>
                <th className="px-3 md:px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${classes.isLight ? 'divide-border-light' : 'divide-border-dark'}`}>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className={`transition-colors group ${classes.hover}`}>
                  <td className="px-3 md:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-md flex items-center justify-center overflow-hidden ${classes.isLight ? 'bg-[#ece7dc]' : 'bg-white/[0.08]'} flex-shrink-0`}
                        role="img"
                        aria-label={`${user.name} avatar`}
                      >
                        {user.avatar ? (
                          <img className="size-full object-cover" src={user.avatar} alt="" />
                        ) : (
                          <Icon name="person" className="text-slate-400 !text-lg" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-display font-semibold truncate ${classes.title}`}>
                          {user.name}
                        </p>
                        <p className={`text-xs truncate ${classes.subtitle}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 md:px-6 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-display font-bold rounded-md uppercase tracking-[0.14em] ${getStatusColor(user.status)}`}
                      role="status"
                      aria-label={`User status: ${user.status}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-3 md:px-6 py-3.5">
                    <span className={`text-xs md:text-sm ${classes.subtitle}`}>
                      {user.plan}
                    </span>
                  </td>

                  <td className="px-3 md:px-6 py-3.5">
                    <span className={`text-xs md:text-sm ${classes.subtitle}`}>
                      {user.joinDate}
                    </span>
                  </td>

                  <td className="px-3 md:px-6 py-3.5 text-right">
                    <UserMenu
                      user={user}
                      onEdit={(selectedUser) => handleAction({ type: 'edit', user: selectedUser })}
                      onDelete={(selectedUser) => handleAction({ type: 'delete', user: selectedUser })}
                      onViewProfile={(selectedUser) => handleAction({ type: 'view', user: selectedUser })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredAndSortedUsers.length}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        subtitleClass={classes.subtitle}
        buttonClass={classes.button}
        activeButtonClass={classes.buttonActive}
        onPageChange={setCurrentPage}
      />
    </article>
  );
});

UserTable.displayName = 'UserTable';
