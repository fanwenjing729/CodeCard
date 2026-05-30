import type { CourseModule } from '@/types';
import { whatIsDsNode } from './what-is-ds';
import { timeComplexityNode } from './time-complexity';
import { spaceComplexityNode } from './space-complexity';
import { moduleQuizNode } from './module-quiz';

export const introModule: CourseModule = {
  moduleId: 'intro',
  module: '绪论',
  nodes: [whatIsDsNode, timeComplexityNode, spaceComplexityNode, moduleQuizNode],
};
