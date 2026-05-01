/**
 * Listener-tracking helper. Used by modules that attach event listeners
 * during initialisation and need to release them on unmount / HMR
 * teardown.
 *
 * Pattern from glow-props TIMER_LEAKS.md:
 *   "every addEventListener / setInterval / subscribe needs a matching
 *    cleanup."
 *
 * Usage:
 *   const { track, dispose } = createListenerTracker();
 *   track(window, 'resize', onResize);
 *   track(document, 'visibilitychange', onVisibility);
 *   // later:
 *   dispose();   // releases everything in the order added
 */

/**
 * Type-aware track function. Three overloads pick up WindowEventMap /
 * DocumentEventMap so callers get typed events for known names — including
 * the project's `theme:change` CustomEvent (declared in app.d.ts). Falls
 * back to the generic EventTarget signature for everything else
 * (navigator.serviceWorker, custom emitters).
 */
interface TrackFn {
  <K extends keyof WindowEventMap>(
    target: Window,
    event: K,
    handler: (e: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  <K extends keyof DocumentEventMap>(
    target: Document,
    event: K,
    handler: (e: DocumentEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  (
    target: EventTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ): void;
}

/**
 * Returns a `track()` that records its cleanup, plus a `dispose()` that
 * runs every recorded cleanup once and clears the list.
 */
export function createListenerTracker(): {
  track: TrackFn;
  dispose: () => void;
} {
  const cleanups: Array<() => void> = [];

  const track: TrackFn = (
    target: EventTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ): void => {
    target.addEventListener(event, handler, options);
    cleanups.push(() => target.removeEventListener(event, handler, options));
  };

  function dispose(): void {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  }

  return { track, dispose };
}
