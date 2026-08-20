import { expect, test } from '@playwright/test';

test('user search filters the dashboard table', async ({ page }) => {
  await page.goto('/');

  const usersSection = page.locator('#users');
  await expect(usersSection.getByText('Meridian Analytics')).toBeVisible();
  await expect(usersSection.getByText('Northgate Capital')).toBeVisible();

  await page.getByPlaceholder('Filter accounts...').fill('Meridian');

  await expect(usersSection.getByText('Meridian Analytics')).toBeVisible();
  await expect(usersSection.getByText('Northgate Capital')).not.toBeVisible();
  await expect(usersSection.getByText('Showing 1–1 of 1 accounts')).toBeVisible();
});
