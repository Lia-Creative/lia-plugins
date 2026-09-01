---
name: toy-jam
description: >-
  Close the loop the feedback videos open: collect every open
  needs-a-jam item across the Lia Tools line into one agenda, and after the
  jam happens, write the decisions back into strategy docs and Linear and
  mark the source items resolved. Use when Chris says "toy jam", "prep the
  jam", "what needs jamming", "jam agenda for the toys", "we jammed on X,
  write it back", or hands over a jam recording or notes to be landed.
  Two halves: before (agenda) and after (write-back) — either can run
  alone.
version: 0.3.0
created: 2026-08-17
updated: 2026-08-28
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-feedback-ingest, toy-status, ticket-builder, toy-pickup]
---

# Toy jam — agenda in, decisions back

**What this is.** `toy-feedback-ingest` deliberately refuses to ticket unsettled things — they land as "open items needing a jam" in meeting notes, and `Jam ·` tickets sit on the board. Without a closer, those piles only grow. This skill is the closer: gather them for the jam, then land what the jam decided.

**Load `execution-discipline` first** (in this plugin).

## Half one — the agenda ("prep the jam")

1. **Collect** every open jam item: `## Open items needing a jam` sections across all `meetings/` files (line, toolbox, each tool), unresolved jam mentions in `04 build/feedback/` summaries, and `Jam ·` tickets (label `Research`) on the Lia Tools project — live read.
2. **Dedupe and group** by toy, then by theme within a toy. Keep his words — an agenda item is the founder's phrasing plus its source link and timestamp, not a paraphrase.
3. **Order** by age (oldest open first) and note anything blocking build work right now.
4. **Flag, don't answer.** If an item touches one of the six open strategy questions (pricing, layers, price band, store count, live-toy cap, permanence), mark it as strategy-level — the jam may need Dan and Luke, and that's Chris's call to make, not the agenda's.
5. **Hand over one page:** the agenda, grouped and sourced. Nothing else — the thinking in the jam is theirs.

## Half two — the write-back ("we jammed, land it")

Input is whatever exists: a recording (route the transcript through `toy-feedback-ingest` first — a jam recording is a meeting note like any other), or notes, or Chris telling you the calls directly.

1. **One decision, one landing place.** Each decision goes to the `02 analysis/` of the scope it belongs to — extend the existing doc on that topic if there is one (dated section), new dated doc only when no home exists. Decisions everything else inherits live in strategy, not in the meeting note.
2. **The source items close.** Mark each resolved jam item in its meeting note with a one-line pointer to where the decision landed. `Jam ·` tickets get the outcome as a comment and move per what was decided — never to Done by an agent.
3. **Build work that falls out** is proposed through `ticket-builder` shapes — a tick-list for Chris, not auto-created tickets. A jam decision is a direction; the backlog entry is a second decision.
4. **Strategy-level outcomes** get one extra check: if the jam settled one of the six open questions, that only counts when all three founders were in it or Chris says it's his call alone — otherwise record it as "CQ's position, pending three-way", which is exactly what the strategy docs already do.
5. **Housekeeping:** `_meta/index.md` for new docs, `_meta/log.md` entry, retro entry in each toy whose strategy moved.

## Report back

Agenda half: the page, and how many items, oldest first. Write-back half: each decision → where it landed, tickets touched, the proposed build list, and anything the jam raised that stayed open.

## Changelog

- **0.3.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.
- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — jam items are collected from `04 build/feedback/`: the line gained a `03 design/` stage on 28 Aug and build moved up one. The `execution-discipline` load line names the sibling seat in this plugin rather than the retired vault `_meta/skills/` path. First entry here; earlier versions are unrecorded.
