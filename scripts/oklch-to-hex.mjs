/**
 * OKLCH → sRGB hex converter for DaisyUI theme tokens (interactive).
 *
 * Why this exists:
 *   PWA icons (apps/web/static/*.png) and a handful of pre-CSS
 *   references (PWA manifest in vite.config.ts, the meta theme-color
 *   tag in app.html, theme.ts's runtime meta update) need literal
 *   sRGB hex strings — they can't read DaisyUI's CSS variables at
 *   runtime. DaisyUI v5 ships its theme tokens in OKLCH, so those
 *   four sites are the only places where a manual conversion is
 *   needed; everything else reads tokens through `var(--color-*)`.
 *
 *   Run this script when bumping DaisyUI to print a sanity-check
 *   table. The drift assertion runs separately via
 *   `pnpm check:theme-hex` (and is wired into `pnpm check`).
 *
 * Usage:
 *   node scripts/oklch-to-hex.mjs              # prints dim + emerald tokens as hex
 *   node scripts/oklch-to-hex.mjs --dim        # dim only
 *   node scripts/oklch-to-hex.mjs --emerald    # emerald only
 *   node scripts/oklch-to-hex.mjs 86.133 0.141 139.549   # ad-hoc OKLCH → hex
 */

import { oklchToHex, parseTheme } from './lib/oklch.mjs';

function printTheme(name) {
  const rules = parseTheme(name);
  if (rules.length === 0) {
    console.error(`No --color-* rules found in ${name}.css`);
    return;
  }
  console.log(`\nDaisyUI ${name} theme — OKLCH → sRGB hex:`);
  console.log('  token             hex      OKLCH source');
  console.log('  ' + '-'.repeat(58));
  for (const r of rules) {
    const tok = r.token.padEnd(15);
    const oklch = `oklch(${r.L}% ${r.C} ${r.H})`;
    console.log(`  ${tok}   ${r.hex}   ${oklch}`);
  }
}

const args = process.argv.slice(2);

// Ad-hoc mode: three numeric args = OKLCH values
if (args.length === 3 && args.every((a) => !isNaN(parseFloat(a)))) {
  const [L, C, H] = args.map(parseFloat);
  console.log(oklchToHex(L, C, H));
} else if (args.includes('--dim')) {
  printTheme('dim');
} else if (args.includes('--emerald')) {
  printTheme('emerald');
} else {
  printTheme('dim');
  printTheme('emerald');
  console.log(
    '\nThe hardcoded hex sites in this repo (manifest theme_color in\n' +
      'vite.config.ts, meta theme-color in app.html, theme.ts runtime\n' +
      'update, icon-source.svg) are checked automatically by\n' +
      '`pnpm check:theme-hex`. If a check fails after a DaisyUI bump,\n' +
      'update the hardcoded sites to match the table above.',
  );
}
