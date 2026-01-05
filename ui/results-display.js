import { formatCurrency, formatNumber, formatPercentage } from '../utils/index.js';

// ========== RESULTS DISPLAY ==========
// Displays seller perspective, buyer perspective, and equilibrium analysis

/**
 * Render complete results display with all three perspectives
 */
export function renderResults(modelKey, results) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    resultsContainer.classList.remove('hidden');

    // Create three-column layout
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 lg:grid-cols-3 gap-6';

    // Column 1: Revenue & Profit Overview
    container.appendChild(renderOverviewPanel(results));

    // Column 2: Seller Perspective
    container.appendChild(renderSellerPanel(results));

    // Column 3: Buyer Perspective
    container.appendChild(renderBuyerPanel(results));

    // Full-width: Equilibrium Analysis
    container.appendChild(renderEquilibriumPanel(results));

    resultsContainer.appendChild(container);
}

/**
 * Render overview panel (revenue, costs, profit)
 */
function renderOverviewPanel(results) {
    const panel = createPanel('Revenue & Profit Overview', 'text-blue-400');

    const metrics = [
        { label: 'Monthly Revenue', value: formatCurrency(results.monthlyRevenue) },
        { label: 'Annual Revenue', value: formatCurrency(results.annualRevenue) },
        { label: 'Monthly Cost', value: formatCurrency(results.monthlyCost), negative: true },
        { label: 'Monthly Profit', value: formatCurrency(results.monthlyProfit), highlight: true },
        { label: 'Annual Profit', value: formatCurrency(results.annualProfit), highlight: true },
        {
            label: 'Gross Margin',
            value: formatPercentage(results.actualMargin),
            badge: results.actualMargin >= 70 ? 'Healthy' : results.actualMargin >= 50 ? 'Moderate' : 'Low',
            badgeClass: results.actualMargin >= 70 ? 'bg-green-600' : results.actualMargin >= 50 ? 'bg-yellow-600' : 'bg-red-600'
        }
    ];

    // Add GMV if available (marketplace model)
    if (results.monthlyGMV) {
        metrics.unshift({ label: 'Monthly GMV', value: formatCurrency(results.monthlyGMV) });
        metrics.unshift({ label: 'Annual GMV', value: formatCurrency(results.annualGMV) });
    }

    metrics.forEach(metric => {
        panel.appendChild(renderMetric(metric));
    });

    return panel;
}

/**
 * Render seller perspective panel
 */
function renderSellerPanel(results) {
    const panel = createPanel('Seller Perspective', 'text-green-400');

    const minimumPrice = results.sellerMinimumPrice || results.sellerMinimumRate;
    const currentPrice = results.sellerMinimumPrice ?
        (results.revenuePerCustomer || results.pricePerSeat || results.pricePerUnit || results.licensePrice) :
        results.commissionRate;
    const meetsTarget = results.sellerMeetsTarget;
    const priceGap = results.sellerPriceGap || results.sellerRateGap;

    const isRate = results.sellerMinimumRate !== undefined;
    const formatter = isRate ? formatPercentage : formatCurrency;

    const metrics = [
        {
            label: isRate ? 'Minimum Commission Rate' : 'Minimum Price',
            value: formatter(minimumPrice),
            hint: 'To achieve desired margin'
        },
        {
            label: isRate ? 'Current Commission Rate' : 'Current Price',
            value: formatter(currentPrice),
            badge: meetsTarget ? 'Meets Target' : 'Below Target',
            badgeClass: meetsTarget ? 'bg-green-600' : 'bg-red-600'
        },
        {
            label: isRate ? 'Rate Gap' : 'Price Gap',
            value: formatter(Math.abs(priceGap)),
            hint: meetsTarget ? 'Above minimum' : 'Below minimum',
            negative: !meetsTarget
        }
    ];

    metrics.forEach(metric => {
        panel.appendChild(renderMetric(metric));
    });

    // Add seller-specific advice
    const advice = document.createElement('div');
    advice.className = 'mt-4 p-3 bg-gray-700 rounded text-sm';
    if (meetsTarget) {
        advice.innerHTML = `
            <div class="text-green-400 font-medium">✓ Pricing meets target margin</div>
            <div class="text-gray-300 mt-1">You have ${formatter(priceGap)} headroom above your minimum price.</div>
        `;
    } else {
        advice.innerHTML = `
            <div class="text-red-400 font-medium">⚠ Pricing below target margin</div>
            <div class="text-gray-300 mt-1">Consider raising price by ${formatter(Math.abs(priceGap))} to meet your margin goals.</div>
        `;
    }
    panel.appendChild(advice);

    return panel;
}

/**
 * Render buyer perspective panel
 */
function renderBuyerPanel(results) {
    const panel = createPanel('Buyer Perspective', 'text-purple-400');

    const roi = results.buyerROI;
    const isMarketplace = results.buyerNetProfitPerTransaction !== undefined;

    const metrics = [];

    if (isMarketplace) {
        // Marketplace buyer metrics (for sellers on the platform)
        metrics.push(
            { label: 'Net Profit per Transaction', value: formatCurrency(results.buyerNetProfitPerTransaction) },
            { label: 'Monthly Profit (All Sellers)', value: formatCurrency(results.buyerMonthlyProfit) },
            { label: 'Avg Transactions per Seller', value: formatNumber(results.avgTransactionsPerSeller) },
            {
                label: 'ROI for Sellers',
                value: roi.toFixed(2) + 'x',
                badge: roi >= 0.5 ? 'Good' : 'Poor',
                badgeClass: roi >= 0.5 ? 'bg-green-600' : 'bg-red-600'
            }
        );
    } else {
        // Regular buyer metrics
        if (results.buyerMonthlyValue) {
            metrics.push({ label: 'Monthly Value Received', value: formatCurrency(results.buyerMonthlyValue) });
        }
        if (results.buyerMonthlySavings) {
            metrics.push({ label: 'Monthly Savings', value: formatCurrency(results.buyerMonthlySavings) });
        }
        if (results.buyerAnnualSavings) {
            metrics.push({ label: 'Annual Savings', value: formatCurrency(results.buyerAnnualSavings), highlight: true });
        }
        if (results.buyerFirstYearCost) {
            metrics.push({ label: 'First Year Total Cost', value: formatCurrency(results.buyerFirstYearCost) });
            metrics.push({ label: 'Year 2+ Annual Cost', value: formatCurrency(results.buyerYear2PlusCost) });
        }

        metrics.push({
            label: 'ROI',
            value: roi > 100 ? '100+x' : roi.toFixed(1) + 'x',
            badge: roi >= 2.5 ? 'Excellent' : roi >= 1.5 ? 'Good' : roi >= 1.0 ? 'Fair' : 'Poor',
            badgeClass: roi >= 2.5 ? 'bg-green-600' : roi >= 1.5 ? 'bg-blue-600' : roi >= 1.0 ? 'bg-yellow-600' : 'bg-red-600'
        });

        if (results.buyerPaybackMonths && results.buyerPaybackMonths < 100) {
            const payback = results.buyerPaybackMonths;
            metrics.push({
                label: 'Payback Period',
                value: payback < 1 ? 'Immediate' : `${payback.toFixed(1)} months`,
                badge: payback <= 6 ? 'Fast' : payback <= 12 ? 'Moderate' : 'Slow',
                badgeClass: payback <= 6 ? 'bg-green-600' : payback <= 12 ? 'bg-yellow-600' : 'bg-orange-600'
            });
        }
    }

    metrics.forEach(metric => {
        panel.appendChild(renderMetric(metric));
    });

    // Add buyer-specific advice
    const advice = document.createElement('div');
    advice.className = 'mt-4 p-3 bg-gray-700 rounded text-sm';
    if (roi >= 2.5) {
        advice.innerHTML = `
            <div class="text-green-400 font-medium">✓ Strong value proposition</div>
            <div class="text-gray-300 mt-1">Buyer gets ${roi.toFixed(1)}x return - this is a compelling offer.</div>
        `;
    } else if (roi >= 1.5) {
        advice.innerHTML = `
            <div class="text-blue-400 font-medium">✓ Good value proposition</div>
            <div class="text-gray-300 mt-1">Buyer gets ${roi.toFixed(1)}x return - solid offer.</div>
        `;
    } else {
        advice.innerHTML = `
            <div class="text-yellow-400 font-medium">⚠ Weak value proposition</div>
            <div class="text-gray-300 mt-1">ROI of ${roi.toFixed(1)}x may not be compelling enough for buyers. Consider increasing value or decreasing price.</div>
        `;
    }
    panel.appendChild(advice);

    return panel;
}

/**
 * Render equilibrium analysis panel
 */
function renderEquilibriumPanel(results) {
    const panel = createPanel('Equilibrium Analysis', 'text-yellow-400', 'lg:col-span-3');

    const equilibriumExists = results.equilibriumExists;
    const range = results.equilibriumRange;

    if (equilibriumExists && range) {
        // Equilibrium exists - show the zone
        const isRate = results.sellerMinimumRate !== undefined;
        const formatter = isRate ? formatPercentage : formatCurrency;

        const statusDiv = document.createElement('div');
        statusDiv.className = 'flex items-center gap-2 mb-4';
        statusDiv.innerHTML = `
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <div class="text-green-400 font-medium">Equilibrium Zone Found</div>
        `;
        panel.appendChild(statusDiv);

        const rangeDiv = document.createElement('div');
        rangeDiv.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4';
        rangeDiv.innerHTML = `
            <div class="bg-gray-700 p-4 rounded">
                <div class="text-gray-400 text-sm">Seller Floor</div>
                <div class="text-xl font-bold text-green-400">${formatter(range.floor)}</div>
                <div class="text-xs text-gray-500 mt-1">Minimum to meet margin</div>
            </div>
            <div class="bg-gray-700 p-4 rounded border-2 border-yellow-500">
                <div class="text-gray-400 text-sm">Suggested Price</div>
                <div class="text-2xl font-bold text-yellow-400">${formatter(range.suggested)}</div>
                <div class="text-xs text-gray-500 mt-1">Midpoint - balanced pricing</div>
            </div>
            <div class="bg-gray-700 p-4 rounded">
                <div class="text-gray-400 text-sm">Buyer Ceiling</div>
                <div class="text-xl font-bold text-purple-400">${formatter(range.ceiling)}</div>
                <div class="text-xs text-gray-500 mt-1">Maximum buyer will pay</div>
            </div>
        `;
        panel.appendChild(rangeDiv);

        // Visual representation
        const zoneWidth = range.ceiling - range.floor;
        const suggestedPosition = ((range.suggested - range.floor) / zoneWidth) * 100;

        const visualDiv = document.createElement('div');
        visualDiv.className = 'relative h-12 bg-gray-700 rounded overflow-hidden';
        visualDiv.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-green-600 via-yellow-600 to-purple-600 opacity-30"></div>
            <div class="absolute top-0 bottom-0 w-1 bg-yellow-400" style="left: ${suggestedPosition}%">
                <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 whitespace-nowrap">Suggested</div>
            </div>
            <div class="absolute inset-y-0 left-0 flex items-center px-2 text-xs text-green-400">Floor</div>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 text-xs text-purple-400">Ceiling</div>
        `;
        panel.appendChild(visualDiv);

        const advice = document.createElement('div');
        advice.className = 'mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300';
        advice.innerHTML = `
            <div class="font-medium text-yellow-400 mb-1">Pricing Strategy:</div>
            <div>The equilibrium zone between ${formatter(range.floor)} and ${formatter(range.ceiling)} represents win-win pricing.</div>
            <div class="mt-2">• Price at <strong>${formatter(range.floor)}</strong> to be competitive and meet minimum margins</div>
            <div>• Price at <strong>${formatter(range.suggested)}</strong> to balance seller profit and buyer value</div>
            <div>• Price at <strong>${formatter(range.ceiling)}</strong> to maximize revenue while maintaining buyer ROI</div>
        `;
        panel.appendChild(advice);

    } else {
        // No equilibrium - seller floor exceeds buyer ceiling
        const statusDiv = document.createElement('div');
        statusDiv.className = 'flex items-center gap-2 mb-4';
        statusDiv.innerHTML = `
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="text-red-400 font-medium">No Equilibrium - Price Mismatch</div>
        `;
        panel.appendChild(statusDiv);

        const advice = document.createElement('div');
        advice.className = 'p-4 bg-red-900/20 border border-red-600 rounded text-sm text-gray-300';
        advice.innerHTML = `
            <div class="font-medium text-red-400 mb-2">⚠ Business model not viable at current assumptions</div>
            <div class="mb-2">Your minimum price to meet margin goals exceeds what buyers will pay for the value received.</div>
            <div class="mt-3 font-medium">Possible solutions:</div>
            <div class="ml-4 mt-1">
                <div>• Reduce cost to serve (to lower seller floor)</div>
                <div>• Accept lower margin target (to lower seller floor)</div>
                <div>• Increase value delivered to buyer (to raise buyer ceiling)</div>
                <div>• Consider a different pricing model</div>
            </div>
        `;
        panel.appendChild(advice);
    }

    return panel;
}

/**
 * Helper: Create a panel container
 */
function createPanel(title, titleColor, extraClasses = '') {
    const panel = document.createElement('div');
    panel.className = `bg-gray-800 rounded-lg p-6 ${extraClasses}`;

    const titleEl = document.createElement('h3');
    titleEl.className = `text-lg font-semibold mb-4 ${titleColor}`;
    titleEl.textContent = title;
    panel.appendChild(titleEl);

    return panel;
}

/**
 * Helper: Render a metric row
 */
function renderMetric(metric) {
    const row = document.createElement('div');
    row.className = `flex justify-between items-center py-2 border-b border-gray-700 last:border-0 ${metric.highlight ? 'bg-gray-700/50 px-2 rounded' : ''}`;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'flex flex-col';

    const label = document.createElement('span');
    label.className = 'text-sm text-gray-400';
    label.textContent = metric.label;
    labelDiv.appendChild(label);

    if (metric.hint) {
        const hint = document.createElement('span');
        hint.className = 'text-xs text-gray-500';
        hint.textContent = metric.hint;
        labelDiv.appendChild(hint);
    }

    const valueDiv = document.createElement('div');
    valueDiv.className = 'flex items-center gap-2';

    const value = document.createElement('span');
    value.className = `font-semibold ${metric.negative ? 'text-red-400' : metric.highlight ? 'text-green-400 text-lg' : 'text-gray-200'}`;
    value.textContent = metric.value;
    valueDiv.appendChild(value);

    if (metric.badge) {
        const badge = document.createElement('span');
        badge.className = `text-xs px-2 py-1 rounded ${metric.badgeClass || 'bg-blue-600'}`;
        badge.textContent = metric.badge;
        valueDiv.appendChild(badge);
    }

    row.appendChild(labelDiv);
    row.appendChild(valueDiv);

    return row;
}
