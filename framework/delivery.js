// ========== LAYER 2: DELIVERY MECHANISMS ==========
export const LAYER_2_DELIVERY = {
    'cloud-saas': {
        name: 'Cloud-Hosted SaaS',
        description: 'Vendor manages infrastructure, automatic updates',
        costImpact: 'Base pricing (reference point)',
        margin: '85-95% gross margin typical',
        characteristics: ['Multi-tenant', 'Automatic updates', 'No user maintenance'],
        pricingMultiplier: 1.0,
        setupCost: 0,
        maintenanceMultiplier: 0
    },
    'self-hosted': {
        name: 'Self-Hosted/On-Premise',
        description: 'Customer manages infrastructure on their servers',
        pricingModel: 'One-time license + annual maintenance',
        licenseMultiplier: 20, // 20x MRR as one-time license
        maintenanceMultiplier: 0.25, // 25% of license fee annually
        costImpact: 'Higher upfront, lower recurring',
        margin: '70-85% gross margin typical',
        trend: 'Declining except regulated industries',
        setupCost: 'high'
    },
    'hybrid': {
        name: 'Hybrid Cloud',
        description: 'Core cloud-hosted, sensitive data on-premise',
        costImpact: '+30-50% vs pure cloud due to complexity',
        pricingMultiplier: 1.4, // 40% premium
        setupCost: 'medium',
        margin: '75-85% gross margin typical',
        industries: ['Financial services', 'Healthcare', 'Government']
    },
    'mobile': {
        name: 'Mobile Applications',
        description: 'Native iOS/Android apps as primary interface',
        appStoreFees: {
            apple: '30% year 1, 15% year 2+ (avoid with external signup)',
            google: '15% (can bypass with direct payment)'
        },
        devCostReduction: 'React Native reduces cost 40-60% vs native',
        costImpact: 'Development cost -40-60% with cross-platform',
        pricingMultiplier: 0.85, // 15% lower to account for app store fees
        margin: '60-80% gross margin after app store fees'
    },
    'api-embedded': {
        name: 'API/Embedded',
        description: 'Programmatic access embedded in customer products',
        pricingModel: 'Usage-based dominant',
        costImpact: 'Higher technical support costs',
        pricingMultiplier: 1.2, // 20% premium for API support
        requirements: ['Developer documentation', 'SDKs', 'API monitoring'],
        margin: '80-90% gross margin typical'
    }
};

