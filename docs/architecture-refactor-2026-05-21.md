# CodeCard 架构优化记录

2026-05-21

## 已完成的 6 项改动

### 1. SafeAreaView 替代硬编码 paddingTop:64

涉及 7 个 screen，`paddingTop: 64` → `useSafeAreaInsets().top + 8/16`，适配所有机型。

### 2. Card 判別联合类型（去掉 as 强制转换）

`Card` 从单一 interface 改为 4 个 interface 的联合：
```ts
type Card = ConceptCardData | CodeCardData | AnimationCardData | PracticeCardData
```
switch 各分支 TypeScript 自动收窄 `content` 类型，`renderCard.tsx` 中全部 `as` 转换已删除。

### 3. 抽 ListItem 共享组件

**位置：`src/components/shared/ListItem.tsx`**

提取 CourseScreen 和 ModuleScreen 中完全相同的卡片行 UI（圆点状态指示 + 标题/副标题 + 箭头）为独立组件。

```ts
interface Props {
  title: string;
  subtitle: string;
  status: 'pending' | 'started' | 'done';
  themeColor: string;
  onPress: () => void;
}
```

**以后如果 CourseScreen 和 ModuleScreen 的卡片需求分叉**，优先扩展此组件的 props 或 status 枚举；如果差异大到无法共享，再各自拆回独立实现。

### 4. useMemo 优化

`CourseScreen`: `modules` (groupByModule 结果) 和 `completedCards` 用 `useMemo`
`ModuleScreen`: `nodes` (filter 结果) 和 `completedCards` 用 `useMemo`

### 5. useReducer 替代 QuizScreen 多状态

6 个 `useState` → 1 个 `useReducer`，7 种 action（SELECT/FILL/SUBMIT/SCORE/NEXT/DONE/RESET），状态变更集中在 `quizReducer` 中。

### 6. 动画注册表简化

去掉 mutation 模式（`loadComponent()` 改 `this.Component`），改为顶部直接 `import MemoryBox`，`getAnimComponent` 变成纯函数。
