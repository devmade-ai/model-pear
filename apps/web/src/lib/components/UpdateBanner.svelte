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
  // States during/after the update click. `busy` disables the buttons +
  // shows "Updating…" while the SW is taking over. `errorMsg` surfaces a
  // human-readable failure when applyUpdate rejects or the controllerchange
  // never fires within the timeout window.
  let busy = false;
  let errorMsg: string | null = null;

  /** Max time to wait for controllerchange after applyUpdate resolves.
      If this elapses without a reload, the SW download likely failed
      silently or there was nothing waiting after all — re-show the
      banner with an error state.

      15s is generous: warm-cache skipWaiting+activate+controllerchange
      typically completes in <1s, cold caches in 2-3s. Slow networks
      may push closer to 10s; the headroom prevents false "didn't
      complete" alarms during legitimate slow downloads. */
  const POST_UPDATE_RELOAD_TIMEOUT_MS = 15_000;

  /** Tracks the post-update reload watchdog so onDestroy can clear it.
      Without this, navigating away during the 15s window leaves the
      timer alive and it fires on a destroyed component, triggering
      reactive writes the framework no longer expects. */
  let reloadWatchdogId: ReturnType<typeof setTimeout> | null = null;

  function show(): void {
    // Idempotent: pwa.ts can re-emit on visibilitychange while the banner
    // is already showing (visibility flicker, multiple onNeedRefresh).
    // Without this guard, an in-progress update (busy=true) would get its
    // state reset out from under the user.
    if (visible) return;
    visible = true;
    busy = false;
    errorMsg = null;
  }

  async function update(): Promise<void> {
    busy = true;
    errorMsg = null;
    if (!window.__pwa) {
      busy = false;
      errorMsg = 'Update unavailable — refresh the page manually.';
      return;
    }
    try {
      await window.__pwa.applyUpdate();
      // controllerchange in $lib/pwa.ts triggers window.location.reload()
      // when the new SW takes control. If that hasn't happened within
      // POST_UPDATE_RELOAD_TIMEOUT_MS, the update silently failed (no SW
      // was actually waiting, or the new SW didn't activate) — surface
      // a recoverable error so the user can retry.
      if (reloadWatchdogId) clearTimeout(reloadWatchdogId);
      reloadWatchdogId = setTimeout(() => {
        reloadWatchdogId = null;
        if (!visible) return; // already reloaded; banner unmounted
        busy = false;
        errorMsg = "Update didn't complete. Try refreshing the page.";
      }, POST_UPDATE_RELOAD_TIMEOUT_MS);
    } catch {
      // applyUpdate already logged via console.error in pwa.ts.
      busy = false;
      errorMsg = 'Update failed. Try refreshing the page.';
    }
  }

  function later(): void {
    visible = false;
    busy = false;
    errorMsg = null;
    // Tell the PWA module to suppress re-emit for 30s. Without this,
    // if the SW fires onNeedRefresh again shortly after (e.g. another
    // hourly update poll succeeds), the banner pops up immediately
    // and the user's "Later" choice is ignored.
    window.__pwa?.suppressUpdateBanner();
  }

  onMount(() => {
    // onMount only runs on the client per Svelte 4 lifecycle, but the
    // `typeof window` guard is belt-and-braces against future SSR
    // changes.
    if (typeof window === 'undefined') return;
    window.__pwa?.setUpdateBannerCallback(show);
  });

  onDestroy(() => {
    // onDestroy DOES run during SSR teardown (Svelte 4 calls it after
    // the SSR render to clean up). Without this guard, accessing window
    // here throws ReferenceError on the server and the entire route
    // 500s.
    if (typeof window === 'undefined') return;
    if (reloadWatchdogId) {
      clearTimeout(reloadWatchdogId);
      reloadWatchdogId = null;
    }
    window.__pwa?.setUpdateBannerCallback(null);
  });
</script>

{#if visible}
  <!--
    DaisyUI .toast positions the container in the corner; .alert handles
    the content + role="alert" + status colour. pb-[env(safe-area-inset-
    bottom)] pushes the alert up by the iPhone home-indicator inset so
    the banner doesn't sit underneath it.
  -->
  <div class="toast toast-end toast-bottom z-[70] max-w-sm w-auto pb-[env(safe-area-inset-bottom)]">
    <div
      class="alert {errorMsg ? 'alert-error' : 'alert-info'} alert-soft shadow-2xl flex-col items-start"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        {#if errorMsg}
          <svg class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        {:else}
          <svg class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        {/if}
        <div class="flex-1 min-w-0">
          {#if errorMsg}
            <p class="text-sm font-medium">{errorMsg}</p>
          {:else}
            <p class="text-sm font-medium">A new version is available.</p>
            <p class="text-xs opacity-70 mt-0.5">Update now to load the latest features and fixes.</p>
          {/if}
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          disabled={busy}
          on:click={update}
        >{busy ? 'Updating…' : errorMsg ? 'Retry' : 'Update'}</button>
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          disabled={busy}
          on:click={later}
        >Later</button>
      </div>
    </div>
  </div>
{/if}
