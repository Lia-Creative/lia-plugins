---
name: problem-definition
slug: problem-definition
description: "Formalise a problem — one line, evidence cited, a home on the board — and map problems across the board (atom 16 brief shape, atom 20 systemic mapping). Use when a raw observation, complaint, or friction needs to become a formal problem before a job or epic is written, or when asked which problems exist and recur."
version: 0.2.0
created: 2026-08-26
updated: 2026-08-28
status: active
triggers:
  - "/problem-definition"
  - "define the problem"
  - "formalise this problem"
  - "map the problems"
  - "what problem is this actually"
companions:
  - jtbd
  - epic-builder
  - scenario-builder
  - schema-manager
maintainer: cq
---

# Problem definition — the problem stated once, properly, with a home

**What this is.** The seat that turns a raw observation — a complaint in an adventure chat, a friction Chris hit, a hunch — into a formal problem: stated in one line, evidenced, connected to its siblings, and given a home the rest of the shop can cite. It is also the seat called to **map problems across the board** — which problems exist, which recur, which are one problem wearing three coats.

**Why it exists.** CQ, 26 Aug 2026: discovery had writers but nothing that formalised the problem itself, so epics were being grounded in whatever prose was nearest. Everything downstream — the job, the epic, the stories — cites a problem; a mushy one propagates mush.

**Canon this seat runs on (vault-mounted — this is a discovery seat):** the problem-brief schema is **atom 16** (`Operations/Agentic Workflows/Assets/16 — Problem-brief schema.md`; template at `Assets/templates/problem-brief.md`); cross-problem structure is **atom 20** (`20 — Systemic-problem mapping + stage tracking.md`; template `systemic-problem.md`). For toys work, the discovery backbone at `Products/Lia Tools/02 discovery/` holds the problem pages, adventurer profiles and the insights ledger — evidence accumulates there, sourced to a chat and a timestamp. Point at these; don't restate them.

---

## 1. One problem

1. **State it in one line, in the person's terms.** Not "no centralised asset pipeline" but what a person cannot do or keeps paying for. If the one-liner needs an "and", it's two problems.
2. **Evidence, cited.** Every claim sources to something real — an adventure chat with a timestamp, a measured number, a founder's own words quoted. The discovery rule travels: a real adventurer beats the who-we-serve cast; **an insight in the ledger is a hypothesis with sources, not settled strategy**.
3. **Fill the brief to atom 16's shape** (the template, not memory) — the problem, who has it, the evidence, what it costs, what's been tried, the recommended cut. Deliberately **storyless and soft-criteria'd**: stories are written at Design, not here.
4. **Give it a home.** For toys: a problem page in `02 discovery/problems/` (evidence accumulates; same shape every time). Board-side, a problem that warrants work becomes a `Decision` or `Research` ticket or feeds an epic — never a bare one-liner ticket.

## 2. Mapping across the board

When the ask is the map, not one problem:

- **Sweep the sources** — the problem pages, the insights ledger, `feedback`-labelled tickets, open Decisions — and cluster by *the person's situation*, never by component.
- **Name the duplicates.** One problem in three coats gets one canonical page; the others point at it.
- **Systemic problems get atom 20's shape** — the ones that recur across products and stages, tracked rather than re-discovered.
- **Output is a map with owners**, not a fix list: which problems are live, which have jobs (→ `jtbd`), which have epics, which are unowned. Unowned and recurring is the finding.

## What this seat is not

- **Not the job.** The problem is what hurts; the job (`jtbd`) is the progress someone is hiring for. Write the problem first.
- **Not solutioning.** A problem brief that names a feature has skipped ahead — strike the feature, keep the pain.
- **Not validation.** Evidence gathered here says the problem exists; whether it's worth solving is the founder's call at the epic gate.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The formalising seat over atom 16 / atom 20 and the toys discovery backbone.
