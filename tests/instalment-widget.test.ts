import { expect, test } from 'vitest';
import { within } from '@testing-library/dom';
import '../src/main';

test('Can select 3 installments payment', () => {
  const screen = render();

  expect(
    screen.getByRole('option', { name: '3 cuotas de 53,00 €/mes' })
  ).toBeVisible();
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
