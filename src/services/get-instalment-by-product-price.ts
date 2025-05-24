import {
  type InstalmentAPIResponse,
  toInstalment,
} from '../models/instalment.ts';

export async function getInstalmentByProductPrice(productValue: number) {
  const response = await fetch(
    `http://localhost:8080/credit_agreements?totalWithTax=${productValue}`
  );
  const data = (await response.json()) as InstalmentAPIResponse[];

  return data.map(toInstalment);
}
