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
import { vectorIntroNode } from './vector-intro';
import { stringNode } from './string';
import { functionNode } from './function';
import { referenceNode } from './reference';
import { overloadNode } from './overload';

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
  vectorIntroNode,
  stringNode,
  functionNode,
  referenceNode,
  overloadNode,
];

export const basicsModule: CourseModule = { moduleId: 'basics', module: '基础', nodes };
