import { supabase } from '@/lib/supabase';
import { useProgressStore } from '@/store/useProgressStore';
import { calcLevel } from '@/lib/xp';
import type { CourseProgress } from '@/store/useProgressStore';

function mergeMax<T extends Record<string, number>>(a: T | undefined, b: T | undefined): T {
  const result: Record<string, number> = { ...(a ?? {}) };
  for (const [key, val] of Object.entries(b ?? {})) {
    result[key] = Math.max(result[key] ?? 0, val);
  }
  return result as T;
}

function mergeWrongCards(
  a: Record<string, true> | undefined,
  b: Record<string, true> | undefined,
): Record<string, true> {
  return { ...(a ?? {}), ...(b ?? {}) };
}

export async function uploadProgress(userId: string): Promise<void> {
  const local = useProgressStore.getState();
  const data = { version: local.version, global: local.global, courses: local.courses };

  const { error } = await supabase.from('user_progress').upsert({
    user_id: userId,
    data,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.warn('[syncEngine] upload failed:', error.message);
  }
}

export async function syncOnLogin(userId: string): Promise<void> {
  const { data: row, error } = await supabase
    .from('user_progress')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[syncEngine] download failed:', error.message);
    return;
  }

  // 远程无数据 → 上传本地
  if (!row) {
    await uploadProgress(userId);
    return;
  }

  const remote = (row as any).data as {
    global: { totalXP: number; level: number };
    courses: Record<string, CourseProgress>;
  };
  const local = useProgressStore.getState();

  // 合并 courses
  const mergedCourses: Record<string, CourseProgress> = { ...local.courses };
  for (const [cid, rp] of Object.entries(remote.courses ?? {})) {
    const lp = mergedCourses[cid];
    if (!lp) {
      mergedCourses[cid] = rp as CourseProgress;
      continue;
    }
    mergedCourses[cid] = {
      completedCards: { ...(lp.completedCards ?? {}), ...(rp.completedCards as any ?? {}) },
      wrongCards: mergeWrongCards(lp.wrongCards as any, (rp as any).wrongCards),
      xp: Math.max(lp.xp ?? 0, (rp as any).xp ?? 0),
      quizScores: mergeMax(lp.quizScores, (rp as any).quizScores),
      nodePositions: mergeMax(lp.nodePositions, (rp as any).nodePositions),
    } as CourseProgress;
  }

  // 重新计算全局 XP
  const totalXP = Object.values(mergedCourses).reduce((sum, c) => sum + (c.xp ?? 0), 0);
  useProgressStore.setState({
    global: { totalXP, level: calcLevel(totalXP) },
    courses: mergedCourses,
  });

  // 回写合并结果
  await uploadProgress(userId);
}

export async function manualSync(userId: string): Promise<{ lastSyncedAt: Date | null }> {
  try {
    await syncOnLogin(userId);
    return { lastSyncedAt: new Date() };
  } catch {
    return { lastSyncedAt: null };
  }
}
