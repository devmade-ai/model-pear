/**
 * Theme module — runtime theme management for the app.
 *
 * Responsibilities:
 *   - Apply theme (`.dark` class on <html> + `data-theme` attribute) in
 *     lockstep so Tailwind's dark variant and DaisyUI's theme stay aligned.
 *   - Persist user choice to `localStorage.darkMode`.
 *   - Sync across browser tabs via `storage` events.
 *   - Follow OS preference (`matchMedia('prefers-color-scheme')`) when the
 *     user has no stored choice.
 *
 * The bootstrap script in `apps/web/src/app.html` applies the initial theme
 * synchronously before paint; this module takes over for runtime changes.
 *
 * Exposed as `window.__theme` so Chunk 4's burger-menu disclosure can drive
 * it directly without a Svelte store.
 *
 * Imported once from `+layout.svelte` so listeners attach on every page
 * load — required for cross-tab sync to work even if the user never opens
 * the burger menu.
 */

const STORAGE_KEY = 'darkMode';

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Apply theme to the DOM and (by default) persist to localStorage.
 *
 * @param dark         true = dim/dark, false = emerald/light
 * @param skipPersist  when true, don't write to localStorage. Used by the
 *                     storage and matchMedia listeners to apply state from
 *                     external sources without re-emitting the change.
 */
export function applyTheme(dark: boolean, { skipPersist = false } = {}): void {
  if (!isClient()) return;
  const html = document.documentElement;
  html.classList.toggle('dark', dark);
  html.dataset.theme = dark ? 'dim' : 'emerald';
  if (!skipPersist) {
    try {
      localStorage.setItem(STORAGE_KEY, String(dark));
    } catch {
      // localStorage blocked (private mode) — class/attr still applied.
    }
  }
  // Notify subscribers (charts, modals, etc.) that the theme changed.
  // ApexCharts in BaseChart listens for this and switches its theme.mode.
  try {
    window.dispatchEvent(new CustomEvent<{ dark: boolean }>('theme:change', { detail: { dark } }));
  } catch {
    // Old browsers without CustomEvent constructor — ignore.
  }
}

/** Whether the dark theme is currently active. */
export function isDark(): boolean {
  if (!isClient()) return true; // SSR fallback matches the JS-disabled default in app.html.
  return document.documentElement.classList.contains('dark');
}

/** Flip between dim and emerald. */
export function toggle(): void {
  applyTheme(!isDark());
}

// ---------------------------------------------------------------------------
// Listener wiring
// ---------------------------------------------------------------------------

let storageHandler: ((e: StorageEvent) => void) | null = null;
let mediaQuery: MediaQueryList | null = null;
let mediaHandler: ((e: MediaQueryListEvent) => void) | null = null;

/**
 * Attach cross-tab storage and OS-preference listeners. Idempotent — guarded
 * by `window.__themeAttached` so repeat imports (HMR, multiple bundles)
 * don't double-listen.
 */
function attach(): void {
  if (!isClient()) return;
  const w = window as Window & { __themeAttached?: boolean };
  if (w.__themeAttached) return;
  w.__themeAttached = true;

  // Cross-tab sync: when another tab writes the storage key, mirror the
  // change here without re-persisting (which would loop into the other tab).
  storageHandler = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    if (e.newValue === 'true') applyTheme(true, { skipPersist: true });
    else if (e.newValue === 'false') applyTheme(false, { skipPersist: true });
    else if (e.newValue === null && mediaQuery) {
      // Storage cleared elsewhere — fall back to OS preference.
      applyTheme(!mediaQuery.matches, { skipPersist: true });
    }
  };
  window.addEventListener('storage', storageHandler);

  // Follow OS preference changes ONLY when the user has no stored choice.
  // matchMedia fires when the OS-level prefers-color-scheme flips.
  try {
    mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaHandler = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        // localStorage blocked — treat as no stored choice and follow OS.
      }
      if (stored === 'true' || stored === 'false') return;
      applyTheme(!e.matches, { skipPersist: true });
    };
    mediaQuery.addEventListener('change', mediaHandler);
  } catch {
    // matchMedia unavailable (very old browsers) — skip OS-pref sync.
  }

  // Expose for Chunk 4's burger menu and any external consumer.
  (w as Window & { __theme?: unknown }).__theme = {
    applyTheme,
    isDark,
    toggle,
    dispose,
  };
}

/** Remove all listeners and the global `window.__theme` handle. */
export function dispose(): void {
  if (!isClient()) return;
  if (storageHandler) {
    window.removeEventListener('storage', storageHandler);
    storageHandler = null;
  }
  if (mediaQuery && mediaHandler) {
    mediaQuery.removeEventListener('change', mediaHandler);
    mediaHandler = null;
    mediaQuery = null;
  }
  const w = window as Window & { __themeAttached?: boolean; __theme?: unknown };
  w.__themeAttached = false;
  delete w.__theme;
}

// Run listener setup on first client-side import.
attach();

// HMR teardown: release listeners on hot reload so the next module instance
// can re-attach cleanly. Without this, every save would add a duplicate
// listener until a hard reload.
if (import.meta.hot) {
  import.meta.hot.dispose(dispose);
}
