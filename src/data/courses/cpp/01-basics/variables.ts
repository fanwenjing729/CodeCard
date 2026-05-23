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
        body: '变量是内存中一块有名字的存储空间。声明变量时必须指定类型——int 存整数，不能塞文字进去。C++ 是强类型语言，类型一旦确定就不能随意混用。\n\n基本类型：int（整数）、double（浮点数）、char（字符）、bool（布尔值）。',
      },
    },
    {
      id: 'cpp-01-basics-var-c2',
      cardType: 'code',
      content: {
        title: '变量声明示例',
        code: 'int age = 25;\ndouble price = 9.99;\nchar grade = \'A\';\nbool isPassed = true;\n\n// 值不变的量可以用大写命名，提醒自己不要修改\ndouble PI = 3.14159;',
        language: 'cpp',
        highlights: [0, 1, 2, 3, 6],
      },
    },
    {
      id: 'cpp-01-basics-var-c3',
      cardType: 'concept',
      content: {
        title: '基本类型',
        body: 'C++ 四种最常用的基本类型：\n\nint — 整数，4 字节\n  例：int age = 25;\n\ndouble — 浮点数，8 字节\n  例：double price = 9.99;\n\nchar — 字符，1 字节\n  例：char grade = \'A\';\n\nbool — 布尔值，1 字节\n  例：bool isPassed = true;\n\n用 sizeof(type) 可以查看类型的实际字节数。',
      },
    },
    {
      id: 'cpp-01-basics-var-c4',
      cardType: 'concept',
      content: {
        title: '扩展整数类型',
        body: '除了 int，C++ 还提供不同范围的整数类型：\n\nshort — 2 字节（短整数，值域较小）\nlong — 4 或 8 字节（长整数，平台相关）\nlong long — 8 字节（超长整数）\n\n无符号类型：\nunsigned int — 不存负数，值域翻倍（0 ~ 42 亿）\nunsigned short / unsigned long 同理\n\n选择建议：一般情况用 int 就够了。需要更大范围用 long long，不需要负数用 unsigned。',
      },
    },
    {
      id: 'cpp-01-basics-var-c5',
      cardType: 'code',
      content: {
        title: 'sizeof 查看类型大小',
        code: '#include <iostream>\n\nint main() {\n  std::cout << "int: " << sizeof(int) << "\\n";\n  std::cout << "double: " << sizeof(double) << "\\n";\n  std::cout << "char: " << sizeof(char) << "\\n";\n  std::cout << "bool: " << sizeof(bool) << "\\n";\n  std::cout << "short: " << sizeof(short) << "\\n";\n  std::cout << "long long: " << sizeof(long long) << "\\n";\n  return 0;\n}',
        language: 'cpp',
        highlights: [0, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    },
    {
      id: 'cpp-01-basics-var-c6',
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
      id: 'cpp-01-basics-var-c7',
      cardType: 'concept',
      content: {
        title: '初始化与赋值',
        body: '初始化（声明时给值）和赋值（声明后再给值）是两个不同的操作：\n\nint x = 10;   // 初始化：声明同时赋值\nint y;\ny = 20;       // 赋值：先声明，后赋值\n\n核心规则：未初始化的局部变量，值是未定义的——C++ 不会自动清零。读到未初始化变量，结果不可预测（可能是任意垃圾值）。\n\n所以养成习惯：声明的同时就初始化它。\n\nint x{10};    // 现代 C++ 也推荐花括号初始化\n              // 比等号更严格：如果类型不匹配会直接报错\n              // int a{3.14};  // 错误！3.14 是 double，不能塞进 int',
      },
    },
    {
      id: 'cpp-01-basics-var-c8',
      cardType: 'practice',
      content: {
        question: '以下代码输出什么结果？\n\nint x;\ncout << x;',
        questionType: 'choice',
        options: ['0', '不确定（垃圾值）', '编译错误', '程序崩溃'],
        answer: '不确定（垃圾值）',
        explanation: '在函数内部声明的局部变量如果不初始化，它的值是未定义的（不确定的垃圾值）。C++ 不会自动给局部变量赋 0。读取未初始化变量是未定义行为（Undefined Behavior），应该始终初始化变量。',
      },
    },
    {
      id: 'cpp-01-basics-var-c9',
      cardType: 'practice',
      content: {
        question: '请补全声明一个双精度浮点数 price，值为 19.99 的语句：\n\n_____ price = 19.99;',
        questionType: 'fill',
        answer: 'double',
        explanation: 'double 是 C++ 中表示双精度浮点数的关键字。对应的单精度是 float（4 字节），一般情况优先用 double（8 字节，精度更高）。',
      },
    },
    {
      id: 'cpp-01-basics-var-c10',
      cardType: 'concept',
      content: {
        title: '标识符命名规则',
        body: '变量名（标识符）必须遵守以下规则：\n\n1. 只能由字母（A-Z, a-z）、数字（0-9）和下划线（_）组成\n2. 必须以字母或下划线开头，不能以数字开头\n3. 区分大小写：age 和 Age 是两个不同的变量\n4. 不能使用 C++ 关键字（如 int, double, return, if, for 等）\n\n命名惯例：\n• 小驼峰：studentName, totalScore（推荐）\n• 下划线：student_name, total_score\n• 大驼峰：StudentName（通常用于类名）\n\n合法的例子：age、_count、x1、firstName\n不合法的例子：2name（数字开头）、my-var（含连字符）、int（关键字）',
      },
    },
    {
      id: 'cpp-01-basics-var-c11',
      cardType: 'concept',
      content: {
        title: '常见 C++ 关键字',
        body: '关键字是 C++ 语言保留使用的词，不能用作变量名。IDE 通常会高亮显示它们。\n\n常见关键字清单（混个眼熟，不用背）：\n\nint  double  float  char  bool  void  auto\nshort  long  unsigned  signed\nconst  constexpr  sizeof  static\nif  else  switch  case  default\nfor  while  do  break  continue\ntrue  false  and  or  not\nreturn  cin  cout\nclass  struct  namespace  using  new  delete\npublic  private  protected  virtual  inline\n\n现阶段只要记住：命名时别跟这些词重名就行。',
      },
    },
    {
      id: 'cpp-01-basics-var-c12',
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
