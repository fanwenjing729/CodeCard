import type { Course, CourseModule, ModuleMeta } from '@/types';
import { basicsModule } from './01-basics';
import { advancedModule } from './02-advanced';
import { oopModule } from './03-oop';
import { streamsModule } from './04-streams';
import { stlModule } from './05-stl';
import { genericsModule } from './06-generics';
import { modernModule } from './07-modern';
import { engineeringModule } from './08-engineering';

const modules: CourseModule[] = [
  basicsModule,
  advancedModule,
  oopModule,
  streamsModule,
  stlModule,
  genericsModule,
  modernModule,
  engineeringModule,
];

const modulesMeta: ModuleMeta[] = modules.map(m => ({
  moduleId: m.moduleId,
  module: m.module,
  ...(m.note ? { note: m.note } : {}),
}));

export const cppCourse: Course = {
  id: 'cpp',
  title: 'C++',
  icon: 'language-cpp',
  color: '#4a9eff',
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.filter(m => m.nodes.length > 0).length,
  modulesMeta,
};
