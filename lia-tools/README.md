# lia-tools

The one plugin for building lia.tools products — the toys, the toy box and the site — and the process that goes with them.

**This directory is the source of truth for the skills it carries.** Canonical moved here from the Lia Vault's `_meta/skills/` on 26 Aug 2026 ([LIAB-919](https://linear.app/lia-creative/issue/LIAB-919)): a vault that build machines cannot mount is a poor distribution channel, and every packaged copy taken from it is a copy that drifts. Edit a skill here, or don't edit it.

The process the skills implement is written down in [Tool shop — how a lia.tools product gets built](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8). The ticket shapes are [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b). Both live in Linear, deliberately — a build agent has Linear and this plugin, and needs nothing else.

## What's in it

**Writing the work**

| Skill | The seat |
|---|---|
| `epic-builder` | A versioned chunk of value — `charts 1.0`. Scope is read from its stories. |
| `story-writer` | One capability per story, Dan North shape, acceptance criteria in the user's terms. |
| `task-writer` | The named work that isn't a story. Sparse by design. |
| `ticket-builder` | Pointer at the three above (the old front door still opens). |
| `backlog-grooming` | The maintenance pass for an existing backlog. |

**Gating and moving the work**

| Skill | The seat |
|---|---|
| `ready-review` | Fresh eyes on epics and stories before design or build spends work on them. |
| `pickup` | How a builder takes on work — single tickets, or a whole epic in plan mode. |
| `orchestrate` | The senior developer: runs the board, preps tech notes, reviews the build in a loop with the builder, merges. |
| `ticket-review` | The built-work check for standalone tickets, and the checklist the orchestrator's review runs. |
| `wrap-up` | Landing a session: handover, retro, housekeeping. |

Coming per [LIAB-921](https://linear.app/lia-creative/issue/LIAB-921): the toys nine (`new-toy`, `toy-pickup`, `toy-release`, `toy-status`, `toy-tidy`, `toys-digest`, `toy-jam`, `toy-feedback-ingest`, `adventure-chat-ingest`) and the design pair (`ui-capture`, `ui-teardown`).

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
