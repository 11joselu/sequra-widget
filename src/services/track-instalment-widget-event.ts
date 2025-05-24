// Silent fail: currently, if the request fails, we do nothing. This allows the user to continue the process
// without being blocked. Should we handle failures differently?
export async function trackInstalmentWidgetEvent(instalmentCount: number) {
  await fetch(`${import.meta.env.VITE_API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context: 'checkoutWidget',
      type: 'simulatorInstalmentChanged',
      selectedInstalment: instalmentCount,
    }),
  });
}
