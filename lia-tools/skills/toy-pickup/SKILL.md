---
name: toy-pickup
description: >-
  Load tight context for any Lia Tools session before doing work: the line
  README, the toy's README plus its latest After Action Report, the
  latest meeting notes and feedback summaries, and only the stage-relevant
  strategy docs. Use when Chris says "pick up dump", "work on the toolbox",
  "toys session", "where is drip up to", "what's the latest on a toy", or
  any toy work is about to start and context isn't loaded yet. The front
  door to every toys session — keeps context tight instead of bulk-reading
  the vault. Companions: toy-feedback-ingest (video in), toy-release
  (promotions), new-toy (scaffold), wrap-up (close).
version: 0.4.0
created: 2026-08-16
updated: 2026-09-02
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

1. `Products/Lia Tools/README.md` — the line map: the folder shape, the toys table, the sibling epics, the canonical strategy sources. One read; it's short.
2. **Scope to the work.** For a specific toy (or the toolbox): its `README.md`, then the latest After Action Report — the newest AAR comment on the scope's live ticket first, then the ACTIVE `aar-*.md` in `00 handover/` (a legacy `handover-*.md` counts until an AAR supersedes it). `retro-log.md` is an archive: history only, never the next step.
3. **The recent record:** the latest file(s) in the scope's `meetings/` folder and, for build work, the latest `04 build/feedback/` summary. These carry what the last feedback video actually said.

**Then, by work type — read only the branch that applies:**

| Work type | Also read |
|---|---|
| Building a feature | The line's `standards/` — `toy-contract-2026-08-12.md` and `git-and-release-conventions-2026-08-13.md`. **Requirements are in Linear, not the vault**; anything under `04 build/requirements/` is historical. |
| Design work on a screen or flow | The scope's `03 design/` — specs, flows, `.dc.html` artefacts, reference breakdowns. Frames live at the line's `design/inspiration/`. |
| A release / promotion | `toy-release` (the runbook) — it routes to the versioning standard itself |
| Ingesting a feedback video | `toy-feedback-ingest` |
| Creating a toy | `new-toy` |
| Anything a tool inherits — the contract, accounts, errors, versioning, signing | The line's `standards/`. **Never a tool's own folder** — that is where these used to hide. |
| Data, entities, what a tool stores or passes | The [schema map](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b) first, then `standards/schemas/` for the reasoning. Code is the truth. |
| Platform or competitor research | The line's `research/`, or the vault's `Research/`. **Not inside a tool** — research is tool-agnostic. |
| Moving someone's files | `file-management` — the ten bright lines, before writing anything |
| Strategy / pricing / line questions | The canonical strategy sources listed in the line README — and hold the open-questions rule below |
| Marketing / launch | The toy's `05 marketing/`, plus the line README's strategy sources |

Don't bulk-read a toy's whole folder. If a specific question needs a specific doc, fetch that doc.

## The rules every toys session holds

- **The shape.** Six numbered stages inside the toolbox and each tool — `00 handover / 01 planning / 02 analysis / 03 design / 04 build / 05 marketing` — plus unnumbered `meetings/` at each scope root and `04 build/feedback/` for distilled feedback summaries (CQ, 2026-08-16). At the **line** root, numbered stages plus four unnumbered cross-cutting layers: **`standards/`** (what every tool inherits, `schemas/` included), **`research/`**, **`design/`**, `meetings/`. A numbered stage may stand empty; an ad-hoc subfolder may not. This shape applies **only** inside `Products/Lia Tools/` — never export it.
- **Two old numbering schemes are in the dated record.** Docs written before 28 Aug 2026 say `04 build/` and `05 marketing/`; docs written on the *morning* of 28 Aug say `05 build/` and `06 marketing/`. **Both mean `04 build/` and `05 marketing/` today.** The line README carries the three-column table. Dated records were deliberately not rewritten — translate, don't trust the number.
- **Routing.** Tools mentioned generally → the line level. A specific tool → that tool's folder. The toolbox is the shell, never a tool; `toolbox/` and `tools/` are siblings. **Anything every tool would inherit belongs at the line, not in whichever tool needed it first.**
- **The name is tools** (CQ, 28 Aug 2026, LIAB-935). The vault, the READMEs and these skills say tools. **The code, the `lia-toy-box` repo, `toy-contract.ts`, `src/toys/` and these skills' own `toy-*` names deliberately do not** — they change with the signing move. Seeing "toy" in code is expected, not drift.
- **The strategy is founder-drafted, not ratified.** Six things stay open: pricing model, layer count, price band, one store vs many, the live-toy cap, permanence of the line. Never quote them as settled; a session that needs one settled stops and asks.
- **Linear.** Team Lia Build, project Lia Tools. Labels are type + workflow only (`Bug`, `Feature`, `Improvement`, `Research`, `Experiment`, `idea`) — never epic/phase/sprint labels. Agents never mark a ticket Done; Review is the ceiling. Promotion gates live in `toy-release` and require a founder call **on the ticket**.
- **An After Action Report, every session.** Any session that touches a toy writes one before it ends — on the ticket it worked, per `wrap-up`; the vault copy in `00 handover/` when mounted. Six lines with honest "none"s is a fine report; a missing one isn't.
- **Open with "picking up from <handover>"** so Chris can see the thread you're continuing — and if the handover, retro tail, and the actual state of the repo/board disagree, say so before acting. A report is a claim; the board and the branch are facts.

## Wrapping

When the session ends with state carrying forward, offer `/wrap-up` once — the After Action Report lands on the ticket and, when mounted, in the scope's `00 handover/` (thread rules per `wrap-up`, in this plugin), and `_meta/index.md` + `_meta/log.md` get their rows.

## Changelog

- **0.4.0 (2026-09-02, LIAB-1162)** — the retro entry is the After Action Report: one per session, as a comment on the dispatch ticket per `wrap-up` 2.0.0, the vault copy in `00 handover/` when mounted; retro-logs are archives. The reading order in §Always starts from the AAR; the standing rule and §Wrapping say AAR.
- **0.3.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed. Routing gains four rows: inherited standards, entities via the schema map, tool-agnostic research, and `file-management` for anything touching someone's files. Both retired numbering schemes are named, because the record now holds two.
- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the line gained a design stage: the shape is seven folders with `03 design/`, and build/marketing move up one everywhere this skill names them (`04 build/feedback/`, `05 marketing/`), plus a read row for design work. The PRD pointer was stale twice over — the toy box PRDs sit in `04 build/requirements/`, not at the build root. Companion routes stop pathing at the retired vault `_meta/skills/` and name the sibling seats (`toy-release`, `toy-feedback-ingest`, `new-toy`, `wrap-up`, `execution-discipline`) the way the rest of the plugin does. First entry here; earlier versions are unrecorded.
