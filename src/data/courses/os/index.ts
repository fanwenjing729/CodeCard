import type { Course, CourseModule, ModuleMeta } from '@/types';
import { processModule } from './01-process';
import { memoryModule } from './02-memory';
import { filesystemModule } from './03-filesystem';
import { concurrencyModule } from './04-concurrency';
import { ioModule } from './05-io';
import { advancedModule } from './06-advanced';

const modules: CourseModule[] = [processModule, memoryModule, filesystemModule, concurrencyModule, ioModule, advancedModule];

const modulesMeta: ModuleMeta[] = modules.map(m => ({
  moduleId: m.moduleId,
  module: m.module,
}));

export const osCourse: Course = {
  id: 'os',
  title: '操作系统',
  icon: 'memory',
  color: '#ff6348',
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.length,
  modulesMeta,
};
