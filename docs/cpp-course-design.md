# C++ 课程设计

## 当前进度

| # | 模块 | 状态 | 节点 | 卡片 |
|---|------|------|------|------|
| 01 | 基础 | ✅ 已完成 | 17 / 17 | 144 |
| 02 | 进阶 | ✅ 已完成 | 7 / 7 | 56 |
| 03 | 流与文件 | 📋 已设计 | 0 / 6 | 0 / 35 |
| 04 | 面向对象 | ⬜ 未开始 | 0 / 5 | 0 / ~28 |
| 05 | STL | ⬜ 未开始 | 0 / 5 | 0 / ~27 |
| 06 | 泛型 | ⬜ 未开始 | 0 / 4 | 0 / ~18 |
| 07 | 现代 C++ | ⬜ 未开始 | 0 / 7 | 0 / ~32 |

> 最后更新：2026-05-25 — 基础 17 节点 144 卡 ✅ · 进阶 7 节点 56 卡 ✅ · 流与文件 6 节点 35 卡 📋 · OOP 5/28 · STL 5/27 · 泛型 4/18 · 现代 C++ 7/32

---

### 01 基础 — 已实现

| # | 节点 | 文件 | 卡片 | 内容 |
|---|------|------|------|------|
| 1 | 第一个程序 | `hello-world.ts` | 10 卡 | Hello World、main 函数结构、初学者编译错误(含中文符号)、using namespace std、注释 |
| 2 | 变量声明 | `variables.ts` | 13 卡 | 变量概念、基本类型、扩展整数类型、sizeof、初始化与赋值、标识符命名规则、常见关键字清单、练习 |
| 3 | 运算符与表达式 | `operators.ts` | 9 卡 | 算术运算符、赋值/复合赋值、自增自减（前缀 vs 后缀）、取余练习 |
| 4 | 输入与输出 | `io.ts` | 12 卡 | cout 输出、cin 输入、综合示例、转义字符、endl vs \n |
| 5 | 常量 | `constants.ts` | 5 卡 | const 声明（为什么用/const vs constexpr 编译期vs运行期）、#define 宏定义（无类型、全局污染）、练习 |
| 6 | 作用域 | `scope.ts` | 4 卡 | 块作用域、嵌套{}、动画 `scope-lifecycle`、练习 |
| 7 | 比较与逻辑运算符 | `comparison-logic.ts` | 8 卡 | 六个比较运算符、&&/||/! 真值表、= vs == 陷阱 |
| 8 | 条件分支 | `conditionals.ts` | 9 卡 | if/else、动画 `if-else-if-ladder`、switch、动画 `switch-fallthrough`、三目运算符 |
| 9 | for 循环 | `for-loop.ts` | 8 卡 | for 三段式、动画 `for-loop`、范围 for、嵌套循环（c7-c9 为空号） |
| 10 | while 循环 | `while-loop.ts` | 6 卡 | while vs do-while、动画 `while-vs-dowhile`、while vs for 选用原则 |
| 11 | break 与 continue | `break-continue.ts` | 8 卡 | break 只跳出当前层嵌套循环、continue 在 for 安全 while 危险（经典死循环陷阱）、动画 `break-continue` |
| 12 | 数组 | `array.ts` | 10 卡 | 数组概念、三种声明语法、部分初始化补0、动画 `array-memory`、遍历求和、常见操作(最大/平均/逆序)、sizeof 算长度、越界是UB |
| 13 | 二维数组 | `array-2d.ts` | 7 卡 | 数组的数组、逐行初始化、动画 `array-2d-memory`、嵌套for遍历、行优先存储、练习 |
| 14 | 字符串 | `string.ts` | 12 卡 | std::string 概念、vs 字符数组、声明初始化、cin vs getline 输入、基础操作示例、length/size/[]/拼接/比较、substr/find、遍历、练习4道 |
| 15 | 函数入门 | `function.ts` | 10 卡 | 函数为什么、五部分结构、按值传递（形参是副本）、声明vs定义前向声明、完整多函数程序、默认参数、练习4道 |
| 16 | 函数重载 | `overload.ts` | 5 卡 | 同名函数不同参数列表、重载规则(靠参数列表不靠返回类型)、重载示例(sum)、匹配优先级练习 |
| 17 | 引用 | `reference.ts` | 8 卡 | 引用是变量的别名、vs普通变量、按引用传递解决函数传参痛点、swap示例、const引用、练习3道 |

**已覆盖的设计节点：** 1.1 第一个程序 ✅ | 1.2 变量与类型 ✅ | 1.3 注释命名（合并到 1.1+1.2）✅ | 1.4a 输入与输出 ✅ | 1.4b 运算符与表达式 ✅ | 1.5 常量 ✅ | 1.6 作用域 ✅ | 1.7 比较与逻辑运算符 ✅ | 1.8 条件分支 ✅ | 1.9 for 循环 ✅ | 1.10 while 循环 ✅ | 1.11 break/continue ✅ | 1.12 数组 ✅ | 1.13 二维数组 ✅ | 1.14 字符串 ✅ | 1.15 函数入门 ✅ | 1.16 函数重载 ✅ | 1.17 引用 ✅

### 01 基础 — 全部完成

17/17 节点，144 张卡片。引用为收官节点，串联按值传递→引用→指针的完整参数传递体系。

---

## 模块总览

| # | 模块 | 节点数 | 内容 |
|---|------|--------|------|
| 01 | 基础 | 17 | 144 卡 | ✅ 全部完成 — 程序结构 / 变量类型 / 输入运算 / 常量 / 作用域 / 比较逻辑 / 条件分支 / for循环 / while循环 / break/continue / 数组 / 二维数组 / 字符串 / 函数入门 / 函数重载 / 引用 |
| 02 | 进阶 | 7 | 56 卡 | ✅ 全部完成 — 内存四区 · 指针基础 · 指针与数组 · 动态内存 · 指针与函数 · 多级指针 · 智能指针入门 |
| 03 | 流与文件 | 6 | 35 卡 | 📋 已设计 — 流抽象 · 文件输入 · 文件输出 · 字符串流 · 流状态与格式化 · 二进制与随机访问 |
| 04 | 面向对象 | 5 | ~28 卡 | 类与对象 / 构造析构 / 继承 / 多态 / 运算符重载（含 static 类成员） |
| 05 | STL | 5 | ~27 卡 | vector / string(精讲) / map / algorithm / iterator |
| 06 | 泛型 | 4 | ~18 卡 | 模板函数 / 模板类 / 模板特化 / 概念 (C++20) |
| 07 | 现代 C++ | 7 | ~32 卡 | 智能指针 / lambda / 移动语义 / constexpr / Ranges / variant+optional / 结构化绑定 |

---

## 01 基础 (17 节点已实现 · 144 卡片)

### 1.1 第一个程序 ✅ 已实现 (10 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | Hello World 是什么 | main 函数是程序入口，`#include <iostream>` 引入输入输出流库，`std::cout` 打印文字 |
| c2 | code | 第一个程序 | `int main() { std::cout << "Hello World"; return 0; }` — 完整最小程序，高亮关键行 |
| c3 | practice | C++ 程序的入口函数是？ | choice: start() / main() / init() / run() → main()（每个程序有且只有一个） |
| c4 | concept | main 函数结构 | int 返回类型、main 函数名、() 参数列表、{} 函数体、return 0 表示正常结束 |
| c5 | concept | 初学者最常见的三种编译错误 | ①忘写分号 ②花括号不匹配 ③中文输入法符号（中文分号、引号编译器不认） |
| c6 | code | using namespace std | 对比 `std::cout` 前缀写法 vs `using namespace std;` + 直接 `cout` 写法 |
| c7 | concept | 注释 | `//` 单行注释（到行末）、`/* */` 多行注释（跨行）；用途：解释逻辑、临时禁用代码 |
| c8 | practice | C++ 中单行注释的写法是？ | choice: `#` / `//` / `/* */` / `<!-- -->` → `//` |
| c9 | practice | 关于 main 函数正确的说法是？ | choice: 名字可改 / 程序从 main 开始执行 / 必须写在最后 / 可有多个 → 程序从 main 开始执行 |
| c10 | practice | 代码 `int x = 10；` 为什么编译失败？ | choice: 没问题 / 分号是中文输入法打的 / 变量名不合法 / main 写错 → 分号是中文的 |

### 1.2 变量与类型 ✅ 已实现 (13 卡)

> 注释和命名规则已合并到此节点。原设计中的 auto、自增自减已移至「运算符」节点。

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 什么是变量 | 变量是内存中有名字的存储空间，C++ 是强类型语言。四种基本类型：int(整数)、double(浮点)、char(字符)、bool(布尔) |
| c2 | code | 变量声明示例 | `int age=25; double price=9.99; char grade='A'; bool isPassed=true;` |
| c3 | concept | 基本类型 | int 4字节、double 8字节、char 1字节、bool 1字节。用 `sizeof(type)` 查看实际大小 |
| c4 | concept | 扩展整数类型 | short(2B)、long(4/8B)、long long(8B)；unsigned 不存负数、值域翻倍。一般用 int 够用 |
| c5 | code | sizeof 查看类型大小 | `sizeof(int)/sizeof(double)/sizeof(char)/sizeof(bool)/sizeof(short)/sizeof(long long)` 完整示例 |
| c6 | practice | 大多数平台上 sizeof(int) 的典型返回值是？ | choice: 2 / 4 / 8 / 不确定 → 4 |
| c7 | concept | 初始化与赋值 | 初始化 = 声明时给值，赋值 = 声明后再给值。未初始化局部变量的值是垃圾值（UB）。花括号初始化 `int x{10}` 更严格，类型不匹配直接报错 |
| c8 | practice | `int x; cout << x;` 输出？ | choice: 0 / 不确定(垃圾值) / 编译错误 / 程序崩溃 → 不确定（局部变量不初始化值为随机） |
| c9 | practice | 补全 `_____ price = 19.99;` | fill: double |
| c10 | concept | 标识符命名规则 | 由字母/数字/下划线组成，不能数字开头，不能关键字，区分大小写。惯例：小驼峰 studentName、下划线 student_name |
| c11 | concept | 常见 C++ 关键字 | 列出 40+ 关键字（int/double/if/for/class 等），混个眼熟不用背，命名时别和它们重名 |
| c12 | practice | 以下哪个是合法的 C++ 变量名？ | choice: 2ndPlace / my-variable / double / _total → _total |

### 1.3 注释、命名空间与格式 ✅ 已合并到 1.1 + 1.2

> 注释、using namespace std → 合并进 `hello-world.ts`（c6-c7）
> 标识符命名规则、关键字清单 → 合并进 `variables.ts`（c10-c11）
> 不再作为独立节点

### 1.4a 输入与输出 ✅ 已实现 (12 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 用 cout 输出 | `std::cout << "Hello"`、`<<` 流插入运算符、`\n` vs `endl`（endl 额外刷新缓冲区） |
| c2 | code | cout 输出示例 | 输出年龄、分数、总分：`cout << "年龄: " << age << '\n'; cout << "分数: " << score << endl;` |
| c3 | concept | 用 cin 输入 | `std::cin >> var`、`>>` 流提取运算符、以空白字符（空格/Tab/换行）分隔。先 cout 提示再 cin 读取 |
| c4 | code | cin 读取多种类型 | 读入年龄、身高：`cout << "输入年龄: "; cin >> age; cout << "输入身高(m): "; cin >> height;` |
| c5 | practice | 输入 "Alice 25"，`cin >> name >> age` 后 name 的值？ | choice: "Alice 25" / "Alice" / "Alice " / 编译错误 → "Alice"（cin 遇空格停止） |
| c6 | practice | 补全 `std::_____ >> n;` | fill: cin |
| c7 | code | 综合：输入→处理→输出 | 读两个数，算加减乘除并输出。完整展示 cin → 运算 → cout 三段式 |
| c8 | concept | 什么是转义字符 | `\` 反斜杠转义：`\n` 换行、`\t` Tab、`\"` 双引号、`\\` 反斜杠字面值、`\'` 单引号 |
| c9 | code | 常用转义字符 | `\n`、`\t`、`\"`、`\\`、`\'` 五种转义字符的完整示例 |
| c10 | practice | `cout << "A\nB"` 输出？ | choice: A\nB / A(换行)B / AB / 编译错误 → A(换行)B |
| c11 | practice | 输出 `C:\Users` 怎么写？ | choice: `"C:\Users"` / `"C:\\Users"` / `"C://Users"` → `"C:\\Users"`（第一个 \ 转义第二个） |
| c12 | practice | `std::endl` 和 `\n` 有什么区别？ | choice: 完全一样 / `\n` 换行，endl 换行+刷新缓冲区 / endl 换行，`\n` 刷新 / endl 仅 Windows 有效 → `\n` 换行，endl 换行+刷新缓冲区 |

### 1.4b 运算符与表达式 ✅ 已实现 (9 卡) — 独立节点

> 原设计中运算符在 1.4 输入与运算节点中。为让初学者先掌握运算符，独立为 `operators.ts`，排在变量和 I/O 之间。

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 算术运算符 | `+ - * / %`、整数除法截断（5/2=2）、% 仅用于整数、括号可改优先级 |
| c2 | code | 算术运算符示例 | a=10, b=3 的加减乘除取余完整计算 + `a/2.0` 浮点除法 |
| c3 | practice | `7 / 2` 的结果？ | choice: 3.5 / 3 / 4 / 编译错误 → 3（整数除法截断） |
| c4 | concept | 赋值运算符 | `=` 赋值，`+= -= *= /= %=` 复合赋值（a += 3 等价 a = a + 3） |
| c5 | practice | `int a=5; a+=3;` 后 a 的值？ | choice: 5 / 3 / 8 / 53 → 8 |
| c6 | concept | 自增与自减 | `++x` 先加后用、`x++` 先用后加、`--` 同理。举例：a=5, b=++a→a=6,b=6; c=5, d=c++→d=5,c=6 |
| c7 | code | 自增自减示例 | 前缀 vs 后缀完整对比代码，展示 x++/++x/--x 三种行为 |
| c8 | practice | `int a=5; int b=a++;` 后 b 的值？ | choice: 5 / 6 / 编译错误 / 不确定 → 5（a++ 先用后加） |
| c9 | practice | `10 % 3` 的结果？ | choice: 3 / 1 / 0 / 10 → 1（10÷3=3 余 1，% 取余数） |

### 1.5 常量 ✅ 已实现 (5 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 为什么用常量 | `const` 把"不能改"写进代码让编译器检查。好处：①防意外修改 ②代码意图清晰 ③比全大写命名更强（const 是强制） |
| c2 | code | const 声明示例 | `const int MAX=100; const double PI=3.14159;` 完整程序演示声明和使用，注释掉赋值语句展示编译错误 |
| c3 | concept | 编译期 vs 运行期 | `const` → "初始化后不能改"（不管什么时候初始化）；`constexpr` → "编译时必须算出来"（源码里直接看得到）。`cin >> x; const int y = x;` 合法但 `constexpr int z = x;` 编译错误 |
| c4 | concept | #define — 预处理宏 | C 时代方式：纯文本替换，无类型、全局生效、调试器看不到。典型坑：`#define SIZE 100; int SIZE=200;` → 被替换成 `int 100=200;` 报错。C++ 用 const 不用 #define |
| c5 | practice | `const int x=10; x=20;` 有什么问题？ | choice: 没问题 / const 变量不能重新赋值 / 缺少分号 / 变量名不合法 → const 变量不能重新赋值 |

### 1.6 作用域 ✅ 已实现 (4 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 什么是作用域 | `{}` 是变量生命的边界。变量在哪个 {} 声明就只能在那里面用，出了 {} 就销毁。里层可以访问外层，反之不可。一句话："{} 进去出生，出来死亡" |
| c2 | code | 嵌套作用域示例 | 外层 `int a=10`，内层块声明 `int b=20`，块内可访问 a 和 b，块外只能访问 a——b 已销毁 |
| c3 | **animation** | **作用域的生命周期** | `scope-lifecycle` — MemoryBox 展示变量在 {} 内分配、离开 {} 释放 |
| c4 | practice | `{ int x=10; } cout << x;` 有什么问题？ | choice: 缺少分号 / x 在 {} 外已不存在 / 变量名不合法 / 没有错误 → x 在 {} 外已不存在 |

### 1.7 比较与逻辑运算符 ✅ 已实现 (8 卡)

> 从条件分支中拆分出来作为前置。学生必须先理解 > < == != && || ! 和 = vs == 陷阱，再学 if/else 才不会被两个新概念同时轰炸。

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 比较运算符 | `> < >= <= == !=` 六个运算符，都返回 bool。判断标准："这个比较成立吗？" |
| c2 | code | 比较运算符示例 | a=5, b=3 的六种比较，cout 输出 1/0（true/false） |
| c3 | concept | 逻辑运算符 | `&&`(与) `||`(或) `!`(非) 真值表。口诀：&&→两边都是真、||→至少一边是真、!→反过来 |
| c4 | code | 逻辑运算符示例 | age>=18 && hasID、hasCard || hasID、!isWeekend |
| c5 | concept | = 和 == 的区别（重要！） | = 是赋值"放进去"，== 是比较"相等吗？"。`(x=5)` 返回值 5→非零即 true，不是比较结果 |
| c6 | practice | `10 > 7` 的结果是？ | choice: true / false / 10 / 7 → true |
| c7 | practice | `(8 > 3) && (5 < 2)` 的结果？ | choice: true / false / 8 / 编译错误 → false |
| c8 | practice | 判断两个值是否相等用哪个符号？ | choice: = / == / != / += → == |

### 1.8 条件分支 ✅ 已实现 (9 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | if/else/else if — 让程序做选择 | 基本形式：`if(条件){true分支}else{false分支}`。多条件用 else if。从上到下依次检查，第一个成立就停，后面全跳过 |
| c2 | code | 成绩等级判断 | 90→A, 80→B, 70→C, 60→D, 其余→F — 完整 if/else if 阶梯 |
| c3 | **animation** | **if-else-if-ladder** | BranchPlayer：条件链依次检查，不成立跳过，成立执行，else 跳过 |
| c4 | concept | switch — 等值多分支 | 适用等值比较（int/char/enum），不能 string/double。break 防穿透，default 可选 |
| c5 | code | switch 示例 | 星期 1-7 + default，展示完整语法 |
| c6 | **animation** | **switch-fallthrough** | BranchPlayer：case 2 匹配后无 break → 穿透到 case 3，输出"BC" |
| c7 | concept | 三目运算符 ? : | `条件 ? 表达式1 : 表达式2` — 简单二选一用 ? :，超过两行用 if/else |
| c8 | practice | switch 穿透陷阱 | x=2, case 2 输出 B 无 break → 穿透输出 C → 答案：BC |
| c9 | practice | `if (score = 60)` 有什么问题？ | choice: 缺分号 / = 是赋值永远为真 / 没初始化 / if 后不该有空格 → = 是赋值永远为真 |

### 1.9 for 循环 ✅ 已实现 (8 卡)

> c7-c9 为空号，预留扩展。

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | for 循环 — 重复执行 | 三段式执行顺序：①初始化(一次)→②检查条件→③执行体→④更新(i++)→回到②。判断标准："条件现在还成立吗？" |
| c2 | code | 1-100 累加 | `for (int i=1; i<=100; i++) sum += i;` — 完整程序 |
| c3 | **animation** | **for-loop** | LoopPlayer：初始化→第1/2/3 轮→跳出 |
| c4 | concept | 范围 for — 遍历集合 | `for (int v : arr)` 替代手动索引。auto 让编译器推导类型。底层原理：编译器自动翻译成普通 for 循环（替你管索引和边界） |
| c5 | code | 范围 for 示例 | 遍历 scores 数组求总分和均分 |
| c6 | concept | 嵌套循环 | 外层走一步内层走一圈。`3×2=6` 次输出。典型：九九乘法表 |
| c10 | practice | `for (int i=0; i<5; i++)` 循环体执行几次？ | choice: 4次 / 5次 / 6次 / 取决于内容 → 5次（i=0,1,2,3,4） |
| c11 | practice | 嵌套循环输出几个 A？`for(i=1;i<=3;i++) for(j=0;j<2;j++)` | choice: 3个 / 5个 / 6个 / 9个 → 6个（3×2） |

### 1.10 while 循环 ✅ 已实现 (6 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | while 与 do-while | `while` 先判断后执行（可能 0 次）；`do-while` 先执行后判断（至少 1 次）。口诀："while 先看再跑，do-while 先跑再看" |
| c2 | code | while 累加示例 | `while (i <= 100) { sum += i; i++; }` — 1~100 累加 |
| c3 | **animation** | **while-vs-dowhile** | WhileDoWhilePlayer：对比 while 和 do-while 的执行差异（条件初始为假时一个不执行一个至少执行一次） |
| c4 | concept | while vs for — 各用在哪 | 知道次数用 for（遍历数组、九九乘法表），等条件用 while（用户输对密码才退出、读到 0 才停） |
| c5 | practice | `int i=10; while(i<5){cout<<i;}` 输出什么？ | choice: 10 / 无输出 / 10 9 8 7 6 5 / 编译错误 → 无输出（while 先判断，10<5 为假不执行） |
| c6 | practice | `int i=10; do{cout<<i<<" ";}while(i<5);` 输出？ | choice: 10 / 无输出 / 10 9 8 7 6 5 / 编译错误 → 10（do-while 先执行再判断，至少输出一次） |

### 1.11 break 与 continue ✅ 已实现 (8 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | break — 只跳出当前层 | break 只跳出它所在的最内层循环，外层不受影响。嵌套循环中 break 内层，外层照走。想跳出多层用 bool 标志 `&& !found` |
| c2 | code | 嵌套循环中找目标值 | 3×3 矩阵中找 target=5，用 bool found + break 双层退出。完整程序 |
| c3 | concept | continue — for 安全，while 危险 | for 中 continue 仍执行 i++（更新是循环结构的一部分）；while 中 continue 会跳过循环体内的所有语句包括更新语句 → 经典死循环。修复：把更新提前到 continue 前面 |
| c4 | code | while + continue 死循环 vs 修复 | 三种写法对比：错误版（死循环）/ 正确版（更新前置）/ 最佳版（改用 for） |
| c5 | **animation** | **break-continue** | BreakContinuePlayer：上下双栏对比 break 退出 vs continue 跳过 |
| c6 | practice | 以下嵌套循环输出？`for(i=1;i<=3;i++){for(j=1;j<=5;j++){if(j==4)break;cout<<j;}}` | choice: 1 2 3 | 1 2 3 | 1 2 3 | / 1 2 3 4 5... → 1 2 3 | 1 2 3 | 1 2 3 |（break 只关内层门） |
| c7 | practice | `int i=0; while(i<5){i++; if(i==3)continue; cout<<i;}` 输出？ | choice: 1 2 4 5 / 1 2 3 4 5 / 1 2 / 死循环 → 1 2 4 5（i++ 在 continue 前安全） |
| c8 | practice | `int i=0; while(i<10){if(i%2==0)continue; cout<<i; i++;}` 有什么问题？ | choice: 语法错误 / 死循环 i 永远为 0 / 初始值错 / 没问题 → 死循环 i 永远为 0（i=0 时 continue 跳过 i++） |

### 1.12 数组 ✅ 已实现 (10 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 数组是什么 | 连续内存空间中存放多个同类型数据。三特征：同类型、定长（声明时确定不可变）、连续（元素紧挨） |
| c2 | concept | 声明语法（三种写法） | ①只声明 `int arr[5]`（垃圾值）；②完整初始化 `int arr[5]={1,2,3,4,5}`；③自动推断 `int arr[]={1,2,3}`。推荐写法② |
| c3 | concept | 部分初始化 | `int arr[5]={1,2}` → `[1,2,0,0,0]`，未指定的自动补0。`int arr[5]={}` 全零。不能超过声明长度 |
| c4 | **animation** | **数组的连续内存布局** | `array-memory` — MemoryBox 显示连续格子，标注 arr[0]~arr[4] 和地址 |
| c5 | code | 遍历与求和 | `int arr[5]={1,2,3,4,5};` + for 循环累加；`sizeof(arr)/sizeof(arr[0])` 算长度 |
| c6 | concept | 常见操作 | 找最大值（`maxVal=arr[0]; for(i=1;i<len;i++)`）、求平均值（`(double)sum/len`）、逆序输出（`for(i=len-1;i>=0;i--)`） |
| c7 | practice | 补全遍历条件：`for(int i=0; i<___; i++)`（5个元素的数组） | fill: 5（索引0~4，条件 i<5） |
| c8 | practice | `int arr[5]={1,2};` 后 arr[2] 的值？ | choice: 垃圾值 / 2 / 0 / 编译错误 → 0（部分初始化时剩余元素补零） |
| c9 | practice | 计算数组元素个数的正确表达式？ | choice: `sizeof(arr)/sizeof(arr[0])` / `sizeof(arr[0])/sizeof(arr)` / `length(arr)` / `arr.size()` → `sizeof(arr)/sizeof(arr[0])` |
| c10 | practice | `int a[3]={1,2,3};` 访问 a[3] 会发生什么？ | choice: 返回0 / 返回垃圾值 / 编译错误 / 未定义行为 → 未定义行为（越界，C++ 不检查） |

### 1.13 二维数组 ✅ 已实现 (7 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 二维数组是什么 | "数组的数组"——每个元素本身是一个一维数组。`int m[2][3]` 读作 2 行 3 列。判断标准：数据天然有行列关系时用 |
| c2 | concept | 声明与初始化 | ①逐行 `{{1,2,3},{4,5,6}}`（推荐）；②扁平 `{1,2,3,4,5,6}`；③省略行数 `int m[][3]`（只有第一维可省） |
| c3 | **animation** | **二维数组内存布局** | `array-2d-memory` — 可视化行×列的连续内存排列 |
| c4 | code | 嵌套 for 遍历 | 外层 i 走行、内层 j 走列：`for(i=0;i<2;i++) for(j=0;j<3;j++) cout<<m[i][j]` — 输出矩阵 |
| c5 | concept | 行优先存储 | 二维数组在内存中仍连续排列。C++ 行优先：先存第 0 行全部，再存第 1 行。`m[i][j]` 地址偏移 = (i×列数+j)×sizeof |
| c6 | practice | `int m[2][3]={{1,2,3},{4,5,6}};` m[1][2] 的值？ | choice: 2 / 4 / 6 / 越界 → 6（第1行第2列） |
| c7 | practice | 补全内层循环条件：`for(int j=0; j<___; j++)`（3列） | fill: 3（每行3个元素） |

### 1.14 字符串 (std::string) ✅ 已实现 (12 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 字符串是什么 | `std::string` 是标准库提供的字符串类型。特点：自动管理内存、长度可变、需要 `#include <string>`。判断标准："处理文字就用 string" |
| c2 | concept | string vs 字符数组 | char[] 问题：定长、越界不报错、拼接麻烦(需 strcat)、==比较地址、赋值需 strcpy。string 优势：变长、安全(.at()抛异常)、+拼接、==比较内容、=赋值 |
| c3 | concept | 声明与初始化 | 四种写法：`string s1;`(空)、`string s2="hello";`、`string s3("world");`、`string s4=s2;`（真正复制内容） |
| c4 | concept | 输入输出 — cin vs getline | `cin >> s` 遇空白停止；`getline(cin, s)` 读整行。常见坑：cin>> 后 getline 会读到残留换行符，用 cin.ignore() 吃掉 |
| c5 | code | 基础操作示例 | 读入名字→拼接问候语→输出。演示 cin >>、+ 拼接、length() |
| c6 | concept | 常用操作 | length()/size() 获取长度，s[i] 访问字符，+ / += 拼接，== / != / < 比较内容 |
| c7 | concept | 子串与查找 | `s.substr(pos, len)` 截取子串。`s.find("x")` 返回位置或 `string::npos`（不存在） |
| c8 | code | 遍历字符串 | 范围 for `for(char c : s)` 和索引遍历 `for(int i=0; i<s.length(); i++)` 两种方式 + 统计字符出现次数 |
| c9 | practice | 获取字符串 s 的长度，调用 ___ | fill: s.length()（或 s.size()） |
| c10 | practice | 输入 "I love C++"（含空格），哪个能完整读入？ | choice: cin >> s / getline(cin, s) / scanf / cin.read → getline(cin, s) |
| c11 | practice | `string a="abc"; string b="abc"; a == b` 的结果？ | choice: true(内容相同) / false(地址不同) / 编译错误 / 运行时错误 → true（string 的 == 比内容，不比地址） |
| c12 | practice | `string s="hello";` s.length() 的值？s[5] 访问怎样？ | choice: 4,返回NUL / 5,越界(UB) / 5,自动返回空 / 6,返回最后字符 → 5,越界(UB) |

### 1.15 函数入门 ✅ 已实现 (10 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 函数是什么 & 为什么 | 有名字的代码块，需要时调用。你已经用了 main()。为什么写函数：①复用 ②分治 ③可读 |
| c2 | concept | 函数的结构 | 五部分：返回类型(int/void等)、函数名、参数列表(可为空)、{函数体}、return 返回值（类型必须跟返回类型一致） |
| c3 | concept | 参数与按值传递 | 形参=定义时的占位符，实参=调用时传入的值。C++ 默认按值传递——函数拿到实参的副本，改了不影响原变量。判断标准："函数里改了参数，外面会变吗？—不会，除非用引用（后面学）" |
| c4 | concept | 声明 vs 定义 | 声明=告诉编译器函数存在（签名+分号），定义=写出函数体。前向声明让 main() 放最前面：先声明 `int max(int,int);`，main 调用，最后定义 |
| c5 | code | 完整的多函数程序 | 前向声明 max() 和 printResult() → main 调用 → 函数定义在 main 之后。展示完整多函数结构 |
| c6 | concept | 默认参数 | 参数可给默认值，调用时可省略。`void greet(string name="World")`。铁律：默认参数必须从右向左排列 |
| c7 | practice | 以下哪个是合法的函数前向声明？ | choice: `int max(int a,int b);` / `int max(int a,int b)` / `int max(int a,int b){}` / `function max(int a,int b);` → `int max(int a,int b);`（签名+分号，无函数体） |
| c8 | practice | `void f(int a,int b)` — 以下哪个调用不合法？ | choice: f(3,5) / f(3,5,7) / f(0,0) → f(3,5,7)（参数个数不匹配） |
| c9 | practice | `int f(){return 3.14;}` 返回值是？ | choice: 3.14 / 3 / 编译错误 / 0 → 3（返回类型 int，3.14 隐式截断为 3） |
| c10 | practice | `void addThree(int x){x=x+3;} int n=5; addThree(n); cout<<n;` 输出？ | choice: 5 / 8 / 3 / 编译错误 → 5（按值传递，改的是副本，n 不变） |

### 1.16 函数重载 ✅ 已实现 (5 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 什么是函数重载 | 多个函数同名但参数列表不同，编译器根据实参自动匹配。例：三个 max（两个 int / 两个 double / 三个 int）各司其职 |
| c2 | concept | 重载的规则 | ①靠参数列表区分（个数/类型），不靠返回类型 ②参数名不参与区分 ③编译器选"最匹配"的，无完全匹配时尝试隐式类型转换 ④多个重载无优劣之分→编译错误（歧义） |
| c3 | code | 重载示例：求和函数 | `int sum(int,int)`, `int sum(int,int,int)`, `double sum(double,double)` 三个重载 + main 中调用演示 |
| c4 | practice | `void print(int x); void print(double x);` 调用 `print(3.14f)` 匹配哪个？ | choice: print(int) / print(double) / 编译错误(歧义) / 两个都调 → print(double)（float→double 比 float→int 精度损失更小） |
| c5 | practice | 以下哪组是合法重载？ | choice: `int f(int)`和`void f(int)` / `void g(int a)`和`void g(int b)` / `int h(int)`和`int h(double)` / `int k(int)`和`double k(int)` → `int h(int)`和`int h(double)`（参数类型不同） |

### 1.17 引用 (&) ✅ 已实现 (8 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 引用是什么 | 引用是变量的别名——给同一内存位置起第二个名字。`int& r = x;`。两铁律：①声明时必须初始化 ②一旦绑定不能改指向。对 r 的所有操作实际作用在 x 上 |
| c2 | concept | 引用 vs 普通变量 | `int y = x`（副本，新内存）；`int& r = x`（别名，同一内存）。改 x 后 y 不变 r 跟着变。引用不能为空——比指针安全 |
| c3 | concept | 按引用传递 — 解决函数传参痛点 | 回忆函数 c3：按值传递改不了外部变量。`void addTen(int& x)` — x 是原始变量的别名，函数内修改直接影响外部。`swap(int& a, int& b)` 经典应用。调用不能传字面量 |
| c4 | code | 引用传参示例 | `swap(int& a, int& b)` + `increment(int& x)` + main 中调用演示，完整程序 |
| c5 | concept | const 引用 | 只读引用 `const int& x`：能读不能改。独特能力：可绑字面量 `const int& r = 42;`（普通引用不行）。参数只读就用 const&——高效（不复制）且安全 |
| c6 | practice | `int x=5; int& r=x; r=10; cout<<x;` 输出？ | choice: 5 / 10 / 编译错误 / UB → 10（r 是 x 的别名，改 r 就是改 x） |
| c7 | practice | `swap(a,b)` 用引用传参后 a=3,b=7 → a 和 b 变成？ | choice: a=3,b=7(没变) / a=7,b=3(交换成功) / a=3,b=3 / 编译错误 → a=7,b=3（引用直接操作原始变量） |
| c8 | practice | 以下哪个是合法的引用声明？ | choice: `int& r;` / `int& r=5;` / `int x=5; int& r=x;` / `int& r=x; r=y`(指向y) → `int x=5; int& r=x;`（引用必须初始化且不能绑字面量/不能改绑定） |

---

## 02 进阶 (7 节点 / 56 卡片) ✅ 全部完成

> 进阶模块定位为**从"会用指针"到"理解内存"**——以内存四区为地基，指针体系递进。原计划的引用进阶、重载进阶内容已分别被 01-基础(1.16/1.17)覆盖，文件 I/O 移至独立的 03-流与文件模块。

### 2.1 内存四区 ✅ 已实现 (8 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 一张地图看懂程序的内存 | ASCII 四区布局图（代码区/静态区/栈区/堆区）+ 四种活法对比表（出生→死亡→谁管→大小）。栈区↓向下增长，堆区↑向上增长。一句话：四个区，四种活法 |
| c2 | concept | 代码区与静态区——程序一生的常量 | 代码区(.text)存机器指令只读。静态区分三块：.data(已初始化全局)、.bss(未初始化全局→0)、.rodata(字符串字面量)。关键澄清：const 不管存储区，只管辖读写权限——`const int` 局部变量在栈，全局常量在 .rodata |
| c3 | concept | 栈区——花括号背后的机器 | 栈帧压入/弹出机制，rsp 寄存器只动指针=极快(~8MB)。解释 01 基础三条规则的本质：① `{int x;}` 外面不能用→帧已弹出 ② 按值传递函数改副本→形参在 f 栈帧上与实参不在同帧 ③ 不能 `return &x`→返回的地址指向已回收的帧，这是"悬空指针"的根因 |
| c4 | concept | 堆区——权力越大责任越大 | 三大场景：运行时确定大小/大数据/数据要比函数活得久。关键认知：`int* p = new int` — p 在栈，*p 在堆。栈 vs 堆对比表（8MB vs 剩余RAM、极快 vs 较慢、自动 vs 手动）。预告三大坑：泄漏/悬空/new[]配错 delete |
| c5 | concept | 四区协作——三张图串起整个进阶 | 场景一：指针指向栈（栈帧弹出后一切消失，安全但不能返回）。场景二：指针指向堆（可返回但调用者负责 delete）。场景三：返回地址的三选一——栈地址✗ / 堆地址✓（需负责）/ 静态区地址✓（永远安全）。核心原则：指向的东西必须比指针本身活得长 |
| c6 | code | 用代码验证——让四区"可见" | 打印全局/static/局部/new/函数地址，跑两遍观察规律。配典型输出截图标注各地址段对应哪个区。学生跑完亲眼看到四区确实在不同数值范围的地址段 |
| c7 | practice | 变量归属判断——①~⑧ 各在哪个区？ | 给 8 个标注的代码片段（全局变量、局部变量、局部 static、new 数据、字符串字面量、函数参数），选正确的映射表。核心辨析：局部 static → 静态区（存储），只在该函数可见（作用域） |
| c8 | practice | 悬空陷阱——哪些返回是安全的？ | 五道选择题辨析 `return &x`(栈↛悬空) / `return new int`(堆→安全但调用者负责) / `return &staticX`(静态区→绝对安全) / `return x`引用(栈→悬空) / `return "hello"`(rodata→安全)。takeaway：安全条件 = 指向的东西比函数活得长 |

### 2.2 指针基础 ✅ 已实现 (9 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 指针是什么 | 指针 = 存地址的变量。普通变量存数据（`int x=42`），指针变量存地址（`int* p=&x`）。& 取地址、* 解引用。判断标准："变量里存的是数据还是地址？" |
| c2 | concept | 声明与基本操作 | `p` = 指针本身（存地址编号），`*p` = 解引用（等于 x 的值），`&x` = x 的地址（等于 p 的值）。注意：`int* p` 里 * 是类型的一部分，`*p` 里的 * 才是解引用——同一个符号两个含义 |
| c3 | **animation** | **指针与解引用** | `pointer-intro` — ScopeCode 动画：声明 x → 指针存 &x → *p 读取 → *p=100 修改 |
| c4 | concept | 指针本身也占内存 | `sizeof(int*)` = 8 字节（64位），`sizeof(char*)` 也是 8 字节——任何指针都一样。因为指针存的是"地址编号"，地址编号大小由系统决定，跟指向什么类型无关 |
| c5 | code | 指针基本操作 | 完整程序：声明 `int x=42; int* p=&x;` → 输出 &x、p、*p → `*p=100;` 通过指针修改原变量 → 输出 x 验证（100） |
| c6 | concept | nullptr 与空指针 | `int* p = nullptr;` 表示不指向任何对象。解引用空指针是 UB（程序可能崩溃）。使用前检查 `if(p != nullptr)`。C++11 起用 nullptr 替代 NULL |
| c7 | concept | const 与指针 | `const int* p`（指向只读，不能通过 p 改值）、`int* const p`（指针只读，不能改指向）、`const int* const p`（都不能改）。口诀：const 在 * 左边→管目标，在 * 右边→管指针本身 |
| c8 | practice | `int x=10; int* p=&x; *p=20;` 后 x 的值？ | fill: 20（*p 就是 x 的别名，*p=20 等价于 x=20） |
| c9 | practice | `const int* p = &x;` — 以下哪项合法？ | choice: `*p=5` / `p=&y` / 都可以 / 都不可以 → `p=&y`（const 在 * 左边管目标，不能改值但能改指向） |

### 2.3 指针与数组 ✅ 已实现 (8 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 数组名就是指针 | `arr` 等价于 `&arr[0]`，`int* p = arr;` 合法。唯一区别：`sizeof(arr)` = 数组总字节，`sizeof(p)` = 指针大小 |
| c2 | concept | 指针算术的内存真相 | ASCII 内存布局图：`┌┬┬┐` 展示 0x1000/0x1004/0x1008 三个地址。指针 +1 = 地址 + sizeof(类型)。int* +1=4B, double* +1=8B, char* +1=1B |
| c3 | concept | [] 的真相 — 语法糖 | `arr[2]` 被编译器翻译成 `*(arr + 2)`。`arr[2] ≡ *(arr+2) ≡ 2[arr]` 三者等价。`2[arr]` 也合法但不推荐 |
| c4 | code | 用指针遍历 — 索引 vs 指针 | `for (int i=0; i<n; i++)` vs `for (int* p=arr; p<arr+n; p++)` 两种方式对比 |
| c5 | concept | 数组传参的退化 | `void f(int arr[])` = `void f(int* arr)`。三个后果：sizeof 失效、必须传长度、函数内改原数组 |
| c6 | code | 数组传参 — 修改与遍历 | `doubleAll(int* arr, int n)` + `print(const int* arr, int n)` 完整示例 |
| c7 | practice(choice) | `int* p = arr + 2; cout << p[-1];` 输出？ | choice: 10/20/30/编译错误 → 20（p[-1]=*(p-1)，[] 就是指针算术） |
| c8 | practice(choice) | `int* p1=&arr[1]; int* p2=&arr[4]; cout << p2-p1;` 输出？ | choice: 3/12(字节数)/编译错误/不确定 → 3（指针相减返回元素个数，非字节数） |

### 2.4 动态内存 ✅ 已实现 (8 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 栈 vs 堆 — 两种"存放方式" | 栈：编译时确定大小，函数结束自动回收，空间有限（几MB）。堆：运行时动态申请，要多大要多大，用完必须手动归还。用 new 在堆上创建，用 delete 归还 |
| c2 | concept | new 与 delete | 四步拆解：`new int` → 堆上找4字节空间 → 返回地址 → p 存地址 → `delete p` 归还。铁律：一个 new 对应一个 delete |
| c3 | **animation** | **new 与 delete 全过程** | `dynamic-memory` — ScopeCode 新动画：栈指针→堆分配→delete释放→p置空，五步展示完整生命周期 |
| c4 | concept | 动态数组 — new[] 与 delete[] | `int* arr = new int[n];` 运行时确定大小（栈数组做不到）。致命错误：new 配 delete，new[] 配 delete[]，乱配是未定义行为 |
| c5 | code | 动态数组实战 | 用户输入 n → `new int[n]` 分配 → for 循环读入分数 → 输出成绩单 → `delete[]` 归还。完整程序 |
| c6 | concept | 内存泄漏 — 忘还了 | `new` 后没 `delete`，指针销毁但堆空间没人还。循环100万次=浪费4MB。更隐蔽的：覆盖指针 `p = new int(20)` 后原来那块泄漏 |
| c7 | concept | 悬空指针 — 还了还用 | delete 后内存已不属于你，但指针还指着。解引用悬空指针可能崩溃/读到垃圾/碰巧正常——最可怕的是"碰巧正常"。防御：`delete p; p = nullptr;` |
| c8 | practice | 以下代码有什么问题？`void f() { int* p = new int[10]; }` | choice: p 离开 f 后变成悬空指针 / 没有 delete[]，内存泄漏 / new int[10] 语法错误 / 没有问题 → 没有 delete[]，内存泄漏 |
| c9 | practice | `int* p = new int(5); int* q = p; delete p; p = nullptr;` 此时 *q 会怎样？ | choice: 正常输出5 / 输出0 / 未定义行为（q是悬空指针） / 编译错误 → 未定义行为（多个指针指向同块内存，delete后全变悬空） |

### 2.5 指针与函数 ✅ 已实现 (6 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 指针 vs 引用做参数 | 指针参数：可为 nullptr（可选），需 * 解引用。引用参数：必须绑定合法对象（必不为空），语法干净。选择标准：参数"必须"有值→引用，"可选"→指针。大多数情况优先引用 |
| c2 | concept | 返回指针 — 三个禁区 | ①返回局部变量地址→悬空 ②返回局部数组地址→悬空 ③连续调用 new 但不传回所有权→易泄漏。返回的指针必须指向比函数活得久的东西 |
| c3 | concept | 函数指针 — 函数也有地址 | 函数编译后是机器码，存在内存里，有地址。`void (*fp)() = greet;` fp 是指向函数的指针。作用：把"做什么"作为参数传入（回调） |
| c4 | code | 函数指针做回调 | `int calc(int a, int b, int (*op)(int, int))` 接受 add/sub 函数指针，`calc(10, 5, add)` → 15。完整程序 |
| c5 | practice | `int* makeArray() { int arr[100]; return arr; }` 有什么问题？ | choice: 语法正确能运行 / arr是局部数组返回后悬空 / 应返回int / [100]语法错误 → arr是局部数组返回后悬空 |
| c6 | practice | 指针参数和引用参数，哪个说法正确？ | choice: 指针一定比引用快 / 引用不能为"空"，指针可为nullptr / 指针只能用->访问 / 引用必须&取地址 → 引用不能为"空"，指针可为nullptr |

### 2.6 多级指针 ✅ 已实现 (7 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 二级指针 — 指针的指针 | `int** pp = &p;` — pp 存的是 p 的地址。内存链：`pp → p → x`。`*pp` = p（x的地址），`**pp` = x（42）。三级以上就该反思是不是搞复杂了 |
| c2 | concept | 二级指针的实际用途 | 函数要改 int 变量→传 int*；函数要改 int* 变量→传 int**。`void alloc(int** pp) { *pp = new int[n]; }` 把新地址写入外部指针 |
| c3 | concept | 指针数组 vs 数组指针 | `int* arr[5]` — arr 是数组，元素是 int*。`int (*p)[5]` — p 是指针，指向 int[5] 的数组。一字之差，天壤之别。括号改变优先级 |
| c4 | concept | 螺旋法则 — 读懂任何声明 | 从变量名出发，顺时针螺旋向外读：先遇到 [] 是数组，先遇到 * 是指针。`const int* (*fp)()` — fp是指针→指向函数→返回const int* |
| c5 | code | 二级指针与动态二维数组 | `int** matrix = new int*[rows]` → 每行 `new int[cols]` → 用完先 delete[] 每行再 delete[] matrix。完整程序 |
| c6 | practice | `int* arr[5]` 和 `int (*p)[5]`，哪个说法正确？ | choice: 两者相同 / arr是数组(元素是指针)，p是指针(指向数组) / arr是指针p是数组 / 都指向数组 → arr是数组(元素是指针)，p是指针(指向数组) |
| c7 | practice | 用螺旋法则读 `int* (*fp)(int, int);` | choice: fp是函数返回int* / fp是函数指针，接受两个int返回int* / fp是数组 / 语法错误 → fp是函数指针，接受两个int返回int* |

### 2.7 智能指针入门 ✅ 已实现 (10 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 回顾：裸指针的两个致命伤 | 承接 2.4 动态内存，复盘点泄漏和悬空两个坑。根因：释放全靠人记，编译器不帮你。栈变量为什么没这问题？引出"让堆数据也享受自动销毁"的动机 |
| c2 | concept | 智能指针的本质：RAII 包装器 | RAII = 资源获取即初始化。把堆内存包在栈对象里，栈对象创建→获取资源，销毁→析构自动 delete。即使抛异常也不会泄漏——裸指针做不到。`#include <memory>` |
| c3 | concept | unique_ptr — 独占所有权 | 同一时刻只有一个 unique_ptr 拥有内存。不能拷贝（编译期禁止），可以 move 转移。`*p` 解引用、`p->` 访问成员、`p.get()` 获取裸指针借给老接口 |
| c4 | concept | 创建 unique_ptr：make_unique 是首选 | `auto p = make_unique<int>(42)` 比裸 new 安全（异常安全、自动配 delete[]）、比 `unique_ptr<int>(new int)` 更短。创建数组：`make_unique<int[]>(100)`。无脑用 make_unique |
| c5 | concept | 所有权转移：move、返回、传参 | `std::move` 转移所有权→原指针变 nullptr。函数返回 unique_ptr 自动 move——最常见的用法。传参三态：只看不拿(裸指针)、要接管(值)、可修改不管所有权(引用) |
| c6 | code | unique_ptr 实战：从分配到归还 | 工厂函数创建→返回→使用→move 转移→修改→动态数组。代码无 class 依赖，纯 int 示例。全程零 delete |
| c7 | concept | shared_ptr — 共享所有权 | 引用计数机制：拷贝+1、销毁-1、归零→delete。类比合租房。开销比 unique_ptr 大（控制块）。两个坑：不能和裸指针混管→double free；循环引用→泄漏（weak_ptr 日后讲） |
| c8 | code | shared_ptr 引用计数可视化 | 嵌套作用域中 p1→p2→p3 逐层拷贝，use_count() 打印实时计数，展示离开每层作用域后计数的逐步递减过程 |
| c9 | practice | unique_ptr 所有权转移辨析 | `p1=make_unique(10); p2=move(p1);` — 选正确的说法。辨析：move 后 p1 变 nullptr，p2 接管。不能继续通过 p1 访问 |
| c10 | practice | 场景选择：独占 → unique_ptr | 函数创建对象返回给调用者独占使用——选 unique_ptr。辨析：裸指针(无自动释放) vs shared_ptr(有多余开销) vs unique_ptr(正合适) |

---

## 03 流与文件 (6 节点 / 35 卡片) 📋 已设计

> 插入在进阶和面向对象之间。文件流不依赖 OOP，反而是"使用别人写的类"的热身——ifstream/ofstream/stringstream 都是标准库类，学生先用熟，到 OOP 自然过渡到"自己写类"。原 03-06 模块顺延为 04-07。

### 3.1 流是什么 (5 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 流抽象——一个统一的数据通道 | 所有 I/O 都通过"流"。流 = 程序和数据源之间的管道。cin 连键盘、cout 连屏幕、ifstream 连文件、stringstream 连字符串——换源头/目标，不换 << 和 >>。学一次，到处用 |
| c2 | concept | 四个标准流——各司其职 | cin(标准输入,键盘,缓冲)、cout(标准输出,屏幕,缓冲)、cerr(标准错误,屏幕,无缓冲→立刻显示)、clog(标准日志,屏幕,缓冲)。cerr 无缓冲的原因：cout 重定向到文件时，cerr 仍直接输出到屏幕 |
| c3 | concept | >> 与 <<——箭头指向就是数据流向 | >> 从流中提取数据（cin >> x 读入 x）、<< 把数据插入到流中（cout << x 写出 x）。数据顺着箭头方向流动。这个心智模型对 ifstream/ofstream/stringstream 全部适用 |
| c4 | code | cerr vs cout——独立输出通道 | 对比 cout 和 cerr 的输出行为，高亮缓冲 vs 无缓冲差异。`./program 2>errors.log` 重定向验证两个通道独立 |
| c5 | practice | cerr 和 cout 最重要的区别？ | choice: cerr 比 cout 快 / cerr 无缓冲立即输出，cout 有缓冲 / cerr 只能输出数字 / 没有区别 → cerr 无缓冲立即输出，cout 有缓冲 |

### 3.2 文件输入 (6 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | ifstream——把文件当键盘读 | `#include <fstream>`、ifstream 是类（bridge to OOP：第一次用别人写的类）、>> 和 getline 跟 cin 一模一样。RAII：离开作用域自动关闭 |
| c2 | concept | >> vs getline——词 vs 行 | >> 读到空白符停止（逐词）。getline 读到 \n 停止（逐行）。文件 "Alice 25\nBob 30\n"→>> 拆成 4 个 token，getline 拆成 2 行。按数据格式选择 |
| c3 | concept | 打开失败——文件不一定存在 | is_open() 返回 false / fail() 检查操作。标准开头：`if (!file) { cerr << "打不开"; return; }`。文件不存在、没权限、路径是目录→都可能失败 |
| c4 | code | 逐行读取——C++ 惯用法 | `while (getline(file, line)) { ... }` — getline 到 EOF 返回 false，循环自动停止。完整程序：读文件 + 加行号输出 |
| c5 | code | >> 与 getline 混用的陷阱 | `file >> age; getline(file, name);` — >> 读完后残留 \n 在缓冲区，getline 直接读到空行。修复：`file.ignore()` 吃掉残留换行符 |
| c6 | practice | 文件不存在时 is_open() 返回什么？ | fill → false（ifstream 不抛异常，必须检查后再读） |

### 3.3 文件输出 (6 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | ofstream——把文件当屏幕写 | << 跟 cout 完全一样。**默认覆盖**已有文件（反直觉！）。RAII 自动关闭+刷新。`#include <fstream>` |
| c2 | concept | 打开模式——覆盖还是追加 | 默认 ios::out（覆盖）、ios::app（追加到末尾）、ios::trunc（显式截断）。组合：`ios::out \| ios::app`。日志文件**必须**用 app——每次运行追加，绝不覆盖 |
| c3 | concept | 缓冲区——数据不是立即写入的 | 流有缓冲区，攒一批再写磁盘（快）。endl = \n + flush，\n 不刷新。flush 时机：需要立即看到结果、程序退出前、ofstream 析构时。规则：默认用 \n，endl 只在需要 flush 时用 |
| c4 | code | 读写流水线——处理数据流 | ifstream 读 → 处理 → ofstream 写。完整程序：读文件逐行转大写，写入新文件。两个文件出作用域自动关闭（RAII） |
| c5 | code | 追加模式实战——简单日志 | `ofstream log("app.log", ios::app);` 多次运行日志不覆盖，每次追加在末尾。演示第二次运行的输出追加在第一次内容之后 |
| c6 | practice | ios::app 模式下，文件已存在会怎样？ | choice: 删除旧内容重新写 / 新内容追加在末尾 / 编译错误 / 运行时错误 → 新内容追加在末尾，旧内容保留 |

### 3.4 字符串流 (6 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | stringstream——把字符串当流操作 | istringstream：像 cin 一样从字符串读取。ostringstream：像 cout 一样写入字符串。`#include <sstream>`。一种 << >> 技能，无穷种数据源/目标——这是流抽象的"啊哈时刻" |
| c2 | concept | 万能类型转换 | string→数值：`istringstream("42") >> n`，任何有 >> 的类型都能这样转。数值→string：`oss << 3.14; s = oss.str()`。比 stoi/to_string 通用——支持自定义类型 |
| c3 | concept | CSV 解析——切字符串的最优解 | `getline(iss, field, ',')` 以逗号分隔，比手动 find+substr 干净一个数量级。空字段自动处理（"Alice,,Beijing"→age=""）。三行代码 = 一个 CSV 解析器 |
| c4 | code | ostringstream vs 字符串拼接 | 构造复杂字符串：左边 `oss << "Name:" << name << ", Age:" << age` 一行清晰，右边 `"Name:" + name + ", Age:" + to_string(age)` 混合拼接易错且多次重新分配内存 |
| c5 | code | CSV 解析实战 | `istringstream iss(line); getline(iss, name, ','); getline(iss, age, ','); getline(iss, city);` 完整程序：解析→转换→输出 |
| c6 | practice | `istringstream iss("1 2 3"); int a,b,c; iss>>a>>b>>c; cout<<a+b+c;` 输出？ | fill → 6（istringstream 像 cin 一样处理空格分隔的值） |

### 3.5 流状态与格式化 (7 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 流有状态——四种标志位 | goodbit(正常)、eofbit(读到末尾)、failbit(操作失败-可恢复)、badbit(流损坏-不可恢复)。`while (cin >> x)` 能工作因为 >> 返回 cin，cin 转 bool 时检查 failbit |
| c2 | concept | 失败后流会"卡住"——最坑的新手 bug | `int n; cin >> n;` 用户输入 "abc"→failbit 置位→之后**所有** >> 操作静默失败。"abc" 残留在缓冲区挡路。程序看起来卡死，实际在空转——这是 #1 I/O 新手坑 |
| c3 | concept | 逃生方案——clear() + ignore() | `cin.clear()` 重置错误标志、`cin.ignore(10000, '\n')` 清空缓冲区直到换行。标准恢复：clear → ignore → 重新提示。两者缺一不可——clear 后不 ignore，坏数据还在 |
| c4 | code | 健壮的输入验证函数 | 循环 `while (!(cin >> n)) { cin.clear(); cin.ignore(10000, '\n'); ... }` 封装成 readInt(prompt)，反复要求直到合法输入 |
| c5 | concept | iomanip——格式化输出的工具箱 | `#include <iomanip>`：setw(n) 列宽（仅下次生效！）、setprecision(n) 小数位、fixed/scientific 浮点格式、left/right 对齐、setfill 填充字符。除 setw 外都是"粘性"的 |
| c6 | code | 打印整齐的表格 | left 对齐姓名列 + right 对齐数字列 + setw 固定列宽 + 分隔线。完整成绩单表格。对比有无格式化的差异 |
| c7 | practice | cin >> n 失败后，哪个操作能让 cin 恢复？ | choice: cin.reset() / cin.clear(); cin.ignore(10000, '\n'); / cin.flush() / 重新启动程序 → cin.clear(); cin.ignore(10000, '\n'); |

### 3.6 二进制与随机访问 (5 卡)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 文本 vs 二进制——同一文件的两种解读 | 文本："42"=2 字节字符 '4' 和 '2'。二进制：42=int=4 字节 0x2A000000。二进制更快更小但不可读、不可移植（字节序、struct 填充因编译器而异） |
| c2 | concept | read() 与 write()——直接读写字节 | `file.write(reinterpret_cast<const char*>(&data), sizeof(data))` 按内存原样写入。`file.read(...)` 读取。**必须** `ios::binary` 模式，否则 Windows 上 \n 会被转译为 \r\n |
| c3 | code | 读写 struct——固定格式记录 | 定义 Record struct → `ofstream(path, ios::binary)` → write → `ifstream(path, ios::binary)` → read → 验证。警告：不同编译器/系统可能不兼容 |
| c4 | concept | 随机访问——直接跳到第 N 个记录 | seekg(offset, from) 移动读位置、seekp 移动写位置、tellg/tellp 获取当前位置。ios::beg/cur/end 三种基准点。固定大小记录可 O(1) 跳到任意一条——文本文件做不到 |
| c5 | practice | 为什么二进制文件通常比文本文件小？ | choice: 自动压缩 / 数值按内存格式存储而非逐位字符 / 不存空格 / 使用哈希 → 数值按内存格式存储而非逐位字符（如 int 42 文本=2 字节，二进制=4 字节；int 123456789 文本=9 字节，二进制仍 4 字节） |

---

## 04 面向对象 (5 节点 / ~28 卡片)

### 4.1 类与对象

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 类 vs 对象 | 类是蓝图（`class Student { };`），对象是实例（`Student s;`）；类 = 数据成员 + 成员函数的集合 |
| c2 | code | 第一个类 | `class Student { public: string name; int score; void print() { cout << name << score; } };` + 调用 `s.print()` |
| c3 | concept | 访问控制 | `public` = 类内外都能访问；`private` = 只有类内能访问；`private` 是默认（struct 默认 public）；封装 = 隐藏实现 |
| c4 | code | getter/setter | `private: int score; public: int getScore() { return score; } void setScore(int s) { if(s>=0) score = s; }` |
| c5 | concept | this 指针 | 成员函数内 `this` 指向调用该函数的对象自身；`this->score` 等价于 `score`（通常省略）；返回 `*this` 可实现链式调用 `obj.setA(1).setB(2)` |
| c6 | concept | static 成员变量 | `static` 成员变量属于类而非对象，所有对象共享同一份内存；必须在类外定义（`int Student::count = 0;`）；典型用途：对象计数（构造+1、析构-1）、类级别的配置常量 |
| c7 | concept | static 成员函数 | 无 `this` 指针，只能访问 static 成员；调用方式 `ClassName::func()`（不需要对象）；典型用途：工厂方法、访问私有 static 变量 |
| c8 | practice | 以下哪项是封装的好处？ | choice: 代码更短 / 防止外部直接篡改数据 / 运行更快 → 防止外部直接篡改数据 |

### 4.2 构造与析构

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

### 4.3 继承

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 继承是什么 | `class Dog : public Animal { };` 子类获得父类的 public 和 protected 成员；继承 = 代码复用 + "is-a" 关系 |
| c2 | code | 继承示例 | `class Animal { public: void eat(); }; class Dog : public Animal { public: void bark(); };` dog 可以 eat + bark |
| c3 | concept | 构造与析构顺序 | 构造：父类先构造 → 子类后构造；析构：子类先析构 → 父类后析构（栈的逆序） |
| c4 | practice | 私有的父类成员能被子类访问吗？ | choice: 能 / 不能（需用 protected 或 public 成员函数） → 不能 |
| c5 | concept | 组合 vs 继承 | 继承是 "is-a"（狗是动物），组合是 "has-a"（车有引擎）。`class Car { Engine e; };` 比 `class Car : public Engine { };` 更合理——车不是引擎。原则："能用组合就别继承"，组合更灵活、耦合更低 |

### 4.4 多态

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 虚函数 | `virtual void speak();` 让函数调用在运行时根据实际对象类型决定（动态绑定）；非虚函数在编译时决定（静态绑定） |
| c2 | code | 多态示例 | 基类指针数组：`Animal* a[] = {new Dog(), new Cat()}; for(auto p : a) p->speak();` 每个输出自己的声音 |
| c3 | concept | override 与 final | `override` 显式标记重写（编译器检查是否真的重写父类虚函数）；`final` 禁止子类继续重写 |
| c4 | code | 抽象类 | `class Shape { virtual double area() = 0; };` 纯虚函数 = 0 → 抽象类不能实例化；子类必须实现纯虚函数 |
| c5 | practice | 不用 virtual 会怎样？ | choice: 编译错误 / 始终调父类函数(静态绑定) / 随机调 → 始终调父类函数 |

### 4.5 运算符重载

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 运算符重载 | 自定义类的 `+ - * / == <<` 等行为；成员函数 vs 友元函数两种写法；不能重载的操作符：`::` `.` `.*` `?:` |
| c2 | code | 成员函数重载 | `class Point { int x,y; Point operator+(const Point& p) { return Point(x+p.x, y+p.y); } };` |
| c3 | code | 重载 `<<` | 需用友元：`friend ostream& operator<<(ostream& os, const Point& p) { os << p.x << p.y; return os; }` |
| c4 | practice | 能重载 `*` 但不能改优先级？ | choice: 正确 / 错误 → 正确（重载不改变优先级和结合性） |

---

## 05 STL (5 节点 / ~27 卡片)

### 5.1 vector

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | vector 是什么 | `std::vector<T>` = 动态数组，自动管理内存，大小可变；原生数组 vs vector：vector 更安全（有边界检查 `.at()`） |
| c2 | code | 常用操作 | `vector<int> v = {1,2,3}; v.push_back(4); v.pop_back(); v.size(); v[0]` vs `v.at(0)`（后者抛异常） |
| c3 | concept | capacity 与 reserve | `size()` = 元素个数，`capacity()` = 已分配的容量；`reserve(n)` 预分配空间避免反复扩容；扩容会 copy 所有元素 |
| c4 | practice | `vector<int> v(10);` 中 v.size() 是？ | fill: 10（构造 10 个默认值 0 的元素） |
| c5 | concept | 其他顺序容器 | `list` 双向链表 — O(1) 任意位置插入删除，不可随机访问；`deque` 双端队列 — 两端 O(1) 插入，支持 `[]` 随机访问。选用口诀：随机访问用 vector，头尾操作用 deque，频繁中间插入/删除用 list |

### 5.2 string

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | string 深入 | `std::string` 是 `basic_string<char>` 的别名；C 风格对比：`strlen` O(n) vs `.size()` O(1)；`c_str()` 获取 C 串指针 |
| c2 | code | 高级操作 | `s.replace(pos, len, "new"); s.find("lo"); s.compare("other"); to_string(3.14); stoi("42"); stod("3.14")` |
| c3 | concept | string_view | `std::string_view` 不拥有数据，只"查看"；O(1) 的 substr；生命周期短，原字符串销毁后 view 悬空 |
| c4 | practice | `string s = "abc";` 修改第 2 个字符的最简方式？ | choice: `s[1]='x'` / `s.at(1)='x'` / `s.replace(1,1,"x")` → `s[1]='x'` |

### 5.3 map / set

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 关联容器 | `map<Key, Value>` 键值对、键唯一、自动排序；`set<T>` 不重复元素集合、自动排序；`unordered_map` 哈希表 O(1) 而非 O(log n) |
| c2 | code | map 常用操作 | `map<string, int> m; m["alice"] = 90; m.count("bob"); for(auto& [k,v] : m)` 结构化绑定遍历 |
| c3 | code | set 常用操作 | `set<int> s = {3,1,2}; s.insert(4); s.erase(2); s.count(3);` 元素自动升序 |
| c4 | code | unordered_map vs map | `unordered_map<string, int>` 哈希表 O(1) 查找、无序；`map<string, int>` 红黑树 O(log n) 查找、按键排序；键无顺序需求时优先 unordered_map；有排序/范围查询需求用 map |
| c5 | practice | map 中 `m["new_key"]` 如果不存在？ | choice: 抛异常 / 创建该 key 值为默认值 / 编译错误 → 创建该 key 值为默认值（operator[] 的隐式插入行为） |

### 5.4 algorithm

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 算法库概览 | `<algorithm>` 头文件提供 100+ 通用算法；分类：排序、查找、修改、数值；都用迭代器操作，与容器解耦 |
| c2 | code | 排序与查找 | `sort(v.begin(), v.end());` `auto it = find(v.begin(), v.end(), 42);` `binary_search(v.begin(), v.end(), 42);`（需先排序） |
| c3 | code | 常用算法 | `reverse(v.begin(), v.end()); count(v.begin(), v.end(), 1); min_element/max_element; for_each(v.begin(), v.end(), [](int x) { ... });` |
| c4 | practice | `find` 未找到返回什么？ | choice: nullptr / v.end() / -1 → v.end()（返回迭代器，未找到返回尾后迭代器） |

### 5.5 iterator

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 迭代器概念 | 迭代器 = 通用的"指针"抽象，解耦算法与容器；`begin()` 指向首元素，`end()` 指向尾后；`++` 前进，`*` 解引用 |
| c2 | code | 迭代器分类 | 输入/输出/前向/双向/随机访问（vector 是随机访问，list 是双向）；`auto it = v.begin(); advance(it, 2);` |
| c3 | concept | 范围 for 的真相 | `for(auto& x : v)` 本质是迭代器的语法糖：`for(auto it = begin(v); it != end(v); ++it)` |
| c4 | practice | `vector<int> v = {};` 中 `v.begin() == v.end()`？ | choice: 是 / 否 / 未定义 → 是（空容器的 begin 等于 end） |

---

## 06 泛型 (4 节点 / ~18 卡片)

### 6.1 函数模板

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 模板是什么 | `template<typename T>` 让函数适用于多种类型；编译器根据调用时的实参类型自动生成对应版本（隐式实例化） |
| c2 | code | 通用 max | `template<typename T> T myMax(T a, T b) { return a > b ? a : b; }` 同时支持 int、double、string |
| c3 | concept | 模板参数推导 | 编译器从实参推导 T；`myMax(3, 5)` → T=int；`myMax(3.0, 5)` → 编译错误（T 歧义），需 `myMax<double>(3.0, 5)` |
| c4 | practice | 函数模板的代码何时生成？ | choice: 运行时 / 编译时（实例化） / 链接时 → 编译时 |

### 6.2 类模板

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 类模板 | 类本身是模板：`template<typename T> class Box { T value; };` 天然支持泛型容器 |
| c2 | code | 泛型 Pair | `template<typename T1, typename T2> class Pair { T1 first; T2 second; }; Pair<int, string> p{1, "hello"};` |
| c3 | concept | CTAD | C++17 类模板参数推导：`Pair p{1, "hello"};` 自动推导为 `Pair<int, const char*>`，无需显式指定类型 |
| c4 | practice | `vector<int>` 中的 int 是什么？ | choice: 函数参数 / 模板参数 / 返回值类型 → 模板参数 |

### 6.3 模板特化

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 全特化 | 为特定类型写专门的实现：`template<> class Box<bool> { /* 用 bitset 优化 */ };` 替代泛型版本 |
| c2 | concept | 偏特化 | 专门化部分模板参数：`template<typename T> class Box<T*> { /* 指针版本 */ };` 只匹配指针类型 |
| c3 | code | 特化示例 | 通用 max 对 `const char*` 比较地址而非内容 — 特化用 `strcmp` 修复 |
| c4 | practice | 全特化 vs 偏特化的区别？ | choice: 无区别 / 全特化所有参数都确定，偏特化只确定部分 → 全特化所有参数都确定 |

### 6.4 概念 (C++20)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 概念是什么 | `concept Addable = requires(T a, T b) { a + b; };` 约束模板参数；编译期检查，报错信息比传统模板清晰 10 倍 |
| c2 | concept | SFINAE vs concept | C++17 之前用 SFINAE + `enable_if` 约束模板，出错时编译器报几百行模板展开错误，难以定位；C++20 concept 在"门口"检查，不匹配就直接报 `constraint not satisfied`，一行指出问题。一句话：concept 把报错从"编译器的内心独白"变成"人类的提示" |
| c3 | code | concept 使用 | `template<Addable T> T sum(T a, T b) { return a + b; }` 传入没有 + 的类型会得到可读的编译错误 |
| c4 | practice | concept 定义了一个？ | choice: 类型 / 编译期谓词（一组要求） / 类 → 编译期谓词 |

---

## 07 现代 C++ (7 节点 / ~32 卡片)

### 7.1 智能指针

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 为什么需要智能指针 | 原始指针：容易泄漏、双重 delete、野指针；智能指针 = RAII 包装，自动管理生命周期 |
| c2 | concept | unique_ptr | `unique_ptr<T>` 独占所有权、不可拷贝（保证唯一）、`make_unique` 创建、`std::move` 转移所有权 |
| c3 | code | unique_ptr 示例 | `auto p = make_unique<int>(42); auto q = move(p);` p 变为 nullptr，q 拥有该资源；离开作用域自动 delete |
| c4 | concept | shared_ptr | `shared_ptr<T>` 共享所有权、引用计数；计数归零自动释放；`make_shared` 一次分配（控制块+对象）；注意循环引用 |
| c5 | code | weak_ptr | `weak_ptr<T>` 不增加引用计数、解决 shared_ptr 循环引用；`lock()` 返回 shared_ptr（对象还存在）或空 |
| c6 | practice | unique_ptr 能拷贝吗？ | choice: 能 / 不能 / 能但只浅拷贝 → 不能（独占所有权，编译期禁止） |

### 7.2 lambda

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | lambda 是什么 | `[](int x) { return x*2; }` 匿名函数对象；捕获列表 `[]`、参数 `()`、函数体 `{}`；本质是编译器生成的仿函数类 |
| c2 | code | 捕获方式 | `[=]` 按值捕获全部（只读）；`[&]` 按引用捕获全部；`[x, &y]` 混合；`[this]` 捕获 this 指针访问成员 |
| c3 | code | lambda 实战 | `sort(v.begin(), v.end(), [](int a, int b) { return abs(a) < abs(b); });` + `auto add = [](auto a, auto b) { return a+b; };` 泛型 lambda |
| c4 | practice | `[=]` 捕获的变量能在 lambda 内修改吗？ | choice: 能 / 不能（需加 mutable） / 编译错误 → 不能（需加 mutable） |

### 7.3 移动语义

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 左值与右值 | 左值 = 有名字、可取地址（`int x;`）；右值 = 临时对象、即将销毁（`x+5`、`string("tmp")`）；`&&` 右值引用 |
| c2 | concept | 移动 vs 拷贝 | 拷贝 = 深复制全部资源（慢）；移动 = "窃取"临时对象的资源（快），把源对象指针搬过来，源置空 |
| c3 | code | std::move | `vector<int> v2 = move(v1);` v1 被"掏空"变成空容器，v2 接管原数据；move 不移动任何东西，只是类型转换 |
| c4 | code | 移动构造 | `class Buffer { char* data; Buffer(Buffer&& other) noexcept : data(other.data) { other.data = nullptr; } };` |
| c5 | practice | `std::move` 之后原对象还能用吗？ | choice: 能用且值不变 / 能用但处于"有效但未指定"状态 / 立即崩溃 → 能用但处于"有效但未指定"状态 |

### 7.4 constexpr

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | constexpr 深入 | 编译期求值保证；C++11 函数只能一行 return，C++14 允许分支循环，C++20 允许 `new` / `try`；`consteval` 强制编译期 |
| c2 | code | 编译期计算 | `constexpr int fib(int n) { return n <= 1 ? n : fib(n-1) + fib(n-2); } constexpr int f5 = fib(5);` 在编译期算出 5 |
| c3 | practice | constexpr 函数一定在编译期执行？ | choice: 一定 / 不一定（取决于调用上下文是否为 constexpr） → 不一定 |

### 7.5 Ranges (C++20)

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | Ranges 管道 | `ranges::filter(v, even)` 管道式组合；惰性求值（不生成中间容器）；`views::transform/filter/take` |
| c2 | concept | 与传统算法对比 | `std::sort(v.begin(), v.end())` — 必须传 begin/end 对；`ranges::sort(v)` — 直接传容器。管道式写法 `v \| views::filter(even) \| views::transform(square)` 把"先过滤再映射"写成从左到右的数据流 |
| c3 | code | Ranges 实战 | `auto even = [](int x) { return x % 2 == 0; }; auto r = v \| views::filter(even) \| views::transform([](int x) { return x * x; });` 不用中间 vector，惰性求值只在遍历时计算 |
| c4 | practice | `views::filter` 会生成中间容器吗？ | choice: 会生成新 vector / 不会（惰性求值，遍历时才计算） / 取决于元素数量 → 不会（惰性求值） |

### 7.6 variant 与 optional

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | variant — 类型安全的 union | `variant<int, string, double> v;` 同一时刻只持有一种类型的值；`std::get<int>(v)` 获取（类型不对抛异常）；`std::holds_alternative<int>(v)` 判断当前类型；`std::visit` 安全地处理所有可能类型 |
| c2 | concept | optional — 可能有值 | `optional<T>` 表示"可能有值也可能没有"；`has_value()` 检查、`value()` 获取（为空抛异常）、`value_or(default)` 提供默认值；`nullopt` 清空。比用 -1/空串/nullptr 表示"无效"更类型安全 |
| c3 | code | variant + optional 实战 | 解析配置文件：`variant<int, string> parseValue(string key);` 值可能是整数或字符串。查找缓存：`optional<User> findUser(int id);` 找不到返回 nullopt |
| c4 | practice | `optional<int> o;` 访问 `*o` 会？ | choice: 返回 0 / 未定义行为 / 编译错误 → 未定义行为（应先用 has_value() 或 value() 抛异常） |

### 7.7 结构化绑定

| # | 卡类型 | 标题 | 内容要点 |
|---|--------|------|---------|
| c1 | concept | 结构化绑定基础 | `auto [x, y] = pair(1, 2.0);` 一行拆分包(pair/tuple)；`auto [name, score] = student;` 拆分 struct 成员（按声明顺序）；C++17 起可用 |
| c2 | concept | if 初始化语句 | `if (auto [it, ok] = m.insert({k, v}); ok) { /* 插入成功 */ }` 把变量声明+检查写在一起，限制作用域，防止变量泄漏。也适用于 `if (auto lock = mutex.try_lock(); lock)` 等场景 |
| c3 | code | 结构化绑定实战 | map 遍历：`for (auto& [key, value] : scores)` 代替 `for (auto& p : scores) { p.first; p.second; }`；函数多返回值：`auto [min, max] = findMinMax(v);` |
| c4 | practice | 结构化绑定拆分的是成员的？ | choice: 地址 / 声明顺序 / 字母顺序 / 内存大小 → 声明顺序（按 struct/class 中声明的先后） |
