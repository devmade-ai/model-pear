import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

export default [
  {
    ignores: [
      'build/**',
      '.svelte-kit/**',
      'dist/**',
      'node_modules/**',
      'static/**',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    // TypeScript already checks for undefined identifiers and types — running
    // ESLint's no-undef on top double-counts and crucially misfires on
    // type-only references (e.g. `ApexCharts.ApexOptions`, `EventListener`).
    files: ['**/*.ts', '**/*.svelte'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      // typescript-eslint's no-unused-vars crashes on Svelte template ASTs in
      // v8 + eslint-plugin-svelte v3. Fall back to svelte-eslint-parser's own
      // detection.
      '@typescript-eslint/no-unused-vars': 'off',
      // Reactive `$:` blocks in Svelte 4 frequently use comma operators or
      // trailing side-effect expressions this rule misreads.
      '@typescript-eslint/no-unused-expressions': 'off',
      // Svelte 4 idiom: `let X = init; $: X = derived;` — the initializer
      // looks "useless" to ESLint but TypeScript needs the declaration before
      // the reactive `$:` block hoists.
      'no-useless-assignment': 'off',
    },
  },
];
