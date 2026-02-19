import { test, expect } from '@playwright/test';
import { settingsUrl, profileUrl } from '../helpers';

test.describe('Security Settings', () => {
  test('security settings page loads', async ({ page }) => {
    await page.goto(profileUrl('settings'));
    await expect(
      page.getByRole('heading', { name: /password/i })
    ).toBeVisible();
  });

  test('password change form is visible', async ({ page }) => {
    await page.goto(profileUrl('settings'));
    await expect(
      page.getByRole('textbox', { name: 'Current password' })
    ).toBeVisible();
  });

  test('change password with wrong current shows error', async ({ page }) => {
    await page.goto(profileUrl('settings'));
    await page.getByRole('textbox', { name: 'Current password' }).fill('WrongPassword!');
    await page.getByRole('textbox', { name: 'New password', exact: true }).fill('NewPassword1!');
    await page.getByRole('textbox', { name: 'Confirm new password' }).fill('NewPassword1!');
    await page.getByRole('button', { name: /change password/i }).click();
    await expect(
      page.getByText(/incorrect|invalid|error|failed/i)
    ).toBeVisible({ timeout: 15_000 });
  });

  test('MFA settings page loads', async ({ page }) => {
    await page.goto(profileUrl('mfa'));
    await expect(page).toHaveURL(/\/mfa/);
  });
});
