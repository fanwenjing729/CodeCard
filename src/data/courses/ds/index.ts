import type { Course, CourseModule, ModuleMeta } from '@/types';
import { linearModule } from './01-linear';
import { treeModule } from './02-tree';
import { graphModule } from './03-graph';
import { searchModule } from './04-search';
import { sortModule } from './05-sort';
import { advancedModule } from './06-advanced';

const modules: CourseModule[] = [linearModule, treeModule, graphModule, searchModule, sortModule, advancedModule];

const modulesMeta: ModuleMeta[] = modules.map(m => ({
  moduleId: m.moduleId,
  module: m.module,
}));

export const dsCourse: Course = {
  id: 'ds',
  title: '数据结构',
  icon: 'file-tree',
  color: '#2ed573',
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.length,
  modulesMeta,
};
