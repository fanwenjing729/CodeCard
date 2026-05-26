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

import ConceptCard from './ConceptCard';

function renderCard(props: Parameters<typeof ConceptCard>[0]) {
  return ConceptCard(props) as any;
}

describe('ConceptCard', () => {
  it('renders title and body', () => {
    const el = renderCard({ content: { title: 'Hello World', body: 'This is the body.' } });
    const titleEl = el.props.children[0];
    const bodyEl = el.props.children[1];
    expect(titleEl.props.children).toBe('Hello World');
    expect(bodyEl.props.children).toBe('This is the body.');
  });

  it('renders multiline body', () => {
    const el = renderCard({ content: { title: 'Multi', body: 'Line 1\nLine 2' } });
    const bodyEl = el.props.children[1];
    expect(bodyEl.props.children).toBe('Line 1\nLine 2');
  });

  it('renders with empty body', () => {
    const el = renderCard({ content: { title: 'Just Title', body: '' } });
    const titleEl = el.props.children[0];
    const bodyEl = el.props.children[1];
    expect(titleEl.props.children).toBe('Just Title');
    expect(bodyEl.props.children).toBe('');
  });
});
