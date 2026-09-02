# lia-tools

The one plugin for building lia.tools products — the toys, the toy box and the site — and the process that goes with them.

**Reading this as a person, not as an agent? Start with [MANUAL.md](MANUAL.md).**
This file is the roster and the runbook; the manual is the onboarding — what the
plugin is, how the stages and benches hand work on, how to install and update it
on each surface, where feedback goes, and the changelog in plain language.

**This directory is the source of truth for the skills it carries.** Canonical moved here from the Lia Vault's `_meta/skills/` on 26 Aug 2026 ([LIAB-919](https://linear.app/lia-creative/issue/LIAB-919)): a vault that build machines cannot mount is a poor distribution channel, and every packaged copy taken from it is a copy that drifts. Edit a skill here, or don't edit it.

The process the skills implement is written down in [Tool shop — how a lia.tools product gets built](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8). The ticket shapes are [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b). Both live in Linear, deliberately — a build agent has Linear and this plugin, and needs nothing else.

## What's in it

**Discovery — before a story is written**

| Skill | The seat |
|---|---|
| `discovery-lead` | The bench's own lead — the thread held from problem to ready story; routes the writers, requests the gate, never writes. |
| `problem-definition` | Problems formalised and mapped across the board. |
| `jtbd` | The job named consistently, requirements mapped — beside the epic. |
| `feature-definition` | The idea captured, the context block, and what the world already does — before the epic is written. |
| `insight-extraction` | A corpus mined for the claims that would change a decision, ranked, sourced, confidence-capped. |
| `epic-builder` | A versioned chunk of value — `charts 1.0`. Scope is read from its stories. |
| `story-writer` | One capability per story, Dan North shape: numbered Given/When/Then ACs + Delivery checks. |
| `scenario-builder` | A user walked through each flow with concrete inputs — the ACs' raw material. |
| `task-writer` | The named work that isn't a story. Sparse by design. |
| `schema-manager` | Entities mapped across three layers — shared typed code is the truth, the Linear map the directory, the vault the reasoning. |
| `ready-review` | A context that did not write them grading epics and stories on the five checks before anything downstream spends work — spawned, never handed to a person. |
| `synthetic-users` | The panel you interview to find the objections before build spends on them. Hypotheses, never evidence. |
| `ticket-builder` | The shared mechanics under the writers, Shape B for Lia Creative workstreams, and the old front door — it routes. |
| `backlog-grooming` | The maintenance pass for an existing backlog. |

**The research bench** — commissioned by any stage, filed as a cited corpus:

| Skill | The seat |
|---|---|
| `research-lead` | The bench's lead — the plan, the dispatch, the source bar at review, the hand to insights. Never researches. |
| `researcher` | The shared method under every domain: source before claim, citations that resolve, gaps named, collection only. |
| `research-problem` | What the problem is and what is already known about it — prevalence, cost, the field's own name for it. |
| `research-solution-space` | What already exists against it, why each wins or loses, and what its customers say. |
| `research-solution-patterns` | The established shape of a solved problem, its variants and their costs. |
| `research-psychology` | What the person is actually after — motivation, anxiety, identity, social context. Never a generated persona. |
| `research-strategy` | The strategies available for the goal, classified by the power each rests on (7 Powers). |
| `research-competitors` | Who we are up against and how the market moves — captured and torn down, not recalled. |
| `research-brand` | The brand tenets in play, evidenced from the surfaces rather than the manifesto. |
| `research-ux-patterns` | The flow a person already expects, established across several implementations. |
| `research-technology` | What a technology does, costs, limits and risks — licence and data terms quoted. |
| `research-schema-scrape` | An existing product's data model recovered, marked documented or inferred. |
| `research-insights` | The corpus understood: the ranked insight log, and the story a human reads. Can send a corpus back. |

**Management**

| Skill | The seat |
|---|---|
| `project-manager` | Tickets run front to end: passed between the stage leads on gate verdicts, each seat spawned rather than handed out as a command, statuses kept true, context enforced, human-readable updates. |

**The marketplace's own seat**

| Skill | The seat |
|---|---|
| `plugin-manager` | `lia-plugins` run like a product: skill-change review, the merges, promotion and rollback, roster hygiene. |

**The engineering lead's bench**

| Skill | The seat |
|---|---|
| `engineering-lead` | The seat itself — the standing rules, the six-beat chain it fires without returning between beats, and the routing across this bench. |
| `architecture` | Docs follow code, patterns stay singular, standards hold, and a standard everything inherits is filed as the line's. |
| `acceptance-criteria` | The freeze pass: scenarios → the final numbered Given/When/Then + Delivery checks. |
| `build-prep` | How to build it — real paths, patterns, traps, resolvable paths — under the criteria. |
| `ticket-review` | The pre-dispatch check: could an agent start without asking anything? *(Reassigned 26 Aug — built-work review lives in `review-and-merge`.)* |
| `review-and-merge` | The review loop with the builder — verdict, evidence tier and falsifiability per AC index, `cannot check` taking one of three named exits rather than resting, the anti-patterns, the boundaries — then the merge, which needs every criterion disposed of, content-verified. **Any lead runs this in its own lane** — it is listed here because the engineering lane is its commonest use, not because the seat is exclusive. |
| `security` | The compliance shell — six earned rules, grows one real case at a time. |

**The category benches** — what a whole category of tool is held to, whatever the story is:

| Skill | The seat |
|---|---|
| `file-management` | Ten bright lines for anything that moves someone's own files, the person-outranks-the-tool rule, trust as a build requirement. |

**Build**

| Skill | The seat |
|---|---|
| `build` | The builder's seat: plan mode first, batching, progress, self-check, one PR, the loop. |
| `polish` | The interface held to the design spec; Toys DS gaps named and routed, never fudged. |
| `pickup` | The front door for single tickets, and the hand-back path. |
| `wrap-up` | Landing a session: one After Action Report on the ticket — intended, actual, the gap, sustain, improve with owners — and the pickup that reads it. |
| `product-retro` | Superseded pointer (2 Sep 2026) — the mandatory per-session entry is `wrap-up`'s After Action Report. |

**The QA bench** — the stage between a merge and a person:

| Skill | The seat |
|---|---|
| `testing-lead` | The QA stage owned: the test plan, the bench, and the quality report the founder's uat gate reads. Never tests. |
| `test-analyst` | Frozen criteria and walked scenarios become runnable cases — indexed, concrete, decidable. Never runs them. |
| `tester` | The plan executed against the real build: verdict per case with evidence, nothing skipped, nothing fixed. |
| `rogue` | The deliberately hostile pass — off-plan, reproducible, every gap handed back as a case candidate. |
| `bug-writer` | Files a QA finding as a Bug in the house shape — steps to repeat, evidence, deduped, onto the feature epic. |

**The toys nine** — the product line's own process:

| Skill | The seat |
|---|---|
| `toy-pickup` | The toys front door — tight context load before any toys session. |
| `new-toy` | Scaffold a toy to the line convention. |
| `toy-release` | Version a toy and run a promotion after the founder gate. |
| `toy-status` | One-glance state of the line. Read-only. |
| `toy-tidy` | The folder manager — report first, mechanical fixes only. |
| `toys-digest` | The weekly #toys movement draft. Never posts. |
| `toy-jam` | The jam agenda in, the decisions landed and ticketed out. |
| `toy-feedback-ingest` | A feedback video → notes, summaries, tickets. |
| `adventure-chat-ingest` | An adventure chat → the discovery backbone. |

**The design bench**

| Skill | The seat |
|---|---|
| `design-lead` | The design stage owned: ready stories in, every step checked covered before the engineer preps the build. |
| `design-reference` | Reference we already hold, found, broken down cited to frames, and applied as take/adapt/drop. |
| `design-exploration` | Distinct directions from the job, one chosen out loud. |
| `design-flows` | Every scenario walked as screens, states and transitions. |
| `hifi-design` | The screens for real, on the design system, as the artefact. |
| `error-states` | The sweep — error, empty, loading, edge: designed or ruled out loud. |
| `ux-writing` | The words in the interface, written — one verb per action, Apple-exact title case, no blame, checked by a lint. |
| `design-handoff` | How a design reaches a builder — the `.dc.html` folder, how to read it, the HTML home, artefact beats prose. |

**Recon + the judgment layer**

| Skill | The seat |
|---|---|
| `ui-capture` | Screens captured to a consistent standard, with a coverage score. |
| `ui-teardown` | The UX + feature teardown, every claim cited to a shot. |
| `prototype-feedback-loop` | A founder's walkthrough distilled — the stage gate first, then the record and the frame-attached tickets. |
| `lia-voice-check` | The copy half of the gate: AI tells and voice drift, audited before shipping words. |
| `doc-iteration-loop` | The write side of the doc loop — a backlog becomes the next iteration, wave by wave, each section through a fresh-eyes gate. |
| `decision-check` | The slow-brain pass on one call — the incentive named, the hidden trade surfaced, reversibility tested. |
| `execution-discipline` | Load first, every run — ground truth, stop conditions, done-means-evidence. |

*(Two pointers remain: `orchestrate` — the seat split into `project-manager` + `engineering-lead` on 26 Aug 2026 — and `lead-engineer`, the engineering lead's name until 2 Sep 2026 (LIAB-1161), kept for one release so older tickets and handovers still resolve.)*

## What doesn't belong here

The vault pipeline (`wiki-ingest`, `lint`, `enrich`, `discover`, `slack-ingest`, `weekly-context-enrich`), **the vault research engine** (`research-plan`, `research-run`, `research-verify`, `research-library`, `acquired-ingest`), the publishing skills (`lia-html-render`, `add-website-experiment`), the brand-asset and Figma-authoring tooling (`lia-blockprint-treatment`, `figma-dls-build` — **re-confirmed out on 28 Aug 2026**, CQ, so the question stops being re-raised), and the founder-personal bundles (`cq`, `chris-music`, `chris-quinton-diagrams` — including the whole `cq:writing-style-*` set, which is Chris's own voice and not shared).

**The `cq` bundle stays out; three skills have been taken out of it** — `feature-definition` and `insight-extraction` (LIAB-996), and `decision-check` (LIAB-1028, de-personalised on the way in). Extracting a skill is not the same as adopting the bundle: each one is argued on the membership test below, and the rest of `cq` remains Chris's. The test: *does an agent building a lia.tools product need it?* If not, it stays where it is.

**The research bench being in does not reopen the vault engine.** Those five skills stay canonical in
the vault, for vault research and its claims library, and nothing was ported: the bench on this
roster is new writing against [LIAB-1023](https://linear.app/lia-creative/issue/LIAB-1023), so there
is no second copy of anything and no drift to manage. What changed is the membership test's answer,
not the test — a build agent with Linear and this plugin now needs to commission research it can
cite, and it cannot mount the vault to do it.

Three lines here run near each other, and the difference is the corpus, not the craft.
`insight-extraction` mines the discovery backbone — chats with real people about the work — and its
output is a ledger entry a story can cite. **The research bench** answers a question commissioned by
a ticket, from real sources, and files a PR-reviewed corpus beside the product it serves;
`research-insights` loads `insight-extraction` as its method rather than repeating it. **The vault
engine** answers vault questions and keeps its own library. `synthetic-users` generates hypotheses to
aim discovery with, and is barred from every one of those ledgers for exactly that reason.

## Install

```
/plugin marketplace add Lia-Creative/lia-plugins
/plugin install lia-tools@lia-plugins
```

Already installed? `/plugin marketplace update lia-plugins` picks up new versions.

## Writing frontmatter — no angle brackets

**Never put `<` or `>` in a skill's frontmatter, or in a plugin manifest's `description`. Write placeholders as `[name]`, not `<name>`.**

**This rule is kept deliberately, after the surface that enforced it stopped being
a target** (LIAB-924, 26 Aug 2026). It cost a release
([LIAB-959](https://linear.app/lia-creative/issue/LIAB-959)): `epic-builder`
0.2.0's description ended `…or asked 'epic: <name>'.` The git marketplace took
it, `claude plugin validate` passed it, and the claude.ai/Cowork installer
refused the entire plugin —

> Plugin validation failed: Skill 'skills/epic-builder': SKILL.md description cannot contain XML tags

One placeholder, and `lia-tools` 1.2.0 was uninstallable on a whole surface.

We no longer publish to Cowork, so nothing in the current pipeline enforces this.
It stays anyway, because the guard is free to run and the alternative is
re-learning it the expensive way if we ever publish there again. A placeholder
written `[name]` costs nothing; a rule deleted the day it stopped biting is how
the same bug comes back.

The guard is `scripts/check-skill-frontmatter.mjs` at the repo root, run by
`.github/workflows/skills.yml` on every PR and every push to `main`:

```
node scripts/check-skill-frontmatter.mjs             # every SKILL.md in the repo
node scripts/check-skill-frontmatter.mjs --self-test # proves it can go red
```

It reads every `SKILL.md`'s frontmatter — all fields, not just `description` —
plus every `commands/*.md` frontmatter and every `.claude-plugin` and
`.cursor-plugin` `plugin.json` and `marketplace.json` `description`, since those
are published prose the same validator sees.

Three things it deliberately leaves alone, because a guard that fails on correct
input is a guard someone deletes in a hurry:

- **A skill's body.** Angle brackets below the fence are fine and several skills
  need them.
- **YAML block-scalar headers** (`description: >-`, either indicator order).
  That `>` is structure and never reaches the description text; ten skills use it.
- **A command's `argument-hint:` line, and only that line.** `argument-hint:
  <prototype-name>` is Claude Code's own documented convention — but a command's
  `description:` is published prose like any other, so the rest of its
  frontmatter is read.

**A file it cannot parse is reported, not skipped.** A `SKILL.md` with a BOM
before `---` or no closing `---` used to sail through while the success line
counted it as checked — a false green with a number vouching for it. Now the
failure line names it, and the summary prints blocks actually read against files
found, so a skip is visible.

### What is actually known about the validator

Established, not assumed:

- **The check is server-side.** `claude plugin validate lia-tools` passes on the
  broken build, and the string "XML tags" does not appear anywhere in the Claude
  Code CLI. That is why the git channel published a plugin Cowork would not take.
- **`description:` is checked.** The rejection names it.
- **`triggers:` is deliberately unanswered.** The evidence is circumstantial and
  points at "not checked" — the error names `description` alone, `wrap-up` was
  live on claude.ai carrying `<project>` in its triggers, and `triggers:` is
  Lia's own convention rather than part of the SKILL.md schema. None of that is
  proof, and settling it needs a publish.

**We are not going to settle it, and that is the call** (CQ, 26 Aug 2026). A
probe was scoped and then dropped: **no decision depends on the answer.** The
rule above bans angle brackets across all frontmatter whichever way the
validator behaves, so knowing would change nothing about the guard, this build,
or what a skill author is told. The question only mattered while the fix might
have been narrowed to match it — once the rule went wider, the question died.

Recorded so it does not get re-found and re-filed as a gap. If it ever needs
answering: one throwaway build with angle brackets in a `triggers:` entry and
nowhere else.

**And now it cannot be answered here at all.** Cowork was retired as a publish
target on 26 Aug 2026 ([LIAB-924](https://linear.app/lia-creative/issue/LIAB-924)),
so there is no longer a surface to run that probe against. The reasoning above
stands on its own — it never depended on Cowork — but the option is gone as well
as unwanted.

## Versioning

**Take the smallest bump that is true.** One policy, and it governs all three
things this line ships — the plugin, a tool, the toolbox — so an agent moving
between them is never guessing at a different convention
([LIAB-1184](https://linear.app/lia-creative/issue/LIAB-1184), CQ, 2 Sep 2026).

| Bump | Means | The test |
|---|---|---|
| **patch** `1.21.1` | It got better. | A fix, a tweak, tuning, wording. **The default.** |
| **minor** `1.22.0` | It does something new. | A capability added, or the thing's job changed. |
| **major** `2.0.0` | Something that worked stops working. | Someone already using it has to change what they do. |

Read one artifact at a time:

| | patch | minor | major |
|---|---|---|---|
| **a skill** | it reads better, or a rule was tightened | it gained a duty, or its job changed | a session relying on it has to change what it does |
| **the plugin** | an existing skill improved | the roster changed, or a skill's job did | an install breaks |
| **a tool** | a fix or tweak | the tool gains a capability | it breaks someone's saved work |
| **the toolbox** | a fix or tweak to the shell | the shell gains a capability | it breaks a tool or saved state |

Three rules make the number mean something:

1. **One step at a time.** From `X.Y.Z` the only legal next numbers are
   `X.Y.(Z+1)`, `X.(Y+1).0`, `(X+1).0.0`. No skipping. CI enforces this
   (`scripts/check-version-bump.mjs`) for the plugin and every skill in it.

   *The commonest way to see this red is a base that moved while your branch
   sat — someone else's release took the number you were reaching for. The guard
   names the moved base and the fix is to merge it in, not to pick a bigger
   number: choosing one from a stale fork point is exactly how a version
   collides. This is not rare — the branch that added these rules hit it **four
   times in one afternoon**, once while CI was still running.*

2. **A promotion never picks the digit.** Moving a tool `build → test → uat` is
   a stage change, and the stage lives in the release register. The version says
   what changed in the code, and nothing else.
3. **A number is not yours until it lands.** The guard also refuses a version
   the base ref already serves. Two branches that pick the same one merge with
   **no conflict** — both wrote the same string — and the result delivers
   nothing: same served version, no fetch, and the repo claiming a release
   happened.

   *Read that as "on the next run", not "CI has you covered". GitHub does not
   re-run a pull request's checks when the base moves, so a PR can sit green
   while the number it claims is already gone — measured twice on this rule's
   own branch. A push, an **Update branch**, or a manual re-run is what asks the
   question again. The one case the rule exists for is the one that produces no
   new run on its own.*

**Rule 2 is about tools only.** A skill and the plugin have no stages and no
register, so nothing there ever picks a digit for them. Rules 1 and 3 apply to
everything.

**The one exception, also tools only:** for a tool, `0.x` means not yet in
production and the promotion to production is `1.0.0` — the single time a
promotion sets a number — with a breaking change below `1.0.0` taking the minor,
since one step from `0.4.1` reaches `1.0.0` and that number is spoken for.
**This says nothing about a skill.** 69 of the 73 skills here are `0.x` and
every one of them is live; `0.x` is where they started, not a claim that they
are drafts.

**Why this is written down at all.** Nothing used to say how *big* a bump should
be — the rules said *bump it* and the guard only checked the number moved
forward, so habit filled the gap. The plugin went `1.0.0 → 1.21.0` in 26
releases, 21 of them minors, never a major; a one-line wording fix and a whole
new bench of skills cost the same digit. On the tools side the table forced a
minor on **every** uat promotion, so small improvements burned minors for
ceremony rather than for change. A version free to land anywhere above the last
one only ever claimed *a release happened*. The size is the claim now, and rule
1 is what stops it being unreadable: the two jumps in this repo's own history,
`1.19.0 → 1.21.0` and `1.3.0 → 1.3.3`, left numbers nobody can account for.

## How a change publishes

**One surface, one artifact.** Claude Code is the only channel this plugin
publishes to — the CLI, the desktop app and cloud/web sessions are all the same
Claude Code, so a design session (`/design` runs inside Claude Code) gets the
plugin the moment Claude Code does. Cowork was retired as a publish target on
26 Aug 2026 ([LIAB-924](https://linear.app/lia-creative/issue/LIAB-924)); the
hand-carried `.plugin` zip is gone with it.

**Merge is not live.** `main` is where work lands; **`release` is what every
machine runs** — the marketplace serves `lia-tools` from the `release` ref
(LIAB-986). The stop between a bad merge and the whole team is the promotion
step below, and the way back out is the rollback next to it.

1. Edit the skill **here**, bump the skill's `version:` frontmatter with a changelog line, and bump this plugin's version in `.claude-plugin/plugin.json` — **[§Versioning](#versioning) above says how big**, and the answer is usually a patch. The plugin bump is not bookkeeping: **machines only receive an update when the version field changes**, so a promotion without a bump delivers to nobody. CI fails any PR touching `lia-tools/**` without one (`scripts/check-version-bump.mjs` — the version-vs-SHA call went to keeping the explicit version, enforced, 26 Aug 2026). If the change touches `skills/`, also run `node scripts/sync-cursor-skills.mjs` so the Cursor mirror under `.cursor/skills/` matches — CI fails the PR when that mirror drifts.
2. PR, review, merge. CI runs **five** jobs on the PR — `frontmatter`, `version-bump`, `roster`, `cursor-skills-mirror` and `freshness`. The merge lands on `main` and reaches nobody yet.

   *(This said **four** and omitted `cursor-skills-mirror` until 2 Sep 2026 — the job landed with the Cursor mirror in PR #41 and this sentence was not updated with it. Caught by the LIAB-1181 review, against `.github/workflows/skills.yml` rather than against this prose. Prose about a check goes stale the moment the check changes: `execution-discipline` 1.8.0 records the same lesson from the other side.)*

   *(`freshness` is the odd one out: `scripts/check-plugin-freshness.mjs` gates nothing. It answers a question an **agent** has — which copy of these skills am I holding? — by comparing the install on this machine against what `release` serves, and it reports `unchecked` (exit 2) rather than a pass when it cannot tell, because "I could not find your install" must never read as "you are fine". It needs a clone; `scripts/` sits outside the shipped plugin. What to do with each answer is in `execution-discipline` §Which copy am I holding? — [LIAB-1052](https://linear.app/lia-creative/issue/LIAB-1052).)*
3. **Promote.** One command, from any clone:

   ```
   git fetch origin && git push origin origin/main:release
   ```

   A fast-forward of `release` to `main`. Team machines follow on `/plugin marketplace update lia-plugins`, then `claude plugin update lia-tools@lia-plugins`.

   **Do those two by hand, and do not wait for auto-update.** Measured 28 Aug 2026: a session was running 1.6.1 against a released 1.8.0 with *both* settings correct — `autoUpdates: true` in `~/.claude.json` and `autoUpdate: true` on the marketplace. **`DISABLE_AUTOUPDATER=1` is set in the Claude Desktop session environment** (the desktop app manages its own binary), and the plugin pass short-circuits on it — `Plugin autoupdate: skipped (auto-updater disabled)` — **before the per-marketplace flag is ever read**. So the marketplace setting is correct *and irrelevant* there. Even where it does run, the pass sleeps a random 0–10 minutes first, and headless `claude -p` never runs it at all. Nothing here is fixable from settings; the manual pull is the mechanism, not a fallback.
4. **Roll back.** Also one command — move the ref back to the last good commit (find it in `git log origin/release`):

   ```
   git fetch origin && git push --force-with-lease origin [last-good-sha]:release
   ```

   The downgrade delivers for the same reason the upgrade does: the served version changes. `release` is the one ref where a force-push is legitimate, and promotion history is the record of what was live when.

   **`release` is left unprotected on purpose** ([LIAB-994](https://linear.app/lia-creative/issue/LIAB-994), CQ, 1 Sep 2026). Rollback is a `--force-with-lease` of this ref, so classic "no force pushes" protection would break the mechanism. Anyone with push access can move it — that is also what makes rollback one command. `main` is the opposite: a ruleset requires a pull request, and blocks force-pushes and deletions.
5. **Prove it.** Open a fresh session and invoke a changed skill — don't just read it. `claude --plugin-dir <path-to-lia-tools> -p` verifies a branch before merge; a real install after promotion verifies the release.

### The one gap worth knowing about

**Cloud and web Claude Code sessions do not have `/plugin`.** They can't run an
interactive install, so a session started from claude.ai/code or the mobile app
gets this plugin only if the repo it opens declares it in `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "lia-plugins": {
      "source": { "source": "github", "repo": "Lia-Creative/lia-plugins" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": { "lia-tools@lia-plugins": true }
}
```

That declaration belongs in **each repo a build session opens**. This repo carries
a working copy at [`.claude/settings.json`](../.claude/settings.json) — copy it
verbatim; only the marketplace name and plugin name matter. **`lia-toy-box` still
needs it**, and so does any other repo a cloud session works in.

Two honest notes on that snippet (LIAB-987). Cloud and web sessions provision
their plugins fresh at session start, so they always run whatever the `release`
ref serves that day — they are auto-updating by construction, whatever the
flags say. And the `autoUpdate` key's documented home is *managed* settings;
whether Claude Code honors it at project scope is not established. It stays in
the snippet because it states the intent and costs nothing.

**On CLI and desktop machines, do not rely on the per-machine toggle**
(`/plugin` → **Marketplaces** → `lia-plugins` → **Enable auto-update**). This
paragraph used to say it was *known* to work; step 3 above now records why it
doesn't on desktop — `DISABLE_AUTOUPDATER=1` is set in that environment and the
plugin pass returns on it before the toggle is read. Switch it on if you like;
it costs nothing and is right if the gate ever moves. Then pull by hand anyway.
(The renames migration was watched working in
[AUDIT.md](AUDIT.md#the-renames-migration-watched-working-liab-989) — that
record stands, and it was a manual update.)

Without it, a cloud session falls back to whatever account-level skills happen to
sync into it, which is exactly the shadowing LIAB-924 exists to end. **Add it to
a repo before retiring anything that repo's sessions currently rely on.**

### Cursor sessions

Cursor is not a second publish. It loads the same skill *content* this plugin
already is, via a discovery layout Cursor understands:

- **This repo.** [`.cursor/skills/`](../.cursor/skills/) is a **real-file mirror**
  of `lia-tools/skills/` (kept in sync by
  [`scripts/sync-cursor-skills.mjs`](../scripts/sync-cursor-skills.mjs)), plus
  this directory's [`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json).
  A skills-root symlink is not enough: Cursor does not inject symlinked skill
  trees into Cloud Agent `agent_skills` (measured on PR #41; see also the
  [upstream report](https://forum.cursor.com/t/cursor-doesnt-follow-symlinks-to-discover-skills/149693)).
  Edit here under `skills/`, then re-run the sync script before you push.
  `workspaceOpen` does not run on Cloud Agents; the committed mirror is what
  those sessions can see. **Injection still needs a fresh session to re-prove**
  after the mirror lands — do not treat packaging green as load green.
- **Any other repo.** Import `Lia-Creative/lia-plugins` as a Cursor team
  marketplace and enable `lia-tools` — the listing is
  [`.cursor-plugin/marketplace.json`](../.cursor-plugin/marketplace.json) at
  the repo root. Point the marketplace at `release`. Mark it Required if every
  Cloud Agent on every repo should arrive with the roster. Copying
  `.claude/settings.json` does nothing for Cursor.

The copy that ships is still this directory on `release`. Edit a skill here.

Old copies — the vault's `_meta/skills/`, the claude.ai `lia-build` and `lia-toys`
plugins, and the claude.ai standalone skills that duplicate this roster — are
retired by [LIAB-924](https://linear.app/lia-creative/issue/LIAB-924). See
[AUDIT.md](AUDIT.md#the-retirement-liab-924) for what came out, what deliberately
stayed, and the switch-off list.
