import type { Course } from '@/types';
import type { CourseModule } from '@/types';
import { processModule } from './01-process';
import { memoryModule } from './02-memory';
import { filesystemModule } from './03-filesystem';
import { concurrencyModule } from './04-concurrency';
import { ioModule } from './05-io';
import { advancedModule } from './06-advanced';

const modules: CourseModule[] = [processModule, memoryModule, filesystemModule, concurrencyModule, ioModule, advancedModule];

export const osCourse: Course = {
  id: 'os',
  title: '操作系统',
  icon: 'memory',
  color: '#ff6348',
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.filter(m => m.nodes.length > 0).length,
};
