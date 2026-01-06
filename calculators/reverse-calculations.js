// ========== REVERSE CALCULATIONS ==========
// Calculate missing inputs based on other known inputs

/**
 * Calculate optimal price for subscription model
 * @param {Object} inputs - Known inputs
 * @param {string} strategy - 'minimum' | 'balanced' | 'maximum'
 * @returns {number} Calculated price
 */
export function calculateSubscriptionPrice(inputs, strategy = 'balanced') {
    const { costToServe, desiredMargin, buyerValue } = inputs;

    // Calculate seller floor (minimum viable price)
    const sellerFloor = desiredMargin >= 100 ? Infinity :
        costToServe / (1 - desiredMargin / 100);

    // Calculate buyer ceiling (maximum price for 2.5x ROI)
    const buyerCeiling = buyerValue * 0.4;

    // Return based on strategy
    if (strategy === 'minimum') {
        return sellerFloor;
    } else if (strategy === 'maximum') {
        return buyerCeiling;
    } else {
        // Balanced - midpoint
        return (sellerFloor + buyerCeiling) / 2;
    }
}

/**
 * Calculate required buyer value for subscription model
 * @param {Object} inputs - Known inputs
 * @returns {number} Minimum buyer value needed
 */
export function calculateSubscriptionBuyerValue(inputs) {
    const { monthlyPrice } = inputs;

    // For 2.5x ROI threshold: price = value × 0.4
    // Therefore: value = price / 0.4
    return monthlyPrice / 0.4;
}

/**
 * Calculate achievable margin for subscription model
 * @param {Object} inputs - Known inputs
 * @returns {number} Margin percentage
 */
export function calculateSubscriptionMargin(inputs) {
    const { monthlyPrice, costToServe } = inputs;

    if (monthlyPrice === 0) return 0;

    // Margin = (1 - cost/price) × 100
    return (1 - costToServe / monthlyPrice) * 100;
}

/**
 * Calculate maximum cost to serve for subscription model
 * @param {Object} inputs - Known inputs
 * @returns {number} Maximum cost
 */
export function calculateSubscriptionCost(inputs) {
    const { monthlyPrice, desiredMargin } = inputs;

    // Cost = price × (1 - margin/100)
    return monthlyPrice * (1 - desiredMargin / 100);
}

// ========== USAGE-BASED MODEL ==========

export function calculateUsageBasedPrice(inputs, strategy = 'balanced') {
    const { costPerUnit, desiredMargin, buyerValuePerUnit } = inputs;

    const sellerFloor = desiredMargin >= 100 ? Infinity :
        costPerUnit / (1 - desiredMargin / 100);
    const buyerCeiling = buyerValuePerUnit * 0.4;

    if (strategy === 'minimum') {
        return sellerFloor;
    } else if (strategy === 'maximum') {
        return buyerCeiling;
    } else {
        return (sellerFloor + buyerCeiling) / 2;
    }
}

export function calculateUsageBasedBuyerValue(inputs) {
    const { pricePerUnit } = inputs;
    return pricePerUnit / 0.4;
}

export function calculateUsageBasedMargin(inputs) {
    const { pricePerUnit, costPerUnit } = inputs;
    if (pricePerUnit === 0) return 0;
    return (1 - costPerUnit / pricePerUnit) * 100;
}

export function calculateUsageBasedCost(inputs) {
    const { pricePerUnit, desiredMargin } = inputs;
    return pricePerUnit * (1 - desiredMargin / 100);
}

// ========== PER-SEAT MODEL ==========

export function calculatePerSeatPrice(inputs, strategy = 'balanced') {
    const { costPerSeat, desiredMargin, valuePerSeat } = inputs;

    const sellerFloor = desiredMargin >= 100 ? Infinity :
        costPerSeat / (1 - desiredMargin / 100);
    const buyerCeiling = valuePerSeat * 0.4;

    if (strategy === 'minimum') {
        return sellerFloor;
    } else if (strategy === 'maximum') {
        return buyerCeiling;
    } else {
        return (sellerFloor + buyerCeiling) / 2;
    }
}

export function calculatePerSeatBuyerValue(inputs) {
    const { pricePerSeat } = inputs;
    return pricePerSeat / 0.4;
}

export function calculatePerSeatMargin(inputs) {
    const { pricePerSeat, costPerSeat } = inputs;
    if (pricePerSeat === 0) return 0;
    return (1 - costPerSeat / pricePerSeat) * 100;
}

export function calculatePerSeatCost(inputs) {
    const { pricePerSeat, desiredMargin } = inputs;
    return pricePerSeat * (1 - desiredMargin / 100);
}

// ========== ONE-TIME PURCHASE MODEL ==========

export function calculateOneTimePrice(inputs, strategy = 'balanced') {
    const { costToDeliver, desiredMargin, buyerValuePerYear } = inputs;

    const sellerFloor = desiredMargin >= 100 ? Infinity :
        costToDeliver / (1 - desiredMargin / 100);
    const buyerCeiling = buyerValuePerYear * 0.5; // 2x ROI in year 1

    if (strategy === 'minimum') {
        return sellerFloor;
    } else if (strategy === 'maximum') {
        return buyerCeiling;
    } else {
        return (sellerFloor + buyerCeiling) / 2;
    }
}

export function calculateOneTimeBuyerValue(inputs) {
    const { licensePrice } = inputs;
    // For 2x ROI in year 1: price = value × 0.5
    // Therefore: value = price / 0.5
    return licensePrice / 0.5;
}

export function calculateOneTimeMargin(inputs) {
    const { licensePrice, costToDeliver } = inputs;
    if (licensePrice === 0) return 0;
    return (1 - costToDeliver / licensePrice) * 100;
}

export function calculateOneTimeCost(inputs) {
    const { licensePrice, desiredMargin } = inputs;
    return licensePrice * (1 - desiredMargin / 100);
}

// ========== MARKETPLACE MODEL ==========

export function calculateMarketplaceCommission(inputs, strategy = 'balanced') {
    const { costPerTransaction, desiredMargin, sellerValuePerTransaction, avgTransactionValue } = inputs;

    // Minimum commission rate
    const sellerFloor = desiredMargin >= 100 ? 100 :
        (costPerTransaction / avgTransactionValue) / (1 - desiredMargin / 100) * 100;

    // Maximum commission rate (30% of seller's profit)
    const buyerCeiling = avgTransactionValue > 0 ?
        (sellerValuePerTransaction * 0.3) / avgTransactionValue * 100 : 0;

    if (strategy === 'minimum') {
        return sellerFloor;
    } else if (strategy === 'maximum') {
        return buyerCeiling;
    } else {
        return (sellerFloor + buyerCeiling) / 2;
    }
}

export function calculateMarketplaceBuyerValue(inputs) {
    const { commissionRate, avgTransactionValue } = inputs;
    // Maximum commission takes 30% of seller profit
    // commission = (sellerValue × 0.3) / avgTxValue × 100
    // Therefore: sellerValue = (commission × avgTxValue) / 30
    return (commissionRate * avgTransactionValue) / 30;
}

export function calculateMarketplaceMargin(inputs) {
    const { commissionRate, costPerTransaction, avgTransactionValue } = inputs;
    const commissionPerTransaction = avgTransactionValue * (commissionRate / 100);
    if (commissionPerTransaction === 0) return 0;
    return (1 - costPerTransaction / commissionPerTransaction) * 100;
}

export function calculateMarketplaceCost(inputs) {
    const { commissionRate, desiredMargin, avgTransactionValue } = inputs;
    const commissionPerTransaction = avgTransactionValue * (commissionRate / 100);
    return commissionPerTransaction * (1 - desiredMargin / 100);
}

// ========== GENERIC CALCULATION ROUTER ==========

/**
 * Calculate missing input based on model and calculation mode
 * @param {string} modelKey - Model identifier
 * @param {string} calculateField - Field to calculate
 * @param {Object} inputs - Known inputs
 * @param {string} strategy - Pricing strategy (for price calculations)
 * @returns {number} Calculated value
 */
export function calculateMissingInput(modelKey, calculateField, inputs, strategy = 'balanced') {
    const calculators = {
        'subscription': {
            'monthlyPrice': () => calculateSubscriptionPrice(inputs, strategy),
            'buyerValue': () => calculateSubscriptionBuyerValue(inputs),
            'desiredMargin': () => calculateSubscriptionMargin(inputs),
            'costToServe': () => calculateSubscriptionCost(inputs)
        },
        'usage-based': {
            'pricePerUnit': () => calculateUsageBasedPrice(inputs, strategy),
            'buyerValuePerUnit': () => calculateUsageBasedBuyerValue(inputs),
            'desiredMargin': () => calculateUsageBasedMargin(inputs),
            'costPerUnit': () => calculateUsageBasedCost(inputs)
        },
        'per-seat': {
            'pricePerSeat': () => calculatePerSeatPrice(inputs, strategy),
            'valuePerSeat': () => calculatePerSeatBuyerValue(inputs),
            'desiredMargin': () => calculatePerSeatMargin(inputs),
            'costPerSeat': () => calculatePerSeatCost(inputs)
        },
        'one-time': {
            'licensePrice': () => calculateOneTimePrice(inputs, strategy),
            'buyerValuePerYear': () => calculateOneTimeBuyerValue(inputs),
            'desiredMargin': () => calculateOneTimeMargin(inputs),
            'costToDeliver': () => calculateOneTimeCost(inputs)
        },
        'marketplace': {
            'commissionRate': () => calculateMarketplaceCommission(inputs, strategy),
            'sellerValuePerTransaction': () => calculateMarketplaceBuyerValue(inputs),
            'desiredMargin': () => calculateMarketplaceMargin(inputs),
            'costPerTransaction': () => calculateMarketplaceCost(inputs)
        }
    };

    const modelCalculators = calculators[modelKey];
    if (!modelCalculators) {
        throw new Error(`Unknown model: ${modelKey}`);
    }

    const calculator = modelCalculators[calculateField];
    if (!calculator) {
        throw new Error(`Cannot calculate ${calculateField} for ${modelKey}`);
    }

    return calculator();
}

/**
 * Get available calculation options for a model
 * @param {string} modelKey - Model identifier
 * @returns {Array} Array of {value, label, description} objects
 */
export function getCalculationOptions(modelKey) {
    const options = {
        'subscription': [
            {
                value: 'none',
                label: 'Enter All Inputs Manually',
                description: 'I know all values and want to analyze current pricing'
            },
            {
                value: 'monthlyPrice',
                label: 'Calculate Optimal Price',
                description: 'Find the best price based on costs and buyer value',
                requiresStrategy: true
            },
            {
                value: 'buyerValue',
                label: 'Calculate Required Buyer Value',
                description: 'How much value must I deliver at this price?'
            },
            {
                value: 'desiredMargin',
                label: 'Calculate Achievable Margin',
                description: 'What margin can I achieve with these costs and price?'
            },
            {
                value: 'costToServe',
                label: 'Calculate Maximum Cost',
                description: 'What\'s my cost ceiling to maintain desired margin?'
            }
        ],
        'usage-based': [
            {
                value: 'none',
                label: 'Enter All Inputs Manually',
                description: 'I know all values and want to analyze current pricing'
            },
            {
                value: 'pricePerUnit',
                label: 'Calculate Optimal Price per Unit',
                description: 'Find the best unit price based on costs and buyer value',
                requiresStrategy: true
            },
            {
                value: 'buyerValuePerUnit',
                label: 'Calculate Required Value per Unit',
                description: 'How much value must each unit deliver?'
            },
            {
                value: 'desiredMargin',
                label: 'Calculate Achievable Margin',
                description: 'What margin can I achieve with these costs and price?'
            },
            {
                value: 'costPerUnit',
                label: 'Calculate Maximum Cost per Unit',
                description: 'What\'s my cost ceiling per unit?'
            }
        ],
        'per-seat': [
            {
                value: 'none',
                label: 'Enter All Inputs Manually',
                description: 'I know all values and want to analyze current pricing'
            },
            {
                value: 'pricePerSeat',
                label: 'Calculate Optimal Price per Seat',
                description: 'Find the best seat price based on costs and buyer value',
                requiresStrategy: true
            },
            {
                value: 'valuePerSeat',
                label: 'Calculate Required Value per Seat',
                description: 'How much value must each seat deliver?'
            },
            {
                value: 'desiredMargin',
                label: 'Calculate Achievable Margin',
                description: 'What margin can I achieve with these costs and price?'
            },
            {
                value: 'costPerSeat',
                label: 'Calculate Maximum Cost per Seat',
                description: 'What\'s my cost ceiling per seat?'
            }
        ],
        'one-time': [
            {
                value: 'none',
                label: 'Enter All Inputs Manually',
                description: 'I know all values and want to analyze current pricing'
            },
            {
                value: 'licensePrice',
                label: 'Calculate Optimal License Price',
                description: 'Find the best license price based on costs and buyer value',
                requiresStrategy: true
            },
            {
                value: 'buyerValuePerYear',
                label: 'Calculate Required Annual Value',
                description: 'How much annual value must I deliver?'
            },
            {
                value: 'desiredMargin',
                label: 'Calculate Achievable Margin',
                description: 'What margin can I achieve with these costs and price?'
            },
            {
                value: 'costToDeliver',
                label: 'Calculate Maximum Delivery Cost',
                description: 'What\'s my cost ceiling for delivery?'
            }
        ],
        'marketplace': [
            {
                value: 'none',
                label: 'Enter All Inputs Manually',
                description: 'I know all values and want to analyze current pricing'
            },
            {
                value: 'commissionRate',
                label: 'Calculate Optimal Commission Rate',
                description: 'Find the best commission based on costs and seller value',
                requiresStrategy: true
            },
            {
                value: 'sellerValuePerTransaction',
                label: 'Calculate Required Seller Value',
                description: 'How much profit must sellers make per transaction?'
            },
            {
                value: 'desiredMargin',
                label: 'Calculate Achievable Margin',
                description: 'What margin can I achieve with these costs and commission?'
            },
            {
                value: 'costPerTransaction',
                label: 'Calculate Maximum Cost per Transaction',
                description: 'What\'s my cost ceiling per transaction?'
            }
        ]
    };

    return options[modelKey] || [];
}
