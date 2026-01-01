// ========== MODEL FAMILIES ==========
export const MODEL_FAMILIES = {
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
export function getModelFamily(modelKey) {
    for (const [familyKey, family] of Object.entries(MODEL_FAMILIES)) {
        if (family.models.includes(modelKey)) {
            return { key: familyKey, ...family };
        }
    }
    return null;
}

// Helper function to check if models can be directly compared
export function canCompareModels(modelKeys) {
    if (modelKeys.length < 2) return { canCompare: true, type: 'single' };

    const families = modelKeys.map(key => getModelFamily(key));
    const uniqueFamilies = new Set(families.map(f => f?.key));

    if (uniqueFamilies.size === 1 && !uniqueFamilies.has('standalone')) {
        return { canCompare: true, type: 'family', family: families[0] };
    }

    return { canCompare: true, type: 'universal' };
}

