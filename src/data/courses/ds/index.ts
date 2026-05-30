import type { Course, CourseModule, ModuleMeta } from '@/types';
import { introModule } from './01-intro';

const modules: CourseModule[] = [introModule];

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
