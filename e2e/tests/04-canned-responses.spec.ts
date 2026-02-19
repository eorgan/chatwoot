import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Canned Responses', () => {
  const shortCode = `e2e_${Date.now()}`;

  test('list canned responses page loads', async ({ page }) => {
    await page.goto(settingsUrl('canned-response/list'));
    await expect(
      page.getByRole('heading', { level: 1, name: /canned response/i })
    ).toBeVisible();
  });

  test('create canned response', async ({ page }) => {
    await page.goto(settingsUrl('canned-response/list'));
    await page.getByRole('button', { name: /add canned response/i }).click();

    await page.getByPlaceholder(/short code/i).fill(shortCode);
    // Message field is a rich text editor (contenteditable)
    const editor = page.locator('.ProseMirror, [contenteditable="true"]').first();
    await editor.click();
    await editor.fill('E2E test canned response');
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByText(shortCode)).toBeVisible({ timeout: 15_000 });
  });

  test('search canned responses', async ({ page }) => {
    await page.goto(settingsUrl('canned-response/list'));
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await searchInput.fill(shortCode);
      await expect(page.getByText(shortCode)).toBeVisible();
    }
  });

  test('delete canned response', async ({ page }) => {
    await page.goto(settingsUrl('canned-response/list'));
    const row = page.locator('tr, [class*="row"]', { hasText: shortCode });
    if (await row.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await row.hover();
      await row.getByRole('button', { name: /delete/i }).click();
      const confirmBtn = page.getByRole('button', { name: /yes|confirm|delete/i });
      if (await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await confirmBtn.click();
      }
      await expect(row).not.toBeVisible({ timeout: 15_000 });
    }
  });
});
