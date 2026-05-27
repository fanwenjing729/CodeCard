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

## 测试文件约定

- 和源码同目录，`.test.ts` 后缀
- 纯函数测试：直接 import 后断言
- Store 测试：用 `vi.mock()` mock `react-native` 和 AsyncStorage，`beforeEach` 里 `setState` 重置
- Registry 测试：用 `vi.mock()` mock 掉组件 import，避免 react-native Flow 语法报错
