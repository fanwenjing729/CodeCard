# Auth & Sync Interface

三个文件构成登录抽象层。当前 no-op 实现（未登录也能用），将来替换即可——**不改任何现有文件**。

## 接口文件

### `src/store/authStore.ts` — 认证 store

```ts
// Selectors（稳定，不可改签名）
s => s.user          // User | null
s => s.isLoggedIn    // boolean
s => s.isMounted     // boolean

// User 类型
User { id, phone?, name?, avatar?, displayId? }

// Actions（稳定）
initialize()           // App.tsx 调用，恢复 session
logout()               // 登出
setDisplayId(v)        // 修改显示名（设置页）
updateAvatar(url)      // 更新头像（设置页）

// Actions（仅 LoginScreen 调用）
loginByPhone(phone)    → { error? }
verifyOtp(phone,token) → { error? }
loginByWechat()        → { error? }
```

`updateAvatar` 尚未实现。需要时在 `authStore.ts` 加 no-op action 即可。

### `src/store/syncEngine.ts` — 同步模块

```ts
uploadProgress(userId): Promise<void>
syncOnLogin(userId): Promise<void>      // 远程 → 合并 → 回写
manualSync(userId): Promise<{ lastSyncedAt: Date | null }>
```

### `src/screens/LoginScreen.tsx` — 登录页

占位 UI（"登录功能即将上线"），路由已注册。

## 调用关系

```
App.tsx          → authStore.initialize()
SettingsScreen   → authStore (user, isLoggedIn, setDisplayId)
                   syncEngine.manualSync(userId)
                   navigation.navigate('Login')
LoginScreen      → authStore.loginByPhone / verifyOtp / loginByWechat
AppNavigator     → <LoginScreen>
```

## 将来加入真实登录

**不改现有文件代码。** 替换 3 个 no-op 实现 + 新建几个文件。

### 1. 替换 `authStore.ts`

`initialize()` 从后端恢复 session，`loginByPhone/verifyOtp/loginByWechat` 调 SDK，`logout()` 清除 token。selector 签名不变。

### 2. 替换 `syncEngine.ts` — syncOnLogin 全流程

```
用户登录 → syncEngine.syncOnLogin(userId)
  1. 读本地 PersistedData
  2. GET /progress/{userId}
  3. merge(local, remote)
  4. PUT /progress/{userId}
  5. 合并结果写回 Zustand store
```

**合并策略（merge 函数）：**

```ts
function merge(local: PersistedData, remote: PersistedData | null): PersistedData {
  if (!remote) return local;
  return {
    version: CURRENT_VERSION,
    global: {
      totalXP: Math.max(local.global.totalXP, remote.global.totalXP),
      level: calcLevel(Math.max(local.global.totalXP, remote.global.totalXP)),
    },
    courses: mergeCourses(local.courses, remote.courses),
  };
}
```

三条规则：
- `completedCards` → 并集
- `xp / totalXP` → max(本地, 远程, 并集卡片数×5)
- `quizScores / nodePositions` → 本地覆盖远程

### 3. 后端数据库

```sql
CREATE TABLE user_progress (
  user_id    TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  version    INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 必须开 RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "读写自己的进度" ON user_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

后端只存取，不做业务逻辑。合并在客户端完成。

### 4. 新建文件

```
src/lib/supabase.ts        ← BaaS SDK 初始化
src/api/
├── client.ts              ← fetch 封装 + token 拦截
├── auth.ts                ← login / register / refresh
└── progress.ts            ← upload / download
.env
```

### 5. 增量改动

| 文件 | 改动 | 说明 |
|------|------|------|
| `syncEngine.ts` | 替换 no-op | 设计如此 |
| `authStore.ts` | 替换 no-op | 设计如此 |
| `LoginScreen.tsx` | 替换占位 UI | 设计如此 |
| `useProgressStore.ts` | +`dirtyCards: string[]` | 标记未同步卡片，不影响现有 action |
| **SettingsScreen / AppNavigator / App.tsx / 课程数据** | **零改动** | |

### 架构原则

```
Screen → Zustand store → UI         ← 永远从本地读，不感知后端
         ↕
        syncEngine → 后端 API       ← 后台同步，Screen 不知道
```

不被锁定的选型：BaaS 可换、REST/WebSocket 可换、Zustand API 稳定。
核心约束：`PersistedData` 结构是数据契约，后端表必须接受此 JSON。

详见 `docs/supabase-auth-plan.md`。
