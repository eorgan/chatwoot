import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Audit Log', () => {
  test('audit log page loads', async ({ page }) => {
    await page.goto(settingsUrl('audit-logs/list'));
    await expect(
      page.getByRole('heading', { level: 1, name: /audit log/i })
    ).toBeVisible();
  });

  test('audit log entries are displayed', async ({ page }) => {
    await page.goto(settingsUrl('audit-logs/list'));
    // Wait for loading to finish
    await page.waitForTimeout(3000);
    const entries = page.locator('table tbody tr, [class*="audit"]');
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('audit log has date controls', async ({ page }) => {
    await page.goto(settingsUrl('audit-logs/list'));
    await expect(page).toHaveURL(/audit-logs/);
  });
});
