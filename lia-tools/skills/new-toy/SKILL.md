---
name: new-toy
description: >-
  Scaffold a new toy in Products/Lia Toys/toys/ to the line convention:
  the numbered lifecycle folders it needs plus meetings/, a seeded
  retro-log, a toy README (one-line promise, the box, where it's up to,
  the Linear epic), a row in the line README's toys table, an offer to
  create the Linear epic, and the index/log housekeeping. Use when Chris
  says "new toy: X", "add a toy", "scaffold X", "set up a folder for X",
  or sketches a toy idea that needs a home. Keeps every toy starting in
  the same shape so any agent can pick any toy up cold.
version: 0.2.0
created: 2026-08-16
updated: 2026-08-28
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-pickup, toy-feedback-ingest, toy-release, ticket-builder]
---

# New toy — scaffold to convention

**Load `execution-discipline` first** (in this plugin). Read `Products/Lia Toys/README.md` before creating anything — it is the convention this skill executes, and it wins if the two ever disagree.

## Step 1 — Gather

Four things, from Chris (one widget where possible, don't drip questions):

1. **The name** — lowercase, the word he actually uses for it.
2. **The one-line promise** — what's in the box, one sentence.
3. **The box** — what's in / what's out / the non-negotiable. Toys are limitation-first; if the box can't be stated, the toy isn't ready for a folder, and saying so is the right outcome.
4. **Which lifecycle folders it needs now** — the seven are `00 handover / 01 planning / 02 research / 03 strategy / 04 design / 05 build / 06 marketing`. A toy in discovery might need only `00 handover/` + `02 research/`; don't scaffold all seven by default.

Before creating anything, check the toy doesn't already exist — the toys table in the line README, `_meta/index.md`, and the ledgered sketches (ripple and charts have been floated with no folder; a "new" toy might be one of those getting its home).

## Step 2 — Create the folders

```
Products/Lia Toys/toys/<name>/
├── README.md
├── 00 handover/
│   └── retro-log.md        ← seeded, always
├── meetings/                ← always (feedback videos land here)
└── <only the numbered folders it needs>
```

- `00 handover/` and `meetings/` always; other numbered folders only as needed. Empty created folders are fine — they signal what's coming.
- Seed `retro-log.md` following the shape of `toys/drip/00 handover/retro-log.md`: frontmatter, the mandatory-entry rule stated at the top, and a first entry recording the scaffold.
- `05 build/feedback/` gets created by the first feedback ingest, not here — unless `05 build/` is being created anyway, in which case include it.

## Step 3 — The toy README

Frontmatter: `title`, `type: product`, `status: active`, `created`/`updated`, `author: cq`, `captured_by: <agent id>`, `linear:` (the epic URL once it exists). Body, short:

1. **The promise** — the one-liner, quoted as he gave it.
2. **The box** — in / out / non-negotiable.
3. **Where it's up to** — one line, updated as the toy moves.
4. **Linear** — the epic ID.
5. **Related** — the line README, sibling docs as they appear.

## Step 4 — Wire it in

1. Add the toy's row to the toys table in `Products/Lia Toys/README.md` (what's in the box · where it's up to · folder · epic).
2. **Offer to create the Linear epic** — project Lia Toys, team Lia Build, shaped per `ticket-builder` (in this plugin — JTBD lead, no sub-feature list). Offer, don't just do it: an epic for an unratified toy is his call. If he says yes, write the epic ID back into the toy README and the toys table.
3. Version note for later: a new toy starts at `0.0.1`, stage `build`, per `toy-release` (in this plugin). No register row needed at creation.

## Step 5 — Housekeeping

- `_meta/index.md`: rows for the toy README (+ any seeded files) under the Lia Toys section. Mandatory.
- `_meta/log.md`: one `create` entry, **appended at the bottom of the file** — add your block to the end, never rewrite the file to insert at the top. (Corrected 2026-08-19, Dan-directed; was "newest-at-top". CLAUDE.md housekeeping rule 2 says *append*, and every pipeline skill does. A top-insert rewrites the whole file, so a scheduled task holding a copy from minutes earlier silently erases it — that cost 8 entries on 2026-08-19.)
- Retro: the seeded first entry in the toy's own retro-log covers this session.

## Report back

The folder path, what was seeded, the table row, the epic (created or offered), and anything deliberately left uncreated. One short block — he wants to see the toy exists and get back to it.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the lifecycle is seven folders, not six: design became a stage on 28 Aug (CQ, LIAB-1006) and build/marketing moved up one, so Step 1 names all seven and `05 build/feedback/` replaces `04 build/feedback/`. A scaffold session that still said "all six" would have created the wrong folder for every new toy. Companion routes name the sibling seats — `ticket-builder`, `toy-release`, `execution-discipline` — instead of the retired vault `_meta/skills/` path. First entry here; earlier versions are unrecorded.
