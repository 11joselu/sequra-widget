import {
  type Instalment,
  type InstalmentAPIResponse,
  toInstalment,
} from '../models/instalment.ts';

export class InstalmentWidget extends HTMLElement {
  private shadowDOM: ShadowRoot;
  private instalments: Array<Instalment> = [];

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    const productValue = this.getAttribute('value') === '15000';
    let instalments: Array<Instalment> = [];
    if (productValue) {
      instalments = [
        toInstalment(createInstalment(3, 5300, '53,00 €')),
        toInstalment(createInstalment(6, 2800, '28,00 €')),
      ];
    } else {
      instalments = [
        toInstalment(createInstalment(3, 5300, '53,00 €')),
        toInstalment(createInstalment(6, 2800, '28,00 €')),
        toInstalment(createInstalment(12, 1550, '15,50 €')),
      ];
    }

    this.instalments = instalments;

    this.shadowDOM.innerHTML = `
      <form>
        <label for="instalment-options">Págalo en</label>
        <button type="button">Más info</button>
        <select id="instalment-options">
          ${this.instalments.map((instalment) => {
            return `
                <option 
                  value="${instalment.count}">
                  ${instalment.count} cuotas de ${instalment.amount.string}/mes 
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
