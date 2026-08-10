import { test, expect } from '@playwright/test';



test.describe('Songs', () => {

  test('songs dashboard loads', async ({ page }) => {
    await page.goto('/songs');
    await expect(page.getByText('Your songs')).toBeVisible();
    await expect(page.getByRole('button', { name: /add song/i })).toBeVisible();
  });

  test('add song modal opens and closes', async ({ page }) => {
    await page.goto('/songs');
    await page.getByRole('button', { name: /add song/i }).click();

    await expect(page.getByText('Add a song')).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();

    
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByText('Add a song')).not.toBeVisible();
  });

  test('add song modal closes on backdrop click', async ({ page }) => {
    await page.goto('/songs');
    await page.getByRole('button', { name: /add song/i }).click();
    await expect(page.getByText('Add a song')).toBeVisible();

 
    await page.mouse.click(10, 10);
    await expect(page.getByText('Add a song')).not.toBeVisible();
  });

  test('sample quick-fill populates form fields', async ({ page }) => {
    await page.goto('/songs');
    await page.getByRole('button', { name: /add song/i }).click();

    await page.getByRole('button', { name: /soundhelix 1/i }).click();

    const urlInput = page.locator('input[type="url"]');
    await expect(urlInput).toHaveValue(/soundhelix/i);
  });

  test('add a song and it appears in the list', async ({ page }) => {
    await page.goto('/songs');
    await page.getByRole('button', { name: /add song/i }).click();

  
    await page.getByRole('button', { name: /soundhelix 1/i }).click();

    
    await page.fill('input[placeholder="Song title"]', 'Playwright Test Song');
    await page.getByRole('button', { name: /^add song$/i }).click();

  
    await expect(page.getByText('Playwright Test Song').first()).toBeVisible({ timeout: 8000 });
  });

  test('clicking play triggers the audio player bar', async ({ page }) => {
    await page.goto('/songs');

  
    const firstPlayButton = page.locator('button[aria-label^="Play"]').first();
    await expect(firstPlayButton).toBeVisible({ timeout: 8000 });
    await firstPlayButton.click();

   
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByRole('button', { name: /pause/i }).first()).toBeVisible();
  });

  test('delete a song removes it from the list', async ({ page }) => {
    await page.goto('/songs');

  
    const songRow = page.locator('div').filter({ hasText: 'Playwright Test Song' }).first();
    await expect(songRow).toBeVisible({ timeout: 8000 });

  
    await songRow.hover();
    const deleteButton = page.getByRole('button', { name: /delete playwright test song/i }).first();
    await deleteButton.click();

  
    await expect(page.getByText('Playwright Test Song').first()).not.toBeVisible({ timeout: 8000 });
  });

});