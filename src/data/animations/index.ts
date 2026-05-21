import type { ComponentType } from 'react';
import type { MemoryBoxScenario } from '../../types';
import { variableStorageScenario } from './scenarios/variableStorage';

interface AnimationEntry {
  scenario: MemoryBoxScenario;
  Component: ComponentType<{ scenario: MemoryBoxScenario; step: number }> | null;
  loadComponent: () => void;
}

export const animationRegistry: Record<string, AnimationEntry> = {
  'variable-storage': {
    scenario: variableStorageScenario,
    Component: null,
    loadComponent() {
      if (!this.Component) {
        this.Component = require('../../components/animations/MemoryBox').default;
      }
    },
  },
};

export function getAnimScenario(animId: string): MemoryBoxScenario | undefined {
  return animationRegistry[animId]?.scenario;
}

export function getAnimComponent(
  animId: string,
): ComponentType<{ scenario: MemoryBoxScenario; step: number }> | null {
  const entry = animationRegistry[animId];
  if (!entry) return null;
  if (!entry.Component) entry.loadComponent();
  return entry.Component;
}
