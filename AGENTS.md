# File placement

所有项目文件必须放在 `G:\CodeCard\` 下。禁止写入 C 盘。

# Expo version

Read https://docs.expo.dev/versions/v55.0.0/ before writing Expo-related code.

# CRITICAL — What NOT to read

This document IS the source of truth. Do NOT read source files unless listed below.

| Task type | What to read | What NOT to read |
|-----------|-------------|------------------|
| Add course / module / node / card | This doc + `hello-world.ts` (node template) + `01-basics/index.ts` (module template) | Any other file |
| Add animation (any type) | `docs/animation-system.md` — do NOT read source | All source files |
| Fix store / progress bug | `useProgressStore.ts` + the screen reporting the bug | Other screens |
| Change level formula | `src/lib/xp.ts` + `docs/store-invariants.md` | Component files |
| Fix card rendering bug | The specific card component + `renderCard.tsx` | Other components |
| Modify SettingsScreen UI | This doc + `SettingsScreen.tsx` | Other screens |
| Modify ProgressScreen | `ProgressScreen.tsx` only | Other screens |
| Add login / cloud sync / avatar | `docs/auth-sync.md` — do NOT read source | All source files |
| Theme / color / style change | `theme.ts` + `docs/AAAAui-reference.md` — do NOT read components | Component source files |
| Data migration / store structure change | `useProgressStore.ts` + `docs/store-invariants.md` | Other store files, screens |
| Future architecture / scaling change | `docs/scaling.md` — do NOT read source | All source files |
| Add payment / permissions / IAP | `docs/scaling.md` (付费与权限系统) — do NOT read source | All source files |

# Project Architecture

Local-first Android learning app. Card-based micro-learning, no backend.

## Tech stack

| Layer | Stack |
|-------|-------|
| Framework | React Native 0.83.6 + Expo SDK 55 |
| Language | TypeScript 5.9, strict mode |
| Navigation | @react-navigation/native 7 + bottom-tabs + native-stack |
| State | Zustand 5 + manual AsyncStorage persist |
| Animation | react-native-reanimated 4.1.7 + react-native-svg 15 |
| Icons | @expo/vector-icons (MaterialCommunityIcons) |
| Theme | `src/theme.ts` — single source of truth for colors/fonts/spacing |

## Theme rules

所有视觉属性必须通过 theme token 引用，禁止硬编码 hex 颜色。

```ts
import { Colors, FontSize, FontWeight, Radius, Spacing, Layout } from '@/theme';
```

加新颜色：在 `theme.ts` 的 `Colors` 对象中加一行，组件用 `Colors.xxx` 引用。暗色模式只需加 `DarkColors` 对象 + toggle，不改任何组件。

```
src/
├── theme.ts                   ← Design tokens
├── types/index.ts            ← All shared TypeScript interfaces
├── lib/
│   └── xp.ts                 ← XP 等级公式（calcLevel / xpForLevelStart / xpForNextLevel）
├── navigation/AppNavigator.tsx ← Root stack + bottom tabs
├── store/
│   ├── useProgressStore.ts ← Zustand store (progress, XP, cards)
│   ├── authStore.ts        ← Auth interface (no-op)
│   └── syncEngine.ts       ← Sync interface (no-op)
├── screens/
│   ├── HomeScreen.tsx         ← Course list
│   ├── CourseScreen.tsx       ← Module list
│   ├── ModuleScreen.tsx       ← Node list
│   ├── NodeScreen.tsx         ← Card swiping + useNodeScreen hook
│   ├── QuizScreen.tsx         ← Quiz mode
│   ├── ProgressScreen.tsx     ← Level ring + progress bars
│   ├── SettingsScreen.tsx     ← Avatar + sync + reset + about
│   ├── DataScreen.tsx         ← Data management
│   ├── WrongCardsScreen.tsx   ← Wrong answer review
│   └── LoginScreen.tsx        ← Login placeholder
├── components/
│   ├── cards/
│   │   ├── renderCard.tsx     ← Card type dispatcher
│   │   ├── ConceptCard.tsx    ← TextContent
│   │   ├── CodeCard.tsx       ← CodeContent
│   │   ├── PracticeCard.tsx   ← Wraps QuestionRenderer
│   │   └── QuestionRenderer.tsx ← Shared question UI
│   ├── animations/
│   │   ├── MemoryBox.tsx, ScopeCodePlayer.tsx, BranchPlayer.tsx
│   │   ├── LoopPlayer.tsx, BreakContinuePlayer.tsx, WhileDoWhilePlayer.tsx
│   │   ├── LottiePlayer.tsx
│   │   └── shared/ (CodeBlock, GridRenderer, VarLabel, AddressColumn)
│   └── shared/ (ScreenHeader, ErrorBoundary, ListItem)
└── data/
    ├── courses/index.ts       ← Course registry
    ├── courses/cpp/           ← C++ course
    └── animations/index.ts    ← Animation registry
```

## Data model (src/types/index.ts)

```typescript
Course { id, title, icon, color, nodes: PathNode[] }

PathNode {
  id, courseId, type: 'knowledge' | 'quiz',
  moduleId: 'basics' | 'advanced' | 'oop' | 'stl' | 'generics' | 'modern',
  module: string, title: string, cards: Card[]
}

Card { id, cardType: 'concept' | 'code' | 'animation' | 'practice',
  content: TextContent | CodeContent | AnimationContent | PracticeContent }

TextContent   { title, body }
CodeContent   { title, code, language, highlights: number[] }
AnimationContent { animationId }  // key in animationRegistry
PracticeContent { question, questionType: 'choice' | 'fill', options?, answer, explanation }
```

Animation types: see `docs/animation-system.md` and `src/types/index.ts`.

## Store (src/store/useProgressStore.ts)

```
State: { global: { totalXP, level }, courses: Record<string, CourseProgress> }
CourseProgress: { completedCards: Record<string, true>, wrongCards: Record<string, true>,
                  xp, quizScores: Record<string, number>, nodePositions: Record<string, number> }
```

| Action | Purpose |
|--------|---------|
| `addXP(courseId, amount)` | Add XP to course + global, recalc level |
| `rewardCard(courseId, cardId, xp)` | Mark complete + add XP (dedup inside set()) |
| `saveQuizScore(courseId, nodeId, score)` | Save quiz result |
| `setNodePosition(courseId, nodeId, cardIndex)` | Save reading position |
| `addWrongCard / removeWrongCard` | Manage wrong answer tracking |
| `resetCourse(courseId)` | Clear one course, dedcut global XP |
| `hydrate() / flush()` | Load/save from AsyncStorage |
| `hydrated: boolean` | True after hydration complete |

### Persistence

- Zustand `subscribe()` debounced 500ms, `saveIfDirty()` skips unchanged writes
- `AppState.addEventListener('change')` flush on background
- Manual `JSON.parse/stringify`, no middleware (avoids Fabric compat)
- Versioned: `CURRENT_VERSION` + `MIGRATIONS` chain in `hydrate()`

### Data migration (3 steps)

1. Bump `CURRENT_VERSION`
2. Add migration function to `MIGRATIONS` table
3. Update TypeScript types if needed

Old user data auto-migrates on next `hydrate()`. See `useProgressStore.ts` for examples.

## Navigation

```
RootStack (NativeStack, headerShown: false)
  ├── MainTabs (BottomTab: Learn / Progress / Settings)
  ├── Course(courseId) → Module(courseId, moduleId)
  ├── Node(courseId, nodeId) → Quiz(courseId, nodeId)
  ├── WrongCards(courseId?) → Data → Login
```

## Error Boundary

`src/components/shared/ErrorBoundary.tsx` wraps NavigationContainer. On crash: flushes progress, shows retry UI.

## How screens read data

| Screen | Reads from store | Reads from static data |
|--------|:--:|:--:|
| HomeScreen | — | `courses` |
| CourseScreen | `courses[courseId].completedCards` | `courses.find()` |
| ModuleScreen | `courses[courseId].completedCards` | `courses.find()` |
| NodeScreen | `rewardCard`, `setNodePosition`, `nodePositions`, `addWrongCard`, `removeWrongCard` | `courses.find()` |
| QuizScreen | `rewardCard`, `addWrongCard`, `removeWrongCard`, `saveQuizScore` | `courses.find()` |
| ProgressScreen | `global.totalXP`, `global.level`, `courses` | `courses` |
| SettingsScreen | `user`, `isLoggedIn` (auth), `resetCourse`, `flush` (progress) | `courses` |

## Card rendering

```
NodeScreen → renderCard({card, animStep, ...})
  ├── concept   → ConceptCard(content)
  ├── code      → CodeCard(content)
  ├── animation → getAnimComponent(animId) → player component
  └── practice  → PracticeCard → QuestionRenderer
```

QuizScreen uses QuestionRenderer directly.

## Content authoring

### 零代码原则

新课程、新模块、新节点 = 纯数据文件。以下文件**永远不用改**：

| 层 | 原因 |
|----|------|
| `useProgressStore` | `courses: Record<string, CourseProgress>` — key 任意 |
| `HomeScreen` / `CourseScreen` / `ModuleScreen` | 从 `courses` 数组动态渲染 |
| `NodeScreen` / `renderCard` | 只接收 `card` 对象，不关心课程 |
| `ProgressScreen` / `DataScreen` | 遍历 `courses` 状态动态生成列表 |
| `AppNavigator` | 路由参数 `courseId: string`，不硬编码课程 |
| `types/index.ts` | `Course`/`PathNode`/`Card` 接口是泛型的 |

### Add a course（3 步）

以添加 `python` 课程为例：

```
1. 创建目录 src/data/courses/python/
2. 创建模块目录 + 节点文件（按下面"Add a node"的格式）
   python/
   ├── 01-basics/
   │   ├── index.ts          ← 模块注册
   │   ├── hello-world.ts    ← 一个节点 = 一个文件
   │   └── variables.ts
   └── index.ts              ← 课程注册

3. 在 src/data/courses/index.ts 加一行：
   import { pythonCourse } from './python';
   export const courses = [cppCourse, pythonCourse];
```

课程注册文件 `src/data/courses/python/index.ts` 模板：

```typescript
import type { Course, CourseModule, ModuleMeta } from '@/types';
import { basicsModule } from './01-basics';
// import more modules...

const modules: CourseModule[] = [basicsModule];

export const pythonCourse: Course = {
  id: 'python',                     // 唯一，用于路由和存储 key
  title: 'Python',
  icon: 'language-python',          // MaterialCommunityIcons 名字
  color: '#4a9eff',                 // 主题色
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.length,
  modulesMeta: modules.map(m => ({ moduleId: m.moduleId, module: m.module })),
};
```

### Add a module（3 步）

以给 `python` 课程添加 `02-advanced` 模块为例：

```
1. 创建目录 src/data/courses/python/02-advanced/
2. 创建节点文件 + 模块 index.ts（按下面"Add a node"的格式）
3. 在 src/data/courses/python/index.ts 里 import 并加入 modules 数组
```

模块注册文件 `src/data/courses/python/02-advanced/index.ts` 模板：

```typescript
import type { CourseModule } from '@/types';
import { myNode } from './my-node';
// import more nodes...

export const advancedModule: CourseModule = {
  moduleId: 'advanced',             // 存储 key，课程内唯一
  module: '进阶',                    // 显示名称
  nodes: [myNode],
};
```

### Add a node（3 步）

```
1. 创建 src/data/courses/{course}/{module}/{topic}.ts
   文件名: kebab-case（如 hello-world.ts）
   导出名: camelCase + Node 后缀（如 helloWorldNode）

2. 在该模块的 index.ts 里 import + 加入 nodes 数组

3. 节点文件模板见下方 Card templates
```

### Module IDs — 当前 C++ 课程

`ModuleId = string`，每门课自定义。

| Folder | moduleId | module |
|--------|----------|--------|
| 01-basics | `basics` | 基础 |
| 02-advanced | `advanced` | 进阶 |
| 03-streams | `streams` | 流与文件 |
| 04-oop | `oop` | 面向对象 |
| 05-stl | `stl` | STL |
| 06-generics | `generics` | 泛型 |
| 07-modern | `modern` | 现代 C++ |

其他课程用各自的 moduleId 体系，新增课程自由定义。

### Card ID: `{courseId}-{moduleId}-{topic}-c{seq}`

示例：`cpp-02-pointer-c3` = C++ 课程 · 进阶模块 · 指针节点 · 第 3 张卡。

### Node 文件模板

```typescript
import type { PathNode } from '@/types';

export const helloWorldNode: PathNode = {
  id: 'python-01-hello-world',   // {courseId}-{两位模块序号}-{topic}
  courseId: 'python',
  type: 'knowledge',              // 'knowledge' 或 'quiz'
  moduleId: 'basics',
  module: '基础',
  title: '第一个程序',
  cards: [
    // 卡片数组，见下方模板
  ],
};
```

### Card templates

```typescript
// concept — 概念讲解
{ cardType: 'concept', content: { title: '标题', body: '正文（支持 \\n 换行）' } }

// code — 代码展示
{ cardType: 'code', content: {
  title: '标题', code: 'int main() { ... }', language: 'cpp',
  highlights: [0, 2]   // 高亮行号（0-based）
} }

// animation — 动画（animationId 见 src/data/animations/index.ts）
{ cardType: 'animation', content: { animationId: 'pointer-intro' } }

// practice (choice) — 选择题
{ cardType: 'practice', content: {
  question: '...', questionType: 'choice',
  options: ['A','B','C','D'], answer: 'B', explanation: '...'
} }

// practice (fill) — 填空题
{ cardType: 'practice', content: {
  question: '...', questionType: 'fill',
  answer: 'main', explanation: '...'
} }
```

### 完整示例：python/01-basics/hello-world.ts

```typescript
import type { PathNode } from '@/types';

export const helloWorldNode: PathNode = {
  id: 'python-01-hello-world',
  courseId: 'python',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: '第一个程序',
  cards: [
    {
      id: 'python-01-hello-world-c1',
      cardType: 'concept',
      content: {
        title: 'Hello World 是什么',
        body: [
          'print() 是 Python 最常用的输出函数。',
          '',
          '  print("Hello World")  // 在屏幕上显示 Hello World',
          '',
          'Python 不需要 main 函数，代码从上到下直接执行。',
        ].join('\n'),
      },
    },
    {
      id: 'python-01-hello-world-c2',
      cardType: 'code',
      content: {
        title: '第一个 Python 程序',
        code: 'print("Hello World")',
        language: 'python',
        highlights: [0],
      },
    },
    {
      id: 'python-01-hello-world-c3',
      cardType: 'practice',
      content: {
        question: 'Python 中用于输出的函数是？',
        questionType: 'fill',
        answer: 'print',
        explanation: 'print() 是 Python 的标准输出函数。',
      },
    },
  ],
};
```

### 逐个认识节点内容

翻一两个已有节点文件就能掌握写法。推荐先看：

| 想学的内容 | 看这个文件 |
|-----------|-----------|
| 概念卡（有列表、对比） | `01-basics/variables.ts` |
| 代码卡（多行高亮） | `02-advanced/pointer.ts` c5 |
| 练习题（选择和填空） | `01-basics/function.ts` c7-c10 |
| 动画卡 | `02-advanced/dynamic-memory.ts` c3 |
| 完整节点结构 | `02-advanced/memory-four-regions.ts` |

## SettingsScreen layout

```
┌─ Avatar (96px) + displayId + phone + sync status ─┐
├─ Reset course per subject ─────────────────────────┤
├─ ╔═ Danger zone: clear all data ═╗ ───────────────┤
├─ About / version / tech ───────────────────────────┤
└────────────────────────────────────────────────────┘
```

- Avatar tap → LoginScreen (if not logged in)
- displayId tap → Modal edit
- Reset/clear → confirmation dialog
- Danger zone only renders when `hasProgress`

## WrongCardsScreen

Two-level navigation: `WrongCards` (course list) → `WrongCards { courseId }` (detail).
- Stores only `cardId` in `wrongCards: Record<string, true>`
- Content resolved at render time from static data — no stale copies
- Auto-removes when answered correctly in NodeScreen/QuizScreen

## Conventions

- `\n` for line breaks, not `\r\n`
- Answer comparison: `trim().toLowerCase()`
- React keys: `card.id`
- XP: level N needs N×100 XP（由 `src/lib/xp.ts` 的 `XP_PER_LEVEL` 控制，当前值 100），level 1 starts at 0
- All imports use `@/` path alias
- Colors: `import { Colors } from '@/theme'`, never hardcoded hex
- `theme.ts` is single source of truth — change a token, entire app updates
- `ScreenHeader` compact variant: `paddingTop: insets.top + 33`
