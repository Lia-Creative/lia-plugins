# lia-tools

The one plugin for building lia.tools products — the toys, the toy box and the site — and the process that goes with them.

**This directory is the source of truth for the skills it carries.** Canonical moved here from the Lia Vault's `_meta/skills/` on 26 Aug 2026 ([LIAB-919](https://linear.app/lia-creative/issue/LIAB-919)): a vault that build machines cannot mount is a poor distribution channel, and every packaged copy taken from it is a copy that drifts. Edit a skill here, or don't edit it.

The process the skills implement is written down in [Tool shop — how a lia.tools product gets built](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8). The ticket shapes are [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b). Both live in Linear, deliberately — a build agent has Linear and this plugin, and needs nothing else.

## What's in it

**Discovery — before a story is written**

| Skill | The seat |
|---|---|
| `problem-definition` | Problems formalised and mapped across the board. |
| `jtbd` | The job named consistently, requirements mapped — beside the epic. |
| `epic-builder` | A versioned chunk of value — `charts 1.0`. Scope is read from its stories. |
| `story-writer` | One capability per story, Dan North shape: numbered Given/When/Then ACs + Delivery checks. |
| `scenario-builder` | A user walked through each flow with concrete inputs — the ACs' raw material. |
| `task-writer` | The named work that isn't a story. Sparse by design. |
| `schema-manager` | Entities and variables mapped centrally — the layer that lets tools talk to each other. |
| `ready-review` | Fresh eyes grading epics and stories on the five checks before anything downstream spends work. |
| `ticket-builder` | The shared mechanics under the writers, Shape B for Lia Creative workstreams, and the old front door — it routes. |
| `backlog-grooming` | The maintenance pass for an existing backlog. |

**Management**

| Skill | The seat |
|---|---|
| `project-manager` | Tickets run front to end: dispatch, statuses kept true, context enforced, human-readable updates. |

**The lead engineer's bench**

| Skill | The seat |
|---|---|
| `lead-engineer` | The seat itself — the standing rules, and the routing across this bench. |
| `architecture` | Docs follow code, patterns stay singular, standards hold. |
| `acceptance-criteria` | The freeze pass: scenarios → the final numbered Given/When/Then + Delivery checks. |
| `build-prep` | How to build it — real paths, patterns, traps, resolvable paths — under the criteria. |
| `ticket-review` | The pre-dispatch check: could an agent start without asking anything? *(Reassigned 26 Aug — built-work review lives in `review-and-merge`.)* |
| `review-and-merge` | The review loop with the builder, by AC index, then the content-verified merge. |
| `security` | The compliance shell — six earned rules, grows one real case at a time. |

**Build**

| Skill | The seat |
|---|---|
| `build` | The builder's seat: plan mode first, batching, progress, self-check, one PR, the loop. |
| `polish` | The interface held to the design spec; Toys DS gaps named and routed, never fudged. |
| `pickup` | The front door for single tickets, and the hand-back path. |
| `wrap-up` | Landing a session: handover, retro, housekeeping. |

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

**Design + the judgment layer**

| Skill | The seat |
|---|---|
| `design-handoff` | How a design reaches a builder — the `.dc.html` folder, how to read it, artefact beats prose. |
| `ui-capture` | Screens captured to a consistent standard, with a coverage score. |
| `ui-teardown` | The UX + feature teardown, every claim cited to a shot. |
| `execution-discipline` | Load first, every run — ground truth, stop conditions, done-means-evidence. |

*(`orchestrate` remains as a pointer — the seat split into `project-manager` + `lead-engineer` on 26 Aug 2026.)*

## What doesn't belong here

Research skills (`discover`, `enrich`, `research-*`, `wiki-ingest`), the personal bundles (`cq`, `chris-music`, `chris-quinton-diagrams`), and one-off ingest skills. The test: *does an agent building a lia.tools product need it?* If not, it stays where it is.

## Install

```
/plugin marketplace add Lia-Creative/lia-plugins
/plugin install lia-tools@lia-plugins
```

Already installed? `/plugin marketplace update lia-plugins` picks up new versions.

## Writing frontmatter — no angle brackets

**Never put `<` or `>` in a skill's frontmatter, or in a plugin manifest's `description`. Write placeholders as `[name]`, not `<name>`.**

This is the one rule you can break without any local tool telling you. It cost a
release ([LIAB-959](https://linear.app/lia-creative/issue/LIAB-959)):
`epic-builder` 0.2.0's description ended `…or asked 'epic: <name>'.` The git
marketplace took it, `claude plugin validate` passed it, and the claude.ai/Cowork
installer refused the entire plugin —

> Plugin validation failed: Skill 'skills/epic-builder': SKILL.md description cannot contain XML tags

One placeholder, and `lia-tools` 1.2.0 was uninstallable on a whole surface.

The guard is `scripts/check-skill-frontmatter.mjs` at the repo root, run by
`.github/workflows/skills.yml` on every PR and every push to `main`:

```
node scripts/check-skill-frontmatter.mjs             # every SKILL.md in the repo
node scripts/check-skill-frontmatter.mjs --self-test # proves it can go red
```

It reads every `SKILL.md`'s frontmatter — all fields, not just `description` —
plus every `.claude-plugin/plugin.json` and `marketplace.json` `description`,
since those are published prose the same validator sees.

Three things it deliberately leaves alone, because a guard that fails on correct
input is a guard someone deletes in a hurry:

- **A skill's body.** Angle brackets below the fence are fine and several skills
  need them.
- **YAML block-scalar headers** (`description: >-`, either indicator order).
  That `>` is structure and never reaches the description text; ten skills use it.
- **Command files.** `argument-hint: <name>` is Claude Code's own documented
  convention, and `squeaks/` isn't ours to edit (repo rule 7).

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
- **`triggers:` is not established either way, and cannot be from a build
  machine.** The only evidence is circumstantial and points at "not checked":
  the error names `description` alone, and `wrap-up` has been live as a claude.ai
  standalone skill carrying `<project>` in its triggers. Neither is proof —
  `triggers:` is Lia's own convention, not part of the SKILL.md schema, so a
  validator reading known fields would never see it.

**Outstanding check for Chris:** publish a throwaway `.plugin` build carrying
angle brackets in a `triggers:` entry *and nowhere else*, and record here whether
Cowork accepts it. Until then the rule above is deliberately wider than the known
failure — a placeholder in `triggers:` gets copied into a `description:` sooner
or later, and half a fix is what caused this.

## How a change publishes

**A publish isn't done until it has been installed in all three surfaces, and one
surface passing is not evidence about the others.** That is the rule LIAB-959
bought: [LIAB-919](https://linear.app/lia-creative/issue/LIAB-919)'s "installable
— proven by installing it" was satisfied against Claude Code, Cowork was never
installed into, and the build shipped broken on the surface nobody stood on.

1. Edit the skill **here**, bump the skill's `version:` frontmatter with a changelog line, and bump this plugin's version in `.claude-plugin/plugin.json`.
2. PR, review, merge. The git marketplace is live at that moment — team machines follow on their next `/plugin marketplace update`. CI runs the frontmatter guard on the PR; it is not a substitute for step 3.
3. **Install it on all three, in this order:**

| Surface | How | State |
|---|---|---|
| **Cowork** | A `.plugin` zip of `lia-tools/`, hand-published to claude.ai. Manual until [LIAB-922](https://linear.app/lia-creative/issue/LIAB-922). | **Do this one first.** It is the strictest validator — LIAB-959 is the proof — so it is the gating surface, not the afterthought. |
| **Claude Code** | `/plugin marketplace update lia-plugins`, then `claude plugin update lia-tools@lia-plugins`. | The only surface with a real proof today. |
| **A design session** | The design-facing skills (`design-handoff`, `ui-capture`, `ui-teardown`, `polish`) load and are useful. | **Nobody has yet said what "works" means here.** Name the concrete check before assuming this one too. |

Treat the git channel as the truth if the two published channels ever disagree.

Old copies (the vault's `_meta/skills/`, the claude.ai `lia-build` plugin and standalone skills) are retired by [LIAB-924](https://linear.app/lia-creative/issue/LIAB-924), not by deleting anything from here.
