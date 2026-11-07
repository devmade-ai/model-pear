# Session Notes

## PR #132 follow-up (in flight on `devmade/pricing-chart-a11y-fixes-9aed`)

- Playwright E2E uses system Chrome when `PLAYWRIGHT_USE_SYSTEM_CHROME=1` (browser bundle download fails in cloud VM). Web server for E2E is `apps/web/scripts/preview-e2e.mjs` (not `vite preview`) so `/200.html` returns HTTP 200 for SW install.
- PWA registration uses `workbox-window` with absolute `/sw.js` and scope `/` in `pwa.ts` (virtual `registerSW` emitted `./sw.js` on deep routes).
- Pricing validation reactivity: `pricingFieldDefs` must list all input deps in its `$:` line (same pattern as `calculateResults`).
