/**
 * Shared OKLCH → sRGB hex conversion + DaisyUI theme parsing.
 *
 * Used by:
 *   - scripts/oklch-to-hex.mjs (interactive: print all dim/emerald tokens)
 *   - scripts/check-theme-hex.mjs (CI: assert hardcoded hex sites match)
 *
 * Pipeline (industry standard):
 *   OKLCH → OKLab → LMS-linear → linear-sRGB → gamma-companded sRGB
 *   See https://bottosson.github.io/posts/oklab/ for the matrices.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// daisyui is a direct dep of @model-pear/web, not the root, so resolve it
// through the web workspace's node_modules (pnpm doesn't hoist it to root).
export const DAISYUI_THEMES = join(__dirname, '..', '..', 'apps', 'web', 'node_modules', 'daisyui', 'theme');

/** OKLCH → sRGB hex. L is in percent (0–100), C is the chroma, H is in degrees. */
export function oklchToHex(L, C, H) {
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

/**
 * Parse a DaisyUI theme.css file and return its --color-* rules as an array of
 * { token, L, C, H, hex } entries.
 */
export function parseTheme(name) {
  const path = join(DAISYUI_THEMES, `${name}.css`);
  if (!existsSync(path)) {
    throw new Error(
      `DaisyUI theme not found: ${path}. Run \`pnpm install\` in apps/web first.`,
    );
  }
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

/**
 * Convenience wrapper: parseTheme but returns a token → hex map.
 * { 'base-100': '#2A303C', 'primary': '#9FE88D', ... }
 */
export function parseThemeMap(name) {
  const map = {};
  for (const r of parseTheme(name)) {
    map[r.token] = r.hex;
  }
  return map;
}
