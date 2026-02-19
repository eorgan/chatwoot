import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Integrations', () => {
  test('integrations page loads', async ({ page }) => {
    await page.goto(settingsUrl('integrations'));
    await expect(
      page.getByRole('heading', { level: 1, name: /integration/i })
    ).toBeVisible();
  });

  test('webhook settings accessible', async ({ page }) => {
    await page.goto(settingsUrl('integrations/webhook'));
    await expect(
      page.getByText(/webhook/i).first()
    ).toBeVisible();
  });
});
