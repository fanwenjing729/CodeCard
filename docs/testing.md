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

## 测试文件约定

- 和源码同目录，`.test.ts` 后缀
- 纯函数测试：直接 import 后断言
- Store 测试：用 `vi.mock()` mock `react-native` 和 AsyncStorage，`beforeEach` 里 `setState` 重置
- Registry 测试：用 `vi.mock()` mock 掉组件 import，避免 react-native Flow 语法报错
