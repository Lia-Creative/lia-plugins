---
name: design-exploration
slug: design-exploration
description: "Explore genuinely distinct design directions from the job and its stories before anything is drawn for keeps — each direction names what it optimises for, one gets chosen with why, the rest are recorded not lost. Use when a ready story needs ideas explored, when asked for design options, or before any hi-fi work starts on a new surface."
version: 0.1.1
created: 2026-08-27
updated: 2026-08-27
status: active
triggers:
  - "/design-exploration"
  - "explore some directions for this"
  - "design options for [story]"
  - "what could this look like"
companions:
  - design-reference
  - design-flows
  - design-lead
  - jtbd
  - scenario-builder
maintainer: cq
---

# Design exploration — distinct directions, then one chosen out loud

**What this is.** The first production seat of the design stage: from the job, the story and its scenarios, produce **genuinely distinct directions** — not three variations of one idea — and converge on one, with the choice and its reasons recorded where the next seat can find them.

**Why it exists.** CQ, 26 Aug 2026: the design stage is *"taking product reqs, exploring ideas, transforming them into clear flows, hifi design…"* — exploration is the step that stops the first idea becoming the only idea. A direction chosen silently gets re-litigated by every later seat; a direction chosen out loud gets built.

---

## 1. Start from the job, never from a screen

The inputs are the ready story, its scenarios, and the job's outcome — what progress the person is hiring this surface for. A direction that can't say which scenario it serves is decoration. If the story hasn't passed `ready-review`, it isn't ready to explore; that's a question to `discovery-lead`, not a head start.

## 2. Diverge — distinct means distinct

- **Two to four directions, each optimising for something different** — speed of the common case, legibility for a first-timer, density for a power user. Name the optimisation on each; if two directions share one, they are one direction.
- **The instruments:** a Claude Design canvas for greenfield surfaces; `design-and-refine` for variations on a real component in an existing repo. Rough is correct here — fidelity spent before a direction is chosen is fidelity thrown away.
- **Steal honestly.** `design-reference` first — it finds what the vault already holds and breaks it down cited to frames; `ui-teardown` findings on comparable products are legitimate inputs too. Cite the shot, not the memory.

## 3. Converge — the choice is the artefact

One direction chosen, and on the ticket: **which, why, and what each not-chosen direction would have been better at.** The not-chosen record is what stops the third re-design; the trade-off named is what lets the founder overrule cheaply now instead of expensively later. Settled decisions from the register are not re-opened by a new direction that "just wants to try".

## 4. Hand off

`design-flows` takes the chosen direction and walks every scenario through it. If flowing the direction breaks it, that's a finding back to this seat — a cheap failure, which is the point of exploring first.

## What this seat is not

- **Not flows or hi-fi.** Directions, not screens; the drawing for keeps happens downstream.
- **Not a licence to re-open settled decisions.** The register wins; exploration happens inside it.
- **Not brand or DS invention.** Directions are expressed with the system we have; a direction that needs a new design system is a conversation with a founder, named as such.

## Changelog

- **0.1.0 (2026-08-27, CQ + LIAB-995)** — first version. The exploring-ideas step of CQ's design stage as its own seat: distinct-by-optimisation divergence, the recorded convergence, and the cheap-failure hand-off to flows.
- **0.1.1 (2026-08-27, CQ + LIAB-1000)** — steal-honestly routes to `design-reference` for reference the vault already holds, ahead of capturing a product fresh.
