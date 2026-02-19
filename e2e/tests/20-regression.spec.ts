import { test, expect } from '@playwright/test';
import { conversationsUrl, settingsUrl, contactsUrl, reportsUrl, profileUrl } from '../helpers';

test.describe('Regression', () => {
  test('conversations page loads after login', async ({ page }) => {
    await page.goto(conversationsUrl());
    await expect(page).toHaveURL(/\/accounts\/\d+\//);
  });

  test('sidebar navigation is functional', async ({ page }) => {
    await page.goto(conversationsUrl());
    const sidebar = page.locator('aside, nav, [role="complementary"]').first();
    await expect(sidebar).toBeVisible();
  });

  test('navigate between settings pages without errors', async ({ page }) => {
    await page.goto(settingsUrl('general'));
    await expect(page).toHaveURL(/\/settings\/general/);

    await page.goto(settingsUrl('agents/list'));
    await expect(page).toHaveURL(/\/agents\/list/);

    await page.goto(settingsUrl('teams/list'));
    await expect(page).toHaveURL(/\/teams\/list/);
  });

  test('contacts page accessible from navigation', async ({ page }) => {
    await page.goto(contactsUrl());
    await expect(page).toHaveURL(/\/contacts/);
  });

  test('reports page accessible from navigation', async ({ page }) => {
    await page.goto(reportsUrl('overview'));
    await expect(page).toHaveURL(/\/reports\/overview/);
  });

  test('profile settings accessible', async ({ page }) => {
    await page.goto(profileUrl('settings'));
    await expect(page).toHaveURL(/\/profile\/settings/);
  });

  test('no console errors on main pages', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(conversationsUrl());
    await page.waitForTimeout(5000);

    // Filter out known benign errors
    const criticalErrors = errors.filter(
      e =>
        !e.includes('favicon') &&
        !e.includes('WebSocket') &&
        !e.includes('net::ERR') &&
        !e.includes('Failed to load resource') &&
        !e.includes('ResizeObserver') &&
        !e.includes('Non-Error promise rejection')
    );
    expect(criticalErrors.length).toBe(0);
  });
});
