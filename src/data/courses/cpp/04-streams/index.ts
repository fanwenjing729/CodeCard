import type { CourseModule } from '@/types';
import { streamBasicsNode } from './stream-basics';
import { fileInputNode } from './file-input';
import { fileOutputNode } from './file-output';
import { stringStreamNode } from './string-stream';
import { streamStateNode } from './stream-state';
import { binaryFileNode } from './binary-file';

export const streamsModule: CourseModule = {
  moduleId: 'streams',
  module: '流与文件',
  note: '可跳过',
  nodes: [
    streamBasicsNode,
    fileInputNode,
    fileOutputNode,
    stringStreamNode,
    streamStateNode,
    binaryFileNode,
  ],
};
