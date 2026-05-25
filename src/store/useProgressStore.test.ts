import { describe, it, expect, vi, beforeEach } from 'vitest';

// 用内存对象模拟 AsyncStorage，get/set 读写同一份数据
let store: Record<string, string> = {};

vi.mock('react-native', () => ({
  AppState: {
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
  },
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(store[key] ?? null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
  },
}));

import { useProgressStore, XP_PER_CARD, XP_PER_PRACTICE } from './useProgressStore';

const FRESH_STATE = {
  version: 3,
  global: { totalXP: 0, level: 1 },
  courses: {} as Record<string, any>,
  hydrated: false,
};

beforeEach(() => {
  useProgressStore.setState(FRESH_STATE);
  store = {};
});

function getState() {
  return useProgressStore.getState();
}

// ─── addXP ────────────────────────────────────────────────

describe('addXP', () => {
  it('adds XP to course and global, recalculates level', () => {
    getState().addXP('cpp', 50);

    const s = getState();
    expect(s.global.totalXP).toBe(50);
    expect(s.courses['cpp'].xp).toBe(50);
    expect(s.global.level).toBe(1); // 50 < 100, still level 1
  });

  it('levels up when XP crosses threshold', () => {
    const s = getState();
    s.addXP('cpp', 100); // hits exactly 100 → level 2

    const s2 = getState();
    expect(s2.global.totalXP).toBe(100);
    expect(s2.global.level).toBe(2);
  });

  it('lazy-creates CourseProgress for new courses', () => {
    getState().addXP('ds', 10);

    const s = getState();
    expect(s.courses['ds']).toBeDefined();
    expect(s.courses['ds'].xp).toBe(10);
    expect(s.courses['ds'].completedCards).toEqual({});
    expect(s.courses['ds'].wrongCards).toEqual({});
  });

  it('accumulates XP across multiple calls', () => {
    const s = getState();
    s.addXP('cpp', 30);
    s.addXP('cpp', 70);

    const s2 = getState();
    expect(s2.global.totalXP).toBe(100);
    expect(s2.courses['cpp'].xp).toBe(100);
    expect(s2.global.level).toBe(2);
  });
});

// ─── rewardCard ───────────────────────────────────────────

describe('rewardCard', () => {
  it('returns true on first completion, adds XP and marks card', () => {
    const result = getState().rewardCard('cpp', 'basics-hello-c1', XP_PER_CARD);

    expect(result).toBe(true);
    const s = getState();
    expect(s.global.totalXP).toBe(XP_PER_CARD);
    expect(s.courses['cpp'].completedCards['basics-hello-c1']).toBe(true);
    expect(s.courses['cpp'].xp).toBe(XP_PER_CARD);
  });

  it('returns false on duplicate, XP unchanged', () => {
    const s = getState();
    s.rewardCard('cpp', 'basics-hello-c1', XP_PER_CARD);
    const xpAfterFirst = getState().global.totalXP;

    const result = s.rewardCard('cpp', 'basics-hello-c1', XP_PER_CARD);

    expect(result).toBe(false);
    expect(getState().global.totalXP).toBe(xpAfterFirst);
  });

  it('handles multiple different cards', () => {
    const s = getState();
    s.rewardCard('cpp', 'card-a', XP_PER_CARD);
    s.rewardCard('cpp', 'card-b', XP_PER_CARD);

    const s2 = getState();
    expect(s2.global.totalXP).toBe(XP_PER_CARD * 2);
    expect(Object.keys(s2.courses['cpp'].completedCards)).toHaveLength(2);
  });

  it('uses xpAmount from call site, not XP_PER_CARD constant', () => {
    getState().rewardCard('cpp', 'quiz-card', XP_PER_PRACTICE);

    const s = getState();
    expect(s.global.totalXP).toBe(XP_PER_PRACTICE);
    expect(s.courses['cpp'].xp).toBe(XP_PER_PRACTICE);
  });
});

// ─── saveQuizScore ────────────────────────────────────────

describe('saveQuizScore', () => {
  it('saves quiz score for a node', () => {
    getState().saveQuizScore('cpp', 'quiz-1', 80);

    expect(getState().courses['cpp'].quizScores['quiz-1']).toBe(80);
  });

  it('overwrites previous score', () => {
    const s = getState();
    s.saveQuizScore('cpp', 'quiz-1', 60);
    s.saveQuizScore('cpp', 'quiz-1', 90);

    expect(getState().courses['cpp'].quizScores['quiz-1']).toBe(90);
  });

  it('does not affect XP', () => {
    const s = getState();
    s.addXP('cpp', 50);
    s.saveQuizScore('cpp', 'quiz-1', 100);

    expect(getState().global.totalXP).toBe(50);
  });
});

// ─── setNodePosition ──────────────────────────────────────

describe('setNodePosition', () => {
  it('saves card index for a node', () => {
    getState().setNodePosition('cpp', 'node-1', 3);

    expect(getState().courses['cpp'].nodePositions['node-1']).toBe(3);
  });

  it('overwrites previous position', () => {
    const s = getState();
    s.setNodePosition('cpp', 'node-1', 2);
    s.setNodePosition('cpp', 'node-1', 5);

    expect(getState().courses['cpp'].nodePositions['node-1']).toBe(5);
  });
});

// ─── wrongCards ───────────────────────────────────────────

describe('addWrongCard', () => {
  it('adds card to wrongCards', () => {
    getState().addWrongCard('cpp', 'wrong-1');

    expect(getState().courses['cpp'].wrongCards['wrong-1']).toBe(true);
  });

  it('is idempotent — duplicate add does not create extra entries', () => {
    const s = getState();
    s.addWrongCard('cpp', 'wrong-1');
    s.addWrongCard('cpp', 'wrong-1');

    expect(Object.keys(getState().courses['cpp'].wrongCards)).toHaveLength(1);
  });

  it('lazy-creates CourseProgress for new courses', () => {
    getState().addWrongCard('ds', 'wrong-1');

    expect(getState().courses['ds'].wrongCards['wrong-1']).toBe(true);
  });
});

describe('removeWrongCard', () => {
  it('removes card from wrongCards', () => {
    const s = getState();
    s.addWrongCard('cpp', 'wrong-1');
    s.removeWrongCard('cpp', 'wrong-1');

    expect(getState().courses['cpp'].wrongCards['wrong-1']).toBeUndefined();
  });

  it('silently ignores non-existent card', () => {
    expect(() => getState().removeWrongCard('cpp', 'nonexistent')).not.toThrow();
  });

  it('silently ignores non-existent course', () => {
    expect(() => getState().removeWrongCard('no-course', 'any')).not.toThrow();
  });
});

// ─── removeCompletedCards ──────────────────────────────────

describe('removeCompletedCards', () => {
  it('removes specified cards from completedCards and wrongCards', () => {
    const s = getState();
    s.rewardCard('cpp', 'c1', XP_PER_CARD);
    s.rewardCard('cpp', 'c2', XP_PER_CARD);
    s.rewardCard('cpp', 'c3', XP_PER_CARD);
    s.addWrongCard('cpp', 'c1');
    s.addWrongCard('cpp', 'c2');

    s.removeCompletedCards('cpp', ['c1', 'c2'], XP_PER_CARD * 2);

    const c = getState().courses['cpp'];
    expect(c.completedCards['c3']).toBe(true);        // untouched
    expect(c.completedCards['c1']).toBeUndefined();    // removed
    expect(c.completedCards['c2']).toBeUndefined();    // removed
    expect(c.wrongCards['c1']).toBeUndefined();        // removed
    expect(c.wrongCards['c2']).toBeUndefined();        // removed
  });

  it('deducts XP from course and global, recalculates level', () => {
    const s = getState();
    s.addXP('cpp', 200); // 200 XP → level 3 (0–99=1, 100–199=2, 200–299=3)
    expect(getState().global.level).toBe(3);

    s.rewardCard('cpp', 'c1', XP_PER_CARD);  // +5  → 205
    s.rewardCard('cpp', 'c2', XP_PER_CARD);  // +5  → 210

    s.removeCompletedCards('cpp', ['c1', 'c2'], XP_PER_CARD * 2); // -10 → 200

    const s2 = getState();
    expect(s2.courses['cpp'].xp).toBe(200);
    expect(s2.global.totalXP).toBe(200);
    expect(s2.global.level).toBe(3); // still 200, still level 3
  });

  it('does not let XP go below zero', () => {
    const s = getState();
    s.rewardCard('cpp', 'c1', XP_PER_CARD);

    // Subtract more XP than exists
    s.removeCompletedCards('cpp', ['c1'], 999);

    const s2 = getState();
    expect(s2.courses['cpp'].xp).toBe(0);
    expect(s2.global.totalXP).toBe(0);
  });

  it('is a no-op when cardIds is empty', () => {
    const s = getState();
    s.addXP('cpp', 100);
    const xpBefore = getState().global.totalXP;

    s.removeCompletedCards('cpp', [], 50);

    expect(getState().global.totalXP).toBe(xpBefore);
  });

  it('does not affect other courses', () => {
    const s = getState();
    s.rewardCard('cpp', 'c1', XP_PER_CARD);
    s.rewardCard('ds', 'd1', XP_PER_CARD);

    s.removeCompletedCards('cpp', ['c1'], XP_PER_CARD);

    expect(getState().courses['ds'].completedCards['d1']).toBe(true);
    expect(getState().courses['ds'].xp).toBe(XP_PER_CARD);
  });
});

// ─── resetCourse ──────────────────────────────────────────

describe('resetCourse', () => {
  it('resets course to initial state', () => {
    const s = getState();
    s.addXP('cpp', 100);
    s.rewardCard('cpp', 'card-1', XP_PER_CARD);
    s.addWrongCard('cpp', 'wrong-1');
    s.saveQuizScore('cpp', 'quiz-1', 90);
    s.setNodePosition('cpp', 'node-1', 3);

    s.resetCourse('cpp');

    const c = getState().courses['cpp'];
    expect(c.xp).toBe(0);
    expect(c.completedCards).toEqual({});
    expect(c.wrongCards).toEqual({});
    expect(c.quizScores).toEqual({});
    expect(c.nodePositions).toEqual({});
  });

  it('deducts course XP from global, recalculates level', () => {
    const s = getState();
    s.addXP('cpp', 250); // level 2 at 100, level 3 at 300

    s.resetCourse('cpp');

    const s2 = getState();
    expect(s2.global.totalXP).toBe(0);
    expect(s2.global.level).toBe(1);
  });

  it('does not let totalXP go below zero', () => {
    const s = getState();
    s.addXP('cpp', 50);
    // manually corrupt global.totalXP below course.xp
    useProgressStore.setState({
      global: { totalXP: 30, level: 1 },
      courses: {
        cpp: { completedCards: {}, xp: 50, quizScores: {}, nodePositions: {}, wrongCards: {} },
      },
    });

    s.resetCourse('cpp');

    expect(getState().global.totalXP).toBe(0);
  });

  it('level may drop after reset', () => {
    const s = getState();
    s.addXP('cpp', 300); // level 4 (300 XP)

    expect(getState().global.level).toBe(3);

    s.resetCourse('cpp');

    expect(getState().global.level).toBe(1);
  });
});

// ─── hydrate ──────────────────────────────────────────────

describe('hydrate', () => {
  it('sets hydrated=true when AsyncStorage is empty', async () => {
    await getState().hydrate();

    expect(getState().hydrated).toBe(true);
    expect(getState().global.totalXP).toBe(0);
  });

  it('restores valid data from AsyncStorage', async () => {
    store['codecard-progress'] = JSON.stringify({
      version: 3,
      global: { totalXP: 250, level: 1 },
      courses: {
        cpp: { completedCards: { 'c1': true }, xp: 250, quizScores: {}, nodePositions: {}, wrongCards: {} },
      },
    });

    await getState().hydrate();

    const s = getState();
    expect(s.hydrated).toBe(true);
    expect(s.global.totalXP).toBe(250);
    expect(s.global.level).toBe(2); // recalculated by calcLevel
    expect(s.courses['cpp'].completedCards['c1']).toBe(true);
  });

  it('survives corrupt JSON without crashing', async () => {
    store['codecard-progress'] = '{not valid json';

    await getState().hydrate();

    expect(getState().hydrated).toBe(true);
    expect(getState().global.totalXP).toBe(0);
  });

  it('survives null/undefined data without crashing', async () => {
    store['codecard-progress'] = 'null';

    await getState().hydrate();

    expect(getState().hydrated).toBe(true);
  });
});

// ─── 迁移链 ───────────────────────────────────────────────

describe('migrations', () => {
  it('v1 → v3: adds wrongCards array', async () => {
    store['codecard-progress'] = JSON.stringify({
      version: 1,
      global: { totalXP: 50, level: 1 },
      courses: {
        cpp: { completedCards: {}, xp: 50, quizScores: {}, nodePositions: {} },
      },
    });

    await getState().hydrate();

    const c = getState().courses['cpp'];
    expect(c.wrongCards).toEqual({});
    expect(c.completedCards).toEqual({});
  });

  it('v2 → v3: converts array-format completedCards/wrongCards to Record', async () => {
    store['codecard-progress'] = JSON.stringify({
      version: 2,
      global: { totalXP: 100, level: 1 },
      courses: {
        cpp: {
          completedCards: ['card-a', 'card-b'],
          wrongCards: ['wrong-x'],
          xp: 100,
          quizScores: {},
          nodePositions: {},
        },
      },
    });

    await getState().hydrate();

    const c = getState().courses['cpp'];
    expect(c.completedCards).toEqual({ 'card-a': true, 'card-b': true });
    expect(c.wrongCards).toEqual({ 'wrong-x': true });
  });

  it('v1 with completedCards array also migrates correctly', async () => {
    store['codecard-progress'] = JSON.stringify({
      version: 1,
      global: { totalXP: 5, level: 1 },
      courses: {
        cpp: { completedCards: ['old-card'], xp: 5, quizScores: {}, nodePositions: {} },
      },
    });

    await getState().hydrate();

    const c = getState().courses['cpp'];
    expect(c.completedCards).toEqual({ 'old-card': true });
    expect(c.wrongCards).toEqual({});
  });
});

// ─── flush ─────────────────────────────────────────────────

describe('flush', () => {
  it('writes pickData to AsyncStorage, excluding hydrated', async () => {
    const s = getState();
    s.addXP('cpp', 50);
    s.rewardCard('cpp', 'card-1', XP_PER_CARD);

    await s.flush();

    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const written = JSON.parse(
      (AsyncStorage.default.setItem as ReturnType<typeof vi.fn>).mock.calls.at(-1)?.[1] ?? '{}',
    );
    expect(written.version).toBe(3);
    expect(written.global).toBeDefined();
    expect(written.courses).toBeDefined();
    expect(written.hydrated).toBeUndefined();
  });

  it('overwrites old data on subsequent flush', async () => {
    const s = getState();
    s.addXP('cpp', 10);
    await s.flush();

    s.addXP('cpp', 20);
    await s.flush();

    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const written = JSON.parse(
      (AsyncStorage.default.setItem as ReturnType<typeof vi.fn>).mock.calls.at(-1)?.[1] ?? '{}',
    );
    expect(written.global.totalXP).toBe(30);
  });

  it('does not throw when AsyncStorage.write fails', async () => {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    (AsyncStorage.default.setItem as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('disk full'),
    );

    getState().addXP('cpp', 10);

    await expect(getState().flush()).resolves.toBeUndefined();
  });
});
