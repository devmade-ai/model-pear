// ========== REVERSE CALCULATIONS ==========
// These functions let users work backwards from what they know.
//
// Why "reverse" calculations?
// - Users often know their costs and buyer value, but not the optimal price
// - Or they have a price in mind and want to know what margin they'll achieve
// - This inverts the normal "input everything, see results" flow

/**
 * Calculate optimal price for subscription model
 *
 * Three pricing strategies serve different business goals:
 * - minimum: Win on price (seller floor) - use when competing on cost
 * - balanced: Fair to both sides (midpoint) - default, sustainable long-term
 * - maximum: Capture full value (buyer ceiling) - use when you have pricing power
 */
export function calculateSubscriptionPrice(inputs, strategy = 'balanced') {
    const { costToServe, desiredMargin, buyerValue } = inputs;

    // Seller floor: the minimum price to cover costs AND hit target margin
    // Formula: cost / (1 - margin) because margin = (price - cost) / price
    const sellerFloor = desiredMargin >= 100 ? Infinity :
        costToServe / (1 - desiredMargin / 100);

    // Buyer ceiling: maximum price that still gives buyer 2.5x ROI
    // At 40% of value, buyer gets R2.50 back for every R1 spent
    const buyerCeiling = buyerValue * 0.4;

    if (strategy === 'minimum') {
        return sellerFloor;
    } else if (strategy === 'maximum') {
        return buyerCeiling;
    } else {
        // Balanced: split the difference - both parties "win" equally
        return (sellerFloor + buyerCeiling) / 2;
    }
}

/**
 * Calculate required buyer value for subscription model
 *
 * Why divide by 0.4?
 * - We assume buyers need at least 2.5x ROI to justify the purchase
 * - If price = value × 0.4, then value = price / 0.4
 * - Example: R500 price requires R1,250 monthly value to hit 2.5x ROI
 */
export function calculateSubscriptionBuyerValue(inputs) {
    const { monthlyPrice } = inputs;
    return monthlyPrice / 0.4;
}

/**
 * Calculate achievable margin for subscription model
 *
 * Why this formula?
 * - Margin = (revenue - cost) / revenue = 1 - (cost/revenue)
 * - User asks: "If I charge R500 and it costs R150, what's my margin?"
 * - Answer: 1 - (150/500) = 0.70 = 70%
 */
export function calculateSubscriptionMargin(inputs) {
    const { monthlyPrice, costToServe } = inputs;
    if (monthlyPrice === 0) return 0;
    return (1 - costToServe / monthlyPrice) * 100;
}

/**
 * Calculate maximum cost to serve for subscription model
 *
 * Why this matters?
 * - User asks: "I charge R500 and want 70% margin. What's my cost ceiling?"
 * - This tells them the maximum they can spend per customer and still hit margin
 * - Answer: R500 × (1 - 0.70) = R150 max cost
 */
export function calculateSubscriptionCost(inputs) {
    const { monthlyPrice, desiredMargin } = inputs;
    return monthlyPrice * (1 - desiredMargin / 100);
}

// ========== USAGE-BASED MODEL ==========
// Same equilibrium logic as subscription, but applied per-unit instead of per-customer

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
// Same equilibrium logic, applied per-seat/per-user

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
// Different ROI threshold: buyers expect 2x (not 2.5x) for upfront purchases
// because they're buying once, not committing to recurring payments

export function calculateOneTimePrice(inputs, strategy = 'balanced') {
    const { costToDeliver, desiredMargin, buyerValuePerYear } = inputs;

    const sellerFloor = desiredMargin >= 100 ? Infinity :
        costToDeliver / (1 - desiredMargin / 100);
    // 0.5 = 50% of annual value = 2x ROI in first year
    // Lower threshold than subscription because it's a one-time commitment
    const buyerCeiling = buyerValuePerYear * 0.5;

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
    // For 2x ROI in year 1, annual value must be 2x the license price
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
// Unique: the "buyer" is actually the merchant selling on your platform
// They'll accept commission that leaves them profitable, but not too greedy

export function calculateMarketplaceCommission(inputs, strategy = 'balanced') {
    const { costPerTransaction, desiredMargin, sellerValuePerTransaction, avgTransactionValue } = inputs;

    // Platform's minimum commission rate to cover costs and hit margin
    const sellerFloor = desiredMargin >= 100 ? 100 :
        (costPerTransaction / avgTransactionValue) / (1 - desiredMargin / 100) * 100;

    // Maximum commission merchants will tolerate: 30% of their profit
    // Beyond this, merchants won't see the platform as worth it
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
    // Invert the 30% rule: if commission is X%, what profit must merchants make
    // for that to be only 30% of their margin?
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
// Maps model + field combinations to the right calculator function
// This keeps the engine.js simple - it just calls calculateMissingInput()

/**
 * Route to the correct calculator based on model and field
 *
 * Why a router pattern?
 * - Each model has 4 possible calculations (price, value, margin, cost)
 * - 5 models × 4 calculations = 20 combinations
 * - Router keeps the calling code clean: one function, any combination
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
 *
 * Why per-model options?
 * - Each model has different field names (monthlyPrice vs pricePerUnit vs licensePrice)
 * - Descriptions need to be contextual ("Calculate Optimal Price per Seat" not just "Calculate Price")
 * - Some options require pricing strategy selection (price calculations), others don't
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
