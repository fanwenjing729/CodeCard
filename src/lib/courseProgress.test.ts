import { describe, it, expect } from 'vitest';
import { countCards, countNodeCards } from './courseProgress';

const empty = {};

const some = { 'a': true, 'b': true } as Record<string, true>;

describe('countCards', () => {
  it('empty cards → all zeros', () => {
    expect(countCards([], empty)).toEqual({ total: 0, done: 0, pct: 0 });
  });

  it('no completed → done=0, pct=0', () => {
    const cards = [{ id: 'a' }, { id: 'b' }];
    expect(countCards(cards, empty)).toEqual({ total: 2, done: 0, pct: 0 });
  });

  it('partial completion', () => {
    const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(countCards(cards, some)).toEqual({ total: 3, done: 2, pct: 67 });
  });

  it('full completion → pct=100', () => {
    const cards = [{ id: 'a' }, { id: 'b' }];
    expect(countCards(cards, some)).toEqual({ total: 2, done: 2, pct: 100 });
  });

  it('pct rounds to integer', () => {
    const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const one = { 'a': true } as Record<string, true>;
    expect(countCards(cards, one)).toEqual({ total: 3, done: 1, pct: 33 });
  });
});

describe('countNodeCards', () => {
  it('flattens cards from multiple nodes', () => {
    const nodes = [
      { cards: [{ id: 'a' }, { id: 'b' }] },
      { cards: [{ id: 'c' }] },
    ];
    const completed = { 'a': true, 'c': true } as Record<string, true>;
    expect(countNodeCards(nodes, completed)).toEqual({ total: 3, done: 2, pct: 67 });
  });

  it('empty nodes → all zeros', () => {
    expect(countNodeCards([], some)).toEqual({ total: 0, done: 0, pct: 0 });
  });
});
