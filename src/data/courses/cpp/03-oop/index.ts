import type { CourseModule } from '@/types';
import { classIntroNode } from './class-intro';
import { accessControlNode } from './access-control';

export const oopModule: CourseModule = {
  moduleId: 'oop',
  module: '面向对象',
  nodes: [
    classIntroNode,
    accessControlNode,
  ],
};
