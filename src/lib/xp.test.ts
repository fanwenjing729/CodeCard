import { describe, it, expect } from 'vitest';
import { calcLevel, xpForLevelStart, xpForNextLevel, XP_PER_LEVEL } from './xp';

// ─── calcLevel ───────────────────────────────────────────

describe('calcLevel', () => {
  it('zero xp → level 1', () => {
    expect(calcLevel(0)).toBe(1);
  });

  it('below first threshold → still level 1', () => {
    expect(calcLevel(XP_PER_LEVEL - 1)).toBe(1);
  });

  it('exactly at threshold → level 2', () => {
    expect(calcLevel(XP_PER_LEVEL)).toBe(2);
  });

  it('level 2→3 boundary', () => {
    const lv3start = XP_PER_LEVEL + 2 * XP_PER_LEVEL; // 100 + 200 = 300
    expect(calcLevel(lv3start - 1)).toBe(2);
    expect(calcLevel(lv3start)).toBe(3);
  });

  it('level 3→4 boundary', () => {
    const lv4start = XP_PER_LEVEL + 2 * XP_PER_LEVEL + 3 * XP_PER_LEVEL; // 100+200+300 = 600
    expect(calcLevel(lv4start - 1)).toBe(3);
    expect(calcLevel(lv4start)).toBe(4);
  });

  it('high level values', () => {
    // Level 10 starts at xpForLevelStart(10) = 50 * 9 * 10 = 4500
    expect(calcLevel(4500)).toBe(10);
    expect(calcLevel(4500 - 1)).toBe(9);
  });
});

// ─── xpForLevelStart / xpForNextLevel ────────────────────

describe('xpForLevelStart', () => {
  it('level 1 starts at 0', () => {
    expect(xpForLevelStart(1)).toBe(0);
  });

  it('level 2 starts at XP_PER_LEVEL', () => {
    expect(xpForLevelStart(2)).toBe(XP_PER_LEVEL);
  });

  it('level 3 starts at XP_PER_LEVEL * 3', () => {
    expect(xpForLevelStart(3)).toBe(XP_PER_LEVEL * 3);
  });
});

describe('xpForNextLevel', () => {
  it('level 1 needs XP_PER_LEVEL', () => {
    expect(xpForNextLevel(1)).toBe(XP_PER_LEVEL);
  });

  it('level 2 needs 2 * XP_PER_LEVEL', () => {
    expect(xpForNextLevel(2)).toBe(2 * XP_PER_LEVEL);
  });
});

// ─── 不变量 — 逆运算关系 ─────────────────────────────────

describe('invariants', () => {
  it('xpForLevelStart + xpForNextLevel = xpForLevelStart of next level', () => {
    for (const lv of [1, 2, 3, 5, 10, 20]) {
      expect(xpForLevelStart(lv) + xpForNextLevel(lv)).toBe(xpForLevelStart(lv + 1));
    }
  });

  it('calcLevel(xpForLevelStart(n)) === n', () => {
    for (const lv of [1, 2, 3, 5, 10, 15]) {
      expect(calcLevel(xpForLevelStart(lv))).toBe(lv);
    }
  });

  it('calcLevel is monotonic', () => {
    const values = [0, 50, 100, 150, 200, 300, 500, 1000, 5000];
    for (let i = 0; i < values.length - 1; i++) {
      expect(calcLevel(values[i])).toBeLessThanOrEqual(calcLevel(values[i + 1]));
    }
  });
});
