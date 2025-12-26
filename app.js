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

// ========== LAYER 1: CORE FUNCTION CATEGORIES ==========
const LAYER_1_CATEGORIES = {
    'dev-devops': {
        name: 'Development & DevOps Infrastructure',
        description: 'Tools enabling software creation, version control, CI/CD, API platforms',
        examples: ['IDEs', 'Git platforms', 'CI/CD pipelines', 'API platforms', 'Container registries'],
        applicableModels: ['per-seat', 'usage-based', 'professional-services', 'credits-token', 'freemium', 'open-core', 'one-time'],
        pricingContext: {
            'per-seat': {
                range: 'R350-R800/developer/month',
                examples: ['IDE licenses', 'Code review platforms', 'Developer portals'],
                seatExpansion: '15-25% annual',
                typicalChurn: '5-10%',
                default: 575
            },
            'usage-based': {
                range: 'R0.80-R3/build minute, R0.50-R50/1k API calls',
                examples: ['CI/CD build minutes', 'API calls', 'Container pulls'],
                growthRate: '15-30% monthly',
                default: 1.50
            },
            'professional-services': {
                range: 'R800-R2,500/hour for implementation',
                examples: ['Custom CI/CD setup', 'API integration services'],
                attachRate: '40-60%',
                default: 1500
            },
            'credits-token': {
                range: 'R1,000 = 50k-200k API calls',
                examples: ['Multi-service developer platforms'],
                default: 1000
            },
            'freemium': {
                freeLimit: '50-500 builds/month or 100k API calls/month',
                conversion: '3-8%',
                default: 99
            },
            'open-core': {
                range: 'R200-R1,500/user/month for enterprise features',
                examples: ['Enterprise Git features', 'Advanced CI/CD analytics'],
                default: 500
            },
            'one-time': {
                range: 'R5,000-R50,000 perpetual license',
                maintenance: '20-25% annual',
                default: 15000
            }
        }
    },
    'business-ops': {
        name: 'Business Operations Software',
        description: 'CRM, ERP, HRM, Payroll, Financial Accounting',
        examples: ['Salesforce', 'SAP', 'Workday', 'QuickBooks', 'Oracle ERP'],
        applicableModels: ['per-seat', 'professional-services', 'usage-based', 'pay-per-transaction', 'retainer', 'ela'],
        pricingContext: {
            'per-seat': {
                range: 'R250-R1,500/user/month',
                examples: ['CRM sales rep licenses', 'ERP user licenses', 'HRIS employee records'],
                tierDistribution: '60% lowest tier, 25% mid-tier, 15% enterprise',
                typicalChurn: '3-7%',
                default: 750
            },
            'professional-services': {
                range: 'R1,000-R2,500/hour',
                examples: ['CRM implementation', 'ERP customization', 'Data migration'],
                projectSize: 'R100,000-R5,000,000',
                attachRate: '70-90%',
                default: 1800
            },
            'usage-based': {
                range: 'R150-R400/employee/month (all employees)',
                examples: ['Full HRIS platforms', 'Payroll processing per employee'],
                default: 250
            },
            'pay-per-transaction': {
                range: 'R5-R50/transaction',
                examples: ['Payroll runs', 'Invoice processing', 'Approval workflows'],
                default: 15
            },
            'retainer': {
                range: 'R40,000-R350,000/month',
                examples: ['Ongoing CRM optimization', 'ERP support retainer'],
                default: 100000
            },
            'ela': {
                range: 'R500,000-R5,000,000/year',
                examples: ['Enterprise CRM for 500+ users', 'Full ERP suite'],
                duration: '3-5 years typical',
                default: 1500000
            }
        }
    },
    'marketing': {
        name: 'Marketing & Customer Engagement',
        description: 'Marketing automation, email, SMS, customer data platforms',
        examples: ['Mailchimp', 'HubSpot', 'Twilio', 'Segment', 'SendGrid'],
        applicableModels: ['usage-based', 'per-seat', 'credits-token', 'freemium'],
        pricingContext: {
            'usage-based': {
                tiers: [
                    { contacts: 500, price: 200 },
                    { contacts: 2500, price: 500 },
                    { contacts: 10000, price: 1500 },
                    { contacts: 50000, price: 5000 },
                    { contacts: 100000, price: 10000 }
                ],
                overage: 'R0.20-R1/contact/month',
                messaging: 'R0.50-R2/1k emails, R0.60-R1.20/SMS',
                default: 1500
            },
            'per-seat': {
                range: 'R400-R1,200/marketer/month',
                examples: ['Marketing automation seats', 'Campaign manager licenses'],
                default: 700
            },
            'credits-token': {
                range: 'R1,000 = 50k emails or 5k SMS',
                examples: ['Multi-channel messaging platforms'],
                default: 1000
            },
            'freemium': {
                freeLimit: '2,000 contacts, 10k emails/month',
                conversion: '4-7%',
                paidStart: 'R200-R500/month',
                default: 300
            }
        }
    },
    'productivity': {
        name: 'Workplace Productivity & Collaboration',
        description: 'Project management, team chat, video conferencing, document collaboration',
        examples: ['Slack', 'Zoom', 'Notion', 'Asana', 'Microsoft Teams'],
        applicableModels: ['per-seat', 'freemium', 'usage-based'],
        pricingContext: {
            'per-seat': {
                range: 'R100-R800/user/month',
                tiers: ['Basic R100-R200', 'Professional R250-R400', 'Enterprise R500-R800'],
                seatExpansion: '15-25% annual',
                typicalChurn: '5-12%',
                default: 300
            },
            'freemium': {
                freeLimit: '2-15 users, basic features, limited storage',
                conversion: '4-7%',
                triggers: ['Team size limits', 'Storage limits', 'Feature restrictions'],
                paidStart: 'R150-R400/user/month',
                default: 250
            },
            'usage-based': {
                range: 'R0.20-R2/meeting minute, R50-R200/GB storage',
                examples: ['Video conferencing minutes', 'Cloud storage'],
                default: 0.80
            }
        }
    },
    'data-analytics': {
        name: 'Data & Analytics',
        description: 'Data warehouses, BI platforms, ML platforms, AI APIs',
        examples: ['Snowflake', 'Tableau', 'Databricks', 'Anthropic Claude API', 'OpenAI'],
        applicableModels: ['usage-based', 'per-seat', 'professional-services', 'data-licensing', 'credits-token'],
        pricingContext: {
            'usage-based': {
                storage: 'R150-R400/TB/month',
                compute: 'R5-R15/hour',
                dataScanned: 'R50-R150/TB processed',
                streaming: 'R0.50-R2/GB ingested',
                aiTokens: 'R0.30-R5/1k tokens (model-dependent)',
                examples: [
                    'Claude Sonnet 4: R30/M input tokens, R150/M output tokens',
                    'Training jobs: R50-R500/hour',
                    'Inference: R0.01-R1/prediction'
                ],
                default: 250
            },
            'per-seat': {
                range: 'R500-R2,000/analyst/month',
                examples: ['BI platform licenses', 'Data science workspace seats'],
                default: 1000
            },
            'professional-services': {
                range: 'R1,500-R3,000/hour',
                examples: ['Data warehouse setup', 'ML model development', 'BI dashboard creation'],
                projectSize: 'R200,000-R2,000,000',
                default: 2000
            },
            'data-licensing': {
                range: 'R50,000-R500,000/dataset/year',
                examples: ['Industry datasets', 'Trained models', 'Benchmark data'],
                default: 150000
            },
            'credits-token': {
                range: 'R1,000 = 500k-5M tokens depending on model',
                examples: ['AI API credits', 'Compute credits'],
                default: 1000
            }
        }
    },
    'security': {
        name: 'Security & Compliance',
        description: 'Endpoint security, SIEM, IAM, vulnerability scanning, compliance',
        examples: ['CrowdStrike', 'Splunk', 'Okta', 'Qualys', 'Tenable'],
        applicableModels: ['per-seat', 'managed-services', 'usage-based', 'ela', 'professional-services'],
        pricingContext: {
            'per-seat': {
                endpoint: 'R50-R300/device/month',
                identity: 'R80-R400/user/month',
                training: 'R30-R100/user/year',
                typicalChurn: '2-5%',
                default: 150
            },
            'managed-services': {
                firewallMgmt: 'R1,500-R5,000/firewall/month',
                siemMonitoring: 'R80-R200/log source/month + R15k-R50k base',
                socAsService: 'R50k-R300k/month for 24/7 monitoring',
                sla: '10-25% penalty per breach',
                default: 100000
            },
            'usage-based': {
                range: 'R0.50-R2/GB logs, R10-R50/scan',
                examples: ['Log ingestion', 'Vulnerability scans', 'Pen tests'],
                default: 1.00
            },
            'ela': {
                range: 'R1,000,000-R10,000,000/year',
                examples: ['Enterprise security suite for 1000+ endpoints'],
                duration: '3-5 years',
                default: 3000000
            },
            'professional-services': {
                range: 'R2,000-R5,000/hour',
                examples: ['Security audits', 'Compliance implementation', 'Incident response'],
                default: 3000
            }
        }
    },
    'content-media': {
        name: 'Content & Media Management',
        description: 'CMS, DAM, video platforms, CDN, media processing',
        examples: ['WordPress', 'Wistia', 'Cloudflare', 'Contentful', 'Vimeo'],
        applicableModels: ['usage-based', 'per-seat', 'freemium', 'white-label', 'professional-services'],
        pricingContext: {
            'usage-based': {
                storage: 'R1-R5/GB/month',
                bandwidth: 'R0.80-R2/GB transferred',
                transcoding: 'R0.05-R0.30/minute (SD), R0.50-R2/minute (4K)',
                liveStreaming: 'R0.80-R3/GB + R5-R20/hour per concurrent stream',
                default: 1.50
            },
            'per-seat': {
                range: 'R300-R1,000/creator/month',
                examples: ['CMS editor seats', 'Video editor licenses'],
                default: 500
            },
            'freemium': {
                freeLimit: '5GB storage, 50GB bandwidth/month',
                conversion: '3-6%',
                paidStart: 'R200-R800/month',
                default: 400
            },
            'white-label': {
                range: 'R5,000-R50,000/month + revenue share',
                revenueShare: '20-40% of end customer payments',
                default: 15000
            },
            'professional-services': {
                range: 'R800-R2,000/hour',
                examples: ['Custom CMS development', 'Video workflow setup'],
                default: 1200
            }
        }
    },
    'customer-support': {
        name: 'Customer Support & Service',
        description: 'Help desk, live chat, knowledge bases, call center software',
        examples: ['Zendesk', 'Intercom', 'Freshdesk', 'Five9', 'Gorgias'],
        applicableModels: ['per-seat', 'usage-based', 'freemium', 'professional-services'],
        pricingContext: {
            'per-seat': {
                helpDesk: 'R200-R600/agent/month',
                liveChat: 'R150-R500/agent/month',
                callCenter: 'R300-R800/agent/month',
                csm: 'R400-R1,000/user/month',
                contractLength: '3-5 years for call centers',
                typicalChurn: '3-8%',
                default: 400
            },
            'usage-based': {
                range: 'R5-R20/ticket, R0.50-R2/chat message, R1-R5/call minute',
                examples: ['Pay per ticket', 'Chat volume pricing', 'Call minutes'],
                default: 10
            },
            'freemium': {
                freeLimit: '3-5 agents, 100 tickets/month',
                conversion: '5-10%',
                paidStart: 'R200-R400/agent/month',
                default: 300
            },
            'professional-services': {
                range: 'R1,000-R2,000/hour',
                examples: ['Help desk setup', 'Workflow automation', 'Integration services'],
                default: 1500
            }
        }
    },
    'ecommerce-payments': {
        name: 'E-commerce & Payments',
        description: 'E-commerce platforms, payment gateways, POS, subscription billing',
        examples: ['Shopify', 'Stripe', 'Square', 'Recurly', 'WooCommerce'],
        applicableModels: ['pay-per-transaction', 'usage-based', 'per-seat', 'revenue-share', 'white-label'],
        pricingContext: {
            'pay-per-transaction': {
                onlineCardPresent: '2.9% + R5/transaction',
                onlineCardNotPresent: '3.4% + R5/transaction',
                inPersonChip: '2.7% + R0/transaction',
                international: '+1.5% additional',
                currency: '+2% additional',
                volumeDiscounts: 'Start at R1,850,000+ monthly processing',
                default: 0.029
            },
            'usage-based': {
                platform: 'R290-R2,900/month depending on tier',
                transaction: '0.5-2% depending on tier',
                pattern: 'Higher tier = lower transaction fee',
                default: 1500
            },
            'per-seat': {
                range: 'R300-R1,500/location/month',
                examples: ['POS terminals', 'Multi-location e-commerce'],
                default: 700
            },
            'revenue-share': {
                range: '15-30% of merchant revenue',
                examples: ['Marketplace platforms', 'Payment facilitators'],
                default: 0.20
            },
            'white-label': {
                range: 'R10,000-R100,000/month + transaction fees',
                examples: ['White-label payment platform', 'Branded e-commerce'],
                default: 30000
            }
        }
    },
    'industry-specific': {
        name: 'Industry-Specific Solutions',
        description: 'Healthcare, Restaurant, Property Management, Legal, Construction, etc.',
        examples: ['Practice management', 'POS systems', 'Property software', 'Legal case management'],
        applicableModels: ['per-seat', 'usage-based', 'pay-per-transaction', 'professional-services', 'managed-services'],
        subCategories: {
            healthcare: {
                models: ['per-seat', 'usage-based', 'professional-services'],
                pricing: {
                    perProvider: 'R500-R1,500/provider/month',
                    perPatient: 'R0.50-R2/patient record/month',
                    telemedicine: 'R300-R800/provider/month + R0.30-R1/consult minute',
                    compliance: '+15-25% for POPIA/HIPAA'
                }
            },
            restaurant: {
                models: ['usage-based', 'pay-per-transaction'],
                pricing: {
                    perLocation: 'R2,000-R5,000/month base',
                    posTerminals: 'R300-R800/terminal/month',
                    transaction: '1.5-3% of payment volume',
                    onlineOrdering: '+R500-R1,500/month'
                }
            },
            property: {
                models: ['usage-based'],
                pricing: {
                    tiers: [
                        { units: '1-10', price: 150 },
                        { units: '11-50', price: 120 },
                        { units: '51-200', price: 80 },
                        { units: '201+', price: 50 }
                    ],
                    addons: {
                        payments: '2-3% of rent collected',
                        maintenance: '+R20/unit/month',
                        screening: 'R150-R400/application'
                    }
                }
            }
        },
        pricingContext: {
            'per-seat': {
                range: 'R500-R2,000/user/month',
                examples: ['Healthcare providers', 'Legal professionals', 'Construction project managers'],
                typicalChurn: '2-6%',
                default: 1000
            },
            'usage-based': {
                range: 'Varies by industry - see subCategories',
                default: 150
            },
            'pay-per-transaction': {
                range: '1.5-3% + R5-R20/transaction',
                examples: ['Restaurant payments', 'Rent collection'],
                default: 0.025
            },
            'professional-services': {
                range: 'R1,500-R3,000/hour',
                examples: ['Custom healthcare integrations', 'Industry-specific workflows'],
                default: 2000
            },
            'managed-services': {
                range: 'R5,000-R50,000/month',
                examples: ['Full property management service', 'Healthcare IT management'],
                default: 20000
            }
        }
    }
};

// Helper function to get applicable models for a category
function getApplicableModels(categoryKey) {
    const category = LAYER_1_CATEGORIES[categoryKey];
    if (!category) return [];

    return category.applicableModels.map(modelKey => ({
        key: modelKey,
        model: models[modelKey],
        pricingContext: category.pricingContext[modelKey]
    }));
}

// Helper function to get category-specific defaults
function getCategoryDefaults(modelKey, categoryKey) {
    const category = LAYER_1_CATEGORIES[categoryKey];
    if (!category || !category.pricingContext[modelKey]) return null;

    return category.pricingContext[modelKey];
}

// ========== LAYER 2: DELIVERY MECHANISMS ==========
const LAYER_2_DELIVERY = {
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

// ========== LAYER 3: SERVICE MODELS ==========
const LAYER_3_SERVICE = {
    'self-service': {
        name: 'Self-Service Software',
        description: 'Customer implements and manages independently',
        pricingMultiplier: 0.7, // 30% lower pricing
        churnMultiplier: 1.5, // 50% higher churn
        cacMultiplier: 0.6, // 40% lower CAC
        targetMarket: ['Technical users', 'Smaller budgets'],
        margin: '85-95%',
        supportCost: 'low'
    },
    'managed-services': {
        name: 'Managed Services',
        description: 'Vendor handles implementation, ongoing optimization',
        baseFee: 1500, // R1,500/unit/month base
        premiumRange: '1,500-5,000',
        sla: '99.9% uptime typical',
        implementationCost: 'Included or R100,000-R500,000 separate',
        churnMultiplier: 0.5, // 50% lower churn
        margin: '35-50%',
        targetMarket: ['Non-technical', 'Enterprises', 'Regulated industries'],
        supportCost: 'high'
    },
    'professional-services': {
        name: 'Professional Services',
        description: 'Custom implementation, integration, training',
        pricingModels: {
            hourly: 'R500-R2,500/hour',
            fixedPrice: 'R100,000-R5,000,000 depending on scope',
            retainer: 'R40,000-R350,000/month'
        },
        attachRate: '40-90% depending on complexity',
        revenueMultiple: '1-3× annual software license value',
        paymentTerms: '30% deposit, 30% midpoint, 40% completion',
        margin: '40-60%',
        addToRevenue: true
    },
    'hybrid-modular': {
        name: 'Hybrid/Modular',
        description: 'Base software self-service + optional managed components',
        pricingMultiplier: 0.85, // Base price at 85%
        managedAddon: 'R80,000/month typical',
        benefit: 'Flexibility drives higher conversion',
        tradeoff: 'Complexity in sales process',
        conversionBoost: 1.15 // 15% higher conversion
    }
};

// Helper function to apply Layer 2 modifiers
function applyDeliveryModifier(basePrice, deliveryKey) {
    const delivery = LAYER_2_DELIVERY[deliveryKey];
    if (!delivery) return basePrice;

    if (deliveryKey === 'self-hosted') {
        // Convert to one-time + maintenance model
        return {
            oneTimeLicense: basePrice * delivery.licenseMultiplier,
            annualMaintenance: basePrice * delivery.licenseMultiplier * delivery.maintenanceMultiplier,
            model: 'one-time-maintenance'
        };
    }

    return basePrice * (delivery.pricingMultiplier || 1.0);
}

// Helper function to apply Layer 3 modifiers
function applyServiceModifier(basePrice, serviceKey, churnRate = 0, cac = 0) {
    const service = LAYER_3_SERVICE[serviceKey];
    if (!service) return { price: basePrice, churn: churnRate, cac: cac };

    let modifiedPrice = basePrice;
    let modifiedChurn = churnRate;
    let modifiedCac = cac;
    let additionalRevenue = 0;

    if (serviceKey === 'managed-services') {
        additionalRevenue = service.baseFee;
    }

    if (service.pricingMultiplier) {
        modifiedPrice = basePrice * service.pricingMultiplier;
    }

    if (service.churnMultiplier) {
        modifiedChurn = churnRate * service.churnMultiplier;
    }

    if (service.cacMultiplier) {
        modifiedCac = cac * service.cacMultiplier;
    }

    return {
        price: modifiedPrice,
        churn: modifiedChurn,
        cac: modifiedCac,
        additionalRevenue: additionalRevenue
    };
}

/**
 * Apply all Layer 2/3 modifiers to pricing inputs
 * This is the central function that should be called by all calculate() functions
 * to ensure consistent application of delivery and service modifiers.
 *
 * @param {number} basePrice - The base monthly/recurring price
 * @param {number} churnRate - The base churn rate (as percentage, e.g., 5 for 5%)
 * @param {number} cac - The base Customer Acquisition Cost
 * @returns {object} Modified values: { price, churn, cac, additionalMRR, isOneTime, oneTimeLicense, annualMaintenance }
 */
function applyFrameworkModifiers(basePrice, churnRate = 0, cac = 0) {
    let modifiedPrice = basePrice;
    let modifiedChurn = churnRate;
    let modifiedCac = cac;
    let additionalMRR = 0;
    let isOneTime = false;
    let oneTimeLicense = 0;
    let annualMaintenance = 0;

    // Step 1: Apply Layer 2 (Delivery) modifiers
    if (selectedDelivery) {
        const deliveryResult = applyDeliveryModifier(modifiedPrice, selectedDelivery);

        if (typeof deliveryResult === 'object' && deliveryResult.model === 'one-time-maintenance') {
            // Self-hosted: convert to one-time license model
            isOneTime = true;
            oneTimeLicense = deliveryResult.oneTimeLicense;
            annualMaintenance = deliveryResult.annualMaintenance;
            // For recurring calculations, use the monthly maintenance equivalent
            modifiedPrice = deliveryResult.annualMaintenance / 12;
        } else {
            // Regular pricing multiplier
            modifiedPrice = deliveryResult;
        }
    }

    // Step 2: Apply Layer 3 (Service) modifiers
    if (selectedService) {
        const serviceResult = applyServiceModifier(modifiedPrice, selectedService, modifiedChurn, modifiedCac);
        modifiedPrice = serviceResult.price;
        modifiedChurn = serviceResult.churn;
        modifiedCac = serviceResult.cac;

        // Managed services adds base fee per unit
        if (serviceResult.additionalRevenue) {
            additionalMRR = serviceResult.additionalRevenue;
        }
    }

    return {
        price: modifiedPrice,
        churn: modifiedChurn,
        cac: modifiedCac,
        additionalMRR: additionalMRR,
        isOneTime: isOneTime,
        oneTimeLicense: oneTimeLicense,
        annualMaintenance: annualMaintenance
    };
}

// ========== MODEL DEFINITIONS ==========
const models = {
    'one-time': {
        name: 'One-Time Purchase (Perpetual License)',
        inputs: [
            { name: 'unitPrice', label: 'Unit Price per License ($)', type: 'currency', default: 499, min: 0, step: 1, hint: 'One-time purchase price' },
            { name: 'unitsSold', label: 'Units Sold per Month', type: 'number', default: 25, min: 0, step: 1, hint: 'Number of licenses sold monthly' },
            { name: 'maintenanceFee', label: 'Annual Maintenance Fee (%)', type: 'percent', default: 20, min: 0, max: 100, step: 0.1, hint: 'Percentage of license price charged annually' },
            { name: 'maintenanceAttach', label: 'Maintenance Attach Rate (%)', type: 'percent', default: 60, min: 0, max: 100, step: 0.1, hint: 'Percentage of customers buying maintenance' },
            { name: 'customerLifetime', label: 'Customer Lifetime (years)', type: 'number', default: 5, min: 1, step: 1, hint: 'Average years customers remain active' },
            { name: 'cac', label: 'Customer Acquisition Cost ($)', type: 'currency', default: 300, min: 0, step: 1, hint: 'Sales and marketing cost per customer' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.unitPrice,
                0,  // No churn for one-time model
                inputs.cac
            );

            const results = [];
            let totalCustomers = 0;

            for (let month = 0; month < months; month++) {
                const newCustomers = inputs.unitsSold;
                totalCustomers += newCustomers;

                const licenseRevenue = newCustomers * modifiers.price;
                const customersWithMaintenance = totalCustomers * (inputs.maintenanceAttach / 100);
                const maintenanceRevenue = customersWithMaintenance * modifiers.price * (inputs.maintenanceFee / 100) / 12;
                let totalRevenue = licenseRevenue + maintenanceRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += totalCustomers * modifiers.additionalMRR;
                }

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
            { name: 'monthlyPrice', label: 'Monthly Subscription Price ($)', type: 'currency', default: 99, min: 0, step: 1, hint: 'Average monthly subscription fee per customer' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 50, min: 0, step: 1, hint: 'Typical range for Early Stage SaaS: 20-100/month' },
            { name: 'churnRate', label: 'Monthly Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Healthy SaaS churn: 3-7% monthly' },
            { name: 'startingCustomers', label: 'Starting Customer Base', type: 'number', default: 0, min: 0, step: 1, hint: 'Number of existing customers at start' },
            { name: 'expansionRate', label: 'Monthly Expansion Revenue (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1, hint: 'Revenue growth from existing customers through upsells' },
            { name: 'cac', label: 'Customer Acquisition Cost ($)', type: 'currency', default: 200, min: 0, step: 1, hint: 'Average cost to acquire one new customer' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.monthlyPrice,
                inputs.churnRate,
                inputs.cac
            );

            const results = [];
            let customers = inputs.startingCustomers;
            let avgRevenuePerCustomer = modifiers.price;

            for (let month = 0; month < months; month++) {
                const newMRR = inputs.newCustomers * modifiers.price;
                const churnedCustomers = customers * (modifiers.churn / 100);
                const churnedMRR = churnedCustomers * avgRevenuePerCustomer;
                const expansionMRR = customers * avgRevenuePerCustomer * (inputs.expansionRate / 100);

                customers = customers + inputs.newCustomers - churnedCustomers;
                let mrr = customers * avgRevenuePerCustomer + expansionMRR;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    mrr += customers * modifiers.additionalMRR;
                }

                avgRevenuePerCustomer = customers > 0 ? mrr / customers : modifiers.price;

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    mrr: mrr,
                    arr: mrr * 12,
                    newMRR: newMRR,
                    churnedMRR: churnedMRR,
                    expansionMRR: expansionMRR,
                    revenuePerCustomer: avgRevenuePerCustomer,
                    // Include modifier info
                    appliedMonthlyPrice: modifiers.price,
                    appliedChurnRate: modifiers.churn
                });
            }

            return results;
        }
    },
    'freemium': {
        name: 'Freemium',
        inputs: [
            { name: 'freeUsers', label: 'Free Users Acquired per Month', type: 'number', default: 500, min: 0, step: 1, hint: 'High free user acquisition is key for freemium models' },
            { name: 'conversionRate', label: 'Free-to-Paid Conversion Rate (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1, hint: 'Typical freemium conversion: 2-5%' },
            { name: 'timeToConversion', label: 'Time to Conversion (months)', type: 'number', default: 2, min: 1, step: 1, hint: 'Average time before free users upgrade to paid' },
            { name: 'paidPrice', label: 'Paid Subscription Price ($)', type: 'currency', default: 49, min: 0, step: 1, hint: 'Monthly price for paid tier' },
            { name: 'freeChurn', label: 'Free User Churn Rate (%)', type: 'percent', default: 15, min: 0, max: 100, step: 0.1, hint: 'Free users typically have higher churn' },
            { name: 'paidChurn', label: 'Paid User Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Paid user churn should be low: 3-7%' },
            { name: 'cac', label: 'Customer Acquisition Cost ($)', type: 'currency', default: 50, min: 0, step: 1, hint: 'Cost to acquire free users (typically lower than paid)' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.paidPrice,
                inputs.paidChurn,
                inputs.cac
            );

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
                paidUsers = paidUsers * (1 - modifiers.churn / 100);

                // Calculate revenue using modified price
                let revenue = paidUsers * modifiers.price;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += paidUsers * modifiers.additionalMRR;
                }

                const totalUsers = freeUsers + paidUsers;

                results.push({
                    month: month + 1,
                    freeUsers: Math.round(freeUsers),
                    paidUsers: Math.round(paidUsers),
                    totalUsers: Math.round(totalUsers),
                    revenue: revenue,
                    conversionRate: totalUsers > 0 ? (paidUsers / totalUsers * 100) : 0,
                    newConversions: Math.round(newConversions),
                    // Include modifier info
                    appliedPaidPrice: modifiers.price,
                    appliedPaidChurn: modifiers.churn
                });
            }

            return results;
        }
    },
    'usage-based': {
        name: 'Usage-Based (Consumption)',
        inputs: [
            { name: 'pricePerUnit', label: 'Price per Unit ($)', type: 'currency', default: 0.05, min: 0, step: 0.01, hint: 'Price per API call, GB, or other unit' },
            { name: 'avgUsage', label: 'Avg Usage per Customer per Month', type: 'number', default: 1000, min: 0, step: 1, hint: 'Starting usage level per customer' },
            { name: 'usageGrowth', label: 'Usage Growth per Customer (% monthly)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Natural usage expansion as customers grow' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 20, min: 0, step: 1, hint: 'New customers onboarded each month' },
            { name: 'churnRate', label: 'Customer Churn Rate (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1, hint: 'Usage-based models often have lower churn: 2-5%' },
            { name: 'usageVariance', label: 'Usage Std Deviation (%)', type: 'percent', default: 20, min: 0, max: 100, step: 1, hint: 'Variability in monthly usage patterns' },
            { name: 'cac', label: 'Customer Acquisition Cost ($)', type: 'currency', default: 150, min: 0, step: 1, hint: 'Average cost to acquire one customer' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.pricePerUnit,
                inputs.churnRate,
                inputs.cac
            );

            const results = [];
            let customers = 0;
            let avgUsagePerCustomer = inputs.avgUsage;

            for (let month = 0; month < months; month++) {
                customers = customers + inputs.newCustomers;
                customers = customers * (1 - modifiers.churn / 100);

                avgUsagePerCustomer = avgUsagePerCustomer * (1 + inputs.usageGrowth / 100);
                const totalUsage = customers * avgUsagePerCustomer;

                // Calculate revenue using modified price per unit
                let revenue = totalUsage * modifiers.price;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

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
                    revenueLow: Math.max(0, revenue - variance),
                    // Include modifier info
                    appliedPricePerUnit: modifiers.price,
                    appliedChurnRate: modifiers.churn
                });
            }

            return results;
        }
    },
    'tiered': {
        name: 'Tiered Pricing',
        inputs: [
            { name: 'starterPrice', label: 'Starter Tier Price ($)', type: 'currency', default: 29, min: 0, step: 1, hint: 'Entry-level pricing tier' },
            { name: 'proPrice', label: 'Professional Tier Price ($)', type: 'currency', default: 99, min: 0, step: 1, hint: 'Mid-tier pricing for power users' },
            { name: 'enterprisePrice', label: 'Enterprise Tier Price ($)', type: 'currency', default: 299, min: 0, step: 1, hint: 'Premium tier for large customers' },
            { name: 'starterPct', label: 'Starter Tier % of New Customers', type: 'percent', default: 60, min: 0, max: 100, step: 1, hint: 'Most customers start in lower tier' },
            { name: 'proPct', label: 'Pro Tier % of New Customers', type: 'percent', default: 30, min: 0, max: 100, step: 1, hint: 'Percentage starting in middle tier' },
            { name: 'enterprisePct', label: 'Enterprise Tier % of New Customers', type: 'percent', default: 10, min: 0, max: 100, step: 1, hint: 'Few start at highest tier' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 100, min: 0, step: 1, hint: 'Total new customers across all tiers' },
            { name: 'upgradeRate', label: 'Monthly Upgrade Rate (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1, hint: 'Customers moving to higher tiers' },
            { name: 'downgradeRate', label: 'Monthly Downgrade Rate (%)', type: 'percent', default: 1, min: 0, max: 100, step: 0.1, hint: 'Customers moving to lower tiers' },
            { name: 'churnRate', label: 'Monthly Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1, hint: 'Customer churn across all tiers' },
            { name: 'cac', label: 'Customer Acquisition Cost ($)', type: 'currency', default: 180, min: 0, step: 1, hint: 'Blended CAC across all tiers' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers to each tier
            const starterMod = applyFrameworkModifiers(inputs.starterPrice, inputs.churnRate, inputs.cac);
            const proMod = applyFrameworkModifiers(inputs.proPrice, inputs.churnRate, inputs.cac);
            const enterpriseMod = applyFrameworkModifiers(inputs.enterprisePrice, inputs.churnRate, inputs.cac);

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

                // Apply churn (use modified churn rate)
                starterCustomers *= (1 - starterMod.churn / 100);
                proCustomers *= (1 - proMod.churn / 100);
                enterpriseCustomers *= (1 - enterpriseMod.churn / 100);

                // Calculate revenue using modified prices
                const starterRevenue = starterCustomers * starterMod.price;
                const proRevenue = proCustomers * proMod.price;
                const enterpriseRevenue = enterpriseCustomers * enterpriseMod.price;

                // Add managed services fees if applicable
                let totalRevenue = starterRevenue + proRevenue + enterpriseRevenue;
                if (starterMod.additionalMRR > 0) {
                    totalRevenue += (starterCustomers + proCustomers + enterpriseCustomers) * starterMod.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    starterCustomers: Math.round(starterCustomers),
                    proCustomers: Math.round(proCustomers),
                    enterpriseCustomers: Math.round(enterpriseCustomers),
                    starterRevenue: starterRevenue,
                    proRevenue: proRevenue,
                    enterpriseRevenue: enterpriseRevenue,
                    totalRevenue: totalRevenue,
                    totalCustomers: Math.round(starterCustomers + proCustomers + enterpriseCustomers),
                    // Include modifier info
                    appliedChurnRate: starterMod.churn
                });
            }

            return results;
        }
    },
    'per-seat': {
        name: 'Per-Seat/Per-User',
        inputs: [
            { name: 'pricePerSeat', label: 'Price per Seat per Month ($)', type: 'currency', default: 25, min: 0, step: 1, hint: 'Price charged per user/seat' },
            { name: 'avgSeats', label: 'Avg Seats per Customer at Signup', type: 'number', default: 5, min: 1, step: 1, hint: 'Initial team size for new customers' },
            { name: 'seatExpansion', label: 'Seat Expansion Rate (% monthly)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1, hint: 'Team growth rate within existing customers' },
            { name: 'customerChurn', label: 'Customer Churn Rate (%)', type: 'percent', default: 4, min: 0, max: 100, step: 0.1, hint: 'Account-level churn rate' },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 30, min: 0, step: 1, hint: 'New accounts (not seats) per month' },
            { name: 'cac', label: 'Customer Acquisition Cost ($)', type: 'currency', default: 250, min: 0, step: 1, hint: 'Cost to acquire one account' }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.pricePerSeat,
                inputs.customerChurn,
                inputs.cac
            );

            const results = [];
            let customers = 0;
            let totalSeats = 0;

            for (let month = 0; month < months; month++) {
                // Add new customers with their initial seats
                customers += inputs.newCustomers;
                totalSeats += inputs.newCustomers * inputs.avgSeats;

                // Expand seats for existing customers
                totalSeats = totalSeats * (1 + inputs.seatExpansion / 100);

                // Apply customer churn (seats churn with customers) - use modified churn rate
                const avgSeatsPerCustomer = customers > 0 ? totalSeats / customers : inputs.avgSeats;
                const churnedCustomers = customers * (modifiers.churn / 100);
                const churnedSeats = churnedCustomers * avgSeatsPerCustomer;

                customers -= churnedCustomers;
                totalSeats -= churnedSeats;

                // Calculate revenue using modified price
                let revenue = totalSeats * modifiers.price;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

                const seatsPerCustomer = customers > 0 ? totalSeats / customers : inputs.avgSeats;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    totalSeats: Math.round(totalSeats),
                    avgSeatsPerCustomer: seatsPerCustomer,
                    revenue: revenue,
                    revenuePerCustomer: revenuePerCustomer,
                    // Include modifier info for debugging/display
                    appliedPricePerSeat: modifiers.price,
                    appliedChurnRate: modifiers.churn
                });
            }

            return results;
        }
    },
    'retainer': {
        name: 'Retainer Agreements',
        inputs: [
            { name: 'retainerFee', label: 'Monthly Retainer Fee ($)', type: 'currency', default: 5000, min: 0, step: 100 },
            { name: 'newClients', label: 'New Clients per Month', type: 'number', default: 2, min: 0, step: 1 },
            { name: 'clientChurn', label: 'Client Churn Rate (%)', type: 'percent', default: 10, min: 0, max: 100, step: 0.1 },
            { name: 'priceIncrease', label: 'Annual Price Increase (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 },
            { name: 'overage', label: 'Avg Overage Revenue per Client ($)', type: 'currency', default: 500, min: 0, step: 50 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.retainerFee,
                inputs.clientChurn,
                0  // No CAC in this model
            );

            const results = [];
            let clients = 0;
            let avgRetainerFee = modifiers.price;

            for (let month = 0; month < months; month++) {
                // Add new clients
                clients += inputs.newClients;

                // Apply churn
                const churnedClients = clients * (modifiers.churn / 100);
                clients -= churnedClients;

                // Apply annual price increase (every 12 months)
                if (month > 0 && month % 12 === 0) {
                    avgRetainerFee = avgRetainerFee * (1 + inputs.priceIncrease / 100);
                }

                const retainerRevenue = clients * avgRetainerFee;
                const overageRevenue = clients * inputs.overage;
                let totalRevenue = retainerRevenue + overageRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += clients * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    clients: Math.round(clients),
                    retainerRevenue: retainerRevenue,
                    overageRevenue: overageRevenue,
                    totalRevenue: totalRevenue,
                    mrr: totalRevenue,
                    arr: totalRevenue * 12,
                    revenuePerCustomer: clients > 0 ? totalRevenue / clients : 0
                });
            }

            return results;
        }
    },
    'managed-services': {
        name: 'Managed Services',
        inputs: [
            { name: 'baseServiceFee', label: 'Base Service Fee per Month ($)', type: 'currency', default: 10000, min: 0, step: 100 },
            { name: 'newAccounts', label: 'New Accounts per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'accountChurn', label: 'Account Churn Rate (%)', type: 'percent', default: 8, min: 0, max: 100, step: 0.1 },
            { name: 'expansionRate', label: 'Monthly Account Expansion (%)', type: 'percent', default: 3, min: 0, max: 100, step: 0.1 },
            { name: 'setupFee', label: 'One-Time Setup Fee ($)', type: 'currency', default: 5000, min: 0, step: 100 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.baseServiceFee,
                inputs.accountChurn,
                0  // No CAC in this model
            );

            const results = [];
            let accounts = 0;
            let avgServiceFee = modifiers.price;

            for (let month = 0; month < months; month++) {
                // Add new accounts
                accounts += inputs.newAccounts;
                const setupRevenue = inputs.newAccounts * inputs.setupFee;

                // Apply expansion to service fees
                avgServiceFee = avgServiceFee * (1 + inputs.expansionRate / 100);

                // Apply churn
                const churnedAccounts = accounts * (modifiers.churn / 100);
                accounts -= churnedAccounts;

                const recurringRevenue = accounts * avgServiceFee;
                let totalRevenue = recurringRevenue + setupRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += accounts * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activeAccounts: Math.round(accounts),
                    recurringRevenue: recurringRevenue,
                    setupRevenue: setupRevenue,
                    totalRevenue: totalRevenue,
                    mrr: recurringRevenue,
                    arr: recurringRevenue * 12,
                    revenuePerCustomer: accounts > 0 ? recurringRevenue / accounts : 0
                });
            }

            return results;
        }
    },
    'pay-per-transaction': {
        name: 'Pay-Per-Transaction',
        inputs: [
            { name: 'feePerTransaction', label: 'Fee per Transaction ($)', type: 'currency', default: 2.5, min: 0, step: 0.1 },
            { name: 'transactionsMonth1', label: 'Transactions in Month 1', type: 'number', default: 1000, min: 0, step: 10 },
            { name: 'transactionGrowth', label: 'Transaction Growth (% monthly)', type: 'percent', default: 10, min: 0, max: 100, step: 0.1 },
            { name: 'activeCustomers', label: 'Active Customers Month 1', type: 'number', default: 50, min: 0, step: 1 },
            { name: 'customerGrowth', label: 'Customer Growth (% monthly)', type: 'percent', default: 8, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.feePerTransaction,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let transactions = inputs.transactionsMonth1;
            let customers = inputs.activeCustomers;

            for (let month = 0; month < months; month++) {
                let revenue = transactions * modifiers.price;
                const transactionsPerCustomer = customers > 0 ? transactions / customers : 0;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    transactions: Math.round(transactions),
                    customers: Math.round(customers),
                    revenue: revenue,
                    volume: transactions,
                    transactionsPerCustomer: transactionsPerCustomer,
                    revenuePerCustomer: revenuePerCustomer
                });

                // Apply growth for next month
                transactions = transactions * (1 + inputs.transactionGrowth / 100);
                customers = customers * (1 + inputs.customerGrowth / 100);
            }

            return results;
        }
    },
    'credits-token': {
        name: 'Credits/Token System',
        inputs: [
            { name: 'pricePerCredit', label: 'Price per Credit ($)', type: 'currency', default: 0.10, min: 0, step: 0.01 },
            { name: 'avgPurchaseSize', label: 'Avg Credits Purchased per Transaction', type: 'number', default: 100, min: 0, step: 10 },
            { name: 'newCustomers', label: 'New Customers per Month', type: 'number', default: 200, min: 0, step: 1 },
            { name: 'purchaseFrequency', label: 'Purchases per Customer per Month', type: 'number', default: 2, min: 0, step: 0.1 },
            { name: 'customerChurn', label: 'Customer Churn Rate (%)', type: 'percent', default: 15, min: 0, max: 100, step: 0.1 },
            { name: 'usageGrowth', label: 'Credit Usage Growth per Customer (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.pricePerCredit,
                inputs.customerChurn,
                0  // No CAC in this model
            );

            const results = [];
            let customers = 0;
            let avgCreditsPerPurchase = inputs.avgPurchaseSize;

            for (let month = 0; month < months; month++) {
                // Add new customers
                customers += inputs.newCustomers;

                // Apply churn
                const churnedCustomers = customers * (modifiers.churn / 100);
                customers -= churnedCustomers;

                // Apply usage growth
                avgCreditsPerPurchase = avgCreditsPerPurchase * (1 + inputs.usageGrowth / 100);

                // Calculate revenue
                const totalPurchases = customers * inputs.purchaseFrequency;
                const totalCredits = totalPurchases * avgCreditsPerPurchase;
                let revenue = totalCredits * modifiers.price;
                const revenuePerCustomer = customers > 0 ? revenue / customers : 0;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    revenue += customers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    customers: Math.round(customers),
                    totalPurchases: Math.round(totalPurchases),
                    totalCredits: Math.round(totalCredits),
                    revenue: revenue,
                    usage: totalCredits,
                    volume: totalCredits,
                    revenuePerCustomer: revenuePerCustomer
                });
            }

            return results;
        }
    },
    'time-materials': {
        name: 'Time and Materials (Hourly)',
        inputs: [
            { name: 'hourlyRate', label: 'Average Hourly Rate ($)', type: 'currency', default: 150, min: 0, step: 5 },
            { name: 'billableResources', label: 'Billable Resources (People)', type: 'number', default: 5, min: 0, step: 1 },
            { name: 'utilization', label: 'Utilization Rate (%)', type: 'percent', default: 75, min: 0, max: 100, step: 1 },
            { name: 'hoursPerMonth', label: 'Work Hours per Month per Person', type: 'number', default: 160, min: 0, step: 10 },
            { name: 'resourceGrowth', label: 'Resource Growth (% monthly)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.hourlyRate,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let resources = inputs.billableResources;

            for (let month = 0; month < months; month++) {
                const billableHours = resources * inputs.hoursPerMonth * (inputs.utilization / 100);
                const revenue = billableHours * modifiers.price;
                const revenuePerResource = resources > 0 ? revenue / resources : 0;

                results.push({
                    month: month + 1,
                    resources: Math.round(resources),
                    billableHours: Math.round(billableHours),
                    revenue: revenue,
                    activeProjects: Math.round(resources * 0.4), // Estimate ~2.5 resources per project
                    utilization: inputs.utilization,
                    revenuePerResource: revenuePerResource
                });

                // Apply resource growth for next month
                resources = resources * (1 + inputs.resourceGrowth / 100);
            }

            return results;
        }
    },
    'fixed-price': {
        name: 'Fixed-Price Projects',
        inputs: [
            { name: 'avgProjectValue', label: 'Average Project Value ($)', type: 'currency', default: 50000, min: 0, step: 1000 },
            { name: 'projectsPerMonth', label: 'New Projects per Month', type: 'number', default: 2, min: 0, step: 1 },
            { name: 'projectDuration', label: 'Average Project Duration (months)', type: 'number', default: 3, min: 1, step: 1 },
            { name: 'upfrontPayment', label: 'Upfront Payment (%)', type: 'percent', default: 30, min: 0, max: 100, step: 5 },
            { name: 'projectGrowth', label: 'Project Win Rate Growth (%)', type: 'percent', default: 5, min: 0, max: 100, step: 1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.avgProjectValue,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const activeProjects = [];
            let projectsPerMonth = inputs.projectsPerMonth;

            for (let month = 0; month < months; month++) {
                // Add new projects
                for (let i = 0; i < Math.round(projectsPerMonth); i++) {
                    activeProjects.push({
                        startMonth: month,
                        value: modifiers.price,
                        duration: inputs.projectDuration,
                        upfront: modifiers.price * (inputs.upfrontPayment / 100),
                        monthly: modifiers.price * (1 - inputs.upfrontPayment / 100) / inputs.projectDuration
                    });
                }

                // Calculate revenue from active projects
                let upfrontRevenue = 0;
                let recurringRevenue = 0;
                let activeCount = 0;

                activeProjects.forEach(project => {
                    const projectAge = month - project.startMonth;
                    if (projectAge === 0) {
                        upfrontRevenue += project.upfront;
                    }
                    if (projectAge >= 0 && projectAge < project.duration) {
                        recurringRevenue += project.monthly;
                        activeCount++;
                    }
                });

                const totalRevenue = upfrontRevenue + recurringRevenue;

                results.push({
                    month: month + 1,
                    activeProjects: activeCount,
                    upfrontRevenue: upfrontRevenue,
                    recurringRevenue: recurringRevenue,
                    revenue: totalRevenue,
                    newProjects: Math.round(projectsPerMonth)
                });

                // Apply growth
                projectsPerMonth = projectsPerMonth * (1 + inputs.projectGrowth / 100);
            }

            return results;
        }
    },
    'outcome-based': {
        name: 'Outcome-Based/Milestone',
        inputs: [
            { name: 'baseProjectValue', label: 'Base Project Value ($)', type: 'currency', default: 100000, min: 0, step: 1000 },
            { name: 'milestones', label: 'Number of Milestones', type: 'number', default: 4, min: 1, step: 1 },
            { name: 'projectsPerMonth', label: 'New Projects per Month', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'successBonus', label: 'Success Bonus (%)', type: 'percent', default: 20, min: 0, max: 100, step: 5 },
            { name: 'successRate', label: 'Milestone Success Rate (%)', type: 'percent', default: 85, min: 0, max: 100, step: 5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.baseProjectValue,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const activeProjects = [];

            for (let month = 0; month < months; month++) {
                // Add new projects
                for (let i = 0; i < inputs.projectsPerMonth; i++) {
                    activeProjects.push({
                        startMonth: month,
                        milestones: inputs.milestones,
                        valuePerMilestone: modifiers.price / inputs.milestones,
                        bonusPerMilestone: (modifiers.price * (inputs.successBonus / 100)) / inputs.milestones
                    });
                }

                // Calculate revenue from milestone completions
                let milestoneRevenue = 0;
                let bonusRevenue = 0;
                let activeCount = 0;
                let completedMilestones = 0;

                activeProjects.forEach(project => {
                    const projectAge = month - project.startMonth;
                    const milestoneDuration = 2; // Assume 2 months per milestone
                    const currentMilestone = Math.floor(projectAge / milestoneDuration);

                    if (currentMilestone < project.milestones && projectAge % milestoneDuration === 0 && projectAge > 0) {
                        milestoneRevenue += project.valuePerMilestone;
                        completedMilestones++;

                        // Success bonus
                        if (Math.random() * 100 < inputs.successRate) {
                            bonusRevenue += project.bonusPerMilestone;
                        }
                    }

                    if (currentMilestone < project.milestones) {
                        activeCount++;
                    }
                });

                const totalRevenue = milestoneRevenue + bonusRevenue;

                results.push({
                    month: month + 1,
                    activeProjects: activeCount,
                    milestoneRevenue: milestoneRevenue,
                    bonusRevenue: bonusRevenue,
                    revenue: totalRevenue,
                    completedMilestones: completedMilestones
                });
            }

            return results;
        }
    },
    'open-core': {
        name: 'Open Core',
        inputs: [
            { name: 'freeDownloads', label: 'Free Downloads per Month', type: 'number', default: 2000, min: 0, step: 100 },
            { name: 'enterprisePrice', label: 'Enterprise License Price ($)', type: 'currency', default: 5000, min: 0, step: 100 },
            { name: 'conversionRate', label: 'Free-to-Enterprise Conversion (%)', type: 'percent', default: 1, min: 0, max: 100, step: 0.1 },
            { name: 'supportPrice', label: 'Support/Service Add-on Price ($)', type: 'currency', default: 1500, min: 0, step: 100 },
            { name: 'supportAttach', label: 'Support Attach Rate (%)', type: 'percent', default: 40, min: 0, max: 100, step: 1 },
            { name: 'churnRate', label: 'Enterprise Customer Churn (%)', type: 'percent', default: 8, min: 0, max: 100, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.enterprisePrice,
                inputs.churnRate,
                0  // No CAC in this model
            );

            const results = [];
            let freeUsers = 0;
            let paidCustomers = 0;

            for (let month = 0; month < months; month++) {
                // Add free users
                freeUsers += inputs.freeDownloads;

                // Convert free users to paid
                const newConversions = freeUsers * (inputs.conversionRate / 100);
                freeUsers -= newConversions;
                paidCustomers += newConversions;

                // Apply churn to paid customers
                const churnedCustomers = paidCustomers * (modifiers.churn / 100);
                paidCustomers -= churnedCustomers;

                // Calculate revenue
                const licenseRevenue = paidCustomers * modifiers.price / 12; // Monthly
                const supportRevenue = paidCustomers * (inputs.supportAttach / 100) * inputs.supportPrice / 12;
                let totalRevenue = licenseRevenue + supportRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += paidCustomers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    freeUsers: Math.round(freeUsers),
                    paidUsers: Math.round(paidCustomers),
                    licenseRevenue: licenseRevenue,
                    supportRevenue: supportRevenue,
                    revenue: totalRevenue,
                    conversionRate: freeUsers > 0 ? (paidCustomers / (freeUsers + paidCustomers) * 100) : 0
                });
            }

            return results;
        }
    },
    'marketplace': {
        name: 'Marketplace/Platform Fee',
        inputs: [
            { name: 'transactionVolume', label: 'Monthly Transaction Volume ($)', type: 'currency', default: 100000, min: 0, step: 1000 },
            { name: 'takeRate', label: 'Platform Take Rate (%)', type: 'percent', default: 15, min: 0, max: 100, step: 0.5 },
            { name: 'volumeGrowth', label: 'Volume Growth (% monthly)', type: 'percent', default: 15, min: 0, max: 100, step: 1 },
            { name: 'activeBuyers', label: 'Active Buyers per Month', type: 'number', default: 500, min: 0, step: 10 },
            { name: 'activeSellers', label: 'Active Sellers per Month', type: 'number', default: 50, min: 0, step: 1 },
            { name: 'participantGrowth', label: 'Participant Growth (% monthly)', type: 'percent', default: 10, min: 0, max: 100, step: 1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            // Note: For percentage-based pricing, we apply modifiers to the transaction volume
            const modifiers = applyFrameworkModifiers(
                inputs.transactionVolume,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let volume = modifiers.price;  // Modified transaction volume
            let buyers = inputs.activeBuyers;
            let sellers = inputs.activeSellers;

            for (let month = 0; month < months; month++) {
                let revenue = volume * (inputs.takeRate / 100);
                const avgTransactionSize = buyers > 0 ? volume / buyers : 0;

                // Add managed services fee if applicable
                const totalParticipants = buyers + sellers;
                if (modifiers.additionalMRR > 0) {
                    revenue += totalParticipants * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    transactionVolume: volume,
                    revenue: revenue,
                    activeBuyers: Math.round(buyers),
                    activeSellers: Math.round(sellers),
                    participants: Math.round(buyers + sellers),
                    volume: volume,
                    takeRate: inputs.takeRate,
                    avgTransactionSize: avgTransactionSize
                });

                // Apply growth for next month
                volume = volume * (1 + inputs.volumeGrowth / 100);
                buyers = buyers * (1 + inputs.participantGrowth / 100);
                sellers = sellers * (1 + inputs.participantGrowth / 100);
            }

            return results;
        }
    },
    'revenue-share': {
        name: 'Revenue Share Partnership',
        inputs: [
            { name: 'partnerRevenue', label: 'Partner Generated Revenue ($)', type: 'currency', default: 200000, min: 0, step: 1000 },
            { name: 'sharePercentage', label: 'Your Share (%)', type: 'percent', default: 30, min: 0, max: 100, step: 1 },
            { name: 'revenueGrowth', label: 'Revenue Growth (% monthly)', type: 'percent', default: 8, min: 0, max: 100, step: 0.5 },
            { name: 'activePartners', label: 'Active Partners', type: 'number', default: 10, min: 0, step: 1 },
            { name: 'newPartnersPerMonth', label: 'New Partners per Month', type: 'number', default: 2, min: 0, step: 1 },
            { name: 'partnerChurn', label: 'Partner Churn Rate (%)', type: 'percent', default: 5, min: 0, max: 100, step: 0.5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.partnerRevenue / inputs.activePartners,  // Revenue per partner
                inputs.partnerChurn,
                0  // No CAC in this model
            );

            const results = [];
            let partners = inputs.activePartners;
            let avgRevenuePerPartner = modifiers.price;

            for (let month = 0; month < months; month++) {
                // Add new partners
                partners += inputs.newPartnersPerMonth;

                // Apply churn
                const churnedPartners = partners * (modifiers.churn / 100);
                partners -= churnedPartners;

                // Apply revenue growth
                avgRevenuePerPartner = avgRevenuePerPartner * (1 + inputs.revenueGrowth / 100);

                const totalPartnerRevenue = partners * avgRevenuePerPartner;
                let yourRevenue = totalPartnerRevenue * (inputs.sharePercentage / 100);

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    yourRevenue += partners * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activePartners: Math.round(partners),
                    totalPartnerRevenue: totalPartnerRevenue,
                    revenue: yourRevenue,
                    volume: totalPartnerRevenue,
                    participants: Math.round(partners),
                    revenuePerPartner: avgRevenuePerPartner
                });
            }

            return results;
        }
    },
    'advertising': {
        name: 'Advertising Supported',
        inputs: [
            { name: 'monthlyUsers', label: 'Monthly Active Users', type: 'number', default: 100000, min: 0, step: 1000 },
            { name: 'pageViewsPerUser', label: 'Page Views per User per Month', type: 'number', default: 20, min: 0, step: 1 },
            { name: 'cpm', label: 'CPM (Cost per 1000 impressions) ($)', type: 'currency', default: 5, min: 0, step: 0.5 },
            { name: 'userGrowth', label: 'User Growth (% monthly)', type: 'percent', default: 10, min: 0, max: 100, step: 1 },
            { name: 'premiumConversion', label: 'Premium Conversion Rate (%)', type: 'percent', default: 2, min: 0, max: 100, step: 0.1 },
            { name: 'premiumPrice', label: 'Premium Subscription Price ($)', type: 'currency', default: 9.99, min: 0, step: 0.1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.cpm,  // CPM is the primary price input
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            let users = inputs.monthlyUsers;
            let premiumUsers = 0;

            for (let month = 0; month < months; month++) {
                // Convert free users to premium
                const newConversions = users * (inputs.premiumConversion / 100);
                users -= newConversions;
                premiumUsers += newConversions;

                // Calculate ad revenue from free users
                const impressions = users * inputs.pageViewsPerUser;
                const adRevenue = (impressions / 1000) * modifiers.price;

                // Calculate premium subscription revenue
                const premiumRevenue = premiumUsers * inputs.premiumPrice;

                let totalRevenue = adRevenue + premiumRevenue;
                const totalUsers = users + premiumUsers;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += totalUsers * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    freeUsers: Math.round(users),
                    premiumUsers: Math.round(premiumUsers),
                    totalUsers: Math.round(totalUsers),
                    impressions: Math.round(impressions),
                    adRevenue: adRevenue,
                    premiumRevenue: premiumRevenue,
                    revenue: totalRevenue,
                    volume: impressions,
                    participants: Math.round(totalUsers)
                });

                // Apply growth for next month (to free users)
                users = users * (1 + inputs.userGrowth / 100);
            }

            return results;
        }
    },
    'ela': {
        name: 'Enterprise License Agreement (ELA)',
        inputs: [
            { name: 'avgContractValue', label: 'Average Annual Contract Value ($)', type: 'currency', default: 500000, min: 0, step: 10000 },
            { name: 'newDealsPerYear', label: 'New Deals per Year', type: 'number', default: 4, min: 0, step: 1 },
            { name: 'contractLength', label: 'Average Contract Length (years)', type: 'number', default: 3, min: 1, step: 1 },
            { name: 'renewalRate', label: 'Renewal Rate (%)', type: 'percent', default: 85, min: 0, max: 100, step: 1 },
            { name: 'annualIncrease', label: 'Annual Price Increase (%)', type: 'percent', default: 5, min: 0, max: 100, step: 1 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.avgContractValue,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const activeContracts = [];
            const dealsPerMonth = inputs.newDealsPerYear / 12;

            for (let month = 0; month < months; month++) {
                // Add new contracts (probabilistically based on deals per month)
                if (Math.random() < dealsPerMonth || (month % Math.floor(12 / inputs.newDealsPerYear) === 0)) {
                    activeContracts.push({
                        startMonth: month,
                        annualValue: modifiers.price,
                        monthlyValue: modifiers.price / 12,
                        lengthMonths: inputs.contractLength * 12
                    });
                }

                // Calculate revenue from active contracts
                let monthlyRevenue = 0;
                let activeCount = 0;

                activeContracts.forEach(contract => {
                    const contractAge = month - contract.startMonth;
                    const contractYear = Math.floor(contractAge / 12);

                    if (contractAge < contract.lengthMonths) {
                        // Apply annual price increase
                        const adjustedMonthly = contract.monthlyValue * Math.pow(1 + inputs.annualIncrease / 100, contractYear);
                        monthlyRevenue += adjustedMonthly;
                        activeCount++;
                    }
                    // Check for renewal at contract end
                    else if (contractAge === contract.lengthMonths && Math.random() * 100 < inputs.renewalRate) {
                        contract.lengthMonths += inputs.contractLength * 12;
                    }
                });

                results.push({
                    month: month + 1,
                    activeContracts: activeCount,
                    revenue: monthlyRevenue,
                    contractValue: monthlyRevenue * 12,
                    contractCount: activeCount,
                    avgContractSize: activeCount > 0 ? (monthlyRevenue * 12) / activeCount : 0,
                    renewalRate: inputs.renewalRate
                });
            }

            return results;
        }
    },
    'data-licensing': {
        name: 'Data Licensing',
        inputs: [
            { name: 'licensePrice', label: 'License Price per Customer ($)', type: 'currency', default: 50000, min: 0, step: 1000 },
            { name: 'newLicensesPerMonth', label: 'New Licenses per Month', type: 'number', default: 2, min: 0, step: 1 },
            { name: 'renewalPrice', label: 'Annual Renewal Price ($)', type: 'currency', default: 15000, min: 0, step: 1000 },
            { name: 'renewalRate', label: 'Renewal Rate (%)', type: 'percent', default: 90, min: 0, max: 100, step: 1 },
            { name: 'usageFeePerQuery', label: 'Usage Fee per 1000 Queries ($)', type: 'currency', default: 100, min: 0, step: 10 },
            { name: 'avgQueriesPerCustomer', label: 'Avg Queries per Customer (1000s)', type: 'number', default: 50, min: 0, step: 5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.licensePrice,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const customers = [];

            for (let month = 0; month < months; month++) {
                // Add new customers
                for (let i = 0; i < inputs.newLicensesPerMonth; i++) {
                    customers.push({ startMonth: month });
                }

                // Calculate revenue
                let licenseRevenue = 0;
                let renewalRevenue = 0;
                let usageRevenue = 0;
                let activeCount = 0;

                customers.forEach(customer => {
                    const customerAge = month - customer.startMonth;

                    if (customerAge === 0) {
                        // Initial license fee
                        licenseRevenue += modifiers.price;
                        activeCount++;
                    } else if (customerAge % 12 === 0) {
                        // Annual renewal
                        if (Math.random() * 100 < inputs.renewalRate) {
                            renewalRevenue += inputs.renewalPrice;
                            activeCount++;
                        }
                    } else if (customerAge > 0) {
                        activeCount++;
                    }

                    // Usage fees (all active customers)
                    if (customerAge >= 0 && customerAge < 12 * 5) { // Active for up to 5 years
                        usageRevenue += inputs.avgQueriesPerCustomer * inputs.usageFeePerQuery;
                    }
                });

                let totalRevenue = licenseRevenue + renewalRevenue + usageRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += activeCount * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activeCustomers: activeCount,
                    licenseRevenue: licenseRevenue,
                    renewalRevenue: renewalRevenue,
                    usageRevenue: usageRevenue,
                    revenue: totalRevenue,
                    contractCount: activeCount,
                    contractValue: totalRevenue
                });
            }

            return results;
        }
    },
    'white-label': {
        name: 'White Label/OEM',
        inputs: [
            { name: 'setupFee', label: 'Setup Fee per Partner ($)', type: 'currency', default: 100000, min: 0, step: 5000 },
            { name: 'monthlyFee', label: 'Monthly Platform Fee ($)', type: 'currency', default: 10000, min: 0, step: 1000 },
            { name: 'revenueShare', label: 'Revenue Share (%)', type: 'percent', default: 20, min: 0, max: 100, step: 1 },
            { name: 'avgPartnerRevenue', label: 'Avg Partner Revenue per Month ($)', type: 'currency', default: 50000, min: 0, step: 1000 },
            { name: 'newPartnersPerQuarter', label: 'New Partners per Quarter', type: 'number', default: 1, min: 0, step: 1 },
            { name: 'revenueGrowth', label: 'Partner Revenue Growth (% monthly)', type: 'percent', default: 5, min: 0, max: 100, step: 0.5 }
        ],
        calculate: function(inputs, months) {
            // Apply Layer 2/3 framework modifiers
            const modifiers = applyFrameworkModifiers(
                inputs.monthlyFee,
                0,  // No churn in this model
                0   // No CAC in this model
            );

            const results = [];
            const partners = [];

            for (let month = 0; month < months; month++) {
                // Add new partners (quarterly)
                if (month % 3 === 0) {
                    for (let i = 0; i < inputs.newPartnersPerQuarter; i++) {
                        partners.push({
                            startMonth: month,
                            monthlyRevenue: inputs.avgPartnerRevenue
                        });
                    }
                }

                // Calculate revenue
                let setupRevenue = 0;
                let platformRevenue = 0;
                let shareRevenue = 0;
                let activeCount = 0;

                partners.forEach(partner => {
                    const partnerAge = month - partner.startMonth;

                    if (partnerAge === 0) {
                        setupRevenue += inputs.setupFee;
                    }

                    if (partnerAge >= 0) {
                        activeCount++;
                        platformRevenue += modifiers.price;

                        // Revenue share grows over time
                        const grownRevenue = partner.monthlyRevenue * Math.pow(1 + inputs.revenueGrowth / 100, partnerAge);
                        shareRevenue += grownRevenue * (inputs.revenueShare / 100);
                    }
                });

                let totalRevenue = setupRevenue + platformRevenue + shareRevenue;

                // Add managed services fee if applicable
                if (modifiers.additionalMRR > 0) {
                    totalRevenue += activeCount * modifiers.additionalMRR;
                }

                results.push({
                    month: month + 1,
                    activePartners: activeCount,
                    setupRevenue: setupRevenue,
                    platformRevenue: platformRevenue,
                    shareRevenue: shareRevenue,
                    revenue: totalRevenue,
                    contractCount: activeCount,
                    contractValue: totalRevenue,
                    avgContractSize: activeCount > 0 ? totalRevenue / activeCount : 0
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
 * Validate model inputs for potential issues
 */
function validateModelInputs(modelKey, inputs) {
    const warnings = [];

    // Model-specific validation rules
    if (modelKey === 'subscription' || modelKey === 'per-seat' || modelKey === 'tiered') {
        if (inputs.newCustomers === 0) {
            warnings.push({
                severity: 'error',
                field: 'newCustomers',
                message: 'New customers must be > 0 to generate revenue',
                suggestion: 'Try: 20-50 customers/month'
            });
        }

        if (inputs.churnRate && inputs.churnRate > 15 && (!inputs.expansionRate || inputs.expansionRate < 5)) {
            warnings.push({
                severity: 'warning',
                field: 'churnRate',
                message: 'High churn (>15%) without expansion will cause declining revenue',
                suggestion: 'Reduce churn to <10% or increase expansion rate'
            });
        }

        if (inputs.monthlyPrice && inputs.cac && inputs.monthlyPrice < inputs.cac / 12) {
            warnings.push({
                severity: 'warning',
                field: 'monthlyPrice',
                message: 'Monthly price is too low - CAC payback will exceed 1 year',
                suggestion: 'Increase price or reduce CAC'
            });
        }
    }

    if (modelKey === 'freemium') {
        if (inputs.conversionRate < 1) {
            warnings.push({
                severity: 'warning',
                field: 'conversionRate',
                message: 'Conversion rate <1% is very low for freemium models',
                suggestion: 'Typical freemium conversion: 2-5%'
            });
        }

        if (inputs.freeUsers === 0) {
            warnings.push({
                severity: 'error',
                field: 'freeUsers',
                message: 'Free users must be > 0 for freemium model',
                suggestion: 'Try: 500-1000 free users/month'
            });
        }
    }

    if (modelKey === 'usage-based') {
        if (inputs.pricePerUnit === 0) {
            warnings.push({
                severity: 'error',
                field: 'pricePerUnit',
                message: 'Price per unit must be > 0',
                suggestion: 'Set a minimum unit price'
            });
        }

        if (inputs.newCustomers === 0) {
            warnings.push({
                severity: 'error',
                field: 'newCustomers',
                message: 'New customers must be > 0',
                suggestion: 'Try: 10-30 customers/month'
            });
        }
    }

    if (modelKey === 'one-time') {
        if (inputs.unitsSold === 0) {
            warnings.push({
                severity: 'error',
                field: 'unitsSold',
                message: 'Units sold must be > 0',
                suggestion: 'Try: 10-50 units/month'
            });
        }
    }

    return warnings;
}

/**
 * Display validation warnings
 */
function displayValidationWarnings(warnings) {
    // Remove existing warnings
    const existingWarnings = document.getElementById('validation-warnings');
    if (existingWarnings) {
        existingWarnings.remove();
    }

    if (warnings.length === 0) return;

    // Create warnings container
    const warningsDiv = document.createElement('div');
    warningsDiv.id = 'validation-warnings';
    warningsDiv.className = 'mb-4 space-y-2';

    warnings.forEach(w => {
        const alertDiv = document.createElement('div');
        alertDiv.className = w.severity === 'error'
            ? 'p-3 bg-red-900 border border-red-700 rounded-md text-sm'
            : 'p-3 bg-yellow-900 border border-yellow-700 rounded-md text-sm';

        alertDiv.innerHTML = `
            <div class="font-semibold text-gray-100">${w.field ? w.field + ': ' : ''}${w.message}</div>
            <div class="text-xs text-gray-300 mt-1">💡 ${w.suggestion}</div>
        `;

        warningsDiv.appendChild(alertDiv);
    });

    // Insert warnings before calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.parentElement.insertBefore(warningsDiv, calculateBtn);
}

/**
 * Metric explanations and interpretations
 */
const METRIC_EXPLANATIONS = {
    totalRevenue: {
        label: 'Total Revenue',
        explanation: 'Sum of all revenue over the forecast period',
        higherIsBetter: true,
        benchmark: 'Depends on business stage and market size'
    },
    finalMonthRevenue: {
        label: 'Final Month Revenue',
        explanation: 'Revenue in the last month of the forecast',
        higherIsBetter: true,
        benchmark: 'Indicates growth trajectory'
    },
    avgMonthlyGrowth: {
        label: 'Avg Monthly Growth',
        explanation: 'Average month-over-month revenue growth rate',
        higherIsBetter: true,
        interpretation: {
            '<5%': '⚠️ Slow growth',
            '5-15%': '✓ Good growth',
            '15-30%': '⭐ Strong growth',
            '>30%': '🚀 Exceptional growth'
        },
        benchmark: '10-20% monthly is typical for early stage SaaS'
    },
    estimatedLTV: {
        label: 'Estimated LTV',
        explanation: 'Customer Lifetime Value - total revenue expected from average customer',
        higherIsBetter: true,
        benchmark: 'Should be at least 3x CAC'
    },
    ltvCacRatio: {
        label: 'LTV:CAC Ratio',
        explanation: 'Lifetime Value to Customer Acquisition Cost ratio',
        higherIsBetter: true,
        interpretation: {
            '<1': '🔴 Unsustainable - losing money on each customer',
            '1-3': '🟡 Concerning - barely profitable',
            '3-5': '🟢 Good - healthy business',
            '>5': '🟢 Excellent - very profitable'
        },
        benchmark: '3:1 is considered healthy for SaaS businesses'
    },
    paybackPeriod: {
        label: 'CAC Payback Period',
        explanation: 'Months required to recover customer acquisition cost',
        higherIsBetter: false,
        interpretation: {
            '<6': '🟢 Excellent - fast payback',
            '6-12': '🟢 Good - acceptable for most SaaS',
            '12-18': '🟡 Concerning - need high retention',
            '>18': '🔴 Poor - requires significant capital'
        },
        benchmark: '6-12 months is typical for SaaS'
    }
};

/**
 * Get interpretation for a metric value
 */
function getMetricInterpretation(metricKey, value) {
    const info = METRIC_EXPLANATIONS[metricKey];
    if (!info || !info.interpretation) return null;

    for (const [range, text] of Object.entries(info.interpretation)) {
        if (range.startsWith('<')) {
            const threshold = parseFloat(range.substring(1));
            if (value < threshold) return text;
        } else if (range.startsWith('>')) {
            const threshold = parseFloat(range.substring(1));
            if (value > threshold) return text;
        } else if (range.includes('-')) {
            const [min, max] = range.split('-').map(s => parseFloat(s));
            if (value >= min && value <= max) return text;
        }
    }

    return null;
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

    // Calculate CAC, LTV, and related metrics
    // Use real CAC from inputs if provided, otherwise estimate
    const estimatedCAC = inputs.cac !== undefined && inputs.cac > 0
        ? inputs.cac
        : revenuePerCustomer * 4; // Fallback: Conservative estimate

    // Calculate retention rate (use appropriate churn field based on model)
    const churnRate = inputs.churnRate !== undefined ? inputs.churnRate
        : inputs.paidChurn !== undefined ? inputs.paidChurn
        : inputs.customerChurn !== undefined ? inputs.customerChurn
        : inputs.clientChurn !== undefined ? inputs.clientChurn
        : inputs.accountChurn !== undefined ? inputs.accountChurn
        : 5; // Default 5% churn if not specified

    const retentionRate = (100 - churnRate) / 100;

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
 * Scenario templates for quick-start
 */
const SCENARIO_TEMPLATES = {
    'subscription': {
        'Early Stage SaaS': {
            monthlyPrice: 49,
            newCustomers: 50,
            churnRate: 8,
            startingCustomers: 0,
            expansionRate: 2,
            cac: 150
        },
        'Enterprise SaaS': {
            monthlyPrice: 999,
            newCustomers: 5,
            churnRate: 3,
            startingCustomers: 10,
            expansionRate: 10,
            cac: 5000
        }
    },
    'freemium': {
        'Consumer App': {
            freeUsers: 1000,
            conversionRate: 2,
            timeToConversion: 3,
            paidPrice: 9.99,
            freeChurn: 20,
            paidChurn: 5,
            cac: 10
        },
        'B2B Freemium': {
            freeUsers: 200,
            conversionRate: 5,
            timeToConversion: 1,
            paidPrice: 99,
            freeChurn: 10,
            paidChurn: 4,
            cac: 100
        }
    },
    'usage-based': {
        'API Service': {
            pricePerUnit: 0.01,
            avgUsage: 5000,
            usageGrowth: 8,
            newCustomers: 30,
            churnRate: 2,
            usageVariance: 25,
            cac: 200
        },
        'Cloud Infrastructure': {
            pricePerUnit: 0.10,
            avgUsage: 1000,
            usageGrowth: 15,
            newCustomers: 10,
            churnRate: 5,
            usageVariance: 30,
            cac: 800
        }
    }
};

/**
 * Apply template to form inputs
 */
function applyTemplate(modelKey, templateName) {
    const templates = SCENARIO_TEMPLATES[modelKey];
    if (!templates || !templates[templateName]) return;

    const templateData = templates[templateName];
    for (const [key, value] of Object.entries(templateData)) {
        const inputId = `${modelKey}-${key}`;
        const element = document.getElementById(inputId);
        if (element) {
            element.value = value;
        }
    }

    // Trigger input change to recalculate
    onInputChange();
}

/**
 * Generate dynamic form based on model inputs
 */
function generateForm(modelKey) {
    const model = models[modelKey];
    const formContainer = document.getElementById('inputForm');

    let formHTML = `<h3 class="text-lg font-semibold text-gray-100 mb-4">Input Parameters</h3>`;

    // Add template selector if templates exist for this model
    if (SCENARIO_TEMPLATES[modelKey]) {
        formHTML += `
            <div class="mb-4 p-3 bg-gray-750 rounded-md border border-gray-600">
                <label class="block text-sm font-medium text-gray-300 mb-2">Quick Start Template</label>
                <select
                    id="${modelKey}-template"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onchange="applyTemplate('${modelKey}', this.value)"
                >
                    <option value="">Choose a template...</option>
                    ${Object.keys(SCENARIO_TEMPLATES[modelKey]).map(name =>
                        `<option value="${name}">${name}</option>`
                    ).join('')}
                </select>
            </div>
        `;
    }

    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        formHTML += `
            <div class="mb-4">
                <label for="${inputId}" class="block text-sm font-medium text-gray-300 mb-1">
                    ${input.label}
                </label>
                <input
                    type="number"
                    id="${inputId}"
                    name="${input.name}"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value="${input.default}"
                    min="${input.min !== undefined ? input.min : 0}"
                    ${input.max !== undefined ? 'max="' + input.max + '"' : ''}
                    step="${input.step}"
                    data-type="${input.type}"
                    data-model="${modelKey}"
                />
                ${input.hint ? `<small class="text-xs text-gray-500 mt-1 block">${input.hint}</small>` : ''}
            </div>
        `;
    });

    formContainer.innerHTML = formHTML;

    // Add input event listeners
    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        const inputElement = document.getElementById(inputId);
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
        const inputId = `${modelKey}-${input.name}`;
        const element = document.getElementById(inputId);
        if (element) {
            inputs[input.name] = parseFloat(element.value) || input.default || 0;
        } else {
            inputs[input.name] = input.default || 0;
        }
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

    // Validate inputs and collect warnings
    const allWarnings = [];
    const allInputs = new Map();

    for (const modelKey of selectedModels) {
        const inputs = gatherInputs(modelKey);
        allInputs.set(modelKey, inputs);
        const warnings = validateModelInputs(modelKey, inputs);
        allWarnings.push(...warnings);
    }

    // Display validation warnings
    displayValidationWarnings(allWarnings);

    // Calculate results for all selected models
    const allResults = new Map();

    for (const modelKey of selectedModels) {
        const results = calculateModel(modelKey);
        allResults.set(modelKey, results);
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
        const inputId = `${modelKey}-${input.name}`;
        const element = document.getElementById(inputId);
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

    // Remove existing executive summary if present
    const existingSummary = document.getElementById('executive-summary');
    if (existingSummary) {
        existingSummary.remove();
    }

    // Render executive summary and insert before universal metrics panel
    const executiveSummary = renderExecutiveSummary(allResults, allInputs);
    if (executiveSummary) {
        const metricsPanel = document.getElementById('universalMetricsPanel');
        metricsPanel.parentElement.insertBefore(executiveSummary, metricsPanel);
    }

    // Show comparison views
    renderUniversalMetrics(allResults, allInputs);
    renderComparisonCharts(allResults, comparison);
    renderComparisonTable(allResults);
}

/**
 * Render executive summary panel
 */
function renderExecutiveSummary(allResults, allInputs) {
    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'executive-summary';
    summaryDiv.className = 'bg-gray-800 shadow-sm rounded-lg p-6 mb-6 border border-gray-700';

    // Calculate metrics for all models
    const metricsData = [];
    for (const [modelKey, results] of allResults) {
        const inputs = allInputs.get(modelKey);
        const metrics = calculateUniversalMetrics(modelKey, results, inputs);
        if (metrics) {
            metricsData.push({ modelKey, modelName: models[modelKey].name, metrics });
        }
    }

    if (metricsData.length === 0) return null;

    // Find best models for each category
    const bestRevenue = metricsData.reduce((a, b) =>
        a.metrics.totalRevenue > b.metrics.totalRevenue ? a : b
    );
    const bestEfficiency = metricsData.reduce((a, b) =>
        a.metrics.ltvCacRatio > b.metrics.ltvCacRatio ? a : b
    );
    const bestPayback = metricsData.reduce((a, b) =>
        a.metrics.paybackPeriod < b.metrics.paybackPeriod ? a : b
    );

    let html = `
        <h2 class="text-xl font-semibold text-gray-100 mb-4">📊 Executive Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
                <div class="text-xs text-blue-200 mb-1">💵 Highest Total Revenue</div>
                <div class="text-lg font-bold text-white">${bestRevenue.modelName}</div>
                <div class="text-sm text-blue-100 mt-1">${formatCurrency(bestRevenue.metrics.totalRevenue)}</div>
            </div>
            <div class="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
                <div class="text-xs text-green-200 mb-1">⚡ Best Efficiency (LTV:CAC)</div>
                <div class="text-lg font-bold text-white">${bestEfficiency.modelName}</div>
                <div class="text-sm text-green-100 mt-1">${bestEfficiency.metrics.ltvCacRatio.toFixed(2)}:1 ratio</div>
            </div>
            <div class="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
                <div class="text-xs text-purple-200 mb-1">🚀 Fastest CAC Payback</div>
                <div class="text-lg font-bold text-white">${bestPayback.modelName}</div>
                <div class="text-sm text-purple-100 mt-1">${bestPayback.metrics.paybackPeriod.toFixed(1)} months</div>
            </div>
        </div>
        <div class="bg-gray-750 rounded-lg p-4 border border-gray-600">
            <div class="text-sm font-semibold text-gray-200 mb-2">💡 Recommendation</div>
            <div class="text-sm text-gray-300">
                ${generateRecommendation(metricsData, bestRevenue, bestEfficiency, bestPayback)}
            </div>
        </div>
    `;

    summaryDiv.innerHTML = html;
    return summaryDiv;
}

/**
 * Generate recommendation based on comparison data
 */
function generateRecommendation(metricsData, bestRevenue, bestEfficiency, bestPayback) {
    if (bestRevenue.modelKey === bestEfficiency.modelKey) {
        return `<strong>${bestRevenue.modelName}</strong> is the clear winner with both the highest revenue AND best efficiency. This model provides the optimal balance of growth and profitability.`;
    } else if (bestRevenue.modelKey === bestPayback.modelKey) {
        return `<strong>${bestRevenue.modelName}</strong> leads in total revenue and has the fastest payback period, making it ideal for capital-efficient growth.`;
    } else if (bestEfficiency.modelKey === bestPayback.modelKey) {
        return `<strong>${bestEfficiency.modelName}</strong> offers the best unit economics with top efficiency and fastest payback. Choose <strong>${bestRevenue.modelName}</strong> if maximum revenue is the priority.`;
    } else {
        return `Each model excels in different areas: <strong>${bestRevenue.modelName}</strong> for maximum revenue, <strong>${bestEfficiency.modelName}</strong> for sustainable unit economics, and <strong>${bestPayback.modelName}</strong> for capital efficiency. Choose based on your strategic priorities.`;
    }
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
        const metricInfo = METRIC_EXPLANATIONS[metric.key];
        const higherIsBetter = metricInfo?.higherIsBetter !== false;

        const card = document.createElement('div');
        card.className = 'bg-gray-700 rounded-lg p-4 relative cursor-help metric-card';
        card.title = metricInfo ? `${metricInfo.explanation}\n\nBenchmark: ${metricInfo.benchmark}` : '';

        // Metric label with info icon
        const labelContainer = document.createElement('div');
        labelContainer.className = 'flex items-center justify-between mb-2';

        const label = document.createElement('div');
        label.className = 'text-sm text-gray-400';
        label.textContent = metric.label;

        const infoIcon = document.createElement('span');
        infoIcon.className = 'text-xs text-blue-400 cursor-help';
        infoIcon.textContent = 'ⓘ';
        infoIcon.title = metricInfo ? metricInfo.explanation : '';

        labelContainer.appendChild(label);
        labelContainer.appendChild(infoIcon);
        card.appendChild(labelContainer);

        // Find winner for this metric
        const values = metricsData.map(d => ({
            ...d,
            value: d.metrics[metric.key] || 0
        }));

        values.sort((a, b) => higherIsBetter ? b.value - a.value : a.value - b.value);
        const winner = values[0];

        // Render each model's value
        metricsData.forEach(data => {
            const metricValue = data.metrics[metric.key] || 0;
            const isWinner = data.modelKey === winner.modelKey;
            const percentDiff = winner.value !== 0
                ? Math.abs(((metricValue - winner.value) / winner.value) * 100)
                : 0;

            const row = document.createElement('div');
            row.className = `flex justify-between items-center mt-2 ${isWinner ? 'winner-row p-2 -mx-2 rounded bg-green-900 bg-opacity-20' : ''}`;

            const modelNameContainer = document.createElement('div');
            modelNameContainer.className = 'flex items-center gap-1';

            if (isWinner) {
                const trophy = document.createElement('span');
                trophy.textContent = '🏆';
                trophy.className = 'text-xs';
                modelNameContainer.appendChild(trophy);
            }

            const modelName = document.createElement('span');
            modelName.className = `text-xs ${isWinner ? 'text-green-300 font-semibold' : 'text-gray-300'}`;
            modelName.textContent = data.modelName;
            modelNameContainer.appendChild(modelName);

            const valueContainer = document.createElement('div');
            valueContainer.className = 'text-right';

            const value = document.createElement('div');
            value.className = `text-sm font-semibold ${isWinner ? 'text-green-200' : 'text-gray-100'}`;
            value.textContent = metric.format(metricValue);
            valueContainer.appendChild(value);

            // Show percentage difference for non-winners
            if (!isWinner && percentDiff > 0.1) {
                const diff = document.createElement('div');
                diff.className = 'text-xs text-gray-500';
                diff.textContent = `(-${percentDiff.toFixed(1)}%)`;
                valueContainer.appendChild(diff);
            }

            // Show interpretation if available
            const interpretation = getMetricInterpretation(metric.key, metricValue);
            if (interpretation) {
                const interpSpan = document.createElement('div');
                interpSpan.className = 'text-xs mt-1';
                interpSpan.textContent = interpretation;
                valueContainer.appendChild(interpSpan);
            }

            row.appendChild(modelNameContainer);
            row.appendChild(valueContainer);
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
    const annotations = [];
    let colorIndex = 0;
    let hasNonZeroData = false;

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

        // Check if all values are zero
        const allZero = data.every(d => d.y === 0);
        if (!allZero) {
            hasNonZeroData = true;
        }

        series.push({
            name: models[modelKey].name,
            data: data.map(d => d.y),
            color: allZero ? '#6B7280' : colors[colorIndex % colors.length],
            dashArray: allZero ? 5 : 0
        });

        if (allZero) {
            annotations.push({
                y: 0,
                label: {
                    borderColor: '#EF4444',
                    style: { color: '#fff', background: '#EF4444' },
                    text: `⚠️ ${models[modelKey].name}: Zero Revenue - Check inputs`
                }
            });
        }

        colorIndex++;
    }

    // If all models have zero revenue, show empty state
    if (!hasNonZeroData) {
        chartDiv.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📊</div>
                <div class="text-xl font-semibold text-gray-200 mb-2">No Revenue Data</div>
                <div class="text-sm text-gray-400 mb-4">All models are generating zero revenue. This usually happens when:</div>
                <ul class="text-sm text-gray-400 text-left max-w-md mx-auto space-y-1">
                    <li>• New customers per month = 0</li>
                    <li>• Price per unit = 0</li>
                    <li>• Churn rate exceeds acquisition rate</li>
                </ul>
                <div class="mt-4 text-sm text-blue-400">💡 Check the validation warnings above and adjust your inputs</div>
            </div>
        `;
        return;
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
        annotations: annotations.length > 0 ? { yaxis: annotations } : {},
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

        // Check if all revenue is zero
        const allZero = revenueData.every(v => v === 0);

        if (allZero) {
            chartDiv.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-4xl mb-2">⚠️</div>
                    <div class="text-lg font-semibold text-gray-200 mb-1">${models[modelKey].name}</div>
                    <div class="text-sm text-gray-400">Zero Revenue</div>
                    <div class="text-xs text-gray-500 mt-2">Check inputs and validation warnings</div>
                </div>
            `;
            grid.appendChild(chartDiv);
        } else {
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
        }

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

// Global state for framework selections
let selectedCategory = null;
let selectedDelivery = 'cloud-saas';
let selectedService = 'self-service';

/**
 * Initialize the application
 */
function init() {
    // Add category selector event listener
    const categorySelector = document.getElementById('categorySelector');
    categorySelector.addEventListener('change', onCategoryChange);

    // Add Layer 2/3 event listeners
    document.querySelectorAll('input[name="deliveryMechanism"]').forEach(radio => {
        radio.addEventListener('change', onDeliveryChange);
    });

    document.querySelectorAll('input[name="serviceModel"]').forEach(radio => {
        radio.addEventListener('change', onServiceChange);
    });

    // Add event listener to calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', onCalculate);
}

/**
 * Handle category selection change
 */
function onCategoryChange(event) {
    selectedCategory = event.target.value;

    const categoryDescription = document.getElementById('categoryDescription');
    const categoryExamples = document.getElementById('categoryExamples');
    const modelSelectionSection = document.getElementById('modelSelectionSection');
    const layerTwoThreeSection = document.getElementById('layerTwoThreeSection');

    if (!selectedCategory) {
        // Hide everything if no category selected
        categoryDescription.classList.add('hidden');
        categoryExamples.classList.add('hidden');
        modelSelectionSection.classList.add('hidden');
        layerTwoThreeSection.classList.add('hidden');
        selectedModels.clear();
        updateSelectedSummary();
        updateCalculateButton();
        return;
    }

    // Show category information
    const category = LAYER_1_CATEGORIES[selectedCategory];
    categoryDescription.textContent = category.description;
    categoryDescription.classList.remove('hidden');

    categoryExamples.textContent = `Examples: ${category.examples.join(', ')}`;
    categoryExamples.classList.remove('hidden');

    // Show model selection section
    modelSelectionSection.classList.remove('hidden');
    layerTwoThreeSection.classList.remove('hidden');

    // Clear previous selections
    selectedModels.clear();
    updateSelectedSummary();

    // Generate filtered model checkboxes
    generateModelCheckboxes();
    updateCalculateButton();
}

/**
 * Handle delivery mechanism change
 */
function onDeliveryChange(event) {
    selectedDelivery = event.target.value;
}

/**
 * Handle service model change
 */
function onServiceChange(event) {
    selectedService = event.target.value;
}

/**
 * Generate checkboxes for model selection - filtered by category if selected
 */
function generateModelCheckboxes() {
    const container = document.getElementById('modelSelector');
    container.innerHTML = '';

    // Get applicable models for the selected category
    const applicableModelKeys = selectedCategory
        ? LAYER_1_CATEGORIES[selectedCategory].applicableModels
        : Object.keys(models);

    // If no category selected, show a message
    if (!selectedCategory) {
        container.innerHTML = '<p class="text-gray-400 text-sm">Select a software category first</p>';
        return;
    }

    // Show category-specific intro
    const category = LAYER_1_CATEGORIES[selectedCategory];
    const intro = document.createElement('div');
    intro.className = 'mb-4 p-3 bg-gray-750 rounded-md border border-gray-600';
    intro.innerHTML = `
        <div class="text-xs text-gray-400 mb-1">Applicable to <span class="text-blue-400 font-semibold">${category.name}</span>:</div>
        <div class="text-xs text-gray-500">${applicableModelKeys.length} revenue models available</div>
    `;
    container.appendChild(intro);

    // Display models that are applicable to this category
    applicableModelKeys.forEach(modelKey => {
        const model = models[modelKey];
        if (!model) return;

        const pricingContext = category.pricingContext[modelKey];

        const modelDiv = document.createElement('div');
        modelDiv.className = 'mb-3 p-3 bg-gray-700 rounded-md border border-gray-600 hover:border-blue-500 transition-colors';

        const label = document.createElement('label');
        label.className = 'flex items-start space-x-2 cursor-pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = modelKey;
        checkbox.id = `model-${modelKey}`;
        checkbox.className = 'mt-1 rounded bg-gray-600 border-gray-500 text-blue-600 focus:ring-blue-500';
        checkbox.addEventListener('change', onModelSelectionChange);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-1';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'font-medium text-gray-100 text-sm mb-1';
        nameDiv.textContent = model.name;

        const contextDiv = document.createElement('div');
        contextDiv.className = 'text-xs space-y-1';

        if (pricingContext) {
            // Show category-specific pricing range
            if (pricingContext.range) {
                const rangeSpan = document.createElement('div');
                rangeSpan.className = 'text-blue-400';
                rangeSpan.textContent = `💰 ${pricingContext.range}`;
                contextDiv.appendChild(rangeSpan);
            }

            // Show examples
            if (pricingContext.examples) {
                const examplesSpan = document.createElement('div');
                examplesSpan.className = 'text-gray-500';
                const examples = Array.isArray(pricingContext.examples)
                    ? pricingContext.examples.join(', ')
                    : pricingContext.examples;
                examplesSpan.textContent = `📋 ${examples}`;
                contextDiv.appendChild(examplesSpan);
            }

            // Show additional context (churn, conversion, etc.)
            if (pricingContext.typicalChurn) {
                const churnSpan = document.createElement('div');
                churnSpan.className = 'text-gray-500';
                churnSpan.textContent = `📉 Typical churn: ${pricingContext.typicalChurn}`;
                contextDiv.appendChild(churnSpan);
            }

            if (pricingContext.conversion) {
                const conversionSpan = document.createElement('div');
                conversionSpan.className = 'text-gray-500';
                conversionSpan.textContent = `🎯 Conversion: ${pricingContext.conversion}`;
                contextDiv.appendChild(conversionSpan);
            }

            if (pricingContext.attachRate) {
                const attachSpan = document.createElement('div');
                attachSpan.className = 'text-gray-500';
                attachSpan.textContent = `📎 Attach rate: ${pricingContext.attachRate}`;
                contextDiv.appendChild(attachSpan);
            }
        }

        contentDiv.appendChild(nameDiv);
        contentDiv.appendChild(contextDiv);

        label.appendChild(checkbox);
        label.appendChild(contentDiv);
        modelDiv.appendChild(label);

        container.appendChild(modelDiv);
    });
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

    // Generate ALL forms for ALL selected models
    generateAllForms();
}

/**
 * Generate all forms for selected models and keep them in the DOM
 */
function generateAllForms() {
    const formContainer = document.getElementById('inputForm');
    formContainer.innerHTML = '';

    const firstModel = Array.from(selectedModels)[0];

    selectedModels.forEach(modelKey => {
        const modelFormDiv = document.createElement('div');
        modelFormDiv.id = `form-${modelKey}`;
        modelFormDiv.className = modelKey === firstModel ? '' : 'hidden';

        const model = models[modelKey];
        let formHTML = `<h3 class="text-lg font-semibold text-gray-100 mb-4">Input Parameters</h3>`;

        // Add template selector if templates exist for this model
        if (SCENARIO_TEMPLATES[modelKey]) {
            formHTML += `
                <div class="mb-4 p-3 bg-gray-750 rounded-md border border-gray-600">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Quick Start Template</label>
                    <select
                        id="${modelKey}-template"
                        class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onchange="applyTemplate('${modelKey}', this.value)"
                    >
                        <option value="">Choose a template...</option>
                        ${Object.keys(SCENARIO_TEMPLATES[modelKey]).map(name =>
                            `<option value="${name}">${name}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        }

        model.inputs.forEach(input => {
            const inputId = `${modelKey}-${input.name}`;

            // Get category-specific defaults if available
            const categoryDefaults = getCategoryDefaults(modelKey, selectedCategory);
            let defaultValue = input.default;
            let hintText = input.hint;

            // Apply category-specific defaults if they exist
            if (categoryDefaults) {
                // Map common input names to pricing context properties
                if (input.name === 'price' && categoryDefaults.default !== undefined) {
                    defaultValue = categoryDefaults.default;
                }

                // Update hint text to show category-specific range
                if (input.name === 'price' && categoryDefaults.range) {
                    hintText = `${categoryDefaults.range} (category-specific)`;
                } else if (input.name === 'churnRate' && categoryDefaults.typicalChurn) {
                    hintText = `Typical for this category: ${categoryDefaults.typicalChurn}`;
                } else if (input.name === 'conversionRate' && categoryDefaults.conversion) {
                    hintText = `Typical for this category: ${categoryDefaults.conversion}`;
                }
            }

            formHTML += `
                <div class="mb-4">
                    <label for="${inputId}" class="block text-sm font-medium text-gray-300 mb-1">
                        ${input.label}
                    </label>
                    <input
                        type="number"
                        id="${inputId}"
                        name="${input.name}"
                        class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value="${defaultValue}"
                        min="${input.min !== undefined ? input.min : 0}"
                        ${input.max !== undefined ? 'max="' + input.max + '"' : ''}
                        step="${input.step}"
                        data-type="${input.type}"
                        data-model="${modelKey}"
                    />
                    ${hintText ? `<small class="text-xs text-gray-500 mt-1 block">${hintText}</small>` : ''}
                </div>
            `;
        });

        modelFormDiv.innerHTML = formHTML;
        formContainer.appendChild(modelFormDiv);

        // Add input event listeners
        model.inputs.forEach(input => {
            const inputId = `${modelKey}-${input.name}`;
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.addEventListener('input', onInputChange);
            }
        });
    });
}

/**
 * Generate tabs for input forms
 */
function generateInputTabs() {
    const tabsContainer = document.getElementById('inputFormTabs');
    tabsContainer.innerHTML = '';

    const firstModel = Array.from(selectedModels)[0];

    selectedModels.forEach(modelKey => {
        const button = document.createElement('button');
        button.textContent = models[modelKey].name;
        button.className = modelKey === firstModel
            ? 'px-3 py-1 text-sm rounded bg-blue-600 text-white'
            : 'px-3 py-1 text-sm rounded bg-gray-700 text-gray-300 hover:bg-gray-600';
        button.dataset.model = modelKey;
        button.addEventListener('click', (e) => {
            const targetModel = e.target.dataset.model;

            // Update active tab styling
            tabsContainer.querySelectorAll('button').forEach(btn => {
                btn.className = 'px-3 py-1 text-sm rounded bg-gray-700 text-gray-300 hover:bg-gray-600';
            });
            e.target.className = 'px-3 py-1 text-sm rounded bg-blue-600 text-white';

            // Show/hide forms
            selectedModels.forEach(mk => {
                const formDiv = document.getElementById(`form-${mk}`);
                if (formDiv) {
                    if (mk === targetModel) {
                        formDiv.classList.remove('hidden');
                    } else {
                        formDiv.classList.add('hidden');
                    }
                }
            });
        });
        tabsContainer.appendChild(button);
    });
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
