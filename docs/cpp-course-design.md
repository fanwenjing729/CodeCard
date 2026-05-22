# C++ 课程设计

## 模块总览

| # | 模块 | 节点数 | 内容 |
|---|------|--------|------|
| 01 | 基础 | 13 | 程序结构 / 变量类型 / 注释命名 / 输入运算 / 常量 / 字符串 / 作用域 / 条件分支 / 逻辑比较 / for循环 / while循环 / 数组 / 函数入门 |
| 02 | 进阶 | — | 指针 / 引用 / 动态内存 / 函数重载 / 文件IO |
| 03 | 面向对象 | — | 类与对象 / 构造析构 / 继承 / 多态 / 运算符重载 |
| 04 | STL | — | vector / string / map / algorithm / iterator |
| 05 | 泛型 | — | 模板函数 / 模板类 / 模板特化 / 概念 (C++20) |
| 06 | 现代 C++ | — | 智能指针 / lambda / 移动语义 / constexpr / range |

---

## 01 基础 (13 节点 / ~54 卡片)

### 1.1 第一个程序 ✅ 已有

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | Hello World 是什么 | main 函数入口、#include 引入头文件、cout 打印 |
| c2 | code | 第一个程序 | `#include <iostream>` + `int main()` + `std::cout << "Hello World"` + `return 0` |
| c3 | practice | C++ 程序的入口函数是？ | choice: start() / main() / init() / run() → main() |

### 1.2 变量与类型 ✅ 已有 + 需扩展

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 什么是变量 | 变量 = 内存中有名字的存储空间，C++ 是强类型语言 |
| c2 | code | 变量声明示例 | int age=25; double price=9.99; char grade='A'; bool isPassed=true; const double PI=3.14159 |
| c3 | concept | 类型全家福 | int(4B)、float(4B)、double(8B)、char(1B)、bool(1B)；short/long/unsigned 扩展（unsigned 做循环条件会死循环陷阱） |
| c4 | concept | auto 类型推导 | `auto x = 10;` 自动推导 int；`auto y = 3.14;` 推导 double；现代 C++ 推荐用 auto 减少冗长类型名 |
| c5 | concept | 前缀与后缀自增 | `++i` 先加后用，`i++` 先用后加；for 循环中效果相同，表达式中有本质区别（`int b = i++;` vs `int b = ++i;`） |
| c6 | concept | 未初始化变量 | 局部变量不初始化有随机值——这是未定义行为(UB)；推荐声明时立即初始化：`int x = 0;` 或用列表初始化 `int x{};` |
| c7 | practice | `sizeof(int)` 典型值？ | choice: 2 / 4 / 8 / 取决于编译器 → 4 |

### 1.3 注释、命名空间与格式 ✨ 已扩展

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 注释怎么写 | `//` 单行注释（行尾到行末）；`/* */` 多行注释（可跨行，不支持嵌套）；注释 = 给人类看的，编译器忽略 |
| c2 | code | 带注释的完整程序 | 一个包含单行/多行注释和合理缩进的小程序；展示代码格式化规范 |
| c3 | concept | using namespace std | `std::` 是标准命名空间前缀；`using namespace std;` 可省略前缀；小型学习和竞赛可用，头文件和大型项目不推荐（污染全局） |
| c4 | concept | 标识符命名规则 | 只能含字母、数字、下划线，不能以数字开头；不能用关键字（if/while/int 等）；大小写敏感；推荐驼峰命名或下划线命名 |

### 1.4 输入与运算

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 与程序交互 | `cin >> var` 从键盘读入；`<<` 输出，`>>` 输入的"水流"比喻；`endl` = 换行+刷新缓冲区，`\n` 只换行不刷新 |
| c2 | code | 交互式计算器 | 读入两个数，输出加减乘除取余结果 |
| c3 | concept | 运算符优先级 | 算术优先级表（`* / %` > `+ -` > `<< >>`）；括号 `()` 控制优先级；赋值 `=` 优先级很低 |
| c4 | code | 类型转换陷阱 | `int a=5, b=2; double c = a/b;` 得 2 不是 2.5；`static_cast<double>(a)/b` 修复 |
| c5 | practice | `double x = 7 / 2;` 结果？ | fill: 3（整数除法再隐式转换得 3.0） |
| c6 | practice | `0.1 + 0.2 == 0.3` 结果是？ | choice: true / false → false（浮点数精度问题，不能用 == 比较浮点数） |

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
| c2 | code | 作用域示例 | 同名变量遮蔽(shadowing)：内层 `int x = 10;` 屏蔽外层 `x`；离开内层后外层 `x` 依然是旧值 |

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
| c2 | code | 遍历与求和 | `int arr[5] = {1,2,3,4,5};` + for 循环累加；`sizeof(arr)/sizeof(arr[0])` 算长度 |
| c3 | practice | `int a[3]={1,2,3};` 访问 `a[3]`？ | choice: 返回0 / 编译错误 / 未定义行为 → 未定义行为 |

### 1.13 函数入门

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 函数是什么 | 返回类型 + 函数名(形参) + 函数体；`void` = 无返回；调用 = 复用 |
| c2 | concept | 声明 vs 定义 | 声明 = 告诉编译器函数存在（签名），定义 = 写函数体（实现）；前向声明让 main 放最前面 |
| c3 | code | max 函数 | `int max(int a, int b) { return a > b ? a : b; }` + 前向声明让 main 放前面 |
| c4 | concept | 默认参数 | `void greet(string name = "World")`；调用时可省略，默认值从右向左指定 |
| c5 | practice | 声明可省略参数名？ | choice: 可以 / 不可以 → 可以，如 `int foo(int, double);` |

---

## 02 进阶（待设计）

| # | 节点 | 卡片数 | 内容要点 |
|---|------|--------|---------|
| 2.1 | 指针基础 | 3-4 | `&` 取地址 / `*` 解引用 / 指针与数组 |
| 2.2 | 引用 | 2-3 | 左值引用 `T&` / 引用 vs 指针 / const 引用 |
| 2.3 | 动态内存 | 3 | `new` / `delete` / 内存泄漏 / `nullptr` |
| 2.4 | 函数重载 | 2-3 | 同名不同参 / 默认参数 / 二义性 |
| 2.5 | 文件 IO | 2-3 | `fstream` / 读写文本 / 错误处理 |

## 03 面向对象（待设计）

| # | 节点 | 内容要点 |
|---|------|---------|
| 3.1 | 类与对象 | class / 访问控制(public/private) / 成员函数 |
| 3.2 | 构造与析构 | 构造函数 / 初始化列表 / 析构函数 / RAII |
| 3.3 | 继承 | 继承语法 / 访问权限 / 虚函数 |
| 3.4 | 多态 | 虚函数表 / override / final |
| 3.5 | 运算符重载 | 成员 vs 非成员 / 常用运算符 |

## 04 STL（待设计）

| # | 节点 | 内容要点 |
|---|------|---------|
| 4.1 | vector | 动态数组 / push_back / reserve |
| 4.2 | string | 与 C 串对比 / 常用方法 |
| 4.3 | map/set | 有序 vs 无序 / 查找效率 |
| 4.4 | algorithm | sort / find / for_each |
| 4.5 | iterator | 迭代器概念 / begin/end / 范围 for |

## 05 泛型（待设计）

| # | 节点 | 内容要点 |
|---|------|---------|
| 5.1 | 函数模板 | template\<typename T\> / 隐式实例化 |
| 5.2 | 类模板 | 泛型容器 / 显式实例化 |
| 5.3 | 模板特化 | 全特化 / 偏特化 / SFINAE 概念 |
| 5.4 | 概念 (C++20) | concept / requires / 约束 |

## 06 现代 C++（待设计）

| # | 节点 | 内容要点 |
|---|------|---------|
| 6.1 | 智能指针 | unique_ptr / shared_ptr / weak_ptr |
| 6.2 | lambda | 捕获列表 / 泛型 lambda / 函数式编程 |
| 6.3 | 移动语义 | 右值引用 / std::move / 移动构造 |
| 6.4 | constexpr | 编译期计算 / constexpr 函数 |
| 6.5 | range/variant | C++20 ranges / std::variant / 结构化绑定 |
