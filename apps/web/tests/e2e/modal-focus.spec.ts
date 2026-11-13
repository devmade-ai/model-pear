import { test, expect, type Page, type Locator } from '@playwright/test';

function saveDialog(page: Page): Locator {
  return page.getByRole('dialog', { name: 'Save Option' });
}

function clearAllDialog(page: Page): Locator {
  return page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Delete all saved options?' }) });
}

async function expectTabCycle(
  page: Page,
  scope: Locator,
  steps: Array<{ role?: string; name?: RegExp | string; label?: RegExp | string; exact?: boolean }>,
): Promise<void> {
  for (const step of steps) {
    if (step.label) {
      await expect(scope.getByLabel(step.label)).toBeFocused();
    } else if (step.name && step.role) {
      await expect(
        scope.getByRole(step.role as 'button', { name: step.name, exact: step.exact ?? false }),
      ).toBeFocused();
    }
    await page.keyboard.press('Tab');
  }
}

test.describe('Save As modal tab order', () => {
  test('desktop 1280x800 cycles Option Name → Cancel → Save → wrap', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/structuring/model-5');
    await page.getByRole('button', { name: 'Save As...' }).click();
    await expect(page.getByRole('heading', { name: 'Save Option' })).toBeVisible();

    const dialog = saveDialog(page);
    await expectTabCycle(page, dialog, [
      { label: 'Option Name' },
      { role: 'button', name: 'Cancel' },
      { role: 'button', name: 'Save', exact: true },
      { label: 'Option Name' },
    ]);
  });

  test('mobile 390x844 cycles Save As controls only', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/structuring/model-5');
    await page.getByRole('button', { name: 'Save As...' }).click();

    const dialog = saveDialog(page);
    await expectTabCycle(page, dialog, [
      { label: 'Option Name' },
      { role: 'button', name: 'Cancel' },
      { role: 'button', name: 'Save', exact: true },
      { label: 'Option Name' },
    ]);
  });
});

test.describe('Clear All confirmation tab order', () => {
  async function openClearAllConfirm(page: Page): Promise<void> {
    await page.goto('/structuring/model-5');
    await page.getByRole('button', { name: 'Save Option' }).click();
    await expect(page.getByRole('button', { name: /Saved Options/i })).toBeVisible();
    await page.getByRole('button', { name: 'Clear All' }).click();
    await expect(page.getByRole('heading', { name: 'Delete all saved options?' })).toBeVisible();
  }

  test('desktop 1280x800 cycles Cancel → Delete all → wrap', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openClearAllConfirm(page);

    const dialog = clearAllDialog(page);
    await expectTabCycle(page, dialog, [
      { role: 'button', name: 'Cancel' },
      { role: 'button', name: 'Delete all' },
      { role: 'button', name: 'Cancel' },
    ]);
  });

  test('mobile 390x844 cycles Clear All confirmation only', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openClearAllConfirm(page);

    const dialog = clearAllDialog(page);
    await expectTabCycle(page, dialog, [
      { role: 'button', name: 'Cancel' },
      { role: 'button', name: 'Delete all' },
      { role: 'button', name: 'Cancel' },
    ]);
  });
});

test.describe('modal backdrop is not focusable', () => {
  test('Tab never focuses modal-backdrop close control', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/structuring/model-5');
    await page.getByRole('button', { name: 'Save As...' }).click();

    const dialog = saveDialog(page);
    for (let i = 0; i < 6; i++) {
      await expect(dialog.getByRole('button', { name: 'close' })).toHaveCount(0);
      await expect(dialog.getByTestId('modal-backdrop')).toBeAttached();
      await page.keyboard.press('Tab');
    }
  });
});
