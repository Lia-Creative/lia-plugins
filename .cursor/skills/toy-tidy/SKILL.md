---
name: toy-tidy
description: >-
  The folder manager for Products/Lia Tools: sweep the whole toy line against
  its convention, report the drift, fix the mechanical parts on request, and
  propose the judgment calls. Use when Chris says "tidy the toys folder",
  "toy tidy", "check the toys structure", "is the toys folder up to date",
  "audit the toy line", "fix the toys drift", or after a heavy stretch of
  toys work when information has flowed through and the structure may have
  lagged. On-demand only, never scheduled. Report mode by default; fix mode
  only when he asks for fixes.
version: 0.4.0
created: 2026-08-17
updated: 2026-09-02
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-pickup, toy-feedback-ingest, new-toy, toy-release]
---

# Toy tidy — the toys folder manager

**What this is.** Information flows into `Products/Lia Tools/` from feedback videos, build sessions, research and jams. This skill keeps the structure trustworthy: everything in the shape, every record wired in, nothing silently stale. It is the toys-scoped sibling of the vault's `lint` — but on-demand, founder-triggered, and allowed to fix.

**Load `execution-discipline` first** (in this plugin). Read `Products/Lia Tools/README.md` before sweeping — the convention there is what you're checking against, and it wins over this skill's summary of it.

## Two modes

- **Report (default).** Read everything, write nothing. Output the drift table.
- **Fix.** Only when Chris asks ("fix it", "tidy it up properly"). Apply the mechanical fixes, list every one applied, and still propose the judgment calls rather than making them.

## The sweep

Work through these checks in order. For each finding, classify it **mechanical** (a fix with one right answer) or **judgment** (needs Chris).

1. **Shape.** Every tool and the toolbox has a `00 handover/` folder (a `retro-log.md` inside it is an archive since 2 Sep 2026 — present or absent is not drift). Folder names match the convention exactly — **six numbered stages**, `00 handover · 01 planning · 02 analysis · 03 design · 04 build · 05 marketing`, plus the unnumbered `meetings/`. At the **line root**, the numbered stages plus four unnumbered layers: `standards/` (with `schemas/`), `research/`, `design/`, `meetings/`. A scope carries only the folders it needs, so a *missing* stage is not drift; a folder whose **name or number** is off the list is. Files sitting at a toy's root that belong inside a stage folder. The shape appears nowhere outside `Products/Lia Tools/` — and no Context/Outputs/Resources folders have crept in.

   **Reshaped twice on 28 Aug 2026**, so there are two retired schemes, not one:

   | Retired folder name | Now |
   |---|---|
   | `02 research/` (inside a tool) | gone — the line's `research/`, or the vault's `Research/` |
   | `03 strategy/` | `02 analysis/`, or the line's `standards/` if every tool inherits it |
   | `04 design/` | `03 design/` |
   | `05 build/` · `06 marketing/` (the 28-Aug-morning scheme) | `04 build/` · `05 marketing/` |
   | `toy box/` · `toys/` | `toolbox/` · `tools/` |

   **A leftover retired-name FOLDER is real drift and mechanical to fix. A retired path written inside a dated record is not** — a handover, a retro entry, a meeting note was true when written, and rule 5 below says a tidy never edits another session's record. Flag it as translated, don't repair it. **This distinction is the whole trap of this check**: the folder is the bug, the sentence is the history.

   **Also drift:** anything every tool inherits sitting inside one tool's `02 analysis/` rather than the line's `standards/` — judgment, not mechanical, because it needs the inheritance test (`architecture` duty 4). And a **field list inside `standards/schemas/`**, which that folder's own rule forbids: code is the truth.
2. **The tools table vs reality.** Line README's tools table ↔ the folders under `tools/` ↔ the epics on the Lia Tools Linear project (verify live, never from memory). A folder with no row, a row with no folder, an epic ID that doesn't resolve.
3. **Meeting notes.** Every `meetings/` file: `video: true` with an empty `url:` (unfinished job — flag it), `transcript_status: raw` (a to-do, not a resting state), transcript file missing from beside the note, no row in `_meta/internal-videos.md`.
4. **Feedback wiring.** Every `04 build/feedback/` summary links back to a meeting note. Every meeting note with a `## Bugs` section has tickets created or a proposed list recorded. Broken relative links between the pair.
5. **Records.** Every thread in `00 handover/` has exactly one ACTIVE report — an `aar-*.md`, or a legacy `handover-*.md` no AAR has superseded; two actives on one thread is drift for `wrap-up` §3.5's pickup repair. Retro-logs and handovers are archives and read append-only — flag anything that looks rewritten, never repair a record (see the standing rule: handovers and retro entries are records; a tidy never edits another session's record).
6. **Index + log.** Spot-check that files created since the last tidy have `_meta/index.md` rows. Missing rows are mechanical.
7. **Freshness.** Each README's "where it's up to" line vs the date of the latest After Action Report / feedback summary. More than ~2 weeks of drift while work was clearly happening → judgment item with a suggested one-line update drawn from the latest After Action Report.
8. **Frontmatter.** `author:` + `captured_by:` present on captured docs; `updated:` moved when a body materially changed.

## What fix mode may and may not do

**May:** create missing convention folders, add missing index/internal-videos rows, repair broken links between meeting notes and summaries, complete frontmatter, rename a file to the naming convention (updating every reference in the same pass).

**May not:** delete anything (moves to a `_to_delete/` under the same folder only with Chris's say-so, per the rig rule), edit handovers or retro entries, rewrite prose, change a README's "where it's up to" without proposing it, touch Linear beyond reading, or "fix" strategy docs — contradictions with canon are findings, not fixes.

## The report

One short block: **clean / drift found**, then a table — finding · where · mechanical or judgment · proposed action. Say each finding once (a path issue is one row, not three). End with the one-line ask: "fix the mechanical ones?" if in report mode. In fix mode, close with what was applied and the judgment list.

Then housekeeping if anything was written: `_meta/log.md` entry (`update`), the session's After Action Report per `wrap-up`, `_meta/index.md` for any new files.

## Changelog

- **0.4.0 (2026-09-02, LIAB-1162)** — the retro entry is the After Action Report: one per session, as a comment on the dispatch ticket per `wrap-up` 2.0.0, the vault copy in `00 handover/` when mounted; retro-logs are archives. Check 1 stops requiring a retro-log, check 5 checks one ACTIVE report per thread, fix mode no longer seeds retro-logs.
- **0.3.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed. The shape check reads six stages and the line's four unnumbered layers; the migration note becomes a table covering **both** retired schemes. Two new drift classes: a line standard hiding inside one tool, and a field list inside `standards/schemas/`.
- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the shape this skill sweeps against is now seven stages with `03 design/`, spelled out in full rather than elided as `00 handover … 05 marketing`: this skill reports drift, so a stale internal model here would have flagged every real scope on the line. Feedback wiring reads `04 build/feedback/`. Added the renumber's one genuine trap — a leftover `04 build/` *folder* is drift, a `04 build/` path inside a dated record is history and rule 5 forbids touching it. The `execution-discipline` load line names the sibling seat instead of the retired vault path. First entry here; earlier versions are unrecorded.
