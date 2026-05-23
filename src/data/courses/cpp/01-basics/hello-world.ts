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
    {
      id: 'cpp-01-start-c4',
      cardType: 'concept',
      content: {
        title: 'main 函数与返回值',
        body: 'int main() 的完整含义：\n\n• int — 函数返回值的类型是整数\n• main — 函数名，这是 C++ 标准规定的入口\n• () — 参数列表，当前为空\n• { } — 函数体，所有执行代码写在这对大括号内\n\nreturn 0; 表示程序正常结束。操作系统收到 0 就知道"一切正常"。如果返回非 0 值，通常表示程序异常退出。每个语句以 ;（分号）结尾——这是 C++ 的语法要求，初学者最常见的错误就是忘写分号。',
      },
    },
    {
      id: 'cpp-01-start-c5',
      cardType: 'code',
      content: {
        title: 'using namespace std',
        code: '// 方式一：每次加 std:: 前缀\n#include <iostream>\n\nint main() {\n  std::cout << "Hello";\n  return 0;\n}\n\n// 方式二：引入 using namespace\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello";  // 不需要 std::\n  return 0;\n}',
        language: 'cpp',
        highlights: [4, 12, 13],
      },
    },
    {
      id: 'cpp-01-start-c6',
      cardType: 'concept',
      content: {
        title: '注释',
        body: '注释是对代码的说明，编译器会忽略它们。C++ 支持两种注释：\n\n单行注释：\n// 这是注释，从 // 到行末都被忽略\n\n多行注释：\n/* 这是\n   多行注释\n   可以跨越多行 */\n\n注释的用途：\n1. 解释复杂逻辑，帮助他人（和未来的自己）理解代码\n2. 临时禁用某段代码（调试时常用）\n3. 标注作者、日期、版本信息\n\n初学阶段建议多写注释，养成好习惯。',
      },
    },
    {
      id: 'cpp-01-start-c7',
      cardType: 'practice',
      content: {
        question: 'C++ 中单行注释的写法是？',
        questionType: 'choice',
        options: ['# 这是注释', '// 这是注释', '/* 这是注释 */', '<!-- 这是注释 -->'],
        answer: '// 这是注释',
        explanation: '// 是 C++ 的单行注释符号，从 // 开始到行末都被编译器忽略。# 是预处理指令（如 #include），/* */ 是多行注释，<!-- --> 是 HTML 注释。',
      },
    },
  ],
};
