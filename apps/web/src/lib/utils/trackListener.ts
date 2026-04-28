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
 * Returns a `track()` that records its cleanup, plus a `dispose()` that
 * runs every recorded cleanup once and clears the list.
 */
export function createListenerTracker(): {
  track: (
    target: EventTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ) => void;
  dispose: () => void;
} {
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

  function dispose(): void {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  }

  return { track, dispose };
}
