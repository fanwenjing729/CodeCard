import type { Course, CourseModule, ModuleMeta } from '@/types';
import { basicsModule } from './01-basics';
import { advancedModule } from './02-advanced';
import { oopModule } from './03-oop';
import { stlModule } from './04-stl';
import { genericsModule } from './05-generics';
import { modernModule } from './06-modern';

const modules: CourseModule[] = [
  basicsModule,
  advancedModule,
  oopModule,
  stlModule,
  genericsModule,
  modernModule,
];

const modulesMeta: ModuleMeta[] = modules.map(m => ({
  moduleId: m.moduleId,
  module: m.module,
}));

export const cppCourse: Course = {
  id: 'cpp',
  title: 'C++',
  icon: 'language-cpp',
  color: '#4a9eff',
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.length,
  modulesMeta,
};
