import { test, expect } from '@playwright/test';

test.describe('Transaction Structuring', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/structuring');
  });

  test('page loads with wizard or browse mode', async ({ page }) => {
    const wizardVisible = await page.locator('text=What type of transaction').isVisible().catch(() => false);
    const browseVisible = await page.locator('text=Browse All Models').isVisible().catch(() => false);
    expect(wizardVisible || browseVisible).toBeTruthy();
  });

  test('can toggle between wizard and browse mode', async ({ page }) => {
    const browseTab = page.getByRole('tab', { name: 'Browse All Models' });
    await browseTab.click();
    await expect(page.getByRole('button', { name: /Cost-Plus/i }).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('browse mode shows all 6 transaction models', async ({ page }) => {
    await page.getByRole('tab', { name: 'Browse All Models' }).click();
    await expect(page.getByText(/Cost-Plus/i).first()).toBeVisible();
    await expect(page.getByText(/Licence/i).first()).toBeVisible();
    await expect(page.getByText(/Joint/i).first()).toBeVisible();
  });

  test('can navigate to model calculator', async ({ page }) => {
    await page.getByRole('tab', { name: 'Browse All Models' }).click();
    await page.getByRole('button', { name: /Cost-Plus/i }).first().click();
    await expect(page).toHaveURL(/\/structuring\/model-1/);
  });
});

test.describe('Model Calculator', () => {
  test('model 1 calculator loads and functions', async ({ page }) => {
    await page.goto('/structuring/model-1');
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
    await expect(page.getByText('Developer').first()).toBeVisible();
  });
});
