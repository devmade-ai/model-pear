<script lang="ts">
  /**
   * InstallModal — browser-specific manual install instructions.
   *
   * Triggered by window.__pwa.triggerInstall() when the native
   * beforeinstallprompt isn't available (Safari, Firefox, or any
   * Chromium browser without a queued prompt).
   *
   * Focus-trapped: Tab cycles within the modal, Escape closes,
   * backdrop click closes. Returns focus to the previously-active
   * element on close (typically the burger menu's Install item or
   * the trigger button).
   *
   * z-[60] for backdrop, z-[80] for the modal — matches glow-props
   * Z_INDEX_SCALE: above sticky overlays / burger menu (z-40 / z-50)
   * and above the PWA update banner (z-70). Modals dominate.
   */
  import { onMount, onDestroy, tick } from 'svelte';
  import type { InstallInstruction } from '$lib/pwa';
  import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/bodyScrollLock';

  let visible = false;
  let info: InstallInstruction | null = null;
  let modalEl: HTMLDivElement | null = null;
  let prevActive: HTMLElement | null = null;

  function open(next: InstallInstruction): void {
    info = next;
    visible = true;
    prevActive = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null;
    // Lock body scroll so the page doesn't scroll behind the modal.
    // Reference-counted so it composes with the burger-menu lock.
    lockBodyScroll();
    // Focus first focusable inside the modal once Svelte's render flushes.
    tick().then(() => {
      requestAnimationFrame(() => {
        const focusable = modalEl?.querySelector<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      });
    });
  }

  function close(): void {
    if (!visible) return;
    visible = false;
    info = null;
    unlockBodyScroll();
    requestAnimationFrame(() => prevActive?.focus());
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (!visible) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab' || !modalEl) return;

    // Focus trap: wrap Tab at boundaries.
    const focusables = Array.from(
      modalEl.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && !el.hidden);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  onMount(() => {
    // onMount only runs on the client per Svelte 4 lifecycle, but the
    // `typeof window` guard is belt-and-braces against future SSR changes.
    if (typeof window === 'undefined') return;
    window.__pwa?.setInstallModalCallback(open);
    window.addEventListener('keydown', handleKeydown);

    // HMR safety: if Vite hot-replaces this component without calling
    // onDestroy (rare but possible mid-replace), the global keydown
    // listener would orphan and the old handler would keep firing on a
    // GC'd component scope. import.meta.hot.dispose runs on every hot
    // update, releasing the listener before the new instance mounts.
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.removeEventListener('keydown', handleKeydown);
        window.__pwa?.setInstallModalCallback(null);
      });
    }
  });

  onDestroy(() => {
    // onDestroy DOES run during SSR teardown — guard window access or
    // the route 500s on render.
    if (typeof window === 'undefined') return;
    // If unmounting while open, release the scroll lock so the next
    // navigation doesn't inherit a stuck overflow:hidden.
    if (visible) unlockBodyScroll();
    window.__pwa?.setInstallModalCallback(null);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if visible && info}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-[60] bg-base-100/80 cursor-pointer"
    aria-hidden="true"
    on:click={close}
  ></div>

  <!-- Modal -->
  <div
    bind:this={modalEl}
    class="fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none"
    role="dialog"
    aria-modal="true"
    aria-labelledby="install-modal-title"
  >
    <div class="bg-base-200 border border-base-300 rounded-lg shadow-2xl max-w-md w-full p-6 pointer-events-auto">
      <div class="flex items-start justify-between mb-4">
        <h2 id="install-modal-title" class="text-lg font-semibold text-base-content">Install Model Pear</h2>
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square"
          aria-label="Close"
          on:click={close}
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="text-sm text-base-content/70 mb-4">
        Add Model Pear to your home screen for quicker access and offline use.
      </p>

      <ol class="space-y-3 mb-4">
        {#each info.steps as step, i (i)}
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">{i + 1}</span>
            <span class="flex-1 text-sm text-base-content">
              {step.text}
              {#if step.icon}
                <span class="ml-1 text-base-content/70" aria-hidden="true">{step.icon}</span>
              {/if}
            </span>
          </li>
        {/each}
      </ol>

      {#if info.note}
        <p class="text-xs text-base-content/70 italic border-t border-base-300 pt-3">
          {info.note}
        </p>
      {/if}

      <div class="flex justify-end mt-4">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          on:click={close}
        >Got it</button>
      </div>
    </div>
  </div>
{/if}
