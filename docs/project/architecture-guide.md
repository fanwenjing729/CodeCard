# 架构改进指南

> 当前状态（2026-05-30）：`useProgressStore.ts` 289 行，`tsc --noEmit` 零错误，后端 `BUILD SUCCESS`，测试 176 例全过。

---

## 架构能力分级：当前能撑到哪

### 当前阶段：solo 开发 + 本地运行 ✅

| 能力 | 状态 | 说明 |
|------|:--:|------|
| 卡片学习（概念/代码/动画/练习） | ✅ | 完整，扩展到新课程改数据即可 |
| 本地进度存储 | ✅ | Zustand + AsyncStorage |
| 后端认证 | ✅ | 注册/登录/OTP/JWT/refresh token |
| 进度云同步 | ✅ | JSONB upsert，单设备够用 |
| 数据库 | ✅ | PostgreSQL 本地 |
| CI/CD | ✅ | GitHub Actions 自动跑测试 |
| 测试覆盖 | ✅ | 前端 163 例 + 后端 13 例 |

**能撑到：** 自己用或 50 人内测。

### 下一步：小规模内测（50→500 人）

| 补什么 | 原因 | 位置 |
|--------|------|------|
| 限流 Filter | 防暴力破解登录 | `../backend/backend-rate-limit-design.md` |
| 关闭 `open-in-view` | 防连接池耗尽 | `../backend/backend-improvements.md` §二 |
| Swagger 文档 | 前后端联调 | `../backend/backend-improvements.md` §一 |
| 崩溃上报（Sentry） | 收集真机 crash | 本文档 §三 |
| 云服务器部署 | 后端不能永远跑在本地 | `../backend/nginx-https-plan.md` |

### 中期：多设备 + 多课程（500→5000 人）

| 补什么 | 触发条件 |
|--------|----------|
| 进度同步版本冲突 | 多设备交替学习 |
| CDN 远程内容 | 课程 ≥ 3 门 或 有非开发者改内容 |
| Store 拆分 | `useProgressStore` 超 300 行 |
| Screen 层测试 | 多人改 UI 需要安全网 |

### 长期：规模化（5000+ 人）

| 补什么 | 位置 |
|--------|------|
| 付费/权限系统 | `../backend/scaling.md` |
| 排行榜/社交 | `../backend/scaling.md` §5 |
| 缓存层（Redis） | 数据库读压力 |
| Nginx + HTTPS | `../backend/nginx-https-plan.md` |

> **核心原则：** 数据层问题只动数据层，UI 不感知。

---

## 一、纯函数测试

### 触发条件（任一满足即动手）

- `useProgressStore.ts` 超过 **300 行** ← 当前 289，差 11 行
- 有第二个人开始改 store 逻辑
- 接后端同步（`../backend/auth-sync.md` 的方案落地）
- 出过一次"改了 store break 功能"的事故

### 实施步骤

**Step 1 — 安装 Jest：**
```bash
npx expo install jest-expo jest
```
`package.json` 加 `"scripts": { "test": "jest" }`，加 `jest.config.js`：`module.exports = { preset: 'jest-expo' };`

**Step 2 — 抽取纯函数到 `src/lib/progressActions.ts`：**
从 `useProgressStore.ts` 搬走 `getOrCreateCourse`、`arrayToRecord`、`migrate`、`pickData`，store 文件 import 回这些函数。Screen 引用不变。

**Step 3 — 写测试 `src/lib/__tests__/progressActions.test.ts`：**
- `calcLevel` 边界值（0/49/50/150）
- `getOrCreateCourse` 新课程/已有课程
- `migrate` v1→v3
- `xpForLevelStart(3) + xpForNextLevel(3) = xpForLevelStart(4)`

参考 `../frontend/store-invariants.md` 的不变量清单写断言。

**改动量：** ~50 行搬运 + ~40 行测试。Store 289 → ~240 行。
**不改：** Screen 组件、Zustand action、UI。

---

## 二、AsyncStorage 原子写入保护

### 触发条件

**暂不需要。** Android 底层 SQLite 的 `setItem` 自带事务保护。以下任一发生时再动：
- 用户反馈数据丢失
- 接入后端同步后写入频率大幅提高
- 上线前想做保守防护

### 实施步骤

只改 `useProgressStore.ts`，~10 行。

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

`hydrate()` 加 fallback：先读正式 key，为空则读临时 key。

**原理：** 写入中途 crash → 正式 key 还是旧数据，hydrate 优先读正式 key。多一层保护。

---

## 三、崩溃上报 + 轻量埋点

### 触发条件：准备上线前（有真实用户之前）

### 崩溃上报（~20 行）

```bash
npx expo install sentry-expo
```

```ts
import * as Sentry from 'sentry-expo';
Sentry.init({ dsn: 'YOUR_DSN', enableInExpoDevelopment: false, debug: false });
```

Sentry 自动捕获未处理的 JS 异常和 native 崩溃。手动上报：`Sentry.Native.captureException(error)`

### 轻量埋点（~30 行）

`src/lib/analytics.ts`：

```ts
type EventName = 'card_complete' | 'quiz_score' | 'node_complete' | 'course_start';
export function track(event: EventName, props?: Record<string, string | number>) {
  if (__DEV__) { console.log('[Analytics]', event, props); return; }
  // 上线后替换为真实上报
}
```

关键 action 加一行 `track(...)`，不改 UI，不改业务逻辑。

---

## 四、单体 Store 膨胀

**当前状态：** `useProgressStore.ts` 管 XP、completedCards、quizScores、nodePositions、wrongCards。

**触发条件：** 需要加新状态域（学习天数统计、每日目标、勋章、学习提醒）时

**怎么改：** 新 feature 开新 store，Zustand 天然支持多 store。Screen 里各取所需。

**改动量：** 0 行改现有代码，只加新文件

---

## 五、内容写死在 TS 文件

**触发条件（满足任一即启动）：**
- 课程 ≥ 3 门，且每门 ≥ 3 个模块有实际内容
- 内容更新频率 ≥ 一周一次
- 有第二个人参与写内容（非开发者）

**怎么改：** AGENTS.md 已写完整方案——TS 迁成 CDN JSON，`Course[]` 类型签名不变，所有 Screen 零改动。

---

## 六、多设备同步冲突

**触发条件：** 同一用户在多台设备上交替学习

**怎么改：** `CourseProgress` 加 `lastModified: number`，`syncEngine.ts` 的 merge 改为谁时间戳新用谁的。~30 行，不改 Screen。

---

## 七、全量 AsyncStorage 加载变慢

**触发条件：** 用户数据量大到 `hydrate()` 有可感知延迟

**怎么改：** 拆成按课程分 key，启动时只加载当前活跃课程，其余懒加载。只改 `hydrate()` 实现。

---

## 优先级

上线前：崩溃上报 > 原子写入 > 埋点 > 测试 > Store 拆分 > 远程内容

## 不需要动的

以下有明确触发条件但当前不满足，不要提前做：
- **Store 拆分**：需要加新状态域时才动
- **远程内容**：课程 ≥3 门且每门 ≥3 模块有内容 + 更新频率 ≥ 每周 + 有非开发者写内容，三个条件都不满足
