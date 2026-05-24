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

### Add a course
1. `src/data/courses/{id}/index.ts` ← Course definition
2. Module folders under `{id}/{module}/`
3. Add to `src/data/courses/index.ts`

### Add a node (ONE node = ONE file)
1. `src/data/courses/{course}/{module}/{topic}.ts` ← PathNode
2. Import + add to module `index.ts` nodes array
3. File: kebab-case. Export: camelCase + `Node` suffix

### Module IDs

`ModuleId = string`（`src/types/index.ts:18`），每门课自定义。以 C++ 为例：

| Folder | moduleId | module |
|--------|----------|--------|
| 01-basics | `basics` | 基础 |
| 02-advanced | `advanced` | 进阶 |
| 03-oop | `oop` | 面向对象 |
| 04-stl | `stl` | STL |
| 05-generics | `generics` | 泛型 |
| 06-modern | `modern` | 现代 C++ |

其他课程用各自的 moduleId 体系（如数据结构用 `linear`/`tree`/`graph`/`search`/`sort`/`advanced`），新增课程自由定义。

### Card ID: `{courseId}-{moduleId}-{topic}-c{seq}`

### Card templates

```typescript
// concept
{ cardType: 'concept', content: { title: '...', body: '...' } }

// code
{ cardType: 'code', content: { title: '...', code: '...', language: 'cpp', highlights: [0, 2] } }

// practice (choice)
{ cardType: 'practice', content: { question: '...', questionType: 'choice',
  options: ['A','B','C','D'], answer: 'B', explanation: '...' } }

// practice (fill)
{ cardType: 'practice', content: { question: '...', questionType: 'fill',
  answer: 'main', explanation: '...' } }

// animation
{ cardType: 'animation', content: { animationId: 'variable-storage' } }
```

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
