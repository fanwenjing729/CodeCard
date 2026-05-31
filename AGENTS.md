# File placement

前端文件放在 `G:\CodeCard\` 下，后端文件放在 `G:\CodeCardBackend\` 下。禁止写入 C 盘。

# Docs placement

| 目录 | 放什么 |
|------|--------|
| `docs/frontend/` | 前端（动画、UI、课程、Store） |
| `docs/backend/` → 已移至 `G:\CodeCardBackend\docs\` | 后端文档已迁移到后端仓库 |
| `docs/project/` | 项目（规划、入门指南）；用户说"写给我的"放这里 |

# Expo version

Read https://docs.expo.dev/versions/v55.0.0/ before writing Expo-related code.

# CRITICAL — What NOT to read

This document IS the source of truth. Do NOT read source files unless listed below.

| Task type | What to read | What NOT to read |
|-----------|-------------|------------------|
| Add course / module / node / card | This doc + `hello-world.ts` (node template) + `01-basics/index.ts` (module template) | Any other file |
| Add animation (any type) | `docs/frontend/animation-system.md` — do NOT read source | All source files |
| Fix store / progress bug | `useProgressStore.ts` + the screen reporting the bug | Other screens |
| Change level formula | `src/lib/xp.ts` + `docs/frontend/store-invariants.md` | Component files |
| Fix card rendering bug | The specific card component + `renderCard.tsx` | Other components |
| Modify SettingsScreen UI | This doc + `SettingsScreen.tsx` | Other screens |
| Modify ProgressScreen | `ProgressScreen.tsx` only | Other screens |
| Add login / cloud sync / avatar | `G:\CodeCardBackend\docs\auth-sync.md` — do NOT read source | All source files |
| Theme / color / style change | `theme.ts` + `docs/frontend/AAAAui-reference.md` — do NOT read components | Component source files |
| Data migration / store structure change | `useProgressStore.ts` + `docs/frontend/store-invariants.md` | Other store files, screens |
| Future architecture / scaling change | `G:\CodeCardBackend\docs\scaling.md` — do NOT read source | All source files |
| Add payment / permissions / IAP | `G:\CodeCardBackend\docs\scaling.md` (付费与权限系统) — do NOT read source | All source files |
| Modify backend auth/progress | `G:\CodeCardBackend\src\main\java\com\codecard\` 对应包 — 只读目标 Service | 其他 Service |
| Modify backend security/JWT | `G:\CodeCardBackend\src\main\java\com\codecard\config\SecurityConfig.java` | 其他 config |
| Add backend endpoint | AGENTS.md + 现有 Controller 模板 — 不要读其他 Controller | 其他 Controller |

# Project Architecture

Local-first Android learning app. Card-based micro-learning. Spring Boot backend for auth + progress sync.

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | React Native 0.83.6 + Expo SDK 55 + TypeScript 5.9 strict |
| State | Zustand 5 + manual AsyncStorage persist |
| Navigation | @react-navigation/native 7 (bottom-tabs + native-stack) |
| Animation | react-native-reanimated 4.1.7 + react-native-svg 15 |
| Theme | `src/theme.ts` — Colors/FontSize/Spacing/Radius tokens |
| Backend | Spring Boot 3.4.1 + Java 21 + PostgreSQL + JWT (BCrypt + HMAC-SHA) |
| Sync | REST `/api/v1/progress` — JSONB upsert + client-side merge |

## Theme rules

所有视觉属性必须通过 theme token 引用，禁止硬编码 hex 颜色。

```ts
import { Colors, FontSize, FontWeight, Radius, Spacing, Layout } from '@/theme';
```

加新颜色：在 `theme.ts` 的 `Colors` 对象中加一行，组件用 `Colors.xxx` 引用。暗色模式只需加 `DarkColors` 对象 + toggle，不改任何组件。

```
src/
├── theme.ts                   ← Design tokens
├── types/index.ts            ← Shared interfaces
├── lib/ (api.ts, xp.ts)      ← HTTP + JWT / 等级公式
├── navigation/AppNavigator.tsx
├── hooks/ (useAutoSync, usePhoneAuth, useCourses)
├── store/
│   ├── useProgressStore.ts    ← Zustand (XP, cards, progress)
│   ├── authStore.ts           ← JWT 认证
│   └── syncEngine.ts          ← 云端同步
├── screens/ (12 files)        ← Home/Course/Module/Node/Quiz/Progress/Settings/Data/WrongCards/Login/Register/Account
├── components/
│   ├── cards/ (renderCard, ConceptCard, CodeCard, PracticeCard, QuestionRenderer)
│   ├── animations/ (MemoryBox, ScopeCodePlayer, BranchPlayer, LottiePlayer 等)
│   └── shared/ (ScreenHeader, ErrorBoundary, ListItem)
└── data/
    ├── courses/index.ts       ← 课程注册入口
    └── animations/index.ts    ← 动画注册入口
```

后端代码在 `G:\CodeCardBackend\`，独立仓库：

```
G:\CodeCardBackend\
├── src/main/java/com/codecard/
│   ├── auth/                  ← 认证 Controller + Service
│   ├── config/                ← SecurityConfig, JwtService, Filter
│   ├── progress/              ← 进度 Controller + Service
│   └── user/                  ← User entity
├── src/main/resources/
│   ├── application.yml        ← DB/JWT/SMTP/CORS 配置
│   └── schema.sql             ← PostgreSQL DDL
└── src/test/                  ← 13 集成测试
```

## Data model (src/types/index.ts)

```typescript
Course { id, title, icon, color, nodes: PathNode[] }

PathNode {
  id, courseId, type: 'knowledge' | 'quiz',
  moduleId: 'basics' | 'advanced' | 'oop' | 'streams' | 'stl' | 'generics' | 'modern' | 'engineering',
  module: string, title: string, cards: Card[]
}

Card { id, cardType: 'concept' | 'code' | 'animation' | 'practice',
  content: TextContent | CodeContent | AnimationContent | PracticeContent }

TextContent   { title, body }
CodeContent   { title, code, language, highlights: number[] }
AnimationContent { animationId }  // key in animationRegistry
PracticeContent { question, questionType: 'choice' | 'fill', options?, answer, explanation }
```

Animation types: see `docs/frontend/animation-system.md` and `src/types/index.ts`.

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

Zustand subscribe debounced 500ms + `AppState` flush on background, manual JSON persist (no middleware), versioned with `CURRENT_VERSION` + `MIGRATIONS` chain. 详见 `docs/frontend/store-invariants.md`。

## Navigation

```
RootStack (NativeStack, headerShown: false)
  ├── MainTabs (BottomTab: Learn / Progress / Settings)
  ├── Course(courseId) → Module(courseId, moduleId)
  ├── Node(courseId, nodeId) → Quiz(courseId, nodeId)
  ├── WrongCards(courseId?) → Data → Login → Register → Account
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
| 03-oop | `oop` | 面向对象 |
| 04-streams | `streams` | 流与文件 |
| 05-stl | `stl` | STL |
| 06-generics | `generics` | 泛型 |
| 07-modern | `modern` | 现代 C++ |
| 08-engineering | `engineering` | 工程化 |

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

### 参考文件

| 想学的内容 | 看这个文件 |
|-----------|-----------|
| 概念卡（列表/对比） | `01-basics/variables.ts` |
| 代码卡（多行高亮） | `02-advanced/pointer.ts` c5 |
| 练习题（选择和填空） | `01-basics/function.ts` c7-c10 |
| 动画卡 | `02-advanced/dynamic-memory.ts` c3 |
| 完整节点结构 | `02-advanced/memory-four-regions.ts` |

## SettingsScreen

Avatar + displayId + phone + sync status → Reset course per subject → Danger zone (clear all, only when `hasProgress`) → About.

## WrongCardsScreen

Two-level: course list → card detail. Stores only `cardId`, resolves content at render time.

## Conventions

- `\n` for line breaks, not `\r\n`
- Answer comparison: `trim().toLowerCase()`
- React keys: `card.id`
- XP: level N needs N×100 XP（由 `src/lib/xp.ts` 的 `XP_PER_LEVEL` 控制，当前值 100），level 1 starts at 0
- All imports use `@/` path alias
- Colors: `import { Colors } from '@/theme'`, never hardcoded hex
- `theme.ts` is single source of truth — change a token, entire app updates
- `ScreenHeader` compact variant: `paddingTop: insets.top + 33`

## 已知风险

**课程导入链断裂**：`src/data/courses/index.ts` 静态 import 聚合所有课程，一门课语法错误会导致全部课程加载失败。触发条件（课程 ≥ 3 门 / 多人编辑 / 需要 CDN 热加载）满足时按 `docs/project/course-loading-fix.md` 方案修复（动态 import + 容错加载，~30 行）。

## 已知问题

所有问题追踪在 `docs/project/ISSUES.md`，这里不重复。
