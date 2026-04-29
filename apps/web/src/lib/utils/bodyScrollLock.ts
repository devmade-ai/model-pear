/**
 * Body scroll lock with reference counting.
 *
 * Used by overlays that need to disable page scroll while open: the burger
 * menu (apps/web/src/routes/+layout.svelte) and the install modal
 * (apps/web/src/lib/components/InstallModal.svelte).
 *
 * Reference counting matters because overlays can nest: a user can open
 * the burger menu, click "Install" which opens the install modal, then
 * close the modal — at which point we must NOT release the lock if the
 * burger menu is still open.
 *
 * `scrollbarGutter: stable` keeps layout from shifting when the scrollbar
 * disappears (Chromium / desktop). The original values are saved on the
 * first lock and restored on the last unlock so we don't clobber any
 * inline styles a future ancestor might set.
 *
 * Pattern from glow-props TIMER_LEAKS.md: "every lock needs a matching
 * unlock; reference-count when locks can compose."
 */

type ScrollbarGutterStyle = CSSStyleDeclaration & { scrollbarGutter?: string };

let savedOverflow = '';
let savedGutter = '';
let lockCount = 0;

export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    const style = document.body.style as ScrollbarGutterStyle;
    savedOverflow = document.body.style.overflow;
    savedGutter = style.scrollbarGutter ?? '';
    style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) return;
  lockCount--;
  if (lockCount === 0) {
    const style = document.body.style as ScrollbarGutterStyle;
    document.body.style.overflow = savedOverflow;
    style.scrollbarGutter = savedGutter;
  }
}
