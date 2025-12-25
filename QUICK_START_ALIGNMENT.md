# Quick Start: Framework Alignment

## TL;DR - What Changes?

### Before (Generic Revenue Models)
```
User picks a revenue model → Enters generic numbers → Gets projections
Problem: No context, unrealistic defaults, unclear applicability
```

### After (Context-Driven Framework)
```
User picks software type → Sees applicable models with real pricing ranges →
Configures delivery/service → Gets realistic projections with benchmarks
Benefit: Accurate pricing, industry context, confident decisions
```

---

## 3-Layer Framework Summary

### 🎯 Layer 1: Core Function Categories (Primary Driver)
**What it is**: The type of software being priced (CRM, CI/CD, Marketing Automation, etc.)

**10 Categories**:
1. Development & DevOps Infrastructure
2. Business Operations Software (CRM, ERP, HRM)
3. Marketing & Customer Engagement
4. Workplace Productivity & Collaboration
5. Data & Analytics
6. Security & Compliance
7. Content & Media Management
8. Customer Support & Service
9. E-commerce & Payments
10. Industry-Specific Solutions

**Impact**: Determines which revenue models are applicable and realistic pricing ranges

### 🚀 Layer 2: Delivery Mechanisms (Modifier)
**What it is**: How the software is delivered to customers

**5 Options**:
- Cloud-Hosted SaaS (baseline)
- Self-Hosted/On-Premise (higher upfront, lower recurring)
- Hybrid Cloud (+30-50% complexity premium)
- Mobile Applications (app store fees, dev cost impact)
- API/Embedded (usage-based dominant, higher support costs)

**Impact**: Affects pricing structure and gross margins

### 🛠️ Layer 3: Service Models (Modifier)
**What it is**: Level of vendor involvement in customer success

**4 Options**:
- Self-Service (-30-50% price, higher churn)
- Managed Services (+R1,500-R5,000/unit/month, lower churn)
- Professional Services (R500-R2,500/hour, 1-3× software revenue)
- Hybrid/Modular (à la carte combination)

**Impact**: Affects total customer cost and vendor margins

---

## Key Changes to Your App

### 1. New Primary Selector
**Before**: "Select Revenue Model" dropdown
**After**: "What type of software are you pricing?" dropdown (Layer 1)

### 2. Filtered Model List
**Before**: All 20 models shown regardless of applicability
**After**: Only models applicable to selected software category shown

Example:
- Select "Development & DevOps" → See only: Per-Seat, Usage-Based, Tiered, Freemium, Credits, Open Core
- Select "CRM (Business Operations)" → See only: Per-Seat, Tiered, Professional Services, ELA

### 3. Realistic Pricing Hints
**Before**: Generic hints like "Typical range: $49-$499"
**After**: Category-specific hints like "CRM sales licenses: R250-R1,500/user/month (60% choose lowest tier)"

### 4. Layer 2/3 Modifiers
**New Feature**: Radio buttons for delivery mechanism and service model
- Calculations adjust based on selections
- Example: Self-Service reduces price 30-50%, Managed Services adds R1,500-R5,000/month

### 5. Industry Benchmarks
**New Feature**: Show how user's inputs compare to industry standards
- "Your R800/user/month is mid-tier (R250-R1,500 typical)"
- "LTV:CAC ratio 4.2 is healthy (3-5 benchmark)"

---

## Implementation Steps (Prioritized)

### Must-Have (MVP)
1. ✅ Add Layer 1 category data structure with pricing contexts
2. ✅ Create category selector UI (new Step 1)
3. ✅ Filter models based on selected category
4. ✅ Update input form hints with category-specific ranges
5. ✅ Show industry benchmarks in results

### Should-Have (v1.1)
6. ⏳ Add Layer 2 delivery mechanism selector and modifiers
7. ⏳ Add Layer 3 service model selector and modifiers
8. ⏳ Category-specific scenario templates
9. ⏳ Comparison warnings for cross-category comparisons

### Nice-to-Have (v2)
10. 🔮 Sub-category support (e.g., CRM vs ERP within Business Operations)
11. 🔮 Multi-currency toggle (ZAR ↔ USD conversion)
12. 🔮 Live industry benchmark data fetching
13. 🔮 Saved scenarios with Layer 1/2/3 persistence

---

## Example: CRM Pricing (Before vs After)

### Before (Generic)
```
1. User selects "Per-Seat" model
2. Enters: Price = $100, Users = 50, Churn = 5%
3. Gets generic projections
4. Uncertain if $100/user is realistic for CRM
5. No benchmark comparison
```

### After (Framework-Aligned)
```
1. User selects "Business Operations Software"
2. Sees filtered options:
   ✅ Per-Seat (R250-R1,500/user/month) ← PRIMARY FOR CRM
   ✅ Tiered (Starter→Pro→Enterprise packaging)
   ✅ Professional Services (Implementation R350k-R800k)
   ✅ ELA (500+ users, 3-year commitments)
3. Selects "Per-Seat" with confidence (knows it's standard for CRM)
4. Form shows CRM-specific context:
   - Sales Rep License: [R___] (R250-R1,500 typical)
   - New Reps/Month: [___] (5-20 for growing team)
   - Churn: [__%] (3-7% healthy for CRM)
   - Tier Distribution: 60% lowest, 25% mid, 15% enterprise
5. Selects Layer 2: "Cloud-Hosted SaaS"
6. Selects Layer 3: "Self-Service" (vs Managed Services)
7. Gets results with benchmarks:
   - "Your R750/user is mid-tier (R250-R1,500 range)"
   - "5% churn is healthy (3-7% benchmark)"
   - "LTV:CAC 4.5 exceeds benchmark (3-5 ideal)"
   - "Similar CRMs: Salesforce, HubSpot, Pipedrive"
```

**Result**: User has high confidence their pricing is realistic for CRM market

---

## Code Structure Changes

### New Constants (app.js)
```javascript
// Add ~500 lines
const LAYER_1_CATEGORIES = { ... };

// Add ~150 lines
const LAYER_2_DELIVERY = { ... };

// Add ~100 lines
const LAYER_3_SERVICE = { ... };

// Update existing
const models = {
  'per-seat': {
    name: 'Per-Seat/Per-User',
    applicableCategories: ['dev-devops', 'business-ops', 'productivity', 'data-analytics', 'security', 'customer-support'],
    pricingByCategory: {
      'dev-devops': {
        range: 'R350-R800/developer/month',
        default: 575,
        hint: 'IDE licenses, code review platforms'
      },
      'business-ops': {
        range: 'R250-R1,500/user/month',
        default: 750,
        hint: 'CRM sales reps, ERP users'
      },
      // ... other categories
    },
    // ... existing model definition
  }
};
```

### New UI Elements (index.html)
```html
<!-- New Step 1: Category Selection -->
<div id="categorySelector" class="mb-6">
  <label>What type of software are you pricing?</label>
  <select id="categoryDropdown">
    <option value="">Select category...</option>
    <option value="dev-devops">Development & DevOps Infrastructure</option>
    <option value="business-ops">Business Operations Software</option>
    <!-- ... more options -->
  </select>
  <p class="category-description"><!-- Dynamic description --></p>
  <p class="category-examples">Examples: <!-- Dynamic examples --></p>
</div>

<!-- Updated Step 2: Filtered Model Selection -->
<div id="modelSelector">
  <!-- Now filtered based on selected category -->
</div>

<!-- New Step 3: Delivery & Service Options -->
<div id="layerTwoThree" class="hidden">
  <h3>Delivery Mechanism</h3>
  <div class="radio-group">
    <label><input type="radio" name="delivery" value="cloud-saas" checked> Cloud-Hosted SaaS</label>
    <label><input type="radio" name="delivery" value="self-hosted"> Self-Hosted</label>
    <!-- ... more options -->
  </div>

  <h3>Service Model</h3>
  <div class="radio-group">
    <label><input type="radio" name="service" value="self-service" checked> Self-Service</label>
    <label><input type="radio" name="service" value="managed"> Managed Services</label>
    <!-- ... more options -->
  </div>
</div>
```

### New Logic Functions (app.js)
```javascript
// Filter models based on category
function getApplicableModels(categoryKey) {
  const category = LAYER_1_CATEGORIES[categoryKey];
  return category.applicableModels.map(modelKey => models[modelKey]);
}

// Get category-specific defaults for model
function getCategoryDefaults(modelKey, categoryKey) {
  const model = models[modelKey];
  return model.pricingByCategory[categoryKey];
}

// Apply Layer 2/3 modifiers to calculation
function applyModifiers(baseResults, delivery, service) {
  let modifiedResults = [...baseResults];

  // Delivery modifiers
  if (delivery === 'self-hosted') {
    // Convert to one-time + maintenance model
  } else if (delivery === 'hybrid') {
    // Add 30-50% complexity premium
  }

  // Service modifiers
  if (service === 'self-service') {
    // Reduce price 30-50%
  } else if (service === 'managed-services') {
    // Add R1,500-R5,000/unit/month
  }

  return modifiedResults;
}
```

---

## Testing Checklist

### Category Coverage
- [ ] All 10 Layer 1 categories defined
- [ ] Each category has 3+ applicable models
- [ ] Pricing ranges match framework document
- [ ] Examples are realistic and recognizable

### Model Filtering
- [ ] Selecting category filters model list correctly
- [ ] Filtered models show category-specific pricing hints
- [ ] Non-applicable models are hidden (not grayed out)
- [ ] Changing category updates filtered list immediately

### Layer 2/3 Modifiers
- [ ] Delivery mechanism selection updates pricing calculation
- [ ] Service model selection updates pricing calculation
- [ ] Combined modifiers apply correctly (e.g., self-hosted + managed)
- [ ] Results show modifier impact clearly

### Benchmarks
- [ ] Results show category-specific benchmarks
- [ ] User inputs compared to typical ranges
- [ ] Visual indicators (✅/⚠️) for healthy vs unhealthy metrics
- [ ] Tooltip explanations are category-appropriate

---

## Success Criteria

### Quantitative
- ✅ User completes pricing scenario in <3 minutes (vs 5+ before)
- ✅ 80%+ of user inputs fall within framework pricing ranges
- ✅ 100% of applicable model suggestions are accurate for category
- ✅ Page load time remains <1 second
- ✅ Calculation time remains <300ms

### Qualitative
- ✅ Users report high confidence in pricing accuracy
- ✅ Clear understanding of which models apply to their software
- ✅ Industry context makes benchmarks actionable
- ✅ Layer 2/3 modifiers are easy to understand

---

## FAQ

**Q: Do we remove the existing 20 models?**
A: No, we keep all models but map them to applicable categories and add category-specific context.

**Q: What if user wants to compare models across categories?**
A: Allow it but show warning: "Comparing different software categories - limited comparability"

**Q: Should Layer 1 selection be required?**
A: Yes, force selection to ensure users get realistic pricing. No generic fallback.

**Q: How do we handle industry-specific sub-categories?**
A: Start with 10 top-level categories. Add sub-categories in v2 if user feedback requests it.

**Q: Should we support both ZAR and USD?**
A: Start ZAR-only (framework uses ZAR). Add USD toggle in v2 with conversion rate.

**Q: What about mobile responsiveness?**
A: Maintain current mobile-first approach. Layer 1/2/3 selectors stack vertically on small screens.

---

## Next Actions

### Decision Needed
1. ⏸️ **Review this plan** - Does the 3-layer approach make sense?
2. ⏸️ **Prioritize phases** - MVP only? Or full Layer 2/3 in v1?
3. ⏸️ **Timeline** - 2 weeks? 4 weeks? 6 weeks?

### Ready to Start (If Approved)
1. ✅ Define Layer 1 categories data structure
2. ✅ Map existing models to categories
3. ✅ Build category selector UI
4. ✅ Implement filtering logic
5. ✅ Update input forms with category context

---

**Bottom Line**: This framework transforms your calculator from a generic tool into an industry-specific pricing advisor. Users get realistic, actionable insights instead of guesswork.
