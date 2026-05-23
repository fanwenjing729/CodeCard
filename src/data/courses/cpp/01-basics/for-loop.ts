import type { PathNode } from '@/types';

export const forLoopNode: PathNode = {
  id: 'cpp-01-basics-for-loop',
  courseId: 'cpp',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: 'for 循环',
  cards: [
    {
      id: 'cpp-01-basics-for-loop-c1',
      cardType: 'concept',
      content: {
        title: 'for 循环 — 重复执行',
        body: 'for 循环让一段代码反复执行，直到条件不再成立。三段式控制整个循环：\n\nfor (初始化; 条件; 更新) {\n    // 循环体\n}\n\n执行顺序：\n\n          ① 初始化（只执行一次）\n              ↓\n      ② 检查条件 ──false──→ 跳出循环\n          │ true\n          ↓\n      ③ 执行循环体\n          ↓\n      ④ 执行更新（i++）\n          ↓\n    回到 ②（再次检查条件）\n\n对照例子：\n\n✓ 循环 5 次：\n  for (int i = 0; i < 5; i++) {\n      cout << i << " ";\n  }\n  // 输出：0 1 2 3 4（0+1+2+3+4=5 次）\n\n✗ 永远不会执行：\n  for (int i = 0; i < 0; i++) {\n      cout << i;\n  }\n  // i=0, 0<0 为 false，循环体一次都不跑\n\n判断标准：循环条件现在还成立吗？成立 → 再跑一遍；不成立 → 跳出。\n\n一句话记住：初始化做一次，条件每次查，更新每次跑。',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c2',
      cardType: 'code',
      content: {
        title: '1-100 累加',
        code: '#include <iostream>\n\nint main() {\n  int sum = 0;\n  for (int i = 1; i <= 100; i++) {\n    sum += i;\n  }\n  std::cout << "1~100 的和为：" << sum << "\\n";\n  return 0;\n}',
        language: 'cpp',
        highlights: [3, 4, 5, 6],
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c3',
      cardType: 'animation',
      content: {
        animationId: 'for-loop',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c4',
      cardType: 'concept',
      content: {
        title: '范围 for — 遍历集合',
        body: 'C++11 引入的范围 for 让你不用手动管理索引和边界。\n\n语法：\n\nfor (类型 变量 : 集合) {\n    // 变量依次取集合中的每个元素\n}\n\n每轮循环，变量自动取集合的下一个元素——不需要 i、不需要 <、不需要 ++。\n\n对照例子：\n\n手动索引（旧方式）：\n  int arr[] = {1, 2, 3};\n  for (int i = 0; i < 3; i++) {\n      cout << arr[i] << " ";  // 手动取 arr[i]\n  }\n  // 需要管三件事：起始 i=0、条件 i<3、更新 i++\n\n范围 for（新方式，推荐）：\n  int arr[] = {1, 2, 3};\n  for (int v : arr) {\n      cout << v << " ";       // v 直接就是元素值\n  }\n  // 三件事都不用管，v 自己挨个取\n\n关于 auto：\n上述代码中类型写的是 int——但如果元素类型很长（比如以后会学的 vector<string>），每次都写很麻烦。auto 让编译器自动推导类型：\n\n  for (auto v : arr) { cout << v; }\n  // auto = 编译器替你把 int 填上\n\nauto 不是必须的，但让代码更简洁。初学阶段建议先从具体类型写起，习惯后再用 auto。\n\n底层原理：范围 for 不是 C++ 语言内置的新语法，而是编译器的"翻译服务"：\n\n你写的：                    编译器翻译成：\nfor (int v : arr) {          int n = 元素个数;\n    cout << v;               for (int i = 0; i < n; i++) {\n}                                int v = arr[i];\n                                 cout << v;\n                             }\n\n本质就是普通 for 循环——编译器替你管了索引和边界，你只管元素本身。\n\n一句话记住：有索引用普通 for，挨个取用范围 for。',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c5',
      cardType: 'code',
      content: {
        title: '范围 for 示例',
        code: '#include <iostream>\n\nint main() {\n  int scores[] = {85, 92, 78, 95, 88};\n\n  int sum = 0;\n  for (int s : scores) {\n    sum += s;\n  }\n\n  std::cout << "总分：" << sum << "\\n";\n  std::cout << "均分：" << sum / 5 << "\\n";\n  return 0;\n}',
        language: 'cpp',
        highlights: [5, 6, 7, 9, 10],
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c6',
      cardType: 'concept',
      content: {
        title: '嵌套循环',
        body: '一个循环里面再放一个循环，外层走一步，内层走一圈。\n\nfor (int i = 1; i <= 3; i++) {     // 外层：跑 3 遍\n    for (int j = 1; j <= 2; j++) { // 内层：每遍跑 2 遍\n        cout << i << "," << j << "  ";\n    }\n}\n// 输出：1,1  1,2  2,1  2,2  3,1  3,2\n// 总共 3×2 = 6 次输出\n\n典型用法——九九乘法表：\n\nfor (int i = 1; i <= 9; i++) {\n    for (int j = 1; j <= i; j++) {\n        cout << j << "×" << i << "=" << i*j << " ";\n    }\n    cout << "\\n";  // 每行结束换行\n}\n\n一句话记住：外层走一步，内层走一圈。',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c7',
      cardType: 'concept',
      content: {
        title: 'break 与 continue — 控制循环流程',
        body: 'break 和 continue 让你在循环中途改变执行流程。两者都只对当前所在的那层循环生效。\n\nbreak — 直接跳出：\n遇到 break 立即结束整个循环，剩下的迭代全部跳过。\n\ncontinue — 跳过本轮：\n遇到 continue 只跳过本轮循环剩下的代码，下一轮照常运行。\n\n对照例子：\n\nbreak：\n  for (int i = 1; i <= 5; i++) {\n      if (i == 3) break;    // i=3 时直接跳出\n      cout << i << " ";\n  }\n  // 输出：1 2（i=3 时 break，循环结束）\n\ncontinue：\n  for (int i = 1; i <= 5; i++) {\n      if (i == 3) continue; // i=3 时跳过这轮\n      cout << i << " ";\n  }\n  // 输出：1 2 4 5（跳过 3，后面的照常）\n\n一句话记住：break 是"不干了"，continue 是"这轮跳过"。',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c8',
      cardType: 'animation',
      content: {
        animationId: 'break-continue',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c9',
      cardType: 'practice',
      content: {
        question: '以下代码输出什么？\n\nfor (int i = 1; i <= 5; i++) {\n  if (i == 4) break;\n  cout << i << " ";\n}',
        questionType: 'choice',
        options: ['1 2 3 4 5', '1 2 3', '1 2 3 4', '1 2 4 5'],
        answer: '1 2 3',
        explanation: 'i=1,2,3 时正常输出。i=4 时满足 if 条件，break 直接跳出循环——i=5 永远不会执行。和动画里 i=3 触发 break 是同一个原理，只是断点位置不同。',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c10',
      cardType: 'practice',
      content: {
        question: 'for (int i = 0; i < 5; i++) 的循环体共执行几次？',
        questionType: 'choice',
        options: ['4 次', '5 次', '6 次', '取决于循环体内容'],
        answer: '5 次',
        explanation: 'i 取值依次为 0、1、2、3、4——共 5 次。当 i 变为 5 时，5 < 5 为 false，不再进入循环体。这是最常见的 off-by-one 问题：注意 i 从 0 开始，不是从 1 开始。',
      },
    },
    {
      id: 'cpp-01-basics-for-loop-c11',
      cardType: 'practice',
      content: {
        question: 'for (int i = 1; i <= 3; i++) { for (int j = 0; j < 2; j++) { cout << "A"; } } 输出几个 A？',
        questionType: 'choice',
        options: ['3 个', '5 个', '6 个', '9 个'],
        answer: '6 个',
        explanation: '外层跑 3 遍（i=1,2,3），每遍内层跑 2 遍（j=0,1）。3 × 2 = 6 个 A。嵌套循环的总执行次数 = 外层次数 × 内层次数。',
      },
    },
  ],
};
