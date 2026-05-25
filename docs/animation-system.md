# Animation System

所有动画遵循统一接口。添加新动画不改核心代码，只加数据+组件+注册。

## 两种模式

| 模式 | 触发条件 | 节奏控制 | 按钮 | 适合 |
|------|------|------|------|------|
| **手动步进** | `continuous` 未定义或 `false` | NodeScreen 管 step，用户点"下一步"推进 | `← 上一张` `下一步 2/5` | 代码逐步执行、概念对比 |
| **连续播放** | `continuous: true` | 组件内部自治（`useEffect` / `Animated` / `LottieView`） | `← 上一张` `下一张` | 排序过程、数据流动画、MG 动效 |

两种模式共用同一套 dispatch 链，互不干扰。

## Interface contract

```ts
// 所有动画场景必须满足（src/types/index.ts）
AnimScenario {
  id: string;
  title: string;
  totalSteps: number;
  continuous?: boolean;  // true → 组件自动播放，NodeScreen 隐藏步进按钮
}

// 组件必须接受
ComponentType<{ scenario: AnimScenario; step: number }>
// 手动步进：step 从 0 到 totalSteps-1，由 NodeScreen 驱动
// 连续播放：step 固定为 0，组件忽略 step，自己管理播放
```

## Dispatch chain

```
Card { cardType:'animation', content:{ animationId:'xxx' } }
  → renderCard.tsx (case 'animation')
    → getAnimScenario(animationId)  → scenario
    → 检查 scenario.continuous
      ├── false/undefined → NodeScreen 管理 animStep，显示步进按钮
      └── true            → NodeScreen 隐藏步进按钮，组件自治
    → getAnimComponent(animationId) → React component
    → React.createElement(Component, { scenario, step: animStep })
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
| Lottie | `LottieScenario` | `LottiePlayer.tsx` | Yes (continuous) |

## Files you NEVER change

- `renderCard.tsx` — animation branch already exists
- `NodeScreen.tsx` / `useNodeScreen.ts` — step control is generic, continuous mode built-in
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

## Add a Lottie animation (4 steps)

适用场景：After Effects 导出的 MG 动画——数据流、排序过程、生命周期演示、装饰动效。自动播放 + 循环，不需要用户点击步进。

Prerequisite: `lottie-react-native` 已安装。

### Step 1 — 制作 Lottie JSON

AE 用 Bodymovin 插件导出 JSON。只支持形状图层（不支持表达式、图像图层）。导出后放在 `src/data/animations/assets/`。

### Step 2 — Scenario 文件

`src/data/animations/scenarios/myLottie.ts`：

```ts
import type { LottieScenario } from '@/types';

export const myLottie: LottieScenario = {
  id: 'my-lottie',
  title: '标题（显示在动画下方）',
  totalSteps: 1,          // 连续动画固定为 1
  continuous: true,        // ← 关键：标记为连续播放
  source: require('../assets/my-lottie.json'),
};
```

`totalSteps` 对连续动画没有实际意义，但必须 ≥1。连续模式下 step 始终为 0。

### Step 3 — Registry

`src/data/animations/index.ts`：

```ts
import { myLottie } from './scenarios/myLottie';
import LottiePlayer from '@/components/animations/LottiePlayer';

export const animationRegistry: Record<string, AnimationEntry> = {
  // ... 现有条目 ...
  'my-lottie': {
    scenario: myLottie,
    Component: LottiePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
};
```

### Step 4 — 卡片引用

```ts
{ cardType: 'animation', content: { animationId: 'my-lottie' } }
```

用户滑到这张卡时，Lottie 自动开始播放并循环。按钮只显示"上一张 / 下一张"，没有步进计数。

---

## Add a custom continuous animation (5 steps)

当 Lottie 不够用、需要代码驱动的自动播放时用（如 React Native Animated API、手势交互）。

### Step 1 — Scenario 文件

```ts
import type { AnimScenario } from '@/types';

export const myAutoAnim: AnimScenario = {
  id: 'my-auto',
  title: '自定义连续动画',
  totalSteps: 1,
  continuous: true,  // ← 关键
};
```

如果需要自定义数据，扩展 `AnimScenario`：

```ts
// src/types/index.ts
export interface MyCustomScenario extends AnimScenario {
  // 你的自定义字段
  data: number[];
  speed: number;
}
```

### Step 2 — 组件

`src/components/animations/MyCustomPlayer.tsx`：

```tsx
import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import type { MyCustomScenario } from '@/types';

interface Props {
  scenario: MyCustomScenario;
  step: number;  // continuous 模式下固定为 0，可忽略
}

export default function MyCustomPlayer({ scenario }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 组件自己管理播放，不依赖 step
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: scenario.speed,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* 你的动画 UI */}
    </View>
  );
}
```

关键点：
- **忽略 `step` prop**——连续模式下 NodeScreen 传的 step 始终为 0
- **自己管理生命周期**——`useEffect` 里启动，cleanup 里停止
- **不需要暴露 `advance()` 回调**——NodeScreen 的"下一张"按钮直接完成卡片并翻页

### Step 3 — Registry

同 Lottie，`import` + 注册到 `animationRegistry`。

### Step 4 — 卡片引用

```ts
{ cardType: 'animation', content: { animationId: 'my-auto' } }
```

### Step 5 — Done.

---

## Add a brand-new animation type

When none of the existing types fit. Reference `ScopeCodePlayer.tsx` for implementation pattern.

1. **`src/types/index.ts`** — define new scenario interface extending `AnimScenario`
2. **`src/components/animations/`** — create new component: `{ scenario, step }` props
3. **Registry** — add one entry
4. **Done.** No changes to `renderCard.tsx`, `NodeScreen.tsx`, or registry structure.
