import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react-native';
import ConceptCard from './ConceptCard';

describe('ConceptCard', () => {
  it('renders title and body', () => {
    const { getByText } = render(
      <ConceptCard content={{ title: 'Hello World', body: 'This is the body text.' }} />,
    );
    expect(getByText('Hello World')).toBeTruthy();
    expect(getByText('This is the body text.')).toBeTruthy();
  });

  it('renders multiline body', () => {
    const { getByText } = render(
      <ConceptCard
        content={{
          title: 'Multi',
          body: 'Line 1\nLine 2\nLine 3',
        }}
      />,
    );
    expect(getByText('Multi')).toBeTruthy();
    expect(getByText('Line 1\nLine 2\nLine 3')).toBeTruthy();
  });

  it('renders with empty body', () => {
    const { getByText } = render(
      <ConceptCard content={{ title: 'Just Title', body: '' }} />,
    );
    expect(getByText('Just Title')).toBeTruthy();
  });
});
