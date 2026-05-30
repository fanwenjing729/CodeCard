import type { CourseModule } from '@/types';
import { vectorDeepNode } from './vector-deep';
import { stringDeepNode } from './string-deep';

export const stlModule: CourseModule = {
  moduleId: 'stl',
  module: 'STL',
  nodes: [vectorDeepNode, stringDeepNode],
};
