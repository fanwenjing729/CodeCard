import type { CourseModule } from '@/types';
import { classIntroNode } from './class-intro';
import { accessControlNode } from './access-control';
import { staticMembersNode } from './static-members';
import { constructDestructNode } from './construct-destruct';
import { copyControlNode } from './copy-control';

export const oopModule: CourseModule = {
  moduleId: 'oop',
  module: '面向对象',
  nodes: [
    classIntroNode,
    accessControlNode,
    staticMembersNode,
    constructDestructNode,
    copyControlNode,
  ],
};
