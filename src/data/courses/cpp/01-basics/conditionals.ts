import type { PathNode } from '@/types';

export const conditionalsNode: PathNode = {
  id: 'cpp-01-basics-cond',
  courseId: 'cpp',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: '条件分支',
  cards: [
    {
      id: 'cpp-01-basics-cond-c1',
      cardType: 'concept',
      content: {
        title: 'if/else/else if — 让程序做选择',
        body: 'if/else 让程序根据条件选择执行哪段代码。\n\n基本形式：\n\nif (条件) {\n    // 条件为 true → 执行这里\n} else {\n    // 条件为 false → 执行这里\n}\n\n多条件用 else if：\n\nif (条件1) {\n    // 条件1 成立 → 执行这里\n} else if (条件2) {\n    // 条件1 不成立、条件2 成立 → 执行这里\n} else {\n    // 以上都不成立 → 执行这里\n}\n\n关键规则：多个条件从上到下依次检查，第一个成立的被执行，后面的全部跳过。else 和 else if 都不是必须的——只在需要时写。\n\n判断标准：条件表达式的结果是 true 还是 false？\n\n对照例子：\n\n✓ 正确判断：\n  int score = 85;\n  if (score >= 60) {        // 85 >= 60 → true\n      cout << "及格";\n  }\n\n✗ 常见错误：\n  if (score = 60) {         // = 是赋值不是比较！\n      cout << "及格";        // 非零值转 true，永远执行\n  }                         // 应该用 ==\n\n一句话记住：条件为真走 if，为假走 else；多个条件用 else if。',
      },
    },
    {
      id: 'cpp-01-basics-cond-c2',
      cardType: 'code',
      content: {
        title: '成绩等级判断',
        code: '#include <iostream>\n\nint main() {\n  int score;\n  std::cin >> score;\n\n  if (score >= 90) {\n    std::cout << "A\\n";\n  } else if (score >= 80) {\n    std::cout << "B\\n";\n  } else if (score >= 70) {\n    std::cout << "C\\n";\n  } else if (score >= 60) {\n    std::cout << "D\\n";\n  } else {\n    std::cout << "F\\n";\n  }\n\n  return 0;\n}',
        language: 'cpp',
        highlights: [5, 7, 9, 11, 13, 15],
      },
    },
    {
      id: 'cpp-01-basics-cond-c3',
      cardType: 'animation',
      content: {
        animationId: 'if-else-if-ladder',
      },
    },
    {
      id: 'cpp-01-basics-cond-c4',
      cardType: 'concept',
      content: {
        title: 'switch — 等值多分支',
        body: '当一个变量和多个确定的值比较时，switch 比 if/else if 更清晰。\n\nswitch (表达式) {\n  case 值1:\n      // 表达式 == 值1 → 执行这里\n      break;        // 跳出 switch，防止穿透\n  case 值2:\n      // 表达式 == 值2 → 执行这里\n      break;\n  default:\n      // 都不匹配 → 执行这里\n}\n\n关键规则：\n\n1. break：匹配成功后执行到 break 就跳出。如果忘了写 break，会继续往下执行（叫"穿透"或 fall-through），把下一个 case 的代码也跑了——通常这不是你想要的。\n\n2. switch 括号里只能是 int、char、enum（枚举类型，后续会学），不能是 string 或 double。\n\n3. default 是可选的——所有 case 都不匹配时走这里。\n\n判断标准：我的变量和哪些确定的值在比较？如果答案 ≥ 3 个且比较的都是等值（不是范围），用 switch。如果比较的是范围（>、<），用 if/else。',
      },
    },
    {
      id: 'cpp-01-basics-cond-c5',
      cardType: 'code',
      content: {
        title: 'switch 示例',
        code: '#include <iostream>\n\nint main() {\n  int day;\n  std::cin >> day;\n\n  switch (day) {\n    case 1:\n      std::cout << "星期一\\n";\n      break;\n    case 2:\n      std::cout << "星期二\\n";\n      break;\n    case 3:\n      std::cout << "星期三\\n";\n      break;\n    case 4:\n      std::cout << "星期四\\n";\n      break;\n    case 5:\n      std::cout << "星期五\\n";\n      break;\n    case 6:\n      std::cout << "星期六\\n";\n      break;\n    case 7:\n      std::cout << "星期日\\n";\n      break;\n    default:\n      std::cout << "无效\\n";\n  }\n\n  return 0;\n}',
        language: 'cpp',
        highlights: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      },
    },
    {
      id: 'cpp-01-basics-cond-c6',
      cardType: 'animation',
      content: {
        animationId: 'switch-fallthrough',
      },
    },
    {
      id: 'cpp-01-basics-cond-c7',
      cardType: 'concept',
      content: {
        title: '三目运算符 ? :',
        body: '三目运算符是 if/else 的"压缩版"，适合简单的"二选一"赋值。\n\n语法：\n条件 ? 表达式1 : 表达式2\n\n条件为 true → 返回表达式 1\n条件为 false → 返回表达式 2\n\n对照例子：\n\n适合用三目 ✓：\n  int max = (a > b) ? a : b;    // 简洁，一行搞定\n\n不适合用三目 ✗：\n  score >= 60 ? (cout << "及格", sendMsg()) : (cout << "不及格", retry());\n  // 太复杂，换 if/else 写，可读性更重要\n\n一句话记住：简单二选一用 ? :，超过两行就用 if/else。',
      },
    },
    {
      id: 'cpp-01-basics-cond-c8',
      cardType: 'practice',
      content: {
        question: '以下代码执行后输出什么？\n\nint x = 2;\nswitch (x) {\n  case 1:\n    cout << "A";\n  case 2:\n    cout << "B";\n  case 3:\n    cout << "C";\n    break;\n  default:\n    cout << "D";\n}',
        questionType: 'choice',
        options: ['B', 'BC', 'BCD', '编译错误'],
        answer: 'BC',
        explanation: 'x=2 匹配 case 2 → 输出 B。但 case 2 后面没有 break，程序继续执行 case 3 → 又输出 C。直到 case 3 的 break 才跳出。这就是"穿透"（fall-through）。如果想只输出 B，需要在 case 2 后面加 break。',
      },
    },
    {
      id: 'cpp-01-basics-cond-c9',
      cardType: 'practice',
      content: {
        question: '以下代码有什么问题？\n\nint score = 55;\nif (score = 60) {\n  cout << "及格";\n}',
        questionType: 'choice',
        options: ['没有分号', '= 是赋值不是比较，条件永远为真', 'score 没初始化', 'if 后面不该有空格'],
        answer: '= 是赋值不是比较，条件永远为真',
        explanation: 'if (score = 60) 用的是 =（赋值），不是 ==（比较）。= 把 60 放进 score，整个表达式的值是 60，非零转 bool 为 true——所以无论 score 原来是多少，这里都会输出"及格"。正确写法：if (score == 60) ——两个等号才是判断相等。',
      },
    },
  ],
};
