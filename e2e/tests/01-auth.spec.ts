import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login with valid credentials', async ({ page }) => {
    await page.goto('/app/login');
    await page.locator('[data-testid="email_input"]').fill('john@acme.inc');
    await page.locator('[data-testid="password_input"]').fill('Password1!');
    await page.locator('[data-testid="submit_button"]').click();
    await page.waitForURL(url => !url.pathname.includes('/login'), {
      timeout: 45_000,
      waitUntil: 'domcontentloaded',
    });
    await expect(page).toHaveURL(/\/accounts\/\d+\//);
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/app/login');
    await page.locator('[data-testid="email_input"]').fill('wrong@test.com');
    await page.locator('[data-testid="password_input"]').fill('wrongpass');
    await page.locator('[data-testid="submit_button"]').click();
    await expect(
      page.getByText(/incorrect|please try again|invalid/i)
    ).toBeVisible({ timeout: 15_000 });
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/app/login');
    await expect(page.locator('[data-testid="email_input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password_input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit_button"]')).toBeVisible();
  });
});
