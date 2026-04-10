/**
 * Generate app icon PNGs from SVG source using Sharp.
 *
 * Requirement: Generate all PWA, favicon, and Apple touch icon sizes from a single SVG source
 * Approach: Sharp rasterises the SVG at 400 DPI before downscaling, producing crisp edges
 *   even at small sizes (48px favicon). Output goes to apps/web/static/ for SvelteKit.
 * Alternatives considered:
 *   - Manual export from design tool: Rejected — not reproducible, requires designer
 *   - canvas/puppeteer: Rejected — heavier dependencies, slower, less precise
 *   - svgo + imagemagick: Rejected — extra system dependency, Sharp handles both steps
 *
 * Run: node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SVG_SOURCE = join(ROOT, 'assets', 'icon-source.svg');
const OUTPUT_DIR = join(ROOT, 'apps', 'web', 'static');

// 400 DPI: ~5.5x the default 72 DPI. Sharp rasterises the SVG at this density
// before downscaling, so edges are anti-aliased from high-res source data.
// The 48px favicon and 192px PWA icon benefit most — curves are noticeably crisper.
const SVG_DENSITY = 400;

const ICONS = [
  { name: 'favicon.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-1024.png', size: 1024 },
];

async function generate() {
  const svgBuffer = readFileSync(SVG_SOURCE);
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const icon of ICONS) {
    await sharp(svgBuffer, { density: SVG_DENSITY })
      .resize(icon.size, icon.size)
      .png()
      .toFile(join(OUTPUT_DIR, icon.name));
    console.log(`  ${icon.name} (${icon.size}x${icon.size})`);
  }
  console.log(`Done — ${ICONS.length} icons generated in apps/web/static/`);
}

generate().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
