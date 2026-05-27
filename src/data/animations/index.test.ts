import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/animations/MemoryBox', () => ({ default: () => null }));
vi.mock('@/components/animations/ScopeCodePlayer', () => ({ default: () => null }));
vi.mock('@/components/animations/BranchPlayer', () => ({ default: () => null }));
vi.mock('@/components/animations/LoopPlayer', () => ({ default: () => null }));
vi.mock('@/components/animations/BreakContinuePlayer', () => ({ default: () => null }));
vi.mock('@/components/animations/WhileDoWhilePlayer', () => ({ default: () => null }));
vi.mock('@/components/animations/ShallowDeepCopyPlayer', () => ({ default: () => null }));

import { getAnimScenario, getAnimComponent, animationRegistry } from './index';

describe('getAnimScenario', () => {
  it('returns scenario for known key', () => {
    const result = getAnimScenario('variable-storage');
    expect(result).toBeDefined();
    expect(result).toBe(animationRegistry['variable-storage']!.scenario);
  });

  it('returns undefined for unknown key', () => {
    expect(getAnimScenario('nonexistent')).toBeUndefined();
  });
});

describe('getAnimComponent', () => {
  it('returns component for known key', () => {
    const result = getAnimComponent('scope-lifecycle');
    expect(result).not.toBeNull();
    expect(typeof result).toBe('function');
  });

  it('returns null for unknown key', () => {
    expect(getAnimComponent('nonexistent')).toBeNull();
  });
});
