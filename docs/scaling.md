# 将来规模化 — 什么时候改、怎么改

以下各项在 v1.0 solo 阶段不需要动。各自有明确触发条件。

---

## 1. 远程可更新内容

**现状：** 课程数据写死在 `src/data/courses/` TS 文件，改错字也要重新 build。

**触发条件（任一）：** 课程 ≥ 3 门且每门 ≥ 3 模块有内容 / 内容更新 ≥ 每周 / 有非开发者参与写内容

**方案：**
1. 课程数据迁出为 JSON，上传 CDN
2. 启动时先读本地缓存，再 fetch CDN 检查新版本
3. 有网 → 下载最新 JSON → 覆盖本地缓存
4. 无网 → 用本地缓存，不阻塞
5. 版本号控制增量更新

**不改什么：** `Card` / `PathNode` / `Course` 类型不变，所有 Screen 不感知数据来源。

---

## 2. 测试

**现状：** 无测试框架。`tsc --noEmit` 只做类型检查。

**触发条件（任一）：** 有第二人改 store / store 超 300 行 / 接后端同步 / 出过"改了 store break 功能"的线上事故

**方案：**
1. `npx expo install jest-expo jest`
2. 先补纯函数用例：`calcLevel`（边界 0/99/100）、`rewardCard`（去重/原子性）、`merge`/`migrate`
3. 纯函数通过后再考虑组件测试
4. 参考 `docs/store-invariants.md` 的不变量写断言

**不改什么：** 不引入 E2E 框架，不追求覆盖率。

---

## 3. 内容格式 — 大段文字抽出

**现状：** 课程正文写在 TS 字符串里，`\n` 换行。

**触发条件（任一）：** 单张概念卡 body 超 500 字 / 一个模块 ≥ 10 张概念卡 / 有非技术人员写内容

**方案 A — Markdown 文件（推荐）：**
1. 模块目录下新建 `content.md`
2. 写 `parseMarkdown(md: string): Card[]` 函数
3. `index.ts` 只保留结构，content 从 md 读取

**方案 B — 远程 CMS（方案 A 的延续）：**
内容迁到 Notion/Google Sheets，build 时或运行时拉取转 JSON。

**不改什么：** `Card` 接口不变，渲染组件不变。

---

## 4. 付费与权限系统

**现状：** 所有课程免费。HomeScreen → CourseScreen 无拦截。

**触发条件：** 准备上线第一门付费课程。

**方案：**

1. `PathNode` 加可选字段：`requiresSubscription?: boolean`（不填 = 免费）
2. 新建 `store/permissionStore.ts`：`entitledNodes: Set<string>` + `isSubscribed` + `checkAccess(nodeId)`
3. 新建 `src/lib/payments.ts` — RevenueCat / IAP 封装
4. `CourseScreen.tsx` +5 行：付费模块显示锁图标
5. `ModuleScreen.tsx` +5 行：无权限弹付费 Modal

**不改什么：** 所有卡片组件、NodeScreen、QuizScreen、useProgressStore、导航路由。

---

## 5. 社交/社区/评论

**触发条件（任一）：** 需要评论/社区/排行榜/用户间互动

**方案 — 全增量：**

```
新建：
  src/store/socialStore.ts
  src/store/notificationStore.ts
  src/screens/CommunityScreen.tsx
  src/screens/CommentsScreen.tsx
  src/api/social.ts

增量改（不改现有）：
  types/index.ts  +Comment/Post 类型
  authStore.ts    替换 no-op（设计如此）
  AppNavigator.tsx +路由 + 可能第四个 Tab
  renderCard.tsx   +评论入口（可选，独立组件插入）
```

**不改什么：** Card/PathNode/Course 数据、useProgressStore、所有 Screen、主题系统。

---

## 6. 视频/音频课程

**触发条件：** 需要嵌入视频讲解或播客模式。

**方案 — 和加 AnimationContent 完全一样的模式：**

1. `types/index.ts` — 加 `VideoContent` / `AudioContent` + Card 联合类型各加一行
2. `components/cards/` — 新建 `VideoCard.tsx` / `AudioCard.tsx`（用 expo-av）
3. `renderCard.tsx` — 加两个 case
4. `src/lib/` — 媒体基础设施（缓存、播放器封装、下载管理）

**不改什么：** renderCard switch 结构、NodeScreen/QuizScreen 卡片遍历、useProgressStore。

---

## 7. 多语言

**触发条件：** 出海 / 非中文用户 / 多语种课程。

**第一层 UI（按钮/标签）：** `react-i18next` + `t('key')`，改所有 Screen 硬编码中文。store/types/navigation 零改动。

**第二层课程内容（推荐方案 B — CDN 先行）：**
```
CDN 每种语言独立 JSON
  cdn.codecard.com/content/zh/cpp.json
  cdn.codecard.com/content/en/cpp.json

加载器根据 locale 拉对应 URL → Card 接口完全不变 → 所有组件零改动
```

**最佳时机：** CDN 远程内容上线后 — 改加载器 URL + 一份翻译，不改接口。

---

## 8. 协作与 Git 工作流

**触发条件：** 有第二人开始提交代码。

```
solo 期：  master ← 直接 commit，可 force push
协作期：  master ← PR squash merge ← feature 分支（可随意 rebase）
```

- 所有改动走 feature 分支，不在 master 直接 commit
- GitHub "Squash and merge" 合并
- 禁止 force push 到 master
- feature 分支可自由 rebase/squash

冲突处理：`git merge master` on feature branch → 解决 → push → PR 自动刷新。

---

## 9. 动画 Registry 类型安全

**现状：** `src/data/animations/index.ts` 所有 Component 通过 `as ComponentType<{ scenario: AnimScenario; step: number }>` 强制转换。Scenario 的实际类型（如 `ScopeCodeScenario`）和 Component 期望的 props 类型之间没有编译期约束。

```ts
// 当前 — 类型擦除，配错不报错
'scope-lifecycle': {
  scenario: scopeLifecycleScenario,          // ScopeCodeScenario
  Component: ScopeCodePlayer as ComponentType<...>,  // 手工保证匹配
},
// 如果把 BranchPlayer 配给 scopeLifecycleScenario，编译不报错，运行时才崩
```

**触发条件（任一）：** 动画类型 ≥ 8 / 有多人同时加动画 / 出过一次配错 scenario/Component 的线上事故

**方案：** 加一个类型安全的 `defineAnimation` 辅助函数，让编译器自动检查 scenario 和 Component 的类型兼容性，消除 `as` 强制转换。

```ts
// src/data/animations/index.ts

// 类型安全的注册辅助
function defineAnimation<S extends AnimScenario>(
  scenario: S,
  Component: React.ComponentType<{ scenario: S; step: number }>,
): AnimationEntry {
  return { scenario, Component };
}

// 使用 — Component 的 scenario 类型必须和传入的 scenario 兼容
export const animationRegistry = {
  'scope-lifecycle': defineAnimation(scopeLifecycleScenario, ScopeCodePlayer),
  'variable-storage':  defineAnimation(variableStorageScenario, MemoryBox),
  'if-else-branch':    defineAnimation(ifElseBranchScenario, BranchPlayer),
  'for-loop':          defineAnimation(forLoopScenario, LoopPlayer),
  'break-continue':    defineAnimation(breakContinueScenario, BreakContinuePlayer),
  'while-vs-dowhile':  defineAnimation(whileDoWhileScenario, WhileDoWhilePlayer),
  // 如果故意配错：defineAnimation(scopeLifecycleScenario, BranchPlayer)
  // → TypeScript 报错！BranchPlayer 需要 BranchScenario，不是 ScopeCodeScenario
};
```

**改动量：** 只改 `src/data/animations/index.ts` 一个文件 — 加 4 行辅助函数 + 改 registry 条目的写法（去掉 `as ComponentType<...>`，包一层 `defineAnimation()`）。

**不改什么：** `AnimationEntry` 接口不变、`getAnimScenario`/`getAnimComponent` 查找函数不变、所有 Scenario 文件不变、所有 Component 文件不变。

**权衡：** 当前 6 个动画类型，手工维护配错概率低（registry 里 scenario 和 Component 同一个 import 块，一眼可见）。solo 开发时改这个收益不大。但加这个辅助函数只需要 4 行代码 + 改写 6 个条目，改动极小，如果哪天顺手也可以提前做掉。
