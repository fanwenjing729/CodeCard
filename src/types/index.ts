// ===== 学科层 =====
export interface CourseModule {
  moduleId: string;
  nodes: PathNode[];
}

export interface Course {
  id: string;
  title: string;
  icon: string;
  color: string;
  nodes: PathNode[];
  moduleCount: number;
  prerequisites?: string[];
}

// ===== 学习路径节点 =====
export type ModuleId = string;

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

// ===== ScopeCode 动画专用 =====
export interface ScopeCodeStep {
  label: string;
  highlightLines: number[];
  allocations: VarAlloc[];
  annotation: string;
}

export interface ScopeCodeScenario extends AnimScenario {
  sourceCode: string;
  cellsPerRow: number;
  totalRows: number;
  steps: ScopeCodeStep[];
}

// ===== Loop 动画专用 =====
export interface LoopStep {
  label: string;
  highlightLines: number[];  // for 行
  bodyLines: number[];       // 循环体行
  iteration: number;         // 0=init, 1..n=第N轮, -1=跳出
  entered: boolean;          // 本轮是否进入循环体
  annotation: string;
}

export interface LoopScenario extends AnimScenario {
  sourceCode: string;
  steps: LoopStep[];
}

// ===== Branch 动画专用 =====
export interface BranchStep {
  label: string;
  highlightLines: number[];  // 条件行 / switch 行
  takenLines: number[];      // 本次执行的行（绿色高亮）
  skippedLines: number[];    // 本次跳过的行（灰色）
  annotation: string;
}

export interface BranchScenario extends AnimScenario {
  sourceCode: string;
  steps: BranchStep[];
}

// ===== Lottie 动画专用 =====
export interface LottieScenario extends AnimScenario {
  lottieFile: string;
}

