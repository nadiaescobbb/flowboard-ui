import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { useThemeClasses } from '../hooks/useThemeClasses';

type HeaderPanel = 'profile' | 'settings' | 'help' | 'notifications';

interface HeaderProps {
  onGlobalSearch: (query: string) => void;
}

const currentUser = {
  name: 'Nadia Escobar',
  email: 'nadia@flowboard.io',
  role: 'Admin',
  status: 'Online',
  initials: 'NE',
};

const notifications = [
  {
    id: 1,
    title: 'Martina Alvarez joined Enterprise',
    detail: 'New account owner added from Northwind Labs. Review onboarding milestones.',
    time: '2 min ago',
  },
  {
    id: 2,
    title: 'Rafael Moreno renewed Professional',
    detail: 'The invoice cleared and the subscription is active for the next billing cycle.',
    time: '1 hour ago',
  },
  {
    id: 3,
    title: 'Revenue sync completed',
    detail: 'The analytics worker processed acquisition, MRR, and user activity without errors.',
    time: '3 hours ago',
  },
];

export const Header = ({ onGlobalSearch }: HeaderProps) => {
  const classes = useThemeClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<HeaderPanel | null>(null);
  const [readNotificationIds, setReadNotificationIds] = useState<number[]>([3]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !readNotificationIds.includes(notification.id)).length,
    [readNotificationIds]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePanel(null);
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowMobileSearch(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!activePanel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.scrollTo({ top: 0, left: 0 });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activePanel]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      setActionMessage('Type a name, email, plan, or status to filter users.');
      return;
    }

    onGlobalSearch(query);
    setShowMobileSearch(false);
    setActionMessage(`User table filtered by "${query}".`);
  };

  useEffect(() => {
    if (!actionMessage) return;

    const timeoutId = window.setTimeout(() => {
      setActionMessage(null);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [actionMessage]);

  const openPanel = (panel: HeaderPanel) => {
    setActivePanel(panel);
    setShowNotifications(false);
    setShowUserMenu(false);

    if (panel === 'notifications') {
      setReadNotificationIds(notifications.map((notification) => notification.id));
    }
  };

  const openNotification = (notificationId: number) => {
    setReadNotificationIds((currentIds) =>
      currentIds.includes(notificationId) ? currentIds : [...currentIds, notificationId]
    );
    openPanel('notifications');
  };

  const panelTitle = {
    profile: 'Profile',
    settings: 'Workspace settings',
    help: 'Help and support',
    notifications: 'Notifications',
  }[activePanel ?? 'profile'];

  const panel = activePanel ? (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="header-panel-title"
      onMouseDown={() => setActivePanel(null)}
    >
      <section
        key={activePanel}
        ref={panelRef}
        className={`w-full max-w-xl max-h-[min(720px,calc(100vh-2rem))] overflow-y-auto rounded-md border shadow-[0_28px_90px_rgba(0,0,0,0.45)] ${classes.isLight ? 'bg-surface-light border-border-light' : 'bg-[#1b1a18] border-border-dark'}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={`sticky top-0 z-10 border-b px-5 py-5 md:px-6 ${classes.isLight ? 'bg-surface-light/95 border-border-light' : 'bg-[#1b1a18]/95 border-border-dark'} backdrop-blur-xl`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.26em] ${classes.subtitle}`}>
                FlowBoard
              </p>
              <h2 id="header-panel-title" className={`mt-2 text-2xl font-display font-bold leading-tight ${classes.title}`}>
                {panelTitle}
              </h2>
            </div>
            <button
              onClick={() => setActivePanel(null)}
              className={`rounded-md p-2 transition-colors ${classes.subtitle} ${classes.hover}`}
              aria-label="Close this panel and return to the dashboard"
            >
              <Icon name="close" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          {activePanel === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-md border border-border-light dark:border-border-dark bg-primary/10 px-4 py-4">
                <div className="relative size-12 rounded-md bg-primary/15 border border-primary/35 flex items-center justify-center text-primary font-display text-sm font-bold">
                  {currentUser.initials}
                  <span className="absolute -right-1 -bottom-1 size-3.5 rounded-full border-2 border-[#1b1a18] bg-olive" aria-hidden="true"></span>
                </div>
                <div>
                  <p className={`text-base font-display font-bold ${classes.title}`}>{currentUser.name}</p>
                  <p className={`text-xs ${classes.subtitle}`}>Signed in user - {currentUser.status}</p>
                </div>
              </div>
              {[
                ['Name', currentUser.name],
                ['Email', currentUser.email],
                ['Role', currentUser.role],
                ['Access', 'Revenue, Users, Settings'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-border-light dark:border-border-dark px-4 py-3">
                  <p className={`text-[10px] uppercase tracking-[0.2em] ${classes.subtitle}`}>{label}</p>
                  <p className={`mt-1 text-sm font-display font-semibold ${classes.title}`}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {activePanel === 'settings' && (
            <form className="space-y-4" onSubmit={(event) => {
              event.preventDefault();
              setActionMessage('Workspace settings saved.');
              setActivePanel(null);
            }}>
              {['Weekly digest', 'Payment alerts', 'New user alerts'].map((setting) => (
                <label key={setting} className="flex items-center justify-between gap-4 rounded-md border border-border-light dark:border-border-dark px-4 py-3">
                  <span className={`text-sm font-display font-semibold ${classes.title}`}>{setting}</span>
                  <input type="checkbox" defaultChecked className="size-4 accent-primary" />
                </label>
              ))}
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-display font-semibold text-[#fffdf8] hover:bg-primary/90">
                Save settings
              </button>
            </form>
          )}

          {activePanel === 'help' && (
            <form className="space-y-4" onSubmit={(event) => {
              event.preventDefault();
              setActionMessage('Support ticket created.');
              setActivePanel(null);
            }}>
              <label className="block">
                <span className={`text-xs font-display font-semibold ${classes.subtitle}`}>Topic</span>
                <select className={`mt-2 w-full rounded-md border px-3 py-2 text-sm ${classes.input}`}>
                  <option>Dashboard data issue</option>
                  <option>Export request</option>
                  <option>Access problem</option>
                </select>
              </label>
              <label className="block">
                <span className={`text-xs font-display font-semibold ${classes.subtitle}`}>Message</span>
                <textarea className={`mt-2 min-h-28 w-full rounded-md border px-3 py-2 text-sm ${classes.input}`} defaultValue="Need help reviewing this week's dashboard." />
              </label>
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-display font-semibold text-[#fffdf8] hover:bg-primary/90">
                Send request
              </button>
            </form>
          )}

          {activePanel === 'notifications' && (
            <div className="space-y-3">
              <p className={`text-sm leading-6 ${classes.subtitle}`}>
                Latest product and revenue operations updates for the active workspace.
              </p>
              {notifications.map((notification) => (
                <article key={notification.id} className="rounded-md border border-border-light dark:border-border-dark px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={`text-sm font-display font-semibold ${classes.title}`}>{notification.title}</h3>
                    <span className={`text-[11px] ${classes.subtitle}`}>{notification.time}</span>
                  </div>
                  <p className={`mt-2 text-sm leading-6 ${classes.subtitle}`}>{notification.detail}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  ) : null;

  return (
    <>
    <header
      className={`sticky top-0 z-40 min-h-20 border-b backdrop-blur-xl ${classes.surface}`}
      role="banner"
    >
      <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
          <div className="w-10 md:hidden"></div>

          <div className="min-w-0">
            <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.28em] ${classes.subtitle}`}>
              Weekly brief
            </p>
            <h2 className={`text-lg md:text-2xl font-display font-bold leading-tight ${classes.title}`}>
              Revenue intelligence
            </h2>
          </div>

          <form
            onSubmit={handleSearch}
            className="relative max-w-md hidden lg:block flex-1"
            role="search"
          >
            <label htmlFor="global-search" className="sr-only">
              Filter users
            </label>
            <Icon
              name="search"
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${classes.subtitle} !text-lg pointer-events-none`}
              aria-hidden="true"
            />
            <input
              id="global-search"
              type="search"
              placeholder="martina@company.com"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={`w-full rounded-md pl-10 pr-4 py-2 text-sm border focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
              aria-label="Filter the user table by name, email, plan, or status"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setShowMobileSearch((isOpen) => !isOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${classes.subtitle} hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
            aria-label="Open mobile search to filter users"
            aria-expanded={showMobileSearch}
          >
            <Icon name="search" aria-hidden="true" />
          </button>

          <div className="hidden xl:grid grid-cols-3 divide-x divide-border-light dark:divide-border-dark rounded-md border border-border-light dark:border-border-dark overflow-hidden">
            {[
              ['Runway', '18 mo'],
              ['ARR', '$1.49m'],
              ['Target', '+8.2%'],
            ].map(([label, value]) => (
              <button
                key={label}
                onClick={() => setActionMessage(`${label} metric selected for the weekly brief.`)}
                className={`px-4 py-2 text-left transition-colors ${classes.hover}`}
              >
                <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.2em] ${classes.subtitle}`}>
                  {label}
                </p>
                <p className={`text-sm font-display font-bold ${classes.title}`}>{value}</p>
              </button>
            ))}
          </div>

          <div className="relative hidden sm:block" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((isOpen) => !isOpen)}
              className={`p-2 rounded-md transition-colors relative ${classes.subtitle} hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
              aria-label="Open revenue operations notifications"
              aria-expanded={showNotifications}
              aria-haspopup="true"
            >
              <Icon name="notifications" aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-[#fffdf8]"
                  role="status"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-md border overflow-hidden z-[90] ${classes.isLight ? 'bg-surface-light border-border-light shadow-[0_24px_70px_rgba(20,20,19,0.18)]' : 'bg-[#1b1a18] border-border-dark shadow-[0_28px_80px_rgba(0,0,0,0.58)]'}`}
                role="menu"
                aria-label="Recent revenue operations updates"
              >
                <div className="p-4 border-b border-border-light dark:border-border-dark flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`font-display font-semibold text-sm md:text-base ${classes.title}`}>
                      Notifications
                    </h3>
                    <p className={`text-xs mt-0.5 ${classes.subtitle}`}>{unreadCount} unread updates</p>
                  </div>
                  <button
                    onClick={() => openPanel('notifications')}
                    className="text-xs font-display font-semibold text-primary hover:text-primary/80"
                  >
                    View all updates
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => {
                    const unread = !readNotificationIds.includes(notification.id);

                    return (
                      <button
                        key={notification.id}
                        className={`w-full p-4 text-left transition-colors border-b last:border-b-0 border-border-light dark:border-border-dark ${classes.hover} ${unread ? 'bg-primary/5' : ''}`}
                        onClick={() => openNotification(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {unread && (
                            <span className="size-2 bg-primary rounded-full mt-2 flex-shrink-0" aria-label="Unread"></span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-display font-semibold ${classes.title} truncate`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs mt-1 ${classes.subtitle}`}>{notification.time}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="relative hidden md:block" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((isOpen) => !isOpen)}
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md p-1 -m-1"
              aria-label="Open profile and workspace actions"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-display font-semibold leading-none ${classes.title}`}>
                  {currentUser.name}
                </p>
                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <span className="size-1.5 rounded-full bg-olive" aria-hidden="true"></span>
                  <p className={`text-[11px] ${classes.subtitle}`}>{currentUser.role}</p>
                </div>
              </div>

              <div
                className="relative size-10 rounded-md bg-primary/15 border border-primary/35 flex items-center justify-center text-primary font-display text-xs font-bold"
                role="img"
                aria-label={`${currentUser.name} user profile`}
              >
                {currentUser.initials}
                <span className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-[#141413] bg-olive" aria-hidden="true"></span>
              </div>
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-md border overflow-hidden z-[90] ${classes.isLight ? 'bg-surface-light border-border-light shadow-[0_24px_70px_rgba(20,20,19,0.18)]' : 'bg-[#1b1a18] border-border-dark shadow-[0_28px_80px_rgba(0,0,0,0.58)]'}`}
                role="menu"
                aria-label="Profile and workspace actions"
              >
                <div className="p-3 border-b border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-md bg-primary/15 border border-primary/35 flex items-center justify-center text-primary font-display text-xs font-bold">
                      {currentUser.initials}
                      <span className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-[#1b1a18] bg-olive" aria-hidden="true"></span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-display font-semibold ${classes.title}`}>{currentUser.name}</p>
                      <p className={`text-xs truncate ${classes.subtitle}`}>{currentUser.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  {[
                    { icon: 'person', label: 'Profile', panel: 'profile' as HeaderPanel },
                    { icon: 'settings', label: 'Settings', panel: 'settings' as HeaderPanel },
                    { icon: 'help', label: 'Help and support', panel: 'help' as HeaderPanel },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => openPanel(item.panel)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${classes.subtitle} ${classes.hover}`}
                      role="menuitem"
                    >
                      <Icon name={item.icon} className="!text-lg" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileSearch && (
        <div className="lg:hidden fixed inset-x-0 top-20 p-4 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark z-20">
          <form onSubmit={handleSearch} className="relative">
            <Icon
              name="search"
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${classes.subtitle} !text-xl pointer-events-none`}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="martina@company.com"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={`w-full rounded-md pl-10 pr-4 py-2 text-sm border focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
              aria-label="Filter users by name, email, plan, or status"
              autoFocus
            />
          </form>
        </div>
      )}

      {actionMessage && (
        <div
          className={`fixed right-4 top-24 z-[95] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-md border px-3 py-2 text-xs shadow-[0_18px_50px_rgba(0,0,0,0.28)] ${classes.isLight ? 'border-primary/20 bg-surface-light text-primary' : 'border-primary/25 bg-[#1b1a18] text-primary'}`}
          role="status"
        >
          <Icon name="check_circle" className="!text-base" aria-hidden="true" />
          <span>{actionMessage}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="ml-1 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Dismiss status message"
          >
            <Icon name="close" className="!text-sm" aria-hidden="true" />
          </button>
        </div>
      )}

    </header>
    {panel ? createPortal(panel, document.body) : null}
    </>
  );
};
