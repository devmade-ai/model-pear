<!--
  Requirement: Floating debug pill for alpha-phase diagnostics
  Approach: Svelte component mounted in separate #debug-root (survives app crashes).
    Uses inline styles instead of Tailwind — survives stylesheet load failures since
    the pill runs in an isolated root outside the SvelteKit tree.
  Alternatives:
    - Embed in SvelteKit layout tree: Rejected — dies if app crashes
    - Tailwind classes: Rejected — app CSS not guaranteed to load in isolated root
  Source: glow-props DEBUG_SYSTEM.md pattern, adapted for Svelte 4
-->
<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import type { DebugEntry } from '$lib/debugLog';
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

  // Counts for badge display
  $: errorCount = entries.filter((e) => e.severity === 'error').length;
  $: warnCount = entries.filter((e) => e.severity === 'warn').length;

  // Auto-scroll log to bottom on new entries.
  // tick() waits for Svelte's pending DOM updates to flush before scrolling.
  $: if (logContainer && entries.length) {
    tick().then(() => {
      if (logContainer) logContainer.scrollTop = logContainer.scrollHeight;
    });
  }

  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    // debugSubscribe delivers all existing entries immediately on subscribe,
    // then notifies on each new entry — no separate initialisation needed.
    unsubscribe = debugSubscribe(() => {
      entries = [...debugGetEntries()];
    });

    // Signal to inline pill that the framework has mounted
    (window as any).__debugSvelteMounted = true;
    if (typeof (window as any).__debugClearLoadTimer === 'function') {
      (window as any).__debugClearLoadTimer();
    }

    debugAdd('boot', 'success', 'SvelteKit mounted, debug pill active');
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
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
      setTimeout(() => { copyStatus = 'idle'; }, 2000);
    } else {
      // Clipboard API failed in all 3 tiers — show visible textarea so users
      // can manually select and copy (pattern: textarea with onFocus auto-select).
      copyStatus = 'failed';
      copyFallbackText = report;
    }
  }

  // Source → color mapping (inline style values).
  //
  // These 9 categories need 9 visually distinct hues for fast at-a-glance
  // log filtering. DaisyUI's 8 semantic tokens (primary/secondary/accent/
  // neutral/info/success/warning/error) carry meaning that conflicts with
  // dev-log categorisation (mapping `auth` -> `success` would mislead).
  // The categories that DO map cleanly (`global` -> error, `api` -> primary)
  // use DaisyUI tokens. The rest stay as fixed hex — functional category
  // labels in a dev-only tool, not brand colours.
  const SOURCE_COLORS: Record<string, string> = {
    boot: '#f59e0b',
    pwa: '#06b6d4',
    render: '#8b5cf6',
    global: 'var(--color-error)',
    api: 'var(--color-primary)',
    auth: '#ec4899',
    db: '#10b981',
    form: '#f97316',
    engine: '#6366f1',
  };

  function sourceColor(source: string): string {
    return SOURCE_COLORS[source] || 'color-mix(in srgb, var(--color-base-content) 60%, transparent)';
  }

  // Severity → color mapping
  function severityColor(severity: string): string {
    switch (severity) {
      case 'error': return 'var(--color-error)';
      case 'warn': return 'var(--color-warning)';
      case 'success': return 'var(--color-success)';
      default: return 'color-mix(in srgb, var(--color-base-content) 60%, transparent)';
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

    // Async: Service Worker state
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration('/');
        if (runId !== diagnosticRunId) return;
        const state = reg?.active ? 'active' : reg?.waiting ? 'waiting' : reg?.installing ? 'installing' : 'none';
        results.push({ label: 'SW State', status: reg ? 'pass' : 'warn', detail: state });
      } catch (e) {
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
      || (navigator as any).standalone === true;
    results.push({ label: 'Standalone', status: standalone ? 'pass' : 'warn', detail: String(standalone) });

    // beforeinstallprompt
    const hasPrompt = !!(window as any).__pwaInstallPromptEvent;
    results.push({ label: 'Install Prompt', status: hasPrompt ? 'pass' : 'warn', detail: hasPrompt ? 'Captured' : 'Not received' });

    // Final stale-run guard before applying results
    if (runId === diagnosticRunId) {
      diagnostics = results;
    }
  }

  function diagnosticStatusIcon(status: string): string {
    switch (status) {
      case 'pass': return '\u2705';
      case 'fail': return '\u274c';
      case 'warn': return '\u26a0\ufe0f';
      case 'running': return '\u23f3';
      default: return '\u2753';
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
    style="
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 80;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--color-base-200);
      color: color-mix(in srgb, var(--color-base-content) 60%, transparent);
      border: 1px solid #333;
      border-radius: 9999px;
      font-family: monospace;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      user-select: none;
    "
    title="Open debug panel"
  >
    <span>dbg</span>
    <span style="color: color-mix(in srgb, var(--color-base-content) 50%, transparent);">{entries.length}</span>
    {#if errorCount > 0}
      <span style="
        background: var(--color-error);
        color: #fff;
        border-radius: 9999px;
        padding: 0 5px;
        font-size: 10px;
        min-width: 16px;
        text-align: center;
      ">{errorCount}</span>
    {/if}
    {#if warnCount > 0}
      <span style="
        background: var(--color-warning);
        color: #000;
        border-radius: 9999px;
        padding: 0 5px;
        font-size: 10px;
        min-width: 16px;
        text-align: center;
      ">{warnCount}</span>
    {/if}
  </button>
{/if}

<!-- Expanded panel -->
{#if expanded}
  <div
    style="
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 80;
      width: 420px;
      max-width: calc(100vw - 32px);
      max-height: 480px;
      display: flex;
      flex-direction: column;
      background: var(--color-base-100);
      color: var(--color-base-content);
      border: 1px solid #333;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      overflow: hidden;
    "
  >
    <!-- Header -->
    <div style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: #222;
      border-bottom: 1px solid #333;
      flex-shrink: 0;
    ">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 600; color: var(--color-base-content);">Debug</span>
        <span style="color: color-mix(in srgb, var(--color-base-content) 50%, transparent);">{entries.length} entries</span>
      </div>
      <div style="display: flex; align-items: center; gap: 4px;">
        <button
          on:click={handleCopy}
          style="
            padding: 3px 8px;
            background: {copyStatus === 'copied' ? 'var(--color-success)' : copyStatus === 'failed' ? 'var(--color-error)' : 'var(--color-base-300)'};
            color: var(--color-base-content);
            border: 1px solid #444;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
            font-size: 11px;
          "
          title="Copy debug report to clipboard"
        >
          {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'failed' ? 'Failed' : 'Copy'}
        </button>
        <button
          on:click={handleClear}
          style="
            padding: 3px 8px;
            background: #333;
            color: var(--color-base-content);
            border: 1px solid #444;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
            font-size: 11px;
          "
          title="Clear all log entries"
        >Clear</button>
        <button
          on:click={toggleExpanded}
          style="
            padding: 3px 8px;
            background: #333;
            color: var(--color-base-content);
            border: 1px solid #444;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
            font-size: 14px;
            line-height: 1;
          "
          title="Close debug panel"
        >&times;</button>
      </div>
    </div>

    <!-- Clipboard fallback: visible textarea when all clipboard methods fail -->
    {#if copyFallbackText}
      <div style="
        padding: 8px 12px;
        background: var(--color-base-300);
        border-bottom: 1px solid #333;
        flex-shrink: 0;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="color: var(--color-warning); font-size: 11px;">Copy failed — select text below and copy manually</span>
          <button
            on:click={() => { copyFallbackText = ''; copyStatus = 'idle'; }}
            style="
              padding: 2px 6px;
              background: #333;
              color: var(--color-base-content);
              border: 1px solid #444;
              border-radius: 4px;
              cursor: pointer;
              font-family: monospace;
              font-size: 10px;
            "
          >Dismiss</button>
        </div>
        <textarea
          readonly
          on:focus={(e) => { e.currentTarget.select(); }}
          style="
            width: 100%;
            height: 80px;
            background: var(--color-base-100);
            color: var(--color-base-content);
            border: 1px solid #444;
            border-radius: 4px;
            font-family: monospace;
            font-size: 10px;
            padding: 4px 6px;
            resize: none;
            box-sizing: border-box;
          "
        >{copyFallbackText}</textarea>
      </div>
    {/if}

    <!-- Tabs -->
    <div style="
      display: flex;
      border-bottom: 1px solid #333;
      background: var(--color-base-200);
      flex-shrink: 0;
    ">
      {#each TABS as tab}
        <button
          on:click={() => {
            activeTab = tab.key;
            if (tab.key === 'pwa') runDiagnostics();
          }}
          style="
            flex: 1;
            padding: 6px 8px;
            background: {activeTab === tab.key ? 'var(--color-base-300)' : 'transparent'};
            color: {activeTab === tab.key ? 'var(--color-base-content)' : 'color-mix(in srgb, var(--color-base-content) 50%, transparent)'};
            border: none;
            border-bottom: {activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent'};
            cursor: pointer;
            font-family: monospace;
            font-size: 11px;
            transition: color 0.15s;
          "
        >{tab.label}</button>
      {/each}
    </div>

    <!-- Tab content -->
    <div style="flex: 1; overflow-y: auto; min-height: 0;">
      <!-- Log tab -->
      {#if activeTab === 'log'}
        <div bind:this={logContainer} style="padding: 4px 0; overflow-y: auto; height: 100%;">
          {#if entries.length === 0}
            <div style="padding: 16px; color: color-mix(in srgb, var(--color-base-content) 50%, transparent); text-align: center;">No log entries yet</div>
          {:else}
            {#each entries as entry (entry.id)}
              <div style="
                padding: 3px 10px;
                border-bottom: 1px solid var(--color-base-300);
                line-height: 1.4;
              ">
                <div style="display: flex; gap: 6px; align-items: baseline;">
                  <span style="color: color-mix(in srgb, var(--color-base-content) 50%, transparent); flex-shrink: 0;">{formatDebugTimestamp(entry.timestamp)}</span>
                  <span style="
                    color: {severityColor(entry.severity)};
                    flex-shrink: 0;
                    font-size: 10px;
                    text-transform: uppercase;
                    min-width: 36px;
                  ">{entry.severity}</span>
                  <span style="
                    color: {sourceColor(entry.source)};
                    flex-shrink: 0;
                    font-size: 10px;
                  ">[{entry.source}]</span>
                  <span style="color: var(--color-base-content); word-break: break-word;">{entry.event}</span>
                </div>
                {#if entry.details}
                  <div style="
                    color: color-mix(in srgb, var(--color-base-content) 50%, transparent);
                    font-size: 10px;
                    margin-top: 1px;
                    margin-left: 82px;
                    word-break: break-all;
                  ">{JSON.stringify(entry.details)}</div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {/if}

      <!-- Environment tab -->
      {#if activeTab === 'env'}
        <div style="padding: 8px 12px;">
          {#each getEnvironmentData() as item}
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              border-bottom: 1px solid var(--color-base-300);
              gap: 12px;
            ">
              <span style="color: color-mix(in srgb, var(--color-base-content) 60%, transparent); flex-shrink: 0;">{item.label}</span>
              <span style="color: var(--color-base-content); text-align: right; word-break: break-all; max-width: 280px;">{item.value}</span>
            </div>
          {/each}
        </div>
      {/if}

      <!-- PWA Diagnostics tab -->
      {#if activeTab === 'pwa'}
        <div style="padding: 8px 12px;">
          <button
            on:click={runDiagnostics}
            style="
              margin-bottom: 8px;
              padding: 4px 10px;
              background: #333;
              color: var(--color-base-content);
              border: 1px solid #444;
              border-radius: 4px;
              cursor: pointer;
              font-family: monospace;
              font-size: 11px;
            "
          >Re-run diagnostics</button>
          {#if diagnostics.length === 0}
            <div style="color: color-mix(in srgb, var(--color-base-content) 50%, transparent); text-align: center; padding: 16px;">Click "Re-run diagnostics" to check PWA status</div>
          {:else}
            {#each diagnostics as diag}
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 0;
                border-bottom: 1px solid var(--color-base-300);
              ">
                <span style="flex-shrink: 0; font-size: 14px;">{diagnosticStatusIcon(diag.status)}</span>
                <span style="color: color-mix(in srgb, var(--color-base-content) 60%, transparent); flex-shrink: 0; min-width: 90px;">{diag.label}</span>
                <span style="color: var(--color-base-content); word-break: break-word;">{diag.detail}</span>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
