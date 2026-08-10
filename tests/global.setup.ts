import { test as setup, expect } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');

  
  await page.getByPlaceholder('you@example.com').fill('testaccount1@mail.com');
  await page.locator('input[type="password"]').fill('12345678');
  await page.getByRole('button', { name: /sign in/i }).click();

  
  await expect(page).toHaveURL(/\/songs/, { timeout: 50000 });

  
  await page.context().storageState({ path: AUTH_FILE });
});