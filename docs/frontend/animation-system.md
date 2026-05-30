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


---

## 附录 A：动画设计原则

（原 `animation-design-thinking.md`）

### 核心教训：先问"这个动画到底要展示什么关系"

MemoryBox 擅长展示**"内存里有什么"**——格子大小代表类型宽度、颜色区分变量、地址列展示位置。但作用域的核心不是"内存里有什么"，而是**"代码执行到这一行时，哪些变量还活着"**。

| 概念 | 本质关系 | 适合的工具 |
|------|---------|-----------|
| 变量内存布局 | 变量 ↔ 内存地址 | MemoryBox |
| 变量作用域 | 代码位置 ↔ 变量存活状态 | ScopeCodePlayer |
| 条件分支 | 条件值 ↔ 执行路径 | 分支对比组件 |

**第一原则：不是所有可视化都适合用 MemoryBox。先想清楚这个概念的本质关系是什么。**

### 动画设计决策链

写一个新动画前，按顺序回答四个问题：

1. **这个概念的"因"和"果"分别是什么？** 因和果都要在画面上能看到
2. **"因"能不能可视化？** 因如果不能可视化，这个动画就不适合做
3. **MemoryBox 够不够？** 不够就要新组件（ScopeCodePlayer 等）
4. **新组件能不能复用？** 不要把特定课程内容写死在组件里

### 颜色语义规范

| 颜色 | hex | 语义 |
|------|-----|------|
| 绿 | `#2ed573` | 第一个变量，活着 |
| 蓝 | `#4a9eff` | 第二个变量，活着 |
| 灰 | `#666666` | 已销毁 / 离开作用域 |
| 橙 | `#ff9f43` | 第三个变量 / 特殊标记 |
| 紫 | `#a55eea` | double / 大类型 |

每个颜色有固定的语义，不随机选色。绿色永远是"活着"，灰色永远是"死了"。

### 回顾：教学原则

```
判断标准：这个变量还活着吗？
    → 看代码执行到哪一行，在当前 {} 里面就是活着

对照例子：
    ✓ 内层 {} 里能访问外层 a（两个都绿）
    ✗ 离开内层 {} 后 b 就死了（变灰）

行为总结：
    绿色 = 活着，灰色 = 死了。{} 决定生死。
```

动画不是替代教学，是**把教学原则变成视觉**。

---

## 附录 B：C++ 课程动画设计

（原 `animations-design.md` 的精简版，完整 scenario 设计已保留）

### 开发工作流

```
1. 创建 scenarios/{name}.ts     → 写步骤数据
2. 在 animations/index.ts 注册  → 3 行
3. 打开预览页切换到新动画       → 即时看效果
4. 调整步骤、颜色、文案         → 回到第 1 步迭代
5. 满意后在课程节点加一张 card  → animation 类型
```

### Scenario 模板

```ts
import type { MemoryBoxScenario } from '../../../types';

export const myScenario: MemoryBoxScenario = {
  id: 'my-anim',
  title: '标题',
  cellsPerRow: 8,
  totalRows: 6,
  steps: [
    {
      label: '步骤名称',
      allocations: [{
        name: '变量名', type: '类型', typeSize: 4,
        value: '值', color: '#4a9eff',
      }],
      showAddresses: false,
      annotation: '底部注释文字',
    },
  ],
};
```

### 动画清单（6 个，预计 16h）

| # | 动画 | 绑定模块 | 预计 |
|---|------|---------|------|
| 1 | 变量作用域生命周期 | Module 1.6 | 1h |
| 2 | 指针与地址 | Module 1.8 | 3h |
| 3 | 数组内存布局 | Module 1.7 | 2h |
| 4 | 动态内存分配 | Module 2.1 | 3h |
| 5 | 智能指针引用计数 | Module 4.5 | 3h |
| 6 | 拷贝 vs 移动 | Module 6.1 | 4h |

每个动画的详细 Step 设计见原 `animations-design.md`（已归档到此文件末尾的设计章节）。
