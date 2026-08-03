import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    sveltekit(),
    /* PWA configuration.
       - registerType: 'prompt' so the user controls when an updated SW
         takes effect (the UpdateBanner shows "A new version is available"
         and runs updateSW() only when the user clicks Update).
       - navigateFallback: '/200.html' aligns with adapter-static's SPA
         fallback, so navigation requests in offline mode return the SPA
         shell instead of 404.
       - cleanupOutdatedCaches: drop precaches from previous SW
         generations so cache storage doesn't grow unbounded across
         deploys.
       - manifest: VitePWA generates the build-time manifest from the
         literal below. The static apps/web/static/manifest.webmanifest
         was removed earlier on this branch to keep it as a single
         source of truth. theme_color / background_color match dim
         base-100 because dim is the default theme (see app.html). */
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,  // The pwa.ts module calls registerSW manually.
      strategies: 'generateSW',
      // Requirement: exactly ONE precache source per URL.
      // Approach: globPatterns below is the sole source — it already matches every
      //   icon via `png`, so `includeAssets` is deliberately absent.
      // Why: includeAssets feeds workbox.additionalManifestEntries, which is appended
      //   after the transform pipeline with no dedupe against the globbed manifest,
      //   producing two entries per icon. They currently agree on revision so workbox
      //   dedupes silently, but anything that nulls one side (a wider
      //   dontCacheBustURLsMatching, a manifest transform) makes them two different
      //   cache keys and precacheAndRoute() throws add-to-cache-list-conflicting-entries
      //   at SW evaluation — the worker then never installs at all.
      //   `includeManifestIcons` is the same mechanism and defaults to TRUE, so it has
      //   to be turned off explicitly or the three manifest icons come back as a second
      //   source even with includeAssets gone.
      includeManifestIcons: false,
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/200.html',
        // Requirement: the navigateFallback URL MUST be in the precache manifest.
        // Why it isn't automatic here: SvelteKit runs the SSR build as the outer build
        //   and spawns the client build inside it, so vite-plugin-pwa globs
        //   .svelte-kit/output/client — which contains no HTML at all. adapter-static
        //   writes 200.html into build/ afterwards, so workbox never sees it.
        //   createHandlerBoundToURL('/200.html') then throws non-precached-url while the
        //   worker script evaluates: registration rejects and the app ships with no
        //   offline support and no update mechanism, while `vite build` exits 0.
        // Approach: register the shell explicitly; the SW fetches it from the network at
        //   install time, where it does exist.
        // Alternatives:
        //   - navigateFallback: null — Rejected, kills offline client-side routing,
        //     which is the entire purpose of a fallback in an SPA.
        //   - Point it at an already-precached URL — Rejected, nothing in the client
        //     output is an HTML shell.
        //   - Switch to @vite-pwa/sveltekit, which globs the adapter's real output —
        //     the architecturally correct fix, but a build-pipeline change; tracked
        //     separately rather than bundled into a production hotfix.
        additionalManifestEntries: [
          // Revision changes every build on purpose: the shell references
          // content-hashed asset filenames, so a stale shell points at deleted chunks.
          // It is one small HTML file.
          { url: '/200.html', revision: Date.now().toString(36) },
        ],
        // `json` deliberately excluded: it precached _app/version.json, which froze
        // SvelteKit's own `updated` store — that store polls the file to detect deploys,
        // so a precached copy makes it report "no new version" forever.
        // `webmanifest` deliberately excluded too: vite-plugin-pwa injects the generated
        // manifest's own precache entry, so globbing it made a second entry for that URL.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        id: '/',
        name: 'Model Pear - Software Transaction Structuring',
        short_name: 'Model Pear',
        description: 'Find the best deal structure for both you and your client',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        prefer_related_applications: false,
        theme_color: '#2A303C',
        background_color: '#2A303C',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: {
        // Disabled in dev to avoid SW caching getting in the way of HMR.
        // Production builds always register the SW.
        enabled: false,
      },
    }),
  ],
  optimizeDeps: {
    include: ['@model-pear/calculator'],
  },
});
