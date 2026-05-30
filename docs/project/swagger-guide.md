# Swagger API 文档使用指南

> 写给初学者——这个页面是什么、有什么用、怎么用

---

## 一、这是什么

启动后端后，浏览器打开 `http://localhost:8080/swagger-ui.html`，会看到这个页面：

```
┌──────────────────────────────────────────┐
│  CodeCard API                            │
│  ┌─ auth-controller ────────────────────┐│
│  │ POST /api/v1/auth/register  注册     ││
│  │ POST /api/v1/auth/login     登录     ││
│  │ POST /api/v1/auth/send-otp  发验证码 ││
│  │ ...                                  ││
│  └──────────────────────────────────────┘│
│  ┌─ progress-controller ────────────────┐│
│  │ GET  /api/v1/progress       获取进度 ││
│  │ PUT  /api/v1/progress       保存进度 ││
│  │ POST /api/v1/progress/sync  同步进度 ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

它就是一份**自动生成的接口说明书**。你每写一个后端接口，它自动列出来，不用手写文档。

---

## 二、有什么用

### 1. 看有哪些接口

不需要翻代码，这页面上所有接口一目了然。13 个接口分两组：

**认证（auth-controller，10 个）**—— 注册、登录、验证码、token、个人资料

**进度（progress-controller，3 个）**—— 学习进度的读写同步

### 2. 看接口需要什么参数

点开任意一个接口，下面展开的就是请求格式和响应格式。比如点开 `POST /login`：

```
Request body（你要发的）:
{
  "email": "string",      ← 填邮箱
  "password": "string"    ← 填密码
}

Response（服务器回的）:
{
  "user": { ... },        ← 用户信息
  "accessToken": "...",   ← 登录令牌（存在 App 里，以后每次请求带着）
  "refreshToken": "...",  ← 刷新令牌（accessToken 过期后换新的用）
  "isNewUser": false      ← 是不是新注册的
}
```

### 3. 直接在页面里测试接口

这是最实用的功能。不用写 curl，不用开 App，浏览器里直接发请求看结果。

---

## 三、怎么用

### 先启动后端

```powershell
pg_ctl start                              # 1. 启动数据库
cd G:\CodeCard\backend                     # 2. 进入后端目录
mvn spring-boot:run                        # 3. 启动后端
```

看到 `Tomcat started on port 8080` 后，浏览器打开：

```
http://localhost:8080/swagger-ui.html
```

### 试一个：注册新用户

1. 找到 `POST /api/v1/auth/register`，点一下展开
2. 点右上角 **Try it out** 按钮
3. 在 Request body 里改内容：

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

4. 点 **Execute** 按钮

下面会显示返回结果：

```json
{
  "user": {
    "id": "a1b2c3d4-e5f6-...",
    "email": "test@test.com",
    "phone": null,
    "displayId": null,
    "avatarUrl": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",     ← 长令牌
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "isNewUser": true
}
```

### 试一个：用拿到的 token 查看个人信息

1. 找到 `GET /api/v1/auth/me`，点开
2. 点 **Try it out**
3. 这个接口需要登录才能调。点右上角 **Authorize** 按钮（锁图标）

```
在弹窗里输入：Bearer 你的accessToken
（把上面注册返回的 accessToken 粘贴进来）
```

4. 点 **Execute**，就能看到当前用户的个人信息

### 试一个：保存学习进度

1. 找到 `PUT /api/v1/progress`，点开
2. 先点 Authorize 填好 token（同上一步）
3. 点 Try it out
4. Request body 改成：

```json
{
  "data": {
    "global": { "totalXP": 100, "level": 1 },
    "courses": {
      "cpp": {
        "completedCards": { "cpp-01-hello-c1": true },
        "wrongCards": {},
        "xp": 50,
        "quizScores": {},
        "nodePositions": { "cpp-01": 1 }
      }
    }
  },
  "version": 1
}
```

5. 点 Execute，返回的就是保存后的进度

---

## 四、13 个接口速查

### 不需要登录的（公开接口）

| 接口 | 干什么 | 什么时候用 |
|------|--------|-----------|
| `POST /register` | 注册新账号 | App 注册页 |
| `POST /login` | 用邮箱+密码登录 | App 登录页 |
| `POST /send-otp` | 发邮箱验证码 | App 验证码登录第一步 |
| `POST /verify-otp` | 验验证码→登录 | App 验证码登录第二步 |
| `POST /refresh` | token 过期换新的 | App 自动静默刷新，用户无感 |

### 需要登录的（带着 token 请求）

| 接口 | 干什么 | 什么时候用 |
|------|--------|-----------|
| `GET /me` | 查看我的用户信息 | Settings 页面显示头像/用户名 |
| `PUT /profile` | 改头像/改用户名 | AccountScreen |
| `POST /set-password` | 设置新密码 | 找回密码页 |
| `POST /logout` | 退出登录 | 退出按钮 |
| `GET /progress` | 从云端拉进度 | 换设备登录时自动拉取 |
| `PUT /progress` | 保存进度到云端 | 学完卡片 3 秒后自动上传 |
| `POST /progress/sync` | 登录后首次合并进度 | 登录时自动触发 |

---

## 五、常见问题

### 打不开页面 → `Connection refused`

数据库或后端没启动。先 `pg_ctl start`，再 `mvn spring-boot:run`。

### 打不开页面 → `authentication required`

这种问题已经修好了（Swagger 页面加入了安全白名单），不会再出现。

### Try it out 返回 401

你调的接口需要登录，但没填 token。点右上角 Authorize 按钮，输入 `Bearer 你的accessToken`。

### 重启后端后 Swagger 还在吗

在。这是自动生成的，不需要每次重新配。
