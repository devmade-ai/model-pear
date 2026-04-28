# READ AND FOLLOW THE PROCESS, PRINCIPLES, COMMUNICATION, CODE STANDARDS, DOCUMENTATION, AI NOTES, TRIGGERS, AND PROHIBITIONS EVERY TIME

## Process

1. **Read these preferences first**
2. **Gather context from documentation** (CLAUDE.md, SESSION_NOTES.md, TODO.md, relevant docs/)
3. **Then proceed with the task**

### REMINDER: READ AND FOLLOW THE PROCESS EVERY TIME

## Principles

1. **User-first design** - Align with how real people will use the tool (top priority)
2. **Simplicity** - Simple flow, clear guidance, non-overwhelming visuals, accurate interpretation
3. **Document WHY** - Explain decisions and how they align with tool goals
4. **Testability** - Ensure correctness and alignment with usage goals can be verified
5. **Know the purpose** - Always be aware of what the tool is for
6. **Follow conventions** - Best practices and consistent patterns
7. **Repeatable process** - Follow consistent steps to ensure all the above
8. **Preserve session context** - Update SESSION_NOTES.md after each significant task (not at the end - sessions can end abruptly)
9. **Capture ideas** - Add lower priority items and improvements to TODO.md so they persist between sessions
10. **Document user actions** - When manual user action is required (external dashboards, credentials, etc.), add detailed instructions to docs/USER_ACTIONS.md

### REMINDER: READ AND FOLLOW THE PRINCIPLES EVERY TIME

---

## Communication

Respond as if talking to yourself. Peer-to-peer, no servility.

- **Direct.** No filler, no preamble, no conversational padding. State facts and actions.
- **No sycophancy.** No "great question", "you're absolutely right", "excellent point". Acknowledge errors briefly and move on.
- **No hedging.** Commit to a position. "I think" / "perhaps" only when genuinely uncertain.
- **Proper solutions only.** Always suggest the right fix, not a quick hack. If the proper solution is complex, explain why the shortcut is wrong and lay out the real approach.
- **Work, not process.** Only discuss work that can be done and work that is done. Never opine on branching, pull requests, git history editing, commit granularity, development process, or code review flow — those are the user's domain and must never influence how you execute a task. If you notice a process concern, keep it to yourself and get on with the work.
- **Ask before assuming.** When a user reports a bug or makes a request, ask clarifying questions until you are certain you understand the requirement. Don't guess the cause and build a fix on an assumption — one wrong assumption wastes multiple commits.
- **Always ask at least one question before starting work.** This is the minimum bar. Even when the request seems clear, verify scope, constraints, or intent before writing code.
- **Concrete options.** When clarification is needed, list numbered options — never open-ended questions.
- **Assume competence.** The reader is a developer. Don't over-explain basics.
- **Push back.** Disagree when warranted. State your view first, then ask if they want to proceed differently.

### REMINDER: READ AND FOLLOW THE COMMUNICATION RULES EVERY TIME

---

## Code Standards

These rules are non-negotiable. Stop and ask before proceeding if any rule would be violated.

### Before Making Changes

- [ ] Read relevant existing code and documentation first
- [ ] Read SESSION_NOTES.md for current state and context
- [ ] Check TODO.md for pending items
- [ ] Ask clarifying questions if scope, approach, or intent is unclear
- [ ] Confirm understanding before implementing non-trivial changes
- [ ] Never assume - when in doubt, ask

### Best Practices

- [ ] Follow established patterns and conventions in the codebase
- [ ] Use industry-standard solutions over custom implementations when available
- [ ] Apply SOLID principles, DRY, and separation of concerns
- [ ] Prefer well-maintained, widely-adopted libraries over obscure alternatives
- [ ] Follow security best practices (input validation, sanitization, principle of least privilege)
- [ ] Handle errors gracefully with meaningful messages
- [ ] Write self-documenting code with clear naming

### Code Organization

- [ ] Prefer smaller, focused files and functions
- [ ] Pause and consider extraction at: 500 lines (file), 100 lines (function), 400 lines (class)
- [ ] Strongly consider refactoring at: 800+ lines (file), 150+ lines (function), 600+ lines (class)
- [ ] Extract reusable logic into separate modules/files immediately
- [ ] Group related functionality into logical directories
- [ ] Split large classes into smaller, focused classes when responsibilities diverge

### Decision Documentation in Code

Every non-trivial code change must include comments explaining:
- **What** was the requirement or instruction
- **Why** this approach was chosen
- **What alternatives** were considered and why they were rejected

Example:
```typescript
// Requirement: Calculate NPV for multi-year projections
// Approach: Newton-Raphson method for IRR, standard DCF for NPV
// Alternatives considered:
//   - Simple payback: Rejected - doesn't account for time value of money
//   - Excel-style XIRR: Rejected - irregular dates not needed, adds complexity
//   - Bisection method: Rejected - slower convergence than Newton-Raphson
function calculateIRR(cashFlows: number[]): number {
    ...
}
```

### User Experience (CRITICAL)

Assume all end users are non-technical. This is non-negotiable.

- [ ] UI must be intuitive without instructions
- [ ] Use plain language - no jargon, technical terms, or developer-speak
- [ ] Error messages must tell users what went wrong AND what to do next, in simple terms
- [ ] Labels, buttons, and instructions should be clear to someone unfamiliar with the domain
- [ ] Prioritize clarity over brevity in user-facing text
- [ ] Confirm destructive actions with clear consequences explained
- [ ] Provide feedback for all user actions (loading states, success confirmations, etc.)
- [ ] Design for the least technical person who will use this

Bad: "Error 500: Internal server exception"
Good: "Something went wrong on our end. Please try again, or contact support if this continues."

Bad: "Invalid input format"
Good: "Please enter your phone number as 10 digits, like 0821234567"

### Frontend: Styles and Scripts

- [ ] Never write inline CSS or JS (Tailwind utility classes are acceptable)
- [ ] All custom styles must be in dedicated stylesheet files
- [ ] Use CSS variables for theming (colors, spacing, typography)
- [ ] Separate component styles into individual files when component is created

### Where Documentation Lives

- [ ] Update relevant documentation with every code change
- [ ] All documentation lives in `/docs` directory
- [ ] Plans, notes, and scratch files go in `/docs/working`
- [ ] Never write docs or plans to root directory or random locations
- [ ] Keep docs updated immediately - update right after each change, before moving to the next task (sessions can end abruptly)

### Cleanup

- [ ] Remove all temporary files after implementation is complete
- [ ] Delete unused imports, variables, and dead code immediately
- [ ] Remove commented-out code unless explicitly marked `// KEEP:` with reason
- [ ] Clean up console.log/print statements before marking work complete
- [ ] Clean up completed or obsolete docs/files and remove references to them

### Timer and Subscription Cleanup

- Every `setTimeout`/`setInterval`/`addEventListener`/`subscribe` needs a matching cleanup (`clearTimeout`/`clearInterval`/`removeEventListener`/unsubscribe handle).
- Store timer ids in a scope the cleanup can reach. Nested timeouts → array; single-shot → local const or ref.
- In Svelte components: return cleanup from `onMount`, or use `onDestroy`. In plain modules: export a `dispose()` or use `AbortController`.
- HMR-safe: guard global listener attachment behind a `window.__<featureName>Attached` flag so hot-reload doesn't double-subscribe. For Vite, also release listeners via `import.meta.hot.dispose()`.
- See [`docs/implementations/TIMER_LEAKS.md`](docs/implementations/TIMER_LEAKS.md) in glow-props for concrete patterns (nested-timeout array, AbortController, per-effect dispose, HMR guard).

### Quality Checks

During every change, actively scan for:
- [ ] Error handling gaps
- [ ] Edge cases not covered
- [ ] Inconsistent naming
- [ ] Code duplication that should be extracted
- [ ] Missing input validation at boundaries
- [ ] Security concerns (XSS via {@html}, unsanitized user input)
- [ ] Performance issues (unnecessary reactivity, large re-computations, missing keys)

Report findings even if not directly related to current task.

### After Each Significant Task

- [ ] Update SESSION_NOTES.md with current state
- [ ] Update relevant docs (CALCULATIONS.md, BUSINESS_GUIDE.md, etc.)
- [ ] Commit changes (code + docs together)

### Commit Message Format

All commits must include metadata footers:

```
type(scope): subject

Body explaining why.

Tags: tag1, tag2, tag3
Complexity: 1-5
Urgency: 1-5
Impact: internal|user-facing|infrastructure|api
Risk: low|medium|high
Debt: added|paid|neutral
Epic: feature-name
Semver: patch|minor|major
```

**Tags:** Use descriptive tags relevant to the change (e.g., docs, calculator, ui, models, tests, config)
**Complexity:** 1=trivial, 2=small, 3=medium, 4=large, 5=major rewrite
**Urgency:** 1=planned, 2=normal, 3=elevated, 4=urgent, 5=critical
**Impact:** internal, user-facing, infrastructure, or api
**Risk:** low=safe change, medium=could break things, high=touches critical paths
**Debt:** added=introduced shortcuts, paid=cleaned up debt, neutral=neither
**Epic:** groups related commits under one feature/initiative name
**Semver:** patch=bugfix, minor=new feature, major=breaking change

These footers are required on every commit. No exceptions.

### Before Each Commit

- [ ] Relevant docs updated for changes in this commit
- [ ] SESSION_NOTES.md reflects current state
- [ ] Commit message is clear and descriptive

### Before Each Push

- [ ] All commits include their related doc updates
- [ ] SESSION_NOTES.md is current (in case session ends)
- [ ] No work-in-progress that would be lost

### Before Compact

- [ ] SESSION_NOTES.md updated with full context needed to continue after summary:
  - What's being worked on?
  - Current state of the work?
  - What's left to do?
  - Any decisions or blockers?
  - Key details that shouldn't be lost in the summary

### REMINDER: READ AND FOLLOW THE CODE STANDARDS EVERY TIME

---

## AI Notes

<!-- Reminders and learnings for AI assistants - add to this as needed -->

- Always read a file before attempting to edit it
- Check for existing patterns in the codebase before creating new ones
- Commit and push changes before ending a session
- Clean up completed or obsolete docs/files and remove references to them
- **Always read files before editing.** Use the Read tool on every file before attempting to Edit it. Editing without reading first will fail.
- Check docs/AI_MISTAKES.md at session start and log new mistakes as they occur
- **Trigger name vs. local identifier collisions.** Several single-word triggers in `## Triggers` collide with local names in this repo: `clean` (npm script `pnpm clean`), `tests` (folder `packages/calculator/tests`), `docs` (folder `docs/`), `config` (folder `apps/web/src/lib/config/`), `types` (folder `packages/calculator/src/types`). When the user types one of these as a bare command at the start of a turn, treat it as a trigger invocation. When the same word appears as part of a shell command, file path, or sentence, treat it literally. If genuinely ambiguous, ask which is meant.
- **Claude Code mobile/web — accessing sibling repos:**
  - Use `GITHUB_ALL_REPO_TOKEN` with the GitHub API (`api.github.com/repos/devmade-ai/{repo}/contents/{path}`) to read files from other devmade-ai repos
  - Use `$(printenv GITHUB_ALL_REPO_TOKEN)` not `$GITHUB_ALL_REPO_TOKEN` to avoid shell expansion issues
  - Never clone sibling repos — use the API instead

- **Implementation patterns — always fetch from glow-props.** Never look for local copies of implementation pattern files (e.g., `docs/implementations/*.md`) in downstream repos. They do not exist locally — the single source of truth is the `docs/implementations/` folder in the glow-props repo. Fetch the latest version before every implementation task.

### REMINDER: READ AND FOLLOW THE AI NOTES EVERY TIME

---

## Documentation

**AI assistants automatically maintain these documents.** Update them as you work — don't wait for the user to ask. This ensures context is always current for the next session.

**Git log is the changelog.** Don't create or maintain a separate `CHANGELOG.md` / `HISTORY.md`. To answer "when did X land / why was Y done that way", use `git log -S '<symbol>'`, `git log -- <path>`, or `git log --all --oneline | grep`.

### `CLAUDE.md`

**Purpose:** AI preferences, project overview, architecture, key state structures.
**When to read:** At the start of every session, before doing any work.
**When to update:** When project architecture changes, state structure changes, or preferences evolve.
**What to include:**

- Process, Principles, AI Notes: Update when learning new patterns or preferences
- Project Status: Current working features (bullet list)
- Architecture: File structure with brief descriptions
- Key State Structure: Important state shapes with comments
- Any section that becomes outdated after feature changes

**Why:** This is the primary context for AI assistants. Accurate info here prevents mistakes.

### `docs/SESSION_NOTES.md`

**Purpose:** Compact context summary for session continuity (like `/compact` output).
**When to read:** At the start of a session to quickly understand what was done previously.
**When to update:** Rewrite at session end with a fresh summary. Clear previous content.
**What to include:**

- **Worked on:** Brief description of focus area
- **Accomplished:** Bullet list of completions
- **Current state:** Where things stand (working/broken/in-progress)
- **Key context:** Important info the next session needs to know

**Why:** Enables quick resumption without re-reading entire codebase. Not a changelog — a snapshot.

### `docs/TODO.md`

**Purpose:** AI-managed backlog of ideas and potential improvements.
**When to read:** When looking for work to do, or when the user asks about pending tasks.
**When to update:** When noticing potential improvements. Delete completed items (git history tracks them).
**What to include:**

- Group by category (Features, UX, Technical, etc.)
- Short items: `- [ ]` checkbox bullet
- Larger items (those needing problem/solution context, rationale, mock-ups): `### Heading` followed by `**Priority**: …` and a body
- Brief description of what and why
- When complete, delete (git history tracks what was done)

**Why:** User reviews this to prioritize work. Keeps TODO focused on pending items only.

### `docs/USER_ACTIONS.md`

**Purpose:** Manual actions requiring user intervention outside the codebase.
**When to read:** When something requires manual user intervention (deployments, API keys, external config).
**When to update:** When tasks need external action. Clear when completed.
**What to include:**

- Action title and description
- Why it's needed
- Steps to complete
- Keep empty when nothing pending (with placeholder text)

**Why:** Some tasks require credentials, dashboards, or manual config the AI can't do.

### `docs/AI_MISTAKES.md`

**Purpose:** Record significant AI mistakes and learnings to prevent repetition.
**When to read:** When starting a session, to avoid repeating past mistakes.
**When to update:** After making a mistake that wasted time or broke things.
**What to include:**

- What went wrong
- Why it happened
- How to prevent it
- Date (for context)

**Why:** AI assistants repeat mistakes across sessions. This document builds institutional memory.

### `docs/README.md`

**Purpose:** User-facing guide for the application.
**When to read:** When you need a quick overview of what the tool does and its main features.
**When to update:** When features change that affect how users interact with the tool.
**What to include:**

- What the tool does (overview)
- Current features (keep in sync with actual functionality)
- How to use each feature (user guide)
- Getting started / installation
- Tech stack and deployment info

**Why:** Users and contributors read this first. Must accurately reflect the current state.

### `docs/BUSINESS_GUIDE.md` (serves as User Guide)

**Purpose:** Comprehensive user documentation explaining how to use every feature.
**When to read:** When you need to understand what users can do with the tool, or how a feature is supposed to work from the user's perspective.
**When to update:** When adding new features, changing UI workflows, or modifying how existing features work.
**What to include:**

- Mode-by-mode walkthrough of the interface
- Explanation of every control and what it does
- Workflow tips and best practices
- Organized by user tasks, not technical implementation

**Why:** Serves as the authoritative reference for user-facing behavior. Helps ensure AI assistants understand the user experience.

### `docs/TESTING_GUIDE.md`

**Purpose:** Manual test scenarios for verifying the application works correctly.
**When to read:** Before testing changes, or when you need to verify specific functionality works.
**When to update:** When adding new features that need test coverage, or when existing tests become outdated.
**What to include:**

- Step-by-step test scenarios with exact actions
- Where to click/look for each step
- Expected results for each action
- Regression checklist for quick verification

**Why:** Ensures consistent, thorough testing. Prevents regressions by documenting what to verify after changes.

### REMINDER: READ AND FOLLOW THE DOCUMENTATION EVERY TIME

---

## Testing

- Write tests for critical paths and core business logic
- Test error handling and edge cases for critical functions
- Tests are not required for trivial getters/setters or UI-only code
- Run existing tests before and after changes (`pnpm test`)

---

## Implementation Patterns (Source of Truth)

All implementation patterns live in the **glow-props** repo and are the single source of truth for all devmade-ai projects.

**Source location:** `docs/implementations/` in the glow-props repo

**How to access from any repo:**
- Fetch via GitHub Pages: `curl -sf "https://devmade-ai.github.io/glow-props/patterns/{PATTERN_NAME}.md"`
- Fetch via GitHub API: `curl -sf -H "Authorization: token $(printenv GITHUB_ALL_REPO_TOKEN)" "https://api.github.com/repos/devmade-ai/glow-props/contents/docs/implementations/{PATTERN_NAME}.md" | jq -r .content | base64 -d`
- To list all available patterns: `curl -sf -H "Authorization: token $(printenv GITHUB_ALL_REPO_TOKEN)" "https://api.github.com/repos/devmade-ai/glow-props/contents/docs/implementations" | jq -r '.[].name'`

**Rules:**
- **Always fetch the latest version** from glow-props before implementing — patterns are continuously improved
- **Never create local copies** of implementation pattern files in downstream repos
- **Do not hardcode a list of patterns** — scan the source folder to discover what's available
- The set of patterns grows over time; always check the source for new additions

---

## Project-Specific Configuration

### Paths
```
DOCS_PATH=/docs
WORKING_DOCS_PATH=/docs/working
COMPONENTS_PATH=apps/web/src/lib/components
STYLES_PATH=apps/web/src/app.css
TESTS_PATH=packages/calculator/tests
E2E_TESTS_PATH=apps/web/tests/e2e
```

### Stack
```
LANGUAGE=TypeScript
FRAMEWORK=SvelteKit 2.x
STYLING=Tailwind CSS
CHARTS=ApexCharts
TEST_RUNNER=Vitest (unit), Playwright (E2E)
PACKAGE_MANAGER=pnpm
HOSTING=Vercel
```

### Conventions
```
NAMING_CONVENTION=camelCase
FILE_NAMING=camelCase (TS), PascalCase (Svelte components)
COMPONENT_STRUCTURE=feature-based (routes/ for pages, lib/components/ for shared)
```

### Build Commands
```bash
pnpm install          # Install dependencies
pnpm test             # Run calculator tests (301 tests)
pnpm build            # Build all packages
pnpm dev              # Start dev server (apps/web)
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run Playwright with UI
pnpm generate-icons   # Regenerate PNGs from assets/icon-source.svg
```

---

## Workflow

1. **Receive task** - Ask clarifying questions if needed
2. **Gather context** - Read CLAUDE.md, SESSION_NOTES.md, TODO.md, relevant code
3. **Plan** - Write plan to `/docs/working` if task is non-trivial
4. **Implement** - Follow all hard rules above
5. **Verify** - Run tests, check for errors, review cleanup
6. **Document** - Update all affected documentation (SESSION_NOTES.md, etc.)
7. **Report** - Summarize changes and any issues found

---

## Prohibitions

Never:
- Start implementation without understanding full scope
- Create files outside established project structure
- Leave TODO comments in code without tracking them in `docs/TODO.md`
- Ignore errors or warnings in build/console output
- Make "while I'm here" changes without asking first
- Use placeholder data that looks like real data
- Skip error handling "for now"
- Write code without decision context comments (for non-trivial changes)
- Modify default values without business justification
- Add features without updating documentation
- Remove features during "cleanup" without checking if they're documented as intentional (see AI_MISTAKES.md)
- Proceed with assumptions when a single clarifying question would prevent a wrong commit
- Use interactive input prompts or selection UIs — list options as numbered text instead
- Create local copies of implementation pattern files in any repo — always fetch from glow-props

### REMINDER: READ AND FOLLOW THE PROHIBITIONS EVERY TIME

---

## Triggers

Commands that invoke focused analysis passes. Each trigger is a single perspective — what you'd notice that the others wouldn't.

### How to invoke

- **One perspective** — type the trigger name or its alias (e.g. `bugs`, `sec`, `a11y`).
- **A group** — type the group name (e.g. `correctness`, `frontend`, `ops`).
- **Everything** — type `all`.
- **Meta sweep** — type `quick`, `ship`, or `risk` for pre-curated bundles.

### Scope modifiers (suffix any trigger)

- *(none)* — whole codebase.
- `branch` — diff against the branch's base (default: `main`).
- `branch <base>` — diff against a specified base.
- `staged` — staged changes only.
- `file <path>` — single file.

Examples:
- `bugs` — bugs check across the whole codebase.
- `bugs branch` — bugs check on the current branch's diff vs main.
- `correctness branch main` — every correctness trigger against the branch diff.
- `all staged` — every applicable trigger against staged files.

### Behavior rules

- One trigger pass per response. Never combine.
- Findings are numbered text — never interactive prompts or selection UIs.
- After each pass, pause. User responds with `fix` / `skip` / `stop`:
  - `fix` — apply the suggested fixes for this trigger, then move on.
  - `skip` — skip this trigger's findings and move on.
  - `stop` — end the sweep entirely.
- Groups, meta sweeps, and `all` run triggers sequentially in table order, pausing after each.
- If a trigger doesn't apply to this repo (e.g. `database` on a static site), report "N/A for this repo" and move on.

### Correctness — group `correctness`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 1 | `bugs` | `bug` | Logic errors, off-by-ones, null/undefined paths, wrong default branches, stale assumptions |
| 2 | `errors` | `err` | Missing try/catch, swallowed failures, unhelpful error surfaces to user and dev |
| 3 | `race` | `rac` | Concurrency, stale closures, async ordering, event leaks, double-fire guards |
| 4 | `types` | `typ` | `any`/`as` abuse, unsafe casts, missing generics, runtime-vs-compile-time gaps |
| 5 | `edges` | `edg` | Empty/null/zero/max/unicode/timezone boundary cases; 0-item, 1-item, 10k-item behavior |

### Security / trust — group `trust`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 6 | `security` | `sec` | Injection, XSS, CSRF, auth gaps, insecure defaults, exposed secrets in code or bundle |
| 7 | `privacy` | `pri` | PII flow, redaction, retention, client-side data leaks, telemetry overreach |
| 8 | `supply-chain` | `sup` | Dep integrity, lockfile drift, postinstall hooks, third-party scripts |

### Performance — group `speed`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 9 | `performance` | `perf` | Render loops, expensive ops in hot paths, memory leaks, large re-computations |
| 10 | `network` | `net` | Request count, caching, batching, waterfalls, payload size, compression |
| 11 | `database` | `db` | N+1, missing indexes, transaction scope, lock contention |
| 12 | `bundle` | `bun` | Code splitting, tree-shaking, duplicate deps, blocking resources |

### User-facing — group `frontend`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 13 | `ux` | `ux` | Friction, cognitive load, missing loading/empty/error states, undiscoverable affordances |
| 14 | `a11y` | `a11y` | Keyboard nav, screen reader labels, focus order, contrast, ARIA correctness |
| 15 | `mobile` | `mob` | Touch target size, viewport, safe areas, tap delay, gestures, iOS keyboard handling |
| 16 | `motion` | `mot` | `prefers-reduced-motion` respect, animation jank, 60fps budgets, autoplay, transitions that interrupt screen-reader flow |
| 17 | `forms` | `frm` | Input validation, per-field error states, submit error handling, accessible field labels, paste/autofill behavior, unsaved-changes warnings |
| 18 | `copy` | `cpy` | Microcopy, voice consistency, jargon, error messages users actually see |
| 19 | `i18n` | `i18` | Hardcoded strings, RTL readiness, date/number formatting, pluralization |
| 20 | `dark-mode` | `dm` | Semantic color usage, contrast in both themes, flash-on-load |
| 21 | `visual` | `vis` | Layout/spacing/alignment, visual hierarchy, brand consistency, dark-vs-light visual parity, inconsistent corner radii/shadows/type scale |

### Maintainability — group `quality`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 22 | `clean` | `cln` | Dead code, duplication, commented-out blocks, unused imports/exports, leftover TODOs |
| 23 | `naming` | `nam` | Identifier clarity, consistency with local norms, misleading abbreviations |
| 24 | `patterns` | `pat` | Deviation from established patterns (fleet-wide glow-props or repo-local), reinvented wheels |
| 25 | `docs` | `doc` | Docs ↔ code drift, missing docs on public API, outdated README/CLAUDE.md claims |
| 26 | `doc-cleanup` | `dcl` | Duplicated content across doc files, stale files no longer relevant, orphaned docs nothing references, superseded files that replaced but didn't delete their predecessor, sections still describing removed features |
| 27 | `tests` | `tst` | Coverage gaps on critical paths, flaky patterns, test smells, missing edge-case tests |
| 28 | `complexity` | `cpx` | Function length, nesting depth, cyclomatic complexity hotspots |
| 29 | `hacks` | `hck` | `TODO`/`FIXME`/`HACK`/`XXX` markers, `@ts-ignore`/`@ts-expect-error`, `any` escapes framed as temporary, `setTimeout` for timing fixes, quick patches waiting to be done properly |
| 30 | `simplify` | `smp` | Reinvented framework features, over-engineered abstractions, custom code that could be 1–2 stdlib/library calls, unnecessary layers |
| 31 | `reuse` | `rus` | Custom-vs-stdlib balance: how much is hand-written that shouldn't be; logic that should be extracted for reuse but isn't; abstractions generalized for a single caller; speculative parameters, defensive checks for impossible states, and configurability serving no real need |
| 32 | `back-compat` | `bck` | Orphaned feature flags, deprecated branches with no callers, `legacy*` exports, backcompat shims outliving their purpose, `// kept for compatibility` blocks |
| 33 | `comments` | `cmt` | Code comments against repo rules — WHY not WHAT, no PR-reference rot, no AI narration, no commented-out blocks unless `// KEEP:` annotated |
| 34 | `dx` | `dx` | Developer experience: README/setup clarity, dev-error message quality, source map/stack trace usefulness, debug-surface ergonomics, contribution path friction |
| 35 | `undone` | `und` | Started-but-unfinished work — partial implementations, half-wired features, WIP branches of logic, features only reachable from dev but not production |

### Operational — group `ops`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 36 | `deps` | `dep` | Outdated, unused, vulnerable, license-risky dependencies |
| 37 | `observability` | `obs` | Log coverage, metric hygiene, trace completeness, debug-pill surfaces |
| 38 | `reliability` | `rel` | Retries, timeouts, idempotency, graceful degradation, offline handling |
| 39 | `config` | `cfg` | Env var handling, secret management, config schema drift |
| 40 | `migration` | `mig` | DB migration safety, API versioning, rollback plan, backward compatibility |
| 41 | `ci` | `ci` | Pipeline health, build speed, cache effectiveness, flake rate |
| 42 | `pwa` | `pwa` | Service worker correctness, manifest validity, install prompt handling, update flow, offline behavior, icon cache-busting, standalone-mode quirks |

### Design-level — group `design`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 43 | `architecture` | `arch` | Coupling, layering violations, abstraction leaks, module boundaries |
| 44 | `api` | `api` | Interface consistency, versioning, deprecation, contract clarity |
| 45 | `state` | `sta` | Where state lives, derivation vs storage, single-source-of-truth violations |
| 46 | `data-model` | `dat` | Schema normalization, foreign-key integrity, nullable discipline |

### Fleet alignment — group `fleet`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 47 | `align` | `aln` | Drift between this repo's CLAUDE.md and glow-props CLAUDE.md — missing sections, stale rules, divergent conventions |
| 48 | `pattern-audit` | `pa` | Every glow-props implementation pattern: implemented / partial / missing / deviates — with diff notes for each |

### Meta sweeps

Run multiple triggers sequentially, pausing after each for `fix` / `skip` / `stop`. Organised roughly by cadence — pick the one that matches when you're running it.

| Trigger | Alias | Cadence | What it does |
|---------|-------|---------|--------------|
| `hot` | `h` | pre-commit | `bugs` + `types` + `errors` — fastest sanity check before committing. Pairs well with `hot staged` |
| `quick` | `q` | pre-push | `bugs` + `security` + `a11y` — the "don't ship this" triad |
| `ship` | `shp` | pre-merge | `correctness` + `trust` + `a11y` + `tests` — full pre-merge check |
| `session` | `ses` | end of session | `surface` + `wrap` + `undone` + `skipped` — "what state am I leaving this in?" |
| `tidy` | `tdy` | weekly | `clean` + `doc-cleanup` + `hacks` + `deps` + `undone` + `dx` — maintenance / hygiene sweep |
| `all` | `*` | quarterly | Every applicable trigger across every group, in order |

### Reflective passes

Single-pass, no fan-out to other triggers. Each answers one specific question about the recent work.

| Trigger | Alias | What it does |
|---------|-------|--------------|
| `risk` | `rsk` | Worst-case blast radius analysis on the current change |
| `surface` | `srf` | Reflective pass on recent changes: what was decided, what was assumed, what was skipped, what needs human review |
| `wrap` | `wrp` | Wrap-up pass before moving on — anything to double-check / strengthen / improve, anything discovered / assumed / skipped, anything to cleanup / update / tighten, anything to note / document / clarify |
| `skipped` | `skp` | What was skipped — including issues noticed outside the current changes that were intentionally left alone. Each item: what it is, where, why skipped |
| `assumed` | `asm` | What was assumed — explicit assumptions made during the work, including things treated as out of scope. Each item: the assumption, why it was made, what happens if wrong |
| `approach` | `apr` | Was the fix the best / most proper way? Honest self-review: what shortcuts were taken, what a senior reviewer would flag, what the "proper" version looks like if different |
| `cold` | `cld` | Fresh-eyes branch audit. Re-read CLAUDE.md from scratch. Review every change on the branch as if this were a new session with no prior context — don't privilege the diffs you just made. List all findings with a fix plan per item. Default scope: `branch` |

### REMINDER: READ AND FOLLOW THE TRIGGERS EVERY TIME

---

# Software Transaction Structuring Tool

> **Purpose**: AI assistant context file for the Software Transaction Structuring Tool
> **Last Updated**: March 2026
> **Status**: Active - TypeScript + SvelteKit application with 5 pricing models and 6 transaction models (47 variants)

## System Purpose

This tool helps **software companies** structure transactions with clients to find the best deal for both parties.

### The Two Modes

| Mode | Goal | Core Question |
|------|------|---------------|
| **Mode 1: Pricing Calculator** | Find the price where you hit your margin AND your client sees clear ROI | "What's the price range that works for both of us?" |
| **Mode 2: Transaction Structuring** | Compare structures to find the best deal for both you and your client | "Which model gives us the best combined outcome?" |

### What "Best Deal" Means (Mode 2)

The tool helps you optimise across multiple dimensions:

1. **Financial Impact**: What does each option cost, and what profit/tax benefit does each party get?
2. **Tax Efficiency**: Which structure minimises your combined tax burden?
3. **Accounting Treatment**: How will this appear on each party's financial statements?
4. **Compliance Risk**: What are the transfer pricing risks? (related parties only)
5. **Long-term Value**: How does this look over 3-10 years? (NPV, IRR, payback)

**Why this matters**: Software transactions involve IP ownership, different accounting treatments per party, and tax implications. This tool analyses all dimensions simultaneously so you can make an informed structuring decision.

**Important scope clarification**:
- This is NOT specifically for inter-company/related party transactions
- It works for ANY client (related or unrelated)
- Consolidated accounting is NOT in scope
- "Mutual ownership" (related parties) is just one optional configuration

## Architecture

### Frontend stack

- **SvelteKit 2.x** + adapter-static (SPA fallback to `/200.html`).
- **Tailwind CSS v4** (CSS-first config: `@import "tailwindcss"` + inline `@theme`; no `tailwind.config.js`).
- **DaisyUI v5** with `emerald --default` (light) and `dim --prefersdark` (dark). **The themes are the brand** — no custom colour palette, no `--color-model-*` tokens, no hardcoded Tailwind colour utilities like `text-green-400`. Components use DaisyUI semantic classes (`bg-base-100`, `text-base-content`, `border-base-300`, status `text-success`/`error`/`warning`, brand `bg-primary`/`secondary`/`accent`) and DaisyUI components (`.card`, `.btn`, `.btn-primary`, `.input`, `.badge`, `.alert`, `.table`).
- **Theme switching** is dual-layer: a `.dark` class on `<html>` (drives Tailwind's `dark:` variant via `@custom-variant`) PLUS `data-theme="dim|emerald"` (drives DaisyUI). Both move in lockstep — see `apps/web/src/lib/theme.ts`.
- **PWA** via `vite-plugin-pwa` + `workbox-window`. `registerType: 'prompt'` means the user controls when an updated SW activates. `navigateFallback: '/200.html'` aligns with the SPA fallback. SW + manifest are generated at build time; the static `manifest.webmanifest` was deleted in favour of the VitePWA-generated one.
- **Charts** use ApexCharts. `BaseChart.svelte` listens for the `theme:change` custom event and calls `chart.updateOptions({ theme: { mode } })`; per-chart components read live colours from DaisyUI tokens via `getThemeColor()` so series re-colour on theme flip.

### Runtime singletons (`window` globals)

Set by side-effect imports in `+layout.svelte`. Consumers (burger menu, banner, modal) read them via `window.__theme` / `window.__pwa`. Types live in `apps/web/src/app.d.ts`.

| Global | Source | Purpose |
|---|---|---|
| `window.__theme` | `apps/web/src/lib/theme.ts` | `applyTheme(dark)`, `isDark()`, `toggle()`, `dispose()` |
| `window.__pwa` | `apps/web/src/lib/pwa.ts` | `triggerInstall()`, `applyUpdate()`, `suppressUpdateBanner()`, `setUpdateBannerCallback()`, `setInstallModalCallback()`, `updateInstallMenuVisibility()`, `detectBrowser()` |
| `window.__pwaInstallPromptEvent` | `apps/web/src/app.html` early-capture script | Stashes the `beforeinstallprompt` event on first fire so cached-SW repeat visits don't lose it before the framework loads |
| `window.__themeAttached` / `window.__pwaModuleAttached` | guard flags | HMR-safe idempotency for the listener wiring |

### File Structure

```
model-pear/
├── apps/
│   └── web/                    # SvelteKit web application
│       ├── src/
│       │   ├── app.html                        # Pre-paint theme bootstrap + early beforeinstallprompt capture
│       │   ├── app.css                         # @plugin daisyui + @theme + base + print CSS
│       │   ├── app.d.ts                        # Global Window/Navigator type augmentation
│       │   ├── routes/
│       │   │   ├── +page.svelte                # Home page
│       │   │   ├── +layout.svelte              # Header + burger disclosure + UpdateBanner + InstallModal
│       │   │   ├── pricing/                    # Mode 1: Pricing Calculator
│       │   │   │   └── +page.svelte            # 5 pricing models (subscription, usage, seat, one-time, marketplace)
│       │   │   └── structuring/                # Mode 2: Transaction Structuring
│       │   │       ├── +page.svelte            # Model browser (Options Overview)
│       │   │       └── [model]/                # Dynamic route for models 1-6
│       │   │           └── +page.svelte        # Model calculator with variants
│       │   └── lib/
│       │       ├── components/                 # Reusable UI components
│       │       │   ├── UpdateBanner.svelte     # PWA update prompt (z-70)
│       │       │   ├── InstallModal.svelte     # Per-browser install instructions (z-60/z-80)
│       │       │   └── DebugPill.svelte        # Floating debug pill (inline styles, 3 tabs)
│       │       ├── stores/                     # Svelte stores
│       │       ├── config/                     # Configuration
│       │       ├── utils/
│       │       │   └── trackListener.ts        # Shared addEventListener cleanup helper
│       │       ├── theme.ts                    # Runtime theme management (window.__theme)
│       │       ├── pwa.ts                      # Service-worker + install + update (window.__pwa)
│       │       ├── debugLog.ts                 # In-memory debug log (circular buffer, pub/sub)
│       │       └── clipboardUtils.ts           # Clipboard copy with multiple fallbacks
│       ├── static/                             # Static assets (served at root)
│       │   ├── favicon.png                     # 48x48 browser tab icon
│       │   ├── apple-touch-icon.png            # 180x180 iOS home screen
│       │   ├── icon-192.png                    # PWA manifest (any)
│       │   ├── icon-512.png                    # PWA manifest (any)
│       │   └── icon-1024.png                   # PWA manifest (maskable)
│       ├── svelte.config.js                    # SvelteKit config (adapter-static for Vercel)
│       ├── vite.config.ts                      # VitePWA plugin config (manifest, workbox, navigateFallback)
│       ├── postcss.config.js                   # @tailwindcss/postcss
│       └── package.json
│
├── packages/
│   └── calculator/             # Pure TypeScript calculation engine
│       ├── src/
│       │   ├── models/                         # 6 transaction models with variants
│       │   │   ├── index.ts                    # Model registry and re-exports
│       │   │   ├── model-1-cost-plus.ts        # Model 1: Development Services (6 variants)
│       │   │   ├── model-2-licence.ts          # Model 2: Software Licence (8 variants)
│       │   │   ├── model-3-joint-development.ts # Model 3: Joint Development (8 variants)
│       │   │   ├── model-4-bot.ts              # Model 4: BOT (8 variants)
│       │   │   ├── model-5-software-sale.ts    # Model 5: Software Sale (8 variants)
│       │   │   └── model-6-saas.ts             # Model 6: SaaS/Subscription (9 variants)
│       │   ├── projections/                    # NPV, IRR, payback calculations
│       │   ├── sensitivity/                    # Ranges, scenarios, Monte Carlo
│       │   └── types/                          # TypeScript interfaces
│       ├── tsconfig.json
│       └── package.json
│
├── assets/
│   └── icon-source.svg         # SVG source icon (edit this, regenerate PNGs)
│
├── scripts/
│   └── generate-icons.mjs      # Sharp script: SVG → PNG icons (run: pnpm generate-icons)
│
├── CLAUDE.md                   # This file (AI assistant context)
│
└── docs/
    ├── README.md               # Quick start and project overview
    ├── BUSINESS_GUIDE.md       # Comprehensive user guide with tutorials
    ├── CALCULATIONS.md         # Formula explanations and economic theory
    ├── ARCHITECTURE.md         # Technical architecture (TypeScript monorepo)
    ├── SESSION_NOTES.md        # Build commands and architecture reference
    ├── TODO.md                 # Feature ideas and backlog
    ├── USER_ACTIONS.md         # Manual user action instructions (when needed)
    ├── AI_MISTAKES.md          # AI mistake log (prevent repeat errors across sessions)
    ├── DISCOVERY_FINDINGS.md   # Discovery research findings
    ├── DISCOVERY_FRAMEWORK.md  # Discovery research framework
    ├── NEGOTIATION_MODE.md     # Negotiation mode design notes
    ├── UI_UX_GUIDE.md          # UI/UX design guidelines
    ├── working/                # Plans, notes, and scratch files
    └── model-use-cases/        # When to use each model variant
        ├── README.md           # Model selection guide
        ├── model-1-development-services.md
        ├── model-2-software-licence.md
        ├── model-3-joint-development.md
        ├── model-4-build-operate-transfer.md
        ├── model-5-software-sale.md
        └── model-6-saas-subscription.md
```

## The Two Modes

### Mode 1: Pricing Calculator (5 Models)

**Goal**: Find the price range where you hit your margin AND your client sees clear ROI.

| Model | Use Case |
|-------|----------|
| Subscription (SaaS) | Monthly recurring revenue per customer |
| Usage-Based | Pay per unit (API calls, transactions) |
| Per-Seat | Price per active user/seat |
| One-Time Purchase | Upfront license + optional maintenance |
| Marketplace | Commission on transactions |

### Mode 2: Transaction Structuring Tool (6 Models, 47 Variants)

**Goal**: Compare structures to find the best deal for both you and your client.

| Model | Description | Variants |
|-------|-------------|----------|
| **Model 1** | Development Services (Cost-Plus) | 6 (1A-1F) |
| **Model 2** | Software Licence with Royalties | 8 (2A-2H) |
| **Model 3** | Joint Development / Cost-Sharing | 8 (3A-3H) |
| **Model 4** | Build-Operate-Transfer (BOT) | 8 (4A-4H) |
| **Model 5** | Software Sale with Ongoing Support | 8 (5A-5H) |
| **Model 6** | Subscription/SaaS Enhancement | 9 (6A-6I) |

## The Three Modules

### Module 1: Structure Selector
**Files**: `apps/web/src/lib/components/StructureWizard.svelte`, `apps/web/src/lib/config/wizard.ts`

Decision tree wizard that helps users choose the optimal model by asking about:
- IP ownership preferences
- Cash flow structure preferences
- Risk allocation
- Asset recognition needs
- Whether user owns both entities (mutual ownership)
- Transaction timeframe

### Module 2: Pricing Calculator
**Files**: `apps/web/src/routes/structuring/[model]/+page.svelte`, `apps/web/src/lib/components/DeveloperResults.svelte`, `apps/web/src/lib/components/BuyerResults.svelte`

Dynamic calculator that:
- Generates input forms per model/variant
- Calculates results for both parties (Developer and Buyer)
- Renders accounting treatment summaries
- Shows tax calculations and journal entries
- Displays visualisations

### Module 3: Compliance Analyzer
**Files**: `apps/web/src/lib/components/TransferPricingResults.svelte`, `packages/calculator/src/models/` (each model's TP assessment)

Transfer pricing compliance analysis:
- TP risk score (composite of 5 factors)
- Benchmark comparison (OECD methods)
- Accounting treatment summaries
- Tax impact analysis
- Compliance checklists (6 categories)
- Journal entry templates

## Advanced Features

### Options Overview
**File**: `apps/web/src/routes/structuring/+page.svelte`

Default landing view showing all 6 transaction models at a glance:
- Visual grid of model cards with icons, summaries, key features
- "Best for" tags showing ideal use cases
- Quick comparison table (IP ownership, payment type, risk profile)
- "Explore" buttons to select a model
- "Use the guided wizard" link for decision tree flow
- View mode persisted in localStorage

### Compare Mode
**Files**: `apps/web/src/lib/components/ComparisonManager.svelte`, `apps/web/src/lib/components/ComparisonView.svelte`, `apps/web/src/lib/stores/comparison.ts`

Save and compare calculation results side-by-side:
- Save calculations as named options (up to 20)
- Comparison manager panel (list, load, delete, rename, edit notes)
- Side-by-side comparison view (2-4 options)
- Difference column with directional arrows
- Best/worst value highlighting (green/red)
- Compatibility warnings for different models/perspectives
- Export: JSON, CSV, Print/PDF
- Import: Load from JSON file
- localStorage persistence with version tracking

### Stage 2: Sensitivity Analysis
**Files**: `apps/web/src/lib/components/SensitivityPanel.svelte`, `packages/calculator/src/sensitivity/calculations.ts`

- Range inputs (Low / Base / High)
- Best case / Base case / Worst case scenarios
- Tornado charts (input sensitivity ranking)
- Fan charts (projection ranges)
- Break-even analysis
- Monte Carlo simulation (optional)

### Stage 3: Growth Projections
**Files**: `apps/web/src/lib/components/ProjectionsPanel.svelte`, `packages/calculator/src/projections/calculations.ts`

- Multi-year projections (3/5/7/10 years)
- NPV calculations per party
- IRR calculations (Newton-Raphson method)
- Payback period (simple and discounted)
- Break-even revenue analysis
- Cash flow projection charts
- ROI trajectory visualisations

### Advanced Visualisations
**Files**: `apps/web/src/lib/components/charts/` (ApexCharts-based components)

- Cross-model comparison charts
- Asset location timeline (animated)
- Cash flow waterfall (interactive)
- Amortisation schedules (multi-entity)
- TP risk heat map
- Risk vs Return quadrant chart
- Compliance score gauge

## Perspective Framework

Transactions are analysed from two perspectives:

### Your Company (Developer)
- Revenue recognition (service revenue, licence revenue, sale proceeds)
- Development costs (capitalised vs expensed)
- Profit margin analysis
- Income tax liability
- Asset position (if IP retained)

### Client (Buyer)
- Asset capitalisation
- Amortisation schedule (accounting vs tax)
- Section 11(e) accelerated depreciation
- Deferred tax position
- Total cost of ownership

## South African Tax Features

| Feature | Implementation |
|---------|----------------|
| Corporate tax rate | 27% (configurable) |
| Section 11(e) PC | 2-year write-off (50% p.a.) |
| Section 11(e) Mainframe | 5-year write-off (20% p.a.) |
| CGT inclusion rate | 80% for companies |
| CGT effective rate | 21.6% (27% x 80%) |
| Deferred tax | Calculated on timing differences |

## Key Calculation Formulas

### Cost-Plus (Model 1)
```javascript
developerRevenue = totalCost * (1 + marginPercent / 100)
developerProfit = developerRevenue - totalCost
buyerCapitalisedAsset = developerRevenue
```

### Licence Royalty (Model 2)
```javascript
annualRoyalty = buyerRevenue * (royaltyRate / 100)
developerRoyaltyIncome = annualRoyalty
buyerRoyaltyExpense = annualRoyalty
```

### Joint Development (Model 3)
```javascript
totalContribution = developerContribution + buyerContribution
developerOwnership = developerContribution / totalContribution
buyerOwnership = buyerContribution / totalContribution
```

### NPV Calculation (Stage 3)
```javascript
NPV = Sum(cashFlow_t / (1 + discountRate)^t) for t = 0 to n
```

### IRR Calculation (Newton-Raphson)
```javascript
// Iterative: find rate where NPV = 0
while (Math.abs(npv) > tolerance) {
  npv = calculateNPV(cashFlows, rate)
  dnpv = calculateNPVDerivative(cashFlows, rate)
  rate = rate - npv / dnpv
}
```

### Transfer Pricing Risk Score
```javascript
riskScore =
  marginComplianceScore * 0.30 +
  documentationScore * 0.25 +
  substanceScore * 0.20 +
  comparabilityScore * 0.15 +
  consistencyScore * 0.10
```

## Entity Configuration

The tool is pre-configured for **South African companies** doing software transactions. These defaults:
- Reduce setup time for typical users
- Assume independent parties by default (NOT related)
- Show Developer and Buyer perspectives

```javascript
DEFAULT_ENTITY_CONFIG = {
  developer: {
    name: 'Your Company',
    jurisdiction: 'South Africa',       // Default market for the tool
    taxResident: true,                   // Subject to SARS rules
    corporateTaxRate: 0.27,              // SA CIT rate (since 2023)
    accountingFramework: 'IFRS'          // Mandatory for SA listed companies
  },
  buyer: {
    name: 'Client',
    jurisdiction: 'South Africa',
    taxResident: true,
    corporateTaxRate: 0.27,
    accountingFramework: 'IFRS',
    section11eType: 'pc-2yr'             // Accelerated depreciation (2yr for PC software)
  },
  relationship: {
    mutualOwnership: false               // Default: independent parties
  }
}
```

**When to enable "Mutual Ownership"**: Check this only if the client shares common ownership with your company. This activates transfer pricing compliance considerations and related party disclosure requirements.

See **[BUSINESS_GUIDE.md - Default Entity Configuration](docs/BUSINESS_GUIDE.md#default-entity-configuration)** for detailed explanations of each setting.

## Transfer Pricing Benchmarks

| Transaction Type | Low Risk | Medium Risk | Typical |
|------------------|----------|-------------|---------|
| Cost-plus markup | 5-15% | 0-20% | 10% |
| Licence royalty | 5-25% | 2-35% | 15% |
| Reseller margin | 20-40% | 15-50% | 30% |
| Profit split | 40-60% | 30-70% | 50% |
| Service provider | 3-10% | 1-15% | 6% |

## Development Guidelines

### Adding a New Model Variant

1. Add variant definition to the model file in `packages/calculator/src/models/`
2. Include: name, description, scenario, calculation modifiers
3. Test with different input combinations
4. Update documentation

### Adding a New Calculation

1. Add to appropriate module in `packages/calculator/src/`
2. Include JSDoc/TSDoc comments explaining the formula
3. Handle edge cases (division by zero, negative values)
4. Add unit tests

### Adding a New Visualisation

1. Add chart component to `apps/web/src/lib/components/charts/`
2. Use ApexCharts for consistency
3. Ensure responsive design
4. Include loading states

## Documentation Reference

| Document | Purpose | Update When |
|----------|---------|-------------|
| **CLAUDE.md** (root) | AI assistant context, architecture overview, development guide | Architecture, models, or major features change |
| **docs/README.md** | Quick start guide, project overview | Tech stack or setup process changes |
| **docs/BUSINESS_GUIDE.md** | Comprehensive user guide with tutorials | User workflows, features, or terminology change |
| **docs/CALCULATIONS.md** | All formulas, rationale, economic theory | Formulas or calculation logic change |
| **docs/ARCHITECTURE.md** | Technical architecture (TypeScript monorepo) | Build process, package structure, or tech decisions change |
| **docs/SESSION_NOTES.md** | Session continuity - context for next AI to continue work | After each significant task (sessions end abruptly); remove stale notes |
| **docs/TODO.md** | Feature ideas and backlog | Add ideas to persist between sessions |
| **docs/USER_ACTIONS.md** | Manual user action instructions | When user needs to do something outside the tool |
| **docs/AI_MISTAKES.md** | AI assistant mistake log to prevent repeat errors | When an AI makes a mistake during a session |
| **docs/DISCOVERY_FINDINGS.md** | Discovery research findings | Discovery phase findings change |
| **docs/DISCOVERY_FRAMEWORK.md** | Discovery research framework | Discovery methodology changes |
| **docs/NEGOTIATION_MODE.md** | Negotiation mode design notes | Negotiation feature changes |
| **docs/UI_UX_GUIDE.md** | UI/UX design guidelines | UI patterns or design decisions change |
| **docs/model-use-cases/** | When to use each model variant, TP considerations | Model logic or variant definitions change |

## Troubleshooting

### Charts Not Rendering
- Check browser console for ApexCharts errors
- Verify data structure matches chart requirements
- Check if container element exists

### Calculations Returning NaN/Infinity
- Check for division by zero (margin = 100%)
- Verify input validation catches invalid values
- Check for negative numbers in log/power calculations

### Import/Module Errors
- Check for circular dependencies between packages
- Ensure calculator exports point to `src/` (not `dist/`)
- Verify `@model-pear/calculator` resolves in web app

### State Not Updating
- Check Svelte reactive declarations (`$:`) include all dependencies
- Verify store subscriptions are active
- Ensure state changes trigger reactivity (reassignment, not mutation)

---

**For AI Assistants**: This file is your source of truth. The system is a Software Transaction Structuring Tool.

### Tool Goals (use these to guide development)

| Mode | Goal | User gets... |
|------|------|--------------|
| **Mode 1** | Find price where seller hits margin AND buyer sees ROI | Price recommendation with equilibrium zone visualisation |
| **Mode 2** | Compare structures to find best deal for both parties | Side-by-side comparison across 5 dimensions (financial, tax, accounting, compliance, long-term) |

### Key Scope

- This tool is for a **software company** (the developer) working with **any client**
- Works for independent OR related parties
- "Mutual ownership" (related parties) activates transfer pricing compliance features
- Focus: financial impact, tax efficiency, accounting treatment, compliance risk, long-term value
- NOT about group accounting consolidation

### Features

- Options Overview (visual model selection grid)
- Structure Selector (decision tree wizard)
- Perspective analysis (Developer and Buyer)
- Compare Mode (save, compare, export options side-by-side)
- Sensitivity Analysis (ranges, scenarios, Monte Carlo)
- Growth Projections (NPV, IRR, payback)
- Advanced Visualisations (comparisons, timelines, charts)
