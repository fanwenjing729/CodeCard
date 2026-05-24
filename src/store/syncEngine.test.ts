import { describe, it, expect } from 'vitest';
import { manualSync, uploadProgress, syncOnLogin } from './syncEngine';

describe('manualSync', () => {
  it('returns { lastSyncedAt: null }', async () => {
    const result = await manualSync('user-1');
    expect(result).toEqual({ lastSyncedAt: null });
  });
});

describe('no-ops', () => {
  it('uploadProgress and syncOnLogin do not throw', async () => {
    await expect(uploadProgress('user-1')).resolves.toBeUndefined();
    await expect(syncOnLogin('user-1')).resolves.toBeUndefined();
  });
});
