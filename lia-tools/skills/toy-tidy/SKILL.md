---
name: toy-tidy
description: >-
  The folder manager for Products/Lia Toys: sweep the whole toy line against
  its convention, report the drift, fix the mechanical parts on request, and
  propose the judgment calls. Use when Chris says "tidy the toys folder",
  "toy tidy", "check the toys structure", "is the toys folder up to date",
  "audit the toy line", "fix the toys drift", or after a heavy stretch of
  toys work when information has flowed through and the structure may have
  lagged. On-demand only, never scheduled. Report mode by default; fix mode
  only when he asks for fixes.
version: 0.2.0
created: 2026-08-17
updated: 2026-08-28
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-pickup, toy-feedback-ingest, new-toy, toy-release]
---

# Toy tidy — the toys folder manager

**What this is.** Information flows into `Products/Lia Toys/` from feedback videos, build sessions, research and jams. This skill keeps the structure trustworthy: everything in the shape, every record wired in, nothing silently stale. It is the toys-scoped sibling of the vault's `lint` — but on-demand, founder-triggered, and allowed to fix.

**Load `execution-discipline` first** (in this plugin). Read `Products/Lia Toys/README.md` before sweeping — the convention there is what you're checking against, and it wins over this skill's summary of it.

## Two modes

- **Report (default).** Read everything, write nothing. Output the drift table.
- **Fix.** Only when Chris asks ("fix it", "tidy it up properly"). Apply the mechanical fixes, list every one applied, and still propose the judgment calls rather than making them.

## The sweep

Work through these checks in order. For each finding, classify it **mechanical** (a fix with one right answer) or **judgment** (needs Chris).

1. **Shape.** Every toy and the toy box has `00 handover/retro-log.md`. Folder names match the convention exactly — **seven numbered stages**, `00 handover · 01 planning · 02 research · 03 strategy · 04 design · 05 build · 06 marketing`, plus the unnumbered `meetings/`. A scope carries only the folders it needs, so a *missing* stage is not drift; a folder whose **name or number** is off the list is. Files sitting at a toy's root that belong inside a stage folder. The shape appears nowhere outside `Products/Lia Toys/` — and no Context/Outputs/Resources folders have crept in.

   **Renumbered 28 Aug 2026** (CQ, LIAB-1006): design became a stage, so `04 build/` → `05 build/` and `05 marketing/` → `06 marketing/`. A leftover `04 build/` or `05 marketing/` **folder** is real drift and mechanical to fix. A `04 build/` or `05 marketing/` **path written inside a dated record** — a handover, a retro entry, a meeting note — is not: it was true when written, and rule 5 below says a tidy never edits another session's record. Flag it as translated, don't repair it.
2. **The toys table vs reality.** Line README's toys table ↔ the folders under `toys/` ↔ the epics on the Lia Toys Linear project (verify live, never from memory). A folder with no row, a row with no folder, an epic ID that doesn't resolve.
3. **Meeting notes.** Every `meetings/` file: `video: true` with an empty `url:` (unfinished job — flag it), `transcript_status: raw` (a to-do, not a resting state), transcript file missing from beside the note, no row in `_meta/internal-videos.md`.
4. **Feedback wiring.** Every `05 build/feedback/` summary links back to a meeting note. Every meeting note with a `## Bugs` section has tickets created or a proposed list recorded. Broken relative links between the pair.
5. **Records.** Every handover in `00 handover/` has a retro entry near its date. Retro logs read append-only — flag anything that looks rewritten, never repair a record (see the standing rule: handovers and retro entries are records; a tidy never edits another session's record).
6. **Index + log.** Spot-check that files created since the last tidy have `_meta/index.md` rows. Missing rows are mechanical.
7. **Freshness.** Each README's "where it's up to" line vs the date of the latest retro entry / handover / feedback summary. More than ~2 weeks of drift while work was clearly happening → judgment item with a suggested one-line update drawn from the retro log.
8. **Frontmatter.** `author:` + `captured_by:` present on captured docs; `updated:` moved when a body materially changed.

## What fix mode may and may not do

**May:** create missing convention folders, seed a missing retro-log (drip's is the template), add missing index/internal-videos rows, repair broken links between meeting notes and summaries, complete frontmatter, rename a file to the naming convention (updating every reference in the same pass).

**May not:** delete anything (moves to a `_to_delete/` under the same folder only with Chris's say-so, per the rig rule), edit handovers or retro entries, rewrite prose, change a README's "where it's up to" without proposing it, touch Linear beyond reading, or "fix" strategy docs — contradictions with canon are findings, not fixes.

## The report

One short block: **clean / drift found**, then a table — finding · where · mechanical or judgment · proposed action. Say each finding once (a path issue is one row, not three). End with the one-line ask: "fix the mechanical ones?" if in report mode. In fix mode, close with what was applied and the judgment list.

Then housekeeping if anything was written: `_meta/log.md` entry (`update`), retro entry in each toy actually modified, `_meta/index.md` for any new files.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the shape this skill sweeps against is now seven stages with `04 design/`, spelled out in full rather than elided as `00 handover … 05 marketing`: this skill reports drift, so a stale internal model here would have flagged every real scope on the line. Feedback wiring reads `05 build/feedback/`. Added the renumber's one genuine trap — a leftover `04 build/` *folder* is drift, a `04 build/` path inside a dated record is history and rule 5 forbids touching it. The `execution-discipline` load line names the sibling seat instead of the retired vault path. First entry here; earlier versions are unrecorded.
