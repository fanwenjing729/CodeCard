# 文档索引

每个文档一句话说明 + 什么时候需要看它。

## 根目录

| 文件 | 作用 | 什么时候看 |
|------|------|-----------|
| `AGENTS.md` | 项目唯一真相源 — 架构、数据模型、内容创作、扩展方案全在这里 | **任何改动前先搜这里**，80% 的问题不用读源码 |
| `CLAUDE.md` | 指向 `AGENTS.md`，加了文件放置规则和 Expo 版本约束 | 不用看，已委托给 AGENTS.md |
| `方案.md` | 产品完整方案文档（概述、功能列表、数据结构早期设计） | 了解产品愿景和历史决策 |
| `DOCS_INDEX.md` | 本文件 | 找文档时先看这里 |

---

## docs/frontend/ — 前端

| 文件 | 作用 | 什么时候看 |
|------|------|-----------|
| `AAAAui-reference.md` | UI 参考（含字体配置 + 页面间距附录） | 调整 UI 样式时对照参考 |
| `animation-system.md` | 动画系统完整文档（含设计原则 + C++ 课程动画清单） | **开发动画前必读** |
| `card-formatting-guide.md` | 卡片内容格式规范 | 写卡片内容时参考 |
| `content-writing-guide.md` | 课程内容创作指南 — 抽象概念教学原则 + 卡片设计自检清单 | **写新节点前必读** |
| `cpp-course-design.md` | C++ 课程内容设计（模块规划、卡片分布） | 给 C++ 课程加内容时参考结构 |
| `store-invariants.md` | useProgressStore 改动的回归清单 & 核心不变量 | 改 store 逻辑前必读，改完对着清单自检 |
| `reward-system.md` | 奖励/反馈系统设计 | 修改奖励机制时参考 |
| `branch-path-design.md` | 练习卡答对/答错导向不同结尾的分支路径设计 | 实现分支学习路径时参考 |

---

## docs/backend/ — 后端

| 文件 | 作用 | 什么时候看 |
|------|------|-----------|
| `backend-architecture.md` | 后端完整文档（快速开始 + 架构设计 + API 参考） | **后端相关问题第一入口** |
| `backend-improvements.md` | 后端短期改进方案（Swagger / open-in-view / 版本冲突） | 准备改进后端时参考 |
| `backend-rate-limit-design.md` | Bucket4j 限流设计 | 实现限流时参考 |
| `database-101.md` | 数据库操作入门（启动/连接/查看数据） | 日常操作数据库 |
| `auth-sync.md` | 认证同步（含实现进度、测试覆盖、接口抽象附录） | 认证相关第一入口 |
| `ci-cd.md` | CI/CD 配置与流水线 | 配置自动化部署时参考 |
| `nginx-https-plan.md` | Nginx + HTTPS + 环境变量分层设计 | 部署到生产环境前参考 |
| `sms-defer.md` | SMS 短信推迟决策（邮件兜底、优雅降级） | 需要理解短信功能为什么暂缓时看 |
| `backend-test-plan.md` | 后端测试方案（分层/优先级/工作量） | 准备给后端加测试时看 |
| `scaling.md` | 扩展架构（付费/权限/排行榜/缓存） | 规划长期功能时参考 |

---

## docs/project/ — 项目

| 文件 | 作用 | 什么时候看 |
|------|------|-----------|
| `ISSUES.md` | 已知问题与修复方案追踪 | 了解当前有哪些 bug / 待做事项 |
| `3-year-plan.md` | 三年规划路线图 | 了解长期方向和里程碑 |
| `architecture-guide.md` | 架构改进完整指南（问题分级 + 触发条件 + 实施步骤） | 考虑做架构改进时参考 |
| `course-loading-fix.md` | 课程导入链断裂风险与修复方案 | 满足触发条件时执行 |
| `swagger-guide.md` | Swagger 页面使用指南（怎么看接口、怎么在线调试） | 第一次用 Swagger 时看 |
| `future-features.md` | 已分析的未来扩展方案记录 | 准备做某个扩展功能时先看有没有现成方案 |
| `testing.md` | 测试策略与覆盖 | 写测试时参考 |
| `copyright-guide.md` | 软著申请指南 | 准备申请软著时看 |
| `copyright/` | 软著相关子文档 | — |

---

## 阅读顺序

1. **新接手项目** → `方案.md` → `AGENTS.md` → `docs/frontend/store-invariants.md`
2. **日常开发** → 先搜 `AGENTS.md`，命中了就按指令做，不读源码
3. **写新课程内容** → `docs/frontend/content-writing-guide.md` → `docs/frontend/cpp-course-design.md`
4. **改 UI** → `AGENTS.md` + `docs/frontend/AAAAui-reference.md`
5. **改 store** → `docs/frontend/store-invariants.md`
6. **跑后端** → `docs/backend/backend-architecture.md` → `docs/backend/database-101.md` → `docs/project/swagger-guide.md`
7. **规划长期改进** → `docs/project/architecture-guide.md` → `docs/project/future-features.md`
