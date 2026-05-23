import type { ComponentType } from 'react';
import type { AnimScenario } from '@/types';
import { variableStorageScenario } from './scenarios/variableStorage';
import { scopeLifecycleScenario } from './scenarios/scopeLifecycle';
import MemoryBox from '@/components/animations/MemoryBox';
import ScopeCodePlayer from '@/components/animations/ScopeCodePlayer';
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
