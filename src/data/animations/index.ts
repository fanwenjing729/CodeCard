import type { ComponentType } from 'react';
import type { AnimScenario } from '@/types';
import { variableStorageScenario } from './scenarios/variableStorage';
import { scopeLifecycleScenario } from './scenarios/scopeLifecycle';
import { ifElseBranchScenario } from './scenarios/ifElseBranch';
import { ifElseIfLadderScenario } from './scenarios/ifElseIfLadder';
import { switchFallthroughScenario } from './scenarios/switchFallthrough';
import { forLoopScenario } from './scenarios/forLoop';
import { breakContinueScenario } from './scenarios/breakContinue';
import { whileDoWhileScenario } from './scenarios/whileDoWhile';
import { arrayMemoryScenario } from './scenarios/arrayMemory';
import { array2dMemoryScenario } from './scenarios/array2dMemory';
import { pointerIntroScenario } from './scenarios/pointerIntro';
import { dynamicMemoryScenario } from './scenarios/dynamicMemory';
import MemoryBox from '@/components/animations/MemoryBox';
import ScopeCodePlayer from '@/components/animations/ScopeCodePlayer';
import BranchPlayer from '@/components/animations/BranchPlayer';
import LoopPlayer from '@/components/animations/LoopPlayer';
import BreakContinuePlayer from '@/components/animations/BreakContinuePlayer';
import WhileDoWhilePlayer from '@/components/animations/WhileDoWhilePlayer';
// Lottie 示例（取消注释并放入 lottie JSON 文件后即可用）:
// import { lottieLoopFlow } from './scenarios/lottieLoopFlow';
// import LottiePlayer from '@/components/animations/LottiePlayer';

interface AnimationEntry {
  scenario: AnimScenario;
  Component: ComponentType<{ scenario: AnimScenario; step: number }>;
}

export const animationRegistry: Record<string, AnimationEntry> = {
  'scope-lifecycle': {
    scenario: scopeLifecycleScenario,
    Component: ScopeCodePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'variable-storage': {
    scenario: variableStorageScenario,
    Component: MemoryBox as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'if-else-branch': {
    scenario: ifElseBranchScenario,
    Component: BranchPlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'if-else-if-ladder': {
    scenario: ifElseIfLadderScenario,
    Component: BranchPlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'switch-fallthrough': {
    scenario: switchFallthroughScenario,
    Component: BranchPlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'for-loop': {
    scenario: forLoopScenario,
    Component: LoopPlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'break-continue': {
    scenario: breakContinueScenario,
    Component: BreakContinuePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'while-vs-dowhile': {
    scenario: whileDoWhileScenario,
    Component: WhileDoWhilePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'array-memory': {
    scenario: arrayMemoryScenario,
    Component: ScopeCodePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'array-2d-memory': {
    scenario: array2dMemoryScenario,
    Component: ScopeCodePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'pointer-intro': {
    scenario: pointerIntroScenario,
    Component: ScopeCodePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  'dynamic-memory': {
    scenario: dynamicMemoryScenario,
    Component: ScopeCodePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  },
  // Lottie 注册示例:
  // 'loop-flow': {
  //   scenario: lottieLoopFlow,
  //   Component: LottiePlayer as ComponentType<{ scenario: AnimScenario; step: number }>,
  // },
};

export function getAnimScenario(animId: string): AnimScenario | undefined {
  return animationRegistry[animId]?.scenario;
}

export function getAnimComponent(
  animId: string,
): ComponentType<{ scenario: AnimScenario; step: number }> | null {
  return animationRegistry[animId]?.Component ?? null;
}
