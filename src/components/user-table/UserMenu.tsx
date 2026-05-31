import { memo, useEffect, useRef, useState } from 'react';
import { User } from '../../types';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { Icon } from '../Icon';

interface UserMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewProfile: (user: User) => void;
}

export const UserMenu = memo(({ user, onEdit, onDelete, onViewProfile }: UserMenuProps) => {
  const classes = useThemeClasses();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (!isOpen) return;

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={`p-1.5 rounded-md transition-colors ${classes.subtitle} hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40`}
        aria-label={`Open actions for ${user.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon name="more_horiz" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-md border shadow-lg z-10 py-1 ${classes.surface}`}
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
            <span>View profile</span>
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
            <span>Edit user details</span>
          </button>
          <div className={`my-1 border-t ${classes.divider}`}></div>
          <button
            onClick={() => {
              onDelete(user);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
            role="menuitem"
          >
            <Icon name="delete" className="!text-base" aria-hidden="true" />
            <span>Review removal</span>
          </button>
        </div>
      )}
    </div>
  );
});

UserMenu.displayName = 'UserMenu';
