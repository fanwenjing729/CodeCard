# Expo version

Read https://docs.expo.dev/versions/v55.0.0/ before writing Expo-related code.

# CRITICAL — What NOT to read

This document IS the source of truth. Do NOT read source files unless explicitly listed below.

| Task type | What to read | What NOT to read |
|-----------|-------------|------------------|
| Add course / chapter / node / card | This doc + `src/data/courses/cpp/01-basics/index.ts` (as template) | Any other file |
| Add animation | This doc + `src/data/animations/index.ts` + `scenarios/variableStorage.ts` (as template) | Any other file |
| Fix store / progress bug | `src/store/useProgressStore.ts` + the screen reporting the bug | Other screens |
| Fix card rendering bug | The specific card component + `renderCard.tsx` | Other components |
| Modify SettingsScreen | `SettingsScreen.tsx` only | Other screens |
| Modify ProgressScreen | `ProgressScreen.tsx` only | Other screens |
| Add login / cloud sync | This doc + `SettingsScreen.tsx` (extension points #1-6) | Other screens |

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
├── store/useProgressStore.ts ← Zustand store (per-course progress, XP, card completion)
├── screens/
│   ├── HomeScreen.tsx         ← Course list (select subject)
│   ├── CourseScreen.tsx       ← Chapter → node list with progress dots
│   ├── NodeScreen.tsx         ← Card swiping (concept/code/animation/practice)
│   ├── QuizScreen.tsx         ← Quiz mode (practice cards only, score tracking)
│   ├── ProgressScreen.tsx     ← Level ring + per-course progress bars
│   └── SettingsScreen.tsx     ← Data reset/clear + about (login extension points)
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
│   │       ├── 01-basics/     ← ✅ 2 nodes / 5 cards (only chapter with content)
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
  chapter: string;         // e.g. "01 起步"
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
  ├── "Node"   → NodeScreen     params: { courseId, nodeId }
  └── "Quiz"    → QuizScreen    params: { courseId, nodeId }
```

Route params typed in `RootStackParamList`. No auth wall — app is fully usable without login.

## How screens read data

| Screen | Reads from store | Reads from static data |
|--------|:--:|:--:|
| HomeScreen | — | `courses` (list subjects) |
| CourseScreen | `courses[courseId].completedCards` | `courses.find()` (nodes & cards) |
| NodeScreen | `addXP`, `completeCard`, `setNodePosition`, `courses[courseId].nodePositions[nodeId]` | `courses.find()` (cards) |
| QuizScreen | `addXP`, `completeCard` | `courses.find()` (practice cards) |
| ProgressScreen | `global.totalXP`, `global.level`, `courses` | `courses` (total card counts) |
| SettingsScreen | `resetCourse`, `flush`, `courses` | `courses` (list for reset) |

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
2. Create chapter folders under `ds/{chapter}/index.ts`
3. Add `import { dsCourse } from './ds'` + add to `courses` array in `src/data/courses/index.ts`

### Add nodes/cards to existing course
Edit the relevant `src/data/courses/{subject}/{chapter}/index.ts`.
Template: `cpp/01-basics/index.ts` — copy a node object, change IDs, fill in cards.

### Card ID convention
`{courseId}-{chapterNum}-{topic}-c{sequence}`
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

## Login / cloud sync extension points

All marked with `扩展口 #N` in source. See `SettingsScreen.tsx` for the 6 extension points.

To add login later:
1. Create `src/store/authStore.ts` (user, token, isLoggedIn, login/logout)
2. Create `src/store/syncEngine.ts` (Zustand ↔ server sync)
3. Create `src/screens/LoginScreen.tsx`
4. Uncomment the marked sections in `SettingsScreen.tsx`
5. No existing screens need changes — they always read from local Zustand store

## Key conventions

- All card content uses `\n` for line breaks (not `\r\n`)
- Answer comparison is case-insensitive via `normalize()` = `trim().toLowerCase()`
- Card keys use `card.id` for React reconciliation
- XP: each level needs `level * 100` XP. Level 1 starts at 0 XP.
- Animation components receive `{ scenario: MemoryBoxScenario; step: number }` props
- Footer always shows "← 上一张" button (all card types). PracticeCard has its own "下一张/完成".
