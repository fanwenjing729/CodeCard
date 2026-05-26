import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Colors, DarkColors } from './colors';

export function useTheme() {
  return useContext(ThemeContext);
}

export function useColors() {
  const { isDark } = useContext(ThemeContext);
  return isDark ? DarkColors : Colors;
}
