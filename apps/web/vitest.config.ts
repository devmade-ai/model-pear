import { defineConfig } from 'vitest/config';

// Vitest config for the web app's pure-TS unit tests.
// Mirrors packages/calculator/vitest.config.ts so a future
// apps-wide test epic (Phase J in SESSION_NOTES) can build on
// the same conventions. Component / Svelte tests would need
// a jsdom environment + svelte-testing-library — not added
// here because no Svelte tests exist yet.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
