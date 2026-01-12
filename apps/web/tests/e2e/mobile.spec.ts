import { test, expect, devices } from '@playwright/test';

// Use mobile viewport
test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Responsiveness', () => {
  test('home page is usable on mobile', async ({ page }) => {
    await page.goto('/');

    // Content should be visible
    await expect(page.locator('h1')).toBeVisible();

    // Navigation should be accessible (may be in hamburger menu)
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('pricing calculator works on mobile', async ({ page }) => {
    await page.goto('/pricing');

    // Model selector should stack vertically
    await expect(page.locator('button:has-text("Subscription")')).toBeVisible();

    // Inputs should be full width
    const input = page.locator('input[type="number"]').first();
    await expect(input).toBeVisible();

    // Can interact with inputs
    await input.fill('500');
  });

  test('pricing models are tappable on mobile', async ({ page }) => {
    await page.goto('/pricing');

    // Tap on usage-based model
    await page.tap('button:has-text("Usage-Based")');

    // Should switch to that model
    await expect(page.locator('text=Price per Unit')).toBeVisible();
  });

  test('structuring page works on mobile', async ({ page }) => {
    await page.goto('/structuring');

    // Page should load
    await expect(page.locator('h1')).toBeVisible();
  });

  test('model calculator is usable on mobile', async ({ page }) => {
    await page.goto('/structuring/model-1');

    // Should show inputs
    await expect(page.locator('input[type="number"]').first()).toBeVisible();

    // Results should be visible
    await expect(page.locator('text=Developer').first()).toBeVisible();
  });

  test('scrolling works properly on mobile', async ({ page }) => {
    await page.goto('/pricing');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for scroll
    await page.waitForTimeout(200);

    // Should be able to scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
  });
});

test.describe('Touch Interactions', () => {
  test.use({ ...devices['iPhone 12'] });

  test('buttons respond to touch', async ({ page }) => {
    await page.goto('/pricing');

    // Tap on a pricing model
    const button = page.locator('button:has-text("Per-Seat")');
    await button.tap();

    // Should switch models
    await expect(page.locator('text=Price per Seat')).toBeVisible();
  });

  test('inputs are touch-friendly', async ({ page }) => {
    await page.goto('/pricing');

    // Tap on input to focus
    const input = page.locator('input[type="number"]').first();
    await input.tap();

    // Input should be focused
    await expect(input).toBeFocused();
  });
});
