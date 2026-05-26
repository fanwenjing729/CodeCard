# 暗色模式移除指南

本文档记录了暗色模式涉及的所有代码位置，删除时按以下清单逐项操作即可，无需读源码。

## 移除顺序

### 1. 删除新建文件（7 个）

```
src/theme/ThemeContext.tsx
src/theme/useTheme.ts
src/theme/colors.ts
src/components/shared/AnimatedTabIcon.tsx
src/components/shared/Skeleton.tsx
src/components/shared/CelebrationOverlay.tsx
src/data/animations/scenarios/confetti.ts
```

`src/theme.ts` 已不存在（被移入了 `src/theme/index.ts`）。

### 2. 卸载依赖（3 个）

```bash
npm uninstall expo-linear-gradient expo-font @expo-google-fonts/inter
```

### 3. 重写 `src/theme/index.ts`

删除 `DarkColors`、`Shadow`、`Gradient`、`useTheme`/`useColors` 导出、`FontFamily.Inter`。

恢复为原始的静态 `Colors`，原值如下：

| Token | 原始值 |
|-------|--------|
| primary | `#4a9eff` |
| success | `#2ed573` |
| danger | `#ff4757` |
| warning | `#ff9f43` |

### 4. 重写 `App.tsx`

删除：
- `SplashScreen` 相关逻辑（`preventAutoHideAsync`、`hideAsync`）
- `AsyncStorage` 主题读取
- `useState` 的 `initialDark` / `themeReady`
- `ThemeProvider` 的 `initialDark` prop
- `View` 包裹的背景色
- `ThemedApp` 组件（或简化为无主题版本）

恢复为仅含 `SafeAreaProvider` + `StatusBar` + `AppNavigator` 的简单结构。

### 5. 重写 `AppNavigator.tsx`

| 操作 | 说明 |
|------|------|
| 删除 `import { useTheme, useColors } from '@/theme'` | |
| 删除 `NavigationContainer` 的 `theme` prop | |
| 删除 `RootStack.Navigator` 的 `contentStyle` | |
| 删除 `MainTabs` 中的 `const C = useColors()` | |
| `tabBarActiveTintColor` → `Colors.tabBarActive` | 恢复静态引用 |
| `tabBarInactiveTintColor` → `Colors.tabBarInactive` | |
| `tabBarStyle.backgroundColor` → `Colors.bg` | |
| `tabBarStyle.borderTopColor` → `Colors.tabBarBorder` | |
| `AnimatedTabIcon` → `MaterialCommunityIcons` | 三个 tab 都改 |

恢复后的 `MainTabs` tabBarIcon 写法：
```tsx
tabBarIcon: ({ color }) => (
  <MaterialCommunityIcons name="school" size={26} color={color} />
),
```

### 6. 批量恢复屏幕文件（10 个）

每个屏幕文件做相同的操作：

| 步骤 | 操作 |
|------|------|
| A | 删除 `useColors` 从 import 中（保留 `Colors`） |
| B | 删除 `const C = useColors()` |
| C | 删除 `useLayoutEffect(() => { navigation.setOptions({ contentStyle: ... }) }, ...)` |
| D | 全局替换 `C.bg` → `Colors.bg` |
| E | 全局替换 `C.bgTertiary` → `Colors.bgTertiary` |
| F | 全局替换 `C.text` → `Colors.text` |
| G | 全局替换 `C.textSecondary` → `Colors.textSecondary` |
| H | 全局替换 `C.textMuted` → `Colors.textMuted` |
| I | 全局替换 `C.textInverse` → `Colors.textInverse` |
| J | 全局替换 `C.textPlaceholder` → `Colors.textPlaceholder` |
| K | 全局替换 `C.border` → `Colors.border` |
| L | 全局替换 `C.xxx` → `Colors.xxx`（其余颜色同理） |
| M | 删除内联 `{ backgroundColor: C.xxx }` 等覆盖（恢复为纯 `style={styles.xxx}`） |
| N | 删除 `import { LinearGradient } from 'expo-linear-gradient'`（如有） |
| O | 把 `<LinearGradient ...>` 改回 `<View style={...}>`（如有） |

**屏幕文件清单：**
```
src/screens/HomeScreen.tsx
src/screens/ProgressScreen.tsx
src/screens/SettingsScreen.tsx
src/screens/CourseScreen.tsx
src/screens/ModuleScreen.tsx
src/screens/NodeScreen.tsx
src/screens/QuizScreen.tsx
src/screens/DataScreen.tsx
src/screens/LoginScreen.tsx
src/screens/WrongCardsScreen.tsx
```

#### SettingsScreen 额外操作

删除暗色模式开关行：
```tsx
// 删除这整段
<View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
  <Text style={[styles.rowText, { color: C.text }]}>深色模式</Text>
  <Switch ... />
</View>
```

删除 `Switch` 从 `react-native` import、`useTheme` 从 `@/theme` import。

#### ProgressScreen 额外操作

`LevelRing` 组件中的 `AnimatedCircle` 改回静态 `Circle`，删除 `useSharedValue`/`useAnimatedProps`/`withTiming` 动画逻辑。

`LinearGradient` 包裹的等级卡片改回 `<View style={styles.levelCard}>`。

#### HomeScreen 额外操作

删除骨架屏 `Skeleton` 导入和 `!hydrated` 分支。

#### NodeScreen 额外操作

删除 `Animated.View` 包裹的卡片切换动画（`entering`/`exiting`），改回普通 `<View style={styles.cardArea}>`。

删除 `useRef`/`useCallback` 的方向追踪逻辑。

### 7. 批量恢复卡片组件（3 个）

```
src/components/cards/ConceptCard.tsx
src/components/cards/CodeCard.tsx
src/components/cards/QuestionRenderer.tsx
```

每个文件执行屏幕恢复清单中的 A-M 步骤。

### 8. 批量恢复 shared 组件（2 个）

```
src/components/shared/ScreenHeader.tsx
src/components/shared/ListItem.tsx
```

同上。

### 9. ErrorBoundary

`src/components/shared/ErrorBoundary.tsx` 需要删除 `ThemeContext.Consumer` 包裹，恢复为纯 class 组件。

### 10. 动画组件

`src/components/animations/` 下的文件在本次改动中未修改，不需要动。

但 `LottiePlayer.tsx` 有一行改动：`loop` → `loop={scenario.loop ?? true}`。如需完全回退，改为 `loop`。

### 11. 类型定义

`src/types/index.ts` 中 `LottieScenario` 的 `loop?: boolean` 可以删除。

### 12. 测试文件

`src/components/cards/CodeCard.test.tsx` 和 `ConceptCard.test.tsx` 中有对 `@/theme/useTheme` 的 mock，删除这些 mock。

### 13. 验证

```bash
npx tsc --noEmit    # 编译通过
npx vitest run      # 139 测试通过
```

## 影响范围统计

| 类别 | 数量 |
|------|------|
| 删除文件 | 7 |
| 重写文件 | 3（theme/index.ts, App.tsx, AppNavigator.tsx） |
| 修改屏幕 | 10 |
| 修改组件 | 5 |
| 修改测试 | 2 |
| 修改类型 | 1 |
| 卸载依赖 | 3 |
