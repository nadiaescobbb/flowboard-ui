import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useThemeClasses = () => {
  const { theme } = useTheme();
  
  return useMemo(() => {
    const isLight = theme === 'light';
    
    return {
      surface: isLight
        ? 'bg-surface-light/90 border-border-light shadow-[0_18px_60px_rgba(20,20,19,0.06)]'
        : 'bg-surface-dark/88 border-border-dark shadow-[0_24px_80px_rgba(0,0,0,0.28)]',
      
      title: isLight
        ? 'text-text-primary-light'
        : 'text-text-primary-dark',
      
      subtitle: isLight
        ? 'text-text-secondary-light'
        : 'text-text-secondary-dark',
      
      input: isLight
        ? 'bg-[#f3f0e7] text-text-primary-light placeholder:text-[#9b978b] border-border-light'
        : 'bg-[#22211f] text-text-primary-dark placeholder:text-[#777369] border-border-dark',
      
      button: isLight
        ? 'bg-[#f3f0e7] border-border-light text-text-primary-light hover:bg-[#ece7dc]'
        : 'bg-[#23221f] border-border-dark text-text-primary-dark hover:bg-[#2a2925]',
      
      buttonActive: 'bg-primary/15 border border-primary/35 text-primary',
      
      divider: isLight ? 'bg-border-light' : 'bg-border-dark',
      hover: isLight ? 'hover:bg-[#f6f1e7]' : 'hover:bg-white/[0.04]',
      
      isLight,
    };
  }, [theme]);
};
