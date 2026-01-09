// ========== TESTING UTILITIES ==========
// Pre-defined test cases for validating intercompany model calculations.
// Each test case includes inputs, expected outputs, and tolerance for comparison.

import { calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './registry.js';

// ========== TEST CASE DEFINITIONS ==========

/**
 * Test cases for Model 1: Cost-Plus Development Services
 */
const MODEL_1_TESTS = [
    {
        id: 'model1-1a-basic',
        name: 'Model 1A: Pure Cost Reimbursement - Basic',
        description: 'Verify zero markup calculation',
        modelId: 'model-1',
        variantId: '1A',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1000000,
                'profit.gross': 0,
                'profit.margin': 0,
                'tax.taxPayable': 0
            },
            buyer: {
                'asset.capitalised': 800000,
                'asset.expensed': 200000,
                'asset.annualAmortisation': 160000
            }
        },
        tolerance: 0.01  // 1% tolerance for floating point
    },
    {
        id: 'model1-1b-standard',
        name: 'Model 1B: Cost-Plus Fixed Margin - 10%',
        description: 'Verify standard cost-plus calculation with 10% markup',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1100000,
                'profit.gross': 100000,
                'profit.margin': 10,
                'tax.taxPayable': 27000
            },
            buyer: {
                'asset.capitalised': 800000
            },
            transferPricing: {
                'withinRange': true,
                'riskLevel': 'low'
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1b-high-margin',
        name: 'Model 1B: Cost-Plus High Margin - 25%',
        description: 'Verify transfer pricing risk increases with high margin',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 25,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1250000,
                'profit.gross': 250000,
                'profit.margin': 25
            },
            transferPricing: {
                'withinRange': false,
                'riskLevel': 'high'
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1c-milestone',
        name: 'Model 1C: Cost-Plus with Milestone Bonus',
        description: 'Verify milestone bonus is included in revenue',
        modelId: 'model-1',
        variantId: '1C',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            milestoneBonus: 100000,
            milestoneProbability: 80,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                // Base: 1,000,000 * 1.1 = 1,100,000 + (100,000 * 80%) = 1,180,000
                'revenue.total': 1180000,
                'profit.gross': 180000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1d-fixed-price',
        name: 'Model 1D: Fixed Price Development',
        description: 'Verify fixed price calculation with cost variance',
        modelId: 'model-1',
        variantId: '1D',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            fixedPrice: 1200000,
            estimatedCostVariance: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 1200000,
                // Costs with 10% variance: 1,000,000 * 1.1 = 1,100,000
                // Profit: 1,200,000 - 1,100,000 = 100,000
                'profit.gross': 100000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1e-time-materials',
        name: 'Model 1E: Time and Materials',
        description: 'Verify T&M calculation with hourly rates',
        modelId: 'model-1',
        variantId: '1E',
        inputs: {
            projectName: 'Test Project',
            developerHours: 2000,
            hourlyRate: 500,
            hourlyMarkup: 25,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                // Revenue: 2000 * 500 = 1,000,000
                'revenue.total': 1000000,
                // Cost: 1,000,000 / 1.25 = 800,000
                // Profit: 1,000,000 - 800,000 = 200,000
                'profit.gross': 200000,
                'profit.margin': 25
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-1f-dedicated-team',
        name: 'Model 1F: Dedicated Development Team',
        description: 'Verify retainer-based calculation',
        modelId: 'model-1',
        variantId: '1F',
        inputs: {
            projectName: 'Test Project',
            monthlyRetainer: 250000,
            contractMonths: 12,
            monthlyCost: 200000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                // Revenue: 250,000 * 12 = 3,000,000
                'revenue.total': 3000000,
                // Cost: 200,000 * 12 = 2,400,000
                // Profit: 600,000
                'profit.gross': 600000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-tax-calculation',
        name: 'Model 1B: Tax Calculation Verification',
        description: 'Verify corporate tax is calculated correctly',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 500000,
            researchPhaseCost: 100000,
            developmentPhaseCost: 400000,
            markupPercentage: 20,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                // Revenue: 500,000 * 1.2 = 600,000
                'revenue.total': 600000,
                // Profit: 100,000
                'profit.gross': 100000,
                // Tax: 100,000 * 27% = 27,000
                'tax.taxPayable': 27000,
                // Net profit: 73,000
                'profit.net': 73000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-buyer-amortisation',
        name: 'Model 1B: Buyer Amortisation Schedule',
        description: 'Verify amortisation calculations over useful life',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 0,
            developmentPhaseCost: 1000000,
            markupPercentage: 10,
            usefulLife: 4,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            buyer: {
                'asset.capitalised': 1000000,
                'asset.usefulLife': 4,
                // Annual amortisation: 1,000,000 / 4 = 250,000
                'asset.annualAmortisation': 250000,
                'asset.section11eYears': 2,
                // Tax depreciation: 1,000,000 / 2 = 500,000
                'tax.section11eDeduction': 500000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'model1-deferred-tax',
        name: 'Model 1B: Deferred Tax Calculation',
        description: 'Verify deferred tax from timing differences',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 0,
            developmentPhaseCost: 1000000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            buyer: {
                // Accounting amort: 1,000,000 / 5 = 200,000
                'tax.accountingAmortisation': 200000,
                // Tax deduction: 1,000,000 / 2 = 500,000
                'tax.section11eDeduction': 500000,
                // Timing diff: 200,000 - 500,000 = -300,000
                'tax.timingDifference': -300000,
                // DT liability: 300,000 * 27% = 81,000
                'tax.deferredTaxLiability': 81000
            }
        },
        tolerance: 0.01
    }
];

/**
 * Test cases for Model 2: Software Licence with Royalties
 */
const MODEL_2_TESTS = [
    {
        id: 'model2-2a-basic',
        name: 'Model 2A: Basic Perpetual Licence',
        description: 'Verify perpetual licence with annual royalty',
        modelId: 'model-2',
        variantId: '2A',
        inputs: {
            projectName: 'Software Licence',
            upfrontLicenceFee: 500000,
            developmentCost: 200000,
            annualRoyaltyRate: 10,
            estimatedBuyerRevenue: 2000000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 700000  // 500,000 + (2,000,000 * 10%)
            }
        },
        tolerance: 0.05
    }
];

/**
 * Test cases for Model 3: Joint Development
 */
const MODEL_3_TESTS = [
    {
        id: 'model3-3a-equal-split',
        name: 'Model 3A: Equal Cost-Sharing',
        description: 'Verify 50/50 cost sharing arrangement',
        modelId: 'model-3',
        variantId: '3A',
        inputs: {
            projectName: 'Joint Project',
            totalDevelopmentCost: 1000000,
            developerContribution: 500000,
            buyerContribution: 500000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'ownership.percentage': 50
            },
            buyer: {
                'ownership.percentage': 50
            }
        },
        tolerance: 0.01
    }
];

/**
 * Test cases for edge cases and boundary conditions
 */
const EDGE_CASE_TESTS = [
    {
        id: 'edge-zero-cost',
        name: 'Edge Case: Zero Development Cost',
        description: 'Verify handling of zero cost input',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 0,
            researchPhaseCost: 0,
            developmentPhaseCost: 0,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 0,
                'profit.gross': 0,
                'tax.taxPayable': 0
            },
            buyer: {
                'asset.capitalised': 0,
                'asset.annualAmortisation': 0
            }
        },
        tolerance: 0.01
    },
    {
        id: 'edge-100-margin',
        name: 'Edge Case: 100% Markup',
        description: 'Verify high margin calculation',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 100,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        expected: {
            developer: {
                'revenue.total': 2000000,
                'profit.gross': 1000000,
                'profit.margin': 100
            },
            transferPricing: {
                'withinRange': false,
                'riskLevel': 'high'
            }
        },
        tolerance: 0.01
    },
    {
        id: 'edge-mainframe-depreciation',
        name: 'Edge Case: 5-Year Mainframe Depreciation',
        description: 'Verify 5-year Section 11(e) calculation',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Mainframe System',
            developmentCost: 1000000,
            researchPhaseCost: 0,
            developmentPhaseCost: 1000000,
            markupPercentage: 10,
            usefulLife: 10,
            section11eType: 'mainframe-5yr',
            corporateTaxRate: 27
        },
        expected: {
            buyer: {
                'asset.section11eYears': 5,
                // Tax depreciation: 1,000,000 / 5 = 200,000
                'tax.section11eDeduction': 200000
            }
        },
        tolerance: 0.01
    },
    {
        id: 'edge-custom-tax-rate',
        name: 'Edge Case: Custom Tax Rate (25%)',
        description: 'Verify non-default tax rate calculation',
        modelId: 'model-1',
        variantId: '1B',
        inputs: {
            projectName: 'Test Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 25
        },
        expected: {
            developer: {
                'revenue.total': 1100000,
                'profit.gross': 100000,
                // Tax: 100,000 * 25% = 25,000
                'tax.taxPayable': 25000,
                'profit.net': 75000
            }
        },
        tolerance: 0.01
    }
];

// ========== ALL TEST CASES ==========

export const ALL_TEST_CASES = [
    ...MODEL_1_TESTS,
    ...MODEL_2_TESTS,
    ...MODEL_3_TESTS,
    ...EDGE_CASE_TESTS
];

// ========== TEST RUNNER ==========

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'developer.revenue.total')
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

/**
 * Compare two values with tolerance for numeric values
 */
function compareValues(actual, expected, tolerance = 0.01) {
    if (typeof expected === 'number' && typeof actual === 'number') {
        if (expected === 0) {
            return Math.abs(actual) < tolerance;
        }
        const diff = Math.abs(actual - expected) / Math.abs(expected);
        return diff <= tolerance;
    }
    if (typeof expected === 'boolean') {
        return actual === expected;
    }
    if (typeof expected === 'string') {
        return actual === expected;
    }
    return actual === expected;
}

/**
 * Run a single test case
 * @param {Object} testCase - Test case definition
 * @param {Object} entityConfig - Entity configuration (optional)
 * @param {Object} taxParams - Tax parameters (optional)
 * @returns {Object} Test result with pass/fail status and details
 */
export function runTest(testCase, entityConfig = DEFAULT_ENTITY_CONFIG, taxParams = DEFAULT_TAX_PARAMS) {
    const startTime = performance.now();

    const result = {
        id: testCase.id,
        name: testCase.name,
        description: testCase.description,
        modelId: testCase.modelId,
        variantId: testCase.variantId,
        passed: true,
        assertions: [],
        error: null,
        duration: 0
    };

    try {
        // Run the calculation
        const calcResult = calculateIntercompany(
            testCase.modelId,
            testCase.variantId,
            testCase.inputs,
            entityConfig,
            taxParams
        );

        // Check each expected value
        for (const [perspective, expectations] of Object.entries(testCase.expected)) {
            const perspectiveData = calcResult[perspective];

            if (!perspectiveData) {
                result.assertions.push({
                    path: perspective,
                    expected: 'exists',
                    actual: 'undefined',
                    passed: false,
                    message: `Perspective "${perspective}" not found in results`
                });
                result.passed = false;
                continue;
            }

            for (const [path, expectedValue] of Object.entries(expectations)) {
                const actualValue = getNestedValue(perspectiveData, path);
                const passed = compareValues(actualValue, expectedValue, testCase.tolerance);

                result.assertions.push({
                    path: `${perspective}.${path}`,
                    expected: expectedValue,
                    actual: actualValue,
                    passed: passed,
                    message: passed ? 'OK' : `Expected ${expectedValue}, got ${actualValue}`
                });

                if (!passed) {
                    result.passed = false;
                }
            }
        }

        // Store the full result for debugging
        result.calculationResult = calcResult;

    } catch (error) {
        result.passed = false;
        result.error = {
            message: error.message,
            stack: error.stack
        };
    }

    result.duration = performance.now() - startTime;
    return result;
}

/**
 * Run all test cases
 * @param {Array} testCases - Array of test cases (defaults to ALL_TEST_CASES)
 * @param {Object} options - Options for test run
 * @returns {Object} Summary of test results
 */
export function runAllTests(testCases = ALL_TEST_CASES, options = {}) {
    const startTime = performance.now();
    const results = [];

    const entityConfig = options.entityConfig || DEFAULT_ENTITY_CONFIG;
    const taxParams = options.taxParams || DEFAULT_TAX_PARAMS;

    for (const testCase of testCases) {
        const result = runTest(testCase, entityConfig, taxParams);
        results.push(result);
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const errors = results.filter(r => r.error).length;

    return {
        summary: {
            total: results.length,
            passed,
            failed,
            errors,
            passRate: results.length > 0 ? (passed / results.length) * 100 : 0,
            duration: performance.now() - startTime
        },
        results,
        timestamp: new Date().toISOString()
    };
}

/**
 * Run tests for a specific model
 * @param {string} modelId - Model ID to test
 * @returns {Object} Test results for the model
 */
export function runModelTests(modelId) {
    const modelTests = ALL_TEST_CASES.filter(tc => tc.modelId === modelId);
    return runAllTests(modelTests);
}

/**
 * Get test cases grouped by model
 * @returns {Object} Test cases grouped by model ID
 */
export function getTestsByModel() {
    const grouped = {};
    for (const testCase of ALL_TEST_CASES) {
        if (!grouped[testCase.modelId]) {
            grouped[testCase.modelId] = [];
        }
        grouped[testCase.modelId].push(testCase);
    }
    return grouped;
}

/**
 * Get test case by ID
 * @param {string} testId - Test case ID
 * @returns {Object|null} Test case or null if not found
 */
export function getTestById(testId) {
    return ALL_TEST_CASES.find(tc => tc.id === testId) || null;
}

/**
 * Create a custom test case from inputs
 * @param {Object} config - Test case configuration
 * @returns {Object} Test case object
 */
export function createTestCase(config) {
    return {
        id: config.id || `custom-${Date.now()}`,
        name: config.name || 'Custom Test',
        description: config.description || '',
        modelId: config.modelId,
        variantId: config.variantId,
        inputs: config.inputs,
        expected: config.expected || {},
        tolerance: config.tolerance || 0.01
    };
}

// ========== EXPORTS ==========

export default {
    ALL_TEST_CASES,
    MODEL_1_TESTS,
    MODEL_2_TESTS,
    MODEL_3_TESTS,
    EDGE_CASE_TESTS,
    runTest,
    runAllTests,
    runModelTests,
    getTestsByModel,
    getTestById,
    createTestCase
};
