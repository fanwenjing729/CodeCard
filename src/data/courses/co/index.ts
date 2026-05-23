import type { Course } from '@/types';
import { isaNodes } from './01-isa';
import { arithmeticNodes } from './02-arithmetic';
import { memoryNodes } from './03-memory';
import { processorNodes } from './04-processor';
import { ioNodes } from './05-io';
import { pipelineNodes } from './06-pipeline';

export const coCourse: Course = {
  id: 'co',
  title: '计算机组成原理',
  icon: 'chip',
  color: '#ff9f43',
  nodes: [
    ...isaNodes,
    ...arithmeticNodes,
    ...memoryNodes,
    ...processorNodes,
    ...ioNodes,
    ...pipelineNodes,
  ],
};
