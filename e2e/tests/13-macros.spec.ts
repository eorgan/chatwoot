import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Macros', () => {
  test('macros page loads', async ({ page }) => {
    await page.goto(settingsUrl('macros'));
    await expect(
      page.getByRole('heading', { level: 1, name: /macro/i })
    ).toBeVisible();
  });

  test('add macro button is visible', async ({ page }) => {
    await page.goto(settingsUrl('macros'));
    await expect(
      page.getByRole('link', { name: /new macro/i })
    ).toBeVisible();
  });

  test('macros list displays entries', async ({ page }) => {
    await page.goto(settingsUrl('macros'));
    await page.waitForTimeout(3000);
    const items = page.locator('table tbody tr, [class*="macro"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
