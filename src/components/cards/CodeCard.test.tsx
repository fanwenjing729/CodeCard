import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: Record<string, any>) => styles },
  Text: 'Text' as any,
  View: 'View' as any,
  ScrollView: 'ScrollView' as any,
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
