import { expect, test } from 'vitest';
import { getInstalmentByProductPrice } from '../src/services/get-instalment-by-product-price';
import { createInstalment, mockGet } from './utils';
import { type InstalmentAPIResponse } from '../src/models/instalment';

test('Get 3 and 6 instalment as a payment options', async () => {
  const productValue = 190123;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [
      createInstalment(3, 5300, '53,00 €'),
      createInstalment(6, 2800, '28,00 €'),
      createInstalment(12, 1550, '15,50 €'),
    ]
  );

  const instalment = await getInstalmentByProductPrice(productValue);

  expect(instalment).toHaveLength(3);
  expect(instalment[0].count).toBe(3);
  expect(instalment[0].amount.string).toBe('53,00 €');
  expect(instalment[1].count).toBe(6);
  expect(instalment[1].amount.string).toBe('28,00 €');
  expect(instalment[2].count).toBe(12);
  expect(instalment[2].amount.string).toBe('15,50 €');
});

test('Get 3, 6 and 12 instalment as a payment options', async () => {
  const productValue = 15000;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [createInstalment(3, 5300, '53,00 €'), createInstalment(6, 2800, '28,00 €')]
  );

  const instalment = await getInstalmentByProductPrice(productValue);

  expect(instalment).toHaveLength(2);
  expect(instalment[0].count).toBe(3);
  expect(instalment[0].amount.string).toBe('53,00 €');
  expect(instalment[1].count).toBe(6);
  expect(instalment[1].amount.string).toBe('28,00 €');
});

test('Throws error when instalment loading fails', async () => {
  const productValue = 15000;
  mockGet<InstalmentAPIResponse[]>(
    `/credit_agreements?totalWithTax=${productValue}`,
    [],
    500
  );

  await expect(getInstalmentByProductPrice(productValue)).rejects.toThrow(
    `Failed to fetch instalments for product value ${productValue}: Internal Server Error`
  );
});
