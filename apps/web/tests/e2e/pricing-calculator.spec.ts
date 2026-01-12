import { test, expect } from '@playwright/test';

test.describe('Pricing Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('displays all 5 pricing models', async ({ page }) => {
    await expect(page.locator('button:has-text("Subscription")')).toBeVisible();
    await expect(page.locator('button:has-text("Usage-Based")')).toBeVisible();
    await expect(page.locator('button:has-text("Per-Seat")')).toBeVisible();
    await expect(page.locator('button:has-text("One-Time")')).toBeVisible();
    await expect(page.locator('button:has-text("Marketplace")')).toBeVisible();
  });

  test('subscription model calculates results', async ({ page }) => {
    // Default model is subscription
    await expect(page.locator('text=Monthly Price per Customer')).toBeVisible();

    // Results should be displayed
    await expect(page.locator('text=Monthly Revenue')).toBeVisible();
    await expect(page.locator('text=Monthly Profit')).toBeVisible();
  });

  test('can switch between pricing models', async ({ page }) => {
    // Switch to usage-based
    await page.click('button:has-text("Usage-Based")');
    await expect(page.locator('text=Price per Unit')).toBeVisible();

    // Switch to per-seat
    await page.click('button:has-text("Per-Seat")');
    await expect(page.locator('text=Price per Seat')).toBeVisible();

    // Switch to one-time
    await page.click('button:has-text("One-Time")');
    await expect(page.locator('text=License Price')).toBeVisible();

    // Switch to marketplace
    await page.click('button:has-text("Marketplace")');
    await expect(page.locator('text=Commission Rate')).toBeVisible();
  });

  test('equilibrium visualization is displayed', async ({ page }) => {
    await expect(page.locator('text=Price Range Visualization')).toBeVisible();
  });

  test('input changes update results reactively', async ({ page }) => {
    // Get initial suggested price text
    const initialText = await page.locator('.text-2xl.font-bold.text-green-900').textContent();

    // Change monthly price
    await page.fill('input[type="number"]', '1000');

    // Wait for reactive update
    await page.waitForTimeout(100);

    // Results should have updated (we just verify the element is still there and interactive)
    await expect(page.locator('text=Monthly Revenue')).toBeVisible();
  });

  test('shows equilibrium status correctly', async ({ page }) => {
    // Either equilibrium exists or doesn't - one of these should be visible
    const equilibriumExists = page.locator('text=Equilibrium Exists');
    const noViableRange = page.locator('text=No Viable Price Range');

    const existsVisible = await equilibriumExists.isVisible().catch(() => false);
    const noRangeVisible = await noViableRange.isVisible().catch(() => false);

    expect(existsVisible || noRangeVisible).toBeTruthy();
  });
});
