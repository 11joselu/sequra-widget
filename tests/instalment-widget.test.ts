import { expect, test } from 'vitest';
import { screen } from '@testing-library/dom';
import '../src/main';

test('example.test.ts', () => {
  expect(screen.getByText('Hello World')).toBeVisible();
});
