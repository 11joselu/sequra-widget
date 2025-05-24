import { waitFor, within } from '@testing-library/dom';
import { expect } from 'vitest';

/**
 * Custom render helper for testing the <sequra-instalment-widget> Web Component.
 *
 * This utility was created to work around limitations in standard testing tools
 * (like Testing Library) which do not natively support querying inside the
 * shadow DOM of Web Components.
 */
export async function render(productValue: number) {
  const shadowRoot = renderSequraTag(productValue);

  await waitFor(async () => {
    // Wait for the shadow DOM to be populated
    expect(shadowRoot.querySelector('form')).toBeTruthy();
  });

  return within(shadowRoot.querySelector('form') as HTMLFormElement);
}

export function renderWithoutWaitForRequest(productValue: number) {
  const shadowRoot = renderSequraTag(productValue);

  // @ts-expect-error: Type does not support ShadowRoot
  return within(shadowRoot);
}

export function refreshScreenBind() {
  const shadowRoot = findShadowRootOfWidget();

  // @ts-expect-error: Type does not support ShadowRoot
  return within(shadowRoot);
}

function renderSequraTag(productValue: number) {
  document.body.innerHTML = `<sequra-instalment-widget value="${productValue}"></sequra-instalment-widget>`;
  return findShadowRootOfWidget();
}

function findShadowRootOfWidget() {
  const element = document.body.querySelector('sequra-instalment-widget')!;
  return element.shadowRoot!;
}
