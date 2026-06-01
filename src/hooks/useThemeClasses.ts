import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useThemeClasses = () => {
  const { theme } = useTheme();
  
  return useMemo(() => {
    const isLight = theme === 'light';
    
    return {
      surface: isLight
        ? 'work-surface bg-surface-light/88 border-border-light shadow-[0_18px_60px_rgba(21,19,15,0.07)]'
        : 'work-surface bg-surface-dark/90 border-border-dark shadow-[0_24px_80px_rgba(0,0,0,0.32)]',
      
      title: isLight
        ? 'text-text-primary-light'
        : 'text-text-primary-dark',
      
      subtitle: isLight
        ? 'text-text-secondary-light'
        : 'text-text-secondary-dark',
      
      input: isLight
        ? 'bg-[#f4ecdd] text-text-primary-light placeholder:text-[#978d7d] border-border-light'
        : 'bg-[#211f1a] text-text-primary-dark placeholder:text-[#83796c] border-border-dark',
      
      button: isLight
        ? 'bg-[#f4ecdd] border-border-light text-text-primary-light hover:bg-[#eadfce]'
        : 'bg-[#211f1a] border-border-dark text-text-primary-dark hover:bg-[#29261f]',
      
      buttonActive: 'bg-primary/15 border border-primary/35 text-primary',
      
      divider: isLight ? 'bg-border-light' : 'bg-border-dark',
      hover: isLight ? 'hover:bg-[#f4ecdd]' : 'hover:bg-white/[0.045]',
      
      isLight,
    };
  }, [theme]);
};
