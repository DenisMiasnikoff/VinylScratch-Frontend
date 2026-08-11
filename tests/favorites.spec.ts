import { test, expect } from '@playwright/test';

test.describe('Favorites', () => {

  test('favorites page loads', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.getByRole('heading', { name: 'Favorites', exact: true })).toBeVisible();
  });

  test('favoriting a song adds it to the favorites page', async ({ page }) => {
    await page.goto('/songs');
    await page.getByRole('button', { name: /add song/i }).click();
    await page.getByRole('button', { name: /soundhelix 2/i }).click();
    await page.fill('input[placeholder="Song title"]', 'Favorites Test Song');
    await page.getByRole('button', { name: /^add song$/i }).click();
    await expect(page.getByText('Favorites Test Song').first()).toBeVisible({ timeout: 8000 });

    
    const songRow = page.locator('div.group').filter({ hasText: 'Favorites Test Song' }).first();
    await songRow.getByRole('button', { name: /add to favorites/i }).click();

    await page.goto('/favorites');
    await expect(page.getByText('Favorites Test Song').first()).toBeVisible({ timeout: 8000 });
  });

  test('unfavoriting from favorites page removes the song', async ({ page }) => {
    await page.goto('/favorites');

    const songRow = page.locator('div.group').filter({ hasText: 'Favorites Test Song' }).first();
    await expect(songRow).toBeVisible({ timeout: 8000 });

    
    await songRow.getByRole('button', { name: /remove from favorites/i }).click();

    await expect(page.getByText('Favorites Test Song').first()).not.toBeVisible({ timeout: 10000 });
  });

  test('empty favorites shows correct empty state', async ({ page }) => {
    await page.goto('/favorites');
    const hasSong = await page.getByText('Favorites Test Song').isVisible();
    if (!hasSong) {
      await expect(page.getByText('0 tracks')).toBeVisible();
    }
  });

  test('cleanup — delete test song from songs page', async ({ page }) => {
    await page.goto('/songs');
    const songRow = page.locator('div.group').filter({ hasText: 'Favorites Test Song' }).first();

    if (await songRow.isVisible()) {
      await songRow.hover();
      await songRow.getByRole('button', { name: /delete/i }).click();
      await expect(page.getByText('Favorites Test Song')).not.toBeVisible({ timeout: 8000 });
    }
  });

});