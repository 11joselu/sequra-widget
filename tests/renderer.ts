import { waitFor, within } from '@testing-library/dom';
import { expect } from 'vitest';

/**
 * Custom render helper for testing the <sequra-instalment-widget> Web Component.
 *
 * This utility was created to work around limitations in standard testing tools
 * (like Testing Library) which do not natively support querying inside the
 * shadow DOM of Web Components.
 */
export async function render(productValue: number, id?: string) {
  const shadowRoot = renderSequraTag(productValue, id);

  await waitFor(async () => {
    // Wait for the shadow DOM to be populated
    expect(shadowRoot.querySelector('form')).toBeTruthy();
  });

  return within(shadowRoot.lastElementChild as HTMLDivElement);
}

export function renderWithoutWaitForRequest(productValue: number) {
  const shadowRoot = renderSequraTag(productValue);

  return within(shadowRoot.lastElementChild as HTMLDivElement);
}

export async function renderWidgetWhenRequestReturnsError(
  productValue: number,
  id?: string
) {
  const shadowRoot = renderSequraTag(productValue, id);

  await waitFor(async () => {
    // Wait for the shadow DOM to be populated
    expect(
      shadowRoot.querySelector('[data-testid="error-message"]')
    ).toBeTruthy();
  });

  return within(shadowRoot.lastElementChild as HTMLDivElement);
}

function renderSequraTag(productValue: number, id?: string) {
  document.body.innerHTML = `<sequra-instalment-widget value="${productValue}" id="${id}"></sequra-instalment-widget>`;
  const element = document.body.querySelector('sequra-instalment-widget')!;

  return element.shadowRoot!;
}
