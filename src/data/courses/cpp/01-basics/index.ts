import type { PathNode } from '@/types';
import { helloWorldNode } from './hello-world';
import { variablesNode } from './variables';
import { ioNode } from './io';

export const basicsNodes: PathNode[] = [
  helloWorldNode,
  variablesNode,
  ioNode,
];
