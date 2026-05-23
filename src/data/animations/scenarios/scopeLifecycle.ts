import type { ScopeCodeScenario } from '@/types';

export const scopeLifecycleScenario: ScopeCodeScenario = {
  id: 'scope-lifecycle',
  title: '变量作用域',
  totalSteps: 5,
  sourceCode: `int main() {
  int a = 10;
  {
    int b = 20;
  }
}`,
  cellsPerRow: 4,
  totalRows: 2,
  steps: [
    {
      label: '程序开始',
      highlightLines: [],
      allocations: [],
      annotation: '程序开始执行，进入 main() 之前，内存为空',
    },
    {
      label: 'int a = 10',
      highlightLines: [1],
      allocations: [
        { name: 'a', type: 'int', typeSize: 4, value: '10', color: '#2ed573' },
      ],
      annotation: '第 2 行：a 被创建。绿色 = 活着，可以访问',
    },
    {
      label: 'int b = 20',
      highlightLines: [3],
      allocations: [
        { name: 'a', type: 'int', typeSize: 4, value: '10', color: '#2ed573' },
        { name: 'b', type: 'int', typeSize: 4, value: '20', color: '#4a9eff' },
      ],
      annotation: '第 4 行：b 被创建。此时 a 和 b 都在作用域内——内层 {} 可以看到外层的 a',
    },
    {
      label: '离开内层 {}',
      highlightLines: [4],
      allocations: [
        { name: 'a', type: 'int', typeSize: 4, value: '10', color: '#2ed573' },
        { name: 'b', type: '—', typeSize: 4, value: '—', color: '#666666' },
      ],
      annotation: '第 5 行：离开内层 {}，b 被销毁（灰色）。此时只有 a 可以访问——外层看不到内层的 b',
    },
    {
      label: '离开外层 {}',
      highlightLines: [5],
      allocations: [
        { name: 'a', type: '—', typeSize: 4, value: '—', color: '#666666' },
        { name: 'b', type: '—', typeSize: 4, value: '—', color: '#666666' },
      ],
      annotation: '第 6 行：main() 结束，所有变量离开作用域，全部销毁',
    },
  ],
};
