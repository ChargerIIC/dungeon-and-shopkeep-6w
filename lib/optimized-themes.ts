// Optimized theme system with CSS custom properties
export const optimizedThemeConfig = {
  parchment: {
    cssVars: {
      '--theme-bg': 'rgb(245, 245, 220)',
      '--theme-card': 'rgb(255, 248, 220)',
      '--theme-border': 'rgba(139, 69, 19, 0.3)',
      '--theme-text': 'rgb(139, 69, 19)',
      '--theme-accent': 'rgb(255, 235, 205)',
      '--theme-item-bg': 'rgba(255, 235, 205, 0.8)',
    },
    className: 'theme-parchment'
  },
  tavern: {
    cssVars: {
      '--theme-bg': 'rgb(92, 51, 23)',
      '--theme-card': 'rgb(120, 63, 4)',
      '--theme-border': 'rgba(168, 85, 247, 0.6)',
      '--theme-text': 'rgb(245, 158, 11)',
      '--theme-accent': 'rgb(217, 119, 6)',
      '--theme-item-bg': 'rgba(120, 63, 4, 0.8)',
    },
    className: 'theme-tavern'
  },
  arcane: {
    cssVars: {
      '--theme-bg': 'rgb(59, 7, 100)',
      '--theme-card': 'rgb(88, 28, 135)',
      '--theme-border': 'rgba(147, 51, 234, 0.6)',
      '--theme-text': 'rgb(196, 181, 253)',
      '--theme-accent': 'rgb(139, 92, 246)',
      '--theme-item-bg': 'rgba(139, 92, 246, 0.7)',
    },
    className: 'theme-arcane'
  },
  forest: {
    cssVars: {
      '--theme-bg': 'rgb(6, 78, 59)',
      '--theme-card': 'rgb(22, 101, 52)',
      '--theme-border': 'rgba(34, 197, 94, 0.6)',
      '--theme-text': 'rgb(187, 247, 208)',
      '--theme-accent': 'rgb(74, 222, 128)',
      '--theme-item-bg': 'rgba(74, 222, 128, 0.7)',
    },
    className: 'theme-forest'
  },
  dungeon: {
    cssVars: {
      '--theme-bg': 'rgb(28, 25, 23)',
      '--theme-card': 'rgb(41, 37, 36)',
      '--theme-border': 'rgba(239, 68, 68, 0.6)',
      '--theme-text': 'rgb(252, 165, 165)',
      '--theme-accent': 'rgb(248, 113, 113)',
      '--theme-item-bg': 'rgba(248, 113, 113, 0.8)',
    },
    className: 'theme-dungeon'
  }
};

// Utility to apply theme
export const applyTheme = (theme: string, element?: HTMLElement) => {
  const config = optimizedThemeConfig[theme as keyof typeof optimizedThemeConfig];
  if (!config) return;

  const targetElement = element || document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(config.cssVars).forEach(([property, value]) => {
    targetElement.style.setProperty(property, value);
  });
  
  // Apply theme class (remove existing theme classes first)
  targetElement.className = targetElement.className.replace(/theme-\w+/g, '');
  targetElement.classList.add(config.className);
};

// React hook for theme management
export const useOptimizedTheme = (initialTheme: string = 'parchment') => {
  const setTheme = (newTheme: string) => {
    applyTheme(newTheme);
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', newTheme);
    }
  };

  const getStoredTheme = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || initialTheme;
    }
    return initialTheme;
  };

  return { setTheme, getStoredTheme };
};

// Helper to get theme utility classes
export const getThemeClasses = () => ({
  background: 'theme-bg',
  card: 'theme-card-bg theme-border border',
  text: 'theme-text',
  accent: 'theme-accent',
  itemBg: 'theme-item-bg',
  divider: 'theme-divider h-1 rounded-full'
});
