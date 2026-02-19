import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');
const accountFile = path.join(__dirname, '.auth/account.json');

setup('authenticate', async ({ page }) => {
  setup.setTimeout(90_000);

  await page.goto('/app/login');
  await page.waitForLoadState('networkidle');

  await page.locator('[data-testid="email_input"]').fill('john@acme.inc');
  await page.locator('[data-testid="password_input"]').fill('Password1!');
  await page.locator('[data-testid="submit_button"]').click();

  // The login does window.location = redirect, so wait for full navigation
  await page.waitForURL(url => !url.pathname.includes('/login'), {
    timeout: 60_000,
    waitUntil: 'domcontentloaded',
  });

  const url = page.url();
  const match = url.match(/\/accounts\/(\d+)\//);
  const accountId = match ? match[1] : '';

  fs.mkdirSync(path.dirname(accountFile), { recursive: true });
  fs.writeFileSync(accountFile, JSON.stringify({ accountId }));

  await page.context().storageState({ path: authFile });
});
