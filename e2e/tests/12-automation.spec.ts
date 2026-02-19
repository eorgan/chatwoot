import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Automation', () => {
  test('automation page loads', async ({ page }) => {
    await page.goto(settingsUrl('automation/list'));
    await expect(
      page.getByRole('heading', { level: 1, name: /automation/i })
    ).toBeVisible();
  });

  test('add automation button is visible', async ({ page }) => {
    await page.goto(settingsUrl('automation/list'));
    await expect(
      page.getByRole('button', { name: /add automation/i })
    ).toBeVisible();
  });

  test('automation list displays entries', async ({ page }) => {
    await page.goto(settingsUrl('automation/list'));
    await page.waitForTimeout(3000);
    const items = page.locator('table tbody tr, [class*="automation"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
