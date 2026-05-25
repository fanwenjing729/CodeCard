import type { Course, CourseModule, ModuleMeta } from '@/types';
import { basicsModule } from './01-basics';
import { advancedModule } from './02-advanced';
import { streamsModule } from './03-streams';
import { oopModule } from './04-oop';
import { stlModule } from './05-stl';
import { genericsModule } from './06-generics';
import { modernModule } from './07-modern';

const modules: CourseModule[] = [
  basicsModule,
  advancedModule,
  streamsModule,
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
