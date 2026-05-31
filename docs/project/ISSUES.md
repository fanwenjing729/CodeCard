# 已知问题与修复方案

最后更新：2026-05-31

---

### #3 进度同步版本冲突（2026-05-31）

`ProgressService.syncProgress()` 加版本比较：客户端版本 > 服务端 → 覆盖保存；客户端版本 < 服务端 → 返回服务端数据 + merged=true。

**改动**：`ProgressService.java`（~10 行），`ProgressIntegrationTest.java`（调整测试用例）。

---

## ✅ 已修复

### #2 登录/注册限流（2026-05-31）

RateLimitFilter 已实现，Bucket4j 令牌桶算法，IP+path 粒度限流。

**改动**：新建 `RateLimitFilter.java`（119 行），`SecurityConfig.java` 构造器注入 + 注册到 filter 链最前面，`application-local.yml` 本地关闭限流。

**限流规则**：login 10/min, register 3/min, send-otp 3/min, verify-otp 5/min。

### #5 auth-sync.md 过时（2026-05-31）

已重写为 Spring Boot JWT 架构，从 978 行 Supabase 内容精简到 191 行实际代码文档。

### #8 请求日志（2026-05-30）

`TraceIdFilter` 已加 JSON 格式请求日志，每条输出 method + path + status + duration + traceId。

### #9 CI/CD（2026-05-29）

前后端 CI workflow 已上线，push master 自动跑测试。

---

## 📋 方案已设计

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

**现状**：hooks 层 16 个测试文件，Screen 层 0 个。

**策略**（按难度分三级）：

| 级别 | Screen | 测什么 |
|------|--------|--------|
| 低 | HomeScreen, CourseScreen, ModuleScreen | 给 mock courses，断言列表渲染 |
| 中 | NodeScreen, QuizScreen | 划卡/答题触发的 store action |
| 高 | LoginScreen, RegisterScreen | 网络请求 mock + OTP 流程 |

**工具**：vitest + `react-test-renderer`（与现有测试一致，无需新依赖）。

**时机**：新增卡片类型时（需要验证渲染调度） / 报告 Screen 层 bug 时（复现 + 防回退）。

**关联**：暗色模式需要先补 3 个基础 Screen 的测试，否则切换主题系统无安全网。

#### 实施指南

以下内容可直接用于实现，无需再读源码。

##### 文件位置

```
src/screens/HomeScreen.test.tsx
src/screens/CourseScreen.test.tsx
src/screens/ModuleScreen.test.tsx
```

##### 参考模板

`src/screens/useNodeScreen.test.ts` — 使用 TestRenderer + `vi.mock()` + `renderHook` 模式。

##### 共享 mock（每个 Screen 测试文件都需要）

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { createElement } from 'react';
import TestRenderer from 'react-test-renderer';

// ── 1. react-native 基础组件 ──
vi.mock('react-native', () => ({
  StyleSheet: { create: (s) => s },
  Text: 'Text' as any,
  View: 'View' as any,
  ScrollView: 'ScrollView' as any,
  TouchableOpacity: 'TouchableOpacity' as any,
}));

// ── 2. 导航 ──
vi.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: vi.fn() }),
}));

// ── 3. 安全区域 ──
vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// ── 4. 图标 ──
vi.mock('@expo/vector-icons/MaterialCommunityIcons', () => ({
  default: 'MaterialCommunityIcons' as any,
}));

// ── 5. 主题（useColors 返回完整 Colors 副本） ──
vi.mock('@/theme', () => {
  const Colors = {
    primary: '#5B7FFF', success: '#34D399', danger: '#EF4444', warning: '#F59E0B',
    bg: '#fff', bgSecondary: '#f8f9fa', bgTertiary: '#f5f5f5',
    text: '#222', textSecondary: '#666', textMuted: '#999', textPlaceholder: '#bbb',
    textInverse: '#fff', bodyText: '#444',
    border: '#eee', borderLight: '#d0d0d0', arrow: '#ccc',
    codeBg: '#1e1e1e', codeText: '#d4d4d4', codeLineNum: '#888', codeHighlightBg: '#ffffff18',
    correctBg: '#d4edda', wrongBg: '#f8d7da', progressBarBg: '#e8edf2',
    tabBarActive: '#5B7FFF', tabBarInactive: '#999', tabBarBorder: '#e0e0e0',
    disabledBg: '#8899aa', disabledText: '#aaa',
    optionBg: '#f0f4ff', optionSelectedBg: '#cce5ff', optionBorder: '#d0d8f0', optionText: '#333',
    fillInputBg: '#fafafa', explanationText: '#555',
    wrongBorder: '#ff6b6b', dangerBorder: '#ffccd5', inputBorder: '#ddd',
    backdrop: 'rgba(0,0,0,0.35)', gridEmpty: '#2a2a3e', gridEmptyStroke: '#3a3a4e',
    animCodeConditionBg: 'rgba(74,158,255,0.20)', animCodeActiveBg: 'rgba(46,213,115,0.18)',
    animCodeSkippedBg: 'rgba(153,153,153,0.10)', animBadgeSuccess: 'rgba(46,213,115,0.12)',
    animBadgeMuted: 'rgba(153,153,153,0.12)', textInverseSecondary: 'rgba(255,255,255,0.8)',
  };
  return {
    Colors,
    ...Colors,
    FontSize: { xs: 11, sm: 12, base: 15, md: 16, lg: 18, xl: 20, xxl: 24, headline: 22 },
    FontFamily: { sans: 'Inter', sansBold: 'Inter-Bold', mono: 'monospace' },
    FontWeight: { normal: '400', semibold: '600', bold: '800' },
    Radius: { sm: 6, md: 10, lg: 14, xl: 20 },
    Spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    Layout: {},
    useColors: () => Colors,
    useTheme: () => ({ isDark: false, toggle: () => {} }),
  };
});

// ── 6. Zustand store ──
const mockStore = {
  courses: {} as Record<string, any>,
  hydrated: true,
};
vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: (selector: any) => selector(mockStore),
}));

// ── 7. useCourses / useCourse ──
// HomeScreen 用 useCourses，CourseScreen/ModuleScreen 用 useCourse
vi.mock('@/lib/useCourses', () => ({
  useCourses: () => [{ id: 'cpp', title: 'C++', icon: 'language-cpp', color: '#5B7FFF', nodes: [], moduleCount: 2, modulesMeta: [] }],
  useCourse: (id: string) => ({ id: 'cpp', title: 'C++', icon: 'language-cpp', color: '#5B7FFF', nodes: [], moduleCount: 2, modulesMeta: [] }),
}));

// ── 8. 课程进度计数 ──
vi.mock('@/lib/courseProgress', () => ({
  countNodeCards: () => ({ total: 10, done: 3, pct: 30 }),
  countCards: () => ({ total: 5, done: 2 }),
}));

// ── 9. 共享组件 ──
vi.mock('@/components/shared/ScreenHeader', () => ({ default: 'ScreenHeader' }));
vi.mock('@/components/shared/ListItem', () => ({ default: 'ListItem' }));
vi.mock('@/components/shared/Skeleton', () => ({ default: 'Skeleton' }));
```

##### HomeScreen 测试用例

```typescript
import HomeScreen from './HomeScreen';

function renderScreen() {
  const el = TestRenderer.create(React.createElement(HomeScreen, {} as any));
  return el.root;
}

describe('HomeScreen', () => {
  beforeEach(() => {
    mockStore.hydrated = true;
    mockStore.courses = {};
  });

  it('shows skeleton while not hydrated', () => {
    mockStore.hydrated = false;
    const root = renderScreen();
    expect(root.findAllByType('Skeleton' as any).length).toBeGreaterThan(0);
  });

  it('renders course list after hydration', () => {
    const root = renderScreen();
    const items = root.findAllByType('TouchableOpacity' as any);
    expect(items.length).toBeGreaterThan(0);
  });

  it('shows module count and card count for each course', () => {
    const root = renderScreen();
    const texts = root.findAllByType('Text' as any);
    const subtitle = texts.find(t => t.props.children?.includes('模块'));
    expect(subtitle).toBeTruthy();
  });

  it('shows progress bar when course has cards', () => {
    const root = renderScreen();
    const views = root.findAllByType('View' as any);
    const miniBar = views.filter(v => v.props.style?.height === 4);
    expect(miniBar.length).toBeGreaterThan(0);
  });
});
```

##### CourseScreen 测试用例

```typescript
import CourseScreen from './CourseScreen';

const route = { params: { courseId: 'cpp' } };
const navigation = { goBack: vi.fn(), setOptions: vi.fn() };

function renderScreen() {
  return TestRenderer.create(
    React.createElement(CourseScreen, { route, navigation } as any)
  ).root;
}

describe('CourseScreen', () => {
  beforeEach(() => {
    mockStore.courses = { cpp: { completedCards: {} } };
  });

  it('renders module list', () => {
    const root = renderScreen();
    expect(root.findAllByType('ListItem' as any).length).toBeGreaterThan(0);
  });

  it('shows "暂无课程内容" when no modules', () => {
    // 覆盖 useCourse mock 返回空 nodes
    const root = renderScreen();
    const texts = root.findAllByType('Text' as any);
    expect(texts.some(t => t.props.children === '暂无课程内容')).toBe(true);
  });
});
```

##### ModuleScreen 测试用例

```typescript
import ModuleScreen from './ModuleScreen';

const route = { params: { courseId: 'cpp', moduleId: 'basics' } };
const navigation = { goBack: vi.fn(), setOptions: vi.fn() };

function renderScreen() {
  return TestRenderer.create(
    React.createElement(ModuleScreen, { route, navigation } as any)
  ).root;
}

describe('ModuleScreen', () => {
  beforeEach(() => {
    mockStore.courses = { cpp: { completedCards: {} } };
  });

  it('renders node list for the module', () => {
    const root = renderScreen();
    expect(root.findAllByType('ListItem' as any).length).toBeGreaterThan(0);
  });

  it('shows "暂无内容" when module has no nodes', () => {
    const root = renderScreen();
    const texts = root.findAllByType('Text' as any);
    expect(texts.some(t => t.props.children === '暂无内容')).toBe(true);
  });

  it('shows empty state for nodes with 0 cards', () => {
    const root = renderScreen();
    const texts = root.findAllByType('Text' as any);
    expect(texts.some(t => t.props.children === '敬请期待')).toBe(true);
  });
});
```

##### 实现顺序

1. 复制共享 mock 到 `HomeScreen.test.tsx`，跑通骨架屏 + 列表渲染
2. 复用 mock 到 `CourseScreen.test.tsx`，替换 `useCourse` mock 返回带 modulesMeta 的课程
3. 复用 mock 到 `ModuleScreen.test.tsx`，替换 `useCourse` mock 返回带 nodes 的课程

##### 注意事项

- **不需要**安装新依赖。vitest + react-test-renderer 已有。
- **不需要**测 navigate 回调（navigation mock 只是存根），只测渲染输出。
- `useCourse` mock 需要按测试用例定制（不同 Screen 需要不同的 course 结构），可用 `vi.fn()` 替换默认返回值。
- mock `countNodeCards` / `countCards` 返回固定值，不测真实计算逻辑（那些在 `lib/courseProgress.test.ts` 已覆盖）。
- 所有 `Text`/`View` mock 为字符串标签，不渲染真实 DOM。用 `root.findAllByType('Text')` + `.props.children` 断言文本内容。

工作量和覆盖范围总结见 [2026-05-31 分析](#screen-层集成测试分析)。

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
