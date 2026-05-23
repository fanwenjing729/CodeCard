import type { Course } from '@/types';
import { linearNodes } from './01-linear';
import { treeNodes } from './02-tree';
import { graphNodes } from './03-graph';
import { searchNodes } from './04-search';
import { sortNodes } from './05-sort';
import { advancedNodes } from './06-advanced';

export const dsCourse: Course = {
  id: 'ds',
  title: '数据结构',
  icon: 'file-tree',
  color: '#2ed573',
  nodes: [
    ...linearNodes,
    ...treeNodes,
    ...graphNodes,
    ...searchNodes,
    ...sortNodes,
    ...advancedNodes,
  ],
};
