import type { BranchScenario } from '@/types';

export const ifElseIfLadderScenario: BranchScenario = {
  id: 'if-else-if-ladder',
  title: 'else if 条件链',
  totalSteps: 3,
  sourceCode: `int score = 75;

if (score >= 90) {
    cout << "A";
} else if (score >= 60) {
    cout << "D";
} else {
    cout << "F";
}`,
  steps: [
    {
      label: '检查第一个条件',
      highlightLines: [2],
      takenLines: [],
      skippedLines: [],
      annotation: 'score = 75。从第一个条件开始：75 >= 90？',
    },
    {
      label: '第一个不成立',
      highlightLines: [4],
      takenLines: [],
      skippedLines: [3],
      annotation: '75 >= 90 不成立 → 跳过 if 块。进入 else if，检查第二个条件：75 >= 60？',
    },
    {
      label: '第二个成立',
      highlightLines: [4],
      takenLines: [5],
      skippedLines: [7],
      annotation: '75 >= 60 成立 → 执行 else if 块，输出 "D"。else 被跳过。条件链从上到下依次检查，第一个成立的被执行，后面的全部忽略。',
    },
  ],
};
