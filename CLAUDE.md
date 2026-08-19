# READ AND FOLLOW THE PURPOSE, PROCESS, COMMUNICATION, SCOPE AND COMPLETION, CODE STANDARDS, DOCUMENTATION, AI NOTES, TRIGGERS, AND PROHIBITIONS EVERY TIME

## Purpose

**Read `## Repo Purpose`, below the LOCAL marker at the end of this file, before
anything else.** It states what this repo is for — not what it does, but who it
serves and what wins when two of its jobs pull against each other. It is the one
thing a session cannot derive from the code: what an app does is readable, what
it is for is not.

## Fetching This File

**This file is this repo's copy: the fleet-canonical text, a `LOCAL` marker, then
this repo's own sections.** Everything above the marker is replaced wholesale by
a fleet sync and must never be edited here — convention changes are made in
gp-props' [`docs/FLEET_CLAUDE.md`](https://gp-props.vercel.app/CLAUDE.md) and
propagated. Everything below the marker belongs to this repo and no sync touches
it.

The canonical version is hosted at: `https://gp-props.vercel.app/CLAUDE.md`

To fetch it directly:
```bash
curl -sf "https://gp-props.vercel.app/CLAUDE.md"
```

## Process

1. **Read these preferences first**
2. **Gather context from documentation** (CLAUDE.md, relevant docs/)
3. **Then proceed with the task**

### REMINDER: READ AND FOLLOW THE PROCESS EVERY TIME

## Communication

### What the turn is for

Establish this before anything else. It outranks every test below — being
actionable is wrong when the user is still forming the idea, because acting
forecloses the thought.

**The tell: if executing requires guessing what a word means, it is not an
execute turn.** Not knowing is the signal. A question rather than an
instruction, a sequence of questions on one subject, an answer met with another
question, tentative phrasing — all say the same thing.

Say the read out loud when it changes what you do, so a wrong one costs a word
to correct. Until intent is stated rather than inferred, stay on the thinking
side: acting during a brainstorm creates work to unwind, thinking during a build
turn costs one round trip.

**The goal: communicate as effectively as possible.** Not shortest, not most
thorough. Most effective. Five tests, none of which is a format, ordered by what
you sacrifice last:

- **Trustworthy without re-checking.** Never traded away. Name what verified it
  and name what you assumed. State disagreement instead of smoothing it. Never
  report a pass, a fix, or compliance from memory.
- **Actionable.** They finish knowing what to do — or knowing there is nothing
  to do.
- **Proportional.** Don't over-explain small things. Don't under-explain
  important ones. Wrong in either direction is the same failure. This is what
  decides length when the two below pull against it.
- **Cheap to read.** Answer first. Depth, examples and reasoning stay available
  on request, not pre-loaded in case they're wanted. Name what you left out only
  when the reader wouldn't otherwise know it's there, and only when it is
  substantially bigger than the line naming it.
- **Cheap to reply to.** Number the options so a digit answers them. Never make
  them write a paragraph to unblock you. An option must name what it does
  specifically enough to be judged — "fix all four" is a blank cheque unless the
  four are on the page with what fixing each one changes. Bundle only what shares
  a single decision; anything needing its own call is its own line.

**Define the terms the reply leans on.** When a word carries weight the reader
may not share it — a name for a concept, a term lifted from the code, one you
coined two paragraphs ago — say what it means where it is used, and before the
options rather than after. Not every reply needs this. When it does, the
sentence costs less than the clarification round trip it prevents.

**Not a conversation.** Respond as if talking to yourself — the reader is a
developer. Peer-to-peer, no servility. Acknowledge and act; don't argue the
framing or build a case for a position — say what is wrong and act on it.
Argument belongs in a reply that asked for a judgement, and nowhere else.

**This is a calibration target, not a compliance one.** It will be missed. A miss
is what `convention` reads, not evidence the wording is thin — adding prose to
prevent each one is how a goal turns back into rules.

### Calibration — real misses, worst first

| Miss | What it was | What it should have been |
|---|---|---|
| Reporting from memory | "Pushed as `f1c0a4e`" — never applied, hash invented | Run it, then report what the output said |
| Building on a guessed meaning | A table shipped for "contextual priority" without knowing what it meant | Ask. Not knowing what a word means is the signal, not a gap to fill |
| Arguing instead of acting | Six paragraphs agreeing, disagreeing and building a case before the work | Acknowledgement, the change, the hash |
| Facts without a recommendation | Two true statements about which section to convert | "Convert Scope and Completion", then the two facts |
| Offer instead of answer | "Say the word for the same treatment on any of them" | The four-line answer. If it fits in a few lines it is not an offer, it is the answer |
| Blank-cheque option | "1. Fix both." — nothing said what either fix would change | Name the exact edit under each option, or the digit approves something unseen |

### REMINDER: READ AND FOLLOW THE COMMUNICATION GOAL EVERY TIME

## Scope and Completion

**The goal: the user decides what gets built and how much of it.** A session
delivers all of it, and spends the user's attention only on what only they can
answer. All of this presumes a turn where work gets done — establish that first
(`## Communication`, What the turn is for). Three tests, ordered by what you
sacrifice last:

- **Nothing is silently smaller.** Everything is in scope unless the user says
  otherwise — a session never decides something is out, and never uses the
  phrase to account for work it didn't do. Broken is in scope: pre-existing,
  big, or a different kind of change from the rest of the branch are not reasons
  to leave it. If the whole thing is not delivered, the reply names the exact
  step that is missing.
- **Build the requirement that exists.** It comes from the user or from the
  code, never from what a system like this usually needs — no migration path
  nobody asked for, no compatibility layer for callers that don't exist, no
  configurability nothing needs, no defensive handling of states that can't
  occur, and never report the absence of one as a defect. Fix what is broken,
  incorrect or unsafe; not what you would have written differently. The simple
  version now is correct even knowing it gets rewritten later; the elaborate
  version built to avoid that rewrite is the mistake.
- **Their attention is the scarce resource.** Never build on a guessed cause
  when the cause is knowable — read the code, run the failing case, measure it.
  Reading the code, the design or the docs is not assuming. Ask only for what
  exists solely in their head: intent, priority, a product choice, access. Ask
  when the answer changes what gets built and neither the request nor the code
  says which way; decide when one reading is clearly the intended one or the
  detail is cheap to change later, and say what you decided. Every question at
  once, numbered, before starting. The last answer starts the work — no
  confirmation round, no restating the plan for approval. After that an unknown
  becomes a stated assumption, not a question.

### When stopping is legitimate

Stopping needs a real reason. There are three, and the list is closed:

1. **The work is done** — all of it.
2. **Only the user can unblock it** — a credential, an access grant, a product
   decision that is genuinely theirs — asked up front if it was foreseeable, and
   named the moment it surfaces if it wasn't. A blocker you could have found
   before starting is not one of these.
3. **Continuing would destroy something unrecoverable** that the request doesn't
   authorise.

Not reasons to stop: it was already broken; it's a different kind of change;
it's big; it "feels out of scope"; it might be tidier as a separate change; you
want to confirm something you could work out yourself.

**Done means done.** The change is made, verified by the strongest check
available, docs the change invalidates are updated, and it is committed and
pushed. Anything less is reported as unfinished with the exact step that's
missing — never as done.

### REMINDER: READ AND FOLLOW THE SCOPE AND COMPLETION GOAL EVERY TIME

## Code Standards

### Code Organization

- Prefer smaller, focused files and functions
- **Pause and consider extraction at:** 500 lines (file), 100 lines (function), 400 lines (component)
- **Strongly refactor at:** 800+ lines (file), 150+ lines (function), 600+ lines (component)
- Extract reusable logic into separate modules/files immediately
- Group related functionality into logical directories

### Decision Documentation in Code

Non-trivial code changes must include comments explaining:
- **What** was the requirement or instruction
- **Why** this approach was chosen
- **What alternatives** were considered and why they were rejected

```jsx
// Requirement: Per-cell overlay that stacks on top of image overlay
// Approach: cellOverlays in layout state, rendered as separate div layer
// Alternatives:
//   - Merge with image overlay: Rejected - user needs independent control
//   - CSS filter approach: Rejected - can't do gradient overlays
```

### Cleanup

- Remove `console.log`/`console.debug` statements before marking work complete
- Delete unused imports, variables, and dead code immediately
- Remove commented-out code unless explicitly marked `// KEEP:` with reason
- Remove temporary/scratch files after implementation is complete

### Timer and Subscription Cleanup

- Every `setTimeout`/`setInterval`/`addEventListener`/`subscribe` needs a matching cleanup (`clearTimeout`/`clearInterval`/`removeEventListener`/unsubscribe handle).
- Store timer ids in a scope the cleanup can reach. Nested timeouts → array; single-shot → local const or ref.
- In React: return cleanup from `useEffect`. In plain modules: export a `dispose()` or use `AbortController`.
- HMR-safe: guard global listener attachment behind a `window.__<featureName>Attached` flag so hot-reload doesn't double-subscribe. For frameworks exposing `import.meta.hot`, also release listeners via `import.meta.hot.dispose()`.
- See the [TIMER_LEAKS pattern](https://gp-props.vercel.app/patterns/TIMER_LEAKS.md) for concrete patterns (nested-timeout array, AbortController, per-effect dispose, HMR guard). The hosted URL, not a repo-relative path — this block is mirrored into every repo, and only gp-props holds the file.

### Quality Checks

During every change, actively scan for:
- Error handling gaps
- Edge cases not covered
- Inconsistent naming
- Code duplication that should be extracted
- Missing input validation at boundaries
- Security concerns (XSS via dangerouslySetInnerHTML, unsanitized user input)
- Performance issues (unnecessary re-renders, missing keys, large re-computations)

Fix what you find. Raise it instead of fixing it only when the fix needs a decision that is genuinely the user's.

### User Experience (Non-Negotiable)

All end users are non-technical. This overrides cleverness.

- UI must be intuitive without instructions
- Use plain language - no jargon or developer-speak in user-facing text
- Error messages must say what went wrong AND what to do next, in simple terms
- Confirm destructive actions with clear consequences explained
- Provide feedback for all user actions (loading states, success confirmations)
- Interactive elements meet a 44×44 CSS px touch target (WCAG 2.5.5). Compact
  variants keep the visual size and gain the target with a min-height/width
- Every form control has an accessible name, with the label actually attached
- Text inputs are 16px or larger — iOS Safari auto-zooms into anything smaller

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

**Tags:** Use relevant tags for the change (e.g., documentation, pwa, debug, ui, refactor, testing)
**Complexity:** 1=trivial, 2=small, 3=medium, 4=large, 5=major rewrite
**Urgency:** 1=planned, 2=normal, 3=elevated, 4=urgent, 5=critical
**Impact:** internal, user-facing, infrastructure, or api
**Risk:** low=safe change, medium=could break things, high=touches critical paths
**Debt:** added=introduced shortcuts, paid=cleaned up debt, neutral=neither
**Epic:** groups related commits under one feature/initiative name
**Semver:** patch=bugfix, minor=new feature, major=breaking change

These footers are required on every commit. No exceptions.

### REMINDER: READ AND FOLLOW THE CODE STANDARDS EVERY TIME

## Documentation

**The goal: every one of these files says what is true right now, and each fact
lives in exactly one of them.** Maintained as you work, never when asked. Three
tests, ordered by what you sacrifice last:

- **Nothing in them is stale.** Before adding, read what is already there. If an
  entry is done, deployed, superseded or no longer true, **delete it** — don't
  annotate it, don't mark it complete, don't keep it for the record. Git history
  is the record. This bites hardest where an entry resolves without the repo
  changing — `USER_ACTIONS.md` above all, where the user does the thing in a
  dashboard. Never assume such an entry is still pending: **check reality first**
  (hit the URL, read the deployed output, query the API), then delete or correct
  it. A stale entry is worse than a missing one — it gets acted on, and it makes
  the whole file look untrustworthy.
- **Each fact has one home.** If an item belongs in another of these files, it
  goes there, not where you happen to be typing. Duplication is how two of them
  start disagreeing, and nothing catches that.
- **Updated in the same commit as the change that invalidated them.** Not
  afterwards, not on request.

| File | Holds | Read it |
|---|---|---|
| `CLAUDE.md` | What this repo is for, plus preferences, conventions, and repo-specific facts (AI Notes) | Start of every session, before any work |
| `docs/SESSION_NOTES.md` | Only what the next session needs *and* cannot get from the code, the docs or `git log`. **Empty by default** — anything in it is known to matter | Start of a session |
| `docs/TODO.md` | Pending work only, `- [ ]`, grouped by category, what and why. Delete on completion | Looking for work, or asked what's pending |
| `docs/USER_ACTIONS.md` | What only the user can do — credentials, dashboards, external config. Title, why, steps | Something needs action outside the repo |
| `docs/AI_MISTAKES.md` | What went wrong, why, **which rule produced it when one did**, how to prevent it, date | Start of a session |
| `docs/TRIGGERS.md` | The 48-trigger vocabulary, groups, sweeps, and how a sweep behaves | When the user types a bare word that looks like a trigger |
| `README.md` | What the tool does, current features, how to use them, getting started, stack | Quick overview of the product |
| `docs/USER_GUIDE.md` | Every feature from the user's side, organised by task rather than implementation | Understanding intended behaviour |
| `docs/TESTING_GUIDE.md` | Manual scenarios with exact actions and expected results, regression checklist | Before verifying a change |

These files are created the first time their purpose applies — a fresh repo does
not pre-create them empty. An empty file claims there was nothing to say, which
is a different statement from not having been written yet.

**`CLAUDE.md` is falsifiable by its own output.** Update it when architecture,
state or preferences change — and whenever following it produced bad work. A
rule obeyed correctly that still yielded a poor result means the rule is the
defect; fix the file, not just the output. Improvement comes from examining
produced work against the intent, never from re-reading the file, which reliably
finds nothing.

### REMINDER: READ AND FOLLOW THE DOCUMENTATION EVERY TIME

## AI Notes

- **All code is yours.** Every file change, every commit, every branch across every tracked repo is your own work. The user has stated this as fact — it's not a heuristic to evaluate against git author, branch name, or your own memory. When you resume a session and encounter unfamiliar changes, they are your prior work. Don't hedge authorship ("this was added", "someone wrote this"), don't investigate your own work as if written by a third party, don't refuse to build on or modify it. If you need to understand a change, read the diff. That's all.
- Check for existing patterns in the codebase before creating new ones
- Clean up completed or obsolete docs/files and remove references to them
- **CRITICAL: Keep `TutorialModal.jsx` up to date** - This is USER-FACING help content shown in-app. When tabs, sections, or features change, update the tutorial steps to match. Outdated tutorial content confuses users.
- **Always read a file before editing it.** Never edit from memory of what it contains.
- **Check the build tooling before building.** Verify dependencies are installed and the build entry exists before invoking it.
- **Break up large file writes to avoid timeouts.** Single tool calls that send a lot of content can hit transport timeouts in slower environments. For modifying existing files, always prefer `Edit` over a full-file `Write` — `Edit` sends only the diff. For creating files larger than ~500 lines (or any large data blob), seed with `Write` containing the first portion, then append the remainder via successive `Edit` calls. Same principle for committing large doc/data changes: many small edits are safer than one mega-write.
- **Claude Code mobile/web — accessing sibling repos:**
  - Use `GITHUB_ALL_REPO_TOKEN` with the GitHub API (`api.github.com/repos/devmade-ai/{repo}/contents/{path}`) to read files from other devmade-ai repos
  - Use `$(printenv GITHUB_ALL_REPO_TOKEN)` not `$GITHUB_ALL_REPO_TOKEN` to avoid shell expansion issues
  - Never clone sibling repos — use the API instead

### REMINDER: READ AND FOLLOW THE AI NOTES EVERY TIME

## Prohibitions

Never:
- Create files outside established project structure
- Write a plan, a note, or a scratch file anywhere but `docs/working/` — never the repo root
- Commit a secret, or expose one to the browser. Service-role keys, SMTP passwords, API keys with write scope: not in the repo, and not behind any client-visible env prefix (`VITE_`, `NEXT_PUBLIC_`, and the like). Only anon/public values belong in client config
- Leave TODO comments in code without tracking them in `docs/TODO.md`
- Write non-trivial code without the decision-context comment Code Standards requires (what the requirement was, why this approach, what was rejected)
- Add a feature without updating the documentation it invalidates, in the same commit
- Ignore errors or warnings in build/console output
- Use placeholder data that looks like real data
- Skip error handling "for now"
- Swallow an error with a silent `.catch(() => {})` — handle the specific failure, or let it surface
- Hardcode a value that belongs in a CSS variable, a token, or config
- Add a workaround for an architectural problem — find the root cause and fix that. Globals, duplicate listeners and flag variables to patch over a structural issue are the shape to watch for; if a fix needs 3+ files coordinated to share state, that is the smell
- Remove features during "cleanup" without checking if they're documented as intentional (see AI_MISTAKES.md)
- Report a problem you could have fixed instead of fixing it
- Document or recommend a feature that has not been tested — writing it up is a claim that it works
- End finished work with a question that hands it back, or invent a concern so there is something to report. Decisions go up front, before the work starts — never dangling after it. Offering to expand something already delivered is not that
- **Use the `AskUserQuestion` tool, for any reason.** It breaks the session: the modal covers context the user is mid-way through reading, and it can hang waiting for input that cannot be given — the permission prompt alone is enough to do it, so there is no safe way to try. This extends to any interactive input prompt or selection UI. List options as numbered text and let the user reply with a number.
- Mention branches, pull requests, squashing, rebasing, merging, or force-pushing unless the user raises the topic first. When the user does raise one, answer the specific question and stop — do not volunteer opinions on what they should do process-wise.
- Offer opinions on git history editing, branch strategy, PR size or shape, review flow, or commit structure. Follow instructions; don't editorialize on how the work should be organized.

### REMINDER: READ AND FOLLOW THE PROHIBITIONS EVERY TIME

## Triggers

A bare word from the trigger vocabulary invokes a focused analysis pass — one
perspective, applied to the code. `bugs`, `sec` and `a11y` are single triggers;
`correctness`, `frontend` and `ops` are groups; `quick`, `ship` and `session` are
pre-curated sweeps; `all` is everything. Suffix any of them to scope it: `branch`,
`branch <base>`, `staged`, `file <path>`.

**The vocabulary and the behaviour rules live in
[`docs/TRIGGERS.md`](docs/TRIGGERS.md).** Read that file when the user types a
bare word that looks like one — never guess what a trigger covers, and never
invent a trigger that isn't in it.

### REMINDER: READ AND FOLLOW THE TRIGGERS EVERY TIME

## Implementation Patterns (Source of Truth)

All implementation patterns live in the **gp-props** repo and are the single source of truth for all devmade-ai projects.

**Source location:** `docs/implementations/` in the gp-props repo

**How to access from any repo:**
- Fetch from the live site: `curl -sf "https://gp-props.vercel.app/patterns/{PATTERN_NAME}.md"`
- Fetch via GitHub API: `curl -sf -H "Authorization: token $(printenv GITHUB_ALL_REPO_TOKEN)" "https://api.github.com/repos/devmade-ai/gp-props/contents/docs/implementations/{PATTERN_NAME}.md" | jq -r .content | base64 -d`
- To list all available patterns: `curl -sf -H "Authorization: token $(printenv GITHUB_ALL_REPO_TOKEN)" "https://api.github.com/repos/devmade-ai/gp-props/contents/docs/implementations" | jq -r '.[].name'`

**Rules:**
- **Always fetch the latest version** from gp-props before implementing — patterns are continuously improved
- **Never create local copies** of implementation pattern files in downstream repos
- **Do not hardcode a list of patterns** — scan the source folder to discover what's available
- The set of patterns grows over time; always check the source for new additions

### Alignment levels up, never down

gp-props is the source of truth, but "source of truth" does not mean "the version that wins". When a repo you are reading does something **better** than the canonical version, improve the canonical one — never overwrite the better implementation with the worse rule.

- **Applies to anything, not just patterns** — a rule, a PWA implementation, a hook, a tripwire, a doc convention, a line of copy.
- **Better means demonstrably better:** more correct, catches a case the other misses, or says the same thing more sharply and concretely. Not "different", not "how I would have written it" — that is the taste rule in Scope and Completion, and it still applies.
- **Upstream first, then sync.** Land the improvement in gp-props, then propagate it, so every repo ends up with the better version instead of one repo quietly keeping an advantage the rest never get.
- **Say what you took and where from**, so the trail exists.
- **Levelling a repo DOWN to match the canonical version is a regression**, even when it turns the alignment audit green. A green audit over a worse fleet is a failure of the audit, not a success.

<!-- LOCAL: everything below is this repo's own. Fleet syncs never touch it. -->

## Testing

- Write tests for critical paths and core business logic
- Test error handling and edge cases for critical functions
- Tests are not required for trivial getters/setters or UI-only code
- Run existing tests before and after changes (`pnpm test`)

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

## Kept From Replaced Sections

What this repo said in sections the fleet sync replaced, that canonical does
not say. Superseded lines were dropped; these were not. Each is a line, not a
block — the rescue was line-based, so the surrounding context is in the commit
before the sync.

- Code Standards :: These rules are non-negotiable. Stop and ask before proceeding if any rule would be violated.
- Code Standards :: - [ ] Follow established patterns and conventions in the codebase
- Code Standards :: - [ ] Use industry-standard solutions over custom implementations when available
- Code Standards :: - [ ] Apply SOLID principles, DRY, and separation of concerns
- Code Standards :: - [ ] Prefer well-maintained, widely-adopted libraries over obscure alternatives
- Code Standards :: - [ ] Follow security best practices (input validation, sanitization, principle of least privilege)
- Code Standards :: - [ ] Handle errors gracefully with meaningful messages
- Code Standards :: - [ ] Write self-documenting code with clear naming
- Code Standards :: - [ ] Prefer smaller, focused files and functions
- Code Standards :: - [ ] Pause and consider extraction at: 500 lines (file), 100 lines (function), 400 lines (class)
- Code Standards :: - [ ] Strongly consider refactoring at: 800+ lines (file), 150+ lines (function), 600+ lines (class)
- Code Standards :: - [ ] Extract reusable logic into separate modules/files immediately
- Code Standards :: - [ ] Group related functionality into logical directories
- Code Standards :: - [ ] Split large classes into smaller, focused classes when responsibilities diverge
- Code Standards :: Every non-trivial code change must include comments explaining:
- Code Standards :: ```typescript
- Code Standards :: // Requirement: Calculate NPV for multi-year projections
- Code Standards :: // Approach: Newton-Raphson method for IRR, standard DCF for NPV
- Code Standards :: // Alternatives considered:
- Code Standards :: //   - Simple payback: Rejected - doesn't account for time value of money
- Code Standards :: //   - Excel-style XIRR: Rejected - irregular dates not needed, adds complexity
- Code Standards :: //   - Bisection method: Rejected - slower convergence than Newton-Raphson
- Code Standards :: function calculateIRR(cashFlows: number[]): number {
- Code Standards :: Assume all end users are non-technical. This is non-negotiable.
- Code Standards :: - [ ] UI must be intuitive without instructions
- Code Standards :: - [ ] Use plain language - no jargon, technical terms, or developer-speak
- Code Standards :: - [ ] Error messages must tell users what went wrong AND what to do next, in simple terms
- Code Standards :: - [ ] Labels, buttons, and instructions should be clear to someone unfamiliar with the domain
- Code Standards :: - [ ] Prioritize clarity over brevity in user-facing text
- Code Standards :: - [ ] Confirm destructive actions with clear consequences explained
- Code Standards :: - [ ] Provide feedback for all user actions (loading states, success confirmations, etc.)
- Code Standards :: - [ ] Design for the least technical person who will use this
- Code Standards :: Bad: "Error 500: Internal server exception"
- Code Standards :: Good: "Something went wrong on our end. Please try again, or contact support if this continues."
- Code Standards :: Bad: "Invalid input format"
- Code Standards :: Good: "Please enter your phone number as 10 digits, like 0821234567"
- Code Standards :: - [ ] Never write inline CSS or JS (Tailwind utility classes are acceptable)
- Code Standards :: - [ ] All custom styles must be in dedicated stylesheet files
- Code Standards :: - [ ] Use CSS variables for theming (colors, spacing, typography)
- Code Standards :: - [ ] Separate component styles into individual files when component is created
- Code Standards :: - [ ] Update relevant documentation with every code change
- Code Standards :: - [ ] All documentation lives in `/docs` directory
- Code Standards :: - [ ] Plans, notes, and scratch files go in `/docs/working`
- Code Standards :: - [ ] Never write docs or plans to root directory or random locations
- Code Standards :: - [ ] Keep docs updated immediately - update right after each change, before moving to the next task (sessions can end abruptly)
- Code Standards :: - [ ] Remove all temporary files after implementation is complete
- Code Standards :: - [ ] Delete unused imports, variables, and dead code immediately
- Code Standards :: - [ ] Remove commented-out code unless explicitly marked `// KEEP:` with reason
- Code Standards :: - [ ] Clean up console.log/print statements before marking work complete
- Code Standards :: - [ ] Clean up completed or obsolete docs/files and remove references to them
- Code Standards :: - In Svelte components: return cleanup from `onMount`, or use `onDestroy`. In plain modules: export a `dispose()` or use `AbortController`.
- Code Standards :: - [ ] Error handling gaps
- Code Standards :: - [ ] Edge cases not covered
- Code Standards :: - [ ] Inconsistent naming
- Code Standards :: - [ ] Code duplication that should be extracted
- Code Standards :: - [ ] Missing input validation at boundaries
- Code Standards :: - [ ] Security concerns (XSS via {@html}, unsanitized user input)
- Code Standards :: - [ ] Performance issues (unnecessary reactivity, large re-computations, missing keys)
- Code Standards :: - [ ] Update SESSION_NOTES.md with current state
- Code Standards :: - [ ] Update relevant docs (CALCULATIONS.md, BUSINESS_GUIDE.md, etc.)
- Code Standards :: - [ ] Commit changes (code + docs together)
- Code Standards :: **Tags:** Use descriptive tags relevant to the change (e.g., docs, calculator, ui, models, tests, config)
- Code Standards :: - [ ] Relevant docs updated for changes in this commit
- Code Standards :: - [ ] SESSION_NOTES.md reflects current state
- Code Standards :: - [ ] Commit message is clear and descriptive
- Code Standards :: - [ ] All commits include their related doc updates
- Code Standards :: - [ ] SESSION_NOTES.md is current (in case session ends)
- Code Standards :: - [ ] No work-in-progress that would be lost
- Code Standards :: - [ ] SESSION_NOTES.md updated with full context needed to continue after summary:
- Code Standards :: - What's being worked on?
- Code Standards :: - Current state of the work?
- Code Standards :: - What's left to do?
- Code Standards :: - Any decisions or blockers?
- Code Standards :: - Key details that shouldn't be lost in the summary
- AI Notes :: <!-- Reminders and learnings for AI assistants - add to this as needed -->
- AI Notes :: - Check docs/AI_MISTAKES.md at session start and log new mistakes as they occur
- AI Notes :: - **Trigger name vs. local identifier collisions.** Several single-word triggers in `## Triggers` collide with local names in this repo: `clean` (npm script `pnpm clean`), `tests` (folder `packages/calculator/tests`), `docs` (folder `docs/`), `config` (folder `apps/web/src/lib/config/`), `types` (folder `packages/calculator/src/types`). When the user types one of these as a bare command at the start of a turn, treat it as a trigger invocation. When the same word appears as part of a shell command, file path, or sentence, treat it literally. If genuinely ambiguous, ask which is meant.
- AI Notes :: - **DaisyUI is the styling system in DaisyUI-installed repos. No exceptions. No "documented why we rolled custom" escape hatches.** If `daisyui` is in `package.json`:
- AI Notes :: - **Tokens.** No overrides of `--color-*`, `--radius-selector` / `--radius-field` / `--radius-box`, `--border`, `--depth`, `--size-*`, `--noise`. No inline `style="border-radius: ..."`, no arbitrary `rounded-[Xpx]`. Use `rounded-box` / `rounded-field` / `rounded-selector` and DaisyUI's size scale.
- AI Notes :: - **Components.** Every `<button>` is `btn` + variant. Form inputs are `input input-bordered` / `select select-bordered` / `textarea textarea-bordered` / `checkbox` / `radio` / `range` / `file-input`. Cards/panels are `card` + `card-body`. Status is `badge` / `alert` / `toast`. Overlays are `modal` / `drawer` / `dropdown`. Tabs are `tabs` + `tab`. Tooltips are `tooltip`.
- AI Notes :: - **Colors.** DaisyUI semantic tokens only — `bg-base-100`/`200`/`300`, `text-base-content`, `text-primary`/`bg-primary` (+ `-content`), `text-secondary` / `accent` / `info` / `success` / `warning` / `error`. No `bg-white`, `bg-gray-*`, `text-gray-*`, `text-blue-*`, etc. No `dark:` color pairs — DaisyUI's `data-theme` switches both layers automatically.
- AI Notes :: - **Borders.** `border-base-300` / `border-base-content/20`. No `border-gray-*` / `border-zinc-*` / `border-slate-*`.
- AI Notes :: - **Shadows.** DaisyUI shadows only. No arbitrary `shadow-[...]`.
- AI Notes :: - **Inline hex.** None. No `style="color: #..."` / `style="background: #..."`.
- AI Notes :: - **Build integrity.** Theme-meta generators are idempotent (second run produces zero diff). `GEN:` markers in templates stay intact. Theme catalog stays in sync with `daisyui/theme/object.js`.
- AI Notes :: - **If you think DaisyUI can't express something: stop and ask the user.** Don't roll custom. Don't write a justification comment. Don't add it to a "documented exceptions" list.
- AI Notes :: - **When auditing existing code: violations are fixed, not justified.** Don't rationalize a hand-rolled component as "intentional because…". Replace it.
- AI Notes :: - N/A only when `daisyui` is not in `package.json`.
- AI Notes :: - **The debug system is alpha-only — remove it when alpha ends.** Delete `debugLog.ts`, `clipboardUtils.ts`, `DebugPill.svelte`, the `#debug-root` + inline `<script>` + inline pill in `app.html`, and the dynamic import in `+layout.svelte`. The z-80 layer becomes unused at that point.
- Documentation :: **Git log is the changelog.** Don't create or maintain a separate `CHANGELOG.md` / `HISTORY.md`. To answer "when did X land / why was Y done that way", use `git log -S '<symbol>'`, `git log -- <path>`, or `git log --all --oneline | grep`.
- Documentation :: - Short items: `- [ ]` checkbox bullet
- Documentation :: - Larger items (those needing problem/solution context, rationale, mock-ups): `### Heading` followed by `**Priority**: …` and a body
- Documentation :: - When complete, delete (git history tracks what was done)
- Documentation :: - Mode-by-mode walkthrough of the interface
- Implementation Patterns (Source of Truth) :: Patterns evaluated against this repo's actual needs and intentionally **not** implemented. Each entry includes the reasoning so a future contributor doesn't re-evaluate from scratch.
- Implementation Patterns (Source of Truth) :: Evaluated April 28, 2026. The pattern's three triggering criteria — (a) cross-module unrelated reactions to the same domain event, (b) service-layer boundaries where producers don't know consumers, (c) need for typed event payloads enforced at compile time — are all already satisfied by existing primitives:
- Implementation Patterns (Source of Truth) :: - **Theme change broadcast** uses a typed `CustomEvent<{ dark: boolean }>` dispatched on `window` from `applyTheme()` in `$lib/theme.ts`. `BaseChart.svelte` listens via `window.addEventListener('theme:change', …)`. DOM CustomEvent fans out to N listeners at zero coupling cost; type safety comes from the generic.
- Implementation Patterns (Source of Truth) :: - **Cross-component state** uses Svelte stores (`themeRev` writable, `comparisonStore` + 5 derived stores in `$lib/stores/comparison.ts`). Reactive auto-subscription, type-checked through Svelte's tooling.
- Implementation Patterns (Source of Truth) :: - **PWA banner / modal handoff** uses single-consumer callback registration (`window.__pwa.setUpdateBannerCallback`, `setInstallModalCallback`). One banner, one modal — fan-out would be over-engineering.
- Implementation Patterns (Source of Truth) :: - **Debug log subscriptions** use scoped pub/sub (`debugSubscribe(fn) → unsubscribe`) inside `$lib/debugLog.ts`. Single domain, single consumer (the DebugPill).
- Implementation Patterns (Source of Truth) :: None of those benefit from a generic typed EventBus<M>. Calculator-package code is pure functions with no side-effect publishers. If a future feature needs pub/sub across unrelated modules with a typed payload map, re-evaluate then — but adding one now would be reinventing primitives the app already has.
- Prohibitions :: - Write code without decision context comments (for non-trivial changes)
- Prohibitions :: - Modify default values without business justification
- Prohibitions :: - Add features without updating documentation
- Prohibitions :: - Document an "exception" or "intentional deviation" from DaisyUI in a DaisyUI-installed repo. Hand-rolled components, token overrides, raw Tailwind colors, `dark:` pairs, arbitrary radii/shadows, inline hex — all are violations to be fixed, never justified. If DaisyUI seems insufficient, ask the user. Don't write a "we rolled custom because…" comment.
- Triggers :: Findings are fixed, not justified. No "documented exceptions" carve-outs. All four are N/A only when `daisyui` is not in `package.json`.
- Triggers :: | 22 | `daisyui-tokens` | `dst` | Token overrides in CSS — `--color-*`, `--radius-selector` / `--radius-field` / `--radius-box`, `--border`, `--depth`, `--size-*`, `--noise`. Arbitrary `rounded-[Xpx]`, inline `style="border-radius: ..."`. `@plugin "daisyui"` config sanity — theme list, `--default` / `--prefersdark`, `@custom-variant dark`, `color-scheme`. |
- Triggers :: | 23 | `daisyui-components` | `dsc` | Hand-rolled where DaisyUI has a class — `<button>` not `btn`, inputs not `input input-bordered` (etc.), panels not `card` + `card-body`, status not `badge` / `alert` / `toast`, overlays not `modal` / `drawer` / `dropdown`, tabs not `tabs` + `tab`, custom tooltips not `tooltip`. |
- Triggers :: | 24 | `daisyui-utilities` | `dsu` | Raw Tailwind colors where semantic tokens fit — `bg-white`, `bg-gray-*`, `text-gray-*`, `text-blue-*`. Non-semantic borders — `border-gray-*` / `border-zinc-*` / `border-slate-*`. Arbitrary `shadow-[...]`. Inline hex — `style="color: #..."` / `style="background: #..."`. `dark:` color pairs that should collapse to a single semantic token. |
- Triggers :: | 25 | `daisyui-build` | `dsb` | Theme-meta generator non-idempotent (second run produces a diff). `GEN:` markers in templates stripped, moved, or formatted away. Theme catalog out of sync with `daisyui/theme/object.js` (DaisyUI bumped a color, regen missed). `pnpm check:theme-hex` failures (hardcoded hex sites no longer match DaisyUI tokens). |
- Triggers :: > **Purpose**: AI assistant context file for the Software Transaction Structuring Tool
- Triggers :: > **Last Updated**: March 2026
- Triggers :: > **Status**: Active - TypeScript + SvelteKit application with 5 pricing models and 6 transaction models (47 variants)
