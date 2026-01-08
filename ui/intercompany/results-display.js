// ========== TRANSACTION RESULTS DISPLAY ==========
// Renders calculation results for the three perspectives:
// - Your Company (Developer): Revenue, costs, profit, tax
// - Client (Buyer): Asset capitalization, amortization, tax benefits
// - Net Effect: Combined financial impact for decision-making
// Formats financial data with South African conventions.

import { getState, subscribe } from '../../state/app-state.js';
import { formatCurrency, formatPercentage, formatNumber } from '../../utils/index.js';

// ========== MAIN RENDER FUNCTION ==========

/**
 * Render results based on current perspective
 */
export function renderIntercompanyResults(container, results) {
    if (!container || !results) return;

    const state = getState();
    const perspective = state.intercompany.currentPerspective || 'combined';

    container.innerHTML = '';

    switch (perspective) {
        case 'developer':
            renderDeveloperPerspective(container, results);
            break;
        case 'buyer':
            renderBuyerPerspective(container, results);
            break;
        case 'combined':
        default:
            renderCombinedPerspective(container, results);
            break;
    }

    // Add metadata footer
    renderMetadataFooter(container, results.metadata);
}

// ========== DEVELOPER PERSPECTIVE ==========

function renderDeveloperPerspective(container, results) {
    const dev = results.developer;
    const tp = results.transferPricing;

    container.innerHTML = `
        <!-- Your Company Summary Header -->
        <div class="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">💻</span>
                <h3 class="text-xl font-bold text-blue-300">Your Company (Developer)</h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${renderMetricCard('Total Revenue', formatCurrency(dev.revenue.total), 'text-green-400')}
                ${renderMetricCard('Total Costs', formatCurrency(dev.costs.total), 'text-gray-400')}
                ${renderMetricCard('Gross Profit', formatCurrency(dev.profit.gross), 'text-blue-400')}
                ${renderMetricCard('Margin', formatPercentage(dev.profit.margin), dev.profit.margin >= 5 ? 'text-green-400' : 'text-yellow-400')}
            </div>
        </div>

        <!-- Revenue Recognition -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>📊</span> Revenue Recognition
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p class="text-sm text-gray-400 mb-2">Recognition Timing</p>
                    <p class="text-lg font-medium text-gray-200">${dev.revenue.recognitionTiming === 'over-time' ? 'Over Time' : 'Point in Time'}</p>
                    <p class="text-sm text-gray-500 mt-1">${dev.revenue.recognitionBasis}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-400 mb-2">Revenue Breakdown</p>
                    ${renderRevenueBreakdown(dev.revenue.breakdown)}
                </div>
            </div>
        </div>

        <!-- Asset Recognition -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>📦</span> Asset Recognition
            </h4>

            <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                    ${dev.asset.recognised ?
                        '<span class="text-3xl">✅</span>' :
                        '<span class="text-3xl">❌</span>'
                    }
                </div>
                <div>
                    <p class="text-lg font-medium ${dev.asset.recognised ? 'text-green-400' : 'text-gray-400'}">
                        ${dev.asset.recognised ? 'Intangible Asset Recognised' : 'No Asset Recognised'}
                    </p>
                    <p class="text-sm text-gray-500">${dev.asset.reason}</p>
                </div>
            </div>
        </div>

        <!-- Tax Position -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>💰</span> Tax Position
            </h4>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                ${renderMetricCard('Taxable Income', formatCurrency(dev.tax.taxableIncome), 'text-gray-300')}
                ${renderMetricCard('Tax Rate', formatPercentage(dev.tax.corporateTaxRate * 100), 'text-gray-300')}
                ${renderMetricCard('Tax Payable', formatCurrency(dev.tax.taxPayable), 'text-red-400')}
            </div>

            <div class="mt-4 p-4 bg-gray-700/50 rounded-lg">
                <p class="text-sm text-gray-400">Net Profit After Tax</p>
                <p class="text-2xl font-bold text-green-400">${formatCurrency(dev.profit.net)}</p>
            </div>
        </div>

        <!-- Transfer Pricing Risk -->
        ${renderTransferPricingRisk(tp)}
    `;
}

// ========== BUYER PERSPECTIVE ==========

function renderBuyerPerspective(container, results) {
    const buyer = results.buyer;

    container.innerHTML = `
        <!-- Client Summary Header -->
        <div class="bg-green-900/30 border border-green-700 rounded-lg p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">🏢</span>
                <h3 class="text-xl font-bold text-green-300">Client (Buyer)</h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${renderMetricCard('Total Cost', formatCurrency(buyer.totalCost), 'text-gray-400')}
                ${renderMetricCard('Capitalised', formatCurrency(buyer.asset.capitalised), 'text-blue-400')}
                ${renderMetricCard('Expensed', formatCurrency(buyer.asset.expensed), 'text-yellow-400')}
                ${renderMetricCard('Useful Life', `${buyer.asset.usefulLife} years`, 'text-gray-300')}
            </div>
        </div>

        <!-- Asset Recognition -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>📦</span> Intangible Asset (IAS 38)
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <table class="w-full text-sm">
                        <tbody>
                            <tr class="border-b border-gray-700">
                                <td class="py-2 text-gray-400">Development costs capitalised</td>
                                <td class="py-2 text-right font-medium text-gray-200">${formatCurrency(buyer.asset.capitalised)}</td>
                            </tr>
                            <tr class="border-b border-gray-700">
                                <td class="py-2 text-gray-400">Research costs expensed</td>
                                <td class="py-2 text-right font-medium text-gray-200">${formatCurrency(buyer.asset.expensed)}</td>
                            </tr>
                            <tr class="border-b border-gray-700">
                                <td class="py-2 text-gray-400">Useful life</td>
                                <td class="py-2 text-right font-medium text-gray-200">${buyer.asset.usefulLife} years</td>
                            </tr>
                            <tr class="border-b border-gray-700">
                                <td class="py-2 text-gray-400">Amortisation method</td>
                                <td class="py-2 text-right font-medium text-gray-200">${buyer.asset.amortisationMethod}</td>
                            </tr>
                            <tr>
                                <td class="py-2 text-gray-400">Annual amortisation</td>
                                <td class="py-2 text-right font-bold text-blue-400">${formatCurrency(buyer.asset.annualAmortisation)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <p class="text-sm text-gray-400 mb-3">Carrying Value Over Time</p>
                    ${renderCarryingValueMini(buyer.expenses.schedule)}
                </div>
            </div>
        </div>

        <!-- Tax Deductions -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>💰</span> Tax Position (Section 11(e))
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div class="p-4 bg-green-900/20 border border-green-700/50 rounded-lg mb-4">
                        <p class="text-sm text-gray-400">Section 11(e) Classification</p>
                        <p class="text-lg font-bold text-green-400">${buyer.asset.section11eType === 'mainframe-5yr' ? 'Mainframe (5 years)' : 'PC Software (2 years)'}</p>
                    </div>

                    <table class="w-full text-sm">
                        <tbody>
                            <tr class="border-b border-gray-700">
                                <td class="py-2 text-gray-400">Annual tax deduction</td>
                                <td class="py-2 text-right font-medium text-green-400">${formatCurrency(buyer.tax.section11eDeduction)}</td>
                            </tr>
                            <tr class="border-b border-gray-700">
                                <td class="py-2 text-gray-400">Accounting amortisation</td>
                                <td class="py-2 text-right font-medium text-gray-200">${formatCurrency(buyer.tax.accountingAmortisation)}</td>
                            </tr>
                            <tr>
                                <td class="py-2 text-gray-400">Timing difference</td>
                                <td class="py-2 text-right font-medium ${buyer.tax.timingDifference > 0 ? 'text-yellow-400' : 'text-green-400'}">
                                    ${formatCurrency(Math.abs(buyer.tax.timingDifference))}
                                    ${buyer.tax.timingDifference > 0 ? '(DTA)' : '(DTL)'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <p class="text-sm text-gray-400 mb-2">Annual Tax Benefit</p>
                    <p class="text-3xl font-bold text-green-400">${formatCurrency(buyer.tax.taxBenefit)}</p>
                    <p class="text-sm text-gray-500 mt-2">
                        Based on ${formatPercentage(27)} corporate tax rate
                    </p>

                    ${buyer.tax.deferredTaxAsset > 0 ? `
                        <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded">
                            <p class="text-sm text-yellow-400">Deferred Tax Asset: ${formatCurrency(buyer.tax.deferredTaxAsset)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <!-- Amortisation Schedule -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>📅</span> Amortisation Schedule
            </h4>
            ${renderAmortisationTable(buyer.expenses.schedule)}
        </div>
    `;
}

// ========== COMBINED PERSPECTIVE ==========

function renderCombinedPerspective(container, results) {
    const dev = results.developer;
    const buyer = results.buyer;
    const combined = results.combined;
    const tp = results.transferPricing;

    container.innerHTML = `
        <!-- Net Effect Summary Header -->
        <div class="bg-purple-900/30 border border-purple-700 rounded-lg p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">⚖️</span>
                <h3 class="text-xl font-bold text-purple-300">Net Effect (Both Parties)</h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${renderMetricCard('Transaction Value', formatCurrency(combined.metrics.totalTransactionValue), 'text-gray-300')}
                ${renderMetricCard('Your Asset', formatCurrency(combined.assetEfficiency.developerAsset), 'text-blue-400')}
                ${renderMetricCard('Client Asset', formatCurrency(combined.assetEfficiency.buyerAsset), 'text-green-400')}
                ${renderMetricCard('Combined Tax', formatCurrency(combined.metrics.groupTaxCost), 'text-red-400')}
            </div>
        </div>

        <!-- Side-by-Side Comparison -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Your Company Summary -->
            <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-5">
                <h4 class="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                    <span>💻</span> Your Company
                </h4>
                <table class="w-full text-sm">
                    <tbody>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Revenue</td>
                            <td class="py-2 text-right text-green-400">${formatCurrency(dev.revenue.total)}</td>
                        </tr>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Costs</td>
                            <td class="py-2 text-right text-gray-300">${formatCurrency(dev.costs.total)}</td>
                        </tr>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Profit</td>
                            <td class="py-2 text-right text-blue-400">${formatCurrency(dev.profit.gross)}</td>
                        </tr>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Tax</td>
                            <td class="py-2 text-right text-red-400">(${formatCurrency(dev.tax.taxPayable)})</td>
                        </tr>
                        <tr>
                            <td class="py-2 text-gray-400 font-medium">Net Cash</td>
                            <td class="py-2 text-right font-bold text-green-400">${formatCurrency(combined.cashFlow.developerNetCash)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Client Summary -->
            <div class="bg-green-900/20 border border-green-700/50 rounded-lg p-5">
                <h4 class="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
                    <span>🏢</span> Client
                </h4>
                <table class="w-full text-sm">
                    <tbody>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Cost Paid</td>
                            <td class="py-2 text-right text-red-400">(${formatCurrency(buyer.totalCost)})</td>
                        </tr>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Asset Capitalised</td>
                            <td class="py-2 text-right text-blue-400">${formatCurrency(buyer.asset.capitalised)}</td>
                        </tr>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Amount Expensed</td>
                            <td class="py-2 text-right text-yellow-400">${formatCurrency(buyer.asset.expensed)}</td>
                        </tr>
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-400">Tax Benefit (Year 1)</td>
                            <td class="py-2 text-right text-green-400">${formatCurrency(buyer.tax.taxBenefit)}</td>
                        </tr>
                        <tr>
                            <td class="py-2 text-gray-400 font-medium">Net Cash</td>
                            <td class="py-2 text-right font-bold text-red-400">${formatCurrency(combined.cashFlow.buyerNetCash)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Net Effect Summary -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>📋</span> Transaction Summary
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="text-center p-4 bg-gray-700/30 rounded-lg">
                    <p class="text-sm text-gray-400 mb-1">Your Company Profit</p>
                    <p class="text-xl font-bold text-blue-400">${formatCurrency(dev.profit.gross)}</p>
                </div>
                <div class="text-center p-4 bg-gray-700/30 rounded-lg">
                    <p class="text-sm text-gray-400 mb-1">Client Asset Value</p>
                    <p class="text-xl font-bold text-green-400">${formatCurrency(buyer.asset.capitalised)}</p>
                </div>
                <div class="text-center p-4 bg-gray-700/30 rounded-lg">
                    <p class="text-sm text-gray-400 mb-1">Combined Net Cash</p>
                    <p class="text-xl font-bold ${combined.cashFlow.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(combined.cashFlow.netCashFlow || 0)}</p>
                </div>
            </div>

            <div class="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                <p class="text-sm text-gray-400 mb-2">Key Insight</p>
                <p class="text-gray-300">
                    This model generates ${formatCurrency(dev.profit.gross)} profit for your company while creating a ${formatCurrency(buyer.asset.capitalised)} asset for the client
                    ${buyer.tax.taxBenefit > 0 ? `, who benefits from ${formatCurrency(buyer.tax.taxBenefit)} annual tax savings (Section 11(e))` : ''}.
                </p>
            </div>
        </div>

        <!-- Asset Distribution -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>📊</span> Asset Distribution
            </h4>

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center p-4 bg-blue-900/20 rounded-lg">
                    <p class="text-sm text-gray-400 mb-1">Your Company Asset</p>
                    <p class="text-xl font-bold text-blue-400">${formatCurrency(combined.assetEfficiency.developerAsset)}</p>
                    <p class="text-xs text-gray-500 mt-1">${combined.assetEfficiency.developerAsset > 0 ? 'IP retained on your balance sheet' : 'No asset retained'}</p>
                </div>
                <div class="text-center p-4 bg-green-900/20 rounded-lg">
                    <p class="text-sm text-gray-400 mb-1">Client Asset</p>
                    <p class="text-xl font-bold text-green-400">${formatCurrency(combined.assetEfficiency.buyerAsset)}</p>
                    <p class="text-xs text-gray-500 mt-1">${combined.assetEfficiency.buyerAsset > 0 ? 'Asset on client balance sheet' : 'No asset recognised'}</p>
                </div>
            </div>

            <div class="p-3 bg-gray-700/30 rounded text-center">
                <span class="text-gray-400 text-sm">
                    Total assets created: ${formatCurrency((combined.assetEfficiency.developerAsset || 0) + (combined.assetEfficiency.buyerAsset || 0))}
                </span>
            </div>
        </div>

        <!-- Transfer Pricing Risk -->
        ${renderTransferPricingRisk(tp)}
    `;
}

// ========== HELPER RENDER FUNCTIONS ==========

function renderMetricCard(label, value, colorClass = 'text-gray-200') {
    return `
        <div class="bg-gray-800/50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-400 mb-1">${label}</p>
            <p class="text-lg font-bold ${colorClass}">${value}</p>
        </div>
    `;
}

function renderRevenueBreakdown(breakdown) {
    const items = Object.entries(breakdown).filter(([_, value]) => value > 0);
    if (items.length === 0) return '<p class="text-gray-500 text-sm">No breakdown available</p>';

    return `
        <div class="space-y-2">
            ${items.map(([key, value]) => `
                <div class="flex justify-between text-sm">
                    <span class="text-gray-400 capitalize">${key}</span>
                    <span class="text-gray-200">${formatCurrency(value)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderTransferPricingRisk(tp) {
    // Handle not applicable case (e.g., BOO variant with no transfer)
    if (!tp || tp.notApplicable) {
        if (tp && tp.serviceFeeAnalysis) {
            // Show service fee analysis only for BOO
            const withinRange = tp.serviceFeeAnalysis.withinRange;
            const colors = withinRange ?
                { bg: 'bg-gray-800/50', border: 'border-gray-600', text: 'text-gray-400', icon: 'i' } :
                { bg: 'bg-yellow-900/20', border: 'border-yellow-700', text: 'text-yellow-400', icon: 'i' };

            return `
                <div class="${colors.bg} border ${colors.border} rounded-lg p-6">
                    <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <span class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">${colors.icon}</span>
                        Transfer Pricing Assessment
                    </h4>
                    <div class="p-4 bg-gray-700/30 rounded-lg mb-4">
                        <p class="text-gray-300">${tp.reason}</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-400 mb-2">Service Fee Analysis</p>
                            <table class="w-full text-sm">
                                <tbody>
                                    <tr class="border-b border-gray-700/50">
                                        <td class="py-2 text-gray-400">Operating Margin</td>
                                        <td class="py-2 text-right ${withinRange ? 'text-green-400' : 'text-yellow-400'}">${formatPercentage(tp.serviceFeeAnalysis.margin)}</td>
                                    </tr>
                                    <tr>
                                        <td class="py-2 text-gray-400">Benchmark Range</td>
                                        <td class="py-2 text-right text-gray-200">${tp.serviceFeeAnalysis.benchmarkRange}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="flex items-center">
                            <p class="text-sm text-gray-400 italic">${tp.serviceFeeAnalysis.note}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        // No transfer pricing analysis to show
        return '';
    }

    const riskColors = {
        low: { bg: 'bg-green-900/20', border: 'border-green-700', text: 'text-green-400', icon: '✅' },
        medium: { bg: 'bg-yellow-900/20', border: 'border-yellow-700', text: 'text-yellow-400', icon: '⚠️' },
        high: { bg: 'bg-red-900/20', border: 'border-red-700', text: 'text-red-400', icon: '🚨' }
    };
    const colors = riskColors[tp.riskLevel] || riskColors.medium;

    return `
        <div class="${colors.bg} border ${colors.border} rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span>⚖️</span> Transfer Pricing Assessment
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-3xl">${colors.icon}</span>
                        <div>
                            <p class="text-sm text-gray-400">Risk Level</p>
                            <p class="text-xl font-bold ${colors.text} capitalize">${tp.riskLevel}</p>
                        </div>
                    </div>

                    <table class="w-full text-sm">
                        <tbody>
                            <tr class="border-b border-gray-700/50">
                                <td class="py-2 text-gray-400">Method</td>
                                <td class="py-2 text-right text-gray-200 capitalize">${tp.method}</td>
                            </tr>
                            <tr class="border-b border-gray-700/50">
                                <td class="py-2 text-gray-400">Applied Margin</td>
                                <td class="py-2 text-right ${tp.withinRange ? 'text-green-400' : 'text-yellow-400'}">${formatPercentage(tp.margin)}</td>
                            </tr>
                            <tr>
                                <td class="py-2 text-gray-400">Benchmark Range</td>
                                <td class="py-2 text-right text-gray-200">${formatPercentage(tp.benchmarkRange.low)} - ${formatPercentage(tp.benchmarkRange.high)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <p class="text-sm text-gray-400 mb-2">Required Documentation</p>
                    <ul class="text-sm space-y-1">
                        ${tp.documentation.map(doc => `
                            <li class="flex items-start gap-2 text-gray-300">
                                <span class="text-gray-500">•</span>
                                ${doc}
                            </li>
                        `).join('')}
                    </ul>

                    ${tp.recommendation ? `
                        <div class="mt-4 p-3 bg-gray-700/50 rounded">
                            <p class="text-sm ${colors.text}">${tp.recommendation}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderCarryingValueMini(schedule) {
    if (!schedule || schedule.length === 0) return '';

    const maxValue = schedule[0]?.openingBalance || 0;

    return `
        <div class="flex items-end gap-1 h-16">
            ${schedule.map((year, i) => {
                const height = maxValue > 0 ? (year.closingBalance / maxValue) * 100 : 0;
                return `
                    <div class="flex-1 flex flex-col items-center">
                        <div class="w-full bg-blue-600 rounded-t" style="height: ${height}%"></div>
                        <span class="text-xs text-gray-500 mt-1">Y${year.year}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderAmortisationTable(schedule) {
    if (!schedule || schedule.length === 0) {
        return '<p class="text-gray-500">No schedule available</p>';
    }

    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-600">
                        <th class="py-2 text-left text-gray-400 font-medium">Year</th>
                        <th class="py-2 text-right text-gray-400 font-medium">Opening Balance</th>
                        <th class="py-2 text-right text-gray-400 font-medium">Amortisation</th>
                        <th class="py-2 text-right text-gray-400 font-medium">Closing Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${schedule.map(row => `
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 text-gray-300">Year ${row.year}</td>
                            <td class="py-2 text-right text-gray-300">${formatCurrency(row.openingBalance)}</td>
                            <td class="py-2 text-right text-yellow-400">(${formatCurrency(row.amortisation)})</td>
                            <td class="py-2 text-right text-blue-400">${formatCurrency(row.closingBalance)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderMetadataFooter(container, metadata) {
    if (!metadata) return;

    const footer = document.createElement('div');
    footer.className = 'mt-6 pt-4 border-t border-gray-700 text-sm text-gray-500';
    footer.innerHTML = `
        <div class="flex flex-wrap gap-4">
            <span>Model: ${metadata.modelName}</span>
            <span>•</span>
            <span>Variant: ${metadata.variantId} - ${metadata.variantName}</span>
            <span>•</span>
            <span>Calculated: ${new Date(metadata.calculatedAt).toLocaleString()}</span>
        </div>
    `;
    container.appendChild(footer);
}

// ========== EXPORTS ==========

export default {
    renderIntercompanyResults
};
