<script lang="ts">
  /**
   * UpdateBanner — fixed bottom bar shown when a new SW is waiting.
   *
   * Shows: "A new version is available." + Update + Later.
   * Update  -> window.__pwa.applyUpdate() -> SW skipWaiting -> page reloads
   *            via the controllerchange listener in $lib/pwa.
   * Later   -> hides the banner and tells the PWA module to suppress
   *            re-emit for 30s.
   *
   * Mounted from +layout.svelte. Subscribes via window.__pwa.setUpdateBannerCallback;
   * the PWA module fires the callback only when the document is visible
   * AND the suppression window has elapsed.
   *
   * z-70 (per the glow-props Z_INDEX_SCALE) so the banner is above the
   * burger-menu backdrop (z-40) and panel (z-50) but below modal
   * dialogs (z-80, debug pill).
   */
  import { onMount, onDestroy } from 'svelte';

  let visible = false;

  type PWAGlobals = {
    applyUpdate: () => void;
    suppressUpdateBanner: () => void;
    setUpdateBannerCallback: (cb: (() => void) | null) => void;
  };
  type W = Window & { __pwa?: PWAGlobals };

  function show(): void {
    visible = true;
  }

  function update(): void {
    visible = false;
    const w = window as W;
    w.__pwa?.applyUpdate();
  }

  function later(): void {
    visible = false;
    // Tell the PWA module to suppress re-emit for 30s. Without this,
    // if the SW fires onNeedRefresh again shortly after (e.g. another
    // hourly update poll succeeds), the banner pops up immediately
    // and the user's "Later" choice is ignored.
    const w = window as W;
    w.__pwa?.suppressUpdateBanner();
  }

  onMount(() => {
    const w = window as W;
    w.__pwa?.setUpdateBannerCallback(show);
  });

  onDestroy(() => {
    const w = window as W;
    w.__pwa?.setUpdateBannerCallback(null);
  });
</script>

{#if visible}
  <!-- safe-area-inset-bottom keeps the banner clear of the iPhone home indicator. -->
  <div
    class="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-[70] bg-base-200 border border-base-300 rounded-lg shadow-2xl p-4"
    style="padding-bottom: calc(1rem + env(safe-area-inset-bottom));"
    role="alert"
    aria-live="polite"
  >
    <div class="flex items-start gap-3">
      <svg class="h-5 w-5 flex-shrink-0 text-info mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-base-content">A new version is available.</p>
        <p class="text-xs text-base-content/70 mt-0.5">Update now to load the latest features and fixes.</p>
        <div class="flex gap-2 mt-3">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            on:click={update}
          >Update</button>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            on:click={later}
          >Later</button>
        </div>
      </div>
    </div>
  </div>
{/if}
