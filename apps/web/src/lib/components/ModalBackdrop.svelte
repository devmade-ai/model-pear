<script lang="ts">
  /**
   * Requirement: Backdrop click closes the parent <dialog> without entering
   * the tab order or the accessibility tree.
   * Approach: non-focusable div with DaisyUI's `modal-backdrop` class; walk
   * up to the nearest dialog and call close() (fires `close` like
   * form method="dialog").
   * Alternatives:
   * - DaisyUI form + submit button — Rejected; exposes "close" as a Tab stop.
   * - dialog::backdrop click — Rejected; DaisyUI hides ::backdrop (display:none).
   */
  function closeOnBackdropClick(e: MouseEvent): void {
    const dialog = (e.currentTarget as HTMLElement).closest('dialog');
    if (dialog?.open) dialog.close();
  }
</script>

<div
  class="modal-backdrop"
  aria-hidden="true"
  data-testid="modal-backdrop"
  on:click={closeOnBackdropClick}
></div>
