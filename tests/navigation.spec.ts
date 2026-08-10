import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {

  test('sidebar shows all nav links', async ({ page }) => {
    await page.goto('/songs');
    await expect(page.getByRole('link', { name: /songs/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /playlists/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /favorites/i })).toBeVisible();
  });

  test('songs nav link is active on songs page', async ({ page }) => {
    await page.goto('/songs');
    const songsLink = page.getByRole('link', { name: /songs/i });
    
    await expect(songsLink).toHaveClass(/bg-zinc-800/);
  });

  test('navigating to playlists updates active link', async ({ page }) => {
    await page.goto('/songs');
    await page.getByRole('link', { name: /playlists/i }).click();

    await expect(page).toHaveURL(/\/playlists/);
    await expect(page.getByRole('heading', { name: 'Playlists', exact: true })).toBeVisible();
  });

  test('navigating to favorites updates active link', async ({ page }) => {
    await page.goto('/songs');
    await page.getByRole('link', { name: /favorites/i }).click();

    await expect(page).toHaveURL(/\/favorites/);
    await expect(page.getByRole('heading', { name: 'Favorites', exact: true })).toBeVisible();
  });

  test('VinylScratch logo navigates to songs', async ({ page }) => {
    await page.goto('/playlists');
    await page.getByRole('link', { name: /vinylscratch/i }).first().click();

    await expect(page).toHaveURL(/\/songs/);
  });

  test('root redirects to songs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/songs/, { timeout: 8000 });
  });

  test('mobile menu opens on small screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/songs');

   
    await page.getByRole('button', { name: /open menu/i }).click();

   
    await expect(page.getByRole('link', { name: /playlists/i })).toBeVisible();
  });

});