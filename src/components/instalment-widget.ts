export class InstalmentWidget extends HTMLElement {
  private shadowDOM: ShadowRoot;

  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadowDOM.innerHTML = `<form>
        <label for="instalment-options">Págalo en</label>
        <button type="button">Más info</button>
        <select id="instalment-options">
          <option value="3">3 cuotas de 53,00 €/mes</option>
          <option value="6">6 cuotas de 28,00 €/mes</option>
          <option value="12">12 cuotas de 15,50 €/mes</option>
        </select>
      </form>
    `;
  }
}
