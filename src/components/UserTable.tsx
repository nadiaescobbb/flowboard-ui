import { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { User } from '../types';
import { Icon } from './Icon';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface UserTableProps {
  users: User[];
}

type SortField = 'name' | 'email' | 'plan' | 'status' | 'joinDate';
type SortDirection = 'asc' | 'desc';


interface UserMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewProfile: (user: User) => void;
}

const UserMenu = memo(({ user, onEdit, onDelete, onViewProfile }: UserMenuProps) => {
  const classes = useThemeClasses();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg transition-colors ${classes.subtitle} hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50`}
        aria-label={`Actions for ${user.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon name="more_horiz" aria-hidden="true" />
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-10 py-1 ${classes.surface}`}
          role="menu"
        >
          <button
            onClick={() => {
              onViewProfile(user);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${classes.subtitle} ${classes.hover}`}
            role="menuitem"
          >
            <Icon name="person" className="!text-base" aria-hidden="true" />
            <span>View Profile</span>
          </button>
          <button
            onClick={() => {
              onEdit(user);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${classes.subtitle} ${classes.hover}`}
            role="menuitem"
          >
            <Icon name="edit" className="!text-base" aria-hidden="true" />
            <span>Edit User</span>
          </button>
          <div className={`my-1 border-t ${classes.divider}`}></div>
          <button
            onClick={() => {
              onDelete(user);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            role="menuitem"
          >
            <Icon name="delete" className="!text-base" aria-hidden="true" />
            <span>Delete User</span>
          </button>
        </div>
      )}
    </div>
  );
});

UserMenu.displayName = 'UserMenu';

export const UserTable = memo(({ users }: UserTableProps) => {
  const classes = useThemeClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<User['status'] | 'all'>('all');
  const itemsPerPage = 5;

 
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  // Filtrar y ordenar usuarios
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.plan.toLowerCase().includes(query)
      );
    }

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [users, searchQuery, sortField, sortDirection, statusFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Funciones de acción
  const handleInviteUser = () => console.log('Invite user');
  const handleViewProfile = (user: User) => console.log('View profile:', user);
  const handleEditUser = (user: User) => console.log('Edit user:', user);
  const handleDeleteUser = (user: User) => console.log('Delete user:', user);

  // Función para obtener color de status
  const getStatusColor = useCallback((status: User['status']): string => {
    const colors: Record<User['status'], string> = {
      Active: classes.isLight
        ? 'bg-emerald-100 text-emerald-600'
        : 'bg-emerald-500/10 text-emerald-500',
      Trial: classes.isLight
        ? 'bg-blue-100 text-primary'
        : 'bg-primary/10 text-primary',
      Cancelled: classes.isLight
        ? 'bg-rose-100 text-rose-600'
        : 'bg-rose-500/10 text-rose-500',
      Away: classes.isLight
        ? 'bg-amber-100 text-amber-600'
        : 'bg-amber-500/10 text-amber-500',
    };
    return colors[status];
  }, [classes.isLight]);

  // Componente de header de columna ordenable
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th className="px-3 md:px-6 py-4">
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-primary transition-colors focus:outline-none focus:text-primary group"
        aria-label={`Sort by ${field}`}
      >
        <span>{children}</span>
        <Icon
          name={
            sortField === field
              ? sortDirection === 'asc'
                ? 'arrow_upward'
                : 'arrow_downward'
              : 'unfold_more'
          }
          className="!text-xs opacity-50 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      </button>
    </th>
  );

  const tableHeadClass = classes.isLight
    ? 'bg-gray-50 text-text-secondary-light'
    : 'bg-white/[0.02] text-slate-500';

  if (users.length === 0) {
    return (
      <div className={`rounded-xl border overflow-hidden ${classes.surface}`}>
        <div className="p-12 text-center">
          <div className={`text-4xl mb-3 ${classes.subtitle}`}>👥</div>
          <p className={`text-sm font-medium ${classes.title}`}>No Users Yet</p>
          <p className={`text-xs mt-1 ${classes.subtitle}`}>
            Start by inviting your first user
          </p>
          <button
            onClick={handleInviteUser}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            Invite User
          </button>
        </div>
      </div>
    );
  }

  return (
    <article 
      className={`rounded-xl border overflow-hidden ${classes.surface}`}
      aria-labelledby="users-table-title"
    >
      
      {/* Header */}
      <header className="p-4 md:p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h3 id="users-table-title" className={`text-base md:text-lg font-semibold ${classes.title}`}>
              Recent Users
            </h3>
            <p className={`text-xs mt-0.5 ${classes.subtitle}`}>
              {filteredAndSortedUsers.length} of {users.length} users
            </p>
          </div>

          <button
            onClick={handleInviteUser}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold transition-all hover:bg-primary/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg shadow-primary/20"
          >
            <Icon name="add" className="!text-sm" aria-hidden="true" />
            <span>Invite User</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
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
              className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${classes.input}`}
              aria-label="Search users"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as User['status'] | 'all')}
            className={`rounded-lg px-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${classes.input}`}
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

      {/* Table */}
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
                <SortableHeader field="name">User</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="plan">Plan</SortableHeader>
                <SortableHeader field="joinDate">Joined</SortableHeader>
                <th className="px-3 md:px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${classes.isLight ? 'divide-border-light' : 'divide-border-dark'}`}>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors group ${classes.hover}`}
                >
                  <td className="px-3 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`size-9 rounded-full flex items-center justify-center overflow-hidden ${classes.isLight ? 'bg-slate-200' : 'bg-slate-800'} flex-shrink-0`}
                        role="img"
                        aria-label={`${user.name} avatar`}
                      >
                        {user.avatar ? (
                          <img
                            className="size-full object-cover"
                            src={user.avatar}
                            alt=""
                          />
                        ) : (
                          <Icon name="person" className="text-slate-400 !text-lg" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${classes.title}`}>
                          {user.name}
                        </p>
                        <p className={`text-xs truncate ${classes.subtitle}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 md:px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getStatusColor(user.status)}`}
                      role="status"
                      aria-label={`User status: ${user.status}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-3 md:px-6 py-4">
                    <span className={`text-xs md:text-sm ${classes.subtitle}`}>
                      {user.plan}
                    </span>
                  </td>

                  <td className="px-3 md:px-6 py-4">
                    <span className={`text-xs md:text-sm ${classes.subtitle}`}>
                      {user.joinDate}
                    </span>
                  </td>

                  <td className="px-3 md:px-6 py-4 text-right">
                    <UserMenu
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      onViewProfile={handleViewProfile}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <footer className="p-3 md:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`text-xs md:text-sm ${classes.subtitle}`}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of{' '}
            {filteredAndSortedUsers.length}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${classes.button} hover:scale-105`}
              aria-label="Previous page"
            >
              <Icon name="chevron_left" aria-hidden="true" />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                // Mostrar solo algunas páginas
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                        currentPage === page
                          ? classes.buttonActive
                          : classes.button
                      } hover:scale-105`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className={`px-2 ${classes.subtitle}`}>...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${classes.button} hover:scale-105`}
              aria-label="Next page"
            >
              <Icon name="chevron_right" aria-hidden="true" />
            </button>
          </div>
        </footer>
      )}
    </article>
  );
});

UserTable.displayName = 'UserTable';