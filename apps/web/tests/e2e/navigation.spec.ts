import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Model Pear/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('can navigate to pricing calculator', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: 'Pricing Calculator', exact: true }).click();
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.locator('h1')).toContainText('Pricing Calculator');
  });

  test('can navigate to structuring tool', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: 'Transaction Structuring', exact: true }).click();
    await expect(page).toHaveURL(/\/structuring/);
  });

  test('header navigation works on all pages', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('navigation').getByRole('link', { name: 'Pricing Calculator' }).click();
    await expect(page).toHaveURL(/\/pricing/);

    await page.getByRole('navigation').getByRole('link', { name: 'Transaction Structuring' }).click();
    await expect(page).toHaveURL(/\/structuring/);

    await page.getByRole('navigation').getByRole('link', { name: /Model Pear/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
