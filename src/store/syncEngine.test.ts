import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  apiGet: vi.fn().mockResolvedValue({}),
  apiPut: vi.fn().mockResolvedValue({}),
  apiPost: vi.fn().mockResolvedValue({}),
  loadTokens: vi.fn().mockResolvedValue(null),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  ApiError: class extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: {
    getState: vi.fn(() => ({
      version: 3,
      global: { totalXP: 0, level: 1 },
      courses: {},
    })),
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
