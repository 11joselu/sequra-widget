import {
  type InstalmentAPIResponse,
  toInstalment,
} from '../models/instalment.ts';

export function getInstalmentByProductPrice(productValue: number) {
  if (productValue === 15000) {
    return [
      toInstalment(createInstalment(3, 5300, '53,00 €')),
      toInstalment(createInstalment(6, 2800, '28,00 €')),
    ];
  } else {
    return [
      toInstalment(createInstalment(3, 5300, '53,00 €')),
      toInstalment(createInstalment(6, 2800, '28,00 €')),
      toInstalment(createInstalment(12, 1550, '15,50 €')),
    ];
  }
}

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
