// ========== COMPARISON MANAGER ==========
// Panel UI for viewing and managing saved comparison options.
// Allows users to view, load, delete, rename, and select options for comparison.

import {
    getComparisons,
    loadComparison,
    deleteComparison,
    renameComparison,
    updateComparisonNotes,
    clearAllComparisons,
    toggleComparisonSelection,
    setActiveComparisons,
    getState,
    subscribe,
    setComparisonViewOpen,
    importComparisons
} from '../../state/app-state.js';
import {
    downloadAsJSON,
    downloadAsCSV,
    importFromJSON,
    getStorageInfo
} from '../../utils/storage.js';
import { getModelMetadata, getModelVariants } from '../../models/intercompany/registry.js';
import { showToast, formatCurrency } from '../../utils/index.js';

// ========== STYLES ==========

export const comparisonManagerStyles = `
    .comparison-manager-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .comparison-manager-panel {
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 0.75rem;
        max-width: 900px;
        width: 100%;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .comparison-manager-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #374151;
        flex-shrink: 0;
    }

    .comparison-manager-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #f3f4f6;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .comparison-manager-close {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
        line-height: 1;
        transition: color 0.2s;
    }

    .comparison-manager-close:hover {
        color: #f3f4f6;
    }

    .comparison-manager-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1.5rem;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .comparison-manager-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .comparison-manager-btn {
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
    }

    .comparison-manager-btn-primary {
        background: #2563eb;
        color: white;
    }

    .comparison-manager-btn-primary:hover {
        background: #1d4ed8;
    }

    .comparison-manager-btn-primary:disabled {
        background: #374151;
        color: #6b7280;
        cursor: not-allowed;
    }

    .comparison-manager-btn-secondary {
        background: #374151;
        color: #d1d5db;
    }

    .comparison-manager-btn-secondary:hover {
        background: #4b5563;
    }

    .comparison-manager-btn-danger {
        background: #dc2626;
        color: white;
    }

    .comparison-manager-btn-danger:hover {
        background: #b91c1c;
    }

    .comparison-manager-info {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .comparison-manager-list {
        flex: 1;
        overflow-y: auto;
        padding: 1rem 1.5rem;
    }

    .comparison-manager-empty {
        text-align: center;
        padding: 3rem 1rem;
        color: #6b7280;
    }

    .comparison-manager-empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .comparison-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: #111827;
        border: 1px solid #374151;
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
        transition: all 0.2s;
    }

    .comparison-item:hover {
        border-color: #4b5563;
    }

    .comparison-item.selected {
        border-color: #2563eb;
        background: rgba(37, 99, 235, 0.1);
    }

    .comparison-item-checkbox {
        flex-shrink: 0;
        margin-top: 0.25rem;
    }

    .comparison-item-checkbox input {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: #2563eb;
        cursor: pointer;
    }

    .comparison-item-content {
        flex: 1;
        min-width: 0;
    }

    .comparison-item-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }

    .comparison-item-name {
        font-weight: 600;
        color: #f3f4f6;
        font-size: 1rem;
        word-break: break-word;
    }

    .comparison-item-name-input {
        background: #1f2937;
        border: 1px solid #4b5563;
        border-radius: 0.25rem;
        color: #f3f4f6;
        padding: 0.25rem 0.5rem;
        font-size: 1rem;
        width: 100%;
        max-width: 300px;
    }

    .comparison-item-name-input:focus {
        outline: none;
        border-color: #2563eb;
    }

    .comparison-item-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        flex-wrap: wrap;
    }

    .comparison-item-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.125rem 0.5rem;
        background: #374151;
        border-radius: 9999px;
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .comparison-item-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0.5rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid #374151;
    }

    .comparison-item-metric {
        display: flex;
        flex-direction: column;
    }

    .comparison-item-metric-label {
        font-size: 0.625rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .comparison-item-metric-value {
        font-size: 0.875rem;
        font-weight: 500;
        color: #d1d5db;
    }

    .comparison-item-metric-value.positive {
        color: #10b981;
    }

    .comparison-item-metric-value.negative {
        color: #ef4444;
    }

    .comparison-item-notes {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #9ca3af;
        font-style: italic;
    }

    .comparison-item-notes-input {
        background: #1f2937;
        border: 1px solid #4b5563;
        border-radius: 0.25rem;
        color: #d1d5db;
        padding: 0.5rem;
        font-size: 0.875rem;
        width: 100%;
        resize: vertical;
        min-height: 60px;
    }

    .comparison-item-notes-input:focus {
        outline: none;
        border-color: #2563eb;
    }

    .comparison-item-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
    }

    .comparison-item-btn {
        padding: 0.375rem 0.625rem;
        background: #374151;
        border: none;
        border-radius: 0.25rem;
        color: #d1d5db;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .comparison-item-btn:hover {
        background: #4b5563;
    }

    .comparison-item-btn.danger:hover {
        background: #dc2626;
    }

    .comparison-item-btn.primary {
        background: #2563eb;
        color: white;
    }

    .comparison-item-btn.primary:hover {
        background: #1d4ed8;
    }

    .comparison-manager-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-top: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .comparison-manager-selection-info {
        font-size: 0.875rem;
        color: #9ca3af;
    }

    .comparison-manager-selection-info strong {
        color: #2563eb;
    }

    /* Confirm dialog */
    .confirm-dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 60;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .confirm-dialog {
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 0.5rem;
        padding: 1.5rem;
        max-width: 400px;
        width: 100%;
    }

    .confirm-dialog-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #f3f4f6;
        margin-bottom: 0.5rem;
    }

    .confirm-dialog-message {
        color: #9ca3af;
        margin-bottom: 1.5rem;
    }

    .confirm-dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
    }

    /* File input for import */
    .import-file-input {
        display: none;
    }
`;

// ========== COMPONENT STATE ==========

let containerElement = null;
let unsubscriber = null;
let editingId = null;  // ID of comparison being edited (name/notes)

// ========== INITIALIZATION ==========

/**
 * Initialize the comparison manager panel
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 */
export function initComparisonManager(container, options = {}) {
    containerElement = container;

    // Render the panel
    render();

    // Subscribe to state changes
    unsubscriber = subscribe((newState, oldState) => {
        // Re-render on comparison changes
        if (JSON.stringify(newState.savedComparisons) !== JSON.stringify(oldState?.savedComparisons) ||
            JSON.stringify(newState.ui.activeComparisonIds) !== JSON.stringify(oldState?.ui?.activeComparisonIds)) {
            render();
        }
    });

    // Set up event listeners
    setupEventListeners();
}

/**
 * Destroy the comparison manager
 */
export function destroyComparisonManager() {
    if (unsubscriber) {
        unsubscriber();
        unsubscriber = null;
    }

    if (containerElement) {
        containerElement.innerHTML = '';
        containerElement = null;
    }

    editingId = null;
}

/**
 * Show the comparison manager panel
 */
export function showComparisonManager() {
    if (!containerElement) return;
    containerElement.classList.remove('hidden');
    setComparisonViewOpen(true);
}

/**
 * Hide the comparison manager panel
 */
export function hideComparisonManager() {
    if (!containerElement) return;
    containerElement.classList.add('hidden');
    setComparisonViewOpen(false);
    editingId = null;
}

// ========== RENDER ==========

function render() {
    if (!containerElement) return;

    const comparisons = getComparisons();
    const state = getState();
    const activeIds = state.ui.activeComparisonIds || [];
    const storageInfo = getStorageInfo();

    containerElement.innerHTML = `
        <style>${comparisonManagerStyles}</style>
        <div class="comparison-manager-overlay" id="comparisonManagerOverlay">
            <div class="comparison-manager-panel">
                <!-- Header -->
                <div class="comparison-manager-header">
                    <h2 class="comparison-manager-title">
                        <span>📋</span> Saved Options
                    </h2>
                    <button class="comparison-manager-close" id="closeComparisonManager" title="Close">&times;</button>
                </div>

                <!-- Toolbar -->
                <div class="comparison-manager-toolbar">
                    <div class="comparison-manager-actions">
                        <button class="comparison-manager-btn comparison-manager-btn-secondary" id="exportJSONBtn" ${comparisons.length === 0 ? 'disabled' : ''}>
                            <span>📥</span> Export JSON
                        </button>
                        <button class="comparison-manager-btn comparison-manager-btn-secondary" id="exportCSVBtn" ${comparisons.length === 0 ? 'disabled' : ''}>
                            <span>📊</span> Export CSV
                        </button>
                        <button class="comparison-manager-btn comparison-manager-btn-secondary" id="importBtn">
                            <span>📤</span> Import
                        </button>
                        <input type="file" accept=".json" class="import-file-input" id="importFileInput">
                        ${comparisons.length > 0 ? `
                            <button class="comparison-manager-btn comparison-manager-btn-danger" id="clearAllBtn">
                                <span>🗑️</span> Clear All
                            </button>
                        ` : ''}
                    </div>
                    <div class="comparison-manager-info">
                        ${comparisons.length} / ${storageInfo.maxComparisons} options saved (${storageInfo.sizeKB} KB)
                    </div>
                </div>

                <!-- List -->
                <div class="comparison-manager-list">
                    ${comparisons.length === 0 ? renderEmptyState() : renderComparisonList(comparisons, activeIds)}
                </div>

                <!-- Footer -->
                <div class="comparison-manager-footer">
                    <div class="comparison-manager-selection-info">
                        ${activeIds.length > 0 ?
                            `<strong>${activeIds.length}</strong> option${activeIds.length !== 1 ? 's' : ''} selected for comparison` :
                            'Select 2-4 options to compare side-by-side'}
                    </div>
                    <div class="comparison-manager-actions">
                        <button class="comparison-manager-btn comparison-manager-btn-secondary" id="selectAllBtn" ${comparisons.length === 0 ? 'disabled' : ''}>
                            ${activeIds.length === comparisons.length && comparisons.length > 0 ? 'Deselect All' : 'Select All'}
                        </button>
                        <button class="comparison-manager-btn comparison-manager-btn-secondary" id="whatChangedBtn" ${activeIds.length !== 2 ? 'disabled' : ''} title="Compare exactly 2 options to see what changed">
                            <span>🔄</span> What Changed?
                        </button>
                        <button class="comparison-manager-btn comparison-manager-btn-primary" id="compareSelectedBtn" ${activeIds.length < 2 ? 'disabled' : ''}>
                            <span>⚖️</span> Compare Selected (${activeIds.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderEmptyState() {
    return `
        <div class="comparison-manager-empty">
            <div class="comparison-manager-empty-icon">📭</div>
            <h3 style="color: #d1d5db; margin-bottom: 0.5rem;">No saved options yet</h3>
            <p>Run a calculation and click "Save as Option" to save it here for comparison.</p>
        </div>
    `;
}

function renderComparisonList(comparisons, activeIds) {
    return comparisons.map(comp => renderComparisonItem(comp, activeIds.includes(comp.id))).join('');
}

function renderComparisonItem(comp, isSelected) {
    const modelMeta = getModelMetadata(comp.modelId);
    const variants = getModelVariants(comp.modelId);
    const variantMeta = variants?.find(v => v.id === comp.variantId);

    // Extract key metrics
    const dev = comp.results?.developer || {};
    const buyer = comp.results?.buyer || {};
    const combined = comp.results?.combined || {};

    const isEditing = editingId === comp.id;

    return `
        <div class="comparison-item ${isSelected ? 'selected' : ''}" data-comparison-id="${comp.id}">
            <div class="comparison-item-checkbox">
                <input type="checkbox"
                       id="compare-check-${comp.id}"
                       ${isSelected ? 'checked' : ''}
                       data-action="toggle-selection"
                       data-id="${comp.id}">
            </div>
            <div class="comparison-item-content">
                <div class="comparison-item-header">
                    <div>
                        ${isEditing ? `
                            <input type="text"
                                   class="comparison-item-name-input"
                                   id="edit-name-${comp.id}"
                                   value="${escapeHtml(comp.name)}"
                                   data-action="edit-name"
                                   data-id="${comp.id}">
                        ` : `
                            <div class="comparison-item-name">${escapeHtml(comp.name)}</div>
                        `}
                        <div class="comparison-item-meta">
                            <span class="comparison-item-badge">
                                ${modelMeta?.icon || '📦'} ${modelMeta?.shortName || comp.modelId}
                            </span>
                            <span class="comparison-item-badge">
                                ${variantMeta ? `${variantMeta.id}` : comp.variantId}
                            </span>
                            <span class="comparison-item-badge">
                                🕐 ${formatTimestamp(comp.timestamp)}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Key Metrics Summary -->
                <div class="comparison-item-summary">
                    <div class="comparison-item-metric">
                        <span class="comparison-item-metric-label">Dev Revenue</span>
                        <span class="comparison-item-metric-value">${formatCurrency(dev.revenue?.total || 0)}</span>
                    </div>
                    <div class="comparison-item-metric">
                        <span class="comparison-item-metric-label">Dev Profit</span>
                        <span class="comparison-item-metric-value ${(dev.profit?.net || 0) >= 0 ? 'positive' : 'negative'}">
                            ${formatCurrency(dev.profit?.net || 0)}
                        </span>
                    </div>
                    <div class="comparison-item-metric">
                        <span class="comparison-item-metric-label">Buyer Cost</span>
                        <span class="comparison-item-metric-value">${formatCurrency(buyer.totalCost || 0)}</span>
                    </div>
                    <div class="comparison-item-metric">
                        <span class="comparison-item-metric-label">Combined Net</span>
                        <span class="comparison-item-metric-value ${(combined.cashFlow?.netCashFlow || 0) >= 0 ? 'positive' : 'negative'}">
                            ${formatCurrency(combined.cashFlow?.netCashFlow || 0)}
                        </span>
                    </div>
                </div>

                <!-- Notes -->
                ${isEditing ? `
                    <textarea class="comparison-item-notes-input"
                              id="edit-notes-${comp.id}"
                              placeholder="Add notes..."
                              data-action="edit-notes"
                              data-id="${comp.id}">${escapeHtml(comp.notes || '')}</textarea>
                ` : (comp.notes ? `
                    <div class="comparison-item-notes">"${escapeHtml(comp.notes)}"</div>
                ` : '')}
            </div>

            <div class="comparison-item-actions">
                ${isEditing ? `
                    <button class="comparison-item-btn primary" data-action="save-edit" data-id="${comp.id}" title="Save changes">
                        ✓ Save
                    </button>
                    <button class="comparison-item-btn" data-action="cancel-edit" data-id="${comp.id}" title="Cancel">
                        ✗
                    </button>
                ` : `
                    <button class="comparison-item-btn" data-action="load" data-id="${comp.id}" title="Load this option">
                        <span>📂</span> Load
                    </button>
                    <button class="comparison-item-btn" data-action="edit" data-id="${comp.id}" title="Edit name/notes">
                        <span>✏️</span>
                    </button>
                    <button class="comparison-item-btn danger" data-action="delete" data-id="${comp.id}" title="Delete">
                        <span>🗑️</span>
                    </button>
                `}
            </div>
        </div>
    `;
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

    // Close button or overlay click
    if (target.id === 'closeComparisonManager' || target.id === 'comparisonManagerOverlay') {
        if (target.id === 'comparisonManagerOverlay' && e.target !== e.currentTarget) return;
        hideComparisonManager();
        return;
    }

    // Action buttons
    const actionBtn = target.closest('[data-action]');
    if (actionBtn) {
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;

        switch (action) {
            case 'toggle-selection':
                // Handled by change event
                break;
            case 'load':
                handleLoad(id);
                break;
            case 'edit':
                handleEdit(id);
                break;
            case 'save-edit':
                handleSaveEdit(id);
                break;
            case 'cancel-edit':
                handleCancelEdit();
                break;
            case 'delete':
                handleDelete(id);
                break;
        }
        return;
    }

    // Toolbar buttons
    if (target.closest('#exportJSONBtn')) {
        handleExportJSON();
        return;
    }
    if (target.closest('#exportCSVBtn')) {
        handleExportCSV();
        return;
    }
    if (target.closest('#importBtn')) {
        handleImportClick();
        return;
    }
    if (target.closest('#clearAllBtn')) {
        handleClearAll();
        return;
    }

    // Footer buttons
    if (target.closest('#selectAllBtn')) {
        handleSelectAll();
        return;
    }
    if (target.closest('#compareSelectedBtn')) {
        handleCompareSelected();
        return;
    }
    if (target.closest('#whatChangedBtn')) {
        handleWhatChanged();
        return;
    }

    // Confirm dialog actions
    if (target.closest('#confirmDialogYes')) {
        executeConfirmAction();
        return;
    }
    if (target.closest('#confirmDialogNo')) {
        hideConfirmDialog();
        return;
    }
}

function handleChange(e) {
    const target = e.target;

    // Checkbox toggle
    if (target.type === 'checkbox' && target.dataset.action === 'toggle-selection') {
        const id = target.dataset.id;
        toggleComparisonSelection(id);
        return;
    }

    // Import file input
    if (target.id === 'importFileInput') {
        handleFileImport(target.files);
        return;
    }
}

function handleKeydown(e) {
    // Escape to close
    if (e.key === 'Escape') {
        if (editingId) {
            handleCancelEdit();
        } else {
            hideComparisonManager();
        }
        return;
    }

    // Enter to save when editing
    if (e.key === 'Enter' && editingId && !e.target.matches('textarea')) {
        e.preventDefault();
        handleSaveEdit(editingId);
        return;
    }
}

// ========== ACTION HANDLERS ==========

function handleLoad(id) {
    const comparison = loadComparison(id);
    if (comparison) {
        showToast(`Loaded "${comparison.name}"`, 'success');
        hideComparisonManager();
    } else {
        showToast('Failed to load option', 'error');
    }
}

function handleEdit(id) {
    editingId = id;
    render();

    // Focus on name input
    setTimeout(() => {
        const nameInput = containerElement?.querySelector(`#edit-name-${id}`);
        if (nameInput) {
            nameInput.focus();
            nameInput.select();
        }
    }, 10);
}

function handleSaveEdit(id) {
    const nameInput = containerElement?.querySelector(`#edit-name-${id}`);
    const notesInput = containerElement?.querySelector(`#edit-notes-${id}`);

    const newName = nameInput?.value.trim();
    const newNotes = notesInput?.value.trim() || '';

    if (!newName) {
        showToast('Name cannot be empty', 'warning');
        nameInput?.focus();
        return;
    }

    renameComparison(id, newName);
    updateComparisonNotes(id, newNotes);

    editingId = null;
    render();
    showToast('Changes saved', 'success');
}

function handleCancelEdit() {
    editingId = null;
    render();
}

function handleDelete(id) {
    const comp = getComparisons().find(c => c.id === id);
    if (!comp) return;

    showConfirmDialog(
        'Delete Option',
        `Are you sure you want to delete "${comp.name}"? This cannot be undone.`,
        () => {
            deleteComparison(id);
            showToast('Option deleted', 'success');
        }
    );
}

function handleExportJSON() {
    const comparisons = getComparisons();
    if (comparisons.length === 0) return;

    downloadAsJSON(comparisons);
    showToast(`Exported ${comparisons.length} option${comparisons.length !== 1 ? 's' : ''} as JSON`, 'success');
}

function handleExportCSV() {
    const comparisons = getComparisons();
    if (comparisons.length === 0) return;

    downloadAsCSV(comparisons);
    showToast(`Exported ${comparisons.length} option${comparisons.length !== 1 ? 's' : ''} as CSV`, 'success');
}

function handleImportClick() {
    const fileInput = containerElement?.querySelector('#importFileInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleFileImport(files) {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const result = importFromJSON(e.target.result);

        if (result.success) {
            const count = importComparisons(result.comparisons, 'merge');
            showToast(`Imported ${result.count} option${result.count !== 1 ? 's' : ''} (${count} total now)`, 'success');
            render();
        } else {
            showToast(`Import failed: ${result.error}`, 'error');
        }
    };

    reader.onerror = () => {
        showToast('Failed to read file', 'error');
    };

    reader.readAsText(file);

    // Reset file input
    const fileInput = containerElement?.querySelector('#importFileInput');
    if (fileInput) fileInput.value = '';
}

function handleClearAll() {
    const count = getComparisons().length;
    if (count === 0) return;

    showConfirmDialog(
        'Clear All Options',
        `Are you sure you want to delete all ${count} saved option${count !== 1 ? 's' : ''}? This cannot be undone.`,
        () => {
            clearAllComparisons();
            showToast('All options cleared', 'success');
        }
    );
}

function handleSelectAll() {
    const comparisons = getComparisons();
    const state = getState();
    const activeIds = state.ui.activeComparisonIds || [];

    if (activeIds.length === comparisons.length && comparisons.length > 0) {
        // Deselect all
        setActiveComparisons([]);
    } else {
        // Select all (max 4)
        const idsToSelect = comparisons.slice(0, 4).map(c => c.id);
        setActiveComparisons(idsToSelect);
    }
}

function handleCompareSelected() {
    const state = getState();
    const activeIds = state.ui.activeComparisonIds || [];

    if (activeIds.length < 2) {
        showToast('Select at least 2 options to compare', 'warning');
        return;
    }

    // Dispatch custom event for comparison view
    const event = new CustomEvent('comparison:open', {
        detail: { comparisonIds: activeIds }
    });
    document.dispatchEvent(event);
    hideComparisonManager();
}

function handleWhatChanged() {
    const state = getState();
    const activeIds = state.ui.activeComparisonIds || [];

    if (activeIds.length !== 2) {
        showToast('Select exactly 2 options to see what changed', 'warning');
        return;
    }

    // Dispatch custom event for diff view (first selected is "before", second is "after")
    const event = new CustomEvent('diff:open', {
        detail: {
            beforeId: activeIds[0],
            afterId: activeIds[1]
        }
    });
    document.dispatchEvent(event);
    hideComparisonManager();
}

// ========== CONFIRM DIALOG ==========

let pendingConfirmAction = null;

function showConfirmDialog(title, message, onConfirm) {
    pendingConfirmAction = onConfirm;

    const existingDialog = containerElement?.querySelector('.confirm-dialog-overlay');
    if (existingDialog) existingDialog.remove();

    const dialogHtml = `
        <div class="confirm-dialog-overlay" id="confirmDialogOverlay">
            <div class="confirm-dialog">
                <div class="confirm-dialog-title">${escapeHtml(title)}</div>
                <div class="confirm-dialog-message">${escapeHtml(message)}</div>
                <div class="confirm-dialog-actions">
                    <button class="comparison-manager-btn comparison-manager-btn-secondary" id="confirmDialogNo">Cancel</button>
                    <button class="comparison-manager-btn comparison-manager-btn-danger" id="confirmDialogYes">Delete</button>
                </div>
            </div>
        </div>
    `;

    const panel = containerElement?.querySelector('.comparison-manager-panel');
    if (panel) {
        panel.insertAdjacentHTML('afterend', dialogHtml);
    }
}

function hideConfirmDialog() {
    pendingConfirmAction = null;
    const dialog = containerElement?.querySelector('.confirm-dialog-overlay');
    if (dialog) dialog.remove();
}

function executeConfirmAction() {
    if (pendingConfirmAction) {
        pendingConfirmAction();
    }
    hideConfirmDialog();
}

// ========== HELPERS ==========

function formatTimestamp(ts) {
    const date = new Date(ts);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) {
        return 'just now';
    }

    // Less than 1 hour
    if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `${mins}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }

    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}d ago`;
    }

    // Otherwise show date
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
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
    initComparisonManager,
    destroyComparisonManager,
    showComparisonManager,
    hideComparisonManager,
    comparisonManagerStyles
};
