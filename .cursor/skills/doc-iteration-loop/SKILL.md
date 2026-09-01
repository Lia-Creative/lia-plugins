---
name: doc-iteration-loop
slug: doc-iteration-loop
description: "Turn a doc epic's backlog into the next iteration of the document — waves from the blocked-by DAG, draft then fresh-eyes gate then revise, snapshot before drafting, the founder's lock at the end. Use when a founder document needs its next version built, when a review distillation has become a backlog, or when asked to run the doc loop or a wave."
version: 0.3.0
created: 2026-07-11
updated: 2026-08-28
status: active
maintainer: cq
triggers:
  - "run the doc loop"
  - "iterate the doc"
  - "run the quality gates on this doc"
  - "run wave N"
  - "build the next iteration of the strategy"
  - "doc iteration loop"
companions:
  - prototype-feedback-loop
  - ticket-builder
  - backlog-grooming
  - execution-discipline
---

# Doc iteration loop

**What this is.** The write side of the doc loop. `prototype-feedback-loop` is the read side: a founder reviews a rendered doc (print + pen + video), the review is distilled, the distillation becomes a backlog. This skill is what happens next: the backlog becomes the next iteration of the document, section by section, each section passing an adversarial quality gate in Claude Code before it lands. Together the two skills close the circle: review -> backlog -> build -> review.

**When to use.** Any founder document big enough to carry an epic: a strategy, an operating model, a vision doc, a playbook. Cross-founder and domain-agnostic. First instantiation: the Chris strategy FY26/27 (epic CQ-327, Chris Quinton team).

## Preconditions (build these first if missing)

1. **A backlog in the doc's epic** where each ticket is one section or layer, with observable acceptance criteria and a real quality metric (ticket-builder shape). No backlog -> run `prototype-feedback-loop` + `ticket-builder` first.
2. **An honest blocked-by DAG** so the work self-orders.
3. **Jam tickets** (Research label) for the open decisions, wired to block what they gate. Jams are founder work; the loop never resolves them by itself.
4. **A render** the founder can review (print HTML, PDF, one-pagers).

## The loop (one iteration)

0. **Ground.** Load the `execution-discipline` skill (mandatory for any skill run). Pull the epic and all children live from Linear, with relations. Never run from a stale execution order.
1. **Execution order.** Derive waves from the live DAG (earliest availability). Jams are wave 0 and founder-only; record the latest wave each jam must land before. Write or refresh the instance file beside the doc from `templates/execution-order.md`. That file carries per-ticket status and makes runs resumable.
2. **Snapshot.** Before drafting, snapshot the current doc into a dated `iterations/` copy beside it — the same preserve-before-building rule as the feedback loop. Never draft over the only copy of the state the founder reviewed.
3. **Per ticket: draft -> review -> revise.**
   - **Draft.** Context pack: the ticket (live), the source distillation, the current section, the doc skeleton, and the house-style refs the ticket names. Write the section. One job; respect scope and non-goals.
   - **Review, fresh eyes.** A separate context that did NOT draft (a subagent, or a second session) loads ONLY the gate rubric + the ticket + the drafted section. Mechanical checks first, then judgment checks. Verdict: PASS or REVISE with findings (what, where, which check, suggested fix).
   - **Revise.** Address the findings, re-review. Cap at 3 loops; still failing -> mark the ticket flagged for the founder and move on. Never force a pass; never soften the rubric mid-run.
   - **Bookkeeping.** The review verdict lands as a ticket comment. Status moves to Done only when the section has passed AND been integrated. Gates are process artifacts, not statuses or labels — respect the team's own workflow (the CQ team runs the simple six; `gate:*` labels are Lia Build machinery, don't import them).
4. **Wave gate.** Integrate the wave's sections into the working doc. Re-run the mechanical sweep across the WHOLE doc (drift check — a later section can break an earlier check). Post a wave summary on the epic: passed / flagged / what unblocks next.
5. **Human gate.** After the final wave (or any wave the founder wants eyes on): regenerate the render and hand it over. The founder's review runs through `prototype-feedback-loop`; the distillation becomes the next iteration's backlog delta — new tickets under the same epic via `ticket-builder` (extend the epic, never duplicate it), groomed by `backlog-grooming`.
6. **Lock.** The integrate-and-lock ticket is the founder's sign-off. It is never auto-passed.

## The gate rubric

Two tiers, instantiated per doc from the epic's through-lines (template: `templates/gate-rubric.md`; the instance lives beside the doc):

- **Mechanical** — checks grep settles: banned terms, required blocks per section, TOC present, dash and voice rules, tactics markers inside a strategy body. Run these first; they are free.
- **Judgment** — a named reviewer persona (e.g. "a sharp brand strategist reading cold"), calibrated on the founder's own annotated pages, applying the ticket's quality metric plus the doc-level reads.

Rubric changes happen between iterations with founder sign-off, never mid-run.

## Claude Code mechanics

- Run from the vault folder that holds the doc. One wave per session is the comfortable unit.
- Fresh-eyes review = a subagent (Task) or a second session that loads only rubric + ticket + section. The drafting context must not grade its own work.
- The execution-order instance file is the resume point: per-ticket status (pending / drafted / in review / passed / flagged / integrated / done).
- Prompt skeletons for the three roles: `templates/ticket-prompt.md`.
- **Sensitive content rule.** If the doc's source material carries content deliberately held out of shared docs (see the source distillation's own guardrails), the drafts and the rubric inherit that boundary: reference the framing level, never surface the specifics.

## Worked example

The Chris strategy FY26/27 — epic CQ-327 (Chris Quinton team, project The Chris strategy), 23 sub-tasks including two jams. Instance files beside the doc in `chris vault/02 studio/chris quinton/business/strategy/Foundation Strategy FY 26-27 (attractive chris)/`: `cq-327-execution-order.md` (4 waves + lock; jam CQ-347 must land before wave 2, CQ-348 before wave 3) and `cq-327-gate-rubric.md` (mechanical + judgment tiers distilled from the 2026-07-10 review's through-lines). Iteration 1's read side was `feedback-2026-07-10.md`: captured by `prototype-feedback-loop`, ticketed by `ticket-builder`, lifted by a second-pass groom.

## Runner lifecycle

The execution order and the gate rubric are build scaffolding, not strategy. They live beside the doc while the iteration runs, but once the doc is locked they are noise in the doc's folder. Archive them (into an `archive/` beside the doc) when the build completes, keeping them reachable for the next iteration. A strategy folder should read as the strategy plus its sources, not the machine that built it.

## Housekeeping

Per Lia `CLAUDE.md`: log runs in `_meta/log.md` (Lia docs) or the founder vault's ops log (personal docs); update the relevant index; if the doc lives in `Products/<Product>/`, append the product retro entry. Skill changes bump the version and land in the changelog — **in the plugin**, which is canonical since 26 Aug 2026 (LIAB-919); the vault's `_meta/skills/doc-iteration-loop/` copy is frozen.

## Tiering a strategy doc (from the Chris strategy, 2026-07-12)

A big strategy doc tends to grow two organising logics that fight: a front half organised by subject (the areas, the products) and a back half organised by function (the operating layers), each function sliced thinly across every subject. It reads as "a variety of concepts" because it is. When a founder says the back half doesn't build the subjects out specifically, the fix is usually not more detail, it is a **cut by subject-vs-shared, not by function**:

- **Tier 1, the strategy:** high level, the thinking and the outcomes. Read and annotate.
- **Tier 2, the chapters:** one per subject, each owning its full stack (its goals, its money, its numbers, its formats).
- **Tier 3, the operating system:** only the genuinely shared machinery, plus the shared *rules* the chapters obey (defined once, instanced per chapter, so they do not drift).

Do not make a doc per function (a "numbers doc", a "formats doc") - that rebuilds the same thin slicing in new files. The tell that a "layer" is really subject-level: its rows are one-per-subject and the subjects barely interact. Gate the result on tier fit, definition-vs-instance, cross-ref integrity, and outcome laddering.

## Changelog

- **0.3.0 (2026-08-28, LIAB-1028)** — lands in the plugin, on CQ's call. Adds the `description:` frontmatter it never had: it is what a session's skill listing shows and what auto-triggering runs on, so without one the skill was invisible to the sessions meant to load it (repo rule 2, and CI would have refused it). Repoints the two templates and the ticket prompt off retired `_meta/skills/` paths — a plugin install has no way to reach them (the LIAB-963 class) — onto the house `[this skill]/` form. §Housekeeping now says the plugin is canonical and the vault copy is frozen. **The method is unchanged**: the waves, the gate rubric, the three-loop cap and the founder's lock are all as written.

  Two further defects came with the source (four in total, with the missing description and the unreachable paths above) and were repaired here rather than carried in. **The vault copy's frontmatter said `version: 0.1.0` while its changelog's newest entry was `0.2.0`** — one skill, two answers, which is the precise failure `CLAUDE.md` rule 3 exists to stop and which this repo's version guard now catches (LIAB-1016). This entry is therefore **0.3.0**, following the changelog rather than the frontmatter. And **21 escaped apostrophes** — a backslash before every `'`, so a loading session reads the backslash — were sitting in the source: 14 in `SKILL.md`, 4 in `gate-rubric.md`, 3 in `ticket-prompt.md`, none in `execution-order.md`. Repaired. The copy itself was byte-faithful — `cmp` clean before any edit — so both defects are the vault's, not the port's.

- **0.2.0 (2026-07-12, CQ):** Added the strategy-tiering pattern (cut by subject-vs-shared, not by function) after the Chris strategy restructure; added suite-level structural checks to the gate.

- **0.1.0 (2026-07-11, CQ):** Initial version, distilled from the Chris strategy FY26/27 backlog build + second-pass review (CQ-327). Draft -> fresh-eyes gate -> revise per ticket; waves from the DAG; snapshot before drafting; human gate via prototype-feedback-loop; lock is founder sign-off.
