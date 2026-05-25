import type { CourseModule } from '@/types';
import { classIntroNode } from './class-intro';

export const oopModule: CourseModule = {
  moduleId: 'oop',
  module: '面向对象',
  nodes: [
    classIntroNode,
  ],
};
