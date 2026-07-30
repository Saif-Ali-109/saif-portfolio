"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'crystal' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'crystal',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('crystal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial = stored || 'crystal';
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setTimeout(() => {
      setTheme(initial);
      setMounted(true);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'crystal' ? 'dark' : 'crystal';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
