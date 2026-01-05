import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'radio-theme';

interface ThemeColors {
  background: string;
  primary: string;
}

const defaultTheme: ThemeColors = {
  background: '#f7f7f7',
  primary: '#5A618E',
};

const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeColors>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored ? JSON.parse(stored) : defaultTheme;
  });

  const applyTheme = useCallback((colors: ThemeColors) => {
    const root = document.documentElement;
    const bgHsl = hexToHsl(colors.background);
    const primaryHsl = hexToHsl(colors.primary);
    
    // Determine if background is light or dark
    const bgLightness = parseInt(bgHsl.split('%')[0].split(' ')[2] || '50');
    const isLightBg = bgLightness > 50;
    
    root.style.setProperty('--background', bgHsl);
    root.style.setProperty('--foreground', isLightBg ? '220 10% 15%' : '35 20% 95%');
    root.style.setProperty('--card', isLightBg ? `${bgHsl.split(' ')[0]} 10% 98%` : '20 12% 8%');
    root.style.setProperty('--card-foreground', isLightBg ? '220 10% 15%' : '35 20% 95%');
    root.style.setProperty('--popover', isLightBg ? '0 0% 100%' : '20 12% 8%');
    root.style.setProperty('--popover-foreground', isLightBg ? '220 10% 15%' : '35 20% 95%');
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--primary-foreground', '0 0% 100%');
    root.style.setProperty('--secondary', isLightBg ? '220 10% 92%' : '20 10% 15%');
    root.style.setProperty('--secondary-foreground', isLightBg ? '220 10% 25%' : '35 20% 90%');
    root.style.setProperty('--muted', isLightBg ? '220 10% 94%' : '20 10% 12%');
    root.style.setProperty('--muted-foreground', isLightBg ? '220 10% 45%' : '35 10% 55%');
    root.style.setProperty('--accent', primaryHsl);
    root.style.setProperty('--accent-foreground', '0 0% 100%');
    root.style.setProperty('--border', isLightBg ? '220 10% 88%' : '20 15% 18%');
    root.style.setProperty('--input', isLightBg ? '220 10% 88%' : '20 15% 18%');
    root.style.setProperty('--ring', primaryHsl);
    root.style.setProperty('--glow-primary', primaryHsl);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  }, [theme, applyTheme]);

  const updateTheme = useCallback((newTheme: Partial<ThemeColors>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  }, []);

  return { theme, updateTheme };
};
