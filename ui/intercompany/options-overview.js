// ========== OPTIONS OVERVIEW COMPONENT ==========
// Landing view showing all 6 transaction models at a glance.
// Helps users understand and compare options before diving into details.
//
// Purpose: Address the gap where users have to "pick a model" before seeing alternatives.
// This view shows everything at once so users can make informed decisions.

import { getModelMetadata, getModelComparisonData } from '../../models/intercompany/registry.js';

// ========== STYLES ==========

export const optionsOverviewStyles = `
    .options-overview {
        max-width: 1400px;
        margin: 0 auto;
    }

    .options-overview-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .options-overview-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #f3f4f6;
        margin-bottom: 0.5rem;
    }

    .options-overview-header p {
        color: #9ca3af;
        font-size: 0.95rem;
    }

    .model-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    @media (min-width: 1200px) {
        .model-cards-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .model-cards-grid {
            grid-template-columns: 1fr;
        }
    }

    .model-overview-card {
        background: #1f2937;
        border: 2px solid #374151;
        border-radius: 0.75rem;
        padding: 1.5rem;
        transition: all 0.2s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
    }

    .model-overview-card:hover {
        border-color: #3b82f6;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }

    .model-card-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .model-card-icon {
        font-size: 2.5rem;
        line-height: 1;
    }

    .model-card-title {
        flex: 1;
    }

    .model-card-title h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #f3f4f6;
        margin: 0 0 0.25rem 0;
    }

    .model-card-variants {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .model-card-summary {
        color: #d1d5db;
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1rem;
        flex-grow: 1;
    }

    .model-card-features {
        margin-bottom: 1rem;
    }

    .model-card-features h4 {
        font-size: 0.75rem;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }

    .model-card-features ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .model-card-features li {
        font-size: 0.8rem;
        color: #9ca3af;
        padding: 0.25rem 0;
        padding-left: 1.25rem;
        position: relative;
    }

    .model-card-features li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #10b981;
        font-weight: bold;
    }

    .model-card-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #374151;
    }

    .model-meta-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        background: #374151;
        border-radius: 0.375rem;
        font-size: 0.7rem;
        color: #d1d5db;
    }

    .model-meta-badge.ip-developer {
        background: #1e3a5f;
        color: #93c5fd;
    }

    .model-meta-badge.ip-buyer {
        background: #1f4d3a;
        color: #86efac;
    }

    .model-meta-badge.ip-shared {
        background: #4c1d95;
        color: #c4b5fd;
    }

    .model-card-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: auto;
    }

    .model-explore-btn {
        flex: 1;
        padding: 0.75rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .model-explore-btn:hover {
        background: #2563eb;
    }

    /* Best For tags */
    .best-for-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        margin-bottom: 1rem;
    }

    .best-for-tag {
        padding: 0.2rem 0.5rem;
        background: #374151;
        border-radius: 9999px;
        font-size: 0.65rem;
        color: #9ca3af;
        border: 1px solid #4b5563;
    }

    /* Quick Comparison Table */
    .comparison-table-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #374151;
    }

    .comparison-table-section h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #f3f4f6;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .comparison-table-wrapper {
        overflow-x: auto;
    }

    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8rem;
    }

    .comparison-table th,
    .comparison-table td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid #374151;
    }

    .comparison-table th {
        background: #1f2937;
        color: #9ca3af;
        font-weight: 600;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .comparison-table td {
        color: #d1d5db;
    }

    .comparison-table tr:hover td {
        background: #1f2937;
    }

    .comparison-table .model-name-cell {
        font-weight: 500;
        color: #f3f4f6;
        white-space: nowrap;
    }

    /* Wizard link */
    .wizard-link-section {
        text-align: center;
        margin-top: 2rem;
        padding: 1.5rem;
        background: #1f2937;
        border-radius: 0.75rem;
        border: 1px dashed #4b5563;
    }

    .wizard-link-section p {
        color: #9ca3af;
        margin-bottom: 0.75rem;
    }

    .wizard-link-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: transparent;
        color: #60a5fa;
        border: 1px solid #3b82f6;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .wizard-link-btn:hover {
        background: #3b82f6;
        color: white;
    }
`;

// ========== COMPONENT ==========

/**
 * Initialize the options overview component
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} options - Configuration options
 * @param {Function} options.onModelSelect - Callback when a model is selected (modelId)
 * @param {Function} options.onWizardClick - Callback when wizard link is clicked
 */
export function initOptionsOverview(container, options = {}) {
    if (!container) {
        console.warn('Options overview container not found');
        return;
    }

    const { onModelSelect, onWizardClick } = options;

    // Render the overview
    container.innerHTML = renderOptionsOverview();

    // Add event listeners
    setupOverviewEventListeners(container, { onModelSelect, onWizardClick });
}

/**
 * Render the complete options overview HTML
 */
function renderOptionsOverview() {
    const models = getModelMetadata();
    const comparisonData = getModelComparisonData();

    return `
        <div class="options-overview">
            ${renderHeader()}
            ${renderModelCards(models)}
            ${renderComparisonTable(comparisonData)}
            ${renderWizardLink()}
        </div>
    `;
}

/**
 * Render the header section
 */
function renderHeader() {
    return `
        <div class="options-overview-header">
            <h2>Which structure creates the best outcome?</h2>
            <p>Compare models to find the deal that maximizes value for both you and your client.</p>
        </div>
    `;
}

/**
 * Render the model cards grid
 */
function renderModelCards(models) {
    return `
        <div class="model-cards-grid">
            ${models.map(model => renderModelCard(model)).join('')}
        </div>
    `;
}

/**
 * Render a single model card
 */
function renderModelCard(model) {
    const ipBadgeClass = getIPBadgeClass(model.ipOwnership);

    return `
        <div class="model-overview-card" data-model-id="${model.id}">
            <div class="model-card-header">
                <span class="model-card-icon">${model.icon}</span>
                <div class="model-card-title">
                    <h3>${model.shortName || model.name}</h3>
                    <span class="model-card-variants">${model.variantCount} variants</span>
                </div>
            </div>

            <p class="model-card-summary">${model.summary}</p>

            <div class="model-card-features">
                <h4>Key Features</h4>
                <ul>
                    ${model.keyFeatures.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>

            <div class="best-for-tags">
                ${model.bestFor.slice(0, 3).map(tag => `<span class="best-for-tag">${tag}</span>`).join('')}
            </div>

            <div class="model-card-meta">
                <span class="model-meta-badge ${ipBadgeClass}">
                    IP: ${model.ipOwnership}
                </span>
                <span class="model-meta-badge">
                    ${model.paymentType}
                </span>
            </div>

            <div class="model-card-actions">
                <button class="model-explore-btn" data-model-id="${model.id}">
                    Select Model <span>→</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * Get CSS class for IP ownership badge
 */
function getIPBadgeClass(ipOwnership) {
    if (ipOwnership.toLowerCase().includes('developer')) {
        return 'ip-developer';
    }
    if (ipOwnership.toLowerCase().includes('buyer')) {
        return 'ip-buyer';
    }
    if (ipOwnership.toLowerCase().includes('shared')) {
        return 'ip-shared';
    }
    return '';
}

/**
 * Render the quick comparison table
 */
function renderComparisonTable(comparisonData) {
    return `
        <div class="comparison-table-section">
            <h3><span>📊</span> Quick Comparison</h3>
            <div class="comparison-table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>IP Owner</th>
                            <th>Payment</th>
                            <th>Buyer Asset?</th>
                            <th>Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparisonData.map(row => `
                            <tr data-model-id="${row.id}">
                                <td class="model-name-cell">${row.shortName}</td>
                                <td>${row.ipOwnership}</td>
                                <td>${row.paymentType}</td>
                                <td>${row.buyerAsset}</td>
                                <td>${row.riskDirection}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Render the wizard link section
 */
function renderWizardLink() {
    return `
        <div class="wizard-link-section">
            <p>Not sure which model fits best?</p>
            <button class="wizard-link-btn" id="useWizardBtn">
                <span>✨</span> Use the guided wizard
            </button>
        </div>
    `;
}

/**
 * Set up event listeners for the overview
 */
function setupOverviewEventListeners(container, { onModelSelect, onWizardClick }) {
    // Handle card clicks
    container.addEventListener('click', (e) => {
        // Model card or explore button click
        const card = e.target.closest('.model-overview-card');
        const exploreBtn = e.target.closest('.model-explore-btn');

        if (exploreBtn || card) {
            const modelId = exploreBtn?.dataset.modelId || card?.dataset.modelId;
            if (modelId && onModelSelect) {
                e.preventDefault();
                e.stopPropagation();
                onModelSelect(modelId);
            }
            return;
        }

        // Comparison table row click
        const tableRow = e.target.closest('.comparison-table tbody tr');
        if (tableRow) {
            const modelId = tableRow.dataset.modelId;
            if (modelId && onModelSelect) {
                onModelSelect(modelId);
            }
            return;
        }

        // Wizard button click
        const wizardBtn = e.target.closest('#useWizardBtn');
        if (wizardBtn && onWizardClick) {
            onWizardClick();
            return;
        }
    });
}

/**
 * Destroy the options overview component
 * Cleans up event listeners if needed
 */
export function destroyOptionsOverview(container) {
    if (container) {
        container.innerHTML = '';
    }
}

// ========== EXPORTS ==========

export default {
    initOptionsOverview,
    destroyOptionsOverview,
    optionsOverviewStyles
};
