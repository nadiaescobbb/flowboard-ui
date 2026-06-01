import React, { useState } from 'react';
import { Icon } from './Icon';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface SidebarProps {
  onNavigate?: (sectionId: string) => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const classes = useThemeClasses();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', sectionId: 'overview' },
    { icon: 'bar_chart', label: 'Analytics', sectionId: 'analytics' },
    { icon: 'group', label: 'Users', sectionId: 'users' },
    { icon: 'payments', label: 'Revenue', sectionId: 'revenue' },
    { icon: 'settings', label: 'Settings', sectionId: 'settings' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, sectionId: string) => {
    e.preventDefault();
    setActiveSection(label);
    setMobileMenuOpen(false);
    onNavigate?.(sectionId);
  };

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`md:hidden fixed top-4 left-4 z-[80] p-2 rounded-md ${classes.isLight ? 'bg-[#fffaf0] border-border-light' : 'bg-[#1b1915] border-border-dark'} border shadow-lg`}
        aria-label={mobileMenuOpen ? 'Close navigation and return to the dashboard' : 'Open navigation to choose a dashboard section'}
        aria-expanded={mobileMenuOpen}
      >
        <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
      </button>

      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:sticky top-0 left-0 h-screen
          w-60 flex-shrink-0 flex-col border-r
          transition-transform duration-300 ease-in-out
          z-[70]
          ${classes.isLight ? 'bg-[#fffaf0]/92 border-border-light shadow-[24px_0_70px_rgba(21,19,15,0.13)]' : 'bg-[#15130f]/96 border-border-dark shadow-[24px_0_90px_rgba(0,0,0,0.75)]'}
          overflow-y-auto no-scrollbar
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="px-6 py-7 mt-12 md:mt-0">
          <div className="flex items-center gap-3">
            <div
              className="size-9 rounded-md border border-primary/30 bg-primary/12 flex items-center justify-center text-primary shadow-[inset_0_0_0_1px_rgba(255,250,240,0.08)]"
              role="img"
              aria-label="FlowBoard revenue intelligence workspace"
            >
              <Icon name="insights" className="!text-xl" aria-hidden="true" />
            </div>

            <div>
              <h1 className={`text-lg font-bold leading-tight ${classes.title}`}>
                FlowBoard
              </h1>
              <p className={`editorial-label !text-[9px] ${classes.subtitle}`}>
                Revenue intelligence
              </p>
            </div>
          </div>

          <p className={`mt-7 text-xs leading-5 ${classes.subtitle}`}>
            Weekly operating brief for acquisition, revenue, and user momentum.
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2" aria-label="Dashboard sections">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={`#${item.sectionId}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                activeSection === item.label
                  ? classes.isLight
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'sidebar-item-active'
                  : `${classes.subtitle} ${
                      classes.isLight
                        ? 'hover:bg-[#f4ecdd] hover:text-text-primary-light'
                        : 'hover:text-text-primary-dark hover:bg-white/5'
                    }`
              }`}
              aria-current={activeSection === item.label ? 'page' : undefined}
              onClick={(e) => handleNavClick(e, item.label, item.sectionId)}
            >
              <span className={`text-[10px] tabular-nums ${classes.subtitle}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <Icon name={item.icon} className="!text-[20px]" aria-hidden="true" />
              <span className="text-sm font-display font-semibold">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-border-light dark:border-border-dark space-y-3">
          <div className={`rounded-md border px-3 py-3 ${classes.isLight ? 'border-border-light bg-[#f4ecdd]' : 'border-border-dark bg-white/[0.035]'}`}>
            <p className={`editorial-label !text-[9px] ${classes.subtitle}`}>
              Health
            </p>
            <p className={`mt-1 text-sm font-display font-semibold ${classes.title}`}>
              3 checks passing
            </p>
          </div>

          <a
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
              classes.subtitle
            } ${
              classes.isLight
                ? 'hover:text-text-primary-light hover:bg-[#f4ecdd]'
                : 'hover:text-text-primary-dark hover:bg-white/5'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('Support');
              setMobileMenuOpen(false);
              onNavigate?.('support');
            }}
          >
            <Icon name="help" className="!text-[20px]" aria-hidden="true" />
            <span className="text-sm font-semibold">Support</span>
          </a>
        </div>
      </aside>
    </>
  );
};
