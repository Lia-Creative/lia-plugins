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

## How a change publishes

1. Edit the skill **here**, bump the skill's `version:` frontmatter, and bump this plugin's version in `.claude-plugin/plugin.json`.
2. PR, review, merge. The git marketplace is live at that moment — team machines follow on their next `/plugin marketplace update`.
3. Chris republishes the same build to the claude.ai/Cowork channel. Until [LIAB-922](https://linear.app/lia-creative/issue/LIAB-922)'s check exists, this step is manual and unverified — treat the git channel as the truth if the two ever disagree.

Old copies (the vault's `_meta/skills/`, the claude.ai `lia-build` plugin and standalone skills) are retired by [LIAB-924](https://linear.app/lia-creative/issue/LIAB-924), not by deleting anything from here.
