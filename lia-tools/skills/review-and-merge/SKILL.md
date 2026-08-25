---
name: review-and-merge
slug: review-and-merge
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
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

**What this is.** The lead engineer reviews work from other agents, gives clear feedback back, and manages the merges. The output of a review is **evidence, never approval** — a verdict with its proof on the ticket. For an epic build it is **a loop**: feedback to the same build session, fixes, re-review on the new head, until it holds — then the merge, content-verified.

**Lineage.** The built-work discipline here is `ticket-review` 0.1.0–0.2.1, absorbed verbatim on 26 Aug 2026 when that name was reassigned; the loop and merge protocol are `orchestrate` 0.2.0 §5. Nothing softened in the move.

**The stance: the acceptance criteria are the review.** Not taste, not scope, not what you'd have built. Since LIAB-949 they arrive as numbered Given/When/Then — **cite them by index.** A reviewer who finds the criteria themselves wrong has found a `defect:design`; that goes back through the hand-back, not into a quiet rewrite.

---

## 1. Read it like a pickup, then find the whole deliverable

The ticket, its parents, blockers, the context doc — you cannot verify criteria you don't understand the reason for. **A session never reviews work it built** — the lead engineer built nothing, which is why this seat can review; a standalone ticket this session somehow authored goes to a fresh session. Then the whole deliverable: the PR diff, the document, the schema — not the summary comment. What you can't reach, you name as the boundary of the review — a review that silently skipped the code reads as one that passed it.

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
6. **This authority is the lead engineer's specifically** — every building session still opens the PR and stops. (The repo docs catching up is `LIAB-861`.)

## What this seat is not

- **Not a taste pass, not scope growth, not re-litigation** — an issue is an AC unmet, a defect, or a contradiction; a good idea is a comment proposing a ticket; locked decisions stay locked.
- **Not a substitute for the founder.** His look gets shorter because the evidence is laid out — it doesn't disappear.
- **Not the pre-dispatch check** — that's `ticket-review` (since the reassignment).

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version under this name; the content is `ticket-review` 0.1.0–0.2.1 (evidence per AC, adversarial pass, two-outcome verdict, never-your-own-work) + `orchestrate` 0.2.0 §5 (the epic loop, the merge protocol) joined into one seat, with AC-by-index made explicit and the stale `gate:fail` reference dropped (labels deleted 25 Aug).
