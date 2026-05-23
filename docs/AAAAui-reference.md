# CodeCard UI 参数参考

## 约定

- 所有数字单位是 **dp**（逻辑像素），跨手机密度自动适配
- 颜色统一在 `src/theme.ts` 定义 token，组件引用 token 不写死 hex
- 文件路径都是 `src/` 下的相对路径

---

## 怎么改颜色

**改一个 token，全 app 生效。不再需要翻十几个文件逐个找 hex 替换。**

1. 打开 `src/theme.ts`
2. 找到要改的 token，改值
3. 保存 → 19 个组件自动更新

```
改之前：在 15 个文件里搜 #4a9eff 逐个替换
改之后：theme.ts 里改 primary 一行，全 app 蓝变紫
```

### 改了有什么效果

| 改这个 token | 影响的组件和区域 |
|-------------|----------------|
| `Colors.primary` (#4a9eff) | 下一张按钮、同步按钮、确认按钮、导航栏返回箭头、返回课程按钮、TabBar 选中态、进度环 |
| `Colors.success` (#2ed573) | 完成按钮、测验完成标题、正确答案背景 |
| `Colors.danger` (#ff4757) | 退出登录文字/边框、清空数据文字、错误图标 |
| `Colors.dangerBorder` (#ffccd5) | 危险操作卡片描边 |
| `Colors.bg` (#fff) | SettingsScreen 卡片、NodeScreen 背景、QuizScreen 背景、ProgressScreen 背景、HomeScreen 背景、所有页面白底 |
| `Colors.bgTertiary` (#f5f5f5) | SettingsScreen + LoginScreen 灰色背景 |
| `Colors.text` (#222) | 所有标题、正文、用户名 |
| `Colors.textMuted` (#999) | sectionTitle、phoneText、module、模块名 |
| `Colors.textPlaceholder` (#bbb) / `Colors.disabledText` (#aaa) | syncText、notLoggedInText、hint、禁用状态文字 |
| `Colors.arrow` (#ccc) | 列表 `›` 箭头、默认头像图标 |
| `Colors.border` (#eee) | 底栏上边框、头像默认背景 |
| `Colors.disabledBg` (#8899aa) | 上一张按钮（灰色状态） |

---

## 1. 卡片页顶部返回栏

**文件：** `components/shared/ScreenHeader.tsx`

| 参数 | 当前值 | 来源 | 效果 |
|------|--------|------|------|
| compact paddingTop | `insets.top + 33` | ScreenHeader.tsx:29 | 返回箭头距屏幕顶部的距离，改数字=整体上下移 |

```
← 返回        基础         1 / 5     ← 左(返回) / 中(模块名) / 右(进度)
```

- 左边文字 `← 返回` 的颜色：`Colors.primary`
- 中间文字颜色：`Colors.textSecondary`
- 右边进度文字颜色：`Colors.textMuted`

---

## 2. 首页

**文件：** `screens/HomeScreen.tsx`

```
┌─────────────────────────────────┐
│ CodeCard                        │ ← 28px Bold
│ 选择学科开始学习                 │ ← 15px muted
│                                 │
│ ┌───────────────────────────┐   │
│ ▐█▌ ┌────┐                  │   │ ← 4px 左侧色条 + 48×48 图标
│ ▐█▌ │ 📘 │ C++           › │   │   borderLeftColor = 课程颜色
│ ▐█▌ └────┘ 1 模块 · 22 张  │   │
│ ▐█▌         ████████░ 82%  │   │
│ └───────────────────────────┘   │
│ ┌───────────────────────────┐   │
│ ▐█▌ ┌────┐                  │   │
│ ▐█▌ │ 📊 │ 数据结构      › │   │
│ ▐█▌ └────┘ 暂无内容         │   │
│ └───────────────────────────┘   │
│ ...                             │
└─────────────────────────────────┘
```

### 页面

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 背景色 | `Colors.bgTertiary` | 浅灰底，让白色卡片浮起来 |
| 标题字号 | `28` | "CodeCard" |
| 标题字重 | `800` | |
| 副标题字号 | `15` | "选择学科开始学习" |
| 副标题颜色 | `Colors.textMuted` | |
| 列表顶部间距 | `20` | 标题与卡片列表的距离 |
| 列表水平内边距 | `Spacing.lg` (16) | |

### 课程卡片

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 卡片背景 | `Colors.bg` | 白色 |
| 卡片圆角 | `Radius.lg` (12) | |
| 卡片间距 | `10` | 卡片间垂直距离 |
| 左侧色条宽度 | `4` | `borderLeftWidth`，颜色来自 `c.color` |
| 图标框大小 | `48 × 48` | 课程颜色背景 |
| 图标框圆角 | `14` | |
| 图标大小 | `26` | MaterialCommunityIcons |
| 图标颜色 | `Colors.textInverse` | 白色图标 |
| 课程名字号 | `17` | Bold 700 |
| 副信息字号 | `13` | "N 个模块 · N 张卡片" |
| 副信息颜色 | `Colors.textMuted` | |
| 进度条高度 | `4` | |
| 进度条底色 | `Colors.progressBarBg` | |
| 进度条填充色 | `c.color` | 与课程颜色一致 |
| 百分比字号 | `12` | 进度条右侧数字 |
| 箭头字号 | `22` | `›` |
| 箭头颜色 | `Colors.arrow` | |

### 进度计算

每张课程卡片从 `useProgressStore.courses[courseId]` 取进度：
- `total` = `c.nodes.reduce(...)` 所有节点卡片总数
- `done` = `completedCards.length`
- `pct` = `Math.round(done / total * 100)`
- `moduleCount` = 有卡片的模块数

无进度时进度条不渲染，仅显示"暂无内容"。

---

## 3. 设置页

**文件：** `screens/SettingsScreen.tsx`

### 页面结构

```
┌─ 头像区域 ───────────────────┐
│ ⭕ 96px 圆形                  │
│   用户名 ✏️                   │
│   138****8888                 │
│   上次同步：... [同步][退出]   │
│   或 未登录 → [登录以同步进度] │
├──────────────────────────────┤
│ 数据管理                    › │ ← 入口行，跳转 DataScreen
├──────────────────────────────┤
│ 关于                         │
│ 版本    CodeCard v1.0.0      │
└──────────────────────────────┘
```

### 头像区域

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 头像大小 | `96 × 96` | `width`/`height` 改圆形大小 |
| 头像圆角 | `48` | 永远 = 头像大小÷2，否则不圆 |
| 头像背景色 | `Colors.border` | 默认头像的背景灰底 |
| 图标大小 | `52` | 默认人形图标尺寸，应 < 头像大小 |
| 图标颜色 | `Colors.arrow` | 默认人形图标颜色 |
| 名字字号 | `20` | 用户名大小 |
| 名字颜色 | `Colors.text` | 用户名颜色 |
| 名字最大宽度 | `220` | 长名字截断宽度 |
| 手机号字号 | `14` | 手机号大小 |
| 手机号颜色 | `Colors.textMuted` | 手机号颜色 |
| 同步状态字号 | `13` | "上次同步" 文字大小 |
| 同步状态颜色 | `Colors.textPlaceholder` | "上次同步" 文字颜色 |
| "未登录"字号 | `16` | |
| "未登录"颜色 | `Colors.disabledText` | |

### 按钮

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 同步按钮背景 | `Colors.primary` | 蓝色按钮 |
| 同步按钮字色 | `Colors.textInverse` | |
| 同步按钮字号 | `15` | |
| 同步按钮圆角 | `Radius.sm` (8) | |
| 退出按钮边框色 | `Colors.danger` | 红色描边 |
| 退出按钮字色 | `Colors.danger` | |
| 两个按钮间距 | `Spacing.md` (12) | |

### 登录按钮（未登录时）

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 按钮背景 | `Colors.primary` | |
| 按钮圆角 | `Radius.sm` (8) | |
| 按钮文字 | `登录以同步进度` | 改文案 |
| 字号 | `15` | |
| 字色 | `Colors.textInverse` | |

### 编辑弹窗

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 弹窗宽度 | `280` | |
| 弹窗圆角 | `14` | |
| 输入框边框色 | `Colors.inputBorder` | |
| 输入框圆角 | `Radius.md` (10) | |
| 确认按钮色 | `Colors.primary` | |
| 确认按钮圆角 | `Radius.md` (10) | |
| 取消字色 | `Colors.textMuted` | |
| 遮罩颜色 | `Colors.backdrop` | `rgba(0,0,0,0.35)` |

### 卡片区域

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 卡片背景 | `Colors.bg` | 白色卡片 |
| 卡片圆角 | `Radius.lg` (12) | |
| 卡片间距 | `Spacing.lg` (16) | 卡片之间的垂直间距 |
| 卡片内边距 | `Spacing.lg` (16) | |
| 小标题字号 | `13` | "关于" |
| 小标题颜色 | `Colors.textMuted` | |
| 入口行文字字号 | `16` | "数据管理" |
| 入口行文字颜色 | `Colors.text` | |
| 入口行箭头字号 | `22` | `›` |
| 入口行箭头颜色 | `Colors.arrow` | |

### 页面底色

| 参数 | 当前值 |
|------|--------|
| 背景色 | `Colors.bgTertiary` | `#f5f5f5` |

---

## 4. 数据管理页

**文件：** `screens/DataScreen.tsx`

路由：`Data: undefined`，从设置页"数据管理"入口跳转。

```
┌─ ← 设置   数据管理 ──────────┐ ← ScreenHeader (variant="default")
│                               │
│ ┌───────────────────────────┐ │
│ │ ┌────┐                    │ │ ← 36×36 课程图标框
│ │ │ 📘 │ C++（18张已完成）› │ │
│ │ └────┘                    │ │
│ │ ───────────────────────── │ │ ← 分隔线 (1px, borderLight)
│ │ ┌────┐                    │ │
│ │ │ 📊 │ 数据结构         › │ │
│ │ └────┘                    │ │
│ │ ───────────────────────── │ │
│ │ ⚠ 清空全部数据          › │ │ ← 仅在有进度时显示
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

### 页面

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 背景色 | `Colors.bgTertiary` | |
| 内容区内边距 | `Spacing.lg` (16) | |
| 内容区底部内边距 | `40` | 滚动留白 |

### 课程行

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 行垂直内边距 | `Spacing.md` (12) | |
| 图标框大小 | `36 × 36` | 课程颜色背景，小于首页 48px |
| 图标框圆角 | `Radius.md` (10) | |
| 图标大小 | `18` | MaterialCommunityIcons |
| 图标框右边距 | `Spacing.md` (12) | |
| 行文字大小 | `16` | |
| 分隔线高度 | `1` | |
| 分隔线颜色 | `Colors.borderLight` | `#d0d0d0` |
| 分隔线上下间距 | `Spacing.xs` (4) | |
| 箭头字号 | `18` | `›` |
| 箭头颜色 | `Colors.arrow` | |

### 危险行

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 行样式 | 与课程行相同 | |
| 警告图标 | `alert-circle-outline` | 20px，红色 |
| 文字颜色 | `Colors.danger` | |
| 箭头颜色 | `Colors.danger` | |
| 图标文字间距 | `Spacing.sm` (8) | |

### 确认弹窗

点击任何课程行或"清空全部数据"行时弹出，替代系统 `Alert.alert`。

```
┌──────────────────────────┐
│                          │ ← backdrop 遮罩
│  ┌────────────────────┐  │
│  │  重置 C++          │  │ ← 17px 标题
│  │                    │  │
│  │  确定要清除 C++    │  │ ← 14px 灰色正文
│  │  的所有学习进度吗？ │  │
│  │  此操作不可撤销。   │  │
│  │                    │  │
│  │  [取消]  [重置]    │  │ ← 取消(灰色) / 确认(红色背景+白字)
│  └────────────────────┘  │
└──────────────────────────┘
```

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 遮罩背景 | `Colors.backdrop` | |
| 弹窗宽度 | `280` | |
| 弹窗圆角 | `Radius.xl` (16) | |
| 弹窗内边距 | `Spacing.xxl` (24) | |
| 标题字号 | `17` | Bold 600 |
| 标题颜色 | `Colors.text` | |
| 标题下边距 | `Spacing.md` (12) | |
| 正文字号 | `14` | |
| 正文颜色 | `Colors.textSecondary` | |
| 正文行高 | `20` | |
| 正文下边距 | `Spacing.xl` (20) | |
| 按钮区域间距 | `Spacing.md` (12) | |
| 按钮圆角 | `Radius.md` (10) | |
| 按钮内边距 | `10` | |
| 取消字色 | `Colors.textMuted` | |
| 确认按钮背景 | `Colors.danger` | 红色，强调破坏性操作 |
| 确认按钮字色 | `Colors.textInverse` | 白色 |
| 确认按钮字重 | `600` | |

### 数据来源

- 课程列表：`courses` from `@/data/courses`
- 进度数据：`useProgressStore.courses`
- 重置操作：`resetCourse(courseId)` + `flush()`
- 清空操作：`courses.forEach(c => resetCourse(c.id))` + `flush()`
- 危险行可见性：`hasProgress` = 任一课程有已完成的卡片

---

## 5. 卡片学习页

**文件：** `screens/NodeScreen.tsx`

### 底部按钮

```
[← 上一张] [下一张/完成/下一步 1/3]
   1份宽        2份宽
```

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 上一张背景 | `Colors.disabledBg` | 灰蓝色 |
| 上一张圆角 | `10` | |
| 按钮内边距 | `14` | 文字到按钮边缘距离 |
| 下一张背景 | `Colors.primary` | 蓝色 |
| 完成按钮背景 | `Colors.success` | 绿色（最后一张） |
| 按钮字色 | `Colors.textInverse` | |
| 按钮字号 | `16` | |
| 禁用透明度 | `0.4` | 上一张不可点时的透明程度 |
| 底部区域边距 | `16` | |
| 底部上边框色 | `Colors.border` | 底栏与卡片间的分割线 |

### 完成页面

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 图标 | `🎉` | 完成时大图标（emoji 可换） |
| 图标大小 | `64` 字号 | |
| 标题色 | `Colors.success` | 绿色 |
| 标题字号 | `24` | |
| 返回按钮色 | `Colors.primary` | |
| 返回按钮圆角 | `10` | |

### 卡片区域

| 参数 | 当前值 |
|------|--------|
| 页面底色 | `Colors.bg` |

---

## 6. 登录页

**文件：** `screens/LoginScreen.tsx`

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 页面底色 | `Colors.bgTertiary` | |
| 关闭按钮色 | `Colors.textSecondary` | × 图标颜色 |
| 人头图标色 | `Colors.arrow` | |
| 标题字号 | `22` | "登录" |
| 副标题字号 | `15` | "登录功能即将上线" |
| 副标题色 | `Colors.textMuted` | |
| 提示字号 | `14` | 说明文字 |
| 提示色 | `Colors.textPlaceholder` | |

---

## 7. 测验页

**文件：** `screens/QuizScreen.tsx`

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 页面底色 | `Colors.bg` | |
| 进度文字色 | `Colors.textMuted` | 右上角 `1/5` |
| 完成标题色 | `Colors.success` | "测验完成" |
| 完成分数色 | `Colors.text` | 48号大字 |
| 返回按钮背景 | `Colors.primary` | |

---

## 8. 问答组件

**文件：** `components/cards/QuestionRenderer.tsx`

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 选项默认背景 | `Colors.optionBg` | |
| 选项选中背景 | `Colors.optionSelectedBg` | |
| 选项边框 | `Colors.optionBorder` | |
| 选项文字 | `Colors.optionText` | |
| 正确答案背景 | `Colors.correctBg` | 绿色底 |
| 错误答案背景 | `Colors.wrongBg` | 红色底 |
| 错误答案边框 | `Colors.wrongBorder` | |
| 填空输入框背景 | `Colors.fillInputBg` | |
| 答案解析文字 | `Colors.explanationText` | |
| 提交按钮背景 | `Colors.primary` | |
| 提交按钮字色 | `Colors.textInverse` | |

---

## 9. 错误边界

**文件：** `components/shared/ErrorBoundary.tsx`

| 参数 | 当前值 | 效果 |
|------|--------|------|
| 页面底色 | `Colors.bg` | |
| 标题色 | `Colors.optionText` | "出错了" |
| 副标题色 | `Colors.textMuted` | |
| 重试按钮 | `Colors.primary` | |
| 按钮字色 | `Colors.textInverse` | |

---

## 10. 全局主题 token 速查

完整定义见 `src/theme.ts`。

### 颜色

| Token | 值 | 影响范围 |
|-------|------|---------|
| `primary` | `#4a9eff` | 主按钮、TabBar、进度环、导航箭头 |
| `success` | `#2ed573` | 完成按钮、正确反馈 |
| `danger` | `#ff4757` | 错误/危险操作 |
| `warning` | `#ff9f43` | 警告 |
| `bg` | `#fff` | 页面/卡片白色背景 |
| `bgSecondary` | `#f8f9fa` | 次级背景 |
| `bgTertiary` | `#f5f5f5` | 设置页灰底 |
| `text` | `#222` | 标题/正文 |
| `textSecondary` | `#666` | 次要文字 |
| `textMuted` | `#999` | 辅助文字 |
| `textPlaceholder` | `#bbb` | 占位符 |
| `textInverse` | `#fff` | 深色按钮上的白字 |
| `bodyText` | `#444` | 概念卡正文 |
| `border` | `#eee` | 分割线 |
| `disabledBg` | `#8899aa` | 上一张按钮 |
| `disabledText` | `#aaa` | 禁用文字 |
| `arrow` | `#ccc` | 箭头图标 |
| `codeBg` | `#1e1e1e` | 代码块 |
| `codeText` | `#d4d4d4` | 代码文字 |
| `optionBg` | `#f0f4ff` | 选项底色 |
| `correctBg` | `#d4edda` | 正确选项 |
| `wrongBg` | `#f8d7da` | 错误选项 |
| `backdrop` | `rgba(0,0,0,0.35)` | 模态弹窗遮罩 |

### 字号

| Token | 值 | 用途 |
|-------|------|------|
| `xs` | 12 | |
| `sm` | 13 | 小标题、同步状态 |
| `md` | 14 | 手机号、提示、模块名 |
| `base` | 15 | 按钮文字 |
| `lg` | 16 | 大字按钮、行文字 |
| `xl` | 17 | |
| `title` | 20 | 用户名 |
| `heading` | 22 | 页面标题 |
| `hero` | 24 | 完成标题 |
| `xhero` | 48 | 测验分数 |

### 圆角

| Token | 值 | 用途 |
|-------|------|------|
| `sm` | 8 | 按钮 |
| `md` | 10 | 卡片按钮 |
| `lg` | 12 | 卡片 |
| `xl` | 16 | |
| `full` | 999 | 圆形 |

### 间距

| Token | 值 |
|-------|------|
| `xs` | 4 |
| `sm` | 8 |
| `md` | 12 |
| `base` | 14 |
| `lg` | 16 |
| `xl` | 20 |
| `xxl` | 24 |
| `xxxl` | 32 |

---

## 11. 错题集（WrongCardsScreen）

**文件：** `screens/WrongCardsScreen.tsx`

### 页面结构

错题集有两级页面，同一文件根据有没有 `courseId` 参数自动切换：

```
第一级：课程列表                    第二级：某课程的错题
┌─ ← 错题集 ────────────┐       ┌─ ← 错题集  C++ ────┐
│                         │       │                     │
│ ● C++           3  ›   │  →   │  基础               │
│   sizeof(int) 的...     │       │  ┌─────────────┐  │
│                         │       │  │ 入口函数是？  │  │
│ ● Python        1  ›   │       │  │ 答案：main() │  │
│                         │       │  └─────────────┘  │
└─────────────────────────┘       │  共 3 道              │
                                  └─────────────────────┘
```

---

### 整体位置（两级共用）

**关键**：这两个值控制整个页面（Header + 内容）的前后位置。改的时候注意配合。

| 参数 | 当前值 | 位置 | 效果 |
|------|--------|------|------|
| 容器顶部距离 | `insets.top - 20` | 两处 `container` 的 `paddingTop` | **改这个 = Header + 内容一起上下移**。数字越大越往下。改回 `insets.top` 就是系统默认位置 |
| 内容区顶部间距 | `23` | `listContent.paddingTop` | **改这个 = 只有内容上下移，Header 不动**。数字越大内容越往下（离 Header 越远） |

**调位置的口诀：**
- 想把整个页面（包括返回按钮和标题）往上移 → **减** `insets.top - 20` 里的 `20`（比如改成 25 就再上移 5px）
- 想把下面的卡片列表往上移（靠近 Header）→ **减** `paddingTop` 的 `23`（比如改成 18 就上移 5px）
- 想把卡片列表往下移（远离 Header）→ **加** `paddingTop` 的 `23`

---

### 第一级：课程列表

| 参数 | 当前值 | 位置(`styles.xxx`) | 效果 |
|------|--------|-------------------|------|
| 课程卡片背景 | `Colors.bg` | `courseCard.backgroundColor` | 白色卡片 |
| 课程卡片圆角 | `12` | `courseCard.borderRadius` | |
| 课程卡片内边距 | `16` | `courseCard.padding` | 卡片四个边的留白 |
| 课程卡片间距 | `10` | `courseCard.marginBottom` | 卡片之间的垂直距离 |
| 课程名文字大小 | `15` | `courseCardTitle.fontSize` | |
| 课程名字重 | `700` | `courseCardTitle.fontWeight` | 加粗 |
| 课程色圆点大小 | `8 × 8` | `courseDot` 的 `width/height` | 课程名前的小圆点 |
| 错题数角标背景 | `Colors.warning` | `countBadge.backgroundColor` | 橙色 |
| 角标文字大小 | `11` | `countBadgeText.fontSize` | |
| 角标圆角 | `9` | `countBadge.borderRadius` | 改小 → 方角，改大 → 圆角 |
| 首题预览文字大小 | `13` | `coursePreview.fontSize` | 每张卡片下的题目预览 |
| 预览文字颜色 | `Colors.textSecondary` | `coursePreview.color` | |

### 空态（0 道错题时）

| 参数 | 当前值 | 位置 |
|------|--------|------|
| 图标 | `🎯` | JSX 里的 Text |
| 标题 | `暂无错题` | JSX 里的 Text |
| 副标题 | `答题时选错会自动收录到这里` | JSX 里的 Text |

---

### 第二级：课程错题详情

| 参数 | 当前值 | 位置(`styles.xxx`) | 效果 |
|------|--------|-------------------|------|
| 返回按钮标签 | `错题集` | ScreenHeader 的 `backLabel` | 改文案 |
| 标题 | `course.title`（如 C++） | ScreenHeader 的 `title` | 自动取课程名 |
| 卡片背景 | `Colors.bg` | `card.backgroundColor` | |
| 卡片圆角 | `12` | `card.borderRadius` | |
| 卡片内边距 | `16` | `card.padding` | |
| 卡片间距 | `12` | `card.marginBottom` | 错题卡片之间的垂直距离 |
| 模块标签文字 | `14` | `moduleTag.fontSize` | "基础"的模块名 |
| 模块标签颜色 | `Colors.textMuted` | `moduleTag.color` | |
| 题目文字大小 | `16` | `question.fontSize` | |
| 题目字重 | `600` | `question.fontWeight` | |
| 答案标签文字 | `答案 ` | JSX 里 `answerLabel` 的 Text | 改文案，保留空格 |
| 答案文字大小 | `15` | `answerText.fontSize` | |
| 答案字重 | `700` | `answerText.fontWeight` | 加粗 |
| 答案颜色 | `Colors.success` | `answerText.color` | 绿色 |
| 解析文字大小 | `13` | `explanation.fontSize` | |
| 解析颜色 | `Colors.textSecondary` | `explanation.color` | |
| 解析行高 | `18` | `explanation.lineHeight` | 多行文字的行间距 |
| 底部提示 | `共 N 道错题 · 答对后自动移除` | JSX + `footer` 样式 | 改文案直接改 Text |

### 空态（该课程 0 道错题时）

| 参数 | 当前值 | 位置 |
|------|--------|------|
| 图标 | `✅` | JSX 里的 Text |
| 标题 | `全部掌握` | JSX 里的 Text |
| 副标题 | `这门课的错题都已消灭` | JSX 里的 Text |

---

### 怎么改背景色

错题集页面背景色用的是 `Colors.bgTertiary`（和设置页一致的浅灰底）。

- 改整个错题集页面背景 → 改 `container.backgroundColor`
- 改卡片背景 → 改 `courseCard.backgroundColor` 和 `card.backgroundColor`
- 改角标颜色 → 改 `countBadge.backgroundColor` 和 `wrongBadge.backgroundColor`

全部颜色集中在一个地方：`src/theme.ts` 的 `Colors` 对象。不需要进组件文件改。
