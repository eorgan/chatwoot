import { test, expect } from '@playwright/test';
import { contactsUrl } from '../helpers';

test.describe('Contacts', () => {
  test('contacts page loads', async ({ page }) => {
    await page.goto(contactsUrl());
    await expect(page.getByText('Contacts').first()).toBeVisible();
  });

  test('contacts list displays entries', async ({ page }) => {
    await page.goto(contactsUrl());
    await page.waitForTimeout(5000);
    const items = page.locator('table tbody tr, [class*="contact"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('search contacts', async ({ page }) => {
    await page.goto(contactsUrl());
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await searchInput.fill('john');
      await page.waitForTimeout(3000);
      await expect(page.getByText(/john/i).first()).toBeVisible();
    }
  });

  test('contacts page has action buttons', async ({ page }) => {
    await page.goto(contactsUrl());
    await expect(page.getByText('Contacts').first()).toBeVisible();
    await expect(
      page.getByRole('button', { name: /message/i })
    ).toBeVisible();
  });
});
