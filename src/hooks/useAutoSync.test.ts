import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { createElement, act } from 'react';
import TestRenderer from 'react-test-renderer';

// ─── Mock layer ───────────────────────────────────────────

const {
  uploadProgress,
  progressCallback,
  subscribeMock,
  authState,
} = vi.hoisted(() => {
  let callback: (() => void) | null = null;
  return {
    uploadProgress: vi.fn().mockResolvedValue(undefined),
    progressCallback: {
      get current() { return callback; },
      set current(v: (() => void) | null) { callback = v; },
    },
    subscribeMock: vi.fn((cb: () => void) => {
      callback = cb;
      return vi.fn();
    }),
    authState: { user: { id: 'u1' } as any },
  };
});

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: Object.assign(vi.fn(), {
    subscribe: subscribeMock,
  }),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => authState),
  },
}));

vi.mock('@/store/syncEngine', () => ({ uploadProgress }));

import { useAutoSync } from './useAutoSync';

// ─── Minimal renderHook ───────────────────────────────────

function renderHook<R>(useHook: () => R) {
  const result = { current: undefined as any as R };
  let renderer: TestRenderer.ReactTestRenderer;

  function TestComponent() {
    result.current = useHook();
    return null;
  }

  act(() => {
    renderer = TestRenderer.create(createElement(TestComponent as any));
  });

  return {
    result,
    unmount: () => {
      act(() => {
        renderer!.unmount();
      });
    },
    rerender: () => {
      act(() => {
        renderer!.update(createElement(TestComponent as any));
      });
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────

function triggerProgress() {
  const cb = progressCallback.current;
  if (cb) cb();
}

beforeEach(() => {
  vi.clearAllMocks();
  authState.user = { id: 'u1' };
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── Tests ────────────────────────────────────────────────

describe('useAutoSync', () => {
  it('uploads progress 3s after change when logged in', () => {
    vi.useFakeTimers();

    renderHook(() => useAutoSync());

    expect(subscribeMock).toHaveBeenCalledTimes(1);

    act(() => { triggerProgress(); });

    expect(uploadProgress).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(3000); });

    expect(uploadProgress).toHaveBeenCalledTimes(1);
    expect(uploadProgress).toHaveBeenCalledWith('u1');
  });

  it('does not upload when not logged in', () => {
    vi.useFakeTimers();
    authState.user = null;

    renderHook(() => useAutoSync());

    act(() => { triggerProgress(); });
    act(() => { vi.advanceTimersByTime(3000); });

    expect(uploadProgress).not.toHaveBeenCalled();
  });

  it('debounces rapid changes into a single upload', () => {
    vi.useFakeTimers();

    renderHook(() => useAutoSync());

    act(() => { triggerProgress(); });
    act(() => { triggerProgress(); });
    act(() => { triggerProgress(); });

    act(() => { vi.advanceTimersByTime(3000); });

    expect(uploadProgress).toHaveBeenCalledTimes(1);
  });

  it('clears pending upload on unmount', () => {
    vi.useFakeTimers();

    const { unmount } = renderHook(() => useAutoSync());

    act(() => { triggerProgress(); });
    unmount();

    act(() => { vi.advanceTimersByTime(3000); });

    expect(uploadProgress).not.toHaveBeenCalled();
  });

  it('subscribes only once across rerenders', () => {
    const { rerender } = renderHook(() => useAutoSync());

    rerender();
    rerender();

    expect(subscribeMock).toHaveBeenCalledTimes(1);
  });
});
