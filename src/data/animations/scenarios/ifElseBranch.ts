import type { BranchScenario } from '@/types';

export const ifElseBranchScenario: BranchScenario = {
  id: 'if-else-branch',
  title: '条件分支执行路径',
  totalSteps: 3,
  sourceCode: `int score = 85;

if (score >= 60) {
    cout << "及格";
} else {
    cout << "不及格";
}`,
  steps: [
    {
      label: '条件求值',
      highlightLines: [2],
      takenLines: [],
      skippedLines: [],
      annotation: '第 3 行：计算 score >= 60。score 是 85，85 >= 60 成立吗？',
    },
    {
      label: '条件成立',
      highlightLines: [2],
      takenLines: [3],
      skippedLines: [5],
      annotation: '85 >= 60 成立 → 进入 if 块：输出"及格"。else 块被跳过——条件不成立时才会走这里。',
    },
    {
      label: '假设条件不成立',
      highlightLines: [2],
      takenLines: [5],
      skippedLines: [3],
      annotation: '假如 score = 55，55 >= 60 不成立 → 跳过 if 块，进入 else 块：输出"不及格"。条件决定了走哪条路，两条路不会同时执行。',
    },
  ],
};
