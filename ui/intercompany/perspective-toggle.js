// ========== THREE-PERSPECTIVE TOGGLE COMPONENT ==========
// UI component for switching between Developer, Buyer, and Combined perspectives.
// Each perspective shows different aspects of the inter-company transaction.

import { getState, setPerspective, subscribe } from '../../state/app-state.js';

// ========== PERSPECTIVE DEFINITIONS ==========

export const PERSPECTIVES = {
    developer: {
        id: 'developer',
        name: 'Developer',
        icon: '💻',
        description: 'Revenue, costs, and tax position for the software developer',
        color: 'blue'
    },
    buyer: {
        id: 'buyer',
        name: 'Buyer',
        icon: '🏢',
        description: 'Asset capitalisation, amortisation, and tax benefits',
        color: 'green'
    },
    combined: {
        id: 'combined',
        name: 'Combined',
        icon: '🔗',
        description: 'Group consolidation view with intercompany eliminations',
        color: 'purple'
    }
};

// ========== RENDER FUNCTION ==========

/**
 * Render the perspective toggle component
 * @param {HTMLElement} container - Container element to render into
 */
export function renderPerspectiveToggle(container) {
    if (!container) return;

    const state = getState();
    const currentPerspective = state.intercompany.currentPerspective || 'combined';

    container.innerHTML = `
        <div class="perspective-toggle flex flex-col sm:flex-row gap-2 mb-6">
            <div class="text-sm text-gray-400 self-center mr-4 hidden sm:block">View:</div>
            ${Object.values(PERSPECTIVES).map(p => `
                <button
                    id="perspective-${p.id}"
                    class="perspective-btn flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200
                           ${currentPerspective === p.id ?
                               `bg-${p.color}-600/20 border-${p.color}-500 text-${p.color}-300` :
                               'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                           }"
                    data-perspective="${p.id}"
                    aria-pressed="${currentPerspective === p.id}"
                    aria-label="Switch to ${p.name} perspective"
                >
                    <span class="text-lg mr-2">${p.icon}</span>
                    <span class="font-medium">${p.name}</span>
                </button>
            `).join('')}
        </div>
        <p id="perspectiveDescription" class="text-sm text-gray-400 mb-4">
            ${PERSPECTIVES[currentPerspective]?.description || ''}
        </p>
    `;

    // Add click handlers
    container.querySelectorAll('.perspective-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const perspective = btn.dataset.perspective;
            setPerspective(perspective);
        });
    });
}

/**
 * Update the toggle to reflect current state
 */
export function updatePerspectiveToggle(container) {
    if (!container) return;

    const state = getState();
    const currentPerspective = state.intercompany.currentPerspective || 'combined';

    container.querySelectorAll('.perspective-btn').forEach(btn => {
        const perspective = btn.dataset.perspective;
        const p = PERSPECTIVES[perspective];
        const isActive = perspective === currentPerspective;

        btn.setAttribute('aria-pressed', isActive);

        // Update classes based on active state
        if (isActive) {
            btn.classList.remove('bg-gray-800', 'border-gray-600', 'text-gray-400');
            btn.classList.add(`bg-${p.color}-600/20`, `border-${p.color}-500`, `text-${p.color}-300`);
        } else {
            btn.classList.add('bg-gray-800', 'border-gray-600', 'text-gray-400');
            btn.classList.remove(`bg-${p.color}-600/20`, `border-${p.color}-500`, `text-${p.color}-300`);
        }
    });

    // Update description
    const descEl = container.querySelector('#perspectiveDescription');
    if (descEl) {
        descEl.textContent = PERSPECTIVES[currentPerspective]?.description || '';
    }
}

// ========== STYLES ==========
// Tailwind classes are used directly, but we define custom styles for dynamic colors

export const perspectiveStyles = `
    .perspective-toggle .perspective-btn {
        transition: all 0.2s ease-in-out;
    }

    .perspective-toggle .perspective-btn:hover:not([aria-pressed="true"]) {
        transform: translateY(-1px);
    }

    .perspective-toggle .perspective-btn[aria-pressed="true"] {
        box-shadow: 0 0 10px rgba(var(--color-primary), 0.3);
    }

    /* Color-specific styles for Tailwind dynamic classes */
    .bg-blue-600\\/20 { background-color: rgba(37, 99, 235, 0.2); }
    .border-blue-500 { border-color: rgb(59, 130, 246); }
    .text-blue-300 { color: rgb(147, 197, 253); }

    .bg-green-600\\/20 { background-color: rgba(22, 163, 74, 0.2); }
    .border-green-500 { border-color: rgb(34, 197, 94); }
    .text-green-300 { color: rgb(134, 239, 172); }

    .bg-purple-600\\/20 { background-color: rgba(147, 51, 234, 0.2); }
    .border-purple-500 { border-color: rgb(168, 85, 247); }
    .text-purple-300 { color: rgb(216, 180, 254); }
`;

// ========== INITIALIZATION ==========

/**
 * Initialize the perspective toggle with state subscription
 */
export function initPerspectiveToggle(container) {
    // Initial render
    renderPerspectiveToggle(container);

    // Subscribe to perspective changes
    return subscribe((newState, oldState) => {
        const newPerspective = newState.intercompany?.currentPerspective;
        const oldPerspective = oldState?.intercompany?.currentPerspective;

        if (newPerspective !== oldPerspective) {
            updatePerspectiveToggle(container);
        }
    });
}
