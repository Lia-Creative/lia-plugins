---
name: toy-status
description: >-
  One-glance state of the Lia Toys line: for each toy and the toy box, the
  stage and version, what the Linear board actually says, the latest
  feedback headline, and the open jam items. Use when Chris says "toy
  status", "where are the toys at", "state of the line", "what's happening
  with the toys", "toys update", or before planning what to build next.
  Reads live sources (board, registers, vault records) and never invents a
  status. Chat answer by default; a #toys draft or dashboard only if asked.
version: 0.2.0
created: 2026-08-17
updated: 2026-08-28
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-pickup, toy-tidy, toys-digest, toy-release]
---

# Toy status — one glance at the line

**What this is.** The picture that currently only exists by reading four folders and a board. Assembled fresh each time from live sources — a status report is a claim, so every line here traces to something checkable.

**Load `execution-discipline` first** (in this plugin). Never invent a Linear status, a version, or a stage. If a source is unreachable, say "unreadable from here" for that column — an honest gap beats a guess.

## Gather, per toy (and the toy box)

| Column | Source of truth |
|---|---|
| Stage + version | The release register (`toy_releases`, the lia Supabase project) when readable — the register wins over any doc. Otherwise the latest release/promotion record in the vault, labelled as such. |
| Board | Linear, live: the toy's epic on the Lia Toys project — counts of In Progress / Review / recently Done, and anything sitting in Review awaiting a founder look. |
| Latest feedback | Newest file in the toy's `05 build/feedback/` (or the line/toy-box `meetings/`) — one headline line, with its date. |
| Open jams | `## Open items needing a jam` entries in meeting notes not yet resolved, plus `Jam ·` tickets on the board. |
| Where it's up to | The toy README's line — flag if it disagrees with the above rather than silently preferring either. |

Read tightly: latest files only, not whole folders. `toy-pickup` has the read-order discipline; this skill is the same idea applied to reporting.

## The output

One table, one row per toy (+ toy box), then at most three lines of "what's actually moving this week" drawn from the rows — no editorialising about whether it's interesting, no capacity commentary about Luke or Dan.

Deliver in chat. Only if Chris asks: a #toys post (**draft-first, always** — short summary in channel, detail in thread, no emoji, per the standing Slack rule) or a small HTML dashboard.

Nothing is written to the vault by this skill — it's a read. If the sweep surfaces drift (a README line contradicting the board, a stale table), name it once and point at `toy-tidy` rather than fixing inline.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the latest-feedback column reads `05 build/feedback/`: the line gained a `04 design/` stage on 28 Aug and build moved up one. The `execution-discipline` load line names the sibling seat in this plugin rather than the retired vault `_meta/skills/` path. First entry here; earlier versions are unrecorded.
