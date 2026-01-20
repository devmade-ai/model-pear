# Discovery Findings: Software Transaction Structuring Tool

> **Date**: January 2026
> **Method**: Applied Discovery Framework (Session 1: Quick Discovery)
> **Status**: Complete - Ready for implementation planning

---

## Process Used

We applied the [Discovery Framework](./DISCOVERY_FRAMEWORK.md) to understand how this tool will actually be used, by whom, and why.

### Sessions Completed

1. **Part A: The People** - Identified actual users and their roles
2. **Part B: The Flow** - Mapped when and how the tool fits into deal process
3. **Part C: The Data** - Traced information sources and sensitivities
4. **Part D: Contact Mapping** - Skipped (internal tool)
5. **Part E: Why Now** - Captured drivers and pain points
6. **Post-Session Analysis** - Compared findings against current solution

---

## Key Discovery: The Actual Use Case

> **Tech-sales person guiding a non-technical exec + finance exec through options in a live session to reach agreement faster**

This is fundamentally different from "back-office analyst running complex scenarios alone."

---

## Findings

### Part A: The People

| Person | Role in Tool | Frequency | What They Care About |
|--------|--------------|-----------|---------------------|
| **You** (tech-sales) | Guides client through options | Per deal | Fair deal, avoid conflict, close deal |
| **Client exec** (non-technical) | Makes decision on structure | Per deal | Big picture, relationship, fairness |
| **Client finance** | Validates numbers make sense | Per deal | Correct accounting, tax efficiency |

**Key insight**: Tool is used *with* the client, not *about* the client. It's a negotiation aid, not a back-office calculator.

### Part B: The Flow

```
[Discovery Framework] → understand needs, flows, data
        ↓
[Qualify] → is this a real opportunity?
        ↓
[Proposal prep] → you have enough info to model options
        ↓
════════════════════════════════════════════════════════════
   TOOL ENTERS HERE - "Let's structure this together"
════════════════════════════════════════════════════════════
        ↓
[Session: Walk through model(s) together]
   - Start with industry standards (neutral ground)
   - Input their specific numbers
   - Compare 2-3 options side by side
        ↓
[Sensitivity: "What if X changes?"]
   - Address concerns before they become objections
        ↓
[Decision: Agree on structure]
        ↓
[Output: Summary/report?] → feeds contract OR just alignment
```

**Key insight**: The tool *defuses money sensitivity* by using industry benchmarks as neutral starting points and showing both sides transparently.

### Part C: The Data

| Data | Source | Notes |
|------|--------|-------|
| Development costs | You | You know this |
| Client budget | Client (maybe) | Relationship dependent - may not share early |
| Industry benchmarks | Tool | **Critical** - neutral starting point |
| Capitalisation choice | Client finance | PC (2yr) vs Mainframe (5yr) - key variable |
| Model-specific inputs | Varies | Each model needs different data |

**Key insight**: Industry standards aren't "nice to have" - they're **negotiation lubricant**. They let you run meaningful scenarios before the client shares sensitive numbers.

**Deferred for now**: Tax rates and currency complexity. Focus on capitalisation choices.

### Part D: Contact Mapping

Skipped - internal tool, no external stakeholders to contact.

### Part E: Why Now

| Question | Answer |
|----------|--------|
| **Driver** | Expected growth → more negotiations to handle |
| **Pain today** | Too much back-and-forth, delays timelines, pressures developers, expectations misaligned |
| **Deadline** | None hard, but ready to test and refine |

**Key insight**: Tool ROI = **shorter deal cycles**. Every week saved in negotiation = earlier revenue + less developer pressure.

### Two Client Scenarios

| Scenario | Characteristics | Tool Implications |
|----------|-----------------|-------------------|
| **Existing client** | More trust, know their accounting priorities, collaborative | Can skip intro, go deeper faster |
| **New client** | Less trust, data sensitivity, need neutral ground | Industry standards critical, progressive disclosure |

---

## Gap Analysis

Comparing discoveries against current solution:

| Discovery | Current Tool | Gap? |
|-----------|--------------|------|
| **Used WITH client** (collaborative) | UI designed for solo analysis? | Check - is it "presentation friendly"? |
| **Industry standards critical** | Has benchmarks built in | Check - are they prominent/default? |
| **Non-technical exec** as audience | Technical terminology in UI? | Check - language may need simplifying |
| **Start simple, add detail** | All inputs shown at once? | Check - progressive disclosure? |
| **Compare 2-3 options** | Compare mode exists | Good - verify it works smoothly |
| **Defuse money sensitivity** | Shows both sides | Good - this is core value |
| **Shorter deal cycles** | Complex analysis features | Check - over-engineered for core use case? |

---

## Plan: Align Tool with Findings

### Approach

**Option C → B → A**

1. **Define Principles** (from discovery) - guides all decisions
2. **Design Negotiation Mode** (ideal flow) - the target
3. **Audit Current UI** (against target) - specific fixes

### Design Principles

Based on discovery, every screen/feature must satisfy these:

| # | Principle | Test Question |
|---|-----------|---------------|
| 1 | **Client in the room** | Can you explain this screen in 10 seconds? |
| 2 | **Neutral ground first** | Do industry standards appear as defaults? |
| 3 | **Show both sides** | Is "what you get / what they get" always visible? |
| 4 | **Progressive complexity** | Can you start simple and add detail on demand? |
| 5 | **Compare to decide** | Is it easy to save Option A, tweak, compare to Option B? |

### Negotiation Mode Flow (To Design)

Define the ideal 5-minute walkthrough:

1. What screens do you actually need?
2. What's shown vs hidden by default?
3. What's the minimum viable feature set for closing a deal?
4. What's "impressive but never used in practice"?

### UI Audit Checklist

Once principles and flow are defined, evaluate each screen:

- [ ] **Presentation friendly?** - Professional, clear hierarchy, no embarrassment showing to client
- [ ] **Industry standards prominent?** - Defaults populated, labelled as "industry standard"
- [ ] **Language accessible?** - CEO-friendly, accounting terms explained or hidden
- [ ] **Progressive disclosure?** - Simple first, advanced features tucked away
- [ ] **Compare flow smooth?** - Save/compare/choose is obvious and fast
- [ ] **Right-sized?** - No features that slow down live negotiation

---

## Next Steps

### Immediate

1. Define the ideal "Negotiation Mode" flow (5-minute walkthrough)
2. Review current UI against the 5 design principles
3. Create specific fix list from audit

### Future Considerations

- Simplified "presentation mode" vs "analysis mode"?
- Export/share results with client?
- Pre-built scenarios for common deal types?

---

## Appendix: Raw Discovery Notes

### Why This Tool Exists

- Avoid conflict in negotiations
- Expected growth means more deals to close
- Current process: too much back-and-forth, delays timelines, pressures developers

### What Success Looks Like

- Shorter deal cycles
- Aligned expectations before contract
- Both parties see the deal as fair
- Less pressure on developers from unclear scope/timelines
