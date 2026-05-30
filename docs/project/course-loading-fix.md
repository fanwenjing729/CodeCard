# 课程导入链断裂风险与修复

## 问题

`src/data/courses/index.ts` 是课程数据的**唯一入口**，所有课程通过静态 `import` 聚合：

```ts
import { cppCourse } from './cpp';
export const courses: Course[] = [cppCourse];
```

任意一个子文件有语法错误 → 整个链断裂 → `courses` 全部加载失败 → HomeScreen 白屏。

## 为什么现在不修

1. 语法错误在 Metro bundler **构建阶段**就报错，APK 打不出来
2. `validate.test.ts` 遍历所有卡片验证完整性，提交前必跑
3. 当前只有 1 门课程、1 个编辑者

## 触发条件（满足任一即重构）

| 条件 | 原因 |
|------|------|
| 课程 ≥ 3 门 | import 链变长 |
| 多人同时编辑课程文件 | 合并冲突 + 语法错风险叠加 |
| 需要运行时热加载（如 CDN 下发课程） | 静态 import 不支持 |
| 用户侧报告过因课程加载导致白屏 | 实际发生过的 bug 优先修 |

## 修复方案：动态 import + 容错加载

改 2 个文件，consumer 不受影响。

**1. `src/lib/useCourses.ts` — 改为异步容错加载**

```ts
export async function getCourses(): Promise<Course[]> {
  const modules = [
    () => import('@/data/courses/cpp'),
    // 新课程在此加一行
  ];
  const results = await Promise.allSettled(modules.map(fn => fn()));
  const courses: Course[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') courses.push(r.value.cppCourse);
    else console.warn('[useCourses] 课程加载失败，已跳过', r.reason);
  }
  return courses;
}
```

**2. 所有课程 index.ts 统一导出名 `xxxCourse`**

效果：一门课语法错了 → 仅那门课不加载，其他课正常，控制台 warn 提示。

成本：~30 行，只改 `useCourses.ts`，8 个 screen 零改动。
