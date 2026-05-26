import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: Record<string, any>) => styles },
  Text: 'Text' as any,
  View: 'View' as any,
  ScrollView: 'ScrollView' as any,
}));

vi.mock('@/theme/useTheme', () => ({
  useColors: () => ({
    primary: '#5B7FFF',
    success: '#34D399',
    danger: '#EF4444',
    warning: '#F59E0B',
    bg: '#fff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#f5f5f5',
    text: '#222',
    textSecondary: '#666',
    textMuted: '#999',
    textPlaceholder: '#bbb',
    textInverse: '#fff',
    bodyText: '#444',
    border: '#eee',
    borderLight: '#d0d0d0',
    arrow: '#ccc',
    codeBg: '#1e1e1e',
    codeText: '#d4d4d4',
    codeLineNum: '#888',
    codeHighlightBg: '#ffffff18',
    correctBg: '#d4edda',
    wrongBg: '#f8d7da',
    progressBarBg: '#e8edf2',
    tabBarActive: '#5B7FFF',
    tabBarInactive: '#999',
    tabBarBorder: '#e0e0e0',
    disabledBg: '#8899aa',
    disabledText: '#aaa',
    optionBg: '#f0f4ff',
    optionSelectedBg: '#cce5ff',
    optionBorder: '#d0d8f0',
    optionText: '#333',
    fillInputBg: '#fafafa',
    explanationText: '#555',
    wrongBorder: '#ff6b6b',
    dangerBorder: '#ffccd5',
    inputBorder: '#ddd',
    backdrop: 'rgba(0,0,0,0.35)',
    gridEmpty: '#2a2a3e',
    gridEmptyStroke: '#3a3a4e',
    animCodeConditionBg: 'rgba(74,158,255,0.20)',
    animCodeActiveBg: 'rgba(46,213,115,0.18)',
    animCodeSkippedBg: 'rgba(153,153,153,0.10)',
    animBadgeSuccess: 'rgba(46,213,115,0.12)',
    animBadgeMuted: 'rgba(153,153,153,0.12)',
    textInverseSecondary: 'rgba(255,255,255,0.8)',
  }),
  useTheme: () => ({ isDark: false, toggle: () => {} }),
}));

import CodeCard from './CodeCard';

function renderCard(props: Parameters<typeof CodeCard>[0]) {
  return CodeCard(props) as any;
}

describe('CodeCard', () => {
  it('splits code into lines correctly', () => {
    const el = renderCard({
      content: {
        title: 'Test',
        code: 'line1\nline2\nline3',
        language: 'cpp',
        highlights: [],
      },
    });

    const codeBlock = el.props.children[1];
    const lines = codeBlock.props.children;
    expect(lines).toHaveLength(3);
  });

  it('renders title', () => {
    const el = renderCard({
      content: {
        title: 'My Code',
        code: 'int x = 1;',
        language: 'cpp',
        highlights: [],
      },
    });

    const titleEl = el.props.children[0];
    expect(titleEl.props.children).toBe('My Code');
  });

  it('handles empty line in code', () => {
    const el = renderCard({
      content: {
        title: 'Test',
        code: 'first\n\nthird',
        language: 'cpp',
        highlights: [],
      },
    });

    const codeBlock = el.props.children[1];
    const lines = codeBlock.props.children;
    expect(lines).toHaveLength(3);

    const emptyLine = lines[1];
    const codeText = emptyLine.props.children[1];
    expect(codeText.props.children).toBe(' ');
  });

  it('renders line numbers starting from 1', () => {
    const el = renderCard({
      content: {
        title: 'T',
        code: 'int x = 1;\nint y = 2;',
        language: 'cpp',
        highlights: [],
      },
    });

    const codeBlock = el.props.children[1];
    const lines = codeBlock.props.children;
    expect(lines[0].props.children[0].props.children).toBe(1);
    expect(lines[1].props.children[0].props.children).toBe(2);
  });

  it('applies highlight style to highlighted lines', () => {
    const el = renderCard({
      content: {
        title: 'Test',
        code: 'line1\nline2\nline3',
        language: 'cpp',
        highlights: [0, 2],
      },
    });

    const codeBlock = el.props.children[1];
    const lines = codeBlock.props.children;

    const [, h0] = lines[0].props.style; // [base, highlight]
    expect(h0).toBeTruthy();

    const style1 = lines[1].props.style; // [base, false]
    expect(style1[1]).toBeFalsy();

    const [, h2] = lines[2].props.style;
    expect(h2).toBeTruthy();
  });

  it('handles single line code', () => {
    const el = renderCard({
      content: {
        title: 'One-liner',
        code: 'std::cout << "hello";',
        language: 'cpp',
        highlights: [0],
      },
    });

    const codeBlock = el.props.children[1];
    const lines = codeBlock.props.children;
    expect(lines).toHaveLength(1);
  });
});
