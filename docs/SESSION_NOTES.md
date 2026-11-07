# Session Notes

## Pricing narrow layout follow-up (`devmade/pricing-narrow-layout-fix-9aed`)

- Post-merge #132 prod audit: at 320px pricing grid implicit min-content (~387px) plus `overflow-x-clip` masked clipped values; fix is `minmax(0,1fr)` on `.pricing-main-grid`, `.pricing-metrics-grid`, `.pricing-price-scale`, `min-w-0` on columns/cards/stats, removed pricing grid `overflow-x-clip`.
- E2E: `assertCriticalPricingVisible` + `assertPricingGridTracksShrink`; all 5 models @ 320/360/375/390; `chartBleed` in `assertNoChartDocumentBleed`.
- Playwright: `PLAYWRIGHT_USE_SYSTEM_CHROME=1` + `preview-e2e.mjs` for SW test unchanged.
