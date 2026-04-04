import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useThemeClasses = () => {
  const { theme } = useTheme();
  
  return useMemo(() => {
    const isLight = theme === 'light';
    
    return {
      surface: isLight
        ? 'bg-surface-light border-border-light'
        : 'bg-surface-dark border-border-dark',
      
      title: isLight
        ? 'text-text-primary-light'
        : 'text-text-primary-dark',
      
      subtitle: isLight
        ? 'text-text-secondary-light'
        : 'text-text-secondary-dark',
      
      input: isLight
        ? 'bg-gray-100 text-text-primary-light placeholder:text-text-secondary-light border-border-light'
        : 'bg-white/5 text-slate-300 placeholder:text-slate-600 border-border-dark',
      
      button: isLight
        ? 'bg-gray-100 border-border-light text-text-secondary-light hover:bg-gray-200'
        : 'bg-white/5 border-border-dark text-slate-300 hover:bg-white/10',
      
      buttonActive: 'bg-primary/20 border border-primary/40 text-primary',
      
      divider: isLight ? 'bg-border-light' : 'bg-border-dark',
      hover: isLight ? 'hover:bg-gray-50' : 'hover:bg-white/[0.02]',
      
      isLight,
    };
  }, [theme]);
};