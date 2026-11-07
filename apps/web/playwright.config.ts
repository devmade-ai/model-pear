import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /mobile\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Cloud agent: Playwright browser download fails; use system Chrome when present.
        ...(process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1'
          ? { channel: 'chrome' as const }
          : {}),
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports for responsive testing
    {
      name: 'mobile-chrome',
      testMatch: /mobile\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        ...(process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1'
          ? { channel: 'chrome' as const }
          : {}),
      },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'node scripts/preview-e2e.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
