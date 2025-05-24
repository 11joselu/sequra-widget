import { expect, test } from 'vitest';
import { screen } from '@testing-library/dom';

test('example.test.ts', () => {
  document.body.innerHTML = 'Hello World';

  expect(screen.getByText('Hello World')).toBeVisible();
});
