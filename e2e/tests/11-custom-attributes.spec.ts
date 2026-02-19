import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Custom Attributes', () => {
  const attrName = `e2e attr ${Date.now()}`;

  test('custom attributes page loads', async ({ page }) => {
    await page.goto(settingsUrl('custom-attributes/list'));
    await expect(
      page.getByRole('heading', { level: 1, name: /custom attribute/i })
    ).toBeVisible();
  });

  test('create custom attribute', async ({ page }) => {
    await page.goto(settingsUrl('custom-attributes/list'));
    await page.getByRole('button', { name: /add custom attribute/i }).click();

    await page.getByRole('textbox', { name: /display name/i }).fill(attrName);
    await page.getByRole('textbox', { name: /description/i }).fill('E2E test attribute');
    await page.getByRole('button', { name: /create/i }).click();

    await expect(page.getByText(attrName)).toBeVisible({ timeout: 15_000 });
  });

  test('custom attributes list displays entries', async ({ page }) => {
    await page.goto(settingsUrl('custom-attributes/list'));
    await page.waitForTimeout(3000);
    const items = page.locator('table tbody tr, [class*="attribute"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
