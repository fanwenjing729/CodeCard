import type { PathNode, CourseModule } from '@/types';
import { helloWorldNode } from './hello-world';
import { variablesNode } from './variables';
import { operatorsNode } from './operators';
import { ioNode } from './io';
import { constantsNode } from './constants';
import { scopeNode } from './scope';
import { comparisonLogicNode } from './comparison-logic';
import { conditionalsNode } from './conditionals';

const nodes: PathNode[] = [
  helloWorldNode,
  variablesNode,
  operatorsNode,
  ioNode,
  constantsNode,
  scopeNode,
  comparisonLogicNode,
  conditionalsNode,
];

export const basicsModule: CourseModule = { moduleId: 'basics', nodes };
