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

vi.mock('@/theme/ThemeContext', () => ({
  ThemeContext: {
    Consumer: ({ children }: any) => children({ isDark: false }),
  },
}));

import ErrorBoundary, { ErrorBoundaryInner } from './ErrorBoundary';
import { Colors } from '@/theme';

describe('ErrorBoundary', () => {
  it('getDerivedStateFromError returns hasError true', () => {
    const state = ErrorBoundaryInner.getDerivedStateFromError();
    expect(state.hasError).toBe(true);
  });

  it('renders children normally when no error', () => {
    const instance = React.createElement(ErrorBoundary, { children: 'child' as any });
    expect(instance).toBeDefined();
  });

  it('renders fallback UI when hasError', () => {
    const instance = new (ErrorBoundaryInner as any)({ children: null, colors: Colors });
    instance.state = { hasError: true };

    const rendered = instance.render() as any;
    const title = rendered.props.children[0];
    expect(title.props.children).toBe('出错了');

    const subtitle = rendered.props.children[1];
    expect(subtitle.props.children).toBe('应用遇到了意外错误，学习进度已保存');

    const btn = rendered.props.children[2];
    const btnText = btn.props.children;
    expect(btnText.props.children).toBe('重试');
  });

  it('flushes progress on componentDidCatch', () => {
    const instance = new (ErrorBoundaryInner.prototype.constructor as any)({ children: null, colors: Colors });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    instance.componentDidCatch(new Error('test'));
    spy.mockRestore();
    expect(mockFlush).toHaveBeenCalledOnce();
  });

  it('renders children when hasError is false', () => {
    const instance = new (ErrorBoundaryInner.prototype.constructor as any)({
      children: React.createElement('Text' as any, {}, 'child content'),
      colors: Colors,
    });
    instance.state = { hasError: false };

    const rendered = instance.render() as any;
    expect(rendered.props.children).toBe('child content');
  });
});
