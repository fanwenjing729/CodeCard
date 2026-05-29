import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { createElement, act } from 'react';
import TestRenderer from 'react-test-renderer';

// ─── Mock layer ───────────────────────────────────────────

const { store } = vi.hoisted(() => ({
  store: {
    rewardCard: vi.fn().mockReturnValue(true),
    setNodePosition: vi.fn(),
    addWrongCard: vi.fn(),
    removeWrongCard: vi.fn(),
  },
}));

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: function (selector: any) {
    return selector ? selector(store) : store;
  },
  XP_PER_CARD: 5,
  XP_PER_PRACTICE: 10,
}));

vi.mock('@/data/animations', () => ({
  getAnimScenario: vi.fn(function (id: string) {
    if (id === 'test-anim') return { id: 'test-anim', totalSteps: 3, continuous: false };
    if (id === 'test-anim-continuous') return { id: 'test-anim-continuous', totalSteps: 1, continuous: true };
    return undefined;
  }),
}));

import { useNodeScreen } from './useNodeScreen';

// ─── Minimal renderHook ───────────────────────────────────

function renderHook<P, R>(
  useHook: (props: P) => R,
  initialProps: P,
) {
  const result = { current: undefined as any as R };
  let renderer: TestRenderer.ReactTestRenderer;

  function TestComponent(props: P) {
    result.current = useHook(props);
    return null;
  }

  act(() => {
    renderer = TestRenderer.create(createElement(TestComponent as any, initialProps as any));
  });

  return {
    result,
    unmount: () => {
      act(() => {
        renderer!.unmount();
      });
    },
    rerender: (newProps: P) => {
      act(() => {
        renderer!.update(createElement(TestComponent as any, newProps as any));
      });
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────

const navigation = { goBack: vi.fn() };

interface TestCard {
  id: string;
  cardType: 'concept' | 'animation';
  content: { title: string; animationId?: string };
}

function makeCards(n: number): TestCard[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `card-${i}`,
    cardType: 'concept' as const,
    content: { title: `Card ${i}` },
  }));
}

function makeAnimCards(n: number, animationId: string): TestCard[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i === 0 ? `anim-card-${i}` : `card-${i}`,
    cardType: (i === 0 ? 'animation' : 'concept') as 'animation' | 'concept',
    content: i === 0 ? { title: 'Anim', animationId } : { title: `Card ${i}` },
  }));
}

function render(cards: TestCard[], savedIndex = 0) {
  return renderHook(
    (p) => useNodeScreen({
      courseId: p.courseId,
      nodeId: p.nodeId,
      cards: p.cards as any,
      savedIndex: p.savedIndex,
      navigation: p.nav,
    }),
    { courseId: 'test-course', nodeId: 'node-1', cards, savedIndex, nav: navigation },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── 1. 初始 index ──────────────────────────────────────────

describe('initial index', () => {
  it('sets index from savedIndex within bounds', () => {
    const { result } = render(makeCards(5), 2);
    expect(result.current.index).toBe(2);
  });

  it('clamps savedIndex to cards.length - 1 when out of range', () => {
    const { result } = render(makeCards(3), 10);
    expect(result.current.index).toBe(2);
  });
});

// ─── 2. advance ─────────────────────────────────────────────

describe('advance', () => {
  it('rewards card with XP_PER_CARD and moves to next index', () => {
    const { result } = render(makeCards(3), 0);

    act(() => {
      result.current.advance();
    });

    expect(store.rewardCard).toHaveBeenCalledWith('test-course', 'card-0', 5);
    expect(result.current.index).toBe(1);
  });

  it('calls goBack on the last card', () => {
    const { result } = render(makeCards(3), 2);

    act(() => {
      result.current.advance();
    });

    expect(store.rewardCard).toHaveBeenCalledWith('test-course', 'card-2', 5);
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('increments animStep on non-continuous animation (not last step)', () => {
    const { result } = render(makeAnimCards(3, 'test-anim'), 0);

    expect(result.current.animStep).toBe(0);

    act(() => {
      result.current.advance();
    });

    expect(result.current.animStep).toBe(1);
    expect(store.rewardCard).not.toHaveBeenCalled();
    expect(result.current.index).toBe(0);
  });

  it('rewards card and advances index on last animation step', () => {
    const { result } = render(makeAnimCards(2, 'test-anim'), 0);

    act(() => { result.current.advance(); }); // step 0→1
    act(() => { result.current.advance(); }); // step 1→2
    expect(result.current.animStep).toBe(2);

    act(() => { result.current.advance(); }); // last step → complete

    expect(store.rewardCard).toHaveBeenCalledWith('test-course', 'anim-card-0', 5);
    expect(result.current.index).toBe(1);
  });

  it('completes continuous animation in one advance', () => {
    const { result } = render(makeAnimCards(2, 'test-anim-continuous'), 0);

    act(() => {
      result.current.advance();
    });

    expect(store.rewardCard).toHaveBeenCalledWith('test-course', 'anim-card-0', 5);
    expect(result.current.index).toBe(1);
  });
});

// ─── 3. previous ────────────────────────────────────────────

describe('previous', () => {
  it('moves to previous index and saves position', () => {
    const { result } = render(makeCards(5), 2);

    act(() => {
      result.current.previous();
    });

    expect(result.current.index).toBe(1);
    expect(store.setNodePosition).toHaveBeenCalledWith('test-course', 'node-1', 1);
  });

  it('does nothing when at index 0', () => {
    const { result } = render(makeCards(3), 0);

    act(() => {
      result.current.previous();
    });

    expect(result.current.index).toBe(0);
  });
});

// ─── 4. handlePracticeComplete ──────────────────────────────

describe('handlePracticeComplete', () => {
  it('calls rewardCard + removeWrongCard on correct answer', () => {
    const { result } = render(makeCards(3), 0);

    act(() => {
      result.current.handlePracticeComplete(true);
    });

    expect(store.rewardCard).toHaveBeenCalledWith('test-course', 'card-0', 10);
    expect(store.removeWrongCard).toHaveBeenCalledWith('test-course', 'card-0');
    expect(store.addWrongCard).not.toHaveBeenCalled();
  });

  it('calls addWrongCard on wrong answer, no reward', () => {
    const { result } = render(makeCards(3), 0);

    act(() => {
      result.current.handlePracticeComplete(false);
    });

    expect(store.addWrongCard).toHaveBeenCalledWith('test-course', 'card-0');
    expect(store.rewardCard).not.toHaveBeenCalled();
    expect(store.removeWrongCard).not.toHaveBeenCalled();
  });

  it('uses cardRef to read current card id after advance', () => {
    const { result } = render(makeCards(3), 0);

    act(() => {
      result.current.advance(); // moves to card-1
    });
    vi.clearAllMocks();

    act(() => {
      result.current.handlePracticeComplete(true);
    });

    expect(store.rewardCard).toHaveBeenCalledWith('test-course', 'card-1', 10);
  });
});

// ─── 5. unmount ─────────────────────────────────────────────

describe('unmount', () => {
  it('saves node position on unmount', () => {
    const { result, unmount } = render(makeCards(5), 3);

    act(() => {
      result.current.advance();
    });

    unmount();

    expect(store.setNodePosition).toHaveBeenCalledWith('test-course', 'node-1', 4);
  });
});
