# CodeCard — 卡片式编程学习 App

基于 React Native + Expo 的离线优先编程学习 App，以卡片为单位渐进式掌握 C++ 核心概念。

**核心功能：** 概念讲解 · 代码展示 · 动画演示 · 随堂练习 · 测验模式 · 等级系统 · 云端同步

## 快速开始

```bash
git clone https://github.com/fanwenjing729/CodeCard.git
cd CodeCard
npm install
```

复制环境变量模板，填入 [Supabase](https://supabase.com) 项目的 URL 和 anon key：

```bash
cp .env.example .env
# 编辑 .env，替换真实值
```

启动开发服务器：

```bash
npx expo start
```

用 Expo Go 扫码，或连接模拟器/真机运行。

## 技术栈

| 层 | 技术 |
|-----|------|
| 框架 | React Native 0.83 + Expo SDK 55 |
| 语言 | TypeScript 5.9（strict mode） |
| 导航 | @react-navigation/native 7（Bottom Tabs + Native Stack） |
| 状态 | Zustand 5 + 手动 AsyncStorage 持久化 |
| 动画 | react-native-reanimated 4 + react-native-svg |
| 认证 | Supabase Auth（邮箱密码/邮箱OTP/手机OTP） |
| 数据库 | Supabase PostgreSQL + RLS |
| 测试 | Vitest 4.1（14 文件 / 145 用例） |

## 项目结构

```
src/
├── theme/                     ← 主题 token（颜色、字体、间距）
├── types/                     ← TypeScript 接口定义
├── lib/                       ← 纯函数（等级公式、进度计算）
├── store/                     ← Zustand store（进度、认证、同步）
├── navigation/                ← React Navigation 路由配置
├── screens/                   ← 页面组件
│   ├── HomeScreen.tsx          ← 课程列表
│   ├── CourseScreen.tsx        ← 模块列表
│   ├── ModuleScreen.tsx        ← 节点列表
│   ├── NodeScreen.tsx          ← 卡片学习（滑动 + 动画）
│   ├── QuizScreen.tsx          ← 测验模式
│   ├── ProgressScreen.tsx      ← 等级环形图 + 进度条
│   ├── SettingsScreen.tsx      ← 设置（账户入口、数据管理、深色模式）
│   ├── AccountScreen.tsx       ← 账户管理（头像、用户名、退出）
│   ├── LoginScreen.tsx         ← 登录（密码/验证码/手机号/找回密码）
│   ├── RegisterScreen.tsx      ← 注册（邮箱/手机号 OTP）
│   ├── WrongCardsScreen.tsx     ← 错题复习
│   └── DataScreen.tsx          ← 数据管理
├── components/
│   ├── cards/                  ← 卡片组件（概念/代码/练习/动画）
│   ├── animations/             ← 动画播放器（内存/作用域/循环/分支）
│   └── shared/                 ← 通用组件（ErrorBoundary、ScreenHeader）
├── hooks/                      ← 自定义 hook（usePhoneAuth、useAutoSync）
└── data/courses/               ← 课程内容（纯数据，零代码扩展）
    └── cpp/                    ← C++ 课程 · 7 个模块
```

## 课程扩展

添加新课程或新卡片**不需要修改任何组件代码**，只写数据文件。详见 [AGENTS.md](./AGENTS.md)。

## 文档

| 文档 | 内容 |
|------|------|
| [AGENTS.md](./AGENTS.md) | AI 开发指南（架构、数据模型、代码规范） |
| [auth-sync.md](G:\CodeCardBackend\docs\auth-sync.md) | 认证同步实现进度、测试覆盖、配置步骤 |
| [backend-architecture.md](G:\CodeCardBackend\docs\backend-architecture.md) | 后端完整文档（快速开始 + 架构设计） |

## 许可证

MIT
