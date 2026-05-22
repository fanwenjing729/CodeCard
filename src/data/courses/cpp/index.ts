import type { Course } from '@/types';
import { basicsNodes } from './01-basics';
import { advancedNodes } from './02-advanced';
import { oopNodes } from './03-oop';
import { stlNodes } from './04-stl';
import { genericsNodes } from './05-generics';
import { modernNodes } from './06-modern';

export const cppCourse: Course = {
  id: 'cpp',
  title: 'C++',
  icon: 'language-cpp',
  color: '#4a9eff',
  nodes: [
    ...basicsNodes,
    ...advancedNodes,
    ...oopNodes,
    ...stlNodes,
    ...genericsNodes,
    ...modernNodes,
  ],
};
