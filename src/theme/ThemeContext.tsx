import { createContext, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'theme_mode';

export interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeCtx>({
  isDark: false,
  toggle: () => {},
});

export function ThemeProvider({ children, initialDark = false }: { children: ReactNode; initialDark?: boolean }) {
  const [isDark, setIsDark] = useState(initialDark);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
