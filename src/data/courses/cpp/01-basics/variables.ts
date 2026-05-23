import type { PathNode } from '@/types';

export const variablesNode: PathNode = {
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
      cardType: 'code',
      content: {
        title: 'sizeof 查看类型大小',
        code: '#include <iostream>\n\nint main() {\n  std::cout << "int: " << sizeof(int) << "\\n";\n  std::cout << "double: " << sizeof(double) << "\\n";\n  std::cout << "char: " << sizeof(char) << "\\n";\n  std::cout << "bool: " << sizeof(bool) << "\\n";\n  std::cout << "short: " << sizeof(short) << "\\n";\n  std::cout << "long long: " << sizeof(long long) << "\\n";\n  return 0;\n}',
        language: 'cpp',
        highlights: [0, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    },
    {
      id: 'cpp-01-basics-var-c5',
      cardType: 'practice',
      content: {
        question: '在大多数平台上，sizeof(int) 的典型返回值是？',
        questionType: 'choice',
        options: ['2', '4', '8', '取决于编译器，无法确定'],
        answer: '4',
        explanation: '在 32 位和 64 位平台上，int 通常占用 4 字节（32 位），值域约 ±21 亿。2 字节是 short，8 字节是 long 或 long long。',
      },
    },
    {
      id: 'cpp-01-basics-var-c6',
      cardType: 'concept',
      content: {
        title: '初始化与赋值',
        body: '初始化（声明时给值）和赋值（声明后再给值）是两个不同的操作：\n\nint x = 10;   // 初始化：声明同时赋值\nint y;\ny = 20;       // 赋值：先声明，后赋值\n\n关键区别：\n1. 未初始化的局部变量值是未定义的（UB），C++ 不会自动清零\n2. 全局变量和静态变量会自动初始化为 0\n3. C++11 起推荐用花括号初始化：int x{10};\n\n花括号初始化会检查类型收窄，更安全：\nint a{3.14};  // 编译错误！double 不能收窄为 int',
      },
    },
    {
      id: 'cpp-01-basics-var-c7',
      cardType: 'practice',
      content: {
        question: '以下代码输出什么结果？\n\nint x;\ncout << x;',
        questionType: 'choice',
        options: ['0', '不确定（垃圾值）', '编译错误', 'null'],
        answer: '不确定（垃圾值）',
        explanation: '在函数内部声明的局部变量如果不初始化，它的值是未定义的（不确定的垃圾值）。C++ 不会自动给局部变量赋 0。读取未初始化变量是未定义行为（Undefined Behavior），应该始终初始化变量。',
      },
    },
    {
      id: 'cpp-01-basics-var-c8',
      cardType: 'practice',
      content: {
        question: '请补全声明一个双精度浮点数 price，值为 19.99 的语句：\n\n_____ price = 19.99;',
        questionType: 'fill',
        answer: 'double',
        explanation: 'double 是 C++ 中表示双精度浮点数的关键字。对应的单精度是 float（4 字节），一般情况优先用 double（8 字节，精度更高）。',
      },
    },
    {
      id: 'cpp-01-basics-var-c9',
      cardType: 'concept',
      content: {
        title: '标识符命名规则',
        body: '变量名（标识符）必须遵守以下规则：\n\n1. 只能由字母（A-Z, a-z）、数字（0-9）和下划线（_）组成\n2. 必须以字母或下划线开头，不能以数字开头\n3. 区分大小写：age 和 Age 是两个不同的变量\n4. 不能使用 C++ 关键字（如 int, double, return, if, for 等）\n\n命名惯例：\n• 小驼峰：studentName, totalScore（推荐）\n• 下划线：student_name, total_score\n• 大驼峰：StudentName（通常用于类名）\n\n合法的例子：age、_count、x1、firstName\n不合法的例子：2name（数字开头）、my-var（含连字符）、int（关键字）',
      },
    },
    {
      id: 'cpp-01-basics-var-c10',
      cardType: 'practice',
      content: {
        question: '以下哪个是合法的 C++ 变量名？',
        questionType: 'choice',
        options: ['2ndPlace', 'my-variable', 'double', '_total'],
        answer: '_total',
        explanation: '_total 以下划线开头，合法。2ndPlace 以数字开头不合法，my-variable 含连字符 - 不合法（编译器会把它当作减法），double 是 C++ 关键字不能用作变量名。',
      },
    },
  ],
};
