# File placement

所有项目文件（计划、文档、代码）必须放在当前项目目录 `G:\CodeCard\` 下。
禁止写入 C 盘。如果特定工具强制要求 C 盘路径，必须先征得用户同意。

# Expo version

Read https://docs.expo.dev/versions/v55.0.0/ before writing Expo-related code.

# CRITICAL — What NOT to read

This document IS the source of truth. Do NOT read source files unless explicitly listed below.

| Task type | What to read | What NOT to read |
|-----------|-------------|------------------|
| Add course / module / node / card | This doc + `src/data/courses/cpp/01-basics/hello-world.ts` (as node template) + `01-basics/index.ts` (as module template) | Any other file |
| Add animation (any type) | This doc ONLY — do NOT read source | All source files |
| Fix store / progress bug | `src/store/useProgressStore.ts` + the screen reporting the bug | Other screens |
| Fix card rendering bug | The specific card component + `renderCard.tsx` | Other components |
| Modify SettingsScreen UI | This doc + `SettingsScreen.tsx` | Other screens |
| Modify ProgressScreen | `ProgressScreen.tsx` only | Other screens |
| Add login / cloud sync / avatar | This doc ONLY — do NOT read source | All source files |
| Theme / color / style change | `src/theme.ts` + `docs/AAAAui-reference.md` — do NOT read components | Component source files |
| Data migration / store structure change | `src/store/useProgressStore.ts` + `docs/store-invariants.md` | Other store files, screens |
| Remote content / CDN / CMS | This doc ONLY (see"将来规模化"section) — do NOT read source | All source files |
| Add test framework | This doc ONLY (see"将来规模化"section) + `docs/store-invariants.md` | All source files |
| Extract content to Markdown | This doc ONLY (see"将来规模化"section) — do NOT read source | All source files |
| Branch path navigation | `docs/branch-path-design.md` — do NOT read source | All source files |
| Add payment / permissions / IAP | This doc ONLY (see"将来规模化 → 付费与权限系统") — do NOT read source | All source files |
| **Any future architecture / scaling change** | **This doc first** — search for relevant section, only read source files if this doc says so | Everything else |

Violating this table wastes tokens and context. Trust this document.

# Project Architecture (CodeCard v1.0)

Local-first Android learning app. Card-based micro-learning with instant feedback, no backend.

## Tech stack

| Layer | Stack |
|-------|-------|
| Framework | React Native 0.83.6 + Expo SDK 55 |
| Language | TypeScript 5.9, strict mode |
| Navigation | @react-navigation/native 7 + bottom-tabs + native-stack |
| State | Zustand 5 + manual AsyncStorage persist |
| Animation | react-native-reanimated 4.1.7 + react-native-svg 15 |
| Icons | @expo/vector-icons (MaterialCommunityIcons) |
| Theme | `src/theme.ts` — 46 design tokens, 19 components consume |

## Theme system (src/theme.ts)

所有视觉属性必须通过 theme token 引用，禁止在组件中硬编码 hex 颜色。

```ts
import { Colors, FontSize, FontWeight, Radius, Spacing, Layout } from '@/theme';
```

### Colors tokens (46 个)

| 分类 | Token | 值 | 用途 |
|------|-------|------|------|
| 品牌 | `primary` | `#4a9eff` | 按钮、进度条、TabBar 选中 |
| 语义 | `success` | `#2ed573` | 正确反馈 |
| | `danger` | `#ff4757` | 错误/危险操作 |
| | `warning` | `#ff9f43` | 警告 |
| 背景 | `bg` | `#fff` | 页面背景 |
| | `bgSecondary` | `#f8f9fa` | 次级背景 |
| | `bgTertiary` | `#f5f5f5` | 三级背景 |
| 文字 | `text` | `#222` | 标题/正文 |
| | `textSecondary` | `#666` | 次要文字 |
| | `textMuted` | `#999` | 辅助文字 |
| | `textPlaceholder` | `#bbb` | 占位符 |
| | `textInverse` | `#fff` | 深色背景上的文字 |
| | `bodyText` | `#444` | 概念卡正文 |
| 边框 | `border` | `#eee` | 默认边框 |
| | `borderLight` | `#d0d0d0` | 浅边框 |
| 代码 | `codeBg` | `#1e1e1e` | 代码块背景 |
| | `codeText` | `#d4d4d4` | 代码文字 |
| | `codeLineNum` | `#888` | 行号 |
| 问答 | `optionBg` | `#f0f4ff` | 选项默认背景 |
| | `optionSelectedBg` | `#cce5ff` | 选项选中背景 |
| | `optionBorder` | `#d0d8f0` | 选项边框 |
| | `optionText` | `#333` | 选项文字 |
| | `correctBg` | `#d4edda` | 正确答案背景 |
| | `wrongBg` | `#f8d7da` | 错误答案背景 |
| | `wrongBorder` | `#ff6b6b` | 错误答案边框 |
| | `fillInputBg` | `#fafafa` | 填空输入框背景 |
| | `explanationText` | `#555` | 答案解析 |
| 动画 | `gridEmpty` | `#2a2a3e` | 内存网格空单元格 |
| | `gridEmptyStroke` | `#3a3a4e` | 空单元格描边 |
| ... | ... | ... | (完整列表见 theme.ts) |

### 加新颜色

在 `theme.ts` 的 `Colors` 对象中加一行，然后组件中引用 `Colors.xxx`。不给组件写死 hex。

### 暗色模式

将来实现暗色模式只需要：
1. 在 `theme.ts` 加 `DarkColors` 对象（同 key，不同值）
2. 加一个 `useColorScheme()` hook 切换
3. 不改任何组件代码

```
src/
├── theme.ts                   ← Design tokens (Colors, FontSize, Spacing, Radius, Layout)
├── types/index.ts            ← All shared TypeScript interfaces
├── navigation/AppNavigator.tsx ← Root stack + bottom tabs
├── store/
│   ├── useProgressStore.ts ← Zustand store (per-course progress, XP, card completion)
│   ├── authStore.ts        ← Auth interface (no-op) — User, login/logout, displayId
│   └── syncEngine.ts       ← Sync interface (no-op) — upload/download/merge progress
├── screens/
│   ├── HomeScreen.tsx         ← Course list (select subject)
│   ├── CourseScreen.tsx       ← Module list (select module within a course)
│   ├── ModuleScreen.tsx       ← Node list within a module
│   ├── NodeScreen.tsx         ← Card swiping (concept/code/animation/practice)
│   ├── QuizScreen.tsx         ← Quiz mode (practice cards only, score tracking)
│   ├── ProgressScreen.tsx     ← Level ring + per-course progress bars
│   ├── SettingsScreen.tsx     ← Avatar hub + sync + reset + about
│   └── LoginScreen.tsx        ← Login placeholder (close button, route registered)
├── components/
│   └── shared/
│       ├── ScreenHeader.tsx   ← Back/center/right header, compact: 33pt padding
│       └── ErrorBoundary.tsx  ← Catch render errors, flush progress, show retry UI
├── components/
│   ├── cards/
│   │   ├── renderCard.tsx     ← Card type dispatcher (switch on cardType)
│   │   ├── ConceptCard.tsx    ← Renders TextContent (title + body)
│   │   ├── CodeCard.tsx       ← Renders CodeContent (syntax-highlighted code block)
│   │   ├── PracticeCard.tsx   ← Wraps QuestionRenderer with local state
│   │   └── QuestionRenderer.tsx ← Shared question UI (choice/fill options, feedback)
│   └── animations/
│       ├── MemoryBox.tsx      ← Memory layout animation (Reanimated + SVG)
│       ├── LottiePlayer.tsx   ← Lottie JSON player (AE exports)
│       └── shared/
│           ├── GridRenderer.tsx ← SVG memory cell grid
│           ├── VarLabel.tsx     ← Animated variable name/type labels
│           └── AddressColumn.tsx ← Animated memory address column
├── data/
│   ├── courses/
│   │   ├── index.ts           ← export courses: Course[] (add new subjects here)
│   │   └── cpp/               ← C++ course
│   │       ├── index.ts       ← Course definition (id, title, color, nodes[])
│   │       ├── 01-basics/     ← ✅ 3 nodes / 22 cards
│   │       │   ├── index.ts       ← import + export basicsModule
│   │       │   ├── hello-world.ts ← 第一个程序 (3 cards)
│   │       │   ├── variables.ts   ← 变量声明 (8 cards)
│   │       │   └── io.ts          ← 输入与输出 (7 cards)
│   │       ├── 02-advanced/   ← ⬜ empty
│   │       ├── 03-oop/        ← ⬜ empty
│   │       ├── 04-stl/        ← ⬜ empty
│   │       ├── 05-generics/   ← ⬜ empty
│   │       └── 06-modern/     ← ⬜ empty
│   └── animations/
│       ├── index.ts           ← Animation registry (animationId → scenario + lazy component)
│       └── scenarios/
│           └── variableStorage.ts ← MemoryBox scenario data
```

## Data model (all types in src/types/index.ts)

```typescript
// ---- Course hierarchy ----
Course {
  id: string;              // e.g. "cpp"
  title: string;           // e.g. "C++"
  icon: string;            // MaterialCommunityIcons name, e.g. "language-cpp"
  color: string;           // hex color for UI
  nodes: PathNode[];
}

PathNode {
  id: string;              // e.g. "cpp-01-start"
  courseId: string;        // must match parent Course.id
  type: 'knowledge' | 'quiz';
  moduleId: ModuleId;      // "basics" | "advanced" | "oop" | "stl" | "generics" | "modern"
  module: string;          // display name, e.g. "基础"
  title: string;           // e.g. "第一个程序"
  cards: Card[];
}

ModuleId = 'basics' | 'advanced' | 'oop' | 'stl' | 'generics' | 'modern'

// ---- Card types ----
Card {
  id: string;              // e.g. "cpp-01-start-c1"
  cardType: 'concept' | 'code' | 'animation' | 'practice';
  content: TextContent | CodeContent | AnimationContent | PracticeContent;
}

TextContent   { title: string; body: string }
CodeContent   { title: string; code: string; language: string; highlights: number[] }
AnimationContent { animationId: string }  // key in animationRegistry
PracticeContent {
  question: string;
  questionType: 'choice' | 'fill';
  options?: string[];      // choice only
  answer: string;
  explanation: string;
}

// ---- Animation ----
MemoryBoxScenario {
  id: string;              // registry key, e.g. "variable-storage"
  title: string;
  cellsPerRow: number;
  totalRows: number;
  steps: MemoryBoxStep[];
}
MemoryBoxStep {
  label: string;
  allocations: VarAlloc[];
  showAddresses: boolean;
  annotation: string;
}
VarAlloc {
  name: string; type: string; typeSize: number;
  value: string; color: string;    // color = hex for grid cell fill
}
```

## Store (src/store/useProgressStore.ts)

```typescript
// State shape
{
  global: { totalXP: number; level: number }
  courses: Record<string, {
    completedCards: Record<string, true>;  // O(1) lookup via `cardId in completedCards`
    wrongCards: Record<string, true>;      // same lookup
    xp: number;                // per-course XP
    quizScores: Record<string, number>;
    nodePositions: Record<string, number>;  // nodeId → last card index
  }>
}

// Actions
addXP(courseId, amount)           // adds to course.xp + global.totalXP, recalculates level
completeCard(courseId, cardId)    // returns true if newly completed (dup-proof)
rewardCard(courseId, cardId, xp)  // completeCard + addXP in one call
saveQuizScore(courseId, nodeId, score)
setNodePosition(courseId, nodeId, cardIndex)  // saves reading position
resetCourse(courseId)             // clears one course, deducts from global XP
hydrate()                         // loads from AsyncStorage (called once in App.tsx)
flush()                           // immediately writes to AsyncStorage
```

### Persistence
- `subscribe()` debounced 500ms auto-save，`saveIfDirty()` 对比 JSON 跳过未变更写入
- `AppState.addEventListener('change')` flush on background/exit
- Manual `JSON.parse/stringify`, no zustand middleware (avoids Fabric compat issue)
- Persistent data is versioned (`CURRENT_VERSION` constant) — every save writes the version number

### 修改数据结构（迁移机制）

`PersistedData` 带 `version: number` 字段。`hydrate()` 时自动跑迁移链，从旧版本逐级升到 `CURRENT_VERSION`。

**操作步骤（改数据结构时）：**

1. 改 `CURRENT_VERSION` 常量（+1）
2. 在 `MIGRATIONS` 表里加一个迁移函数：

```ts
// CURRENT_VERSION 原来是 2，改成 3
const CURRENT_VERSION = 3;

const MIGRATIONS: Record<number, (data: any) => any> = {
  // v2→v3: 将 string[] 转为 Record<string, true>
  2: (data) => ({
    ...data,
    version: 3,
    courses: Object.fromEntries(
      Object.entries(data.courses).map(([id, c]: [string, any]) => [
        id,
        {
          ...c,
          completedCards: arrayToRecord(c.completedCards ?? []),
          wrongCards: arrayToRecord(c.wrongCards ?? []),
        },
      ])
    ),
  }),
};
```

3. 如果 `PersistedData` 或 `CourseProgress` 接口也改了，同步更新 TypeScript 类型

就这三步。已安装用户的旧版本数据会在下次 `hydrate()` 时自动迁移，不会丢数据、不会崩。迁移链上的每个函数只负责一个版本的跳跃，链式串联。

## Navigation (src/navigation/AppNavigator.tsx)

```
RootStack (NativeStack, headerShown: false)
  ├── MainTabs (BottomTab)
  │   ├── "Learn"    → HomeScreen       icon: school
  │   ├── "Progress" → ProgressScreen   icon: trophy
  │   └── "Settings" → SettingsScreen   icon: cog
  ├── "Course" → CourseScreen   params: { courseId }
  ├── "Module" → ModuleScreen   params: { courseId, moduleId }
  ├── "Node"   → NodeScreen     params: { courseId, nodeId }
  └── "Quiz"    → QuizScreen    params: { courseId, nodeId }
```

Route params typed in `RootStackParamList`. No auth wall — app is fully usable without login.

## Error Boundary (src/components/shared/ErrorBoundary.tsx)

包裹 `<NavigationContainer>` 的最外层 class 组件。任何 render 异常被捕获后：
1. `componentDidCatch` 调用 `useProgressStore.getState().flush()` 保存进度
2. 显示"出错了，进度已保存 + 重试"按钮
3. 点重试清除错误状态，重新 render 子树

## How screens read data

| Screen | Reads from store | Reads from static data |
|--------|:--:|:--:|
| HomeScreen | — | `courses` (list subjects) |
| CourseScreen | `courses[courseId].completedCards` | `courses.find()` (modules) |
| ModuleScreen | `courses[courseId].completedCards` | `courses.find()` (nodes & cards) |
| NodeScreen | `addXP`, `completeCard`, `setNodePosition`, `courses[courseId].nodePositions[nodeId]` | `courses.find()` (cards) |
| QuizScreen | `addXP`, `completeCard` | `courses.find()` (practice cards) |
| ProgressScreen | `global.totalXP`, `global.level`, `courses` | `courses` (total card counts) |
| SettingsScreen | `user`, `isLoggedIn`, `setDisplayId` (authStore), `resetCourse`, `flush`, `courses` (progressStore), `manualSync` (syncEngine) | `courses` (list for reset) |

## Card rendering pipeline

```
NodeScreen → renderCard({card, animStep, onPracticeComplete, onPracticeNext, isLast})
  ├── concept   → ConceptCard(content)
  ├── code      → CodeCard(content)
  ├── animation → getAnimComponent(animId) → component from registry
  └── practice  → PracticeCard(content, onComplete, onNext, isLast)
                    └── QuestionRenderer (shared choice/fill UI + feedback)
```

QuizScreen uses QuestionRenderer directly (no PracticeCard wrapper).

## Animation system — multi-type

所有动画遵循统一接口。添加新动画不改核心代码，只加数据+组件+注册。

**不改的文件（零改动，永远）：**
- `src/components/cards/renderCard.tsx` — 动画分支已存在，按 `cardType: 'animation'` 自动分发
- `src/screens/NodeScreen.tsx` — 卡片遍历逻辑不变，步进控制不变
- `src/types/index.ts` — `AnimationContent { animationId: string }` 已定义，Card 联合类型已包含

### 接口契约

```ts
// 所有动画场景必须满足（src/types/index.ts）
AnimScenario {
  id: string;         // registry key
  title: string;      // 显示名
  totalSteps: number; // 总步数（≥2），用于 NodeScreen 的 ← 上一步 / 下一步 →
}

// 组件必须接受（src/components/animations/）
ComponentType<{ scenario: AnimScenario; step: number }>
// step 从 0 到 totalSteps-1，组件根据 step 渲染对应画面
```

### 调度链路

```
数据层：Card { cardType:'animation', content:{ animationId:'xxx' } }
         ↓
渲染层：renderCard.tsx (case 'animation')
         → getAnimScenario(animationId)  → AnimScenario（查 registry）
         → getAnimComponent(animationId) → React 组件（查 registry）
         → React.createElement(Component, { key: card.id, scenario, step: animStep })
         ↓
交互层：NodeScreen 管理 animStep 状态，← → 按钮推进/回退 step
```

### Registry 结构（src/data/animations/index.ts）

```ts
// 每加一个动画，只在这个对象里加一行
export const animationRegistry: Record<string, AnimationEntry> = {
  'variable-storage': {
    scenario: variableStorageScenario,   // ← import 你的 scenario 对象
    Component: MemoryBox as ComponentType<...>,  // ← import 你的组件（已有组件可直接复用）
  },
  // ← 你的新动画加在这里
};

// 两个查找函数（已实现，不需要改）
getAnimScenario(animId): AnimScenario | undefined
getAnimComponent(animId): ComponentType<...> | null
```

### 当前动画类型

| 类型 | Scenario | 组件 | 场景文件模板 | 复用组件？ | 状态 |
|------|----------|------|-------------|----------|------|
| MemoryBox | `MemoryBoxScenario` | `MemoryBox.tsx` | `scenarios/variableStorage.ts` | 是 | 可用 |
| ScopeCode | `ScopeCodeScenario` | `ScopeCodePlayer.tsx` | `scenarios/scopeLifecycle.ts` | 是 | 可用 |
| Branch | `BranchScenario` | `BranchPlayer.tsx` | `scenarios/ifElseBranch.ts` | 是 | 可用 |
| Loop | `LoopScenario` | `LoopPlayer.tsx` | `scenarios/forLoop.ts` | 是 | 可用 |
| WhileDoWhile | `WhileDoWhileScenario` | `WhileDoWhilePlayer.tsx` | `scenarios/whileDoWhile.ts` | 是 | 可用 |
| Lottie | `LottieScenario` | `LottiePlayer.tsx` | `scenarios/lottieLoopFlow.ts` | 是 | 骨架（需装 `lottie-react-native` + 取消注释） |

---

### 添加 ScopeCode 动画（4 步）

适合展示"代码走读 + 内存状态同步"的场景——代码区高亮当前行，箭头指向下方内存格子，绿色=活着/灰色=已销毁。

**Step 1 — 创建 Scenario 文件**

在 `src/data/animations/scenarios/` 下新建文件：

```ts
import type { ScopeCodeScenario } from '@/types';

export const myScopeScenario: ScopeCodeScenario = {
  id: 'my-scope',
  title: '标题',
  totalSteps: 4,
  sourceCode: 'int main() {\n  int x = 10;\n}',
  cellsPerRow: 8,
  totalRows: 2,
  steps: [
    {
      label: '步骤名',
      highlightLines: [1],   // 高亮 sourceCode 的第几行（0-indexed）
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '10', color: '#2ed573' },
      ],
      annotation: '底部注释',
    },
    // ... 更多步骤
  ],
};
```

**Step 2 — 注册到 Registry**

```ts
import { myScopeScenario } from './scenarios/myScope';
import ScopeCodePlayer from '@/components/animations/ScopeCodePlayer';

'my-scope': {
  scenario: myScopeScenario,
  Component: ScopeCodePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
},
```

**Step 3 — 在节点中插入动画卡**

```ts
{ cardType: 'animation', content: { animationId: 'my-scope' } }
```

**Step 4 — 不改任何组件代码。** 组件复用 `ScopeCodePlayer.tsx`。

---

### 添加 Branch 动画（4 步）

适合展示"条件 → 分支路径二选一"的场景——代码区高亮条件行和两条分支，true 路径绿色高亮、false 路径灰色跳过。

**Step 1 — 创建 Scenario 文件**

在 `src/data/animations/scenarios/` 下新建文件：

```ts
import type { BranchScenario } from '@/types';

export const myBranchScenario: BranchScenario = {
  id: 'my-branch',
  title: '标题',
  totalSteps: 3,
  sourceCode: 'int x = 10;\n\nif (x > 5) {\n    cout << "大";\n} else {\n    cout << "小";\n}',
  steps: [
    {
      label: '步骤名',
      highlightLines: [2],       // 条件行 / switch 行（蓝色高亮）
      takenLines: [3],           // 本次执行的行（绿色高亮）
      skippedLines: [5],         // 本次跳过的行（灰色）
      annotation: '底部注释',
    },
    // ... 更多步骤
  ],
};
```

`takenLines` / `skippedLines` 设计思路：
- 不区分 if/else/switch，只描述"当前这一步执行哪些行、跳过哪些行"
- 没有 takenLines 时（空数组）→ 条件行显示 `?`，表示正在求值
- 有 takenLines 时 → 条件行显示 `↓`，绿色行=执行，灰色行=跳过
- switch 场景同样适用：匹配的 case 行放入 takenLines，其余 case 行放入 skippedLines

**Step 2 — 注册到 Registry**

```ts
import { myBranchScenario } from './scenarios/myBranch';
import BranchPlayer from '@/components/animations/BranchPlayer';

'my-branch': {
  scenario: myBranchScenario,
  Component: BranchPlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
},
```

**Step 3 — 在节点中插入动画卡**

```ts
{ cardType: 'animation', content: { animationId: 'my-branch' } }
```

**Step 4 — 不改任何组件代码。** 组件复用 `BranchPlayer.tsx`。

---

### 添加 Loop 动画（4 步）

适合展示"循环重复执行"的场景——代码区高亮 for 行和循环体，上方显示当前迭代轮次和是否进入循环体。

**Step 1 — 创建 Scenario 文件**

在 `src/data/animations/scenarios/` 下新建文件：

```ts
import type { LoopScenario } from '@/types';

export const myLoopScenario: LoopScenario = {
  id: 'my-loop',
  title: '标题',
  totalSteps: 4,
  sourceCode: 'int sum = 0;\n\nfor (int i = 0; i < 3; i++) {\n    sum += i;\n}',
  steps: [
    {
      label: '步骤名',
      highlightLines: [2],       // for 行（0-indexed）
      bodyLines: [3],            // 循环体行号
      iteration: 1,              // 0=init, 1..n=第N轮, -1=跳出
      entered: true,             // 是否进入循环体
      annotation: '底部注释',
    },
    // ... 更多步骤
  ],
};
```

`iteration` / `entered` 字段：
- `iteration: 0, entered: false` — 初始化阶段
- `iteration: 1, entered: true` — 第 1 轮，进入循环体（bodyLines 绿色高亮）
- `iteration: -1, entered: false` — 条件为假，跳出循环（bodyLines 灰色）

**Step 2 — 注册到 Registry**

```ts
import { myLoopScenario } from './scenarios/myLoop';
import LoopPlayer from '@/components/animations/LoopPlayer';

'my-loop': {
  scenario: myLoopScenario,
  Component: LoopPlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
},
```

**Step 3 — 在节点中插入动画卡**

```ts
{ cardType: 'animation', content: { animationId: 'my-loop' } }
```

**Step 4 — 不改任何组件代码。** 组件复用 `LoopPlayer.tsx`。

---

### 添加 Lottie 动画（5 步）

**前置条件：** 安装 `lottie-react-native`（Expo SDK 55 兼容版本），取消 `LottiePlayer.tsx` 和 registry 里的注释。

**Step 1 — 导出 Lottie JSON**

AE 安装 Bodymovin 插件 → 选择要导出的合成 → File → Export → Bodymovin → 选 "Standalone" → 生成 `.json` 文件。注意：AE 里的 raster 效果（粒子、模糊、混合模式）会丢失或转成 base64 内嵌，尽量只导出形状图层动画。

**Step 2 — 放入资源目录**

将 `.json` 文件放入 `assets/lottie/`，例如 `assets/lottie/loop-flow.json`。

**Step 3 — 创建 Scenario 文件**

在 `src/data/animations/scenarios/` 下新建文件，例如 `loopFlow.ts`：

```ts
import type { LottieScenario } from '@/types';

export const lottieLoopFlow: LottieScenario = {
  id: 'loop-flow',                          // 唯一 ID，与 registry key 一致
  title: '循环执行流程',                     // 显示名
  totalSteps: 5,                            // 用户可步进的步数
  lottieFile: './assets/lottie/loop-flow.json',
};
```

`totalSteps` 决定用户分几步看完这段动画。LottiePlayer 内部把 `step / (totalSteps - 1)` 映射到 0–1 的播放进度。例如 `totalSteps: 5` → 步进 0/1/2/3/4 对应进度 0/0.25/0.50/0.75/1.0。

**Step 4 — 注册到 Registry**

在 `src/data/animations/index.ts` 中：

```ts
// 顶部加 import
import { lottieLoopFlow } from './scenarios/loopFlow';
import LottiePlayer from '@/components/animations/LottiePlayer';

// registry 对象中加一行
export const animationRegistry: Record<string, AnimationEntry> = {
  // ... 已有条目 ...
  'loop-flow': {
    scenario: lottieLoopFlow,
    Component: LottiePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
};
```

**Step 5 — 在节点中插入动画卡**

在对应节点的 `cards[]` 中，把动画卡放到想出现的位置：

```ts
{ cardType: 'animation', content: { animationId: 'loop-flow' } }
```

如：概念卡 → 代码卡 → **动画卡** → 练习卡。用户翻到这一张时自动渲染动画组件，← → 按钮控制步进。

---

### 添加 MemoryBox 动画（4 步）

适合展示内存布局、变量分配、数据结构存储等场景。

**Step 1 — 创建 Scenario 文件**

在 `src/data/animations/scenarios/` 下新建文件，例如 `arrayStorage.ts`，按 `variableStorage.ts` 模板填写：

```ts
import type { MemoryBoxScenario } from '@/types';

export const arrayStorageScenario: MemoryBoxScenario = {
  id: 'array-storage',
  title: '数组内存布局',
  cellsPerRow: 8,        // 每行格子数
  totalRows: 5,          // 总行数（cellsPerRow × totalRows = 总地址数）
  totalSteps: 4,         // 步数 = steps 数组长度
  steps: [
    {
      label: '初始状态',
      allocations: [],
      showAddresses: false,
      annotation: '内存初始为空',
    },
    {
      label: 'int arr[3]',
      allocations: [
        { name: 'arr[0]', type: 'int', typeSize: 4, value: '10', color: '#4a9eff' },
        { name: 'arr[1]', type: 'int', typeSize: 4, value: '20', color: '#2ed573' },
        { name: 'arr[2]', type: 'int', typeSize: 4, value: '30', color: '#ff9f43' },
      ],
      showAddresses: false,
      annotation: '连续分配 3 个 int，占 12 字节',
    },
    // ... 更多步骤
  ],
};
```

`VarAlloc` 字段：`name`（变量名）、`type`（类型，仅标签显示）、`typeSize`（字节数，决定格子宽度）、`value`（显示值）、`color`（hex 颜色，填充格子和标签）。

**Step 2 — 注册到 Registry**

```ts
import { arrayStorageScenario } from './scenarios/arrayStorage';
// MemoryBox 已 import，复用即可

'array-storage': {
  scenario: arrayStorageScenario,
  Component: MemoryBox as ComponentType<{ scenario: AnimScenario; step: number }>,
},
```

**Step 3 — 在节点中插入动画卡**

```ts
{ cardType: 'animation', content: { animationId: 'array-storage' } }
```

**Step 4 — 不改任何组件代码。** 组件复用 `MemoryBox.tsx`，不需要新建。

---

### 添加全新动画类型（参考 ScopeCodePlayer 实现）

当 MemoryBox / ScopeCode / Lottie 都不满足需求时，自定义新的动画类型。**ScopeCodePlayer 就是按这个流程创建的——可以直接参考它的代码。**

1. **在 `src/types/index.ts`** 定义新场景类型（extends AnimScenario）：
   ```ts
   // 参考：ScopeCodeScenario、ScopeCodeStep
   export interface MyScenario extends AnimScenario {
     // 你的字段
   }
   ```

2. **在 `src/components/animations/`** 创建新组件，满足接口契约：
   ```tsx
   interface Props { scenario: MyScenario; step: number; }
   export default function MyPlayer({ scenario, step }: Props) {
     // 根据 step 渲染
   }
   ```

3. **Registry 注册一行**（和已有动画完全一样）。

4. **不改 renderCard.tsx、NodeScreen.tsx、animationRegistry 结构。**

## Content authoring — no source changes needed

### Add a new course (e.g. "数据结构")
1. Create `src/data/courses/ds/index.ts` (copy pattern from `cpp/index.ts`)
2. Create module folders under `ds/{module}/`
3. Add `import { dsCourse } from './ds'` + add to `courses` array in `src/data/courses/index.ts`

### Add a new node to a module

**CRITICAL: 一个节点 = 一个文件。禁止把多个节点写进同一个文件。禁止把所有节点塞进 index.ts。index.ts 只做 import + export，不写卡片数据。**（模板：`01-basics/hello-world.ts`）

1. 在模块目录下创建 `{topic}.ts`（如 `operators.ts`、`loops.ts`）
2. 按模板填写节点数据：

```typescript
import type { PathNode } from '@/types';

export const operatorsNode: PathNode = {
  id: '{courseId}-{moduleNum}-{topic}',
  courseId: 'cpp',
  type: 'knowledge',         // or 'quiz' for module-end quiz
  moduleId: 'basics',        // stable: matches parent module folder convention
  module: '基础',            // display: shown in UI
  title: '节点标题',
  cards: [ ... ],
};
```

3. 在模块 `index.ts` 中 import + 加入 nodes 数组：

```typescript
import { operatorsNode } from './operators';
// 加进 nodes 数组（在 const nodes: PathNode[] = [...] 中）

4. 文件名用 kebab-case：`hello-world.ts`、`operators.ts`、`if-else.ts`。每个 export 的变量名用 camelCase + `Node` 后缀：`helloWorldNode`、`operatorsNode`

Module IDs by convention:

| Folder | moduleId | module |
|--------|----------|--------|
| 01-basics | `basics` | 基础 |
| 02-advanced | `advanced` | 进阶 |
| 03-oop | `oop` | 面向对象 |
| 04-stl | `stl` | STL |
| 05-generics | `generics` | 泛型 |
| 06-modern | `modern` | 现代 C++ |

### Card ID convention
`{courseId}-{moduleNum}-{topic}-c{sequence}`
Examples: `cpp-01-start-c1`, `cpp-01-basics-var-c1`

### Card content templates
```typescript
// concept
{ cardType: 'concept', content: { title: '...', body: '...' } }

// code (highlights = line numbers to highlight)
{ cardType: 'code', content: { title: '...', code: '...', language: 'cpp', highlights: [0, 2] } }

// practice (choice)
{ cardType: 'practice', content: { question: '...', questionType: 'choice', options: ['A','B','C','D'], answer: 'B', explanation: '...' } }

// practice (fill)
{ cardType: 'practice', content: { question: '...', questionType: 'fill', answer: 'main', explanation: '...' } }

// animation (Lottie / MemoryBox 都用同一格式，animationId 对应 registry key)
{ cardType: 'animation', content: { animationId: 'variable-storage' } }
// 插入位置 = 在 cards[] 中放到你想出现的位置即可，支持任意穿插
```

# Auth & Sync Interface（认证/同步接口层）

三个文件共同构成登录抽象层。当前是 no-op 实现（未登录也能用 app），将来替换实现即可——**不改任何现有文件**。

## 接口文件（3 个，不改现有代码）

### `src/store/authStore.ts` — 认证 store（Zustand）

对外暴露 `useAuthStore`。

```ts
// === Selector（稳定，不可改签名）===
s => s.user          // User | null
s => s.isLoggedIn    // boolean
s => s.isMounted     // boolean

// === User 类型（稳定）===
User {
  id: string;          // 系统 UID（同步用，不可变）
  phone?: string;      // 手机号
  name?: string;       // 名称
  avatar?: string;     // 头像 URL
  displayId?: string;  // 用户自定义显示名（可在设置页编辑）
}

// === Action（稳定）===
initialize()          // 启动时恢复 session（App.tsx 调用）
logout()              // 登出
setDisplayId(v:string)// 修改 displayId（设置页头像区域调用）
updateAvatar(url: string) // 更新头像 URL（设置页头像编辑调用）

// === Action（仅 LoginScreen 调用，现有代码不调用）===
loginByPhone(phone)   → { error? }
verifyOtp(phone,token) → { error? }
loginByWechat()       → { error? }
```

> **`updateAvatar` 尚未在代码中实现。** 需要时在 `authStore.ts` 的 `create` 里加一个 no-op action（和 `setDisplayId` 并列），将来替换实现即可。不改任何其他文件。

### `src/store/syncEngine.ts` — 同步模块（纯函数）

```ts
// === 导出函数（稳定，不可改签名）===
uploadProgress(userId): Promise<void>         // 本地 → 远程
syncOnLogin(userId): Promise<void>            // 远程 → 合并 → 回写
manualSync(userId): Promise<{ lastSyncedAt: Date | null }>  // 手动同步
```

### `src/screens/LoginScreen.tsx` — 登录页

当前为占位 UI（"登录功能即将上线"）。路由已注册（`Login: undefined`）。

## 调用关系

```
App.tsx          → authStore.initialize()          ← 启动时
SettingsScreen   → authStore (user, isLoggedIn, setDisplayId)
                   syncEngine.manualSync(userId)    ← 同步按钮
                   navigation.navigate('Login')     ← 登录入口
LoginScreen      → authStore.loginByPhone / verifyOtp / loginByWechat
AppNavigator     → <LoginScreen>                   ← 路由注册
```

## 将来加入真实登录——操作步骤

**不改任何现有文件的代码。** 替换 3 个 no-op 实现 + 新建几个文件即可。

### 1. 替换 `authStore.ts` 实现

`initialize()` 从后端恢复 session，`loginByPhone/verifyOtp/loginByWechat` 调 SDK，`logout()` 清除 token。useAuthStore 的 selector 签名不变。

### 2. 替换 `syncEngine.ts` 实现——核心：syncOnLogin 全流程

```
用户登录成功（拿到 userId）
        ↓
syncEngine.syncOnLogin(userId)
        ↓
  ┌─────────────────────────────────────────┐
  │ 1. 读本地 PersistedData                  │  ← AsyncStorage.getItem('codecard-progress')
  │ 2. GET /progress/{userId}               │  ← 查远程
  │ 3. merge(local, remote)                 │  ← 客户端合并
  │ 4. PUT /progress/{userId} + body={合并结果} │  ← 写回远程
  │ 5. 合并结果写入本地 Zustand store          │  ← hydrate
  └─────────────────────────────────────────┘
```

**合并策略（merge 函数，写在 syncEngine.ts 里）：**

```ts
function merge(local: PersistedData, remote: PersistedData | null): PersistedData {
  if (!remote) return local;

  return {
    version: CURRENT_VERSION,
    global: {
      totalXP: Math.max(local.global.totalXP, remote.global.totalXP),
      level: calcLevel(Math.max(local.global.totalXP, remote.global.totalXP)),
    },
    courses: mergeCourses(local.courses, remote.courses),
  };
}

function mergeCourses(
  local: Record<string, CourseProgress>,
  remote: Record<string, CourseProgress>,
): Record<string, CourseProgress> {
  const allIds = new Set([...Object.keys(local), ...Object.keys(remote)]);
  const merged: Record<string, CourseProgress> = {};
  for (const id of allIds) {
    const l = local[id];
    const r = remote[id];
    merged[id] = {
      completedCards: { ...(r?.completedCards ?? {}), ...(l?.completedCards ?? {}) },
      wrongCards: { ...(r?.wrongCards ?? {}), ...(l?.wrongCards ?? {}) },
      xp: Math.max(l?.xp ?? 0, r?.xp ?? 0, Object.keys({ ...(r?.completedCards ?? {}), ...(l?.completedCards ?? {}) }).length * 5),
      quizScores: { ...(r?.quizScores ?? {}), ...(l?.quizScores ?? {}) },
      nodePositions: { ...(r?.nodePositions ?? {}), ...(l?.nodePositions ?? {}) },
    };
  }
  return merged;
}
```

**三条规则：**
- `completedCards` → 并集（两边完成的都算）
- `xp / totalXP` → 取 max(本地, 远程, 并集卡片数×5)（5 是单张卡最低 XP。实际实现时建议跟踪每张卡的 XP 来源，避免不同设备完成不同卡片时 XP 少算）
- `quizScores / nodePositions` → 本地覆盖远程（本地是最新操作）

### 3. 后端数据库

只需一张表，存的是和 AsyncStorage 里完全相同的 JSON：

```sql
CREATE TABLE user_progress (
  user_id    TEXT PRIMARY KEY,
  data       JSONB NOT NULL,        -- PersistedData 原样存取
  version    INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**必须开 RLS（Row Level Security）**——否则 anon key 暴露后任何人可读写全库：

```sql
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "读写自己的进度" ON user_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

三层 SQL 封住权限，App 代码不用改。详细见 `docs/supabase-auth-plan.md`。

后端只做存取不做业务逻辑。合并判断在客户端 `syncEngine` 里完成，换 BaaS、换自建后端、换协议，都不影响合并逻辑。

### 4. 替换 `LoginScreen.tsx` UI

占位 UI → 手机号输入 + 微信登录按钮。文件名不变。

### 5. 新建文件

```
src/lib/supabase.ts        ← 客户端初始化（或用其他 BaaS SDK）
src/api/
├── client.ts              ← fetch/axios 封装 + token 拦截器
├── auth.ts                ← login / register / refreshToken
└── progress.ts            ← upload / download
.env                        ← EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY
app.json                    ← 加 scheme: "codecard"
```

### 6. 增量改动（非破坏性）

| 文件 | 加什么 | 为什么 |
|------|--------|--------|
| `useProgressStore.ts` | `dirtyCards: string[]` 字段 + `markDirty(cardId)` action | 标记"已学但未同步"的卡片，同步后清除。不影响现有 action |
| `syncEngine.ts` | 替换 no-op 为真实网络调用 | **设计如此** |

### 改动总结

| 文件 | 现有代码改动 |
|------|:--:|
| `syncEngine.ts` | 替换 no-op 实现 |
| `authStore.ts` | 替换 no-op 实现 |
| `LoginScreen.tsx` | 替换占位 UI |
| `useProgressStore.ts` | 增量加 dirtyCards |
| `src/api/*`、`src/lib/*` | 新建 |
| **SettingsScreen / AppNavigator / App.tsx / 所有课程数据** | **零改动** |

## 将来加后端——无需重构

当前架构遵循 **UI 只读 Zustand，后端对 UI 透明** 的原则。1-2 年后加后端只需新增文件 + 替换 no-op 实现，不动现有代码。

### 架构原则（记这个就够了）

```
Screen → Zustand store → UI 渲染         ← 永远从本地读，不感知后端
         ↕                   
        syncEngine → 后端 API            ← 后台悄悄同步，Screen 不知道
```

### 已有接口角色

| 接口 | no-op 现状 | 有后端后 | 改什么 |
|------|-----------|---------|--------|
| `authStore` | 用户 null | 调后端登录 API，存 token | 替换实现，接口不变 |
| `syncEngine` | 三函数空返回 | POST/GET 远程数据 | 替换实现，函数签名不变 |
| `useProgressStore` | AsyncStorage 本地 | 数据不变，加 `dirty` 标记（哪些未同步） | **不替换**，增量加字段 |

### 需要新建的文件（全部新建，零现有文件改动）

```
src/api/
├── client.ts        ← Axios/fetch 封装，baseURL + 拦截器
├── auth.ts          ← login / register / refreshToken
└── progress.ts      ← upload / download / merge
src/store/
├── offlineQueue.ts  ← 离线操作队列（断网时暂存，恢复后重放）
└── networkStore.ts  ← isOnline 状态
```

### 可能增量改动的位置（非破坏性）

| 文件 | 加什么 | 说明 |
|------|--------|------|
| `useProgressStore.ts` | 加 `dirtyCards: Set<string>` | 标记"已学但未同步"的卡片，不影响现有 action |
| `syncEngine.ts` | 替换 no-op 为真实网络调用 | **设计如此** |

### 不会被锁定的技术选型

| 决策 | 当前状态 | 1-2 年后能否换 |
|------|---------|--------------|
| BaaS vs 自建后端 | 未选，syncEngine 是纯函数 | ✅ 随时换 |
| Supabase vs 其他 | 未绑定，没有 import supabase | ✅ 随时换 |
| REST vs WebSocket | 未选，syncEngine 是 async 函数 | ✅ 随时换 |
| Zustand | 在用 | ✅ Zustand API 稳定，无中间件依赖 |

**核心约束只有一个：`PersistedData` 结构（`global + courses + completedCards + xp`）是数据契约。后端 `user_progress` 表必须接受这个 JSON 结构。改了这个结构才需要改现有代码，不改结构就完全隔离。**

## SettingsScreen 完整布局

```
┌─ 头像区域（始终可见）──────────────┐
│  ⭕ 96px 圆形头像（未登录灰色图标）  │ ← 未登录点头像→LoginScreen
│  用户名 ✏️                        │ ← 已登录：可编辑 displayId
│  138****8888                      │ ← 手机号（合并自旧账号 section）
│  上次同步：...  [立即同步][退出登录] │ ← 同步+登出（合并自旧同步 section）
│        或 未登录 → [登录以同步进度]  │ ← 未登录时
├───────────────────────────────────┤
│ 重置课程进度                        │
│ ● C++（5 张已完成）              › │
├───────────────────────────────────┤
│ ╔═ 危险操作 ═════════════════════╗ │ ← 红色描边，仅在有进度时显示
│ ║ 清空全部数据                  › ║ │
│ ╚════════════════════════════════╝ │
├───────────────────────────────────┤
│ 关于  / 版本 / 技术                │
└───────────────────────────────────┘
```

- 头像 96px，displayId 空时显示"设置用户名"
- displayId 点击弹出 Modal 编辑框（跨平台 TextInput 方案，非 Alert.prompt）
- 重置课程/清空数据前弹出确认对话框
- 危险操作卡片仅 `hasProgress` 为 true 时渲染

## WrongCardsScreen 两级导航

```
ProgressScreen                    WrongCardsScreen               WrongCardsScreen
  [错题集 3]  ──────────────→    ┌─ ← 错题集 ──────────┐       ┌─ ← 错题集  C++ ────┐
                                  │                       │       │                       │
                                  │  ● C++         3  ›  │  →   │  基础                 │
                                  │    sizeof(int) 的... │       │  ┌───────────────┐   │
                                  │                       │       │  │ 入口函数是？   │   │
                                  │  ● Python      1  ›  │       │  │ 答案：main()  │   │
                                  │                       │       │  └───────────────┘   │
                                  │                       │       │  共 3 道 · 答对自动   │
                                  └───────────────────────┘       └───────────────────────┘
```

- 第一级：按课程分组的卡片列表，每张显示课程色圆点 + 课程名 + 错题数角标 + 首题预览
- 第二级：点击课程进入，显示该课程所有错题（题目 + 答案 + 解析），返回标签为"错题集"
- 路由：`WrongCards: { courseId?: string }`，无 courseId 显示课程列表，有 courseId 显示详情
- 详情页使用 `navigation.push`，支持同路由叠加
- 空态：第一级显示 🎯 暂无错题，第二级显示 ✅ 全部掌握
- 答对自动移除：NodeScreen / QuizScreen 中答对同一张卡 → `removeWrongCard` → 错题集自动更新

### 数据流

```
NodeScreen / QuizScreen 答错 → addWrongCard(courseId, cardId) → CourseProgress.wrongCards
NodeScreen / QuizScreen 答对 → removeWrongCard(courseId, cardId) → 从 wrongCards 移除

WrongCardsScreen 读取：
  wrongCards (仅存 cardId, Record<string, true>) → 遍历 courses 数据匹配 → 获取最新题目/答案/解析
```

- 只存 `cardId`，不存题目内容。改了解析文案 → 错题集自动显示最新版
- 新增课程/模块/练习卡 → 自动出现在错题集，无需改任何 UI 代码
- 重置课程 → `wrongCards: {}` 一并清空
- 数据迁移 v1→v2 自动补 `wrongCards: []`，v2→v3 转为 `Record<string, true>`

### ProgressScreen 错题入口

```
┌─ ⚠ 错题集 ──────────── 3 › ─┐
│  ● C++              2 道    │
│  ● Python           1 道    │
└──────────────────────────────┘
```

0 题时显示 `✅ 全部掌握`（绿色，不可点击）。点击进入 WrongCardsScreen 第一级。

## 将来规模化——什么时候改、怎么改

以下三项在 v1.0 solo 开发阶段不需要动。各自有明确的触发条件，条件满足后再动手。

### 1. 远程可更新内容

**现状：** 课程数据写死在 `src/data/courses/` 的 TS 文件中，改一个错别字也要重新 build 发版。

**触发条件（满足任一条即启动）：**
- 课程 ≥ 3 门，且每门 ≥ 3 个模块有实际内容
- 内容更新频率 ≥ 一周一次
- 有第二个人参与写内容（非开发者）

**怎么改：**
1. 课程数据从 TS 文件迁出，存为 JSON 文件，上传到 CDN（或 Supabase Storage）
2. `src/data/courses/` 改为加载器：启动时先读本地缓存，再 `fetch` CDN 检查新版本
3. 有网 → 下载最新 JSON → 覆盖本地缓存 → 渲染新内容
4. 无网 → 用本地缓存，不阻塞
5. 版本号字段控制增量更新，只下载变更的课程文件

**不改什么：** `Card` / `PathNode` / `Course` 的 TypeScript 类型不变。加载器返回的类型签名和现在的 `courses` 数组完全一样，所有 Screen 不感知数据来源变化。

**关键约束：** 远程 JSON 的 schema 必须和当前 `Course[]` 类型对齐。如果加新 cardType，先改 `src/types/index.ts`，再改 CDN 上的 JSON。

### 2. 测试

**现状：** `package.json` 里没有测试框架，`"lint": "tsc --noEmit"` 只做类型检查。核心逻辑（calcLevel、completeCard、rewardCard、merge）靠手动验证。

**触发条件（满足任一条即启动）：**
- 有第二个人开始改 store 逻辑
- `useProgressStore.ts` 超过 300 行
- 接后端同步后合并逻辑变复杂（冲突解决、离线队列）
- 出现过一次"改了 store 但没发现 break 了 XX 功能"的线上事故

**怎么改：**
1. 装 Jest + @testing-library/react-native（Expo 项目 Jest 已内置，只需 `npx expo install jest-expo jest`）
2. 先给纯函数补用例：`calcLevel`（边界 0/99/100/299/300）、`completeCard`（去重/新课自建 entry）、`rewardCard`（XP+完成原子性）、`merge/migrate`
3. 纯函数用例跑通后，再考虑组件测试
4. 参考 `docs/store-invariants.md` 里的不变量清单写断言

**不改什么：** 不引入 E2E 框架（Detox/Maestro），不追求覆盖率数字。测试只覆盖"改坏了会导致数据丢失或 XP 算错"的路径。

### 3. 内容创作格式——大段文字抽出

**现状：** 课程正文直接写在 TS 文件里，用 `\n` 换行。`body: '第一行\n\n第二行'` 可读性差。

**触发条件（满足任一条即启动）：**
- 单张概念卡的 `body` 超过 500 字
- 一个模块有 ≥ 10 张概念卡
- 有非技术人员需要写/审校课程内容

**怎么改（选一个方案）：**

**方案 A — Markdown 文件（推荐）：**
1. 在 `src/data/courses/cpp/01-basics/` 下新建 `content.md`
2. 写一个 `parseMarkdown(md: string): Card[]` 函数，按 `##` 分割卡片，按 `###` 分割字段
3. 原 `index.ts` 只保留结构（id、type、moduleId），`content` 字段从 md 文件读取
4. 编辑器里写 Markdown 比 TS 字符串舒服得多

**方案 B — 远程 CMS（方案 A 的延续）：**
1. 内容迁到 Notion / Google Sheets / 自定义后台
2. build 时或运行时拉取 → 转 JSON → 加载
3. 非技术人员直接在表格里填内容，不需要碰代码

**不改什么：** `Card` 接口不变。渲染组件（ConceptCard、CodeCard）不变。只是数据从 TS 挪到 Markdown/远程，加载器返回的还是 `Card[]`。

### 4. 付费与权限系统

**现状：** 无付费/权限概念，所有课程免费可访问。HomeScreen → CourseScreen 无拦截。

**触发条件：** 准备上线第一门付费课程时启动。

**怎么改：**

```
HomeScreen                    CourseScreen
  C++                       进入前判断：
  Python  🔒   ←点它→        hasAccess? → 进课
  数据结构  🔒                : → 弹付费提示
```

1. **`types/index.ts` — `PathNode` 加可选字段：**
```ts
PathNode {
  requiresSubscription?: boolean;  // 不填 = 免费模块
}
```

2. **新建 `store/permissionStore.ts`：**
```ts
// Zustand store
entitledNodes: Set<string>;  // 已购买的模块 nodeId
isSubscribed: boolean;       // 是否有有效订阅（全解锁）

// Actions
checkAccess(nodeId): boolean;
setEntitlements(nodes: string[]): void;
```

3. **新建 `src/lib/payments.ts` — RevenueCat / IAP 封装**

4. **CourseScreen.tsx — +5 行：** 付费模块显示 🔒 图标，免费模块正常显示

5. **ModuleScreen.tsx — +5 行：** 进入模块前调 `checkAccess(nodeId)`，无权限弹付费 Modal

6. **所有现存模块数据不加字段**（`requiresSubscription` 默认 undefined → 免费）

**数据示例——C++ 后面几个模块设为付费：**
```ts
// 01-basics：不加字段，免费
{ id: 'cpp-01-basics-io', ... }

// 02-advanced：加字段，付费
{ id: 'cpp-02-pointers', requiresSubscription: true, ... }
```

**不改什么：**
- 所有卡片组件、renderCard、NodeScreen、QuizScreen — 卡片渲染不关心权限
- useProgressStore — 进度和付费正交
- wrongCards/错题集 — 免费模块的错题一样记录
- HomeScreen — 课程列表不变（付费粒度在模块不在课程）
- AppNavigator — 路由不变
- 权限检查只在 CourseScreen（显示锁）和 ModuleScreen（进入拦截）两处

**和不改代码的关系：** 权限 store 是纯增量，和 authStore 一样先抽接口。但和 authStore 不同的是——没有任何现有屏幕引用它（不像 SettingsScreen 引用了 authStore），所以现在不抽，等上线付费时再抽。到时候按这个文档改，AI 不需要读源码。

### 5. 社交/社区/评论

**现状：** 无社交功能。App 是纯单人学习工具。

**触发条件（满足任一条即启动）：**
- 需要用户评论/讨论卡片内容
- 需要学习社区（排行榜、学习群组）
- 需要用户间互动（点赞、分享学习进度）

**怎么改——全增量，不改核心：**

```
当前架构                    + 社交层
─────────                  ─────────
types/index.ts             不变
store/useProgressStore.ts  不变
screens/NodeScreen.tsx     不变
components/cards/*         不变

新建：
  src/store/socialStore.ts     ← 评论/点赞/动态状态
  src/store/notificationStore.ts ← 推送通知状态
  src/screens/CommunityScreen.tsx ← 社区主页（新 Tab）
  src/screens/CommentsScreen.tsx  ← 单卡评论区
  src/api/social.ts           ← 评论/点赞 API
  src/api/notification.ts     ← 推送注册/消息 API
```

**改什么（增量，不改现有文件）：**

| 文件 | 加什么 | 说明 |
|------|--------|------|
| `types/index.ts` | Comment / Post 等新类型 | 和 Card 类型正交，不相干 |
| `authStore.ts` | 替换 no-op → 真实登录 | **设计如此**，接口不变 |
| `AppNavigator.tsx` | 加路由 + 可能加第四个 Tab | 路由注册，不影响现有 |
| `components/cards/renderCard.tsx` | 卡片底部加评论入口（可选） | 可以是独立组件插进去 |

**不改什么：**
- 所有卡片数据（Card / PathNode / Course）——评论通过 cardId 关联，卡片不感知
- useProgressStore ——学习和社交完全正交
- 所有 Screen ——只是新增社交页面，旧页面零改动
- 主题系统 ——社交 UI 用现有 token 即可

**关键约束：**
- 评论/帖子通过 `cardId` / `nodeId` / `courseId` 关联内容，不走 Card 接口
- 社交 store 独立，不 import 进度 store
- **本质是同一个架构上加速增层，不是重构**

---

### 6. 视频/音频课程

**现状：** 卡片类型只有 concept / code / animation / practice 四种，不支持媒体播放。

**触发条件（满足任一条即启动）：**
- 需要嵌入视频讲解（非动画，是真人/录屏视频）
- 需要音频课程/播客模式

**怎么改——和加 AnimationContent 完全一样的模式：**

**Step 1 — 在 `types/index.ts` 加新类型（~10 行）：**

```ts
// 加在 AnimationContent 旁边
export interface VideoContent {
  videoUrl: string;         // 远程 URL 或本地 asset
  thumbnailUrl?: string;    // 封面图
  duration?: number;        // 秒
  subtitles?: Subtitle[];   // 字幕
}

export interface AudioContent {
  audioUrl: string;
  duration?: number;
  transcript?: string;      // 文字稿
}

// Card 联合类型加两行
export type Card = ... | AnimationCardData | VideoCardData | AudioCardData;
```

**Step 2 — 在 `components/cards/` 新建播放器组件：**

```tsx
// VideoCard.tsx — 视频播放器
interface Props { content: VideoContent }
// 用 expo-av 的 Video 组件

// AudioCard.tsx — 音频播放器
interface Props { content: AudioContent }
// 用 expo-av 的 Audio 组件
```

**Step 3 — `renderCard.tsx` 加两行：**

```tsx
case 'video':  return <VideoCard content={content} />;
case 'audio':  return <AudioCard content={content} />;
```

**Step 4 — 建设基础设施（这是真正的工作量）：**

```
src/lib/
├── mediaCache.ts    ← 下载管理 + 离线缓存
├── mediaPlayer.ts   ← expo-av 封装（播放/暂停/seek/进度）
└── downloadManager.ts ← 后台下载 + 队列
```

**不改什么：**
- renderCard 的 switch 结构不变（加分支即可）
- NodeScreen / QuizScreen 的卡片遍历逻辑不变
- useProgressStore 不变（完成记录和媒体无关）
- 所有现有卡片组件不变
- 主题系统不变

**关键约束：**
- 视频/音频只是 Card 联合类型的新 variant，和 concept / code / animation 平级
- 卡片模型天生支持这种扩展——`AnimationContent` 就是这个模式的成功先例
- 真正的挑战不在架构，在媒体基础设施：下载、缓存、流媒体适配、存储空间管理

---

### 7. 多语言

**现状：** 所有课程内容（title/body/question/explanation）和 UI 文案都是中文硬编码在 TS 文件中。

**触发条件（满足任一条即启动）：**
- 计划出海 / 上架非中文应用商店
- 课程内容需要支持多语种
- 有非中文用户群体

**怎么改——分两层，互不干扰：**

**第一层：UI 文案（按钮/标签/导航）**

```
当前 → t('key') 模式
"选择学科" → i18n.t('home.chooseCourse')

改什么：
  1. 装 react-i18next
  2. 新建 src/i18n/locales/{zh,en,ja,...}.json
  3. 每个 Screen 的硬编码中文 → t('key')
  4. 不改组件结构、不改样式、不改逻辑
```

| 文件 | 改动量 | 说明 |
|------|--------|------|
| `src/i18n/*` | 新建 | 翻译 JSON 文件 |
| 所有 Screen | 文字替换 | `"选择学科"` → `t('home.title')` |
| 所有组件 | 文字替换 | 同上 |
| store / types / navigation | **零改动** | 不关心语言 |

**第二层：课程内容（卡片正文）**

有两种做法，取决于第一层什么时候启动：

**方案 A — 启动时还没做 CDN 远程内容：**

```ts
// 在 Card 内容字段中存多语版本
{
  title: {
    zh: '第一个程序',
    en: 'Hello World',
  },
  body: {
    zh: '每个 C++ 程序都从 main 开始...',
    en: 'Every C++ program starts with main...',
  },
}
```

加载时根据当前 locale 取 `content.title[locale]`。Card 接口的字段从 `string` 变为 `Record<Locale, string>`。

**方案 B — 启动时 CDN 远程内容已上线（推荐）：**

```
CDN 上每个语种存一份独立的 JSON
  cdn.codecard.com/content/zh/cpp.json
  cdn.codecard.com/content/en/cpp.json
  cdn.codecard.com/content/ja/cpp.json

加载器根据 locale 拉对应 URL
  → Card 接口完全不变（字段还是 string）
  → 所有组件零改动
```

**推荐方案 B**。方案 A 会让 Card 类型膨胀（每个字段变成多语对象），方案 B 把多语言问题推给数据层，类型系统不动。

**不改什么（方案 B）：**
- `Card` / `PathNode` / `Course` 的所有 TypeScript 接口
- 所有卡片渲染组件（ConceptCard / CodeCard / QuestionRenderer）
- useProgressStore（进度只记 cardId，不存文字内容）
- 所有 Screen 的结构和逻辑
- 主题系统
- 动画系统

**关键约束：**
- 多语言是数据层问题，不是架构层问题
- 最佳时机是 CDN 远程内容上线之后——改加载器 URL + 一份翻译，不改任何接口
- CDN 之前做 = 改 Card 类型 → 所有组件要适配 → 工作量翻倍

---

### 8. 协作与 Git 工作流

**现状：** solo 开发，直接在 master 上 commit + force push。

**触发条件：** 有第二个人开始提交代码时启动。

**核心原则：**

```
solo 期：  master ← 直接 commit，可 force push
协作期：  master ← PR squash merge ← feature 分支（可随意 rebase/squash）
```

**具体操作（有人加入后）：**

1. **所有改动走 feature 分支** — 不在 master 上直接 commit
   ```
   git checkout -b feature/xxx
   # 写代码，随便 commit，随便 rebase
   git push -u origin feature/xxx
   ```

2. **提 PR 到 master** — GitHub 上创建 Pull Request

3. **用 "Squash and merge" 合并** — GitHub 会把分支上所有 commit 压成一个干净的 commit 追加到 master。代码效果完全一样，历史保持干净。

4. **禁止 force push 到 master** — 一旦有人基于 master 开了分支，force push 会导致他们的分支基础丢失。

**Squash merge 不会"乱来"：**

- 它只是把 N 个 commit 的 diff 总和成一个新 commit
- 最终文件内容和逐个 apply 完全一致
- 如果分支和 master 有冲突，GitHub 会拒绝合并，要求先在分支上 `git merge master` 解决冲突
- 压缩的是 commit 历史，不是代码

**冲突处理：**

```
# 在 feature 分支上
git merge master        # 把 master 最新代码合进来
# 解决冲突 → commit
git push                # 更新 PR
# PR 页面自动刷新，冲突消失，可以 squash merge
```

**不该做的事（红线）：**

| 操作 | solo 期 | 协作期 |
|------|:---:|:---:|
| `git push --force` 到 master | ✅ | ❌ |
| `git rebase -i` 整理 master 历史 | ✅ | ❌ |
| `git push --force` 到自己的 feature 分支 | ✅ | ✅ |
| `git rebase -i` 整理自己的 feature 分支 | ✅ | ✅ |

---

## Conventions

- All card content uses `\n` for line breaks (not `\r\n`)
- Answer comparison is case-insensitive via `normalize()` = `trim().toLowerCase()`
- Card keys use `card.id` for React reconciliation
- XP: each level needs `level * 100` XP. Level 1 starts at 0 XP.
- Animation components receive `{ scenario: MemoryBoxScenario; step: number }` props
- Footer always shows "← 上一张" button (all card types). PracticeCard has its own "下一张/完成".
- ScreenHeader compact variant uses `paddingTop: insets.top + 33` for card views (NodeScreen, QuizScreen)
- All imports use `@/` path alias (e.g. `@/store/authStore`, not `../store/authStore`)
- LoginScreen has a close button (×) in the top-right corner
- All colors use `Colors` tokens from `@/theme` — no hardcoded hex in components. New component → `import { Colors } from '@/theme'` → use `Colors.primary` not `'#4a9eff'`
- `theme.ts` is the single source of truth for colors, fonts, spacing, radius. Change a token → entire app updates. Dark mode = add `DarkColors` object + toggle logic, zero component changes.
