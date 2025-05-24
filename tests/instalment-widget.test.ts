import { expect, test } from 'vitest';
import { waitFor, within } from '@testing-library/dom';
import '../src/main';
import { type InstalmentAPIResponse } from '../src/models/instalment';
import { createInstalment, mockGet } from './utils';

test('Can select 3 instalment payment', async () => {
  const productValue = 15000;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [createInstalment(3, 5300, '53,00 €'), createInstalment(6, 2800, '28,00 €')]
  );

  const screen = await render(productValue);

  expect(
    screen.getByRole('option', { name: '3 cuotas de 53,00 €/mes' })
  ).toBeVisible();
});

test('Can select 6 instalment payment', async () => {
  const productValue = 15000;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [createInstalment(3, 5300, '53,00 €'), createInstalment(6, 2800, '28,00 €')]
  );

  const screen = await render(productValue);

  expect(
    screen.getByRole('option', { name: '6 cuotas de 28,00 €/mes' })
  ).toBeVisible();
});

test('Can select 12 installments payment', async () => {
  const productValue = 190123;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [
      createInstalment(3, 5300, '53,00 €'),
      createInstalment(6, 2800, '28,00 €'),
      createInstalment(12, 1550, '15,50 €'),
    ]
  );

  const screen = await render(190123);

  expect(
    screen.getByRole('option', { name: '12 cuotas de 15,50 €/mes' })
  ).toBeVisible();
});

test('Render installments options label', async () => {
  const productValue = 15000;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [createInstalment(3, 5300, '53,00 €'), createInstalment(6, 2800, '28,00 €')]
  );

  const screen = await render(productValue);

  expect(screen.getByLabelText('Págalo en')).toBeVisible();
});

test('Render installment details button', async () => {
  const productValue = 15000;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [createInstalment(3, 5300, '53,00 €'), createInstalment(6, 2800, '28,00 €')]
  );

  const screen = await render(productValue);

  expect(screen.getByRole('button', { name: 'Más info' })).toBeVisible();
});

test('Calculate instalment based on product value', async () => {
  const productValue = 190123;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [
      createInstalment(3, 5300, '53,00 €'),
      createInstalment(6, 2800, '28,00 €'),
      createInstalment(12, 1550, '15,50 €'),
    ]
  );

  const screen = await render(productValue);

  expect(screen.getAllByRole('option')).toHaveLength(3);
});

/**
 * Custom render helper for testing the <sequra-instalment-widget> Web Component.
 *
 * This utility was created to work around limitations in standard testing tools
 * (like Testing Library) which do not natively support querying inside the
 * shadow DOM of Web Components.
 */
async function render(productValue: number) {
  document.body.innerHTML = `<sequra-instalment-widget value="${productValue}"></sequra-instalment-widget>`;
  const element = document.body.querySelector('sequra-instalment-widget')!;
  const shadowRoot = element.shadowRoot!;

  await waitFor(async () => {
    // Wait for the shadow DOM to be populated
    expect(shadowRoot.querySelector('form')).toBeTruthy();
  });

  return within(shadowRoot.querySelector('form') as HTMLFormElement);
}
