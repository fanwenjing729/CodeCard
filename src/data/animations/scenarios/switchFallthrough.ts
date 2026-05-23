import type { BranchScenario } from '@/types';

export const switchFallthroughScenario: BranchScenario = {
  id: 'switch-fallthrough',
  title: 'switch 穿透',
  totalSteps: 2,
  sourceCode: `int x = 2;

switch (x) {
    case 1:
        cout << "A";
    case 2:
        cout << "B";
    case 3:
        cout << "C";
        break;
}`,
  steps: [
    {
      label: 'switch 求值',
      highlightLines: [2],
      takenLines: [],
      skippedLines: [],
      annotation: 'x = 2。注意：case 1 和 case 2 后面都没有 break——这埋下了穿透的隐患。',
    },
    {
      label: '匹配并穿透',
      highlightLines: [2],
      takenLines: [5, 6, 7, 8, 9],
      skippedLines: [3, 4],
      annotation: 'x=2，跳过 case 1，匹配 case 2 → 输出"B"。但 case 2 后没有 break！程序穿透到 case 3 → 又输出"C"，直到 break 才停。最终输出"BC"。',
    },
  ],
};
