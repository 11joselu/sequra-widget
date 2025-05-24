import { expect, test } from 'vitest';
import { getInstalmentByProductPrice } from '../src/services/get-instalment-by-product-price';

test('Get 3 and 6 instalment as a payment options', async () => {
  const instalment = getInstalmentByProductPrice(190123);

  expect(instalment).toHaveLength(3);
  expect(instalment[0].count).toBe(3);
  expect(instalment[0].amount.string).toBe('53,00 €');
  expect(instalment[1].count).toBe(6);
  expect(instalment[1].amount.string).toBe('28,00 €');
  expect(instalment[2].count).toBe(12);
  expect(instalment[2].amount.string).toBe('15,50 €');
});

test('Get 3, 6 and 12 instalment as a payment options', async () => {
  const instalment = getInstalmentByProductPrice(15000);

  expect(instalment).toHaveLength(2);
  expect(instalment[0].count).toBe(3);
  expect(instalment[0].amount.string).toBe('53,00 €');
  expect(instalment[1].count).toBe(6);
  expect(instalment[1].amount.string).toBe('28,00 €');
});
