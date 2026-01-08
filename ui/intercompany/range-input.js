// ========== RANGE INPUT UI COMPONENT ==========
// Phase 11.1: Range Input Framework
// Provides Low/Base/High input mode with slider-based range selection.

import { RANGE_ENABLED_INPUTS, createRange } from '../../models/intercompany/sensitivity-analysis.js';
import { formatCurrency, formatPercentage } from '../../utils/index.js';

// ========== STATE ==========

let rangeInputState = {
    enabled: false,
    mode: 'base',  // 'base' | 'range'
    ranges: {},    // Input ranges
    activeInputs: new Set()  // Inputs with range mode enabled
};

let stateChangeCallbacks = [];

// ========== INITIALIZATION ==========

/**
 * Initialize range input controls
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 */
export function initRangeInputControls(container, options = {}) {
    const controlsHtml = `
        <div class="range-input-controls bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-xl">📊</span>
                    <div>
                        <h4 class="text-sm font-medium text-gray-200">Sensitivity Analysis Mode</h4>
                        <p class="text-xs text-gray-400">Enable range inputs for what-if scenarios</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="rangeToggle" class="sr-only peer" ${rangeInputState.enabled ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <!-- Range Mode Selector (shown when enabled) -->
            <div id="rangeModeSelector" class="${rangeInputState.enabled ? '' : 'hidden'} mt-4 pt-4 border-t border-gray-700">
                <div class="flex gap-2">
                    <button class="range-mode-btn flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${rangeInputState.mode === 'base' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}" data-mode="base">
                        Base Values Only
                    </button>
                    <button class="range-mode-btn flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${rangeInputState.mode === 'range' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}" data-mode="range">
                        Low / Base / High
                    </button>
                </div>
                <p class="text-xs text-gray-500 mt-2 text-center">
                    ${rangeInputState.mode === 'base'
                        ? 'Calculate with single values'
                        : 'Define ranges for sensitivity analysis'}
                </p>
            </div>
        </div>
    `;

    container.innerHTML = controlsHtml;
    setupRangeControlListeners(container, options);
}

/**
 * Set up event listeners for range controls
 */
function setupRangeControlListeners(container, options) {
    const toggle = container.querySelector('#rangeToggle');
    const modeSelector = container.querySelector('#rangeModeSelector');
    const modeBtns = container.querySelectorAll('.range-mode-btn');

    if (toggle) {
        toggle.addEventListener('change', (e) => {
            rangeInputState.enabled = e.target.checked;
            modeSelector?.classList.toggle('hidden', !e.target.checked);
            notifyStateChange();
            options.onToggle?.(rangeInputState.enabled);
        });
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            rangeInputState.mode = mode;

            modeBtns.forEach(b => {
                b.classList.toggle('bg-blue-600', b.dataset.mode === mode);
                b.classList.toggle('text-white', b.dataset.mode === mode);
                b.classList.toggle('bg-gray-700', b.dataset.mode !== mode);
                b.classList.toggle('text-gray-300', b.dataset.mode !== mode);
            });

            const desc = modeSelector.querySelector('p');
            if (desc) {
                desc.textContent = mode === 'base'
                    ? 'Calculate with single values'
                    : 'Define ranges for sensitivity analysis';
            }

            notifyStateChange();
            options.onModeChange?.(mode);
        });
    });
}

// ========== RANGE INPUT FIELD RENDERING ==========

/**
 * Render a range-enabled input field
 * @param {Object} input - Input definition
 * @param {string} modelId - Model ID
 * @param {number} currentValue - Current base value
 * @returns {string} HTML for the input field
 */
export function renderRangeInputField(input, modelId, currentValue) {
    const inputId = `${modelId}-${input.name}`;
    const isRangeEnabled = RANGE_ENABLED_INPUTS[input.name];
    const showRange = rangeInputState.enabled && rangeInputState.mode === 'range' && isRangeEnabled;

    const range = currentValue ? createRange(input.name, currentValue) : null;

    if (!showRange) {
        // Standard single-value input
        return renderStandardInput(input, inputId, currentValue);
    }

    // Range input with Low/Base/High
    return renderRangeInput(input, inputId, range);
}

/**
 * Render a standard single-value input
 */
function renderStandardInput(input, inputId, value) {
    const prefix = input.type === 'currency' ? 'R ' : '';
    const suffix = input.type === 'percent' ? '%' : '';
    const displayValue = value !== undefined ? value : (input.default || '');

    if (input.type === 'select') {
        return `
            <div class="input-field">
                <label for="${inputId}" class="block text-sm text-gray-400 mb-1">${input.label}</label>
                <select
                    id="${inputId}"
                    name="${input.name}"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    ${input.options.map(opt => `
                        <option value="${opt.value}" ${opt.value === displayValue ? 'selected' : ''}>${opt.label}</option>
                    `).join('')}
                </select>
                ${input.hint ? `<p class="text-xs text-gray-500 mt-1">${input.hint}</p>` : ''}
            </div>
        `;
    }

    return `
        <div class="input-field">
            <label for="${inputId}" class="block text-sm text-gray-400 mb-1">${input.label}</label>
            <div class="relative">
                ${prefix ? `<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${prefix}</span>` : ''}
                <input
                    type="number"
                    id="${inputId}"
                    name="${input.name}"
                    value="${displayValue}"
                    min="${input.min !== undefined ? input.min : ''}"
                    max="${input.max !== undefined ? input.max : ''}"
                    step="${input.step || 1}"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}"
                >
                ${suffix ? `<span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">${suffix}</span>` : ''}
            </div>
            ${input.hint ? `<p class="text-xs text-gray-500 mt-1">${input.hint}</p>` : ''}
        </div>
    `;
}

/**
 * Render a range input with Low/Base/High values
 */
function renderRangeInput(input, inputId, range) {
    const config = RANGE_ENABLED_INPUTS[input.name] || {};
    const prefix = input.type === 'currency' ? 'R' : '';
    const suffix = input.type === 'percent' ? '%' : '';

    const lowValue = range?.low ?? (input.default * 0.8);
    const baseValue = range?.base ?? input.default;
    const highValue = range?.high ?? (input.default * 1.2);

    return `
        <div class="input-field range-input-group col-span-2">
            <div class="flex items-center justify-between mb-2">
                <label class="text-sm text-gray-400">${input.label}</label>
                <span class="text-xs px-2 py-1 rounded bg-blue-600/20 text-blue-300">
                    ${config.category || 'range'} input
                </span>
            </div>

            <div class="grid grid-cols-3 gap-3">
                <!-- Low Value -->
                <div class="range-value-input">
                    <label class="block text-xs text-red-400 mb-1 text-center">Low</label>
                    <div class="relative">
                        ${prefix ? `<span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">${prefix}</span>` : ''}
                        <input
                            type="number"
                            id="${inputId}-low"
                            name="${input.name}_low"
                            value="${lowValue}"
                            step="${input.step || 1}"
                            class="w-full px-2 py-2 bg-red-900/20 border border-red-700/50 rounded-md text-red-300 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 ${prefix ? 'pl-6' : ''}"
                        >
                        ${suffix ? `<span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">${suffix}</span>` : ''}
                    </div>
                </div>

                <!-- Base Value -->
                <div class="range-value-input">
                    <label class="block text-xs text-blue-400 mb-1 text-center">Base</label>
                    <div class="relative">
                        ${prefix ? `<span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">${prefix}</span>` : ''}
                        <input
                            type="number"
                            id="${inputId}"
                            name="${input.name}"
                            value="${baseValue}"
                            step="${input.step || 1}"
                            class="w-full px-2 py-2 bg-blue-900/20 border border-blue-700/50 rounded-md text-blue-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${prefix ? 'pl-6' : ''}"
                        >
                        ${suffix ? `<span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">${suffix}</span>` : ''}
                    </div>
                </div>

                <!-- High Value -->
                <div class="range-value-input">
                    <label class="block text-xs text-green-400 mb-1 text-center">High</label>
                    <div class="relative">
                        ${prefix ? `<span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">${prefix}</span>` : ''}
                        <input
                            type="number"
                            id="${inputId}-high"
                            name="${input.name}_high"
                            value="${highValue}"
                            step="${input.step || 1}"
                            class="w-full px-2 py-2 bg-green-900/20 border border-green-700/50 rounded-md text-green-300 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 ${prefix ? 'pl-6' : ''}"
                        >
                        ${suffix ? `<span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">${suffix}</span>` : ''}
                    </div>
                </div>
            </div>

            <!-- Variance Slider -->
            <div class="mt-3">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Variance: <span id="${inputId}-variance">${((config.variance || 0.2) * 100).toFixed(0)}%</span></span>
                    <span class="text-gray-600">
                        ${prefix}${formatNumber(lowValue)} - ${prefix}${formatNumber(highValue)}${suffix}
                    </span>
                </div>
                <input
                    type="range"
                    id="${inputId}-slider"
                    min="5"
                    max="50"
                    value="${(config.variance || 0.2) * 100}"
                    class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                    data-input-name="${input.name}"
                    data-base-value="${baseValue}"
                >
            </div>

            ${input.hint ? `<p class="text-xs text-gray-500 mt-2">${input.hint}</p>` : ''}
        </div>
    `;
}

/**
 * Format number for display
 */
function formatNumber(value) {
    if (Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    } else if (Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(0) + 'K';
    }
    return value.toFixed(0);
}

// ========== SLIDER INTERACTION ==========

/**
 * Set up slider interactions for range inputs
 * @param {HTMLElement} container - Container element
 */
export function setupRangeSliders(container) {
    container.querySelectorAll('.range-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const inputName = e.target.dataset.inputName;
            const baseValue = parseFloat(e.target.dataset.baseValue);
            const variance = parseInt(e.target.value) / 100;

            // Update variance display
            const varianceSpan = container.querySelector(`#${e.target.id.replace('-slider', '-variance')}`);
            if (varianceSpan) {
                varianceSpan.textContent = `${(variance * 100).toFixed(0)}%`;
            }

            // Update low and high inputs
            const lowInput = container.querySelector(`[name="${inputName}_low"]`);
            const highInput = container.querySelector(`[name="${inputName}_high"]`);

            if (lowInput) {
                lowInput.value = (baseValue * (1 - variance)).toFixed(0);
            }
            if (highInput) {
                highInput.value = (baseValue * (1 + variance)).toFixed(0);
            }

            // Store in state
            rangeInputState.ranges[inputName] = {
                low: baseValue * (1 - variance),
                base: baseValue,
                high: baseValue * (1 + variance),
                variance
            };

            notifyStateChange();
        });
    });

    // Also handle direct input changes
    container.querySelectorAll('.range-value-input input').forEach(input => {
        input.addEventListener('change', (e) => {
            const name = e.target.name;
            const value = parseFloat(e.target.value);

            // Determine which field was changed
            if (name.endsWith('_low')) {
                const baseName = name.replace('_low', '');
                if (!rangeInputState.ranges[baseName]) {
                    rangeInputState.ranges[baseName] = {};
                }
                rangeInputState.ranges[baseName].low = value;
            } else if (name.endsWith('_high')) {
                const baseName = name.replace('_high', '');
                if (!rangeInputState.ranges[baseName]) {
                    rangeInputState.ranges[baseName] = {};
                }
                rangeInputState.ranges[baseName].high = value;
            } else {
                if (!rangeInputState.ranges[name]) {
                    rangeInputState.ranges[name] = {};
                }
                rangeInputState.ranges[name].base = value;
            }

            notifyStateChange();
        });
    });
}

// ========== STATE MANAGEMENT ==========

/**
 * Get current range input state
 */
export function getRangeInputState() {
    return { ...rangeInputState };
}

/**
 * Set range input state
 */
export function setRangeInputState(newState) {
    rangeInputState = { ...rangeInputState, ...newState };
    notifyStateChange();
}

/**
 * Subscribe to state changes
 */
export function subscribeToRangeInputChanges(callback) {
    stateChangeCallbacks.push(callback);
    return () => {
        stateChangeCallbacks = stateChangeCallbacks.filter(cb => cb !== callback);
    };
}

/**
 * Notify all subscribers of state change
 */
function notifyStateChange() {
    stateChangeCallbacks.forEach(cb => cb(rangeInputState));
}

/**
 * Gather range values from form
 * @param {HTMLElement} container - Form container
 * @returns {Object} Ranges for all inputs
 */
export function gatherRangeValues(container) {
    const ranges = {};

    container.querySelectorAll('.range-input-group').forEach(group => {
        const baseInput = group.querySelector('input[name]:not([name$="_low"]):not([name$="_high"])');
        if (!baseInput) return;

        const name = baseInput.name;
        const lowInput = group.querySelector(`[name="${name}_low"]`);
        const highInput = group.querySelector(`[name="${name}_high"]`);

        if (lowInput && highInput) {
            ranges[name] = {
                low: parseFloat(lowInput.value) || 0,
                base: parseFloat(baseInput.value) || 0,
                high: parseFloat(highInput.value) || 0,
                inputName: name,
                label: RANGE_ENABLED_INPUTS[name]?.label || name,
                category: RANGE_ENABLED_INPUTS[name]?.category || 'other'
            };
        }
    });

    return ranges;
}

/**
 * Check if range mode is active
 */
export function isRangeModeActive() {
    return rangeInputState.enabled && rangeInputState.mode === 'range';
}

// ========== PRESET VARIANCE PATTERNS ==========

/**
 * Apply preset variance patterns
 * @param {string} pattern - Pattern name
 * @param {Object} baseInputs - Base input values
 * @returns {Object} Ranges with applied pattern
 */
export function applyVariancePattern(pattern, baseInputs) {
    const patterns = {
        conservative: {
            cost: 0.10,
            revenue: 0.15,
            margin: 0.20,
            duration: 0.20,
            tax: 0.05
        },
        moderate: {
            cost: 0.20,
            revenue: 0.25,
            margin: 0.35,
            duration: 0.30,
            tax: 0.10
        },
        aggressive: {
            cost: 0.30,
            revenue: 0.40,
            margin: 0.50,
            duration: 0.40,
            tax: 0.15
        }
    };

    const patternConfig = patterns[pattern] || patterns.moderate;
    const ranges = {};

    Object.entries(baseInputs).forEach(([name, value]) => {
        if (typeof value !== 'number' || !RANGE_ENABLED_INPUTS[name]) {
            return;
        }

        const config = RANGE_ENABLED_INPUTS[name];
        const variance = patternConfig[config.category] || 0.20;

        ranges[name] = createRange(name, value, { variance });
    });

    return ranges;
}

// ========== CSS STYLES ==========

/**
 * Get CSS for range input styling
 */
export function getRangeInputStyles() {
    return `
        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: 2px solid #1E40AF;
        }

        .range-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: 2px solid #1E40AF;
        }

        .range-input-group {
            background: rgba(55, 65, 81, 0.3);
            border-radius: 0.5rem;
            padding: 1rem;
            border: 1px solid rgba(75, 85, 99, 0.5);
        }

        .range-value-input input:focus {
            outline: none;
        }
    `;
}

// ========== EXPORTS ==========

export default {
    initRangeInputControls,
    renderRangeInputField,
    setupRangeSliders,
    getRangeInputState,
    setRangeInputState,
    subscribeToRangeInputChanges,
    gatherRangeValues,
    isRangeModeActive,
    applyVariancePattern,
    getRangeInputStyles
};
