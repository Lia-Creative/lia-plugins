---
name: toy-pickup
description: >-
  Load tight context for any Lia Toys session before doing work: the line
  README, the toy's README plus ACTIVE handover plus retro-log tail, the
  latest meeting notes and feedback summaries, and only the stage-relevant
  strategy docs. Use when Chris says "pick up dump", "work on the toy box",
  "toys session", "where is drip up to", "what's the latest on a toy", or
  any toy work is about to start and context isn't loaded yet. The front
  door to every toys session — keeps context tight instead of bulk-reading
  the vault. Companions: toy-feedback-ingest (video in), toy-release
  (promotions), new-toy (scaffold), wrap-up (close).
version: 0.2.0
created: 2026-08-16
updated: 2026-08-28
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-feedback-ingest, toy-release, new-toy, wrap-up, execution-discipline]
---

# Toy pickup — the toys front door

**Why this exists.** Chris wants the toys process tight in terms of context: every session reads the same small set of the right files, in the same order, and nothing else. Loose context is how sessions re-decide settled things, quote open questions as settled, and file work in the wrong shape.

**Load `execution-discipline` first** (in this plugin) if this session will execute work (not just answer a question).

## The read order

**Always, in this order:**

1. `Products/Lia Toys/README.md` — the line map: the folder shape, the toys table, the sibling epics, the canonical strategy sources. One read; it's short.
2. **Scope to the work.** For a specific toy (or the toy box): its `README.md`, then the ACTIVE handover in `00 handover/` (the one without a superseded banner), then the last 2–3 entries of `00 handover/retro-log.md`.
3. **The recent record:** the latest file(s) in the scope's `meetings/` folder and, for build work, the latest `05 build/feedback/` summary. These carry what the last feedback video actually said.

**Then, by work type — read only the branch that applies:**

| Work type | Also read |
|---|---|
| Building a feature | `toy box/03 strategy/toy-contract-2026-08-12.md`, the relevant PRD in `05 build/requirements/`, `toy box/03 strategy/git-and-release-conventions-2026-08-13.md` |
| Design work on a screen or flow | The scope's `04 design/` — specs, flows, personas, scenarios, reference breakdowns |
| A release / promotion | `toy-release` (the runbook) — it routes to the versioning standard itself |
| Ingesting a feedback video | `toy-feedback-ingest` |
| Creating a toy | `new-toy` |
| Strategy / pricing / line questions | The canonical strategy sources listed in the line README — and hold the open-questions rule below |
| Marketing / launch | The toy's `06 marketing/`, plus the line README's strategy sources |

Don't bulk-read a toy's whole folder. If a specific question needs a specific doc, fetch that doc.

## The rules every toys session holds

- **The shape.** Numbered lifecycle (`00 handover / 01 planning / 02 research / 03 strategy / 04 design / 05 build / 06 marketing`) plus the unnumbered `meetings/` folder at each scope root and `05 build/feedback/` for distilled feedback summaries (CQ, 2026-08-16). **`04 design/` became a stage on 28 Aug 2026** (CQ, LIAB-1006), pushing build and marketing up one — anything dated before then says `04 build/` and `05 marketing/` and was true when written; translate with the table in the line README rather than trusting the number. This shape applies **only** inside `Products/Lia Toys/` — never export it to other products.
- **Routing.** Toys mentioned generally → the line level. A specific toy → that toy's folder. Toy box is the shell, never a toy; `toy box/` and `toys/` are siblings.
- **The strategy is founder-drafted, not ratified.** Six things stay open: pricing model, layer count, price band, one store vs many, the live-toy cap, permanence of the line. Never quote them as settled; a session that needs one settled stops and asks.
- **Linear.** Team Lia Build, project Lia Toys. Labels are type + workflow only (`Bug`, `Feature`, `Improvement`, `Research`, `Experiment`, `idea`) — never epic/phase/sprint labels. Agents never mark a ticket Done; Review is the ceiling. Promotion gates live in `toy-release` and require a founder call **on the ticket**.
- **Retro, every session.** Any session that touches a toy appends one entry to that toy's `00 handover/retro-log.md` before it ends. "None, routine work" is a fine entry; a missing one isn't.
- **Open with "picking up from <handover>"** so Chris can see the thread you're continuing — and if the handover, retro tail, and the actual state of the repo/board disagree, say so before acting. A report is a claim; the board and the branch are facts.

## Wrapping

When the session ends with state carrying forward, offer `/wrap-up` once — the handover lands in the scope's `00 handover/` (thread rules per `wrap-up`, in this plugin), the retro entry gets appended regardless, and `_meta/index.md` + `_meta/log.md` get their rows.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the line gained a design stage: the shape is seven folders with `04 design/`, and build/marketing move up one everywhere this skill names them (`05 build/feedback/`, `06 marketing/`), plus a read row for design work. The PRD pointer was stale twice over — the toy box PRDs sit in `05 build/requirements/`, not at the build root. Companion routes stop pathing at the retired vault `_meta/skills/` and name the sibling seats (`toy-release`, `toy-feedback-ingest`, `new-toy`, `wrap-up`, `execution-discipline`) the way the rest of the plugin does. First entry here; earlier versions are unrecorded.
