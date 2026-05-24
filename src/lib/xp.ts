export const XP_PER_LEVEL = 100;

export function calcLevel(totalXP: number): number {
  let level = 1;
  let threshold = XP_PER_LEVEL;
  let xp = totalXP;
  while (xp >= threshold) {
    xp -= threshold;
    level++;
    threshold = level * XP_PER_LEVEL;
  }
  return level;
}

/** 到达指定等级需要的累计 XP */
export function xpForLevelStart(level: number): number {
  return (XP_PER_LEVEL / 2) * (level - 1) * level;
}

/** 当前等级升到下一级需要的 XP */
export function xpForNextLevel(level: number): number {
  return level * XP_PER_LEVEL;
}
