import { describe, it, expect, beforeEach } from 'vitest';
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
    expect(getState().user?.id).toBe('user-1'); // other fields preserved
  });

  it('does not crash when user is null', () => {
    useAuthStore.setState({ user: null, isLoggedIn: false });

    expect(() => getState().setDisplayId('x')).not.toThrow();
    expect(getState().user).toBeNull();
  });
});

describe('initialize', () => {
  it('sets isMounted to true', async () => {
    await getState().initialize();

    expect(getState().isMounted).toBe(true);
  });
});
