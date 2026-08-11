| 48 | `pattern-audit` | `pa` | Every gp-props implementation pattern: implemented / partial / missing / deviates — with diff notes for each. A deviation that is an improvement is an upstream candidate, not a defect |

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
- **No hedging.** Commit to a position. "I think" / "perhaps" only when genuinely uncertain. Naming a concern is not hedging; declining to commit to a recommendation after naming it is. When challenged, state the answer plainly — padding, or defending a past decision instead of answering, reads as evasion. If you were wrong, say so in one line and move on.
- **Assume competence.** The reader is a developer. Don't over-explain basics.
- **Push back.** Disagree when warranted. State your view first, then say what you're doing about it.
- **Proper solutions only.** The right fix, not a hack that hides the problem. Proper means *correct*, not *elaborate* — see Scope and Completion.
- **Work, not process.** Only discuss work that can be done and work that is done. Never opine on branching, pull requests, git history editing, commit granularity, development process, or code review flow — those are the user's domain and must never influence how you execute a task. If you notice a process OPINION, keep it to yourself and get on with the work. A bare process FACT that decides whether or when the work takes effect is not an opinion and belongs in what needs their attention.
- **Say what you checked.** "Done" means verified — name the check that proved it (the command, the test, the reproduction). If nothing was run, say the change is unverified and what would prove it. Never report a pass, a fix, or compliance from memory.
- **Length is proportional to the decision it supports.** Lead with the outcome: answer, say what you did, stop. Don't restate the request, don't list options you're not recommending, and don't narrate the work — no step-by-step of what you checked, verified, or considered. The commit and the diff are the record. If a short answer is growing headers, tables and bullet lists, that is the signal it has gone wrong.
- **State the problem, then the fix.** When something is broken: one line on what's broken, one on what you did about it. No background, no evidence dump, no history of how you found it. Give the reasoning if asked.

### How a reply ends

Three parts, in this order. Each earns its place or it isn't written. Nothing is included to fill the shape.

1. **What you did, or what you found.** Concise. The outcome, not the journey.
2. **What needs their attention.** Only what they genuinely must know: a decision that is actually theirs, something you could not verify, something that will bite them. **A fixable problem reported instead of fixed is a failure, not a finding** — if you could have fixed it, you should have. **Be specific** — name the file, the assumption, the failure mode. "Might have edge cases" is noise; "this assumes every article has a section, and nothing validates that" is a concern. Distinguish *I decided this* (overrulable, state it) from *you must decide this* (blocking, ask it). If there is nothing, write nothing — never append "worth flagging", "one thing to note", or a trailing list of everything noticed along the way. An invented worry trains the reader to skip the section, which destroys the point of having it.
3. **Suggestions, or a full stop.** Actionable next moves, numbered. If there are none, just end.

**Never end on an open question.** A question left dangling after the work is work handed back. Questions belong *before* the work (see Scope and Completion); once work has started, an unknown becomes a stated assumption, not a question.

### REMINDER: READ AND FOLLOW THE COMMUNICATION RULES EVERY TIME

## Scope and Completion

How far the work goes, when to ask instead of deciding, and when stopping is legitimate.

### Scope is the user's call, never the session's

- **Everything is in scope unless the user says otherwise.** The user names what's out. A session never decides something is out of scope, and never uses the phrase to account for work it didn't do.
- **Scope is the request plus the code that exists** — not the code you imagine will exist.
- **Broken is always in scope. If you find something broken, fix it.** Pre-existing is not a reason to leave it. "Different kind of change from the rest of this branch" is not a reason to leave it. Size is not a reason to leave it — a big fix gets done, not deferred.
- **Wrong is in scope; different-from-your-taste is not.** Fix what is broken, incorrect, or unsafe. Don't restyle, rename, or rewrite working code because you would have written it differently.

### Build for the requirement that exists

- **Never invent a requirement, then solve it or report it as a problem.** If nobody said there is a migration path, there is no migration path. If nobody said the old behaviour must keep working, it doesn't have to. Requirements come from the user or from the code — never from what a system like this "usually" needs.
- **Simplest thing that solves the actual problem, first.** No speculative abstraction, no compatibility layer for callers that don't exist, no configurability nothing asked for, no defensive handling of states that can't occur.
- **Refactoring is expected, not a failure.** Building the simple version now is correct even knowing it will be rewritten later. Building the elaborate version now to avoid that rewrite is the mistake.

### Asking vs deciding

- **Investigate, don't interrogate.** Never build a fix on a guessed cause. Where the cause is knowable, go and find it — read the code, measure it in a browser, run the failing case. Reading the code, the design or the docs is not assuming. Ask only for what exists solely in the user's head: intent, priority, a product choice, access.
- **Ask when the answer changes what gets built and neither the request nor the code tells you which way.** That means: two readings leading to materially different work; a substantial build with no stated requirement anchoring it; or an irreversible action the request doesn't clearly authorise.
- **Decide when one reading is clearly the intended one**, when the detail is cheap to change later (naming, placement, wording, layout), or when the answer wouldn't change what you do. State what you decided — don't ask.
- **Ask once, up front, batched.** Every question you have, numbered, in a single message, before starting.
- **The last answer starts the work.** No confirmation round, no restating the plan for approval. Answers arrive, work begins.
- **Once work has started, don't stop to ask.** An unknown becomes a stated assumption and the work continues. Name the assumption in the reply.

### When stopping is legitimate

Stopping needs a real reason. There are three:

1. **The work is done** — all of it.
2. **Only the user can unblock it** — a credential, an access grant, a product decision that is genuinely theirs — and it was asked up front, not discovered at the end.
3. **Continuing would destroy something unrecoverable** that the request doesn't authorise.

Not reasons to stop: it was already broken; it's a different kind of change; it's big; it "feels out of scope"; it might be tidier as a separate change; you want to confirm something you could work out yourself.

**Done means done.** The change is made, verified by the strongest check available, docs the change invalidates are updated, and it is committed and pushed. Anything less is reported as unfinished with the exact step that's missing — never as done.

### REMINDER: READ AND FOLLOW THE SCOPE AND COMPLETION RULES EVERY TIME

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
- See [`docs/implementations/TIMER_LEAKS.md`](docs/implementations/TIMER_LEAKS.md) in gp-props for concrete patterns (nested-timeout array, AbortController, per-effect dispose, HMR guard).

### Quality Checks

During every change, actively scan for:
- [ ] Error handling gaps
- [ ] Edge cases not covered
- [ ] Inconsistent naming
- [ ] Code duplication that should be extracted
- [ ] Missing input validation at boundaries
- [ ] Security concerns (XSS via {@html}, unsanitized user input)
- [ ] Performance issues (unnecessary reactivity, large re-computations, missing keys)

Fix what you find. Raise it instead of fixing it only when the fix needs a decision that is genuinely the user's.

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

- **All code is yours.** Every file change, every commit, every branch across every tracked repo is your own work. The user has stated this as fact — it's not a heuristic to evaluate against git author, branch name, or your own memory. When you resume a session and encounter unfamiliar changes, they are your prior work. Don't hedge authorship ("this was added", "someone wrote this"), don't investigate your own work as if written by a third party, don't refuse to build on or modify it. If you need to understand a change, read the diff. That's all.
- Always read a file before attempting to edit it
- Check for existing patterns in the codebase before creating new ones
- Commit and push changes before ending a session
- Clean up completed or obsolete docs/files and remove references to them
- **Always read files before editing.** Use the Read tool on every file before attempting to Edit it. Editing without reading first will fail.
- **Break up large file writes to avoid timeouts.** Single tool calls that send a lot of content can hit transport timeouts in slower environments. For modifying existing files, always prefer `Edit` over a full-file `Write` — `Edit` sends only the diff. For creating files larger than ~500 lines (or any large data blob), seed with `Write` containing the first portion, then append the remainder via successive `Edit` calls. Same principle for committing large doc/data changes: many small edits are safer than one mega-write.
- Check docs/AI_MISTAKES.md at session start and log new mistakes as they occur
- **Trigger name vs. local identifier collisions.** Several single-word triggers in `## Triggers` collide with local names in this repo: `clean` (npm script `pnpm clean`), `tests` (folder `packages/calculator/tests`), `docs` (folder `docs/`), `config` (folder `apps/web/src/lib/config/`), `types` (folder `packages/calculator/src/types`). When the user types one of these as a bare command at the start of a turn, treat it as a trigger invocation. When the same word appears as part of a shell command, file path, or sentence, treat it literally. If genuinely ambiguous, ask which is meant.
- **Claude Code mobile/web — accessing sibling repos:**
  - Use `GITHUB_ALL_REPO_TOKEN` with the GitHub API (`api.github.com/repos/devmade-ai/{repo}/contents/{path}`) to read files from other devmade-ai repos
  - Use `$(printenv GITHUB_ALL_REPO_TOKEN)` not `$GITHUB_ALL_REPO_TOKEN` to avoid shell expansion issues
  - Never clone sibling repos — use the API instead

- **Implementation patterns — always fetch from gp-props.** Never look for local copies of implementation pattern files (e.g., `docs/implementations/*.md`) in downstream repos. They do not exist locally — the single source of truth is the `docs/implementations/` folder in the gp-props repo. Fetch the latest version before every implementation task.
- **DaisyUI is the styling system in DaisyUI-installed repos. No exceptions. No "documented why we rolled custom" escape hatches.** If `daisyui` is in `package.json`:
  - **Tokens.** No overrides of `--color-*`, `--radius-selector` / `--radius-field` / `--radius-box`, `--border`, `--depth`, `--size-*`, `--noise`. No inline `style="border-radius: ..."`, no arbitrary `rounded-[Xpx]`. Use `rounded-box` / `rounded-field` / `rounded-selector` and DaisyUI's size scale.
  - **Components.** Every `<button>` is `btn` + variant. Form inputs are `input input-bordered` / `select select-bordered` / `textarea textarea-bordered` / `checkbox` / `radio` / `range` / `file-input`. Cards/panels are `card` + `card-body`. Status is `badge` / `alert` / `toast`. Overlays are `modal` / `drawer` / `dropdown`. Tabs are `tabs` + `tab`. Tooltips are `tooltip`.
  - **Colors.** DaisyUI semantic tokens only — `bg-base-100`/`200`/`300`, `text-base-content`, `text-primary`/`bg-primary` (+ `-content`), `text-secondary` / `accent` / `info` / `success` / `warning` / `error`. No `bg-white`, `bg-gray-*`, `text-gray-*`, `text-blue-*`, etc. No `dark:` color pairs — DaisyUI's `data-theme` switches both layers automatically.
  - **Borders.** `border-base-300` / `border-base-content/20`. No `border-gray-*` / `border-zinc-*` / `border-slate-*`.
  - **Shadows.** DaisyUI shadows only. No arbitrary `shadow-[...]`.
  - **Inline hex.** None. No `style="color: #..."` / `style="background: #..."`.
  - **Build integrity.** Theme-meta generators are idempotent (second run produces zero diff). `GEN:` markers in templates stay intact. Theme catalog stays in sync with `daisyui/theme/object.js`.
  - **If you think DaisyUI can't express something: stop and ask the user.** Don't roll custom. Don't write a justification comment. Don't add it to a "documented exceptions" list.
  - **When auditing existing code: violations are fixed, not justified.** Don't rationalize a hand-rolled component as "intentional because…". Replace it.
  - N/A only when `daisyui` is not in `package.json`.

- **The debug system is alpha-only — remove it when alpha ends.** Delete `debugLog.ts`, `clipboardUtils.ts`, `DebugPill.svelte`, the `#debug-root` + inline `<script>` + inline pill in `app.html`, and the dynamic import in `+layout.svelte`. The z-80 layer becomes unused at that point.

### REMINDER: READ AND FOLLOW THE AI NOTES EVERY TIME

---

## Documentation

**AI assistants automatically maintain these documents.** Update them as you work — don't wait for the user to ask. This ensures context is always current for the next session.

**Maintained against reality, not appended to.** Before adding to any of these files, check what is already in them. If an entry is done, deployed, superseded, or no longer true, **delete it** — don't annotate it, don't mark it complete, don't keep it "for the record". Git history is the record.

This matters most where an entry can be resolved without the file being touched — `USER_ACTIONS.md` above all, where the user does the thing in a dashboard and nothing in the repo changes. Never assume such an entry is still pending: **check reality first** (hit the URL, read the deployed output, query the API), then delete or correct it. A stale entry is worse than a missing one — it gets acted on, and it makes the whole file look untrustworthy.

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

**Purpose:** The few things the next session cannot work without. **Default state is empty.**
**When to read:** At the start of a session.
**When to update:** At session end, and the moment an entry goes stale — delete stale content, don't annotate it.
**What to include:** Only what the next session genuinely needs *and* cannot get from the code, the docs, or `git log`. If nothing qualifies, leave the file empty. Most sessions leave it empty.

Not a session log, not a changelog, not a record of what you did — git history already holds that, and a summary of finished work is noise the next session has to read past. Pending work goes in `docs/TODO.md`. Things only the user can do go in `docs/USER_ACTIONS.md`. Mistakes worth remembering go in `docs/AI_MISTAKES.md`. If an item fits one of those, it goes there, not here.

**Why:** An always-populated notes file trains sessions to skim it. Kept empty by default, anything in it is known to matter.
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

All implementation patterns live in the **gp-props** repo and are the single source of truth for all devmade-ai projects.

**Source location:** `docs/implementations/` in the gp-props repo

**How to access from any repo:**
- Fetch via GitHub Pages: `curl -sf "https://gp-props.vercel.app/patterns/{PATTERN_NAME}.md"`
- Fetch via GitHub API: `curl -sf -H "Authorization: token $(printenv GITHUB_ALL_REPO_TOKEN)" "https://api.github.com/repos/devmade-ai/gp-props/contents/docs/implementations/{PATTERN_NAME}.md" | jq -r .content | base64 -d`
- To list all available patterns: `curl -sf -H "Authorization: token $(printenv GITHUB_ALL_REPO_TOKEN)" "https://api.github.com/repos/devmade-ai/gp-props/contents/docs/implementations" | jq -r '.[].name'`

**Rules:**
- **Always fetch the latest version** from gp-props before implementing — patterns are continuously improved
- **Never create local copies** of implementation pattern files in downstream repos
- **Do not hardcode a list of patterns** — scan the source folder to discover what's available
- The set of patterns grows over time; always check the source for new additions

### Not Applicable Patterns

Patterns evaluated against this repo's actual needs and intentionally **not** implemented. Each entry includes the reasoning so a future contributor doesn't re-evaluate from scratch.

#### EVENT_BUS — N/A
Evaluated April 28, 2026. The pattern's three triggering criteria — (a) cross-module unrelated reactions to the same domain event, (b) service-layer boundaries where producers don't know consumers, (c) need for typed event payloads enforced at compile time — are all already satisfied by existing primitives:

- **Theme change broadcast** uses a typed `CustomEvent<{ dark: boolean }>` dispatched on `window` from `applyTheme()` in `$lib/theme.ts`. `BaseChart.svelte` listens via `window.addEventListener('theme:change', …)`. DOM CustomEvent fans out to N listeners at zero coupling cost; type safety comes from the generic.
- **Cross-component state** uses Svelte stores (`themeRev` writable, `comparisonStore` + 5 derived stores in `$lib/stores/comparison.ts`). Reactive auto-subscription, type-checked through Svelte's tooling.
- **PWA banner / modal handoff** uses single-consumer callback registration (`window.__pwa.setUpdateBannerCallback`, `setInstallModalCallback`). One banner, one modal — fan-out would be over-engineering.
- **Debug log subscriptions** use scoped pub/sub (`debugSubscribe(fn) → unsubscribe`) inside `$lib/debugLog.ts`. Single domain, single consumer (the DebugPill).

None of those benefit from a generic typed EventBus<M>. Calculator-package code is pure functions with no side-effect publishers. If a future feature needs pub/sub across unrelated modules with a typed payload map, re-evaluate then — but adding one now would be reinventing primitives the app already has.

---


### Alignment levels up, never down

gp-props is the source of truth, but "source of truth" does not mean "the version that wins". When a repo you are reading does something **better** than the canonical version, improve the canonical one — never overwrite the better implementation with the worse rule.

- **Applies to anything, not just patterns** — a rule, a PWA implementation, a hook, a tripwire, a doc convention, a line of copy.
- **Better means demonstrably better:** more correct, catches a case the other misses, or says the same thing more sharply and concretely. Not "different", not "how I would have written it" — that is the taste rule in Scope and Completion, and it still applies.
- **Upstream first, then sync.** Land the improvement in gp-props, then propagate it, so every repo ends up with the better version instead of one repo quietly keeping an advantage the rest never get.
- **Say what you took and where from**, so the trail exists.
- **Levelling a repo DOWN to match the canonical version is a regression**, even when it turns the alignment audit green. A green audit over a worse fleet is a failure of the audit, not a success.
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
pnpm check            # Theme-hex drift check + svelte-check (typecheck)
pnpm check:theme-hex  # Standalone: hardcoded hex sites match DaisyUI tokens
pnpm lint             # ESLint across workspaces
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
- Start a substantial build without knowing the requirement it satisfies
- Invent a requirement nobody stated — then build for it, or report its absence as a problem
- Create files outside established project structure
- Leave TODO comments in code without tracking them in `docs/TODO.md`
- Ignore errors or warnings in build/console output
- Restyle, rename, or rewrite working code because you happen to be in the file. Fixing what's broken is not a "while I'm here" change — that's the job
- Use placeholder data that looks like real data
- Skip error handling "for now"
- Write code without decision context comments (for non-trivial changes)
- Modify default values without business justification
- Add features without updating documentation
- Remove features during "cleanup" without checking if they're documented as intentional (see AI_MISTAKES.md)
- Leave an assumption unstated — if you decided something the user didn't specify, say so
- Report a problem you could have fixed instead of fixing it
- Report work as done without naming what verified it
- End finished work with an open question, or write a concern to fill a heading. Questions go up front, before the work starts — never dangling after it
- **Use the `AskUserQuestion` tool, for any reason.** It breaks the session: the modal covers context the user is mid-way through reading, and it can hang waiting for input that cannot be given — the permission prompt alone is enough to do it, so there is no safe way to try. This extends to any interactive input prompt or selection UI. List options as numbered text and let the user reply with a number.
- Create local copies of implementation pattern files in any repo — always fetch from gp-props
- Mention branches, pull requests, squashing, rebasing, merging, or force-pushing unless the user raises the topic first. When the user does raise one, answer the specific question and stop — do not volunteer opinions on what they should do process-wise.
- Decide that anything is out of scope, or frame work as "deferred as out of scope". Only the user sets scope. Work is either doable (do it) or blocked on user input (say exactly what input is needed).
- Offer opinions on git history editing, branch strategy, PR size or shape, review flow, or commit structure. Follow instructions; don't editorialize on how the work should be organized.
- Document an "exception" or "intentional deviation" from DaisyUI in a DaisyUI-installed repo. Hand-rolled components, token overrides, raw Tailwind colors, `dark:` pairs, arbitrary radii/shadows, inline hex — all are violations to be fixed, never justified. If DaisyUI seems insufficient, ask the user. Don't write a "we rolled custom because…" comment.

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
- Triggers are the one place a pause is expected rather than a stop needing justification (Scope and Completion) — the user asked for a review, not a rewrite. Everywhere else, a found problem gets fixed.

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

### DaisyUI discipline — group `daisyui`

Findings are fixed, not justified. No "documented exceptions" carve-outs. All four are N/A only when `daisyui` is not in `package.json`.

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 22 | `daisyui-tokens` | `dst` | Token overrides in CSS — `--color-*`, `--radius-selector` / `--radius-field` / `--radius-box`, `--border`, `--depth`, `--size-*`, `--noise`. Arbitrary `rounded-[Xpx]`, inline `style="border-radius: ..."`. `@plugin "daisyui"` config sanity — theme list, `--default` / `--prefersdark`, `@custom-variant dark`, `color-scheme`. |
| 23 | `daisyui-components` | `dsc` | Hand-rolled where DaisyUI has a class — `<button>` not `btn`, inputs not `input input-bordered` (etc.), panels not `card` + `card-body`, status not `badge` / `alert` / `toast`, overlays not `modal` / `drawer` / `dropdown`, tabs not `tabs` + `tab`, custom tooltips not `tooltip`. |
| 24 | `daisyui-utilities` | `dsu` | Raw Tailwind colors where semantic tokens fit — `bg-white`, `bg-gray-*`, `text-gray-*`, `text-blue-*`. Non-semantic borders — `border-gray-*` / `border-zinc-*` / `border-slate-*`. Arbitrary `shadow-[...]`. Inline hex — `style="color: #..."` / `style="background: #..."`. `dark:` color pairs that should collapse to a single semantic token. |
| 25 | `daisyui-build` | `dsb` | Theme-meta generator non-idempotent (second run produces a diff). `GEN:` markers in templates stripped, moved, or formatted away. Theme catalog out of sync with `daisyui/theme/object.js` (DaisyUI bumped a color, regen missed). `pnpm check:theme-hex` failures (hardcoded hex sites no longer match DaisyUI tokens). |

### Maintainability — group `quality`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 26 | `clean` | `cln` | Dead code, duplication, commented-out blocks, unused imports/exports, leftover TODOs |
| 27 | `naming` | `nam` | Identifier clarity, consistency with local norms, misleading abbreviations |
| 28 | `patterns` | `pat` | Deviation from established patterns (fleet-wide gp-props or repo-local), reinvented wheels |
| 29 | `docs` | `doc` | Docs ↔ code drift, missing docs on public API, outdated README/CLAUDE.md claims |
| 30 | `doc-cleanup` | `dcl` | Duplicated content across doc files, stale files no longer relevant, orphaned docs nothing references, superseded files that replaced but didn't delete their predecessor, sections still describing removed features |
| 31 | `tests` | `tst` | Coverage gaps on critical paths, flaky patterns, test smells, missing edge-case tests |
| 32 | `complexity` | `cpx` | Function length, nesting depth, cyclomatic complexity hotspots |
| 33 | `hacks` | `hck` | `TODO`/`FIXME`/`HACK`/`XXX` markers, `@ts-ignore`/`@ts-expect-error`, `any` escapes framed as temporary, `setTimeout` for timing fixes, quick patches waiting to be done properly |
| 34 | `simplify` | `smp` | Reinvented framework features, over-engineered abstractions, custom code that could be 1–2 stdlib/library calls, unnecessary layers |
| 35 | `reuse` | `rus` | Custom-vs-stdlib balance: how much is hand-written that shouldn't be; logic that should be extracted for reuse but isn't; abstractions generalized for a single caller; speculative parameters, defensive checks for impossible states, and configurability serving no real need |
| 36 | `back-compat` | `bck` | Orphaned feature flags, deprecated branches with no callers, `legacy*` exports, backcompat shims outliving their purpose, `// kept for compatibility` blocks |
| 37 | `comments` | `cmt` | Code comments against repo rules — WHY not WHAT, no PR-reference rot, no AI narration, no commented-out blocks unless `// KEEP:` annotated |
| 38 | `dx` | `dx` | Developer experience: README/setup clarity, dev-error message quality, source map/stack trace usefulness, debug-surface ergonomics, contribution path friction |
| 39 | `undone` | `und` | Started-but-unfinished work — partial implementations, half-wired features, WIP branches of logic, features only reachable from dev but not production |

### Operational — group `ops`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 40 | `deps` | `dep` | Outdated, unused, vulnerable, license-risky dependencies |
| 41 | `observability` | `obs` | Log coverage, metric hygiene, trace completeness, debug-pill surfaces |
| 42 | `reliability` | `rel` | Retries, timeouts, idempotency, graceful degradation, offline handling |
| 43 | `config` | `cfg` | Env var handling, secret management, config schema drift |
| 44 | `migration` | `mig` | DB migration safety, API versioning, rollback plan, backward compatibility |
| 45 | `ci` | `ci` | Pipeline health, build speed, cache effectiveness, flake rate |
| 46 | `pwa` | `pwa` | Service worker correctness, manifest validity, install prompt handling, update flow, offline behavior, icon cache-busting, standalone-mode quirks |

### Design-level — group `design`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 47 | `architecture` | `arch` | Coupling, layering violations, abstraction leaks, module boundaries |
| 48 | `api` | `api` | Interface consistency, versioning, deprecation, contract clarity |
| 49 | `state` | `sta` | Where state lives, derivation vs storage, single-source-of-truth violations |
| 50 | `data-model` | `dat` | Schema normalization, foreign-key integrity, nullable discipline |

### Fleet alignment — group `fleet`

| # | Trigger | Alias | Looks for |
|---|---------|-------|-----------|
| 51 | `align` | `aln` | Drift between this repo's CLAUDE.md and gp-props CLAUDE.md — missing sections, stale rules, divergent conventions |
| 52 | `pattern-audit` | `pa` | Every gp-props implementation pattern: implemented / partial / missing / deviates — with diff notes for each |

### Meta sweeps

Run multiple triggers sequentially, pausing after each for `fix` / `skip` / `stop`. Organised roughly by cadence — pick the one that matches when you're running it.

| Trigger | Alias | Cadence | What it does |
|---------|-------|---------|--------------|
| `hot` | `h` | pre-commit | `bugs` + `types` + `errors` — fastest sanity check before committing. Pairs well with `hot staged` |
| `quick` | `q` | pre-push | `bugs` + `security` + `a11y` — the "don't ship this" triad |
| `ship` | `shp` | pre-merge | `correctness` + `trust` + `a11y` + `tests` — full pre-merge check |
| `session` | `ses` | end of session | `surface` + `wrap` + `undone` + `skipped` — "what state am I leaving this in?" |
| `tidy` | `tdy` | weekly | `clean` + `doc-cleanup` + `hacks` + `deps` + `undone` + `dx` + `daisyui` — maintenance / hygiene sweep |
| `all` | `*` | quarterly | Every applicable trigger across every group, in order |

### Reflective passes

Single-pass, no fan-out to other triggers. Each answers one specific question about the recent work.

| Trigger | Alias | What it does |
|---------|-------|--------------|
| `risk` | `rsk` | Worst-case blast radius analysis on the current change |
| `surface` | `srf` | Reflective pass on recent changes: what was decided, what was assumed, what was skipped, what needs human review |
| `wrap` | `wrp` | Wrap-up pass before moving on — anything to double-check / strengthen / improve, anything discovered / assumed / skipped, anything to cleanup / update / tighten, anything to note / document / clarify |
| `skipped` | `skp` | What was left undone — issues noticed and not fixed, wherever they were noticed. Each item: what it is, where, why it wasn't fixed. Under Scope and Completion this list should come back empty; anything in it is a defect to close, not a record to keep |
| `assumed` | `asm` | What was assumed — anything decided rather than asked. Each item: the assumption, why it was made, what happens if wrong |
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
- **PWA** via `vite-plugin-pwa` + `workbox-window`. `registerType: 'prompt'` stays as the *mechanism* (it exposes the waiting worker to app code); the *behaviour* on top is the fleet-standard **auto-on-launch** update policy (gp-props `PWA_SYSTEM.md` → "Update Application Policy"): a SW already **waiting** when registration first resolves at startup is applied silently (skipWaiting → one reload — safe, no calculator inputs entered yet); an update that installs **mid-session** never auto-reloads (Model Pear holds calculator inputs in memory) — it shows the UpdateBanner and otherwise applies on the next launch. A persisted **"Automatic updates"** burger-menu toggle (localStorage `pwaAutoUpdate`, default ON, `'false'` = tap-only) gates the launch-apply, and a **"Check for updates"** menu action runs `registration.update()` + ~1.5s settle and surfaces the typed result (`'no-sw' | 'up-to-date' | 'update-available' | 'error'`) as a bottom-centre toast (the UpdateBanner is the feedback for `update-available`). `navigateFallback: '/200.html'` aligns with the SPA fallback. SW + manifest are generated at build time; the static `manifest.webmanifest` was deleted in favour of the VitePWA-generated one.
- **Charts** use ApexCharts. `BaseChart.svelte` listens for the `theme:change` custom event and calls `chart.updateOptions({ theme: { mode } })`; per-chart components read live colours from DaisyUI tokens via `getThemeColor()` so series re-colour on theme flip.

### Runtime singletons (`window` globals)

Set by side-effect imports in `+layout.svelte`. Consumers (burger menu, banner, modal) read them via `window.__theme` / `window.__pwa`. Types live in `apps/web/src/app.d.ts`.

| Global | Source | Purpose |
|---|---|---|
| `window.__theme` | `apps/web/src/lib/theme.ts` | `applyTheme(dark)`, `isDark()`, `toggle()`, `dispose()` |
| `window.__pwa` | `apps/web/src/lib/pwa.ts` | `triggerInstall()`, `dismissInstall()`, `applyUpdate()`, `suppressUpdateBanner()`, `setUpdateBannerCallback()`, `setInstallModalCallback()`, `updateInstallMenuVisibility()`, `detectBrowser()`, `getInstallInstructions()`, `isAutoUpdateEnabled()`, `setAutoUpdateEnabled()`, `checkForUpdates()` |
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
│       │       │   ├── trackListener.ts        # Shared addEventListener cleanup helper
│       │       │   └── bodyScrollLock.ts       # Reference-counted body scroll lock for nested overlays
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
│   ├── generate-icons.mjs      # Sharp script: SVG → PNG icons (run: pnpm generate-icons)
│   ├── oklch-to-hex.mjs        # Interactive: print DaisyUI dim/emerald tokens as sRGB hex
│   ├── check-theme-hex.mjs     # CI assertion: hardcoded hex sites match DaisyUI tokens (gates `pnpm check`)
│   └── lib/
│       └── oklch.mjs           # Shared OKLCH → sRGB conversion + DaisyUI theme parsing
│
├── CLAUDE.md                   # This file (AI assistant context)
│
└── docs/
    ├── README.md               # Quick start and project overview
    ├── BUSINESS_GUIDE.md       # Comprehensive user guide with tutorials
    ├── CALCULATIONS.md         # Formula explanations and economic theory
    ├── ARCHITECTURE.md         # Technical architecture (TypeScript monorepo)
    ├── SESSION_NOTES.md        # Compact session-continuity snapshot (rewritten each session)
    ├── TODO.md                 # Feature ideas and backlog
    ├── USER_ACTIONS.md         # Manual user action instructions (when needed)
    ├── AI_MISTAKES.md          # AI mistake log (prevent repeat errors across sessions)
    ├── UI_UX_GUIDE.md          # UI/UX design guidelines
    ├── working/                # Plans, notes, and scratch files
    │   ├── DISCOVERY_FINDINGS.md   # Discovery research findings (Jan 2026, complete)
    │   ├── DISCOVERY_FRAMEWORK.md  # Discovery research methodology
    │   └── NEGOTIATION_MODE.md     # Negotiation-mode design draft (unimplemented)
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
| **docs/UI_UX_GUIDE.md** | UI/UX design guidelines | UI patterns or design decisions change |
| **docs/model-use-cases/** | When to use each model variant, TP considerations | Model logic or variant definitions change |
| **docs/working/** | Plans, design drafts, completed-research artifacts (Discovery, Negotiation-mode draft) | When a new plan or research artifact is captured; promote out of `working/` only when the content becomes living documentation |

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
