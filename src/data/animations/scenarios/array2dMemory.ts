import type { ScopeCodeScenario } from '@/types';

export const array2dMemoryScenario: ScopeCodeScenario = {
  id: 'array-2d-memory',
  title: '二维数组内存布局',
  totalSteps: 4,
  sourceCode: [
    '// 2 行 3 列的二维数组',
    'int m[2][3] = {{1, 2, 3},',
    '                {4, 5, 6}};',
    '',
    '// 访问第 0 行第 1 列',
    'std::cout << m[0][1];',
    '',
    '// 访问第 1 行第 2 列',
    'std::cout << m[1][2];',
  ].join('\n'),
  cellsPerRow: 12,
  totalRows: 2,
  steps: [
    {
      label: '声明二维数组',
      highlightLines: [1, 2],
      allocations: [
        { name: 'm[0][0]', type: 'int', typeSize: 4, value: '1', color: '#4a9eff' },
        { name: 'm[0][1]', type: 'int', typeSize: 4, value: '2', color: '#4a9eff' },
        { name: 'm[0][2]', type: 'int', typeSize: 4, value: '3', color: '#4a9eff' },
        { name: 'm[1][0]', type: 'int', typeSize: 4, value: '4', color: '#2ed573' },
        { name: 'm[1][1]', type: 'int', typeSize: 4, value: '5', color: '#2ed573' },
        { name: 'm[1][2]', type: 'int', typeSize: 4, value: '6', color: '#2ed573' },
      ],
      annotation: '2 行×3 列×4 字节 = 24 字节。蓝 = 第 0 行，绿 = 第 1 行',
    },
    {
      label: '访问 m[0][1]',
      highlightLines: [5],
      allocations: [
        { name: 'm[0][0]', type: 'int', typeSize: 4, value: '1', color: '#4a9eff' },
        { name: 'm[0][1]', type: 'int', typeSize: 4, value: '2', color: '#ff9f43' },
        { name: 'm[0][2]', type: 'int', typeSize: 4, value: '3', color: '#4a9eff' },
        { name: 'm[1][0]', type: 'int', typeSize: 4, value: '4', color: '#2ed573' },
        { name: 'm[1][1]', type: 'int', typeSize: 4, value: '5', color: '#2ed573' },
        { name: 'm[1][2]', type: 'int', typeSize: 4, value: '6', color: '#2ed573' },
      ],
      annotation: 'm[0][1] = 第 0 行第 1 列，偏移 = (0×3 + 1)×4 = 4 字节',
    },
    {
      label: '访问 m[1][2]',
      highlightLines: [8],
      allocations: [
        { name: 'm[0][0]', type: 'int', typeSize: 4, value: '1', color: '#4a9eff' },
        { name: 'm[0][1]', type: 'int', typeSize: 4, value: '2', color: '#4a9eff' },
        { name: 'm[0][2]', type: 'int', typeSize: 4, value: '3', color: '#4a9eff' },
        { name: 'm[1][0]', type: 'int', typeSize: 4, value: '4', color: '#2ed573' },
        { name: 'm[1][1]', type: 'int', typeSize: 4, value: '5', color: '#2ed573' },
        { name: 'm[1][2]', type: 'int', typeSize: 4, value: '6', color: '#ff9f43' },
      ],
      annotation: 'm[1][2] = 跳过第 0 行(3个元素)，再跳过第1行前2个。偏移 = (1×3 + 2)×4 = 20 字节',
    },
    {
      label: '行优先存储',
      highlightLines: [1, 2],
      allocations: [
        { name: 'm[0][0]', type: 'int', typeSize: 4, value: '1', color: '#4a9eff' },
        { name: 'm[0][1]', type: 'int', typeSize: 4, value: '2', color: '#4a9eff' },
        { name: 'm[0][2]', type: 'int', typeSize: 4, value: '3', color: '#4a9eff' },
        { name: 'm[1][0]', type: 'int', typeSize: 4, value: '4', color: '#2ed573' },
        { name: 'm[1][1]', type: 'int', typeSize: 4, value: '5', color: '#2ed573' },
        { name: 'm[1][2]', type: 'int', typeSize: 4, value: '6', color: '#2ed573' },
      ],
      annotation: '二维数组在内存中仍然是连续一维排列。先存完第 0 行，再存第 1 行——这叫"行优先"。',
    },
  ],
};
