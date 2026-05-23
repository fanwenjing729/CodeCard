import type { PathNode } from '@/types';

export const operatorsNode: PathNode = {
  id: 'cpp-01-basics-op',
  courseId: 'cpp',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: '运算符与表达式',
  cards: [
    {
      id: 'cpp-01-basics-op-c1',
      cardType: 'concept',
      content: {
        title: '算术运算符',
        body: 'C++ 提供五种基本算术运算符：\n\n+  加法    a + b\n-  减法    a - b\n*  乘法    a * b\n/  除法    a / b\n%  取模（取余）  a % b\n\n注意事项：\n1. 整数除法会截断小数部分：5 / 2 结果是 2（不是 2.5）\n2. 要做小数除法，至少一个操作数是浮点：5.0 / 2 结果是 2.5\n3. % 只能用于整数，结果是余数：7 % 3 结果是 1\n4. 乘除优先于加减，括号 () 可以改变优先级',
      },
    },
    {
      id: 'cpp-01-basics-op-c2',
      cardType: 'code',
      content: {
        title: '算术运算符示例',
        code: '#include <iostream>\n\nint main() {\n  int a = 10, b = 3;\n\n  std::cout << "a + b = " << a + b << \'\\n\';   // 13\n  std::cout << "a - b = " << a - b << \'\\n\';   // 7\n  std::cout << "a * b = " << a * b << \'\\n\';   // 30\n  std::cout << "a / b = " << a / b << \'\\n\';   // 3（整数除法截断）\n  std::cout << "a % b = " << a % b << \'\\n\';   // 1\n\n  std::cout << "a / 2.0 = " << a / 2.0 << \'\\n\'; // 5.0\n  return 0;\n}',
        language: 'cpp',
        highlights: [4, 5, 6, 7, 8, 10],
      },
    },
    {
      id: 'cpp-01-basics-op-c3',
      cardType: 'practice',
      content: {
        question: '7 / 2 的结果是多少？',
        questionType: 'choice',
        options: ['3.5', '3', '4', '编译错误'],
        answer: '3',
        explanation: '整数除法会直接截断小数部分，不进行四舍五入。7 / 2 = 3（不是 3.5）。如果需要一个操作数是浮点数，例如 7.0 / 2 或 7 / 2.0，结果才是 3.5。',
      },
    },
    {
      id: 'cpp-01-basics-op-c4',
      cardType: 'concept',
      content: {
        title: '赋值运算符',
        body: '赋值运算符 = 把右边表达式的值赋给左边的变量。\n\nint x = 10;    // x 的值变为 10\nx = x + 5;     // 先算右边 x+5=15，再赋给左边，x 变为 15\n\n复合赋值运算符（简写）：\nx += 5;   等价于  x = x + 5;\nx -= 3;   等价于  x = x - 3;\nx *= 2;   等价于  x = x * 2;\nx /= 4;   等价于  x = x / 4;\nx %= 2;   等价于  x = x % 2;\n\n复合赋值既简洁又高效，推荐使用。\n\n注意：= 是赋值，== 是判断相等——这是初学者最常混淆的地方。',
      },
    },
    {
      id: 'cpp-01-basics-op-c5',
      cardType: 'practice',
      content: {
        question: 'int a = 5; a += 3; 执行后 a 的值是？',
        questionType: 'choice',
        options: ['5', '3', '8', '53'],
        answer: '8',
        explanation: 'a += 3 等价于 a = a + 3，即 a = 5 + 3 = 8。+= 是加后赋值的简写，不是字符串拼接。',
      },
    },
    {
      id: 'cpp-01-basics-op-c6',
      cardType: 'concept',
      content: {
        title: '自增与自减运算符',
        body: '++ 和 -- 是 C++ 的特色运算符，让变量加 1 或减 1。\n\n自增（+1）：\nint x = 5;\nx++;    // x 变为 6（等价于 x = x + 1）\n++x;    // x 变为 7（也等价于 x = x + 1）\n\n自减（-1）：\nint y = 5;\ny--;    // y 变为 4\n--y;    // y 变为 3\n\n前缀（++x）和后缀（x++）的区别：\n• ++x 先加后用：先让 x 加 1，再取 x 的值\n• x++ 先用后加：先取 x 的值，再让 x 加 1\n\nint a = 5;\nint b = ++a;   // a=6, b=6（先加后赋值）\n\nint c = 5;\nint d = c++;   // d=5, c=6（先赋值后加）\n\n这在循环中非常常用，后面会频繁遇到。',
      },
    },
    {
      id: 'cpp-01-basics-op-c7',
      cardType: 'code',
      content: {
        title: '自增自减示例',
        code: '#include <iostream>\n\nint main() {\n  int x = 10;\n  int y = x++;  // y=10, x=11\n  int z = ++x;  // x=12, z=12\n\n  std::cout << "x = " << x << \'\\n\';   // 12\n  std::cout << "y = " << y << \'\\n\';   // 10\n  std::cout << "z = " << z << \'\\n\';   // 12\n\n  int m = 5;\n  m--;           // m = 4\n  int n = --m;   // m = 3, n = 3\n  std::cout << "m = " << m << \',\';\n  std::cout << " n = " << n << \'\\n\';\n  return 0;\n}',
        language: 'cpp',
        highlights: [4, 5, 6, 8, 9, 10, 13, 14, 15],
      },
    },
    {
      id: 'cpp-01-basics-op-c8',
      cardType: 'practice',
      content: {
        question: 'int a = 5; int b = a++; 执行后 b 的值是？',
        questionType: 'choice',
        options: ['5', '6', '编译错误', '不确定'],
        answer: '5',
        explanation: 'a++ 是后缀自增，先把 a 的当前值 5 赋给 b，然后 a 才加 1 变成 6。如果是 ++a（前缀），则 a 先变成 6，b 也得到 6。',
      },
    },
  ],
};
