import { test, expect } from '@playwright/test';

test.describe('Mobile responsiveness', () => {

  test('home page is usable on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('pricing calculator works on mobile', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('button', { name: /Subscription/ })).toBeVisible();
    const price = page.locator('#sub_monthlyPrice');
    await expect(price).toBeVisible();
    await price.fill('500');
  });

  test('pricing models are tappable on mobile', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('button', { name: /Usage-Based/ }).click();
    await expect(page.locator('text=Price per Unit')).toBeVisible();
  });

  test('structuring page works on mobile', async ({ page }) => {
    await page.goto('/structuring');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('model calculator is usable on mobile', async ({ page }) => {
    await page.goto('/structuring/model-1');
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
    await expect(page.locator('text=Developer').first()).toBeVisible();
  });

  test('scrolling works properly on mobile', async ({ page }) => {
    await page.goto('/pricing');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  test('buttons respond to touch', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('button', { name: /Per-Seat/ }).click();
    await expect(page.locator('text=Price per Seat')).toBeVisible();
  });
});
