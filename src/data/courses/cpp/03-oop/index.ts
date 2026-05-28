import type { CourseModule } from '@/types';
import { classIntroNode } from './class-intro';
import { accessControlNode } from './access-control';
import { friendNode } from './friend';
import { staticMembersNode } from './static-members';
import { constructDestructNode } from './construct-destruct';
import { copyControlNode } from './copy-control';
import { operatorOverloadNode } from './operator-overload';

export const oopModule: CourseModule = {
  moduleId: 'oop',
  module: '面向对象',
  nodes: [
    classIntroNode,
    accessControlNode,
    friendNode,
    staticMembersNode,
    constructDestructNode,
    copyControlNode,
    operatorOverloadNode,
  ],
};
