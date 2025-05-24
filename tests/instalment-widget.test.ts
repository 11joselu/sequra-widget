import { beforeEach, describe, expect, test, vi } from 'vitest';
import '../src/main';
import { type InstalmentAPIResponse } from '../src/models/instalment';
import { createInstalment, mockGet } from './utils';
import * as getInstalmentByProductPriceModule from '../src/services/get-instalment-by-product-price';
import { userEvent } from '@testing-library/user-event';
import { render, renderWithoutWaitForRequest } from './renderer';

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

  const screen = await render(productValue);
  await user.click(screen.getByRole('button', { name: 'Más info' }));

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

  const screen = await render(productValue);
  await user.click(screen.getByRole('button', { name: 'Más info' }));
  await user.click(screen.getByRole('button', { name: 'Más info' }));
  await user.click(screen.getByRole('button', { name: 'Más info' }));

  expect(
    screen.getAllByText(
      'Además en el importe mostrado ya se incluye la cuota única mensual de 5 €/mes, por lo que no tendrás ningun sorpresas.'
    )
  ).toHaveLength(1);
});

test('Can view instalment fee after changing instalments select inside modal', async () => {
  const productValue = 190123;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [
      createInstalment(3, 5300, '53,00 €', 500, '8 €'),
      createInstalment(6, 2800, '28,00 €', 700, '7 €'),
    ]
  );
  const user = userEvent.setup();

  const screen = await render(productValue);
  await user.selectOptions(screen.getByLabelText('Págalo en'), ['6']);
  await user.click(screen.getByRole('button', { name: 'Más info' }));

  expect(
    screen.getByText(
      'Además en el importe mostrado ya se incluye la cuota única mensual de 7 €/mes, por lo que no tendrás ningun sorpresas.'
    )
  ).toBeVisible();
});

test('Switching instalment can see an updated fee in a modal', async () => {
  const productValue = 190123;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [
      createInstalment(3, 5300, '53,00 €', 500, '8 €'),
      createInstalment(6, 2800, '28,00 €', 700, '7 €'),
    ]
  );
  const user = userEvent.setup();

  const screen = await render(productValue);
  await user.selectOptions(screen.getByLabelText('Págalo en'), ['6']);
  await user.selectOptions(screen.getByLabelText('Págalo en'), ['3']);
  await user.click(screen.getByRole('button', { name: 'Más info' }));

  expect(
    screen.getByText(
      'Además en el importe mostrado ya se incluye la cuota única mensual de 8 €/mes, por lo que no tendrás ningun sorpresas.'
    )
  ).toBeVisible();
});
