# Framework Alignment Plan

> **Note (January 2026)**: This plan has been implemented and the codebase has been refactored into a modular architecture. See README.md for the current project structure and IMPLEMENTATION_PROGRESS.md for completion status.

## Executive Summary

**Current State**: Generic revenue model calculator with 20 models organized by revenue type
**Target State**: Context-driven pricing calculator aligned with Software Product Classification Framework
**Impact**: Shifts from "choose a revenue model" to "describe your software → get applicable pricing models"

---

## Current vs. Framework Approach

### Current Approach (Generic)
```
User Flow:
1. Select revenue model (e.g., "Subscription SaaS")
2. Enter generic inputs (price, customers, churn)
3. View projections

Problem: No industry context, unrealistic defaults, unclear applicability
```

### Framework Approach (Context-Driven)
```
User Flow:
1. SELECT Layer 1: What type of software? (e.g., "CRM - Business Operations")
2. FILTER: See only applicable revenue models for CRMs
3. SELECT Layer 2: Delivery mechanism (Cloud SaaS, Self-Hosted, etc.)
4. SELECT Layer 3: Service model (Self-Service, Managed Services, etc.)
5. CONFIGURE: Industry-specific inputs with realistic ranges
6. VIEW: Projections with Layer 2/3 modifiers applied

Benefits: Realistic pricing, clear applicability, better decision-making
```

---

## Structural Changes Required

### 1. Add Layer 1: Core Function Categories

**Implementation**: New primary selector before revenue model selection

```javascript
const LAYER_1_CATEGORIES = {
  'dev-devops': {
    name: 'Development & DevOps Infrastructure',
    description: 'Tools enabling software creation, version control, CI/CD, API platforms',
    examples: ['IDEs', 'Git platforms', 'CI/CD pipelines', 'API platforms'],
    applicableModels: ['per-seat', 'usage-based', 'tiered', 'freemium', 'credits-token', 'open-core', 'one-time'],
    pricingContext: {
      'per-seat': {
        range: 'R350-R800/developer/month',
        examples: ['IDE licenses', 'Code review platforms'],
        seatExpansion: '15-25% annual'
      },
      'usage-based': {
        range: 'R0.80-R3/build minute, R0.50-R50/1k API calls',
        examples: ['CI/CD build minutes', 'API calls', 'Container registry']
      },
      // ... more pricing contexts
    }
  },
  'business-ops': {
    name: 'Business Operations Software',
    description: 'CRM, ERP, HRM, Payroll, Financial Accounting',
    examples: ['Salesforce', 'SAP', 'Workday', 'QuickBooks'],
    applicableModels: ['per-seat', 'tiered', 'per-employee', 'per-module', 'usage-based', 'per-transaction', 'professional-services', 'ela'],
    pricingContext: {
      'per-seat': {
        range: 'R250-R1,500/user/month',
        examples: ['CRM sales rep licenses', 'ERP user licenses'],
        tierDistribution: '60% lowest, 25% mid, 15% enterprise'
      },
      'per-employee': {
        range: 'R150-R400/employee/month (all employees)',
        examples: ['Full HRIS', 'Payroll processing']
      },
      // ... more pricing contexts
    }
  },
  'marketing': {
    name: 'Marketing & Customer Engagement',
    description: 'Marketing automation, email, SMS, customer data platforms',
    examples: ['Mailchimp', 'HubSpot', 'Twilio', 'Segment'],
    applicableModels: ['tiered-contacts', 'usage-based', 'per-seat-contacts', 'credits', 'freemium', 'per-channel'],
    pricingContext: {
      'tiered-contacts': {
        tiers: [
          { contacts: 500, price: 200 },
          { contacts: 2500, price: 500 },
          { contacts: 10000, price: 1500 },
          { contacts: 50000, price: 5000 },
          { contacts: 100000, price: 10000 }
        ],
        overage: 'R0.20-R1/contact/month'
      },
      'usage-based': {
        range: 'R0.50-R2/1k emails, R0.60-R1.20/SMS',
        examples: ['Email sends', 'SMS messages', 'Push notifications']
      }
    }
  },
  'productivity': {
    name: 'Workplace Productivity & Collaboration',
    description: 'Project management, team chat, video conferencing, document collaboration',
    examples: ['Slack', 'Zoom', 'Notion', 'Asana'],
    applicableModels: ['per-seat', 'freemium', 'flat-rate', 'tiered-usage', 'hybrid-seat-usage'],
    pricingContext: {
      'per-seat': {
        range: 'R100-R800/user/month',
        tiers: ['Basic R100-R200', 'Professional R250-R400', 'Enterprise R500-R800'],
        seatExpansion: '15-25% annual'
      },
      'freemium': {
        free: '2-15 users, basic features, limited storage',
        conversion: '4-7% typical',
        triggers: ['Team size limits', 'Storage limits', 'Feature restrictions']
      }
    }
  },
  'data-analytics': {
    name: 'Data & Analytics',
    description: 'Data warehouses, BI platforms, ML platforms, AI APIs',
    examples: ['Snowflake', 'Tableau', 'Databricks', 'Anthropic Claude API'],
    applicableModels: ['tiered-data', 'per-seat', 'usage-based', 'ai-usage', 'data-licensing', 'professional-services', 'outcome-based'],
    pricingContext: {
      'usage-based': {
        storage: 'R150-R400/TB/month',
        compute: 'R5-R15/hour',
        dataScanned: 'R50-R150/TB processed',
        streaming: 'R0.50-R2/GB ingested'
      },
      'ai-usage': {
        range: 'R0.30-R5/1k tokens (model-dependent)',
        examples: [
          'Claude Sonnet 4: R30/M input tokens, R150/M output tokens',
          'Training jobs: R50-R500/hour',
          'Inference: R0.01-R1/prediction'
        ]
      }
    }
  },
  'security': {
    name: 'Security & Compliance',
    description: 'Endpoint security, SIEM, IAM, vulnerability scanning, compliance',
    examples: ['CrowdStrike', 'Splunk', 'Okta', 'Qualys'],
    applicableModels: ['per-seat-device', 'managed-services', 'tiered', 'usage-based', 'ela', 'outcome-compliance'],
    pricingContext: {
      'per-seat-device': {
        endpoint: 'R50-R300/device/month',
        identity: 'R80-R400/user/month',
        training: 'R30-R100/user/year'
      },
      'managed-services': {
        firewallMgmt: 'R1,500-R5,000/firewall/month',
        siemMonitoring: 'R80-R200/log source/month + R15k-R50k base',
        socAsService: 'R50k-R300k/month for 24/7 monitoring',
        sla: '10-25% penalty per breach'
      }
    }
  },
  'content-media': {
    name: 'Content & Media Management',
    description: 'CMS, DAM, video platforms, CDN, media processing',
    examples: ['WordPress', 'Wistia', 'Cloudflare', 'Contentful'],
    applicableModels: ['tiered', 'per-site', 'storage-bandwidth', 'per-stream', 'freemium', 'white-label', 'professional-services', 'cdn-usage'],
    pricingContext: {
      'storage-bandwidth': {
        storage: 'R1-R5/GB/month',
        bandwidth: 'R0.80-R2/GB transferred',
        transcoding: 'R0.05-R0.30/minute (SD), R0.50-R2/minute (4K)',
        liveStreaming: 'R0.80-R3/GB + R5-R20/hour per concurrent stream'
      }
    }
  },
  'customer-support': {
    name: 'Customer Support & Service',
    description: 'Help desk, live chat, knowledge bases, call center software',
    examples: ['Zendesk', 'Intercom', 'Freshdesk', 'Five9'],
    applicableModels: ['per-agent', 'tiered-volume', 'per-channel', 'usage-based', 'freemium', 'tiered-customers', 'professional-services'],
    pricingContext: {
      'per-agent': {
        helpDesk: 'R200-R600/agent/month',
        liveChat: 'R150-R500/agent/month',
        callCenter: 'R300-R800/agent/month',
        csm: 'R400-R1,000/user/month',
        typical: '3-5 year contracts for call centers'
      }
    }
  },
  'ecommerce-payments': {
    name: 'E-commerce & Payments',
    description: 'E-commerce platforms, payment gateways, POS, subscription billing',
    examples: ['Shopify', 'Stripe', 'Square', 'Recurly'],
    applicableModels: ['tiered-subscription', 'transaction-based', 'hybrid-sub-transaction', 'revenue-share', 'per-location', 'white-label', 'subscription-billing'],
    pricingContext: {
      'transaction-based': {
        onlineCardPresent: '2.9% + R5/transaction',
        onlineCardNotPresent: '3.4% + R5/transaction',
        inPersonChip: '2.7% + R0/transaction',
        international: '+1.5% additional',
        currency: '+2% additional',
        volumeDiscounts: 'Start at R1,850,000+ monthly processing'
      },
      'hybrid-sub-transaction': {
        platform: 'R290-R2,900/month depending on tier',
        transaction: '0.5-2% depending on tier',
        pattern: 'Higher tier = lower transaction fee'
      }
    }
  },
  'industry-specific': {
    name: 'Industry-Specific Solutions',
    description: 'Healthcare, Restaurant, Property Management, Legal, Construction, etc.',
    examples: ['Practice management', 'POS systems', 'Property software', 'Legal case management'],
    applicableModels: ['per-provider', 'per-location', 'per-unit', 'tiered-size', 'per-project', 'per-member'],
    subCategories: {
      healthcare: {
        models: ['per-provider', 'per-patient-record', 'telemedicine-addon'],
        pricing: {
          perProvider: 'R500-R1,500/provider/month',
          perPatient: 'R0.50-R2/patient record/month',
          telemedicine: 'R300-R800/provider/month + R0.30-R1/consult minute',
          compliance: '+15-25% for POPIA/HIPAA'
        }
      },
      restaurant: {
        models: ['per-location', 'pos-terminals', 'transaction-fee'],
        pricing: {
          perLocation: 'R2,000-R5,000/month base',
          posTerminals: 'R300-R800/terminal/month',
          transaction: '1.5-3% of payment volume',
          onlineOrdering: '+R500-R1,500/month'
        }
      },
      property: {
        models: ['per-unit-tiered'],
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
    }
  }
};
```

### 2. Add Layer 2: Delivery Mechanisms

**Implementation**: Modifiers that affect pricing and costs

```javascript
const LAYER_2_DELIVERY = {
  'cloud-saas': {
    name: 'Cloud-Hosted SaaS',
    description: 'Vendor manages infrastructure, automatic updates',
    costImpact: 'Base pricing (reference point)',
    margin: '85-95% gross margin typical',
    characteristics: ['Multi-tenant', 'Automatic updates', 'No user maintenance']
  },
  'self-hosted': {
    name: 'Self-Hosted/On-Premise',
    description: 'Customer manages infrastructure on their servers',
    pricingModel: 'One-time license + annual maintenance',
    licenseRange: 'R50,000-R500,000+ one-time',
    maintenance: '20-30% of license fee annually',
    costImpact: 'Higher upfront, lower recurring',
    trend: 'Declining except regulated industries'
  },
  'hybrid': {
    name: 'Hybrid Cloud',
    description: 'Core cloud-hosted, sensitive data on-premise',
    costImpact: '+30-50% vs pure cloud due to complexity',
    example: 'Cloud R10,000/month + On-premise R80,000/year maintenance',
    industries: ['Financial services', 'Healthcare', 'Government']
  },
  'mobile': {
    name: 'Mobile Applications',
    description: 'Native iOS/Android apps as primary interface',
    appStoreFees: {
      apple: '30% year 1, 15% year 2+ (avoid with external signup)',
      google: '15% (can bypass with direct payment)'
    },
    devCost: 'React Native reduces cost 40-60% vs native',
    costImpact: 'Development cost -40-60% with cross-platform'
  },
  'api-embedded': {
    name: 'API/Embedded',
    description: 'Programmatic access embedded in customer products',
    pricingModel: 'Usage-based dominant',
    costImpact: 'Higher technical support costs',
    requirements: ['Developer documentation', 'SDKs', 'API monitoring']
  }
};
```

### 3. Add Layer 3: Service Models

**Implementation**: Service level modifiers

```javascript
const LAYER_3_SERVICE = {
  'self-service': {
    name: 'Self-Service Software',
    description: 'Customer implements and manages independently',
    pricingImpact: '-30% to -50% vs managed services',
    churn: '5-10% monthly (higher than managed)',
    cac: 'R5,000-R15,000 (lower)',
    targetMarket: ['Technical users', 'Smaller budgets'],
    margin: '85-95%'
  },
  'managed-services': {
    name: 'Managed Services',
    description: 'Vendor handles implementation, ongoing optimization',
    pricingModel: 'R1,500-R5,000/unit/month',
    sla: '99.9% uptime typical',
    implementation: 'Included or R100,000-R500,000 separate',
    churn: '2-4% monthly (lower)',
    margin: '35-50%',
    targetMarket: ['Non-technical', 'Enterprises', 'Regulated industries']
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
    paymentTerms: '30% deposit, 30% midpoint, 40% completion'
  },
  'hybrid-modular': {
    name: 'Hybrid/Modular',
    description: 'Base software self-service + optional managed components',
    example: 'CRM R750/user/month + optional implementation R350k + ongoing optimization R80k/month',
    benefit: 'Flexibility drives higher conversion',
    tradeoff: 'Complexity in sales process'
  }
};
```

---

## UI/UX Redesign

### New User Flow

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: What type of software are you pricing?        │
│  ┌───────────────────────────────────────────────────┐ │
│  │ [Dropdown] Select Software Category                │ │
│  │ ▸ Development & DevOps Infrastructure             │ │
│  │   Business Operations Software                     │ │
│  │   Marketing & Customer Engagement                  │ │
│  │   Workplace Productivity & Collaboration           │ │
│  │   ... (10 categories)                              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Examples: IDEs, Git platforms, CI/CD pipelines        │
└─────────────────────────────────────────────────────────┘

                         ↓ (Category selected)

┌─────────────────────────────────────────────────────────┐
│  STEP 2: Select Applicable Revenue Models              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ ☑ Per-Seat/Per-User                                │ │
│  │   R350-R800/developer/month • 15-25% annual growth│ │
│  │                                                     │ │
│  │ ☐ Usage-Based                                      │ │
│  │   R0.80-R3/build minute • R0.50-R50/1k API calls  │ │
│  │                                                     │ │
│  │ ☐ Tiered Pricing                                   │ │
│  │   Free → Pro R200-R500 → Enterprise R800-R2,000   │ │
│  │                                                     │ │
│  │ ☐ Freemium                                         │ │
│  │   3-8% conversion • 50k+ users needed             │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ⓘ Only models applicable to Development & DevOps shown│
└─────────────────────────────────────────────────────────┘

                         ↓ (Models selected)

┌─────────────────────────────────────────────────────────┐
│  STEP 3: Configure Delivery & Service Options          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Delivery Mechanism:                                │ │
│  │ ⦿ Cloud-Hosted SaaS   ○ Self-Hosted   ○ Hybrid    │ │
│  │                                                     │ │
│  │ Service Model:                                     │ │
│  │ ⦿ Self-Service (-40% pricing)                     │ │
│  │ ○ Managed Services (+R1,500-R5,000/unit/month)    │ │
│  │ ○ Professional Services (R500-R2,500/hour)        │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

                         ↓ (Options configured)

┌─────────────────────────────────────────────────────────┐
│  STEP 4: Model-Specific Inputs (Context-Aware)         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Per-Seat Model - Development & DevOps Context      │ │
│  │                                                     │ │
│  │ Developer Seat Price: [R___] R350-R800 typical    │ │
│  │ New Developers/Month: [___] 5-20 for early stage  │ │
│  │ Annual Seat Expansion: [__%] 15-25% benchmark     │ │
│  │ Churn Rate: [__%] 5-10% typical for dev tools     │ │
│  │                                                     │ │
│  │ [Quick Fill: Early Stage] [Enterprise SaaS]       │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

                         ↓ (Inputs configured)

┌─────────────────────────────────────────────────────────┐
│  STEP 5: View Results with Industry Context            │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Development & DevOps: Per-Seat Model               │ │
│  │                                                     │ │
│  │ MRR: R45,000  (Month 24)                          │ │
│  │ ARR: R540,000                                      │ │
│  │ LTV:CAC Ratio: 4.2 ✅ (3-5 is healthy)            │ │
│  │ Payback Period: 8 months ✅ (<12 months ideal)   │ │
│  │                                                     │ │
│  │ ⓘ Industry Benchmark: Average 15-25% annual seat  │ │
│  │   expansion for development tools                  │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Data Layer (Week 1-2)
- [ ] Define all Layer 1 categories with pricing contexts
- [ ] Map existing 20 models to applicable categories
- [ ] Create Layer 2 delivery mechanism definitions
- [ ] Create Layer 3 service model definitions
- [ ] Update model definitions with category-specific defaults

### Phase 2: UI Restructure (Week 2-3)
- [ ] Add Layer 1 category selector (Step 1)
- [ ] Filter revenue models based on selected category
- [ ] Update model checkboxes with category-specific pricing hints
- [ ] Add Layer 2/3 selector UI (Step 3)
- [ ] Modify input forms to show category context

### Phase 3: Calculation Engine (Week 3-4)
- [ ] Apply Layer 2 modifiers to calculations (e.g., self-hosted vs SaaS)
- [ ] Apply Layer 3 modifiers (e.g., managed services premium)
- [ ] Update universal metrics with industry benchmarks per category
- [ ] Add category-specific validation rules
- [ ] Update scenario templates with category awareness

### Phase 4: Visualization (Week 4-5)
- [ ] Add industry benchmark overlays to charts
- [ ] Show Layer 2/3 impact visualizations
- [ ] Update metric tooltips with category-specific explanations
- [ ] Add "typical ranges" indicators on charts
- [ ] Executive summary with category-appropriate recommendations

### Phase 5: Documentation & Polish (Week 5-6)
- [ ] Update README with new framework approach
- [ ] Add guided tour/tutorial for new users
- [ ] Create example scenarios per category
- [ ] Performance testing with new data structures
- [ ] Mobile responsive testing

---

## Key Technical Decisions

### 1. Backward Compatibility
**Decision**: No backward compatibility needed (new framework is superior)
**Rationale**: Tool is educational, no user data to migrate

### 2. Default Flow
**Decision**: Force Layer 1 selection before showing models
**Rationale**: Prevent users from using generic/unrealistic inputs

### 3. Model Filtering
**Decision**: Hide non-applicable models (don't just gray out)
**Rationale**: Reduces cognitive load, clearer decision-making

### 4. Pricing Defaults
**Decision**: Use framework midpoints as defaults, show ranges as hints
**Rationale**: Realistic starting points, ranges guide user exploration

### 5. Layer 2/3 Impact
**Decision**: Show side-by-side comparison of delivery/service options
**Rationale**: Helps users understand true cost implications

---

## Success Metrics

### User Experience
- Time to first meaningful result: <2 minutes (down from 5+)
- Accuracy of pricing vs. industry: Within 20% of real-world (vs. 50%+)
- User confidence in results: Self-reported in feedback

### Technical
- Page load: <1 second (maintain current)
- Calculation time: <300ms (maintain current)
- Mobile usability: 90%+ of desktop features

### Business Value
- Applicable model suggestions: 100% accuracy (vs. 60% with generic approach)
- Realistic pricing ranges: 80%+ users stay within framework ranges
- Scenario reusability: Users save/share configurations

---

## Migration Checklist

### Code Changes
- [ ] `app.js`: Add LAYER_1_CATEGORIES constant (~500 lines)
- [ ] `app.js`: Add LAYER_2_DELIVERY constant (~150 lines)
- [ ] `app.js`: Add LAYER_3_SERVICE constant (~100 lines)
- [ ] `app.js`: Update model definitions with category mappings
- [ ] `app.js`: Add filtering logic for applicable models
- [ ] `app.js`: Add modifier calculation functions
- [ ] `app.js`: Update UI generation for stepped flow
- [ ] `index.html`: Update layout for stepped approach
- [ ] `styles.css`: Add styles for category selector, step indicators

### Documentation
- [ ] Update `claude.md` with new architecture
- [ ] Update `README.md` with framework explanation
- [ ] Create `FRAMEWORK_ALIGNMENT_PLAN.md` (this document)
- [ ] Add inline code comments for Layer 1/2/3 logic

### Testing
- [ ] Test each Layer 1 category with applicable models
- [ ] Verify pricing ranges match framework
- [ ] Test Layer 2/3 modifiers apply correctly
- [ ] Validate calculations with real-world examples
- [ ] Mobile responsive testing

---

## Example: Development & DevOps Walkthrough

### User Story
"I'm building a CI/CD platform and want to understand which revenue model works best"

### Current Experience (Generic)
1. User sees 20 models, unclear which applies to CI/CD
2. Selects "Usage-Based" arbitrarily
3. Enters guessed values: $0.10/unit, 1000 units/customer
4. Gets projections, but uncertain if realistic for CI/CD
5. No benchmark comparison
**Result**: Low confidence in decision

### New Experience (Framework-Aligned)
1. User selects "Development & DevOps Infrastructure"
2. Sees filtered models:
   - ✅ Per-Seat (R350-R800/dev/month) - for developer licenses
   - ✅ Usage-Based (R0.80-R3/build minute) - for CI/CD ⭐ BEST FIT
   - ✅ Tiered (R200-R2,000/month) - for packaged offerings
   - ✅ Credits (R1,000 = 100k API calls) - for multi-service
3. Selects "Usage-Based" with confidence (clearly applicable)
4. Form shows CI/CD-specific inputs:
   - Price per build minute: [R1.50] (R0.80-R3 typical)
   - Build minutes per customer: [500] (100-2000 typical for early stage)
   - Monthly growth in usage: [20%] (15-30% typical)
5. Selects Layer 2: "Cloud-Hosted SaaS"
6. Selects Layer 3: "Self-Service"
7. Gets projections with benchmarks:
   - "Your R1.50/minute is in healthy range (R0.80-R3)"
   - "LTV:CAC ratio 5.2 exceeds benchmark (3-5)"
   - "Similar CI/CD platforms: CircleCI, GitHub Actions"
**Result**: High confidence, informed decision

---

## Open Questions

1. **Granularity**: Should we support sub-categories (e.g., "CRM" vs "ERP" within Business Operations)?
   - **Recommendation**: Start with 10 top-level categories, add sub-categories in v2 if needed

2. **Pricing Currency**: Framework uses ZAR, should we support multi-currency?
   - **Recommendation**: Start ZAR-only, add USD conversion in v2 with toggle

3. **Industry Benchmarks**: Should we fetch live data or use static framework values?
   - **Recommendation**: Static framework values for v1, live data requires ongoing maintenance

4. **Comparison Limits**: Should we allow cross-category comparisons (e.g., CRM vs Marketing Automation)?
   - **Recommendation**: Allow but show warning "Different categories, limited comparability"

5. **Saved Scenarios**: Should we persist Layer 1/2/3 selections in localStorage?
   - **Recommendation**: Yes, include in saved scenario data structure

---

## Next Steps

### Immediate (This Session)
1. Review and approve this alignment plan
2. Identify any missing categories or pricing contexts
3. Decide on phased rollout vs. complete rebuild

### Week 1 Actions
1. Implement Layer 1 categories data structure
2. Map existing models to categories
3. Create category selector UI
4. Test filtering logic

### Success Criteria for v1
- All 10 Layer 1 categories defined with realistic pricing
- All 20 existing models mapped to applicable categories
- Layer 2/3 modifiers apply correctly to calculations
- UI guides users through stepped selection process
- Results show industry benchmarks and context

---

## Appendix: Category-to-Model Mapping

```javascript
// Quick reference for which models apply to which categories
const CATEGORY_MODEL_MAP = {
  'dev-devops': ['per-seat', 'usage-based', 'tiered', 'freemium', 'credits-token', 'open-core', 'one-time'],
  'business-ops': ['per-seat', 'tiered', 'per-employee', 'per-module', 'usage-based', 'per-transaction', 'professional-services', 'ela'],
  'marketing': ['tiered-contacts', 'usage-based', 'per-seat-contacts', 'credits', 'freemium', 'per-channel'],
  'productivity': ['per-seat', 'freemium', 'flat-rate', 'tiered-usage', 'hybrid-seat-usage'],
  'data-analytics': ['tiered-data', 'per-seat', 'usage-based', 'ai-usage', 'data-licensing', 'professional-services', 'outcome-based'],
  'security': ['per-seat-device', 'managed-services', 'tiered', 'usage-based', 'ela', 'outcome-compliance'],
  'content-media': ['tiered', 'per-site', 'storage-bandwidth', 'per-stream', 'freemium', 'white-label', 'professional-services', 'cdn-usage'],
  'customer-support': ['per-agent', 'tiered-volume', 'per-channel', 'usage-based', 'freemium', 'tiered-customers', 'professional-services'],
  'ecommerce-payments': ['tiered-subscription', 'transaction-based', 'hybrid-sub-transaction', 'revenue-share', 'per-location', 'white-label', 'subscription-billing'],
  'industry-specific': ['per-provider', 'per-location', 'per-unit', 'tiered-size', 'per-project', 'per-member']
};
```
