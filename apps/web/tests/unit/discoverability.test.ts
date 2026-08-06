// Requirement: every prerendered page carries its own complete identity set,
//   and every surface on a page says the SAME thing.
//
// Why this asserts the BUILT pages rather than src/lib/seo.ts: the module is
//   the easy half. What has actually gone wrong in this repo is the journey
//   from source to document — a static <title> in app.html shadowing each
//   route's own, and before that a comment swallowing the entire injected head.
//   Both left the source looking perfect. Only the emitted files show it.
//
// Comments are stripped first, for the same reason: a regex cannot tell it is
//   inside <!-- -->, and app.html carries long explanatory comments that quote
//   tag literals.

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SITE, canonical, OG_IMAGE } from '../../src/lib/seo';

const WEB_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BUILD = join(WEB_ROOT, 'build');
const COMMENT = /<!--[\s\S]*?-->/g;

/** Built file for each page, in the same order as PAGES. */
const FILES = {
  home: 'index.html',
  pricing: 'pricing.html',
  structuring: 'structuring.html',
} as const;

const entries = (Object.keys(FILES) as (keyof typeof FILES)[])
  .map((key) => ({ key, page: PAGES[key], file: join(BUILD, FILES[key]) }))
  .filter((e) => existsSync(e.file))
  .map((e) => ({ ...e, html: readFileSync(e.file, 'utf8').replace(COMMENT, '') }));

const meta = (html: string, attr: string, key: string) =>
  html.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`))?.[1] ?? null;

describe.skipIf(entries.length === 0)('every prerendered page', () => {
  it.each(entries)('$file has exactly one title, its own', ({ page, html }) => {
    const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)].map((m) => m[1].trim());
    expect(titles).toEqual([page.title]);
  });

  it.each(entries)('$file says one thing across title, og and twitter', ({ page, html }) => {
    expect(meta(html, 'property', 'og:title')).toBe(page.title);
    expect(meta(html, 'name', 'twitter:title')).toBe(page.title);
    expect(meta(html, 'name', 'description')).toBe(page.description);
    expect(meta(html, 'property', 'og:description')).toBe(page.description);
    expect(meta(html, 'name', 'twitter:description')).toBe(page.description);
  });

  it.each(entries)('$file canonicalises to its OWN url', ({ page, html }) => {
    // The SPA default — one static canonical for the whole app — collapses
    // every page onto the root and tells search engines the collection is a
    // single page.
    expect(html).toContain(`<link rel="canonical" href="${canonical(page)}"`);
  });

  it.each(entries)('$file carries the full unfurl set, absolutely', ({ html }) => {
    for (const key of ['og:type', 'og:site_name', 'og:url', 'og:image', 'og:image:alt']) {
      expect(meta(html, 'property', key), `missing ${key}`).toBeTruthy();
    }
    expect(meta(html, 'name', 'twitter:card')).toBe('summary_large_image');
    // Facebook's crawler rejects a relative og:image outright.
    expect(meta(html, 'property', 'og:image')).toBe(OG_IMAGE);
  });

  it.each(entries)('$file has exactly one JSON-LD graph, joined by @id', ({ html }) => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    expect(blocks).toHaveLength(1);
    const body = blocks[0]![1]!;
    // A literal </script inside any value closes the block early and truncates
    // the head. JSON.stringify does not escape it; the tokenizer wins.
    expect(body).not.toMatch(/<\/script/i);
    const graph = JSON.parse(body);
    expect(graph['@context']).toBe('https://schema.org');
    const ids = graph['@graph'].map((n: { '@id': string }) => n['@id']);
    expect(ids).toContain(`${SITE}/#org`);
    expect(ids).toContain(`${SITE}/#website`);
  });
});

describe.skipIf(entries.length === 0)('across pages', () => {
  it('gives every page a distinct title and description', () => {
    // Present-but-identical is the failure a per-page check cannot see: three
    // pages competing for one search result with the same copy.
    const titles = entries.map((e) => e.page.title);
    const descriptions = entries.map((e) => e.page.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('keeps every title inside the ~60 character budget', () => {
    for (const { page } of entries) {
      expect(page.title.length, `"${page.title}" is ${page.title.length} chars`).toBeLessThanOrEqual(60);
    }
  });
});

describe('the card', () => {
  const card = join(WEB_ROOT, 'static', 'og-card.png');

  it('is really 1200x630', () => {
    expect(existsSync(card)).toBe(true);
    const buf = readFileSync(card);
    expect(buf.subarray(1, 4).toString()).toBe('PNG');
    // IHDR: the two big-endian uint32s at byte 16. Reading the file beats
    // trusting og:image:width, which only proves you can type.
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
  });
});

describe('sitemap agrees with the pages that exist', () => {
  const sitemap = readFileSync(join(WEB_ROOT, 'static', 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

  it('lists every page, and only pages that exist', () => {
    const expected = (Object.keys(FILES) as (keyof typeof FILES)[]).map((k) => canonical(PAGES[k]));
    expect(new Set(locs)).toEqual(new Set(expected));
  });
});
