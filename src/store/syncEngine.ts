import { apiGet, apiPut } from '@/lib/api';
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

  try {
    await apiPut('/progress', { data, version: local.version });
  } catch (e: any) {
    console.warn('[syncEngine] upload failed:', e.message);
  }
}

export async function syncOnLogin(userId: string): Promise<void> {
  try {
    const remote = await apiGet<any>('/progress');
    const hasRemoteData = remote && remote.data && Object.keys(remote.data).length > 0;

    if (!hasRemoteData) {
      await uploadProgress(userId);
      return;
    }

    const remoteData = remote.data as {
      global: { totalXP: number; level: number };
      courses: Record<string, CourseProgress>;
    };
    const local = useProgressStore.getState();

    // 合并 courses
    const mergedCourses: Record<string, CourseProgress> = { ...local.courses };
    for (const [cid, rp] of Object.entries(remoteData.courses ?? {})) {
      const lp = mergedCourses[cid];
      if (!lp) {
        mergedCourses[cid] = rp as CourseProgress;
        continue;
      }
      // 本地已重置（completedCards 为空且 xp=0），跳过远程合并，防止恢复已重置的数据
      // 但新设备首次同步（hasEverPlayed=false）时以服务端为准
      if (Object.keys(lp.completedCards ?? {}).length === 0 && (lp.xp ?? 0) === 0
          && local.global.hasEverPlayed !== false) {
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
      global: { totalXP, level: calcLevel(totalXP), hasEverPlayed: true },
      courses: mergedCourses,
    });

    // 回写合并结果
    await uploadProgress(userId);
  } catch (e: any) {
    console.warn('[syncEngine] sync failed:', e.message);
  }
}

export async function manualSync(userId: string): Promise<{ lastSyncedAt: Date | null }> {
  try {
    await syncOnLogin(userId);
    return { lastSyncedAt: new Date() };
  } catch {
    return { lastSyncedAt: null };
  }
}
