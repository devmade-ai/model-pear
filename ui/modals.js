import { models } from '../models/index.js';
import { METRIC_EXPLANATIONS, CALCULATION_EXPLANATIONS } from '../utils/index.js';

// Forward declaration - init will be set by app.js
let init;

export function setInitFunction(initFn) {
    init = initFn;
}

// ========== TOOLTIP MODAL FUNCTIONS ==========

/**
 * Show tooltip modal with detailed information
 */
export function showTooltipModal(title, content) {
    const modal = document.getElementById('tooltipModal');
    const titleEl = document.getElementById('tooltipTitle');
    const contentEl = document.getElementById('tooltipContent');

    titleEl.textContent = title;

    // Build content HTML based on content object
    let contentHTML = '';

    if (content.explanation) {
        contentHTML += `<p class="text-gray-300">${content.explanation}</p>`;
    }

    if (content.formula) {
        contentHTML += `
            <div class="bg-gray-750 p-3 rounded-md border border-gray-600">
                <div class="text-xs text-gray-400 mb-1">Formula:</div>
                <code class="text-blue-300 text-sm">${content.formula}</code>
            </div>
        `;
    }

    if (content.methodology) {
        contentHTML += `
            <div>
                <div class="text-sm font-semibold text-gray-200 mb-1">How it works:</div>
                <p class="text-sm text-gray-400">${content.methodology}</p>
            </div>
        `;
    }

    if (content.keyMetrics && content.keyMetrics.length > 0) {
        contentHTML += `
            <div>
                <div class="text-sm font-semibold text-gray-200 mb-2">Key Metrics Tracked:</div>
                <ul class="list-disc list-inside text-sm text-gray-400 space-y-1">
                    ${content.keyMetrics.map(metric => `<li>${metric}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (content.useCases) {
        contentHTML += `
            <div>
                <div class="text-sm font-semibold text-gray-200 mb-1">Common Use Cases:</div>
                <p class="text-sm text-gray-400">${content.useCases}</p>
            </div>
        `;
    }

    if (content.benchmark) {
        contentHTML += `
            <div class="bg-blue-900 bg-opacity-30 p-3 rounded-md border border-blue-700">
                <div class="text-xs text-blue-300 mb-1">Benchmark:</div>
                <p class="text-sm text-gray-300">${content.benchmark}</p>
            </div>
        `;
    }

    if (content.interpretation) {
        contentHTML += `
            <div>
                <div class="text-sm font-semibold text-gray-200 mb-2">Interpretation Guide:</div>
                <div class="space-y-1 text-sm">
                    ${Object.entries(content.interpretation).map(([range, meaning]) =>
                        `<div class="flex items-start gap-2">
                            <span class="text-gray-400 min-w-[80px]">${range}:</span>
                            <span class="text-gray-300">${meaning}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    contentEl.innerHTML = contentHTML;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

/**
 * Close tooltip modal
 */
export function closeTooltipModal(event) {
    // If event is provided and target is not the modal background, don't close
    if (event && event.target.id !== 'tooltipModal') {
        return;
    }

    const modal = document.getElementById('tooltipModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

/**
 * Show metric explanation in modal
 */
export function showMetricInfo(metricKey) {
    const info = METRIC_EXPLANATIONS[metricKey];
    if (info) {
        showTooltipModal(info.label, info);
    }
}

/**
 * Show calculation explanation in modal
 */
export function showCalculationInfo(modelKey) {
    const info = CALCULATION_EXPLANATIONS[modelKey];
    if (info) {
        showTooltipModal(info.name, info);
    }
}

/**
 * Show input field explanation in modal
 */
export function showInputInfo(modelKey, inputName) {
    const model = models[modelKey];
    if (!model) return;

    const input = model.inputs.find(inp => inp.name === inputName);
    if (!input) return;

    const content = {
        explanation: input.hint || 'No additional information available',
    };

    // Add calculation context if available
    const calcInfo = CALCULATION_EXPLANATIONS[modelKey];
    if (calcInfo) {
        content.methodology = calcInfo.methodology;
    }

    showTooltipModal(input.label, content);
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
