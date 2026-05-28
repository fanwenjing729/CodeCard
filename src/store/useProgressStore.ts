import { create } from 'zustand';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcLevel } from '@/lib/xp';

export interface CourseProgress {
  completedCards: Record<string, true>;
  xp: number;
  quizScores: Record<string, number>;
  nodePositions: Record<string, number>;
  wrongCards: Record<string, true>;
}

function getOrCreateCourse(
  courses: Record<string, CourseProgress>,
  courseId: string,
): CourseProgress {
  return courses[courseId] ?? { completedCards: {}, xp: 0, quizScores: {}, nodePositions: {}, wrongCards: {} };
}

const STORAGE_KEY = 'codecard-progress';
const CURRENT_VERSION = 3;

interface PersistedData {
  version: number;
  global: {
    totalXP: number;
    level: number;
  };
  courses: Record<string, CourseProgress>;
}

function arrayToRecord(arr: string[] | Record<string, true>): Record<string, true> {
  if (!Array.isArray(arr)) return arr as Record<string, true>;
  const rec: Record<string, true> = {};
  for (const item of arr) rec[item] = true;
  return rec;
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
  2: (data) => ({
    ...data,
    version: 3,
    courses: Object.fromEntries(
      Object.entries(data.courses).map(([id, c]: [string, any]) => [
        id,
        {
          ...c,
          completedCards: arrayToRecord(c.completedCards ?? []),
          wrongCards: arrayToRecord(c.wrongCards ?? []),
        },
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
  hydrated: boolean;
  addXP: (courseId: string, amount: number) => void;
  rewardCard: (courseId: string, cardId: string, xpAmount: number) => boolean;
  saveQuizScore: (courseId: string, nodeId: string, score: number) => void;
  setNodePosition: (courseId: string, nodeId: string, cardIndex: number) => void;
  addWrongCard: (courseId: string, cardId: string) => void;
  removeWrongCard: (courseId: string, cardId: string) => void;
  hydrate: () => Promise<void>;
  flush: () => Promise<void>;
  resetCourse: (courseId: string) => void;
  removeCompletedCards: (courseId: string, cardIds: string[], xpToSubtract: number) => void;
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
  return {
    version: CURRENT_VERSION,
    global: { totalXP: s.global.totalXP, level: s.global.level },
    courses: s.courses,
  };
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
  hydrated: false,

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

  rewardCard: (courseId, cardId, xpAmount) => {
    let isNew = false;
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      if (cardId in c.completedCards) return s;
      isNew = true;
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
            completedCards: { ...c.completedCards, [cardId]: true },
            xp: c.xp + xpAmount,
          },
        },
      };
    });
    return isNew;
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
      if (cardId in c.wrongCards) return s;
      return {
        courses: {
          ...s.courses,
          [courseId]: { ...c, wrongCards: { ...c.wrongCards, [cardId]: true } },
        },
      };
    });
  },

  removeWrongCard: (courseId, cardId) => {
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      if (!(cardId in c.wrongCards)) return s;
      const { [cardId]: _, ...rest } = c.wrongCards;
      return {
        courses: {
          ...s.courses,
          [courseId]: { ...c, wrongCards: rest },
        },
      };
    });
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) { set({ hydrated: true }); return; }
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') { set({ hydrated: true }); return; }
      const migrated = migrate(data);
      set({
        hydrated: true,
        global: {
          ...migrated.global,
          level: calcLevel(migrated.global.totalXP),
        },
        courses: migrated.courses,
      });
    } catch (e) {
      console.warn('[CodeCard] AsyncStorage read failed:', e);
      set({ hydrated: true });
    }
  },

  flush: async () => {
    await save(pickData(get()));
  },

  resetCourse: (courseId) => {
    set((s) => {
      const course = s.courses[courseId];
      if (!course) return s;
      return {
        global: {
          ...s.global,
          totalXP: Math.max(0, s.global.totalXP - course.xp),
          level: calcLevel(Math.max(0, s.global.totalXP - course.xp)),
        },
        courses: {
          ...s.courses,
          [courseId]: { completedCards: {}, xp: 0, quizScores: {}, nodePositions: {}, wrongCards: {} },
        },
      };
    });
  },

  removeCompletedCards: (courseId, cardIds, xpToSubtract) => {
    if (cardIds.length === 0) return;
    set((s) => {
      const c = getOrCreateCourse(s.courses, courseId);
      const removeSet = new Set(cardIds);
      const nextCompleted: Record<string, true> = {};
      for (const id of Object.keys(c.completedCards)) {
        if (!removeSet.has(id)) nextCompleted[id] = true;
      }
      const nextWrong: Record<string, true> = {};
      for (const id of Object.keys(c.wrongCards)) {
        if (!removeSet.has(id)) nextWrong[id] = true;
      }
      const newXP = Math.max(0, c.xp - xpToSubtract);
      const newTotalXP = Math.max(0, s.global.totalXP - xpToSubtract);
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
            completedCards: nextCompleted,
            wrongCards: nextWrong,
            xp: newXP,
          },
        },
      };
    });
  },
}));

// 持久化：状态变化时防抖写入，数据未变则跳过
let lastSavedJSON: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function saveIfDirty(data: PersistedData) {
  const json = JSON.stringify(data);
  if (json !== lastSavedJSON) {
    lastSavedJSON = json;
    save(data);
  }
}

useProgressStore.subscribe(() => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveIfDirty(pickData(useProgressStore.getState())), 500);
});

// App 进后台或退出时立即 flush
let _appStateRegistered = false;
if (!_appStateRegistered) {
  _appStateRegistered = true;
  AppState.addEventListener('change', (nextState) => {
    if (nextState === 'inactive' || nextState === 'background') {
      saveIfDirty(pickData(useProgressStore.getState()));
    }
  });
}
