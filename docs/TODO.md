# TODO

> Lower priority items and improvements to capture between sessions

## Backlog

### Refactor: Remove Combined/Group Perspective
**Priority**: Medium
**Effort**: ~32 sessions (10 phases)
**Status**: Not started

**Goal**: Simplify to two independent entities only (Developer + Buyer). Remove all combined view, group calculations, and consolidation logic.

**Why**: The tool's language incorrectly frames it as "group accounting" when it's actually for a software company working with ANY client. The "Combined" perspective is misleading.

**Key phases**:
1. Change default perspective to Developer
2. Remove Combined from perspective toggle
3. Remove Combined rendering code
4. Remove Combined from all 6 model calculations
5. Clean up comparison features
6. Clean up sensitivity & projections
7. Clean up compliance & visualizations
8. Clean up entity config & registry
9. Update user-facing text
10. Update documentation

**Detailed plan**: See `docs/REFACTOR_PLAN_REMOVE_COMBINED.md` for step-by-step instructions with rollback commands.

---

## Ideas

<!-- Potential improvements or features to consider -->

