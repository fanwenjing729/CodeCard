import type { CourseModule } from '@/types';
import { memoryFourRegionsNode } from './memory-four-regions';
import { structIntroNode } from './struct-intro';
import { enumNode } from './enum';
import { pointerNode } from './pointer';
import { pointerArrayNode } from './pointer-array';
import { dynamicMemoryNode } from './dynamic-memory';
import { pointerFunctionNode } from './pointer-function';
import { multiPointerNode } from './multi-pointer';
import { smartPointerNode } from './smart-pointer';
import { recursionNode } from './recursion';

export const advancedModule: CourseModule = {
  moduleId: 'advanced',
  module: '进阶',
  nodes: [
    memoryFourRegionsNode,
    structIntroNode,
    enumNode,
    pointerNode,
    pointerArrayNode,
    dynamicMemoryNode,
    pointerFunctionNode,
    multiPointerNode,
    smartPointerNode,
    recursionNode,
  ],
};
