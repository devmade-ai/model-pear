# TODO

> Lower priority items and improvements to capture between sessions

## Backlog

### Technical Debt: Rename "intercompany" folders
**Priority**: Low
**Effort**: Medium (30+ files)

The folders `models/intercompany/` and `ui/intercompany/` use legacy naming from when the tool was focused on inter-company transactions. The tool now works for ANY client (related or unrelated), so the naming is inconsistent with the scope.

**Why it's low priority**: Folder names are internal - users never see them. All user-facing "intercompany" references have been removed.

**If tackled**:
- Rename `models/intercompany/` → `models/transactions/`
- Rename `ui/intercompany/` → `ui/transactions/`
- Update all import paths (~30+ files)
- Update HTML element IDs (e.g., `intercompanyCalculatorSection`)
- Update CSS classes (e.g., `.intercompany-input-help`)
- Update state property name `state.intercompany` → `state.transactions`

---

## Completed

### Refactor: Remove Combined/Group Perspective
**Completed**: January 10, 2026
**Effort**: 10 phases

Simplified to two perspectives (Developer + Buyer). Removed ~600+ lines of combined/group accounting code. See HISTORY.md for details.

---

## Ideas

<!-- Potential improvements or features to consider -->

