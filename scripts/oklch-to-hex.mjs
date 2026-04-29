/**
 * OKLCH → sRGB hex converter for DaisyUI theme tokens.
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
 *   Run this script when bumping DaisyUI (or any time you want to
 *   sanity-check that the hardcoded hex values still match the
 *   current dim/emerald token definitions). It does NOT run in CI.
 *
 * Usage:
 *   node scripts/oklch-to-hex.mjs              # prints dim + emerald tokens as hex
 *   node scripts/oklch-to-hex.mjs --dim        # dim only
 *   node scripts/oklch-to-hex.mjs --emerald    # emerald only
 *   node scripts/oklch-to-hex.mjs 86.133 0.141 139.549   # ad-hoc OKLCH → hex
 *
 * Conversion pipeline (industry standard):
 *   OKLCH → OKLab → LMS-linear → linear-sRGB → gamma-companded sRGB
 *   See https://bottosson.github.io/posts/oklab/ for the matrices.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// daisyui is a direct dep of @model-pear/web, not the root, so resolve it
// through the web workspace's node_modules (pnpm doesn't hoist it to root).
const DAISYUI_THEMES = join(__dirname, '..', 'apps', 'web', 'node_modules', 'daisyui', 'theme');

/** OKLCH → sRGB hex. L is in percent (0–100), C is the chroma, H is in degrees. */
function oklchToHex(L, C, H) {
  const Lf = L / 100;
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab → LMS linear (cubed)
  const l_ = Lf + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = Lf - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = Lf - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  // LMS → linear sRGB
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Linear sRGB → gamma-companded sRGB, then clip
  const compand = (x) => {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  };
  r = compand(r);
  g = compand(g);
  bb = compand(bb);

  const to8 = (x) => Math.round(x * 255);
  return (
    '#' +
    [to8(r), to8(g), to8(bb)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/** Parse a DaisyUI theme.css file and extract `--color-*: oklch(...)` rules. */
function parseTheme(name) {
  const path = join(DAISYUI_THEMES, `${name}.css`);
  const css = readFileSync(path, 'utf8');
  const rules = [];
  // Match `--color-foo: oklch(L% C H);` with optional decimals and whitespace.
  const re =
    /--color-([a-z0-9-]+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const [, token, L, C, H] = m;
    rules.push({
      token,
      L: parseFloat(L),
      C: parseFloat(C),
      H: parseFloat(H),
      hex: oklchToHex(parseFloat(L), parseFloat(C), parseFloat(H)),
    });
  }
  return rules;
}

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
    '\nThe four hex values hardcoded in this repo (manifest theme_color,\n' +
      'meta theme-color, theme.ts runtime update, icon SVG) should match\n' +
      "the dim base-100 (#2A303C) and the icon's primary/accent/warning\n" +
      "lines above. If they don't, run a coordinated update — see\n" +
      'docs/SESSION_NOTES.md "Major-version dependency upgrade epic".',
  );
}
