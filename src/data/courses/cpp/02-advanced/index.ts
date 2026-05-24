import type { CourseModule } from '@/types';
import { pointerNode } from './pointer';
import { pointerArrayNode } from './pointer-array';

export const advancedModule: CourseModule = {
  moduleId: 'advanced',
  module: '进阶',
  nodes: [pointerNode, pointerArrayNode],
};
