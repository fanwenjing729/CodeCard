# 登录接口抽象层

## Context

用户希望在 CodeCard 中预留登录能力，但现在不做具体实现。核心诉求：**将来接入登录时，不改动任何现有源代码，只需新增文件和替换实现。**

## 策略

将认证和同步拆成两层：
- **接口层**（现在做）—— Stable public API + no-op 实现 + 现有代码对接
- **实现层**（将来做）—— 替换 no-op 为真实 Supabase/LeanCloud 实现，不改任何现有文件

---

## 现在改动清单

### 新建文件（3 个）

#### 1. `src/store/authStore.ts` — 认证接口 + no-op 实现

对外暴露的稳定接口，SettingsScreen 和 AppNavigator 只依赖这个接口，不关心底层实现。

```ts
// Public interface (stable)
interface AuthStore {
  user: { id: string; phone?: string; name?: string } | null;
  isLoggedIn: boolean;
  isMounted: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  // 以下方法仅 LoginScreen 调用，现有代码不调用
  loginByPhone: (phone: string) => Promise<{ error?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error?: string }>;
  loginByWechat: () => Promise<{ error?: string }>;
}
```

No-op 实现：所有方法返回 no-op，`initialize()` 直接 resolve，`isMounted = true`。

将来替换时，只需改这个文件的实现逻辑，接口签名不动。

#### 2. `src/store/syncEngine.ts` — 同步接口 + no-op 实现

```ts
// Public interface (stable)
export function uploadProgress(userId: string): Promise<void>;
export function syncOnLogin(userId: string): Promise<void>;
export function manualSync(userId: string): Promise<{ lastSyncedAt: Date | null }>;
```

No-op 实现：直接 resolve，不做任何网络请求。

将来替换时，只需改实现，签名不动。SettingsScreen 调用这些函数的方式不变。

#### 3. `src/screens/LoginScreen.tsx` — LoginScreen 占位

当前内容为占位 UI，调用 no-op authStore 方法。因为路由上已注册 Login，必须有一个组件。

```
UI：标题"登录" + 说明"登录功能即将上线"
```

将来替换时，把占位 UI 替换为完整手机号/微信登录表单。

---

### 修改文件（3 个）

#### 4. `src/screens/SettingsScreen.tsx`

将 6 个扩展口从注释变为真实代码，接入 `authStore` 和 `syncEngine`：

| 扩展口 | 改动 |
|--------|------|
| #1 import | `import { useAuthStore } from '../store/authStore'` + syncEngine import |
| #2 读取 | `const { user, isLoggedIn } = useAuthStore()` |
| #3 Profile | `isLoggedIn` 为 true 时显示账号区域（手机号、退出按钮）；false 时显示"登录以同步进度"按钮 |
| #4 Sync | `isLoggedIn` 为 true 时显示同步区域（上次同步时间、立即同步按钮） |
| #5 图标 | 重置按钮旁显示 ☁️ 图标（仅登录态） |
| #6 样式 | 取消 profileRow / avatar / profileName / profileId / syncStatus 样式注释 |

退出登录逻辑：
```ts
const handleLogout = () => {
  Alert.alert('退出登录', '退出后学习数据保留在本地，不会丢失。', [
    { text: '取消', style: 'cancel' },
    { text: '退出', style: 'destructive', onPress: () => useAuthStore.getState().logout() },
  ]);
};
```

同步按钮：
```ts
const handleSync = async () => {
  setSyncing(true);
  const result = await manualSync(user!.id);
  setLastSync(result.lastSyncedAt);
  setSyncing(false);
};
```

#### 5. `src/navigation/AppNavigator.tsx`

- `RootStackParamList` 加 `Login: undefined`
- import LoginScreen
- 加 `<RootStack.Screen name="Login" component={LoginScreen} />`

#### 6. `App.tsx`

在 `useEffect` 中加一行：`useAuthStore.getState().initialize();`

---

## 将来加入真实登录时（改动量 = 0 处修改源码）

| 操作 | 文件 | 类型 |
|------|------|------|
| 安装 `@supabase/supabase-js` | package.json | 新增依赖 |
| Supabase 客户端 | `src/lib/supabase.ts` | **新建** |
| 环境变量 | `.env` | **新建** |
| 替换 authStore 为真实实现 | `src/store/authStore.ts` | **替换实现**（接口不变） |
| 替换 syncEngine 为真实实现 | `src/store/syncEngine.ts` | **替换实现**（接口不变） |
| 替换 LoginScreen 为完整 UI | `src/screens/LoginScreen.tsx` | **替换实现**（文件名不变） |
| 添加 scheme | app.json | 加一行 |
| RLS 配置 | Supabase Dashboard | 非代码 |

**SettingsScreen、AppNavigator、App.tsx 完全不动。**

---

## 接口契约（关键）

```
authStore 对外承诺（stable）：
  - 导出 useAuthStore: ZustandStore<AuthStore>
  - selector: s => s.user         返回 User | null
  - selector: s => s.isLoggedIn   返回 boolean
  - selector: s => s.isMounted    返回 boolean
  - action:   initialize()        返回 Promise<void>
  - action:   logout()            返回 Promise<void>

syncEngine 对外承诺（stable）：
  - export uploadProgress(userId: string): Promise<void>
  - export syncOnLogin(userId: string): Promise<void>
  - export manualSync(userId: string): Promise<{ lastSyncedAt: Date | null }>
```

只要接口不变，实现可以随意换。

---

## SettingsScreen 最终效果

**未登录时：**
```
[数据管理]   — 不变
[关于]       — 不变
底部加一个 "登录以同步进度" 入口按钮 → 跳转 LoginScreen
```

**已登录时：**
```
[账号]
  📱 138****8888              退出登录 →
  上次同步：2026-05-22 14:30   [立即同步]

[数据管理]
  ● 重置C++进度（5 张已完成） ☁️  ›

[关于]
  （不变）
```

---

## 验证

1. `npx expo start` 编译通过
2. SettingsScreen 显示"登录以同步进度"按钮
3. 点击跳转 LoginScreen，显示占位内容
4. 学习数据（进度、XP）正常读写，不受 authStore 影响
5. 将来替换实现后，SettingsScreen 行为自动变为真实登录态
