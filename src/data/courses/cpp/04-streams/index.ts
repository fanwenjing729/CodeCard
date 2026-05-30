import type { CourseModule } from '@/types';
import { streamBasicsNode } from './stream-basics';
import { fileInputNode } from './file-input';
import { fileOutputNode } from './file-output';
import { stringStreamNode } from './string-stream';
import { streamStateNode } from './stream-state';
import { formattingNode } from './formatting';
import { capstoneProjectNode } from './capstone-project';

export const streamsModule: CourseModule = {
  moduleId: 'streams',
  module: '流与文件',
  nodes: [
    streamBasicsNode,
    fileInputNode,
    fileOutputNode,
    stringStreamNode,
    streamStateNode,
    formattingNode,
    capstoneProjectNode,
  ],
};
