import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { useThemeClasses } from '../hooks/useThemeClasses';

export const Header = () => {
  const classes = useThemeClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setActionMessage(
      query
        ? `Search submitted for "${query}". In production this would query dashboard entities.`
        : 'Search is ready. Enter a term to find users, reports, or metrics.'
    );
  };

  const handleMenuAction = (message: string) => {
    setActionMessage(message);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  return (
    <header
      className={`sticky top-0 z-30 min-h-20 border-b backdrop-blur-xl ${classes.surface}`}
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
              Revenue Intelligence
            </h2>
          </div>

          <form
            onSubmit={handleSearch}
            className="relative max-w-md hidden lg:block flex-1"
            role="search"
          >
            <label htmlFor="global-search" className="sr-only">
              Search dashboard
            </label>
            <Icon
              name="search"
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${classes.subtitle} !text-lg pointer-events-none`}
              aria-hidden="true"
            />
            <input
              id="global-search"
              type="search"
              placeholder="Search metrics, people, segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md pl-10 pr-4 py-2 text-sm border focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
              aria-label="Search dashboard"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className={`lg:hidden p-2 rounded-md transition-colors ${classes.subtitle} hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
            aria-label="Search"
          >
            <Icon name="search" aria-hidden="true" />
          </button>

          <div className="hidden xl:grid grid-cols-3 divide-x divide-border-light dark:divide-border-dark rounded-md border border-border-light dark:border-border-dark overflow-hidden">
            {[
              ['Runway', '18 mo'],
              ['ARR', '$1.49m'],
              ['Target', '+8.2%'],
            ].map(([label, value]) => (
              <div key={label} className="px-4 py-2">
                <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.2em] ${classes.subtitle}`}>
                  {label}
                </p>
                <p className={`text-sm font-display font-bold ${classes.title}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="relative hidden sm:block" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-md transition-colors relative ${classes.subtitle} hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
              aria-label="Notifications"
              aria-expanded={showNotifications}
              aria-haspopup="true"
            >
              <Icon name="notifications" aria-hidden="true" />
              <span
                className="absolute top-2 right-2.5 size-2 bg-primary rounded-full border-2 border-surface-light dark:border-surface-dark"
                role="status"
                aria-label="You have unread notifications"
              ></span>
            </button>

            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-md border shadow-lg overflow-hidden ${classes.surface}`}
                role="menu"
                aria-label="Notifications menu"
              >
                <div className="p-4 border-b border-border-light dark:border-border-dark">
                  <h3 className={`font-display font-semibold text-sm md:text-base ${classes.title}`}>
                    Notifications
                  </h3>
                  <p className={`text-xs mt-0.5 ${classes.subtitle}`}>3 operational updates</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[
                    { id: 1, title: 'New user registered', time: '2 min ago', unread: true },
                    { id: 2, title: 'Payment received', time: '1 hour ago', unread: true },
                    { id: 3, title: 'Server update completed', time: '3 hours ago', unread: false },
                  ].map((notification) => (
                    <button
                      key={notification.id}
                      className={`w-full p-4 text-left transition-colors border-b last:border-b-0 border-border-light dark:border-border-dark ${classes.hover} ${notification.unread ? 'bg-primary/5' : ''}`}
                      onClick={() => handleMenuAction(`Opened notification: ${notification.title}.`)}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
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
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative hidden md:block" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md p-1 -m-1"
              aria-label="User menu"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-display font-semibold leading-none ${classes.title}`}>
                  Alex Rivera
                </p>
                <p className={`text-[11px] mt-1 ${classes.subtitle}`}>Admin</p>
              </div>

              <div
                className="size-9 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center text-primary"
                role="img"
                aria-label="Alex Rivera profile"
              >
                <Icon name="person" className="!text-lg" aria-hidden="true" />
              </div>
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-md border shadow-lg overflow-hidden ${classes.surface}`}
                role="menu"
                aria-label="User menu"
              >
                <div className="p-3 border-b border-border-light dark:border-border-dark">
                  <p className={`text-sm font-display font-semibold ${classes.title}`}>Alex Rivera</p>
                  <p className={`text-xs ${classes.subtitle}`}>alex@flowboard.com</p>
                </div>

                <div className="py-2">
                  {[
                    { icon: 'person', label: 'Profile', message: 'Profile settings selected.' },
                    { icon: 'settings', label: 'Settings', message: 'Workspace settings selected.' },
                    { icon: 'help', label: 'Help & Support', message: 'Support center selected.' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleMenuAction(item.message)}
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
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md pl-10 pr-4 py-2 text-sm border focus:ring-2 focus:ring-primary/40 transition-all ${classes.input}`}
              autoFocus
            />
          </form>
        </div>
      )}

      {actionMessage && (
        <div
          className="absolute right-4 top-[5.5rem] max-w-sm rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary shadow-sm"
          role="status"
        >
          {actionMessage}
        </div>
      )}
    </header>
  );
};
