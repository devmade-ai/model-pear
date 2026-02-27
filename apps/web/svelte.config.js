import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Requirement: Migrate from GitHub Pages to Vercel hosting
// Approach: Keep adapter-static (app is fully client-side, no SSR needed) with Vercel-compatible config
// Alternatives considered:
//   - adapter-vercel: Rejected — adds SSR serverless functions unnecessarily for a static app
//   - adapter-auto: Rejected — auto-detects Vercel and uses adapter-vercel, same SSR overhead

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // Static adapter for Vercel deployment
    // Outputs pre-built HTML/JS/CSS to 'build/' directory
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '200.html',
      precompress: false,
      strict: true
    })
    // No paths.base needed — Vercel serves at root '/' (not a subdirectory like GitHub Pages)
  }
};

export default config;
