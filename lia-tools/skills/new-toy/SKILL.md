---
name: new-toy
description: >-
  Scaffold a new toy in Products/Lia Tools/tools/ to the line convention:
  the numbered lifecycle folders it needs plus meetings/, an empty
  00 handover/, a toy README (one-line promise, the box, where it's up to,
  the Linear epic), a row in the line README's toys table, an offer to
  create the Linear epic, and the index/log housekeeping. Use when Chris
  says "new toy: X", "add a toy", "scaffold X", "set up a folder for X",
  or sketches a toy idea that needs a home. Keeps every toy starting in
  the same shape so any agent can pick any toy up cold.
version: 0.4.0
created: 2026-08-16
updated: 2026-09-02
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-pickup, toy-feedback-ingest, toy-release, ticket-builder]
---

# New toy — scaffold to convention

**Load `execution-discipline` first** (in this plugin). Read `Products/Lia Tools/README.md` before creating anything — it is the convention this skill executes, and it wins if the two ever disagree.

## Step 1 — Gather

Four things, from Chris (one widget where possible, don't drip questions):

1. **The name** — lowercase, the word he actually uses for it.
2. **The one-line promise** — what's in the box, one sentence.
3. **The box** — what's in / what's out / the non-negotiable. Toys are limitation-first; if the box can't be stated, the toy isn't ready for a folder, and saying so is the right outcome.
4. **Which lifecycle folders it needs now** — the seven are `00 handover / 01 planning / 02 analysis / 03 design / 04 build / 05 marketing`. A toy in discovery might need only `00 handover/` + `research/` at the line; don't scaffold all seven by default.

Before creating anything, check the toy doesn't already exist — the toys table in the line README, `_meta/index.md`, and the ledgered sketches (ripple and charts have been floated with no folder; a "new" toy might be one of those getting its home).

## Step 2 — Create the folders

```
Products/Lia Tools/tools/<name>/
├── README.md
├── 00 handover/
│   └── (empty — the first After Action Report lands here, per `wrap-up`)
├── meetings/                ← always (feedback videos land here)
└── <only the numbered folders it needs>
```

- `00 handover/` and `meetings/` always; other numbered folders only as needed. Empty created folders are fine — they signal what's coming.
- Do **not** seed a `retro-log.md` — retro-logs became archives on 2 Sep 2026 (LIAB-1162). The scaffold session's own After Action Report is the folder's first file.
- `04 build/feedback/` gets created by the first feedback ingest, not here — unless `04 build/` is being created anyway, in which case include it.
- **Three things never go inside a tool**, and creating a folder for them here is the drift `toy-tidy` reports:
  - **Standards** — anything every tool would inherit goes to the line's `standards/`. *First-built is not the same as owns*; apply `architecture`'s inheritance test.
  - **Research** — desktop, platform or competitor work goes to the line's `research/` or the vault's `Research/`. Research is agnostic of the tool.
  - **Requirements** — PRDs and acceptance criteria live in Linear. A build agent has Linear and this plugin; a requirement it cannot reach does not apply.

## Step 3 — The toy README

Frontmatter: `title`, `type: product`, `status: active`, `created`/`updated`, `author: cq`, `captured_by: <agent id>`, `linear:` (the epic URL once it exists). Body, short:

1. **The promise** — the one-liner, quoted as he gave it.
2. **The box** — in / out / non-negotiable.
3. **Where it's up to** — one line, updated as the toy moves.
4. **Linear** — the epic ID.
5. **Related** — the line README, sibling docs as they appear.

## Step 4 — Wire it in

1. Add the toy's row to the toys table in `Products/Lia Tools/README.md` (what's in the box · where it's up to · folder · epic).
2. **Offer to create the Linear epic** — project Lia Tools, team Lia Build, shaped per `ticket-builder` (in this plugin — JTBD lead, no sub-feature list). Offer, don't just do it: an epic for an unratified toy is his call. If he says yes, write the epic ID back into the toy README and the toys table.
3. Version note for later: a new toy starts at `0.0.1`, stage `build`, per `toy-release` (in this plugin). No register row needed at creation.

## Step 5 — Housekeeping

- `_meta/index.md`: rows for the toy README (+ any seeded files) under the Lia Tools section. Mandatory.
- `_meta/log.md`: one `create` entry, **appended at the bottom of the file** — add your block to the end, never rewrite the file to insert at the top. (Corrected 2026-08-19, Dan-directed; was "newest-at-top". CLAUDE.md housekeeping rule 2 says *append*, and every pipeline skill does. A top-insert rewrites the whole file, so a scheduled task holding a copy from minutes earlier silently erases it — that cost 8 entries on 2026-08-19.)
- The After Action Report for this session lands on the epic (if created) or the dispatch ticket, per `wrap-up`; its vault copy is the first file in the toy's `00 handover/`.

## Report back

The folder path, what was seeded, the table row, the epic (created or offered), and anything deliberately left uncreated. One short block — he wants to see the toy exists and get back to it.

## Changelog

- **0.4.0 (2026-09-02, LIAB-1162)** — the retro entry is the After Action Report: one per session, as a comment on the dispatch ticket per `wrap-up` 2.0.0, the vault copy in `00 handover/` when mounted; retro-logs are archives. The scaffold no longer seeds a retro-log.
- **0.3.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed. Names the three things that never go inside a tool: standards, research, requirements.
- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the lifecycle is seven folders, not six: design became a stage on 28 Aug (CQ, LIAB-1006) and build/marketing moved up one, so Step 1 names all seven and `05 build/feedback/` replaces `04 build/feedback/`. A scaffold session that still said "all six" would have created the wrong folder for every new toy. Companion routes name the sibling seats — `ticket-builder`, `toy-release`, `execution-discipline` — instead of the retired vault `_meta/skills/` path. First entry here; earlier versions are unrecorded.
