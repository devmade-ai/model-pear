// ========== PARTY RELATIONSHIP SELECTOR ==========
// Prominent UI component for selecting party relationship type.
// Determines whether we show 2 perspectives (Independent) or 3 perspectives (Related).
//
// Independent Parties: Developer + Buyer (no common ownership)
// Related Parties: Developer + Buyer + Shareholder (mutual ownership)

import { getState, updateEntityConfig, subscribe } from '../../state/app-state.js';

// ========== RELATIONSHIP TYPES ==========

export const RELATIONSHIP_TYPES = {
    independent: {
        id: 'independent',
        name: 'Independent Parties',
        icon: '🤝',
        description: 'Developer & Buyer are unrelated',
        details: [
            'Standard arm\'s length transaction',
            'No common ownership',
            '2 perspectives: Your Company, Client'
        ],
        perspectiveCount: 2,
        color: 'blue'
    },
    related: {
        id: 'related',
        name: 'Related Parties',
        icon: '🔗',
        description: 'Mutual ownership between entities',
        details: [
            'You hold shares in BOTH entities',
            'Transfer pricing rules apply',
            '3 perspectives: Your Company, Client, Shareholder'
        ],
        perspectiveCount: 3,
        color: 'purple'
    }
};

// ========== COMPONENT STATE ==========

let currentContainer = null;
let boundClickHandler = null;
let unsubscribe = null;

// ========== RENDER FUNCTION ==========

/**
 * Render the party relationship selector component
 * @param {HTMLElement} container - Container element to render into
 */
export function renderPartySelector(container) {
    if (!container) return;

    const state = getState();
    const isRelated = state.entities?.relationship?.relatedParties === true;
    const currentType = isRelated ? 'related' : 'independent';

    container.innerHTML = `
        <div class="party-selector">
            <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">👥</span>
                <div>
                    <h3 class="text-lg font-semibold text-gray-100">Who are the parties?</h3>
                    <p class="text-sm text-gray-400">This determines the perspectives available in your analysis</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${Object.values(RELATIONSHIP_TYPES).map(type => `
                    <button
                        class="party-type-btn text-left p-5 rounded-xl border-2 transition-all duration-200
                               ${currentType === type.id
                                   ? `bg-${type.color}-600/20 border-${type.color}-500 ring-2 ring-${type.color}-500/30`
                                   : 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'}"
                        data-type="${type.id}"
                        aria-pressed="${currentType === type.id}"
                        aria-label="Select ${type.name}"
                    >
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-3xl">${type.icon}</span>
                            <div>
                                <span class="font-semibold text-lg ${currentType === type.id ? `text-${type.color}-300` : 'text-gray-200'}">${type.name}</span>
                                <p class="text-sm ${currentType === type.id ? `text-${type.color}-400` : 'text-gray-400'}">${type.description}</p>
                            </div>
                        </div>

                        <ul class="space-y-1.5 ml-12 mt-3">
                            ${type.details.map(detail => `
                                <li class="flex items-start gap-2 text-sm ${currentType === type.id ? 'text-gray-300' : 'text-gray-500'}">
                                    <span class="text-${type.color}-400 mt-0.5">→</span>
                                    <span>${detail}</span>
                                </li>
                            `).join('')}
                        </ul>

                        <div class="mt-4 ml-12 flex items-center gap-2 text-sm ${currentType === type.id ? `text-${type.color}-300` : 'text-gray-500'}">
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-${type.color}-600/30 text-xs font-bold">
                                ${type.perspectiveCount}
                            </span>
                            <span>perspective${type.perspectiveCount > 1 ? 's' : ''} available</span>
                        </div>

                        ${currentType === type.id ? `
                            <div class="absolute top-3 right-3">
                                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-${type.color}-500 text-white">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                            </div>
                        ` : ''}
                    </button>
                `).join('')}
            </div>

            <!-- Transfer Pricing Warning (shown when Related is selected) -->
            <div id="transferPricingWarning" class="${isRelated ? '' : 'hidden'} mt-4 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
                <div class="flex items-start gap-3">
                    <span class="text-yellow-400 text-xl">⚠️</span>
                    <div>
                        <h4 class="font-medium text-yellow-300">Transfer Pricing Applies</h4>
                        <p class="text-sm text-yellow-200/80 mt-1">
                            Related party transactions must comply with arm's length principles.
                            SARS scrutinizes pricing between connected entities. Ensure your transaction
                            pricing is defensible and documented.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Setup event listeners
    setupEventListeners(container);
}

// ========== EVENT HANDLERS ==========

function setupEventListeners(container) {
    // Remove existing listeners
    removeEventListeners();

    currentContainer = container;

    boundClickHandler = (e) => {
        const btn = e.target.closest('.party-type-btn');
        if (!btn) return;

        const type = btn.dataset.type;
        const isRelated = type === 'related';

        // Update state
        updateEntityConfig('relationship', { relatedParties: isRelated });

        // Re-render the component
        renderPartySelector(container);
    };

    container.addEventListener('click', boundClickHandler);
}

function removeEventListeners() {
    if (currentContainer && boundClickHandler) {
        currentContainer.removeEventListener('click', boundClickHandler);
        boundClickHandler = null;
    }
}

// ========== INITIALIZATION ==========

/**
 * Initialize the party selector with state subscription
 */
export function initPartySelector(container) {
    if (!container) return;

    // Initial render
    renderPartySelector(container);

    // Subscribe to relationship state changes
    unsubscribe = subscribe((newState, oldState) => {
        const newRelated = newState.entities?.relationship?.relatedParties;
        const oldRelated = oldState?.entities?.relationship?.relatedParties;

        if (newRelated !== oldRelated) {
            renderPartySelector(container);
        }
    });

    return () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        removeEventListeners();
    };
}

/**
 * Get current relationship type
 */
export function getRelationshipType() {
    const state = getState();
    return state.entities?.relationship?.relatedParties ? 'related' : 'independent';
}

/**
 * Check if shareholder perspective should be available
 */
export function isShareholderPerspectiveAvailable() {
    return getRelationshipType() === 'related';
}

// ========== STYLES ==========

export const partySelectorStyles = `
    .party-selector .party-type-btn {
        position: relative;
        transition: all 0.2s ease-in-out;
    }

    .party-selector .party-type-btn:hover:not([aria-pressed="true"]) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .party-selector .party-type-btn[aria-pressed="true"] {
        box-shadow: 0 0 20px rgba(var(--color-primary), 0.2);
    }

    /* Color-specific styles for Tailwind dynamic classes */
    .bg-blue-600\\/20 { background-color: rgba(37, 99, 235, 0.2); }
    .border-blue-500 { border-color: rgb(59, 130, 246); }
    .ring-blue-500\\/30 { --tw-ring-color: rgba(59, 130, 246, 0.3); }
    .text-blue-300 { color: rgb(147, 197, 253); }
    .text-blue-400 { color: rgb(96, 165, 250); }
    .bg-blue-600\\/30 { background-color: rgba(37, 99, 235, 0.3); }

    .bg-purple-600\\/20 { background-color: rgba(147, 51, 234, 0.2); }
    .border-purple-500 { border-color: rgb(168, 85, 247); }
    .ring-purple-500\\/30 { --tw-ring-color: rgba(168, 85, 247, 0.3); }
    .text-purple-300 { color: rgb(216, 180, 254); }
    .text-purple-400 { color: rgb(192, 132, 252); }
    .bg-purple-600\\/30 { background-color: rgba(147, 51, 234, 0.3); }
    .bg-purple-500 { background-color: rgb(168, 85, 247); }
`;

// ========== EXPORTS ==========

export default {
    initPartySelector,
    renderPartySelector,
    getRelationshipType,
    isShareholderPerspectiveAvailable,
    RELATIONSHIP_TYPES,
    partySelectorStyles
};
