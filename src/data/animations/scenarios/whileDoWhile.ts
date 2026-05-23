import type { AnimScenario } from '@/types';

export interface WhileDoWhileStep {
  label: string;
  whileLines: number[];
  doWhileLines: number[];
  whileIteration: number;
  doWhileIteration: number;
  whileEntered: boolean;
  doWhileEntered: boolean;
  annotation: string;
}

export interface WhileDoWhileScenario extends AnimScenario {
  whileCode: string;
  doWhileCode: string;
  steps: WhileDoWhileStep[];
}

export const whileDoWhileScenario: WhileDoWhileScenario = {
  id: 'while-vs-dowhile',
  title: 'while 与 do-while 对比',
  totalSteps: 3,
  whileCode: `int i = 1;
while (i < 1) {
    cout << i;
    i++;
}`,
  doWhileCode: `int i = 1;
do {
    cout << i;
    i++;
} while (i < 1);`,
  steps: [
    {
      label: '条件检查',
      whileLines: [1],
      doWhileLines: [1],
      whileIteration: 0,
      doWhileIteration: 0,
      whileEntered: false,
      doWhileEntered: false,
      annotation: '两边都是 i=1，条件都是 i<1。此时 1<1 为 false。\n\nwhile（上）→ 先判断，条件为假，一次都不执行\ndo-while（下）→ 先执行，执行完再判断',
    },
    {
      label: 'do-while 先执行',
      whileLines: [1],
      doWhileLines: [2, 3],
      whileIteration: -1,
      doWhileIteration: 1,
      whileEntered: false,
      doWhileEntered: true,
      annotation: 'while（上）→ 条件为假，循环体被跳过，输出：无\ndo-while（下）→ 不管条件，先跑一遍循环体，输出 1。跑完再检查条件',
    },
    {
      label: '对比结果',
      whileLines: [1],
      doWhileLines: [4],
      whileIteration: -1,
      doWhileIteration: -1,
      whileEntered: false,
      doWhileEntered: false,
      annotation: 'while（上）→ 条件一开始就为假，循环体 0 次。输出：无\ndo-while（下）→ 至少跑 1 次，检查条件后假才退出。输出：1\n\nwhile = 先判断再执行\ndo-while = 先执行再判断，至少一次',
    },
  ],
};
