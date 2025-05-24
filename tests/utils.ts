/// <reference types="vite/types/importMeta.d.ts" />
import nock from 'nock';
import { faker } from '@faker-js/faker';

export function mockGet<ResponseType>(url: string, response: ResponseType) {
  return nock(import.meta.env.VITE_API_URL)
    .get(url)
    .reply(200, response as Body);
}

export function mockPost<ResponseType = Record<string, unknown>>(
  url: string,
  times = 1,
  status = 200,
  response?: ResponseType
) {
  return nock(import.meta.env.VITE_API_URL)
    .post(url)
    .times(times)
    .reply(status, response as Body);
}

export function createInstalment(
  instalmentCount: number,
  instalmentAmount: number,
  instalmentAmountString: string,
  feeValue: number = 500,
  feeAsString: string = '5 €'
) {
  return {
    instalment_count: instalmentCount,
    instalment_amount: {
      value: instalmentAmount,
      string: instalmentAmountString,
    },
    total_with_tax: {
      value: faker.number.int(),
      string: faker.string.alpha(),
    },
    instalment_fee: {
      value: feeValue,
      string: feeAsString,
    },
    instalment_total: {
      value: faker.number.int(),
      string: faker.string.alpha(),
    },
    grand_total: {
      value: faker.number.int(),
      string: faker.string.alpha(),
    },
    cost_of_credit: {
      value: faker.number.int(),
      string: faker.string.alpha(),
    },
    cost_of_credit_pct: {
      value: faker.number.int(),
      string: faker.string.alpha(),
    },
    apr: { value: faker.number.int(), string: faker.string.alpha() },
    max_financed_amount: {
      value: faker.number.int(),
      string: faker.string.alpha(),
    },
  };
}
