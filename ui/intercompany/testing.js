// ========== TESTING TAB UI ==========
// UI component for the testing tab.
// Displays workflow-based tests that verify calculation logic is correct.
// Shows readable stories, workflow context, and logical assertions.

import { getState, subscribe } from '../../state/app-state.js';
import {
    ALL_TEST_CASES,
    ASSERTIONS,
    runTest,
    runAllTests,
    runModelTests,
    getTestsByModel,
    getTestById,
    createTestCase
} from '../../models/intercompany/testing-utilities.js';
import { getModelMetadata, getModelVariants, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from '../../models/intercompany/registry.js';
import { formatCurrency, formatPercentage, showToast } from '../../utils/index.js';

// ========== STATE ==========

let containerRef = null;
let unsubscribe = null;

let testingState = {
    results: null,
    selectedModel: 'all',
    selectedTest: null,
    isRunning: false,
    showDetails: {},
    customTestInputs: null
};

// ========== STYLES ==========

export const testingStyles = `
    .testing-container {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .test-card {
        transition: all 0.2s ease;
    }

    .test-card:hover {
        transform: translateY(-2px);
    }

    .test-passed {
        border-left: 4px solid #22c55e;
    }

    .test-failed {
        border-left: 4px solid #ef4444;
    }

    .test-error {
        border-left: 4px solid #f59e0b;
    }

    .assertion-row {
        font-size: 0.8rem;
        line-height: 1.4;
    }

    .progress-bar {
        transition: width 0.3s ease;
    }

    .pulse-animation {
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    .rotating-icon {
        animation: rotate 1s linear infinite;
    }

    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .story-text {
        font-family: Georgia, serif;
        line-height: 1.6;
        color: #d1d5db;
    }

    .workflow-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.7rem;
        font-weight: 500;
    }

    .logic-formula {
        font-family: 'SF Mono', Monaco, 'Courier New', monospace;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        color: #4ade80;
    }
`;

// ========== INITIALIZATION ==========

export function initTesting(container, options = {}) {
    containerRef = container;

    unsubscribe = subscribe((state) => {
        // Re-render if relevant state changes
    });

    renderTesting();
}

export function destroyTesting() {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }

    testingState = {
        results: null,
        selectedModel: 'all',
        selectedTest: null,
        isRunning: false,
        showDetails: {},
        customTestInputs: null
    };

    if (containerRef) {
        containerRef.innerHTML = '';
        containerRef = null;
    }
}

// ========== RENDER FUNCTIONS ==========

function renderTesting() {
    if (!containerRef) return;

    const testsByModel = getTestsByModel();
    const modelOptions = Object.keys(testsByModel);

    containerRef.innerHTML = `
        <div class="testing-container space-y-6">
            <style>${testingStyles}</style>

            <!-- Header -->
            <div class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">🧪</span>
                        <div>
                            <h2 class="text-xl font-semibold text-gray-100">Testing Lab</h2>
                            <p class="text-sm text-gray-400">Verify that displayed values are logically correct</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <select id="modelFilter" class="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 text-sm">
                            <option value="all" ${testingState.selectedModel === 'all' ? 'selected' : ''}>All Scenarios</option>
                            ${modelOptions.map(modelId => `
                                <option value="${modelId}" ${testingState.selectedModel === modelId ? 'selected' : ''}>
                                    ${getModelMetadata(modelId)?.shortName || modelId}
                                </option>
                            `).join('')}
                        </select>
                        <button id="runAllTestsBtn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 ${testingState.isRunning ? 'opacity-50 cursor-not-allowed' : ''}">
                            ${testingState.isRunning ? `
                                <span class="rotating-icon">⚙️</span> Running...
                            ` : `
                                <span>▶️</span> Run All
                            `}
                        </button>
                    </div>
                </div>

                <!-- Explanation -->
                <div class="mt-4 p-3 bg-gray-700/50 rounded-lg text-sm text-gray-300">
                    <p><strong>What these tests verify:</strong> Given a workflow (model + variant + inputs),
                    is each displayed value calculated using the correct logic?</p>
                    <p class="mt-1 text-gray-400">We're not testing math — we're testing that
                    "Developer Revenue" equals "Cost × (1 + Markup)" as expected.</p>
                </div>
            </div>

            <!-- Summary Panel -->
            ${testingState.results ? renderSummaryPanel() : ''}

            <!-- Test Scenarios -->
            <div class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-100">Workflow Scenarios</h3>
                    <span class="text-sm text-gray-400">${getFilteredTests().length} scenarios</span>
                </div>

                <div class="space-y-4">
                    ${renderTestCases()}
                </div>
            </div>
        </div>
    `;

    setupEventListeners();
}

function renderSummaryPanel() {
    const { summary } = testingState.results;
    const passRate = summary.passRate.toFixed(1);
    const isAllPassed = summary.passed === summary.total;

    return `
        <div class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 ${isAllPassed ? 'border-green-500/30' : 'border-red-500/30'}">
            <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                    <div class="text-4xl">${isAllPassed ? '✅' : '❌'}</div>
                    <div>
                        <h3 class="text-lg font-semibold ${isAllPassed ? 'text-green-400' : 'text-red-400'}">
                            ${isAllPassed ? 'All Scenarios Passed!' : 'Some Scenarios Failed'}
                        </h3>
                        <p class="text-sm text-gray-400">
                            ${summary.passed} of ${summary.total} passed (${passRate}%)
                        </p>
                    </div>
                </div>

                <div class="flex gap-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400">${summary.passed}</div>
                        <div class="text-xs text-gray-400">Passed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-red-400">${summary.failed}</div>
                        <div class="text-xs text-gray-400">Failed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-400">${summary.duration.toFixed(0)}ms</div>
                        <div class="text-xs text-gray-400">Duration</div>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full flex">
                        <div class="progress-bar bg-green-500" style="width: ${(summary.passed / summary.total) * 100}%"></div>
                        <div class="progress-bar bg-red-500" style="width: ${(summary.failed / summary.total) * 100}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getFilteredTests() {
    if (testingState.selectedModel === 'all') {
        return ALL_TEST_CASES;
    }
    return ALL_TEST_CASES.filter(tc => tc.modelId === testingState.selectedModel);
}

function renderTestCases() {
    const tests = getFilteredTests();
    const results = testingState.results?.results || [];

    if (tests.length === 0) {
        return `
            <div class="text-center py-8 text-gray-400">
                <span class="text-4xl">📭</span>
                <p class="mt-2">No scenarios available for this filter</p>
            </div>
        `;
    }

    return tests.map(testCase => {
        const result = results.find(r => r.id === testCase.id);
        const isExpanded = testingState.showDetails[testCase.id];
        return renderTestCard(testCase, result, isExpanded);
    }).join('');
}

function renderTestCard(testCase, result, isExpanded) {
    const statusClass = result ? (result.passed ? 'test-passed' : (result.error ? 'test-error' : 'test-failed')) : '';
    const statusIcon = result ? (result.passed ? '✅' : (result.error ? '⚠️' : '❌')) : '⏳';
    const statusText = result ? (result.passed ? 'Passed' : (result.error ? 'Error' : 'Failed')) : 'Not Run';

    const passedAssertions = result?.assertions?.filter(a => a.passed).length || 0;
    const totalAssertions = result?.assertions?.length || testCase.assertions?.length || 0;

    return `
        <div class="test-card bg-gray-700/50 rounded-lg p-4 border border-gray-600 ${statusClass}">
            <!-- Header -->
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap mb-2">
                        <span class="text-lg">${statusIcon}</span>
                        <h4 class="font-semibold text-gray-200">${testCase.name}</h4>
                    </div>

                    <!-- Workflow Context Badges -->
                    <div class="flex flex-wrap gap-2 mb-2">
                        <span class="workflow-badge bg-blue-900/50 text-blue-300">
                            📋 ${testCase.workflow?.model || testCase.modelId}
                        </span>
                        <span class="workflow-badge bg-purple-900/50 text-purple-300">
                            🔀 ${testCase.workflow?.variant || testCase.variantId}
                        </span>
                        ${testCase.workflow?.partyRelationship ? `
                            <span class="workflow-badge ${testCase.workflow.partyRelationship === 'related' ? 'bg-orange-900/50 text-orange-300' : 'bg-green-900/50 text-green-300'}">
                                ${testCase.workflow.partyRelationship === 'related' ? '🔗 Related Parties' : '🤝 Independent'}
                            </span>
                        ` : ''}
                    </div>

                    ${result ? `
                        <p class="text-xs text-gray-400">
                            ${passedAssertions}/${totalAssertions} assertions passed
                            ${result.duration ? ` • ${result.duration.toFixed(1)}ms` : ''}
                        </p>
                    ` : `
                        <p class="text-xs text-gray-500">${totalAssertions} assertions to verify</p>
                    `}
                </div>

                <div class="flex items-center gap-2">
                    <button class="run-single-test-btn px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors" data-test-id="${testCase.id}">
                        ▶️ Run
                    </button>
                    <button class="toggle-details-btn px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500 transition-colors" data-test-id="${testCase.id}">
                        ${isExpanded ? '▲ Less' : '▼ More'}
                    </button>
                </div>
            </div>

            ${isExpanded ? renderTestDetails(testCase, result) : ''}
        </div>
    `;
}

function renderTestDetails(testCase, result) {
    return `
        <div class="mt-4 border-t border-gray-600 pt-4 space-y-4">
            <!-- Story / Scenario Description -->
            ${testCase.story ? `
                <div>
                    <h5 class="text-sm font-medium text-gray-300 mb-2">📖 Scenario</h5>
                    <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                        <p class="story-text text-sm whitespace-pre-line">${testCase.story.trim()}</p>
                    </div>
                </div>
            ` : ''}

            <!-- Input Values Used -->
            <div>
                <h5 class="text-sm font-medium text-gray-300 mb-2">📥 Inputs Used</h5>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    ${Object.entries(testCase.inputs).map(([key, value]) => `
                        <div class="bg-gray-600/50 rounded px-2 py-1 text-xs">
                            <span class="text-gray-400">${formatInputLabel(key)}:</span>
                            <span class="text-gray-200 ml-1 font-medium">${formatInputValue(key, value)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Logical Assertions -->
            <div>
                <h5 class="text-sm font-medium text-gray-300 mb-2">🔍 What We're Checking</h5>
                <div class="space-y-2">
                    ${(result?.assertions || testCase.assertions).map(assertion => {
                        const isPassed = assertion.passed;
                        const statusIcon = isPassed === true ? '✓' : isPassed === false ? '✗' : '○';
                        const statusColor = isPassed === true ? 'text-green-400' : isPassed === false ? 'text-red-400' : 'text-gray-400';

                        return `
                            <div class="assertion-row bg-gray-600/30 rounded-lg p-3 ${isPassed === false ? 'border border-red-500/30' : ''}">
                                <div class="flex items-start gap-2">
                                    <span class="${statusColor} text-lg">${statusIcon}</span>
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-200">${assertion.field}</div>
                                        <div class="text-gray-400 text-xs mt-1">
                                            <span class="logic-formula">${assertion.logic}</span>
                                        </div>
                                        ${assertion.description ? `
                                            <p class="text-gray-500 text-xs mt-1">${assertion.description}</p>
                                        ` : ''}
                                        ${assertion.expected !== undefined ? `
                                            <div class="mt-2 flex flex-wrap gap-4 text-xs">
                                                <span class="text-gray-400">
                                                    Expected: <span class="text-green-400 font-medium">${formatValue(assertion.expected)}</span>
                                                </span>
                                                ${assertion.actual !== undefined ? `
                                                    <span class="text-gray-400">
                                                        Actual: <span class="${isPassed ? 'text-green-400' : 'text-red-400'} font-medium">${formatValue(assertion.actual)}</span>
                                                    </span>
                                                ` : ''}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            ${result?.error ? `
                <div class="bg-red-900/30 rounded-lg p-3 border border-red-700">
                    <h5 class="text-sm font-medium text-red-400 mb-1">⚠️ Error</h5>
                    <pre class="text-xs text-red-300 whitespace-pre-wrap">${result.error.message}</pre>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Format input label for display (camelCase → Title Case)
 */
function formatInputLabel(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

/**
 * Format input value based on type
 */
function formatInputValue(key, value) {
    if (typeof value === 'number') {
        if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percentage') || key.toLowerCase().includes('markup')) {
            return `${value}%`;
        }
        if (key.toLowerCase().includes('cost') || key.toLowerCase().includes('price') || key.toLowerCase().includes('fee') || key.toLowerCase().includes('retainer')) {
            return formatCurrency(value);
        }
        if (key.toLowerCase().includes('hours') || key.toLowerCase().includes('months') || key.toLowerCase().includes('life') || key.toLowerCase().includes('years')) {
            return value.toLocaleString();
        }
        return value.toLocaleString();
    }
    return String(value);
}

/**
 * Format a value for display
 */
function formatValue(value) {
    if (value === undefined || value === null) {
        return 'undefined';
    }
    if (typeof value === 'number') {
        if (Math.abs(value) >= 1000) {
            return formatCurrency(value);
        }
        if (value % 1 !== 0) {
            return value.toFixed(2);
        }
        return value.toLocaleString();
    }
    if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
    }
    return String(value);
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerRef) return;

    const modelFilter = containerRef.querySelector('#modelFilter');
    if (modelFilter) {
        modelFilter.addEventListener('change', (e) => {
            testingState.selectedModel = e.target.value;
            renderTesting();
        });
    }

    const runAllBtn = containerRef.querySelector('#runAllTestsBtn');
    if (runAllBtn) {
        runAllBtn.addEventListener('click', handleRunAllTests);
    }

    containerRef.querySelectorAll('.run-single-test-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = e.currentTarget.dataset.testId;
            handleRunSingleTest(testId);
        });
    });

    containerRef.querySelectorAll('.toggle-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = e.currentTarget.dataset.testId;
            testingState.showDetails[testId] = !testingState.showDetails[testId];
            renderTesting();
        });
    });
}

async function handleRunAllTests() {
    if (testingState.isRunning) return;

    testingState.isRunning = true;
    renderTesting();

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const testsToRun = getFilteredTests();
        testingState.results = runAllTests(testsToRun);

        const { summary } = testingState.results;
        if (summary.passed === summary.total) {
            showToast(`All ${summary.total} scenarios passed!`, 'success');
        } else {
            showToast(`${summary.failed} of ${summary.total} scenarios failed`, 'warning');
        }
    } catch (error) {
        console.error('Error running tests:', error);
        showToast('Error running tests: ' + error.message, 'error');
    } finally {
        testingState.isRunning = false;
        renderTesting();
    }
}

async function handleRunSingleTest(testId) {
    const testCase = getTestById(testId);
    if (!testCase) {
        showToast('Scenario not found', 'error');
        return;
    }

    try {
        const result = runTest(testCase);

        if (!testingState.results) {
            testingState.results = {
                summary: {
                    total: 1,
                    passed: result.passed ? 1 : 0,
                    failed: result.passed ? 0 : 1,
                    errors: result.error ? 1 : 0,
                    passRate: result.passed ? 100 : 0,
                    duration: result.duration
                },
                results: [result],
                timestamp: new Date().toISOString()
            };
        } else {
            const existingIndex = testingState.results.results.findIndex(r => r.id === testId);
            if (existingIndex >= 0) {
                testingState.results.results[existingIndex] = result;
            } else {
                testingState.results.results.push(result);
            }

            const results = testingState.results.results;
            testingState.results.summary = {
                total: results.length,
                passed: results.filter(r => r.passed).length,
                failed: results.filter(r => !r.passed).length,
                errors: results.filter(r => r.error).length,
                passRate: (results.filter(r => r.passed).length / results.length) * 100,
                duration: results.reduce((sum, r) => sum + (r.duration || 0), 0)
            };
        }

        testingState.showDetails[testId] = true;

        if (result.passed) {
            showToast(`Scenario "${testCase.name}" passed!`, 'success');
        } else {
            showToast(`Scenario "${testCase.name}" failed`, 'warning');
        }

        renderTesting();
    } catch (error) {
        console.error('Error running test:', error);
        showToast('Error running test: ' + error.message, 'error');
    }
}

// ========== EXPORTS ==========

export default {
    initTesting,
    destroyTesting,
    testingStyles
};
