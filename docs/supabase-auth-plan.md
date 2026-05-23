# CodeCard 接入阿里云 Supabase 登录 + 同步

## Context

CodeCard 目前是纯离线应用。用户希望加入**手机号验证码登录**和**微信登录**，支持跨设备同步学习进度。选择阿里云 AnalyticDB Supabase 作为 BaaS——它在国内可用、原生支持微信 OAuth、内置阿里云短信服务。

## 实施概览

8 个文件改动：4 新建 + 4 修改 + 1 安装依赖。分 4 个批次。

---

## Phase 1 — 基础设施（不涉及 UI）

### 1. 安装依赖

```bash
npx expo install @supabase/supabase-js
```

项目已有 `@react-native-async-storage/async-storage`，无需额外安装。

### 2. `app.json` — 添加 scheme（deep link）

在 `expo` 节点下加 `"scheme": "codecard"`。仅一行。OAuth 回调用。

### 3. 新建 `src/lib/supabase.ts` — Supabase 客户端

```ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

URL/key 通过环境变量注入，不硬编码。

---

## Phase 2 — 认证层

### 4. 新建 `src/store/authStore.ts`

Zustand store，与 `useProgressStore` 风格一致（纯 Zustand，无 middleware）。

```ts
状态：
  session: Session | null        // Supabase session
  user: User | null              // Supabase user (phone, wechat_uid, etc.)
  isLoggedIn: boolean
  isMounted: boolean             // hydration 完成标志

动作：
  initialize()    → 从 supabase.auth.getSession() 恢复
  loginByPhone(phone: string)    → supabase.auth.signInWithOtp
  verifyOtp(phone, token)       → supabase.auth.verifyOtp
  loginByWechat()               → supabase.auth.signInWithOAuth (provider: 'wechat')
  logout()                      → supabase.auth.signOut + 清空状态
  subscribe()                   → supabase.auth.onAuthStateChange 自动监听
```

关键实现细节：
- `initialize()` 在 App.tsx 启动时调用一次，恢复上次登录态
- `onAuthStateChange` 自动更新 session/user，无需手动轮询
- 微信登录需要处理 `WebBrowser.openAuthSessionAsync`（OAuth 跳转），这个在 LoginScreen 里处理，authStore 只负责 supabase 调用

### 5. 新建 `src/screens/LoginScreen.tsx`

UI 结构：
```
SafeAreaView
  └── ScrollView
      ├── Logo + "登录以同步进度"
      ├── 手机号输入 + 验证码输入
      ├── "发送验证码" 按钮（60 秒倒计时）
      ├── "登录" 按钮（验证 OTP）
      ├── 分割线 "或"
      └── "微信登录" 按钮（绿色）
```

关键逻辑：
- 发送验证码后倒计时 60 秒防重复点击
- 验证成功后 `router.replace('MainTabs')`
- 微信登录调用 `signInWithOAuth` + `WebBrowser.openAuthSessionAsync`
- 如果用户已登录（`isLoggedIn`），直接 `replace MainTabs`

微信登录关键代码（LoginScreen 内）：
```ts
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

const redirectTo = makeRedirectUri({ scheme: 'codecard' });

const { data } = await supabase.auth.signInWithOAuth({
  provider: 'wechat',
  options: { redirectTo, skipBrowserRedirect: true },
});

if (data?.url) {
  const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (res.type === 'success') {
    // URL 包含了 token，supabase 自动解析
    await supabase.auth.getSession(); // 或等待 onAuthStateChange 触发
  }
}
```

---

## Phase 3 — 同步层

### 6. 新建 `src/store/syncEngine.ts`

不是 store，是纯工具函数模块。负责本地进度 ↔ Supabase 的同步。

```ts
导出函数：
  uploadProgress(userId: string)   // 把当前本地进度推到 Supabase
  downloadProgress(userId: string) // 从 Supabase 拉进度并合并到本地
  syncOnLogin(userId: string)      // 登录后执行 merge 策略
```

**Supabase 表结构**（一个表）：

```sql
user_progress (
  user_id    text primary key,        -- supabase auth.uid()
  data       jsonb not null,          -- PersistedData { global, courses }
  updated_at timestamptz default now()
);
```

用户不需要手动建表——在 Supabase Dashboard SQL Editor 执行一行 DDL 即可，或首次 upload 时用 `supabase.rpc` 自动建表。这里用最简单的手动建表方式（一次性的）：

```sql
create table if not exists user_progress (
  user_id text primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);
```

### RLS 安全策略

必须开启 RLS（Row Level Security），否则任何人拿到 anon key 就能读写所有用户数据。

```sql
-- 开启 RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 用户只能读自己的数据
CREATE POLICY "读取自己的进度" ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能写自己的数据
CREATE POLICY "写入自己的进度" ON user_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

RLS 在数据库层自动拦截，App 代码一行不改。`auth.uid()` 是 Supabase 内置函数，从 JWT 中提取当前用户 ID。其他安全因素（HTTPS、JWT 签名、密码哈希）Supabase 自身已处理，不用管。

**同步策略（最重要）**

当前 CodeCard 进度数据极简单——`PersistedData` 只包含 `completedCards[]`、`xp`、`quizScores`、`nodePositions`。冲突可能性低。策略：

- **上传**：直接用本地数据覆盖远程（`upsert`）
- **下载合并**：
  - `completedCards` → 取并集（`[...new Set([...local, ...remote])]`）
  - `course.xp` → 取最大值
  - `global.totalXP` → 聚合后重新计算
  - `nodePositions` → 取最大值（最新位置）
  - `quizScores` → 取最高分
- **登录同步**：下载 → 合并 → 上传（三步确保两边一致）

实现：
```ts
// 上传
async function uploadProgress(userId: string) {
  const local = useProgressStore.getState();
  const data = { global: local.global, courses: local.courses };
  await supabase.from('user_progress').upsert({
    user_id: userId,
    data,
    updated_at: new Date().toISOString(),
  });
}

// 下载 + 合并
async function syncOnLogin(userId: string) {
  const { data: row } = await supabase
    .from('user_progress')
    .select('data')
    .eq('user_id', userId)
    .single();

  if (!row) {
    // 远程无数据：上传本地
    await uploadProgress(userId);
    return;
  }

  const remote = row.data as PersistedData;
  const local = useProgressStore.getState();

  // 合并 courses
  const mergedCourses: Record<string, CourseProgress> = { ...local.courses };
  for (const [cid, rp] of Object.entries(remote.courses ?? {})) {
    const lp = mergedCourses[cid];
    if (!lp) {
      mergedCourses[cid] = rp;
      continue;
    }
    mergedCourses[cid] = {
      completedCards: [...new Set([...lp.completedCards, ...rp.completedCards])],
      xp: Math.max(lp.xp, rp.xp),
      quizScores: mergeMax(lp.quizScores, rp.quizScores),
      nodePositions: mergeMax(lp.nodePositions, rp.nodePositions),
    };
  }

  // 重新计算全局 XP
  const totalXP = Object.values(mergedCourses).reduce((sum, c) => sum + c.xp, 0);

  useProgressStore.setState({
    global: { totalXP, level: calcLevel(totalXP) },
    courses: mergedCourses,
  });

  // 回写合并结果
  await uploadProgress(userId);
}
```

---

## 数据分层：什么进数据库、什么留文件

| 数据 | 存储位置 | 原因 |
|------|---------|------|
| 课程内容（卡片、代码、题目） | TS 文件 / CDN | 所有用户相同，无网也能学 |
| 学习进度（完成记录、XP、错题） | Supabase `user_progress` | 每人不同，需跨设备同步 |

**课程内容永远不进数据库。** 以后想热更新内容走 CDN JSON（见 AGENTS.md "远程可更新内容"），不跟用户进度混在一张表里。

---

## 规模与成本

| 阶段 | 用户量 | 方案 | 月费 |
|------|------|------|:--:|
| 免费额度内 | 0–5 万月活 | Supabase Free | ¥0 |
| 付费升级 | 5 万+ | Supabase Pro | $25（~¥180） |
| 自建后端 | 特殊需求 | 迁到自建 PostgreSQL | 服务器 ~¥50/月起 |

换方案只改 `syncEngine.ts` 和 `authStore.ts` 的实现，不改接口签名。所有 Screen 不感知后端变化。

---

## Phase 4 — 接入现有代码

### 7. 修改 `App.tsx`

在 `useEffect` 中增加 authStore 的 `initialize()`：

```tsx
import { useAuthStore } from './src/store/authStore';

// 在 useEffect 中，hydrate 之后加一行
useAuthStore.getState().initialize();
```

### 8. 修改 `src/navigation/AppNavigator.tsx`

- 新增 `Login` 路由到 `RootStackParamList`
- 新增 `LoginScreen` import
- 根导航器加 `<RootStack.Screen name="Login" component={LoginScreen} />`
- **不变**：`initialRouteName` 仍为 `MainTabs`（未登录也能用，登录是可选功能）

导航逻辑：
- 用户**主动**进入 Settings → 点击登录 → navigate('Login')
- 登录成功后 `replace('MainTabs')`
- Tab 设置页中显示登录状态，已有账号则显示"退出登录"

### 9. 修改 `src/screens/SettingsScreen.tsx`

取消 6 个扩展口的注释 + 接入 authStore：
- **扩展口 #1** — `import { useAuthStore }` 
- **扩展口 #2** — 读取 `user` / `isLoggedIn`
- **扩展口 #3** — 已登录时显示 Profile Section（头像、昵称、退出登录）
- **扩展口 #4** — 已登录时显示 Sync Section（上次同步时间、立即同步按钮）
- **扩展口 #5** — 重置按钮旁显示同步图标
- **扩展口 #6** — 取消样式注释

未登录时的 Settings 行为不变（只显示数据管理 + 关于，底部加一个"登录以同步进度"按钮）。

---

## 文件改动清单

```
新建：
  src/lib/supabase.ts          ~20 行
  src/store/authStore.ts       ~100 行
  src/store/syncEngine.ts      ~100 行
  src/screens/LoginScreen.tsx  ~200 行

修改（每文件 ≤ 10 行）：
  app.json                     +1 行（scheme）
  App.tsx                      +3 行
  src/navigation/AppNavigator.tsx  +5 行
  src/screens/SettingsScreen.tsx   ~30 行（取消注释 + 接入）

不动：
  src/store/useProgressStore.ts
  src/data/*
  src/components/*
  src/types/*
  其余所有 Screen
```

总计约 430 行新代码，约 40 行改动。

---

## 验证步骤

1. `npx expo start` 确保编译通过
2. SettingsScreen → 点击"登录" → 进入 LoginScreen
3. 输入手机号 → 发送验证码 → 验证 OTP → 跳回设置页，显示 Profile
4. 点击"微信登录" → 跳转微信授权 → 回调 app → 登录成功
5. 在 NodeScreen 完成几张卡片 → SettingsScreen 点击"立即同步" → 进度上传
6. 清除本地数据 → 重新登录 → 进度自动拉回
7. 两台设备各完成不同卡片 → 登录同一账号 → 进度取并集
