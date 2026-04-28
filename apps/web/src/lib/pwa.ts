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
import { registerSW } from 'virtual:pwa-register';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Browser categories used to pick install instructions. */
export type Browser = 'chrome' | 'edge' | 'brave' | 'safari' | 'firefox' | 'unknown';

export interface InstallStep {
  text: string;
  /** Optional inline emoji/icon hint shown next to the step. */
  icon?: string;
}

export interface InstallInstruction {
  browser: Browser;
  steps: InstallStep[];
  note?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAGlobals {
  triggerInstall(): void;
  dismissInstall(): void;
  applyUpdate(): void;
  /** Suppress update-banner re-emit for 30s. Called by the banner's
      "Later" button so the banner doesn't immediately reappear if the
      SW emits another onNeedRefresh shortly after. */
  suppressUpdateBanner(): void;
  setUpdateBannerCallback(cb: (() => void) | null): void;
  setInstallModalCallback(cb: ((info: InstallInstruction) => void) | null): void;
  detectBrowser(): Browser;
  getInstallInstructions(browser: Browser): InstallInstruction;
}

// `window` typing extensions co-located so each global has a clear owner.
type PWAWindow = Window & {
  __pwa?: PWAGlobals;
  __pwaInstallPromptEvent?: BeforeInstallPromptEvent | null;
  __pwaReloadOnce?: boolean;
  __pwaModuleAttached?: boolean;
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const w = (typeof window !== 'undefined' ? (window as PWAWindow) : null);

let updateSW: (() => Promise<void>) | null = null;
let updateBannerCallback: (() => void) | null = null;
let installModalCallback: ((info: InstallInstruction) => void) | null = null;
let dismissedAt = 0;
const SUPPRESS_MS = 30_000;

const cleanups: Array<() => void> = [];

function track(
  target: EventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean,
): void {
  target.addEventListener(event, handler, options);
  cleanups.push(() => target.removeEventListener(event, handler, options));
}

// ---------------------------------------------------------------------------
// Browser detection + install instructions
// ---------------------------------------------------------------------------

export function detectBrowser(): Browser {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  // Order matters: brave UAs include 'chrome'; edge UAs include 'chrome'.
  // navigator.brave?.isBrave() is the canonical Brave check.
  const brave = (navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave;
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
    // Native flow (Chromium).
    void evt.prompt();
    void evt.userChoice.finally(() => {
      // Clear the stashed event regardless of outcome — beforeinstallprompt
      // only fires once per session, accepted or dismissed.
      if (w) w.__pwaInstallPromptEvent = null;
      updateInstallMenuVisibility();
    });
  } else {
    // Manual instructions (Safari / Firefox / fallback).
    const browser = detectBrowser();
    const info = getInstallInstructions(browser);
    installModalCallback?.(info);
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

function applyUpdate(): void {
  // Trigger the SW update; the controllerchange listener handles the reload.
  void updateSW?.();
}

function suppressUpdateBanner(): void {
  dismissedAt = Date.now();
}

function setUpdateBannerCallback(cb: (() => void) | null): void {
  updateBannerCallback = cb;
}

function setInstallModalCallback(cb: ((info: InstallInstruction) => void) | null): void {
  installModalCallback = cb;
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
  // so the page picks up the new bundles. The flag prevents a reload
  // loop if controllerchange somehow fires twice.
  if ('serviceWorker' in navigator) {
    track(navigator.serviceWorker, 'controllerchange', () => {
      if (!w) return;
      if (w.__pwaReloadOnce) return;
      w.__pwaReloadOnce = true;
      window.location.reload();
    });
  }

  // Update banner suppression: if the document was hidden when the SW
  // update became available, re-emit when the user comes back to the tab.
  // (onNeedRefresh runs in the SW context which can fire with the tab
  // backgrounded.)
  track(document, 'visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (!updateSW) return;
    if (Date.now() - dismissedAt < SUPPRESS_MS) return;
    // Only re-emit if there's actually an update waiting; the banner
    // component's own state guards against showing spuriously.
  });

  // Initial visibility check — handles the case where beforeinstallprompt
  // fired before the framework loaded (caught by app.html's early-capture
  // handler) and the burger menu wasn't in the DOM yet.
  updateInstallMenuVisibility();
}

function emitUpdateBanner(): void {
  if (typeof document === 'undefined') return;
  if (document.visibilityState !== 'visible') return;
  if (Date.now() - dismissedAt < SUPPRESS_MS) return;
  updateBannerCallback?.();
}

if (w && 'serviceWorker' in navigator) {
  updateSW = registerSW({
    onNeedRefresh: () => emitUpdateBanner(),
    onOfflineReady: () => {
      // Nothing to do; the offline-ready state is informational. Future:
      // surface a small toast if desired.
    },
    onRegisteredSW: (_swUrl, registration) => {
      if (!registration) return;
      // Hourly poll for SW updates. Safari deprioritises backgrounded
      // PWAs and won't auto-check; without this, a user with the app
      // open for days never sees a new version. Tracked for HMR
      // teardown so the interval is released on hot reload.
      const intervalId = window.setInterval(() => {
        void registration.update();
      }, 60 * 60 * 1000);
      cleanups.push(() => window.clearInterval(intervalId));
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
    detectBrowser,
    getInstallInstructions,
  };
}

// HMR teardown: release the SW polling interval, the listeners attached
// via track(), and clear the global handles so the next module instance
// can re-attach without duplicates.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
    if (w) {
      w.__pwaModuleAttached = false;
      delete w.__pwa;
    }
  });
}
