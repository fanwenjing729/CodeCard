# C++ 课程设计

## 当前进度

| # | 模块 | 状态 | 节点 | 卡片 |
|---|------|------|------|------|
| 01 | 基础 | 🟢 进行中 | 4 / 13 | 36 / ~57 |
| 02 | 进阶 | ⬜ 未开始 | 0 / 5 | 0 / ~24 |
| 03 | 面向对象 | ⬜ 未开始 | 0 / 5 | 0 / ~28 |
| 04 | STL | ⬜ 未开始 | 0 / 5 | 0 / ~21 |
| 05 | 泛型 | ⬜ 未开始 | 0 / 4 | 0 / ~18 |
| 06 | 现代 C++ | ⬜ 未开始 | 0 / 5 | 0 / ~21 |

> 最后更新：2026-05-23 — 完成基础模块前 4 个节点 + 补充转义字符卡片

---

### 01 基础 — 已实现

| # | 节点 | 文件 | 卡片 | 内容 |
|---|------|------|------|------|
| 1 | 第一个程序 | `hello-world.ts` | 7 卡 | Hello World、main 函数与返回值、using namespace std、注释 |
| 2 | 变量声明 | `variables.ts` | 10 卡 | 变量概念、基本类型与 sizeof、初始化与赋值、标识符命名规则 |
| 3 | 运算符与表达式 | `operators.ts` | 8 卡 | 算术运算符、赋值/复合赋值、自增自减（前缀 vs 后缀） |
| 4 | 输入与输出 | `io.ts` | 11 卡 | cout 输出、cin 输入、综合示例、转义字符（含代码+练习） |

**已覆盖的设计节点：** 1.1 第一个程序 ✅ | 1.2 变量与类型（部分）| 1.3 注释命名（合并到 1.1+1.2）| 1.4 输入与运算（部分，运算符独立成节点）

### 01 基础 — 待实现

| 节点 | 卡片 | 说明 |
|------|------|------|
| 常量 (const/constexpr) | ~3 | `const` vs `constexpr` vs `#define` |
| 字符串入门 (std::string) | ~3 | string vs C串、常用操作 |
| 作用域 | ~3 | 块作用域 + 动画 |
| 条件分支 (if/else/switch) | ~6 | if/else、switch、三目运算符 |
| 逻辑与比较 | ~3 | 比较运算符、短路求值、德摩根律 |
| for 循环 | ~5 | 三段式、范围 for、嵌套循环 |
| while 循环 | ~4 | while/do-while、break/continue |
| 数组 | ~4 | 连续内存 + 动画、越界陷阱 |
| 函数入门 | ~5 | 声明/定义、默认参数 |

---

## 模块总览

| # | 模块 | 节点数 | 内容 |
|---|------|--------|------|
| 01 | 基础 | 4/13 | 36/~57 卡 | ✅ 程序结构 / 变量类型 / 注释命名 / 输入运算 · ⬜ 常量 / 字符串 / 作用域 / 条件分支 / 逻辑比较 / for循环 / while循环 / 数组 / 函数入门 |
| 02 | 进阶 | 5 | ~24 卡 | 指针 / 引用 / 动态内存 / 函数重载 / 文件IO |
| 03 | 面向对象 | 5 | ~28 卡 | 类与对象 / 构造析构 / 继承 / 多态 / 运算符重载 |
| 04 | STL | 5 | ~21 卡 | vector / string / map / algorithm / iterator |
| 05 | 泛型 | 4 | ~18 卡 | 模板函数 / 模板类 / 模板特化 / 概念 (C++20) |
| 06 | 现代 C++ | 5 | ~21 卡 | 智能指针 / lambda / 移动语义 / constexpr / range |

---

## 01 基础 (4/13 节点已实现 · 设计 ~54 卡片)

### 1.1 第一个程序 ✅ 已实现 (7 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | Hello World 是什么 | main 函数入口、#include 引入头文件、cout 打印 |
| c2 | code | 第一个程序 | `#include <iostream>` + `int main()` + `std::cout << "Hello World"` + `return 0` |
| c3 | practice | C++ 程序的入口函数是？ | choice: start() / main() / init() / run() → main() |
| c4 | concept | main 函数与返回值 | int main() 完整含义、return 0 表示正常结束、分号语法要求 |
| c5 | code | using namespace std | 对比 std:: 前缀 vs using namespace std 两种写法 |
| c6 | concept | 注释 | `//` 单行、`/* */` 多行、注释用途 |
| c7 | practice | 单行注释写法 | choice: `#` / `//` / `/* */` / `<!-- -->` → `//` |

### 1.2 变量与类型 ✅ 已实现 (10 卡)

> 注：原设计中的 auto、自增自减已移至「运算符」节点

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 什么是变量 | 变量 = 内存中有名字的存储空间，C++ 是强类型语言 |
| c2 | code | 变量声明示例 | int age=25; double price=9.99; char grade='A'; bool isPassed=true; const double PI=3.14159 |
| c3 | concept | 类型全家福 | int(4B)、float(4B)、double(8B)、char(1B)、bool(1B)；short/long/unsigned 扩展 |
| c4 | code | sizeof 查看类型大小 | `sizeof(int)` 等各类型实际字节数 |
| c5 | practice | `sizeof(int)` 典型值？ | choice: 2 / 4 / 8 / 取决于编译器 → 4 |
| c6 | concept | 初始化与赋值 | 初始化 vs 赋值区别、未初始化变量有垃圾值(UB)、花括号初始化 `int x{10}` |
| c7 | practice | `int x; cout << x;` 输出？ | choice: 0 / 不确定(垃圾值) / 编译错误 / null → 不确定 |
| c8 | practice | 补全 `_____ price = 19.99;` | fill: double |
| c9 | concept | 标识符命名规则 | 字母/数字/下划线、不能数字开头、不能关键字、大小写敏感、命名惯例 |
| c10 | practice | 哪个是合法的变量名？ | choice: 2ndPlace / my-variable / double / _total → _total |

### 1.3 注释、命名空间与格式 ✅ 已合并到 1.1 + 1.2

> 注释、using namespace std → 合并进 `hello-world.ts`（c5-c7）
> 标识符命名规则 → 合并进 `variables.ts`（c9-c10）
> 不再作为独立节点

### 1.4a 输入与输出 ✅ 已实现 (11 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 用 cout 输出 | `std::cout << "Hello"`、`<<` 流插入运算符、`\n` vs `endl` |
| c2 | code | cout 输出示例 | 输出年龄、分数、总分 |
| c3 | concept | 用 cin 输入 | `std::cin >> var`、`>>` 流提取运算符、空白字符分隔 |
| c4 | code | cin 读取多种类型 | 读入姓名、年龄、身高 |
| c5 | practice | `cin >> name` 输入 "Alice 25" 结果？ | choice: "Alice 25" / "Alice" / "Alice " → "Alice" |
| c6 | practice | 补全 `std::_____ >> n;` | fill: cin |
| c7 | code | 综合：输入→处理→输出 | 读两个数，算加减乘除 |
| c8 | concept | 什么是转义字符 | `\` 反斜杠 ≠ `//` 注释、`\n` vs `\\n` 区别 |
| c9 | code | 常用转义字符 | `\n`、`\t`、`\"`、`\\`、`\'` 示例代码 |
| c10 | practice | `cout << "A\nB"` 输出？ | choice: A\nB / A(换行)B / AB → A(换行)B |
| c11 | practice | 输出 `C:\Users` 怎么写？ | choice: `"C:\Users"` / `"C:\\Users"` / ... → `"C:\\Users"` |

### 1.4b 运算符与表达式 ✅ 已实现 (8 卡) — 独立节点

> 原设计中运算符内容在 1.4 输入与运算节点中。为让初学者在学 I/O 前先掌握运算符，独立为 `operators.ts` 节点，放在变量和 I/O 之间。

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 算术运算符 | `+ - * / %`、整数除法截断、取模仅整数、优先级 |
| c2 | code | 算术运算符示例 | 10±3 的各运算结果，整数 vs 浮点除法 |
| c3 | practice | `7 / 2` 结果？ | choice: 3.5 / 3 / 4 / 编译错误 → 3 |
| c4 | concept | 赋值运算符 | `=` 赋值、`+= -= *= /= %=` 复合赋值、注意 `=` vs `==` |
| c5 | practice | `a += 3` 执行后 a 的值？ | choice: 5 / 3 / 8 / 53 → 8 |
| c6 | concept | 自增与自减 | `++x` 先加后用、`x++` 先用后加、`--` 同理 |
| c7 | code | 自增自减示例 | 前缀 vs 后缀的完整对比代码 |
| c8 | practice | `b = a++` 后 b 的值？ | choice: 5 / 6 / 编译错误 / 不确定 → 5 |

### 1.5 常量

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 常量 | `const` 编译时/运行时常量，不可修改；`constexpr` 编译期常量，用于数组大小等场景；`#define` 预处理宏（无类型，不推荐） |
| c2 | code | 常量用法示例 | `const double PI = 3.14159;` 计算圆面积；`constexpr int SIZE = 100;` 定义数组大小 |
| c3 | practice | const vs constexpr 区别？ | choice: 无区别 / constexpr 必须编译期求值 / const 必须运行期 → constexpr 必须编译期求值 |

### 1.6 字符串入门 ✨ 新增

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | string vs C 风格字符串 | C 风格：`char s[] = "hello"` 以 `\0` 结尾，数组管理，易越界；`std::string`：类对象，自动管理内存，安全便捷 |
| c2 | code | string 常用操作 | `std::string s = "Hello"; s += " World"; s.length(); s.substr(0, 5); s.find("lo"); std::to_string(42)` |
| c3 | practice | `"Hello" + "World"` 能编译？ | choice: 能 / 不能 → 不能，C++ 不直接支持字符串字面量相加，需要用 `std::string` |

### 1.7 作用域 ✨ 新增

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 块作用域 | `{}` 内声明的变量只在该块内可见；外层代码访问不到内层变量；离开 `{}` 后变量销毁；里层可以访问外层变量，反之不可 |
| c2 | **animation** | **作用域的生命周期** | MemoryBox 动画分两步：(1) 变量在 `{}` 内被分配格子；(2) 离开 `{}` 时格子被释放、颜色变灰。直观展示创建→销毁 |
| c3 | code | 作用域示例 | 同名变量遮蔽(shadowing)：内层 `int x = 10;` 屏蔽外层 `x`；离开内层后外层 `x` 依然是旧值 |

### 1.8 条件分支

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | if/else 流程 | `if / else if / else` 执行路径；代码块 `{}` 的范围；if 只有一行时可省略 `{}` 但不推荐 |
| c2 | code | 成绩等级判断 | 90→A, 80→B, 70→C, 60→D, 其余→F |
| c3 | code | switch 改写 | 等值多分支用 `switch`；`break` 防止穿透（fall-through） |
| c4 | code | 三目运算符 | `条件 ? 真值 : 假值` 替代简单 if-else；`int max = (a > b) ? a : b;` |
| c5 | practice | 缺 break 输出什么？ | 故意构造穿透的 switch，问最终值 |
| c6 | practice | `if (x = 5)` 有什么问题？ | choice: 编译错误 / 永远为真 / 语法错误 → 永远为真（`=` 是赋值不是比较，应用 `==`） |

### 1.9 逻辑与比较

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 比较与逻辑 | `== != < > <= >=` 返回 bool；`&&` `||` `!` 真值表 |
| c2 | code | 短路求值 | `p != nullptr && p->value > 0` 为什么安全——左假则右不执行 |
| c3 | practice | 德摩根律 | `!(a > 5 && b < 3)` 等价于？choice: `a<=5 \|\| b>=3` |

### 1.10 for 循环

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | for 三段式 | `for(init; cond; update)` 执行顺序：init(1次) → cond → body → update → cond → ... |
| c2 | code | 1-100 累加 + 平方表 | `for(int i=1; i<=100; i++) sum += i;` 和 `cout << i*i` |
| c3 | code | 范围 for | `for(int v : arr)` 遍历数组每个元素，不用手动管理索引；现代 C++ 推荐 `for(auto v : arr)` |
| c4 | concept | 嵌套循环 | 外层走一步，内层走一圈；九九乘法表示例：`for(i) { for(j) { cout << i*j; } }` |
| c5 | practice | `for(int i=0; i<5; i++)` 循环体执行几次？ | fill: 5 |

### 1.11 while 循环

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | while / do-while | `while` 先判断后执行；`do-while` 至少执行一次；for vs while 选用原则（知道次数用 for，等条件用 while） |
| c2 | concept | break 与 continue | `break` = 跳出当前循环；`continue` = 跳过本次剩余代码，进入下一轮；两者的区别图示 |
| c3 | code | 猜数字游戏 | `while(true)` + 读输入 + `if(猜对) break` |
| c4 | practice | while(true) 怎么退出？ | choice: break / return / 条件变false → break 和 return 都行 |

### 1.12 数组

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 数组是什么 | 连续内存，索引从 0 开始，无越界检查，固定大小 |
| c2 | **animation** | **数组的连续内存布局** | 声明 `int arr[5]={1,2,3,4,5}`→MemoryBox 显示连续 5×4=20 个格子，每 4 格一个 int，标上 arr[0]~arr[4] 和地址。突出"连续" |
| c3 | code | 遍历与求和 | `int arr[5] = {1,2,3,4,5};` + for 循环累加；`sizeof(arr)/sizeof(arr[0])` 算长度 |
| c4 | practice | `int a[3]={1,2,3};` 访问 `a[3]`？ | choice: 返回0 / 编译错误 / 未定义行为 → 未定义行为 |

### 1.13 函数入门

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 函数是什么 | 返回类型 + 函数名(形参) + 函数体；`void` = 无返回；调用 = 复用 |
| c2 | concept | 声明 vs 定义 | 声明 = 告诉编译器函数存在（签名），定义 = 写函数体（实现）；前向声明让 main 放最前面 |
| c3 | code | max 函数 | `int max(int a, int b) { return a > b ? a : b; }` + 前向声明让 main 放前面 |
| c4 | concept | 默认参数 | `void greet(string name = "World")`；调用时可省略，默认值从右向左指定 |
| c5 | practice | 声明可省略参数名？ | choice: 可以 / 不可以 → 可以，如 `int foo(int, double);` |

---

## 02 进阶 (5 节点 / ~23 卡片)

### 2.1 指针基础

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 指针是什么 | 指针 = 存储内存地址的变量；`int* p` 声明一个指向 int 的指针；`&x` 取变量地址，`*p` 解引用访问指向的值 |
| c2 | code | 指针基本操作 | `int x = 42; int* p = &x; cout << *p;` 输出 42；`*p = 100;` 通过指针修改原变量 |
| c3 | **animation** | **指针与解引用可视化** | MemoryBox 上：`x` 占 4 格，值 42；`p` 也占格子，存的是 `x` 的地址编号。高亮显示 "p → x" 的箭头。`*p = 100` 时，箭头沿地址找到 `x` 的格子，值更新为 100 |
| c4 | concept | nullptr 与空指针 | `nullptr` 表示"不指向任何对象"；C++11 以前用 `NULL`（不推荐）；解引用空指针是未定义行为 |
| c5 | code | 指针与数组 | `int arr[] = {1,2,3}; int* p = arr;` 数组名退化为指针；`*(p+1)` 等价于 `arr[1]`；`p++` 移动到下一元素 |
| c6 | concept | const 与指针的排列组合 | `const int* p` = 指向常量的指针（不能通过 p 改值）；`int* const p` = 常量指针（p 本身不能改指向）；`const int* const p` = 两者都不改；口诀：const 在 * 左边=指向只读，在 * 右边=指针只读 |
| c7 | practice | `int x=10; int* p=&x; *p=20;` x 的值？ | fill: 20（通过指针修改了原变量） |

### 2.2 引用

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 引用是什么 | `int& r = x;` 引用是变量的别名、必须初始化、不能重新绑定；与指针不同——引用更安全、语法更简洁 |
| c2 | code | 引用 vs 指针对比 | 交换函数：`void swap(int& a, int& b)` vs `void swap(int* a, int* b)`；引用版调用更自然 `swap(x, y)` |
| c3 | concept | const 引用 | `const int& r = x;` 只读不修改；可绑定临时对象 `const int& r = 5;`；常用于函数参数避免拷贝 |
| c4 | practice | 引用必须初始化？ | choice: 是 / 否 → 是，`int& r;` 编译错误 |

### 2.3 动态内存

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 堆 vs 栈 | 栈：局部变量自动管理，大小有限；堆：`new` 手动分配，需 `delete` 释放，大小灵活 |
| c2 | **animation** | **栈与堆的物理隔离** | MemoryBox 两片区域：上方栈区（局部变量 `int* p`），下方堆区（`new int(42)` 分配的格子）。`p` 存的是堆区地址，画箭头。`delete p` 后堆区格子变灰释放，`p` 悬空 |
| c3 | code | new 与 delete | `int* p = new int(42);` 堆上分配；`delete p; p = nullptr;` 释放后置空防野指针；`int* arr = new int[100]; delete[] arr;` |
| c4 | concept | 内存泄漏 | `new` 后忘记 `delete` → 内存泄漏；多次泄漏导致程序耗尽内存；delete 数组要用 `delete[]` 而不是 `delete` |
| c5 | practice | `int* p = new int;` 忘写 `delete p;` 的后果？ | choice: 编译错误 / 内存泄漏 / 程序崩溃 → 内存泄漏 |

### 2.4 函数重载

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 重载规则 | 同名函数、参数列表不同（个数/类型）→ 编译器根据实参匹配；返回类型不同不算重载 |
| c2 | code | 重载示例 | `int max(int a, int b);` + `double max(double a, double b);` + `int max(int a, int b, int c);` |
| c3 | concept | 默认参数与二义性 | 默认参数从右向左定义；`void f(int a, int b=0)`；默认参数 + 重载需避免二义性（编译器不知道该调哪个） |
| c4 | practice | 以下哪组构成合法重载？ | choice: `void f(int)`和`int f(int)` / `void f(int)`和`void f(double)` / `void f(int)`和`void f(int a)` → `void f(int)`和`void f(double)` |

### 2.5 文件 IO

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 流 扩展 | `cin`/`cout` 是标准流；`ifstream` 读文件，`ofstream` 写文件；RAII 自动关闭（离开作用域即关闭） |
| c2 | code | 读写文本文件 | `ofstream out("data.txt"); out << "Hello"; out.close();` + `ifstream in("data.txt"); string s; getline(in, s);` |
| c3 | concept | 错误处理 | `if (!in.is_open())` 检查文件是否打开成功；`in.fail()` 检查读操作是否失败；常见错误：路径不存在、权限不足 |
| c4 | practice | `ifstream` 打开不存在的文件会怎样？ | choice: 崩溃 / 创建空文件 / 打开失败 is_open() 返回 false → 打开失败 |

---

## 03 面向对象 (5 节点 / ~27 卡片)

### 3.1 类与对象

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 类 vs 对象 | 类是蓝图（`class Student { };`），对象是实例（`Student s;`）；类 = 数据成员 + 成员函数的集合 |
| c2 | code | 第一个类 | `class Student { public: string name; int score; void print() { cout << name << score; } };` + 调用 `s.print()` |
| c3 | concept | 访问控制 | `public` = 类内外都能访问；`private` = 只有类内能访问；`private` 是默认（struct 默认 public）；封装 = 隐藏实现 |
| c4 | code | getter/setter | `private: int score; public: int getScore() { return score; } void setScore(int s) { if(s>=0) score = s; }` |
| c5 | concept | this 指针 | 成员函数内 `this` 指向调用该函数的对象自身；`this->score` 等价于 `score`（通常省略）；返回 `*this` 可实现链式调用 `obj.setA(1).setB(2)` |
| c6 | concept | static 成员 | `static` 成员变量属于类而非对象，所有对象共享一份；`static` 成员函数无 `this` 指针、只能访问静态成员；典型用途：对象计数、单例模式 |
| c7 | practice | 以下哪项是封装的好处？ | choice: 代码更短 / 防止外部直接篡改数据 / 运行更快 → 防止外部直接篡改数据 |

### 3.2 构造与析构

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 构造函数 | 与类同名、无返回类型、创建对象时自动调用；默认构造无参；参数化构造可带参数 |
| c2 | code | 初始化列表 | `Student(string n, int s) : name(n), score(s) { }` 初始化列表比赋值更高效（直接构造，非先默认再赋值） |
| c3 | concept | 析构函数与 RAII | `~ClassName()` 对象销毁时自动调用；RAII = 资源获取即初始化：构造时获取资源、析构时释放 |
| c4 | code | RAII 示例 | `class FileHandle { FILE* f; public: FileHandle(const char* p) { f = fopen(p, "r"); } ~FileHandle() { fclose(f); } };` |
| c5 | concept | 拷贝构造与赋值运算符 | 拷贝构造：`T(const T& other)` — 用同类型对象初始化新对象；赋值运算符：`T& operator=(const T& other)` — 已存在对象的赋值；不写时编译器自动生成浅拷贝（指针成员会共享，危险）；Rule of 3：自定义了析构/拷贝构造/赋值之一，通常三个都要写 |
| c6 | code | 深拷贝示例 | `class Buffer { char* data; size_t len; Buffer(const Buffer& b) : len(b.len) { data = new char[len]; memcpy(data, b.data, len); } };` 浅拷贝只复制指针→两个对象指向同一内存→析构时 double free |
| c7 | **animation** | **浅拷贝 vs 深拷贝** | MemoryBox 三步：(1) 对象 a 在栈上，data 指向堆区；(2) 浅拷贝 `Buffer b = a` → 两个对象的 data 指向同一块堆内存；(3) a 析构释放堆区→b 的 data 变成悬空指针。深拷贝：各自拥有独立堆区副本 |
| c8 | practice | 析构函数什么时候调用？ | choice: 手动调用 / 对象离开作用域时自动调用 / new 对象时 → 对象离开作用域时自动调用 |

### 3.3 继承

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 继承是什么 | `class Dog : public Animal { };` 子类获得父类的 public 和 protected 成员；继承 = 代码复用 + "is-a" 关系 |
| c2 | code | 继承示例 | `class Animal { public: void eat(); }; class Dog : public Animal { public: void bark(); };` dog 可以 eat + bark |
| c3 | concept | 构造与析构顺序 | 构造：父类先构造 → 子类后构造；析构：子类先析构 → 父类后析构（栈的逆序） |
| c4 | practice | 私有的父类成员能被子类访问吗？ | choice: 能 / 不能（需用 protected 或 public 成员函数） → 不能 |

### 3.4 多态

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 虚函数 | `virtual void speak();` 让函数调用在运行时根据实际对象类型决定（动态绑定）；非虚函数在编译时决定（静态绑定） |
| c2 | code | 多态示例 | 基类指针数组：`Animal* a[] = {new Dog(), new Cat()}; for(auto p : a) p->speak();` 每个输出自己的声音 |
| c3 | concept | override 与 final | `override` 显式标记重写（编译器检查是否真的重写父类虚函数）；`final` 禁止子类继续重写 |
| c4 | code | 抽象类 | `class Shape { virtual double area() = 0; };` 纯虚函数 = 0 → 抽象类不能实例化；子类必须实现纯虚函数 |
| c5 | practice | 不用 virtual 会怎样？ | choice: 编译错误 / 始终调父类函数(静态绑定) / 随机调 → 始终调父类函数 |

### 3.5 运算符重载

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 运算符重载 | 自定义类的 `+ - * / == <<` 等行为；成员函数 vs 友元函数两种写法；不能重载的操作符：`::` `.` `.*` `?:` |
| c2 | code | 成员函数重载 | `class Point { int x,y; Point operator+(const Point& p) { return Point(x+p.x, y+p.y); } };` |
| c3 | code | 重载 `<<` | 需用友元：`friend ostream& operator<<(ostream& os, const Point& p) { os << p.x << p.y; return os; }` |
| c4 | practice | 能重载 `*` 但不能改优先级？ | choice: 正确 / 错误 → 正确（重载不改变优先级和结合性） |

---

## 04 STL (5 节点 / ~21 卡片)

### 4.1 vector

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | vector 是什么 | `std::vector<T>` = 动态数组，自动管理内存，大小可变；原生数组 vs vector：vector 更安全（有边界检查 `.at()`） |
| c2 | code | 常用操作 | `vector<int> v = {1,2,3}; v.push_back(4); v.pop_back(); v.size(); v[0]` vs `v.at(0)`（后者抛异常） |
| c3 | concept | capacity 与 reserve | `size()` = 元素个数，`capacity()` = 已分配的容量；`reserve(n)` 预分配空间避免反复扩容；扩容会 copy 所有元素 |
| c4 | practice | `vector<int> v(10);` 中 v.size() 是？ | fill: 10（构造 10 个默认值 0 的元素） |

### 4.2 string

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | string 深入 | `std::string` 是 `basic_string<char>` 的别名；C 风格对比：`strlen` O(n) vs `.size()` O(1)；`c_str()` 获取 C 串指针 |
| c2 | code | 高级操作 | `s.replace(pos, len, "new"); s.find("lo"); s.compare("other"); to_string(3.14); stoi("42"); stod("3.14")` |
| c3 | concept | string_view | `std::string_view` 不拥有数据，只"查看"；O(1) 的 substr；生命周期短，原字符串销毁后 view 悬空 |
| c4 | practice | `string s = "abc";` 修改第 2 个字符的最简方式？ | choice: `s[1]='x'` / `s.at(1)='x'` / `s.replace(1,1,"x")` → `s[1]='x'` |

### 4.3 map / set

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 关联容器 | `map<Key, Value>` 键值对、键唯一、自动排序；`set<T>` 不重复元素集合、自动排序；`unordered_map` 哈希表 O(1) 而非 O(log n) |
| c2 | code | map 常用操作 | `map<string, int> m; m["alice"] = 90; m.count("bob"); for(auto& [k,v] : m)` 结构化绑定遍历 |
| c3 | code | set 常用操作 | `set<int> s = {3,1,2}; s.insert(4); s.erase(2); s.count(3);` 元素自动升序 |
| c4 | code | unordered_map vs map | `unordered_map<string, int>` 哈希表 O(1) 查找、无序；`map<string, int>` 红黑树 O(log n) 查找、按键排序；键无顺序需求时优先 unordered_map；有排序/范围查询需求用 map |
| c5 | practice | map 中 `m["new_key"]` 如果不存在？ | choice: 抛异常 / 创建该 key 值为默认值 / 编译错误 → 创建该 key 值为默认值（operator[] 的隐式插入行为） |

### 4.4 algorithm

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 算法库概览 | `<algorithm>` 头文件提供 100+ 通用算法；分类：排序、查找、修改、数值；都用迭代器操作，与容器解耦 |
| c2 | code | 排序与查找 | `sort(v.begin(), v.end());` `auto it = find(v.begin(), v.end(), 42);` `binary_search(v.begin(), v.end(), 42);`（需先排序） |
| c3 | code | 常用算法 | `reverse(v.begin(), v.end()); count(v.begin(), v.end(), 1); min_element/max_element; for_each(v.begin(), v.end(), [](int x) { ... });` |
| c4 | practice | `find` 未找到返回什么？ | choice: nullptr / v.end() / -1 → v.end()（返回迭代器，未找到返回尾后迭代器） |

### 4.5 iterator

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 迭代器概念 | 迭代器 = 通用的"指针"抽象，解耦算法与容器；`begin()` 指向首元素，`end()` 指向尾后；`++` 前进，`*` 解引用 |
| c2 | code | 迭代器分类 | 输入/输出/前向/双向/随机访问（vector 是随机访问，list 是双向）；`auto it = v.begin(); advance(it, 2);` |
| c3 | concept | 范围 for 的真相 | `for(auto& x : v)` 本质是迭代器的语法糖：`for(auto it = begin(v); it != end(v); ++it)` |
| c4 | practice | `vector<int> v = {};` 中 `v.begin() == v.end()`？ | choice: 是 / 否 / 未定义 → 是（空容器的 begin 等于 end） |

---

## 05 泛型 (~18 卡片)

### 5.1 函数模板

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 模板是什么 | `template<typename T>` 让函数适用于多种类型；编译器根据调用时的实参类型自动生成对应版本（隐式实例化） |
| c2 | code | 通用 max | `template<typename T> T myMax(T a, T b) { return a > b ? a : b; }` 同时支持 int、double、string |
| c3 | concept | 模板参数推导 | 编译器从实参推导 T；`myMax(3, 5)` → T=int；`myMax(3.0, 5)` → 编译错误（T 歧义），需 `myMax<double>(3.0, 5)` |
| c4 | practice | 函数模板的代码何时生成？ | choice: 运行时 / 编译时（实例化） / 链接时 → 编译时 |

### 5.2 类模板

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 类模板 | 类本身是模板：`template<typename T> class Box { T value; };` 天然支持泛型容器 |
| c2 | code | 泛型 Pair | `template<typename T1, typename T2> class Pair { T1 first; T2 second; }; Pair<int, string> p{1, "hello"};` |
| c3 | concept | CTAD | C++17 类模板参数推导：`Pair p{1, "hello"};` 自动推导为 `Pair<int, const char*>`，无需显式指定类型 |
| c4 | practice | `vector<int>` 中的 int 是什么？ | choice: 函数参数 / 模板参数 / 返回值类型 → 模板参数 |

### 5.3 模板特化

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 全特化 | 为特定类型写专门的实现：`template<> class Box<bool> { /* 用 bitset 优化 */ };` 替代泛型版本 |
| c2 | concept | 偏特化 | 专门化部分模板参数：`template<typename T> class Box<T*> { /* 指针版本 */ };` 只匹配指针类型 |
| c3 | code | 特化示例 | 通用 max 对 `const char*` 比较地址而非内容 — 特化用 `strcmp` 修复 |
| c4 | practice | 全特化 vs 偏特化的区别？ | choice: 无区别 / 全特化所有参数都确定，偏特化只确定部分 → 全特化所有参数都确定 |

### 5.4 概念 (C++20)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 概念是什么 | `concept Addable = requires(T a, T b) { a + b; };` 约束模板参数；编译期检查，报错信息比传统模板清晰 10 倍 |
| c2 | code | concept 使用 | `template<Addable T> T sum(T a, T b) { return a + b; }` 传入没有 + 的类型会得到可读的编译错误 |
| c3 | practice | concept 定义了一个？ | choice: 类型 / 编译期谓词（一组要求） / 类 → 编译期谓词 |

---

## 06 现代 C++ (~21 卡片)

### 6.1 智能指针

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 为什么需要智能指针 | 原始指针：容易泄漏、双重 delete、野指针；智能指针 = RAII 包装，自动管理生命周期 |
| c2 | concept | unique_ptr | `unique_ptr<T>` 独占所有权、不可拷贝（保证唯一）、`make_unique` 创建、`std::move` 转移所有权 |
| c3 | code | unique_ptr 示例 | `auto p = make_unique<int>(42); auto q = move(p);` p 变为 nullptr，q 拥有该资源；离开作用域自动 delete |
| c4 | concept | shared_ptr | `shared_ptr<T>` 共享所有权、引用计数；计数归零自动释放；`make_shared` 一次分配（控制块+对象）；注意循环引用 |
| c5 | code | weak_ptr | `weak_ptr<T>` 不增加引用计数、解决 shared_ptr 循环引用；`lock()` 返回 shared_ptr（对象还存在）或空 |
| c6 | practice | unique_ptr 能拷贝吗？ | choice: 能 / 不能 / 能但只浅拷贝 → 不能（独占所有权，编译期禁止） |

### 6.2 lambda

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | lambda 是什么 | `[](int x) { return x*2; }` 匿名函数对象；捕获列表 `[]`、参数 `()`、函数体 `{}`；本质是编译器生成的仿函数类 |
| c2 | code | 捕获方式 | `[=]` 按值捕获全部（只读）；`[&]` 按引用捕获全部；`[x, &y]` 混合；`[this]` 捕获 this 指针访问成员 |
| c3 | code | lambda 实战 | `sort(v.begin(), v.end(), [](int a, int b) { return abs(a) < abs(b); });` + `auto add = [](auto a, auto b) { return a+b; };` 泛型 lambda |
| c4 | practice | `[=]` 捕获的变量能在 lambda 内修改吗？ | choice: 能 / 不能（需加 mutable） / 编译错误 → 不能（需加 mutable） |

### 6.3 移动语义

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 左值与右值 | 左值 = 有名字、可取地址（`int x;`）；右值 = 临时对象、即将销毁（`x+5`、`string("tmp")`）；`&&` 右值引用 |
| c2 | concept | 移动 vs 拷贝 | 拷贝 = 深复制全部资源（慢）；移动 = "窃取"临时对象的资源（快），把源对象指针搬过来，源置空 |
| c3 | code | std::move | `vector<int> v2 = move(v1);` v1 被"掏空"变成空容器，v2 接管原数据；move 不移动任何东西，只是类型转换 |
| c4 | code | 移动构造 | `class Buffer { char* data; Buffer(Buffer&& other) noexcept : data(other.data) { other.data = nullptr; } };` |
| c5 | practice | `std::move` 之后原对象还能用吗？ | choice: 能用且值不变 / 能用但处于"有效但未指定"状态 / 立即崩溃 → 能用但处于"有效但未指定"状态 |

### 6.4 constexpr

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | constexpr 深入 | 编译期求值保证；C++11 函数只能一行 return，C++14 允许分支循环，C++20 允许 `new` / `try`；`consteval` 强制编译期 |
| c2 | code | 编译期计算 | `constexpr int fib(int n) { return n <= 1 ? n : fib(n-1) + fib(n-2); } constexpr int f5 = fib(5);` 在编译期算出 5 |
| c3 | practice | constexpr 函数一定在编译期执行？ | choice: 一定 / 不一定（取决于调用上下文是否为 constexpr） → 不一定 |

### 6.5 range / variant / 结构化绑定

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | Ranges (C++20) | `ranges::filter(v, even)` 管道式组合；惰性求值（不生成中间容器）；`views::transform/filter/take` |
| c2 | concept | variant 与 optional | `variant<int, string, double>` 类型安全的联合体；`optional<T>` 表示"可能有值"；`nullopt` 表示空 |
| c3 | code | 结构化绑定 | `auto [x, y, z] = tuple(1, 2.0, "hi");` 拆分 pair/tuple/struct；`if(auto [it, ok] = m.insert(...); ok)` C++17 初始化语句 |
| c4 | practice | `optional<int> o;` 访问 `*o` 会？ | choice: 返回 0 / 未定义行为 / 编译错误 → 未定义行为（应先用 has_value() 或 value() 抛异常） |
