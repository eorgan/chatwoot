import { test, expect } from '@playwright/test';
import { reportsUrl } from '../helpers';

test.describe('Reports', () => {
  test('overview report loads', async ({ page }) => {
    await page.goto(reportsUrl('overview'));
    await expect(page.getByText('Overview').first()).toBeVisible();
  });

  test('conversation report loads', async ({ page }) => {
    await page.goto(reportsUrl('conversation'));
    await expect(
      page.getByText(/conversation/i).first()
    ).toBeVisible();
  });

  test('agent report loads', async ({ page }) => {
    await page.goto(reportsUrl('agents_overview'));
    await expect(
      page.getByText(/agent/i).first()
    ).toBeVisible();
  });

  test('inbox report loads', async ({ page }) => {
    await page.goto(reportsUrl('inboxes_overview'));
    await expect(
      page.getByText(/inbox/i).first()
    ).toBeVisible();
  });

  test('CSAT report loads', async ({ page }) => {
    await page.goto(reportsUrl('csat'));
    await expect(
      page.getByText(/csat|satisfaction/i).first()
    ).toBeVisible();
  });

  test('team report loads', async ({ page }) => {
    await page.goto(reportsUrl('teams_overview'));
    await expect(
      page.getByText(/team/i).first()
    ).toBeVisible();
  });
});
