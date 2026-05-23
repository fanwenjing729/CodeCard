import type { PathNode } from '@/types';

export const ioNode: PathNode = {
  id: 'cpp-01-basics-io',
  courseId: 'cpp',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: '输入与输出',
  cards: [
    {
      id: 'cpp-01-basics-io-c1',
      cardType: 'concept',
      content: {
        title: '用 cout 输出',
        body: 'cout（console output）是 C++ 在屏幕上打印文字的方式。它来自 <iostream> 库，属于 std 命名空间。\n\nstd::cout << "Hello";  // 输出一行文字\nstd::cout << 42;       // 输出数字\nstd::cout << 3.14;     // 输出小数\n\n<< 叫"流插入运算符"，把右边的数据送进输出流。可以串联：\n\nstd::cout << "x = " << x << \'\\n\';\n\n\\n 是换行符。std::endl 也能换行，但会额外刷新缓冲区，一般用 \\n 就够了。',
      },
    },
    {
      id: 'cpp-01-basics-io-c2',
      cardType: 'code',
      content: {
        title: 'cout 输出示例',
        code: '#include <iostream>\n\nint main() {\n  int age = 25;\n  double score = 92.5;\n\n  std::cout << "年龄: " << age << \'\\n\';\n  std::cout << "分数: " << score << std::endl;\n  std::cout << "总分: " << age + score << \'\\n\';\n  return 0;\n}',
        language: 'cpp',
        highlights: [0, 3, 4, 6, 7, 8],
      },
    },
    {
      id: 'cpp-01-basics-io-c3',
      cardType: 'concept',
      content: {
        title: '用 cin 输入',
        body: 'cin（console input）从键盘读取用户输入。它和 cout 来自同一个库。\n\nint age;\nstd::cin >> age;  // 等待用户输入，按回车确认\n\n>> 叫"流提取运算符"，从输入流中取数据放到变量里。\n\ncin 以空白字符（空格、Tab、换行）作为分隔。输入 "25 9.99" 时：\n\nint x; double y;\nstd::cin >> x >> y;  // x=25, y=9.99，一次读取两个\n\n重要：cin 不会提示用户输入，通常需要先用 cout 给出提示。',
      },
    },
    {
      id: 'cpp-01-basics-io-c4',
      cardType: 'code',
      content: {
        title: 'cin 读取多种类型',
        code: '#include <iostream>\n#include <string>\n\nint main() {\n  std::string name;\n  int age;\n  double height;\n\n  std::cout << "输入姓名: ";\n  std::cin >> name;\n  std::cout << "输入年龄: ";\n  std::cin >> age;\n  std::cout << "输入身高(m): ";\n  std::cin >> height;\n\n  std::cout << name << " 今年 " << age\n            << " 岁，身高 " << height << "m\\n";\n  return 0;\n}',
        language: 'cpp',
        highlights: [0, 1, 4, 5, 6, 8, 10, 12, 15],
      },
    },
    {
      id: 'cpp-01-basics-io-c5',
      cardType: 'practice',
      content: {
        question: '用户输入 "Alice 25"，以下代码中 name 的值是什么？\n\nstd::string name;\nint age;\nstd::cin >> name >> age;',
        questionType: 'choice',
        options: ['"Alice 25"', '"Alice"', '"Alice "', '编译错误'],
        answer: '"Alice"',
        explanation: 'cin >> 以空白字符（空格、Tab、换行）作为分隔符。遇到空格就停止读取当前变量，所以 name 只读到了 "Alice"，age 读到了 25。如果想读带空格的整行文字，用 std::getline(cin, name)。',
      },
    },
    {
      id: 'cpp-01-basics-io-c6',
      cardType: 'practice',
      content: {
        question: '补全以下代码，从键盘读取一个整数存到变量 n 中：\n\nint n;\nstd::_____ >> n;',
        questionType: 'fill',
        answer: 'cin',
        explanation: 'cin 用于从键盘读取输入，>> 是流提取运算符。cout 和 cin 方向不同——cout << 是输出（数据流向屏幕），cin >> 是输入（数据从键盘流向变量）。',
      },
    },
    {
      id: 'cpp-01-basics-io-c7',
      cardType: 'code',
      content: {
        title: '综合：输入 → 处理 → 输出',
        code: '#include <iostream>\n\nint main() {\n  double a, b;\n  std::cout << "输入两个数: ";\n  std::cin >> a >> b;\n\n  std::cout << a << " + " << b << " = "\n            << a + b << \'\\n\';\n  std::cout << a << " * " << b << " = "\n            << a * b << \'\\n\';\n  return 0;\n}',
        language: 'cpp',
        highlights: [0, 4, 5, 7, 10],
      },
    },
  ],
};
