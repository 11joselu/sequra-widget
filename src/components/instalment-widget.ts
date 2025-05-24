import type { InstalmentAPIResponse } from '../models/instalment.ts';

export class InstalmentWidget extends HTMLElement {
  private shadowDOM: ShadowRoot;
  private readonly instalments: InstalmentAPIResponse[] = [
    createInstalment(3, 5300, '53,00 €'),
    createInstalment(6, 2800, '28,00 €'),
    createInstalment(12, 1550, '15,50 €'),
  ];

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadowDOM.innerHTML = `
      <form>
        <label for="instalment-options">Págalo en</label>
        <button type="button">Más info</button>
        <select id="instalment-options">
          ${this.instalments.map((instalment) => {
            return `
                <option 
                  value="${instalment.instalment_count}">
                  ${instalment.instalment_count} cuotas de ${instalment.instalment_amount.string}/mes 
                </option>
          `;
          })}
        </select>
      </form>
    `;
  }
}

function createInstalment(
  instalmentCount: number,
  totalWithTax: number,
  totalWithTaxCentsString: string
) {
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
