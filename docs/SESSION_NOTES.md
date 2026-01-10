# Session Notes

> Context and progress notes to preserve between sessions

## Current Session

**Date:** 2026-01-10

**Task:** Complete removal of Combined/Shareholder/Net Effect references

**What was done:**
- Audited codebase for remaining intercompany/related party/consolidation references
- Removed `combined` perspective fallbacks and projections from code
- Removed `consolidation` fields from all 6 model files
- Updated documentation (README, BUSINESS_GUIDE, model concept docs)
- Removed Shareholder Perspective sections from model docs
- Added folder renaming to TODO.md as low-priority technical debt
- Updated HISTORY.md and CLAUDE.md with changes

**Files Modified:** 24+ files across models, UI, and docs

**Status:** Complete - all user-facing references removed

**Technical Debt Noted:**
- Folder naming (`models/intercompany/`, `ui/intercompany/`) is legacy - see TODO.md

## Previous Sessions

<!-- Move notes here when starting a new session, keep if still relevant -->

