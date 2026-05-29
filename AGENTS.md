# File placement

所有项目文件必须放在 `G:\CodeCard\` 下。禁止写入 C 盘。

# Expo version

Read https://docs.expo.dev/versions/v55.0.0/ before writing Expo-related code.

# CRITICAL — What NOT to read

This document IS the source of truth. Do NOT read source files unless listed below.

| Task type | What to read | What NOT to read |
|-----------|-------------|------------------|
| Add course / module / node / card | This doc + `hello-world.ts` (node template) + `01-basics/index.ts` (module template) | Any other file |
| Add animation (any type) | `docs/animation-system.md` — do NOT read source | All source files |
| Fix store / progress bug | `useProgressStore.ts` + the screen reporting the bug | Other screens |
| Change level formula | `src/lib/xp.ts` + `docs/store-invariants.md` | Component files |
| Fix card rendering bug | The specific card component + `renderCard.tsx` | Other components |
| Modify SettingsScreen UI | This doc + `SettingsScreen.tsx` | Other screens |
| Modify ProgressScreen | `ProgressScreen.tsx` only | Other screens |
| Add login / cloud sync / avatar | `docs/auth-sync.md` — do NOT read source | All source files |
| Theme / color / style change | `theme.ts` + `docs/AAAAui-reference.md` — do NOT read components | Component source files |
| Data migration / store structure change | `useProgressStore.ts` + `docs/store-invariants.md` | Other store files, screens |
| Future architecture / scaling change | `docs/scaling.md` — do NOT read source | All source files |
| Add payment / permissions / IAP | `docs/scaling.md` (付费与权限系统) — do NOT read source | All source files |
| Modify backend auth/progress | `backend/src/main/java/com/codecard/` 对应包 — 只读目标 Service | 其他 Service |
| Modify backend security/JWT | `backend/src/main/java/com/codecard/config/SecurityConfig.java` | 其他 config |
| Add backend endpoint | AGENTS.md + 现有 Controller 模板 — 不要读其他 Controller | 其他 Controller |

# Project Architecture

Local-first Android learning app. Card-based micro-learning. Spring Boot backend for auth + progress sync.

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | React Native 0.83.6 + Expo SDK 55 |
| Language | TypeScript 5.9, strict mode |
| Navigation | @react-navigation/native 7 + bottom-tabs + native-stack |
| State | Zustand 5 + manual AsyncStorage persist |
| Animation | react-native-reanimated 4.1.7 + react-native-svg 15 |
| Icons | @expo/vector-icons (MaterialCommunityIcons) |
| Theme | `src/theme.ts` — single source of truth for colors/fonts/spacing |
| Backend | Spring Boot 3.4.1 + Java 21 + PostgreSQL + JWT |
| Auth | BCrypt + HMAC-SHA JWT (access 15min / refresh 30d) + email OTP |
| Sync | REST `/api/v1/progress` — JSONB upsert + client-side merge |

## Theme rules

所有视觉属性必须通过 theme token 引用，禁止硬编码 hex 颜色。

```ts
import { Colors, FontSize, FontWeight, Radius, Spacing, Layout } from '@/theme';
```

加新颜色：在 `theme.ts` 的 `Colors` 对象中加一行，组件用 `Colors.xxx` 引用。暗色模式只需加 `DarkColors` 对象 + toggle，不改任何组件。

```
src/
├── theme.ts                   ← Design tokens
├── types/index.ts            ← All shared TypeScript interfaces
├── lib/
│   ├── api.ts                 ← HTTP client, JWT tokens, auto-refresh on 401
│   └── xp.ts                 ← XP 等级公式（calcLevel / xpForLevelStart / xpForNextLevel）
├── navigation/AppNavigator.tsx ← Root stack + bottom tabs
├── hooks/
│   ├── useAutoSync.ts        ← 进度变化 3s 防抖自动上传
│   ├── usePhoneAuth.ts       ← 手机 OTP 流程封装
│   └── useCourses.ts         ← 课程数据加载
├── store/
│   ├── useProgressStore.ts ← Zustand store (progress, XP, cards)
│   ├── authStore.ts        ← JWT 认证（email/phone + password/OTP）
│   └── syncEngine.ts       ← 进度云端同步（登录合并 + 手动上传）
├── screens/
│   ├── HomeScreen.tsx         ← Course list
│   ├── CourseScreen.tsx       ← Module list
│   ├── ModuleScreen.tsx       ← Node list
│   ├── NodeScreen.tsx         ← Card swiping + useNodeScreen hook
│   ├── QuizScreen.tsx         ← Quiz mode
│   ├── ProgressScreen.tsx     ← Level ring + progress bars
│   ├── SettingsScreen.tsx     ← Avatar + sync + reset + about
│   ├── DataScreen.tsx         ← Data management
│   ├── WrongCardsScreen.tsx   ← Wrong answer review
│   ├── LoginScreen.tsx        ← 密码/邮箱OTP/手机OTP/找回密码
│   ├── RegisterScreen.tsx     ← 两步注册（OTP验证 → 设密码）
│   └── AccountScreen.tsx      ← 换头像/改用户名/退出登录
├── components/
│   ├── cards/
│   │   ├── renderCard.tsx     ← Card type dispatcher
│   │   ├── ConceptCard.tsx    ← TextContent
│   │   ├── CodeCard.tsx       ← CodeContent
│   │   ├── PracticeCard.tsx   ← Wraps QuestionRenderer
│   │   └── QuestionRenderer.tsx ← Shared question UI
│   ├── animations/
│   │   ├── MemoryBox.tsx, ScopeCodePlayer.tsx, BranchPlayer.tsx
│   │   ├── LoopPlayer.tsx, BreakContinuePlayer.tsx, WhileDoWhilePlayer.tsx
│   │   ├── LottiePlayer.tsx
│   │   └── shared/ (CodeBlock, GridRenderer, VarLabel, AddressColumn)
│   └── shared/ (ScreenHeader, ErrorBoundary, ListItem)
└── data/
    ├── courses/index.ts       ← Course registry
    ├── courses/cpp/           ← C++ course
    └── animations/index.ts    ← Animation registry

backend/
├── pom.xml                    ← Spring Boot 3.4.1 + Java 21
├── src/main/java/com/codecard/
│   ├── auth/                  ← 认证（register/login/OTP/refresh/logout）
│   ├── config/                ← SecurityConfig, JwtService, JwtAuthFilter, CORS
│   ├── progress/              ← 进度同步（JSONB upsert/merge）
│   └── user/                  ← 用户实体
├── src/main/resources/
│   ├── application.yml        ← DB/JWT/SMTP 配置
│   └── schema.sql             ← PostgreSQL DDL
└── src/test/                  ← 13 个集成测试（auth + progress）
```

## Data model (src/types/index.ts)

```typescript
Course { id, title, icon, color, nodes: PathNode[] }

PathNode {
  id, courseId, type: 'knowledge' | 'quiz',
  moduleId: 'basics' | 'advanced' | 'oop' | 'streams' | 'stl' | 'generics' | 'modern' | 'engineering',
  module: string, title: string, cards: Card[]
}

Card { id, cardType: 'concept' | 'code' | 'animation' | 'practice',
  content: TextContent | CodeContent | AnimationContent | PracticeContent }

TextContent   { title, body }
CodeContent   { title, code, language, highlights: number[] }
AnimationContent { animationId }  // key in animationRegistry
PracticeContent { question, questionType: 'choice' | 'fill', options?, answer, explanation }
```

Animation types: see `docs/animation-system.md` and `src/types/index.ts`.

## Store (src/store/useProgressStore.ts)

```
State: { global: { totalXP, level }, courses: Record<string, CourseProgress> }
CourseProgress: { completedCards: Record<string, true>, wrongCards: Record<string, true>,
                  xp, quizScores: Record<string, number>, nodePositions: Record<string, number> }
```

| Action | Purpose |
|--------|---------|
| `addXP(courseId, amount)` | Add XP to course + global, recalc level |
| `rewardCard(courseId, cardId, xp)` | Mark complete + add XP (dedup inside set()) |
| `saveQuizScore(courseId, nodeId, score)` | Save quiz result |
| `setNodePosition(courseId, nodeId, cardIndex)` | Save reading position |
| `addWrongCard / removeWrongCard` | Manage wrong answer tracking |
| `resetCourse(courseId)` | Clear one course, dedcut global XP |
| `hydrate() / flush()` | Load/save from AsyncStorage |
| `hydrated: boolean` | True after hydration complete |

### Persistence

- Zustand `subscribe()` debounced 500ms, `saveIfDirty()` skips unchanged writes
- `AppState.addEventListener('change')` flush on background
- Manual `JSON.parse/stringify`, no middleware (avoids Fabric compat)
- Versioned: `CURRENT_VERSION` + `MIGRATIONS` chain in `hydrate()`

### Data migration (3 steps)

1. Bump `CURRENT_VERSION`
2. Add migration function to `MIGRATIONS` table
3. Update TypeScript types if needed

Old user data auto-migrates on next `hydrate()`. See `useProgressStore.ts` for examples.

## Navigation

```
RootStack (NativeStack, headerShown: false)
  ├── MainTabs (BottomTab: Learn / Progress / Settings)
  ├── Course(courseId) → Module(courseId, moduleId)
  ├── Node(courseId, nodeId) → Quiz(courseId, nodeId)
  ├── WrongCards(courseId?) → Data → Login → Register → Account
```

## Error Boundary

`src/components/shared/ErrorBoundary.tsx` wraps NavigationContainer. On crash: flushes progress, shows retry UI.

## How screens read data

| Screen | Reads from store | Reads from static data |
|--------|:--:|:--:|
| HomeScreen | — | `courses` |
| CourseScreen | `courses[courseId].completedCards` | `courses.find()` |
| ModuleScreen | `courses[courseId].completedCards` | `courses.find()` |
| NodeScreen | `rewardCard`, `setNodePosition`, `nodePositions`, `addWrongCard`, `removeWrongCard` | `courses.find()` |
| QuizScreen | `rewardCard`, `addWrongCard`, `removeWrongCard`, `saveQuizScore` | `courses.find()` |
| ProgressScreen | `global.totalXP`, `global.level`, `courses` | `courses` |
| SettingsScreen | `user`, `isLoggedIn` (auth), `resetCourse`, `flush` (progress) | `courses` |

## Card rendering

```
NodeScreen → renderCard({card, animStep, ...})
  ├── concept   → ConceptCard(content)
  ├── code      → CodeCard(content)
  ├── animation → getAnimComponent(animId) → player component
  └── practice  → PracticeCard → QuestionRenderer
```

QuizScreen uses QuestionRenderer directly.

## Content authoring

### 零代码原则

新课程、新模块、新节点 = 纯数据文件。以下文件**永远不用改**：

| 层 | 原因 |
|----|------|
| `useProgressStore` | `courses: Record<string, CourseProgress>` — key 任意 |
| `HomeScreen` / `CourseScreen` / `ModuleScreen` | 从 `courses` 数组动态渲染 |
| `NodeScreen` / `renderCard` | 只接收 `card` 对象，不关心课程 |
| `ProgressScreen` / `DataScreen` | 遍历 `courses` 状态动态生成列表 |
| `AppNavigator` | 路由参数 `courseId: string`，不硬编码课程 |
| `types/index.ts` | `Course`/`PathNode`/`Card` 接口是泛型的 |

### Add a course（3 步）

以添加 `python` 课程为例：

```
1. 创建目录 src/data/courses/python/
2. 创建模块目录 + 节点文件（按下面"Add a node"的格式）
   python/
   ├── 01-basics/
   │   ├── index.ts          ← 模块注册
   │   ├── hello-world.ts    ← 一个节点 = 一个文件
   │   └── variables.ts
   └── index.ts              ← 课程注册

3. 在 src/data/courses/index.ts 加一行：
   import { pythonCourse } from './python';
   export const courses = [cppCourse, pythonCourse];
```

课程注册文件 `src/data/courses/python/index.ts` 模板：

```typescript
import type { Course, CourseModule, ModuleMeta } from '@/types';
import { basicsModule } from './01-basics';
// import more modules...

const modules: CourseModule[] = [basicsModule];

export const pythonCourse: Course = {
  id: 'python',                     // 唯一，用于路由和存储 key
  title: 'Python',
  icon: 'language-python',          // MaterialCommunityIcons 名字
  color: '#4a9eff',                 // 主题色
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.length,
  modulesMeta: modules.map(m => ({ moduleId: m.moduleId, module: m.module })),
};
```

### Add a module（3 步）

以给 `python` 课程添加 `02-advanced` 模块为例：

```
1. 创建目录 src/data/courses/python/02-advanced/
2. 创建节点文件 + 模块 index.ts（按下面"Add a node"的格式）
3. 在 src/data/courses/python/index.ts 里 import 并加入 modules 数组
```

模块注册文件 `src/data/courses/python/02-advanced/index.ts` 模板：

```typescript
import type { CourseModule } from '@/types';
import { myNode } from './my-node';
// import more nodes...

export const advancedModule: CourseModule = {
  moduleId: 'advanced',             // 存储 key，课程内唯一
  module: '进阶',                    // 显示名称
  nodes: [myNode],
};
```

### Add a node（3 步）

```
1. 创建 src/data/courses/{course}/{module}/{topic}.ts
   文件名: kebab-case（如 hello-world.ts）
   导出名: camelCase + Node 后缀（如 helloWorldNode）

2. 在该模块的 index.ts 里 import + 加入 nodes 数组

3. 节点文件模板见下方 Card templates
```

### Module IDs — 当前 C++ 课程

`ModuleId = string`，每门课自定义。

| Folder | moduleId | module |
|--------|----------|--------|
| 01-basics | `basics` | 基础 |
| 02-advanced | `advanced` | 进阶 |
| 03-oop | `oop` | 面向对象 |
| 04-streams | `streams` | 流与文件 |
| 05-stl | `stl` | STL |
| 06-generics | `generics` | 泛型 |
| 07-modern | `modern` | 现代 C++ |
| 08-engineering | `engineering` | 工程化 |

其他课程用各自的 moduleId 体系，新增课程自由定义。

### Card ID: `{courseId}-{moduleId}-{topic}-c{seq}`

示例：`cpp-02-pointer-c3` = C++ 课程 · 进阶模块 · 指针节点 · 第 3 张卡。

### Node 文件模板

```typescript
import type { PathNode } from '@/types';

export const helloWorldNode: PathNode = {
  id: 'python-01-hello-world',   // {courseId}-{两位模块序号}-{topic}
  courseId: 'python',
  type: 'knowledge',              // 'knowledge' 或 'quiz'
  moduleId: 'basics',
  module: '基础',
  title: '第一个程序',
  cards: [
    // 卡片数组，见下方模板
  ],
};
```

### Card templates

```typescript
// concept — 概念讲解
{ cardType: 'concept', content: { title: '标题', body: '正文（支持 \\n 换行）' } }

// code — 代码展示
{ cardType: 'code', content: {
  title: '标题', code: 'int main() { ... }', language: 'cpp',
  highlights: [0, 2]   // 高亮行号（0-based）
} }

// animation — 动画（animationId 见 src/data/animations/index.ts）
{ cardType: 'animation', content: { animationId: 'pointer-intro' } }

// practice (choice) — 选择题
{ cardType: 'practice', content: {
  question: '...', questionType: 'choice',
  options: ['A','B','C','D'], answer: 'B', explanation: '...'
} }

// practice (fill) — 填空题
{ cardType: 'practice', content: {
  question: '...', questionType: 'fill',
  answer: 'main', explanation: '...'
} }
```

### 完整示例：python/01-basics/hello-world.ts

```typescript
import type { PathNode } from '@/types';

export const helloWorldNode: PathNode = {
  id: 'python-01-hello-world',
  courseId: 'python',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: '第一个程序',
  cards: [
    {
      id: 'python-01-hello-world-c1',
      cardType: 'concept',
      content: {
        title: 'Hello World 是什么',
        body: [
          'print() 是 Python 最常用的输出函数。',
          '',
          '  print("Hello World")  // 在屏幕上显示 Hello World',
          '',
          'Python 不需要 main 函数，代码从上到下直接执行。',
        ].join('\n'),
      },
    },
    {
      id: 'python-01-hello-world-c2',
      cardType: 'code',
      content: {
        title: '第一个 Python 程序',
        code: 'print("Hello World")',
        language: 'python',
        highlights: [0],
      },
    },
    {
      id: 'python-01-hello-world-c3',
      cardType: 'practice',
      content: {
        question: 'Python 中用于输出的函数是？',
        questionType: 'fill',
        answer: 'print',
        explanation: 'print() 是 Python 的标准输出函数。',
      },
    },
  ],
};
```

### 逐个认识节点内容

翻一两个已有节点文件就能掌握写法。推荐先看：

| 想学的内容 | 看这个文件 |
|-----------|-----------|
| 概念卡（有列表、对比） | `01-basics/variables.ts` |
| 代码卡（多行高亮） | `02-advanced/pointer.ts` c5 |
| 练习题（选择和填空） | `01-basics/function.ts` c7-c10 |
| 动画卡 | `02-advanced/dynamic-memory.ts` c3 |
| 完整节点结构 | `02-advanced/memory-four-regions.ts` |

## SettingsScreen layout

```
┌─ Avatar (96px) + displayId + phone + sync status ─┐
├─ Reset course per subject ─────────────────────────┤
├─ ╔═ Danger zone: clear all data ═╗ ───────────────┤
├─ About / version / tech ───────────────────────────┤
└────────────────────────────────────────────────────┘
```

- Avatar tap → LoginScreen (if not logged in)
- displayId tap → Modal edit
- Reset/clear → confirmation dialog
- Danger zone only renders when `hasProgress`

## WrongCardsScreen

Two-level navigation: `WrongCards` (course list) → `WrongCards { courseId }` (detail).
- Stores only `cardId` in `wrongCards: Record<string, true>`
- Content resolved at render time from static data — no stale copies
- Auto-removes when answered correctly in NodeScreen/QuizScreen

## Conventions

- `\n` for line breaks, not `\r\n`
- Answer comparison: `trim().toLowerCase()`
- React keys: `card.id`
- XP: level N needs N×100 XP（由 `src/lib/xp.ts` 的 `XP_PER_LEVEL` 控制，当前值 100），level 1 starts at 0
- All imports use `@/` path alias
- Colors: `import { Colors } from '@/theme'`, never hardcoded hex
- `theme.ts` is single source of truth — change a token, entire app updates
- `ScreenHeader` compact variant: `paddingTop: insets.top + 33`

## 已知风险：课程导入链断裂

### 问题

`src/data/courses/index.ts` 是课程数据的**唯一入口**，所有课程通过静态 `import` 聚合：

```ts
import { cppCourse } from './cpp';
export const courses: Course[] = [cppCourse];
```

任意一个子文件有**语法错误**（如少了一个逗号、类型不匹配）→ 整个 `import` 链断裂 → `courses` 全部加载失败 → HomeScreen 白屏。

**只有这个地方有蝴蝶效应，其他层都有独立容错。**

### 为什么现在不修

1. **用户碰不到**：语法错误在 Metro bundler **构建阶段**就报错，APK 打不出来
2. **已有安全网**：`npm test` 里的 `validate.test.ts` 遍历所有卡片验证完整性，提交前必跑
3. **当前只有 1 门课程、1 个编辑者**：变更频率低，影响范围小

### 什么时候修

满足以下**任意一条**就重构：

| 触发条件 | 原因 |
|----------|------|
| 课程 ≥ 3 门 | import 链变长，概率上升 |
| 多人同时编辑课程文件 | 合并冲突 + 语法错风险叠加 |
| 需要运行时热加载（如 CDN 下发课程） | 静态 import 根本不支持 |
| 用户侧报告过因课程加载导致白屏 | 实际发生过的 bug 优先修 |

### 怎么修（方案 B：动态 import + 容错加载）

**一次改 2 个文件，consumer 不受影响。**

**1. `src/lib/useCourses.ts` — 改为异步容错加载**

```ts
// getCourses() 改为 async，每个课程独立 try-catch
export async function getCourses(): Promise<Course[]> {
  const modules = [
    () => import('@/data/courses/cpp'),
    // 新课程在此加一行
  ];

  const results = await Promise.allSettled(modules.map(fn => fn()));
  const courses: Course[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      courses.push(r.value.cppCourse); // 导出名需统一
    } else {
      console.warn('[useCourses] 课程加载失败，已跳过', r.reason);
    }
  }
  return courses;
}

// hook 也改为 async
export function useCourse(courseId: string): Course | undefined {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => { getCourses().then(setCourses); }, []);
  return useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
}
```

**2. 所有课程 `index.ts` — 统一导出名 `xxxCourse`**

```ts
// 每个课程目录的 index.ts 统一 export const xxxCourse: Course = {...}
export const cppCourse: Course = { ... };
```

**改完后效果：**

- 一门课语法错了 → 仅那门课不加载，其他课正常
- 控制台 warn 提示具体是哪门课加载失败
- Screen 用 `useCourse` 找不到课程时显示"课程未找到"兜底 UI（已有）

**成本：** 实际改动 ~30 行，只改 `src/lib/useCourses.ts` 一个文件，8 个 screen 零改动。

---

## 已知问题

### 最近修复 (2026-05-29)

| # | 文件 | 修复内容 |
|---|------|----------|
| B1 | `OtpService.java` | OTP 先发邮件/短信再入库，发送失败不残留无效 code |
| B2 | `AuthService.java` | `register` 加 email/phone 必填校验 |
| B3 | `authStore.ts` | `setDisplayId` API 失败时回滚乐观更新；`updateAvatar` 同步上传服务器 |
| B4 | `SecurityConfig.java` | 启用 `.cors()` + `CorsConfigurationSource`，读取 `cors.allowed-origins` |
| B5 | `AuthService.java` | `setPassword` 加长度 ≥6 校验 |
| B6 | `authStore.ts` | `verifyEmailOtp` 补上 `isNewUser` 返回值 |
| B7 | `QuizScreen.tsx` | `scoreRef.current = score` 移入 `useEffect` |
| O1 | `api.ts` | token 刷新加互斥锁，并发 401 共享同一次刷新 |
| O2 | `OtpService.java` | OTP 范围改为 100000–999999，不再出 `000000` |
| O3 | `syncEngine.ts` + `useProgressStore.ts` | 新增 `hasEverPlayed` 标记，新设备首次同步以服务端为准 |
| O4 | `authStore.ts` | `initialize` 恢复本地 avatar 时同步上传服务器 |
| O5 | `ProgressScreen.tsx` | 课程进度计算用 `useMemo` 缓存 |

### 后端

#### 1. SMS 未实现（已有降级方案，见 `docs/sms-defer.md`）

`OtpService.sendCode()` 对手机号抛异常提示"请使用邮箱验证码"。前端 LoginScreen / RegisterScreen 在手机号发送失败时弹出 Alert 引导切换到邮箱流程。

- **当前**：手机号入口保留，用户使用时会收到明确提示并自动切换到邮箱验证码
- **何时接 SMS**：拿到企业营业执照后，改 3 处即可（`OtpService` + `LoginScreen` + `RegisterScreen`），详见 `docs/sms-defer.md`

#### 2. 无登录/注册限流

OTP 发送有 60s 频率限制，但 `POST /auth/login` 和 `POST /auth/register` 无任何限流保护。

- **修复**：加 Spring 拦截器或在 Nginx/网关层配 rate limit

#### 3. 进度同步无版本冲突检测

`POST /progress/sync` 的同步是弱一致性——服务端有数据就返回服务端的，客户端自行合并。客户端传了 `version` 字段但后端不校验。

- **当前影响**：单设备场景零风险；多设备同时 sync 时依赖客户端合并逻辑的正确性
- **修复时机**：多设备用户出现后再加固（加乐观锁 `WHERE version < :clientVersion`）

#### 4. 后端测试依赖 Java 21

`E:\JDK` 是 Java 25，集成测试因 Mockito 不兼容 Java 25 绕过 `@SpringBootTest` 手工启动应用。如果改用 Java 21 可直接用标准 Spring Boot Test 框架。

### 前端

#### 5. docs/auth-sync.md 过时

整篇文档描述 Supabase 方案，但实际代码用 Spring Boot JWT。文档和代码不匹配。

- **影响**：新人看文档会误以为需要配 Supabase
- **修复**：重写为 Spring Boot 版本，或保留作为"方案 A（未采用）"归档

#### 6. Screen 层零测试

12 个 Screen、AppNavigator、hooks 全部无测试。当前 145 个测试全是纯函数/组件单元测试。

- **修复时机**：引入 `@testing-library/react-native` 后补关键流程（登录→同步→学卡→登出）

#### 7. `registerByEmail` 无 UI 入口

`authStore.registerByEmail(email, password)` 直接调 `POST /auth/register`，一步完成注册+登录。但 RegisterScreen 只用 OTP 两步流程（验证码→设密码），`registerByEmail` 没暴露给用户。

### 基础设施

#### 8. 后端无请求日志持久化

`TraceIdFilter` 给每个请求加了 traceId，但没有写入日志文件或输出到 stdout。生产排障需要。

- **修复**：配 Spring Boot logging 输出 JSON 格式 + traceId 字段，或接入 ELK/Loki

#### 9. 无 CI/CD

前后端测试都是本地手动跑。没有 GitHub Actions 或其他 CI 流程。

- **修复时机**：多人协作或频繁发版前配置
