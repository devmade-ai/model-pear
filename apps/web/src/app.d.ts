// See https://kit.svelte.dev/docs/types#app for SvelteKit-specific
// namespace augmentations.

/**
 * Global Window augmentations for the runtime singletons exposed by
 * `$lib/theme` and `$lib/pwa`. Co-locating them here avoids the per-file
 * `(window as Window & { __theme?: ... })` casts that cluttered
 * components and module bodies before this declaration existed.
 */
declare global {
  /** Apply theme to <html>, persist, dispatch theme:change. */
  type ThemeApplyTheme = (dark: boolean, opts?: { skipPersist?: boolean }) => void;

  /** Theme global exposed by $lib/theme. */
  interface ThemeGlobals {
    applyTheme: ThemeApplyTheme;
    isDark(): boolean;
    toggle(): void;
    dispose(): void;
  }

  /** Browser categories used by PWA install instructions. */
  type PWABrowser = 'chrome' | 'edge' | 'brave' | 'safari' | 'firefox' | 'unknown';

  interface PWAInstallStep {
    text: string;
    icon?: string;
  }

  interface PWAInstallInstruction {
    browser: PWABrowser;
    steps: PWAInstallStep[];
    note?: string;
  }

  /** PWA global exposed by $lib/pwa. */
  interface PWAGlobals {
    triggerInstall(): void;
    dismissInstall(): void;
    applyUpdate(): Promise<void>;
    suppressUpdateBanner(): void;
    setUpdateBannerCallback(cb: (() => void) | null): void;
    setInstallModalCallback(cb: ((info: PWAInstallInstruction) => void) | null): void;
    updateInstallMenuVisibility(): void;
    detectBrowser(): PWABrowser;
    getInstallInstructions(browser: PWABrowser): PWAInstallInstruction;
  }

  /** beforeinstallprompt event — present on Chromium browsers. */
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }

  interface Window {
    /** Set by $lib/theme on first client-side import. */
    __theme?: ThemeGlobals;
    /** HMR / repeat-import idempotency guard for $lib/theme. */
    __themeAttached?: boolean;

    /** Set by $lib/pwa on first client-side import. */
    __pwa?: PWAGlobals;
    /** Stashed beforeinstallprompt event — captured early in app.html. */
    __pwaInstallPromptEvent?: BeforeInstallPromptEvent | null;
    /** HMR / repeat-import idempotency guard for $lib/pwa. */
    __pwaModuleAttached?: boolean;

    /** Debug pill globals (set by app.html inline script). */
    __debugErrors?: Array<{ msg: string; stack?: string; time: number }>;
    __debugPushError?: (msg: string, stack?: string) => void;
    __debugSvelteMounted?: boolean;
    __debugClearLoadTimer?: () => void;
    __debugLoadTimer?: ReturnType<typeof setTimeout>;
    __debugInlineErrorHandler?: (e: ErrorEvent) => void;
    __debugInlineRejectionHandler?: (e: PromiseRejectionEvent) => void;
  }

  /** Brave browser detection — only Brave ships this object in the wild. */
  interface Navigator {
    brave?: {
      isBrave?: () => Promise<boolean>;
    };
  }
}

// SvelteKit's App namespace — required boilerplate even when empty.
declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  // interface Platform {}
}

export {};
