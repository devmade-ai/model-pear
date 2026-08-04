// Requirement: this route's <svelte:head> must reach a FILE, not just the DOM.
// Approach: prerender it. adapter-static then writes a real HTML document for
//   this path at build time, with the title and meta tags already in the markup.
// Why: without this the route only existed as the SPA fallback (200.html), whose
//   head is the generic app shell. A crawler, an unfurler, or anything else that
//   does not run JavaScript saw that shell — so the per-page title written here
//   never reached anyone. <svelte:head> is worthless for discoverability on a
//   route that is not prerendered.
// Alternatives:
//   - adapter-vercel with SSR: rejected, this is a fully client-side calculator
//     and the repo deliberately avoids serverless functions for it.
//   - Leave it to the fallback: rejected — that IS the defect.
// Note: /structuring/[model] stays SPA-rendered. Its parameter space is the
//   model catalogue, which is client data; prerendering it would need a route
//   `entries()` and is a separate decision from making these three real pages.
export const prerender = true;
