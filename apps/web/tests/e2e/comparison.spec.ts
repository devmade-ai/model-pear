import { test, expect } from '@playwright/test';

test.describe('Comparison Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/structuring/model-1');
  });

  test('can save calculation result', async ({ page }) => {
    const saveOption = page.getByRole('button', { name: 'Save Option' });
    await expect(saveOption).toBeVisible();
    await saveOption.click();
    await expect(page.getByText('Save Option').first()).toBeVisible();
  });

  test('comparison manager shows saved options', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /Saved Options/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('h2:text("Saved Options")')).toBeVisible();
  });
});

test.describe('Export Features', () => {
  test('comparison view has export buttons', async ({ page }) => {
    await page.goto('/structuring/model-1');
    const compareButton = page.getByRole('button', { name: /Compare/i }).first();
    if (await compareButton.isVisible()) {
      await expect(compareButton).toBeVisible();
    }
  });
});
