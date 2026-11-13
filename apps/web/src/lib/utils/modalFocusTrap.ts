/**
 * Requirement: DaisyUI modal Tab order must cycle only through `.modal-box`
 * controls — not the click-to-close backdrop or a document-level sentinel.
 * Approach: keydown Tab handler scoped to focusables inside `.modal-box`.
 * Alternatives:
 * - Rely on native <dialog> focus trap alone — Rejected; the DaisyUI
 *   `<form method="dialog" class="modal-backdrop"><button>` pattern adds a
 *   focusable "close" control and leaves a no-focus step before wrap.
 * - tabindex="-1" on backdrop button only — Rejected; still leaves the
 *   extra document/body focus stop in Chrome's serialisation.
 */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Visible, enabled focus targets inside the modal content panel only. */
export function getModalBoxFocusables(dialog: HTMLElement): HTMLElement[] {
  const box = dialog.querySelector('.modal-box');
  if (!box) return [];

  return Array.from(box.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.getAttribute('aria-hidden') === 'true') return false;
    // Selector already excludes `:disabled`; no layout filter — unreliable in
    // <dialog> top layer / jsdom.
    return true;
  });
}

function focusableInBox(dialog: HTMLElement, active: Element | null): boolean {
  const box = dialog.querySelector('.modal-box');
  return !!(box && active && box.contains(active));
}

/** Tab-wrap decision for unit tests and the dialog keydown handler. */
export function handleModalTabKey(
  dialog: HTMLDialogElement,
  e: KeyboardEvent,
  active: Element | null = document.activeElement,
): { prevented: boolean; nextFocus: HTMLElement | null } {
  if (e.key !== 'Tab' || !dialog.open) {
    return { prevented: false, nextFocus: null };
  }

  const focusable = getModalBoxFocusables(dialog);
  if (focusable.length === 0) {
    return { prevented: false, nextFocus: null };
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const inBox = focusableInBox(dialog, active);

  // Focus escaped to backdrop, body, or browser sentinel — pull back in-box.
  if (!inBox) {
    return { prevented: true, nextFocus: e.shiftKey ? last : first };
  }

  if (e.shiftKey) {
    if (active === first) {
      return { prevented: true, nextFocus: last };
    }
  } else if (active === last) {
    return { prevented: true, nextFocus: first };
  }

  return { prevented: false, nextFocus: null };
}

/**
 * Svelte action: install Tab / Shift+Tab wrap for an open `HTMLDialogElement`.
 */
export function modalFocusTrap(node: HTMLDialogElement): { destroy: () => void } {
  function onKeyDown(e: KeyboardEvent): void {
    const { prevented, nextFocus } = handleModalTabKey(node, e);
    if (prevented && nextFocus) {
      e.preventDefault();
      nextFocus.focus();
    }
  }

  node.addEventListener('keydown', onKeyDown);
  return {
    destroy() {
      node.removeEventListener('keydown', onKeyDown);
    },
  };
}
