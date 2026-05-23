import type { PathNode } from '@/types';
import { helloWorldNode } from './hello-world';
import { variablesNode } from './variables';
import { operatorsNode } from './operators';
import { ioNode } from './io';
import { constantsNode } from './constants';
import { scopeNode } from './scope';

export const basicsNodes: PathNode[] = [
  helloWorldNode,
  variablesNode,
  operatorsNode,
  ioNode,
  constantsNode,
  scopeNode,
];
