import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('General Settings', () => {
  test('general settings page loads', async ({ page }) => {
    await page.goto(settingsUrl('general'));
    await expect(
      page.getByRole('heading', { level: 1, name: /account settings/i })
    ).toBeVisible();
  });

  test('account name field is visible and editable', async ({ page }) => {
    await page.goto(settingsUrl('general'));
    const nameInput = page.getByPlaceholder(/account name/i).or(
      page.getByRole('textbox', { name: /account name/i })
    );
    await expect(nameInput).toBeVisible();
    const currentValue = await nameInput.inputValue();
    expect(currentValue).toBeTruthy();
  });

  test('save general settings', async ({ page }) => {
    await page.goto(settingsUrl('general'));
    const saveButton = page.getByRole('button', { name: /save|update/i }).first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(
      page.getByText(/success|saved|updated/i)
    ).toBeVisible({ timeout: 15_000 });
  });
});
