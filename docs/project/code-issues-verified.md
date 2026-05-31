# 代码问题清单（已验证）

> **验证日期：2026-05-30**
> 仅收录经源码核实的现存问题。已修复项（C-04 CORS、C-06 密码长度）不在此列。

**优先级：** P0 数据/同步正确性 · P1 安全与上架 · P2 功能与体验 · P3 架构与测试债

---

## P0 — 数据与同步

### C-01 多设备合并：`completedCards` 并集但 `xp` 取 max

| 项 | 内容 |
|----|------|
| 位置 | `src/store/syncEngine.ts:63-65` |
| 现象 | 设备 A、B 各完成不同卡片时，合并后「已完成卡」数量可能多于 `xp` 能解释的数量，等级/进度条偏低 |
| 原因 | `completedCards` 用对象展开并集，`xp` 用 `Math.max(local, remote)`，未按完成卡重算 XP |
| 建议方向 | 合并后按 `completedCards` 重算课程 XP，或合并时 union 卡 ID 并累加/取 max 的规则写进 `store-invariants.md` |

### C-02 服务端进度写入无版本冲突处理

| 项 | 内容 |
|----|------|
| 位置 | `backend/.../progress/ProgressService.java:28-38`（`upsertProgress`） |
| 现象 | 后登录设备的 `PUT` 可覆盖先离线积累的全量快照 |
| 原因 | 不比较请求 `version` 与库中 `version`，直接 `setData` + `save` |
| 建议方向 | 见 `docs/backend/backend-improvements.md` 第三章；或客户端改用 `POST /sync` 并统一服务端策略 |

### C-03 登录合并与自动上传竞态

| 项 | 内容 |
|----|------|
| 位置 | `authStore.ts:87`（`syncOnLogin` 不 await）+ `hooks/useAutoSync.ts:15`（3s 定时上传） |
| 现象 | 登录后立刻学习，可能在 `syncOnLogin` 合并完成前上传旧本地快照，或与合并后的 `PUT` 交错 |
| 建议方向 | 合并期间暂停 auto-sync，或合并完成后再启用上传 |

---

## P1 — 安全与上架

### C-05 登录 / 注册 / OTP 限流未接入

| 项 | 内容 |
|----|------|
| 位置 | `RateLimitProperties.java` 已定义，`RateLimitFilter.java` 不存在 |
| 风险 | 暴力破解、刷 OTP |
| 建议方向 | 实现 `RateLimitFilter`，设计见 `docs/backend/backend-rate-limit-design.md` |

---

## P2 — 功能与体验

### C-07 手机号 OTP：UI 承诺与后端不一致

| 项 | 内容 |
|----|------|
| 位置 | `OtpService.java:45`（`sendCode` 非邮箱仅 `log.info`）、`LoginScreen` / `RegisterScreen` 文案 |
| 现象 | 界面写「短信验证码」，用户收不到短信；验证码在服务端日志 |
| 说明 | 非崩溃型 bug，属功能未完成；接短信平台前应在 UI 标注或隐藏入口 |

### C-08 `POST /api/v1/progress/sync` 前端未使用

| 项 | 内容 |
|----|------|
| 位置 | `ProgressController.java:35` vs 客户端仅 `GET` + `PUT` |
| 说明 | 服务端「返回远程、客户端合并」与 `syncProgress` 语义重复；前端 grep `/progress/sync` 零匹配 |

### C-09 暗色模式需验证实际渲染效果

| 项 | 内容 |
|----|------|
| 位置 | `src/theme/colors.ts`（DarkColors 已完整定义）、`ThemeContext.tsx`（toggle + persist）、所有 12 个 Screen（均已接入 `useColors()`） |
| 说明 | 基础设施已就绪，SettingsScreen 有开关。需在各 Screen 实际验证暗色渲染是否正确 |

---

## P3 — 架构与测试债

### C-10 `authStore` 与 `syncEngine` 硬耦合

| 项 | 内容 |
|----|------|
| 位置 | `authStore.ts:4` 直接 `import { syncOnLogin } from './syncEngine'`，共 5 处调用 |
| 说明 | 方案见 `docs/store-contract-plan.md`（若存在）或事件总线 |

### C-11 `api.ts` token 模块级单例

| 项 | 内容 |
|----|------|
| 位置 | `api.ts:31-32` — `let accessToken` / `let refreshToken` 顶层变量 |
| 说明 | 多实例/测试隔离差 |

### C-12 `syncEngine` 测试覆盖不足

| 项 | 内容 |
|----|------|
| 位置 | `src/store/syncEngine.test.ts` |
| 现象 | 仅 2 个测试：断言 `manualSync` 返回 Date、断言 `uploadProgress`/`syncOnLogin` 不抛错。未覆盖 C-01 合并场景 |
| 建议方向 | 补充 merge 用例（双设备不同卡、重置后登录等） |

### C-13 Screen 层无集成测试

| 项 | 内容 |
|----|------|
| 说明 | 仅 `quizReducer.test.ts` + `useNodeScreen.test.ts` 两个单元测试，12 个 Screen 依赖人工回归 |

### C-14 课程全量静态 import

| 项 | 内容 |
|----|------|
| 位置 | `src/data/courses/index.ts:4-6` |
| 风险 | 任一节点文件语法错误导致整表 `courses` 导出失败；缓解：`npm test` 中的 `validate.test.ts` |

### C-16 Vitest 与 Node 版本

| 项 | 内容 |
|----|------|
| 现象 | 过旧 Node 上 `vitest`/`rolldown` 可能启动失败（`node:util` `styleText`） |
| 建议 | 使用 Node 20+ / 22 LTS 跑 `npm test` |

---

## 非 bug（产品决定）

| 编号 | 说明 |
|------|------|
| — | `registerByEmail` 有 store 方法但 RegisterScreen 未暴露一步密码注册（OTP 优先） |

---

## 修复优先级建议

1. **多设备上线前：** C-01、C-02、C-03
2. **应用商店前：** C-05、C-07（至少改文案或隐藏手机入口）
3. **质量迭代：** C-08～C-14、C-16
