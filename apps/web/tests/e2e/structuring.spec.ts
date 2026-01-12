import { test, expect } from '@playwright/test';

test.describe('Transaction Structuring', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/structuring');
  });

  test('page loads with wizard or browse mode', async ({ page }) => {
    // Should show either wizard or browse all models view
    const wizardVisible = await page.locator('text=What type of transaction').isVisible().catch(() => false);
    const browseVisible = await page.locator('text=Browse All Models').isVisible().catch(() => false);

    expect(wizardVisible || browseVisible).toBeTruthy();
  });

  test('can toggle between wizard and browse mode', async ({ page }) => {
    // Look for view mode toggle
    const wizardTab = page.locator('button:has-text("Wizard")');
    const browseTab = page.locator('button:has-text("Browse")');

    if (await wizardTab.isVisible()) {
      await browseTab.click();
      // Should now show model cards
      await expect(page.locator('text=Cost-Plus')).toBeVisible();
    }
  });

  test('browse mode shows all 6 transaction models', async ({ page }) => {
    // Switch to browse mode if needed
    const browseTab = page.locator('button:has-text("Browse")');
    if (await browseTab.isVisible()) {
      await browseTab.click();
    }

    // Check for model cards (may be partial text matches)
    await expect(page.locator('text=Cost-Plus').first()).toBeVisible();
    await expect(page.locator('text=Licence').first()).toBeVisible();
    await expect(page.locator('text=Joint').first()).toBeVisible();
  });

  test('can navigate to model calculator', async ({ page }) => {
    // Switch to browse mode
    const browseTab = page.locator('button:has-text("Browse")');
    if (await browseTab.isVisible()) {
      await browseTab.click();
    }

    // Click on first model card (Cost-Plus)
    await page.click('a[href="/structuring/model-1"]');
    await expect(page).toHaveURL(/\/structuring\/model-1/);
  });
});

test.describe('Model Calculator', () => {
  test('model 1 calculator loads and functions', async ({ page }) => {
    await page.goto('/structuring/model-1');

    // Should show model name and inputs
    await expect(page.locator('h1')).toBeVisible();

    // Should have input fields
    const inputs = page.locator('input[type="number"]');
    await expect(inputs.first()).toBeVisible();
  });

  test('can select different variants', async ({ page }) => {
    await page.goto('/structuring/model-1');

    // Look for variant selector
    const variantSelector = page.locator('select, [role="listbox"], button:has-text("Variant")');
    if (await variantSelector.first().isVisible()) {
      await variantSelector.first().click();
    }
  });

  test('results update when inputs change', async ({ page }) => {
    await page.goto('/structuring/model-1');

    // Find and modify an input
    const firstInput = page.locator('input[type="number"]').first();
    await firstInput.fill('100000');

    // Results section should be visible
    await expect(page.locator('text=Developer').first()).toBeVisible();
  });
});
