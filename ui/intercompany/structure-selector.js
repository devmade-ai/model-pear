// ========== STRUCTURE SELECTOR UI ==========
// Step-by-step wizard interface for selecting the optimal
// inter-company software transaction structure.
//
// Features:
// - Progress indicator for wizard steps
// - Question cards with radio button options
// - Real-time recommendation preview
// - Final recommendation with detailed rationale
// - Variant recommendation within selected model

import { getState, subscribe, selectIntercompanyModel, selectVariant } from '../../state/app-state.js';
import {
    DECISION_FACTORS,
    QUESTION_ORDER,
    VARIANT_FACTORS,
    getModelRecommendations,
    getVariantRecommendation,
    generateRationale
} from '../../models/intercompany/structure-selector.js';
import { showToast } from '../../utils/index.js';

// ========== STATE ==========

let wizardState = {
    currentStep: 0,
    answers: {},
    recommendations: null,
    selectedModel: null,
    variantPreference: null,
    isComplete: false
};

let containerRef = null;
let onModelSelectedCallback = null;

// ========== INITIALIZATION ==========

/**
 * Initialize the structure selector wizard
 * @param {HTMLElement} container - The container element
 * @param {Function} onModelSelected - Callback when user selects a model to use
 */
export function initStructureSelector(container, onModelSelected) {
    containerRef = container;
    onModelSelectedCallback = onModelSelected;

    // Reset wizard state
    wizardState = {
        currentStep: 0,
        answers: {},
        recommendations: null,
        selectedModel: null,
        variantPreference: null,
        isComplete: false
    };

    renderWizard();
}

/**
 * Destroy the structure selector
 */
export function destroyStructureSelector() {
    containerRef = null;
    onModelSelectedCallback = null;
}

// ========== RENDER FUNCTIONS ==========

/**
 * Main render function for the wizard
 */
function renderWizard() {
    if (!containerRef) return;

    const totalSteps = QUESTION_ORDER.length;
    const currentQuestion = DECISION_FACTORS[QUESTION_ORDER[wizardState.currentStep]];
    const isLastQuestion = wizardState.currentStep === totalSteps - 1;
    const showResults = wizardState.isComplete;

    containerRef.innerHTML = `
        <div class="structure-selector">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-100">Structure Selection Wizard</h2>
                    <p class="text-sm text-gray-400 mt-1">
                        ${showResults ? 'Review your recommended transaction structures' : 'Answer questions to find the optimal transaction model'}
                    </p>
                </div>
                ${!showResults ? `
                    <button id="skipWizardBtn" class="text-sm text-gray-400 hover:text-gray-300 underline">
                        Skip wizard
                    </button>
                ` : `
                    <button id="restartWizardBtn" class="text-sm text-blue-400 hover:text-blue-300 underline">
                        Start over
                    </button>
                `}
            </div>

            ${showResults ? renderResults() : renderQuestionStep(currentQuestion, isLastQuestion, totalSteps)}
        </div>
    `;

    setupEventListeners();
}

/**
 * Render progress bar
 */
function renderProgressBar(current, total) {
    const progress = Math.round(((current + 1) / total) * 100);

    return `
        <div class="mb-6">
            <div class="flex justify-between text-xs text-gray-400 mb-2">
                <span>Question ${current + 1} of ${total}</span>
                <span>${progress}% complete</span>
            </div>
            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 transition-all duration-300" style="width: ${progress}%"></div>
            </div>
        </div>
    `;
}

/**
 * Render a question step
 */
function renderQuestionStep(question, isLastQuestion, totalSteps) {
    const selectedValue = wizardState.answers[question.id];

    return `
        ${renderProgressBar(wizardState.currentStep, totalSteps)}

        <!-- Question Card -->
        <div class="bg-gray-700/50 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-gray-100 mb-2">${question.question}</h3>
            <p class="text-sm text-gray-400 mb-4">${question.description}</p>

            <div class="space-y-3">
                ${question.options.map(option => `
                    <label class="flex items-start gap-3 p-4 bg-gray-800 rounded-lg border-2 cursor-pointer transition-all
                                  ${selectedValue === option.value ?
                                      'border-blue-500 bg-blue-500/10' :
                                      'border-gray-600 hover:border-gray-500'
                                  }">
                        <input
                            type="radio"
                            name="question-${question.id}"
                            value="${option.value}"
                            ${selectedValue === option.value ? 'checked' : ''}
                            class="mt-1 w-4 h-4 text-blue-500 bg-gray-700 border-gray-500 focus:ring-blue-500"
                        >
                        <div class="flex-1">
                            <span class="font-medium text-gray-200">${option.label}</span>
                            <p class="text-sm text-gray-400 mt-1">${option.description}</p>
                        </div>
                    </label>
                `).join('')}
            </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
            <button
                id="prevStepBtn"
                class="px-4 py-2 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                ${wizardState.currentStep === 0 ? 'disabled' : ''}
            >
                ← Previous
            </button>

            <button
                id="nextStepBtn"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                ${!selectedValue ? 'disabled' : ''}
            >
                ${isLastQuestion ? 'See Recommendations' : 'Next →'}
            </button>
        </div>

        <!-- Live Preview (small) -->
        ${Object.keys(wizardState.answers).length > 0 ? renderLivePreview() : ''}
    `;
}

/**
 * Render live preview of current recommendations
 */
function renderLivePreview() {
    const recommendations = getModelRecommendations(wizardState.answers);
    const top3 = recommendations.slice(0, 3);

    return `
        <div class="mt-6 pt-6 border-t border-gray-700">
            <h4 class="text-sm font-medium text-gray-400 mb-3">Current Top Recommendations</h4>
            <div class="flex gap-2 flex-wrap">
                ${top3.map((rec, idx) => `
                    <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-full text-sm">
                        <span class="text-${rec.matchLevel.color}-400">${rec.matchLevel.icon}</span>
                        <span class="text-gray-300">${rec.shortName}</span>
                        <span class="text-gray-500">${rec.normalizedScore}%</span>
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Render final results
 */
function renderResults() {
    const recommendations = getModelRecommendations(wizardState.answers);
    const topRecommendation = recommendations[0];

    return `
        <!-- Top Recommendation -->
        <div class="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg p-6 border border-green-700/50 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <span class="text-3xl">🏆</span>
                <div>
                    <h3 class="text-xl font-semibold text-green-300">Recommended: ${topRecommendation.name}</h3>
                    <p class="text-sm text-green-400">${topRecommendation.matchLevel.label} (${topRecommendation.normalizedScore}% match)</p>
                </div>
            </div>
            <p class="text-gray-300 mb-4">${topRecommendation.description}</p>

            <!-- Rationale -->
            <div class="bg-gray-800/50 rounded-lg p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-300 mb-2">Why this model?</h4>
                <div class="text-sm text-gray-400 whitespace-pre-line">${generateRationale(topRecommendation, wizardState.answers)}</div>
            </div>

            ${renderVariantSelector(topRecommendation.modelId)}

            <button
                id="useRecommendedBtn"
                data-model-id="${topRecommendation.modelId}"
                class="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
                Use ${topRecommendation.shortName} →
            </button>
        </div>

        <!-- Alternative Options -->
        <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-200 mb-4">Alternative Options</h4>
            <div class="space-y-3">
                ${recommendations.slice(1).map(rec => renderAlternativeCard(rec)).join('')}
            </div>
        </div>

        <!-- Answer Summary -->
        <div class="bg-gray-700/30 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-400 mb-3">Your Answers</h4>
            <div class="space-y-2">
                ${QUESTION_ORDER.map(factorId => {
                    const factor = DECISION_FACTORS[factorId];
                    const answer = wizardState.answers[factorId];
                    const option = factor.options.find(o => o.value === answer);
                    return `
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">${factor.question}</span>
                            <span class="text-gray-200">${option?.label || 'Not answered'}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Render variant selector within results
 */
function renderVariantSelector(modelId) {
    const variantOptions = VARIANT_FACTORS[modelId];
    if (!variantOptions) return '';

    return `
        <div class="border-t border-gray-700 pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-300 mb-2">${variantOptions.question}</h4>
            <select
                id="variantPreference"
                data-model-id="${modelId}"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="">Select a variant preference...</option>
                ${variantOptions.factors.map(f => `
                    <option value="${f.value}">${f.label}</option>
                `).join('')}
            </select>
            <div id="variantRecommendation" class="mt-3 hidden">
                <!-- Variant recommendation will appear here -->
            </div>
        </div>
    `;
}

/**
 * Render an alternative model card
 */
function renderAlternativeCard(rec) {
    const matchColorClass = {
        green: 'text-green-400 border-green-700/50 bg-green-900/20',
        blue: 'text-blue-400 border-blue-700/50 bg-blue-900/20',
        yellow: 'text-yellow-400 border-yellow-700/50 bg-yellow-900/20',
        red: 'text-red-400 border-red-700/50 bg-red-900/20'
    }[rec.matchLevel.color] || 'text-gray-400 border-gray-700';

    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <span class="${matchColorClass}">${rec.matchLevel.icon}</span>
                    <h5 class="font-medium text-gray-200">${rec.shortName}</h5>
                </div>
                <span class="text-sm ${matchColorClass}">${rec.normalizedScore}%</span>
            </div>
            <p class="text-sm text-gray-400 mb-3">${rec.description}</p>

            ${rec.strengths.length > 0 ? `
                <div class="text-xs text-gray-500 mb-3">
                    <span class="text-green-400">✓</span>
                    ${rec.strengths.slice(0, 2).map(s => s.reason).join(', ')}
                </div>
            ` : ''}

            <button
                class="use-model-btn text-sm text-blue-400 hover:text-blue-300"
                data-model-id="${rec.modelId}"
            >
                Use this model →
            </button>
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerRef) return;

    // Radio button changes
    containerRef.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            const factorId = QUESTION_ORDER[wizardState.currentStep];
            wizardState.answers[factorId] = e.target.value;
            renderWizard();
        }

        // Variant preference selector
        if (e.target.id === 'variantPreference') {
            handleVariantPreferenceChange(e.target);
        }
    });

    // Button clicks
    containerRef.addEventListener('click', (e) => {
        const target = e.target;

        if (target.id === 'nextStepBtn') {
            handleNextStep();
        }

        if (target.id === 'prevStepBtn') {
            handlePrevStep();
        }

        if (target.id === 'skipWizardBtn') {
            handleSkipWizard();
        }

        if (target.id === 'restartWizardBtn') {
            handleRestartWizard();
        }

        if (target.id === 'useRecommendedBtn' || target.classList.contains('use-model-btn')) {
            handleUseModel(target.dataset.modelId);
        }
    });
}

function handleNextStep() {
    const isLastQuestion = wizardState.currentStep === QUESTION_ORDER.length - 1;

    if (isLastQuestion) {
        // Show results
        wizardState.isComplete = true;
        wizardState.recommendations = getModelRecommendations(wizardState.answers);
    } else {
        wizardState.currentStep++;
    }

    renderWizard();
}

function handlePrevStep() {
    if (wizardState.currentStep > 0) {
        wizardState.currentStep--;
        renderWizard();
    }
}

function handleSkipWizard() {
    if (onModelSelectedCallback) {
        onModelSelectedCallback(null); // Signal to show regular model selection
    }
}

function handleRestartWizard() {
    wizardState = {
        currentStep: 0,
        answers: {},
        recommendations: null,
        selectedModel: null,
        variantPreference: null,
        isComplete: false
    };
    renderWizard();
}

function handleVariantPreferenceChange(select) {
    const modelId = select.dataset.modelId;
    const preferenceValue = select.value;

    if (!preferenceValue) {
        const recDiv = containerRef.querySelector('#variantRecommendation');
        if (recDiv) recDiv.classList.add('hidden');
        return;
    }

    const variantRec = getVariantRecommendation(modelId, preferenceValue);
    if (!variantRec) return;

    wizardState.variantPreference = preferenceValue;

    const recDiv = containerRef.querySelector('#variantRecommendation');
    if (recDiv) {
        recDiv.classList.remove('hidden');
        recDiv.innerHTML = `
            <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                <p class="text-sm text-blue-300 mb-2">
                    <span class="font-medium">Recommended variant:</span>
                    ${variantRec.recommendedVariants.map(v => v.id + ': ' + v.name).join(', ')}
                </p>
                <p class="text-xs text-gray-400">
                    <span class="text-gray-300">Best for:</span> ${variantRec.scenario}
                </p>
            </div>
        `;
    }
}

function handleUseModel(modelId) {
    if (!modelId) return;

    // Get recommended variant if user selected a preference
    let variantId = null;
    if (wizardState.variantPreference) {
        const variantRec = getVariantRecommendation(modelId, wizardState.variantPreference);
        if (variantRec && variantRec.recommendedVariants.length > 0) {
            variantId = variantRec.recommendedVariants[0].id;
        }
    }

    // Update app state
    selectIntercompanyModel(modelId);
    if (variantId) {
        selectVariant(variantId);
    }

    // Notify parent
    if (onModelSelectedCallback) {
        onModelSelectedCallback(modelId, variantId);
    }

    showToast(`Selected ${modelId.replace('model-', 'Model ')}`, 'success');
}

// ========== EXPORTS ==========

export default {
    initStructureSelector,
    destroyStructureSelector
};
