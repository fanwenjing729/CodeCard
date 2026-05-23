import type { PathNode } from '@/types';

export const scopeNode: PathNode = {
  id: 'cpp-01-basics-scope',
  courseId: 'cpp',
  type: 'knowledge',
  moduleId: 'basics',
  module: '基础',
  title: '作用域',
  cards: [
    {
      id: 'cpp-01-basics-scope-c1',
      cardType: 'concept',
      content: {
        title: '什么是作用域',
        body: '作用域是变量"能用的范围"。判断标准很简单：\n\n变量在哪个 {} 里声明的，就只能在那个 {} 里面用。出了 {} 就"死"了。\n\nint main() {        // 外层 {} 开始\n    int a = 10;      // a 在这里出生\n\n    {               // 内层 {} 开始\n        int b = 20;  // b 在这里出生\n    }               // 内层 {} 结束，b 死亡\n\n    // cout << b;   // 编译错误！b 已经不存在了\n    cout << a;      // OK：a 还活着\n}                   // 外层 {} 结束，a 死亡\n\n一句话：{} 就是变量生命的边界。进去出生，出来死亡。',
      },
    },
    {
      id: 'cpp-01-basics-scope-c2',
      cardType: 'code',
      content: {
        title: '嵌套作用域示例',
        code: '#include <iostream>\n\nint main() {\n  int a = 10;            // a 在整个 main 里活着\n  std::cout << a << \'\\n\';\n\n  {                      // 内层块\n    int b = 20;          // b 只在这个块里活着\n    std::cout << a << \'\\n\';  // OK：能访问外层的 a\n    std::cout << b << \'\\n\';  // OK：b 在自己的作用域里\n  }                      // b 死亡\n\n  std::cout << a << \'\\n\';  // OK\n  // std::cout << b;     // 编译错误！b 已经不存在了\n  return 0;\n}',
        language: 'cpp',
        highlights: [3, 7, 9, 10, 13],
      },
    },
    {
      id: 'cpp-01-basics-scope-c3',
      cardType: 'animation',
      content: {
        animationId: 'scope-lifecycle',
      },
    },
    {
      id: 'cpp-01-basics-scope-c4',
      cardType: 'practice',
      content: {
        question: '以下代码有什么问题？\n\n{\n  int x = 10;\n}\ncout << x;',
        questionType: 'choice',
        options: ['缺少分号', 'x 在 {} 外面已经不存在了', '变量名 x 不合法', '没有错误'],
        answer: 'x 在 {} 外面已经不存在了',
        explanation: 'x 在 {} 里面声明，出了 {} 就被销毁了。cout << x 写在 {} 外面，此时 x 已经不存在，编译器报"未声明的标识符"错误。',
      },
    },
  ],
};
