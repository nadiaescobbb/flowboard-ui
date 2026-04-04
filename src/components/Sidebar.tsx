import { Icon } from './Icon';
import { useThemeClasses } from '../hooks/useThemeClasses';
import React, { useState } from 'react';

export const Sidebar = () => {
  const classes = useThemeClasses();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: true },
    { icon: 'bar_chart', label: 'Analytics', active: false },
    { icon: 'group', label: 'Users', active: false },
    { icon: 'payments', label: 'Revenue', active: false },
    { icon: 'settings', label: 'Settings', active: false },
  ];

  // Cerrar menú al hacer click en un item (mobile)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    console.log(`Navigate to ${label}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${classes.surface} border shadow-lg`}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
      </button>

      {/* Overlay para cerrar el menú en mobile */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:sticky top-0 left-0 h-screen
          w-64 flex-shrink-0 flex-col border-r
          transition-transform duration-300 ease-in-out
          z-40
          ${classes.surface}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 flex items-center gap-3 mt-12 md:mt-0">
          <div
            className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(19,127,236,0.4)]"
            role="img"
            aria-label="FlowBoard logo"
          >
            <Icon name="insights" className="!text-xl" aria-hidden="true" />
          </div>

          <div>
            <h1 className={`text-lg font-bold leading-tight tracking-tight ${classes.title}`}>
              FlowBoard
            </h1>
            <p className={`text-xs font-medium uppercase tracking-widest ${classes.subtitle}`}>
              Analytics
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-4" aria-label="Dashboard sections">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                item.active
                  ? classes.isLight
                    ? 'bg-gray-100 text-primary'
                    : 'sidebar-item-active'
                  : `${classes.subtitle} ${
                      classes.isLight
                        ? 'hover:bg-gray-100'
                        : 'hover:text-white hover:bg-white/5'
                    }`
              }`}
              aria-current={item.active ? 'page' : undefined}
              onClick={(e) => handleNavClick(e, item.label)}
            >
              <Icon name={item.icon} className="!text-[22px]" aria-hidden="true" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t space-y-1 ${classes.divider}`}>
          <a
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              classes.subtitle
            } ${
              classes.isLight
                ? 'hover:text-text-primary-light'
                : 'hover:text-white'
            }`}
            onClick={(e) => {
              e.preventDefault();
              console.log('Open support');
              setMobileMenuOpen(false);
            }}
          >
            <Icon name="help" className="!text-[22px]" aria-hidden="true" />
            <span className="text-sm font-medium">Support</span>
          </a>
        </div>
      </aside>
    </>
  );
};