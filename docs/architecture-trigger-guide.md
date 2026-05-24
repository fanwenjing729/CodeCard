---
name: architecture-trigger-guide
description: 3 项架构改进的精确触发条件、实施步骤、代码改动——触发后可直接照做
metadata: 
  node_type: memory
  type: project
  originSessionId: ed249e81-c868-4786-8719-6be325eedb9d
---

# 架构改进触发指南

当前状态（2026-05-24）：`useProgressStore.ts` 289 行，`tsc --noEmit` 零错误。

---

## 1. 纯函数测试

### 触发条件（任一满足即动手）

- `useProgressStore.ts` 超过 **300 行** ← 当前 289，差 11 行
- 有第二个人开始改 store 逻辑
- 接后端同步（auth-sync.md 的方案落地）
- 出过一次"改了 store break 功能"的事故

### 实施步骤

**Step 1 — 安装 Jest：**
```bash
npx expo install jest-expo jest
```
在 `package.json` 加：
```json
"scripts": { "test": "jest" }
```
加 `jest.config.js`：
```js
module.exports = { preset: 'jest-expo' };
```

**Step 2 — 抽取纯函数到 `src/lib/progressActions.ts`：**

从 `useProgressStore.ts` 搬走 4 个函数：

```ts
// === 从 store L14-19 搬来 ===
export function getOrCreateCourse(
  courses: Record<string, CourseProgress>,
  courseId: string,
): CourseProgress {
  return courses[courseId] ?? {
    completedCards: {}, xp: 0, quizScores: {},
    nodePositions: {}, wrongCards: {},
  };
}

// === 从 store L33-37 搬来 ===
export function arrayToRecord(arr: string[]): Record<string, true> {
  const rec: Record<string, true> = {};
  for (const item of arr) rec[item] = true;
  return rec;
}

// === 从 store L40-75 搬来（迁移函数 + MIGRATIONS 表）===
// MIGRATIONS 对象和 migrate() 函数整体搬

// === 从 store L103-109 搬来 ===
export function pickData(s: ProgressStore): PersistedData {
  return {
    version: CURRENT_VERSION,
    global: { totalXP: s.global.totalXP, level: 1 },
    courses: s.courses,
  };
}
```

store 文件 import 回这些函数。Screen 引用不变。

**Step 3 — 写测试 `src/lib/__tests__/progressActions.test.ts`：**

```ts
import { getOrCreateCourse, migrate } from '@/lib/progressActions';
import { calcLevel, xpForLevelStart, xpForNextLevel } from '@/lib/xp';

// calcLevel（已在 xp.ts，直接测）
test('calcLevel(0) = 1', () => expect(calcLevel(0)).toBe(1));
test('calcLevel(49) = 1', () => expect(calcLevel(49)).toBe(1));
test('calcLevel(50) = 2', () => expect(calcLevel(50)).toBe(2));
test('calcLevel(150) = 3', () => expect(calcLevel(150)).toBe(3));

// getOrCreateCourse
test('新课程返回默认 CourseProgress', () => {
  const result = getOrCreateCourse({}, 'cpp');
  expect(result.completedCards).toEqual({});
  expect(result.xp).toBe(0);
});
test('已有课程返回原对象', () => {
  const existing = { completedCards: { 'c1': true }, xp: 10, quizScores: {}, nodePositions: {}, wrongCards: {} };
  expect(getOrCreateCourse({ cpp: existing }, 'cpp')).toBe(existing);
});

// migrate: v1 → v3
test('v1 数据迁移后 completedCards/wrongCards 为 Record', () => {
  const v1 = { version: 1, global: { totalXP: 0, level: 1 }, courses: {} };
  const result = migrate(v1);
  expect(result.version).toBe(3);
});

// xpForLevelStart / xpForNextLevel 关系
test('xpForLevelStart(3) + xpForNextLevel(3) = xpForLevelStart(4)', () => {
  expect(xpForLevelStart(3) + xpForNextLevel(3)).toBe(xpForLevelStart(4));
});
```

**改动量：** ~50 行搬运 + ~40 行测试。Store 289 → ~240 行。
**不改：** Screen 组件、Zustand action、UI。

---

## 2. AsyncStorage 原子写入保护

### 触发条件

**暂不需要。** Android 底层 SQLite 的 `setItem` 自带事务保护。以下任一发生时再动：
- 用户反馈数据丢失
- 接入后端同步后写入频率大幅提高
- 上线前想做保守防护

### 实施步骤

只改 `useProgressStore.ts`，~10 行。

**改 `flush()` / `save()`：**
```ts
const STORAGE_KEY = 'codecard-progress';
const STORAGE_KEY_TMP = 'codecard-progress-tmp';

const save = async (data: PersistedData) => {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY_TMP, json);  // 先写临时
    await AsyncStorage.setItem(STORAGE_KEY, json);       // 再写正式
  } catch (e) {
    console.warn('[CodeCard] AsyncStorage write failed:', e);
  }
};
```

**改 `hydrate()`：**
```ts
let raw = await AsyncStorage.getItem(STORAGE_KEY);
if (!raw) raw = await AsyncStorage.getItem(STORAGE_KEY_TMP);  // fallback
```

**原理：** 写入中途 crash → 正式 key 还是旧数据，临时 key 有部分写入 → hydrate 优先读正式 key。只有正式 key 也坏了才 fallback 到临时 key。比原来多一层保护。

---

## 3. 崩溃上报 + 轻量埋点

### 触发条件

**准备上线前（有真实用户之前）。** 不上线就不需要。

### 崩溃上报（~20 行）

React Native 生态的崩溃上报，推荐 **Sentry**（Expo 官方支持）：

```bash
npx expo install sentry-expo
npx expo customize sentry
```

最简接入（`App.tsx` 顶部）：
```ts
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_DSN',
  enableInExpoDevelopment: false,
  debug: false,
});
```

Sentry 自动捕获未处理的 JS 异常和 native 崩溃。要手动上报：
```ts
Sentry.Native.captureException(error);
```

### 轻量埋点（~30 行）

不接 Firebase（太重），用一个极简的 `Analytics` 模块：

```ts
// src/lib/analytics.ts
type EventName = 'card_complete' | 'quiz_score' | 'node_complete' | 'course_start';

export function track(event: EventName, props?: Record<string, string | number>) {
  if (__DEV__) {
    console.log('[Analytics]', event, props);
    return;
  }
  // 上线后替换为真实上报：
  // fetch('https://analytics.example.com/event', { method: 'POST', body: JSON.stringify({ event, props, ts: Date.now() }) });
}
```

在关键 action 加一行：
- `useProgressStore.rewardCard()` 成功后 → `track('card_complete', { courseId, cardId })`
- `QuizScreen` 完成测验 → `track('quiz_score', { courseId, nodeId, score })`
- `NodeScreen` 完成所有卡片 → `track('node_complete', { courseId, nodeId })`
- `HomeScreen` 进入课程 → `track('course_start', { courseId })`

不改 UI，不改业务逻辑。

### 优先级

上线前：崩溃上报 > 原子写入 > 埋点

---

## 不需要动的

以下有明确触发条件但当前不满足，不要提前做：
- **Store 拆分**：需要加新状态域时才动，开了新 store 零改动现有代码
- **远程内容**：课程 ≥3 门且每门 ≥3 模块有内容 + 更新频率 ≥ 每周 + 有非开发者写内容，三个条件一个都不满足
