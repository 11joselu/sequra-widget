import { beforeEach, describe, expect, test, vi } from 'vitest';
import { waitFor, within } from '@testing-library/dom';
import '../src/main';
import { type InstalmentAPIResponse } from '../src/models/instalment';
import { createInstalment, mockGet } from './utils';
import * as getInstalmentByProductPriceModule from '../src/services/get-instalment-by-product-price';
import { userEvent } from '@testing-library/user-event';

describe('Render', () => {
  const productValue = 190123;
  beforeEach(async () => {
    mockGet<InstalmentAPIResponse[]>(
      `/credit_agreements?totalWithTax=${productValue}`,
      [
        createInstalment(3, 5300, '53,00 €'),
        createInstalment(6, 2800, '28,00 €'),
        createInstalment(12, 1550, '15,50 €'),
      ]
    );
  });

  test('instalments options based on product value', async () => {
    const screen = await render(productValue);

    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(
      screen.getByRole('option', { name: '3 cuotas de 53,00 €/mes' })
    ).toBeVisible();
    expect(
      screen.getByRole('option', { name: '6 cuotas de 28,00 €/mes' })
    ).toBeVisible();
    expect(
      screen.getByRole('option', { name: '12 cuotas de 15,50 €/mes' })
    ).toBeVisible();
  });

  test('installments options label', async () => {
    const screen = await render(productValue);

    expect(screen.getByLabelText('Págalo en')).toBeVisible();
  });

  test('installment details button', async () => {
    const screen = await render(productValue);

    expect(screen.getByRole('button', { name: 'Más info' })).toBeVisible();
  });
});

describe('Fetch instalments', () => {
  const productValue = 11111;
  beforeEach(async () => {
    vi.spyOn(getInstalmentByProductPriceModule, 'getInstalmentByProductPrice');
    mockGet<InstalmentAPIResponse[]>(
      `/credit_agreements?totalWithTax=${productValue}`,
      [createInstalment(3, 5300, '53,00 €')]
    );
  });
  test('Fetch instalment with given productValue', async () => {
    await render(productValue);

    expect(
      getInstalmentByProductPriceModule.getInstalmentByProductPrice
    ).toHaveBeenCalledWith(11111);
  });

  test('Shows loading when instalments are fetching', async () => {
    const screen = await renderWithoutWaitForRequest(productValue);

    expect(screen.getByText('Cargando...')).toBeVisible();
  });
});

test('Can see instalment details in a modal', async () => {
  const productValue = 190123;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [createInstalment(3, 5300, '53,00 €', 500, '5 €')]
  );
  const user = userEvent.setup();

  let screen = await render(productValue);
  await user.click(screen.getByRole('button', { name: 'Más info' }));
  screen = refreshScreenBind();

  expect(
    screen.getByText(
      'Además en el importe mostrado ya se incluye la cuota única mensual de 5 €/mes, por lo que no tendrás ningun sorpresas.'
    )
  ).toBeVisible();
});

test('Can see only one instalment details modal when I click multiple times', async () => {
  const productValue = 190123;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [createInstalment(3, 5300, '53,00 €', 500, '5 €')]
  );
  const user = userEvent.setup();

  let screen = await render(productValue);
  await user.click(screen.getByRole('button', { name: 'Más info' }));
  await user.click(screen.getByRole('button', { name: 'Más info' }));
  await user.click(screen.getByRole('button', { name: 'Más info' }));
  screen = refreshScreenBind();

  expect(
    screen.getAllByText(
      'Además en el importe mostrado ya se incluye la cuota única mensual de 5 €/mes, por lo que no tendrás ningun sorpresas.'
    )
  ).toHaveLength(1);
});

/**
 * Custom render helper for testing the <sequra-instalment-widget> Web Component.
 *
 * This utility was created to work around limitations in standard testing tools
 * (like Testing Library) which do not natively support querying inside the
 * shadow DOM of Web Components.
 */
async function render(productValue: number) {
  const shadowRoot = renderSequraTag(productValue);

  await waitFor(async () => {
    // Wait for the shadow DOM to be populated
    expect(shadowRoot.querySelector('form')).toBeTruthy();
  });

  return within(shadowRoot.querySelector('form') as HTMLFormElement);
}

function renderWithoutWaitForRequest(productValue: number) {
  const shadowRoot = renderSequraTag(productValue);

  // @ts-expect-error: Type does not support ShadowRoot
  return within(shadowRoot);
}

function refreshScreenBind() {
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
