# User Actions Required

> **Purpose**: Track manual actions the user needs to perform outside the codebase (external dashboards, credentials, configuration, etc.)
> **Last Updated**: January 2026

This file documents any manual steps that require user intervention. AI assistants should add detailed instructions here when tasks cannot be completed programmatically.

---

## Pending Actions

### Approve build scripts (esbuild, svelte-preprocess)
**Added**: April 28, 2026
**Priority**: Low
**Context**: pnpm v10 ignores postinstall build scripts by default for security. Two transitive dependencies — `esbuild@0.21.5` and `svelte-preprocess@5.1.4` — emit a warning on every `pnpm install` that their build scripts were skipped. Builds work fine in this state; the warning is cosmetic. To silence it, approve them once.

#### Steps:
1. From the repository root, run:
   ```
   pnpm approve-builds
   ```
2. In the interactive list, select `esbuild` and `svelte-preprocess` (and any others you want to allow).
3. Commit the resulting `package.json` change (an `onlyBuiltDependencies` entry is recorded there).

#### Verification:
- Re-run `pnpm install`. The "Ignored build scripts" warning should be gone.

#### Notes:
- This is purely a developer-experience cleanup. The app builds and runs correctly without it.
- The repo root already lists `sharp` under `pnpm.onlyBuiltDependencies` for the icon-generation script.

---

## Completed Actions

*Actions move here once completed, with date and any relevant notes.*

---

## Template for New Actions

When adding a new action, use this format:

```markdown
### [Action Title]
**Added**: [Date]
**Priority**: [High/Medium/Low]
**Context**: [Why this action is needed]

#### Steps:
1. Step one
2. Step two
3. Step three

#### Verification:
- How to confirm the action was completed successfully

#### Notes:
- Any additional context or considerations
```
