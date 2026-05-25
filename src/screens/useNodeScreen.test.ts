import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-native';
import type { Card } from '@/types';

const mockRewardCard = vi.fn();
const mockSetNodePosition = vi.fn();
const mockAddWrongCard = vi.fn();
const mockRemoveWrongCard = vi.fn();

const mockState = {
  rewardCard: mockRewardCard,
  setNodePosition: mockSetNodePosition,
  addWrongCard: mockAddWrongCard,
  removeWrongCard: mockRemoveWrongCard,
};

const useProgressStoreMock = Object.assign(
  (selector?: (s: typeof mockState) => any) => {
    if (typeof selector === 'function') return selector(mockState);
    return mockState;
  },
  { getState: () => mockState },
);

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: useProgressStoreMock,
  XP_PER_CARD: 5,
  XP_PER_PRACTICE: 10,
}));

vi.mock('@/data/animations', () => ({
  getAnimScenario: vi.fn((id: string) => {
    if (id === 'test-anim') return { id: 'test-anim', title: 'T', totalSteps: 3 };
    return undefined;
  }),
}));

import { useNodeScreen } from './useNodeScreen';

function makeCards(count: number): Card[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `c${i + 1}`,
    cardType: 'concept' as const,
    content: { title: `Card ${i + 1}`, body: `Body ${i + 1}` },
  }));
}

function makeNav() {
  return { goBack: vi.fn() };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── initial state ─────────────────────────────────────────
describe('initial state', () => {
  it('selects card at savedIndex', () => {
    const cards = makeCards(5);
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 2, navigation: makeNav() }),
    );
    expect(result.current.index).toBe(2);
    expect(result.current.card?.id).toBe('c3');
  });

  it('clamps savedIndex to valid range (too high)', () => {
    const cards = makeCards(3);
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 10, navigation: makeNav() }),
    );
    expect(result.current.index).toBe(2);
  });

  it('starts at index 0 when savedIndex is 0', () => {
    const cards = makeCards(3);
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );
    expect(result.current.index).toBe(0);
    expect(result.current.card?.id).toBe('c1');
  });

  it('isLast is true when only one card', () => {
    const cards = makeCards(1);
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );
    expect(result.current.isLast).toBe(true);
  });
});

// ─── advance (normal card) ─────────────────────────────────
describe('advance', () => {
  it('moves to next card and rewards current card', () => {
    const cards = makeCards(3);
    const nav = makeNav();
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: nav }),
    );

    act(() => { result.current.advance(); });

    expect(result.current.index).toBe(1);
    expect(result.current.card?.id).toBe('c2');
    expect(mockRewardCard).toHaveBeenCalledWith('cpp', 'c1', 5);
    expect(mockSetNodePosition).toHaveBeenCalledWith('cpp', 'n1', 1);
    expect(nav.goBack).not.toHaveBeenCalled();
  });

  it('navigates back when advancing from last card', () => {
    const cards = makeCards(1);
    const nav = makeNav();
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: nav }),
    );

    act(() => { result.current.advance(); });

    expect(mockRewardCard).toHaveBeenCalledWith('cpp', 'c1', 5);
    expect(mockSetNodePosition).toHaveBeenCalledWith('cpp', 'n1', 0);
    expect(nav.goBack).toHaveBeenCalled();
  });
});

// ─── advance (animation card) ──────────────────────────────
describe('advance with animation', () => {
  function makeAnimCards(): Card[] {
    return [
      {
        id: 'anim-c1',
        cardType: 'animation' as const,
        content: { animationId: 'test-anim' },
      },
      {
        id: 'c2',
        cardType: 'concept' as const,
        content: { title: 'Next', body: 'Next card' },
      },
    ];
  }

  it('steps through animation before advancing', () => {
    const cards = makeAnimCards();
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );

    expect(result.current.animStep).toBe(0);

    act(() => { result.current.advance(); });
    expect(result.current.animStep).toBe(1);
    expect(mockRewardCard).not.toHaveBeenCalled(); // not yet advanced

    act(() => { result.current.advance(); });
    expect(result.current.animStep).toBe(2);

    act(() => { result.current.advance(); }); // last animation step → advances card
    expect(result.current.animStep).toBe(0); // reset for next card
    expect(result.current.index).toBe(1);
    expect(mockRewardCard).toHaveBeenCalledWith('cpp', 'anim-c1', 5);
  });
});

// ─── previous ──────────────────────────────────────────────
describe('previous', () => {
  it('moves to previous card and saves position', () => {
    const cards = makeCards(5);
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 2, navigation: makeNav() }),
    );

    act(() => { result.current.previous(); });

    expect(result.current.index).toBe(1);
    expect(result.current.card?.id).toBe('c2');
    expect(mockSetNodePosition).toHaveBeenCalledWith('cpp', 'n1', 1);
  });

  it('does not go below index 0', () => {
    const cards = makeCards(3);
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );

    act(() => { result.current.previous(); });

    expect(result.current.index).toBe(0);
  });
});

// ─── handlePracticeComplete ────────────────────────────────
describe('handlePracticeComplete', () => {
  function makePracticeCard(): Card[] {
    return [
      {
        id: 'p1',
        cardType: 'practice' as const,
        content: {
          question: 'Q?',
          questionType: 'choice' as const,
          options: ['A', 'B'],
          answer: 'A',
          explanation: '...',
        },
      },
    ];
  }

  it('rewards card and removes wrong on correct', () => {
    const cards = makePracticeCard();
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );

    act(() => { result.current.handlePracticeComplete(true); });

    expect(mockRewardCard).toHaveBeenCalledWith('cpp', 'p1', 10);
    expect(mockRemoveWrongCard).toHaveBeenCalledWith('cpp', 'p1');
    expect(mockAddWrongCard).not.toHaveBeenCalled();
  });

  it('adds wrong on incorrect', () => {
    const cards = makePracticeCard();
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );

    act(() => { result.current.handlePracticeComplete(false); });

    expect(mockAddWrongCard).toHaveBeenCalledWith('cpp', 'p1');
    expect(mockRewardCard).not.toHaveBeenCalled();
    expect(mockRemoveWrongCard).not.toHaveBeenCalled();
  });
});

// ─── handlePracticeNext ────────────────────────────────────
describe('handlePracticeNext', () => {
  function makePracticeCards(): Card[] {
    return [
      {
        id: 'p1',
        cardType: 'practice' as const,
        content: { question: 'Q1?', questionType: 'choice' as const, options: ['A'], answer: 'A', explanation: '.' },
      },
      {
        id: 'p2',
        cardType: 'practice' as const,
        content: { question: 'Q2?', questionType: 'fill' as const, answer: 'x', explanation: '.' },
      },
    ];
  }

  it('advances to next card without rewarding', () => {
    const cards = makePracticeCards();
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );

    act(() => { result.current.handlePracticeNext(); });

    expect(result.current.index).toBe(1);
    expect(mockRewardCard).not.toHaveBeenCalled();
    expect(mockSetNodePosition).toHaveBeenCalledWith('cpp', 'n1', 1);
  });

  it('navigates back on last practice card', () => {
    const cards = makePracticeCards();
    const nav = makeNav();
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 1, navigation: nav }),
    );

    act(() => { result.current.handlePracticeNext(); });

    expect(mockSetNodePosition).toHaveBeenCalledWith('cpp', 'n1', 1);
    expect(nav.goBack).toHaveBeenCalled();
  });
});

// ─── position save on unmount ──────────────────────────────
describe('position save on unmount', () => {
  it('saves current position when unmounting', () => {
    const cards = makeCards(5);
    const { result, unmount } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );

    act(() => { result.current.advance(); });
    act(() => { result.current.advance(); });
    expect(result.current.index).toBe(2);

    unmount();

    expect(mockSetNodePosition).toHaveBeenLastCalledWith('cpp', 'n1', 2);
  });
});

// ─── animStep resets on card change ────────────────────────
describe('animStep reset', () => {
  it('resets animStep to 0 when card changes', () => {
    const cards: Card[] = [
      {
        id: 'anim-1',
        cardType: 'animation' as const,
        content: { animationId: 'test-anim' },
      },
      {
        id: 'anim-2',
        cardType: 'animation' as const,
        content: { animationId: 'test-anim' },
      },
    ];
    const { result } = renderHook(() =>
      useNodeScreen({ courseId: 'cpp', nodeId: 'n1', cards, savedIndex: 0, navigation: makeNav() }),
    );

    act(() => { result.current.advance(); });
    act(() => { result.current.advance(); });
    expect(result.current.animStep).toBe(2);

    act(() => { result.current.advance(); }); // final step → advances
    expect(result.current.index).toBe(1);
    expect(result.current.animStep).toBe(0);
  });
});
