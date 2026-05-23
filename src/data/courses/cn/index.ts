import type { Course } from '@/types';
import type { CourseModule } from '@/types';
import { foundationModule } from './01-foundation';
import { datalinkModule } from './02-datalink';
import { networkModule } from './03-network';
import { transportModule } from './04-transport';
import { applicationModule } from './05-application';
import { securityModule } from './06-security';

const modules: CourseModule[] = [foundationModule, datalinkModule, networkModule, transportModule, applicationModule, securityModule];

export const cnCourse: Course = {
  id: 'cn',
  title: '计算机网络',
  icon: 'access-point-network',
  color: '#a55eea',
  nodes: modules.flatMap(m => m.nodes),
  moduleCount: modules.filter(m => m.nodes.length > 0).length,
};
