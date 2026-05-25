import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: Record<string, any>) => styles },
  Text: 'Text' as any,
  View: 'View' as any,
  ScrollView: 'ScrollView' as any,
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
