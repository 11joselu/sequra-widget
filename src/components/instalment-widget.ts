import { type Instalment } from '../models/instalment.ts';
import { getInstalmentByProductPrice } from '../services/get-instalment-by-product-price.ts';

export class InstalmentWidget extends HTMLElement {
  private shadowDOM: ShadowRoot;
  private instalments: Array<Instalment> = [];

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const productValue = Number(this.getAttribute('value')!);
    this.showLoading();
    this.instalments = await getInstalmentByProductPrice(productValue);
    this.hideLoading();
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
                  value="${instalment.count}">
                  ${instalment.count} cuotas de ${instalment.amount.string}/mes 
                </option>
          `;
          })}
        </select>
      </form>
    `;
  }

  private showLoading() {
    this.shadowDOM.innerHTML = `<p>Cargando...</p`;
  }

  private hideLoading() {
    this.shadowDOM.innerHTML = ``;
  }
}
