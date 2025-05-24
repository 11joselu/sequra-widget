import { type Instalment } from '../models/instalment.ts';
import { getInstalmentByProductPrice } from '../services/get-instalment-by-product-price.ts';
import { trackInstalmentWidgetEvent } from '../services/track-instalment-widget-event.ts';
import * as styles from './style.css?inline';

export class InstalmentWidget extends HTMLElement {
  private shadowDOM: ShadowRoot;
  private instalments: Array<Instalment> = [];
  private wrapper: HTMLDivElement;
  private productValue: number = 0;
  private cache: Map<number, Array<Instalment>> = new Map();

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('instalment-widget');
    const styleEl = document.createElement('style');
    styleEl.textContent = styles.default;
    this.shadowDOM.appendChild(styleEl);
  }

  static get observedAttributes() {
    return ['value'];
  }

  public async attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): Promise<void> {
    if (name !== 'value') {
      return;
    }

    if (oldValue === null) {
      return;
    }

    const productValue = Number(newValue);

    if (isNaN(productValue)) {
      console.warn(`Invalid product value: ${newValue}`);
      return;
    }

    if (productValue !== this.productValue) {
      this.productValue = productValue;
      await this.renderInstalmentsByProductValue(productValue);
    }
  }

  async connectedCallback(): Promise<void> {
    this.wrapper.id =
      this.getAttribute('id') || `widget-${Date.now().toString()}`;
    this.shadowDOM.appendChild(this.wrapper);
    const productValue = Number(this.getAttribute('value')!);
    this.productValue = productValue;
    await this.renderInstalmentsByProductValue(productValue);
  }

  private async renderInstalmentsByProductValue(productValue: number) {
    this.showLoading();

    if (this.cache.has(productValue)) {
      this.instalments = this.cache.get(productValue)!;
    } else {
      this.instalments = await getInstalmentByProductPrice(productValue);
    }

    this.cache.set(productValue, this.instalments);
    this.hideLoading();
    this.render();
    const select = this.getSelectedInstalment();
    trackInstalmentWidgetEvent(select.count);

    this.onMoreInfoClicks();
    this.onSelectChange();
  }

  private render() {
    this.wrapper.innerHTML = `
      <form>
        <div class="form-header">
            <label for="instalment-options">Págalo en</label>
            <button type="button" id="moreInfo" class="form-button">Más info</button>
        </div>
        <select id="instalment-options" class="form-select">
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

    button.addEventListener('click', () => {
      const instalment = this.getSelectedInstalment();
      modal.innerHTML = this.getModalTemplate(instalment.fee.string);
      this.wrapper.appendChild(modal);
    });

    function handleBackdropClick(evt: MouseEvent) {
      const content = modal.querySelector('#modal-content');

      if (content && !content.contains(evt.target as Node)) {
        modal.remove();
      }
    }

    modal.addEventListener('click', handleBackdropClick);
  }

  private onSelectChange() {
    const select = this.getInstalmentSelect();
    select.addEventListener('change', () => {
      const instalment = this.getSelectedInstalment();
      trackInstalmentWidgetEvent(instalment.count);
    });
  }

  private getModalTemplate(feeAmount: string): string {
    return `
     <section class="modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content-backdrop" data-testid="modal-backdrop-content">
            <div class="modal-content-wrapper">
              <div class="modal-content" id="modal-content">
                 <header class="modal-content-header">
                    <img src="https://cdn.prod.website-files.com/62b803c519da726951bd71c2/62b803c519da72c35fbd72a2_Logo.svg" alt="seQura logo" width="80">
                    <h2>
                    Fracciona tu pago
                    </h2>
                  </header>
                  <ul class="modal-content-list">
                    <li>
                      <div class="modal-content-list-item">
                        <span>Fracciona tu pago con un coste fijo por cuota.</span>
                        <img src="https://placehold.co/100" alt="Placeholder" width="50" height="50" />
                      </div>
                    </li>
                    <li>
                      <div class="modal-content-list-item">
                        <span>Ahora sólo pagas la primera cuota.</span>
                        <img src="https://placehold.co/100" alt="Placeholder" width="50" height="50" />
                      </div> 
                    </li>
                    <li>
                      <div class="modal-content-list-item">
                        <span>El resto de pagos se cargarán automáticamente a tu tarjeta.</span>
                        <img src="https://placehold.co/100" alt="Placeholder" width="50" height="50" />
                      </div> 
                    </li>
                  </ul>
                  
                  <footer class="modal-content-footer">
                      <p>Además en el importe mostrado ya se incluye la cuota única mensual de ${feeAmount}/mes, por lo que no tendrás ningun sorpresas.</p>
                  </footer>
                </div>
            </div>
        </div>        
       
      </section>`;
  }

  private getInstalmentSelect() {
    return this.wrapper.querySelector(
      '#instalment-options'
    ) as HTMLSelectElement;
  }

  private getSelectedInstalment() {
    const select = this.getInstalmentSelect();
    const value = select.value;
    const instalment = this.instalments.find(
      (inst) => inst.count.toString() === value
    );
    if (!instalment) {
      throw new Error('Instalment not found');
    }
    return instalment;
  }
}
