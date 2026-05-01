/**
 * Drift check: hardcoded hex sites vs current DaisyUI dim/emerald tokens.
 *
 * Run via `pnpm check:theme-hex` (also gated by `pnpm check`). Fails the
 * build with a non-zero exit code if any hardcoded hex no longer matches
 * the OKLCH-derived value from DaisyUI's theme files — i.e. DaisyUI
 * bumped a colour and the hardcoded site needs regenerating.
 *
 * Why this exists:
 *   Four kinds of artefacts can't reference DaisyUI's CSS variables at
 *   runtime — they need literal sRGB hex baked in:
 *     - HTML meta attributes (<meta name="theme-color">)
 *     - JS attribute setters that mirror the meta tag at runtime
 *     - PWA manifest fields (theme_color, background_color)
 *     - SVG fills used to rasterise PWA icons via Sharp/libvips
 *
 *   Each hardcoded site has a documented "should match dim/--color-X"
 *   intent. This script checks that intent against the current DaisyUI
 *   theme files. Without it, a DaisyUI bump silently desynchronises
 *   the icons / manifest / meta tag from the live theme.
 *
 * Adding a new hardcoded site: append to the `sites` array below.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseThemeMap } from './lib/oklch.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const dim = parseThemeMap('dim');
const emerald = parseThemeMap('emerald');

/**
 * Each entry pins one literal hex against one DaisyUI token. The pattern
 * is anchored enough to disambiguate when a file holds multiple hex
 * values (e.g. icon-source.svg's 4 fills, theme.ts's ternary).
 */
const sites = [
  {
    file: 'apps/web/src/app.html',
    expected: dim['base-100'],
    pattern: /<meta name="theme-color" content="(#[0-9a-fA-F]{6})"/,
    label: 'app.html <meta name="theme-color"> (dim base-100)',
  },
  {
    file: 'apps/web/src/app.html',
    expected: dim['base-100'],
    pattern: /darkMode \? '(#[0-9a-fA-F]{6})' : '#[0-9a-fA-F]{6}'/,
    label: 'app.html bootstrap meta update — dark path (dim base-100)',
  },
  {
    file: 'apps/web/src/app.html',
    expected: emerald['base-100'],
    pattern: /darkMode \? '#[0-9a-fA-F]{6}' : '(#[0-9a-fA-F]{6})'/,
    label: 'app.html bootstrap meta update — light path (emerald base-100)',
  },
  {
    file: 'apps/web/src/lib/theme.ts',
    expected: dim['base-100'],
    pattern: /dark \? '(#[0-9a-fA-F]{6})' : '#[0-9a-fA-F]{6}'/,
    label: 'theme.ts runtime meta update — dark path (dim base-100)',
  },
  {
    file: 'apps/web/src/lib/theme.ts',
    expected: emerald['base-100'],
    pattern: /dark \? '#[0-9a-fA-F]{6}' : '(#[0-9a-fA-F]{6})'/,
    label: 'theme.ts runtime meta update — light path (emerald base-100)',
  },
  {
    file: 'apps/web/vite.config.ts',
    expected: dim['base-100'],
    pattern: /theme_color: '(#[0-9a-fA-F]{6})'/,
    label: 'vite.config.ts manifest theme_color (dim base-100)',
  },
  {
    file: 'apps/web/vite.config.ts',
    expected: dim['base-100'],
    pattern: /background_color: '(#[0-9a-fA-F]{6})'/,
    label: 'vite.config.ts manifest background_color (dim base-100)',
  },
  {
    file: 'assets/icon-source.svg',
    expected: dim['base-100'],
    pattern: /<rect width="1024" height="1024" fill="(#[0-9a-fA-F]{6})"/,
    label: 'icon-source.svg background <rect> (dim base-100)',
  },
  {
    file: 'assets/icon-source.svg',
    expected: dim['primary'],
    pattern: /<circle cx="412" cy="512" r="240" fill="(#[0-9a-fA-F]{6})"/,
    label: 'icon-source.svg left circle (dim primary)',
  },
  {
    file: 'assets/icon-source.svg',
    // Right circle WITHOUT clip-path — the self-closing slash directly
    // after the closing quote disambiguates from the warning circle
    // which has clip-path on the next line.
    expected: dim['accent'],
    pattern: /<circle cx="612" cy="512" r="240" fill="(#[0-9a-fA-F]{6})"\/>/,
    label: 'icon-source.svg right circle (dim accent)',
  },
  {
    file: 'assets/icon-source.svg',
    // Warning lens — the multi-line continuation with clip-path identifies it.
    expected: dim['warning'],
    pattern: /<circle cx="612" cy="512" r="240" fill="(#[0-9a-fA-F]{6})"\s*\n\s*clip-path/,
    label: 'icon-source.svg overlap (dim warning)',
  },
];

let failed = 0;
let passed = 0;
for (const site of sites) {
  const path = join(ROOT, site.file);
  if (!existsSync(path)) {
    console.error(`  ✗ ${site.label}\n      file not found: ${site.file}`);
    failed++;
    continue;
  }
  const content = readFileSync(path, 'utf8');
  const m = content.match(site.pattern);
  if (!m) {
    console.error(
      `  ✗ ${site.label}\n      pattern not matched in ${site.file}; the hardcoded site may have moved.`,
    );
    failed++;
    continue;
  }
  const actual = m[1].toUpperCase();
  const expected = site.expected.toUpperCase();
  if (actual !== expected) {
    console.error(
      `  ✗ ${site.label}\n      ${site.file}: hardcoded ${actual} but DaisyUI now resolves to ${expected}`,
    );
    failed++;
  } else {
    passed++;
  }
}

if (failed > 0) {
  console.error(
    `\n${failed} drift(s) detected — DaisyUI dim/emerald tokens have moved from the\n` +
      'hardcoded values. Run `node scripts/oklch-to-hex.mjs` for the current\n' +
      'OKLCH → sRGB conversions, update the sites listed above, and re-run\n' +
      '`pnpm generate-icons` to refresh the rasterised PWA icons.\n',
  );
  process.exit(1);
}

console.log(
  `theme-hex check: ${passed}/${sites.length} hardcoded hex sites in sync with DaisyUI dim/emerald tokens.`,
);
