import { test, expect } from '@playwright/test';
import { profileUrl } from '../helpers';

test.describe('Profile Settings', () => {
  test('profile page loads', async ({ page }) => {
    await page.goto(profileUrl('settings'));
    await expect(
      page.getByRole('heading', { name: /profile/i })
    ).toBeVisible();
  });

  test('profile displays user email', async ({ page }) => {
    await page.goto(profileUrl('settings'));
    await expect(page.getByText('john@acme.inc')).toBeVisible();
  });

  test('update display name', async ({ page }) => {
    await page.goto(profileUrl('settings'));
    const nameInput = page.getByRole('textbox', { name: /full name/i });
    await expect(nameInput).toBeVisible();
    const originalName = await nameInput.inputValue();

    await nameInput.fill('E2E Test User');
    await page.getByRole('button', { name: /update profile/i }).click();
    await expect(
      page.getByText(/success|saved|updated/i)
    ).toBeVisible({ timeout: 15_000 });

    // Restore original name
    await nameInput.fill(originalName || 'Jonh');
    await page.getByRole('button', { name: /update profile/i }).click();
  });
});
