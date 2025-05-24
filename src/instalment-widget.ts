import { InstalmentWidget } from './components/instalment-widget.ts';

(() => {
  window.customElements.define('sequra-instalment-widget', InstalmentWidget);
  window.seQura = {
    refresh(widgetId: string, productValue: number) {
      const widget = document.querySelectorAll(`sequra-instalment-widget`);
      if (widget.length === 0) {
        console.warn(`No InstalmentWidget found with id ${widgetId}.`);
        return;
      }

      const targetWidget = Array.from(widget).find(
        (el) => (el as HTMLElement).id === widgetId
      ) as InstalmentWidget | undefined;

      if (!targetWidget) {
        console.warn(`InstalmentWidget with id ${widgetId} not found.`);
        return;
      }

      targetWidget.setAttribute('value', String(productValue));
    },
  };
})();
