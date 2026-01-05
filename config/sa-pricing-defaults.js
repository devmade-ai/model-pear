// ========== SOUTH AFRICAN PRICING DEFAULTS ==========
// Realistic pricing for South African B2B software market
// All prices in ZAR (Rands)

export const SA_PRICING_DEFAULTS = {
    // ========== SUBSCRIPTION (SAAS) ==========
    subscription: {
        // Small business / basic tier
        basic: {
            price: 250,              // R250/month per customer
            costToServe: 80,         // R80/month infrastructure + support
            customers: 50,           // Typical starting customer base
            category: 'Small Business SaaS',
            examples: ['Basic CRM', 'Email marketing', 'Simple project management']
        },
        // Mid-market / standard tier
        standard: {
            price: 500,              // R500/month per customer
            costToServe: 150,        // R150/month infrastructure + support
            customers: 100,          // Typical starting customer base
            category: 'Mid-Market SaaS',
            examples: ['Full-featured CRM', 'Marketing automation', 'Team collaboration']
        },
        // Enterprise tier
        enterprise: {
            price: 1500,             // R1,500/month per customer
            costToServe: 400,        // R400/month infrastructure + support + CSM
            customers: 20,           // Typical starting customer base
            category: 'Enterprise SaaS',
            examples: ['Enterprise CRM', 'ERP modules', 'Advanced analytics platforms']
        }
    },

    // ========== USAGE-BASED ==========
    usageBased: {
        // API / Developer tools
        api: {
            pricePerUnit: 2.00,      // R2 per 1,000 API calls
            costPerUnit: 0.50,       // R0.50 per 1,000 API calls (infrastructure)
            monthlyUnits: 10000,     // 10,000 units (10M API calls)
            unitLabel: '1,000 API calls',
            category: 'API Platform',
            examples: ['Payment gateway', 'SMS API', 'Mapping service']
        },
        // CI/CD build minutes
        cicd: {
            pricePerUnit: 1.50,      // R1.50 per build minute
            costPerUnit: 0.30,       // R0.30 per build minute (compute)
            monthlyUnits: 2000,      // 2,000 build minutes/month
            unitLabel: 'build minute',
            category: 'CI/CD Platform',
            examples: ['GitHub Actions', 'GitLab CI', 'CircleCI']
        },
        // Transaction processing
        transaction: {
            pricePerUnit: 15.00,     // R15 per transaction
            costPerUnit: 3.00,       // R3 per transaction (processing + risk)
            monthlyUnits: 500,       // 500 transactions/month
            unitLabel: 'transaction',
            category: 'Payment Processing',
            examples: ['Payment gateway', 'Invoice processing', 'Payroll runs']
        }
    },

    // ========== PER-SEAT ==========
    perSeat: {
        // Developer tools
        devTools: {
            pricePerSeat: 350,       // R350/developer/month
            costPerSeat: 50,         // R50/developer/month (infrastructure)
            seats: 10,               // 10 developers
            category: 'Developer Tools',
            examples: ['IDE licenses', 'Code review platforms', 'Developer portals']
        },
        // Business operations software
        businessOps: {
            pricePerSeat: 250,       // R250/user/month
            costPerSeat: 70,         // R70/user/month (infrastructure + support)
            seats: 25,               // 25 users
            category: 'Business Operations',
            examples: ['CRM seats', 'ERP user licenses', 'HRIS employee records']
        },
        // Team collaboration
        collaboration: {
            pricePerSeat: 150,       // R150/user/month
            costPerSeat: 30,         // R30/user/month
            seats: 50,               // 50 users
            category: 'Team Collaboration',
            examples: ['Slack/Teams alternative', 'Project management', 'Document collaboration']
        }
    },

    // ========== ONE-TIME (PERPETUAL LICENSE) ==========
    oneTime: {
        // Small business software
        small: {
            licensePrice: 5000,      // R5,000 one-time
            maintenanceFee: 20,      // 20% annual (R1,000/year)
            maintenanceAttach: 60,   // 60% buy maintenance
            costToDeliver: 1500,     // R1,500 one-time cost (support, onboarding)
            monthlyCostPerCustomer: 50, // R50/month ongoing support cost
            unitsSoldPerMonth: 5,    // 5 licenses/month
            category: 'Small Business Software',
            examples: ['Accounting software', 'Inventory management', 'Point of sale']
        },
        // Enterprise software
        enterprise: {
            licensePrice: 50000,     // R50,000 one-time
            maintenanceFee: 20,      // 20% annual (R10,000/year)
            maintenanceAttach: 80,   // 80% buy maintenance
            costToDeliver: 15000,    // R15,000 one-time cost (implementation)
            monthlyCostPerCustomer: 500, // R500/month ongoing support cost
            unitsSoldPerMonth: 2,    // 2 licenses/month
            category: 'Enterprise Software',
            examples: ['ERP suite', 'Enterprise database', 'Security platform']
        }
    },

    // ========== MARKETPLACE (TWO-SIDED) ==========
    marketplace: {
        // Basic marketplace
        standard: {
            commissionRate: 10,      // 10% commission
            avgTransactionValue: 500, // R500 average transaction
            costPerTransaction: 15,   // R15 cost (payment processing, support)
            monthlyTransactions: 200, // 200 transactions/month
            activeBuyers: 100,        // 100 active buyers
            activeSellers: 20,        // 20 active sellers
            category: 'Standard Marketplace',
            examples: ['Freelance marketplace', 'B2B supplier marketplace', 'Service booking platform']
        },
        // High-value marketplace
        premium: {
            commissionRate: 5,       // 5% commission (lower % on higher values)
            avgTransactionValue: 5000, // R5,000 average transaction
            costPerTransaction: 50,   // R50 cost (higher touch, verification)
            monthlyTransactions: 50,  // 50 transactions/month
            activeBuyers: 30,         // 30 active buyers
            activeSellers: 10,        // 10 active sellers
            category: 'Premium Marketplace',
            examples: ['Enterprise software marketplace', 'Professional services marketplace', 'Equipment rental']
        }
    }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Get default configuration for a specific model and tier
 * @param {string} model - Model type (subscription, usageBased, perSeat, oneTime, marketplace)
 * @param {string} tier - Tier/category (basic, standard, enterprise, etc.)
 * @returns {object} Default configuration
 */
export function getDefaults(model, tier = 'standard') {
    if (!SA_PRICING_DEFAULTS[model]) {
        throw new Error(`Unknown model: ${model}`);
    }

    const defaults = SA_PRICING_DEFAULTS[model][tier];
    if (!defaults) {
        // If tier doesn't exist, return first available tier
        const firstTier = Object.keys(SA_PRICING_DEFAULTS[model])[0];
        return SA_PRICING_DEFAULTS[model][firstTier];
    }

    return defaults;
}

/**
 * Get all available tiers for a model
 * @param {string} model - Model type
 * @returns {array} Array of tier names
 */
export function getAvailableTiers(model) {
    if (!SA_PRICING_DEFAULTS[model]) {
        return [];
    }
    return Object.keys(SA_PRICING_DEFAULTS[model]);
}

/**
 * Calculate gross margin percentage
 * @param {number} price - Selling price
 * @param {number} cost - Cost to serve/deliver
 * @returns {number} Margin percentage
 */
export function calculateMargin(price, cost) {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
}

/**
 * Calculate minimum price for desired margin
 * @param {number} cost - Cost to serve/deliver
 * @param {number} desiredMargin - Desired margin percentage (e.g., 70 for 70%)
 * @returns {number} Minimum price
 */
export function calculateMinimumPrice(cost, desiredMargin) {
    if (desiredMargin >= 100) return Infinity;
    return cost / (1 - desiredMargin / 100);
}

/**
 * Calculate ROI for buyer
 * @param {number} valueReceived - Value buyer gets (revenue enabled, cost saved)
 * @param {number} price - Price paid
 * @returns {number} ROI multiple (e.g., 5.0 = 5x return)
 */
export function calculateBuyerROI(valueReceived, price) {
    if (price === 0) return Infinity;
    return valueReceived / price;
}
