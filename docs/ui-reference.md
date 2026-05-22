# CodeCard UI 参数参考

## 约定

- 所有数字单位是 **dp**（逻辑像素），跨手机密度自动适配
- 颜色用十六进制 `#rrggbb`
- 文件路径都是 `src/` 下的相对路径

---

## 1. 卡片页顶部返回栏

**文件：** `components/shared/ScreenHeader.tsx`

| 参数 | 当前值 | 位置 | 效果 |
|------|--------|------|------|
| compact paddingTop | `insets.top + 33` | 第29行 | 返回箭头距屏幕顶部的距离，改数字=整体上下移 |

```
← 返回        基础         1 / 5     ← 左(返回) / 中(模块名) / 右(进度)
```

- 左边文字 `← 返回` 的颜色是 `#4a9eff`（第66行 `backBtn.color`）
- 中间文字颜色 `#666`（NodeScreen 第204行 `module.color`）
- 右边进度文字颜色 `#999`（NodeScreen 第207行 `progress.color`）

---

## 2. 设置页

**文件：** `screens/SettingsScreen.tsx`

### 头像区域

```
⭕ 96px 圆形
  用户名 ✏️
  138****8888
  上次同步：...
  [立即同步] [退出登录]
```

| 参数 | 当前值 | 行号(styles) | 效果 |
|------|--------|-------------|------|
| 头像大小 | `96 × 96` | line ~295 `avatarCircle` | `width`/`height` 改圆形大小 |
| 头像圆角 | `48` | line ~295 `borderRadius` | 永远 = 头像大小÷2，否则不圆 |
| 头像背景色 | `#eee` | line ~295 `backgroundColor` | 默认头像的背景灰底 |
| 图标大小 | `52` | line 129（JSX） | 默认人形图标尺寸，应 < 头像大小 |
| 图标颜色 | `#ccc` | line 129（JSX） | 默认人形图标颜色 |
| 名字字号 | `20` | line ~314 `displayIdText.fontSize` | 用户名大小 |
| 名字颜色 | `#222` | line ~314 | 用户名颜色 |
| 名字最大宽度 | `220` | line ~314 `maxWidth` | 长名字截断宽度 |
| 手机号字号 | `14` | line ~319 `phoneText.fontSize` | 手机号大小 |
| 手机号颜色 | `#999` | line ~319 | 手机号颜色 |
| 同步状态字号 | `13` | line ~323 `syncText.fontSize` | "上次同步" 文字大小 |
| 同步状态颜色 | `#bbb` | line ~323 | "上次同步" 文字颜色 |
| "未登录"字号 | `16` | line ~333 `notLoggedInText.fontSize` | |
| "未登录"颜色 | `#aaa` | line ~333 | |

### 按钮

| 参数 | 当前值 | 行号 | 效果 |
|------|--------|------|------|
| 同步按钮背景 | `#4a9eff` | line ~329 `actionButton.backgroundColor` | 蓝色按钮 |
| 同步按钮字色 | `#fff` | line ~331 | |
| 同步按钮字号 | `15` | line ~331 | |
| 同步按钮圆角 | `8` | line ~329 `borderRadius` | 数字越大越圆 |
| 退出按钮边框色 | `#ff4757` | line ~338 `actionButtonOutline.borderColor` | 红色描边 |
| 退出按钮字色 | `#ff4757` | line ~341 | |
| 两个按钮间距 | `12` | line ~327 `actionRow.gap` | |

### 登录按钮（未登录时）

| 参数 | 当前值 | 行号 | 效果 |
|------|--------|------|------|
| 按钮背景 | `#4a9eff` | line ~345 `loginButton` | |
| 按钮圆角 | `8` | line ~345 | |
| 按钮文字 | `登录以同步进度` | line 149（JSX） | 改文案 |
| 字号 | `15` | line ~350 | |
| 字色 | `#fff` | line ~350 | |

### 编辑弹窗

| 参数 | 当前值 | 行号(styles) | 效果 |
|------|--------|-------------|------|
| 弹窗宽度 | `280` | line ~380 `modalCard.width` | |
| 弹窗圆角 | `14` | line ~380 `borderRadius` | |
| 输入框边框色 | `#ddd` | line ~390 `modalInput.borderColor` | |
| 确认按钮色 | `#4a9eff` | line ~408 `modalButtonConfirm` | |
| 取消字色 | `#999` | line ~412 | |
| 遮罩颜色 | `rgba(0,0,0,0.35)` | line ~375 `modalBackdrop` | 改最后一个数字调深浅 |

### 卡片区域

| 参数 | 当前值 | 行号 | 效果 |
|------|--------|------|------|
| 卡片背景 | `#fff` | line ~250 `section.backgroundColor` | 白色卡片 |
| 卡片圆角 | `12` | line ~250 `borderRadius` | |
| 卡片间距 | `16` | line ~250 `marginBottom` | 卡片之间的垂直间距 |
| 小标题字号 | `13` | line ~256 `sectionTitle.fontSize` | "重置课程进度" 的导航栏标题 |
| 小标题颜色 | `#999` | line ~256 | |
| 行文字字号 | `16` | line ~266 `rowText.fontSize` | 每行主文字 |
| 行文字颜色 | `#222` | line ~266 | |
| 危险文字颜色 | `#ff4757` | line ~277 | "清空全部数据" 的红色 |
| 危险卡片描边 | `#ffccd5` | line ~258 `dangerSection.borderColor` | 危险操作卡片的粉色边框 |
| 圆点大小 | `8 × 8` | line ~268 `dot` | 课程前的彩色圆点 |
| 箭头颜色 | `#ccc` | line ~274 `arrow` | `›` 的颜色 |

### 页面底色

| 参数 | 当前值 | 行号 |
|------|--------|------|
| 背景色 | `#f5f5f5` | line ~244 `container.backgroundColor` |

---

## 3. 卡片学习页

**文件：** `screens/NodeScreen.tsx`

### 底部按钮

```
[← 上一张] [下一张/完成/下一步 1/3]
   1份宽        2份宽
```

| 参数 | 当前值 | 行号(styles) | 效果 |
|------|--------|-------------|------|
| 上一张背景 | `#8899aa` | line ~218 `prevBtn.backgroundColor` | 灰蓝色 |
| 上一张圆角 | `10` | line ~218 | |
| 按钮内边距 | `14` | line ~218 `padding` | 文字到按钮边缘距离 |
| 下一张背景 | `#4a9eff` | line ~225 `nextBtn.backgroundColor` | 蓝色 |
| 完成按钮背景 | `#2ed573` | line ~231 `nextBtnDone.backgroundColor` | 绿色（最后一张） |
| 按钮字色 | `#fff` | line ~238 | |
| 按钮字号 | `16` | line ~238 | |
| 禁用透明度 | `0.4` | line ~234 `navBtnDisabled.opacity` | 上一张不可点时的透明程度 |
| 底部区域边距 | `16` | line ~208 `footer.padding` | |
| 底部上边框色 | `#eee` | line ~211 `borderTopColor` | 底栏与卡片间的分割线 |

### 完成页面

| 参数 | 当前值 | 行号 | 效果 |
|------|--------|------|------|
| 图标 | `🎉` | line 123（JSX） | 完成时大图标（emoji 可换） |
| 图标大小 | `64` 字号 | line ~260 | |
| 标题色 | `#2ed573` | line ~266 | 绿色 |
| 标题字号 | `24` | line ~265 | |
| 返回按钮色 | `#4a9eff` | line ~276 | |
| 返回按钮圆角 | `10` | line ~276 | |

### 卡片区域

| 参数 | 当前值 | 行号 |
|------|--------|------|
| 页面底色 | `#fff` | line ~195（styles） |

---

## 4. 登录页

**文件：** `screens/LoginScreen.tsx`

| 参数 | 当前值 | 行号(styles) | 效果 |
|------|--------|-------------|------|
| 页面底色 | `#f5f5f5` | line ~34 | |
| 关闭按钮色 | `#666` | line 20（JSX） | × 图标颜色 |
| 人头图标色 | `#ccc` | line 26（JSX） | |
| 标题字号 | `22` | line ~43 | "登录" |
| 副标题字号 | `15` | line ~47 | "登录功能即将上线" |
| 副标题色 | `#999` | line ~47 | |
| 提示字号 | `14` | line ~52 | 说明文字 |
| 提示色 | `#bbb` | line ~52 | |

---

## 5. 全局颜色表

方便统一修改主色调：

| 用途 | 色值 | 出现位置 |
|------|------|---------|
| 主色蓝 | `#4a9eff` | 下一张按钮、同步按钮、确认按钮、导航栏返回箭头、返回课程按钮、登录按钮 |
| 完成绿 | `#2ed573` | 完成按钮、学习完成标题 |
| 上一张灰 | `#8899aa` | 上一张按钮 |
| 危险红 | `#ff4757` | 退出登录文字/边框、清空数据文字 |
| 危险边框 | `#ffccd5` | 危险操作卡片描边 |
| 页面底 | `#f5f5f5` | SettingsScreen + LoginScreen 背景 |
| 卡片白 | `#fff` | Section 卡片、NodeScreen 背景 |
| 分割线 | `#eee` | 底栏上边框、头像默认背景、导航栏底部线 |
| 主文字 | `#222` | rowText、displayId、title |
| 次文字 | `#999` | sectionTitle、phoneText、module |
| 浅文字 | `#bbb` / `#aaa` | syncText、notLoggedInText、hint |
| 箭头 | `#ccc` | 列表 `›` 箭头 |
