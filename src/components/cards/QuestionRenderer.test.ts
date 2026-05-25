import { describe, it, expect, vi } from 'vitest';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: Record<string, any>) => styles },
  Text: 'Text' as any,
  View: 'View' as any,
  TouchableOpacity: 'TouchableOpacity' as any,
  TextInput: 'TextInput' as any,
  ScrollView: 'ScrollView' as any,
}));

import { normalize, isCorrectAnswer } from './QuestionRenderer';

// ─── normalize ──────────────────────────────────────────────
describe('normalize', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalize('  hello  ')).toBe('hello');
  });

  it('converts to lowercase', () => {
    expect(normalize('Hello')).toBe('hello');
    expect(normalize('HELLO')).toBe('hello');
    expect(normalize('HeLLo')).toBe('hello');
  });

  it('collapses internal whitespace', () => {
    expect(normalize('hello   world')).toBe('helloworld');
    expect(normalize('hello\tworld')).toBe('helloworld');
    expect(normalize('hello\nworld')).toBe('helloworld');
  });

  it('handles empty string', () => {
    expect(normalize('')).toBe('');
  });

  it('handles whitespace-only string', () => {
    expect(normalize('   ')).toBe('');
    expect(normalize('\n\t  ')).toBe('');
  });

  it('handles Chinese characters', () => {
    expect(normalize('你好 世界')).toBe('你好世界');
    expect(normalize('你好World')).toBe('你好world');
  });

  it('handles special characters', () => {
    expect(normalize('int&  ')).toBe('int&');
    expect(normalize('  *ptr')).toBe('*ptr');
    expect(normalize('a<b')).toBe('a<b');
  });

  it('handles mixed spaces in code answers', () => {
    expect(normalize('int  main')).toBe('intmain');
    expect(normalize('std::cout')).toBe('std::cout');
  });
});

// ─── isCorrectAnswer ────────────────────────────────────────
describe('isCorrectAnswer', () => {
  it('exact match returns true', () => {
    expect(isCorrectAnswer('hello', 'hello')).toBe(true);
  });

  it('case insensitive match returns true', () => {
    expect(isCorrectAnswer('Hello', 'hello')).toBe(true);
    expect(isCorrectAnswer('HELLO', 'hello')).toBe(true);
  });

  it('ignores leading/trailing whitespace', () => {
    expect(isCorrectAnswer('  hello  ', 'hello')).toBe(true);
    expect(isCorrectAnswer('hello', '  hello  ')).toBe(true);
  });

  it('ignores internal whitespace differences', () => {
    expect(isCorrectAnswer('int  main', 'intmain')).toBe(true);
    expect(isCorrectAnswer('int\tmain', 'intmain')).toBe(true);
  });

  it('mismatch returns false', () => {
    expect(isCorrectAnswer('world', 'hello')).toBe(false);
  });

  it('null userAnswer returns false with non-empty answer', () => {
    expect(isCorrectAnswer(null, 'hello')).toBe(false);
  });

  it('empty userAnswer vs empty correctAnswer returns true', () => {
    expect(isCorrectAnswer('', '')).toBe(true);
  });

  it('handles C++ code snippet answers', () => {
    expect(isCorrectAnswer('std::string', 'std::string')).toBe(true);
    expect(isCorrectAnswer('s.length()', 's.length()')).toBe(true);
    expect(isCorrectAnswer('\n', '\\n')).toBe(false);
  });

  it('handles numeric answers', () => {
    expect(isCorrectAnswer('  5  ', '5')).toBe(true);
    expect(isCorrectAnswer('5.0', '5')).toBe(false);
  });

  it('handles Chinese answer comparison', () => {
    expect(isCorrectAnswer('  你好  ', '你好')).toBe(true);
    expect(isCorrectAnswer('你好', '你好世界')).toBe(false);
  });
});
