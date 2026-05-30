# auth-sync.md 重写方案

## 状态

⏳ 以后做

## 问题

`docs/auth-sync.md` 通篇描述 Supabase 方案，但实际代码用的是 Spring Boot JWT：

| 文档写 | 实际代码 |
|--------|----------|
| Supabase JS SDK | `@/lib/api.ts` + JWT Bearer token |
| Supabase Auth | Spring Boot `POST /auth/login` |
| Supabase Row Level Security | Spring Security `SecurityFilterChain` |
| `supabase.from('user_progress')` | `POST /api/v1/progress/sync` |

新人看文档会误以为需要配 Supabase 环境，浪费半天时间。

## 做什么

整篇重写，只保留与代码一致的 Spring Boot 方案。Supabase 方案移到文末归档（标注"方案 A，未采用"）。

## 文档结构

```
# 认证与同步

## 认证流程
  - 邮箱 OTP 注册（两步：发验证码 → 设密码）
  - 邮箱密码登录
  - 手机号 OTP（当前降级为邮箱引导）
  - JWT access token 15min / refresh token 30d
  - token 自动刷新（api.ts 拦截 401）

## 进度同步
  - 本地优先（Zustand + AsyncStorage）
  - 自动上传（3s 防抖）
  - 登录合并（syncOnLogin）
  - 同步接口：POST /api/v1/progress/sync

## 前端关键文件
  - src/store/authStore.ts — 登录/注册/登出
  - src/store/syncEngine.ts — 进度上传/合并
  - src/lib/api.ts — HTTP + JWT 管理

## 后端关键文件
  - AuthController + AuthService
  - ProgressController + ProgressService
  - SecurityConfig + JwtService

## 附录：方案 A（Supabase，未采用）
  - 原 doc 内容精简保留
```

## 怎么做

1. 读 3 个前端文件：`authStore.ts`、`syncEngine.ts`、`api.ts`
2. 读 3 个后端文件：`AuthController`、`ProgressController`、`SecurityConfig`
3. 按上述结构写新 doc
4. 旧内容缩简移到附录

## 工作量

~2 小时。
