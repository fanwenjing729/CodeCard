import { describe, it, expect } from 'vitest';
import { quizReducer, type QuizState, type QuizAction } from './quizReducer';

function fresh(): QuizState {
  return { index: 0, score: 0, done: false, submitted: false, selected: null, fillAnswer: '' };
}

function dispatch(state: QuizState, ...actions: QuizAction[]): QuizState {
  return actions.reduce((s, a) => quizReducer(s, a), state);
}

// ─── SELECT / FILL ─────────────────────────────────────────
describe('SELECT', () => {
  it('sets selected option', () => {
    const s = fresh();
    const next = quizReducer(s, { type: 'SELECT', value: 'A' });
    expect(next.selected).toBe('A');
    expect(next.fillAnswer).toBe('');
    expect(next.submitted).toBe(false);
  });

  it('replaces previous selection', () => {
    const s = { ...fresh(), selected: 'A' };
    const next = quizReducer(s, { type: 'SELECT', value: 'B' });
    expect(next.selected).toBe('B');
  });
});

describe('FILL', () => {
  it('sets fill answer', () => {
    const s = fresh();
    const next = quizReducer(s, { type: 'FILL', value: 'hello' });
    expect(next.fillAnswer).toBe('hello');
    expect(next.selected).toBeNull();
    expect(next.submitted).toBe(false);
  });

  it('replaces previous fill answer', () => {
    const s = { ...fresh(), fillAnswer: 'old' };
    const next = quizReducer(s, { type: 'FILL', value: 'new' });
    expect(next.fillAnswer).toBe('new');
  });
});

// ─── SUBMIT / SCORE ────────────────────────────────────────
describe('SUBMIT', () => {
  it('sets submitted to true', () => {
    const s = { ...fresh(), selected: 'A' };
    const next = quizReducer(s, { type: 'SUBMIT' });
    expect(next.submitted).toBe(true);
    expect(next.selected).toBe('A');
  });
});

describe('SCORE', () => {
  it('increments score', () => {
    const s = fresh();
    const next = quizReducer(s, { type: 'SCORE' });
    expect(next.score).toBe(1);
  });

  it('accumulates across multiple correct answers', () => {
    const s = fresh();
    const after = dispatch(
      s,
      { type: 'SCORE' },
      { type: 'NEXT', nextIndex: 1 },
      { type: 'SCORE' },
      { type: 'NEXT', nextIndex: 2 },
      { type: 'SCORE' },
    );
    expect(after.score).toBe(3);
  });
});

// ─── NEXT ──────────────────────────────────────────────────
describe('NEXT', () => {
  it('advances index and resets answer state', () => {
    const s = { ...fresh(), submitted: true, selected: 'A', fillAnswer: 'hello' };
    const next = quizReducer(s, { type: 'NEXT', nextIndex: 1 });
    expect(next.index).toBe(1);
    expect(next.submitted).toBe(false);
    expect(next.selected).toBeNull();
    expect(next.fillAnswer).toBe('');
    expect(next.score).toBe(0);
  });

  it('advances through multiple questions', () => {
    const s = fresh();
    const after = dispatch(s, { type: 'NEXT', nextIndex: 3 });
    expect(after.index).toBe(3);
  });
});

// ─── DONE / RESET ──────────────────────────────────────────
describe('DONE', () => {
  it('sets done to true', () => {
    const s = fresh();
    const next = quizReducer(s, { type: 'DONE' });
    expect(next.done).toBe(true);
  });

  it('preserves score when done', () => {
    const s = { ...fresh(), score: 5 };
    const next = quizReducer(s, { type: 'DONE' });
    expect(next.score).toBe(5);
    expect(next.done).toBe(true);
  });
});

describe('RESET', () => {
  it('returns state to initial values', () => {
    const s: QuizState = {
      index: 3,
      score: 5,
      done: false,
      submitted: true,
      selected: 'B',
      fillAnswer: 'something',
    };
    const next = quizReducer(s, { type: 'RESET' });
    expect(next).toEqual(fresh());
  });
});

// ─── Full quiz flow (integration) ──────────────────────────
describe('full quiz flow', () => {
  it('choice quiz: select → submit → next → select → submit → done', () => {
    let s = fresh();
    s = quizReducer(s, { type: 'SELECT', value: 'A' });
    expect(s.selected).toBe('A');
    s = quizReducer(s, { type: 'SUBMIT' });
    expect(s.submitted).toBe(true);
    s = quizReducer(s, { type: 'SCORE' });
    expect(s.score).toBe(1);
    s = quizReducer(s, { type: 'NEXT', nextIndex: 1 });
    expect(s.index).toBe(1);
    expect(s.submitted).toBe(false);
    expect(s.selected).toBeNull();

    s = quizReducer(s, { type: 'SELECT', value: 'C' });
    s = quizReducer(s, { type: 'SUBMIT' });
    s = quizReducer(s, { type: 'SCORE' });
    expect(s.score).toBe(2);
    s = quizReducer(s, { type: 'DONE' });
    expect(s.done).toBe(true);
    expect(s.score).toBe(2);
  });

  it('fill quiz: type → submit → correct score', () => {
    let s = fresh();
    s = quizReducer(s, { type: 'FILL', value: '42' });
    s = quizReducer(s, { type: 'SUBMIT' });
    s = quizReducer(s, { type: 'SCORE' });
    expect(s.score).toBe(1);
  });
});
