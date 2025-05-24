import { expect, test } from 'vitest';
import {
  type InstalmentAPIResponse,
  toInstalment,
} from '../src/models/instalment';

test('Convert api response to instalment model', () => {
  const instalment = toInstalment(createInstalment(3, 5300, '53,00 €'));

  expect(instalment.count).toBe(3);
  expect(instalment.amount.value).toBe(5300);
  expect(instalment.amount.string).toBe('53,00 €');
});

function createInstalment(
  instalmentCount: number,
  totalWithTax: number,
  totalWithTaxCentsString: string
): InstalmentAPIResponse {
  return {
    instalment_count: instalmentCount,
    total_with_tax: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
    instalment_amount: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
    instalment_fee: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
    instalment_total: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
    grand_total: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
    cost_of_credit: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
    cost_of_credit_pct: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
    apr: { value: totalWithTax, string: totalWithTaxCentsString },
    max_financed_amount: {
      value: totalWithTax,
      string: totalWithTaxCentsString,
    },
  };
}
