/**
 * Defensive JSON serialiser for any value, including ones that throw.
 *
 * Why this exists: JSON.stringify throws on circular references, BigInt
 * values, and any object whose toJSON method throws. When stringify is
 * called inside a Svelte template expression (e.g. rendering a debug log
 * entry's `details` object), an exception propagates out of render, hits
 * the window 'error' handler, calls back into the logging system, fires
 * subscribers, sets `entries`, re-renders the same broken row, throws
 * again — an infinite loop that freezes the tab.
 *
 * Wrapping JSON.stringify in try/catch and returning a sentinel string
 * makes a malformed object cosmetically wrong but operationally
 * harmless. Use this anywhere user-supplied or library-supplied data
 * crosses a render boundary.
 *
 * @param value - any JS value
 * @returns the JSON string, '' for null/undefined, or '[unserialisable]' on throw
 */
export function safeStringify(value: unknown): string {
  if (value === undefined || value === null) return '';
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserialisable]';
  }
}
