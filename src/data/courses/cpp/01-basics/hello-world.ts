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
        title: 'main 函数结构',
        body: 'int main() { ... return 0; } 各部分含义：\n\n• int — 返回值类型是整数\n• main — 函数名，C++ 标准规定的入口\n• () — 参数列表，当前为空\n• { } — 函数体，所有代码写在这对大括号内\n• return 0; — 返回 0 给操作系统，表示"正常结束"',
      },
    },
    {
      id: 'cpp-01-start-c5',
      cardType: 'concept',
      content: {
        title: '初学者最常见的三种编译错误',
        body: '1. 忘写分号\nC++ 每个语句必须以 ; 结尾。\n\n// 错误\nint x = 10\nstd::cout << x\n\n编译器报 "expected \';\' before ..."\n\n2. 花括号不匹配\n每个 { 必须有对应的 }。IDE 的高亮可以帮你检查配对。\n\n3. 中文输入法下的符号（最常见！）\n代码里所有符号必须在英文输入法下打。中文输入法的 ；" " （ ） 和英文的 ; " " ( ) 长得像但不是同一个字符，编译器不认识。\n\n// 编译错误！\nint x = 10；  // ← 这个是中文分号\ncout << "Hello"；  // ← 中文引号 + 中文分号\n\n养成习惯：写代码时切换到英文输入法。',
      },
    },
    {
      id: 'cpp-01-start-c6',
      cardType: 'code',
      content: {
        title: 'using namespace std',
        code: '// 方式一：每次加 std:: 前缀\n#include <iostream>\n\nint main() {\n  std::cout << "Hello";\n  return 0;\n}\n\n// 方式二：引入 using namespace\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello";  // 不需要 std::\n  return 0;\n}',
        language: 'cpp',
        highlights: [4, 12, 13],
      },
    },
    {
      id: 'cpp-01-start-c7',
      cardType: 'concept',
      content: {
        title: '注释',
        body: '注释是对代码的说明，编译器会忽略它们。C++ 支持两种注释：\n\n单行注释：\n// 这是注释，从 // 到行末都被忽略\n\n多行注释：\n/* 这是\n   多行注释\n   可以跨越多行 */\n\n注释的用途：\n1. 解释复杂逻辑，帮助他人（和未来的自己）理解代码\n2. 临时禁用某段代码（调试时常用）\n3. 标注作者、日期、版本信息\n\n初学阶段建议多写注释，养成好习惯。',
      },
    },
    {
      id: 'cpp-01-start-c8',
      cardType: 'practice',
      content: {
        question: 'C++ 中单行注释的写法是？',
        questionType: 'choice',
        options: ['# 这是注释', '// 这是注释', '/* 这是注释 */', '<!-- 这是注释 -->'],
        answer: '// 这是注释',
        explanation: '// 是 C++ 的单行注释符号，从 // 开始到行末都被编译器忽略。# 是预处理指令（如 #include），/* */ 是多行注释，<!-- --> 是 HTML 注释。',
      },
    },
    {
      id: 'cpp-01-start-c9',
      cardType: 'practice',
      content: {
        question: '以下代码有什么问题？\n\nint main() {\n  int x = 10\n  return 0;\n}',
        questionType: 'choice',
        options: ['缺少 #include', '缺少分号', '变量名 x 不合法', '没有错误'],
        answer: '缺少分号',
        explanation: 'int x = 10 后面缺少分号。C++ 每个语句必须以 ; 结尾。编译器会报 expected \';\' 错误——这是初学者最常见的编译错误。',
      },
    },
    {
      id: 'cpp-01-start-c10',
      cardType: 'practice',
      content: {
        question: '以下代码为什么编译失败？\n\nint main() {\n  int x = 10；\n  return 0;\n}',
        questionType: 'choice',
        options: ['缺少 #include', '分号是中文输入法打的', '变量名 x 不合法', 'main 函数写错了'],
        answer: '分号是中文输入法打的',
        explanation: '第 2 行的 ；是中文分号（全角），不是英文分号 ;（半角）。编译器只认识英文符号。中文输入法下的 ；""（）和英文的 ;""() 虽然长得像但字符编码不同。写代码时一定要切换到英文输入法。',
      },
    },
  ],
};
