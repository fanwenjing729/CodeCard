# 字体配置指南

## 当前状态

所有文字使用系统默认字体。`src/theme.ts` 已预留 `FontFamily` 常量，但尚未使用。

## 换字体方法

### 方法 1：系统字体（最轻量）

使用系统内置字体名，无需加载文件：

```ts
// theme.ts
export const FontFamily = {
  sans: 'sans-serif',
  serif: 'serif',
  mono: 'monospace',
} as const;
```

```ts
// 组件中
import { FontFamily } from '../theme';
<Text style={{ fontFamily: FontFamily.sans }}>文字</Text>
```

### 方法 2：加载自定义字体文件（推荐）

1. 把 `.ttf` 放到 `assets/fonts/` 目录
2. 在 `App.tsx` 入口加载：

```ts
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts({
    'YaHei': require('./assets/fonts/msyh.ttf'),
  });
  if (!loaded) return null;
  // ...
}
```

3. 在 theme.ts 注册：

```ts
export const FontFamily = {
  heading: 'YaHei',
  body: 'YaHei',
  mono: 'monospace',
} as const;
```

## 注意事项

- 微软雅黑是商用字体，不能直接打包进 App
- 免费替代：Noto Sans SC、Source Han Sans、阿里巴巴普惠体
- 字体文件通常 5-15 MB，会增加包体积
