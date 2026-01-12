import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Model Pear/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('can navigate to pricing calculator', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/pricing"]');
    await expect(page).toHaveURL('/pricing');
    await expect(page.locator('h1')).toContainText('Pricing Calculator');
  });

  test('can navigate to structuring tool', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/structuring"]');
    await expect(page).toHaveURL('/structuring');
  });

  test('header navigation works on all pages', async ({ page }) => {
    // Start at home
    await page.goto('/');

    // Go to pricing
    await page.click('nav >> a[href="/pricing"]');
    await expect(page).toHaveURL('/pricing');

    // Go to structuring
    await page.click('nav >> a[href="/structuring"]');
    await expect(page).toHaveURL('/structuring');

    // Return home
    await page.click('nav >> a[href="/"]');
    await expect(page).toHaveURL('/');
  });
});
