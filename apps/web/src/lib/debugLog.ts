// Requirement: In-memory debug logging with pub/sub for alpha diagnostics
// Approach: Circular buffer with typed entries, console interception, global error capture
// Alternatives:
//   - External logging service: Rejected — adds dependency, network requirement
//   - localStorage persistence: Rejected — fills storage, not needed for alpha
// Source: glow-props DEBUG_SYSTEM.md pattern, adapted for SvelteKit

// Typed sources with string fallback — preserves IDE autocomplete while allowing ad-hoc sources
export type DebugSource =
  | 'boot' | 'db' | 'pwa' | 'render' | 'global' | 'auth' | 'api' | 'form'
  | 'engine' | 'ml' | 'import' | 'export' | 'query' | 'canvas'
  | (string & {})

export type DebugSeverity = 'info' | 'success' | 'warn' | 'error'

export interface DebugEntry {
  id: number
  timestamp: number
  source: DebugSource
  severity: DebugSeverity
  event: string
  details?: Record<string, unknown>
}

export const MAX_ENTRIES = 200
let nextId = 0
const entries: DebugEntry[] = []
const subscribers = new Set<(entry: DebugEntry) => void>()

export function debugAdd(
  source: DebugSource,
  severity: DebugSeverity,
  event: string,
  details?: Record<string, unknown>
): void {
  const entry: DebugEntry = {
    id: nextId++,
    timestamp: Date.now(),
    source,
    severity,
    event,
    details,
  }
  entries.push(entry)
  if (entries.length > MAX_ENTRIES) entries.shift()
  subscribers.forEach((fn) => {
    try { fn(entry) } catch { /* subscriber error must not break logging */ }
  })
}

export function debugGetEntries(): DebugEntry[] {
  return [...entries]
}

export function debugClear(): void {
  entries.length = 0
}

// New subscribers receive current entries immediately — eliminates timing bugs
// where a subscriber misses entries logged before it subscribed.
export function debugSubscribe(fn: (entry: DebugEntry) => void): () => void {
  subscribers.add(fn)
  entries.forEach((entry) => {
    try { fn(entry) } catch { /* ignore */ }
  })
  return () => subscribers.delete(fn)
}

// Shared timestamp formatter — used by both report generation and pill display.
// Format: HH:MM:SS.mmm (24h with milliseconds)
export function formatDebugTimestamp(ts: number): string {
  const t = new Date(ts)
  return `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}.${t.getMilliseconds().toString().padStart(3, '0')}`
}

// --- Report generation ---
// Lives in the module, not the pill component — reusable by any consumer.
export function debugGenerateReport(): string {
  const env = debugGetEnvironment()
  const lines = [
    '=== Debug Report ===',
    '',
    '--- Environment ---',
    // Redact query params to prevent token/UTM leaking when users share reports
    `URL: ${window.location.origin}${window.location.pathname}${window.location.search ? '?[redacted]' : ''}`,
    `User Agent: ${navigator.userAgent}`,
    `Screen: ${screen.width}x${screen.height}`,
    `Viewport: ${innerWidth}x${innerHeight}`,
    `Online: ${navigator.onLine}`,
    `Protocol: ${location.protocol}`,
    `Standalone: ${env.standalone}`,
    `SW Support: ${env.swSupport}`,
    `Timestamp: ${new Date().toISOString()}`,
    '',
    '--- Log ---',
    ...entries.map((e) => {
      const detail = e.details ? ` | ${JSON.stringify(e.details)}` : ''
      return `[${formatDebugTimestamp(e.timestamp)}] [${e.severity.toUpperCase()}] [${e.source}] ${e.event}${detail}`
    }),
  ]
  return lines.join('\n')
}

export function debugGetEnvironment(): { standalone: boolean; swSupport: boolean } {
  return {
    standalone: window.matchMedia('(display-mode: standalone)').matches
      || navigator.standalone === true,
    swSupport: 'serviceWorker' in navigator,
  }
}

// --- Browser-only initialisation ---
// All side effects (console interception, global listeners, pre-framework bridge)
// are guarded by `typeof window !== 'undefined'` to prevent execution during
// SvelteKit's SSR build, where Node.js has no `window` and patching its console
// would be an unwanted side effect.
if (typeof window !== 'undefined') {

  // --- Console interception ---
  // Captures framework warnings, library errors, and any other console output automatically.
  // Must run at module load time to catch early console calls.
  //
  // HMR guard: Store true originals on window so they survive module re-execution.
  // Without this, each HMR cycle captures the already-patched console.error as
  // "original", creating nested wrappers that produce duplicate log entries.
  if (!window.__debugOriginalConsoleError) {
    window.__debugOriginalConsoleError = console.error
    window.__debugOriginalConsoleWarn = console.warn
  }
  // Non-null after the guard above sets them.
  const originalError = window.__debugOriginalConsoleError!
  const originalWarn = window.__debugOriginalConsoleWarn!

  // Re-entrancy guard: prevents infinite recursion if a subscriber or library
  // calls console.error/warn during a debugAdd callback chain.
  let intercepting = false

  const patchedError = (...args: unknown[]) => {
    originalError.apply(console, args)
    if (!intercepting) {
      intercepting = true
      debugAdd('global', 'error', args.map(String).join(' '))
      intercepting = false
    }
  }

  const patchedWarn = (...args: unknown[]) => {
    originalWarn.apply(console, args)
    if (!intercepting) {
      intercepting = true
      debugAdd('global', 'warn', args.map(String).join(' '))
      intercepting = false
    }
  }

  console.error = patchedError
  console.warn = patchedWarn

  // --- Global error capture ---
  // Named handlers (not arrow-inline) so import.meta.hot.dispose can remove
  // them on HMR. Without removal, every save accumulates an orphan listener
  // pointing at a stale module instance — eventually leaking memory and
  // duplicating debug entries.
  const errorHandler = (e: ErrorEvent) => {
    debugAdd('global', 'error', e.message || 'Unknown error', {
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    })
  }

  const rejectionHandler = (e: PromiseRejectionEvent) => {
    debugAdd('global', 'error', `Unhandled rejection: ${e.reason}`)
  }

  if (!window.__debugLogListenersAttached) {
    window.__debugLogListenersAttached = true
    window.addEventListener('error', errorHandler)
    window.addEventListener('unhandledrejection', rejectionHandler)
  }

  // --- Bridge pre-framework errors into the structured log ---
  // The inline <script> in app.html captures errors before JS bundles load and stores
  // them in window.__debugErrors. Import them into the circular buffer, then clean up
  // the inline listeners to prevent double-capture now that the module has taken over.
  if (Array.isArray(window.__debugErrors)) {
    for (const err of window.__debugErrors) {
      debugAdd('boot', 'error', err.msg, err.stack ? { stack: err.stack } : undefined)
    }
    // Clean up: module listeners now handle all future errors.
    // Remove inline listeners (stored as named references on window by app.html)
    // and clear the pre-framework buffer.
    if (typeof window.__debugInlineErrorHandler === 'function') {
      window.removeEventListener('error', window.__debugInlineErrorHandler)
      delete window.__debugInlineErrorHandler
    }
    if (typeof window.__debugInlineRejectionHandler === 'function') {
      window.removeEventListener('unhandledrejection', window.__debugInlineRejectionHandler)
      delete window.__debugInlineRejectionHandler
    }
    window.__debugErrors = []
  }

  debugAdd('boot', 'info', 'Debug log module initialised')

  // --- HMR teardown ---
  // Without this, every dev save would accumulate orphan error/rejection
  // listeners and re-patch console — the patched-version-of-the-patched-version
  // chain causes duplicate log entries and prevents the next module instance
  // from re-attaching cleanly.
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      if (typeof window === 'undefined') return
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', rejectionHandler)
      // Restore originals so the next instance re-patches from a clean baseline.
      // The cached __debugOriginalConsoleError persists on window for that re-patch.
      console.error = originalError
      console.warn = originalWarn
      window.__debugLogListenersAttached = false
    })
  }
}
