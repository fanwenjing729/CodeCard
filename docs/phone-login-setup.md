# 手机号登录接入指南

代码已支持手机号验证码登录，只需在 Supabase 控制台完成以下配置即可启用。

## 第 1 步：开启 Phone Auth

1. 打开 Supabase Dashboard → **Authentication** → **Phone**
2. 点击 **Enable Phone Signup** 开关
3. 选择 SMS 提供商（见下方）

## 第 2 步：配置 SMS 提供商

三选一，按需选择：

| 提供商 | 免费额度 | 国内支持 | 配置难度 |
|--------|:--:|:--:|:--:|
| **Twilio** | 无（按量付费 ~¥0.05/条） | 需实名 | 中 |
| **MessageBird** | 无（按量付费） | 一般 | 低 |
| **Vonage** | 无（按量付费） | 一般 | 低 |

### Twilio（推荐）

1. 注册 [Twilio](https://twilio.com)，完成实名认证
2. 获取 `Account SID`、`Auth Token`、`Phone Number`
3. 在 Supabase Dashboard → Authentication → Phone → Twilio 填入
4. 手机号格式：`+8613800138000`（国际格式，不含空格）

### MessageBird

1. 注册 [MessageBird](https://messagebird.com)
2. 获取 `Access Key`
3. 在 Supabase Dashboard → Authentication → Phone → MessageBird 填入

## 第 3 步：测试

1. `npx expo start --clear` 重启 App
2. 打开 LoginScreen → 点击「手机号登录」
3. 输入手机号（格式 `+8613800138000`）→ 点击发送
4. 收到短信后填入验证码 → 点击登录

## 代码接口

手机号登录的核心逻辑封装在 `usePhoneAuth` hook：

```typescript
import { usePhoneAuth } from '@/hooks/usePhoneAuth';

const { sendCode, verifyCode, countdown, sending, loading } = usePhoneAuth();

// 发送验证码（自动 60s 倒计时）
await sendCode('+8613800138000');

// 验证验证码（成功后自动登录，isNewUser 标识新注册）
const { error, isNewUser } = await verifyCode('+8613800138000', '123456');
```

底层调用 `authStore` 的 `sendPhoneOtp` / `verifyPhoneOtp`，通过 Supabase Phone Auth 完成认证。

## 当前状态

| 事项 | 状态 |
|------|:--:|
| 代码（authStore / LoginScreen / RegisterScreen / usePhoneAuth） | ✅ 已完成 |
| Supabase Phone Auth 开启 | ⬜ 待配置 |
| SMS 提供商配置 | ⬜ 待配置 |

代码侧无需任何改动。配置完 Supabase 后，手机号登录立即可用。
