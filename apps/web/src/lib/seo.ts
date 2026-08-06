/**
 * One source of truth for every page's identity tags.
 *
 * Requirement: each prerendered route must carry its own title, description,
 *   canonical, Open Graph set and structured data — and they must agree with
 *   each other.
 *
 * Why a module rather than tags typed into each +page.svelte: the failure mode
 *   here is not "a tag is missing", it is "two surfaces describe the same page
 *   differently". A <title> and an og:title that disagree ship a search listing
 *   and a shared card that say different things. Defining each page's copy once
 *   and deriving every surface from it makes that drift impossible rather than
 *   merely detectable.
 *
 * Why per-page and not a site-wide block in +layout.svelte: <svelte:head>
 *   APPENDS. A layout-level <title> plus a page-level one gives every document
 *   two, and the first wins — which is exactly how this app shipped three
 *   prerendered pages all showing the same generic title. Each page owns its
 *   complete set; nothing is inherited.
 */

export const SITE = 'https://model-pear-web.vercel.app';

export interface PageSeo {
  /** Full <title>, and og:title / twitter:title. Budget ~60 chars. */
  title: string;
  /** Description for the meta tag, og:description and twitter:description. */
  description: string;
  /** Absolute path, leading slash, no trailing slash except the root. */
  path: string;
}

export const PAGES = {
  home: {
    title: 'Model Pear — structure software deals fairly',
    description:
      'Compare six software transaction models side by side — cost-plus, licence, joint development, BOT, sale and SaaS — and find the structure that works for both you and your client.',
    path: '/',
  },
  pricing: {
    title: 'Pricing calculator — Model Pear',
    description:
      'Project revenue, cost and margin across six software transaction models, then compare them on the numbers rather than on instinct.',
    path: '/pricing',
  },
  structuring: {
    title: 'Transaction structuring — Model Pear',
    description:
      'Walk through the trade-offs of each software deal structure — who carries the risk, who owns the IP, and how the money actually arrives.',
    path: '/structuring',
  },
} as const satisfies Record<string, PageSeo>;

export const canonical = (page: PageSeo): string =>
  page.path === '/' ? `${SITE}/` : `${SITE}${page.path}`;

/** The single site-wide card. Absolute — Facebook rejects a relative og:image. */
export const OG_IMAGE = `${SITE}/og-card.png`;
export const OG_IMAGE_ALT = 'The Model Pear mark on a dark background';

/**
 * The page's JSON-LD graph, as a string ready for a <script> body.
 *
 * ONE graph per page with @id-joined nodes — the organisation and the website
 * are the same entities on every page, so they are referenced by @id rather
 * than restated, and the per-page node points at them.
 *
 * `<` is escaped because a literal `</script` inside any value would close the
 * block early and truncate the head. JSON.stringify does not escape it and the
 * HTML tokenizer wins.
 */
export function jsonLd(page: PageSeo): string {
  const isHome = page.path === '/';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#org`,
        name: 'devmade-ai',
        url: `${SITE}/`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Model Pear',
        publisher: { '@id': `${SITE}/#org` },
      },
      isHome
        ? {
            '@type': 'WebApplication',
            '@id': `${SITE}/#app`,
            name: 'Model Pear',
            url: `${SITE}/`,
            description: page.description,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            browserRequirements: 'Requires JavaScript',
            isPartOf: { '@id': `${SITE}/#website` },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }
        : {
            '@type': 'WebPage',
            '@id': `${canonical(page)}#page`,
            url: canonical(page),
            name: page.title,
            description: page.description,
            isPartOf: { '@id': `${SITE}/#website` },
            about: { '@id': `${SITE}/#app` },
          },
    ],
  }).replace(/</g, '\\u003C');
}
