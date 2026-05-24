import type { ScopeCodeScenario } from '@/types';

export const pointerIntroScenario: ScopeCodeScenario = {
  id: 'pointer-intro',
  title: '指针与解引用',
  totalSteps: 4,
  sourceCode: [
    '// 1. 声明普通变量',
    'int x = 42;',
    '',
    '// 2. 声明指针，存 x 的地址',
    'int* p = &x;',
    '',
    '// 3. 解引用：读取 p 指向的值',
    'std::cout << *p;   // 42',
    '',
    '// 4. 解引用：通过 p 修改 x',
    '*p = 100;',
  ].join('\n'),
  cellsPerRow: 8,
  totalRows: 2,
  steps: [
    {
      label: '声明 int x = 42',
      highlightLines: [1],
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#2ed573' },
      ],
      annotation: 'x 是普通变量，存的是数据 42',
    },
    {
      label: 'int* p = &x',
      highlightLines: [4],
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#2ed573' },
        { name: 'p', type: 'int*', typeSize: 4, value: '&x', color: '#ff9f43' },
      ],
      annotation: 'p 存的是 x 的地址（橙色 = 指针变量），不存 42',
    },
    {
      label: '解引用读取 *p',
      highlightLines: [7],
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#2ed573' },
        { name: 'p', type: 'int*', typeSize: 4, value: '&x', color: '#ff9f43' },
      ],
      annotation: '*p 沿着 p 里的地址找到 x，读到的值是 42',
    },
    {
      label: '解引用写入 *p = 100',
      highlightLines: [10],
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '100', color: '#2ed573' },
        { name: 'p', type: 'int*', typeSize: 4, value: '&x', color: '#ff9f43' },
      ],
      annotation: '*p = 100 通过指针找到 x 的格子，把值改成 100。x 本身没出现在代码里，但它被改了！',
    },
  ],
};
