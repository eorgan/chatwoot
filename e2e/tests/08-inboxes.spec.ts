import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Inboxes Settings', () => {
  test('inboxes list page loads', async ({ page }) => {
    await page.goto(settingsUrl('inboxes/list'));
    await expect(
      page.getByRole('heading', { level: 1, name: /inboxes/i })
    ).toBeVisible();
  });

  test('add inbox button is visible', async ({ page }) => {
    await page.goto(settingsUrl('inboxes/list'));
    await expect(
      page.getByRole('link', { name: /add inbox/i })
    ).toBeVisible();
  });
});
