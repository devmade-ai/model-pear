// ========== DIFF VIEW ==========
// Shows what changed between two saved calculation options.
// Highlights input differences, setting changes, and result impacts.

import { getComparisonById, getState, subscribe } from '../../state/app-state.js';
import { getModelMetadata, getModelVariants } from '../../models/intercompany/registry.js';
import { formatCurrency, formatPercentage, showToast } from '../../utils/index.js';

// ========== STYLES ==========

export const diffViewStyles = `
    .diff-view-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        overflow-y: auto;
    }

    .diff-view-panel {
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 0.75rem;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .diff-view-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #374151;
    }

    .diff-view-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #f3f4f6;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .diff-view-close {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
        line-height: 1;
        transition: color 0.2s;
    }

    .diff-view-close:hover {
        color: #f3f4f6;
    }

    .diff-view-selector {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-wrap: wrap;
    }

    .diff-view-select-group {
        flex: 1;
        min-width: 200px;
    }

    .diff-view-select-label {
        font-size: 0.75rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.375rem;
        display: block;
    }

    .diff-view-select {
        width: 100%;
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 0.375rem;
        color: #f3f4f6;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        cursor: pointer;
    }

    .diff-view-select:focus {
        outline: none;
        border-color: #2563eb;
    }

    .diff-view-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 1.5rem;
        padding-top: 1.25rem;
    }

    .diff-view-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
    }

    .diff-view-empty {
        text-align: center;
        padding: 3rem 1rem;
        color: #6b7280;
    }

    .diff-view-empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .diff-view-summary {
        background: linear-gradient(135deg, #1e3a5f 0%, #1f2937 100%);
        border: 1px solid #2563eb;
        border-radius: 0.5rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
    }

    .diff-view-summary-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #60a5fa;
        margin-bottom: 0.75rem;
    }

    .diff-view-summary-stats {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .diff-view-summary-stat {
        display: flex;
        flex-direction: column;
    }

    .diff-view-summary-stat-label {
        font-size: 0.6875rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .diff-view-summary-stat-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: #f3f4f6;
    }

    .diff-view-summary-stat-value.added {
        color: #10b981;
    }

    .diff-view-summary-stat-value.removed {
        color: #ef4444;
    }

    .diff-view-summary-stat-value.changed {
        color: #f59e0b;
    }

    .diff-view-section {
        margin-bottom: 1.5rem;
    }

    .diff-view-section-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #374151;
    }

    .diff-view-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
    }

    .diff-view-table th,
    .diff-view-table td {
        padding: 0.625rem 0.75rem;
        text-align: left;
        border-bottom: 1px solid #374151;
    }

    .diff-view-table th {
        background: #111827;
        color: #9ca3af;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .diff-view-table tr:hover {
        background: rgba(55, 65, 81, 0.3);
    }

    .diff-view-table .field-name {
        color: #d1d5db;
        font-weight: 500;
    }

    .diff-view-table .value-before {
        color: #f87171;
        text-decoration: line-through;
        font-family: 'Monaco', 'Menlo', monospace;
    }

    .diff-view-table .value-after {
        color: #34d399;
        font-family: 'Monaco', 'Menlo', monospace;
    }

    .diff-view-table .value-unchanged {
        color: #6b7280;
        font-family: 'Monaco', 'Menlo', monospace;
    }

    .diff-view-table .change-indicator {
        width: 80px;
        text-align: center;
    }

    .diff-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .diff-badge.added {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
    }

    .diff-badge.removed {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }

    .diff-badge.changed {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }

    .diff-badge.same {
        background: rgba(107, 114, 128, 0.2);
        color: #6b7280;
    }

    .diff-view-change-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .diff-view-arrow-small {
        color: #6b7280;
    }

    .diff-view-no-changes {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: center;
        color: #10b981;
    }

    .diff-view-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 1rem 1.5rem;
        border-top: 1px solid #374151;
        background: #111827;
    }

    .diff-view-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s;
        cursor: pointer;
        border: none;
        background: #374151;
        color: #d1d5db;
    }

    .diff-view-btn:hover {
        background: #4b5563;
    }

    /* Impact indicator */
    .diff-impact {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8125rem;
    }

    .diff-impact.positive {
        color: #10b981;
    }

    .diff-impact.negative {
        color: #ef4444;
    }

    .diff-impact.neutral {
        color: #6b7280;
    }
`;

// ========== COMPONENT STATE ==========

let containerElement = null;
let unsubscriber = null;
let selectedBeforeId = null;
let selectedAfterId = null;

// ========== INITIALIZATION ==========

/**
 * Initialize the diff view component
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 */
export function initDiffView(container, options = {}) {
    containerElement = container;

    // Set initial selections if provided
    if (options.beforeId) selectedBeforeId = options.beforeId;
    if (options.afterId) selectedAfterId = options.afterId;

    render();
    setupEventListeners();

    // Listen for diff view open events
    document.addEventListener('diff:open', handleDiffOpen);
}

/**
 * Destroy the diff view
 */
export function destroyDiffView() {
    if (unsubscriber) {
        unsubscriber();
        unsubscriber = null;
    }

    document.removeEventListener('diff:open', handleDiffOpen);

    if (containerElement) {
        containerElement.innerHTML = '';
        containerElement = null;
    }

    selectedBeforeId = null;
    selectedAfterId = null;
}

/**
 * Show the diff view
 * @param {string} beforeId - ID of the "before" comparison
 * @param {string} afterId - ID of the "after" comparison
 */
export function showDiffView(beforeId, afterId) {
    if (!containerElement) return;

    selectedBeforeId = beforeId || null;
    selectedAfterId = afterId || null;

    render();
    containerElement.classList.remove('hidden');
}

/**
 * Hide the diff view
 */
export function hideDiffView() {
    if (!containerElement) return;
    containerElement.classList.add('hidden');
}

// ========== RENDER ==========

function render() {
    if (!containerElement) return;

    const state = getState();
    const comparisons = state.savedComparisons || [];

    const before = selectedBeforeId ? getComparisonById(selectedBeforeId) : null;
    const after = selectedAfterId ? getComparisonById(selectedAfterId) : null;

    const diff = before && after ? calculateDiff(before, after) : null;

    containerElement.innerHTML = `
        <style>${diffViewStyles}</style>
        <div class="diff-view-overlay" id="diffViewOverlay">
            <div class="diff-view-panel">
                <!-- Header -->
                <div class="diff-view-header">
                    <h2 class="diff-view-title">
                        <span>🔄</span> What Changed?
                    </h2>
                    <button class="diff-view-close" id="closeDiffView" title="Close">&times;</button>
                </div>

                <!-- Option Selectors -->
                <div class="diff-view-selector">
                    <div class="diff-view-select-group">
                        <label class="diff-view-select-label">Before (Original)</label>
                        <select class="diff-view-select" id="diffBeforeSelect">
                            <option value="">Select an option...</option>
                            ${comparisons.map(c => `
                                <option value="${c.id}" ${c.id === selectedBeforeId ? 'selected' : ''}>
                                    ${escapeHtml(c.name)} (${formatTimestamp(c.timestamp)})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="diff-view-arrow">→</div>
                    <div class="diff-view-select-group">
                        <label class="diff-view-select-label">After (Changed)</label>
                        <select class="diff-view-select" id="diffAfterSelect">
                            <option value="">Select an option...</option>
                            ${comparisons.map(c => `
                                <option value="${c.id}" ${c.id === selectedAfterId ? 'selected' : ''}>
                                    ${escapeHtml(c.name)} (${formatTimestamp(c.timestamp)})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- Content -->
                <div class="diff-view-content">
                    ${!before || !after ? renderEmptyState() : renderDiffContent(before, after, diff)}
                </div>

                <!-- Footer -->
                <div class="diff-view-footer">
                    <button class="diff-view-btn" id="closeDiffViewBtn">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderEmptyState() {
    return `
        <div class="diff-view-empty">
            <div class="diff-view-empty-icon">🔍</div>
            <h3 style="color: #d1d5db; margin-bottom: 0.5rem;">Select Two Options to Compare</h3>
            <p>Choose a "before" and "after" option above to see what changed between them.</p>
        </div>
    `;
}

function renderDiffContent(before, after, diff) {
    if (!diff) return '';

    const hasChanges = diff.totalChanges > 0;

    return `
        <!-- Summary -->
        <div class="diff-view-summary">
            <div class="diff-view-summary-title">Change Summary</div>
            <div class="diff-view-summary-stats">
                <div class="diff-view-summary-stat">
                    <span class="diff-view-summary-stat-label">Changed</span>
                    <span class="diff-view-summary-stat-value changed">${diff.stats.changed}</span>
                </div>
                <div class="diff-view-summary-stat">
                    <span class="diff-view-summary-stat-label">Added</span>
                    <span class="diff-view-summary-stat-value added">${diff.stats.added}</span>
                </div>
                <div class="diff-view-summary-stat">
                    <span class="diff-view-summary-stat-label">Removed</span>
                    <span class="diff-view-summary-stat-value removed">${diff.stats.removed}</span>
                </div>
                <div class="diff-view-summary-stat">
                    <span class="diff-view-summary-stat-label">Unchanged</span>
                    <span class="diff-view-summary-stat-value">${diff.stats.unchanged}</span>
                </div>
            </div>
        </div>

        ${!hasChanges ? `
            <div class="diff-view-no-changes">
                <span style="font-size: 1.5rem; margin-right: 0.5rem;">✓</span>
                These options have identical inputs and settings.
            </div>
        ` : ''}

        <!-- Model/Variant Changes -->
        ${renderModelChanges(diff)}

        <!-- Input Changes -->
        ${renderInputChanges(diff)}

        <!-- Entity Config Changes -->
        ${renderEntityConfigChanges(diff)}

        <!-- Result Impact -->
        ${renderResultImpact(before, after, diff)}
    `;
}

function renderModelChanges(diff) {
    if (!diff.modelChanged && !diff.variantChanged) return '';

    return `
        <div class="diff-view-section">
            <div class="diff-view-section-title">
                <span>📦</span> Model / Variant
            </div>
            <table class="diff-view-table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Before</th>
                        <th></th>
                        <th>After</th>
                        <th class="change-indicator">Change</th>
                    </tr>
                </thead>
                <tbody>
                    ${diff.modelChanged ? `
                        <tr>
                            <td class="field-name">Model</td>
                            <td class="value-before">${escapeHtml(diff.before.modelName)}</td>
                            <td class="diff-view-arrow-small">→</td>
                            <td class="value-after">${escapeHtml(diff.after.modelName)}</td>
                            <td class="change-indicator"><span class="diff-badge changed">Changed</span></td>
                        </tr>
                    ` : ''}
                    ${diff.variantChanged ? `
                        <tr>
                            <td class="field-name">Variant</td>
                            <td class="value-before">${escapeHtml(diff.before.variantId)}</td>
                            <td class="diff-view-arrow-small">→</td>
                            <td class="value-after">${escapeHtml(diff.after.variantId)}</td>
                            <td class="change-indicator"><span class="diff-badge changed">Changed</span></td>
                        </tr>
                    ` : ''}
                </tbody>
            </table>
        </div>
    `;
}

function renderInputChanges(diff) {
    if (diff.inputChanges.length === 0) return '';

    return `
        <div class="diff-view-section">
            <div class="diff-view-section-title">
                <span>📝</span> Input Values (${diff.inputChanges.length} changes)
            </div>
            <table class="diff-view-table">
                <thead>
                    <tr>
                        <th>Input</th>
                        <th>Before</th>
                        <th></th>
                        <th>After</th>
                        <th class="change-indicator">Change</th>
                    </tr>
                </thead>
                <tbody>
                    ${diff.inputChanges.map(change => `
                        <tr>
                            <td class="field-name">${escapeHtml(formatFieldName(change.field))}</td>
                            <td class="${change.type === 'added' ? 'value-unchanged' : 'value-before'}">
                                ${change.type === 'added' ? '—' : formatDiffValue(change.before)}
                            </td>
                            <td class="diff-view-arrow-small">→</td>
                            <td class="${change.type === 'removed' ? 'value-unchanged' : 'value-after'}">
                                ${change.type === 'removed' ? '—' : formatDiffValue(change.after)}
                            </td>
                            <td class="change-indicator">
                                <span class="diff-badge ${change.type}">${change.type}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderEntityConfigChanges(diff) {
    if (diff.configChanges.length === 0) return '';

    return `
        <div class="diff-view-section">
            <div class="diff-view-section-title">
                <span>⚙️</span> Entity Configuration (${diff.configChanges.length} changes)
            </div>
            <table class="diff-view-table">
                <thead>
                    <tr>
                        <th>Setting</th>
                        <th>Before</th>
                        <th></th>
                        <th>After</th>
                        <th class="change-indicator">Change</th>
                    </tr>
                </thead>
                <tbody>
                    ${diff.configChanges.map(change => `
                        <tr>
                            <td class="field-name">${escapeHtml(formatFieldName(change.field))}</td>
                            <td class="${change.type === 'added' ? 'value-unchanged' : 'value-before'}">
                                ${change.type === 'added' ? '—' : formatDiffValue(change.before)}
                            </td>
                            <td class="diff-view-arrow-small">→</td>
                            <td class="${change.type === 'removed' ? 'value-unchanged' : 'value-after'}">
                                ${change.type === 'removed' ? '—' : formatDiffValue(change.after)}
                            </td>
                            <td class="change-indicator">
                                <span class="diff-badge ${change.type}">${change.type}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderResultImpact(before, after, diff) {
    // Calculate key metric differences
    const metrics = [
        { label: 'Developer Revenue', path: 'developer.revenue.total', higherBetter: true },
        { label: 'Developer Profit', path: 'developer.profit.net', higherBetter: true },
        { label: 'Buyer Total Cost', path: 'buyer.totalCost', higherBetter: false },
        { label: 'Buyer Asset', path: 'buyer.asset.capitalised', higherBetter: true }
    ];

    const impacts = metrics.map(m => {
        const beforeVal = getNestedValue(before.results, m.path);
        const afterVal = getNestedValue(after.results, m.path);

        if (typeof beforeVal !== 'number' || typeof afterVal !== 'number') {
            return null;
        }

        const diff = afterVal - beforeVal;
        const pctChange = beforeVal !== 0 ? (diff / beforeVal) * 100 : 0;
        const isPositive = m.higherBetter ? diff > 0 : diff < 0;

        return {
            ...m,
            before: beforeVal,
            after: afterVal,
            diff,
            pctChange,
            isPositive
        };
    }).filter(Boolean);

    if (impacts.length === 0) return '';

    return `
        <div class="diff-view-section">
            <div class="diff-view-section-title">
                <span>📊</span> Result Impact
            </div>
            <table class="diff-view-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Before</th>
                        <th>After</th>
                        <th>Change</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    ${impacts.map(impact => `
                        <tr>
                            <td class="field-name">${impact.label}</td>
                            <td style="font-family: monospace;">${formatCurrency(impact.before)}</td>
                            <td style="font-family: monospace;">${formatCurrency(impact.after)}</td>
                            <td>
                                <div class="diff-impact ${impact.diff === 0 ? 'neutral' : (impact.isPositive ? 'positive' : 'negative')}">
                                    ${impact.diff > 0 ? '+' : ''}${formatCurrency(impact.diff)}
                                </div>
                            </td>
                            <td>
                                <div class="diff-impact ${impact.diff === 0 ? 'neutral' : (impact.isPositive ? 'positive' : 'negative')}">
                                    ${impact.diff === 0 ? '—' : `${impact.diff > 0 ? '▲' : '▼'} ${Math.abs(impact.pctChange).toFixed(1)}%`}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== DIFF CALCULATION ==========

function calculateDiff(before, after) {
    const inputChanges = [];
    const configChanges = [];
    const stats = { changed: 0, added: 0, removed: 0, unchanged: 0 };

    // Compare model and variant
    const modelChanged = before.modelId !== after.modelId;
    const variantChanged = before.variantId !== after.variantId;

    if (modelChanged) stats.changed++;
    if (variantChanged) stats.changed++;

    // Compare inputs
    const beforeInputs = before.inputs || {};
    const afterInputs = after.inputs || {};
    const allInputKeys = new Set([...Object.keys(beforeInputs), ...Object.keys(afterInputs)]);

    for (const key of allInputKeys) {
        const beforeVal = beforeInputs[key];
        const afterVal = afterInputs[key];

        if (beforeVal === undefined && afterVal !== undefined) {
            inputChanges.push({ field: key, before: undefined, after: afterVal, type: 'added' });
            stats.added++;
        } else if (beforeVal !== undefined && afterVal === undefined) {
            inputChanges.push({ field: key, before: beforeVal, after: undefined, type: 'removed' });
            stats.removed++;
        } else if (!deepEqual(beforeVal, afterVal)) {
            inputChanges.push({ field: key, before: beforeVal, after: afterVal, type: 'changed' });
            stats.changed++;
        } else {
            stats.unchanged++;
        }
    }

    // Compare entity config
    const beforeConfig = flattenObject(before.entityConfig || {});
    const afterConfig = flattenObject(after.entityConfig || {});
    const allConfigKeys = new Set([...Object.keys(beforeConfig), ...Object.keys(afterConfig)]);

    for (const key of allConfigKeys) {
        const beforeVal = beforeConfig[key];
        const afterVal = afterConfig[key];

        if (beforeVal === undefined && afterVal !== undefined) {
            configChanges.push({ field: key, before: undefined, after: afterVal, type: 'added' });
            stats.added++;
        } else if (beforeVal !== undefined && afterVal === undefined) {
            configChanges.push({ field: key, before: beforeVal, after: undefined, type: 'removed' });
            stats.removed++;
        } else if (!deepEqual(beforeVal, afterVal)) {
            configChanges.push({ field: key, before: beforeVal, after: afterVal, type: 'changed' });
            stats.changed++;
        } else {
            stats.unchanged++;
        }
    }

    // Get model names
    const beforeModelMeta = getModelMetadata(before.modelId);
    const afterModelMeta = getModelMetadata(after.modelId);

    return {
        before: {
            modelName: beforeModelMeta?.name || before.modelId,
            variantId: before.variantId
        },
        after: {
            modelName: afterModelMeta?.name || after.modelId,
            variantId: after.variantId
        },
        modelChanged,
        variantChanged,
        inputChanges,
        configChanges,
        stats,
        totalChanges: stats.changed + stats.added + stats.removed
    };
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerElement) return;

    containerElement.addEventListener('click', handleClick);
    containerElement.addEventListener('change', handleChange);
    containerElement.addEventListener('keydown', handleKeydown);
}

function handleClick(e) {
    const target = e.target;

    // Close buttons
    if (target.id === 'closeDiffView' || target.id === 'closeDiffViewBtn') {
        hideDiffView();
        return;
    }

    // Overlay click
    if (target.id === 'diffViewOverlay' && target === e.target) {
        hideDiffView();
        return;
    }
}

function handleChange(e) {
    const target = e.target;

    if (target.id === 'diffBeforeSelect') {
        selectedBeforeId = target.value || null;
        render();
        return;
    }

    if (target.id === 'diffAfterSelect') {
        selectedAfterId = target.value || null;
        render();
        return;
    }
}

function handleKeydown(e) {
    if (e.key === 'Escape') {
        hideDiffView();
    }
}

function handleDiffOpen(e) {
    const { beforeId, afterId } = e.detail || {};
    showDiffView(beforeId, afterId);
}

// ========== HELPERS ==========

function flattenObject(obj, prefix = '') {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, newKey));
        } else {
            result[newKey] = value;
        }
    }

    return result;
}

function deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!deepEqual(a[key], b[key])) return false;
        }

        return true;
    }

    return false;
}

function getNestedValue(obj, path) {
    const parts = path.split('.');
    let value = obj;

    for (const part of parts) {
        if (value === undefined || value === null) return undefined;
        value = value[part];
    }

    return value;
}

function formatFieldName(field) {
    // Convert camelCase or dot.notation to readable format
    return field
        .replace(/\./g, ' › ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/  +/g, ' ')
        .trim();
}

function formatDiffValue(value) {
    if (value === undefined || value === null) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
        if (value >= 1000) return formatCurrency(value);
        if (value < 1 && value > 0) return formatPercentage(value);
        return value.toLocaleString();
    }
    return escapeHtml(String(value));
}

function formatTimestamp(ts) {
    const date = new Date(ts);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ========== EXPORTS ==========

export default {
    initDiffView,
    destroyDiffView,
    showDiffView,
    hideDiffView,
    diffViewStyles
};
