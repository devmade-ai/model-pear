import { models } from '../models/index.js';

// ========== LAYER 1: CORE FUNCTION CATEGORIES ==========
export const LAYER_1_CATEGORIES = {
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
                default: 350
            },
            'usage-based': {
                range: 'R0.80-R3/build minute, R0.50-R50/1k API calls',
                examples: ['CI/CD build minutes', 'API calls', 'Container pulls'],
                growthRate: '15-30% monthly',
                default: 0.80
            },
            'professional-services': {
                range: 'R800-R2,500/hour for implementation',
                examples: ['Custom CI/CD setup', 'API integration services'],
                attachRate: '40-60%',
                default: 800
            },
            'credits-token': {
                range: 'R1,000 = 50k-200k API calls',
                examples: ['Multi-service developer platforms'],
                default: 1000
            },
            'freemium': {
                freeLimit: '50-500 builds/month or 100k API calls/month',
                conversion: '3-8%',
                default: 50
            },
            'open-core': {
                range: 'R200-R1,500/user/month for enterprise features',
                examples: ['Enterprise Git features', 'Advanced CI/CD analytics'],
                default: 200
            },
            'one-time': {
                range: 'R5,000-R50,000 perpetual license',
                maintenance: '20-25% annual',
                default: 5000
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
                default: 250
            },
            'professional-services': {
                range: 'R1,000-R2,500/hour',
                examples: ['CRM implementation', 'ERP customization', 'Data migration'],
                projectSize: 'R100,000-R5,000,000',
                attachRate: '70-90%',
                default: 1000
            },
            'usage-based': {
                range: 'R150-R400/employee/month (all employees)',
                examples: ['Full HRIS platforms', 'Payroll processing per employee'],
                default: 150
            },
            'pay-per-transaction': {
                range: 'R5-R50/transaction',
                examples: ['Payroll runs', 'Invoice processing', 'Approval workflows'],
                default: 5
            },
            'retainer': {
                range: 'R40,000-R350,000/month',
                examples: ['Ongoing CRM optimization', 'ERP support retainer'],
                default: 40000
            },
            'ela': {
                range: 'R500,000-R5,000,000/year',
                examples: ['Enterprise CRM for 500+ users', 'Full ERP suite'],
                duration: '3-5 years typical',
                default: 500000
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
                default: 500
            },
            'per-seat': {
                range: 'R400-R1,200/marketer/month',
                examples: ['Marketing automation seats', 'Campaign manager licenses'],
                default: 400
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
                default: 200
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
                default: 100
            },
            'freemium': {
                freeLimit: '2-15 users, basic features, limited storage',
                conversion: '4-7%',
                triggers: ['Team size limits', 'Storage limits', 'Feature restrictions'],
                paidStart: 'R150-R400/user/month',
                default: 150
            },
            'usage-based': {
                range: 'R0.20-R2/meeting minute, R50-R200/GB storage',
                examples: ['Video conferencing minutes', 'Cloud storage'],
                default: 0.20
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
                default: 150
            },
            'per-seat': {
                range: 'R500-R2,000/analyst/month',
                examples: ['BI platform licenses', 'Data science workspace seats'],
                default: 500
            },
            'professional-services': {
                range: 'R1,500-R3,000/hour',
                examples: ['Data warehouse setup', 'ML model development', 'BI dashboard creation'],
                projectSize: 'R200,000-R2,000,000',
                default: 1500
            },
            'data-licensing': {
                range: 'R50,000-R500,000/dataset/year',
                examples: ['Industry datasets', 'Trained models', 'Benchmark data'],
                default: 50000
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
                default: 50
            },
            'managed-services': {
                firewallMgmt: 'R1,500-R5,000/firewall/month',
                siemMonitoring: 'R80-R200/log source/month + R15k-R50k base',
                socAsService: 'R50k-R300k/month for 24/7 monitoring',
                sla: '10-25% penalty per breach',
                default: 50000
            },
            'usage-based': {
                range: 'R0.50-R2/GB logs, R10-R50/scan',
                examples: ['Log ingestion', 'Vulnerability scans', 'Pen tests'],
                default: 0.50
            },
            'ela': {
                range: 'R1,000,000-R10,000,000/year',
                examples: ['Enterprise security suite for 1000+ endpoints'],
                duration: '3-5 years',
                default: 1000000
            },
            'professional-services': {
                range: 'R2,000-R5,000/hour',
                examples: ['Security audits', 'Compliance implementation', 'Incident response'],
                default: 2000
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
                default: 0.80
            },
            'per-seat': {
                range: 'R300-R1,000/creator/month',
                examples: ['CMS editor seats', 'Video editor licenses'],
                default: 300
            },
            'freemium': {
                freeLimit: '5GB storage, 50GB bandwidth/month',
                conversion: '3-6%',
                paidStart: 'R200-R800/month',
                default: 200
            },
            'white-label': {
                range: 'R5,000-R50,000/month + revenue share',
                revenueShare: '20-40% of end customer payments',
                default: 5000
            },
            'professional-services': {
                range: 'R800-R2,000/hour',
                examples: ['Custom CMS development', 'Video workflow setup'],
                default: 800
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
                default: 200
            },
            'usage-based': {
                range: 'R5-R20/ticket, R0.50-R2/chat message, R1-R5/call minute',
                examples: ['Pay per ticket', 'Chat volume pricing', 'Call minutes'],
                default: 5
            },
            'freemium': {
                freeLimit: '3-5 agents, 100 tickets/month',
                conversion: '5-10%',
                paidStart: 'R200-R400/agent/month',
                default: 200
            },
            'professional-services': {
                range: 'R1,000-R2,000/hour',
                examples: ['Help desk setup', 'Workflow automation', 'Integration services'],
                default: 1000
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
                default: 290
            },
            'per-seat': {
                range: 'R300-R1,500/location/month',
                examples: ['POS terminals', 'Multi-location e-commerce'],
                default: 300
            },
            'revenue-share': {
                range: '15-30% of merchant revenue',
                examples: ['Marketplace platforms', 'Payment facilitators'],
                default: 0.15
            },
            'white-label': {
                range: 'R10,000-R100,000/month + transaction fees',
                examples: ['White-label payment platform', 'Branded e-commerce'],
                default: 10000
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
export function getApplicableModels(categoryKey) {
    const category = LAYER_1_CATEGORIES[categoryKey];
    if (!category) return [];

    return category.applicableModels.map(modelKey => ({
        key: modelKey,
        model: models[modelKey],
        pricingContext: category.pricingContext[modelKey]
    }));
}

// Helper function to get category-specific defaults
export function getCategoryDefaults(modelKey, categoryKey) {
    const category = LAYER_1_CATEGORIES[categoryKey];
    if (!category || !category.pricingContext[modelKey]) return null;

    return category.pricingContext[modelKey];
}

