// ========== CONFIGURATION ==========
const CONFIG = {
    defaultForecastMonths: 24,
    maxForecastMonths: 36,
    debounceDelay: 300,
    chartColors: {
        primary: '#3B82F6',
        positive: '#10B981',
        moderate: '#F59E0B',
        negative: '#EF4444',
        secondary: '#6B7280'
    }
};

// Store chart instances for cleanup
let chartInstances = {
    primary: null,
    secondary1: null,
    secondary2: null
};

// Store selected models for comparison
let selectedModels = new Set();

// ========== MODEL FAMILIES ==========
const MODEL_FAMILIES = {
    subscription: {
        name: 'Subscription Model Family',
        models: ['subscription', 'per-seat', 'retainer', 'managed-services'],
        commonMetrics: ['mrr', 'arr', 'customers', 'churn', 'revenuePerCustomer'],
        description: 'Recurring revenue models with predictable monthly/annual revenue streams'
    },
    usageBased: {
        name: 'Usage-Based Consumption Family',
        models: ['usage-based', 'pay-per-transaction', 'credits-token'],
        commonMetrics: ['revenue', 'volume', 'revenuePerCustomer', 'usage'],
        description: 'Revenue based on actual consumption or usage patterns'
    },
    projectDelivery: {
        name: 'Project Delivery Family',
        models: ['time-materials', 'fixed-price', 'outcome-based'],
        commonMetrics: ['revenue', 'activeProjects', 'revenuePerResource', 'utilization'],
        description: 'Revenue from project-based work with varying recognition patterns'
    },
    freeToPaid: {
        name: 'Free-to-Paid Conversion Family',
        models: ['freemium', 'open-core'],
        commonMetrics: ['freeUsers', 'paidUsers', 'conversionRate', 'revenue'],
        description: 'Models with free tier converting to paid subscriptions'
    },
    platform: {
        name: 'Platform/Intermediary Family',
        models: ['marketplace', 'revenue-share', 'advertising'],
        commonMetrics: ['volume', 'revenue', 'takeRate', 'participants'],
        description: 'Revenue from facilitating transactions or advertising'
    },
    enterprise: {
        name: 'Enterprise License Family',
        models: ['ela', 'data-licensing', 'white-label'],
        commonMetrics: ['contractValue', 'contractCount', 'renewalRate', 'avgContractSize'],
        description: 'Large enterprise contracts with annual commitments'
    },
    standalone: {
        name: 'Standalone Models',
        models: ['one-time', 'professional-services'],
        commonMetrics: [],
        description: 'Models with unique patterns not easily comparable to others'
    }
};

// Helper function to get model family
function getModelFamily(modelKey) {
    for (const [familyKey, family] of Object.entries(MODEL_FAMILIES)) {
        if (family.models.includes(modelKey)) {
            return { key: familyKey, ...family };
        }
    }
    return null;
}

// Helper function to check if models can be directly compared
function canCompareModels(modelKeys) {
    if (modelKeys.length < 2) return { canCompare: true, type: 'single' };

    const families = modelKeys.map(key => getModelFamily(key));
    const uniqueFamilies = new Set(families.map(f => f?.key));

    if (uniqueFamilies.size === 1 && !uniqueFamilies.has('standalone')) {
        return { canCompare: true, type: 'family', family: families[0] };
    }

    return { canCompare: true, type: 'universal' };
}

// ========== MODEL DEFINITIONS ==========
const models = {
    'one-time': {
        name: 'One-Time Purchase (Perpetual License)',
        inputs: [
            { name: 'unitPrice', label: 'Unit Price per License ($)', type: 'currency', default: 499, min: 0, step: 1 },
            { name: 'unitsSold', label: 'Units Sold per Month', type: 'number', default: 25, min: 0, step: 1 },
            { name: 'maintenanceFee', label: 'Annual Maintenance Fee (%)', type: 'percent', default: 20, min: 0, max: 100, step: 0.1 },
            { name: 'maintenanceAttach', label: 'Maintenance Attach Rate (%)', type: 'percent', default: 60, min: 0, max: 100, step: 0.1 },
            { name: 'customerLifetime', label: 'Customer Lifetime (years)', type: 'number', default: 5, min: 1, step: 1 }
        ],
        calculate: function(inputs, months) {
            const results = [];
            let totalCustomers = 0;

            for (let month = 0; month < months; month++) {
                const newCustomers = inputs.unitsSold;
                totalCustomers += newCustomers;

                const licenseRevenue = newCustomers * inputs.unitPrice;
                const customersWithMaintenance = totalCustomers * (inputs.maintenanceAttach / 100);
                const maintenanceRevenue = customersWithMaintenance * inputs.unitPrice * (inputs.maintenanceFee / 100) / 12;
                const totalRevenue = licenseRevenue + maintenanceRevenue;

                results.push({
                    month: month + 1,
                    licenseRevenue: licenseRevenue,
                    maintenanceRevenue: maintenanceRevenue,
                    totalRevenue: totalRevenue,
                    totalCustomers: totalCustomers,
                    unitsSold: newCustomers
                });
            }

            return results;
        }
    },
    'subscription': {
        name: 'Subscription (SaaS)',
        inputs: [
            { name: 'monthlyPrice', label: 'Monthly Subscription Price ($)', type: 'currency', default: 99, min: 0, step: 1 },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 50, min: 0, step: 1 },
            { name: 'churnRate', label: 'Monthly Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 },
            { name: 'startingCustomers', label: 'Starting Customer Base', type: 'number', default: 0, min: 0, step: 1 },
            { name: 'expansionRate', label: 'Monthly Expansion Revenue (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            const results = [];
            let customers = inputs.startingCustomers;
            let avgRevenuePerCustomer = inputs.monthlyPrice;

            for (let month = 0; month < months; month++) {
                const newMRR = inputs.newCustomers * inputs.monthlyPrice;
                const churnedCustomers = customers * (inputs.churnRate / 100);
                const churnedMRR = churnedCustomers * avgRevenuePerCustomer;
                const expansionMRR = customers * avgRevenuePerCustomer * (inputs.expansionRate / 100);

                customers = customers + inputs.newCustomers - churnedCustomers;
                const mrr = customers * avgRevenuePerCustomer + expansionMRR;
                avgRevenuePerCustomer = customers > 0 ? mrr / customers : inputs.monthlyPrice;

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    mrr: mrr,
                    arr: mrr * 12,
                    newMRR: newMRR,
                    churnedMRR: churnedMRR,
                    expansionMRR: expansionMRR,
                    revenuePerCustomer: avgRevenuePerCustomer
                });
            }

            return results;
        }
    },
    'freemium': {
        name: 'Freemium',
        inputs: [
            { name: 'freeUsers', label: 'Free Users Acquired per Month', type: 'number', default: 500, min: 0, step: 1 },
            { name: 'conversionRate', label: 'Free-to-Paid Conversion Rate (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1 },
            { name: 'timeToConversion', label: 'Time to Conversion (months)', type: 'number', default: 2, min: 1, step: 1 },
            { name: 'paidPrice', label: 'Paid Subscription Price ($)', type: 'currency', default: 49, min: 0, step: 1 },
            { name: 'freeChurn', label: 'Free User Churn Rate (%)', type: 'percent', default: 15, min: 0, max: 100, step: 0.1 },
            { name: 'paidChurn', label: 'Paid User Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            const results = [];
            let freeUsers = 0;
            let paidUsers = 0;
            const cohorts = [];

            for (let month = 0; month < months; month++) {
                // Add new free users
                freeUsers += inputs.freeUsers;
                cohorts.push({ month: month, users: inputs.freeUsers, converted: 0 });

                // Convert users from eligible cohorts
                let newConversions = 0;
                cohorts.forEach(cohort => {
                    if (month - cohort.month >= inputs.timeToConversion) {
                        const eligible = cohort.users - cohort.converted;
                        const converting = eligible * (inputs.conversionRate / 100);
                        cohort.converted += converting;
                        newConversions += converting;
                    }
                });

                // Apply churn
                freeUsers = freeUsers * (1 - inputs.freeChurn / 100) - newConversions;
                paidUsers = paidUsers + newConversions;
                paidUsers = paidUsers * (1 - inputs.paidChurn / 100);

                const revenue = paidUsers * inputs.paidPrice;
                const totalUsers = freeUsers + paidUsers;

                results.push({
                    month: month + 1,
                    freeUsers: Math.round(freeUsers),
                    paidUsers: Math.round(paidUsers),
                    totalUsers: Math.round(totalUsers),
                    revenue: revenue,
                    conversionRate: totalUsers > 0 ? (paidUsers / totalUsers * 100) : 0,
                    newConversions: Math.round(newConversions)
                });
            }

            return results;
        }
    },
    'usage-based': {
        name: 'Usage-Based (Consumption)',
        inputs: [
            { name: 'pricePerUnit', label: 'Price per Unit ($)', type: 'currency', default: 0.05, min: 0, step: 0.01 },
            { name: 'avgUsage', label: 'Avg Usage per Customer per Month', type: 'number', default: 1000, min: 0, step: 1 },
            { name: 'usageGrowth', label: 'Usage Growth per Customer (% monthly)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 20, min: 0, step: 1 },
            { name: 'churnRate', label: 'Customer Churn Rate (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1 },
            { name: 'usageVariance', label: 'Usage Std Deviation (%)', type: 'percent', default: 20, min: 0, max: 100, step: 1 }
        ],
        calculate: function(inputs, months) {
            const results = [];
            let customers = 0;
            let avgUsagePerCustomer = inputs.avgUsage;

            for (let month = 0; month < months; month++) {
                customers = customers + inputs.newCustomers;
                customers = customers * (1 - inputs.churnRate / 100);

                avgUsagePerCustomer = avgUsagePerCustomer * (1 + inputs.usageGrowth / 100);
                const totalUsage = customers * avgUsagePerCustomer;
                const revenue = totalUsage * inputs.pricePerUnit;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                const variance = revenue * (inputs.usageVariance / 100);

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    totalUsage: totalUsage,
                    avgUsage: avgUsagePerCustomer,
                    revenue: revenue,
                    revenuePerCustomer: revenuePerCustomer,
                    revenueHigh: revenue + variance,
                    revenueLow: Math.max(0, revenue - variance)
                });
            }

            return results;
        }
    },
    'tiered': {
        name: 'Tiered Pricing',
        inputs: [
            { name: 'starterPrice', label: 'Starter Tier Price ($)', type: 'currency', default: 29, min: 0, step: 1 },
            { name: 'proPrice', label: 'Professional Tier Price ($)', type: 'currency', default: 99, min: 0, step: 1 },
            { name: 'enterprisePrice', label: 'Enterprise Tier Price ($)', type: 'currency', default: 299, min: 0, step: 1 },
            { name: 'starterPct', label: 'Starter Tier % of New Customers', type: 'percent', default: 60, min: 0, max: 100, step: 1 },
            { name: 'proPct', label: 'Pro Tier % of New Customers', type: 'percent', default: 30, min: 0, max: 100, step: 1 },
            { name: 'enterprisePct', label: 'Enterprise Tier % of New Customers', type: 'percent', default: 10, min: 0, max: 100, step: 1 },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 100, min: 0, step: 1 },
            { name: 'upgradeRate', label: 'Monthly Upgrade Rate (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1 },
            { name: 'downgradeRate', label: 'Monthly Downgrade Rate (%)', type: 'percent', default: 1, min: 0, max: 100, step: 0.1 },
            { name: 'churnRate', label: 'Monthly Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            const results = [];
            let starterCustomers = 0;
            let proCustomers = 0;
            let enterpriseCustomers = 0;

            for (let month = 0; month < months; month++) {
                // Add new customers
                const newStarter = inputs.newCustomers * (inputs.starterPct / 100);
                const newPro = inputs.newCustomers * (inputs.proPct / 100);
                const newEnterprise = inputs.newCustomers * (inputs.enterprisePct / 100);

                starterCustomers += newStarter;
                proCustomers += newPro;
                enterpriseCustomers += newEnterprise;

                // Handle upgrades and downgrades
                const starterUpgrade = starterCustomers * (inputs.upgradeRate / 100);
                const proUpgrade = proCustomers * (inputs.upgradeRate / 100);
                const proDowngrade = proCustomers * (inputs.downgradeRate / 100);
                const enterpriseDowngrade = enterpriseCustomers * (inputs.downgradeRate / 100);

                starterCustomers -= starterUpgrade;
                starterCustomers += proDowngrade;

                proCustomers += starterUpgrade;
                proCustomers -= proUpgrade;
                proCustomers -= proDowngrade;
                proCustomers += enterpriseDowngrade;

                enterpriseCustomers += proUpgrade;
                enterpriseCustomers -= enterpriseDowngrade;

                // Apply churn
                starterCustomers *= (1 - inputs.churnRate / 100);
                proCustomers *= (1 - inputs.churnRate / 100);
                enterpriseCustomers *= (1 - inputs.churnRate / 100);

                const starterRevenue = starterCustomers * inputs.starterPrice;
                const proRevenue = proCustomers * inputs.proPrice;
                const enterpriseRevenue = enterpriseCustomers * inputs.enterprisePrice;
                const totalRevenue = starterRevenue + proRevenue + enterpriseRevenue;

                results.push({
                    month: month + 1,
                    starterCustomers: Math.round(starterCustomers),
                    proCustomers: Math.round(proCustomers),
                    enterpriseCustomers: Math.round(enterpriseCustomers),
                    starterRevenue: starterRevenue,
                    proRevenue: proRevenue,
                    enterpriseRevenue: enterpriseRevenue,
                    totalRevenue: totalRevenue,
                    totalCustomers: Math.round(starterCustomers + proCustomers + enterpriseCustomers)
                });
            }

            return results;
        }
    },
    'per-seat': {
        name: 'Per-Seat/Per-User',
        inputs: [
            { name: 'pricePerSeat', label: 'Price per Seat per Month ($)', type: 'currency', default: 25, min: 0, step: 1 },
            { name: 'avgSeats', label: 'Avg Seats per Customer at Signup', type: 'number', default: 5, min: 1, step: 1 },
            { name: 'seatExpansion', label: 'Seat Expansion Rate (% monthly)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1 },
            { name: 'customerChurn', label: 'Customer Churn Rate (%)', type: 'percent', default: 4, min: 0, max: 100, step: 0.1 },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 30, min: 0, step: 1 }
        ],
        calculate: function(inputs, months) {
            const results = [];
            let customers = 0;
            let totalSeats = 0;

            for (let month = 0; month < months; month++) {
                // Add new customers with their initial seats
                customers += inputs.newCustomers;
                totalSeats += inputs.newCustomers * inputs.avgSeats;

                // Expand seats for existing customers
                totalSeats = totalSeats * (1 + inputs.seatExpansion / 100);

                // Apply customer churn (seats churn with customers)
                const avgSeatsPerCustomer = customers > 0 ? totalSeats / customers : inputs.avgSeats;
                const churnedCustomers = customers * (inputs.customerChurn / 100);
                const churnedSeats = churnedCustomers * avgSeatsPerCustomer;

                customers -= churnedCustomers;
                totalSeats -= churnedSeats;

                const revenue = totalSeats * inputs.pricePerSeat;
                const seatsPerCustomer = customers > 0 ? totalSeats / customers : inputs.avgSeats;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    totalSeats: Math.round(totalSeats),
                    avgSeatsPerCustomer: seatsPerCustomer,
                    revenue: revenue,
                    revenuePerCustomer: revenuePerCustomer
                });
            }

            return results;
        }
    }
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Format currency value with proper decimals
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage value
 */
function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
}

/**
 * Format large numbers with thousand separators
 */
function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/**
 * Validate input based on type
 */
function validateInput(type, value) {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) return false;
    if (numValue < 0) return false;

    if (type === 'percent' && numValue > 100) return false;

    return true;
}

/**
 * Calculate universal metrics that work across all models
 * Allows comparison even between different model families
 */
function calculateUniversalMetrics(modelKey, results, inputs) {
    if (!results || results.length === 0) return null;

    const totalRevenue = results.reduce((sum, r) => sum + (r.totalRevenue || r.revenue || r.mrr || 0), 0);
    const finalMonthRevenue = results[results.length - 1].totalRevenue
        || results[results.length - 1].revenue
        || results[results.length - 1].mrr
        || 0;
    const firstMonthRevenue = results[0].totalRevenue
        || results[0].revenue
        || results[0].mrr
        || 0;

    // Calculate month-over-month growth rate (average)
    let totalGrowth = 0;
    let growthMonths = 0;
    for (let i = 1; i < results.length; i++) {
        const currentRevenue = results[i].totalRevenue || results[i].revenue || results[i].mrr || 0;
        const previousRevenue = results[i-1].totalRevenue || results[i-1].revenue || results[i-1].mrr || 0;

        if (previousRevenue > 0) {
            const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
            totalGrowth += growth;
            growthMonths++;
        }
    }
    const avgMonthlyGrowth = growthMonths > 0 ? totalGrowth / growthMonths : 0;

    // Calculate revenue per customer (if applicable)
    const finalMonthCustomers = results[results.length - 1].customers
        || results[results.length - 1].totalCustomers
        || results[results.length - 1].paidUsers
        || results[results.length - 1].activeAccounts
        || 0;

    const revenuePerCustomer = finalMonthCustomers > 0 ? finalMonthRevenue / finalMonthCustomers : 0;

    // Calculate CAC, LTV, and related metrics (simplified estimates)
    // For accurate CAC, we'd need marketing/sales costs as inputs
    // For now, we'll estimate based on typical SaaS metrics

    // Estimate CAC as 3-6 months of revenue per customer (industry standard)
    const estimatedCAC = revenuePerCustomer * 4; // Conservative estimate

    // Calculate retention rate
    const retentionRate = inputs.churnRate !== undefined
        ? (100 - inputs.churnRate) / 100
        : 0.95; // Default 95% retention if not specified

    // Calculate average customer lifetime in months
    const avgLifetimeMonths = retentionRate > 0 ? 1 / (1 - retentionRate) : 24;

    // Calculate LTV (Lifetime Value)
    const estimatedLTV = revenuePerCustomer * avgLifetimeMonths;

    // Calculate LTV:CAC ratio
    const ltvCacRatio = estimatedCAC > 0 ? estimatedLTV / estimatedCAC : 0;

    // Calculate payback period in months
    const paybackPeriod = revenuePerCustomer > 0 ? estimatedCAC / revenuePerCustomer : 0;

    // Calculate gross margin (assume 80% for software, adjust if cost data available)
    const grossMargin = 0.80;

    // Revenue run rate (annualized based on final month)
    const revenueRunRate = finalMonthRevenue * 12;

    return {
        totalRevenue,
        finalMonthRevenue,
        avgMonthlyGrowth,
        revenuePerCustomer,
        estimatedCAC,
        estimatedLTV,
        ltvCacRatio,
        paybackPeriod,
        grossMargin,
        revenueRunRate,
        retentionRate: retentionRate * 100,
        avgLifetimeMonths,
        totalCustomers: finalMonthCustomers
    };
}

/**
 * Debounce function for input handling
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ========== FORM GENERATION ==========

/**
 * Generate dynamic form based on model inputs
 */
function generateForm(modelKey) {
    const model = models[modelKey];
    const formContainer = document.getElementById('inputForm');

    let formHTML = `<h3 class="text-lg font-semibold text-gray-100 mb-4">Input Parameters</h3>`;

    model.inputs.forEach(input => {
        formHTML += `
            <div class="mb-4">
                <label for="${input.name}" class="block text-sm font-medium text-gray-300 mb-1">
                    ${input.label}
                </label>
                <input
                    type="number"
                    id="${input.name}"
                    name="${input.name}"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value="${input.default}"
                    min="${input.min !== undefined ? input.min : 0}"
                    ${input.max !== undefined ? 'max="' + input.max + '"' : ''}
                    step="${input.step}"
                    data-type="${input.type}"
                />
            </div>
        `;
    });

    formContainer.innerHTML = formHTML;

    // Add input event listeners
    model.inputs.forEach(input => {
        const inputElement = document.getElementById(input.name);
        inputElement.addEventListener('input', onInputChange);
    });
}

// ========== CALCULATION ENGINE ==========

/**
 * Calculate results for the selected model
 */
function calculateModel(modelKey) {
    const model = models[modelKey];
    const inputs = {};

    // Gather input values
    model.inputs.forEach(input => {
        const element = document.getElementById(input.name);
        inputs[input.name] = parseFloat(element.value);
    });

    // Run calculation
    const results = model.calculate(inputs, CONFIG.defaultForecastMonths);

    return results;
}

// ========== CHART RENDERING ==========

/**
 * Destroy existing chart if it exists
 */
function destroyChart(chartKey) {
    if (chartInstances[chartKey]) {
        chartInstances[chartKey].destroy();
        chartInstances[chartKey] = null;
    }
}

/**
 * Render charts for the selected model
 */
function renderCharts(modelKey, data) {
    // Destroy existing charts
    destroyChart('primary');
    destroyChart('secondary1');
    destroyChart('secondary2');

    // Model-specific chart rendering
    if (modelKey === 'one-time') {
        renderOneTimePurchaseCharts(data);
    } else if (modelKey === 'subscription') {
        renderSubscriptionCharts(data);
    } else if (modelKey === 'freemium') {
        renderFreemiumCharts(data);
    } else if (modelKey === 'usage-based') {
        renderUsageBasedCharts(data);
    } else if (modelKey === 'tiered') {
        renderTieredCharts(data);
    } else if (modelKey === 'per-seat') {
        renderPerSeatCharts(data);
    }
}

function renderOneTimePurchaseCharts(data) {
    // Primary Chart: Revenue over time (stacked area)
    const primaryOptions = {
        series: [
            {
                name: 'License Revenue',
                data: data.map(d => d.licenseRevenue.toFixed(2))
            },
            {
                name: 'Maintenance Revenue',
                data: data.map(d => d.maintenanceRevenue.toFixed(2))
            }
        ],
        chart: {
            type: 'area',
            height: 400,
            stacked: true,
            toolbar: { show: true },
            background: 'transparent'
        },
        colors: [CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: {
                rotate: -45,
                rotateAlways: false,
                style: { colors: '#9CA3AF' }
            }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: {
                formatter: val => formatCurrency(val),
                style: { colors: '#9CA3AF' }
            }
        },
        grid: {
            borderColor: '#374151'
        },
        tooltip: {
            theme: 'dark',
            y: { formatter: val => formatCurrency(val) }
        },
        legend: {
            position: 'top',
            labels: { colors: '#9CA3AF' }
        },
        title: {
            text: 'Revenue Breakdown: License vs Maintenance',
            align: 'center',
            style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' }
        }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Total Revenue Line
    const secondary1Options = {
        series: [{
            name: 'Total Revenue',
            data: data.map(d => d.totalRevenue.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Total Monthly Revenue', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart1Container').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Customer Growth
    const secondary2Options = {
        series: [{
            name: 'Total Customers',
            data: data.map(d => d.totalCustomers)
        }],
        chart: { type: 'bar', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        plotOptions: {
            bar: { borderRadius: 4, dataLabels: { position: 'top' } }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Customers', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        title: { text: 'Customer Base Growth', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart2Container').classList.remove('hidden');
    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

function renderSubscriptionCharts(data) {
    // Primary Chart: MRR Growth
    const primaryOptions = {
        series: [
            {
                name: 'MRR',
                data: data.map(d => d.mrr.toFixed(2))
            },
            {
                name: 'ARR',
                data: data.map(d => d.arr.toFixed(2))
            }
        ],
        chart: { type: 'line', height: 400, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'MRR and ARR Growth', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Customer Count
    const secondary1Options = {
        series: [{
            name: 'Customers',
            data: data.map(d => d.customers)
        }],
        chart: { type: 'area', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.2 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Customers', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        title: { text: 'Customer Count', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart1Container').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: MRR Components
    const secondary2Options = {
        series: [
            {
                name: 'New MRR',
                data: data.map(d => d.newMRR.toFixed(2))
            },
            {
                name: 'Expansion MRR',
                data: data.map(d => d.expansionMRR.toFixed(2))
            },
            {
                name: 'Churned MRR',
                data: data.map(d => -d.churnedMRR.toFixed(2))
            }
        ],
        chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.positive, CONFIG.chartColors.moderate, CONFIG.chartColors.negative],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'MRR Change ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(Math.abs(val)) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'MRR Components', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart2Container').classList.remove('hidden');
    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

function renderFreemiumCharts(data) {
    // Primary Chart: Free vs Paid Users
    const primaryOptions = {
        series: [
            {
                name: 'Free Users',
                data: data.map(d => d.freeUsers)
            },
            {
                name: 'Paid Users',
                data: data.map(d => d.paidUsers)
            }
        ],
        chart: { type: 'area', height: 400, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.secondary, CONFIG.chartColors.positive],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.3 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Users', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Free vs Paid Users', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Revenue from Paid Users
    const secondary1Options = {
        series: [{
            name: 'Revenue',
            data: data.map(d => d.revenue.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Revenue from Paid Users', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart1Container').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Conversion Rate
    const secondary2Options = {
        series: [{
            name: 'Conversion Rate',
            data: data.map(d => d.conversionRate.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Conversion Rate (%)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => val.toFixed(1) + '%', style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => val.toFixed(1) + '%' } },
        title: { text: 'Free-to-Paid Conversion Rate', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart2Container').classList.remove('hidden');
    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

function renderUsageBasedCharts(data) {
    // Primary Chart: Revenue with variance band
    const primaryOptions = {
        series: [
            {
                name: 'Revenue',
                data: data.map(d => d.revenue.toFixed(2))
            },
            {
                name: 'High Range',
                data: data.map(d => d.revenueHigh.toFixed(2))
            },
            {
                name: 'Low Range',
                data: data.map(d => d.revenueLow.toFixed(2))
            }
        ],
        chart: { type: 'line', height: 400, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary, CONFIG.chartColors.positive, CONFIG.chartColors.negative],
        stroke: { curve: 'smooth', width: [3, 1, 1], dashArray: [0, 5, 5] },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Revenue with Usage Variance', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Average Usage per Customer
    const secondary1Options = {
        series: [{
            name: 'Avg Usage',
            data: data.map(d => d.avgUsage.toFixed(2))
        }],
        chart: { type: 'area', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.2 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Units', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) + ' units' } },
        title: { text: 'Avg Usage per Customer', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart1Container').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Revenue per Customer
    const secondary2Options = {
        series: [{
            name: 'Revenue per Customer',
            data: data.map(d => d.revenuePerCustomer.toFixed(2))
        }],
        chart: { type: 'bar', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Revenue per Customer', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart2Container').classList.remove('hidden');
    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

function renderTieredCharts(data) {
    // Primary Chart: Revenue by Tier
    const primaryOptions = {
        series: [
            {
                name: 'Starter Revenue',
                data: data.map(d => d.starterRevenue.toFixed(2))
            },
            {
                name: 'Professional Revenue',
                data: data.map(d => d.proRevenue.toFixed(2))
            },
            {
                name: 'Enterprise Revenue',
                data: data.map(d => d.enterpriseRevenue.toFixed(2))
            }
        ],
        chart: { type: 'area', height: 400, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.secondary, CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.3 } },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Revenue by Tier', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Customer Distribution by Tier
    const secondary1Options = {
        series: [
            {
                name: 'Starter',
                data: data.map(d => d.starterCustomers)
            },
            {
                name: 'Professional',
                data: data.map(d => d.proCustomers)
            },
            {
                name: 'Enterprise',
                data: data.map(d => d.enterpriseCustomers)
            }
        ],
        chart: { type: 'bar', height: 300, stacked: true, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.secondary, CONFIG.chartColors.primary, CONFIG.chartColors.positive],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Customers', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) } },
        legend: { position: 'top', labels: { colors: '#9CA3AF' } },
        title: { text: 'Customer Distribution by Tier', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart1Container').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Total Revenue
    const secondary2Options = {
        series: [{
            name: 'Total Revenue',
            data: data.map(d => d.totalRevenue.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Total Revenue', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart2Container').classList.remove('hidden');
    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

function renderPerSeatCharts(data) {
    // Primary Chart: Total Seats
    const primaryOptions = {
        series: [{
            name: 'Total Seats',
            data: data.map(d => d.totalSeats)
        }],
        chart: { type: 'area', height: 400, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.primary],
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.3 } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `Month ${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Seats', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatNumber(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatNumber(val) + ' seats' } },
        title: { text: 'Total Seats Over Time', align: 'center', style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('primaryChartContainer').classList.remove('hidden');
    chartInstances.primary = new ApexCharts(document.getElementById('primaryChart'), primaryOptions);
    chartInstances.primary.render();

    // Secondary Chart 1: Average Seats per Customer
    const secondary1Options = {
        series: [{
            name: 'Avg Seats',
            data: data.map(d => d.avgSeatsPerCustomer.toFixed(2))
        }],
        chart: { type: 'line', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.moderate],
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Seats', style: { color: '#9CA3AF' } },
            labels: { formatter: val => val.toFixed(1), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => val.toFixed(1) + ' seats' } },
        title: { text: 'Avg Seats per Customer', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart1Container').classList.remove('hidden');
    chartInstances.secondary1 = new ApexCharts(document.getElementById('secondaryChart1'), secondary1Options);
    chartInstances.secondary1.render();

    // Secondary Chart 2: Revenue
    const secondary2Options = {
        series: [{
            name: 'Revenue',
            data: data.map(d => d.revenue.toFixed(2))
        }],
        chart: { type: 'bar', height: 300, toolbar: { show: true }, background: 'transparent' },
        colors: [CONFIG.chartColors.positive],
        plotOptions: { bar: { borderRadius: 4 } },
        xaxis: {
            categories: data.map(d => `M${d.month}`),
            labels: { rotate: -45, style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            title: { text: 'Revenue ($)', style: { color: '#9CA3AF' } },
            labels: { formatter: val => formatCurrency(val), style: { colors: '#9CA3AF' } }
        },
        grid: { borderColor: '#374151' },
        tooltip: { theme: 'dark', y: { formatter: val => formatCurrency(val) } },
        title: { text: 'Monthly Revenue', align: 'center', style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' } }
    };

    document.getElementById('secondaryChart2Container').classList.remove('hidden');
    chartInstances.secondary2 = new ApexCharts(document.getElementById('secondaryChart2'), secondary2Options);
    chartInstances.secondary2.render();
}

/**
 * Update metrics panel with calculated values
 */
function updateMetrics(modelKey, data) {
    const metricsPanel = document.getElementById('metricsPanel');
    const metricsContent = document.getElementById('metricsContent');

    const lastMonth = data[data.length - 1];
    const firstMonth = data[0];

    // Calculate total revenue
    const totalRevenue = data.reduce((sum, d) => {
        if (modelKey === 'one-time') return sum + d.totalRevenue;
        if (modelKey === 'subscription') return sum + d.mrr;
        if (modelKey === 'freemium') return sum + d.revenue;
        if (modelKey === 'usage-based') return sum + d.revenue;
        if (modelKey === 'tiered') return sum + d.totalRevenue;
        if (modelKey === 'per-seat') return sum + d.revenue;
        return sum;
    }, 0);

    // Calculate average growth rate
    const revenueValues = data.map(d => {
        if (modelKey === 'one-time') return d.totalRevenue;
        if (modelKey === 'subscription') return d.mrr;
        if (modelKey === 'freemium') return d.revenue;
        if (modelKey === 'usage-based') return d.revenue;
        if (modelKey === 'tiered') return d.totalRevenue;
        if (modelKey === 'per-seat') return d.revenue;
        return 0;
    });

    let totalGrowth = 0;
    let growthCount = 0;
    for (let i = 1; i < revenueValues.length; i++) {
        if (revenueValues[i-1] > 0) {
            const growth = ((revenueValues[i] - revenueValues[i-1]) / revenueValues[i-1]) * 100;
            totalGrowth += growth;
            growthCount++;
        }
    }
    const avgGrowth = growthCount > 0 ? totalGrowth / growthCount : 0;

    // Model-specific metrics
    let metricsHTML = `
        <div class="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
            <div class="text-sm text-gray-400">Total Revenue</div>
            <div class="text-2xl font-bold text-gray-100">${formatCurrency(totalRevenue)}</div>
        </div>
        <div class="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
            <div class="text-sm text-gray-400">Avg Monthly Growth</div>
            <div class="text-2xl font-bold text-gray-100">${formatPercentage(avgGrowth)}</div>
        </div>
        <div class="bg-orange-900/30 border border-orange-700/50 rounded-lg p-4">
            <div class="text-sm text-gray-400">Final Month Revenue</div>
            <div class="text-2xl font-bold text-gray-100">${formatCurrency(revenueValues[revenueValues.length - 1])}</div>
        </div>
    `;

    // Add model-specific metric
    if (modelKey === 'subscription') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Final ARR</div>
                <div class="text-2xl font-bold text-gray-100">${formatCurrency(lastMonth.arr)}</div>
            </div>
        `;
    } else if (modelKey === 'freemium') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Conversion Rate</div>
                <div class="text-2xl font-bold text-gray-100">${formatPercentage(lastMonth.conversionRate)}</div>
            </div>
        `;
    } else if (modelKey === 'usage-based') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Avg Usage per Customer</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.avgUsage)}</div>
            </div>
        `;
    } else if (modelKey === 'tiered') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Total Customers</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.totalCustomers)}</div>
            </div>
        `;
    } else if (modelKey === 'per-seat') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Total Seats</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.totalSeats)}</div>
            </div>
        `;
    } else if (modelKey === 'one-time') {
        metricsHTML += `
            <div class="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                <div class="text-sm text-gray-400">Total Customers</div>
                <div class="text-2xl font-bold text-gray-100">${formatNumber(lastMonth.totalCustomers)}</div>
            </div>
        `;
    }

    metricsContent.innerHTML = metricsHTML;
    metricsPanel.classList.remove('hidden');
}

// ========== EVENT HANDLERS ==========

/**
 * Handle model selection change
 */
function onModelChange(event) {
    const selectedModel = event.target.value;

    if (!selectedModel) {
        document.getElementById('inputForm').innerHTML = '<p class="text-gray-400 text-sm">Select a model to see input fields</p>';
        document.getElementById('calculateBtn').disabled = true;

        // Hide all charts and metrics
        document.getElementById('metricsPanel').classList.add('hidden');
        document.getElementById('primaryChartContainer').classList.add('hidden');
        document.getElementById('secondaryChart1Container').classList.add('hidden');
        document.getElementById('secondaryChart2Container').classList.add('hidden');

        return;
    }

    // Generate form for selected model
    generateForm(selectedModel);

    // Enable calculate button
    document.getElementById('calculateBtn').disabled = false;

    // Auto-calculate with default values
    performCalculation();
}

/**
 * Handle input field changes (debounced)
 */
const onInputChange = debounce(function(event) {
    performCalculation();
}, CONFIG.debounceDelay);

/**
 * Handle calculate button click
 */
function onCalculate() {
    performCalculation();
}

/**
 * Perform the calculation and update UI
 */
function performCalculation() {
    if (selectedModels.size === 0) return;

    // Calculate results for all selected models
    const allResults = new Map();
    const allInputs = new Map();

    for (const modelKey of selectedModels) {
        const results = calculateModel(modelKey);
        const inputs = gatherInputs(modelKey);
        allResults.set(modelKey, results);
        allInputs.set(modelKey, inputs);
    }

    // Determine comparison type
    const comparison = canCompareModels(Array.from(selectedModels));

    // Update UI based on number of models selected
    if (selectedModels.size === 1) {
        // Single model view
        const modelKey = Array.from(selectedModels)[0];
        renderSingleModel(modelKey, allResults.get(modelKey), allInputs.get(modelKey));
    } else {
        // Multi-model comparison view
        renderComparison(allResults, allInputs, comparison);
    }
}

/**
 * Gather inputs for a specific model
 */
function gatherInputs(modelKey) {
    const model = models[modelKey];
    if (!model) return {};

    const inputs = {};
    for (const input of model.inputs) {
        const element = document.getElementById(input.name);
        if (element) {
            inputs[input.name] = parseFloat(element.value) || input.default || 0;
        } else {
            inputs[input.name] = input.default || 0;
        }
    }
    return inputs;
}

/**
 * Render single model view
 */
function renderSingleModel(modelKey, results, inputs) {
    // Hide comparison views
    document.getElementById('universalMetricsPanel').classList.add('hidden');
    document.getElementById('comparisonChartsContainer').classList.add('hidden');
    document.getElementById('comparisonTableContainer').classList.add('hidden');

    // Show single model views
    renderCharts(modelKey, results);
    updateMetrics(modelKey, results);
}

/**
 * Render multi-model comparison view
 */
function renderComparison(allResults, allInputs, comparison) {
    // Hide single model views
    document.getElementById('primaryChartContainer').classList.add('hidden');
    document.getElementById('secondaryChart1Container').classList.add('hidden');
    document.getElementById('secondaryChart2Container').classList.add('hidden');
    document.getElementById('metricsPanel').classList.add('hidden');

    // Show comparison views
    renderUniversalMetrics(allResults, allInputs);
    renderComparisonCharts(allResults, comparison);
    renderComparisonTable(allResults);
}

/**
 * Render universal metrics comparison for all selected models
 */
function renderUniversalMetrics(allResults, allInputs) {
    const panel = document.getElementById('universalMetricsPanel');
    const content = document.getElementById('universalMetricsContent');

    panel.classList.remove('hidden');
    content.innerHTML = '';

    // Calculate universal metrics for each model
    const metricsData = [];
    for (const [modelKey, results] of allResults) {
        const inputs = allInputs.get(modelKey);
        const metrics = calculateUniversalMetrics(modelKey, results, inputs);
        if (metrics) {
            metricsData.push({ modelKey, modelName: models[modelKey].name, metrics });
        }
    }

    // Create comparison cards grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    // Metrics to display
    const metricsToShow = [
        { key: 'totalRevenue', label: 'Total Revenue', format: formatCurrency },
        { key: 'finalMonthRevenue', label: 'Final Month Revenue', format: formatCurrency },
        { key: 'avgMonthlyGrowth', label: 'Avg Monthly Growth', format: (v) => formatPercentage(v) },
        { key: 'estimatedLTV', label: 'Estimated LTV', format: formatCurrency },
        { key: 'ltvCacRatio', label: 'LTV:CAC Ratio', format: (v) => v.toFixed(2) + ':1' },
        { key: 'paybackPeriod', label: 'Payback Period', format: (v) => v.toFixed(1) + ' months' }
    ];

    metricsToShow.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'bg-gray-700 rounded-lg p-4';

        const label = document.createElement('div');
        label.className = 'text-sm text-gray-400 mb-2';
        label.textContent = metric.label;
        card.appendChild(label);

        metricsData.forEach(data => {
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center mt-2';

            const modelName = document.createElement('span');
            modelName.className = 'text-xs text-gray-300';
            modelName.textContent = data.modelName;

            const value = document.createElement('span');
            value.className = 'text-sm font-semibold text-gray-100';
            value.textContent = metric.format(data.metrics[metric.key] || 0);

            row.appendChild(modelName);
            row.appendChild(value);
            card.appendChild(row);
        });

        grid.appendChild(card);
    });

    content.appendChild(grid);
}

/**
 * Render comparison charts for all selected models
 */
function renderComparisonCharts(allResults, comparison) {
    const container = document.getElementById('comparisonChartsContainer');
    container.classList.remove('hidden');
    container.innerHTML = '';

    if (comparison.type === 'family') {
        // Same family - create overlay charts
        renderFamilyOverlayChart(container, allResults, comparison.family);
    } else {
        // Different families - create side-by-side revenue charts
        renderSideBySideCharts(container, allResults);
    }
}

/**
 * Render overlay chart for same family models
 */
function renderFamilyOverlayChart(container, allResults, family) {
    const chartDiv = document.createElement('div');
    chartDiv.className = 'bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700';
    chartDiv.id = 'familyOverlayChart';
    container.appendChild(chartDiv);

    // Prepare series data for overlay
    const series = [];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    let colorIndex = 0;

    for (const [modelKey, results] of allResults) {
        // Determine which metric to use based on family
        let dataKey = 'revenue';
        if (family.commonMetrics.includes('mrr')) {
            dataKey = 'mrr';
        } else if (family.commonMetrics.includes('revenue')) {
            dataKey = 'revenue';
        } else if (family.commonMetrics.includes('totalRevenue')) {
            dataKey = 'totalRevenue';
        }

        const data = results.map(r => ({
            x: `Month ${r.month}`,
            y: r[dataKey] || r.revenue || r.mrr || r.totalRevenue || 0
        }));

        series.push({
            name: models[modelKey].name,
            data: data.map(d => d.y),
            color: colors[colorIndex % colors.length]
        });

        colorIndex++;
    }

    // Create ApexCharts overlay
    const options = {
        series: series,
        chart: {
            type: 'line',
            height: 400,
            background: '#1F2937',
            toolbar: { show: true }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: series[0]?.data.map((_, i) => `Month ${i + 1}`) || [],
            labels: { style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            labels: {
                style: { colors: '#9CA3AF' },
                formatter: (value) => formatCurrency(value)
            }
        },
        legend: {
            labels: { colors: '#9CA3AF' }
        },
        title: {
            text: `${family.name} - Revenue Comparison`,
            style: { color: '#F3F4F6' }
        },
        theme: { mode: 'dark' }
    };

    const chart = new ApexCharts(chartDiv, options);
    chart.render();
}

/**
 * Render side-by-side charts for different family models
 */
function renderSideBySideCharts(container, allResults) {
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    let colorIndex = 0;

    for (const [modelKey, results] of allResults) {
        const chartDiv = document.createElement('div');
        chartDiv.className = 'bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700';
        chartDiv.id = `comparison-chart-${modelKey}`;

        // Determine revenue metric
        const revenueData = results.map(r => r.totalRevenue || r.revenue || r.mrr || 0);

        const options = {
            series: [{
                name: 'Revenue',
                data: revenueData,
                color: colors[colorIndex % colors.length]
            }],
            chart: {
                type: 'area',
                height: 300,
                background: '#1F2937',
                toolbar: { show: false }
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.6,
                    opacityTo: 0.1
                }
            },
            xaxis: {
                categories: results.map(r => `Month ${r.month}`),
                labels: { style: { colors: '#9CA3AF' } }
            },
            yaxis: {
                labels: {
                    style: { colors: '#9CA3AF' },
                    formatter: (value) => formatCurrency(value)
                }
            },
            title: {
                text: models[modelKey].name,
                style: { color: '#F3F4F6' }
            },
            theme: { mode: 'dark' }
        };

        const chart = new ApexCharts(chartDiv, options);
        chart.render();
        grid.appendChild(chartDiv);

        colorIndex++;
    }

    container.appendChild(grid);
}

/**
 * Render comparison table with month-by-month data
 */
function renderComparisonTable(allResults) {
    const container = document.getElementById('comparisonTableContainer');
    const table = document.getElementById('comparisonTable');

    container.classList.remove('hidden');
    table.innerHTML = '';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = 'border-b border-gray-700';

    const monthHeader = document.createElement('th');
    monthHeader.className = 'text-left py-2 px-3 text-gray-300 font-semibold';
    monthHeader.textContent = 'Month';
    headerRow.appendChild(monthHeader);

    for (const [modelKey, _] of allResults) {
        const th = document.createElement('th');
        th.className = 'text-right py-2 px-3 text-gray-300 font-semibold';
        th.textContent = models[modelKey].name;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    const maxMonths = Math.max(...Array.from(allResults.values()).map(r => r.length));

    for (let i = 0; i < maxMonths; i++) {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-800 hover:bg-gray-750';

        const monthCell = document.createElement('td');
        monthCell.className = 'py-2 px-3 text-gray-400';
        monthCell.textContent = `Month ${i + 1}`;
        row.appendChild(monthCell);

        for (const [modelKey, results] of allResults) {
            const cell = document.createElement('td');
            cell.className = 'py-2 px-3 text-right text-gray-200';

            if (results[i]) {
                const revenue = results[i].totalRevenue || results[i].revenue || results[i].mrr || 0;
                cell.textContent = formatCurrency(revenue);
            } else {
                cell.textContent = '-';
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
}

// ========== INITIALIZATION ==========

/**
 * Initialize the application
 */
function init() {
    // Populate model selector with checkboxes grouped by family
    generateModelCheckboxes();

    // Add event listener to calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', onCalculate);
}

/**
 * Generate checkboxes for model selection grouped by family
 */
function generateModelCheckboxes() {
    const container = document.getElementById('modelSelector');
    container.innerHTML = '';

    // Group models by family for display
    for (const [familyKey, family] of Object.entries(MODEL_FAMILIES)) {
        // Create family group container
        const familyDiv = document.createElement('div');
        familyDiv.className = 'mb-4';

        // Family header
        const header = document.createElement('div');
        header.className = 'font-semibold text-gray-200 mb-2 text-sm';
        header.textContent = family.name;
        familyDiv.appendChild(header);

        // Family description
        const desc = document.createElement('div');
        desc.className = 'text-xs text-gray-500 mb-2';
        desc.textContent = family.description;
        familyDiv.appendChild(desc);

        // Checkboxes for models in this family
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'space-y-2 ml-2';

        for (const modelKey of family.models) {
            if (models[modelKey]) {
                const label = document.createElement('label');
                label.className = 'flex items-center space-x-2 cursor-pointer hover:text-gray-100 text-gray-300';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = modelKey;
                checkbox.id = `model-${modelKey}`;
                checkbox.className = 'rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500';
                checkbox.addEventListener('change', onModelSelectionChange);

                const span = document.createElement('span');
                span.className = 'text-sm';
                span.textContent = models[modelKey].name;

                label.appendChild(checkbox);
                label.appendChild(span);
                checkboxContainer.appendChild(label);
            }
        }

        familyDiv.appendChild(checkboxContainer);
        container.appendChild(familyDiv);
    }
}

/**
 * Handle model selection change
 */
function onModelSelectionChange(event) {
    const modelKey = event.target.value;

    if (event.target.checked) {
        selectedModels.add(modelKey);
    } else {
        selectedModels.delete(modelKey);
    }

    updateSelectedSummary();
    updateInputForms();
    updateCalculateButton();
}

/**
 * Update the selected models summary
 */
function updateSelectedSummary() {
    const summary = document.getElementById('selectedSummary');

    if (selectedModels.size === 0) {
        summary.textContent = 'No models selected';
        summary.className = 'mb-4 text-sm text-gray-400';
    } else {
        const modelNames = Array.from(selectedModels).map(key => models[key]?.name || key);
        summary.textContent = `Selected: ${modelNames.join(', ')}`;
        summary.className = 'mb-4 text-sm text-blue-400';
    }
}

/**
 * Update input forms based on selected models
 */
function updateInputForms() {
    const tabsContainer = document.getElementById('inputFormTabs');
    const formContainer = document.getElementById('inputForm');

    if (selectedModels.size === 0) {
        tabsContainer.classList.add('hidden');
        formContainer.innerHTML = '<p class="text-gray-400 text-sm">Select models to configure inputs</p>';
        return;
    }

    // Show tabs if multiple models selected
    if (selectedModels.size > 1) {
        tabsContainer.classList.remove('hidden');
        generateInputTabs();
    } else {
        tabsContainer.classList.add('hidden');
    }

    // Generate form for first selected model or active tab
    const firstModel = Array.from(selectedModels)[0];
    generateForm(firstModel);
}

/**
 * Generate tabs for input forms
 */
function generateInputTabs() {
    const tabsContainer = document.getElementById('inputFormTabs');
    tabsContainer.innerHTML = '';

    selectedModels.forEach(modelKey => {
        const button = document.createElement('button');
        button.textContent = models[modelKey].name;
        button.className = 'px-3 py-1 text-sm rounded bg-gray-700 text-gray-300 hover:bg-gray-600';
        button.dataset.model = modelKey;
        button.addEventListener('click', (e) => {
            // Update active tab styling
            tabsContainer.querySelectorAll('button').forEach(btn => {
                btn.className = 'px-3 py-1 text-sm rounded bg-gray-700 text-gray-300 hover:bg-gray-600';
            });
            e.target.className = 'px-3 py-1 text-sm rounded bg-blue-600 text-white';

            // Show form for this model
            generateForm(modelKey);
        });
        tabsContainer.appendChild(button);
    });

    // Set first tab as active
    if (tabsContainer.firstChild) {
        tabsContainer.firstChild.className = 'px-3 py-1 text-sm rounded bg-blue-600 text-white';
    }
}

/**
 * Update calculate button state
 */
function updateCalculateButton() {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.disabled = selectedModels.size === 0;
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
