import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { Text } from 'react-native';

const mockFlush = vi.fn();
vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: Object.assign(
    (selector?: any) => (selector ? selector({}) : {}),
    { getState: () => ({ flush: mockFlush }) },
  ),
}));

import { render } from '@testing-library/react-native';
import ErrorBoundary from './ErrorBoundary';

beforeEach(() => {
  vi.clearAllMocks();
});

function BrokenComponent(): React.ReactElement {
  throw new Error('test crash');
}
(React as any).createElement = React.createElement;

describe('ErrorBoundary', () => {
  it('renders children normally when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Everything is fine</Text>
      </ErrorBoundary>,
    );
    expect(getByText('Everything is fine')).toBeTruthy();
  });

  it('catches errors and shows fallback UI', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(getByText('出错了')).toBeTruthy();
    expect(getByText('应用遇到了意外错误，学习进度已保存')).toBeTruthy();
    expect(getByText('重试')).toBeTruthy();

    spy.mockRestore();
  });

  it('flushes progress on error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(mockFlush).toHaveBeenCalledOnce();

    spy.mockRestore();
  });

  it('returns null for getDerivedStateFromError', () => {
    // getDerivedStateFromError should return { hasError: true }
    // we just verify it doesn't crash
    const state = ErrorBoundary.getDerivedStateFromError();
    expect(state.hasError).toBe(true);
  });
});
