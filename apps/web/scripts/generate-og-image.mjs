/**
 * Generate the 1200×630 link-preview card from the existing 1024 app icon.
 *
 * Requirement: a shared Model Pear link must render as a card rather than a
 *   bare URL. The calculators get sent to colleagues and clients by link; the
 *   preview is what tells the recipient what they are about to open.
 *
 * Why not reuse the square icon directly as og:image: every platform expecting
 *   1.91:1 either crops it — cutting the mark — or letterboxes it, and it reads
 *   as a mistake. Different ratio, different asset.
 *
 * Source is icon-1024.png rather than an SVG because this repo has no vector
 *   source; the 1024 raster downsampled to 340 is comfortably sharp at card
 *   size, and regenerating from the same file keeps the card and the app icon
 *   the same artwork.
 *
 * No text in the image: sharp rasterises text through fontconfig, which cannot
 *   load .woff2 webfonts, so a wordmark silently renders in whatever system
 *   font exists. The words belong in og:title / og:description, which every
 *   unfurler renders itself.
 *
 * Run: `npm run generate-og` (wired into prebuild).
 */

import sharp from 'sharp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticDir = resolve(__dirname, '../static');

const WIDTH = 1200;
const HEIGHT = 630;
const MARK = 340;
// DaisyUI dim base-100 — the dark theme's page colour, and the manifest
// theme_color, so the card and the installed app read as the same product.
const PLATE = '#2A303C';

async function generate() {
  const mark = await sharp(resolve(staticDir, 'icon-1024.png'))
    .resize(MARK, MARK, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Two passes: sharp applies .composite() at the END of its pipeline, so
  // chaining .flatten() alongside it runs BEFORE the mark lands — a blank plate.
  const composited = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: PLATE },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer();

  const out = resolve(staticDir, 'og-card.png');
  await sharp(composited).flatten({ background: PLATE }).png().toFile(out);

  // Assert the emitted file, not the numbers we asked for — a declared
  // og:image:width only ever proves you can type.
  const meta = await sharp(out).metadata();
  if (meta.width !== WIDTH || meta.height !== HEIGHT) {
    throw new Error(`og-card.png is ${meta.width}×${meta.height}, expected ${WIDTH}×${HEIGHT}`);
  }
  console.log(`  og-card.png (${meta.width}x${meta.height}, mark ${MARK}px on ${PLATE})`);
}

generate().catch((err) => {
  console.error('OG card generation failed:', err);
  process.exit(1);
});
