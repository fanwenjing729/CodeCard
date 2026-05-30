# 测试指南

## 运行

```bash
npm test           # 全量跑一次
npm run test:watch # watch 模式，改代码自动重跑
```

## 哪些改动需要补测试

| 改动类型 | 要补测试吗 | 补哪里 |
|----------|:--:|------|
| 新增课程 / 模块 / 节点 / 卡片 | 不用 | — |
| 新增动画场景数据（`scenarios/*`） | 不用 | — |
| 新增动画组件（`components/animations/*`） | 不用 | — |
| 改主题 / UI / 导航 | 不用 | — |
| 改 XP 公式（`src/lib/xp.ts`） | **要** | `src/lib/xp.test.ts` |
| 改进度计算（`src/lib/courseProgress.ts`） | **要** | `src/lib/courseProgress.test.ts` |
| 改 store action / 加新 action | **要** | 对应 store 的 `.test.ts` |
| 新增 store（如 authStore） | **要** | 新建对应的 `.test.ts` |
| 改 registry 查找函数（`getAnimScenario` / `getAnimComponent` / 同类） | **要** | 对应 data 目录的 `.test.ts` |

**一句话：有逻辑的函数就补测试，纯声明式数据不用。**

## 判断标准

**"有逻辑的函数就补测试，纯声明式数据不用。"**

具体判断：文件里有 `function` 关键字或箭头函数赋值（`export const xxx = () => {...}`）且函数体不是空的 → 要测。只有 `const` 对象/数组声明 → 不用测。

| 例 | 要不要测 | 理由 |
|----|:--:|------|
| `export function calcLevel(xp) { while (...) {...} }` | 要 | 有循环和计算 |
| `export function getAnimScenario(id) { return registry[id]?.scenario }` | 要 | 有查找逻辑，改 registry 可能漏注册 |
| `export const animationRegistry = { ... }` | 不用 | 纯数据声明 |
| `export const cards = [{ id, type, content }, ...]` | 不用 | 纯数据声明 |
| `function MyComponent() { return <View/> }` | 不用 | UI 组件，视觉正确性真机验证 |
| `export async function loginByPhone() { return { error: '...' } }` | 不用 | 空壳 no-op |

### 为什么不测 UI 和动画

| 层 | 正确性保障 | 原因 |
|----|----------|------|
| 卡片/场景数据 | TypeScript 类型 | 纯声明式，TS 编译过就没问题 |
| 动画组件 | 真机验证 | 依赖 reanimated + SVG，单测跑不了 |
| UI / 主题 / 导航 | TS 类型 + 肉眼 | 视觉正确性无法用断言验证 |

## useNodeScreen 测试（已删除，待重写）

`src/screens/useNodeScreen.test.ts` 已于 2025-05-25 删除（commit `2abfc57`）。原测试 326 行，因 mock 方案脆弱且与实现脱节被清理。

### 何时重写

以下任一发生，先补测试再改代码：
- 重构 `useNodeScreen.ts` 的卡牌前进 / 动画步进 / XP 奖励逻辑
- 新增卡片类型（需要修改 `advance()` 分支）
- 添加第二门课程，需要验证跨课程隔离

### 补测方法

#### mock 模板

```ts
const store = {
  rewardCard: vi.fn().mockReturnValue(true),
  setNodePosition: vi.fn(),
  addWrongCard: vi.fn(),
  removeWrongCard: vi.fn(),
};

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: (selector?: any) =>
    typeof selector === 'function' ? selector(store) : store,
  XP_PER_CARD: 5,
  XP_PER_PRACTICE: 10,
}));

vi.mock('@/data/animations', () => ({
  getAnimScenario: vi.fn((id: string) => {
    if (id === 'test-anim') return { id: 'test-anim', totalSteps: 3 };
    return undefined;
  }),
}));
```

#### 测试场景清单（14 个）

| # | 场景 | 要点 |
|---|------|------|
| 1 | 初始 index = savedIndex | savedIndex=2, cards=5 → index=2 |
| 2 | savedIndex 超出范围时 clamp | savedIndex=10, cards=3 → index=2 |
| 3 | advance 普通卡片 → rewardCard + index+1 | 验证参数 courseId, cardId, XP_PER_CARD |
| 4 | advance 最后一张卡 → goBack | 验证 navigation.goBack 被调用 |
| 5 | advance 动画卡非连续 → animStep+1 | animStep 0→1，不调 rewardCard |
| 6 | advance 动画卡最后一步 → rewardCard + goNext | totalSteps=3, animStep=2 |
| 7 | advance 连续动画 → 一步完成 | isContinuous=true, rewardCard + goNext |
| 8 | previous 回到上一张 | index-1, savePosition 被调用 |
| 9 | previous 在第一张时无操作 | index=0 → index 保持 0 |
| 10 | practice 正确 → XP_PER_PRACTICE + removeWrongCard | XP 值 10 |
| 11 | practice 错误 → addWrongCard | 不调 removeWrongCard |
| 12 | 卸载时保存当前位置 | unmount → setNodePosition 被调用 |
| 13 | cardType 变化时 animStep 重置为 0 | 切换卡片后 animStep=0 |
| 14 | 空 cards 数组不崩溃 | card 为 undefined 时不报错 |

#### 关键边界（不需要看源码就能理解）

- `rewardCard` 去重：同一 cardId 调用两次，store 内部 `if (cardId in c.completedCards) return s` 拦截，hook 层不做去重
- `goNext` 中 `isLast` 的判断基准是 `index === cards.length - 1`，与 `card` 是否为 undefined 无关
- `handlePracticeNext` 是 `goNext` 的简单包装，不额外调 rewardCard（XP 已在 handlePracticeComplete 中发放）
- 动画 step 与卡片 index 是独立状态，切换卡片时 step 重置、index 不变

---

## Screen/Hooks 测试补全计划（2026-05-29）

### 目标

12 个 Screen + 3 个 Hook 当前零测试。补 3 个 Phase，覆盖核心用户流程。

### 新增依赖

```json
{
  "@testing-library/react-native": "^13.0.0",
  "react-test-renderer": "19.2.0"
}
```

### 新增基础设施文件

**`src/test-utils.tsx`** — 共享 Provider 包装器

```tsx
// 渲染组件时包裹必要的 Context + Navigation
// wrap: ThemeContext → NavigationContainer → SafeAreaProvider
// 导出 resetStores() — 每个 test 前清空 auth + progress store
```

**`src/test-setup.ts`** — 全局 mock 补充

```
mock: react-native-reanimated, lottie-react-native, expo-font, react-native-svg
vitest.config.ts 已 mock react-native 基础组件，这里补动画/Native 模块
```

### Phase 总览

| Phase | 文件 | 条数 | 类型 | 状态 |
|-------|------|------|------|------|
| 1 | `useNodeScreen.test.ts` + `useAutoSync.test.ts` | 18 | hook 纯逻辑 | ✅ 完成 |
| 2 | `QuizScreen.test.tsx` + `NodeScreen.test.tsx` | ~18 | Screen 集成 | ⏳ 待做 |
| 3 | `LoginScreen.test.tsx` + `authStore.test.ts` 扩展 | ~10 | Auth 流程 | ⏳ 待做 |

### Phase 1 实际产出

| 文件 | 条数 | 覆盖 |
|------|------|------|
| `src/screens/useNodeScreen.test.ts` | 13 | 初始 index/clamp、advance(普通/动画非连续/动画连续/最后一张)、previous、handlePracticeComplete(正确/错误/cardRef)、unmount |
| `src/hooks/useAutoSync.test.ts` | 5 | 3s 防抖上传、未登录跳过、debounce 合并、unmount 清理、单次订阅 |

### 不改的文件（理由）

| 文件 | 原因 |
|------|------|
| `useProgressStore.ts` | 已有 `useProgressStore.test.ts` 覆盖 |
| `api.ts` | HTTP client，已有 `syncEngine.test.ts` 间接覆盖 |
| `syncEngine.ts` | 已有 `syncEngine.test.ts` |
| `renderCard.tsx` | 已有 `renderCard.test.tsx` |
| 各 Card 组件 | 已有单元测试 |
| 动画组件 | reanimated mock 下无测试价值，真机验证 |

---

## Phase 1 详细设计 — Hooks 纯逻辑测试

**目标**：不渲染任何 RN 组件，只测 hook 状态流转 + store 调用。
**策略**：用 `vi.mock()` mock 掉 `useProgressStore` / `useAuthStore` / `syncEngine` / `@/data/animations`。

### 文件 1：`src/screens/useNodeScreen.test.ts`

#### Mock 模板

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = {
  rewardCard: vi.fn().mockReturnValue(true),
  setNodePosition: vi.fn(),
  addWrongCard: vi.fn(),
  removeWrongCard: vi.fn(),
};

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: (selector?: any) =>
    typeof selector === 'function' ? selector(store) : store,
  XP_PER_CARD: 5,
  XP_PER_PRACTICE: 10,
}));

vi.mock('@/data/animations', () => ({
  getAnimScenario: vi.fn((id: string) => {
    if (id === 'test-anim') return { id: 'test-anim', totalSteps: 3, continuous: false };
    if (id === 'test-anim-continuous') return { id: 'test-anim-continuous', totalSteps: 1, continuous: true };
    return undefined;
  }),
}));

// react-test-renderer 的 renderHook
import { renderHook, act } from '@testing-library/react-native';
import { useNodeScreen } from './useNodeScreen';

const navigation = { goBack: vi.fn() };

function makeCards(count: number, cardType: string = 'concept') {
  return Array.from({ length: count }, (_, i) => ({
    id: `card-${i}`,
    cardType: cardType as any,
    content: { title: `Card ${i}`, body: 'test' } as any,
  }));
}

function makeAnimCard(id: string, animationId: string) {
  return { id, cardType: 'animation' as const, content: { animationId } as any };
}

beforeEach(() => {
  vi.clearAllMocks();
});
```

#### 测试用例（14 条）

##### 1. 初始 index

```
场景             savedIndex=2, cards 共 5 张 → index 初始为 2
断言             result.current.index === 2
```

```
场景             savedIndex=10, cards 共 3 张 → clamp 到 2
断言             result.current.index === 2
```

##### 2. advance 普通卡片

```
场景             index=0, cardType='concept', advance()
断言             rewardCard 被调用，参数 (courseId, 'card-0', 5)
                 index 变为 1
```

##### 3. advance 最后一张

```
场景             index=2, cards 共 3 张，advance()
断言             rewardCard 被调用
                 navigation.goBack 被调用
```

##### 4. advance 动画卡（非连续）

```
场景             cardType='animation', animStep=0, totalSteps=3, advance()
断言             animStep 变为 1
                 rewardCard 未被调用
```

```
场景             animStep=2, totalSteps=3, advance()
断言             rewardCard 被调用
                 index 变为下一张
```

##### 5. advance 动画卡（连续）

```
场景             cardType='animation', continuous=true, advance()
断言             rewardCard 被调用（一步完成）
                 index 进入下一张
```

##### 6. previous

```
场景             index=1, previous()
断言             index 变为 0
                 setNodePosition(courseId, nodeId, 0) 被调用
```

```
场景             index=0, previous()
断言             index 保持 0
```

##### 7. handlePracticeComplete

```
场景             correct=true
断言             rewardCard(courseId, cardId, XP_PER_PRACTICE) 被调用
                 removeWrongCard(courseId, cardId) 被调用
                 addWrongCard 未被调用
```

```
场景             correct=false
断言             addWrongCard(courseId, cardId) 被调用
                 rewardCard 未被调用
                 removeWrongCard 未被调用
```

##### 8. 卸载保存位置

```
场景             unmount hook
断言             setNodePosition(courseId, nodeId, currentIndex) 被调用
```

##### 9. 切换卡片时 animStep 重置

```
场景             index=0, cardType='animation', animStep=2
                 切换卡片（advance 到 card-1）
断言             card-1 的 animStep 为 0
```

##### 10. 空卡片数组

```
场景             cards=[], 调用 hook
断言             card 为 undefined，不崩溃
```

---

### 文件 2：`src/hooks/useAutoSync.test.ts`

#### Mock 模板

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const uploadProgress = vi.fn().mockResolvedValue(undefined);

vi.mock('@/store/syncEngine', () => ({ uploadProgress }));

const mockSubscribe = vi.fn();
const mockGetState = vi.fn();

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: {
    subscribe: (fn: Function) => {
      mockSubscribe(fn);
      return () => {}; // unsubscribe noop
    },
  },
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: {
    getState: () => mockGetState(),
  },
}));

import { useAutoSync } from './useAutoSync';
import { renderHook, act } from '@testing-library/react-native';
```

#### 测试用例（5 条）

##### 1. 进度变更 → 3s 后自动上传

```
前置             useAuthStore.getState().user = { id: 'u1' }
操作             触发 subscribe 回调
断言             立即检查：uploadProgress 未被调用
                 等待 3s 后：uploadProgress('u1') 被调用 1 次
```

##### 2. 未登录时不触发上传

```
前置             useAuthStore.getState().user = null
操作             触发 subscribe 回调，等待 3s
断言             uploadProgress 未被调用
```

##### 3. 快速连续变更只触发一次（debounce）

```
前置             user = { id: 'u1' }
操作             连续触发 3 次 subscribe 回调，等待 3s
断言             uploadProgress 只被调用 1 次
```

##### 4. unmount 时清理 timer

```
前置             user = { id: 'u1' }
操作             触发 subscribe → 在 3s 内 unmount → 等待 3s
断言             uploadProgress 未被调用
```

##### 5. hook 重渲染不重复订阅

```
前置             user = { id: 'u1' }
操作             renderHook → rerender
断言             subscribe 的回调注册次数 ≤ 1
```

---

## Phase 1 执行步骤

### Step 0 — 安装依赖

```bash
npm install -D @testing-library/react-native react-test-renderer@19.2.0
```

**验收**：`npm test` → 145 passed, 0 failed（确保新依赖没破坏现有测试）

**如果挂了**：
- `react-test-renderer` 版本不匹配项目 React 19.2.0 → 检查 `npm ls react-test-renderer` 确认版本一致
- `@testing-library/react-native` 找不到模块 → 检查 node_modules 是否有 `@testing-library` 目录

---

### Step 1 — `useNodeScreen.test.ts`

#### 1.1 最小可行测试（1 条，验证基础设施）

- 文件：`src/screens/useNodeScreen.test.ts`
- 内容：Mock 层 + `makeCards` 工厂 + `savedIndex=2, cards=5 → index 初始为 2`
- `npm test` → 146 passed
- **如果挂了**：
  - `renderHook is not a function` → 检查 import 路径，确认 `@testing-library/react-native` v13 已安装
  - `act is not a function` → 同上
  - mock 没生效 → `vi.mock()` 必须写在所有 `import` 之前（vitest 会自动提升，但需确认文件结构）
  - `useProgressStore` mock 不工作 → 确认 selector 参数被正确传入

#### 1.2 初始 index + clamp（2 条）

| # | 输入 | 断言 |
|---|------|------|
| 1 | savedIndex=2, cards=5 | index === 2 |
| 2 | savedIndex=10, cards=3 | index === 2 (clamp) |

#### 1.3 advance / previous（5 条）

| # | 操作 | 断言 |
|---|------|------|
| 3 | index=0, concept, advance() | rewardCard(courseId, 'card-0', 5), index===1 |
| 4 | index=2, cards=3, advance() | rewardCard 调了, goBack 调了 |
| 5 | animation 非连续, animStep=0/3, advance() | animStep===1, rewardCard 未调 |
| 6 | animation 非连续, animStep=2/3, advance() | rewardCard 调了, goNext → index+1 |
| 7 | index=1, previous() | index===0, setNodePosition(courseId, nodeId, 0) |
| 8 | index=0, previous() | index 保持 0 |

#### 1.4 动画 + practice + 卸载（4 条）

| # | 操作 | 断言 |
|---|------|------|
| 9 | animation 连续, advance() | rewardCard 调了, index+1（一步完成） |
| 10 | handlePracticeComplete(true) | rewardCard(courseId, cardId, 10), removeWrongCard 调了 |
| 11 | handlePracticeComplete(false) | addWrongCard 调了, rewardCard 未调 |
| 12 | unmount | setNodePosition(courseId, nodeId, currentIndex) |

**注意**：原本设计的 `空卡片不崩溃` 和 `animStep 重置` 两条需要 React 组件渲染上下文，在 Phase 1 的 renderHook 模式下可能无法可靠断言。留到 Phase 2 NodeScreen 集成测试覆盖。

---

### Step 2 — `useAutoSync.test.ts`

#### 2.1 基础路径（2 条）

| # | 前置 | 操作 | 断言 |
|---|------|------|------|
| 1 | user={id:'u1'} | fire callback + advanceTimersByTime(3000) | uploadProgress('u1') 调 1 次 |
| 2 | user=null | fire callback + advanceTimersByTime(3000) | uploadProgress 未调 |

**关键时序**：
```
vi.useFakeTimers()
renderHook → useEffect → subscribe(callback) 注册
act(() => { /* 手动触发 callback */ })
  → callback 内：读取 uid → setTimeout(upload, 3000)
  → upload 尚未调用 ✓
act(() => { vi.advanceTimersByTime(3000) })
  → setTimeout 回调执行 → upload 调用 ✓
```

**如果挂了**：
- subscribe callback 未触发 → mock 的 `useProgressStore.subscribe` 写法问题。改为 `vi.fn().mockImplementation((cb) => { ...; return vi.fn(); })`
- timer 未触发 → `vi.useFakeTimers()` 必须放在测试体首行，不能用 `beforeEach` 里的 `vi.useFakeTimers()`（vitest 限制）
- `act()` 报 warning → 用 `await act(async () => { ... })` 替代

#### 2.2 边界路径（3 条）

| # | 操作 | 断言 |
|---|------|------|
| 3 | 连续 fire callback ×3 + advanceTimersByTime(3000) | uploadProgress 调 1 次（debounce 合并） |
| 4 | fire callback → unmount → advanceTimersByTime(3000) | uploadProgress 未调（timer 已清理） |
| 5 | renderHook → rerender（同 props） | subscribe 注册次数 ≤ 1 |

---

### Step 3 — 全量回归

```bash
npm test
```

**预期**：145 + 12 + 5 = 162 passed, 0 failed

**如果挂了**：
- 新增 mock 污染现有测试 → 检查 `vi.mock` 作用域。用 `vi.unmock()` 在 `afterEach` 清理，或把 mock 移到 `beforeEach` 内
- 现有 145 条有失败 → 逐个检查 vitest 输出，可能是 mock 模块名冲突

---

## 坑位预警

| 坑 | 症状 | 原因 | 解法 |
|----|------|------|------|
| renderHook 不 work | `renderHook is not defined` | 没装或版本不对 | 确认 `@testing-library/react-native@^13`，重启 vitest |
| vi.mock 没提升 | mock 的是真实模块 | `vi.mock()` 不在文件顶层 | 移到 import 之前（vitest 自动提升但某些情况例外） |
| fake timers + React 冲突 | `act()` 内 timer 不触发 | vitest fake timers 实现与 React scheduler 冲突 | 用 `vi.advanceTimersByTime` 而不是 `vi.runAllTimers` |
| subscribe 捕获不到 | callback 没被调用 | mock 的 subscribe 函数定义有误 | 检查 `useProgressStore.subscribe` mock 是否接受 callback 参数 |
| 重渲染不生效 | result.current 没更新 | `act()` 没包裹状态变更 | 所有触发 state 更新的操作包在 `act()` 里 |

---

---

## Phase 1 踩坑记录

### 坑 1：`@testing-library/react-native` 不可用（Node.js v24）

**症状**：
```
SyntaxError: Unexpected token 'typeof'
at node_modules/react-native/index.js:27
```

**根因**：`@testing-library/react-native` 内部 `import from 'react-native'`，RN 的 `index.js` 包含 Flow 类型语法 `import typeof * as`，Node.js v24 无法解析。`vi.mock('react-native', ...)` 只拦截测试文件的 import，拦不住 node_modules 内部的依赖链。

**解法**：不用 `@testing-library/react-native`，基于 `react-test-renderer` 手写 `renderHook`：

```ts
import TestRenderer from 'react-test-renderer';

function renderHook<P, R>(useHook: (props: P) => R, initialProps: P) {
  const result = { current: undefined as any as R };
  let renderer: TestRenderer.ReactTestRenderer;

  function TestComponent(props: P) {
    result.current = useHook(props);
    return null;
  }

  act(() => {
    renderer = TestRenderer.create(createElement(TestComponent, initialProps));
  });

  return {
    result,
    unmount: () => { act(() => { renderer!.unmount(); }); },
    rerender: (newProps: P) => {
      act(() => { renderer!.update(createElement(TestComponent, newProps)); });
    },
  };
}
```

15 行代码，功能等同于 `@testing-library/react-native` 的 `renderHook`，且少了 1 个依赖。

### 坑 2：`unmount()` 必须包装 `act()`

**症状**：unmount 后 `useEffect` 清理函数没执行，timer 未被 `clearTimeout`。

**根因**：React 的 effect 清理在 commit 阶段执行。`renderer.unmount()` 不包 `act()` 时，React 不会 flush 清理 effect。

**解法**：
```ts
// ✗ 错误 — 清理 effect 不触发
unmount: () => renderer.unmount();

// ✓ 正确 — act() 触发完整的 unmount + cleanup 流程
unmount: () => {
  act(() => {
    renderer.unmount();
  });
},
```

### 坑 3：`vi.mock` 工厂函数不能引用外部变量

**症状**：
```
SyntaxError: Unexpected token 'typeof'
```

**根因**：vitest 将 `vi.mock()` 调用提升到文件顶部，此时 `const store = {...}` 尚未执行。工厂函数只能使用 `vi.hoisted()` 内定义的变量和 import 来的模块。

**解法**：用 `vi.hoisted()` 包裹共享状态：
```ts
const { store } = vi.hoisted(() => ({
  store: {
    rewardCard: vi.fn().mockReturnValue(true),
    // ...
  },
}));

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: function(selector) {
    return selector ? selector(store) : store; // ← store 来自 vi.hoisted
  },
}));
```

### 坑 4：`vi.mock` 工厂函数不用 TypeScript 类型注解

**症状**：mock 工厂中写箭头函数 + 类型注解 → 序列化报错。

**根因**：vitest 将 mock 工厂函数序列化后执行，TypeScript 类型注解（`: string`、`?: any`）在序列化后的 JavaScript 中非法。

**解法**：用普通 `function` + 去掉类型注解：
```ts
// ✗ 箭头函数 + 类型注解 — 序列化报错
vi.mock('@/x', () => ({
  fn: (id: string): any => { ... },
}));

// ✓ 普通 function + 无类型注解
vi.mock('@/x', () => ({
  fn: function(id) { ... },
}));
```

### 坑 5：`vi.useFakeTimers()` + React `act()` 配合

**症状**：fake timers 下 `setTimeout` 不触发。

**根因**：`vi.useFakeTimers()` 替换全局 `setTimeout`。`act()` 只 flush React effect 队列，不推进虚拟时钟。需要显式 `vi.advanceTimersByTime()`。

**解法**：
```ts
vi.useFakeTimers();
renderHook(...);

act(() => { triggerCallback(); });  // setTimeout(fn, 3000) 入队

// ✗ 错误 — fn 还没执行
expect(uploadProgress).toHaveBeenCalled();

// ✓ 正确 — 推进时钟后 fn 执行
act(() => { vi.advanceTimersByTime(3000); });
expect(uploadProgress).toHaveBeenCalled();

// 别忘了清理
afterEach(() => { vi.useRealTimers(); });
```

---

## Phase 2 — Screen 集成测试（待补，触发条件见下方）

### 不做

当前 Screen 层是纯胶水代码——把 hook 返回值绑到 JSX。所有逻辑决策在 Phase 1 已覆盖的 hook/reducer 里。Phase 2 的 mock 成本高但产出的 bug 发现率极低。

### 什么时候做

| 触发条件 | 为什么 | 补哪个 |
|----------|------|--------|
| `NodeScreen` 新增卡片类型（如 `video`、`audio`） | 渲染分支多，纯 props 转发可能漏 | NodeScreen |
| `QuizScreen` 加新交互（如拖拽排序、语音输入） | UI 状态机复杂，dispatch 序列可能出 bug | QuizScreen |
| APK 白屏/卡死/闪退，但 store + hook 单测全绿 | bug 在 Screen 层——navigation 参数传错、条件 return 漏分支 | 对应 Screen |
| 新人接手 UI | 测试当文档用——一眼看到所有合法状态 | 全量 |

### 怎么做（以下指南不依赖源码阅读）

---

### 文件 1：`src/screens/QuizScreen.test.tsx`

#### 组件结构

```
QuizScreen(route: { courseId, nodeId })
  ├── useCourse(courseId) → course
  │   └── course.nodes.find(n => n.id === nodeId) → node
  │       └── node.cards.filter(c => c.cardType === 'practice') → cards
  ├── useReducer(quizReducer, { index, score, done, submitted, selected, fillAnswer })
  ├── ScreenHeader (back, progress text)
  ├── QuestionRenderer(card.content, selected, fillAnswer, submitted, ...)
  └── done → 结果显示页（"测验完成" + score + 返回按钮）
```

#### 状态流转

```
QuestionRenderer 渲染
  → 用户选中/输入 → SELECT/FILL dispatch
  → 用户点提交 → SUBMIT + (正确→SCORE+rewardCard+removeWrongCard | 错误→addWrongCard)
  → 用户点下一题 → NEXT(index+1) | DONE(最后题)
  → 退出 → useEffect cleanup 调 saveQuizScore
```

#### Mock 模板

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { createElement, act } from 'react';
import TestRenderer from 'react-test-renderer';

// ── 共享状态 ──
const {
  store,
  courseData,
  routeParams,
} = vi.hoisted(() => ({
  store: {
    rewardCard: vi.fn().mockReturnValue(true),
    saveQuizScore: vi.fn(),
    addWrongCard: vi.fn(),
    removeWrongCard: vi.fn(),
  },
  courseData: {
    id: 'test-course',
    title: 'Test',
    nodes: [{
      id: 'quiz-node-1',
      cards: [
        { id: 'q1', cardType: 'practice', content: { question: 'Q1?', questionType: 'choice', options: ['A','B'], answer: 'A', explanation: 'A是对的' } },
        { id: 'q2', cardType: 'practice', content: { question: 'Q2?', questionType: 'fill', answer: 'hello', explanation: '答案是hello' } },
        { id: 'q3', cardType: 'practice', content: { question: 'Q3?', questionType: 'choice', options: ['X','Y'], answer: 'Y', explanation: 'Y是对的' } },
      ],
    }],
  },
  routeParams: { courseId: 'test-course', nodeId: 'quiz-node-1' },
}));

// ── Mocks ──
vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: function(selector) { return selector(store); },
  XP_PER_PRACTICE: 10,
}));

vi.mock('@/lib/useCourses', () => ({
  useCourse: function(id: string) {
    return id === 'test-course' ? courseData : undefined;
  },
}));

vi.mock('@/navigation/AppNavigator', () => ({
  RootStackParamList: {},
}));

// Mock navigation
const navGoBack = vi.fn();
const navSetOptions = vi.fn();

vi.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: navGoBack, setOptions: navSetOptions }),
}));

vi.mock('@react-navigation/native-stack', () => ({
  // not used directly in test
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() },
}));

// Mock ScreenHeader
vi.mock('@/components/shared/ScreenHeader', () => ({
  default: function(props: any) { return React.createElement('ScreenHeader', props); },
}));

// Mock theme
vi.mock('@/theme', () => ({
  Colors: { bg: '#fff', primary: '#5B7FFF', text: '#222', textSecondary: '#666', textMuted: '#999', textInverse: '#fff', success: '#34D399', warning: '#F59E0B', border: '#eee', disabledBg: '#f5f5f5' },
  useColors: () => ({ bg: '#fff', primary: '#5B7FFF', text: '#222', textSecondary: '#666', textMuted: '#999', textInverse: '#fff', success: '#34D399', warning: '#F59E0B', border: '#eee', disabledBg: '#f5f5f5' }),
  FontFamily: { sans: 'System', sansBold: 'System-Bold' },
}));

// Mock Animated
vi.mock('react-native-reanimated', () => ({
  default: { View: 'AnimatedView', Text: 'AnimatedText', createAnimatedComponent: (c: any) => c },
  FadeInRight: { duration: () => ({}) },
  FadeOutLeft: { duration: () => ({}) },
  FadeIn: { duration: () => ({}) },
}));

import QuizScreen from './QuizScreen';
```

#### render 工厂

```ts
function renderQuiz() {
  const route = { params: routeParams, key: 'Quiz-test', name: 'Quiz' as const };
  const navigation = {
    goBack: navGoBack,
    setOptions: navSetOptions,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    navigate: vi.fn(),
  };

  let renderer: TestRenderer.ReactTestRenderer;

  act(() => {
    renderer = TestRenderer.create(
      createElement(QuizScreen as any, { route, navigation } as any)
    );
  });

  return {
    root: renderer!.root,
    unmount: () => { act(() => { renderer!.unmount(); }); },
  };
}
```

#### 测试用例（10 条）

| # | 操作 | 断言方式 |
|---|------|----------|
| 1 | `renderQuiz()` | 遍历 `root.findAllByType(QuestionRenderer)` → length ≥ 1，第一题 `content.question` 存在 |
| 2 | `renderQuiz()` → 选 A → 点提交 | `store.rewardCard` 调了，`store.removeWrongCard` 调了 |
| 3 | `change node.cards[1].answer to 'wrong'` → 选 B → 提交 | `store.addWrongCard` 调了 |
| 4 | 填空题输入 hello → 提交 | `store.rewardCard` 调了 |
| 5 | 填空题输入 wrong → 提交 | `store.addWrongCard` 调了 |
| 6 | 答对 1 题 + 答错 1 题 + 完成 | `store.saveQuizScore` 收到的 score = 1 |
| 7 | 点下一题 | `useReducer` state 的 `submitted=false, selected=null`（通过检查 QuestionRenderer 的 props） |
| 8 | 3 题全做完 → 最后一道点下一题 | 根组件树包含文本"测验完成" |
| 9 | 3 题全做完 → unmount | `store.saveQuizScore` 被调用 |
| 10 | 空课程（`useCourse` 返回 undefined） | 根组件树包含文本"暂无题目" |

**注意事项**：QuizScreen 用 `useReducer` 管理状态，`testID` 或 `findByProps` 定位元素。由于 RN mock 下 `style` 对象和 `onPress` handler 可以通过 `findByProps` 匹配，不需要 `testID`。

---

### 文件 2：`src/screens/NodeScreen.test.tsx`

#### 组件结构

```
NodeScreen(route: { courseId, nodeId })
  ├── useProgressStore → savedIndex = courses[courseId]?.nodePositions[nodeId]
  ├── useCourse(courseId) → course → node → cards
  ├── useNodeScreen({ courseId, nodeId, cards, savedIndex, navigation })
  │   └── 返回 { card, index, isLast, advance, previous, ... }
  ├── ScreenHeader (back, module name, progress text)
  ├── Animated.View > renderCard({ card, animStep, ... })
  └── Footer: "上一张" (disabled at index=0) + "下一张/完成" button
```

#### Mock 模板（与 QuizScreen 相同的主题/navigation/RN mock + 额外项）

```ts
// — 除了 QuizScreen 已有的 mock，还要加这些 —

vi.mock('@/components/cards/renderCard', () => ({
  default: function(props: any) {
    return React.createElement('RenderCard', props);
  },
}));

vi.mock('@/screens/useNodeScreen', () => {
  // 用真实的 useNodeScreen（Phase 1 已验证）
  // 或在 NodeScreen 测试中，mock 掉它来简化
  const actualModule = vi.importActual('@/screens/useNodeScreen');
  return actualModule;
});

vi.mock('@/data/animations', () => ({
  getAnimScenario: vi.fn(() => undefined),
  getAnimComponent: vi.fn(() => undefined),
}));
```

#### render 工厂

```ts
function renderNode(nodeOverride?: Partial<PathNode>) {
  const node = { ...courseData.nodes[0], ...nodeOverride };
  const localCourseData = { ...courseData, nodes: [node] };
  // 修改 vi.mocked useCourse 的返回...
}
```

#### 测试用例（8 条）

| # | 操作 | 断言方式 |
|---|------|----------|
| 1 | courseId 错误 → `useCourse` 返回 undefined | 根组件树包含"课程未找到" |
| 2 | nodeId 错误 → node 找不到 | 根组件树包含"节点未找到" |
| 3 | 正常渲染 concept 卡 | `findByType(RenderCard)` props.card.cardType === 'concept' |
| 4 | 正常渲染 practice 卡 | RenderCard props.card.cardType === 'practice' |
| 5 | index=0 | "上一张"按钮 `disabled === true` |
| 6 | 点"下一张" | RenderCard props.card 更新为新卡片 |
| 7 | index=last | 按钮文案含"完成"，点后 `navGoBack` 被调用 |
| 8 | 空 cards | 根组件树包含"暂无卡片" |

**注意事项**：NodeScreen 的 Animated 组件在 mock 下退化为普通 View，`entering`/`exiting` props 被忽略，不影响测试。`ScreenHeader`、`renderCard` 都被 mock 为简单组件，测试重点在路由参数 → 兜底 UI 和按钮行为。

---

## Phase 3 — Auth 流程测试（待补，触发条件见下方）

### 什么时候做

| 触发条件 | 补哪个 |
|----------|--------|
| 改登录流程（加 2FA、改 OTP 步骤、改密码规则） | LoginScreen.test.tsx |
| 报告"登录失败但没有错误提示"类 bug | LoginScreen.test.tsx |
| 改 token 刷新/过期逻辑 | authStore.test.ts 扩展 |
| 加第三方登录（微信/Apple/Google） | LoginScreen.test.tsx |

### 怎么做

---

### 文件 1：`src/screens/LoginScreen.test.tsx`

#### 组件结构

```
LoginScreen
  ├── Tab: "密码登录" | "验证码登录"
  ├── 密码登录表单: email/phone input + password input + submit
  │   → authStore.loginByEmail(email, password)
  │   → 成功: navigation.goBack()
  │   → 失败: 显示错误文本
  ├── 验证码登录表单: email/phone input + OTP input + send/submit
  │   → authStore.sendEmailOtp / sendPhoneOtp
  │   → authStore.verifyEmailOtp / verifyPhoneOtp
  └── 底部: "还没有账号？注册" → RegisterScreen
```

#### Mock 模板（与 QuizScreen 相同基础 mock + ）

```ts
const authActions = vi.hoisted(() => ({
  loginByEmail: vi.fn(),
  sendEmailOtp: vi.fn(),
  verifyEmailOtp: vi.fn(),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: function(selector: any) {
    return selector({ ...authActions, isLoggedIn: false });
  },
}));
```

#### 测试用例（6 条）

| # | 操作 | 断言 |
|---|------|------|
| 1 | 渲染 LoginScreen | 邮箱输入框 + 密码输入框 + 登录按钮存在 |
| 2 | 空字段点登录 | 按钮 disabled 或显示验证错误 |
| 3 | 填邮箱 `a@b.com` 密码 `123456` 点登录，mock 返回 `{}` | `authActions.loginByEmail` 被调用，参数正确，`navGoBack` 被调用 |
| 4 | 填邮箱密码，mock 返回 `{ error: '邮箱或密码错误' }` | 页面显示错误文本"邮箱或密码错误" |
| 5 | 切到"验证码登录" tab | OTP 输入框 + 发送按钮存在 |
| 6 | OTP 登录成功 → isNewUser=true | 跳转到 RegisterScreen（检查 navigation.navigate 参数） |

---

### 文件 2：`src/store/authStore.test.ts`（扩展现有测试）

已有覆盖：logout。需补：

| # | 测试内容 | 断言 |
|---|---------|------|
| 1 | `initialize` — 有效 token → 加载 profile | `apiGet('/auth/me')` 调了，`isLoggedIn=true`，`syncOnLogin` 调了 |
| 2 | `initialize` — token 过期 401 | `clearTokens` 调了，`isMounted=true`，user=null |
| 3 | `setDisplayId` 成功 | store user.displayId 更新，`apiPut` 调了 |
| 4 | `setDisplayId` 失败 | store user 回滚到旧值 |
| 5 | `updateAvatar` 成功 | user.avatar 更新，`apiPut` 调了，AsyncStorage setItem 调了 |
| 6 | `verifyEmailOtp` → isNewUser | 返回值含 `{ isNewUser: true }` |

---

## 测试文件约定

- 和源码同目录，`.test.ts` 后缀
- 纯函数测试：直接 import 后断言
- Store 测试：用 `vi.mock()` mock `react-native` 和 AsyncStorage，`beforeEach` 里 `setState` 重置
- Hook 测试：用 `renderHook` + `act`，mock 掉所有 store/外部依赖
- Screen 测试：用 `render` + Provider wrapper，mock 掉动画/Native 组件
- Registry 测试：用 `vi.mock()` mock 掉组件 import，避免 react-native Flow 语法报错
