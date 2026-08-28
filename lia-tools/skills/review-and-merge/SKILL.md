---
name: review-and-merge
slug: review-and-merge
description: "Review built work against its acceptance criteria by index — evidence per criterion, the adversarial pass, feedback looped to the same build session until it passes on the current head — then the content-verified merge and the ticket moves. Use when a PR is up, when asked to review work in Review, or to run a merge."
version: 0.2.0
created: 2026-08-26
updated: 2026-08-28
status: active
triggers:
  - "/review-and-merge"
  - "review LIAB-XXX"
  - "review the PR"
  - "has this met its acceptance criteria"
  - "verify LIAB-XXX before I look"
  - "run the merge"
companions:
  - lead-engineer
  - build
  - security
  - ticket-review
  - execution-discipline
maintainer: cq
---

# Review and merge — the loop with the builder, then the landing

**What this is.** A lead reviews work from other agents, gives clear feedback back, and manages the merges. The output of a review is **evidence, never approval** — a verdict with its proof on the ticket. For an epic build it is **a loop**: feedback to the same build session, fixes, re-review on the new head, until it holds — then the merge, content-verified.

**Who runs it: any lead seat, in its own lane** — `lead-engineer` for build, `design-lead` for design, `discovery-lead` for discovery, `project-manager` for the board's and the process's own work, `plugin-manager` for the marketplace. CQ, 28 Aug 2026: *"make it so any 'lead' can approve and manage PRs. in fact it's their job to do so."* Reviewing and landing work is part of what a lead **is**, not a permission granted to one of them.

> [!important] **Never your own work.**
> A lead may land anything in its lane except the thing it made. This is not the formality the widening relaxes — it is the reason the widening is safe. **A lead can judge because a lead does not produce:** the lead engineer never builds, the design lead never designs, the discovery lead never writes. Remove the non-production rule and nothing is left that qualifies the seat. The single case where no other lead is reachable is §5.7 — declared in the PR, never quiet.

**Lineage.** The built-work discipline here is `ticket-review` 0.1.0–0.2.1, absorbed verbatim on 26 Aug 2026 when that name was reassigned; the loop and merge protocol are `orchestrate` 0.2.0 §5. Nothing softened in the move.

**The stance: the acceptance criteria are the review.** Not taste, not scope, not what you'd have built. Since LIAB-949 they arrive as numbered Given/When/Then — **cite them by index.** A reviewer who finds the criteria themselves wrong has found a `defect:design`; that goes back through the hand-back, not into a quiet rewrite.

---

## 1. Read it like a pickup, then find the whole deliverable

The ticket, its parents, blockers, the context doc — you cannot verify criteria you don't understand the reason for. **A session never reviews work it built** — a lead produces nothing in its own lane, which is why the seat can review at all; a standalone ticket this session somehow authored goes to a fresh session. Then the whole deliverable: the PR diff, the document, the schema — not the summary comment. What you can't reach, you name as the boundary of the review — a review that silently skipped the code reads as one that passed it.

## 2. Verify every criterion, with evidence

One line per criterion, by index: the AC quoted → what you actually did → pass or fail. **Done means evidence, not intention** — run what can be run:

- **Code:** lint, typecheck, tests; real data, no mocks. If an AC says *"verified by doing it"* — do it. `[Graded at Review]` criteria are graded now, here, with the judgement written down.
- **Documents:** fence parity first, then the seams — the docs this one consumes or amends, checked at the join — then the what's-missing question.
- **Anything:** read back what was written. A file the builder says exists gets opened.
- **Delivery checks too** — their own list, verified the same way.

## 3. The adversarial pass

One deliberate attempt to make it fail before calling it sound: **the empty state** · **the offline path** · **the wrong input** · **the second reader** (does it contradict a sibling doc or ticket?). Add the ticket's own "most likely to be missed" line if it names one. `security`'s checks ride along here when the work touches secrets, data flows or a client bundle.

## 4. The loop — feedback that lands

**Feedback goes straight back to the same build session**, specific enough to act on — the builder holds the context; a fresh session would re-derive it. Comments cite AC indices and files/lines; the register of what failed goes on the ticket, not just the PR. The builder fixes, recommits, answers with evidence — and the loop runs again **on the new head**. What you never do in the loop: fix it yourself (you'd become the builder and disqualify the review), or wave through a criterion you couldn't evidence.

**A failed standalone review** hands back per `pickup` §5 — reviewer's words on the ticket, ACs rewritten to match, on every child it touches, moved back to the doing status, labelled from the `defect:*` family. (The verdict lives in the comment — the `gate:*` labels were deleted 25 Aug.)

## 5. The merge — every PR, no exceptions

Carried intact from the 21 Aug decision and the rules that were each paid for at least once:

1. **Nothing merges unreviewed on the current head.** A build session moving its own ticket to Review looks identical to a review passing it — check the author and the minute.
2. **The base must be current**; a stale base makes every piece of evidence a picture of a tree that no longer exists.
3. **Never merge a PR whose target is not the trunk** — a stacked PR reports `merged` while landing nothing.
4. **Squash-merge means `merged` proves nothing.** The only landing test is content: `git fetch origin && git diff --stat <pr-head> origin/main -- <the PR's files>` — **empty means it landed.** Run it after every merge.
5. **Tickets move to Done only after that check** — and moving them is this seat's, nobody else's.
6. **The seat is any lead, in its own lane** — `lead-engineer`, `design-lead`, `discovery-lead`, `project-manager`, `plugin-manager`. Every building session still opens the PR and stops. What no lead may do is land its own work: that rule is what the seat costs, not its fine print. (`CLAUDE.md` rule 4 states the same thing; `LIAB-861` settled the question for one seat on 25 Aug and is closed.)
7. **When no other lead is reachable.** A stalled queue is a real cost, so a lead who reviewed a change may land its own repair — **declared in the PR body**, naming four things: what it built, what it reviewed, that no second lead was reachable, and what the sign-off therefore does not certify. **It certifies that the criteria were checked by index and that the landing was content-verified. It does not certify independence** — nobody who did not write the change has read it. That is a gap in the roster, not a property of the work: it is named in the PR, it never becomes the routine path, and the next lead into that lane re-reads it.

## What this seat is not

- **Not a taste pass, not scope growth, not re-litigation** — an issue is an AC unmet, a defect, or a contradiction; a good idea is a comment proposing a ticket; locked decisions stay locked.
- **Not a substitute for the founder.** His look gets shorter because the evidence is laid out — it doesn't disappear.
- **Not the pre-dispatch check** — that's `ticket-review` (since the reassignment).

## Changelog

- **0.2.0 (2026-08-28, LIAB-1025)** — **any lead seat runs this, in its own lane**, on CQ's call: *"in fact it's their job to do so."* The merge seat was written as one named role, so `design-lead`, `discovery-lead` and `project-manager` could land nothing and the queue stalled on one seat — twice on 28 Aug a session reviewed and then built the same PR because there was no second lead. Widening *who* merges, not *what* merging requires: `never your own work` is promoted out of a mid-paragraph clause in §1 into a callout at the top, stated as the reason the widening is safe rather than the thing it relaxes. New §5.7 writes down the no-second-lead case — what the declaration must contain, and that it certifies the criteria and the landing but never independence. §5 is otherwise untouched. The closed `LIAB-861` pointer is dropped.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version under this name; the content is `ticket-review` 0.1.0–0.2.1 (evidence per AC, adversarial pass, two-outcome verdict, never-your-own-work) + `orchestrate` 0.2.0 §5 (the epic loop, the merge protocol) joined into one seat, with AC-by-index made explicit and the stale `gate:fail` reference dropped (labels deleted 25 Aug).
