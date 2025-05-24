export {};

type SeQuraGlobal = {
  refresh: (widgetId: string, productValue: number) => void;
};

// Extend the Window interface
declare global {
  interface Window {
    seQura: SeQuraGlobal;
  }
}
