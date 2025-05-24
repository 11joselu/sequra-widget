import { expect, test } from 'vitest';
import { within } from '@testing-library/dom';
import '../src/main';

test('Can select 3 instalment payment', () => {
  const screen = render();

  expect(
    screen.getByRole('option', { name: '3 cuotas de 53,00 €/mes' })
  ).toBeVisible();
});

test('Can select 6 instalment payment', () => {
  const screen = render();

  expect(
    screen.getByRole('option', { name: '6 cuotas de 28,00 €/mes' })
  ).toBeVisible();
});

test('Can select 12 installments payment', () => {
  const screen = render();

  expect(
    screen.getByRole('option', { name: '12 cuotas de 15,50 €/mes' })
  ).toBeVisible();
});

test('Render installments options label', () => {
  const screen = render();

  expect(screen.getByLabelText('Págalo en')).toBeVisible();
});

test('Render installment details button', () => {
  const screen = render();

  expect(screen.getByRole('button', { name: 'Más info' })).toBeVisible();
});

/**
 * Custom render helper for testing the <sequra-instalment-widget> Web Component.
 *
 * This utility was created to work around limitations in standard testing tools
 * (like Testing Library) which do not natively support querying inside the
 * shadow DOM of Web Components.
 */
function render() {
  document.body.innerHTML = `<sequra-instalment-widget></sequra-instalment-widget>`;
  const element = document.body.querySelector('sequra-instalment-widget')!;
  const shadowRoot = element.shadowRoot!;

  return within(shadowRoot.firstChild as HTMLElement);
}
