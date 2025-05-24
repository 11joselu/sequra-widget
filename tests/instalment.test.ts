import { expect, test } from 'vitest';
import { toInstalment } from '../src/models/instalment';
import { createInstalment } from './utils';

test('Convert api response to instalment model', () => {
  const instalment = toInstalment(
    createInstalment(3, 5300, '53,00 €', 500, '5 €')
  );

  expect(instalment.count).toBe(3);
  expect(instalment.amount.value).toBe(5300);
  expect(instalment.amount.string).toBe('53,00 €');
  expect(instalment.fee.value).toBe(500);
  expect(instalment.fee.string).toBe('5 €');
});
