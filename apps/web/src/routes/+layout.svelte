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
  let menuEl: HTMLDivElement | null = null;

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

  /* Save-as-PDF placeholder. Chunk 6 audits and tightens the print CSS;
     the button itself just calls window.print(). data-close runs first
     (closing the menu) so the menu doesn't appear in the printed PDF. */
  function savePdf(): void {
    closeMenu();
    // Defer to next frame so the close transition completes before
    // the print dialog steals focus.
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
      // Run all tracked listener cleanups; release any leftover scroll lock.
      disposeListeners();
      unlockBodyScroll();
    };
  });
</script>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="bg-base-200 border-b border-base-300 sticky top-0 z-20">
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

        <!-- Burger trigger — visible at all viewport sizes -->
        <div class="flex items-center sm:ml-4">
          <button
            bind:this={triggerEl}
            id="burger-trigger"
            type="button"
            class="inline-flex items-center justify-center min-h-11 min-w-11 rounded text-base-content/70 hover:text-base-content hover:bg-base-300 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-primary"
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
        </div>
      </div>
    </nav>
  </header>

  <!-- Backdrop: clickable surface that captures every outside click and
       closes the menu. cursor-pointer is required for iOS Safari to
       register taps; pointer-events route through the backdrop because
       it's at z-40 (above page content, below the menu at z-50).
       Pointer-events:none when closed so it doesn't block page clicks. -->
  <div
    class="fixed inset-0 z-40 bg-base-100/60 transition-opacity duration-150 cursor-pointer"
    class:opacity-0={!menuOpen}
    class:opacity-100={menuOpen}
    class:pointer-events-none={!menuOpen}
    aria-hidden="true"
    on:click={closeMenu}
  ></div>

  <!-- Burger menu panel -->
  <div
    bind:this={menuEl}
    id="burger-menu"
    role="menu"
    tabindex="-1"
    aria-labelledby="burger-trigger"
    class="fixed top-16 right-2 sm:right-4 z-50 w-72 max-w-[calc(100vw-1rem)] origin-top-right bg-base-200 border border-base-300 rounded-lg shadow-2xl transition-all duration-150"
    class:opacity-0={!menuOpen}
    class:scale-95={!menuOpen}
    class:pointer-events-none={!menuOpen}
    class:opacity-100={menuOpen}
    class:scale-100={menuOpen}
    on:keydown={handleMenuKeydown}
  >
    <div class="py-2">
      <!-- Primary nav links -->
      <a
        href={resolve('/structuring')}
        data-menu-item
        data-close
        class="block px-4 py-2 text-sm text-base-content hover:bg-base-300 focus:bg-base-300 focus:outline-hidden transition-colors"
        on:click={handleItemClick}
        role="menuitem"
      >Transaction Structuring</a>
      <a
        href={resolve('/pricing')}
        data-menu-item
        data-close
        class="block px-4 py-2 text-sm text-base-content hover:bg-base-300 focus:bg-base-300 focus:outline-hidden transition-colors"
        on:click={handleItemClick}
        role="menuitem"
      >Pricing Calculator</a>

      <hr class="my-2 border-base-300" />

      <!-- Theme toggle. Stays open after toggle so the user can confirm
           the change visually without re-opening the menu. -->
      <button
        type="button"
        data-menu-item
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-300 focus:bg-base-300 focus:outline-hidden transition-colors text-left"
        on:click={toggleTheme}
        role="menuitem"
      >
        {#if isDark}
          <!-- Sun icon — clicking switches TO light, so show what the click delivers -->
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

      <!-- Install app slot. Hidden until Chunk 5 wires beforeinstallprompt
           and toggles the `hidden` class via window.__pwa.updateInstallMenuVisibility().
           Onclick will call window.__pwa.triggerInstall() once Chunk 5 lands. -->
      <button
        id="burger-install-item"
        type="button"
        data-menu-item
        data-close
        hidden
        class="hidden w-full flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-300 focus:bg-base-300 focus:outline-hidden transition-colors text-left"
        on:click={triggerInstall}
        role="menuitem"
      >
        <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Install app</span>
      </button>

      <hr class="my-2 border-base-300" />

      <!-- Save-as-PDF — Chunk 6 polishes the print CSS; the button itself
           just calls window.print() with the menu closed first so the
           burger doesn't appear in the printed output. -->
      <button
        type="button"
        data-menu-item
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-300 focus:bg-base-300 focus:outline-hidden transition-colors text-left"
        on:click={savePdf}
        role="menuitem"
      >
        <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span>Save as PDF</span>
      </button>
    </div>
  </div>

  <!-- Main content -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- PWA UI: update banner (z-70) and install modal (z-60/z-80).
       Mounted from the layout so they're available on every route. -->
  <UpdateBanner />
  <InstallModal />

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
