---
name: build
slug: build
description: "The builder's seat for a whole epic — context from tickets/design/prep-notes/schema-map (never the vault), plan mode first with the plan posted to tickets, story-by-story on one branch, questions batched, progress in user terms, indexed self-check, one PR, hold for the review loop. Use when dispatched at an epic to build."
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/build"
  - "build the epic"
  - "take the whole epic"
  - "you're the builder on this"
companions:
  - pickup
  - polish
  - review-and-merge
  - execution-discipline
maintainer: cq
---

# Build — the builder's seat, plan mode first

**What this is.** How an agent builds work in the shop: where the context is, how to pick it up, how to keep the board and the tickets current as you go, how to batch questions instead of dripping them, how to check your own work, and how to hand it to the review loop. **You start in plan mode and only then move into building.**

**Lineage.** `pickup` 0.7.0's epic mode, promoted to its own seat (26 Aug 2026) and extended with the batching, progress and self-check disciplines. `pickup` remains the front door for taking on work and handing it back; this is the seat you sit in once a build is yours.

**Your context is exactly four things, and none of them is the vault:** the tickets (the epic, its stories, the frozen numbered criteria and Delivery checks), the design artefacts on them (which win over prose), the lead engineer's build-prep notes, and the [schema map](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b). If something you need isn't in those, that's a gap to raise (§4) — never a licence to guess, and never a reason to go hunting in places the next builder won't have.

---

## 1. Plan first, and the plan lands on the tickets

1. **Read everything before planning** — the epic, every story in dependency order, the prep notes, the design artefacts, the schema entries. Verify the done-when list before doing work it describes: some of it may already be true, and re-doing it is the expensive mistake.
2. **Plan in plan mode.** This is where task-grain thinking happens — Linear deliberately doesn't hold it as tickets.
3. **Post the plan to the tickets it plans** — a comment per story, the epic-wide shape on the epic. The plan is what the review loop and any future session reads; a plan that lives only in your session dies with it.

## 2. Build, story by story

- **One branch — the epic's Linear branch name — one PR at the end.** Conventional commits scoped per ticket.
- **In dependency order**, hint-checking as you go: build-prep's named components and methods are advisory — verify against the repo, implement the correct one, log the drift.
- **The criteria are the contract, by index.** Build to the numbered scenarios; they are your test spec. A criterion you can't satisfy is a batched question (§4), never a silent reinterpretation.
- **`polish` runs on every story with a design spec** before you call that story done.

## 3. The board and the tickets stay current as you go

- **Move each story's status the moment it's true** — and the epic's.
- **A progress comment when a story lands**: what a person can now do (not which module changed), plus anything the next story inherits.
- **A mid-build discovery** — a bug found, a decision needed — goes onto the board in `task-writer` shape (typed, parented), not silently into the PR.

## 4. Batch your questions — nobody nurses this seat

Questions are expensive for the reader, so they arrive **as one comment, at a natural pause** — end of a story, end of the plan — never a drip of singles:

- **Exhaust the context first.** Most questions are answered by the prep notes, the register, or the schema map; a question the ticket already answers costs trust.
- **The batch names, per question:** what's blocked by it (if anything), your best-guess answer, and what you'll do if no answer comes (proceed on the guess / hold the story). **Keep building what isn't blocked.**
- **Route it:** ticket-content questions → the ticket (the PM watches); settled-decision smells → quote the register entry and ask before touching it; genuine founder calls → flagged as such, one question, not re-litigated.

## 5. Double-check, then Review — and hold

Before marking the epic Review:

1. **Self-check every criterion and Delivery check, by index** — run what can be run, state the result. Anything you can't verify is **named as unverified with why** — never passed on intention.
2. **Read back what you wrote.** Files, migrations, docs — opened, not assumed.
3. **The gates you'd fail anyway:** lint, typecheck, tests, the repo's own checks — green before Review, or the red explained on the ticket.
4. **One PR up, epic to Review, and hold in-session for the loop** — the lead engineer reviews and feeds back *to you*; fix, recommit, answer with evidence on the new head. **You never merge, and you never move anything to Done.**

## What this seat is not

- **Not the reviewer of its own work** — the self-check is honesty, not the review.
- **Not a scope court.** A better idea is a proposed ticket in the batch, not a change to the contract.
- **Not for standalone tickets** — one ticket, one PR runs through `pickup` as before.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. `pickup` §0.5 epic mode promoted and extended: the four-part context map, question batching with best-guess-and-default, progress comments in user terms, the indexed self-check, and the hold-for-the-loop.
