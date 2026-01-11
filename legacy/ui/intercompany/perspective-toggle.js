// ========== PERSPECTIVE TOGGLE COMPONENT ==========
// UI component for switching between Your Company and Client perspectives.
// Each perspective shows different aspects of the software transaction.

import { getState, setPerspective, subscribe, arePartiesRelated } from '../../state/app-state.js';

// ========== PERSPECTIVE DEFINITIONS ==========

export const PERSPECTIVES = {
    developer: {
        id: 'developer',
        name: 'Your Company',
        icon: '💻',
        description: 'Revenue, costs, profit, and tax position for your company',
        color: 'blue',
        shortcut: 'D',
        alwaysAvailable: true
    },
    buyer: {
        id: 'buyer',
        name: 'Client',
        icon: '🏢',
        description: 'Asset capitalisation, amortisation, and tax benefits for the client',
        color: 'green',
        shortcut: 'B',
        alwaysAvailable: true
    },
};

/**
 * Get available perspectives based on relationship type
 */
export function getAvailablePerspectives() {
    return Object.values(PERSPECTIVES);
}

/**
 * Get perspective display info adjusted for relationship type
 */
export function getPerspectiveDisplayInfo(perspectiveId) {
    const perspective = PERSPECTIVES[perspectiveId];
    if (!perspective) return null;
    return perspective;
}

// ========== RENDER FUNCTION ==========

/**
 * Render the perspective toggle component
 * @param {HTMLElement} container - Container element to render into
 */
export function renderPerspectiveToggle(container) {
    if (!container) return;

    const state = getState();
    const currentPerspective = state.intercompany.currentPerspective || 'developer';
    const isRelated = arePartiesRelated();
    const currentDisplayInfo = getPerspectiveDisplayInfo(currentPerspective);

    container.innerHTML = `
        <div class="perspective-toggle-header flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
                <span class="text-xl">👁️</span>
                <div>
                    <h3 class="text-sm font-medium text-gray-200">Viewing as</h3>
                    <p class="text-xs text-gray-400">${isRelated ? 'Related Parties' : 'Independent Parties'}</p>
                </div>
            </div>
            <div class="text-xs text-gray-500 hidden md:block">
                Keyboard: <kbd class="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">D</kbd>
                <kbd class="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400 ml-1">B</kbd>
            </div>
        </div>

        <div class="perspective-toggle flex flex-col sm:flex-row gap-2 mb-4">
            ${Object.values(PERSPECTIVES).map(basePerspective => {
                const p = getPerspectiveDisplayInfo(basePerspective.id);
                return `
                <button
                    id="perspective-${p.id}"
                    class="perspective-btn flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200
                           ${currentPerspective === p.id ?
                               `bg-${p.color}-600/20 border-${p.color}-500 text-${p.color}-300` :
                               'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                           }"
                    data-perspective="${p.id}"
                    aria-pressed="${currentPerspective === p.id}"
                    aria-label="Switch to ${p.name} perspective (${p.shortcut})"
                    title="Press '${p.shortcut}' to switch"
                >
                    <span class="text-lg mr-2">${p.icon}</span>
                    <span class="font-medium">${p.name}</span>
                    <span class="text-xs opacity-50 ml-2 hidden sm:inline">(${p.shortcut})</span>
                </button>
            `;
            }).join('')}
        </div>

        <div id="perspectiveDescription" class="flex items-start gap-2 p-3 rounded-lg bg-${currentDisplayInfo?.color || 'purple'}-900/20 border border-${currentDisplayInfo?.color || 'purple'}-700/30">
            <span class="text-${currentDisplayInfo?.color || 'purple'}-400">ℹ️</span>
            <p class="text-sm text-${currentDisplayInfo?.color || 'purple'}-200/80">
                ${currentDisplayInfo?.description || ''}
            </p>
        </div>

        ${isRelated ? `
        <div class="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <div class="flex items-start gap-2">
                <span class="text-yellow-400">⚠️</span>
                <p class="text-xs text-yellow-200/80">
                    <strong>Transfer Pricing:</strong> Related party transactions must comply with arm's length principles.
                </p>
            </div>
        </div>
        ` : ''}
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
    const currentPerspective = state.intercompany.currentPerspective || 'developer';

    container.querySelectorAll('.perspective-btn').forEach(btn => {
        const perspectiveId = btn.dataset.perspective;
        const p = getPerspectiveDisplayInfo(perspectiveId);
        const isActive = perspectiveId === currentPerspective;

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

    // Update description with full re-render for color changes
    const currentDisplayInfo = getPerspectiveDisplayInfo(currentPerspective);
    const descEl = container.querySelector('#perspectiveDescription');
    if (descEl && currentDisplayInfo) {
        descEl.className = `flex items-start gap-2 p-3 rounded-lg bg-${currentDisplayInfo.color}-900/20 border border-${currentDisplayInfo.color}-700/30`;
        descEl.innerHTML = `
            <span class="text-${currentDisplayInfo.color}-400">ℹ️</span>
            <p class="text-sm text-${currentDisplayInfo.color}-200/80">
                ${currentDisplayInfo.description}
            </p>
        `;
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

// ========== KEYBOARD SHORTCUTS ==========

let keyboardHandler = null;

/**
 * Setup keyboard shortcuts for perspective switching
 */
function setupKeyboardShortcuts(container) {
    // Remove existing handler
    if (keyboardHandler) {
        document.removeEventListener('keydown', keyboardHandler);
    }

    keyboardHandler = (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }

        // Don't trigger if modifier keys are pressed (except shift for capitals)
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }

        const key = e.key.toUpperCase();

        switch (key) {
            case 'D':
                setPerspective('developer');
                e.preventDefault();
                break;
            case 'B':
                setPerspective('buyer');
                e.preventDefault();
                break;
        }
    };

    document.addEventListener('keydown', keyboardHandler);
}

/**
 * Remove keyboard shortcuts
 */
function removeKeyboardShortcuts() {
    if (keyboardHandler) {
        document.removeEventListener('keydown', keyboardHandler);
        keyboardHandler = null;
    }
}

// ========== INITIALIZATION ==========

/**
 * Initialize the perspective toggle with state subscription
 */
export function initPerspectiveToggle(container) {
    // Initial render
    renderPerspectiveToggle(container);

    // Setup keyboard shortcuts
    setupKeyboardShortcuts(container);

    // Subscribe to perspective changes AND relationship changes
    const unsubscribe = subscribe((newState, oldState) => {
        const newPerspective = newState.intercompany?.currentPerspective;
        const oldPerspective = oldState?.intercompany?.currentPerspective;
        const newRelated = newState.entities?.relationship?.relatedParties;
        const oldRelated = oldState?.entities?.relationship?.relatedParties;

        // Re-render if perspective or relationship changes
        if (newPerspective !== oldPerspective || newRelated !== oldRelated) {
            renderPerspectiveToggle(container);
        }
    });

    // Return cleanup function
    return () => {
        unsubscribe();
        removeKeyboardShortcuts();
    };
}

/**
 * Destroy the perspective toggle (cleanup)
 */
export function destroyPerspectiveToggle() {
    removeKeyboardShortcuts();
}
