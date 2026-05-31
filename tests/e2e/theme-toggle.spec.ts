import { expect, test } from '@playwright/test';

test('theme toggle switches and persists the dashboard theme', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.setItem('flowboard-theme', 'light');
  });
  await page.reload();

  const themeToggle = page.getByRole('button', { name: 'Switch to dark mode' });
  await expect(themeToggle).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/dark/);

  await themeToggle.click();

  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('flowboard-theme')))
    .toBe('dark');

  await page.reload();

  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
});
