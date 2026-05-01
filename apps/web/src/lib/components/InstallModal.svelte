<script lang="ts">
  /**
   * InstallModal — browser-specific manual install instructions.
   *
   * Triggered by window.__pwa.triggerInstall() when the native
   * beforeinstallprompt isn't available (Safari, Firefox, or any
   * Chromium browser without a queued prompt).
   *
   * Uses DaisyUI's <dialog class="modal"> + <div class="modal-box">.
   * Browser handles focus trap (top-layer rendering), Escape close,
   * and focus return on close. Backdrop click is handled by the
   * <form method="dialog" class="modal-backdrop"> child via native
   * dialog semantics.
   *
   * The reference-counted bodyScrollLock is kept so the install
   * modal composes correctly with the burger-menu scroll lock —
   * native <dialog> top-layer is rendered above the page but doesn't
   * universally block body scroll on mobile Safari.
   */
  import { onMount, onDestroy } from 'svelte';
  import type { InstallInstruction } from '$lib/pwa';
  import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/bodyScrollLock';

  let info: InstallInstruction | null = null;
  let dialogEl: HTMLDialogElement;
  let scrollLocked = false;

  function open(next: InstallInstruction): void {
    info = next;
    if (dialogEl && !dialogEl.open) {
      dialogEl.showModal();
      lockBodyScroll();
      scrollLocked = true;
    }
  }

  // Closing path: handleClose runs on the dialog's `close` event,
  // which fires for Esc, backdrop click, and explicit dialog.close()
  // from the "Got it" button below. One handler covers every close
  // origin.
  function handleClose(): void {
    if (scrollLocked) {
      unlockBodyScroll();
      scrollLocked = false;
    }
    info = null;
  }

  function closeFromButton(): void {
    if (dialogEl?.open) dialogEl.close();
  }

  onMount(() => {
    if (typeof window === 'undefined') return;
    window.__pwa?.setInstallModalCallback(open);

    // HMR safety: drop callback registration on hot-replace so the
    // old component instance doesn't keep receiving open() calls
    // after its scope is GC'd.
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.__pwa?.setInstallModalCallback(null);
      });
    }
  });

  onDestroy(() => {
    if (typeof window === 'undefined') return;
    if (scrollLocked) unlockBodyScroll();
    window.__pwa?.setInstallModalCallback(null);
  });
</script>

<dialog
  bind:this={dialogEl}
  class="modal"
  on:close={handleClose}
  aria-labelledby="install-modal-title"
>
  {#if info}
    <div class="modal-box">
      <div class="flex items-start justify-between mb-4">
        <h2 id="install-modal-title" class="text-lg font-semibold text-base-content">Install Model Pear</h2>
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square"
          aria-label="Close"
          on:click={closeFromButton}
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

      <div class="modal-action">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          on:click={closeFromButton}
        >Got it</button>
      </div>
    </div>
  {/if}
  <!-- Native backdrop click → close, no manual click-outside handler. -->
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
