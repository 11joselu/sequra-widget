export function instalmentWidgetModalTemplate(feeAmount: string) {
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
                      <p>Además en el importe mostrado ya se incluye la cuota única mensual de ${feeAmount}/mes, por lo que no tendrás ninguna sorpresa.</p>
                  </footer>
                </div>
            </div>
        </div>        
      </section>`;
}
