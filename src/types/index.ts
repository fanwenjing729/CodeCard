// ===== 学科层 =====
export interface Course {
  id: string;
  title: string;
  icon: string;
  color: string;
  nodes: PathNode[];
  prerequisites?: string[];
}

// ===== 学习路径节点 =====
export interface PathNode {
  id: string;
  courseId: string;
  type: 'knowledge' | 'quiz';
  chapter: string;
  title: string;
  cards: Card[];
}

// ===== 卡片 =====
export interface Card {
  id: string;
  cardType: 'concept' | 'code' | 'animation' | 'practice';
  content: TextContent | CodeContent | AnimationContent | PracticeContent;
}

export interface AnimationContent {
  animationId: string;
}

export interface PracticeContent {
  question: string;
  questionType: 'choice' | 'fill';
  options?: string[];
  answer: string;
  explanation: string;
}

export interface TextContent {
  title: string;
  body: string;
}

export interface CodeContent {
  title: string;
  code: string;
  language: string;
  highlights: number[];
}

// ===== MemoryBox 动画专用 =====
export interface VarAlloc {
  name: string;
  type: string;
  typeSize: number;
  value: string;
  color: string;
}

export interface MemoryBoxStep {
  label: string;
  allocations: VarAlloc[];
  showAddresses: boolean;
  annotation: string;
}

export interface MemoryBoxScenario {
  id: string;
  title: string;
  cellsPerRow: number;
  totalRows: number;
  steps: MemoryBoxStep[];
}

