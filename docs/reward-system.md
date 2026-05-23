# 奖励 / 反馈系统

## 接口（已定义，`src/types/index.ts`）

```ts
type RewardEvent = XpGainReward | LevelUpReward;

// 获得 XP
XpGainReward {
  type: 'xp_gain';
  amount: number;                        // 获得了多少 XP
  source: 'card' | 'practice' | 'quiz';  // 来源
}

// 升级
LevelUpReward {
  type: 'level_up';
  from: number;  // 原来几级
  to: number;    // 现在几级
}

// Hook 对外契约
RewardState {
  current: RewardEvent | null;  // 当前事件，null = 没事件
  dismiss: () => void;          // 关闭当前，播下一个（如果有）
}
```

## 事件链路

```
rewardCard(addXP)  →  store.totalXP ↑
                          │
              useRewardFeedback hook（监听 totalXP / level）
                          │
                    比较前后差值
                    ├─ XP 变了 → 产出 xp_gain 事件
                    └─ level 变了 → 先产 xp_gain，再产 level_up
                          │
                    NodeScreen 消费 current
                    ├─ xp_gain  → <XpPopup amount={n} />
                    └─ level_up → <LevelUpCelebration from={a} to={b} />
                          │
                    dismiss() → 清除当前，播下一个
```

## 排期

| 阶段 | 内容 | 状态 |
|------|------|:--:|
| 1 | 接口定义 | 已做 |
| 2 | `useRewardFeedback` hook | 未做 |
| 3 | `XpPopup` 组件 | 未做 |
| 4 | `LevelUpCelebration` 组件 | 未做 |
| 5 | 挂到 `NodeScreen` | 未做 |
| 6 | 后续：StreakFlame / ChestOpen / BadgeWall | 未做 |

## 对现有架构的影响

零影响。store 不改，现有 Screen 不改，纯增量：
- `src/types/index.ts` 加几行类型
- `src/hooks/useRewardFeedback.ts` 新建
- `src/components/rewards/` 新建文件夹
- `NodeScreen.tsx` 加一行 `<RewardOverlay />`
