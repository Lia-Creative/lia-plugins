---
name: acceptance-criteria
slug: acceptance-criteria
description: "Review discovery and write the final goal-oriented acceptance criteria — numbered Given/When/Then frozen as the contract, [Graded at Review] for judgement calls, Delivery checks split out, 3–7 per story held loudly. Use when scenarios and design are ready and the criteria need freezing before build."
version: 0.1.1
created: 2026-08-26
updated: 2026-09-02
status: active
triggers:
  - "/acceptance-criteria"
  - "write the acceptance criteria"
  - "finalise the ACs"
  - "freeze the criteria"
  - "turn the scenarios into ACs"
companions:
  - scenario-builder
  - story-writer
  - build-prep
  - review-and-merge
  - file-management
maintainer: cq
---

# Acceptance criteria — the goal, frozen as numbered scenarios

**What this is.** The engineering lead reviews the discovery — the story, its walked scenarios, the design — and writes the **final, goal-oriented acceptance criteria the build is run and reviewed against**. This is the freeze point: after this pass the criteria are the contract, cited by index by the builder (as the test spec) and by `review-and-merge` (as the defect rubric). One artefact, four readers.

**Why it exists.** CQ, 26 Aug 2026: *"they review the discovery and write goal oriented acceptance criteria used as part of the build — consider the dan north work."* The form is LIAB-949's P2/P3, installed across the docs the same day; the canonical anatomy is Dan North's ([the article](https://dannorth.net/blog/whats-in-a-story/); vault concept page `Wiki/concepts/user-stories.md`).

---

## The pass

1. **Read in order:** the story's narrative (the goal every criterion serves) → `scenario-builder`'s walked scenarios (the raw material) → the design artefact (which may have changed what a scenario means — reconcile, don't duplicate) → the schema map entries the story touches.
2. **Write each behavioural criterion as one numbered Given/When/Then scenario.** Givens: all of, and no more than, the required context. When: one event. Thens: every material outcome — the state written back, the side effect, the thing everyone forgets. **Goal-oriented means the Then is the user's observable outcome**, not the mechanism — *"the chart follows the transposed key everywhere it's shown"*, never *"the store's debounced write fires"*.
3. **Run the two probes before freezing:** the **missing Given** (could two different outcomes both be true under this context?) and the **forgotten Then** (is every material outcome verified?). One event per scenario — an "and" chaining three behaviours is three scenarios.
4. **Mark the judgement calls.** A criterion a test agent can't decide carries **"[Graded at Review]"** — allowed, rare, honest. Everything unmarked is machine-verifiable: quantified thresholds, explicit behaviours, testable conditions.
5. **Split out the Delivery checks.** Process attestations, ops requirements, understanding-notes are real obligations and are **not** acceptance criteria — their own numbered list, so the AC list is purely behaviour.
6. **Hold the size line.** 3–7 behavioural criteria per story; more means it's two stories — hand it back to `story-writer` split along user value, and *say so* rather than absorbing the bloat (the rule that sat unenforced while a bundle grew 6→9).
7. **Freeze, dated.** Edit the ticket's description (a comment does not unsay a description); note what changed from the draft ACs and why. From here, a criterion changes only via the hand-back path with the change dated on the ticket.

## What this seat is not

- **Not the story writer.** The narrative and the draft user-terms ACs are `story-writer`'s; this pass sharpens and freezes, it doesn't re-author the value.
- **Not build prep.** How to build it — paths, patterns, traps — is `build-prep`'s layer, and it lands *under* these criteria, never inside them.
- **Not a bypass of the gate.** If the story fails the five checks on arrival, that's a `ready-review` fail routed back to discovery — not something to quietly repair here.

## Changelog

- **0.1.1 (2026-09-02, LIAB-1161)** — `lead-engineer` is `engineering-lead` — reference only: the seat's name now follows its discipline, like the other four leads. No rule changed.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The freeze pass: scenarios → numbered G/W/T, the two probes, [Graded at Review], the Delivery-checks split, the 3–7 line held loudly.
