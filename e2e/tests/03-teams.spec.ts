import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Teams Settings', () => {
  test('list teams page loads', async ({ page }) => {
    await page.goto(settingsUrl('teams/list'));
    await expect(page.getByRole('heading', { level: 1, name: /teams/i })).toBeVisible();
  });

  test('create new team', async ({ page }) => {
    const teamName = `E2E Team ${Date.now()}`;
    await page.goto(settingsUrl('teams/new'));
    await page.getByPlaceholder(/sales|customer support/i).fill(teamName);
    await page.getByPlaceholder(/short description/i).fill('E2E test team');
    await page.getByRole('button', { name: /create team/i }).click();
    // After creation, wizard goes to Step 2 "Add Agents"
    await expect(page.getByRole('heading', { name: /add agents/i })).toBeVisible({ timeout: 15_000 });
  });

  test('teams list shows entries', async ({ page }) => {
    await page.goto(settingsUrl('teams/list'));
    await expect(page.getByRole('heading', { level: 1, name: /teams/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /create new team/i })
    ).toBeVisible();
  });
});
