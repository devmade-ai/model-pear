// ========== COMPLIANCE ANALYZER UI ==========
// User interface for the Compliance Analyzer module.
// Provides risk dashboard, accounting treatment summaries,
// tax impact analysis, and interactive checklists.
//
// Part of Phase 9 implementation - Module 3: Compliance Analyzer

import { getState, subscribe } from '../../state/app-state.js';
import {
    COMPLIANCE_CHECKLISTS,
    TRANSFER_PRICING_BENCHMARKS,
    ACCOUNTING_STANDARDS,
    calculateTransferPricingRisk,
    generateAccountingTreatment,
    generateTaxImpact,
    evaluateChecklist,
    evaluateOverallCompliance,
    generateComplianceReport
} from '../../models/intercompany/compliance-analyzer.js';
import { showToast } from '../../utils/index.js';

// ========== STATE ==========

let complianceState = {
    calculationResults: null,
    entityConfig: null,
    taxParams: null,
    checklistResponses: {},
    documentationStatus: {
        completedItems: 5,
        totalItems: 10,
        substanceScore: 70,
        comparabilityScore: 60,
        consistencyScore: 80
    },
    activeTab: 'dashboard',
    complianceReport: null
};

let containerRef = null;
let unsubscribe = null;

// ========== INITIALIZATION ==========

/**
 * Initialize the compliance analyzer UI
 * @param {HTMLElement} container - The container element
 * @param {Object} options - Configuration options
 */
export function initComplianceAnalyzer(container, options = {}) {
    containerRef = container;

    // Initialize state from options or app state
    const appState = getState();
    complianceState.calculationResults = options.calculationResults || appState.intercompany?.lastResults;
    complianceState.entityConfig = options.entityConfig || appState.intercompany?.entityConfig;
    complianceState.taxParams = options.taxParams || appState.intercompany?.taxParams;

    // Generate initial report if we have results
    if (complianceState.calculationResults) {
        generateReport();
    }

    // Subscribe to app state changes
    unsubscribe = subscribe((state) => {
        if (state.intercompany?.lastResults !== complianceState.calculationResults) {
            complianceState.calculationResults = state.intercompany?.lastResults;
            if (complianceState.calculationResults) {
                generateReport();
                renderComplianceAnalyzer();
            }
        }
    });

    renderComplianceAnalyzer();
}

/**
 * Update compliance analyzer with new calculation results
 * @param {Object} calculationResults - New calculation results
 */
export function updateComplianceResults(calculationResults) {
    complianceState.calculationResults = calculationResults;
    generateReport();
    renderComplianceAnalyzer();
}

/**
 * Destroy the compliance analyzer
 */
export function destroyComplianceAnalyzer() {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
    containerRef = null;
}

/**
 * Generate compliance report
 */
function generateReport() {
    if (!complianceState.calculationResults) return;

    complianceState.complianceReport = generateComplianceReport(
        complianceState.calculationResults,
        complianceState.entityConfig,
        complianceState.taxParams,
        complianceState.checklistResponses,
        complianceState.documentationStatus
    );
}

// ========== RENDER FUNCTIONS ==========

/**
 * Main render function
 */
function renderComplianceAnalyzer() {
    if (!containerRef) return;

    const hasResults = !!complianceState.calculationResults;
    const report = complianceState.complianceReport;

    containerRef.innerHTML = `
        <div class="compliance-analyzer">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-100">Compliance Analyzer</h2>
                    <p class="text-sm text-gray-400 mt-1">
                        Transfer pricing risk, accounting treatment, and compliance checklists
                    </p>
                </div>
                ${hasResults ? `
                    <button id="exportReportBtn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <span>Export Report</span>
                    </button>
                ` : ''}
            </div>

            ${hasResults ? renderTabs() : renderNoResults()}
        </div>
    `;

    setupEventListeners();
}

/**
 * Render no results message
 */
function renderNoResults() {
    return `
        <div class="bg-gray-700/50 rounded-lg p-8 text-center">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-lg font-medium text-gray-200 mb-2">No Calculation Results</h3>
            <p class="text-gray-400 mb-4">
                Run a model calculation first to generate compliance analysis.
            </p>
            <p class="text-sm text-gray-500">
                Select a model and variant from the calculator, then run calculations to see
                transfer pricing risk assessment, accounting treatment summaries, and compliance checklists.
            </p>
        </div>
    `;
}

/**
 * Render navigation tabs
 */
function renderTabs() {
    const tabs = [
        { id: 'dashboard', label: 'Risk Dashboard', icon: '📊' },
        { id: 'accounting', label: 'Accounting', icon: '📚' },
        { id: 'tax', label: 'Tax Impact', icon: '💰' },
        { id: 'checklists', label: 'Checklists', icon: '✓' }
    ];

    return `
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-700 mb-6">
            ${tabs.map(tab => `
                <button
                    class="tab-btn px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
                           ${complianceState.activeTab === tab.id
                               ? 'text-blue-400 border-blue-400'
                               : 'text-gray-400 border-transparent hover:text-gray-300'}"
                    data-tab="${tab.id}"
                >
                    <span class="mr-2">${tab.icon}</span>${tab.label}
                </button>
            `).join('')}
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
            ${renderTabContent()}
        </div>
    `;
}

/**
 * Render active tab content
 */
function renderTabContent() {
    switch (complianceState.activeTab) {
        case 'dashboard':
            return renderDashboard();
        case 'accounting':
            return renderAccountingTab();
        case 'tax':
            return renderTaxTab();
        case 'checklists':
            return renderChecklistsTab();
        default:
            return renderDashboard();
    }
}

/**
 * Render risk dashboard
 */
function renderDashboard() {
    const report = complianceState.complianceReport;
    if (!report) return '<p class="text-gray-400">Loading...</p>';

    const tpRisk = report.transferPricingRisk;
    const checklistEval = report.checklistEvaluation;

    return `
        <!-- Overall Score Card -->
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-6 border border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-medium text-gray-200 mb-1">Overall Compliance Score</h3>
                    <p class="text-sm text-gray-400">${report.metadata.modelId?.replace('model-', 'Model ')} - Variant ${report.metadata.variantId}</p>
                </div>
                <div class="text-right">
                    <div class="text-4xl font-bold text-${report.overallCompliance.statusColor}-400">
                        ${report.overallCompliance.score}%
                    </div>
                    <div class="text-sm text-${report.overallCompliance.statusColor}-400 font-medium">
                        ${report.overallCompliance.status}
                    </div>
                </div>
            </div>

            <!-- Score Gauge -->
            <div class="mt-4">
                <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        class="h-full transition-all duration-500 rounded-full bg-gradient-to-r
                               ${report.overallCompliance.score >= 80 ? 'from-green-500 to-green-400' :
                                 report.overallCompliance.score >= 60 ? 'from-yellow-500 to-yellow-400' :
                                 'from-red-500 to-red-400'}"
                        style="width: ${report.overallCompliance.score}%"
                    ></div>
                </div>
                <div class="flex justify-between mt-2 text-xs text-gray-500">
                    <span>High Risk</span>
                    <span>Medium Risk</span>
                    <span>Low Risk</span>
                </div>
            </div>
        </div>

        <!-- Risk Factor Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            ${renderRiskScoreCard('Transfer Pricing', tpRisk.score, tpRisk.level, tpRisk.method)}
            ${renderRiskScoreCard('Documentation', checklistEval.summary.overallScore,
                checklistEval.summary.overallStatus.toLowerCase().replace(' ', '-'),
                `${checklistEval.summary.completedItems}/${checklistEval.summary.totalItems} items`)}
        </div>

        <!-- Heat Map -->
        ${renderHeatMap(tpRisk, checklistEval)}

        <!-- Top Recommendations -->
        ${renderRecommendations(report.recommendations.slice(0, 5))}
    `;
}

/**
 * Render a risk score card
 */
function renderRiskScoreCard(title, score, level, subtitle) {
    const levelColors = {
        low: 'green',
        medium: 'yellow',
        high: 'red',
        compliant: 'green',
        'partially-compliant': 'yellow',
        'non-compliant': 'red'
    };
    const color = levelColors[level] || 'gray';

    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-medium text-gray-300">${title}</h4>
                <span class="text-2xl font-bold text-${color}-400">${score}%</span>
            </div>
            <div class="text-xs text-gray-500">${subtitle}</div>
            <div class="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-${color}-500 rounded-full" style="width: ${score}%"></div>
            </div>
        </div>
    `;
}

/**
 * Render heat map visualization
 */
function renderHeatMap(tpRisk, checklistEval) {
    const factors = tpRisk.factors || [];

    return `
        <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-300 mb-4">Risk Factor Analysis</h4>
            <div class="space-y-3">
                ${factors.map(factor => `
                    <div class="flex items-center gap-3">
                        <div class="w-32 text-sm text-gray-400 truncate" title="${factor.name}">${factor.name}</div>
                        <div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden relative">
                            <div
                                class="h-full transition-all duration-300
                                       ${factor.status === 'pass' ? 'bg-green-500/70' :
                                         factor.status === 'warning' ? 'bg-yellow-500/70' : 'bg-red-500/70'}"
                                style="width: ${factor.score}%"
                            ></div>
                            <div class="absolute inset-0 flex items-center justify-between px-3">
                                <span class="text-xs text-white font-medium">${factor.score}%</span>
                                <span class="text-xs text-white/70">${factor.detail}</span>
                            </div>
                        </div>
                        <div class="w-8 text-center">
                            ${factor.status === 'pass' ? '<span class="text-green-400">✓</span>' :
                              factor.status === 'warning' ? '<span class="text-yellow-400">!</span>' :
                              '<span class="text-red-400">✗</span>'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Render recommendations list
 */
function renderRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) {
        return `
            <div class="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                <div class="flex items-center gap-2 text-green-400">
                    <span>✓</span>
                    <span class="font-medium">No immediate action required</span>
                </div>
                <p class="text-sm text-gray-400 mt-1">All compliance factors are within acceptable parameters.</p>
            </div>
        `;
    }

    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-300 mb-4">Priority Recommendations</h4>
            <div class="space-y-3">
                ${recommendations.map(rec => `
                    <div class="flex items-start gap-3 p-3 rounded-lg
                                ${rec.priority === 'high' ? 'bg-red-900/20 border border-red-800/50' :
                                  rec.priority === 'medium' ? 'bg-yellow-900/20 border border-yellow-800/50' :
                                  'bg-gray-700/50'}">
                        <span class="${rec.priority === 'high' ? 'text-red-400' :
                                       rec.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'}">
                            ${rec.priority === 'high' ? '⚠' : rec.priority === 'medium' ? '!' : '○'}
                        </span>
                        <div class="flex-1">
                            <div class="text-sm text-gray-300">${rec.action}</div>
                            <div class="text-xs text-gray-500 mt-1">${rec.factor}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Render accounting treatment tab
 */
function renderAccountingTab() {
    const report = complianceState.complianceReport;
    if (!report) return '<p class="text-gray-400">Loading...</p>';

    const accounting = report.accountingTreatment;

    return `
        <div class="space-y-6">
            <!-- Developer Accounting -->
            ${renderAccountingSummary('Developer', accounting.developer)}

            <!-- Buyer Accounting -->
            ${renderAccountingSummary('Buyer', accounting.buyer)}

            ${accounting.consolidated ? `
                <!-- Consolidation -->
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 class="text-sm font-medium text-gray-200 mb-4 flex items-center gap-2">
                        <span>📊</span> Consolidation Adjustments
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-xs text-gray-500">Elimination Required</span>
                            <div class="text-gray-200">${accounting.consolidated.eliminationRequired ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500">Profit Eliminated</span>
                            <div class="text-gray-200">R${(accounting.consolidated.profitEliminated || 0).toLocaleString()}</div>
                        </div>
                    </div>
                    ${accounting.consolidated.journalEntry ? renderJournalEntry(accounting.consolidated.journalEntry) : ''}
                </div>
            ` : ''}

            <!-- Accounting Standards Reference -->
            ${renderAccountingStandards()}
        </div>
    `;
}

/**
 * Render accounting summary for an entity
 */
function renderAccountingSummary(entityType, data) {
    if (!data) return '';

    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-200 mb-4 flex items-center gap-2">
                <span>${entityType === 'Developer' ? '💻' : '🏢'}</span>
                ${data.entity || entityType} (${data.framework})
            </h4>

            <div class="space-y-4">
                ${entityType === 'Developer' ? `
                    <!-- Revenue -->
                    <div class="bg-gray-700/50 rounded p-3">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs text-gray-400">Revenue Recognition</span>
                            <span class="text-sm font-medium text-gray-200">R${(data.revenue?.amount || 0).toLocaleString()}</span>
                        </div>
                        <div class="text-xs text-gray-500">${data.revenue?.recognition || 'N/A'}</div>
                        <div class="text-xs text-blue-400 mt-1">Timing: ${data.revenue?.timing || 'N/A'}</div>
                    </div>
                ` : ''}

                <!-- Asset -->
                <div class="bg-gray-700/50 rounded p-3">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs text-gray-400">Asset Recognition</span>
                        <span class="text-sm font-medium text-gray-200">
                            ${data.asset?.recognised ? `R${(data.asset.capitalised || data.asset.carryingValue || 0).toLocaleString()}` : 'Not recognised'}
                        </span>
                    </div>
                    ${data.asset?.recognised ? `
                        <div class="grid grid-cols-2 gap-2 text-xs mt-2">
                            <div><span class="text-gray-500">Capitalised:</span> <span class="text-gray-300">R${(data.asset.capitalised || 0).toLocaleString()}</span></div>
                            <div><span class="text-gray-500">Expensed:</span> <span class="text-gray-300">R${(data.asset.expensed || 0).toLocaleString()}</span></div>
                            <div><span class="text-gray-500">Useful Life:</span> <span class="text-gray-300">${data.asset.usefulLife || 'N/A'} years</span></div>
                            <div><span class="text-gray-500">Amortisation:</span> <span class="text-gray-300">R${(data.asset.annualAmortisation || 0).toLocaleString()}/yr</span></div>
                        </div>
                    ` : `
                        <div class="text-xs text-gray-500">${data.asset?.reason || 'N/A'}</div>
                    `}
                </div>

                <!-- Tax -->
                <div class="bg-gray-700/50 rounded p-3">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs text-gray-400">Tax Position</span>
                        <span class="text-sm font-medium text-${entityType === 'Developer' ? 'red' : 'green'}-400">
                            ${entityType === 'Developer'
                                ? `R${(data.tax?.corporateTax || 0).toLocaleString()} payable`
                                : `R${(data.tax?.taxBenefit || 0).toLocaleString()} benefit`}
                        </span>
                    </div>
                    ${entityType === 'Buyer' && data.tax?.section11eType ? `
                        <div class="text-xs text-gray-500">
                            Tax Write-Off: ${data.tax.section11eType === 'pc-2yr' ? 'Standard Software (2 years)' : 'Complex Systems (5 years)'}
                        </div>
                    ` : ''}
                    ${(data.tax?.deferredTax?.asset > 0 || data.tax?.deferredTax?.liability > 0) ? `
                        <div class="text-xs text-blue-400 mt-1">
                            DTA: R${(data.tax.deferredTax.asset || 0).toLocaleString()} |
                            DTL: R${(data.tax.deferredTax.liability || 0).toLocaleString()}
                        </div>
                    ` : ''}
                </div>

                <!-- Complex Issues -->
                ${data.complexIssues && data.complexIssues.length > 0 ? `
                    <div class="border-t border-gray-700 pt-3 mt-3">
                        <span class="text-xs text-yellow-400 font-medium">Complex Issues:</span>
                        <div class="space-y-2 mt-2">
                            ${data.complexIssues.map(issue => `
                                <div class="text-xs bg-yellow-900/20 border border-yellow-800/30 rounded p-2">
                                    <div class="text-yellow-300">${issue.issue} (${issue.standard})</div>
                                    <div class="text-gray-400 mt-1">${issue.detail}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Key Standards -->
                <div class="flex gap-2 flex-wrap">
                    ${(data.keyStandards || []).map(std => `
                        <span class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">${std}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render a journal entry
 */
function renderJournalEntry(entry) {
    if (!entry || !entry.entries) {
        // Handle legacy format
        if (entry?.debit && entry?.credit) {
            return `
                <div class="mt-3 bg-gray-900 rounded p-3">
                    <div class="text-xs text-gray-400 mb-2">Journal Entry:</div>
                    <div class="font-mono text-xs space-y-1">
                        <div class="text-gray-300">DR ${entry.debit.account} <span class="float-right">R${(entry.debit.amount || 0).toLocaleString()}</span></div>
                        <div class="text-gray-300 pl-4">CR ${entry.credit.account} <span class="float-right">R${(entry.credit.amount || 0).toLocaleString()}</span></div>
                        ${entry.credit2 ? `<div class="text-gray-300 pl-4">CR ${entry.credit2.account} <span class="float-right">R${(entry.credit2.amount || 0).toLocaleString()}</span></div>` : ''}
                    </div>
                </div>
            `;
        }
        return '';
    }

    return `
        <div class="mt-3 bg-gray-900 rounded p-3">
            <div class="text-xs text-gray-400 mb-2">${entry.description || 'Journal Entry'}:</div>
            <div class="font-mono text-xs space-y-1">
                ${entry.entries.map(e => `
                    <div class="text-gray-300 ${e.debitCredit === 'CR' ? 'pl-4' : ''}">
                        ${e.debitCredit} ${e.account}
                        <span class="float-right">R${(e.amount || 0).toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Render accounting standards reference
 */
function renderAccountingStandards() {
    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-200 mb-4">Key Accounting Standards Reference</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h5 class="text-xs font-medium text-gray-400 mb-2">Developer Standards</h5>
                    ${Object.entries(ACCOUNTING_STANDARDS.developer).map(([key, std]) => `
                        <div class="text-xs mb-2">
                            <span class="text-blue-400">${std.standard}</span>
                            <span class="text-gray-400"> - ${std.title}</span>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h5 class="text-xs font-medium text-gray-400 mb-2">Buyer Standards</h5>
                    ${Object.entries(ACCOUNTING_STANDARDS.buyer).map(([key, std]) => `
                        <div class="text-xs mb-2">
                            <span class="text-blue-400">${std.standard}</span>
                            <span class="text-gray-400"> - ${std.title}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render tax impact tab
 */
function renderTaxTab() {
    const report = complianceState.complianceReport;
    if (!report) return '<p class="text-gray-400">Loading...</p>';

    const tax = report.taxImpact;

    return `
        <div class="space-y-6">
            <!-- Tax Summary -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-200 mb-4">Tax Summary</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-700/50 rounded p-3 text-center">
                        <div class="text-xs text-gray-500 mb-1">Developer Tax</div>
                        <div class="text-lg font-medium text-red-400">R${(tax.summary.developerTaxPayable || 0).toLocaleString()}</div>
                    </div>
                    <div class="bg-gray-700/50 rounded p-3 text-center">
                        <div class="text-xs text-gray-500 mb-1">Buyer Tax Benefit</div>
                        <div class="text-lg font-medium text-green-400">R${(tax.summary.buyerTaxBenefit || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <!-- Section 11(e) Schedule -->
            ${tax.section11e ? renderSection11eSchedule(tax.section11e) : ''}

            <!-- CGT Analysis -->
            ${tax.cgt?.applicable ? renderCGTAnalysis(tax.cgt) : ''}

            <!-- Timing Differences -->
            ${tax.timingDifferences?.differences?.length > 0 ? renderTimingDifferences(tax.timingDifferences) : ''}

            <!-- Deferred Tax Summary -->
            ${renderDeferredTaxSummary(tax.deferredTax)}

            <!-- Net Position Analysis -->
            ${renderNetPositionAnalysis(tax.netPosition)}
        </div>
    `;
}

/**
 * Render Section 11(e) schedule
 */
function renderSection11eSchedule(data) {
    if (!data) return '';

    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-200 mb-4">Section 11(e) Deduction Schedule</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                    <span class="text-xs text-gray-500">Classification</span>
                    <div class="text-sm text-gray-200">${data.type}</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">Capitalised Amount</span>
                    <div class="text-sm text-gray-200">R${data.capitalisedAmount.toLocaleString()}</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">Annual Deduction</span>
                    <div class="text-sm text-gray-200">R${data.annualDeduction.toLocaleString()}</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">Total Tax Benefit</span>
                    <div class="text-sm text-green-400">R${data.totalTaxBenefit.toLocaleString()}</div>
                </div>
            </div>

            <!-- Schedule Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="text-left py-2 text-gray-400">Year</th>
                            <th class="text-right py-2 text-gray-400">Opening</th>
                            <th class="text-right py-2 text-gray-400">Deduction</th>
                            <th class="text-right py-2 text-gray-400">Tax Benefit</th>
                            <th class="text-right py-2 text-gray-400">Closing</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.schedule.map(row => `
                            <tr class="border-b border-gray-700/50">
                                <td class="py-2 text-gray-300">Year ${row.year}</td>
                                <td class="py-2 text-right text-gray-300">R${row.openingBalance.toLocaleString()}</td>
                                <td class="py-2 text-right text-gray-300">R${row.deduction.toLocaleString()}</td>
                                <td class="py-2 text-right text-green-400">R${row.taxBenefit.toLocaleString()}</td>
                                <td class="py-2 text-right text-gray-300">R${row.closingBalance.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Render CGT analysis
 */
function renderCGTAnalysis(cgt) {
    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-200 mb-4">Capital Gains Tax Analysis</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <span class="text-xs text-gray-500">Capital Gain</span>
                    <div class="text-sm text-gray-200">R${cgt.capitalGain.toLocaleString()}</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">Inclusion Rate</span>
                    <div class="text-sm text-gray-200">${cgt.inclusionRate}%</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">Included Gain</span>
                    <div class="text-sm text-gray-200">R${cgt.includedGain.toLocaleString()}</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">Effective CGT Rate</span>
                    <div class="text-sm text-gray-200">${cgt.effectiveRate.toFixed(1)}%</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">CGT Payable</span>
                    <div class="text-sm text-red-400">R${cgt.cgtPayable.toLocaleString()}</div>
                </div>
                <div>
                    <span class="text-xs text-gray-500">Saving vs Revenue</span>
                    <div class="text-sm text-green-400">R${cgt.comparison.saving.toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render timing differences analysis
 */
function renderTimingDifferences(data) {
    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-200 mb-4">Timing Differences</h4>
            <div class="space-y-3">
                ${data.differences.map(diff => `
                    <div class="bg-gray-700/50 rounded p-3">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="text-sm text-gray-200">${diff.entity}</span>
                                <span class="text-xs text-gray-500 ml-2">${diff.type}</span>
                            </div>
                            <span class="text-sm font-medium ${diff.deferredTaxType === 'Deferred Tax Asset' ? 'text-blue-400' : 'text-orange-400'}">
                                R${diff.deferredTaxEffect.toLocaleString()}
                            </span>
                        </div>
                        <div class="text-xs text-gray-400 mt-2">${diff.explanation}</div>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-between mt-4 pt-4 border-t border-gray-700">
                <div class="text-xs">
                    <span class="text-gray-500">Total DTA:</span>
                    <span class="text-blue-400 ml-2">R${data.totalDTA.toLocaleString()}</span>
                </div>
                <div class="text-xs">
                    <span class="text-gray-500">Total DTL:</span>
                    <span class="text-orange-400 ml-2">R${data.totalDTL.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render deferred tax summary
 */
function renderDeferredTaxSummary(data) {
    if (!data) return '';

    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-200 mb-4">Deferred Tax Summary</h4>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h5 class="text-xs text-gray-500 mb-2">Developer</h5>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">DTA</span>
                        <span class="text-blue-400">R${(data.developer?.asset || 0).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">DTL</span>
                        <span class="text-orange-400">R${(data.developer?.liability || 0).toLocaleString()}</span>
                    </div>
                </div>
                <div>
                    <h5 class="text-xs text-gray-500 mb-2">Buyer</h5>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">DTA</span>
                        <span class="text-blue-400">R${(data.buyer?.asset || 0).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">DTL</span>
                        <span class="text-orange-400">R${(data.buyer?.liability || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render net position analysis
 */
function renderNetPositionAnalysis(data) {
    if (!data) return '';

    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h4 class="text-sm font-medium text-gray-200 mb-4">Net Tax Position</h4>
            <div class="mb-4">
                <p class="text-sm text-gray-400">${data.analysis}</p>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-gray-700/50 rounded p-3 text-center">
                    <div class="text-xs text-gray-500 mb-1">Developer Cash</div>
                    <div class="text-sm font-medium text-gray-200">R${(data.cashFlowImpact?.developer || 0).toLocaleString()}</div>
                </div>
                <div class="bg-gray-700/50 rounded p-3 text-center">
                    <div class="text-xs text-gray-500 mb-1">Buyer Cash</div>
                    <div class="text-sm font-medium text-gray-200">R${(data.cashFlowImpact?.buyer || 0).toLocaleString()}</div>
                </div>
                <div class="bg-gray-700/50 rounded p-3 text-center">
                    <div class="text-xs text-gray-500 mb-1">Group Net</div>
                    <div class="text-sm font-medium text-green-400">R${(data.cashFlowImpact?.group || 0).toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render checklists tab
 */
function renderChecklistsTab() {
    const report = complianceState.complianceReport;
    const evaluation = report?.checklistEvaluation;

    return `
        <div class="space-y-6">
            <!-- Overall Status -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-medium text-gray-200">Documentation Status</h4>
                        <p class="text-xs text-gray-500 mt-1">
                            ${evaluation?.summary.completedItems || 0} of ${evaluation?.summary.totalItems || 0} items complete
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-${evaluation?.summary.statusColor || 'gray'}-400">
                            ${evaluation?.summary.overallScore || 0}%
                        </div>
                        <div class="text-xs text-${evaluation?.summary.statusColor || 'gray'}-400">
                            ${evaluation?.summary.overallStatus || 'Unknown'}
                        </div>
                    </div>
                </div>
                <div class="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-${evaluation?.summary.statusColor || 'gray'}-500 rounded-full"
                        style="width: ${evaluation?.summary.overallScore || 0}%"
                    ></div>
                </div>
            </div>

            <!-- Individual Checklists -->
            ${Object.keys(COMPLIANCE_CHECKLISTS).map(checklistId =>
                renderChecklist(checklistId, evaluation?.evaluations?.[checklistId])
            ).join('')}
        </div>
    `;
}

/**
 * Render an individual checklist
 */
function renderChecklist(checklistId, evaluation) {
    const checklist = COMPLIANCE_CHECKLISTS[checklistId];
    if (!checklist) return '';

    const isExpanded = true; // Can add collapse state later

    return `
        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <!-- Header -->
            <div class="p-4 bg-gray-700/30 flex items-center justify-between cursor-pointer checklist-header" data-checklist="${checklistId}">
                <div>
                    <h4 class="text-sm font-medium text-gray-200">${checklist.name}</h4>
                    <p class="text-xs text-gray-500">${checklist.description}</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm ${
                        (evaluation?.summary.completionRate || 0) >= 80 ? 'text-green-400' :
                        (evaluation?.summary.completionRate || 0) >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }">
                        ${evaluation?.summary.completed || 0}/${evaluation?.summary.total || checklist.items.length}
                    </span>
                </div>
            </div>

            <!-- Items -->
            <div class="p-4 space-y-2 checklist-body" data-checklist="${checklistId}">
                ${checklist.items.map(item => {
                    const isChecked = complianceState.checklistResponses[checklistId]?.[item.id] === true;
                    return `
                        <label class="flex items-start gap-3 p-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                class="checklist-item mt-0.5 w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                data-checklist="${checklistId}"
                                data-item="${item.id}"
                                ${isChecked ? 'checked' : ''}
                            >
                            <div class="flex-1">
                                <span class="text-sm text-gray-300 ${isChecked ? 'line-through opacity-60' : ''}">${item.text}</span>
                                ${item.critical ? '<span class="ml-2 px-1.5 py-0.5 bg-red-900/50 text-red-400 text-xs rounded">Critical</span>' : ''}
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerRef) return;

    // Tab navigation
    containerRef.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn');
        if (tabBtn) {
            complianceState.activeTab = tabBtn.dataset.tab;
            renderComplianceAnalyzer();
        }

        // Export button
        if (e.target.closest('#exportReportBtn')) {
            handleExportReport();
        }
    });

    // Checklist item changes
    containerRef.addEventListener('change', (e) => {
        if (e.target.classList.contains('checklist-item')) {
            handleChecklistChange(e.target);
        }
    });
}

/**
 * Handle checklist item change
 */
function handleChecklistChange(checkbox) {
    const checklistId = checkbox.dataset.checklist;
    const itemId = checkbox.dataset.item;
    const isChecked = checkbox.checked;

    // Update state
    if (!complianceState.checklistResponses[checklistId]) {
        complianceState.checklistResponses[checklistId] = {};
    }
    complianceState.checklistResponses[checklistId][itemId] = isChecked;

    // Update documentation status for TP risk
    const totalChecked = Object.values(complianceState.checklistResponses)
        .reduce((sum, checklist) =>
            sum + Object.values(checklist).filter(v => v === true).length, 0);
    const totalItems = Object.values(COMPLIANCE_CHECKLISTS)
        .reduce((sum, checklist) => sum + checklist.items.length, 0);

    complianceState.documentationStatus.completedItems = totalChecked;
    complianceState.documentationStatus.totalItems = totalItems;

    // Regenerate report
    generateReport();

    // Update UI without full re-render (just update relevant parts)
    renderComplianceAnalyzer();
}

/**
 * Handle export report
 */
function handleExportReport() {
    const report = complianceState.complianceReport;
    if (!report) {
        showToast('No report to export', 'error');
        return;
    }

    // Generate printable report
    const printContent = generatePrintableReport(report);

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    showToast('Report opened in new window', 'success');
}

/**
 * Generate printable HTML report
 */
function generatePrintableReport(report) {
    const date = new Date().toLocaleDateString('en-ZA', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Compliance Report - ${report.metadata.modelId}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1, h2, h3 { color: #333; }
                .score { font-size: 24px; font-weight: bold; }
                .score.green { color: #22c55e; }
                .score.yellow { color: #eab308; }
                .score.red { color: #ef4444; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f5f5f5; }
                .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
                .checklist-item { padding: 5px 0; }
                .critical { color: red; font-weight: bold; }
                @media print { body { max-width: none; } }
            </style>
        </head>
        <body>
            <h1>Inter-Company Transaction Compliance Report</h1>
            <p>Generated: ${date}</p>
            <p>Model: ${report.metadata.modelId?.replace('model-', 'Model ')} - Variant ${report.metadata.variantId}</p>

            <div class="section">
                <h2>Overall Compliance Score</h2>
                <p class="score ${report.overallCompliance.statusColor}">${report.overallCompliance.score}% - ${report.overallCompliance.status}</p>
            </div>

            <div class="section">
                <h2>Transfer Pricing Risk Assessment</h2>
                <p>Score: ${report.transferPricingRisk.score}% (${report.transferPricingRisk.level} risk)</p>
                <p>Method: ${report.transferPricingRisk.method}</p>
                <p>Margin: ${report.transferPricingRisk.actualMargin}% vs Benchmark ${report.transferPricingRisk.benchmark.min}-${report.transferPricingRisk.benchmark.max}%</p>
            </div>

            <div class="section">
                <h2>Tax Impact Summary</h2>
                <table>
                    <tr><th>Developer Tax Payable</th><td>R${report.taxImpact.summary.developerTaxPayable.toLocaleString()}</td></tr>
                    <tr><th>Buyer Tax Benefit</th><td>R${report.taxImpact.summary.buyerTaxBenefit.toLocaleString()}</td></tr>
                </table>
            </div>

            <div class="section">
                <h2>Compliance Checklists</h2>
                ${Object.entries(report.checklistEvaluation.evaluations).map(([id, evaluation]) => `
                    <h3>${evaluation.name}</h3>
                    <p>${evaluation.summary.completed}/${evaluation.summary.total} items complete (${evaluation.summary.completionRate}%)</p>
                    ${evaluation.items.filter(i => !i.completed).map(i => `
                        <div class="checklist-item ${i.critical ? 'critical' : ''}">
                            [ ] ${i.text} ${i.critical ? '(Critical)' : ''}
                        </div>
                    `).join('')}
                `).join('')}
            </div>

            <div class="section">
                <h2>Recommendations</h2>
                ${report.recommendations.map(rec => `
                    <p><strong>${rec.priority.toUpperCase()}:</strong> ${rec.action} (${rec.factor})</p>
                `).join('')}
            </div>
        </body>
        </html>
    `;
}

// ========== EXPORTS ==========

export default {
    initComplianceAnalyzer,
    updateComplianceResults,
    destroyComplianceAnalyzer
};
