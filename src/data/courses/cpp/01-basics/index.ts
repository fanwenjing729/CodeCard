import type { PathNode, CourseModule } from '@/types';
import { helloWorldNode } from './hello-world';
import { variablesNode } from './variables';
import { operatorsNode } from './operators';
import { ioNode } from './io';
import { constantsNode } from './constants';
import { scopeNode } from './scope';
import { comparisonLogicNode } from './comparison-logic';
import { conditionalsNode } from './conditionals';
import { forLoopNode } from './for-loop';
import { whileLoopNode } from './while-loop';
import { breakContinueNode } from './break-continue';
import { arrayNode } from './array';
import { array2dNode } from './array-2d';
import { stringNode } from './string';
import { functionNode } from './function';
import { overloadNode } from './overload';
import { referenceNode } from './reference';

const nodes: PathNode[] = [
  helloWorldNode,
  variablesNode,
  operatorsNode,
  ioNode,
  constantsNode,
  scopeNode,
  comparisonLogicNode,
  conditionalsNode,
  forLoopNode,
  whileLoopNode,
  breakContinueNode,
  arrayNode,
  array2dNode,
  stringNode,
  functionNode,
  overloadNode,
  referenceNode,
];

export const basicsModule: CourseModule = { moduleId: 'basics', module: '基础', nodes };
