import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Labels', () => {
  test('labels page loads and add button visible', async ({ page }) => {
    await page.goto(settingsUrl('labels/list'));
    await expect(
      page.getByRole('heading', { level: 1, name: /label/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /add label/i })
    ).toBeVisible();
  });
});
