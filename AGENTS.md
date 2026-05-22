# File placement

所有项目文件（计划、文档、代码）必须放在当前项目目录 `G:\CodeCard\` 下。
禁止写入 C 盘。如果特定工具强制要求 C 盘路径，必须先征得用户同意。

# Expo version

Read https://docs.expo.dev/versions/v55.0.0/ before writing Expo-related code.

# CRITICAL — What NOT to read

This document IS the source of truth. Do NOT read source files unless explicitly listed below.

| Task type | What to read | What NOT to read |
|-----------|-------------|------------------|
| Add course / module / node / card | This doc + `src/data/courses/cpp/01-basics/index.ts` (as template) | Any other file |
| Add animation | This doc + `src/data/animations/index.ts` + `scenarios/variableStorage.ts` (as template) | Any other file |
| Fix store / progress bug | `src/store/useProgressStore.ts` + the screen reporting the bug | Other screens |
| Fix card rendering bug | The specific card component + `renderCard.tsx` | Other components |
| Modify SettingsScreen UI | This doc + `SettingsScreen.tsx` | Other screens |
| Modify ProgressScreen | `ProgressScreen.tsx` only | Other screens |
| Add login / cloud sync / avatar | This doc ONLY — do NOT read source | All source files |

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

## File map — where everything lives

```
src/
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
│       └── ScreenHeader.tsx   ← Back/center/right header, compact: 33pt padding
├── components/
│   ├── cards/
│   │   ├── renderCard.tsx     ← Card type dispatcher (switch on cardType)
│   │   ├── ConceptCard.tsx    ← Renders TextContent (title + body)
│   │   ├── CodeCard.tsx       ← Renders CodeContent (syntax-highlighted code block)
│   │   ├── PracticeCard.tsx   ← Wraps QuestionRenderer with local state
│   │   └── QuestionRenderer.tsx ← Shared question UI (choice/fill options, feedback)
│   └── animations/
│       ├── MemoryBox.tsx      ← Variable memory layout animation (Reanimated + SVG)
│       └── shared/
│           ├── GridRenderer.tsx ← SVG memory cell grid
│           ├── VarLabel.tsx     ← Animated variable name/type labels
│           └── AddressColumn.tsx ← Animated memory address column
├── data/
│   ├── courses/
│   │   ├── index.ts           ← export courses: Course[] (add new subjects here)
│   │   └── cpp/               ← C++ course
│   │       ├── index.ts       ← Course definition (id, title, color, nodes[])
│   │       ├── 01-basics/     ← ✅ 2 nodes / 5 cards (only module with content)
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
  moduleId: string;        // stable identifier, e.g. "basics"
  module: string;          // display name, e.g. "基础"
  title: string;           // e.g. "第一个程序"
  cards: Card[];
}

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
    completedCards: string[];  // card IDs
    xp: number;                // per-course XP
    quizScores: Record<string, number>;
    nodePositions: Record<string, number>;  // nodeId → last card index
  }>
}

// Actions
addXP(courseId, amount)           // adds to course.xp + global.totalXP, recalculates level
completeCard(courseId, cardId)    // returns true if newly completed (dup-proof)
setNodePosition(courseId, nodeId, cardIndex)  // saves reading position
resetCourse(courseId)             // clears one course, deducts from global XP
hydrate()                         // loads from AsyncStorage (called once in App.tsx)
flush()                           // immediately writes to AsyncStorage
```

### Persistence
- `subscribe()` debounced 500ms auto-save
- `AppState.addEventListener('change')` flush on background/exit
- Manual `JSON.parse/stringify`, no zustand middleware (avoids Fabric compat issue)

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

## Animation registry

`src/data/animations/index.ts`:
```
animationRegistry: Record<string, {
  scenario: MemoryBoxScenario;     // eagerly imported (no Reanimated deps)
  Component: ComponentType | null; // lazy-loaded via require()
  loadComponent(): void;
}>
```

To add an animation:
1. Create scenario in `scenarios/{name}.ts`
2. Create component in `components/animations/{Name}.tsx`
3. Register in `index.ts` (+3 lines)

## Content authoring — no source changes needed

### Add a new course (e.g. "数据结构")
1. Create `src/data/courses/ds/index.ts` (copy pattern from `cpp/index.ts`)
2. Create module folders under `ds/{module}/index.ts`
3. Add `import { dsCourse } from './ds'` + add to `courses` array in `src/data/courses/index.ts`

### Add a new node to a module
Copy a node object from the template, fill in:
```typescript
{
  id: '{courseId}-{moduleNum}-{topic}',
  courseId: 'cpp',
  type: 'knowledge',         // or 'quiz' for module-end quiz
  moduleId: 'basics',        // stable: matches parent module folder convention
  module: '基础',            // display: shown in UI
  title: '节点标题',
  cards: [ ... ],
}
```

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

// animation
{ cardType: 'animation', content: { animationId: 'variable-storage' } }
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

// === Action（仅 LoginScreen 调用，现有代码不调用）===
loginByPhone(phone)   → { error? }
verifyOtp(phone,token) → { error? }
loginByWechat()       → { error? }
```

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

只需替换 3 个文件的实现，接口签名不动：

1. **替换 `authStore.ts` 实现** — `initialize()` 从 supabase 恢复 session，`loginByPhone/verifyOtp/loginByWechat` 调 SDK，`logout()` 调 `supabase.auth.signOut`。useAuthStore 的 selector 签名不变。
2. **替换 `syncEngine.ts` 实现** — `uploadProgress` upsert 到 `user_progress` 表，`syncOnLogin` 下载合并后回写。函数签名不变。
3. **替换 `LoginScreen.tsx` UI** — 占位 → 手机号输入 + 微信登录按钮。文件名不变。

此外需新增：
- `src/lib/supabase.ts`（客户端初始化）
- `.env`（`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`）
- `app.json` 加 `scheme: "codecard"`
- Supabase Dashboard 建表 + 开 RLS

**SettingsScreen / AppNavigator / App.tsx 完全不动。**

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

## Key conventions

- All card content uses `\n` for line breaks (not `\r\n`)
- Answer comparison is case-insensitive via `normalize()` = `trim().toLowerCase()`
- Card keys use `card.id` for React reconciliation
- XP: each level needs `level * 100` XP. Level 1 starts at 0 XP.
- Animation components receive `{ scenario: MemoryBoxScenario; step: number }` props
- Footer always shows "← 上一张" button (all card types). PracticeCard has its own "下一张/完成".
- ScreenHeader compact variant uses `paddingTop: insets.top + 33` for card views (NodeScreen, QuizScreen)
- All imports use `@/` path alias (e.g. `@/store/authStore`, not `../store/authStore`)
- LoginScreen has a close button (×) in the top-right corner
