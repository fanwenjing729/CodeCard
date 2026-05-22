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

---

## 2026-05-22 — 8 项优化

### 1. 抽取 rewardCard 原子方法 + XP 常量

**位置：`src/store/useProgressStore.ts`**

`NodeScreen` 和 `QuizScreen` 各自独立实现了相同的「判重 → 标记完成 → 加 XP」逻辑，连魔数 5/10 都重复。改为 store 内原子方法：

```ts
rewardCard: (courseId, cardId, xpAmount) => boolean  // 判重+完成+加XP+重算等级，一次 set
saveQuizScore: (courseId, nodeId, score) => void      // 持久化测验分数
```

导出常量 `XP_PER_CARD = 5` / `XP_PER_PRACTICE = 10`，消除屏幕层魔数。

### 2. 测验分数持久化

`quizScores` 字段在 store 中定义了但从未写入——测验分数只在 `QuizScreen` 内存中存活，离开即丢。新增 `saveQuizScore` 方法，测验结束时写入 store。

### 3. 路径别名 `@/`

所有深层相对引用（`../../../../types` 等）统一为 `@/` 前缀：

| 配置 | 改动 |
|------|------|
| `tsconfig.json` | +`baseUrl: "."` + `paths: { "@/*": ["src/*"] }` |
| `babel.config.js` | +`babel-plugin-module-resolver` |
| 源文件 | 19 个 `.ts/.tsx` 的 import 替换 |

### 4. npm run lint

`package.json` 新增 `"lint": "tsc --noEmit"` 脚本。

### 5. ScreenHeader 统一组件

**位置：`src/components/shared/ScreenHeader.tsx`**

4 个 screen 各有几乎相同的 header 布局（返回按钮 + 标题 + 右侧信息），合并为一个组件：

```ts
interface ScreenHeaderProps {
  onBack: () => void;
  title?: string;
  center?: React.ReactNode;
  right?: React.ReactNode;
  backLabel?: string;
  themeColor?: string;
  variant: 'default' | 'compact';  // Course/Module 用 default，Node/Quiz 用 compact
}
```

CourseScreen / ModuleScreen / NodeScreen / QuizScreen 各删除约 15 行重复代码和内联 safe-area 处理。

### 6. HomeScreen 进度预览

从 store 读取 `completedCards`，每门课程卡片显示 `完成数/总数 · 百分比` + 迷你进度条。用户无需进入课程即可感知进度。

### 7. handleClearAll 风格统一

`SettingsScreen` 的「清空全部数据」原本裸写 `useProgressStore.setState({...})`，绕过 `resetCourse` 方法。改为 `courses.forEach(c => resetCourse(c.id))`，与单科重置保持一致。

### 8. Quiz 节点非 practice 卡片校验

`QuizScreen` 用 `.filter(c => c.cardType === 'practice')` 静默丢弃非 practice 卡片。新增 `console.warn` 在开发时提示作者。

### Bug 修复

- **QuizScreen 重复计分**：`handleSubmit` 已 dispatch `SCORE` 使 `state.score +1`，`handleNext` 又手动加了一次最后一题，导致重复计分。修正为直接用 `state.score`。

### 统计

- 文件变更：33（新增 1，修改 32）
- 代码行：+648 / -303
- 删除重复样式：约 70 行
- TypeScript：`tsc --noEmit` 零错误
