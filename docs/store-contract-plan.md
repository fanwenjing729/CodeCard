# Store 架构加固方案（#10 + #11）

## 状态

⏳ 以后做（bug 驱动）

## 两个问题

### #10：store 间隐式依赖

`authStore` 和 `syncEngine` 之间没有正式接口，靠直接调用耦合：

```
authStore.initialize()   ──→  syncEngine.syncOnLogin()
authStore.loginByEmail() ──→  syncEngine.syncOnLogin()
authStore.verifyEmailOtp() ─→  syncEngine.syncOnLogin()
authStore.loginByPhone() ──→  syncEngine.syncOnLogin()
authStore.refreshToken()  ──→  syncEngine.syncOnLogin()

syncEngine.ts ──→  useProgressStore.getState() / setState()  直接读写
```

风险：`syncOnLogin()` 内部 try-catch 吞错误，同步失败静默无声。

### #11：token 全局单例

`api.ts` 顶层两个可变变量：

```ts
let accessToken: string | null = null;
let refreshToken: string | null = null;
```

多 tab / 多窗口场景存在竞争写入。当前单 tab 零风险。

## 一起修还是分开修？

两个问题根因相同：全局可变状态 + 无接口隔离。一次改比两次改省事（改了 api.ts 的 token 沙箱化后，store 间依赖自然少一个耦合点）。

### 为什么现在不修

| 条件 | 现状 |
|------|------|
| 触发过 bug | 没 |
| 用户数 | < 10 |
| 多设备 | 0 |
| 多 tab | React Native 不存在 |

修了也验证不了效果。等触发了再修最划算——有 bug 现场直接对比修前修后。

## 怎么做（接口契约方案）

### 方案：事件总线

引入一个极简的 typed event emitter，store 之间通过事件通信而不直接调用。

```ts
// src/lib/events.ts — 核心就是一个 Map<string, Set<Function>>
type EventHandler = (...args: any[]) => void;

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]) {
    this.handlers.get(event)?.forEach(h => h(...args));
  }
}

export const bus = new EventBus();
```

### 改法

**1. authStore — 不再直接调 syncOnLogin**

```ts
// 之前：syncEngine.syncOnLogin();
// 之后：
import { bus } from '@/lib/events';

// login 成功时
bus.emit('auth:login', userId);
```

**2. syncEngine — 监听事件**

```ts
import { bus } from '@/lib/events';

bus.on('auth:login', (userId) => {
  syncOnLogin(userId);
});
```

**3. api.ts — token 改为闭包内变量**

```ts
// 之前：export let accessToken: string | null = null;
// 之后：闭包 + getter/setter
let accessToken: string | null = null;

export function setAccessToken(t: string | null) { accessToken = t; }
export function getAccessToken() { return accessToken; }

// api.ts 内部读 getAccessToken() 而非 accessToken
```

对外暴露 getter/setter，控制读写入口。未来可以挂 hook 监听 token 变化（比如 token 过期自动登出）。

### 影响范围

| 文件 | 改动 |
|------|------|
| 新建 `src/lib/events.ts` | ~25 行 |
| `authStore.ts` | 5 处 `syncOnLogin()` 改为 `bus.emit` |
| `syncEngine.ts` | 加 `bus.on` 监听 |
| `api.ts` | `let` 改闭包 + getter/setter |

前端零文件改签名（其他文件通过 `api.ts` 导出的 `apiGet/apiPost` 调接口，不碰 token 变量）。

## 测试

事件总线的测试最直接：

```ts
// events.test.ts
test('auth:login triggers sync', () => {
  const fn = jest.fn();
  bus.on('auth:login', fn);
  bus.emit('auth:login', 'user-1');
  expect(fn).toHaveBeenCalledWith('user-1');
});
```

## 什么时候修

满足任意一条：
- 用户报告"登录后进度没同步"
- 加 Web 端
- 加第三个 store（用户数/通知/付费）
