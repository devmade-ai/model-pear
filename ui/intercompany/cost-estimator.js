// ========== COST ESTIMATION HELPER ==========
// Simple hours × rate calculator to help users estimate development costs.
// Provides phase breakdown and can populate calculator inputs.

import { showToast } from '../../utils/index.js';

// ========== STYLES ==========

export const costEstimatorStyles = `
    .cost-estimator-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .cost-estimator-panel {
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 0.75rem;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .cost-estimator-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #374151;
    }

    .cost-estimator-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #f3f4f6;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .cost-estimator-close {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
        line-height: 1;
        transition: color 0.2s;
    }

    .cost-estimator-close:hover {
        color: #f3f4f6;
    }

    .cost-estimator-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
    }

    .cost-estimator-section {
        margin-bottom: 1.5rem;
    }

    .cost-estimator-section-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .cost-estimator-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        margin-bottom: 0.75rem;
        align-items: end;
    }

    .cost-estimator-row.two-col {
        grid-template-columns: 1fr 1fr;
    }

    .cost-estimator-field {
        display: flex;
        flex-direction: column;
    }

    .cost-estimator-label {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-bottom: 0.25rem;
    }

    .cost-estimator-input {
        background: #111827;
        border: 1px solid #374151;
        border-radius: 0.375rem;
        color: #f3f4f6;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        width: 100%;
        transition: border-color 0.2s;
    }

    .cost-estimator-input:focus {
        outline: none;
        border-color: #2563eb;
    }

    .cost-estimator-input::placeholder {
        color: #6b7280;
    }

    .cost-estimator-input:disabled {
        background: #1f2937;
        color: #9ca3af;
        cursor: not-allowed;
    }

    .cost-estimator-result {
        background: #111827;
        border: 1px solid #374151;
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        color: #10b981;
        font-weight: 600;
        font-family: 'Monaco', 'Menlo', monospace;
        text-align: right;
    }

    .cost-estimator-phases {
        background: #111827;
        border: 1px solid #374151;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .cost-estimator-phase {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1.5fr;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #374151;
        align-items: center;
    }

    .cost-estimator-phase:last-child {
        border-bottom: none;
    }

    .cost-estimator-phase-header {
        background: #1f2937;
        font-weight: 600;
        font-size: 0.75rem;
        color: #9ca3af;
        text-transform: uppercase;
    }

    .cost-estimator-phase-name {
        color: #d1d5db;
        font-size: 0.875rem;
    }

    .cost-estimator-phase-input {
        background: transparent;
        border: 1px solid #374151;
        border-radius: 0.25rem;
        color: #f3f4f6;
        padding: 0.375rem 0.5rem;
        font-size: 0.875rem;
        width: 100%;
        text-align: right;
    }

    .cost-estimator-phase-input:focus {
        outline: none;
        border-color: #2563eb;
    }

    .cost-estimator-phase-total {
        color: #60a5fa;
        font-weight: 500;
        text-align: right;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.875rem;
    }

    .cost-estimator-summary {
        background: linear-gradient(135deg, #1e3a5f 0%, #1f2937 100%);
        border: 1px solid #2563eb;
        border-radius: 0.5rem;
        padding: 1.25rem;
        margin-top: 1rem;
    }

    .cost-estimator-summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .cost-estimator-summary-row:last-child {
        margin-bottom: 0;
        padding-top: 0.75rem;
        border-top: 1px solid #374151;
    }

    .cost-estimator-summary-label {
        color: #9ca3af;
        font-size: 0.875rem;
    }

    .cost-estimator-summary-value {
        color: #f3f4f6;
        font-weight: 600;
        font-family: 'Monaco', 'Menlo', monospace;
    }

    .cost-estimator-summary-total {
        color: #10b981;
        font-size: 1.25rem;
    }

    .cost-estimator-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-top: 1px solid #374151;
        background: #111827;
        gap: 1rem;
    }

    .cost-estimator-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s;
        cursor: pointer;
        border: none;
    }

    .cost-estimator-btn-primary {
        background: #2563eb;
        color: white;
    }

    .cost-estimator-btn-primary:hover {
        background: #1d4ed8;
    }

    .cost-estimator-btn-primary:disabled {
        background: #374151;
        color: #6b7280;
        cursor: not-allowed;
    }

    .cost-estimator-btn-secondary {
        background: #374151;
        color: #d1d5db;
    }

    .cost-estimator-btn-secondary:hover {
        background: #4b5563;
    }

    .cost-estimator-tip {
        font-size: 0.75rem;
        color: #6b7280;
        font-style: italic;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 0.75rem;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 0.375rem;
        margin-top: 1rem;
    }

    .cost-estimator-tip-icon {
        flex-shrink: 0;
    }

    /* Responsive */
    @media (max-width: 640px) {
        .cost-estimator-row {
            grid-template-columns: 1fr;
        }

        .cost-estimator-row.two-col {
            grid-template-columns: 1fr;
        }

        .cost-estimator-phase {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }

        .cost-estimator-phase-header {
            grid-column: span 2;
        }
    }
`;

// ========== COMPONENT STATE ==========

let containerElement = null;
let isVisible = false;
let onUseCallback = null;

// Default phases for software development
const DEFAULT_PHASES = [
    { id: 'discovery', name: 'Discovery & Planning', hours: 40, defaultPct: 10 },
    { id: 'design', name: 'Design & Architecture', hours: 80, defaultPct: 15 },
    { id: 'development', name: 'Development', hours: 320, defaultPct: 50 },
    { id: 'testing', name: 'Testing & QA', hours: 120, defaultPct: 15 },
    { id: 'deployment', name: 'Deployment & Documentation', hours: 40, defaultPct: 10 }
];

// State for calculations
let estimatorState = {
    hourlyRate: 850,  // Default ZAR hourly rate
    phases: DEFAULT_PHASES.map(p => ({ ...p })),
    contingencyPct: 10,
    currency: 'ZAR'
};

// ========== INITIALIZATION ==========

/**
 * Initialize the cost estimator component
 * @param {HTMLElement} container - Container element for the modal
 * @param {Object} options - Configuration options
 * @param {Function} options.onUse - Callback when user clicks "Use this estimate"
 */
export function initCostEstimator(container, options = {}) {
    containerElement = container;
    onUseCallback = options.onUse || null;

    // Reset state
    estimatorState = {
        hourlyRate: 850,
        phases: DEFAULT_PHASES.map(p => ({ ...p })),
        contingencyPct: 10,
        currency: 'ZAR'
    };

    // Initial render (hidden)
    render();
    setupEventListeners();
}

/**
 * Destroy the cost estimator
 */
export function destroyCostEstimator() {
    if (containerElement) {
        containerElement.innerHTML = '';
        containerElement = null;
    }
    isVisible = false;
    onUseCallback = null;
}

/**
 * Show the cost estimator modal
 * @param {Object} options - Options for pre-filling values
 */
export function showCostEstimator(options = {}) {
    if (!containerElement) return;

    // Pre-fill values if provided
    if (options.hourlyRate) {
        estimatorState.hourlyRate = options.hourlyRate;
    }
    if (options.totalHours) {
        distributeHours(options.totalHours);
    }

    isVisible = true;
    render();
    containerElement.classList.remove('hidden');
}

/**
 * Hide the cost estimator modal
 */
export function hideCostEstimator() {
    if (!containerElement) return;
    isVisible = false;
    containerElement.classList.add('hidden');
}

// ========== RENDER ==========

function render() {
    if (!containerElement) return;

    const totals = calculateTotals();

    containerElement.innerHTML = `
        <style>${costEstimatorStyles}</style>
        <div class="cost-estimator-overlay ${isVisible ? '' : 'hidden'}" id="costEstimatorOverlay">
            <div class="cost-estimator-panel">
                <!-- Header -->
                <div class="cost-estimator-header">
                    <h2 class="cost-estimator-title">
                        <span>🧮</span> Cost Estimation Helper
                    </h2>
                    <button class="cost-estimator-close" id="closeCostEstimator" title="Close">&times;</button>
                </div>

                <!-- Content -->
                <div class="cost-estimator-content">
                    <!-- Quick Calculator -->
                    <div class="cost-estimator-section">
                        <div class="cost-estimator-section-title">
                            <span>⚡</span> Quick Estimate
                        </div>
                        <div class="cost-estimator-row two-col">
                            <div class="cost-estimator-field">
                                <label class="cost-estimator-label">Hourly Rate (${estimatorState.currency})</label>
                                <input type="number" class="cost-estimator-input" id="quickHourlyRate"
                                       value="${estimatorState.hourlyRate}" min="0" step="50"
                                       placeholder="e.g. 850">
                            </div>
                            <div class="cost-estimator-field">
                                <label class="cost-estimator-label">Total Hours</label>
                                <input type="number" class="cost-estimator-input" id="quickTotalHours"
                                       value="${totals.totalHours}" min="0" step="10"
                                       placeholder="e.g. 600">
                            </div>
                        </div>
                    </div>

                    <!-- Phase Breakdown -->
                    <div class="cost-estimator-section">
                        <div class="cost-estimator-section-title">
                            <span>📋</span> Phase Breakdown (Optional)
                        </div>
                        <div class="cost-estimator-phases">
                            <div class="cost-estimator-phase cost-estimator-phase-header">
                                <div>Phase</div>
                                <div style="text-align: right">Hours</div>
                                <div style="text-align: right">Rate</div>
                                <div style="text-align: right">Subtotal</div>
                            </div>
                            ${estimatorState.phases.map((phase, idx) => `
                                <div class="cost-estimator-phase">
                                    <div class="cost-estimator-phase-name">${phase.name}</div>
                                    <input type="number" class="cost-estimator-phase-input phase-hours"
                                           data-phase-idx="${idx}" value="${phase.hours}" min="0" step="10">
                                    <input type="number" class="cost-estimator-phase-input phase-rate"
                                           data-phase-idx="${idx}" value="${phase.rate || estimatorState.hourlyRate}"
                                           min="0" step="50" placeholder="${estimatorState.hourlyRate}">
                                    <div class="cost-estimator-phase-total">
                                        ${formatCurrency((phase.rate || estimatorState.hourlyRate) * phase.hours)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Contingency -->
                    <div class="cost-estimator-section">
                        <div class="cost-estimator-row two-col">
                            <div class="cost-estimator-field">
                                <label class="cost-estimator-label">Contingency %</label>
                                <input type="number" class="cost-estimator-input" id="contingencyPct"
                                       value="${estimatorState.contingencyPct}" min="0" max="50" step="5">
                            </div>
                            <div class="cost-estimator-field">
                                <label class="cost-estimator-label">Contingency Amount</label>
                                <div class="cost-estimator-result">${formatCurrency(totals.contingencyAmount)}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Summary -->
                    <div class="cost-estimator-summary">
                        <div class="cost-estimator-summary-row">
                            <span class="cost-estimator-summary-label">Total Hours</span>
                            <span class="cost-estimator-summary-value">${totals.totalHours.toLocaleString()} hrs</span>
                        </div>
                        <div class="cost-estimator-summary-row">
                            <span class="cost-estimator-summary-label">Base Cost</span>
                            <span class="cost-estimator-summary-value">${formatCurrency(totals.baseCost)}</span>
                        </div>
                        <div class="cost-estimator-summary-row">
                            <span class="cost-estimator-summary-label">Contingency (${estimatorState.contingencyPct}%)</span>
                            <span class="cost-estimator-summary-value">${formatCurrency(totals.contingencyAmount)}</span>
                        </div>
                        <div class="cost-estimator-summary-row">
                            <span class="cost-estimator-summary-label">Total Estimated Cost</span>
                            <span class="cost-estimator-summary-value cost-estimator-summary-total">
                                ${formatCurrency(totals.totalCost)}
                            </span>
                        </div>
                    </div>

                    <!-- Tip -->
                    <div class="cost-estimator-tip">
                        <span class="cost-estimator-tip-icon">💡</span>
                        <span>Click "Use Estimate" to populate the development cost field in the calculator with your estimated amount.</span>
                    </div>
                </div>

                <!-- Footer -->
                <div class="cost-estimator-footer">
                    <button class="cost-estimator-btn cost-estimator-btn-secondary" id="resetCostEstimator">
                        <span>↺</span> Reset
                    </button>
                    <div style="display: flex; gap: 0.75rem;">
                        <button class="cost-estimator-btn cost-estimator-btn-secondary" id="cancelCostEstimator">
                            Cancel
                        </button>
                        <button class="cost-estimator-btn cost-estimator-btn-primary" id="useCostEstimate">
                            <span>✓</span> Use Estimate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========== CALCULATIONS ==========

function calculateTotals() {
    let totalHours = 0;
    let baseCost = 0;

    for (const phase of estimatorState.phases) {
        const rate = phase.rate || estimatorState.hourlyRate;
        totalHours += phase.hours || 0;
        baseCost += (phase.hours || 0) * rate;
    }

    const contingencyAmount = baseCost * (estimatorState.contingencyPct / 100);
    const totalCost = baseCost + contingencyAmount;

    return {
        totalHours,
        baseCost,
        contingencyAmount,
        totalCost,
        avgHourlyRate: totalHours > 0 ? baseCost / totalHours : estimatorState.hourlyRate
    };
}

function distributeHours(totalHours) {
    // Distribute hours across phases based on default percentages
    for (const phase of estimatorState.phases) {
        const defaultPhase = DEFAULT_PHASES.find(p => p.id === phase.id);
        if (defaultPhase) {
            phase.hours = Math.round(totalHours * (defaultPhase.defaultPct / 100));
        }
    }
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerElement) return;

    containerElement.addEventListener('click', handleClick);
    containerElement.addEventListener('input', handleInput);
    containerElement.addEventListener('keydown', handleKeydown);
}

function handleClick(e) {
    const target = e.target;

    // Close button
    if (target.id === 'closeCostEstimator' || target.id === 'cancelCostEstimator') {
        hideCostEstimator();
        return;
    }

    // Overlay click to close
    if (target.id === 'costEstimatorOverlay' && target === e.target) {
        hideCostEstimator();
        return;
    }

    // Reset button
    if (target.id === 'resetCostEstimator' || target.closest('#resetCostEstimator')) {
        handleReset();
        return;
    }

    // Use estimate button
    if (target.id === 'useCostEstimate' || target.closest('#useCostEstimate')) {
        handleUseEstimate();
        return;
    }
}

function handleInput(e) {
    const target = e.target;

    // Quick hourly rate
    if (target.id === 'quickHourlyRate') {
        estimatorState.hourlyRate = parseFloat(target.value) || 0;
        render();
        return;
    }

    // Quick total hours - distribute across phases
    if (target.id === 'quickTotalHours') {
        const totalHours = parseFloat(target.value) || 0;
        distributeHours(totalHours);
        render();
        return;
    }

    // Contingency percentage
    if (target.id === 'contingencyPct') {
        estimatorState.contingencyPct = Math.min(50, Math.max(0, parseFloat(target.value) || 0));
        render();
        return;
    }

    // Phase hours
    if (target.classList.contains('phase-hours')) {
        const idx = parseInt(target.dataset.phaseIdx);
        if (!isNaN(idx) && estimatorState.phases[idx]) {
            estimatorState.phases[idx].hours = parseFloat(target.value) || 0;
            render();
        }
        return;
    }

    // Phase rate
    if (target.classList.contains('phase-rate')) {
        const idx = parseInt(target.dataset.phaseIdx);
        if (!isNaN(idx) && estimatorState.phases[idx]) {
            estimatorState.phases[idx].rate = parseFloat(target.value) || null;
            render();
        }
        return;
    }
}

function handleKeydown(e) {
    if (e.key === 'Escape') {
        hideCostEstimator();
    }
}

function handleReset() {
    estimatorState = {
        hourlyRate: 850,
        phases: DEFAULT_PHASES.map(p => ({ ...p })),
        contingencyPct: 10,
        currency: 'ZAR'
    };
    render();
    showToast('Estimate reset to defaults', 'info');
}

function handleUseEstimate() {
    const totals = calculateTotals();

    if (onUseCallback) {
        onUseCallback({
            totalCost: totals.totalCost,
            baseCost: totals.baseCost,
            totalHours: totals.totalHours,
            hourlyRate: totals.avgHourlyRate,
            contingencyPct: estimatorState.contingencyPct,
            phases: estimatorState.phases.map(p => ({
                name: p.name,
                hours: p.hours,
                rate: p.rate || estimatorState.hourlyRate,
                cost: (p.rate || estimatorState.hourlyRate) * p.hours
            }))
        });
    }

    // Dispatch event for calculator to listen to
    const event = new CustomEvent('costEstimate:use', {
        detail: {
            totalCost: totals.totalCost,
            totalHours: totals.totalHours,
            hourlyRate: totals.avgHourlyRate
        }
    });
    document.dispatchEvent(event);

    showToast(`Estimate of ${formatCurrency(totals.totalCost)} ready to use`, 'success');
    hideCostEstimator();
}

// ========== EXPORTS ==========

export default {
    initCostEstimator,
    destroyCostEstimator,
    showCostEstimator,
    hideCostEstimator,
    costEstimatorStyles
};
