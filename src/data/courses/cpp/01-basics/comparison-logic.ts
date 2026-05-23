import type { PathNode } from '@/types';

export const comparisonLogicNode: PathNode = {
  id: 'cpp-01-basics-cmp-logic',
  courseId: 'cpp',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: '比较与逻辑运算符',
  cards: [
    {
      id: 'cpp-01-basics-cmp-logic-c1',
      cardType: 'concept',
      content: {
        title: '比较运算符',
        body: '比较运算符用来判断两个值的大小或相等关系。结果只有两种可能：成立（true）或不成立（false）。这种"非真即假"的类型叫 bool。\n\n六个比较运算符：\n\n>   大于      5 > 3   → true\n<   小于      5 < 3   → false\n>=  大于等于   5 >= 5  → true\n<=  小于等于   5 <= 3  → false\n==  等于      5 == 3  → false\n!=  不等于    5 != 3  → true\n\n判断标准：把比较运算符放在两个值中间，问自己"这个比较成立吗？"\n\n注意：== 是"判断相等"，= 是"赋值"——两个完全不同的运算符，第三张概念卡会详细对比。',
      },
    },
    {
      id: 'cpp-01-basics-cmp-logic-c2',
      cardType: 'code',
      content: {
        title: '比较运算符示例',
        code: '#include <iostream>\n\nint main() {\n  int a = 5, b = 3;\n\n  std::cout << "a > b:  " << (a > b)  << \'\\n\';  // 1（true）\n  std::cout << "a < b:  " << (a < b)  << \'\\n\';  // 0（false）\n  std::cout << "a >= b: " << (a >= b) << \'\\n\';  // 1\n  std::cout << "a <= b: " << (a <= b) << \'\\n\';  // 0\n  std::cout << "a == b: " << (a == b) << \'\\n\';  // 0\n  std::cout << "a != b: " << (a != b) << \'\\n\';  // 1\n\n  return 0;\n}',
        language: 'cpp',
        highlights: [4, 5, 6, 7, 8, 9],
      },
    },
    {
      id: 'cpp-01-basics-cmp-logic-c3',
      cardType: 'concept',
      content: {
        title: '逻辑运算符',
        body: '逻辑运算符用来组合多个比较结果。\n\n&&  与（AND）  两边都为 true，结果才为 true\n||  或（OR）   至少一边为 true，结果就为 true\n!   非（NOT）  把 true 变 false，false 变 true\n\n真值表（1 = true，0 = false）：\n\nA && B：\n  1 && 1 = 1    1 && 0 = 0\n  0 && 1 = 0    0 && 0 = 0\n\nA || B：\n  1 || 1 = 1    1 || 0 = 1\n  0 || 1 = 1    0 || 0 = 0\n\n!A：\n  !1 = 0    !0 = 1\n\n一句话记住：\n  && → "两边都是真"\n  || → "至少一边是真"\n  !  → "反过来"',
      },
    },
    {
      id: 'cpp-01-basics-cmp-logic-c4',
      cardType: 'code',
      content: {
        title: '逻辑运算符示例',
        code: '#include <iostream>\n\nint main() {\n  int age = 20;\n  bool hasID = true;\n\n  // &&：两边都成立才为 true\n  std::cout << (age >= 18 && hasID) << \'\\n\';  // 1（true）\n\n  // ||：至少一边成立就为 true\n  bool hasCard = false;\n  std::cout << (hasCard || hasID) << \'\\n\';    // 1（true）\n\n  // !：取反\n  bool isWeekend = false;\n  std::cout << (!isWeekend) << \'\\n\';           // 1（true）\n\n  return 0;\n}',
        language: 'cpp',
        highlights: [6, 9, 12],
      },
    },
    {
      id: 'cpp-01-basics-cmp-logic-c5',
      cardType: 'concept',
      content: {
        title: '= 和 == 的区别（重要！）',
        body: '= 和 == 是两个最容易搞混的运算符，但做的事完全不同：\n\n=  赋值运算符    把右边的值放进左边的变量\n== 比较运算符    判断左右两边是否相等，返回 true/false\n\n对照例子：\n\n能正确运行 ✓：\n  int x = 10;            // 赋值：把 10 放进 x\n  bool b = (x == 10);    // 比较：x 等于 10 吗？→ true\n\n和你预期不符 ✗：\n  int x = 10;\n  bool b = (x = 5);      // 这是赋值！把 5 放进 x\n                         // 表达式 (x=5) 的值是 5\n                         // 5 非零→转 bool 为 true\n                         // 但你的本意可能是判断 x 是否等于 5\n\n一句话记住：= 是"放进去"，== 是"相等吗？"',
      },
    },
    {
      id: 'cpp-01-basics-cmp-logic-c6',
      cardType: 'practice',
      content: {
        question: '10 > 7 的结果是？',
        questionType: 'choice',
        options: ['true', 'false', '10', '7'],
        answer: 'true',
        explanation: '> 是比较运算符，判断左边是否大于右边。10 确实大于 7，所以结果为 true。比较运算符的结果永远是 bool 类型（true 或 false），不会是数字。',
      },
    },
    {
      id: 'cpp-01-basics-cmp-logic-c7',
      cardType: 'practice',
      content: {
        question: '(8 > 3) && (5 < 2) 的结果是？',
        questionType: 'choice',
        options: ['true', 'false', '8', '编译错误'],
        answer: 'false',
        explanation: '8 > 3 是 true，但 5 < 2 是 false。&&（与）要求两边都是 true 结果才为 true。有一边是 false，结果就是 false。',
      },
    },
    {
      id: 'cpp-01-basics-cmp-logic-c8',
      cardType: 'practice',
      content: {
        question: '以下哪个符号用来判断两个值是否相等？',
        questionType: 'choice',
        options: ['=', '==', '!=', '+='],
        answer: '==',
        explanation: '== 是比较运算符，判断左右两边是否相等。= 是赋值运算符，!= 是判断"不相等"，+= 是复合赋值。判断相等用两个等号，赋值用一个等号——这是 C++ 初学者最容易搞混的地方。',
      },
    },
  ],
};
