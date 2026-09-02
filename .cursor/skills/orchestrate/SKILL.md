---
name: orchestrate
slug: orchestrate
description: "Superseded pointer (26 Aug 2026): the orchestrator split — load project-manager for the board, dispatch and updates; load engineering-lead for tech prep, review and merges. Use only to find where the orchestrator's jobs went."
version: 0.3.2
created: 2026-08-21
updated: 2026-09-02
status: superseded — pointer
triggers:
  - "/orchestrate"
  - "be the orchestrator"
  - "you run the board"
  - "orchestrate the [milestone] run"
  - "co-ordinate the agents on X"
companions:
  - project-manager
  - engineering-lead
maintainer: cq
---

# Orchestrate — this seat split in two on 26 Aug 2026

The orchestrator was promoted and split (CQ, 26 Aug 2026 — decisions register):

- **Running the board** — sequencing, dispatch, statuses kept true, human-readable updates, context-on-tickets enforcement → **load `project-manager`.**
- **The technical judgment** — architecture, the final acceptance criteria, build prep, the pickability check, review-and-merge, security → **load `engineering-lead`** (which routes across its bench).

Dispatched at a milestone with both jobs implied? Two sessions, one seat each — the split exists because one seat holding both is how requirements and judgment blur. Every discipline from `orchestrate` 0.1.0–0.2.0 survives, credited, in the two successor seats; nothing was softened in the move.

## Changelog

- **0.3.2 (2026-09-02, LIAB-1161)** — `lead-engineer` is `engineering-lead` — reference only: the seat's name now follows its discipline, like the other four leads. No rule changed.
- **0.3.1 (2026-08-26, LIAB-959)** — `<milestone>` in `triggers:` becomes `[milestone]`, so no frontmatter here carries angle brackets for Cowork's validator to read as a tag. Pointer content unchanged.
- **0.3.0 (2026-08-26, CQ voice memos + Fable 5)** — becomes this pointer. Board half → `project-manager` 0.1.0; technical half → `lead-engineer` 0.1.0 and its bench (`build-prep` carries §4.5, `review-and-merge` carries §5).
- **0.2.0 (2026-08-26)** — the tool shop expansion: tech notes, epic dispatch, the direct review loop.
- **0.1.0 (2026-08-21, CQ + Cowork)** — first version, generalised from the 20 Aug internal-testing run.
