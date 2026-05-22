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
export type ModuleId = 'basics' | 'advanced' | 'oop' | 'stl' | 'generics' | 'modern';

export interface PathNode {
  id: string;
  courseId: string;
  type: 'knowledge' | 'quiz';
  moduleId: ModuleId;
  module: string;
  title: string;
  cards: Card[];
}

// ===== 卡片（判別联合） =====
export interface CardBase {
  id: string;
}

export interface ConceptCardData extends CardBase {
  cardType: 'concept';
  content: TextContent;
}

export interface CodeCardData extends CardBase {
  cardType: 'code';
  content: CodeContent;
}

export interface AnimationCardData extends CardBase {
  cardType: 'animation';
  content: AnimationContent;
}

export interface PracticeCardData extends CardBase {
  cardType: 'practice';
  content: PracticeContent;
}

export type Card = ConceptCardData | CodeCardData | AnimationCardData | PracticeCardData;

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

// ===== 动画基类 =====
export interface AnimScenario {
  id: string;
  title: string;
  totalSteps: number;
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

export interface MemoryBoxScenario extends AnimScenario {
  cellsPerRow: number;
  totalRows: number;
  steps: MemoryBoxStep[];
}

// ===== Lottie 动画专用 =====
export interface LottieScenario extends AnimScenario {
  lottieFile: string;
}

