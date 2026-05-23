import type { PathNode } from '@/types';
import { helloWorldNode } from './hello-world';
import { variablesNode } from './variables';
import { ioNode } from './io';
import { operatorsNode } from './operators';

export const basicsNodes: PathNode[] = [
  helloWorldNode,
  variablesNode,
  operatorsNode,
  ioNode,
];
