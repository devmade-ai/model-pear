import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Requirement: Static SPA deployed to Vercel
// Approach: adapter-static with fallback for client-side routing (app is fully client-side, no SSR)
// Alternatives considered:
//   - adapter-vercel: Rejected — adds SSR serverless functions unnecessarily for a static app
//   - adapter-auto: Rejected — auto-detects Vercel and uses adapter-vercel, same SSR overhead
// Note: vercel.json sets framework:null to disable Vercel's SvelteKit auto-detection,
//   which was overriding outputDirectory and causing "No Output Directory found" errors.

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      // SPA fallback — serves this page for all routes, enabling client-side routing.
      // Vercel rewrites (vercel.json) point all requests to /200.html.
      fallback: '200.html'
    })
  }
};

export default config;
