import { expect, test } from '@playwright/test';

test('dashboard renders and updates its counter', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'HH Scraper' })).toBeVisible();
  await page.getByRole('button', { name: 'Clicked 0 times' }).click();
  await expect(page.getByRole('button', { name: 'Clicked 1 time' })).toBeVisible();
});
