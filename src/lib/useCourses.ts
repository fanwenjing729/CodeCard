// 课程数据访问层
//
// 设计约束（防止单点故障）：
//   当前只有一门 C++ 课程，使用静态 import。当新增第二门课时，
//   改为动态 import() + try-catch，使单门课程加载失败不影响其他课程。
//   对外 API（useCourses / useCourse）保持不变，只改内部实现即可。
//
//   安全网：validate.test.ts 遍历所有卡片，提交前运行即可捕获断裂的 import 链。

import { useMemo } from 'react';
import type { Course } from '@/types';
import { courses } from '@/data/courses';

/** 所有已注册课程（同步，未来可切换为异步加载） */
export function getCourses(): Course[] {
  return courses;
}

/** 按 id 查找课程，找不到时打 warn 并返回 undefined */
export function getCourse(courseId: string): Course | undefined {
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    console.warn(`[useCourses] 课程未找到: courseId="${courseId}"`);
  }
  return course;
}

/** React hook — 获取全部课程列表 */
export function useCourses(): Course[] {
  return useMemo(() => getCourses(), []);
}

/** React hook — 按 id 获取单门课程，找不到返回 undefined */
export function useCourse(courseId: string): Course | undefined {
  return useMemo(() => getCourse(courseId), [courseId]);
}
