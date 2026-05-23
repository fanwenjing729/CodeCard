# 文档索引

每个文档一句话说明 + 什么时候需要看它。

## 根目录

| 文件 | 作用 | 什么时候看 |
|------|------|-----------|
| `AGENTS.md` | 项目唯一真相源 — 架构、数据模型、内容创作、扩展方案全在这里 | **任何改动前先搜这里**，80% 的问题不用读源码 |
| `CLAUDE.md` | 指向 `AGENTS.md`，加了文件放置规则和 Expo 版本约束 | 不用看，已委托给 AGENTS.md |
| `方案.md` | 产品完整方案文档（概述、功能列表、数据结构早期设计） | 了解产品愿景和历史决策 |
| `DOCS_INDEX.md` | 本文件 | 找文档时先看这里 |

## docs/ — 专题文档

| 文件 | 作用 | 什么时候看 |
|------|------|-----------|
| `AAAAui-reference.md` | 所有页面/组件的 UI 参数速查（字号、间距、颜色取值、圆角） | 调整 UI 样式时对照参考 |
| `store-invariants.md` | useProgressStore 改动的回归清单 & 核心不变量 | 改 store 逻辑前必读，改完对着清单自检 |
| `architecture-timing-guide.md` | 架构问题分级：每个问题的触发条件、改造方案、改动量 | 考虑"什么时候做某个架构改进"时对照决策 |
| `branch-path-design.md` | 练习卡答对/答错导向不同结尾的分支路径设计 | 实现分支学习路径时参考 |
| `cpp-course-design.md` | C++ 课程内容设计（模块规划、卡片分布） | 给 C++ 课程加内容时参考结构 |
| `content-writing-guide.md` | 课程内容创作指南 — 抽象概念教学原则 + 卡片设计自检清单 | **写新节点前必读** |
| `animations-design.md` | C++ 课程动画设计（全部基于 MemoryBox，scenario 模板） | 给 C++ 课加内存动画时用 |
| `layout-spacing.md` | 各页面间距记录 | 调页面布局/间距时对照 |
| `font-guide.md` | 字体配置指南 | 改字体相关配置时参考 |
| `future-features.md` | 已分析的未来扩展方案记录 | 准备做某个扩展功能时先看有没有现成方案 |
| `auth-interface-plan.md` | 登录接口抽象层设计（no-op → 真实实现替换方案） | 接入真实登录时参考 |
| `supabase-auth-plan.md` | 阿里云 Supabase 登录 + 同步的具体接入方案 | 用 Supabase 做后端时参考 |
| `architecture-refactor-2026-05-21.md` | 2026-05-21 架构优化记录 | 了解近期架构变动历史 |

## 阅读顺序

1. **新接手项目** → `方案.md` → `AGENTS.md` → `docs/store-invariants.md`
2. **日常开发** → 先搜 `AGENTS.md`，命中了就按指令做，不读源码
3. **写新课程内容** → `docs/content-writing-guide.md` → `docs/cpp-course-design.md`
4. **改 UI** → `AGENTS.md` + `docs/AAAAui-reference.md`
5. **改 store** → `docs/store-invariants.md`
6. **规划长期改进** → `docs/architecture-timing-guide.md` → `docs/future-features.md`
