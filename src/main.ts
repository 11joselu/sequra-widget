import './style.css';

class InstalmentWidget extends HTMLElement {
  private shadowDOM: ShadowRoot;

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadowDOM.innerHTML = `<select>
        <option value="3">3 cuotas de 53,00 €/mes</option>
        <option value="6">6 cuotas de 28,00 €/mes</option>
      </select>
    `;
  }
}

window.customElements.define('sequra-instalment-widget', InstalmentWidget);
