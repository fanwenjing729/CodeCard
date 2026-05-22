import type { MemoryBoxScenario } from '@/types';

export const variableStorageScenario: MemoryBoxScenario = {
  id: 'variable-storage',
  title: '变量内存布局',
  cellsPerRow: 8,
  totalRows: 6,
  steps: [
    {
      label: '空内存',
      allocations: [],
      showAddresses: false,
      annotation: '程序启动，内存空闲',
    },
    {
      label: 'int x = 42',
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#4a9eff' },
      ],
      showAddresses: false,
      annotation: 'int 占 4 个字节',
    },
    {
      label: 'int y = 100',
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#4a9eff' },
        { name: 'y', type: 'int', typeSize: 4, value: '100', color: '#2ed573' },
      ],
      showAddresses: false,
      annotation: '两个 int 各占 4 字节，地址连续',
    },
    {
      label: 'char c = A',
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#4a9eff' },
        { name: 'y', type: 'int', typeSize: 4, value: '100', color: '#2ed573' },
        { name: 'c', type: 'char', typeSize: 1, value: 'A', color: '#ff9f43' },
      ],
      showAddresses: false,
      annotation: 'char 只占 1 个字节！（比 int 小 4 倍）',
    },
    {
      label: 'double d = 3.14',
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#4a9eff' },
        { name: 'y', type: 'int', typeSize: 4, value: '100', color: '#2ed573' },
        { name: 'c', type: 'char', typeSize: 1, value: 'A', color: '#ff9f43' },
        { name: 'd', type: 'double', typeSize: 8, value: '3.14', color: '#a55eea' },
      ],
      showAddresses: false,
      annotation: 'double 占 8 个字节！（最大）',
    },
    {
      label: '查看地址',
      allocations: [
        { name: 'x', type: 'int', typeSize: 4, value: '42', color: '#4a9eff' },
        { name: 'y', type: 'int', typeSize: 4, value: '100', color: '#2ed573' },
        { name: 'c', type: 'char', typeSize: 1, value: 'A', color: '#ff9f43' },
        { name: 'd', type: 'double', typeSize: 8, value: '3.14', color: '#a55eea' },
      ],
      showAddresses: true,
      annotation: '每个变量都有内存地址，&x = 0x1000',
    },
    {
      label: '作用域结束，释放内存',
      allocations: [],
      showAddresses: false,
      annotation: '变量离开作用域，内存被回收',
    },
  ],
};
