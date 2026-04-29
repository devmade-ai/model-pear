/**
 * PWA module — service-worker registration, install prompt, update flow.
 *
 * Responsibilities:
 *   - Register the service worker via vite-plugin-pwa's virtual module.
 *   - Drive the update banner: show "A new version is available" when a
 *     new SW is waiting, run updateSW() on click, suppress for 30s after
 *     dismiss, only emit when the document is visible (Safari doesn't
 *     close backgrounded PWAs — without the visibility check the banner
 *     pops behind a tab the user isn't looking at).
 *   - Manage the install affordance: hand off to the native deferred
 *     prompt on Chromium browsers; show a browser-specific instructions
 *     modal on Safari/Firefox.
 *   - Toggle the burger menu's install slot (`#burger-install-item`)
 *     based on whether install is currently possible.
 *   - Single reload on `controllerchange` so the page picks up the new
 *     SW exactly once (without the flag, the new SW could trigger
 *     reload N times).
 *   - Hourly registration.update() because Safari deprioritises
 *     backgrounded PWAs and won't poll for new SW versions on its own.
 *
 * Exposed as `window.__pwa` so the burger menu, update banner, and
 * install modal components can drive it.
 *
 * HMR-safe via `window.__pwaModuleAttached` guard + import.meta.hot.dispose.
 */
/// <reference types="vite-plugin-pwa/client" />
import { registerSW } from 'virtual:pwa-register';
import { createListenerTracker } from './utils/trackListener';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Browser categories used to pick install instructions. */
export type Browser = PWABrowser;

export type InstallStep = PWAInstallStep;
export type InstallInstruction = PWAInstallInstruction;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const w = (typeof window !== 'undefined' ? window : null);

let updateSW: (() => Promise<void>) | null = null;
let updateBannerCallback: (() => void) | null = null;
let installModalCallback: ((info: InstallInstruction) => void) | null = null;
let dismissedAt = 0;
const SUPPRESS_MS = 30_000;

/** Three-state machine for the update banner.
 *    'idle'    — no update available (initial / after user actioned).
 *    'pending' — onNeedRefresh has fired; the banner should appear as
 *                soon as visibility + suppression gates allow.
 *  Stays 'pending' even while the banner is on screen — the user has to
 *  click Update or Later to return to 'idle'. The 30s suppression is
 *  independent: time-based, not state-based. */
type UpdateState = 'idle' | 'pending';
let updateState: UpdateState = 'idle';

/** Queued install instruction when triggerInstall fires before the
    InstallModal has registered its callback. Drained when
    setInstallModalCallback receives a non-null callback. */
let pendingInstallInfo: InstallInstruction | null = null;

/** Reload-throttle key. Stored in sessionStorage so it survives the
    page reload that controllerchange triggers — preventing
    cascade-reload if multiple SW versions arrive in quick succession. */
const RELOAD_THROTTLE_KEY = '__pwaReloadedAt';
const RELOAD_THROTTLE_MS = 5_000;

const { track, dispose: disposeListeners } = createListenerTracker();
const intervalCleanups: Array<() => void> = [];

// ---------------------------------------------------------------------------
// Browser detection + install instructions
// ---------------------------------------------------------------------------

export function detectBrowser(): Browser {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  // Brave heuristic: only Brave ships `navigator.brave.isBrave`. Some
  // privacy-shim extensions install a stub that returns false from
  // isBrave(), but the property itself is Brave-exclusive in the wild.
  // Calling isBrave() would require async, so we treat presence as a
  // good-enough signal. Order matters: Brave/Edge UAs both include
  // 'chrome', so Brave check has to come first.
  const brave = navigator.brave;
  if (brave && typeof brave.isBrave === 'function') return 'brave';
  if (/edg\//i.test(ua)) return 'edge';
  if (/firefox|fxios/i.test(ua)) return 'firefox';
  if (/chrome|chromium|crios/i.test(ua)) return 'chrome';
  if (/safari/i.test(ua)) return 'safari';
  return 'unknown';
}

export function getInstallInstructions(browser: Browser): InstallInstruction {
  switch (browser) {
    case 'safari':
      return {
        browser,
        steps: [
          { text: 'Tap the Share icon in Safari', icon: '↑' },
          { text: 'Scroll down and tap "Add to Home Screen"', icon: '🏠' },
          { text: 'Tap "Add" in the top-right corner', icon: '✓' },
        ],
        note: 'Safari does not support automatic install prompts. After installing, the app opens like a native app.',
      };
    case 'firefox':
      return {
        browser,
        steps: [
          { text: 'Tap the menu (three dots) in the address bar', icon: '⋮' },
          { text: 'Choose "Install" or "Add to Home Screen"', icon: '🏠' },
        ],
        note: 'Firefox install support varies by platform. On desktop, look for an install icon in the address bar.',
      };
    case 'chrome':
    case 'edge':
    case 'brave':
      // These browsers fire beforeinstallprompt — the native flow handles
      // it. This branch only fires if the prompt isn't available (e.g.
      // already installed, or cleared session).
      return {
        browser,
        steps: [
          { text: 'Click the install icon in the address bar', icon: '⊕' },
          { text: 'Or open the browser menu and choose "Install"', icon: '⋮' },
        ],
        note: 'If you don\'t see an install option, the app may already be installed or the browser has not yet recognised it.',
      };
    default:
      return {
        browser: 'unknown',
        steps: [
          { text: 'Open your browser menu', icon: '⋮' },
          { text: 'Look for "Install", "Add to Home Screen", or similar', icon: '🏠' },
        ],
        note: 'Install support varies by browser. Try a Chromium-based browser for the smoothest experience.',
      };
  }
}

// ---------------------------------------------------------------------------
// Install flow
// ---------------------------------------------------------------------------

function updateInstallMenuVisibility(): void {
  if (typeof document === 'undefined') return;
  const item = document.getElementById('burger-install-item');
  if (!item) return;

  const browser = detectBrowser();
  const hasNativePrompt = !!w?.__pwaInstallPromptEvent;
  // Show the menu item if the native prompt is queued, OR if we can show
  // manual instructions (Safari / Firefox / unknown — Chromium browsers
  // without a queued prompt likely already have the app installed, so
  // hide instead of showing a useless modal).
  const canInstall = hasNativePrompt
    || browser === 'safari'
    || browser === 'firefox'
    || browser === 'unknown';

  item.hidden = !canInstall;
  item.classList.toggle('hidden', !canInstall);
}

function triggerInstall(): void {
  if (!w) return;
  const evt = w.__pwaInstallPromptEvent;
  if (evt) {
    // Native flow (Chromium). prompt() can throw or reject if the
    // prompt has already been shown this session, on iframes with
    // SecurityError, or when the browser silently refuses. Catch +
    // surface so a click-with-no-response is at least diagnosable.
    void evt.prompt().catch((err: unknown) => {
      if (typeof console !== 'undefined') {
        console.error('[pwa] install prompt failed:', err);
      }
    });
    // Clear the stashed event regardless of outcome — beforeinstallprompt
    // only fires once per session, accepted or dismissed.
    void evt.userChoice.finally(() => {
      if (w) w.__pwaInstallPromptEvent = null;
      updateInstallMenuVisibility();
    });
    return;
  }

  // Manual instructions (Safari / Firefox / fallback).
  const info = getInstallInstructions(detectBrowser());
  if (installModalCallback) {
    installModalCallback(info);
  } else {
    // InstallModal hasn't mounted yet (race window during initial page
    // load). Queue the request so the next setInstallModalCallback
    // can flush it.
    pendingInstallInfo = info;
    if (typeof console !== 'undefined') {
      console.warn('[pwa] InstallModal not yet mounted; install request queued.');
    }
  }
}

function dismissInstall(): void {
  if (!w) return;
  w.__pwaInstallPromptEvent = null;
  updateInstallMenuVisibility();
}

// ---------------------------------------------------------------------------
// Update flow
// ---------------------------------------------------------------------------

function applyUpdate(): Promise<void> {
  // The user accepted the update; whether or not the SW takes over
  // successfully, the banner should not re-show for THIS state.
  // Returns the updateSW() promise so the banner can await + surface
  // failures (download dropped, skip-waiting threw) instead of
  // silently doing nothing.
  updateState = 'idle';
  if (!updateSW) return Promise.resolve();
  return updateSW().catch((err: unknown) => {
    if (typeof console !== 'undefined') {
      console.error('[pwa] applyUpdate failed:', err);
    }
    throw err;
  });
}

function suppressUpdateBanner(): void {
  // User clicked "Later". The state moves to idle (the next emit needs
  // to come from a fresh onNeedRefresh OR the visibility handler).
  // dismissedAt powers the 30s suppression so a re-emit during the
  // grace window is short-circuited.
  updateState = 'idle';
  dismissedAt = Date.now();
}

function setUpdateBannerCallback(cb: (() => void) | null): void {
  updateBannerCallback = cb;
  // If onNeedRefresh fired before the banner mounted, emit now.
  if (cb && updateState === 'pending') maybeEmitUpdateBanner();
}

function setInstallModalCallback(cb: ((info: InstallInstruction) => void) | null): void {
  installModalCallback = cb;
  // Drain any install request that fired before the modal mounted.
  if (cb && pendingInstallInfo) {
    cb(pendingInstallInfo);
    pendingInstallInfo = null;
  }
}

/** Emit if all gates pass. State stays 'pending' regardless — the user
 *  has to actively dismiss or apply to return to 'idle'. */
function maybeEmitUpdateBanner(): void {
  if (typeof document === 'undefined') return;
  if (updateState !== 'pending') return;
  if (document.visibilityState !== 'visible') return;
  if (Date.now() - dismissedAt < SUPPRESS_MS) return;
  if (!updateBannerCallback) return;
  updateBannerCallback();
}

// ---------------------------------------------------------------------------
// Listener wiring + module setup
// ---------------------------------------------------------------------------

function attachListeners(): void {
  if (!w) return;
  if (w.__pwaModuleAttached) return;
  w.__pwaModuleAttached = true;

  // Mirror the early-capture handler in app.html — captures any
  // beforeinstallprompt that fires AFTER the module loads (rare; the
  // app.html handler covers the common case of cached-SW repeat visits).
  track(window, 'beforeinstallprompt', (e) => {
    e.preventDefault();
    if (w) w.__pwaInstallPromptEvent = e as BeforeInstallPromptEvent;
    updateInstallMenuVisibility();
  });
  track(window, 'appinstalled', () => {
    if (w) w.__pwaInstallPromptEvent = null;
    updateInstallMenuVisibility();
  });

  // controllerchange reload guard. When a new SW takes control of this
  // page (after applyUpdate() runs skipWaiting()), reload exactly once
  // so the page picks up the new bundles. Persisted via sessionStorage
  // so the throttle survives the reload itself — without this, two SW
  // versions arriving in quick succession could double-reload.
  if ('serviceWorker' in navigator) {
    track(navigator.serviceWorker, 'controllerchange', () => {
      try {
        const last = Number(sessionStorage.getItem(RELOAD_THROTTLE_KEY) ?? 0);
        if (Date.now() - last < RELOAD_THROTTLE_MS) return;
        sessionStorage.setItem(RELOAD_THROTTLE_KEY, String(Date.now()));
      } catch {
        // sessionStorage blocked (private mode, sandboxed iframe).
        // Fall through and reload — better than getting stuck on a
        // stale SW.
      }
      window.location.reload();
    });
  }

  // Re-emit the update banner when the user returns to a backgrounded
  // tab. onNeedRefresh fires regardless of visibility; maybeEmitUpdateBanner
  // suppresses on hidden, so without this re-emit the banner would
  // never appear for users who weren't looking at the tab when the
  // update arrived.
  track(document, 'visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    maybeEmitUpdateBanner();
  });

  // Initial visibility check — handles the case where beforeinstallprompt
  // fired before the framework loaded (caught by app.html's early-capture
  // handler) and the burger menu wasn't in the DOM yet.
  updateInstallMenuVisibility();
}

if (w && 'serviceWorker' in navigator) {
  updateSW = registerSW({
    onNeedRefresh: () => {
      updateState = 'pending';
      maybeEmitUpdateBanner();
    },
    onOfflineReady: () => {
      // Nothing to do; the offline-ready state is informational. Future:
      // surface a small toast if desired.
    },
    onRegisterError: (err: unknown) => {
      // SW registration failures are otherwise silent. Surface to the
      // console AND dispatch a synthetic ErrorEvent so the DebugPill's
      // `error` listener captures it (console.error doesn't trigger an
      // ErrorEvent in all browsers).
      if (typeof console !== 'undefined') {
        console.error('[pwa] SW registration failed:', err);
      }
      window.dispatchEvent(new ErrorEvent('error', {
        message: '[pwa] Service worker registration failed',
        error: err instanceof Error ? err : new Error(String(err)),
      }));
    },
    onRegisteredSW: (_swUrl: string, registration: ServiceWorkerRegistration | undefined) => {
      if (!registration) return;
      // Hourly poll for SW updates. Safari deprioritises backgrounded
      // PWAs and won't auto-check; without this, a user with the app
      // open for days never sees a new version. Tracked for HMR
      // teardown so the interval is released on hot reload.
      const intervalId = window.setInterval(() => {
        registration.update().catch((err: unknown) => {
          if (typeof console !== 'undefined') {
            console.warn('[pwa] hourly update poll failed:', err);
          }
        });
      }, 60 * 60 * 1000);
      intervalCleanups.push(() => window.clearInterval(intervalId));
    },
  });
}

if (w) {
  attachListeners();
  w.__pwa = {
    triggerInstall,
    dismissInstall,
    applyUpdate,
    suppressUpdateBanner,
    setUpdateBannerCallback,
    setInstallModalCallback,
    updateInstallMenuVisibility,
    detectBrowser,
    getInstallInstructions,
  };
}

// HMR teardown: release the SW polling interval, the listeners attached
// via track(), and clear the global handles so the next module instance
// can re-attach without duplicates.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeListeners();
    intervalCleanups.forEach((fn) => fn());
    intervalCleanups.length = 0;
    if (w) {
      w.__pwaModuleAttached = false;
      delete w.__pwa;
    }
  });
}
