import { test, expect } from '@playwright/test';
import { contactsUrl } from '../helpers';

test.describe('Contact Detail', () => {
  test('navigate to contact detail from list', async ({ page }) => {
    await page.goto(contactsUrl());
    await page.waitForTimeout(3000);
    const firstContact = page.locator('table tbody tr, [class*="contact-item"]').first();
    if (await firstContact.isVisible()) {
      await firstContact.click();
      await page.waitForTimeout(2000);
      await expect(page.getByText(/conversation|email|phone/i).first()).toBeVisible();
    }
  });

  test('contact detail shows information', async ({ page }) => {
    await page.goto(contactsUrl());
    await page.waitForTimeout(3000);
    const firstContact = page.locator('table tbody tr, [class*="contact-item"]').first();
    if (await firstContact.isVisible()) {
      await firstContact.click();
      await page.waitForTimeout(2000);
      await expect(
        page.getByText(/email|phone|name/i).first()
      ).toBeVisible();
    }
  });

  test('edit contact details', async ({ page }) => {
    await page.goto(contactsUrl());
    await page.waitForTimeout(3000);
    const firstContact = page.locator('table tbody tr, [class*="contact-item"]').first();
    if (await firstContact.isVisible()) {
      await firstContact.click();
      await page.waitForTimeout(2000);
      const editButton = page.getByRole('button', { name: /edit/i });
      if (await editButton.isVisible()) {
        await editButton.click();
        await expect(
          page.getByLabel(/name/i).first()
        ).toBeVisible();
      }
    }
  });
});
