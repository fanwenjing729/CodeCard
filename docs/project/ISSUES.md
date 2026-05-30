# 已知问题与修复方案

最后更新：2026-05-30

---

## ✅ 已修复

### #8 请求日志（2026-05-30）

`TraceIdFilter` 已加 JSON 格式请求日志，每条输出 method + path + status + duration + traceId。

### #9 CI/CD（2026-05-29）

前后端 CI workflow 已上线，push master 自动跑测试。

---

## ⏳ 部分完成

### #2 登录/注册限流

**状态**：基础设施已就绪，核心 Filter 未写。

**已完成**：
- Bucket4j 8.10.1 依赖
- `RateLimitProperties.java` — yml 配置绑定
- `application.yml` — 限流规则（login 10/min, register 3/min, send-otp 3/min, verify-otp 5/min）

**待补**：
- 新建 `RateLimitFilter.java`（~80 行，完整代码见 `../backend/backend-rate-limit-design.md`）
- `SecurityConfig.java` 构造器注入 + 注册 filter

**补的时机**：上架应用商店 / 用户过千 / 加 Web 端。

**实现注意**（代码审查发现）：
1. `findLimit()` 要防御 `paths` 为 null 的 NPE
2. 实现后在 `application-local.yml` 加 `rate-limit.enabled: false`

---

## 📋 方案已设计

### #3 进度同步版本冲突

**问题**：`ProgressService.syncProgress()` 不看客户端传的 `version`，直接返回服务端数据。多设备场景可能丢离线进度。

**修复**：改 `ProgressService.syncProgress`，加版本比较（1 个文件 ~10 行）：

```java
if (req.getVersion() > remote.getVersion()) {
    // 客户端赢 — 覆盖保存
    remote.setData(req.getData());
    remote.setVersion(req.getVersion());
    progressRepo.save(remote);
    resp.setMerged(false);
} else {
    // 服务端赢 — 返回服务端数据
    resp.setMerged(true);
}
```

**时机**：多设备用户出现 / 用户量 > 500。
**详细方案**：`../backend/backend-improvements.md`（第三章）

---

### #4 Java 25 测试兼容

**问题**：`E:\JDK` 是 Java 25，Mockito 的字节码引擎不兼容，绕过 `@SpringBootTest`。

**方案 A（推荐）**：装 JDK 21 共存。改 `JAVA_HOME` 或用 Maven toolchains 指定。

```xml
<!-- .m2/toolchains.xml -->
<toolchains>
  <toolchain>
    <type>jdk</type>
    <provides><version>21</version></provides>
    <configuration><jdkHome>E:\JDK21</jdkHome></configuration>
  </toolchain>
</toolchains>
```

**方案 B**：等 Mockito 更新支持 Java 25。

**时机**：新增后端测试需求时。
**详细方案**：`docs/java25-test-fix.md`

---

### #5 auth-sync.md 过时

**问题**：文档通篇描述 Supabase，实际代码用 Spring Boot JWT。新人会误以为需要配 Supabase。

**修复**：重写 `../backend/auth-sync.md`，按实际代码写：

```
# 认证与同步（Spring Boot JWT）

## 认证流程
  - 邮箱 OTP 注册（两步）
  - JWT access 15min / refresh 30d
  - token 自动刷新（api.ts 拦截 401）

## 进度同步
  - 本地优先（Zustand + AsyncStorage）
  - 自动上传（3s 防抖）
  - 登录合并（syncOnLogin）

## 关键文件
  - 前端：authStore.ts, syncEngine.ts, api.ts
  - 后端：AuthController, ProgressController, SecurityConfig

## 附录：方案 A（Supabase，未采用）
  - 旧内容精简保留
```

**工作量**：~2 小时（读 6 个文件，写 1 个）。
**时机**：有新人接手 / 给指导老师看文档之前。

---

### #6 Screen 层集成测试

**现状**：hooks 层 18 条测试，Screen 层 0 条。

**策略**（按难度分三级）：

| 级别 | Screen | 测什么 |
|------|--------|--------|
| 低 | HomeScreen, CourseScreen, ModuleScreen | 给 mock courses，断言列表渲染 |
| 中 | NodeScreen, QuizScreen | 划卡/答题触发的 store action |
| 高 | LoginScreen, RegisterScreen | 网络请求 mock + OTP 流程 |

**工具**：`@testing-library/react-native` + `jest.mock()`。

**时机**：新增卡片类型时（需要验证渲染调度） / 报告 Screen 层 bug 时（复现 + 防回退）。

**关联**：暗色模式需要先补 3 个基础 Screen 的测试，否则切换主题系统无安全网。

---

### #7 暗色模式

**现状**：`theme.ts` 已预留 `DarkColors` 对象（目前和亮色一样），无读取用户偏好。

**步骤**：

```
1. theme.ts — DarkColors 填真的暗色值 + 加 useThemeColors() hook
2. 入口 — NavigationContainer theme prop + StatusBar 切换
3. 组件 — import { Colors } → const colors = useThemeColors()
```

**工作量**：~2.5h（20+ 文件批量替换）。

**时机**：Screen 测试先补 3 个基础 Screen → 再开暗色模式（有安全网不引入无声视觉 bug）。

---

### #10 + #11 store 隐式依赖 + token 全局单例

**问题**：`authStore` 5 处直接调 `syncEngine.syncOnLogin()`，无接口契约；`api.ts` 的 `accessToken`/`refreshToken` 是模块顶层 `let`。

**修复**：事件总线 + token 闭包化。

**1. 新建 `src/lib/events.ts`**（~25 行）：

```ts
class EventBus {
  private handlers = new Map<string, Set<Function>>();
  on(event: string, handler: Function) { ... }
  emit(event: string, ...args: any[]) { ... }
}
export const bus = new EventBus();
```

**2. authStore** — `syncOnLogin()` 改为 `bus.emit('auth:login', userId)`

**3. syncEngine** — `bus.on('auth:login', (uid) => syncOnLogin(uid))`

**4. api.ts** — `let accessToken` 改为闭包 + getter/setter

**影响**：authStore.ts + syncEngine.ts + api.ts，其余文件零改动。

**时机**：出"登录后进度没同步" bug / 加 Web 端 / 新增第三个 store。
**详细方案**：`docs/store-contract-plan.md`

---

## 🔒 等待外部条件

### #1 SMS 短信验证

**状态**：`OtpService.sendCode()` 对手机号抛异常，前端 Alert 引导切到邮箱验证码。

**修复**：接一个短信平台 → 改 3 处（`OtpService` + `LoginScreen` + `RegisterScreen`）。

**阻塞**：需要企业营业执照。

**详细方案**：`../backend/sms-defer.md`

---

### #7 registerByEmail 无 UI

**状态**：`authStore.registerByEmail(email, password)` 一步注册，但 RegisterScreen 没暴露这个入口。

**不做**：OTP 验证拥有权比密码注册更安全。这是产品决定，不是 bug。
