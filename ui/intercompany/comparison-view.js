// ========== COMPARISON VIEW ==========
// Side-by-side comparison view for comparing saved calculation options.
// Shows key metrics in a table format with difference highlighting.

import {
    getComparisonById,
    getState,
    subscribe,
    setComparisonViewOpen,
    clearComparisonSelections
} from '../../state/app-state.js';
import { getModelMetadata, getModelVariants } from '../../models/intercompany/registry.js';
import { formatCurrency, formatPercentage, showToast } from '../../utils/index.js';
import { generateComparisonSummary, downloadAsJSON, downloadAsCSV } from '../../utils/storage.js';

// ========== STYLES ==========

export const comparisonViewStyles = `
    .comparison-view-overlay {
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

    .comparison-view-panel {
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 0.75rem;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .comparison-view-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #374151;
        flex-shrink: 0;
    }

    .comparison-view-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #f3f4f6;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .comparison-view-close {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
        line-height: 1;
        transition: color 0.2s;
    }

    .comparison-view-close:hover {
        color: #f3f4f6;
    }

    .comparison-view-toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0.75rem 1.5rem;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
        gap: 0.5rem;
    }

    .comparison-view-btn {
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

    .comparison-view-btn:hover {
        background: #4b5563;
    }

    .comparison-view-content {
        flex: 1;
        overflow-x: auto;
        overflow-y: auto;
        padding: 1.5rem;
    }

    .comparison-table-container {
        min-width: 100%;
        overflow-x: auto;
    }

    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
    }

    .comparison-table th,
    .comparison-table td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid #374151;
    }

    .comparison-table th {
        background: #111827;
        color: #9ca3af;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .comparison-table th.option-header {
        text-align: center;
        min-width: 150px;
    }

    .comparison-table .metric-label {
        font-weight: 500;
        color: #d1d5db;
    }

    .comparison-table .section-header {
        background: #1f2937;
        border-top: 2px solid #374151;
    }

    .comparison-table .section-header td {
        font-weight: 600;
        color: #60a5fa;
        padding-top: 1.25rem;
        font-size: 0.8125rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .comparison-table .value-cell {
        text-align: right;
        font-family: 'Monaco', 'Menlo', monospace;
    }

    .comparison-table .diff-cell {
        text-align: center;
        font-size: 0.8125rem;
        min-width: 120px;
    }

    .comparison-table .positive {
        color: #10b981;
    }

    .comparison-table .negative {
        color: #ef4444;
    }

    .comparison-table .neutral {
        color: #6b7280;
    }

    .comparison-table .highlight-best {
        background: rgba(16, 185, 129, 0.1);
    }

    .comparison-table .highlight-worst {
        background: rgba(239, 68, 68, 0.1);
    }

    .diff-arrow {
        font-size: 0.75rem;
        margin-left: 0.25rem;
    }

    .option-name {
        font-weight: 600;
        color: #f3f4f6;
        font-size: 0.9375rem;
        margin-bottom: 0.25rem;
    }

    .option-meta {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .option-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.125rem 0.375rem;
        background: #374151;
        border-radius: 9999px;
        font-size: 0.6875rem;
        color: #9ca3af;
    }

    .comparison-view-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-top: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
    }

    .comparison-view-legend {
        display: flex;
        gap: 1.5rem;
        font-size: 0.75rem;
        color: #6b7280;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .legend-color {
        width: 1rem;
        height: 1rem;
        border-radius: 0.25rem;
    }

    .legend-color.best {
        background: rgba(16, 185, 129, 0.3);
        border: 1px solid #10b981;
    }

    .legend-color.worst {
        background: rgba(239, 68, 68, 0.3);
        border: 1px solid #ef4444;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .comparison-view-panel {
            max-height: 95vh;
        }

        .comparison-table th,
        .comparison-table td {
            padding: 0.5rem;
            font-size: 0.8125rem;
        }

        .comparison-table th.option-header {
            min-width: 120px;
        }
    }
`;

// ========== COMPONENT STATE ==========

let containerElement = null;
let unsubscriber = null;
let comparisonIds = [];

// ========== INITIALIZATION ==========

/**
 * Initialize the comparison view
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 * @param {Array<string>} options.comparisonIds - IDs of comparisons to show
 */
export function initComparisonView(container, options = {}) {
    containerElement = container;
    comparisonIds = options.comparisonIds || [];

    // If no IDs provided, get from state
    if (comparisonIds.length === 0) {
        const state = getState();
        comparisonIds = state.ui.activeComparisonIds || [];
    }

    // Render the view
    render();

    // Subscribe to state changes
    unsubscriber = subscribe((newState, oldState) => {
        if (JSON.stringify(newState.ui.activeComparisonIds) !== JSON.stringify(oldState?.ui?.activeComparisonIds)) {
            comparisonIds = newState.ui.activeComparisonIds || [];
            render();
        }
    });

    // Set up event listeners
    setupEventListeners();
}

/**
 * Destroy the comparison view
 */
export function destroyComparisonView() {
    if (unsubscriber) {
        unsubscriber();
        unsubscriber = null;
    }

    if (containerElement) {
        containerElement.innerHTML = '';
        containerElement = null;
    }

    comparisonIds = [];
}

/**
 * Show the comparison view
 * @param {Array<string>} ids - IDs of comparisons to show
 */
export function showComparisonView(ids) {
    if (!containerElement) return;

    comparisonIds = ids || comparisonIds;
    render();
    containerElement.classList.remove('hidden');
    setComparisonViewOpen(true);
}

/**
 * Hide the comparison view
 */
export function hideComparisonView() {
    if (!containerElement) return;
    containerElement.classList.add('hidden');
    setComparisonViewOpen(false);
}

// ========== RENDER ==========

function render() {
    if (!containerElement) return;

    // Get comparison data
    const comparisons = comparisonIds.map(id => getComparisonById(id)).filter(Boolean);

    if (comparisons.length < 2) {
        containerElement.innerHTML = renderNoComparisons();
        return;
    }

    // Generate comparison summary
    const summary = generateComparisonSummary(comparisons);

    containerElement.innerHTML = `
        <style>${comparisonViewStyles}</style>
        <div class="comparison-view-overlay" id="comparisonViewOverlay">
            <div class="comparison-view-panel">
                <!-- Header -->
                <div class="comparison-view-header">
                    <h2 class="comparison-view-title">
                        <span>⚖️</span> Compare Options
                    </h2>
                    <button class="comparison-view-close" id="closeComparisonView" title="Close">&times;</button>
                </div>

                <!-- Toolbar -->
                <div class="comparison-view-toolbar">
                    <button class="comparison-view-btn" id="exportComparisonJSON">
                        <span>📥</span> Export JSON
                    </button>
                    <button class="comparison-view-btn" id="exportComparisonCSV">
                        <span>📊</span> Export CSV
                    </button>
                </div>

                <!-- Content -->
                <div class="comparison-view-content">
                    <div class="comparison-table-container">
                        ${renderComparisonTable(comparisons, summary)}
                    </div>
                </div>

                <!-- Footer -->
                <div class="comparison-view-footer">
                    <div class="comparison-view-legend">
                        <div class="legend-item">
                            <div class="legend-color best"></div>
                            <span>Best value</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color worst"></div>
                            <span>Worst value</span>
                        </div>
                    </div>
                    <div>
                        <span style="font-size: 0.75rem; color: #6b7280;">
                            Comparing ${comparisons.length} options
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderNoComparisons() {
    return `
        <style>${comparisonViewStyles}</style>
        <div class="comparison-view-overlay" id="comparisonViewOverlay">
            <div class="comparison-view-panel" style="max-width: 400px;">
                <div class="comparison-view-header">
                    <h2 class="comparison-view-title">
                        <span>⚖️</span> Compare Options
                    </h2>
                    <button class="comparison-view-close" id="closeComparisonView" title="Close">&times;</button>
                </div>
                <div class="comparison-view-content" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                    <h3 style="color: #d1d5db; margin-bottom: 0.5rem;">Select options to compare</h3>
                    <p style="color: #6b7280;">Select at least 2 saved options from the Saved Options panel to compare them side-by-side.</p>
                </div>
            </div>
        </div>
    `;
}

function renderComparisonTable(comparisons, summary) {
    // Define metrics to compare
    const metrics = [
        // Developer section
        { section: 'Developer', icon: '💻' },
        { key: 'developer.revenue', label: 'Revenue (Total)', format: 'currency', higherBetter: true },
        { key: 'developer.profit', label: 'Gross Profit', format: 'currency', higherBetter: true },
        { key: 'developer.margin', label: 'Profit Margin', format: 'percent', higherBetter: true },
        { key: 'developer.taxPayable', label: 'Tax Payable', format: 'currency', higherBetter: false },
        { key: 'developer.netProfit', label: 'Net Profit', format: 'currency', higherBetter: true },

        // Buyer section
        { section: 'Buyer', icon: '🏢' },
        { key: 'buyer.totalCost', label: 'Total Cost', format: 'currency', higherBetter: false },
        { key: 'buyer.capitalised', label: 'Asset Capitalised', format: 'currency', higherBetter: true },
        { key: 'buyer.expensed', label: 'Amount Expensed', format: 'currency', higherBetter: false },
        { key: 'buyer.taxBenefit', label: 'Tax Benefit', format: 'currency', higherBetter: true },

        // Combined section
        { section: 'Combined / Net Effect', icon: '⚖️' },
        { key: 'combined.transactionValue', label: 'Transaction Value', format: 'currency' },
        { key: 'combined.groupTaxCost', label: 'Group Tax Cost', format: 'currency', higherBetter: false },
        { key: 'combined.developerNetCash', label: 'Developer Net Cash', format: 'currency', higherBetter: true },
        { key: 'combined.buyerNetCash', label: 'Buyer Net Cash', format: 'currency', higherBetter: false },
        { key: 'combined.netCashFlow', label: 'Combined Net Cash', format: 'currency', higherBetter: true },

        // Transfer Pricing section
        { section: 'Transfer Pricing Risk', icon: '⚠️' },
        { key: 'transferPricing.riskLevel', label: 'Risk Level', format: 'risk' },
        { key: 'transferPricing.method', label: 'Method', format: 'text' },
        { key: 'transferPricing.margin', label: 'Margin', format: 'percent' }
    ];

    // Build header row with option names
    const headerRow = `
        <tr>
            <th class="metric-label">Metric</th>
            ${comparisons.map(comp => `
                <th class="option-header">
                    <div class="option-name">${escapeHtml(comp.name)}</div>
                    <div class="option-meta">
                        ${renderOptionBadges(comp)}
                    </div>
                </th>
            `).join('')}
            ${comparisons.length >= 2 ? '<th class="diff-cell">vs First</th>' : ''}
        </tr>
    `;

    // Build metric rows
    const rows = metrics.map(metric => {
        if (metric.section) {
            // Section header
            return `
                <tr class="section-header">
                    <td colspan="${comparisons.length + 2}">
                        <span>${metric.icon}</span> ${metric.section}
                    </td>
                </tr>
            `;
        }

        // Get values for this metric
        const values = summary.comparisons.map(comp => getNestedValue(comp, metric.key));
        const { best, worst } = findBestWorst(values, metric.higherBetter);

        // Render value cells
        const valueCells = summary.comparisons.map((comp, idx) => {
            const value = getNestedValue(comp, metric.key);
            const formattedValue = formatValue(value, metric.format);
            const highlight = getHighlightClass(value, best, worst, values, metric.higherBetter);

            return `
                <td class="value-cell ${highlight}">
                    ${formattedValue}
                </td>
            `;
        }).join('');

        // Render diff cell (compared to first option)
        let diffCell = '';
        if (comparisons.length >= 2 && summary.differences) {
            const firstValue = getNestedValue(summary.comparisons[0], metric.key);
            const lastValue = getNestedValue(summary.comparisons[summary.comparisons.length - 1], metric.key);
            const diff = typeof lastValue === 'number' && typeof firstValue === 'number'
                ? lastValue - firstValue
                : null;

            if (diff !== null) {
                const diffClass = getDiffClass(diff, metric.higherBetter);
                const arrow = getDiffArrow(diff, metric.higherBetter);
                diffCell = `
                    <td class="diff-cell ${diffClass}">
                        ${formatValue(diff, metric.format, true)}
                        <span class="diff-arrow">${arrow}</span>
                    </td>
                `;
            } else {
                diffCell = '<td class="diff-cell neutral">-</td>';
            }
        }

        return `
            <tr>
                <td class="metric-label">${metric.label}</td>
                ${valueCells}
                ${diffCell}
            </tr>
        `;
    }).join('');

    return `
        <table class="comparison-table">
            <thead>
                ${headerRow}
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

function renderOptionBadges(comp) {
    const modelMeta = getModelMetadata(comp.modelId);
    const variants = getModelVariants(comp.modelId);
    const variantMeta = variants?.find(v => v.id === comp.variantId);

    return `
        <span class="option-badge">${modelMeta?.icon || '📦'} ${modelMeta?.shortName || comp.modelId}</span>
        <span class="option-badge">${variantMeta?.id || comp.variantId}</span>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerElement) return;

    containerElement.addEventListener('click', handleClick);
    containerElement.addEventListener('keydown', handleKeydown);

    // Listen for custom event to open comparison view
    document.addEventListener('comparison:open', handleComparisonOpen);
}

function handleClick(e) {
    const target = e.target;

    // Close button or overlay click
    if (target.id === 'closeComparisonView') {
        hideComparisonView();
        return;
    }

    if (target.id === 'comparisonViewOverlay' && target === e.target) {
        hideComparisonView();
        return;
    }

    // Export buttons
    if (target.closest('#exportComparisonJSON')) {
        handleExportJSON();
        return;
    }

    if (target.closest('#exportComparisonCSV')) {
        handleExportCSV();
        return;
    }
}

function handleKeydown(e) {
    if (e.key === 'Escape') {
        hideComparisonView();
    }
}

function handleComparisonOpen(e) {
    const ids = e.detail?.comparisonIds || [];
    if (ids.length >= 2) {
        comparisonIds = ids;
        showComparisonView(ids);
    }
}

function handleExportJSON() {
    const comparisons = comparisonIds.map(id => getComparisonById(id)).filter(Boolean);
    if (comparisons.length === 0) return;

    downloadAsJSON(comparisons, `comparison-${comparisons.length}-options.json`);
    showToast('Comparison exported as JSON', 'success');
}

function handleExportCSV() {
    const comparisons = comparisonIds.map(id => getComparisonById(id)).filter(Boolean);
    if (comparisons.length === 0) return;

    downloadAsCSV(comparisons, `comparison-${comparisons.length}-options.csv`);
    showToast('Comparison exported as CSV', 'success');
}

// ========== HELPERS ==========

function getNestedValue(obj, path) {
    const parts = path.split('.');
    let value = obj;
    for (const part of parts) {
        if (value === undefined || value === null) return undefined;
        value = value[part];
    }
    return value;
}

function formatValue(value, format, isDiff = false) {
    if (value === undefined || value === null) return '-';

    switch (format) {
        case 'currency':
            const prefix = isDiff && value > 0 ? '+' : '';
            return prefix + formatCurrency(value);
        case 'percent':
            const pctPrefix = isDiff && value > 0 ? '+' : '';
            return pctPrefix + formatPercentage(value);
        case 'risk':
            return formatRiskLevel(value);
        case 'text':
        default:
            return String(value);
    }
}

function formatRiskLevel(level) {
    const colors = {
        'Low': 'positive',
        'Medium': 'neutral',
        'High': 'negative'
    };
    const colorClass = colors[level] || 'neutral';
    return `<span class="${colorClass}">${level}</span>`;
}

function findBestWorst(values, higherBetter) {
    const numericValues = values.filter(v => typeof v === 'number');
    if (numericValues.length === 0) return { best: null, worst: null };

    if (higherBetter === undefined) {
        return { best: null, worst: null };
    }

    const best = higherBetter ? Math.max(...numericValues) : Math.min(...numericValues);
    const worst = higherBetter ? Math.min(...numericValues) : Math.max(...numericValues);

    return { best, worst };
}

function getHighlightClass(value, best, worst, values, higherBetter) {
    if (typeof value !== 'number' || higherBetter === undefined) return '';

    // Only highlight if there are differences
    const numericValues = values.filter(v => typeof v === 'number');
    if (numericValues.length < 2) return '';

    const allSame = numericValues.every(v => v === numericValues[0]);
    if (allSame) return '';

    if (value === best) return 'highlight-best';
    if (value === worst) return 'highlight-worst';
    return '';
}

function getDiffClass(diff, higherBetter) {
    if (diff === 0) return 'neutral';
    if (higherBetter === undefined) return 'neutral';

    const isGood = higherBetter ? diff > 0 : diff < 0;
    return isGood ? 'positive' : 'negative';
}

function getDiffArrow(diff, higherBetter) {
    if (diff === 0) return '';
    if (higherBetter === undefined) return '';

    const isUp = diff > 0;
    const isGood = higherBetter ? diff > 0 : diff < 0;

    if (isUp) return isGood ? '▲' : '▲';
    return isGood ? '▼' : '▼';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ========== CLEANUP ==========

// Cleanup when module unloads
if (typeof window !== 'undefined') {
    window.addEventListener('unload', () => {
        document.removeEventListener('comparison:open', handleComparisonOpen);
    });
}

// ========== EXPORTS ==========

export default {
    initComparisonView,
    destroyComparisonView,
    showComparisonView,
    hideComparisonView,
    comparisonViewStyles
};
