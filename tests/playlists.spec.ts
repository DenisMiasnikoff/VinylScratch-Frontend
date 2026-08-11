import { test, expect } from '@playwright/test';

test.describe('Playlists', () => {

  test('playlists page loads', async ({ page }) => {
    await page.goto('/playlists');
    await expect(page.getByRole('heading', { name: 'Playlists', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /new playlist/i })).toBeVisible();
  });

  test('create playlist modal opens and closes', async ({ page }) => {
    await page.goto('/playlists');
    await page.getByRole('button', { name: /new playlist/i }).click();

    await expect(page.getByText(/new playlist/i).first()).toBeVisible();
    await page.getByRole('button', { name: /cancel/i }).click();

    
    await expect(page.locator('input[placeholder="My playlist"]')).not.toBeVisible();
  });

  test('create a playlist and it appears in the grid', async ({ page }) => {
    await page.goto('/playlists');
    await page.getByRole('button', { name: /new playlist/i }).click();

    await page.fill('input[placeholder="My playlist"]', 'Playwright Test Playlist');
    await page.getByRole('button', { name: /^create$/i }).click();

    await expect(page.getByText('Playwright Test Playlist').first()).toBeVisible({ timeout: 8000 });
  });

  test('clicking a playlist navigates to its detail page', async ({ page }) => {
    await page.goto('/playlists');

    const card = page.getByText('Playwright Test Playlist').first();
    await expect(card).toBeVisible({ timeout: 8000 });
    await card.click();

    await expect(page).toHaveURL(/\/playlists\/.+/);
    await expect(page.getByText('Playwright Test Playlist')).toBeVisible();
  });

  test('empty playlist shows add songs prompt', async ({ page }) => {
    await page.goto('/playlists');
    await page.getByText('Playwright Test Playlist').first().click();

    await expect(page.getByText('This playlist is empty')).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('button', { name: 'Add songs', exact: true })).toBeVisible();
  });

  test('delete a playlist removes it from the grid', async ({ page }) => {
    await page.goto('/playlists');

    const card = page.locator('a').filter({ hasText: 'Playwright Test Playlist' }).first();
    await expect(card).toBeVisible({ timeout: 8000 });

   
    await card.hover();
    await card.locator('button[aria-label*="Delete"]').click();

    await expect(page.getByText('Playwright Test Playlist').first()).not.toBeVisible({ timeout: 10000 });
  });

});