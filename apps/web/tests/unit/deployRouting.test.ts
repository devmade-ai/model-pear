// Tripwire: prerendering and routing must agree.
//
// Requirement: the URL the sitemap advertises must serve the prerendered page,
//   not the SPA fallback.
// Why this file exists: it didn't, and prerendering was useless at every URL a
//   crawler is told to visit. vercel.json rewrote `/(.*)` to `/200.html`.
//   Vercel serves an existing file for an EXACT path match, so `/pricing.html`
//   returned the real prerendered page — but `/pricing`, the extensionless URL
//   in sitemap.xml and in every internal link, matches no file, so the
//   catch-all answered it with the boot shell: no title, no content.
//
//   Measured live, after the prerender fix landed:
//     /pricing.html  25,903 bytes  <title>Pricing Calculator - Model Pear</title>
//     /pricing       11,723 bytes  no <title> at all
//
//   The pages were built correctly the whole time. Nothing in the repo was
//   wrong; the deploy config quietly discarded the output. This is the
//   "prerendering and routing must agree" trap in glow-props'
//   DISCOVERABILITY.md, and it only became reachable once the pages existed.
//
// Approach: derive the expectation from the BUILD, not from a hardcoded list —
//   every prerendered page except the shells must have a rewrite that maps its
//   clean URL to its file, ahead of the catch-all. Then check the sitemap
//   advertises only URLs that resolve. Adding a route to +page.ts and
//   forgetting the rewrite fails here rather than in six weeks of no traffic.
//
// Note on placement: vercel.json is a schema-validated API payload, not a
//   document — an added "comment" key fails the deploy. The reasoning lives
//   here instead, which is also where it is executable.

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BUILD = join(WEB_ROOT, 'build');
const VERCEL = join(WEB_ROOT, 'vercel.json');
const SITEMAP = join(WEB_ROOT, 'static', 'sitemap.xml');

/** Pages that are shells, not routes: never advertised, never rewritten to. */
const SHELLS = new Set(['200.html', 'index.html']);

type Rewrite = { source: string; destination: string };
const config = JSON.parse(readFileSync(VERCEL, 'utf8')) as { rewrites: Rewrite[] };
const rewrites = config.rewrites ?? [];
const catchAllIndex = rewrites.findIndex((r) => r.source === '/(.*)');

describe('vercel.json: the catch-all must come last', () => {
  it('has a catch-all', () => {
    expect(catchAllIndex, 'no /(.*) fallback — unknown routes would 404').toBeGreaterThanOrEqual(0);
  });

  it('lists nothing after it', () => {
    // Vercel takes the first matching rewrite. Anything below the catch-all is
    // dead configuration that reads as active.
    expect(rewrites.slice(catchAllIndex + 1)).toEqual([]);
  });
});

const prerendered = existsSync(BUILD)
  ? readdirSync(BUILD).filter((f) => f.endsWith('.html') && !SHELLS.has(f))
  : [];

describe.skipIf(prerendered.length === 0)('every prerendered page is reachable at its clean URL', () => {
  it.each(prerendered)('%s has a rewrite before the catch-all', (file) => {
    const clean = `/${file.replace(/\.html$/, '')}`;
    const match = rewrites.findIndex((r) => r.source === clean && r.destination === `/${file}`);
    expect(
      match,
      `no rewrite maps ${clean} to /${file}. Without it the catch-all serves the ` +
        'SPA shell — the prerendered page is built, deployed, and never served.',
    ).toBeGreaterThanOrEqual(0);
    expect(match, `the ${clean} rewrite is below the catch-all, so it never runs`).toBeLessThan(catchAllIndex);
  });
});

describe('sitemap advertises only URLs that resolve', () => {
  const locs = [...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

  it('lists at least the home page', () => {
    expect(locs.length).toBeGreaterThan(0);
  });

  it.each(locs)('%s is the site root or has a rewrite', (loc) => {
    const path = new URL(loc).pathname.replace(/\/$/, '');
    if (path === '') return; // the root is served by index.html directly
    const covered = rewrites.some((r, i) => r.source === path && i < catchAllIndex);
    expect(
      covered,
      `sitemap advertises ${path}, which no rewrite covers — a crawler following ` +
        'it gets the SPA shell, and indexes an empty page under a real URL.',
    ).toBe(true);
  });
});
