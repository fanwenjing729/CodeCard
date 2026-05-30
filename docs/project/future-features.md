# 未来功能实施方案

> 记录已分析的扩展方案，实施时可参考。

---

## 1. 分享

### 改动量：1 个文件，~10 行

### 方案

纯文本分享用 `Share.share()`（React Native 自带，零依赖）。

截图分享需多一个依赖 `react-native-view-shot`。

### 具体改动

**NodeScreen.tsx** — header 区域加分享按钮：

```tsx
// 已有 import
import { Share } from 'react-native';

// 在 header 的返回按钮和进度文字之间加：
<TouchableOpacity
  onPress={() => {
    Share.share({
      message: `我正在学习 C++：${node?.title} —— CodeCard`,
    });
  }}
  activeOpacity={0.7}
>
  <MaterialCommunityIcons name="share-variant" size={20} color="#666" />
</TouchableOpacity>
```

如需截图分享（分享卡片内容图片）：

```bash
npx expo install react-native-view-shot
```

```tsx
import ViewShot from 'react-native-view-shot';
import * as Share from 'expo-sharing';

// 用 ViewShot 包裹卡片区域，ref.current.capture() 截图 → Share.shareAsync(uri)
```

### 不涉及

store、导航、其他 screen、卡片组件、数据模型。

---

## 2. 数据分析 / 埋点

### 改动量：2 个文件，~15 行

### 方案

在 store 的两个关键 action 里各加一行埋点调用。具体 SDK（Firebase Analytics / Mixpanel / Umeng）由 `analytics.track` 的实现决定，store 这边不关心。

### 具体改动

**新建 `src/lib/analytics.ts`**：

```ts
// SDK 初始化 + track 封装
// 初期可先 console.log，后续替换为真实 SDK

export const analytics = {
  track(event: string, data?: Record<string, unknown>) {
    console.log(`[analytics] ${event}`, data);
    // 后续替换为：firebase.analytics().logEvent(event, data);
  },
};
```

**`src/store/useProgressStore.ts`** — 在 `addXP` 和 `completeCard` 中各加 1 行：

```ts
// 文件顶部
import { analytics } from '../lib/analytics';

// addXP 函数体内：
addXP: (courseId, amount) => {
  analytics.track('xp_gained', { courseId, amount });  // ← 加这行
  set((s) => { ... });
},

// completeCard 函数体内：
completeCard: (courseId, cardId) => {
  analytics.track('card_completed', { courseId, cardId });  // ← 加这行
  ...
},
```

### 可选扩展点

- `QuizScreen` 完成测验时加 `quiz_finished` 事件
- `NodeScreen` 完成节点时加 `node_finished` 事件

### 不涉及

所有 screen、卡片组件、数据模型、导航。

---

## 3. 内购 / 订阅

### 改动量：3-4 个文件，~100 行

### 方案

接入 Google Play Billing（国内安卓可用 HMS In-App Purchases 替代）。核心思路：课程内容不变，只在入口加权限判断。

### 数据模型

```typescript
// src/types/index.ts
interface Entitlement {
  id: string;            // e.g. "pro-monthly"
  type: 'subscription' | 'one_time';
  unlocks: string[];     // courseIds，或 '*' 表示全部
}
```

### 具体改动

#### 新建 `src/store/entitlementStore.ts`（~40 行）

```ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EntitlementState {
  unlockedCourses: string[];   // 已解锁的 courseId 列表
  isPremium: boolean;          // 是否为订阅用户
  purchaseDate: string | null; // 最近购买时间

  unlockCourse: (courseId: string) => void;
  setPremium: (value: boolean) => void;
  hydrate: () => Promise<void>;
  flush: () => Promise<void>;
}

const KEY = 'codecard-entitlements';

export const useEntitlementStore = create<EntitlementState>()((set, get) => ({
  unlockedCourses: [],
  isPremium: false,
  purchaseDate: null,

  unlockCourse: (courseId) => {
    set((s) => {
      if (s.unlockedCourses.includes(courseId)) return s;
      return { unlockedCourses: [...s.unlockedCourses, courseId] };
    });
  },

  setPremium: (value) => set({ isPremium: value }),

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set(data);
      }
    } catch {}
  },

  flush: async () => {
    const { unlockedCourses, isPremium, purchaseDate } = get();
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({ unlockedCourses, isPremium, purchaseDate }),
    );
  },
}));
```

#### 修改 `HomeScreen.tsx`（~20 行）

```tsx
// 新增 import
import { TouchableOpacity, Alert } from 'react-native';

// 在课程卡片中判断权限：
const isUnlocked = entitlement.unlockedCourses.includes(course.id) || course.id === 'cpp';

// 未解锁的课程：
<TouchableOpacity
  style={[styles.courseCard, styles.lockedCard]}
  onPress={() => {
    Alert.alert('解锁课程', '升级到 Pro 解锁全部课程', [
      { text: '取消', style: 'cancel' },
      { text: '了解详情', onPress: () => navigation.navigate('Settings') },
    ]);
  }}
>
  {/* 课程标题 + 锁图标 */}
</TouchableOpacity>
```

#### 修改 `SettingsScreen.tsx`（~10 行）

在"数据管理" section 上方加一个"订阅管理" section：

```tsx
<View style={styles.section}>
  <Text style={styles.sectionTitle}>订阅</Text>
  {isPremium ? (
    <>
      <Text style={styles.syncStatus}>Pro 会员，已解锁全部课程</Text>
      <TouchableOpacity style={styles.row} onPress={handleManageSubscription}>
        <Text style={styles.rowText}>管理订阅</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </>
  ) : (
    <>
      <Text style={styles.syncStatus}>解锁全部课程，无限制学习</Text>
      <TouchableOpacity style={styles.row} onPress={handleUpgrade}>
        <Text style={styles.rowText}>升级 Pro</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </>
  )}
  <TouchableOpacity style={styles.row} onPress={handleRestorePurchases}>
    <Text style={styles.rowText}>恢复购买</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
</View>
```

#### 新建 `src/lib/billing.ts`（~30 行）

对接 Google Play Billing / HMS IAP 的购买流程封装。调用 SDK → 成功后更新 `entitlementStore`。

### 不涉及

课程数据文件、所有学习相关 screen、store、卡片组件、导航结构。

---

## 4. iOS 适配

### 改动量：5-6 个文件，~30 行

### 方案

用 `react-native-safe-area-context`（Expo SDK 自带）替换所有硬编码的 `paddingTop`。

### 具体改动

#### 每个 screen 的 header 区域

当前写法（以 `CourseScreen` 为例）：

```tsx
// 当前
header: {
  paddingTop: 64,
  ...
}
```

改为：

```tsx
// 文件顶部
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 组件内
const insets = useSafeAreaInsets();

// 样式
header: {
  paddingTop: insets.top + 12,  // 安全区域 + 12px 内边距
  ...
}
```

需要改的 screen 和当前 `paddingTop` 值：

| 文件 | 当前 | 改为 |
|---|---|---|
| `HomeScreen.tsx` | 可能有硬编码 | `insets.top + N` |
| `CourseScreen.tsx` | `paddingTop: 64` | `insets.top + 12` |
| `ModuleScreen.tsx` | `paddingTop: 64` | `insets.top + 12` |
| `NodeScreen.tsx` | `paddingTop: 64` | `insets.top + 8` |
| `QuizScreen.tsx` | 检查 | `insets.top + N` |
| `ProgressScreen.tsx` | 检查 | `insets.top + N` |
| `SettingsScreen.tsx` | `paddingTop: 64` | `insets.top + 12` |

#### 导航手势冲突

`AppNavigator.tsx` — NodeScreen 卡片翻页与 iOS 返回手势冲突时：

```tsx
<RootStack.Screen
  name="Node"
  component={NodeScreen}
  options={{ gestureEnabled: false }}
/>
```

### 不需要的

`SafeAreaView` 包裹根布局 —— 每个 screen 用 `insets.top` 更精确，不需要改布局层级。

### 不涉及

store、数据模型、卡片组件、动画系统、导航结构。

---

## 改动量总览

| 功能 | 新建文件 | 修改文件 | 总行数 |
|---|---|---|---|
| 分享 | 0 | 1 | ~10 |
| 埋点 | 1 (`analytics.ts`) | 1 (`store`) | ~15 |
| 内购 | 2 (`entitlementStore.ts`, `billing.ts`) | 2 (`HomeScreen`, `SettingsScreen`) | ~100 |
| iOS | 0 | 5-7 | ~30 |

合计 ~155 行新增/改动。所有功能均不改动课程数据、卡片渲染、导航结构。
