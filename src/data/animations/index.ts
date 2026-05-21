import type { ComponentType } from 'react';
import type { MemoryBoxScenario } from '../../types';
import { variableStorageScenario } from './scenarios/variableStorage';
import MemoryBox from '../../components/animations/MemoryBox';

interface AnimationEntry {
  scenario: MemoryBoxScenario;
  Component: ComponentType<{ scenario: MemoryBoxScenario; step: number }>;
}

export const animationRegistry: Record<string, AnimationEntry> = {
  'variable-storage': {
    scenario: variableStorageScenario,
    Component: MemoryBox,
  },
};

export function getAnimScenario(animId: string): MemoryBoxScenario | undefined {
  return animationRegistry[animId]?.scenario;
}

export function getAnimComponent(
  animId: string,
): ComponentType<{ scenario: MemoryBoxScenario; step: number }> | null {
  return animationRegistry[animId]?.Component ?? null;
}
