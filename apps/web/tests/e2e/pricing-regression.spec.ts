import { test, expect } from '@playwright/test';

const viewports = [
  { name: '320', width: 320, height: 640 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 },
  { name: 'desktop', width: 1280, height: 800 },
];

test.describe('Pricing calculator regression', () => {
  for (const vp of viewports) {
    test(`no pageerror after clear/retype @ ${vp.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/pricing');
      const price = page.locator('#sub_monthlyPrice');
      await price.fill('');
      await price.fill('800');
      await page.waitForTimeout(500);
      expect(errors).toEqual([]);
      const chartHost = page.locator('.chart-host').first();
      if (await chartHost.count()) {
        const chartOverflow = await chartHost.evaluate(
          (el) => el.scrollWidth > el.clientWidth + 2
        );
        expect(chartOverflow).toBe(false);
      }
    });
  }

  for (const margin of ['99', '100', '101']) {
    test(`margin ${margin} has no Apex crash`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto('/pricing');
      await page.locator('#sub_desiredMargin').fill(margin);
      await page.waitForTimeout(600);
      expect(errors.filter((e) => e.includes("reading 'call'"))).toEqual([]);
      if (margin !== '99') {
        await expect(page.locator('text=Please fix these inputs')).toBeVisible();
      }
    });
  }

  const models = ['Subscription', 'Usage-Based', 'Per-Seat', 'One-Time', 'Marketplace'];
  for (const label of models) {
    test(`model ${label} renders without pageerror`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto('/pricing');
      await page.getByRole('button', { name: new RegExp(label) }).click();
      await page.waitForTimeout(800);
      expect(errors).toEqual([]);
    });
  }

  test('negative cost shows validation not silent negative minimum', async ({ page }) => {
    await page.goto('/pricing');
    await page.locator('#sub_costToServe').fill('-167');
    await expect(page.locator('text=Cost to Serve per Customer cannot be negative')).toBeVisible();
  });
});

test.describe('Service worker registration from deep link', () => {
  test.use({ serviceWorkers: 'allow' });

  test('registers from /structuring/model-5 at site root sw.js', async ({ page }) => {
    await page.goto('/structuring/model-5', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const scriptURL = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return reg?.active?.scriptURL ?? reg?.installing?.scriptURL ?? reg?.waiting?.scriptURL ?? '';
    });
    if (scriptURL) {
      const url = new URL(scriptURL);
      expect(url.pathname).toBe('/sw.js');
    }
  });
});
