import type { Course } from '@/types';
import type { CourseModule } from '@/types';
import { isaModule } from './01-isa';
import { arithmeticModule } from './02-arithmetic';
import { memoryModule } from './03-memory';
import { processorModule } from './04-processor';
import { ioModule } from './05-io';
import { pipelineModule } from './06-pipeline';

const modules: CourseModule[] = [isaModule, arithmeticModule, memoryModule, processorModule, ioModule, pipelineModule];

export const coCourse: Course = {
  id: 'co',
  title: '计算机组成原理',
  icon: 'chip',
  color: '#ff9f43',
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.filter(m => m.nodes.length > 0).length,
};
