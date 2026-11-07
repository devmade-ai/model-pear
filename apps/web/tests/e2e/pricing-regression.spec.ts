import { test, expect } from '@playwright/test';

const viewports = [
  { name: '320', width: 320, height: 640 },
  { name: '360', width: 360, height: 640 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 },
  { name: 'desktop', width: 1280, height: 800 },
];

const narrowCriticalWidths = [320, 360, 375, 390] as const;

const pricingModels = [
  { label: 'Subscription', pattern: /Subscription/ },
  { label: 'Usage-Based', pattern: /Usage-Based/ },
  { label: 'Per-Seat', pattern: /Per-Seat/ },
  { label: 'One-Time', pattern: /One-Time/ },
  { label: 'Marketplace', pattern: /Marketplace/ },
] as const;

/**
 * Document may be wider than the viewport only when the intentional pricing
 * model strip scrolls internally — not when charts or other content bleed out.
 */
async function assertNoChartDocumentBleed(
  page: import('@playwright/test').Page,
  options?: { allowPricingStrip?: boolean }
) {
  const result = await page.evaluate((allowStrip) => {
    const cw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    let chartBleed = 0;
    for (const host of document.querySelectorAll('.chart-host')) {
      const r = host.getBoundingClientRect();
      chartBleed = Math.max(chartBleed, r.right - cw, -r.left);
    }
    let stripBudget = 0;
    if (allowStrip) {
      const strip = document.querySelector('[data-pricing-model-strip]');
      if (strip) {
        stripBudget = Math.max(0, strip.scrollWidth - strip.clientWidth);
        for (const child of strip.children) {
          const r = child.getBoundingClientRect();
          stripBudget = Math.max(stripBudget, r.right - cw);
        }
      }
    }
    const docExcess = sw - cw;
    const unexplained = Math.max(0, docExcess - (allowStrip ? stripBudget : 0));
    return { cw, sw, docExcess, stripBudget, chartBleed, unexplained };
  }, options?.allowPricingStrip ?? false);

  expect(result.unexplained, `doc overflow ${JSON.stringify(result)}`).toBeLessThanOrEqual(2);
  expect(result.chartBleed, `chart-host bleed ${JSON.stringify(result)}`).toBeLessThanOrEqual(2);
}

/** Critical pricing values must be painted inside the viewport — not masked by parent overflow clip. */
async function assertElementInViewport(
  locator: import('@playwright/test').Locator,
  viewportWidth: number,
  label: string
) {
  await expect(locator, `${label} not found`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${label} bounding box`).not.toBeNull();
  expect(box!.width, `${label} width`).toBeGreaterThan(0);
  expect(box!.x, `${label} left`).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width, `${label} right`).toBeLessThanOrEqual(viewportWidth + 2);
}

async function assertCriticalPricingVisible(page: import('@playwright/test').Page, viewportWidth: number) {
  const scaleHigh = page.locator('dl[aria-label="Price scale"] > div').nth(2).locator('dd');
  await assertElementInViewport(scaleHigh, viewportWidth, 'Scale high');

  const monthlyProfit = page
    .locator('.stat')
    .filter({ has: page.getByText('Monthly Profit', { exact: true }) })
    .locator('.stat-value');
  await assertElementInViewport(monthlyProfit, viewportWidth, 'Monthly Profit');

  const annualProfit = page
    .locator('.stat')
    .filter({ has: page.getByText('Annual Profit', { exact: true }) })
    .locator('.stat-value');
  await assertElementInViewport(annualProfit, viewportWidth, 'Annual Profit');

  const equilibriumLine = page.locator('[data-pricing-equilibrium-line]');
  await assertElementInViewport(equilibriumLine, viewportWidth, 'Equilibrium zone line');

  const chartHost = page.locator('.chart-host').first();
  await assertElementInViewport(chartHost, viewportWidth, 'Equilibrium chart host');

  const inputsCard = page.getByRole('heading', { name: 'Inputs', exact: true }).locator('..');
  await assertElementInViewport(inputsCard, viewportWidth, 'Inputs card');

  const resultsCard = page.getByRole('heading', { name: 'Results', exact: true }).locator('..');
  await assertElementInViewport(resultsCard, viewportWidth, 'Results card');
}

async function assertPricingGridTracksShrink(page: import('@playwright/test').Page) {
  const tracks = await page.evaluate(() => {
    const grid = document.querySelector('.pricing-main-grid');
    if (!grid) return { missing: true as const };
    const r = grid.getBoundingClientRect();
    const cols = getComputedStyle(grid).gridTemplateColumns;
    const firstCol = parseFloat(cols) || r.width;
    return {
      missing: false as const,
      gridClientWidth: grid.clientWidth,
      gridRight: r.right,
      firstColPx: firstCol,
      viewport: document.documentElement.clientWidth,
    };
  });
  expect(tracks.missing, 'pricing-main-grid').toBe(false);
  if (!tracks.missing) {
    expect(tracks.firstColPx).toBeLessThanOrEqual(tracks.gridClientWidth + 2);
    expect(tracks.gridRight).toBeLessThanOrEqual(tracks.viewport + 2);
  }
}

function doubledCurrencyTick(text: string): boolean {
  return /R[\s\u00a0]?\d.*R[\s\u00a0]?\d/.test(text) || /R\d+KR\d+K/.test(text);
}

test.describe('Pricing calculator regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  for (const vp of viewports) {
    test(`clear/retype and chart readable @ ${vp.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const price = page.locator('#sub_monthlyPrice');
      await price.fill('');
      await price.fill('800');
      await price.blur();
      await page.waitForTimeout(600);
      expect(errors).toEqual([]);

      await expect(page.locator('dl[aria-label="Price scale"]')).toBeVisible();
      await expect(page.locator('dl[aria-label="Price scale"] dd').first()).not.toHaveText(/^[\s—]*$/);
      await assertNoChartDocumentBleed(page, { allowPricingStrip: vp.width < 640 });
      if (narrowCriticalWidths.includes(vp.width as (typeof narrowCriticalWidths)[number])) {
        await assertCriticalPricingVisible(page, vp.width);
        await assertPricingGridTracksShrink(page);
      }
    });
  }

  for (const width of narrowCriticalWidths) {
    for (const model of pricingModels) {
      test(`critical layout ${model.label} @ ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/pricing');
        await page.getByRole('button', { name: model.pattern }).click();
        await page.waitForTimeout(800);
        await assertCriticalPricingVisible(page, width);
        await assertPricingGridTracksShrink(page);
        await assertNoChartDocumentBleed(page, { allowPricingStrip: width < 640 });
      });
    }
  }

  for (const margin of ['99', '100', '101']) {
    test(`margin ${margin} no Apex crash`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      const marginInput = page.locator('#sub_desiredMargin');
      await marginInput.fill(margin);
      await marginInput.blur();
      await page.waitForTimeout(600);
      expect(errors.filter((e) => e.includes("reading 'call'"))).toEqual([]);
      if (margin !== '99') {
        const alert = page.getByRole('alert');
        await expect(alert).toContainText('Please fix these inputs');
        await expect(alert).toContainText(/margin|99%/i);
      } else {
        await expect(page.locator('dl[aria-label="Price scale"]')).toBeVisible();
      }
    });
  }

  const models = ['Subscription', 'Usage-Based', 'Per-Seat', 'One-Time', 'Marketplace'];
  for (const label of models) {
    test(`model ${label} empty then recover`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.getByRole('button', { name: new RegExp(label) }).click();
      await page.waitForTimeout(400);
      const firstInput = page.locator('input[type=number]').first();
      await firstInput.fill('');
      await firstInput.fill('100');
      await firstInput.blur();
      await page.waitForTimeout(500);
      expect(errors).toEqual([]);
    });
  }

  test('marketplace commission 100 allowed; desired margin 100 blocked', async ({ page }) => {
    await page.getByRole('button', { name: /Marketplace/ }).click();
    await page.locator('#market_commissionRate').fill('100');
    await page.locator('#market_desiredMargin').fill('70');
    await page.waitForTimeout(500);
    const alert = page.getByRole('alert');
    await expect(alert).toHaveCount(0);
    await expect(page.getByRole('status')).toContainText(/Equilibrium|Viable/i);

    await page.locator('#market_commissionRate').fill('101');
    await page.locator('#market_commissionRate').blur();
    await page.waitForTimeout(400);
    await expect(page.getByRole('alert')).toContainText(/Commission Rate cannot be above 100/i);
    await page.locator('#market_commissionRate').fill('10');
    await page.locator('#market_commissionRate').blur();
    await page.waitForTimeout(300);
    await expect(page.getByRole('alert')).toHaveCount(0);

    await page.locator('#market_desiredMargin').fill('100');
    await page.locator('#market_desiredMargin').blur();
    await page.waitForTimeout(400);
    await expect(page.getByRole('alert')).toContainText(/cannot be above 99|Desired margin must be below 100%/i);
  });

  test('negative cost shows validation', async ({ page }) => {
    const cost = page.locator('#sub_costToServe');
    await cost.fill('-167');
    await cost.blur();
    const alert = page.getByRole('alert');
    await expect(alert).toContainText('cannot be negative');
  });

  test('usage chart ticks are not doubled @ 390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: /Usage-Based/ }).click();
    await page.waitForTimeout(900);
    const ticks = await page.locator('.apexcharts-xaxis-label, .apexcharts-yaxis-label').allTextContents();
    for (const t of ticks) {
      expect(doubledCurrencyTick(t), `doubled tick: ${t}`).toBe(false);
    }
    await assertNoChartDocumentBleed(page, { allowPricingStrip: true });
  });
});

test.describe('Model 5 sensitivity charts', () => {
  test('advanced sensitivity does not widen document @ 390', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/structuring/model-5', { waitUntil: 'networkidle' });

    await page
      .locator('.collapse')
      .filter({ hasText: 'Advanced Analysis' })
      .locator('input[type=checkbox]')
      .check();
    await page.waitForTimeout(1200);

    const sensitivity = page.locator('h4', { hasText: 'Sensitivity Analysis' }).locator('..');
    const ticks = await sensitivity.locator('.apexcharts-xaxis-label, .apexcharts-yaxis-label').allTextContents();
    for (const t of ticks) {
      expect(doubledCurrencyTick(t), `doubled tick: ${t}`).toBe(false);
      expect(t).not.toMatch(/CaseCase$/);
    }
    expect(errors).toEqual([]);
    await assertNoChartDocumentBleed(page);
    await expect(sensitivity.locator('text=Scenario Analysis')).toBeVisible();
    await expect(page.getByText('Worst', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Impact in ZAR', { exact: false })).toBeVisible();
  });
});

test.describe('Service worker on preview', () => {
  test.use({ serviceWorkers: 'allow' });

  test('registers site-root /sw.js after deep link (localhost preview)', async ({ page, baseURL, request }) => {
    test.info().annotations.push({
      type: 'note',
      description: `Requires built preview at ${baseURL} with pwa module loaded`,
    });

    for (const method of ['GET', 'HEAD'] as const) {
      const shell = await request.fetch(`${baseURL}/200.html`, { method });
      expect(shell.status(), `${method} /200.html must return 200 on pnpm preview server`).toBe(200);
    }

    const swProbe = await request.get(`${baseURL}/sw.js`);
    expect(swProbe.status(), '/sw.js must be served on preview').toBe(200);

    const swConsole: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('[pwa]') || msg.text().toLowerCase().includes('service worker')) {
        swConsole.push(msg.text());
      }
    });

    await page.goto('/structuring/model-5', { waitUntil: 'networkidle' });

    const regState = await page.waitForFunction(
      async () => {
        const reg = await navigator.serviceWorker.getRegistration('/');
        const scriptURL =
          reg?.active?.scriptURL ?? reg?.installing?.scriptURL ?? reg?.waiting?.scriptURL ?? '';
        return scriptURL ? { scriptURL, state: reg?.active?.state ?? reg?.installing?.state ?? '' } : null;
      },
      null,
      { timeout: 25_000 }
    );

    const value = (await regState.jsonValue()) as { scriptURL: string; state: string } | null;
    expect(
      value?.scriptURL,
      `service worker must register on localhost preview (pwa.ts); console: ${swConsole.join(' | ')}`
    ).toBeTruthy();
    expect(new URL(value!.scriptURL).pathname).toBe('/sw.js');
  });
});
