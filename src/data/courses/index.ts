import type { Course } from '@/types';
import { cppCourse } from './cpp';
import { dsCourse } from './ds';
import { coCourse } from './co';
import { cnCourse } from './cn';
import { osCourse } from './os';

export const courses: Course[] = [cppCourse, dsCourse, coCourse, cnCourse, osCourse];
