import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react-native';
import CodeCard from './CodeCard';

describe('CodeCard', () => {
  it('renders title and code lines', () => {
    const { getByText } = render(
      <CodeCard
        content={{
          title: 'Hello Program',
          code: '#include <iostream>\nint main() {\n  return 0;\n}',
          language: 'cpp',
          highlights: [],
        }}
      />,
    );
    expect(getByText('Hello Program')).toBeTruthy();
    expect(getByText('#include <iostream>')).toBeTruthy();
    expect(getByText('int main() {')).toBeTruthy();
    expect(getByText('  return 0;')).toBeTruthy();
  });

  it('renders line numbers starting from 1', () => {
    const { getByText } = render(
      <CodeCard
        content={{
          title: 'Test',
          code: 'line one',
          language: 'cpp',
          highlights: [],
        }}
      />,
    );
    expect(getByText('1')).toBeTruthy();
  });

  it('renders empty line as space', () => {
    const { getByText } = render(
      <CodeCard
        content={{
          title: 'Test',
          code: 'first\n\nthird',
          language: 'cpp',
          highlights: [],
        }}
      />,
    );
    expect(getByText(' ')).toBeTruthy();
  });

  it('renders single line code', () => {
    const { getByText } = render(
      <CodeCard
        content={{
          title: 'One-liner',
          code: 'std::cout << "hello";',
          language: 'cpp',
          highlights: [0],
        }}
      />,
    );
    expect(getByText('One-liner')).toBeTruthy();
    expect(getByText('std::cout << "hello";')).toBeTruthy();
  });

  it('renders with no highlights', () => {
    const code = 'int x = 1;\nint y = 2;';
    const { getByText } = render(
      <CodeCard content={{ title: 'T', code, language: 'cpp', highlights: [] }} />,
    );
    expect(getByText('int x = 1;')).toBeTruthy();
    expect(getByText('int y = 2;')).toBeTruthy();
  });
});
