import { expect, test } from '@playwright/test';

test('user search filters the dashboard table', async ({ page }) => {
  await page.goto('/');

  const usersSection = page.locator('#users');
  await expect(usersSection.getByText('Martina Alvarez')).toBeVisible();
  await expect(usersSection.getByText('Rafael Moreno')).toBeVisible();

  await page.getByRole('searchbox', { name: 'Filter users by name, email, plan, or status' }).fill('martina');

  await expect(usersSection.getByText('Martina Alvarez')).toBeVisible();
  await expect(usersSection.getByText('Rafael Moreno')).not.toBeVisible();
  await expect(usersSection.getByText('1 of 3 users')).toBeVisible();
});
