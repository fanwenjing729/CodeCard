// ===== 字体 =====
export const FontFamily = {
  sans: 'Inter_400Regular',
  sansBold: 'Inter_700Bold',
  mono: 'monospace',
  cjk: 'System',
} as const;

export { Colors, DarkColors } from './colors';

// ===== 阴影 =====
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ===== 渐变 =====
export const Gradient = {
  primary: ['#5B7FFF', '#7B5FFF'] as readonly [string, string],
  success: ['#34D399', '#10B981'] as readonly [string, string],
  levelRing: ['#5B7FFF', '#A78BFA'] as readonly [string, string],
  celebration: ['#5B7FFF', '#F59E0B', '#EF4444'] as readonly [string, string, string],
} as const;

// ===== 字号 =====
export const FontSize = {
  xs: 12,
  sm: 13,
  md: 14,
  base: 15,
  lg: 16,
  xl: 17,
  xxl: 18,
  title: 20,
  heading: 22,
  hero: 24,
  xhero: 48,
  code: 12,
} as const;

// ===== 字重 =====
export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// ===== 圆角 =====
export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

// ===== 间距 =====
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export { useTheme, useColors } from './useTheme';

// ===== 布局常量 =====
export const Layout = {
  headerPaddingBottom: 8,
  tabBarHeight: 58,
  iconSize: 26,
} as const;
