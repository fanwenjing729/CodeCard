import { describe, it, expect } from 'vitest';
import { courses } from './index';
import type { Card, Course, PathNode } from '@/types';

// ─── helper ────────────────────────────────────────────────
function allCards(): { courseId: string; nodeId: string; card: Card }[] {
  const result: { courseId: string; nodeId: string; card: Card }[] = [];
  for (const course of courses) {
    for (const node of course.nodes) {
      for (const card of node.cards) {
        result.push({ courseId: course.id, nodeId: node.id, card });
      }
    }
  }
  return result;
}

function allNodes(): { courseId: string; node: PathNode }[] {
  const result: { courseId: string; node: PathNode }[] = [];
  for (const course of courses) {
    for (const node of course.nodes) {
      result.push({ courseId: course.id, node });
    }
  }
  return result;
}

// ─── card ID uniqueness (global) ───────────────────────────
describe('card IDs', () => {
  it('all card IDs are globally unique', () => {
    const cards = allCards();
    const ids = cards.map((c) => c.card.id);
    const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dups).toEqual([]);
  });

  it('all card IDs are non-empty', () => {
    const cards = allCards();
    for (const { card } of cards) {
      expect(card.id.length).toBeGreaterThan(0);
    }
  });

  it('card IDs match course prefix', () => {
    const cards = allCards();
    for (const { courseId, card } of cards) {
      expect(card.id.startsWith(`${courseId}-`)).toBe(true);
    }
  });
});

// ─── node ID uniqueness ────────────────────────────────────
describe('node IDs', () => {
  it('all node IDs are globally unique', () => {
    const nodes = allNodes();
    const ids = nodes.map((n) => n.node.id);
    const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dups).toEqual([]);
  });

  it('all node IDs are non-empty', () => {
    const nodes = allNodes();
    for (const { node } of nodes) {
      expect(node.id.length).toBeGreaterThan(0);
    }
  });

  it('node IDs match courseId', () => {
    const nodes = allNodes();
    for (const { courseId, node } of nodes) {
      expect(node.id.startsWith(`${courseId}-`)).toBe(true);
      expect(node.courseId).toBe(courseId);
    }
  });
});

// ─── node required fields ──────────────────────────────────
describe('node fields', () => {
  it('all nodes have required string fields', () => {
    const nodes = allNodes();
    for (const { node } of nodes) {
      expect(typeof node.id).toBe('string');
      expect(typeof node.courseId).toBe('string');
      expect(typeof node.moduleId).toBe('string');
      expect(typeof node.module).toBe('string');
      expect(typeof node.title).toBe('string');
    }
  });

  it('all nodes have valid type', () => {
    const nodes = allNodes();
    for (const { node } of nodes) {
      expect(['knowledge', 'quiz']).toContain(node.type);
    }
  });

  it('all nodes have cards array (even if empty)', () => {
    const nodes = allNodes();
    for (const { node } of nodes) {
      expect(Array.isArray(node.cards)).toBe(true);
    }
  });
});

// ─── card required fields ──────────────────────────────────
describe('card fields', () => {
  it('all cards have valid cardType', () => {
    const cards = allCards();
    for (const { card } of cards) {
      expect(['concept', 'code', 'animation', 'practice']).toContain(card.cardType);
    }
  });

  it('concept cards have title and body', () => {
    const cards = allCards().filter((c) => c.card.cardType === 'concept');
    for (const { card } of cards) {
      expect(typeof card.content.title).toBe('string');
      expect(card.content.title.length).toBeGreaterThan(0);
      expect(typeof (card.content as any).body).toBe('string');
    }
  });

  it('code cards have title, code, language, highlights', () => {
    const cards = allCards().filter((c) => c.card.cardType === 'code');
    for (const { card } of cards) {
      const c = card.content as any;
      expect(typeof c.title).toBe('string');
      expect(typeof c.code).toBe('string');
      expect(typeof c.language).toBe('string');
      expect(Array.isArray(c.highlights)).toBe(true);
    }
  });

  it('animation cards have animationId', () => {
    const cards = allCards().filter((c) => c.card.cardType === 'animation');
    for (const { card } of cards) {
      expect(typeof card.content.animationId).toBe('string');
      expect(card.content.animationId.length).toBeGreaterThan(0);
    }
  });

  it('practice cards have question, answer, explanation', () => {
    const cards = allCards().filter((c) => c.card.cardType === 'practice');
    for (const { card } of cards) {
      const c = card.content as any;
      expect(typeof c.question).toBe('string');
      expect(typeof c.answer).toBe('string');
      expect(typeof c.explanation).toBe('string');
      expect(['choice', 'fill']).toContain(c.questionType);
    }
  });

  it('choice practice cards have options array with at least 2 items', () => {
    const cards = allCards().filter(
      (c) => c.card.cardType === 'practice' && c.card.content.questionType === 'choice',
    );
    for (const { card } of cards) {
      expect(Array.isArray(card.content.options)).toBe(true);
      expect(card.content.options!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('fill practice cards have no options or empty options', () => {
    const cards = allCards().filter(
      (c) => c.card.cardType === 'practice' && c.card.content.questionType === 'fill',
    );
    for (const { card } of cards) {
      const hasOpts = card.content.options != null && card.content.options.length > 0;
      expect(hasOpts).toBe(false);
    }
  });
});

// ─── course structure ──────────────────────────────────────
describe('course structure', () => {
  it('courses array is non-empty', () => {
    expect(courses.length).toBeGreaterThan(0);
  });

  it('each course has required fields', () => {
    for (const course of courses) {
      expect(typeof course.id).toBe('string');
      expect(typeof course.title).toBe('string');
      expect(typeof course.icon).toBe('string');
      expect(typeof course.color).toBe('string');
      expect(Array.isArray(course.nodes)).toBe(true);
      expect(typeof course.moduleCount).toBe('number');
      expect(Array.isArray(course.modulesMeta)).toBe(true);
    }
  });
});
