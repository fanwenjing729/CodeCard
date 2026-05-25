import type { ScopeCodeScenario } from '@/types';

export const dynamicMemoryScenario: ScopeCodeScenario = {
  id: 'dynamic-memory',
  title: '动态内存：new 与 delete',
  totalSteps: 6,
  sourceCode: [
    '// 栈上声明指针',
    'int* p;',
    '',
    '// 堆上分配内存，p 存堆地址',
    'p = new int(42);',
    '',
    '// 通过指针使用堆数据',
    'std::cout << *p;   // 42',
    '',
    '// ⚠️ 如果忘了 delete...',
    '// p 离开作用域，栈帧弹出',
    '',
    '// ✓ 正确做法：归还堆内存',
    'delete p;',
    '',
    '// 指针置空，防止悬空',
    'p = nullptr;',
  ].join('\n'),
  cellsPerRow: 8,
  totalRows: 5,
  steps: [
    {
      label: '栈上声明指针 int* p',
      highlightLines: [1],
      allocations: [
        { name: 'p', type: 'int*', typeSize: 8, value: '?', color: '#4a9eff' },
      ],
      annotation: '栈区（蓝色）：p 是指针变量，未初始化，值是随机垃圾',
    },
    {
      label: 'new int(42) — 堆上分配',
      highlightLines: [4],
      allocations: [
        { name: 'p', type: 'int*', typeSize: 8, value: '0x2000', color: '#4a9eff' },
        { name: '(堆)', type: 'int', typeSize: 4, value: '42', color: '#ff6b6b' },
      ],
      annotation: '堆区（红色）：new 在堆上分配了 4 字节，值为 42。p 存着堆地址 0x2000，像风筝线连着堆上的数据',
    },
    {
      label: '解引用 *p 读取堆数据',
      highlightLines: [7],
      allocations: [
        { name: 'p', type: 'int*', typeSize: 8, value: '0x2000', color: '#4a9eff' },
        { name: '(堆)', type: 'int', typeSize: 4, value: '42', color: '#ff6b6b' },
      ],
      annotation: '*p 顺着地址在堆上找到 42。一切正常——栈上的指针管着堆上的数据',
    },
    {
      label: '忘了 delete — 内存泄漏！',
      highlightLines: [9, 10],
      allocations: [
        { name: '(堆)', type: 'int', typeSize: 4, value: '42', color: '#ff6b6b' },
      ],
      annotation: 'p 离开作用域被销毁了，但堆上的 42 还在！风筝线断了——没人知道这块内存在哪，但它占着 4 字节永远不释放。这就是内存泄漏。每次调用都漏一点，迟早耗尽内存',
    },
    {
      label: 'delete p — 归还堆内存',
      highlightLines: [13],
      allocations: [
        { name: 'p', type: 'int*', typeSize: 8, value: '0x2000', color: '#4a9eff' },
      ],
      annotation: 'delete 把堆上的 int 还给了系统。但 p 还存着旧地址 0x2000——p 变成了悬空指针！',
    },
    {
      label: 'p = nullptr — 安全收尾',
      highlightLines: [16],
      allocations: [
        { name: 'p', type: 'int*', typeSize: 8, value: 'nullptr', color: '#4a9eff' },
      ],
      annotation: 'p 置为 nullptr，明确标记"我不指向任何东西"。delete 之后立刻置空是好习惯——悬空指针再也害不了你',
    },
  ],
};
