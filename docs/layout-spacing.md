# 页面间距记录

## 首页 (HomeScreen)

| 元素 | 位置 | 值 |
|------|------|-----|
| "选择学科" 标题 | inline style | `marginTop: insets.top + 42` |
| 课程卡片列表 | wrapper View | `marginTop: 21` |

## 课程页 (CourseScreen)

| 元素 | 位置 | 值 |
|------|------|-----|
| header (← 返回 + 标题) | inline style | `paddingTop: insets.top + 42` |
| 模块列表 | contentContainerStyle | `paddingTop: 32` |

## 模块详情页 (ModuleScreen)

| 元素 | 位置 | 值 |
|------|------|-----|
| header (← 模块 + 标题) | inline style | `paddingTop: insets.top + 43` |
| 节点列表 | contentContainerStyle | `paddingTop: 36` |
| 节点卡片间距 | ListItem.shared | `marginBottom: 20` |

## 卡片页 (NodeScreen)

| 元素 | 位置 | 值 |
|------|------|-----|
| header (← 返回 + 模块名 + 进度) | inline style | `paddingTop: insets.top + 8` |

## 测验页 (QuizScreen)

| 元素 | 位置 | 值 |
|------|------|-----|
| header (← 返回 + 进度) | inline style | `paddingTop: insets.top + 8` |

## 进度页 (ProgressScreen)

| 元素 | 位置 | 值 |
|------|------|-----|
| 内容区 | contentContainerStyle | `paddingTop: insets.top + 16` |

## 设置页 (SettingsScreen)

| 元素 | 位置 | 值 |
|------|------|-----|
| 内容区 | contentContainerStyle | `paddingTop: insets.top + 16` |

## 共享组件

| 组件 | 属性 | 值 |
|------|------|-----|
| ListItem | marginBottom | `20` |
