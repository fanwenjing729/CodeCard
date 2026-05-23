import type { PathNode } from '@/types';

export const breakContinueNode: PathNode = {
  id: 'cpp-01-basics-break-continue',
  courseId: 'cpp',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: 'break 与 continue',
  cards: [
    {
      id: 'cpp-01-basics-break-continue-c1',
      cardType: 'concept',
      content: {
        title: 'break — 只跳出当前层',
        body: 'break 让程序立刻跳出循环。但注意：break 只跳出一层——它所在的最内层循环。外面的循环不受影响。\n\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        if (j == 2) break;\n        cout << i << "," << j << "  ";\n    }\n}\n// i 是外层，j 是内层\n// 输出：1,1  2,1  3,1\n// 每次 j=2 时 break 跳出内层，外层 i++ 照走\n\n执行过程：\ni=1 → j=1 输出 → j=2 break（跳出内层）→ i=2 → j=1 输出 → j=2 break → i=3 → j=1 输出 → j=2 break → 结束\n\n如果想跳出多层循环，可以用一个 bool 标志：\n\nbool found = false;\nfor (int i = 0; i < 10 && !found; i++) {\n    for (int j = 0; j < 10; j++) {\n        if (data[i][j] == target) {\n            found = true;\n            break;  // 跳出内层\n        }\n    }  // found=true 后外层条件 !found 为假，外层也退出\n}\n\n一句话记住：break 只关内层门，外层照走不误。',
      },
    },
    {
      id: 'cpp-01-basics-break-continue-c2',
      cardType: 'code',
      content: {
        title: '嵌套循环中找目标值',
        code: [
          '#include <iostream>',
          '',
          'int main() {',
          '  int matrix[3][3] = {',
          '    {1, 2, 3},',
          '    {4, 5, 6},',
          '    {7, 8, 9}',
          '  };',
          '',
          '  int target = 5;',
          '  bool found = false;',
          '',
          '  for (int i = 0; i < 3 && !found; i++) {',
          '    for (int j = 0; j < 3; j++) {',
          '      if (matrix[i][j] == target) {',
          '        std::cout << "找到 " << target'
          + '                  << " 在 (" << i << "," << j << ")\\n";',
          '        found = true;',
          '        break;',
          '      }',
          '    }',
          '  }',
          '',
          '  if (!found) {',
          '    std::cout << "未找到\\n";',
          '  }',
          '',
          '  return 0;',
          '}',
        ].join('\n'),
        language: 'cpp',
        highlights: [13, 15, 16, 17, 18, 19],
      },
    },
    {
      id: 'cpp-01-basics-break-continue-c3',
      cardType: 'concept',
      content: {
        title: 'continue — for 安全，while 危险',
        body: 'continue 跳过本轮循环剩下的代码，直接进入下一轮。但 for 和 while 的行为有一个关键差异：\n\nfor 循环 — continue 仍然执行更新语句：\n\nfor (int i = 1; i <= 3; i++) {\n    if (i == 2) continue;  // 跳到 i++，i 变成 3\n    cout << i << " ";\n}\n// 输出：1 3\n// continue 跳过 cout，但 i++ 照常执行 → i 从 2 变成 3\n\nwhile 循环 — continue 跳过一切，包括更新语句：\n\nint i = 1;\nwhile (i <= 3) {\n    if (i == 2) continue;  // 跳回 while(i<=3)\n    cout << i << " ";      // i 还是 2，条件永远为真 → 死循环！\n    i++;\n}\n// 程序卡死在 i=2 上，永远不会结束\n\n为什么？因为 for 的更新（i++）是循环结构的一部分，continue 不会跳过它。while 的 i++ 只是循环体里的普通语句，continue 直接把它也跳过了。\n\n正确写法：把更新语句放到 continue 前面：\n\nint i = 1;\nwhile (i <= 3) {\n    i++;                     // 先更新\n    if (i == 2) continue;    // 安全了\n    cout << i << " ";\n}\n\n一句话记住：for 里 continue 安全（更新照跑），while 里 continue 要先确保更新不会被跳过。',
      },
    },
    {
      id: 'cpp-01-basics-break-continue-c4',
      cardType: 'code',
      content: {
        title: 'while + continue 死循环 vs 修复',
        code: '// ✗ 错误：死循环\nint i = 1;\nwhile (i <= 5) {\n    if (i == 3) {\n        continue;  // 跳过 i++，i 永远是 3\n    }\n    cout << i << " ";\n    i++;\n}\n\n// ✓ 正确：先递增再判断\nint j = 0;\nwhile (j < 5) {\n    j++;                    // 更新在最前面\n    if (j == 3) continue;   // 安全\n    cout << j << " ";\n}\n// 输出：1 2 4 5\n\n// ✓ 更好的选择：用 for\nfor (int k = 1; k <= 5; k++) {\n    if (k == 3) continue;   // for 的 k++ 不会被跳过\n    cout << k << " ";\n}\n// 输出：1 2 4 5',
        language: 'cpp',
        highlights: [3, 4, 5, 11, 12, 13, 14, 19, 20, 21],
      },
    },
    {
      id: 'cpp-01-basics-break-continue-c5',
      cardType: 'animation',
      content: {
        animationId: 'break-continue',
      },
    },
    {
      id: 'cpp-01-basics-break-continue-c6',
      cardType: 'practice',
      content: {
        question: '以下代码输出什么？\n\nfor (int i = 1; i <= 3; i++) {\n  for (int j = 1; j <= 5; j++) {\n    if (j == 4) break;\n    cout << j << " ";\n  }\n  cout << "| ";\n}',
        questionType: 'choice',
        options: ['1 2 3 | 1 2 3 | 1 2 3 |', '1 2 3 4 | 1 2 3 4 | 1 2 3 4 |', '1 2 3 |', '1 2 3 4 5 | 1 2 3 4 5 | 1 2 3 4 5 |'],
        answer: '1 2 3 | 1 2 3 | 1 2 3 |',
        explanation: '外层 i 跑 3 遍，每遍内层 j 从 1 开始输出，到 j=4 时 break 跳出内层，"|" 作为外层分隔符照常输出。break 只关内层门——外层 | 照样打印，外层循环照样继续。',
      },
    },
    {
      id: 'cpp-01-basics-break-continue-c7',
      cardType: 'practice',
      content: {
        question: '以下 while 循环输出什么？\n\nint i = 0;\nwhile (i < 5) {\n  i++;\n  if (i == 3) continue;\n  cout << i << " ";\n}',
        questionType: 'choice',
        options: ['1 2 4 5', '1 2 3 4 5', '1 2', '死循环，无输出'],
        answer: '1 2 4 5',
        explanation: 'i++ 在 continue 前面，所以即使 continue 跳过了 cout，i 已经变成了 3，下一轮 while 条件检查时 i 是 3，继续执行 i++ 变成 4……最终输出 1 2 4 5。关键：把更新放在 continue 前面就安全了。',
      },
    },
    {
      id: 'cpp-01-basics-break-continue-c8',
      cardType: 'practice',
      content: {
        question: '以下代码有什么问题？\n\nint i = 0;\nwhile (i < 10) {\n  if (i % 2 == 0) continue;\n  cout << i << " ";\n  i++;\n}',
        questionType: 'choice',
        options: ['cout 语句有语法错误', '死循环 — i 永远为 0', 'i 初始值应该是 1', '没有问题'],
        answer: '死循环 — i 永远为 0',
        explanation: 'i=0 时 0%2==0 为 true，continue 跳过 cout 和 i++。i 永远停在 0，while 条件永远为真，程序卡死。这就是 while + continue 的经典陷阱。修复方法：把 i++ 移到 if 前面，或者直接用 for 循环。',
      },
    },
  ],
};
