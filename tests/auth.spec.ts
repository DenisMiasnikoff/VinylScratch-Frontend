import { test, expect } from '@playwright/test';

test.use({ storageState: undefined });

test.describe('Authentication', () => {

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('VinylScratch')).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const emailInput = page.locator('input[type="email"]');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill('wrong@mail.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);

    
    await expect(
      page.getByText('Incorrect email or password').first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('successful login redirects to songs', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByPlaceholder('you@example.com');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill('testaccount1@mail.com');
    await page.locator('input[type="password"]').fill('12345678');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/songs/, { timeout: 45000 });
    await expect(page.getByText('Your songs')).toBeVisible();
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText('VinylScratch')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('logout redirects to login', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByPlaceholder('you@example.com');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill('testaccount1@mail.com');
    await page.locator('input[type="password"]').fill('12345678');
    await page.locator('input[type="password"]').press('Enter');

    await expect(page).toHaveURL(/\/songs/, { timeout: 25000 });

    await page.getByRole('button', { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

});