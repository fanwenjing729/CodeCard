# 架构问题分级参考

每个问题标注触发条件、改造方案、改动量、是否动 UI。核心原则：**数据层问题只动数据层，UI 不感知**。当前架构的"接口-实现分离"底子是这张表的底层保障。

---

## 短期（v1.0 solo 阶段）

### 1. 单体 Store 膨胀

**当前状态：** `useProgressStore.ts` 管 XP、completedCards、quizScores、nodePositions、wrongCards。再加 3-4 个 feature 会超 400 行。

**触发条件：** 需要加新状态域（学习天数统计、每日目标、勋章、学习提醒）时

**怎么改：** 新 feature 开新 store，不往 `useProgressStore` 里塞：
```
store/
├── useProgressStore.ts     ← 学习进度（不变）
├── useStatsStore.ts        ← 统计（新增）
├── useStreakStore.ts       ← 连续打卡（新增）
```
Zustand 天然支持多 store，Screen 里各取所需。

**改动量：** 0 行改现有代码，只加新文件
**是否动 UI：** 否，Screen 加一行 import 新 store 即可

---

### 2. 手动 AsyncStorage 持久化

**当前状态：** `flush()` 直接 `JSON.stringify` → `setItem`，无原子写入保护。写入中途 crash 理论上有极小概率坏数据。

**触发条件：** 暂不需要动。AsyncStorage 在 Android 底层是 SQLite，`setItem` 本身有事务保护，实际坏数据概率极低。

**如果要做（上线前可选）：**
```ts
// flush() 改为先写临时 key
await AsyncStorage.setItem('codecard-progress-tmp', json);
await AsyncStorage.setItem('codecard-progress', json);

// hydrate() 加 fallback
let raw = await AsyncStorage.getItem('codecard-progress');
if (!raw) raw = await AsyncStorage.getItem('codecard-progress-tmp');
```

**改动量：** ~10 行，只改 `useProgressStore.ts`
**是否动 UI：** 否

---

### 3. 内容写死在 TS 文件

**当前状态：** 课程数据在 `src/data/courses/` 的 TS 文件里，改一个错别字也要重新 build 发版。

**触发条件（文档已标注，满足任一即启动）：**
- 课程 ≥ 3 门，且每门 ≥ 3 个模块有实际内容
- 内容更新频率 ≥ 一周一次
- 有第二个人参与写内容（非开发者）

**怎么改：** AGENTS.md "远程可更新内容"章节已写了完整方案。本质是把 TS 文件迁成 CDN JSON，加载器返回的 `Course[]` 类型签名不变，所有 Screen 零改动。

**改动量：** 改数据加载器，不改组件
**是否动 UI：** 否

---

### 4. 无测试

**当前状态：** 核心逻辑（calcLevel、completeCard、rewardCard）靠手动验证。

**触发条件（文档已标注，满足任一即启动）：**
- 有第二个人开始改 store 逻辑
- `useProgressStore.ts` 超过 300 行
- 接后端同步后合并逻辑变复杂
- 出现过一次"改了 store 但没发现 break 了 XX 功能"的事故

**怎么改：**
1. 装 Jest（`npx expo install jest-expo jest`）
2. 把纯函数从 store 里抽出来：`progressActions.ts`（calcLevel、completeCard、rewardCard）
3. 给纯函数补用例，参考 `docs/store-invariants.md` 的不变量清单
4. 纯函数跑通后再考虑组件测试

**改动量：** ~50 行搬运 + 新增测试文件
**是否动 UI：** 否，Screen 引用 `useProgressStore` 不变

---

### 5. 无崩溃上报/埋点

**当前状态：** 上线后不知道用户在哪个机型闪退、答题正确率、弃坑点。

**触发条件：** 准备上线（有真实用户之前）

**怎么改：**
- 崩溃上报：接入 `expo-error-reporter` 或 Sentry（~20 行）
- 轻量埋点：Firebase Analytics 或自建，只埋关键节点（答题正确/错误、节点完成、课程开始）(~30 行)
- 不改任何业务逻辑

**改动量：** ~50 行新代码
**是否动 UI：** 否

**上线前优先级：** 崩溃上报 > Store 拆分 = 原子写入 > 测试 > 远程内容

---

## 中期（有真实用户后）

### 6. 多设备同步冲突

**当前状态：** 合并策略过于简单。

```
当前逻辑：
completedCards = local ∪ remote（并集）
xp = max(local.xp, remote.xp)（取大值）
nodePositions = local 覆盖 remote（本地优先）
```

**问题场景：** 手机学到第 5 张卡退出，平板学到第 10 张卡退出。手机先同步 → 平板再同步时，`nodePositions` 用平板本地覆盖，手机第 5 张卡的位置丢失（虽然 `completedCards` 用并集不会丢）。

**触发条件：** 同一用户在多台设备上交替学习

**怎么改：**
1. `CourseProgress` 加 `lastModified: number`（每张卡完成时记时间戳）
2. `syncEngine.ts` 的 `merge` 函数改为：`nodePositions` 谁的时间戳新用谁的
3. 不改 Screen，不改数据契约结构

**改动量：** ~30 行
**是否动 UI：** 否

---

### 7. 课程内容更新瓶颈

同短期第 3 项。触发后按 AGENTS.md 方案执行。

---

### 8. 单体 Store 不可测试

**当前状态：** Store 逻辑和 Zustand 耦合，单测需要 mock。

**触发条件：** 同短期第 4 项

**怎么改：**
```
store/
├── useProgressStore.ts     ← 对外暴露（Screen 引用不变）
├── progressActions.ts      ← 纯函数：calcLevel, completeCard, rewardCard
├── progressPersist.ts      ← hydrate/flush
└── __tests__/
    └── progressActions.test.ts
```
内部拆到独立模块方便单测，Screen 引用 `useProgressStore` 完全不变。

**改动量：** ~50 行搬运 + 新增测试文件
**是否动 UI：** 否

---

## 长期（规模化）

### 9. 无依赖注入 / 网络层抽象

**当前状态：** `authStore` 和 `syncEngine` 已经是"接口-实现分离"的雏形——no-op 实现占位，Screen 只调接口不关心背后是谁。

**触发条件：** 换 BaaS、加缓存层、加离线队列

**怎么改：**
1. `syncEngine.ts` 把网络调用塞进去（函数签名已预留）
2. 换 BaaS → 只改这一层实现
3. 离线队列 → `offlineQueue.ts`（新文件），和现有 store 并行
4. Screen 零改动

**改动量：** 新增文件 + 替换 no-op 实现
**是否动 UI：** 否

---

### 10. 全量 AsyncStorage 加载变慢

**当前状态：** 单 key `"codecard-progress"` 存全部数据，`hydrate()` 一次读完。

**触发条件：** 用户数据量大到 `hydrate()` 有可感知延迟

**怎么改：**
1. 拆成按课程分 key：`"codecard-cpp"`、`"codecard-python"` 等
2. 启动时只加载当前活跃课程，其余懒加载
3. Store 的 action 接口不变，只改 `hydrate()` 实现

**改动量：** 改 `hydrate()` 实现
**是否动 UI：** 否
