import type { PathNode } from '@/types';

export const helloWorldNode: PathNode = {
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
};
