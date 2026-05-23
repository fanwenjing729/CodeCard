import type { AnimScenario } from '@/types';

export interface BreakContinueStep {
  label: string;
  breakLines: number[];     // break 侧高亮行
  continueLines: number[];  // continue 侧高亮行
  breakIteration: number;
  continueIteration: number;
  breakEntered: boolean;
  continueEntered: boolean;
  annotation: string;
}

export interface BreakContinueScenario extends AnimScenario {
  breakCode: string;
  continueCode: string;
  steps: BreakContinueStep[];
}

export const breakContinueScenario: BreakContinueScenario = {
  id: 'break-continue',
  title: 'break 与 continue 对比',
  totalSteps: 5,
  breakCode: `for (int i = 1; i <= 5; i++) {
    if (i == 3) break;
    cout << i << " ";
}`,
  continueCode: `for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;
    cout << i << " ";
}`,
  steps: [
    {
      label: 'i = 1',
      breakLines: [1, 2],
      continueLines: [1, 2],
      breakIteration: 1,
      continueIteration: 1,
      breakEntered: true,
      continueEntered: true,
      annotation: 'i=1，不满足 if，正常执行 cout。输出：1',
    },
    {
      label: 'i = 2',
      breakLines: [1, 2],
      continueLines: [1, 2],
      breakIteration: 2,
      continueIteration: 2,
      breakEntered: true,
      continueEntered: true,
      annotation: 'i=2，仍不满足 if，正常执行 cout。输出：1 2',
    },
    {
      label: 'i = 3',
      breakLines: [1],
      continueLines: [1],
      breakIteration: -1,
      continueIteration: 3,
      breakEntered: false,
      continueEntered: false,
      annotation: 'i=3 满足条件，两边分叉：\n\nbreak（上）→ 跳出循环，循环结束\ncontinue（下）→ 跳过 cout，但循环继续',
    },
    {
      label: 'i = 4',
      breakLines: [],
      continueLines: [1, 2],
      breakIteration: -1,
      continueIteration: 4,
      breakEntered: false,
      continueEntered: true,
      annotation: 'break（上）→ 循环已结束，i=4 不会执行\ncontinue（下）→ 不满足条件，照常输出 4',
    },
    {
      label: 'i = 5',
      breakLines: [],
      continueLines: [1, 2],
      breakIteration: -1,
      continueIteration: 5,
      breakEntered: false,
      continueEntered: true,
      annotation: 'break（上）→ 最终输出：1 2\ncontinue（下）→ 输出 5，最终输出：1 2 4 5\n\nbreak = 直接不干了\ncontinue = 这轮跳过，下轮继续',
    },
  ],
};
