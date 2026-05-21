// ===== 字体 =====
export const FontFamily = {
  sans: 'sans-serif',
  mono: 'monospace',
  heading: 'Microsoft YaHei',
} as const;

// ===== 颜色 =====
export const Colors = {
  primary: '#4a9eff',
  success: '#2ed573',
  danger: '#ff4757',
  warning: '#ff9f43',
  bg: '#fff',
  bgSecondary: '#f8f9fa',
  bgTertiary: '#f5f5f5',
  text: '#222',
  textSecondary: '#666',
  textMuted: '#999',
  textPlaceholder: '#bbb',
  border: '#eee',
  borderLight: '#d0d0d0',
  arrow: '#ccc',
  codeBg: '#1e1e1e',
  codeText: '#d4d4d4',
  codeLineNum: '#888',
  correctBg: '#d4edda',
  wrongBg: '#f8d7da',
  progressBarBg: '#e8edf2',
  tabBarInactive: '#999',
  disabledBg: '#8899aa',
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

// ===== 布局常量 =====
export const Layout = {
  headerPaddingBottom: 8,
  tabBarHeight: 58,
  iconSize: 26,
} as const;
