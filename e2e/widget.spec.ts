import { expect, test } from '@playwright/test';

test('Loads instalments from api for a price', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page.getByLabel('Págalo en')).toHaveValue('3');
});
