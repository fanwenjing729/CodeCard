import type { Course } from '@/types';
import { foundationNodes } from './01-foundation';
import { datalinkNodes } from './02-datalink';
import { networkNodes } from './03-network';
import { transportNodes } from './04-transport';
import { applicationNodes } from './05-application';
import { securityNodes } from './06-security';

export const cnCourse: Course = {
  id: 'cn',
  title: '计算机网络',
  icon: 'access-point-network',
  color: '#a55eea',
  nodes: [
    ...foundationNodes,
    ...datalinkNodes,
    ...networkNodes,
    ...transportNodes,
    ...applicationNodes,
    ...securityNodes,
  ],
};
