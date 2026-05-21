import type { PathNode } from '../../../../types';

// 基础篇 01-06
export const basicsNodes: PathNode[] = [
  {
    id: 'cpp-01-start',
    courseId: 'cpp',
    type: 'knowledge',
    chapter: '01 起步',
    title: '第一个程序',
    cards: [
      {
        id: 'cpp-01-start-c1',
        cardType: 'concept',
        content: {
          title: 'Hello World 是什么',
          body: '每个 C++ 程序都从 main 函数开始执行。main 函数是程序的入口，操作系统通过调用 main 来启动你的程序。\n\n#include <iostream> 告诉编译器引入输入输出流库，让我们可以使用 std::cout 在屏幕上打印文字。',
        },
      },
      {
        id: 'cpp-01-start-c2',
        cardType: 'code',
        content: {
          title: '第一个程序',
          code: '#include <iostream>\n\nint main() {\n  std::cout << "Hello World";\n  return 0;\n}',
          language: 'cpp',
          highlights: [0, 2, 3, 4, 5],
        },
      },
      {
        id: 'cpp-01-start-c3',
        cardType: 'practice',
        content: {
          question: 'C++ 程序的入口函数是？',
          questionType: 'choice',
          options: ['start()', 'main()', 'init()', 'run()'],
          answer: 'main()',
          explanation: '每个 C++ 程序必须有且只有一个 main 函数，程序从这里开始执行。main 函数返回 0 表示程序正常结束。',
        },
      },
    ],
  },
  {
    id: 'cpp-01-basics-var',
    courseId: 'cpp',
    type: 'knowledge',
    chapter: '02 变量与类型',
    title: '变量声明',
    cards: [
      {
        id: 'cpp-01-basics-var-c1',
        cardType: 'concept',
        content: {
          title: '什么是变量',
          body: '变量是内存中一块有名字的存储空间。声明变量时需要指定类型，C++ 是强类型语言。\n\n基本类型：int（整数）、double（浮点数）、char（字符）、bool（布尔值）。',
        },
      },
      {
        id: 'cpp-01-basics-var-c2',
        cardType: 'code',
        content: {
          title: '变量声明示例',
          code: 'int age = 25;\ndouble price = 9.99;\nchar grade = \'A\';\nbool isPassed = true;\n\n// const 常量不可修改\nconst double PI = 3.14159;',
          language: 'cpp',
          highlights: [0, 1, 2, 3, 6],
        },
      },
    ],
  },
];
