# Auth & Sync Interface

> **最后更新：2026-05-27**

## 当前进度

| # | 事项 | 状态 |
|---|------|:--:|
| 1 | `npx expo install @supabase/supabase-js` | ✅ |
| 2 | 新建 `src/lib/supabase.ts` | ✅ |
| 3 | 替换 `src/store/authStore.ts`（手机号+微信登录+登出+会话恢复） | ✅ |
| 4 | 替换 `src/store/syncEngine.ts`（上传+下载合并+同步） | ✅ |
| 5 | 替换 `src/screens/LoginScreen.tsx`（手机号+验证码+倒计时+微信按钮） | ✅ |
| 6 | `app.json` 加 `scheme: "codecard"` | ✅ |
| 7 | `App.tsx` 调用 `initialize()`（已有，无需改） | ✅ |
| 8 | AppNavigator 注册 Login 路由（已有，无需改） | ✅ |

## 下一步（Supabase 配置）

代码侧已完成，以下是 Supabase 控制台需要做的事：

| # | 事项 | 操作位置 |
|---|------|----------|
| 1 | 填真实的 anon key | 项目 `.env`，把 `你的anon_key` 换成真的 |
| 2 | 开启 Phone Auth | Dashboard → Authentication → Phone → Enable |
| 3 | 配置 SMS 提供商 | 需 Twilio 或阿里云短信服务（阿里云国内 ~¥0.045/条） |
| 4 | 建 `user_progress` 表 | Dashboard → SQL Editor，执行建表 SQL（见下方） |
| 5 | 重启 Expo | `npx expo start --clear` |
| 6 | 真机验证 | 手机号登录 → 收验证码 → 登录成功 |

### 建表 SQL

```sql
create table if not exists user_progress (
  user_id text primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "读取自己的进度" ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "写入自己的进度" ON user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 不接 SMS 的替代方案

如果暂时不想搞短信签名审核，可以先做微信登录——不需要 SMS，用户点一下授权即可。但微信登录需要**微信开放平台**账号（个体工商户 + 300 元/年认证）。

---

## 登录跑通后的路线

按顺序，每步做完再进下一步。

### 第 1 步：验证登录流程

- [ ] 填真实 anon key 到 `.env`
- [ ] Supabase 开启 Phone Auth + 配置 SMS
- [ ] 建 user_progress 表（执行上面 SQL）
- [ ] `npx expo start --clear` 重启
- [ ] 真机输入手机号 → 收验证码 → 登录成功 → 自动跳回首页
- [ ] 杀掉 App 重开 → 仍保持登录态（`initialize()` 恢复 session）

### 第 2 步：接入同步

当前的 `syncEngine.ts` 写好了但还没接入 UI。需要改两处：

**2a. 登录成功后自动同步**

在 `authStore.ts` 的 `verifyOtp` 和 `onAuthStateChange` 里，登录成功后调：

```ts
import { syncOnLogin } from './syncEngine';

// 在 set({ user, isLoggedIn: true }) 之后加：
syncOnLogin(user.id).catch(() => {});
```

**2b. SettingsScreen 加手动同步按钮**

SettingsScreen 已有 `manualSync` 的调用预留。找到对应的 TouchableOpacity，把 no-op 换成真实调用：

```ts
import { manualSync } from '@/store/syncEngine';
// onClick: manualSync(userId).then(res => setLastSync(res.lastSyncedAt))
```

### 第 3 步：SettingsScreen 接入真实用户信息

当前 SettingsScreen 的 avatar + phone + displayId 读的是 `useAuthStore`。authStore 已实现，取消注释即可：

- `user?.phone` 显示手机号
- `user?.displayId` 显示用户 ID
- 头像用 `user?.phone` 首字符做占位

### 第 4 步：错误处理兜底

- [ ] 同步失败不阻塞 UI——`syncOnLogin` 已有 try/catch，静默失败
- [ ] 网络断开时 `supabase` 调用会抛异常——LoginScreen 已有 Alert 提示
- [ ] Token 过期自动刷新——`autoRefreshToken: true` 已配，Supabase 自动处理

### 第 5 步：生产环境准备

- [ ] `.env` 的 anon key 换成生产环境的（Supabase → Settings → API）
- [ ] Supabase RLS 确认生效（用另一个用户 ID 测试，应该读不到别人的进度）
- [ ] App 签名打包后验证 OAuth 回调（`codecard://` scheme）
- [ ] 考虑把 SMS 切换到生产签名（阿里云短信模板去掉"测试"字样）

### 架构备忘

改了什么、没改什么：

| 需要 | 不需要 |
|------|--------|
| `authStore.ts` — 手机号/微信/登出 | 任何 Screen（HomeScreen 等 8 个页面不改） |
| `syncEngine.ts` — 上传/下载合并 | 任何课程数据文件（`src/data/` 不改） |
| `LoginScreen.tsx` — 登录 UI | `useProgressStore` 接口（只多导出了一个类型） |
| `App.tsx` — `initialize()`（已有） | 导航结构（Login 路由早已注册） |

---

## 方案选择

| | 方案 A：Supabase | 方案 B：CloudBase |
|------|------|------|
| 服务器位置 | 海外（官方云）/ 国内（自部署） | 国内（腾讯云） |
| 国内访问 | 偶尔抽风 / 自部署则稳定 | 稳定 |
| 安全 | RLS 成熟可靠 | 文档级 ACL + `_openid` |
| 微信登录 | 标准 OAuth（需跳浏览器） | 天然整合（`wx.login()` + 小程序 SDK） |
| 免费额度 | 500MB 数据 + 5 万月活 | 2GB 数据 + 5 万次调用/天 |
| 接口稳定性 | 开源标准，不会变 | 腾讯商业产品，API 可能变 |
| 代码改动 | ~430 行新建 + ~40 行修改 | ~420 行新建 + ~50 行修改 |
| 适合 | 纯 App，追求接口标准 | App + 微信小程序，追求国内体验 |

**建议：** App 优先方案 A（Supabase），小程序优先方案 B（CloudBase）。将来如果需要同时支持 App + 小程序，架构设计上两者可共存——`authStore` 和 `syncEngine` 的接口签名在两者之间是一致的，切换只改实现不改调用方。

---

## 方案 A：Supabase

详细代码见 `docs/supabase-auth-plan.md`。

### 操作顺序

```
第1步：阿里云开 Supabase 实例，获取 URL + anon key
第2步：创建 user_progress 表 + 设置 RLS（SQL 在 supabase-auth-plan.md Phase 3）
第3步：npx expo install @supabase/supabase-js
第4步：新建 src/lib/supabase.ts（SDK 初始化）
第5步：新建 src/store/authStore.ts（替换 no-op，手机号/微信登录）
第6步：新建 src/store/syncEngine.ts（替换 no-op，上传/下载/合并）
第7步：新建 src/screens/LoginScreen.tsx（替换占位 UI）
第8步：app.json 加 "scheme": "codecard"
第9步：App.tsx 加一行 useAuthStore.getState().initialize()
第10步：AppNavigator 已注册 Login 路由，零改动
第11步：SettingsScreen 已预留扩展口，取消注释即可
第12步：验证：登录 → 学几张卡 → 同步 → 清数据 → 重登 → 进度恢复
```

每步的具体代码在 `docs/supabase-auth-plan.md`，复制即可。

---

## 详细操作指南

### 第 1 步：创建 Supabase 实例

1. 打开 [阿里云 Supabase 控制台](https://supabase.aliyun.com/)（国内访问，不需要翻墙）
2. 点击"创建实例" → 选择区域（选最近的，如上海/杭州）→ 等待 3-5 分钟创建完毕
3. 进入项目 Dashboard → 左侧"Settings" → "API"
4. 记录两个值，后面用：
   - `Project URL`（形如 `https://xxx.supabase.co`）
   - `anon public key`（以 `eyJ` 开头的长字符串）

### 第 2 步：配置环境变量

新建 `.env` 文件（项目根目录）：

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Expo 的 `EXPO_PUBLIC_` 前缀会在构建时将值打入 JS bundle，客户端可直接读取。这些值不是密钥（RLS 在数据库层保护），安全存储逻辑见下方"风险规避"。

这个文件要加入 `.gitignore`（如果还没在）：

```bash
echo ".env" >> .gitignore
```

### 第 3 步：建表 + 开 RLS

打开 Supabase Dashboard → 左侧"SQL Editor" → 粘贴并执行 `docs/supabase-auth-plan.md` Phase 3 的 SQL：

1. 先执行 `CREATE TABLE user_progress`
2. 再执行 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
3. 再执行两条 `CREATE POLICY`

执行完后验证 RLS 已开：

```sql
-- 在 SQL Editor 中运行，确认 rls_enabled = true
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_progress';
```

### 第 4-12 步

按操作顺序清单执行。每个文件的完整代码在 `docs/supabase-auth-plan.md` 对应 Phase 里。

### 验证清单

逐条验证，全部通过才算完成：

```
[ ] 未登录 → App 正常打开，所有课程可学（保持离线可用）
[ ] Settings → 点击登录 → LoginScreen 显示手机号输入
[ ] 输入手机号 → 发送验证码 → 收到短信 → 填入 → 登录成功
[ ] 登录后 → Settings 显示用户头像/昵称/退出登录按钮
[ ] 学完几张卡 → 点同步按钮 → 提示"同步成功"
[ ] 清除 App 数据（系统设置→App→清除数据）→ 重新登录 → 进度恢复
[ ] 两台设备登录同一账号 → 各学不同卡片 → 分别同步 → 进度取并集
[ ] 退出登录 → 学习功能不受影响（仍可离线学）
```

---

## 需要什么

| 需要 | 说明 |
|------|------|
| Supabase 实例 | 阿里云 AnalyticDB Supabase（国内可用，原生支持微信 OAuth） |
| 数据库 | 1 张表 `user_progress`（user_id + data JSONB + updated_at） |
| 自己搭后端？ | **不需要。** Supabase 是 BaaS，自带数据库、认证、RLS 权限 |

---

## 风险与规避

### 风险 1：RLS 没开 → 所有用户数据可被任何人读写

**危害最大。** Supabase 的 `anon key` 在 App 二进制中可被提取。如果不设 RLS，任何人拿到 key 就能读写整个 `user_progress` 表。

**规避：**
- 建表后立即执行 RLS SQL，不要等"先跑通再说"
- 用上面的验证 SQL 确认 `rowsecurity = true`
- RLS 策略只允许 `auth.uid() = user_id`：用户 A 永远读不到用户 B 的数据
- Supabase 的 `auth.uid()` 从 JWT 中提取，伪造不了

### 风险 2：同步时数据丢失

两设备各学一部分 → 登录同步 → 后上传的覆盖先上传的。

**规避（已在 merge 策略中处理）：**
- `completedCards` 取并集 → 不会丢已完成记录
- XP 取最大值 → 不会少算
- 合并后立即回写远程 → 保证下次从其他设备登录拿到的是最新合并结果
- 用户手动点同步按钮前，本地数据一定是最新的（Zustand 500ms 防抖已写入 AsyncStorage）

### 风险 3：登录态过期

Supabase session 默认 1 小时过期。不处理会跳出登录页打断用户学习。

**规避：**
- Supabase SDK 的 `autoRefreshToken: true`（已在 supabase.ts 中配置）会自动刷新 token
- `persistSession: true` 将 session 存 AsyncStorage，App 重启自动恢复
- `onAuthStateChange` 监听登录态变化，UI 自动响应
- 核心学习流程不检查登录态 → 即使 refresh 失败也不影响学习

### 风险 4：网络波动导致同步失败

用户在弱网环境点同步 → 上传一半断网 → 数据不一致。

**规避：**
- `syncEngine` 的 `uploadProgress` 用 `upsert`（insert or update）→ 幂等，重试不会产生重复数据
- 同步失败时 Alert 提示"网络不稳定，稍后重试"，不静默失败
- 同步和上传是触发式（登录/手动/后台），不是实时推送 → 网络短暂中断不影响
- 本地进度始终是最新的 → 同步失败也不丢数据，下次成功时追上

### 风险 5：anonym key 泄露

`EXPO_PUBLIC_` 变量会被打包进 APK 二进制。但这**在 Supabase 架构下是正常的**——anon key 设计上就是公开的，真正的安全在 RLS。

**规避：**
- 不把 `service_role key` 放进环境变量，只用 `anon key`
- 所有敏感操作通过 RLS 策略限制
- 如有特殊需求（如管理员删除帖子），用 Supabase Edge Functions + `service_role key`，只在服务端用

### 风险 6：多设备同时同步

用户在手机和 Pad 同时打开 App，都点同步。

**规避：**
- 两次 upsert 操作间隔很短（毫秒），后写入的覆盖先写入的
- 由于每次 upsert 前都会先读本地最新状态 + 远程最新状态再合并，实际流程是：
  ```
  手机：读本地 → 读远程 → merge → 写回远程
  Pad： 读本地 → 读远程（可能刚被手机更新）→ merge → 写回远程
  ```
- Pad 的 merge 看到的是手机更新后的数据 → 最终两边一致
- 极端情况（毫秒级并发写）：后写覆盖先写，但下次任一设备同步时 merge 会补齐

### 上线检查清单

Supabase 控制台逐项确认后再发版：

```
[ ] Auth → Settings → Site URL 已填（用于 OAuth 回调）
[ ] Auth → Settings → 手机号登录已开启
[ ] Auth → Providers → 微信登录已配置（如需）
[ ] SQL Editor → RLS 策略已执行且验证通过
[ ] API Settings → anon key 已复制到 .env
[ ] Database → user_progress 表存在
```

## 数据分层：什么进数据库、什么不进

```
App 内                                        Supabase
┌──────────────────────────┐      ┌──────────────────────────┐
│ 课程内容（卡片、代码、题目）   │      │ 学习进度（XP、完成记录、错题） │
│                          │      │                          │
│ 所有用户一样               │      │ 每人不同                  │
│ APK 自带 / CDN 分发       │      │ 登录后下载到本地            │
│ 无网也能学                 │      │ 需要网络同步               │
│ 不进数据库                 │      │ user_progress 表          │
└──────────────────────────┘      └──────────────────────────┘
        静态数据                          个人数据
```

**课程内容为什么不需要同步：** 所有设备上的 App 自带同样的课程文件。课程更新走 App 发版或 CDN 热更新，跟用户登录无关。新设备登录后，App 本身已经有课程内容，只需要从 Supabase 拉进度数据（哪些卡已完成、得了多少 XP），和本地课程内容一结合，UI 就完整了。

**登录同步的实际流程：**

```
新设备登录
  ├── 课程内容：App 自带（TS 文件 / CDN 缓存），已有，不需要网络
  └── 学习进度：syncEngine 从 Supabase 拉 user_progress
       └── merge(local, remote) → 写入 Zustand store
       └── UI 渲染：CourseScreen 读静态课程 + 读 store 进度 = 完整展示
```

---

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

## 方案 A 详细实现（Supabase）

> 完整代码见 `docs/supabase-auth-plan.md`（每个文件的具体代码，复制即可）。下面是架构层面的要点。

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
src/store/authStore.ts     ← 替换 no-op（~100 行）
src/store/syncEngine.ts    ← 替换 no-op（~100 行）
src/screens/LoginScreen.tsx ← 替换占位 UI（~200 行）
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

---

## 方案 B 详细实现（CloudBase）

> 以下是与方案 A 的**差异部分**。相同部分（合并策略、数据分层、架构原则、AppNavigator 路由、SettingsScreen 扩展口）完全复用，不重复写。

### 1. 安装依赖

```bash
npx expo install @cloudbase/js-sdk
```

不需要 `@supabase/supabase-js`。

### 2. 创建 CloudBase 环境

1. 打开 [腾讯云 CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 创建环境 → 选择"按量计费"（有免费额度）
3. 进入环境 → 左侧"用户管理" → 开启"手机号登录"和"微信登录"
4. 左侧"数据库" → 创建集合 `user_progress`
5. 设置 → 获取环境 ID（形如 `codecard-xxx`）

### 3. 新建 `src/lib/cloudbase.ts` — SDK 初始化

```ts
import cloudbase from '@cloudbase/js-sdk';

export const app = cloudbase.init({
  env: process.env.EXPO_PUBLIC_TCB_ENV_ID ?? '',
});

export const auth = app.auth();
export const db = app.database();
```

### 4. 新建 `src/store/authStore.ts`（CloudBase 版）

```ts
import { create } from 'zustand';
import { auth } from '@/lib/cloudbase';

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  isMounted: boolean;

  initialize: () => Promise<void>;
  loginByPhone: (phone: string) => Promise<{ error?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error?: string }>;
  loginByWechat: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setDisplayId: (displayId: string) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoggedIn: false,
  isMounted: false,

  initialize: async () => {
    // 检查本地登录态是否还有效
    const loginState = await auth.getLoginState();
    if (loginState) {
      const { user } = loginState;
      set({
        user: {
          id: user.uid,
          phone: (user as any).phone,
          name: user.nickName,
          avatar: user.avatarUrl,
        },
        isLoggedIn: true,
      });
    }
    set({ isMounted: true });
  },

  loginByPhone: async (phone) => {
    try {
      await auth.sendPhoneCode(phone);
      return {};
    } catch (e: any) {
      return { error: e.message || '发送验证码失败' };
    }
  },

  verifyOtp: async (phone, code) => {
    try {
      const loginState = await auth.signInWithPhoneCode(phone, code);
      if (loginState) {
        set({
          user: {
            id: loginState.user.uid,
            phone,
          },
          isLoggedIn: true,
        });
        return {};
      }
      return { error: '登录失败' };
    } catch (e: any) {
      return { error: e.message || '验证失败' };
    }
  },

  // CloudBase 微信登录 — 小程序内用 wx.login()，App 端用微信开放平台 SDK
  loginByWechat: async () => {
    try {
      // 小程序环境：provider 设 'wx-openapi'
      // App 环境：需集成微信开放平台 SDK 获取 code → 传给 cloudbase
      const provider = auth.weixinAuthProvider({
        appid: process.env.EXPO_PUBLIC_WX_APPID ?? '',
      });
      await provider.signInWithRedirect();
      // signInWithRedirect 会跳微信 → 回调 → CloudBase 自动设登录态
      const loginState = await auth.getLoginState();
      if (loginState) {
        set({
          user: {
            id: loginState.user.uid,
            name: loginState.user.nickName,
            avatar: loginState.user.avatarUrl,
          },
          isLoggedIn: true,
        });
        return {};
      }
      return { error: '微信登录失败' };
    } catch (e: any) {
      return { error: e.message || '微信登录失败' };
    }
  },

  logout: async () => {
    await auth.signOut();
    set({ user: null, isLoggedIn: false });
  },

  setDisplayId: (displayId) => {
    set((s) => ({
      user: s.user ? { ...s.user, displayId } : null,
    }));
  },
}));
```

### 5. 新建 `src/store/syncEngine.ts`（CloudBase 版）

```ts
import { db } from '@/lib/cloudbase';
import { useProgressStore } from '@/store/useProgressStore';
import { calcLevel } from '@/lib/xp';
import type { PersistedData, CourseProgress } from '@/types';

const COLLECTION = 'user_progress';

export async function uploadProgress(userId: string): Promise<void> {
  const state = useProgressStore.getState();
  const data: PersistedData = {
    version: state.version,
    global: state.global,
    courses: state.courses,
  };

  const collection = db.collection(COLLECTION);
  const doc = await collection.doc(userId).get();

  if (doc.data) {
    await collection.doc(userId).update({ data, updated_at: new Date().toISOString() });
  } else {
    await collection.doc(userId).create({ _id: userId, data, updated_at: new Date().toISOString() });
  }
}

export async function syncOnLogin(userId: string): Promise<void> {
  const collection = db.collection(COLLECTION);
  const doc = await collection.doc(userId).get();

  if (!doc.data) {
    // 远程无数据：上传本地
    await uploadProgress(userId);
    return;
  }

  const remote = doc.data.data as PersistedData;
  const local = useProgressStore.getState();

  // 合并 courses（与方案 A 完全相同的逻辑）
  const mergedCourses: Record<string, CourseProgress> = { ...local.courses };
  for (const [cid, rp] of Object.entries(remote.courses ?? {})) {
    const lp = mergedCourses[cid];
    if (!lp) {
      mergedCourses[cid] = rp;
      continue;
    }
    mergedCourses[cid] = {
      completedCards: { ...lp.completedCards, ...rp.completedCards },
      wrongCards: { ...lp.wrongCards, ...rp.wrongCards },
      xp: Math.max(lp.xp, rp.xp),
      quizScores: { ...lp.quizScores, ...rp.quizScores },
      nodePositions: { ...lp.nodePositions, ...rp.nodePositions },
    };
  }

  const totalXP = Object.values(mergedCourses).reduce((sum, c) => sum + c.xp, 0);

  useProgressStore.setState({
    global: { totalXP, level: calcLevel(totalXP) },
    courses: mergedCourses,
  });

  await uploadProgress(userId);
}

export async function manualSync(userId: string): Promise<{ lastSyncedAt: Date | null }> {
  await uploadProgress(userId);
  return { lastSyncedAt: new Date() };
}
```

### 6. CloudBase 特有的安全设置

CloudBase 没有 SQL 级别的 RLS，安全通过以下方式实现：

**数据库权限（在 CloudBase 控制台 → 数据库 → 权限管理设置）：**

| 集合 | 权限 | 说明 |
|------|------|------|
| `user_progress` | 仅创建者可读写 | 每个用户的文档由 `_openid` 标记，只能读写自己的 |

**验证规则（在数据库集合的"安全规则"中配置）：**

```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

等价于 Supabase 的 RLS。确保用户 A 读不到用户 B 的进度。

### 7. CloudBase 与 Supabase 的关键差异

| | Supabase | CloudBase |
|------|------|------|
| 数据模型 | SQL 表 + JSONB 列 | 文档数据库（文档级 JSON） |
| 用户 ID | `auth.uid()`（UUID） | `auth.openid`（微信 openid 或手机号 uid） |
| session 恢复 | `getSession()` | `getLoginState()` |
| 手机验证码 | `signInWithOtp({ phone })` | `sendPhoneCode()` + `signInWithPhoneCode()` |
| 微信登录 | OAuth 跳浏览器 | `auth.weixinAuthProvider()` |
| 安全 | PostgreSQL RLS | 文档级权限规则 |
| DB 操作 | `supabase.from().select().eq()` | `db.collection().doc().get()` |
| upsert | `supabase.from().upsert()` | 先 `get()` 判断存在 → `update()` 或 `create()` |

### 8. CloudBase 版文件改动清单

```
新建：
  src/lib/cloudbase.ts         ~15 行
  src/store/authStore.ts       ~120 行（CloudBase SDK）
  src/store/syncEngine.ts      ~120 行（文档数据库 API）
  src/screens/LoginScreen.tsx  ~180 行

修改（每文件 ≤ 5 行）：
  app.json                     +1 行（scheme，微信回调用）
  App.tsx                      +1 行（initialize()）
  AppNavigator.tsx              0 行（路由已注册）
  SettingsScreen.tsx           ~30 行（取消注释）

不动：
  useProgressStore.ts、课程数据、所有 Screen、卡片组件、动画
```

### 9. 风险与规避（CloudBase 特有）

| 风险 | 规避 |
|------|------|
| 权限规则设错 → 数据裸奔 | 创建集合后立即配置安全规则，用不同账号测试互相读写 |
| 微信登录在小程序外不可用 | App 端需集微信开放平台 SDK，见腾讯文档；只做手机号登录可跳过 |
| CloudBase SDK 版本不兼容 Expo | 用 `@cloudbase/js-sdk`（非 `@cloudbase/wx-cloud-client-sdk`），测试通过再提交 |
| API 可能变更 | CloudBase 是商业产品，关注[官方更新日志](https://docs.cloudbase.net/changelog) |
| 免费额度不够 | 按量计费，超过免费额度后按调用量计费（~¥0.5/万次调用），成本可控 |

### 10. 切换方案

从方案 A 切到方案 B（或反过来），对外部的影响：

```
零改动文件：
  useProgressStore、课程数据、所有 Screen、卡片组件、
  AppNavigator、SettingsScreen（扩展口）、主题、动画

只改实现（接口签名不变）：
  authStore.ts    ← selector 签名不变，只换内部实现
  syncEngine.ts   ← 导出函数签名不变，只换内部实现
  lib/supabase.ts → lib/cloudbase.ts  ← 替换 import 源
  LoginScreen.tsx ← UI 结构不变，登录按钮的调用方式微调
```
