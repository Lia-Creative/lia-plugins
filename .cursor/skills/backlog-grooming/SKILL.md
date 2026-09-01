---
name: backlog-grooming
slug: backlog-grooming
description: How Lia keeps an existing Linear backlog healthy — the maintenance pass, not authoring. Sweep a project/team/cluster, audit every ticket against the CURRENT ticket-builder standard, check board integrity (parent-vs-children status, dependencies-as-relations, stale/orphan/duplicate tickets, label + priority sanity), then apply the safe fixes and flag the rest. Use when someone says "groom the backlog", "tidy the board", "audit the tickets", "check the tickets against the skill", "are these up to standard", "board hygiene", "clean up the backlog", or after the ticket standard changes and the old tickets need re-sweeping. Companion to ticket-builder (which authors one ticket); not planning (cycles + product-management own that).
version: 0.2.0
created: 2026-06-25
updated: 2026-08-28
status: draft
maintainer: dan
reviewed_by: chris (draft 2026-06-25, CQ-driven — for Dan review)
companions:
  - ticket-builder
triggers:
  - "groom the backlog"
  - "tidy the board"
  - "audit the tickets"
  - "check the tickets against the skill"
  - "are these tickets up to standard"
  - "board hygiene"
  - "backlog health check"
  - "clean up the backlog"
  - "spot check the tickets"
---

# Backlog Grooming

> **Status: draft (v0.1.0).** Scaffolded 2026-06-25 from the Musician OS grooming passes (CQ-driven). For Dan review — open questions at the bottom. This captures a workflow we ran by hand ~5 times in one session; codify it so any agent runs it the same way.

**Trigger:** any request to tidy, audit, health-check, or groom an *existing* backlog — a whole project, a team, or a cluster. Also "backlog grooming" by name. Fires especially after the ticket standard moves and the old tickets need bringing up to date.

**Purpose:** keep a backlog honest and readable over time. ticket-builder writes one ticket well; this keeps the whole board well. **Grooming is maintenance, not authoring** — it does not invent new tickets, decide what's worth doing, or plan the cycle.

---

## The seam — what grooming is, and isn't

- **ticket-builder = authoring.** How to write one ticket/epic: the shapes, grounding, sequencing, the rubric. **Grooming reuses that rubric — it never redefines the standard.** If the standard needs to change, that lands in ticket-builder, then grooming sweeps against the new version.
- **Grooming = maintenance.** Sweep what already exists; find drift + board-untruths; fix the safe ones; flag the rest.
- **NOT planning.** What goes in the cycle, sequencing a sprint, capacity — that's Lia Build cycles + the product-management skills (`sprint-planning`, `roadmap-update`). Grooming doesn't decide priorities; it checks they're *deliberate and consistent*, not what they should be.
- **NOT intake.** "Is this worth doing" is Phase 0 / `LIA-281`. Grooming assumes the tickets already exist.

---

## What good grooming feels like

1. **Audit against the live standard, not memory.** The ticket-builder skill moves (it went 0.1.1 -> 0.3.1 in two days). Re-read the current standard at the start of every pass and audit against *that* — the canonical shape doc ([How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b)), plus this plugin's `ticket-builder` / `epic-builder` / `story-writer` / `task-writer` (canonical since 26 Aug 2026 — not the vault's frozen copies). Auditing against a remembered version is the classic stale failure.
2. **Don't churn in-flight work.** A ticket in Build / Review / QA is what someone is building or testing right now. **Fix-forward:** leave its body alone; apply the standard to Backlog/Todo tickets and to new work. Low-risk touches (a title, a status correction) are fine in-flight; rewriting a description mid-build is not.
3. **Know the safe-fix line.** Some findings are safe to fix in place; some must be flagged for a human. Getting this line right (Step 5) matters more than volume — an over-eager rewrite is worse than an honest flag.
4. **The board tells the truth.** Status and relations reflect reality. Headline rule: **a parent never sits in Review/QA ahead of its children** (ticket-builder Principle 4 / v0.3.1).
5. **Report, then fix — founder-driven.** Show the findings; fix the safe set; recommend the rest. A founder driving the session is agreement (Lia Vault `CLAUDE.md`).

---

## Step 1 — Scope the pass

Pick a clear boundary: one **project** (e.g. Musician OS), one **team**, one **cluster** (an epic + its children), or "everything in QA/Review." One project at a time reads cleanly. Note the lens (whose work — Dan/CQ/Luke) for the founder-driven rule + cross-founder courtesy.

## Step 2 — Load the current standard

Read the live `ticket-builder` — it is in this plugin, beside this file — and note its **version**, the current **shapes** (Shape A / Shape B / epic JTBD), and the **Step 7 checklist**. That checklist is your conformance rubric; this skill adds the board-integrity checks on top. Confirm Linear coordinates/conventions from the Lia Vault `CLAUDE.md` (teams, statuses, labels) — those move too.

## Step 3 — Pull the backlog

`list_issues` for the scope (statuses, parents, labels, priorities). `get_issue` (full description + `includeRelations`) for anything you'll audit deeply or whose relations you must verify. Build the **parent -> children map** — you need it for the board-integrity checks.

## Step 4 — Audit each ticket (two passes)

**A. Conformance — does it meet the current ticket-builder shape?** Run the live Step 7 checklist. As of v0.3.x:
- One job, no smuggled "and".
- Reads in 30s: epic = JTBD/User/Success/Why; feature = user story + tickable acceptance criteria.
- Human + plain — speaks to a named person (who-we-serve), no spec-mush.
- Grounded — and the links live as **relations**, not `LIA-xxx` chips smeared through the prose.
- Shape matches the project's siblings (Shape A for Lia Build features, Shape B for Lia Creative workstreams).
- Plain verb-phrase **title, no number / code prefix** (catch `1.`, `F1 ·`, etc.).
- Right team / valid status / deliberate priority / right type label / assigned to whoever does it.

**B. Board integrity — does the board tell the truth?**
- **Parent ahead of children** — a ticket in **Review/QA** with any sub-issue not Done/Cancelled is a violation (v0.3.1). Move the parent back.
- **Dependencies real** — the blocked-by/related relations match reality and don't live only in prose.
- **Labels** — type + workflow only; no epic/phase/sprint labels.
- **Stale** — an "active" ticket with no movement is worth a flag. **Provisional threshold until Dan settles the open question below: one full cycle (2 weeks) with no activity for started tickets; 4 weeks for Todo/Backlog.** Stale means FLAG, never an automatic status move — "stale or just slow?" is a judgment call, and judgment calls are flag-territory per Step 5.
- **Orphans / duplicates** — a ticket pointing at a doc/sibling that doesn't exist; two tickets doing the same job.

## Step 5 — Classify each finding

- **PASS** — meets the standard, leave it.
- **SAFE-FIX** — fix in place now. Safe set: Backlog/Todo ticket bodies; **titles** (any status); **status-integrity moves** (e.g. a parent out of QA — directed by the rule); wiring a missing relation; a label correction.
- **FLAG** — needs a human or carries build risk. Flag, don't fix: **descriptions of Build/Review/QA tickets** (fix-forward); judgment calls (is this really two tickets? stale or just slow?); cross-founder lane changes.

## Step 6 — Apply + report

Apply the SAFE-FIX set. Produce a **findings table** — per ticket: verdict + what changed or what's flagged. Recommend the FLAG set with a one-line reason each. Keep it scannable (CQ scans, doesn't read).

## Step 7 — Wrap up

- **Log** to `Lia Vault/_meta/log.md` (`## YYYY-MM-DD | cleanup | <scope> groom`): what was swept, fixed, flagged, and the standard version audited against.
- **Index** — only if you created/renamed docs.
- **Cross-founder courtesy** — if the pass touched another founder's lane, flag it in the log.
- **Skill drift** — if the backlog failed because the *standard* moved (not because the old tickets were bad), say so. A fix-forward backlog is the norm, not a defect.

---

## What grooming does NOT do

- Author new tickets -> `ticket-builder`.
- Decide what's worth doing -> intake / `LIA-281`.
- Plan the cycle / sequence a sprint / set capacity -> Lia Build cycles + `product-management:sprint-planning` / `roadmap-update`.
- Redefine the ticket standard -> that's `ticket-builder`'s; grooming only enforces it.

---

## Open questions (for Dan review)

- **Staleness threshold** — what counts as stale (2 weeks? a cycle? per-status)? *Provisional default now written into Step 4B (2w started / 4w unstarted) so runs don't invent their own; confirm or change.*
- **Auto-fix boundary** — is the SAFE-FIX set above right, or should titles/status-moves be flag-only by default?
- **Cadence** — on-demand only, or a scheduled sweep (a cycle-boundary / weekly board-hygiene pass, like the wiki lint)?
- **Scope default** — one project at a time, or a whole-team sweep?
- **Output home** — findings in chat only, or also a rolling-queue file (like `Inbox/lia-lint.md`) for triage? *Until decided: chat for founder-driven runs; any unattended run must also write the findings table to the session log — findings that exist nowhere durable are findings lost.*

## Changelog

- **0.2.0 (2026-08-28, LIAB-963)** — Step 2 sent a grooming run to `_meta/skills/ticket-builder/SKILL.md`, retired on 26 Aug (LIAB-919), to fetch the standard the whole sweep audits against. It names the sibling seat in this plugin instead. The Lia Vault `CLAUDE.md` reference in the same step is kept: Linear coordinates, teams, statuses and labels genuinely still live there.
- **0.1.0 (2026-06-25, CQ — draft):** Scaffolded from the Musician OS grooming passes (conformance sweep to ticket-builder v0.3.x + the parent-vs-children board rule). For Dan review.
