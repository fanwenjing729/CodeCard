import type { CourseModule } from '@/types';
import { classIntroNode } from './class-intro';
import { accessControlNode } from './access-control';
import { constructDestructNode } from './construct-destruct';
import { copyControlNode } from './copy-control';
import { staticMembersNode } from './static-members';
import { friendNode } from './friend';
import { operatorOverloadNode } from './operator-overload';
import { inheritanceNode } from './inheritance';
import { polymorphismNode } from './polymorphism';
import { designPrinciplesNode } from './design-principles';
import { gradeSystemNode } from './grade-system';
import { separateCompileNode } from './separate-compile';

export const oopModule: CourseModule = {
  moduleId: 'oop',
  module: '面向对象',
  nodes: [
    classIntroNode,
    accessControlNode,
    constructDestructNode,
    copyControlNode,
    staticMembersNode,
    friendNode,
    operatorOverloadNode,
    inheritanceNode,
    polymorphismNode,
    designPrinciplesNode,
    gradeSystemNode,
    separateCompileNode,
  ],
};
