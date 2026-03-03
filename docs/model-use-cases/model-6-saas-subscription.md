# Model 6: SaaS / Subscription — Use Cases

> **Purpose**: When to use each variant of the SaaS/Subscription model
> **Variants**: 9 (6A–6I)
> **Core Concept**: Developer hosts and maintains software; Buyer subscribes without ownership transfer

---

## Overview

Model 6 is best when **Buyer wants access without ownership** and Developer wants recurring revenue. Developer retains the asset and hosts it; Buyer pays subscription fees for access.

**Choose Model 6 over other models when:**
- Buyer prefers OPEX over CAPEX (subscription fees typically expensed; however, significant implementation or configuration costs may still require capitalisation under ASC 350-40/IFRS)
- Developer wants predictable recurring revenue
- Rapid deployment needed (no implementation overhead)
- Buyer wants flexibility to exit (no long-term lock-in)

**Characterisation note:** While SaaS is typically treated as a services model, tax characterisation varies by jurisdiction. Some authorities (notably India historically) characterise SaaS payments as royalties rather than service fees, affecting withholding tax treatment. Cross-border arrangements require characterisation analysis based on specific terms and applicable treaties.

---

## Variant 6A: Flat-Rate Subscription

### Description
Fixed monthly or annual fee regardless of usage or user count. Simplest pricing model.

### Best Scenario
**Simplicity and predictability** — Buyer wants known costs, Developer wants straightforward billing.

### Real-World Example
> A small business subscribes to project management software for R500/month flat. Regardless of whether they have 5 or 15 users, or whether they create 10 or 100 projects, the price is R500. Simple to budget, simple to bill. No usage tracking needed.

### Why 6A Over Other Variants
- Maximum simplicity
- Predictable costs for Buyer
- Easy to administer for Developer
- No usage monitoring infrastructure needed

### Transfer Pricing Consideration
Flat fee benchmarkable against comparable SaaS offerings. Document market rate comparisons.

---

## Variant 6B: Per-User Pricing

### Description
Price scales with user count. More users = higher fee.

### Best Scenario
**Value correlates with headcount** — software value increases proportionally with number of users.

### Real-World Example
> A company subscribes to communication software at R80/user/month. With 50 employees: R4,000/month. After acquisition, 150 employees: R12,000/month. Cost scales with organisation size. Fair to Buyer (pay for what you use). Developer's revenue grows with Buyer's growth.

### Why 6B Over Other Variants
- Fair value alignment (more users = more value = higher price)
- Revenue scales with Buyer's growth
- Industry standard for many SaaS categories
- Simple to count and verify

### Transfer Pricing Consideration
Per-user rate benchmarkable against competitors. Document market comparisons.

---

## Variant 6C: Usage-Based Pricing

### Description
Pay for actual consumption (API calls, transactions, storage, compute).

### Best Scenario
**Variable/unpredictable usage** — cost should align precisely with actual value consumed.

### Real-World Example
> An analytics platform charges R0.10 per query executed. Light month: 10,000 queries = R1,000. Heavy month: 500,000 queries = R50,000. Buyer's cost directly reflects usage. Developer invests in infrastructure proportional to demand. Perfect alignment between cost and value.

### Why 6C Over Other Variants
- Precise cost-value alignment
- No overpaying for unused capacity
- Scales automatically with usage
- Buyer only pays for what they consume

### Transfer Pricing Consideration
Per-unit rate benchmarkable. Requires robust usage metering and reporting.

---

## Variant 6D: Tiered Pricing

### Description
Multiple feature/price tiers (Starter, Professional, Enterprise). Buyer chooses tier matching needs.

### Best Scenario
**Different customer segments with different needs** — one-size-fits-all doesn't work.

### Real-World Example
> An HR software offers: Starter (R200/month, 10 users, basic features), Professional (R800/month, 50 users, advanced reporting), Enterprise (R3,000/month, unlimited users, SSO, dedicated support). Small businesses choose Starter. Growing companies choose Professional. Enterprises choose Enterprise. Each segment gets appropriate value at appropriate price.

### Why 6D Over Other Variants
- Captures different willingness-to-pay segments
- Clear upgrade path (grow into higher tier)
- Feature differentiation justifies price difference
- Maximises revenue across customer segments

### Transfer Pricing Consideration
Each tier priced at arm's length. Document feature-value relationship for each tier.

---

## Variant 6E: SaaS with Customisation

### Description
Base subscription plus custom development for Buyer-specific requirements.

### Best Scenario
**Standard platform needs customisation** — Buyer's processes differ from out-of-box product.

### Real-World Example
> A manufacturer subscribes to inventory management SaaS at R2,000/month. They need custom integration with their proprietary MES (Manufacturing Execution System). Custom development: R80,000 one-time. Custom maintenance: R1,000/month. Total: R2,000/month subscription + R80,000 one-time + R1,000/month custom support.

### Why 6E Over Other Variants
- Accommodates Buyer-specific requirements
- Developer earns additional revenue from customisation
- Buyer gets tailored solution without building from scratch
- Platform + custom layers clearly separated

### IP Ownership for Customisations

Address explicitly in contract:
- **Ownership**: Does Buyer own custom code, or does Developer retain rights?
- **Reuse**: Can Developer incorporate customisations into standard product for other customers?
- **Termination**: What happens to customisations if Buyer terminates subscription?
- **Accounting**: If Buyer owns custom code, the R80k may be capitalisable; if Developer owns, it's typically expensed

### Transfer Pricing Consideration
Subscription and customisation separately benchmarked. Custom development at arm's length rates. If Buyer owns resulting IP, characterise as development services; if Developer owns, characterise as SaaS enhancement.

---

## Variant 6F: SaaS with Premium Support

### Description
Enhanced SLA and support options for mission-critical deployments.

### Best Scenario
**Business-critical deployment** — downtime or slow support response has significant business impact.

### Real-World Example
> A payment processor subscribes to fraud detection SaaS. Standard: R5,000/month, 24-hour response SLA, 99% uptime. Premium: R8,000/month, 2-hour response SLA, 99.9% uptime, dedicated support engineer, 24/7 phone support. For payment processing, the premium is essential — 2 hours of downtime could cost millions.

### Why 6F Over Other Variants
- Appropriate service level for critical systems
- Developer dedicates resources for premium customers
- Higher revenue justified by higher service commitment
- Buyer gets peace of mind for critical workloads

### Transfer Pricing Consideration
Premium support fee benchmarkable against market rates for comparable SLA levels.

---

## Variant 6G: SaaS with Data Residency

### Description
Data stored in specific geographic location for regulatory compliance.

### Best Scenario
**Regulatory or policy requirement** — data must remain in specific jurisdiction.

### Real-World Example
> A South African bank subscribes to customer analytics SaaS. Regulatory requirements (POPIA for data protection, sector-specific banking regulations) require customer data to remain in South Africa. Standard SaaS: data in global cloud (R3,000/month). SA data residency option: dedicated SA-based infrastructure (R4,500/month). Bank pays premium for compliance certainty.

### Why 6G Over Other Variants
- Meets regulatory requirements
- Data sovereignty concerns addressed
- Premium reflects additional infrastructure cost
- Enables SaaS for regulated industries

### Transfer Pricing Consideration
Data residency premium should reflect actual infrastructure cost differential. **PE risk:** Local infrastructure may create permanent establishment issues — if Developer hosts servers in Buyer's jurisdiction, tax nexus questions arise. If Developer has local entity, intercompany pricing for infrastructure services applies. Consider PE implications when structuring data residency arrangements.

---

## Variant 6H: Committed Use Discount

### Description
Discount in exchange for multi-year commitment. Enterprise agreements.

### Best Scenario
**Large customer wanting cost savings** in exchange for commitment and predictability.

### Real-World Example
> A large enterprise uses SaaS platform across 5,000 employees. Month-to-month: R100/user/month = R6M/year. 3-year commitment: R80/user/month = R4.8M/year (20% discount). Enterprise commits R14.4M over 3 years. Developer gets revenue certainty; Buyer gets R3.6M savings over 3 years.

### Why 6H Over Other Variants
- Significant cost savings for committed Buyers
- Revenue predictability for Developer
- Stronger customer relationship (multi-year lock-in)
- Standard practice for enterprise SaaS

### Transfer Pricing Consideration
Commitment discount should reflect market practice. Document comparable enterprise agreements.

---

## Variant 6I: White-Label SaaS

### Description
Buyer rebrands platform and resells to their end customers. Reseller/partner model.

**Cross-reference:** Compare with [Model 2F (White-Label/Reseller Licence)](./model-2-software-licence.md#variant-2f-white-label--reseller-licence). Key difference: 6I = Developer hosts (SaaS delivery); 2F = Buyer or end-customer hosts (licence delivery). Choose based on who operates infrastructure.

### Best Scenario
**Buyer has distribution capability** — can reach end customers that Developer cannot access directly.

### Real-World Example
> A regional IT services company licenses white-label helpdesk SaaS. Platform fee: R10,000/month. Per end-customer fee: R50/seat/month. IT company rebrands as "ServiceCo Helpdesk" and sells to their SME clients at R150/seat/month. IT company earns R100/seat margin. Developer earns platform fee + per-seat royalty without direct sales effort.

### Why 6I Over Other Variants
- Developer accesses markets without sales investment
- Reseller earns margin on distribution
- Scales with reseller's end-customer success
- Common model for regional/vertical expansion

### Transfer Pricing Consideration
Platform fee and per-seat royalty separately benchmarked. Reseller margin should be arm's length.

---

## Standard SaaS Contract Elements

The following apply to **all SaaS variants** and affect economics:

### Service Credits
Standard SaaS includes credits for downtime below SLA threshold:
- Typical structure: Credits equal to percentage of monthly fee for downtime hours
- Credits reduce effective pricing and should be factored into deal economics
- Example: 1% credit per hour below 99.9% uptime = up to 7% monthly fee reduction

### Data Portability and Exit Rights
Address before signing:
- **Data export**: Buyer's right to extract their data on termination
- **Format**: Structured export (CSV, JSON) vs raw database dump
- **Timeline**: How long Developer retains data post-termination
- **Cost**: Export assistance fees if any

### Auto-Renewal and Termination
Lock-in mechanics affect pricing negotiation:
- **Auto-renewal**: Most SaaS auto-renews; understand notice periods
- **Termination for convenience**: Can Buyer exit early? Penalties?
- **Termination for cause**: SLA breach, security incident, material breach

### Data Ownership and Usage Rights
Buyer's data resides in Developer's systems:
- **Ownership**: Buyer owns their data; Developer has licence to host
- **Usage**: Can Developer use anonymised/aggregated data for analytics, benchmarking?
- **Security**: Data protection obligations, breach notification requirements

---

## Variant Selection Guide

**Pricing structure variants** (choose one as base):

| Scenario | Best Variant |
|----------|--------------|
| Maximum simplicity | **6A** — flat-rate |
| Value scales with user count | **6B** — per-user |
| Variable/unpredictable usage | **6C** — usage-based |
| Different customer segments | **6D** — tiered pricing |

**Service/compliance options** (can combine with pricing variant):

| Scenario | Add Variant |
|----------|-------------|
| Standard platform + custom needs | **+ 6E** — customisation |
| Mission-critical deployment | **+ 6F** — premium support |
| Regulatory data residency | **+ 6G** — data residency |
| Multi-year commitment desired | **+ 6H** — committed discount |

**Channel variant** (alternative go-to-market):

| Scenario | Best Variant |
|----------|--------------|
| Reseller/partner channel | **6I** — white-label |

**Example combinations:** "6B + 6F + 6G + 6H" = per-user pricing with premium support, data residency, and committed discount — common enterprise SaaS structure.

---

## Common Mistakes to Avoid

1. **Using 6A (flat-rate) when usage varies dramatically** — Buyer overpays or underpays
2. **Using 6C (usage-based) without robust metering** — billing disputes
3. **Skipping 6F (premium support) for critical workloads** — inadequate SLA
4. **6I (white-label) without clear end-customer terms** — channel conflict
5. **Ignoring data portability** — Buyer locked in without exit path
6. **Not addressing customisation IP ownership (6E)** — disputes on termination
7. **Cross-border SaaS without characterisation analysis** — unexpected withholding tax

---

## Related Documentation

- [Calculations Guide](../CALCULATIONS.md) — Formula explanations
- [Business Guide](../BUSINESS_GUIDE.md) — User workflows
