# useProgressStore 改动触发场景 & 回归清单

不用读源码。哪天你需要改这个文件，先看这里。

## 什么时候会回来改这个文件

| 触发场景 | 具体改动 | 概率 |
|---------|---------|------|
| 接后端同步 | `CourseProgress` 加 `dirtyCards: string[]` | 一定发生 |
| 加学习统计 | `CourseProgress` 加 `streakDays` / `lastStudyDate` | 很可能 |
| 调整 XP 规则 | `XP_PER_CARD` / `XP_PER_PRACTICE` 改值，或分卡类型给不同 XP | 可能 |
| 批量操作 | 加 `completeCards(courseId, cardIds[])` 批量完成 | 可能 |
| 跨设备合并 | `hydrate()` 加合并策略（本地 vs 远程冲突） | 一定发生 |
| 加错题复习功能 | `wrongCards` + `uncompleteCard` 已存在，复用即可 | 已实现 |

## 核心不变量（改完必须成立）

### calcLevel
```
- calcLevel(0)   = 1     ← 零 XP 就是 1 级
- calcLevel(99)  = 1     ← 100 XP 以下都是 1 级
- calcLevel(100) = 2     ← 边界：刚好升级
- calcLevel(299) = 2     ← 边界：2 级需要 200，100+200=300 才升 3
- calcLevel(300) = 3
- level N 需要累计 N*(N-1)*50 XP，等价于每级需要 level*100
```

### completeCard
```
- 同一张卡调两次 → 第二次返回 false，completedCards 不重复
- 新课第一次调 → 自动创建 CourseProgress，不会崩
- completeCard 不改 XP，不改 level
```

### uncompleteCard
```
- 从 completedCards 移除 cardId，不扣 XP
- 不存在的 cardId → 静默忽略，不报错
- 和 addWrongCard 配合使用：答错 → addWrongCard + uncompleteCard
- 答对 → rewardCard（已在 completedCards 时返回 false，XP 不重复加）
```

### rewardCard
```
- = completeCard + addXP 的合体效果
- 同一张卡调两次 → 第二次返回 false，XP 不加
- XP 和 completedCards 要么一起生效，要么一起不生效（原子性）
```

### wrongCards
```
- addWrongCard：同一张卡推两次 → 不重复
- removeWrongCard：不存在的 cardId → 静默忽略
- wrongCards 只存 cardId，不存答案内容
- resetCourse → wrongCards: [] 一并清空
```

### resetCourse
```
- 扣掉的 XP = 该课程的 course.xp
- global.totalXP 不会变成负数（Math.max(0, ...)）
- level 根据扣除后的 XP 重新计算
- 该课程的数据回到初始状态（含 wrongCards: []）
```

### hydrate + migrate
```
- 启动时只调一次 hydrate()
- hydrate 后 state 的结构必须和 PersistedData 类型完全对齐
- 旧版本数据 → migrate() → 当前版本 → 写入 state
- migrate 失败时不应 set 脏数据（当前是静默 catch，可接受）
```

### calcLevel
```
- calcLevel(0)   = 1     ← 零 XP 就是 1 级
- calcLevel(99)  = 1     ← 100 XP 以下都是 1 级
- calcLevel(100) = 2     ← 边界：刚好升级
- calcLevel(299) = 2     ← 边界：2 级需要 200，100+200=300 才升 3
- calcLevel(300) = 3
- level N 需要累计 N*(N-1)*50 XP，等价于每级需要 level*100
```

### completeCard
```
- 同一张卡调两次 → 第二次返回 false，completedCards 不重复
- 新课第一次调 → 自动创建 CourseProgress，不会崩
- completeCard 不改 XP，不改 level
```

### rewardCard
```
- = completeCard + addXP 的合体效果
- 同一张卡调两次 → 第二次返回 false，XP 不加
- XP 和 completedCards 要么一起生效，要么一起不生效（原子性）
```

### resetCourse
```
- 扣掉的 XP = 该课程的 course.xp
- global.totalXP 不会变成负数（Math.max(0, ...)）
- level 根据扣除后的 XP 重新计算
- 该课程的数据回到初始状态
```

### hydrate + migrate
```
- 启动时只调一次 hydrate()
- hydrate 后 state 的结构必须和 PersistedData 类型完全对齐
- 旧版本数据 → migrate() → 当前版本 → 写入 state
- migrate 失败时不应 set 脏数据（当前是静默 catch，可接受）
```

## 改后的快速验证（不用写测试）

在 NodeScreen 正常刷几张卡，然后：
1. 退出 app 重开 → 进度还在（persistence 没坏）
2. 同一张卡再刷一次 → XP 不涨（去重没坏）
3. ProgressScreen 看等级 → 和 XP 数字匹配（calcLevel 没坏）
4. 设置页重置课程 → XP 减少、卡片恢复未完成（resetCourse 没坏）
5. 答错一道题 → 错题集出现 + 进度条减少（wrongCards + uncompleteCard 没坏）
6. 再答对同一道题 → 错题集消失 + 进度条恢复（removeWrongCard + rewardCard 没坏）

5 分钟手动走完这六步，比任何自动化测试都更能确认"没改坏"。
