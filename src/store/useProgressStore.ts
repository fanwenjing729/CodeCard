import { create } from 'zustand';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CourseProgress {
  completedCards: string[];
  xp: number;
  quizScores: Record<string, number>;
  nodePositions: Record<string, number>;
  wrongCards: string[];
}

function getOrCreateCourse(
  courses: Record<string, CourseProgress>,
  courseId: string,
): CourseProgress {
  return courses[courseId] ?? { completedCards: [], xp: 0, quizScores: {}, nodePositions: {}, wrongCards: [] };
}

function calcLevel(totalXP: number): number {
  let level = 1;
  let threshold = 100;
  let xp = totalXP;
  while (xp >= threshold) {
    xp -= threshold;
    level++;
    threshold = level * 100;
  }
  return level;
}

const STORAGE_KEY = 'codecard-progress';
const CURRENT_VERSION = 2;

interface PersistedData {
  version: number;
  global: {
    totalXP: number;
    level: number;
  };
  courses: Record<string, CourseProgress>;
}

// 迁移链：每个 key 是"从该版本迁到下一版"的函数
const MIGRATIONS: Record<number, (data: any) => any> = {
  1: (data) => ({
    ...data,
    version: 2,
    courses: Object.fromEntries(
      Object.entries(data.courses).map(([id, c]: [string, any]) => [
        id,
        { ...c, wrongCards: [] },
      ]),
    ),
  }),
};

function migrate(data: any): PersistedData {
  let version: number = data.version ?? 1;
  while (MIGRATIONS[version]) {
    data = MIGRATIONS[version](data);
    version++;
  }
  data.version = CURRENT_VERSION;
  return data as PersistedData;
}

export const XP_PER_CARD = 5;
export const XP_PER_PRACTICE = 10;

interface ProgressStore extends PersistedData {
  addXP: (courseId: string, amount: number) => void;
  completeCard: (courseId: string, cardId: string) => boolean;
  rewardCard: (courseId: string, cardId: string, xpAmount: number) => boolean;
  saveQuizScore: (courseId: string, nodeId: string, score: number) => void;
  setNodePosition: (courseId: string, nodeId: string, cardIndex: number) => void;
  addWrongCard: (courseId: string, cardId: string) => void;
  removeWrongCard: (courseId: string, cardId: string) => void;
  uncompleteCard: (courseId: string, cardId: string) => void;
  hydrate: () => Promise<void>;
  flush: () => Promise<void>;
  resetCourse: (courseId: string) => void;
}

const initialState: PersistedData = {
  version: CURRENT_VERSION,
  global: {
    totalXP: 0,
    level: 1,
  },
  courses: {},
};

// 提取可序列化数据，排除方法
function pickData(s: ProgressStore): PersistedData {
  return { version: CURRENT_VERSION, global: s.global, courses: s.courses };
}

const save = async (data: PersistedData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('[CodeCard] AsyncStorage write failed:', e);
  }
};

export const useProgressStore = create<ProgressStore>()((set, get) => ({
  ...initialState,

  addXP: (courseId, amount) => {
    set((s) => {
      const course = getOrCreateCourse(s.courses, courseId);
      const newTotalXP = s.global.totalXP + amount;
      return {
        global: {
          ...s.global,
          totalXP: newTotalXP,
          level: calcLevel(newTotalXP),
        },
        courses: {
          ...s.courses,
          [courseId]: { ...course, xp: course.xp + amount },
        },
      };
    });
  },

  completeCard: (courseId, cardId) => {
    const { courses } = get();
    const course = getOrCreateCourse(courses, courseId);
    if (course.completedCards.includes(cardId)) return false;
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      return {
        courses: {
          ...s.courses,
          [courseId]: {
            ...c,
            completedCards: [...c.completedCards, cardId],
          },
        },
      };
    });
    return true;
  },

  rewardCard: (courseId, cardId, xpAmount) => {
    const { courses } = get();
    const course = getOrCreateCourse(courses, courseId);
    if (course.completedCards.includes(cardId)) return false;
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      const newTotalXP = s.global.totalXP + xpAmount;
      return {
        global: {
          ...s.global,
          totalXP: newTotalXP,
          level: calcLevel(newTotalXP),
        },
        courses: {
          ...s.courses,
          [courseId]: {
            ...c,
            completedCards: [...c.completedCards, cardId],
            xp: c.xp + xpAmount,
          },
        },
      };
    });
    return true;
  },

  saveQuizScore: (courseId, nodeId, score) => {
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      return {
        courses: {
          ...s.courses,
          [courseId]: {
            ...c,
            quizScores: { ...c.quizScores, [nodeId]: score },
          },
        },
      };
    });
  },

  setNodePosition: (courseId, nodeId, cardIndex) => {
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      return {
        courses: {
          ...s.courses,
          [courseId]: {
            ...c,
            nodePositions: { ...c.nodePositions, [nodeId]: cardIndex },
          },
        },
      };
    });
  },

  addWrongCard: (courseId, cardId) => {
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      if (c.wrongCards.includes(cardId)) return s;
      return {
        courses: {
          ...s.courses,
          [courseId]: { ...c, wrongCards: [...c.wrongCards, cardId] },
        },
      };
    });
  },

  removeWrongCard: (courseId, cardId) => {
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      if (!c.wrongCards.includes(cardId)) return s;
      return {
        courses: {
          ...s.courses,
          [courseId]: { ...c, wrongCards: c.wrongCards.filter((id) => id !== cardId) },
        },
      };
    });
  },

  uncompleteCard: (courseId, cardId) => {
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      if (!c.completedCards.includes(cardId)) return s;
      return {
        courses: {
          ...s.courses,
          [courseId]: { ...c, completedCards: c.completedCards.filter((id) => id !== cardId) },
        },
      };
    });
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return;
      const migrated = migrate(data);
      set({
        global: migrated.global,
        courses: migrated.courses,
      });
    } catch (e) {
      console.warn('[CodeCard] AsyncStorage read failed:', e);
    }
  },

  flush: async () => {
    await save(pickData(get()));
  },

  resetCourse: (courseId) => {
    set((s) => {
      const course = getOrCreateCourse(s.courses, courseId);
      return {
        global: {
          ...s.global,
          totalXP: s.global.totalXP - course.xp,
          level: calcLevel(Math.max(0, s.global.totalXP - course.xp)),
        },
        courses: {
          ...s.courses,
          [courseId]: { completedCards: [], xp: 0, quizScores: {}, nodePositions: {}, wrongCards: [] },
        },
      };
    });
  },
}));

// 持久化：状态变化时防抖写入
let saveTimer: ReturnType<typeof setTimeout> | null = null;
useProgressStore.subscribe((state) => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => save(pickData(state)), 500);
});

// App 进后台或退出时立即 flush
AppState.addEventListener('change', (nextState) => {
  if (nextState === 'inactive' || nextState === 'background') {
    save(pickData(useProgressStore.getState()));
  }
});
