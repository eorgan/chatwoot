import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Help Center', () => {
  test('help center page loads', async ({ page }) => {
    const accountId = settingsUrl('').match(/accounts\/(\d+)/)?.[1];
    await page.goto(`/app/accounts/${accountId}/portals`);
    await expect(
      page.getByText(/help center|portal/i).first()
    ).toBeVisible();
  });

  test('create portal button visible', async ({ page }) => {
    const accountId = settingsUrl('').match(/accounts\/(\d+)/)?.[1];
    await page.goto(`/app/accounts/${accountId}/portals`);
    const addButton = page.getByRole('button', { name: /new|create|add/i }).or(
      page.getByRole('link', { name: /new|create|add/i })
    );
    await expect(addButton).toBeVisible();
  });
});
