export async function uploadProgress(_userId: string): Promise<void> {
  // no-op: 真实实现会将本地进度 upsert 到 Supabase
}

export async function syncOnLogin(_userId: string): Promise<void> {
  // no-op: 真实实现会下载远程进度 → 合并 → 回写
}

export async function manualSync(_userId: string): Promise<{ lastSyncedAt: Date | null }> {
  // no-op: 真实实现会执行同步并返回时间
  return { lastSyncedAt: null };
}
