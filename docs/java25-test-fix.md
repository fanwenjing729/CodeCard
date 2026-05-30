# Java 25 测试兼容修复

## 状态

⏳ 以后做

## 问题

`E:\JDK` 是 Java 25，Mockito 不兼容 → 集成测试绕过 `@SpringBootTest` 手工启动应用 → 无法用标准 Spring Boot Test 框架。

## 分析

根因是 Mockito 的字节码生成引擎（byte-buddy/ASM）不认识 Java 25 的 class 文件版本号。Mockito 每个版本只支持到当时的 LTS（Java 21/25 之间隔了 4 年，class 文件版本号跳了 4 个数字）。

## 三个方案

| 方案 | 做的事 | 成本 | 风险 |
|------|--------|------|------|
| A: 装 Java 21 | 另装一个 JDK 21，`JAVA_HOME` 指向它 | 10min | 零 |
| B: 等 Mockito 更新 | 坐等官方支持 Java 25 | 0 | 不知道要等多久 |
| C: 升级 Spring Boot 3.5+ | Spring Boot 新版本可能预带兼容的 Mockito | 1天 | 破坏性变更 |

## 推荐：方案 A + B

**装 Java 21** 解决当下问题，**等 Mockito 更新**后切回 Java 25。

### 装 Java 21 怎么做

1. 下载 JDK 21（Temurin/Amazon Corretto/Oracle）
2. 装到 `E:\JDK21`（和 JDK 25 共存）
3. 改 IDE 的 JDK 配置指向 21
4. 改 `JAVA_HOME` 环境变量或用 Maven toolchains

```xml
<!-- .m2/toolchains.xml — 告诉 Maven 用 JDK 21 -->
<toolchains>
  <toolchain>
    <type>jdk</type>
    <provides><version>21</version></provides>
    <configuration><jdkHome>E:\JDK21</jdkHome></configuration>
  </toolchain>
</toolchains>
```

### 换回 Java 21 后的收益

- `@SpringBootTest` 正常启动 Spring 上下文，13 个测试从"手工启动应用"变成"标准 Spring Boot Test"
- 新增测试不用手写 `@SpringBootApplication` 的 main 启动逻辑
- 可以用 `@MockBean`、`@WebMvcTest` 等 Spring Test 注解

### 什么时候做

Java 25 测试变慢 / 新增后端测试因为 Mockito 不方便时。

---

## 为什么不现在装

- 当前 13 个测试全部通过（只是测试方式不标准）
- 没有新加后端测试的需求
- 换 JDK 可能影响其他项目
