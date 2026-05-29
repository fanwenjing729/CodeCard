# CodeCard 后端入门指南

> 写给没学过后端的人  
> 日期：2026-05-29

---

## 一、后端是干嘛的

想象一个餐厅：

```
你（App）                             后厨（后端）
   │                                     │
   │   "我要注册，邮箱a@b.com，密码12345678"  │
   │─────────────────────────────────────>│  AuthController 接单
   │                                      │  → AuthService 处理
   │                                      │  → 数据存到数据库
   │          "注册成功，这是你的令牌"          │
   │<─────────────────────────────────────│
```

后端就是**藏在服务器里的一群厨子**，你点什么菜（请求），它做什么菜（处理），做好了端出来（返回数据）。

---

## 二、请求是怎么走的

以注册请求为例：

### 第 1 步：App 发出请求

```typescript
// src/lib/api.ts  — 前端 HTTP 工具

apiPost('/auth/register', {
  email: 'abc@test.com',
  password: '12345678'
})
```

这行代码做的事：往 `http://10.0.2.2:8080/api/v1/auth/register` 发一个 POST 请求，带着邮箱和密码。

### 第 2 步：Controller 接单

```java
// AuthController.java — 前台接待

@PostMapping("/register")         // 拦截 POST /api/v1/auth/register
public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
    return ResponseEntity.ok(authService.register(req));  // 转给后厨
}
```

Controller 就像**餐厅前台**。它只负责：
- 听铃声（收 HTTP 请求）
- 看一眼小票有没有问题（`@Valid` 检查邮箱格式、密码长度）
- 转给后厨（`authService`）
- 把做好的菜端回去（`ResponseEntity.ok(...)`）

### 第 3 步：Service 干活

```java
// AuthService.java — 真正的后厨

@Transactional
public AuthResponse register(RegisterRequest req) {
    // 1. 检查邮箱有没有被注册过
    if (userRepo.existsByEmail(req.getEmail())) {
        throw new AuthException("email already registered");
    }

    // 2. 创建一个新用户
    User user = new User();
    user.setEmail(req.getEmail());
    user.setPasswordHash(passwordEncoder.encode(req.getPassword()));  // 密码加密存

    // 3. 保存到数据库
    userRepo.save(user);

    // 4. 签发 JWT 令牌（相当于 "出入证"）
    return buildAuthResponse(user, true);
}
```

Service 就是**后厨**，所有业务逻辑在这里。它做的事：
1. 校验数据（邮箱没被占用？）
2. 处理数据（密码不能明文存，要用 BCrypt 加密）
3. 操作数据库（`userRepo.save`）
4. 生成 JWT 令牌（一个加密的字符串，App 用它证明"我是谁"）

### 第 4 步：Repository 存数据

```java
// UserRepository.java — 数据库操作接口

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);   // 按邮箱查用户
    boolean existsByEmail(String email);        // 邮箱是否已存在
}
```

Repository 就是**仓库管理员**，负责和数据库打交道。你只要写方法名，Spring 会自动生成对应的 SQL 查询。

**一句话：** Controller 接单 → Service 干活 → Repository 存取数据

---

## 三、JWT 令牌是什么

注册/登录成功后，后端返回这样一个东西：

```json
{
  "accessToken": "eyJhbGciOi...很长的加密字符串...",
  "refreshToken": "eyJhbGciOi...另一个加密字符串..."
}
```

你可以把它理解成**酒店的房卡**：

| 概念 | 类比 |
|------|------|
| **accessToken** | 房卡，开门用，15 分钟过期 |
| **refreshToken** | 续卡凭证，房卡过期了凭它换新的，30 天过期 |
| **JWT** | 房卡的技术名称，里面加密存着你的用户 ID |

App 拿到 accessToken 后，每次请求都带着它：

```typescript
headers['Authorization'] = `Bearer ${accessToken}`
```

后端看到这个头，就知道"哦，是张三，让他通过"。

**Token 自动刷新机制**（`api.ts` 第 113-125 行）：
- App 发请求 → 后端返回 401（房卡过期）
- App 自动拿 refreshToken 去换一张新房卡
- 换成功后重试原请求
- 用户完全无感知

---

## 四、整个项目的文件地图

```
backend/
├── CodeCardApplication.java       ← 启动入口（main 函数）
│
├── config/                         ← 配置层
│   ├── SecurityConfig.java         ← "门禁系统"：哪些路给人过，哪些拦着
│   ├── JwtService.java             ← "房卡机"：生成和验证 JWT 令牌
│   ├── JwtAuthFilter.java          ← "保安"：每个请求拦下来检查房卡
│   ├── CorsConfig.java             ← "出入许可"：哪些域名可以调 API
│   ├── TraceIdFilter.java          ← "追踪号"：每个请求贴个标签方便查日志
│   ├── GlobalExceptionHandler.java ← "应急处理"：出错了统一返回 JSON
│   └── CleanupScheduler.java       ← "清洁工"：每天凌晨清理过期数据
│
├── auth/                           ← 认证模块（注册/登录/验证码）
│   ├── AuthController.java         ← 前台：接注册、登录、验证码的请求
│   ├── AuthService.java            ← 后厨：处理注册、登录、密码加密逻辑
│   ├── OtpService.java             ← 短信/邮箱验证码：发码、验码
│   ├── AuthException.java          ← 自定义错误（比如 "密码错误"）
│   ├── RefreshToken.java           ← 数据库表：存储续卡凭证
│   ├── OtpCode.java                ← 数据库表：存储验证码
│   ├── OtpCodeRepository.java      ← 验证码的数据库操作
│   ├── RefreshTokenRepository.java ← 续卡凭证的数据库操作
│   └── dto/                        ← "小票格式"：请求和响应的数据结构
│       ├── RegisterRequest.java    ← 注册入参：{ email, password }
│       ├── LoginRequest.java       ← 登录入参：{ email, password }
│       ├── AuthResponse.java       ← 返回结果：{ accessToken, refreshToken, user }
│       ├── OtpSendRequest.java     ← 发送验证码入参
│       ├── OtpVerifyRequest.java   ← 验证验证码入参
│       ├── SetPasswordRequest.java ← 设置密码入参
│       ├── UpdateProfileRequest.java ← 更新个人资料入参
│       └── RefreshRequest.java     ← 刷新 token 入参
│
├── user/                           ← 用户模块
│   ├── User.java                   ← 用户档案表：id、邮箱、手机号、密码哈希等
│   └── UserRepository.java         ← 用户的数据库操作
│
├── progress/                       ← 学习进度模块
│   ├── ProgressController.java     ← 前台：进度读写接口
│   ├── ProgressService.java        ← 后厨：进度的增删改查、多端同步
│   ├── UserProgress.java           ← 进度档案：存 JSON 格式的课程进度
│   ├── UserProgressRepository.java ← 进度的数据库操作
│   └── dto/
│       ├── ProgressSyncRequest.java ← 同步进度入参
│       └── ProgressSyncResponse.java ← 同步进度返回
│
├── resources/
│   └── application.yml             ← "设置文件"：数据库地址、JWT 密钥、CORS 等
│
└── test/                           ← 测试代码
    ├── AuthIntegrationTest.java     ← 认证流程集成测试（9 个用例）
    └── ProgressIntegrationTest.java ← 进度流程集成测试（4 个用例）
```

---

## 五、前后端是怎么连上的

```
┌──────────────────────┐          ┌─────────────────────────┐
│   React Native App    │          │   Spring Boot 后端       │
│                       │          │                         │
│  src/lib/api.ts       │  HTTP    │  /api/v1/auth/*         │
│  ┌─────────────────┐  │ -------> │  /api/v1/progress/*     │
│  │ apiPost(path)    │  │ <------- │                         │
│  │ apiGet(path)     │  │  JSON   │                         │
│  │ apiPut(path)     │  │         │                         │
│  │                  │  │         │                         │
│  │ 自动带 token     │  │         │                         │
│  │ 401 自动刷新     │  │         │                         │
│  └─────────────────┘  │         │                         │
└──────────────────────┘          └─────────────────────────┘
```

**连接只需要一行：**

```typescript
// api.ts 第 6-26 行
function getBaseUrl(): string {
  // 生产环境 → 环境变量
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  // 开发环境 → 按平台自动选
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:8080/api/v1';
    return 'http://localhost:8080/api/v1';
  }

  throw new Error('EXPO_PUBLIC_API_URL must be set in production.');
}
```

**App 调用代码就三行：**

```typescript
import { apiPost, apiGet, apiPut } from '../lib/api';

// 注册
const resp = await apiPost('/auth/register', { email, password });
// resp = { user: {...}, accessToken: '...', refreshToken: '...' }

// 获取进度
const progress = await apiGet('/progress');

// 保存进度
await apiPut('/progress', { data: {...}, version: 4 });
```

---

## 六、数据库里存了什么

一共 4 张表，用 H2（测试）或 PostgreSQL（生产）：

```
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   users      │    │  refresh_tokens  │    │  otp_codes   │    │ user_progress│
├──────────────┤    ├─────────────────┤    ├──────────────┤    ├─────────────┤
│ id           │←── │ user_id          │    │ id           │    │ user_id     │
│ email        │    │ token_jid        │    │ target       │    │ data (JSON) │
│ phone        │    │ expires_at       │    │ code         │    │ version     │
│ password_hash│    │ created_at       │    │ purpose      │    │ updated_at  │
│ display_id   │    └─────────────────┘    │ expires_at   │    └─────────────┘
│ avatar_url   │                           │ used         │
│ login_failures│                           │ created_at   │
│ locked_until │                           └──────────────┘
│ created_at   │
│ updated_at   │
└──────────────┘
```

---

## 七、常用命令

```powershell
# 进入后端目录
cd G:\CodeCard\backend

# 跑测试（不需要装数据库，用 H2 内存数据库）
mvn test

# 启动后端（需要 PostgreSQL，或用 H2 临时替代）
mvn spring-boot:run

# 编译
mvn compile
```

---

## 八、一句话总结

| 问题 | 答案 |
|------|------|
| 后端在哪 | `G:\CodeCard\backend` |
| 什么语言 | Java，用 Spring Boot 框架 |
| 前后端怎么沟通 | HTTP + JSON，前端发请求，后端返回 JSON |
| 怎么知道谁是谁 | JWT 令牌（accessToken），每次请求带着 |
| 数据存哪 | PostgreSQL（生产）/ H2（测试） |
| 怎么启动 | `mvn spring-boot:run` |

说白了就是：**前端说"我要什么"，后端做完了说"给你"，中间用 JSON 传话，用 Token 验身份。**
