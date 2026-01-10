# Session Notes

> Context and progress notes to preserve between sessions

## Current Session

**Date:** 2026-01-10

**Task:** Comprehensive Testing Coverage

**What was done:**
1. Reviewed existing test infrastructure (Testing Lab from Jan 9)
2. Expanded workflow test scenarios from 10 to 18:
   - Model 1: 10 existing scenarios (Cost-Plus variants)
   - Model 2: 2 new scenarios (Perpetual Licence, Usage-Based Royalties)
   - Model 3: 1 new scenario (Contribution-Based Joint Development)
   - Model 4: 1 new scenario (BOT Fixed Transfer Price)
   - Model 5: 1 new scenario (Outright Software Sale)
   - Model 6: 3 new scenarios (SaaS Subscription, Buyer Has No Asset)
3. Added new assertion library entries for Models 2-6:
   - Developer Licence Revenue (Perpetual)
   - Buyer Capitalised Licence
   - Usage-Based Royalty Revenue
   - Developer Ownership (Contribution-Based)
   - Developer BOT Service Revenue
   - Developer Sale Proceeds / Capital Gain
   - Developer Subscription Revenue
   - Buyer No Asset (SaaS)
4. Added Long-term Value test suite:
   - 5 NPV test cases (simple, break-even, negative, high discount, zero discount)
   - 4 IRR test cases (standard, 100% return, low return, even cash flows)
   - 5 Payback test cases (simple, fractional, discounted, immediate, not achieved)
5. Updated Testing UI with tabs:
   - "Workflow Tests" tab - model calculation scenarios
   - "Long-term Value Tests" tab - NPV/IRR/Payback calculations

**Key Outcome:**
Testing Lab now covers:
- All 6 transaction models (Models 1-6)
- Long-term Value calculations (NPV, IRR, Payback)
- 18 workflow scenarios + 14 financial calculation tests = 32 total tests

**Files Modified:** 2 files
- models/intercompany/testing-utilities.js (~400 lines added)
- ui/intercompany/testing.js (~200 lines added)

**Status:** Complete

## Previous Sessions

**2026-01-10 (earlier):** UI Alignment with Tool Goals - Added Long-term Value dimension to comparison view and results display

**2026-01-10 (earlier):** Tool Goals Investigation & Refinement - Refined goal language, defined "best deal" across 5 dimensions

**2026-01-10 (earlier):** Complete removal of Combined/Shareholder/Net Effect references - 24+ files modified, ~960 lines removed
