# useProgressStore 不变量 & 改动指南

不用读源码。改 store 或等级系统，先看这里。

## 等级公式速查

所有等级公式抽到独立文件 `src/lib/xp.ts`，store 和 Screen 都从它 import，互不依赖。

### 改 XP_PER_LEVEL 就能调整体感

| 常量 | 位置 | 当前值 | 作用 |
|------|------|--------|------|
| `XP_PER_LEVEL` | `src/lib/xp.ts:1` | `100` | **唯一源头**，改这一个数字，整个升级曲线跟着变 |

### 三个导出函数（全在 `src/lib/xp.ts`）

| 函数 | 公式 | 作用 | 谁在用 |
|------|------|------|--------|
| `calcLevel(totalXP)` | while 循环累减 `level * XP_PER_LEVEL` | totalXP → 等级 | `useProgressStore`（addXP / rewardCard / resetCourse / removeCompletedCards / hydrate） |
| `xpForLevelStart(level)` | `(XP_PER_LEVEL/2) * (level-1) * level` | 到达某等级需要多少累计 XP | `ProgressScreen` 算 `xpIntoLevel` |
| `xpForNextLevel(level)` | `level * XP_PER_LEVEL` | 当前等级升下一级需要多少 XP | `ProgressScreen` 进度环分母 |

### 依赖关系

```
src/lib/xp.ts  ← 唯一公式源
    ↑            ↑
    |            |
useProgressStore  ProgressScreen
（import calcLevel）  （import xpForLevelStart, xpForNextLevel）
```

store 和 Screen 没有任何 import 依赖关系，各自独立引用 xp.ts。

### 关系

```
xpForLevelStart(3) = XP_PER_LEVEL/2 * 2 * 3 = 50 * 6 = 300
xpForNextLevel(3)  = 3 * 100 = 300
```

- `xpForLevelStart(level) + xpForNextLevel(level) = xpForLevelStart(level + 1)`
- `xpForLevelStart` 是 `calcLevel` 的逆运算求和公式

### 调参效果（XP_PER_LEVEL = 100）

| 等级 | 累计需要 | 本级到下级需要 |
|------|----------|:--:|
| Lv.1 | 0 | 100 |
| Lv.2 | 100 | 200 |
| Lv.3 | 300 | 300 |
| Lv.4 | 600 | 400 |
| Lv.5 | 1,000 | 500 |
| Lv.10 | 4,500 | 1,000 |
| Lv.20 | 19,000 | 2,000 |

调成 `XP_PER_LEVEL = 200` 升级慢一倍，调成 `50` 升级快一倍，曲线形状不变。

---

## calcLevel 不变量

```
calcLevel(0)   = 1     ← 零 XP 就是 1 级
calcLevel(99)  = 1     ← 不到 100 XP 都是 Lv.1
calcLevel(100) = 2     ← 刚好升级
calcLevel(299) = 2     ← Lv.2→3 需要 200，累计 300 才升
calcLevel(300) = 3
```

---

## 各 action 不变量

### rewardCard
```
- = completeCard + addXP 合体
- 同一张卡调两次 → 第二次返回 false，XP 不加（O(1) 去重 via `cardId in completedCards`）
- XP 和 completedCards 要么一起生效，要么一起不生效
```

### addXP
```
- 直接加 XP 到 course 和 global
- global.totalXP += amount，同步重算 level
- 新课第一次调 → 自动创建 CourseProgress
```

### wrongCards
```
- addWrongCard：同一张卡推两次 → 不重复（O(1) 去重）
- removeWrongCard：不存在的 cardId → 静默忽略
- wrongCards 只存 cardId（类型：`Record<string, true>`）
- resetCourse → wrongCards 一并清空
```

### resetCourse
```
- 扣掉的 XP = 该课程的 course.xp
- global.totalXP 不会变成负数（Math.max(0, ...)）
- level 用 calcLevel 根据扣除后 XP 重新计算
- 该课程回到初始状态（completedCards / wrongCards / quizScores / nodePositions 全部清空）
```

### removeCompletedCards
```
- 删除指定 cardIds 对应的 completedCards 和 wrongCards 条目
- 不删除的卡不受影响（白名单过滤）
- xpToSubtract 由调用方从静态数据计算（practice=10XP, 其他=5XP）
- course.xp -= xpToSubtract，不会变成负数
- global.totalXP -= xpToSubtract，不会变成负数
- global.level 用 calcLevel 重新计算
- cardIds 为空数组 → 直接 return，不触发 set()
- 不清理 quizScores 和 nodePositions（已知限制——残留数据不影响功能，
  下次重做该节点时会被覆写）
```

---

## hydrate + persist

```
- 启动时只调一次 hydrate()
- hydrate 成功后 hydrated: true
- hydrate 失败（AsyncStorage 异常）→ 设 hydrated: true 走初始状态，不白屏
- pickData 保存时 level 写占位值 1，每次 hydrate 用 calcLevel 重算
- 旧版本数据 → migrate() → 当前版本 → 写入 state
- 防抖 500ms 写入 AsyncStorage
- App 进后台立即 flush
```

---

## 改后手动验证（5 分钟）

1. 正常刷几张卡 → XP 正常增加
2. 退出 app 重开 → 进度还在
3. 同一张卡再刷 → XP 不涨（去重）
4. ProgressScreen → 等级/进度环和 XP 匹配
5. 设置页重置课程 → XP 减少、等级可能下降
6. 答错 → 错题集出现，答对 → 消失
7. 数据管理 → 进入学科→模块→节点 → 逐层重置 → XP 和卡片数同步减少
8. 数据管理 → 模块级重置 → 只扣该模块 XP，其他模块不受影响
