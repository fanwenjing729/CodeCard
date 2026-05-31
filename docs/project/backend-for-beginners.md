# 后端代码速查 — 给写 C++ 的你

> 你不需要会写 Java。软著审查只看材料，不考你。只需要能指着文件说出它是干嘛的。

---

## 一句话对照表

| 后端文件 | 一句话 | 类比 C++ |
|---------|--------|----------|
| `CodeCardApplication.java` | 程序入口，启动服务器 | `int main()` |
| `SecurityConfig.java` | 安全规则：哪些页面要登录 | 门禁系统 |
| `JwtService.java` | 生成/验证登录令牌 | 学生证制作+验真伪 |
| `JwtAuthFilter.java` | 每个请求先查令牌 | 宿舍楼管查学生证 |
| `AuthController.java` | 接收前端的注册/登录请求 | 前台接待窗口 |
| `AuthService.java` | 注册/登录的具体逻辑：查数据库、验密码 | 接待员做的工作 |
| `OtpService.java` | 生成6位验证码、发邮件 | 短信验证码 |
| `ProgressController.java` | 接收前端上传的进度数据 | 收作业的窗口 |
| `ProgressService.java` | 把进度存到数据库 | 存档员 |
| `GlobalExceptionHandler.java` | 出错时返回友好提示 | try-catch 全局版 |
| `User.java` | 用户表结构 | `struct User { ... }` |
| `UserProgress.java` | 进度表结构 | `struct Progress { ... }` |
| `RefreshToken.java` | 令牌表结构 | `struct Token { ... }` |
| `AuthResponse.java` | 登录成功后返回的数据格式 | 函数返回值结构体 |
| `ProgressSyncRequest.java` | 前端上传进度的请求格式 | 函数参数结构体 |
| `schema.sql` | 建表 SQL 语句 | 创建数据库表格 |

---

## 完整流程 — 看不懂代码时这样讲

### 用户注册
```
前端 App                →    后端服务器            →    PostgreSQL 数据库
输入手机号+密码          →    AuthController 接收
                            AuthService 检查是否已注册
                            BCrypt 加密密码
                            User 实体              →    INSERT INTO users
                            JwtService 签发令牌
                            AuthResponse           ←    返回令牌+用户信息
显示"注册成功"            ←
```

### 用户登录
```
前端 App                →    后端服务器            →    PostgreSQL 数据库
输入手机号+密码          →    AuthService 验密码
                            错误5次 → 锁定15分钟
                            JwtService 签发令牌      →   INSERT refresh_tokens
                            返回 accessToken         ←
存令牌到手机本地          ←
```

### 同步学习进度
```
前端 App                →    后端服务器            →    PostgreSQL 数据库
Zustand store 变化       →    useAutoSync 3秒后自动
上传进度 JSON            →    ProgressController
                            验证 JWT 令牌
                            JSONB upsert             →   INSERT/UPDATE user_progress
                            返回合并结果              ←
更新本地进度              ←
```

---

## Java vs C++ — 你能看懂的部分

```cpp
// C++ 里的结构体
struct User {
    string email;
    string phone;
    string password;
};
```

```java
// Java 里叫"实体"，加了 @Entity 就是能存数据库
@Entity
public class User {
    private String email;
    private String phone;
    private String passwordHash;

    // getter/setter — Java 的"成员函数"
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

就三个区别：
1. Java 用 `private` 代替 C++ 的默认可见性（但 class 本来就是 private…跟 C++ 一样）
2. Java 的 getter/setter 就是 C++ 的成员函数，只是命名习惯不同
3. `@Entity` = 告诉框架"这个类对应数据库一张表"

语法几乎一样，不用怕。

---

## PostgreSQL 数据库长什么样

```sql
-- 用户表
CREATE TABLE users (
    id          UUID PRIMARY KEY,       -- 唯一编号
    email       VARCHAR(255) UNIQUE,     -- 邮箱
    phone       VARCHAR(32) UNIQUE,      -- 手机号
    password_hash VARCHAR(255),          -- 加密后的密码
    login_failures INT DEFAULT 0,       -- 登录失败次数
    locked_until TIMESTAMPTZ             -- 锁定到何时
);

-- 进度表 (存 JSON — 前端整个 store 直接塞进去)
CREATE TABLE user_progress (
    user_id UUID PRIMARY KEY,
    data    JSONB NOT NULL,              -- 前端 Zustand store 的完整状态
    version INT DEFAULT 3
);
```

存储每条学习记录的不是传统的一张表多个字段，而是**一个 JSONB 字段**——前端把整个 Zustand store 序列化成 JSON，后端原样存进数据库。设计原因是让客户端自己做合并算法（`syncEngine.ts` 里的 `mergeMax`）。

---

## 软著答辩话术

如果被问到后端（极小概率），这样回答：

> "后端用 Spring Boot 和 Java 21 开发，提供 REST API 给前端调用。核心功能是用户认证和进度同步。认证用 JWT（JSON Web Token），密码用 BCrypt 加密。进度存储用 PostgreSQL 的 JSONB 字段，合并算法在客户端实现以减少服务端压力。包含账户安全机制：连续 5 次登录失败锁定 15 分钟。"
