import { type Instalment } from '../models/instalment.ts';
import { getInstalmentByProductPrice } from '../services/get-instalment-by-product-price.ts';
import { trackInstalmentWidgetEvent } from '../services/track-instalment-widget-event.ts';
import * as styles from './style.css?inline';
import { widgetFormTemplate } from './instalment-widget.template.ts';
import { instalmentWidgetModalTemplate } from './instalment-widget-modal.template.ts';

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
      try {
        await this.renderInstalmentsByProductValue(productValue);
      } catch {
        this.renderErrorMessage();
      }
    }
  }

  async connectedCallback(): Promise<void> {
    this.wrapper.id =
      this.getAttribute('id') || `widget-${Date.now().toString()}`;
    this.shadowDOM.appendChild(this.wrapper);
    const productValue = Number(this.getAttribute('value')!);
    this.productValue = productValue;
    try {
      await this.renderInstalmentsByProductValue(productValue);
    } catch {
      this.renderErrorMessage();
    }
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
    this.wrapper.innerHTML = widgetFormTemplate(this.instalments);
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
      modal.innerHTML = instalmentWidgetModalTemplate(instalment.fee.string);
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

  private renderErrorMessage() {
    this.wrapper.innerHTML = `<p data-testid="error-message">Lo sentimos, no podemos mostrar las opciones de financiación en este momento. Inténtalo de nuevo más tarde.</p`;
  }
}
