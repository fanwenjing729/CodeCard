import type { Course } from '@/types';
import { processNodes } from './01-process';
import { memoryNodes } from './02-memory';
import { filesystemNodes } from './03-filesystem';
import { concurrencyNodes } from './04-concurrency';
import { ioNodes } from './05-io';
import { advancedNodes } from './06-advanced';

export const osCourse: Course = {
  id: 'os',
  title: '操作系统',
  icon: 'memory',
  color: '#ff6348',
  nodes: [
    ...processNodes,
    ...memoryNodes,
    ...filesystemNodes,
    ...concurrencyNodes,
    ...ioNodes,
    ...advancedNodes,
  ],
};
