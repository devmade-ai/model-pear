# REFACTOR PLAN: Remove Combined/Group Perspective

> **Created**: January 2026
> **Status**: NOT STARTED
> **Goal**: Simplify to two independent entities only (Developer + Buyer). Remove all combined view, group calculations, and consolidation logic.

## Problem Statement

The tool's language and architecture incorrectly frames it as a "group accounting" or "inter-company" tool when it's actually for:
- A software company (developer) working with ANY client (independent or related)
- Comparing transaction models to maximize value for both parties
- NOT consolidated accounting, NOT group financial statements

The "Combined" perspective and "group" calculations are misleading and should be removed.

## Summary

- **Total Phases**: 10
- **Total Sessions**: 32
- **Approach**: One file per session, test after each, commit after each phase

---

## RISK MITIGATION STRATEGY

### Before EVERY change:
1. Read the file to understand current state
2. Identify exact lines to change
3. Check dependencies - what imports this? what does this import?
4. Make ONE change per session
5. Test in browser after each change

### After EVERY change:
1. Open browser, load `index.html`
2. Check console for errors
3. Test the specific functionality changed
4. If broken → revert immediately with `git checkout <file>`
5. If working → commit that single change

### Rollback Commands:
```bash
# Revert single file
git checkout -- <filename>

# Revert last commit (keep changes)
git reset --soft HEAD~1

# Nuclear option - reset everything
git reset --hard HEAD
```

---

## PHASE 0: PREPARATION

### Session 0.1: Create safety branch and verify baseline
**Status**: [ ] NOT STARTED

**Steps**:
- [ ] Verify current branch: `git branch`
- [ ] Verify clean working tree: `git status`
- [ ] Open `index.html` in browser
- [ ] Verify Mode 2 loads without console errors
- [ ] Verify "Combined View" tab exists (baseline confirmation)

**Verification**: App works, Combined view exists

---

## PHASE 1: CHANGE DEFAULT PERSPECTIVE

### Session 1.1: Change default perspective in app-state.js
**Status**: [ ] NOT STARTED
**File**: `state/app-state.js`
**Line**: 27

**Current**: `currentPerspective: 'combined'`
**Change to**: `currentPerspective: 'developer'`

**Pre-check**:
- [ ] Read file, confirm line 27 has `'combined'`

**Change**:
- [ ] Change `'combined'` to `'developer'`

**Post-check**:
- [ ] Open browser, refresh
- [ ] Mode 2 should now default to Developer view (blue header)
- [ ] No console errors
- [ ] Can still manually click Combined tab (it still exists)

**If broken**: `git checkout state/app-state.js`

---

### Session 1.2: Update fallback in results-display.js
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/results-display.js`
**Lines**: 20, 32-33

**Pre-check**:
- [ ] Read file, confirm line 20: `const perspective = state.intercompany.currentPerspective || 'combined';`
- [ ] Confirm lines 31-34 have `case 'combined':` as default

**Changes**:
1. Line 20: `|| 'combined'` → `|| 'developer'`
2. Lines 31-34: Change default case to render developer

**Post-check**:
- [ ] Browser refresh
- [ ] No console errors
- [ ] Developer view renders by default

**If broken**: `git checkout ui/intercompany/results-display.js`

**PHASE 1 COMMIT**: `git commit -am "chore: change default perspective to developer"`

---

## PHASE 2: REMOVE COMBINED FROM PERSPECTIVE TOGGLE

### Session 2.1: Remove combined from PERSPECTIVES object
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/perspective-toggle.js`
**Lines**: 32-40

**Pre-check**:
- [ ] Read file
- [ ] Confirm PERSPECTIVES object has 3 entries: developer, buyer, combined

**Change**:
- [ ] Delete lines 32-40 (the entire `combined:` entry)

**Post-check**:
- [ ] Browser refresh
- [ ] Perspective toggle shows only 2 tabs: "Your Company" and "Client"
- [ ] No "Combined View" tab visible
- [ ] No console errors

**If broken**: `git checkout ui/intercompany/perspective-toggle.js`

---

### Session 2.2: Remove keyboard shortcut 'C' handler
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/perspective-toggle.js`
**Lines**: 254-257

**Pre-check**:
- [ ] Read file
- [ ] Confirm lines 254-257 have `case 'C': setPerspective('combined');`

**Change**:
- [ ] Delete the entire `case 'C':` block (lines 254-257)

**Post-check**:
- [ ] Browser refresh
- [ ] Press 'D' → Developer view
- [ ] Press 'B' → Buyer view
- [ ] Press 'C' → Nothing happens (correct)
- [ ] No console errors

**If broken**: `git checkout ui/intercompany/perspective-toggle.js`

**PHASE 2 COMMIT**: `git commit -am "feat: remove Combined tab from perspective toggle"`

---

## PHASE 3: REMOVE COMBINED RENDERING

### Session 3.1: Remove combined case from switch statement
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/results-display.js`
**Lines**: 31-34

**Change**:
- [ ] Delete `case 'combined':` and its body
- [ ] Ensure default falls through to developer

New switch should be:
```javascript
switch (perspective) {
    case 'developer':
        renderDeveloperPerspective(container, results);
        break;
    case 'buyer':
        renderBuyerPerspective(container, results);
        break;
    default:
        renderDeveloperPerspective(container, results);
        break;
}
```

**Post-check**:
- [ ] Browser refresh
- [ ] Developer view renders
- [ ] Buyer view renders when selected
- [ ] No console errors

**If broken**: `git checkout ui/intercompany/results-display.js`

---

### Session 3.2: Delete renderCombinedPerspective function
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/results-display.js`
**Lines**: 249-397 (entire function, ~150 lines)

**Pre-check**:
- [ ] Confirm function is no longer called (from Session 3.1)

**Change**:
- [ ] Delete entire function `renderCombinedPerspective`

**Post-check**:
- [ ] Browser refresh
- [ ] Developer view renders
- [ ] Buyer view renders
- [ ] No console errors

**If broken**: `git checkout ui/intercompany/results-display.js`

**PHASE 3 COMMIT**: `git commit -am "feat: remove Combined perspective rendering"`

---

## PHASE 4: REMOVE COMBINED FROM MODEL CALCULATIONS

### Session 4.1: Model 1 - Remove combined calculation
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/model-1-cost-plus.js`

**Changes (3 parts)**:
1. Delete line ~304: `const combined = calculateCombinedPerspective(developer, buyer, entityConfig);`
2. Delete from return object: `combined,`
3. Delete entire function `calculateCombinedPerspective` (lines ~480-519)

**Post-check**:
- [ ] Browser: Model 1, any variant calculates without error
- [ ] Developer/Buyer views work

**If broken**: `git checkout models/intercompany/model-1-cost-plus.js`

---

### Session 4.2: Model 2 - Remove combined calculation
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/model-2-licence-royalties.js`

**Changes**: Same pattern as 4.1
1. Delete `const combined = calculateCombinedPerspective(...)` line
2. Delete `combined,` from return object
3. Delete entire `calculateCombinedPerspective` function

**Post-check**:
- [ ] Browser: Model 2 calculates without error

**If broken**: `git checkout models/intercompany/model-2-licence-royalties.js`

---

### Session 4.3: Model 3 - Remove combined calculation
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/model-3-joint-development.js`

**Changes**: Same pattern as 4.1-4.2

**If broken**: `git checkout models/intercompany/model-3-joint-development.js`

---

### Session 4.4: Model 4 - Remove combined calculation
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/model-4-bot.js`

**Changes**: Same pattern

**If broken**: `git checkout models/intercompany/model-4-bot.js`

---

### Session 4.5: Model 5 - Remove combined calculation
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/model-5-software-sale.js`

**Changes**: Same pattern

**If broken**: `git checkout models/intercompany/model-5-software-sale.js`

---

### Session 4.6: Model 6 - Remove combined calculation
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/model-6-saas-subscription.js`

**Changes**: Same pattern

**If broken**: `git checkout models/intercompany/model-6-saas-subscription.js`

**PHASE 4 COMMIT**: `git commit -am "feat: remove combined calculations from all 6 models"`

---

## PHASE 5: CLEAN UP COMPARISON FEATURES

### Session 5.1: comparison-view.js - Remove combined columns
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/comparison-view.js`
**Target**: Lines around 756-760 with `combined.groupTaxCost`, etc.

**Change**:
- [ ] Remove metric definitions that reference `combined.*`
- [ ] Keep only developer and buyer metrics

**Post-check**:
- [ ] Save 2 options, compare them
- [ ] Comparison view shows Developer/Buyer metrics only

---

### Session 5.2: comparison-manager.js - Remove combined references
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/comparison-manager.js`

**Change**:
- [ ] Remove any `combined.cashFlow.netCashFlow` references
- [ ] Update card display

**Post-check**:
- [ ] Saved options panel displays correctly

---

### Session 5.3: storage.js - Remove groupTaxCost
**Status**: [ ] NOT STARTED
**File**: `utils/storage.js`

**Change**:
- [ ] Remove `groupTaxCost` from saved data structure

**Post-check**:
- [ ] Save/Load still works

---

### Session 5.4: diff-view.js - Remove combined references
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/diff-view.js`

**Change**:
- [ ] Remove any combined metric comparisons

**Post-check**:
- [ ] "What Changed" feature works

**PHASE 5 COMMIT**: `git commit -am "feat: remove combined from comparison features"`

---

## PHASE 6: CLEAN UP SENSITIVITY & PROJECTIONS

### Session 6.1: sensitivity-visualizations.js
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/sensitivity-visualizations.js`

**Change**:
- [ ] Remove `combined.totalValue` reference (line ~248)

---

### Session 6.2: projection-visualizations.js
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/projection-visualizations.js`

**Change**:
- [ ] Remove "Group NPV", "Group IRR" displays (lines ~305-313)
- [ ] Update to show Developer/Buyer separately

---

### Session 6.3: growth-projections.js (backend)
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/growth-projections.js`

**Change**:
- [ ] Remove `totalGroupProfit` calculations
- [ ] Remove combined projection logic

---

### Session 6.4: sensitivity-analysis.js (backend)
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/sensitivity-analysis.js`

**Change**:
- [ ] Remove any combined scenario logic

**PHASE 6 COMMIT**: `git commit -am "feat: remove combined from sensitivity and projections"`

---

## PHASE 7: CLEAN UP COMPLIANCE & VISUALIZATIONS

### Session 7.1: compliance-analyzer.js (UI)
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/compliance-analyzer.js`

**Change**:
- [ ] Remove "Group Net Tax", "effectiveGroupRate" displays (lines ~617-622)

---

### Session 7.2: compliance-analyzer.js (backend)
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/compliance-analyzer.js`

**Change**:
- [ ] Remove `groupNetTaxCost`, `effectiveGroupRate` calculations (lines ~773-789)

---

### Session 7.3: advanced-visualizations.js (backend)
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/advanced-visualizations.js`

**Change**:
- [ ] Remove 'combined' color (line ~26)
- [ ] Remove "Group Net Position" chart (line ~375)

---

### Session 7.4: structure-selector.js
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/structure-selector.js`

**Change**:
- [ ] Remove question about "consolidated for group reporting" (lines ~155-156)

**PHASE 7 COMMIT**: `git commit -am "feat: remove group terminology from compliance and charts"`

---

## PHASE 8: CLEAN UP ENTITY CONFIG & REGISTRY

### Session 8.1: registry.js - Remove consolidation flags
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/registry.js`

**Change**:
- [ ] Remove `sameGroup`, `consolidationRequired` from DEFAULT_ENTITY_CONFIG (line ~337)
- [ ] Keep `relatedParties` for TP warnings

---

### Session 8.2: entity-config.js - Remove any group references
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/entity-config.js`

**Change**:
- [ ] Remove any consolidation-related UI

**PHASE 8 COMMIT**: `git commit -am "chore: clean up entity configuration"`

---

## PHASE 9: UPDATE USER-FACING TEXT

### Session 9.1: index.html - Rename "Inter-Company Tool"
**Status**: [ ] NOT STARTED
**File**: `index.html`

**Change**:
- [ ] Change mode button text from "Inter-Company Tool" to "Transaction Tool"
- [ ] Update meta descriptions
- [ ] Change section headers

---

### Session 9.2: testing-utilities.js - Fix test scenarios
**Status**: [ ] NOT STARTED
**File**: `models/intercompany/testing-utilities.js`

**Change**:
- [ ] Remove "group company" scenarios (line ~313)
- [ ] Update to independent party framing

---

### Session 9.3: party-selector.js - Remove shareholder references
**Status**: [ ] NOT STARTED
**File**: `ui/intercompany/party-selector.js`

**Change**:
- [ ] Remove `isShareholderPerspectiveAvailable()` function (line ~205)
- [ ] Clean up any "shareholder" text

**PHASE 9 COMMIT**: `git commit -am "feat: update user-facing terminology"`

---

## PHASE 10: DOCUMENTATION

### Session 10.1: CLAUDE.md
**Status**: [ ] NOT STARTED
**File**: `CLAUDE.md`

**Change**:
- [ ] Update architecture docs
- [ ] Remove Combined/Shareholder references
- [ ] Update perspective framework section

---

### Session 10.2: BUSINESS_GUIDE.md
**Status**: [ ] NOT STARTED
**File**: `docs/BUSINESS_GUIDE.md`

**Change**:
- [ ] Update user guide
- [ ] Remove group terminology

---

### Session 10.3: MANUAL_TESTING_GUIDE.md
**Status**: [ ] NOT STARTED
**File**: `docs/MANUAL_TESTING_GUIDE.md`

**Change**:
- [ ] Update testing scenarios
- [ ] Remove Combined perspective tests

**PHASE 10 COMMIT**: `git commit -am "docs: update documentation for two-entity model"`

---

## FINAL VERIFICATION CHECKLIST

After ALL phases complete:

- [ ] App loads without console errors
- [ ] Mode 1 (Pricing Calculator) unaffected
- [ ] Mode 2 shows only Developer + Buyer perspectives
- [ ] Perspective toggle has 2 tabs only
- [ ] All 6 models calculate correctly
- [ ] All 47 variants work
- [ ] Compare Mode works (save, load, compare)
- [ ] Sensitivity Analysis works
- [ ] Growth Projections works
- [ ] Compliance Analyzer works
- [ ] Export/Import works
- [ ] No "group", "combined", "shareholder" text visible to users

**Search verification**:
```bash
grep -r "combined" --include="*.js" | grep -v node_modules | wc -l
# Should be minimal/zero in UI-facing code
```

---

## FINAL PUSH

```bash
git push -u origin claude/review-claude-md-H5Xhp
```

---

## PROGRESS TRACKING

| Phase | Sessions | Status |
|-------|----------|--------|
| Phase 0: Preparation | 1 | NOT STARTED |
| Phase 1: Default Perspective | 2 | NOT STARTED |
| Phase 2: Perspective Toggle | 2 | NOT STARTED |
| Phase 3: Combined Rendering | 2 | NOT STARTED |
| Phase 4: Model Calculations | 6 | NOT STARTED |
| Phase 5: Comparison Features | 4 | NOT STARTED |
| Phase 6: Sensitivity & Projections | 4 | NOT STARTED |
| Phase 7: Compliance & Visualizations | 4 | NOT STARTED |
| Phase 8: Entity Config | 2 | NOT STARTED |
| Phase 9: User-Facing Text | 3 | NOT STARTED |
| Phase 10: Documentation | 3 | NOT STARTED |
| **TOTAL** | **32** | **NOT STARTED** |

---

## NOTES FOR FUTURE SESSIONS

When resuming this work:
1. Read this file first
2. Find the first session marked `[ ] NOT STARTED`
3. Execute that session's steps exactly
4. Update the status to `[x] COMPLETED` or note what went wrong
5. Commit and push progress

If something breaks:
1. Don't panic
2. Use rollback commands above
3. Document what went wrong in this file
4. Try again or ask for help
