# 路径分支 —— 练习卡结果导向不同结尾

## 功能

```
C1 concept ──→ C2 practice ──┬── 答对 → C3 进阶总结
                             └── 答错 → C4 补救详解 → C5 基础总结
```

答题结果动态决定下一张卡，而不是固定的 index+1。

## 什么时候改

**任一条件满足即可启动：**
- 单节点卡片 ≥ 10 张，且其中有 ≥ 2 张练习卡
- 你明确觉得"这张卡答错的人需要当场看 X，不该直接跳过"
- 01-basics 内容填完后，刷了一遍线性流程，发现了 2-3 处"这里加个分支更好"

**不要提前改的理由：** 现在卡片太少，分支 API 只能凭空猜。填完 15-20 张卡后，你会自然知道卡之间的跳转关系长什么样，比现在设计更贴合真实数据。

## 怎么改

### 1. 类型定义（src/types/index.ts）

```ts
// Card 加一个可选字段
export interface CardBase {
  id: string;
  nextOnCorrect?: string;  // 答对跳转的 cardId，不填默认 index+1
  nextOnFail?: string;      // 答错跳转的 cardId，不填默认 index+1
}
```

只给 `CardBase` 加两个可选字段。不填 = 保持现有线性行为，已有机卡零改动。

### 2. 数据示例

```ts
cards: [
  { id: 'cpp-01-ptr-c1', cardType: 'concept', ... },
  {
    id: 'cpp-01-ptr-c2',
    cardType: 'practice',
    nextOnCorrect: 'cpp-01-ptr-c3',  // 答对 → 进阶总结
    nextOnFail: 'cpp-01-ptr-c4',      // 答错 → 补救详解
    content: { ... },
  },
  { id: 'cpp-01-ptr-c3', cardType: 'concept', title: '进阶总结', ... },
  { id: 'cpp-01-ptr-c4', cardType: 'concept', title: '补救详解', ... },
  { id: 'cpp-01-ptr-c5', cardType: 'code', title: '基础总结', ... },
]
```

`nextOnFail` 指向 C4 → C4 看完 → 默认 index+1 到 C5 → C5 是共同终点，不需要额外标记。

### 3. NodeScreen.tsx 导航重写

**核心：cardId → index 查表 + 导航栈**

```ts
// 查表函数
function findIndex(cards: Card[], cardId: string): number {
  return cards.findIndex(c => c.id === cardId);
}

// advance() 改法
const advance = () => {
  let nextIndex: number | null = null;

  if (card.cardType === 'animation') {
    const totalSteps = getAnimTotalSteps();
    if (animStep < totalSteps - 1) {
      setAnimStep(s => s + 1);
      return;
    }
  }

  if (card.cardType === 'practice') {
    // 有分支配置 → 按配置跳
    if (lastPracticeCorrect && card.nextOnCorrect) {
      nextIndex = findIndex(cards, card.nextOnCorrect);
    } else if (!lastPracticeCorrect && card.nextOnFail) {
      nextIndex = findIndex(cards, card.nextOnFail);
    }
  }

  // 没配置分支 → 线性下一张
  if (nextIndex === null || nextIndex === -1) {
    nextIndex = index + 1;
  }

  rewardCard(courseId, card.id, XP_PER_CARD);

  if (nextIndex >= cards.length) {
    setDone(true);
  } else {
    navStackRef.current.push(index);  // 入栈（供"上一张"使用）
    setIndex(nextIndex);
    savePosition(nextIndex);
  }
};
```

**"上一张"改法：**

```ts
const previous = () => {
  const prev = navStackRef.current.pop();
  if (prev !== undefined) {
    setIndex(prev);
  }
};
```

之前是 `index - 1`，改成从导航栈弹出一个历史位置。不需要额外存储"我从哪跳来的"。

**"是最后一张"改法：**

不再用 `index === cards.length - 1`，改成：

```ts
const hasNext = (): boolean => {
  // 当前卡有跳转配置 → 不是最后一张
  if (card.cardType === 'practice' && (card.nextOnCorrect || card.nextOnFail)) {
    return true;
  }
  // 否则看是不是数组最后一张
  return index < cards.length - 1;
};
```

### 4. 不改的文件

| 文件 | 原因 |
|------|------|
| `renderCard.tsx` | 仍然按 cardType 分发，不知道导航逻辑 |
| QuizScreen | 测验模式保持线性遍历所有 practice 卡，分支只在 NodeScreen 生效 |
| 错题集 / WrongCardsScreen | 存的是 cardId，跟导航逻辑无关 |
| `useProgressStore.ts` | 不涉及新字段，`completeCard`/`rewardCard` 不变 |
| 现有课程数据 | 所有卡片默认没填 `nextOnCorrect`/`nextOnFail`，行为 = 线性，不改就没事 |

### 5. 额外需要处理的事

- **导航栈要存 ref**（不是 state），避免每次 push 触发 re-render
- **cardId 不存在时的 fallback**——findIndex 返回 -1 → 打印 warning → fallback 到线性 index+1，不要白屏
- **循环检测**——如果 A→B→A 形成环，用户永远刷不完。可以在 advance 里检查：如果 nextIndex 已经被栈包含过，拒绝入栈 + 打印 warning。或者干脆不做自动检测，靠内容作者保证不写环

### 6. 内容作者注意事项

- 一张卡的 `nextOnCorrect` 必须指向同一节点内存在的 cardId，不跨节点
- 分支链的终点必须汇合到同一张卡，或者最后一张是共同终点（如 C5），否则会出现"一组人看到这个，另一组人永远看不到"
- 不填这两个字段的卡 → 完全保持现在行为，不受影响
- 建议节点内卡片顺序按"主路径 → 分支 → 汇合"排列，方便阅读

## 风险

| 风险 | 严重度 | 缓解 |
|------|--------|------|
| cardId 拼错 → 跳转失败 | 中 | findIndex 返回 -1 时 fallback 到 index+1 + 打印 warning |
| 上一张行为混乱 | 中 | 用导航栈替代 index-1，每次只弹一个 |
| 内容作者写环 | 低 | 可选加循环检测，或靠内容作者自觉 |
| 和 QuizScreen 体验分化 | 低 | 可以接受——NodeScreen 是学习模式，QuizScreen 是测验模式，本来就不一样 |
