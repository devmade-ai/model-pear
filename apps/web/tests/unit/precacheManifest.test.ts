// Built-output tripwire for the service worker's precache manifest.
//
// Requirement: the SW must actually install in production.
// Why this file exists: it didn't. Two independent defects shipped, and neither
//   was visible to `vite build` (which exited 0 and printed "precache 37 entries")
//   nor to any source-level assertion:
//
//     1. `navigateFallback: '/200.html'` named a URL that was never precached.
//        SvelteKit runs the SSR build as the outer build and spawns the client
//        build inside it, so vite-plugin-pwa globs .svelte-kit/output/client —
//        which holds no HTML. adapter-static writes 200.html into build/ after
//        that. workbox's generated sw.js calls createHandlerBoundToURL('/200.html')
//        at top level, which throws non-precached-url when the URL has no cache
//        key, so the worker died on evaluation and registration rejected: no
//        offline support and no update mechanism, silently, in production.
//
//     2. `globPatterns` included `json`, precaching _app/version.json — the file
//        SvelteKit's own `updated` store polls to detect deploys. A precached copy
//        makes it report "no new version" forever.
//
// Approach: parse the emitted precache manifest out of build/sw.js and assert the
//   invariants directly. Substring greps over sw.js cannot see any of this.
// Alternatives:
//   - Assert against vite.config.ts source: Rejected — the config was *correct-looking*
//     in both cases; the defect only exists in the built manifest.
//   - Playwright check for a registered SW: Rejected — slower, and it would catch (1)
//     but not (2), and not the latent duplicate-entry class at all.

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const APP_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SW_PATH = join(APP_ROOT, 'build', 'sw.js');
const BUILT = existsSync(SW_PATH);

// A skipped tripwire is indistinguishable from a passing one, which is how this
// class of bug survives. Be loud locally, and hard-fail in CI.
if (!BUILT) {
  const message =
    `[precache-manifest] build/sw.js not found — run \`vite build\` to enable these ` +
    `assertions. They are the only check that the service worker can install at all.`;
  if (process.env.CI) throw new Error(message);
  console.warn(message);
}

interface PrecacheEntry {
  url: string;
  revision: string | null;
}

function readManifest(): PrecacheEntry[] {
  const sw = readFileSync(SW_PATH, 'utf8');
  const match = sw.match(/precacheAndRoute\(\s*(\[[\s\S]*?\])\s*,/);
  if (!match) throw new Error('could not locate the precache manifest in build/sw.js');
  return JSON.parse(match[1].replace(/([{,])(\w+):/g, '$1"$2":').replace(/'/g, '"'));
}

function readNavigateFallback(): string | null {
  const sw = readFileSync(SW_PATH, 'utf8');
  const match = sw.match(/createHandlerBoundToURL\((["'][^"']*["'])\)/);
  return match ? match[1].replace(/["']/g, '') : null;
}

describe.skipIf(!BUILT)('service worker precache manifest', () => {
  it('precaches the navigateFallback URL, so the worker can evaluate', () => {
    const fallback = readNavigateFallback();
    expect(fallback, 'no createHandlerBoundToURL in sw.js').not.toBeNull();

    const urls = readManifest().map((entry) => entry.url);
    expect(
      urls,
      `navigateFallback is ${fallback} but that URL is not in the precache manifest. ` +
        `createHandlerBoundToURL throws non-precached-url at SW evaluation, so the ` +
        `worker never installs. Add it via workbox.additionalManifestEntries.`,
    ).toContain(fallback);
  });

  it('has exactly one entry per URL', () => {
    const byUrl = new Map<string, (string | null)[]>();
    for (const entry of readManifest()) {
      if (!byUrl.has(entry.url)) byUrl.set(entry.url, []);
      byUrl.get(entry.url)!.push(entry.revision);
    }

    const duplicates = [...byUrl].filter(([, revisions]) => revisions.length > 1);
    const conflicts = duplicates.filter(
      ([, revisions]) => new Set(revisions.map(String)).size > 1,
    );

    // Conflicting revisions are fatal: two cache keys for one URL makes
    // precacheAndRoute() throw add-to-cache-list-conflicting-entries.
    expect(
      conflicts.map(([url]) => url),
      'these URLs have two precache entries with DIFFERENT revisions — the service ' +
        'worker throws add-to-cache-list-conflicting-entries and never installs',
    ).toEqual([]);

    // Matching revisions dedupe silently today but are one config change away from
    // the fatal form, so fail on them too. Sources: globPatterns, includeAssets,
    // includeManifestIcons, additionalManifestEntries.
    expect(
      duplicates.map(([url]) => url),
      'these URLs reach the precache manifest twice; collapse to a single source',
    ).toEqual([]);
  });

  it("does not precache SvelteKit's version.json", () => {
    const urls = readManifest().map((entry) => entry.url);
    expect(
      urls.filter((url) => url.includes('version.json')),
      "precaching _app/version.json freezes SvelteKit's `updated` store, which polls " +
        'that file to detect new deployments',
    ).toEqual([]);
  });

  it('still precaches the shell assets offline needs', () => {
    const urls = readManifest().map((entry) => entry.url);
    expect(urls.length).toBeGreaterThan(10);
    expect(urls.some((url) => url.endsWith('.js'))).toBe(true);
    expect(urls.some((url) => url.endsWith('.css'))).toBe(true);
    expect(urls).toContain('manifest.webmanifest');
  });
});
