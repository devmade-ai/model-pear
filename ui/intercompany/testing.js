// ========== TESTING TAB UI ==========
// UI component for the testing tab.
// Allows running pre-defined test cases to validate calculation correctness.
// Shows pass/fail status, expected vs actual values, and detailed results.

import { getState, subscribe } from '../../state/app-state.js';
import {
    ALL_TEST_CASES,
    runTest,
    runAllTests,
    runModelTests,
    getTestsByModel,
    getTestById,
    createTestCase
} from '../../models/intercompany/testing-utilities.js';
import { getModelMetadata, getModelVariants, getVariantInputs, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from '../../models/intercompany/registry.js';
import { formatCurrency, formatPercentage, showToast } from '../../utils/index.js';

// ========== STATE ==========

let containerRef = null;
let unsubscribe = null;

let testingState = {
    results: null,
    selectedModel: 'all',
    selectedTest: null,
    isRunning: false,
    showDetails: {},  // Track which test details are expanded
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
        font-family: monospace;
        font-size: 0.75rem;
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
`;

// ========== INITIALIZATION ==========

/**
 * Initialize the testing tab
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Options for initialization
 */
export function initTesting(container, options = {}) {
    containerRef = container;

    // Subscribe to state changes
    unsubscribe = subscribe((state) => {
        // Re-render if relevant state changes
    });

    // Initial render
    renderTesting();
}

/**
 * Cleanup the testing tab
 */
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

/**
 * Render the testing tab
 */
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
                            <p class="text-sm text-gray-400">Validate calculation results against expected outcomes</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <select id="modelFilter" class="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 text-sm">
                            <option value="all" ${testingState.selectedModel === 'all' ? 'selected' : ''}>All Models</option>
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
                                <span>▶️</span> Run Tests
                            `}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Summary Panel (shown after tests run) -->
            ${testingState.results ? renderSummaryPanel() : ''}

            <!-- Test Cases Grid -->
            <div class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-100">Test Cases</h3>
                    <span class="text-sm text-gray-400">${getFilteredTests().length} tests</span>
                </div>

                <div class="space-y-3">
                    ${renderTestCases()}
                </div>
            </div>

            <!-- Custom Test Panel -->
            <div class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-2xl">🔧</span>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-100">Custom Test</h3>
                        <p class="text-sm text-gray-400">Run a one-off test with current calculator inputs</p>
                    </div>
                </div>

                <div class="bg-gray-700/50 rounded-lg p-4">
                    <p class="text-sm text-gray-300 mb-3">
                        Use this to test your current calculator configuration against expected values.
                        First configure and run a calculation in the Calculator tab, then click below to capture it as a test.
                    </p>
                    <div class="flex gap-3">
                        <button id="captureCurrentBtn" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                            📷 Capture Current Calculation
                        </button>
                        <button id="runCustomTestBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm ${!testingState.customTestInputs ? 'opacity-50 cursor-not-allowed' : ''}">
                            ▶️ Run Custom Test
                        </button>
                    </div>
                    ${testingState.customTestInputs ? `
                        <div class="mt-3 p-3 bg-gray-600/50 rounded text-sm">
                            <p class="text-gray-300"><strong>Captured:</strong> ${testingState.customTestInputs.modelId} / ${testingState.customTestInputs.variantId}</p>
                            <p class="text-gray-400 text-xs mt-1">Click "Run Custom Test" to validate against expected values</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    setupEventListeners();
}

/**
 * Render the summary panel
 */
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
                            ${isAllPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
                        </h3>
                        <p class="text-sm text-gray-400">
                            ${summary.passed} of ${summary.total} tests passed (${passRate}%)
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
                        <div class="text-2xl font-bold text-yellow-400">${summary.errors}</div>
                        <div class="text-xs text-gray-400">Errors</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-400">${summary.duration.toFixed(0)}ms</div>
                        <div class="text-xs text-gray-400">Duration</div>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
                <div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full flex">
                        <div class="progress-bar bg-green-500" style="width: ${(summary.passed / summary.total) * 100}%"></div>
                        <div class="progress-bar bg-red-500" style="width: ${(summary.failed / summary.total) * 100}%"></div>
                        <div class="progress-bar bg-yellow-500" style="width: ${(summary.errors / summary.total) * 100}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get filtered tests based on selected model
 */
function getFilteredTests() {
    if (testingState.selectedModel === 'all') {
        return ALL_TEST_CASES;
    }
    return ALL_TEST_CASES.filter(tc => tc.modelId === testingState.selectedModel);
}

/**
 * Render test cases
 */
function renderTestCases() {
    const tests = getFilteredTests();
    const results = testingState.results?.results || [];

    if (tests.length === 0) {
        return `
            <div class="text-center py-8 text-gray-400">
                <span class="text-4xl">📭</span>
                <p class="mt-2">No test cases available for this filter</p>
            </div>
        `;
    }

    return tests.map(testCase => {
        const result = results.find(r => r.id === testCase.id);
        const isExpanded = testingState.showDetails[testCase.id];

        return renderTestCard(testCase, result, isExpanded);
    }).join('');
}

/**
 * Render a single test card
 */
function renderTestCard(testCase, result, isExpanded) {
    const modelMeta = getModelMetadata(testCase.modelId);
    const statusClass = result ? (result.passed ? 'test-passed' : (result.error ? 'test-error' : 'test-failed')) : '';
    const statusIcon = result ? (result.passed ? '✅' : (result.error ? '⚠️' : '❌')) : '⏳';
    const statusText = result ? (result.passed ? 'Passed' : (result.error ? 'Error' : 'Failed')) : 'Not Run';

    return `
        <div class="test-card bg-gray-700/50 rounded-lg p-4 border border-gray-600 ${statusClass}">
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-lg">${statusIcon}</span>
                        <h4 class="font-medium text-gray-200">${testCase.name}</h4>
                        <span class="px-2 py-0.5 bg-gray-600 rounded text-xs text-gray-300">
                            ${modelMeta?.shortName || testCase.modelId}
                        </span>
                        <span class="px-2 py-0.5 bg-gray-600 rounded text-xs text-gray-300">
                            ${testCase.variantId}
                        </span>
                    </div>
                    <p class="text-sm text-gray-400 mt-1">${testCase.description}</p>
                    ${result ? `
                        <p class="text-xs text-gray-500 mt-1">
                            ${result.assertions.filter(a => a.passed).length}/${result.assertions.length} assertions passed
                            ${result.duration ? `| ${result.duration.toFixed(1)}ms` : ''}
                        </p>
                    ` : ''}
                </div>
                <div class="flex items-center gap-2">
                    <button class="run-single-test-btn px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors" data-test-id="${testCase.id}">
                        ▶️
                    </button>
                    <button class="toggle-details-btn px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500 transition-colors" data-test-id="${testCase.id}">
                        ${isExpanded ? '▲' : '▼'}
                    </button>
                </div>
            </div>

            ${isExpanded ? renderTestDetails(testCase, result) : ''}
        </div>
    `;
}

/**
 * Render test details (expanded view)
 */
function renderTestDetails(testCase, result) {
    return `
        <div class="mt-4 border-t border-gray-600 pt-4 space-y-4">
            <!-- Inputs -->
            <div>
                <h5 class="text-sm font-medium text-gray-300 mb-2">📥 Inputs</h5>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    ${Object.entries(testCase.inputs).map(([key, value]) => `
                        <div class="bg-gray-600/50 rounded px-2 py-1 text-xs">
                            <span class="text-gray-400">${key}:</span>
                            <span class="text-gray-200 ml-1">${formatValue(value)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Expected Outcomes -->
            <div>
                <h5 class="text-sm font-medium text-gray-300 mb-2">🎯 Expected Outcomes</h5>
                <div class="space-y-2">
                    ${Object.entries(testCase.expected).map(([perspective, expectations]) => `
                        <div class="bg-gray-600/30 rounded p-2">
                            <div class="text-xs text-gray-400 mb-1 uppercase">${perspective}</div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                                ${Object.entries(expectations).map(([path, expected]) => {
                                    const assertion = result?.assertions.find(a => a.path === `${perspective}.${path}`);
                                    const passed = assertion?.passed;
                                    const actual = assertion?.actual;

                                    return `
                                        <div class="assertion-row flex items-center gap-2 ${passed === true ? 'text-green-400' : passed === false ? 'text-red-400' : 'text-gray-300'}">
                                            <span>${passed === true ? '✓' : passed === false ? '✗' : '○'}</span>
                                            <span class="text-gray-400">${path}:</span>
                                            <span class="font-medium">${formatValue(expected)}</span>
                                            ${actual !== undefined && !passed ? `
                                                <span class="text-red-400">(got: ${formatValue(actual)})</span>
                                            ` : ''}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${result?.error ? `
                <div class="bg-red-900/30 rounded p-3 border border-red-700">
                    <h5 class="text-sm font-medium text-red-400 mb-1">⚠️ Error</h5>
                    <pre class="text-xs text-red-300 whitespace-pre-wrap">${result.error.message}</pre>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Format a value for display
 */
function formatValue(value) {
    if (typeof value === 'number') {
        if (Math.abs(value) >= 1000) {
            return formatCurrency(value);
        }
        return value.toLocaleString();
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    return String(value);
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerRef) return;

    // Model filter change
    const modelFilter = containerRef.querySelector('#modelFilter');
    if (modelFilter) {
        modelFilter.addEventListener('change', (e) => {
            testingState.selectedModel = e.target.value;
            renderTesting();
        });
    }

    // Run all tests button
    const runAllBtn = containerRef.querySelector('#runAllTestsBtn');
    if (runAllBtn) {
        runAllBtn.addEventListener('click', handleRunAllTests);
    }

    // Run single test buttons
    containerRef.querySelectorAll('.run-single-test-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = e.currentTarget.dataset.testId;
            handleRunSingleTest(testId);
        });
    });

    // Toggle details buttons
    containerRef.querySelectorAll('.toggle-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = e.currentTarget.dataset.testId;
            testingState.showDetails[testId] = !testingState.showDetails[testId];
            renderTesting();
        });
    });

    // Capture current calculation button
    const captureBtn = containerRef.querySelector('#captureCurrentBtn');
    if (captureBtn) {
        captureBtn.addEventListener('click', handleCaptureCurrentCalculation);
    }

    // Run custom test button
    const runCustomBtn = containerRef.querySelector('#runCustomTestBtn');
    if (runCustomBtn) {
        runCustomBtn.addEventListener('click', handleRunCustomTest);
    }
}

/**
 * Run all tests (or filtered tests)
 */
async function handleRunAllTests() {
    if (testingState.isRunning) return;

    testingState.isRunning = true;
    renderTesting();

    // Small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const testsToRun = getFilteredTests();
        testingState.results = runAllTests(testsToRun);

        const { summary } = testingState.results;
        if (summary.passed === summary.total) {
            showToast(`All ${summary.total} tests passed!`, 'success');
        } else {
            showToast(`${summary.failed} of ${summary.total} tests failed`, 'warning');
        }
    } catch (error) {
        console.error('Error running tests:', error);
        showToast('Error running tests: ' + error.message, 'error');
    } finally {
        testingState.isRunning = false;
        renderTesting();
    }
}

/**
 * Run a single test
 */
async function handleRunSingleTest(testId) {
    const testCase = getTestById(testId);
    if (!testCase) {
        showToast('Test case not found', 'error');
        return;
    }

    try {
        const result = runTest(testCase);

        // Update or add to results
        if (!testingState.results) {
            testingState.results = {
                summary: { total: 1, passed: result.passed ? 1 : 0, failed: result.passed ? 0 : 1, errors: result.error ? 1 : 0, passRate: result.passed ? 100 : 0, duration: result.duration },
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

            // Recalculate summary
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

        // Expand the test to show details
        testingState.showDetails[testId] = true;

        if (result.passed) {
            showToast(`Test "${testCase.name}" passed!`, 'success');
        } else {
            showToast(`Test "${testCase.name}" failed`, 'warning');
        }

        renderTesting();
    } catch (error) {
        console.error('Error running test:', error);
        showToast('Error running test: ' + error.message, 'error');
    }
}

/**
 * Capture current calculation as a custom test
 */
function handleCaptureCurrentCalculation() {
    const state = getState();
    const { selectedModel, selectedVariant, results } = state.intercompany;

    if (!selectedModel || !selectedVariant) {
        showToast('Please select a model and variant first', 'warning');
        return;
    }

    if (!results) {
        showToast('Please run a calculation first', 'warning');
        return;
    }

    // Capture the current state for custom testing
    testingState.customTestInputs = {
        modelId: selectedModel,
        variantId: selectedVariant,
        results: results
    };

    showToast('Current calculation captured! Add expected values and run the test.', 'success');
    renderTesting();
}

/**
 * Run custom test with captured inputs
 */
function handleRunCustomTest() {
    if (!testingState.customTestInputs) {
        showToast('Please capture a calculation first', 'warning');
        return;
    }

    const { modelId, variantId, results } = testingState.customTestInputs;

    // Create a simple validation - check that key results are present
    const testCase = createTestCase({
        id: 'custom-current',
        name: 'Custom: Current Calculation',
        description: 'Validate current calculator results',
        modelId,
        variantId,
        inputs: {}, // We'll use the stored results
        expected: {
            developer: {
                'revenue.total': results.developer?.revenue?.total || 0
            }
        },
        tolerance: 0.01
    });

    try {
        const result = runTest(testCase);

        if (result.passed) {
            showToast('Custom test passed!', 'success');
        } else {
            showToast('Custom test failed - check the details', 'warning');
        }

        // Show result
        testingState.results = {
            summary: { total: 1, passed: result.passed ? 1 : 0, failed: result.passed ? 0 : 1, errors: 0, passRate: result.passed ? 100 : 0, duration: result.duration },
            results: [result],
            timestamp: new Date().toISOString()
        };
        testingState.showDetails[testCase.id] = true;

        renderTesting();
    } catch (error) {
        console.error('Error running custom test:', error);
        showToast('Error running custom test: ' + error.message, 'error');
    }
}

// ========== EXPORTS ==========

export default {
    initTesting,
    destroyTesting,
    testingStyles
};
