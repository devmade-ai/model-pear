<!--
  Every identity tag for one page, derived from one PageSeo object.

  Used ONCE per route, never in +layout.svelte: <svelte:head> appends, so a
  layout-level copy plus a page-level one would give each document two of
  everything and the first would win. That is not hypothetical — this app
  shipped three prerendered pages all showing the same generic title because
  app.html carried a static <title> alongside each route's own.

  The {@html} is a build-time literal from src/lib/seo.ts with `<` already
  escaped; there is no user input anywhere near it. Svelte would otherwise
  escape the JSON into entities and the block would not parse.
-->
<script lang="ts">
  import { canonical, jsonLd, OG_IMAGE, OG_IMAGE_ALT, type PageSeo } from './seo';

  export let page: PageSeo;

  $: url = canonical(page);
  $: graph = jsonLd(page);
</script>

<svelte:head>
  <title>{page.title}</title>
  <meta name="description" content={page.description} />
  <link rel="canonical" href={url} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Model Pear" />
  <meta property="og:title" content={page.title} />
  <meta property="og:description" content={page.description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={OG_IMAGE_ALT} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={page.title} />
  <meta name="twitter:description" content={page.description} />
  <meta name="twitter:image" content={OG_IMAGE} />

  {@html `<script type="application/ld+json">${graph}<` + `/script>`}
</svelte:head>
