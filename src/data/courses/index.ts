// 课程注册表 — 所有课程的静态导入入口。
// 注意：任意一个节点文件的语法错误都会导致整个 courses 导出失败。
// 安全网：validate.test.ts 遍历所有卡片和节点，提交前运行即可捕获断裂的导入。
import type { Course } from '@/types';
import { cppCourse } from './cpp';
// TODO: 以下课程内容就绪后取消注释
// import { dsCourse } from './ds';
// import { coCourse } from './co';
// import { cnCourse } from './cn';
// import { osCourse } from './os';

export const courses: Course[] = [
  cppCourse,
  // dsCourse,
  // coCourse,
  // cnCourse,
  // osCourse,
];
