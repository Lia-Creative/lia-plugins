---
name: ready-review
slug: ready-review
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/ready-review"
  - "ready-review LIAB-XXX"
  - "is this epic ready"
  - "gate these stories"
  - "review the tickets before build"
companions:
  - epic-builder
  - story-writer
  - task-writer
  - ticket-review
  - orchestrate
maintainer: cq
---

# Ready review — fresh eyes before anything downstream spends work

**What this is.** The gate between Discovery and Design in [Tool shop](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8): a fresh agent evaluates an epic and its children against the standard *before* design or build spend anything on them. It is the evaluation of what would classically be a human PM's judgment call — run every time instead of when someone remembers.

**Why it exists.** A gap caught here costs a rewrite of prose. The same gap caught in QA costs a built wrong thing, a review round-trip, and a builder's day. CQ, 26 Aug: *"a review agent that is designed to review stories and epics against our criteria of success — so that we are creating evaluation of effectively what would typically be a human task."*

**The sibling seat:** `ticket-review` checks **built work** against its acceptance criteria (the exit side). This seat checks **the tickets themselves** before work starts (the entry side). Same discipline — evidence, never approval — different end of the pipeline.

---

## 0. Two hard rules

1. **A fresh session only.** Never review tickets your own session wrote — a session that shaped the frame will defend it. Same rule as `ticket-review`, same reason.
2. **Evidence, never vibes.** Every verdict line quotes the ticket or names the absence. "Looks good" is not a verdict.

## 1. What to check — the epic

Read the epic and every child first, then the [shape doc](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b) and the [Decisions register](https://linear.app/lia-creative/document/decisions-register-lia-toys-34348df61a5f)'s relevant calls. Then, for the epic:

- [ ] **Versioned chunk of value.** Name carries the version; body carries value / why now / what it is not / how you'd know. Not too chunky — buildable as one run, one branch, one PR.
- [ ] **Scope lives in the stories.** No sub-feature list in the epic prose. What 1.0 means is answerable from the children alone.
- [ ] **No acceptance criteria on the parent. No type label on the parent.**
- [ ] **Grounded.** At least one real source wired as a relation or link — and it says what the epic claims it says.
- [ ] **Doesn't re-derive a settled call.** Check the register; an epic quietly reversing a recorded decision fails here, loudly.

## 2. What to check — every story

- [ ] **Name title** (two to four words, sayable), narrative in the body: *As a [named person], I want…, so that…* — and the person is real (adventure chats first; the adventurer beats the cast).
- [ ] **Acceptance criteria in the user's terms** — what a person can now do, observably; checkable by someone who wasn't in the session. Technical specs in the ACs fail the story: that's design's or the tech-notes' layer arriving early.
- [ ] **Sized as one goal.** Six scenarios or fewer; splits along business lines.
- [ ] **The vault-dependence test — the load-bearing one.** Read the story as a build agent with Linear and this plugin and *nothing else*. **If understanding it needs the vault, it isn't ready** — name exactly what has to travel onto the ticket. This is the test most tickets fail first.

## 3. What to check — tasks

- [ ] Named work, one type of the six, right parent, one job.
- [ ] **Not plan line-items.** A run of tasks that read like steps of one plan fails as a set — the plan belongs on the story as the builder's plan-mode comment.

## 4. The verdict — one comment on the epic

One comment, on the epic, in this shape — **verdicts are comments, never labels** (the `gate:*` labels were deleted 25 Aug):

```markdown
**Ready review — <date>, fresh session**

**Epic:** ready | not ready — <the specific gap, quoted or named>
**<story name>:** ready | not ready — <gap> → fix is <epic-builder / story-writer / task-writer / a decision, whose>
…one line per child…

**Verdict:** ready for design | not ready — <n> gaps above.
```

Three rules for it:

1. **A gap names its fix and its seat.** "Not ready" with no named fix blocks silently, which is worse than passing it.
2. **Not-ready goes back, labelled.** `defect:discovery` on the tickets that failed, per the round-trip convention — that's the data the pipeline learns from.
3. **Don't grow the scope.** You're checking readiness against the standard, not redesigning the epic. A better idea you had is a comment marked as such, not a failure.

---

## What this seat is not

- **Not `ticket-review`.** That's built work; this is tickets.
- **Not the founder.** What's *worth building* stays a human call — this gate checks that what was called worth building is ready to be built.
- **Not a taste pass.** The checklist is the contract; a story can be ready and still get better in design.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The entry gate: shape, grounding, user-terms ACs, sizing, the vault-dependence test, and a verdict format with named fixes. Working name — renaming is Chris's.
