import type { CourseModule } from '@/types';
import { memoryFourRegionsNode } from './memory-four-regions';
import { pointerNode } from './pointer';
import { pointerArrayNode } from './pointer-array';
import { dynamicMemoryNode } from './dynamic-memory';
import { pointerFunctionNode } from './pointer-function';
import { multiPointerNode } from './multi-pointer';
import { smartPointerNode } from './smart-pointer';

export const advancedModule: CourseModule = {
  moduleId: 'advanced',
  module: '进阶',
  nodes: [
    memoryFourRegionsNode,
    pointerNode,
    pointerArrayNode,
    dynamicMemoryNode,
    pointerFunctionNode,
    multiPointerNode,
    smartPointerNode,
  ],
};
