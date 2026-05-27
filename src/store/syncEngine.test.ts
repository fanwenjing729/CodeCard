import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: {
    getState: vi.fn(() => ({ global: { totalXP: 0, level: 1 }, courses: {} })),
    setState: vi.fn(),
  },
}));

vi.mock('@/lib/xp', () => ({
  calcLevel: vi.fn(() => 1),
}));

import { manualSync, uploadProgress, syncOnLogin } from './syncEngine';

describe('manualSync', () => {
  it('returns { lastSyncedAt: Date }', async () => {
    const result = await manualSync('user-1');
    expect(result.lastSyncedAt).toBeInstanceOf(Date);
  });
});

describe('no-ops', () => {
  it('uploadProgress and syncOnLogin do not throw', async () => {
    await expect(uploadProgress('user-1')).resolves.toBeUndefined();
    await expect(syncOnLogin('user-1')).resolves.toBeUndefined();
  });
});
