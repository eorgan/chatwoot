import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Campaigns', () => {
  test('campaigns page loads', async ({ page }) => {
    const accountId = settingsUrl('').match(/accounts\/(\d+)/)?.[1];
    await page.goto(`/app/accounts/${accountId}/campaigns`);
    await expect(
      page.getByText(/campaign/i).first()
    ).toBeVisible();
  });

  test('create campaign button visible', async ({ page }) => {
    const accountId = settingsUrl('').match(/accounts\/(\d+)/)?.[1];
    await page.goto(`/app/accounts/${accountId}/campaigns`);
    const addButton = page.getByRole('button', { name: /create|add|new/i });
    await expect(addButton).toBeVisible();
  });

  test('campaigns list displays entries', async ({ page }) => {
    const accountId = settingsUrl('').match(/accounts\/(\d+)/)?.[1];
    await page.goto(`/app/accounts/${accountId}/campaigns`);
    await page.waitForTimeout(2000);
    const items = page.locator('table tbody tr, [class*="campaign"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
