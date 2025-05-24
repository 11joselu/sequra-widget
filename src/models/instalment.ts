type StringValuePair = { value: number; string: string };
export type InstalmentAPIResponse = {
  instalment_count: number;
  total_with_tax: StringValuePair;
  instalment_amount: StringValuePair;
  instalment_fee: StringValuePair;
  instalment_total: StringValuePair;
  grand_total: StringValuePair;
  cost_of_credit: StringValuePair;
  cost_of_credit_pct: StringValuePair;
  apr: StringValuePair;
  max_financed_amount: StringValuePair;
};

export type Instalment = {
  count: number;
  amount: StringValuePair;
  fee: StringValuePair;
};

export function toInstalment(instalment: InstalmentAPIResponse): Instalment {
  return {
    count: instalment.instalment_count,
    amount: {
      value: instalment.instalment_amount.value,
      string: instalment.instalment_amount.string,
    },
    fee: {
      value: instalment.instalment_fee.value,
      string: instalment.instalment_fee.string,
    },
  };
}
