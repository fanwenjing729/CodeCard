import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: Record<string, any>) => styles },
  Text: 'Text' as any,
  View: 'View' as any,
  TouchableOpacity: 'TouchableOpacity' as any,
}));

const mockFlush = vi.fn();
vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: Object.assign(
    (selector?: any) => (selector ? selector({}) : {}),
    { getState: () => ({ flush: mockFlush }) },
  ),
}));

import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('getDerivedStateFromError returns hasError true', () => {
    const state = ErrorBoundary.getDerivedStateFromError();
    expect(state.hasError).toBe(true);
  });

  it('renders children normally when no error', () => {
    const instance = React.createElement(ErrorBoundary, { children: 'child' as any });
    expect(instance).toBeDefined();
  });

  it('renders fallback UI when hasError', () => {
    const instance = new (ErrorBoundary as any)({ children: null });
    instance.state = { hasError: true };

    const rendered = instance.render() as any;
    // Fallback contains title, subtitle, and retry button
    const title = rendered.props.children[0];
    expect(title.props.children).toBe('出错了');

    const subtitle = rendered.props.children[1];
    expect(subtitle.props.children).toBe('应用遇到了意外错误，学习进度已保存');

    const btn = rendered.props.children[2];
    const btnText = btn.props.children;
    expect(btnText.props.children).toBe('重试');
  });

  it('flushes progress on componentDidCatch', () => {
    const instance = new (ErrorBoundary.prototype.constructor as any)({ children: null });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    instance.componentDidCatch(new Error('test'));
    spy.mockRestore();
    expect(mockFlush).toHaveBeenCalledOnce();
  });

  it('renders children when hasError is false', () => {
    const instance = new (ErrorBoundary.prototype.constructor as any)({
      children: React.createElement('Text' as any, {}, 'child content'),
    });
    instance.state = { hasError: false };

    const rendered = instance.render() as any;
    // When no error, renders children directly
    expect(rendered.props.children).toBe('child content');
  });
});
