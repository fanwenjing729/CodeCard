import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import type { Card } from '@/types';

vi.mock('@/data/animations', () => ({
  getAnimScenario: vi.fn((id: string) => {
    if (id === 'test-anim') return { id: 'test-anim', title: 'Test', totalSteps: 3 };
    return undefined;
  }),
  getAnimComponent: vi.fn((id: string) => {
    if (id === 'test-anim') return vi.fn();
    return null;
  }),
}));

vi.mock('./ConceptCard', () => ({ default: (() => null) as React.FC<any> }));
vi.mock('./CodeCard', () => ({ default: (() => null) as React.FC<any> }));
vi.mock('./PracticeCard', () => ({ default: (() => null) as React.FC<any> }));

import renderCard from './renderCard';

const baseProps = {
  animStep: 0,
  onPracticeComplete: vi.fn(),
  onPracticeNext: vi.fn(),
  isLast: false,
};

// ─── card type dispatch ────────────────────────────────────
describe('renderCard', () => {
  it('renders ConceptCard for concept type', () => {
    const card: Card = {
      id: 'c1',
      cardType: 'concept',
      content: { title: 'Test', body: 'Body' },
    };
    const el = renderCard({ ...baseProps, card });
    expect(el).not.toBeNull();
    expect(el!.key).toBe('c1');
  });

  it('renders CodeCard for code type', () => {
    const card: Card = {
      id: 'c2',
      cardType: 'code',
      content: { title: 'Test', code: 'int main() {}', language: 'cpp', highlights: [] },
    };
    const el = renderCard({ ...baseProps, card });
    expect(el).not.toBeNull();
    expect(el!.key).toBe('c2');
  });

  it('renders animation component for valid animation card', () => {
    const card: Card = {
      id: 'anim1',
      cardType: 'animation',
      content: { animationId: 'test-anim' },
    };
    const el = renderCard({ ...baseProps, card });
    expect(el).not.toBeNull();
    expect(el!.key).toBe('anim1');
  });

  it('returns null for unknown animationId', () => {
    const card: Card = {
      id: 'anim2',
      cardType: 'animation',
      content: { animationId: 'nonexistent' },
    };
    const el = renderCard({ ...baseProps, card });
    expect(el).toBeNull();
  });

  it('renders PracticeCard for practice type', () => {
    const card: Card = {
      id: 'p1',
      cardType: 'practice',
      content: {
        question: 'Q?',
        questionType: 'choice',
        options: ['A', 'B'],
        answer: 'A',
        explanation: 'Because.',
      },
    };
    const el = renderCard({ ...baseProps, card });
    expect(el).not.toBeNull();
    expect(el!.key).toBe('p1');
  });

  it('passes isLast to PracticeCard', () => {
    const card: Card = {
      id: 'p2',
      cardType: 'practice',
      content: {
        question: 'Q?',
        questionType: 'fill',
        answer: 'ok',
        explanation: '...',
      },
    };
    const el = renderCard({ ...baseProps, card, isLast: true });
    expect(el).not.toBeNull();
    const props = (el as any).props;
    expect(props.isLast).toBe(true);
  });
});
