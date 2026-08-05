// Tripwire for the shell template and the head it is supposed to inject.
//
// Requirement: every prerendered page must carry exactly one <title>, its own,
//   in the document — not inside a comment.
// Why this file exists: the previous fix removed the static <title> from
//   app.html and left a comment explaining why. That comment named the head
//   placeholder LITERALLY. SvelteKit substitutes that token with a plain string
//   replace and has no idea what an HTML comment is, so the entire injected head
//   — the route's real <title> and every modulepreload — was written INSIDE the
//   comment markers and vanished from the document.
//
//   Nothing caught it. The build succeeded, `curl | grep '<title>'` found the
//   title (grep does not know what a comment is either), the page rendered
//   correctly because the browser boots from the body, and only a real HTML
//   parser could see that the head was empty. It shipped, and the commit that
//   caused it was the one whose entire purpose was giving these pages titles.
//
// Approach: two layers, because they fail at different times.
//   1. Source: no substitution token may appear inside a comment in app.html.
//      This is the general rule — the failure is not specific to the head
//      placeholder, it applies to any %...% token the framework replaces.
//   2. Built output: parse each prerendered page and assert its title is real,
//      unique, and outside comments. Stripping comments FIRST is the whole
//      point; a check that greps the raw HTML passes on the broken build.

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APP_HTML = join(WEB_ROOT, 'src', 'app.html');
const BUILD = join(WEB_ROOT, 'build');

/** Everything the framework will string-replace, comments included. */
const SUBSTITUTION_TOKEN = /%sveltekit\.[a-z]+%/g;
const COMMENT = /<!--[\s\S]*?-->/g;

describe('app.html: substitution tokens must not sit inside comments', () => {
  const html = readFileSync(APP_HTML, 'utf8');

  it('names no %sveltekit.*% token inside a comment', () => {
    const offenders = (html.match(COMMENT) ?? [])
      .flatMap((c) => c.match(SUBSTITUTION_TOKEN) ?? []);
    expect(
      offenders,
      'a comment in app.html contains a substitution token. The framework will ' +
        'replace it in place, injecting real markup inside the comment markers ' +
        'where no parser will ever see it. Describe the token in prose instead.',
    ).toEqual([]);
  });

  it('still carries the head placeholder exactly once, outside comments', () => {
    const live = html.replace(COMMENT, '');
    expect(live.match(/%sveltekit\.head%/g) ?? []).toHaveLength(1);
  });
});

// The built pages only exist after `vite build`; skip rather than fail locally.
const pages = ['index.html', 'pricing.html', 'structuring.html']
  .map((f) => join(BUILD, f))
  .filter((p) => existsSync(p));

describe.skipIf(pages.length === 0)('build output: one real title per page', () => {
  it.each(pages)('%s has exactly one title, outside any comment', (page) => {
    const raw = readFileSync(page, 'utf8');
    const live = raw.replace(COMMENT, '');

    const titles = [...live.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)].map((m) => m[1].trim());
    expect(
      titles,
      'no title survives comment-stripping — the head was injected inside a comment, ' +
        'or the route sets no title. A grep over the raw file would have passed.',
    ).toHaveLength(1);
    expect(titles[0].length).toBeGreaterThan(0);
  });

  it('gives each page a distinct title', () => {
    const titles = pages.map(
      (p) => readFileSync(p, 'utf8').replace(COMMENT, '').match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1],
    );
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(pages)('%s keeps its modulepreloads in the document', (page) => {
    // Same failure, different casualty: the swallowed head took every
    // modulepreload with it, so the app fell back to discovering its chunks
    // one round-trip at a time.
    const live = readFileSync(page, 'utf8').replace(COMMENT, '');
    expect(live).toMatch(/rel="modulepreload"/);
  });
});
