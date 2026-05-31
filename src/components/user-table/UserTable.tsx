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
  users: readonly User[];
  externalSearchQuery?: string;
}

export const UserTable = memo(({ users, externalSearchQuery }: UserTableProps) => {
  const classes = useThemeClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [lastAction, setLastAction] = useState<UserTableAction | null>(null);
  const [activeDialog, setActiveDialog] = useState<UserTableAction | null>(null);
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

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const handleAction = useCallback((action: UserTableAction) => {
    setLastAction(action);
    setActiveDialog(action);
  }, []);

  const completeDialogAction = useCallback(() => {
    if (activeDialog) {
      setLastAction(activeDialog);
    }
    setActiveDialog(null);
  }, [activeDialog]);

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
          <p className={`text-sm font-medium ${classes.title}`}>No users have been added</p>
          <p className={`text-xs mt-1 ${classes.subtitle}`}>
            Invite a teammate to start tracking account activity.
          </p>
          <button
            onClick={() => handleAction({ type: 'invite' })}
            className="mt-4 px-4 py-2 bg-primary text-[#fffdf8] rounded-md text-sm font-display font-semibold hover:bg-primary/90 transition-all"
          >
            Invite teammate
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
              Recent users
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
            <span>Invite teammate</span>
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
              placeholder="martina@company.com"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md pl-10 pr-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
              aria-label="Filter users by name, email, plan, or status"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className={`rounded-md px-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
            aria-label="Filter users by status"
          >
            <option value="all">All statuses</option>
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
            <p className={`text-sm font-medium ${classes.title}`}>No users match this view</p>
            <p className={`text-xs mt-1 ${classes.subtitle}`}>
              Clear the search or choose a different status to widen the list.
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
                  <span className="sr-only">User actions</span>
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
                        aria-label={`${user.name} user profile image`}
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
                      aria-label={`${user.name} status is ${user.status}`}
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

      {activeDialog && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-dialog-title"
          onMouseDown={() => setActiveDialog(null)}
        >
          <section
            className={`w-full max-w-lg max-h-[calc(100vh-3rem)] overflow-y-auto rounded-md border p-5 md:p-6 ${classes.isLight ? 'bg-surface-light border-border-light' : 'bg-[#1b1a18] border-border-dark'}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.26em] ${classes.subtitle}`}>
                  People operation
                </p>
                <h3 id="user-dialog-title" className={`mt-1 text-xl font-display font-bold ${classes.title}`}>
                  {activeDialog.type === 'invite' && 'Invite teammate'}
                  {activeDialog.type === 'view' && 'User profile'}
                  {activeDialog.type === 'edit' && 'Edit user'}
                  {activeDialog.type === 'delete' && 'Delete user'}
                </h3>
              </div>
              <button
                onClick={() => setActiveDialog(null)}
                className={`rounded-md p-2 transition-colors ${classes.subtitle} ${classes.hover}`}
                aria-label="Close this dialog and return to the user table"
              >
                <Icon name="close" aria-hidden="true" />
              </button>
            </div>

            {activeDialog.type === 'invite' && (
              <form className="mt-6 space-y-4" onSubmit={(event) => {
                event.preventDefault();
                completeDialogAction();
              }}>
                <label className="block">
                  <span className={`text-xs font-display font-semibold ${classes.subtitle}`}>Email</span>
                  <input
                    type="email"
                    required
                    placeholder="martina@company.com"
                    className={`mt-2 w-full rounded-md border px-3 py-2 text-sm ${classes.input}`}
                  />
                </label>
                <label className="block">
                  <span className={`text-xs font-display font-semibold ${classes.subtitle}`}>Plan</span>
                  <select className={`mt-2 w-full rounded-md border px-3 py-2 text-sm ${classes.input}`}>
                    <option>Enterprise</option>
                    <option>Professional</option>
                    <option value="Free tier">Free tier</option>
                  </select>
                </label>
                <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-display font-semibold text-[#fffdf8] hover:bg-primary/90">
                  Prepare invite
                </button>
              </form>
            )}

            {activeDialog.type === 'view' && activeDialog.user && (
              <div className="mt-6 space-y-3">
                {[
                  ['Name', activeDialog.user.name],
                  ['Email', activeDialog.user.email],
                  ['Status', activeDialog.user.status],
                  ['Plan', activeDialog.user.plan],
                  ['Joined', activeDialog.user.joinDate],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-border-light dark:border-border-dark px-4 py-3">
                    <p className={`text-[10px] uppercase tracking-[0.2em] ${classes.subtitle}`}>{label}</p>
                    <p className={`mt-1 text-sm font-display font-semibold ${classes.title}`}>{value}</p>
                  </div>
                ))}
                <button
                  onClick={() => setActiveDialog({ type: 'edit', user: activeDialog.user })}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-display font-semibold text-[#fffdf8] hover:bg-primary/90"
                >
                  Edit profile
                </button>
              </div>
            )}

            {activeDialog.type === 'edit' && activeDialog.user && (
              <form className="mt-6 space-y-4" onSubmit={(event) => {
                event.preventDefault();
                completeDialogAction();
              }}>
                <label className="block">
                  <span className={`text-xs font-display font-semibold ${classes.subtitle}`}>Name</span>
                  <input
                    defaultValue={activeDialog.user.name}
                    className={`mt-2 w-full rounded-md border px-3 py-2 text-sm ${classes.input}`}
                  />
                </label>
                <label className="block">
                  <span className={`text-xs font-display font-semibold ${classes.subtitle}`}>Status</span>
                  <select defaultValue={activeDialog.user.status} className={`mt-2 w-full rounded-md border px-3 py-2 text-sm ${classes.input}`}>
                    <option>Active</option>
                    <option>Trial</option>
                    <option>Away</option>
                    <option>Cancelled</option>
                  </select>
                </label>
                <label className="block">
                  <span className={`text-xs font-display font-semibold ${classes.subtitle}`}>Plan</span>
                  <select defaultValue={activeDialog.user.plan} className={`mt-2 w-full rounded-md border px-3 py-2 text-sm ${classes.input}`}>
                    <option>Enterprise</option>
                    <option>Professional</option>
                    <option value="Free tier">Free tier</option>
                  </select>
                </label>
                <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-display font-semibold text-[#fffdf8] hover:bg-primary/90">
                  Save user changes
                </button>
              </form>
            )}

            {activeDialog.type === 'delete' && activeDialog.user && (
              <div className="mt-6">
                <p className={`text-sm leading-6 ${classes.subtitle}`}>
                  This demo marks <span className={`font-display font-semibold ${classes.title}`}>{activeDialog.user.name}</span> as removed from this view. No account data is deleted.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={completeDialogAction}
                    className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-display font-semibold text-[#fffdf8] hover:bg-primary/90"
                  >
                    Mark as removed
                  </button>
                  <button
                    onClick={() => setActiveDialog(null)}
                    className={`flex-1 rounded-md border px-4 py-2 text-sm font-display font-semibold ${classes.button}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </article>
  );
});

UserTable.displayName = 'UserTable';
