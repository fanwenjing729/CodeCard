# 前端待办

## 状态

全部分析中，均未开始。

---

## 1. Screen 层集成测试

### 现状

```
hooks    18 条 ✓ (useNodeScreen.test.ts + useAutoSync.test.ts)
screen    0 条
全量    163 条 (components/utils/lib 等)
```

12 个 Screen + AppNavigator 零集成测试。

### 为什么没写

Screen 测试在 React Native 里很重：需要 mock navigation、mock store、mock 动画。成本高于收益时先不写。

### 什么时候写

AGENTS.md 已经定了两条信号：
1. 新增卡片类型时 → 补对应 Screen 的测试（渲染调度逻辑变了）
2. 报告 Screen 层 bug 时 → 补测试复现（防回退）

### 怎么测试

三个难度等级：

| 级别 | Screen | 测什么 | 难度 |
|------|--------|--------|------|
| 纯数据渲染 | HomeScreen, CourseScreen, ModuleScreen | 给 mock courses 数据，断言列表项数正确 | 低 |
| 交互逻辑 | NodeScreen, QuizScreen | 划卡 call `rewardCard`，答题 call `saveQuizScore` | 中 |
| 认证流程 | LoginScreen, RegisterScreen | OTP 发送/验证、错误提示 | 高（mock 网络） |

推荐顺序：HomeScreen → CourseScreen → ModuleScreen（纯数据渲染，最稳定，一次学会模式可复用）。

### 测试工具栈

```ts
// HomeScreen 测试示例
import { render, screen } from '@testing-library/react-native';
import { useCourses } from '@/hooks/useCourses';

jest.mock('@/hooks/useCourses');

test('renders course list', () => {
  (useCourses as jest.Mock).mockReturnValue([
    { id: 'cpp', title: 'C++', icon: 'language-cpp', color: '#4a9eff', nodes: [] },
  ]);
  render(<HomeScreen />);
  expect(screen.getByText('C++')).toBeTruthy();
});
```

---

## 2. 暗色模式

### 现状

`theme.ts` 已经预留了结构：

```ts
export const Colors = { ... };      // 亮色
export const DarkColors = { ... };  // 暗色（目前和亮色一样）
```

技术债：所有组件都引 `Colors`，没有任何一个地方读用户的 theme preference。

### 做什么

总共改 3 层：

```
Step 1: theme.ts
  - DarkColors 填真的暗色值
  - 加 useThemeColors() hook: 读系统 colorScheme → 返回 Colors 或 DarkColors

Step 2: app 入口
  - NavigationContainer 加 theme prop 控制导航栏颜色
  - StatusBar 跟随主题切换

Step 3: 所有组件
  - 把 `import { Colors } from '@/theme'` 改成
    `const colors = useThemeColors()`
  - 把 `Colors.xxx` 改成 `colors.xxx`
```

### 工作量

| 步骤 | 文件数 | 时间 |
|------|--------|------|
| theme.ts 填色 | 1 | 0.5h |
| hook + 入口 | 2 | 0.5h |
| 组件批量替换 | ~20 | 1h |
| 测试验证 | — | 0.5h |

### 为什么现在不做

12 个 Screen 零测试。没有测试就切主题系统 = 无声引入视觉 bug。Screen 测试先补齐 3 个基础 Screen 再开暗色模式。

---

## 3. registerByEmail 无 UI 入口

`authStore.registerByEmail(email, password)` 一行代码直接注册，但 RegisterScreen 只用 OTP 流程。

### 要不要加

两种意见：
- **加**：用户体验完整，有邮箱密码注册的快捷入口
- **不加**：OTP 验证邮箱所有权更安全，`registerByEmail` 留着给服务端管理用

AGENTS.md 标记为已知，没强制修。属于产品决定。

---

## 优先级建议

```
Screen 测试 > 暗色模式 > registerByEmail UI
  (补安全网)   (视觉升级)    (产品决定)
```
