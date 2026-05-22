import type { PathNode } from '@/types';

// 基础模块
export const basicsNodes: PathNode[] = [
  {
    id: 'cpp-01-start',
    courseId: 'cpp',
    type: 'knowledge',
    moduleId: 'basics',
    module: '基础',
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
    moduleId: 'basics',
    module: '基础',
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
      {
        id: 'cpp-01-basics-var-c3',
        cardType: 'concept',
        content: {
          title: '类型全家福',
          body: 'C++ 基本类型占用的字节数（典型值）：\n\nint — 4 字节（整数）\nfloat — 4 字节（单精度浮点）\ndouble — 8 字节（双精度浮点）\nchar — 1 字节（字符）\nbool — 1 字节（布尔值）\n\n扩展类型：\nshort — 2 字节（短整数）\nlong — 4 或 8 字节（长整数，平台相关）\nunsigned — 无符号版，值域翻倍但不存负数\n\n用 sizeof(type) 可以获取当前平台的实际字节数。',
        },
      },
      {
        id: 'cpp-01-basics-var-c4',
        cardType: 'practice',
        content: {
          question: '在大多数平台上，sizeof(int) 的典型返回值是？',
          questionType: 'choice',
          options: ['2', '4', '8', '取决于编译器，无法确定'],
          answer: '4',
          explanation: '在 32 位和 64 位平台上，int 通常占用 4 字节（32 位），值域约 ±21 亿。2 字节是 short，8 字节是 long 或 long long。',
        },
      },
    ],
  },
];
