import { type Instalment } from '../models/instalment.ts';
import { getInstalmentByProductPrice } from '../services/get-instalment-by-product-price.ts';

export class InstalmentWidget extends HTMLElement {
  private shadowDOM: ShadowRoot;
  private instalments: Array<Instalment> = [];
  private wrapper: HTMLDivElement;

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
    this.wrapper = document.createElement('div');
  }

  async connectedCallback() {
    this.shadowDOM.appendChild(this.wrapper);
    const productValue = Number(this.getAttribute('value')!);
    this.showLoading();
    this.instalments = await getInstalmentByProductPrice(productValue);
    this.hideLoading();
    this.render();

    this.onMoreInfoClicks();
  }

  private render() {
    this.wrapper.innerHTML = `
      <form>
        <label for="instalment-options">Págalo en</label>
        <button type="button" id="moreInfo">Más info</button>
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
    this.wrapper.innerHTML = `<p>Cargando...</p`;
  }

  private hideLoading() {
    this.wrapper.innerHTML = ``;
  }

  private onMoreInfoClicks() {
    const button = this.wrapper.querySelector(
      '#moreInfo'
    )! as HTMLButtonElement;
    const modal = document.createElement('div');
    const select = this.wrapper.querySelector(
      '#instalment-options'
    ) as HTMLSelectElement;

    button.addEventListener('click', () => {
      const value = select.value;
      const instalment = this.instalments.find(
        (inst) => inst.count.toString() === value
      );

      if (!instalment) {
        throw new Error('Instalment not found');
      }

      modal.innerHTML = this.getModalTemplate(instalment?.fee.string);
      this.wrapper.appendChild(modal);
    });
  }

  private getModalTemplate(feeAmount: string): string {
    return `
     <section class="modal">
        <header>
          <img src="https://cdn.prod.website-files.com/62b803c519da726951bd71c2/62b803c519da72c35fbd72a2_Logo.svg" alt="seQura logo" />
          <h2>
          Fracciona tu pago
          </h2>
        </header>
        <ul>
          <li>
            <span>Fracciona tu pago con un coste fijo por cuota.</span>
            <img src="https://placehold.co/100" alt="Placeholder" width="100" height="100" />
          </li>
          <li>
            <span>Ahora sólo pagas la primera cuota.</span>
            <img src="https://placehold.co/100" alt="Placeholder" width="100" height="100" />
          </li> 
          <li>
            <span>El resto de pagos se cargarán automáticamente a tu tarjeta.</span>
            <img src="https://placehold.co/100" alt="Placeholder" width="100" height="100" />
          </li> 
        </ul>
        
        <footer>
            <p>Además en el importe mostrado ya se incluye la cuota única mensual de ${feeAmount}/mes, por lo que no tendrás ningun sorpresas.</p>
        </footer>
      </section>`;
  }
}
