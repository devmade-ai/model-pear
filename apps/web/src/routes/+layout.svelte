<script lang="ts">
  import '../app.css';
  // Side-effect import: attaches cross-tab storage + matchMedia listeners
  // and exposes `window.__theme` for the burger menu's theme toggle. Must
  // run on every page load, not lazily, so cross-tab sync works without
  // UI interaction.
  import '$lib/theme';
  // Side-effect import: registers the SW, wires the install/update flows,
  // and exposes `window.__pwa` for the burger menu, update banner, and
  // install modal to call into.
  import '$lib/pwa';
  import { resolve } from '$app/paths';
  import { page } from '$app/stores';
  import { onMount, tick } from 'svelte';
  import { createListenerTracker } from '$lib/utils/trackListener';
  import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/bodyScrollLock';
  import UpdateBanner from '$lib/components/UpdateBanner.svelte';
  import InstallModal from '$lib/components/InstallModal.svelte';

  /* ===========================================================
     Burger menu — disclosure pattern.

     Compliant with:
       - WCAG 2.5.5 (44×44px touch target on the trigger)
       - WAI-ARIA disclosure (aria-expanded / aria-controls /
         aria-label that flips between Open/Close menu)
       - Keyboard nav: Escape, ArrowUp/Down, Home/End, Tab-wrap
       - Focus management: first item on open, return to trigger on close
       - Body scroll lock while open (with stable scrollbar gutter so
         the page doesn't shift on open/close)
       - Click-outside via backdrop (cursor-pointer for iOS tap-to-close)

     Theme toggle wires into `window.__theme` from Chunk 3f.
     Install slot stays hidden until Chunk 5 reveals it.
     Save-as-PDF calls `window.print()` (Chunk 6 polishes print CSS).
     =========================================================== */

  let menuOpen = false;
  let triggerEl: HTMLButtonElement | null = null;
  let menuEl: HTMLUListElement | null = null;

  // Mirrors the active theme so the toggle button label stays in sync
  // with cross-tab / OS-preference flips. Updated via the `theme:change`
  // event dispatched by applyTheme() in $lib/theme.
  let isDark = true;

  /* Listener tracking — collects cleanup callbacks so a single
     disposeListeners() releases everything on unmount/HMR. The shared
     helper in $lib/utils/trackListener replaces the per-file overload
     gymnastics with one type-erased target signature. Pattern from
     glow-props TIMER_LEAKS.md: "every addEventListener / setInterval /
     subscribe needs a matching cleanup". */
  const { track, dispose: disposeListeners } = createListenerTracker();

  /* Body scroll lock — extracted to $lib/utils/bodyScrollLock so the install
     modal can compose with this lock via reference counting. */

  /* Find the focusable items inside the menu in tab order. Re-queried on
     each call so dynamic items (e.g. the hidden install slot once Chunk 5
     reveals it) are picked up automatically. */
  function getMenuItems(): HTMLElement[] {
    if (!menuEl) return [];
    return Array.from(
      menuEl.querySelectorAll<HTMLElement>('[data-menu-item]:not([hidden]):not(.hidden)')
    );
  }

  function openMenu(): void {
    if (menuOpen) return;
    menuOpen = true;
    lockBodyScroll();
    // Focus first item after the open transition starts but before paint.
    // requestAnimationFrame ensures Svelte has updated `menuOpen` and the
    // menu is in the DOM before we try to focus inside it.
    tick().then(() => {
      requestAnimationFrame(() => {
        const items = getMenuItems();
        items[0]?.focus();
      });
    });
  }

  function closeMenu(): void {
    if (!menuOpen) return;
    menuOpen = false;
    unlockBodyScroll();
    // Return focus to the trigger so screen readers / keyboard users
    // know where they are after closing.
    requestAnimationFrame(() => triggerEl?.focus());
  }

  function toggleMenu(): void {
    if (menuOpen) closeMenu();
    else openMenu();
  }

  /* Items with data-close auto-close the menu after their primary
     action runs. Theme toggle and (future) theme picker do NOT carry
     data-close so the menu stays open for further interaction. */
  function handleItemClick(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement;
    if (target.hasAttribute('data-close')) closeMenu();
  }

  /* Wired to `window.__theme.toggle()` exposed by $lib/theme. Window is
     globally typed via app.d.ts so no local cast is needed. */
  function toggleTheme(): void {
    window.__theme?.toggle();
  }

  /* Save-as-PDF defers to the browser's native print → "Save as PDF"
     dialog. The print stylesheet (app.css @media print) hides the
     header / nav / buttons, expands tables, and rewrites DaisyUI
     tokens to print-friendly values; calling window.print() here is
     the final implementation, not a placeholder. closeMenu() runs
     synchronously first so the menu doesn't appear in the printed
     output; the rAF wrapper lets the close transition complete
     before the dialog steals focus. */
  function savePdf(): void {
    closeMenu();
    requestAnimationFrame(() => window.print());
  }

  /* Triggers the PWA install prompt via window.__pwa exposed by $lib/pwa.
     The menu item stays hidden via the `hidden` class until
     __pwa.updateInstallMenuVisibility() reveals it (Safari/Firefox always;
     Chromium only when beforeinstallprompt is queued). */
  function triggerInstall(): void {
    window.__pwa?.triggerInstall();
    closeMenu();
  }

  /* ===========================================================
     PWA update policy UI (fleet auto-on-launch standard).

     - "Automatic updates" toggle: persisted preference (default ON)
       gating the launch-apply in $lib/pwa. Mirrors the effective value
       returned by setAutoUpdateEnabled so a blocked localStorage can't
       leave the toggle claiming a state that won't persist.
     - "Check for updates": runs the typed check and surfaces the result
       as a transient toast. 'update-available' shows NO toast — the
       UpdateBanner (which $lib/pwa emits for that result) is the
       feedback surface; a second toast would say the same thing twice.
     =========================================================== */

  let autoUpdateEnabled = true;

  type UpdateCheckStatus = 'idle' | 'checking' | 'up-to-date' | 'no-sw' | 'error';
  let updateCheckStatus: UpdateCheckStatus = 'idle';
  /* Auto-dismiss timer for the result toast — held in component scope so
     the onMount cleanup can clear it (TIMER_LEAKS: single-shot → ref). */
  let updateCheckTimer: ReturnType<typeof setTimeout> | null = null;
  const UPDATE_CHECK_TOAST_MS = 4_000;

  function toggleAutoUpdate(e: Event): void {
    const el = e.currentTarget as HTMLInputElement;
    autoUpdateEnabled = window.__pwa?.setAutoUpdateEnabled(el.checked) ?? el.checked;
    // Keep the DOM checkbox in lockstep with the effective value when the
    // write was rejected (read-back differs from what was clicked).
    el.checked = autoUpdateEnabled;
  }

  async function runUpdateCheck(): Promise<void> {
    closeMenu();
    if (updateCheckStatus === 'checking') return; // one check at a time
    if (updateCheckTimer) {
      clearTimeout(updateCheckTimer);
      updateCheckTimer = null;
    }
    updateCheckStatus = 'checking';
    const result = (await window.__pwa?.checkForUpdates()) ?? 'no-sw';
    if (result === 'update-available') {
      // The UpdateBanner takes over (see block comment above).
      updateCheckStatus = 'idle';
      return;
    }
    updateCheckStatus = result;
    updateCheckTimer = setTimeout(() => {
      updateCheckStatus = 'idle';
      updateCheckTimer = null;
    }, UPDATE_CHECK_TOAST_MS);
  }

  /* Keyboard nav inside the menu. Bound on the menu container so it
     fires regardless of which item has focus. */
  function handleMenuKeydown(e: KeyboardEvent): void {
    const items = getMenuItems();
    if (items.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const idx = active ? items.indexOf(active) : -1;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        const next = idx < 0 || idx === items.length - 1 ? 0 : idx + 1;
        items[next].focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = idx <= 0 ? items.length - 1 : idx - 1;
        items[prev].focus();
        break;
      }
      case 'Home':
        e.preventDefault();
        items[0].focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1].focus();
        break;
      case 'Tab':
        // Trap focus within the menu by wrapping at the boundaries.
        // Tab on last  -> first; Shift+Tab on first -> last.
        if (e.shiftKey && idx === 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && idx === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
        break;
    }
  }

  onMount(() => {
    // Initial theme state for the toggle label.
    isDark = document.documentElement.classList.contains('dark');

    // Initial "Automatic updates" state for the menu toggle. $lib/pwa is
    // imported above, so window.__pwa exists by mount time; the fallback
    // matches the fleet default (ON).
    autoUpdateEnabled = window.__pwa?.isAutoUpdateEnabled() ?? true;

    // Listen for theme changes from any source (toggle button, cross-tab
    // storage event, OS-preference flip). Keeps the menu's label in sync.
    // `theme:change` is typed via WindowEventMap augmentation in app.d.ts.
    track(window, 'theme:change', (e) => {
      isDark = e.detail.dark;
    });

    // The PWA module's first updateInstallMenuVisibility() call runs at
    // module-load time, before the burger's #burger-install-item is in
    // the DOM. Re-call after layout mount so Safari/Firefox users see
    // the install slot (no native install event ever fires for them).
    window.__pwa?.updateInstallMenuVisibility?.();

    // Mount DebugPill into a separate #debug-root (outside SvelteKit tree).
    // Dynamic import ensures debugLog.ts module-level code (console
    // interception, global error listeners) only runs in the browser, not
    // during SSR build. The `destroyed` flag guards a race where the layout
    // unmounts before the dynamic import resolves — without it, the pill
    // would be created after cleanup ran and never destroyed.
    let pill: { $destroy: () => void } | null = null;
    let destroyed = false;
    import('$lib/components/DebugPill.svelte').then(({ default: DebugPill }) => {
      if (destroyed) return;
      const target = document.getElementById('debug-root');
      if (target) {
        pill = new DebugPill({ target });
      }
    });

    return () => {
      destroyed = true;
      if (pill) pill.$destroy();
      // Run all tracked listener cleanups; release any leftover scroll lock
      // and the update-check toast's auto-dismiss timer.
      disposeListeners();
      unlockBodyScroll();
      if (updateCheckTimer) {
        clearTimeout(updateCheckTimer);
        updateCheckTimer = null;
      }
    };
  });
</script>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <!-- Requirement: burger menu items must remain clickable while the
       click-outside backdrop is active.
       Approach: header sits at z-50, above the z-40 backdrop. The header
       creates a stacking context (sticky + z-index), which flattens the
       DaisyUI dropdown-content's internal z-999 to the header's level
       globally. With the header at z-50 the menu's dropdown sits above
       the backdrop, matching the documented z-scale (backdrop z-40,
       panel z-50, banner z-70, modal/debug z-60/80).
       Alternatives:
         - Move the dropdown out of the header into the layout root: rejected,
           breaks sticky-header positioning of the trigger and complicates
           focus management.
         - Lower the backdrop below the header (z-10): rejected, the backdrop
           must cover all page content (which sits below the header) so a
           tap anywhere on the page area dismisses the menu. -->
  <header class="bg-base-200 border-b border-base-300 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href={resolve('/')} class="flex items-center space-x-2" on:click={closeMenu}>
            <span class="text-2xl">🍐</span>
            <span class="font-semibold text-xl text-base-content">Model Pear</span>
          </a>
        </div>

        <!-- Desktop primary nav (also available inside burger as fallback) -->
        <div class="hidden sm:flex items-center space-x-4">
          <a href={resolve('/structuring')} class="text-base-content/70 hover:text-base-content px-3 py-2 text-sm font-medium transition-colors">
            Transaction Structuring
          </a>
          <a href={resolve('/pricing')} class="text-base-content/70 hover:text-base-content px-3 py-2 text-sm font-medium transition-colors">
            Pricing Calculator
          </a>
        </div>

        <!-- Burger menu — DaisyUI dropdown.
             Wrapper carries .dropdown-open / .dropdown-close so visibility
             is fully controlled from `menuOpen` (rather than the default
             :focus-within auto-show which would pop the menu just by
             tabbing to the trigger). The custom keyboard nav (Up/Down/
             Home/End/Esc/Tab-trap), body scroll lock, and HMR-safe
             listener tracking all stay in the script block. -->
        <div
          class="flex items-center sm:ml-4 dropdown dropdown-end {menuOpen ? 'dropdown-open' : 'dropdown-close'}"
        >
          <button
            bind:this={triggerEl}
            id="burger-trigger"
            type="button"
            class="btn btn-ghost btn-square"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="burger-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            on:click={toggleMenu}
          >
            {#if menuOpen}
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {:else}
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {/if}
          </button>

          <!-- Burger menu panel — DaisyUI .menu inside .dropdown-content.
               .menu provides padding/hover/focus styling on its <li><a> /
               <li><button> children. -->
          <ul
            bind:this={menuEl}
            id="burger-menu"
            role="menu"
            tabindex="-1"
            aria-labelledby="burger-trigger"
            class="menu dropdown-content bg-base-200 border border-base-300 rounded-box shadow-2xl w-72 max-w-[calc(100vw-1rem)] mt-2 p-2"
            on:keydown={handleMenuKeydown}
          >
            <!-- Primary nav links — aria-current="page" tells screen readers
                 which destination is the active route. Match by pathname
                 prefix so /structuring/[model] still highlights the
                 Transaction Structuring entry. -->
            <li>
              <a
                href={resolve('/structuring')}
                data-menu-item
                data-close
                role="menuitem"
                aria-current={$page.url.pathname.startsWith('/structuring') ? 'page' : undefined}
                on:click={handleItemClick}
              >Transaction Structuring</a>
            </li>
            <li>
              <a
                href={resolve('/pricing')}
                data-menu-item
                data-close
                role="menuitem"
                aria-current={$page.url.pathname.startsWith('/pricing') ? 'page' : undefined}
                on:click={handleItemClick}
              >Pricing Calculator</a>
            </li>

            <li class="menu-divider"><hr class="border-base-300" /></li>

            <!-- Theme toggle. Stays open after toggle so the user can confirm
                 the change visually without re-opening the menu. -->
            <li>
              <button
                type="button"
                data-menu-item
                role="menuitem"
                on:click={toggleTheme}
              >
                {#if isDark}
                  <!-- Sun icon — clicking switches TO light -->
                  <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Light mode</span>
                {:else}
                  <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>Dark mode</span>
                {/if}
              </button>
            </li>

            <!-- Install app slot. The <li> stays in the DOM but the inner
                 <button> is hidden until window.__pwa.updateInstallMenuVisibility()
                 reveals it (Safari/Firefox always; Chromium when
                 beforeinstallprompt is queued). The hidden state on the
                 <button> propagates visually because .menu styles its
                 child interactive element, and getMenuItems() filters by
                 :not([hidden]). -->
            <li>
              <button
                id="burger-install-item"
                type="button"
                data-menu-item
                data-close
                hidden
                class="hidden"
                role="menuitem"
                on:click={triggerInstall}
              >
                <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Install app</span>
              </button>
            </li>

            <!-- Check for updates: closes the menu, then the transient
                 toast (bottom-centre) carries the checking/result feedback.
                 If an update IS found, the UpdateBanner appears instead. -->
            <li>
              <button
                type="button"
                data-menu-item
                role="menuitem"
                on:click={runUpdateCheck}
              >
                <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Check for updates</span>
              </button>
            </li>

            <!-- Automatic updates toggle. Native checkbox with DaisyUI
                 .toggle styling; role="menuitemcheckbox" fits the menu's
                 ARIA content model. Both `checked` (native state) and
                 `aria-checked` (required by the ARIA role, enforced by
                 svelte-check) render from the same variable so they can't
                 drift. No data-close — like the theme toggle, the menu
                 stays open so the user sees the state flip. -->
            <li>
              <label class="justify-between gap-3">
                <span class="flex flex-col items-start gap-0.5">
                  <span>Automatic updates</span>
                  <span class="text-xs text-base-content/60">Updates apply automatically when the app opens</span>
                </span>
                <input
                  type="checkbox"
                  class="toggle toggle-primary toggle-sm flex-shrink-0"
                  data-menu-item
                  role="menuitemcheckbox"
                  checked={autoUpdateEnabled}
                  aria-checked={autoUpdateEnabled}
                  on:change={toggleAutoUpdate}
                />
              </label>
            </li>

            <li class="menu-divider"><hr class="border-base-300" /></li>

            <!-- Save-as-PDF: closes the menu first via savePdf() so the
                 burger doesn't appear in the printed output. -->
            <li>
              <button
                type="button"
                data-menu-item
                role="menuitem"
                on:click={savePdf}
              >
                <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Save as PDF</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <!-- Click-outside backdrop. DaisyUI's .dropdown does NOT ship a
       backdrop — the only auto-close is light dismiss via :focus-within
       which is unreliable on touch (taps outside don't always blur
       focused descendants). This explicit backdrop intercepts every
       outside click/tap and calls closeMenu(). z-40 sits below the
       header (z-50) — which contains the dropdown panel — so menu
       items remain clickable. The dropdown's internal z-999 has no
       global effect: the header's stacking context flattens it to the
       header's level. -->
  {#if menuOpen}
    <div
      class="fixed inset-0 z-40 bg-base-100/60 cursor-pointer"
      aria-hidden="true"
      on:click={closeMenu}
    ></div>
  {/if}

  <!-- Main content -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- PWA UI: update banner (z-70) and install modal (z-60/z-80).
       Mounted from the layout so they're available on every route. -->
  <UpdateBanner />
  <InstallModal />

  <!-- "Check for updates" feedback toast.
       Requirement: user feedback for every check outcome (checking /
       up-to-date / unsupported / failed).
       Approach: DaisyUI .toast + .alert (same idiom as UpdateBanner) at
       toast-CENTER so it can never overlap the UpdateBanner's toast-end
       container if both are on screen; same z-70 banner tier.
       Alternatives:
         - Reuse UpdateBanner for result messages: rejected — it models
           exactly one thing ("a new SW is waiting" + apply/dismiss);
           overloading it with transient statuses muddles its state machine.
         - toast-end like the banner: rejected — two fixed containers in
           the same corner paint on top of each other. -->
  {#if updateCheckStatus !== 'idle'}
    <div class="toast toast-center toast-bottom z-[70] pb-[env(safe-area-inset-bottom)]">
      <div
        class="alert {updateCheckStatus === 'error' || updateCheckStatus === 'no-sw'
          ? 'alert-warning'
          : 'alert-info'} alert-soft shadow-2xl"
        role="status"
        aria-live="polite"
      >
        {#if updateCheckStatus === 'checking'}
          <span class="loading loading-spinner loading-xs" aria-hidden="true"></span>
          <span class="text-sm">Checking for updates…</span>
        {:else if updateCheckStatus === 'up-to-date'}
          <span class="text-sm">You're on the latest version.</span>
        {:else if updateCheckStatus === 'no-sw'}
          <span class="text-sm">Update checks aren't available in this browser.</span>
        {:else}
          <span class="text-sm">Couldn't check for updates. Please try again in a moment.</span>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <footer class="bg-base-200 border-t border-base-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
        <p class="text-sm text-base-content/70 text-center sm:text-left">
          Software Transaction Structuring Tool
        </p>
        <p class="text-sm text-base-content/60">
          v2.0.0 - TypeScript + SvelteKit
        </p>
      </div>
    </div>
  </footer>
</div>
