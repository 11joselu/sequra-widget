import {
  type InstalmentAPIResponse,
  toInstalment,
} from '../models/instalment.ts';

export async function getInstalmentByProductPrice(productValue: number) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/credit_agreements?totalWithTax=${productValue}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch instalments for product value ${productValue}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as InstalmentAPIResponse[];

  return data.map(toInstalment);
}
