import type { LoopScenario } from '@/types';

export const forLoopScenario: LoopScenario = {
  id: 'for-loop',
  title: 'for 循环执行流程',
  totalSteps: 5,
  sourceCode: `int sum = 0;

for (int i = 0; i < 3; i++) {
    sum += i;
}`,
  steps: [
    {
      label: '初始化',
      highlightLines: [2],
      bodyLines: [],
      iteration: 0,
      entered: false,
      annotation: '第 1 步 — 初始化：i = 0。接下来检查 i < 3 是否成立。',
    },
    {
      label: '第 1 轮',
      highlightLines: [2],
      bodyLines: [3],
      iteration: 1,
      entered: true,
      annotation: '0 < 3 成立 → 进入循环体：sum += 0。执行完后 i++，i 变为 1。',
    },
    {
      label: '第 2 轮',
      highlightLines: [2],
      bodyLines: [3],
      iteration: 2,
      entered: true,
      annotation: '1 < 3 成立 → 再次进入循环体：sum += 1。i++ 后 i 变为 2。',
    },
    {
      label: '第 3 轮',
      highlightLines: [2],
      bodyLines: [3],
      iteration: 3,
      entered: true,
      annotation: '2 < 3 成立 → 最后一次进入循环体：sum += 2。i++ 后 i 变为 3。',
    },
    {
      label: '跳出',
      highlightLines: [2],
      bodyLines: [],
      iteration: -1,
      entered: false,
      annotation: '3 < 3 不成立 → 循环结束。总共跑了 3 轮，sum = 0 + 1 + 2 = 3。程序继续执行 for 之后的代码。',
    },
  ],
};
