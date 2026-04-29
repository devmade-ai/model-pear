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
      includeAssets: [
        'favicon.png',
        'apple-touch-icon.png',
        'icon-192.png',
        'icon-512.png',
        'icon-1024.png',
      ],
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/200.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,webmanifest}'],
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
        theme_color: '#2a323c',
        background_color: '#2a323c',
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
