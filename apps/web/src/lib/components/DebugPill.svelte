<!--
  Requirement: Floating debug pill for alpha-phase diagnostics.
  Approach: Svelte component mounted in a separate #debug-root sibling
    of %sveltekit.body% (apps/web/src/app.html). Lives outside the
    SvelteKit tree so the pill survives a navigation crash in the app.
  Styling: DaisyUI / Tailwind utility classes throughout — the panel
    inherits the document stylesheet via the global #debug-root, so
    the same conventions used everywhere else in the app apply here.
    Dynamic severity colours go through DaisyUI semantic tokens
    (text-error / text-warning / text-success / text-base-content/60)
    via severityClass(); no inline `style="color:..."`.
  Mobile freeze guard: the log tab caps rendered entries to
    MAX_VISIBLE_ENTRIES (50) regardless of buffer size; the full 200-
    entry buffer is preserved for Copy / report. This stops the
    afterUpdate scrollHeight read from forcing a multi-second layout
    pass on touch devices.
  Touch-tooltip guard: a scoped @media rule disables DaisyUI
    `.tooltip` pseudo elements on coarse-pointer devices for elements
    inside #debug-root. Without it, position:fixed + .tooltip on
    touch can leave a stuck :hover state after tap that interferes
    with the synchronous panel mount; with it, desktop hover still
    shows the descriptive tooltip.
  Removal note: when alpha ends, delete this component, debugLog.ts,
    safeStringify.ts (if no other consumer), clipboardUtils.ts, and
    the #debug-root + inline boot scripts in app.html (see
    SESSION_NOTES.md "Removal note").
  Source: gp-props DEBUG_SYSTEM.md pattern, adapted for Svelte 4.
-->
<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import type { DebugEntry, DebugSeverity } from '$lib/debugLog';
  import {
    debugAdd,
    debugSubscribe,
    debugGetEntries,
    debugClear,
    debugGenerateReport,
    debugGetEnvironment,
    formatDebugTimestamp,
  } from '$lib/debugLog';
  import { copyToClipboard } from '$lib/clipboardUtils';
  import { safeStringify } from '$lib/utils/safeStringify';

  // --- State ---
  let expanded = false;
  let activeTab: 'log' | 'env' | 'pwa' = 'log';
  let entries: DebugEntry[] = [];
  let copyStatus: 'idle' | 'copied' | 'failed' = 'idle';
  let logContainer: HTMLDivElement | null = null;
  // Visible textarea fallback for mobile browsers where clipboard API fails entirely.
  // Shows report text with auto-select so users can manually copy.
  let copyFallbackText = '';

  // PWA diagnostics
  interface DiagnosticResult {
    label: string;
    status: 'pass' | 'fail' | 'warn' | 'running';
    detail: string;
  }
  let diagnostics: DiagnosticResult[] = [];
  let diagnosticRunId = 0;

  // Counts for badge display — run on the full buffer so the closed pill
  // always shows true totals, not just what's visible in the panel.
  $: errorCount = entries.filter((e) => e.severity === 'error').length;
  $: warnCount = entries.filter((e) => e.severity === 'warn').length;

  // Render only the most recent N entries in the log tab.
  // Requirement: opening the panel must not freeze the tab on mobile.
  // Approach: cap the rendered list to MAX_VISIBLE_ENTRIES. The full
  //   buffer (up to 200) stays in memory and is included in the
  //   copy/report; the cap is purely a render-cost reduction.
  // Why: each entry compiles to ~7 DOM nodes; rendering 200 of those
  //   AND forcing a layout pass via afterUpdate's scrollHeight read
  //   pinned the JS thread on touch devices long enough to read as a
  //   permanent freeze. 50 is empirically enough to read the recent
  //   trail; older entries are still in the report when needed.
  // Alternatives considered:
  //   - Virtualised list (svelte-virtual-list etc): rejected, adds a dep
  //     for an alpha-only debug surface.
  //   - Lower MAX_ENTRIES from 200 to 50: rejected, would lose history
  //     in copy/report exports which are the diagnostic deliverable.
  const MAX_VISIBLE_ENTRIES = 50;
  $: visibleEntries = entries.length > MAX_VISIBLE_ENTRIES
    ? entries.slice(-MAX_VISIBLE_ENTRIES)
    : entries;
  $: hiddenEntryCount = Math.max(0, entries.length - visibleEntries.length);

  // Auto-scroll log to bottom after every component update.
  // Requirement: pin the log view to the latest entry so users see new logs.
  // Approach: afterUpdate runs once per render cycle, AFTER Svelte has
  //   flushed DOM updates — so scrollHeight reflects the just-rendered
  //   content. No tick() / microtask scheduling needed.
  afterUpdate(() => {
    if (activeTab === 'log' && logContainer && entries.length) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  });

  let unsubscribe: (() => void) | null = null;
  let copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    // debugSubscribe delivers all existing entries immediately on subscribe,
    // then notifies on each new entry — no separate initialisation needed.
    unsubscribe = debugSubscribe(() => {
      entries = [...debugGetEntries()];
    });

    // Signal to inline pill that the framework has mounted
    window.__debugSvelteMounted = true;
    if (typeof window.__debugClearLoadTimer === 'function') {
      window.__debugClearLoadTimer();
    }

    debugAdd('boot', 'success', 'SvelteKit mounted, debug pill active');
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
    if (copyResetTimer) clearTimeout(copyResetTimer);
  });

  function toggleExpanded() {
    expanded = !expanded;
  }

  function handleClear() {
    debugClear();
    entries = [];
  }

  async function handleCopy() {
    const report = debugGenerateReport();
    const success = await copyToClipboard(report);
    if (success) {
      copyStatus = 'copied';
      copyFallbackText = '';
      // Cleared in onDestroy so unmount during the 2s window doesn't
      // leak a setState onto a destroyed component.
      if (copyResetTimer) clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(() => { copyStatus = 'idle'; }, 2000);
    } else {
      // Clipboard API failed in all 3 tiers — show visible textarea so users
      // can manually select and copy (pattern: textarea with onFocus auto-select).
      copyStatus = 'failed';
      copyFallbackText = report;
    }
  }

  // Severity → DaisyUI semantic text colour utility class.
  // Replaces the previous `severityColor()` that returned raw CSS strings
  // (var(--color-error), color-mix(...)) for inline `style="color:..."`.
  // Going through DaisyUI tokens keeps the pill's colour palette in
  // lockstep with the active theme automatically.
  function severityClass(severity: DebugSeverity): string {
    switch (severity) {
      case 'error': return 'text-error';
      case 'warn': return 'text-warning';
      case 'success': return 'text-success';
      default: return 'text-base-content/60';
    }
  }

  // --- Environment tab data ---
  function getEnvironmentData(): Array<{ label: string; value: string }> {
    const env = debugGetEnvironment();
    return [
      { label: 'URL', value: `${window.location.origin}${window.location.pathname}` },
      { label: 'User Agent', value: navigator.userAgent },
      { label: 'Screen', value: `${screen.width}x${screen.height}` },
      { label: 'Viewport', value: `${innerWidth}x${innerHeight}` },
      { label: 'Online', value: String(navigator.onLine) },
      { label: 'Protocol', value: location.protocol },
      { label: 'Standalone', value: String(env.standalone) },
      { label: 'SW Support', value: String(env.swSupport) },
      { label: 'IndexedDB', value: String('indexedDB' in window) },
      { label: 'Timestamp', value: new Date().toISOString() },
    ];
  }

  // --- PWA Diagnostics ---
  // Uses monotonic counter (diagnosticRunId) for stale-run cancellation —
  // if user closes/reopens while probes are in-flight, stale results are dropped.
  async function runDiagnostics(): Promise<void> {
    const runId = ++diagnosticRunId;
    diagnostics = [{ label: 'Running...', status: 'running', detail: '' }];

    const results: DiagnosticResult[] = [];

    // Sync checks
    results.push({
      label: 'Protocol',
      status: location.protocol === 'https:' || location.hostname === 'localhost' ? 'pass' : 'fail',
      detail: location.protocol,
    });
    results.push({
      label: 'Network',
      status: navigator.onLine ? 'pass' : 'warn',
      detail: navigator.onLine ? 'Online' : 'Offline',
    });
    results.push({
      label: 'SW Support',
      status: 'serviceWorker' in navigator ? 'pass' : 'fail',
      detail: 'serviceWorker' in navigator ? 'Supported' : 'Not supported',
    });

    // Async: Service Worker state. 5s timeout so a pathological SW
    // hanging on activation doesn't leave the diagnostic stuck on
    // "Running…" indefinitely.
    if ('serviceWorker' in navigator) {
      let swTimeoutId: ReturnType<typeof setTimeout> | null = null;
      try {
        const reg = await Promise.race([
          navigator.serviceWorker.getRegistration('/'),
          new Promise<never>((_, reject) => {
            swTimeoutId = setTimeout(() => reject(new Error('timeout (5s)')), 5000);
          }),
        ]);
        if (swTimeoutId) clearTimeout(swTimeoutId);
        if (runId !== diagnosticRunId) return;
        const state = reg?.active ? 'active' : reg?.waiting ? 'waiting' : reg?.installing ? 'installing' : 'none';
        results.push({ label: 'SW State', status: reg ? 'pass' : 'warn', detail: state });
      } catch (e) {
        // clearTimeout even on the timeout-rejection path so the timer
        // doesn't fire spuriously after we've already moved on.
        if (swTimeoutId) clearTimeout(swTimeoutId);
        if (runId !== diagnosticRunId) return;
        results.push({ label: 'SW State', status: 'fail', detail: String(e) });
      }
    }

    // Manifest validation
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      try {
        const res = await fetch(manifestLink.getAttribute('href') || '/manifest.webmanifest');
        if (runId !== diagnosticRunId) return;
        const manifest = await res.json();
        const hasIcons = manifest.icons?.length > 0;
        const hasName = !!manifest.name;
        results.push({
          label: 'Manifest',
          status: hasIcons && hasName ? 'pass' : 'warn',
          detail: `name=${manifest.name || 'missing'}, icons=${manifest.icons?.length || 0}`,
        });
      } catch {
        if (runId !== diagnosticRunId) return;
        results.push({ label: 'Manifest', status: 'fail', detail: 'Failed to fetch' });
      }
    } else {
      results.push({ label: 'Manifest', status: 'fail', detail: 'No <link rel="manifest"> found' });
    }

    // Standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || navigator.standalone === true;
    results.push({ label: 'Standalone', status: standalone ? 'pass' : 'warn', detail: String(standalone) });

    // beforeinstallprompt
    const hasPrompt = !!window.__pwaInstallPromptEvent;
    results.push({ label: 'Install Prompt', status: hasPrompt ? 'pass' : 'warn', detail: hasPrompt ? 'Captured' : 'Not received' });

    // Final stale-run guard before applying results
    if (runId === diagnosticRunId) {
      diagnostics = results;
    }
  }

  function diagnosticStatusIcon(status: string): string {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warn': return '⚠️';
      case 'running': return '⏳';
      default: return '❓';
    }
  }

  // Tab definitions — typed as const for type safety on activeTab assignment
  const TABS = [
    { key: 'log' as const, label: 'Log' },
    { key: 'env' as const, label: 'Environment' },
    { key: 'pwa' as const, label: 'PWA Diagnostics' },
  ];
</script>

<!-- Collapsed pill -->
{#if !expanded}
  <button
    on:click={toggleExpanded}
    type="button"
    aria-label="Open debug panel"
    data-tip="Open debug panel"
    class="btn btn-sm btn-ghost rounded-full font-mono fixed bottom-4 right-4 z-[80] bg-base-200 border-base-300 tooltip tooltip-left"
  >
    <span>dbg</span>
    <span class="opacity-60">{entries.length}</span>
    {#if errorCount > 0}
      <span class="badge badge-error badge-xs">{errorCount}</span>
    {/if}
    {#if warnCount > 0}
      <span class="badge badge-warning badge-xs">{warnCount}</span>
    {/if}
  </button>
{/if}

<!-- Expanded panel -->
{#if expanded}
  <div
    class="fixed bottom-4 right-4 z-[80] w-[420px] max-w-[calc(100vw-2rem)] max-h-[480px] flex flex-col bg-base-100 text-base-content border border-base-300 rounded-lg font-mono text-xs overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 bg-base-200 border-b border-base-300 flex-shrink-0">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-base-content">Debug</span>
        <span class="text-base-content/50">{entries.length} entries</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          on:click={handleCopy}
          type="button"
          aria-label="Copy debug report to clipboard"
          data-tip="Copy debug report to clipboard"
          class="btn btn-xs font-mono tooltip tooltip-bottom {copyStatus === 'copied' ? 'btn-success' : copyStatus === 'failed' ? 'btn-error' : ''}"
        >
          {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'failed' ? 'Failed' : 'Copy'}
        </button>
        <button
          on:click={handleClear}
          type="button"
          aria-label="Clear all log entries"
          data-tip="Clear all log entries"
          class="btn btn-xs font-mono tooltip tooltip-bottom"
        >Clear</button>
        <button
          on:click={toggleExpanded}
          type="button"
          aria-label="Close debug panel"
          data-tip="Close debug panel"
          class="btn btn-xs btn-square btn-ghost font-mono tooltip tooltip-left"
        >&times;</button>
      </div>
    </div>

    <!-- Clipboard fallback: visible textarea when all clipboard methods fail -->
    {#if copyFallbackText}
      <div class="px-3 py-2 bg-base-300 border-b border-base-300 flex-shrink-0">
        <div class="flex justify-between items-center mb-1">
          <span class="text-warning text-[11px]">Copy failed — select text below and copy manually</span>
          <button
            on:click={() => { copyFallbackText = ''; copyStatus = 'idle'; }}
            class="btn btn-xs btn-ghost font-mono"
          >Dismiss</button>
        </div>
        <textarea
          readonly
          on:focus={(e) => { e.currentTarget.select(); }}
          class="textarea textarea-xs font-mono w-full h-20 resize-none"
        >{copyFallbackText}</textarea>
      </div>
    {/if}

    <!-- Tabs — DaisyUI .tabs.tabs-border keeps the bottom-border indicator
         the original styling used; .tab-active marks the current tab. -->
    <div role="tablist" class="tabs tabs-border bg-base-200 flex-shrink-0">
      {#each TABS as tab (tab.key)}
        <button
          role="tab"
          type="button"
          id={`debug-tab-${tab.key}`}
          aria-controls={`debug-tabpanel-${tab.key}`}
          class="tab font-mono text-xs flex-1 {activeTab === tab.key ? 'tab-active' : ''}"
          aria-selected={activeTab === tab.key}
          on:click={() => {
            activeTab = tab.key;
            if (tab.key === 'pwa') runDiagnostics();
          }}
        >{tab.label}</button>
      {/each}
    </div>

    <!-- Tab content -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- Log tab -->
      {#if activeTab === 'log'}
        <div
          bind:this={logContainer}
          role="tabpanel"
          id="debug-tabpanel-log"
          aria-labelledby="debug-tab-log"
          class="py-1 overflow-y-auto h-full"
        >
          {#if entries.length === 0}
            <div class="p-4 text-base-content/50 text-center">No log entries yet</div>
          {:else}
            {#if hiddenEntryCount > 0}
              <div class="px-2.5 py-1 text-base-content/60 text-[10px] text-center border-b border-base-300 bg-base-200">
                Showing last {visibleEntries.length} of {entries.length} entries (older trimmed for performance — full log included in Copy)
              </div>
            {/if}
            {#each visibleEntries as entry (entry.id)}
              <div class="px-2.5 py-[3px] border-b border-base-300 leading-[1.4]">
                <div class="flex gap-1.5 items-baseline">
                  <span class="text-base-content/50 flex-shrink-0">{formatDebugTimestamp(entry.timestamp)}</span>
                  <span class="flex-shrink-0 text-[10px] uppercase min-w-9 {severityClass(entry.severity)}">{entry.severity}</span>
                  <span class="text-base-content/60 flex-shrink-0 text-[10px]">[{entry.source}]</span>
                  <span class="text-base-content break-words">{entry.event}</span>
                </div>
                {#if entry.details}
                  <div class="text-base-content/50 text-[10px] mt-px ml-[82px] break-all">{safeStringify(entry.details)}</div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {/if}

      <!-- Environment tab -->
      {#if activeTab === 'env'}
        <div
          role="tabpanel"
          id="debug-tabpanel-env"
          aria-labelledby="debug-tab-env"
          class="px-3 py-2"
        >
          {#each getEnvironmentData() as item (item.label)}
            <div class="flex justify-between py-1 border-b border-base-300 gap-3">
              <span class="text-base-content/60 flex-shrink-0">{item.label}</span>
              <span class="text-base-content text-right break-all max-w-[280px]">{item.value}</span>
            </div>
          {/each}
        </div>
      {/if}

      <!-- PWA Diagnostics tab -->
      {#if activeTab === 'pwa'}
        <div
          role="tabpanel"
          id="debug-tabpanel-pwa"
          aria-labelledby="debug-tab-pwa"
          class="px-3 py-2"
        >
          <button
            on:click={runDiagnostics}
            class="btn btn-xs font-mono mb-2"
          >Re-run diagnostics</button>
          {#if diagnostics.length === 0}
            <div class="text-base-content/50 text-center p-4">Click "Re-run diagnostics" to check PWA status</div>
          {:else}
            {#each diagnostics as diag (diag.label)}
              <div class="flex items-center gap-2 py-1 border-b border-base-300">
                <span class="flex-shrink-0 text-sm">{diagnosticStatusIcon(diag.status)}</span>
                <span class="text-base-content/60 flex-shrink-0 min-w-[90px]">{diag.label}</span>
                <span class="text-base-content break-words">{diag.detail}</span>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Touch-tooltip guard.
     DaisyUI's .tooltip pseudo-elements activate on :hover and :focus.
     On coarse-pointer / non-hover devices a tap synthesises a hover
     state that can stick after the click handler runs — and on a
     position:fixed element that mounts/unmounts synchronously
     (the DebugPill swapping the closed pill for the expanded panel,
     or the open panel mounting alongside its tooltip-bearing buttons)
     the stuck pseudo-element interleaves with the layout pass. The
     practical effect on mobile WebKit was a multi-second freeze on
     first tap.
     Scoping :global() to #debug-root keeps this rule targeted at the
     pill's own DOM and leaves DaisyUI tooltips elsewhere in the app
     untouched. The selector matches both ::before (label text)
     and ::after (arrow).
     Comma-OR form chosen over `not all and (hover) and (pointer)` —
     `not` precedence on compound media queries varies between older
     parsers; comma-OR is unambiguous: matches when the device has
     no hover capability OR a coarse pointer. */
  @media (hover: none), (pointer: coarse) {
    :global(#debug-root .tooltip::before),
    :global(#debug-root .tooltip::after) {
      display: none !important;
    }
  }
</style>
