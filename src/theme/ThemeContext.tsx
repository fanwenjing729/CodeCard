import { createContext, useCallback, useEffect, useState } from 'react';
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

  useEffect(() => {
    // 确认存储值是否与初始值一致（理论上已一致，此处做兜底）
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'dark' && !isDark) {
        setIsDark(true);
      } else if (v === 'light' && isDark) {
        setIsDark(false);
      }
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
