# Animation System

所有动画遵循统一接口。添加新动画不改核心代码，只加数据+组件+注册。

## Interface contract

```ts
// 所有动画场景必须满足（src/types/index.ts）
AnimScenario { id: string; title: string; totalSteps: number }

// 组件必须接受
ComponentType<{ scenario: AnimScenario; step: number }>
// step 从 0 到 totalSteps-1
```

## Dispatch chain

```
Card { cardType:'animation', content:{ animationId:'xxx' } }
  → renderCard.tsx (case 'animation')
    → getAnimScenario(animationId)  → scenario
    → getAnimComponent(animationId) → React component
    → React.createElement(Component, { scenario, step: animStep })
  → NodeScreen manages animStep, ← → buttons
```

## Registry (src/data/animations/index.ts)

```ts
export const animationRegistry: Record<string, AnimationEntry> = {
  'my-anim': {
    scenario: myScenario,
    Component: MyPlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
};

// 查找函数（已实现，不需要改）
getAnimScenario(animId): AnimScenario | undefined
getAnimComponent(animId): ComponentType<...> | null
```

## Current animation types

| Type | Scenario interface | Component | Reusable? |
|------|-------------------|-----------|:--:|
| MemoryBox | `MemoryBoxScenario` | `MemoryBox.tsx` | Yes |
| ScopeCode | `ScopeCodeScenario` | `ScopeCodePlayer.tsx` | Yes |
| Branch | `BranchScenario` | `BranchPlayer.tsx` | Yes |
| Loop | `LoopScenario` | `LoopPlayer.tsx` | Yes |
| BreakContinue | `BreakContinueScenario` | `BreakContinuePlayer.tsx` | Yes |
| WhileDoWhile | `WhileDoWhileScenario` | `WhileDoWhilePlayer.tsx` | Yes |
| Lottie | `LottieScenario` | `LottiePlayer.tsx` | Skeleton |

## Files you NEVER change

- `renderCard.tsx` — animation branch already exists
- `NodeScreen.tsx` / `useNodeScreen.ts` — step control is generic
- `src/types/index.ts` — `AnimationContent { animationId: string }` is final

---

## Add a MemoryBox animation (4 steps)

For memory layout, variable allocation, data structure storage.

### Step 1 — Scenario file

`src/data/animations/scenarios/myScenario.ts`:

```ts
import type { MemoryBoxScenario } from '@/types';

export const myScenario: MemoryBoxScenario = {
  id: 'my-scenario',
  title: '标题',
  totalSteps: 4,
  cellsPerRow: 8,
  totalRows: 5,
  steps: [
    {
      label: '步骤名',
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '10', color: '#4a9eff' },
      ],
      showAddresses: false,
      annotation: '注释',
    },
    // ...
  ],
};
```

### Step 2 — Registry

```ts
import { myScenario } from './scenarios/myScenario';
// MemoryBox already imported

'my-scenario': {
  scenario: myScenario,
  Component: MemoryBox as ComponentType<{ scenario: AnimScenario; step: number }>,
},
```

### Step 3 — Card

```ts
{ cardType: 'animation', content: { animationId: 'my-scenario' } }
```

### Step 4 — Done. No component code changes. Reuses `MemoryBox.tsx`.

---

## Add a ScopeCode animation (4 steps)

For "code walkthrough + memory state sync" — code area highlights current line, arrow points to memory cells below.

### Step 1 — Scenario file

```ts
import type { ScopeCodeScenario } from '@/types';

export const myScope: ScopeCodeScenario = {
  id: 'my-scope',
  title: '标题',
  totalSteps: 4,
  sourceCode: 'int main() {\n  int x = 10;\n}',
  cellsPerRow: 8,
  totalRows: 2,
  steps: [
    {
      label: '步骤名',
      highlightLines: [1],
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '10', color: '#2ed573' },
      ],
      annotation: '注释',
    },
    // ...
  ],
};
```

### Step 2 — Registry: import + add entry with `ScopeCodePlayer` as Component

### Step 3 — Card: `{ cardType: 'animation', content: { animationId: 'my-scope' } }`

### Step 4 — Done. Reuses `ScopeCodePlayer.tsx`.

---

## Add a Branch animation (4 steps)

For "condition → branch path" — code highlights condition line (blue) + taken path (green) + skipped path (gray).

### Step 1 — Scenario file

```ts
import type { BranchScenario } from '@/types';

export const myBranch: BranchScenario = {
  id: 'my-branch',
  title: '标题',
  totalSteps: 3,
  sourceCode: 'if (x > 5) {\n  cout << "大";\n} else {\n  cout << "小";\n}',
  steps: [
    {
      label: '步骤名',
      highlightLines: [0],   // condition line (blue)
      takenLines: [1],       // executed lines (green)
      skippedLines: [3],     // skipped lines (gray)
      annotation: '注释',
    },
    // ...
  ],
};
```

`takenLines` / `skippedLines` design:
- Empty `takenLines` → condition shows `?` (evaluating)
- Has `takenLines` → condition shows `↓`, green=executed, gray=skipped
- Works for if/else/switch — describe which lines execute/skip, not which branch type

### Step 2 — Registry: import + add entry with `BranchPlayer` as Component

### Step 3 — Card

### Step 4 — Done. Reuses `BranchPlayer.tsx`.

---

## Add a Loop animation (4 steps)

For "loop iteration" — code highlights for-loop line, body lines, iteration counter above.

### Step 1 — Scenario file

```ts
import type { LoopScenario } from '@/types';

export const myLoop: LoopScenario = {
  id: 'my-loop',
  title: '标题',
  totalSteps: 4,
  sourceCode: 'for (int i = 0; i < 3; i++) {\n  sum += i;\n}',
  steps: [
    {
      label: '步骤名',
      highlightLines: [0],   // for line
      bodyLines: [1],        // body lines
      iteration: 1,          // 0=init, 1..n=round N, -1=exit
      entered: true,         // whether body executes this step
      annotation: '注释',
    },
    // ...
  ],
};
```

### Step 2 — Registry: import + add entry with `LoopPlayer` as Component

### Step 3 — Card

### Step 4 — Done. Reuses `LoopPlayer.tsx`.

---

## Add a BreakContinue animation (4 steps)

For "break vs continue" side-by-side comparison.

### Step 1 — Scenario file

```ts
import type { BreakContinueScenario } from '@/types';

export const myBC: BreakContinueScenario = {
  id: 'my-bc',
  title: 'break 与 continue 对比',
  totalSteps: 4,
  breakCode: 'for (...) { if (...) break; ... }',
  continueCode: 'for (...) { if (...) continue; ... }',
  steps: [
    {
      label: '步骤名',
      breakLines: [0, 1], breakIteration: 1, breakEntered: true,
      continueLines: [0, 1], continueIteration: 1, continueEntered: true,
      annotation: '注释',
    },
    // ...
  ],
};
```

### Step 2 — Registry: import + add entry with `BreakContinuePlayer` as Component

### Step 3 — Card

### Step 4 — Done. Reuses `BreakContinuePlayer.tsx`.

---

## Add a WhileDoWhile animation (4 steps)

For "while vs do-while" side-by-side comparison. Same pattern as BreakContinue.

### Step 1 — Scenario file

```ts
import type { WhileDoWhileScenario } from '@/types';

export const myWDW: WhileDoWhileScenario = {
  id: 'my-wdw',
  title: 'while 与 do-while 对比',
  totalSteps: 3,
  whileCode: 'while (cond) { ... }',
  doWhileCode: 'do { ... } while (cond);',
  steps: [
    {
      label: '步骤名',
      whileLines: [0], whileIteration: 0, whileEntered: false,
      doWhileLines: [0], doWhileIteration: 0, doWhileEntered: false,
      annotation: '注释',
    },
    // ...
  ],
};
```

### Step 2 — Registry: import + add entry with `WhileDoWhilePlayer` as Component

### Step 3 — Card

### Step 4 — Done. Reuses `WhileDoWhilePlayer.tsx`.

---

## Add a Lottie animation (5 steps)

Prerequisite: install `lottie-react-native` + uncomment `LottiePlayer.tsx` and registry entry.

### Step 1 — Export Lottie JSON (AE Bodymovin plugin, shape layers only)

### Step 2 — Place in `assets/lottie/`

### Step 3 — Scenario file

```ts
import type { LottieScenario } from '@/types';

export const myLottie: LottieScenario = {
  id: 'my-lottie',
  title: '标题',
  totalSteps: 5,  // step / (totalSteps-1) maps to 0-1 playback progress
  lottieFile: './assets/lottie/my-lottie.json',
};
```

### Step 4 — Registry

### Step 5 — Card

---

## Add a brand-new animation type

When none of the existing types fit. Reference `ScopeCodePlayer.tsx` for implementation pattern.

1. **`src/types/index.ts`** — define new scenario interface extending `AnimScenario`
2. **`src/components/animations/`** — create new component: `{ scenario, step }` props
3. **Registry** — add one entry
4. **Done.** No changes to `renderCard.tsx`, `NodeScreen.tsx`, or registry structure.
