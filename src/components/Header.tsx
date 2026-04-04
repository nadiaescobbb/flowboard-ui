import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { useThemeClasses } from '../hooks/useThemeClasses';

export const Header = () => {
  const classes = useThemeClasses();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer click fuera
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

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const notificationBorder = classes.isLight
    ? 'border-background-light'
    : 'border-background-dark';

  return (
    <header 
      className={`h-16 flex items-center justify-between px-4 md:px-8 border-b sticky top-0 z-30 backdrop-blur-sm ${classes.surface}`}
      role="banner"
    >
      
      {/* Left Section */}
      <div className="flex items-center gap-3 md:gap-6 flex-1">
        {/* Spacer para el botón de menú mobile */}
        <div className="w-10 md:hidden"></div>
        
        <h1 className={`text-base md:text-lg font-semibold ${classes.title}`}>
          Dashboard
        </h1>

        {/* Search Bar - Desktop */}
        <form 
          onSubmit={handleSearch}
          className="relative max-w-md hidden lg:block"
          role="search"
        >
          <label htmlFor="global-search" className="sr-only">
            Search dashboard
          </label>
          <Icon
            name="search"
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${classes.subtitle} !text-xl pointer-events-none`}
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-72 rounded-lg pl-10 pr-4 py-1.5 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${classes.input}`}
            aria-label="Search dashboard"
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Mobile Search Button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${classes.subtitle} hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
          aria-label="Search"
        >
          <Icon name="search" aria-hidden="true" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg transition-colors relative ${classes.subtitle} hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Icon name="notifications" aria-hidden="true" />
            <span 
              className={`absolute top-2 right-2.5 size-2 bg-primary rounded-full border-2 ${notificationBorder}`}
              role="status"
              aria-label="You have unread notifications"
            ></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              className={`absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border shadow-lg overflow-hidden ${classes.surface}`}
              role="menu"
              aria-label="Notifications menu"
            >
              <div className="p-4 border-b">
                <h3 className={`font-semibold text-sm md:text-base ${classes.title}`}>Notifications</h3>
                <p className={`text-xs mt-0.5 ${classes.subtitle}`}>You have 3 unread messages</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[
                  { id: 1, title: 'New user registered', time: '2 min ago', unread: true },
                  { id: 2, title: 'Payment received', time: '1 hour ago', unread: true },
                  { id: 3, title: 'Server update completed', time: '3 hours ago', unread: false },
                ].map((notification) => (
                  <button
                    key={notification.id}
                    className={`w-full p-4 text-left transition-colors border-b last:border-b-0 ${classes.hover} ${notification.unread ? 'bg-primary/5' : ''}`}
                    onClick={() => console.log('Open notification', notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {notification.unread && (
                        <span className="size-2 bg-primary rounded-full mt-2 flex-shrink-0" aria-label="Unread"></span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${classes.title} truncate`}>
                          {notification.title}
                        </p>
                        <p className={`text-xs mt-1 ${classes.subtitle}`}>
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t">
                <button 
                  className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  onClick={() => console.log('View all notifications')}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider - Hidden on mobile */}
        <div className={`hidden md:block h-8 w-px mx-1 ${classes.divider}`} role="separator"></div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 md:gap-3 group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-1 -m-1"
            aria-label="User menu"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <div className="text-right hidden sm:block">
              <p className={`text-sm font-medium leading-none ${classes.title}`}>
                Alex Rivera
              </p>
              <p className={`text-[11px] mt-1 ${classes.subtitle}`}>
                Admin
              </p>
            </div>

            <div
              className={`size-8 md:size-9 rounded-full bg-center bg-cover border transition-all ${
                classes.isLight ? 'border-border-light' : 'border-border-dark'
              } group-hover:border-primary/50`}
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgooc7HJ90bNh5i07bE2Ma_LnoCzc5sPD1c8O5xfKB20xi3Oozr2tWSt8aSu-0I6PVxGSZLj5T_adkCHP_2VHJkUwNqYuOGi6_q8tKkeJc4tTqdx7J1y7u3BwiQ1UkEUME2HCQHJJnhT1PtttaA02EhDQSFnkogTtb4uMFeU_wmRqexQCRWSN7d7KVQMbfUkVQZAx1E3Y-jn9w9oudGTJ60f5rhUxrXjWRwm7hLofUzwYxZ-2N1my8ooau-KkUUIDHpgExJqP4rfM")`,
              }}
              role="img"
              aria-label="Alex Rivera profile picture"
            ></div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div 
              className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-lg overflow-hidden ${classes.surface}`}
              role="menu"
              aria-label="User menu"
            >
              <div className="p-3 border-b">
                <p className={`text-sm font-medium ${classes.title}`}>Alex Rivera</p>
                <p className={`text-xs ${classes.subtitle}`}>alex@flowboard.com</p>
              </div>
              
              <div className="py-2">
                {[
                  { icon: 'person', label: 'Profile', action: () => console.log('Profile') },
                  { icon: 'settings', label: 'Settings', action: () => console.log('Settings') },
                  { icon: 'help', label: 'Help & Support', action: () => console.log('Help') },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${classes.subtitle} ${classes.hover}`}
                    role="menuitem"
                  >
                    <Icon name={item.icon} className="!text-lg" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-2 border-t">
                <button 
                  onClick={() => console.log('Logout')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <Icon name="logout" className="!text-lg" aria-hidden="true" />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="lg:hidden fixed inset-x-0 top-16 p-4 bg-white dark:bg-surface-dark border-b z-20">
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
              className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${classes.input}`}
              autoFocus
            />
          </form>
        </div>
      )}
    </header>
  );
};