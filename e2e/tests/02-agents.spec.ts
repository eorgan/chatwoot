import { test, expect } from '@playwright/test';
import { settingsUrl } from '../helpers';

test.describe('Agents Settings', () => {
  test('list agents page loads', async ({ page }) => {
    await page.goto(settingsUrl('agents/list'));
    await expect(page.getByRole('heading', { name: /agents/i }).first()).toBeVisible();
  });

  test('agents table is visible', async ({ page }) => {
    await page.goto(settingsUrl('agents/list'));
    await expect(
      page.locator('table, [class*="agent"]').first()
    ).toBeVisible();
  });

  test('create new agent', async ({ page }) => {
    await page.goto(settingsUrl('agents/list'));
    // Click the first "Add agent" button (the page header one, not the modal one)
    await page.getByRole('button', { name: /add agent/i }).first().click();

    const agentEmail = `e2e-agent-${Date.now()}@test.com`;
    await page.getByLabel(/email/i).fill(agentEmail);
    await page.getByLabel(/name/i).fill('Test Agent E2E');
    // Click the submit button inside the form/modal
    await page.locator('form').getByRole('button', { name: /add agent/i }).click();

    await expect(page.getByText(agentEmail)).toBeVisible({ timeout: 15_000 });
  });

  test('search/filter agents', async ({ page }) => {
    await page.goto(settingsUrl('agents/list'));
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await searchInput.fill('john');
      await expect(page.getByText(/john/i)).toBeVisible();
    }
  });
});
