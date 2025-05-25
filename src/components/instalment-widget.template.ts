import type { Instalment } from '../models/instalment.ts';

export function widgetFormTemplate(instalments: Array<Instalment>) {
  return `
      <form>
        <div class="form-header">
            <label for="instalment-options">Págalo en</label>
            <button type="button" id="moreInfo" class="form-button">Más info</button>
        </div>
        <select id="instalment-options" class="form-select">
          ${instalments.map((instalment) => {
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
