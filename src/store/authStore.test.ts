import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  apiGet: vi.fn().mockResolvedValue({}),
  apiPost: vi.fn().mockResolvedValue({}),
  apiPut: vi.fn().mockResolvedValue({}),
  loadTokens: vi.fn().mockResolvedValue(null),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  setOnTokenRefreshed: vi.fn(),
  ApiError: class extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

vi.mock('./syncEngine', () => ({
  syncOnLogin: vi.fn().mockResolvedValue(undefined),
}));

import { useAuthStore } from './authStore';

beforeEach(() => {
  useAuthStore.setState({
    user: { id: 'user-1', displayId: 'test-user' },
    isLoggedIn: true,
    isMounted: false,
  });
});

function getState() {
  return useAuthStore.getState();
}

describe('logout', () => {
  it('clears user and sets isLoggedIn to false', async () => {
    await getState().logout();

    const s = getState();
    expect(s.user).toBeNull();
    expect(s.isLoggedIn).toBe(false);
  });
});

describe('setDisplayId', () => {
  it('updates user.displayId', () => {
    getState().setDisplayId('new-id');

    expect(getState().user?.displayId).toBe('new-id');
    expect(getState().user?.id).toBe('user-1');
  });

  it('does not crash when user is null', () => {
    useAuthStore.setState({ user: null, isLoggedIn: false });

    expect(() => getState().setDisplayId('x')).not.toThrow();
    expect(getState().user).toBeNull();
  });
});

describe('updateAvatar', () => {
  it('updates user.avatar', () => {
    getState().updateAvatar('file:///avatar.png');

    expect(getState().user?.avatar).toBe('file:///avatar.png');
    expect(getState().user?.id).toBe('user-1');
  });

  it('does not crash when user is null', () => {
    useAuthStore.setState({ user: null, isLoggedIn: false });

    expect(() => getState().updateAvatar('file:///x.png')).not.toThrow();
    expect(getState().user).toBeNull();
  });
});

describe('initialize', () => {
  it('sets isMounted to true', async () => {
    await getState().initialize();

    expect(getState().isMounted).toBe(true);
  });
});
