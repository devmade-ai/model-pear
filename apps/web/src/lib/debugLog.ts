// Requirement: In-memory debug logging with pub/sub for alpha diagnostics
// Approach: Circular buffer with typed entries, console interception, global error capture
// Alternatives:
//   - External logging service: Rejected — adds dependency, network requirement
//   - localStorage persistence: Rejected — fills storage, not needed for alpha
// Source: glow-props DEBUG_SYSTEM.md pattern, adapted for SvelteKit

// Typed sources with string fallback — preserves IDE autocomplete while allowing ad-hoc sources
type DebugSource =
  | 'boot' | 'db' | 'pwa' | 'render' | 'global' | 'auth' | 'api' | 'form'
  | 'engine' | 'ml' | 'import' | 'export' | 'query' | 'canvas'
  | (string & {})

type DebugSeverity = 'info' | 'success' | 'warn' | 'error'

export interface DebugEntry {
  id: number
  timestamp: number
  source: DebugSource
  severity: DebugSeverity
  event: string
  details?: Record<string, unknown>
}

const MAX_ENTRIES = 200
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
      const t = new Date(e.timestamp)
      const ts = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}.${t.getMilliseconds().toString().padStart(3, '0')}`
      const detail = e.details ? ` | ${JSON.stringify(e.details)}` : ''
      return `[${ts}] [${e.severity.toUpperCase()}] [${e.source}] ${e.event}${detail}`
    }),
  ]
  return lines.join('\n')
}

export function debugGetEnvironment(): { standalone: boolean; swSupport: boolean } {
  return {
    standalone: window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true,
    swSupport: 'serviceWorker' in navigator,
  }
}

// --- Console interception ---
// Captures framework warnings, library errors, and any other console output automatically.
// Must run at module load time to catch early console calls.
const originalError = console.error
const originalWarn = console.warn

console.error = (...args: unknown[]) => {
  originalError.apply(console, args)
  debugAdd('global', 'error', args.map(String).join(' '))
}

console.warn = (...args: unknown[]) => {
  originalWarn.apply(console, args)
  debugAdd('global', 'warn', args.map(String).join(' '))
}

// --- Global error capture ---
// Installed at module load time — captures crashes before SvelteKit mounts.
// HMR guard prevents duplicate listeners during development.
if (typeof window !== 'undefined' && !(window as any).__debugLogListenersAttached) {
  (window as any).__debugLogListenersAttached = true

  window.addEventListener('error', (e) => {
    debugAdd('global', 'error', e.message || 'Unknown error', {
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    })
  })

  window.addEventListener('unhandledrejection', (e) => {
    debugAdd('global', 'error', `Unhandled rejection: ${e.reason}`)
  })
}

// Bridge pre-framework errors into the structured log.
// The inline script in app.html captures errors before JS bundles load and stores them
// in window.__debugErrors. Import them into the circular buffer on module init.
if (typeof window !== 'undefined' && Array.isArray((window as any).__debugErrors)) {
  for (const err of (window as any).__debugErrors) {
    debugAdd('boot', 'error', err.msg, err.stack ? { stack: err.stack } : undefined)
  }
}
