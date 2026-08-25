---
name: ticket-review
slug: ticket-review
version: 0.2.1
created: 2026-08-13
updated: 2026-08-21
status: active
triggers:
  - "/ticket-review"
  - "review LIAB-XXX"
  - "check what's in review"
  - "review the PR on LIAB-XXX"
  - "has this met its acceptance criteria"
  - "verify LIAB-XXX before I look"
companions:
  - pickup
  - orchestrate
  - execution-discipline
  - ticket-builder
  - product-retro
maintainer: cq
---

# Ticket review — verify work before founder eyes

**What this is.** How an agent reviews work sitting in Review — a PR, a document, a migration — so the founder's look is the last check, not the only one. The output is **evidence, never approval**: the reviewer leaves a verdict and its proof on the ticket, and the ticket stays in Review for the founder. Or it fails, and the hand-back runs by `pickup` §5.

**Why it exists.** CQ, 13 Aug 2026: *"we need to look at things like reviews and testing. getting agents to review what has been submitted rather than always relying on my eyes."* Until this skill, Review was a queue with one reader.

**The stance:** the acceptance criteria are the review. Not taste, not scope, not what you'd have built. A reviewer who finds the ACs themselves wrong has found a `defect:design`, and that's a finding too — but it goes back through the hand-back, not into a quiet rewrite.

---

## 1. Read it like a pickup

Run `pickup` §1–3 on the ticket first: the ticket, its parents, its blockers, the context doc, the vault pointers. You cannot verify acceptance criteria you don't understand the reason for. **A fresh session reviews; the session that built it defends it.** Never review your own work and call it a review.

## 2. Find the whole deliverable

The PR diff, the document, the schema — all of it, not the summary comment. If the ticket says a PR exists and you can't reach the repo, **that's the boundary of your review — say exactly what you could and couldn't check.** A review that silently skipped the code reads as a review that passed it.

## 3. Verify every AC, with evidence

One line per criterion: the AC quoted → what you actually did to check it → pass or fail. **Done means evidence, not intention** — run what can be run:

- **Code:** lint, typecheck, tests. Real data, no mocks, per the ticket standard's Definition of Done. If an AC says *"verified by doing it, not by reading the config"* — do it.
- **Documents:** fence parity first (`grep -c '^```'` per file, odd = broken). Then **read the seams** — the docs this one consumes or amends, checked at the join, because that's where four of four real findings have lived this week. Then the what's-missing question: what would the next reader need that nobody wrote?
- **Anything:** read back what was written. A file the builder says exists gets opened.

## 4. The adversarial pass

One deliberate attempt to make it fail before calling it sound. The standing four: **the empty state** (no data, no rows, no account) · **the offline path** (no network, mid-write) · **the wrong input** (the typo'd enum, the null, the second click) · **the second reader** (does this contradict a sibling doc or ticket that reads it?). Add the ticket's own "most likely to be missed" line if it names one — builders skip exactly what the spec predicts they'll skip.

## 5. Verdict — two outcomes, nothing between

**It holds:** one comment — *Reviewed: evidence per AC* — with the table from step 3 and what the adversarial pass tried. The ticket **stays in Review**. Never Done — **a reviewer never closes what it just reviewed**, and that survives the 2026-08-20 revision unchanged: the new rule frees an agent to close only work it neither built nor reviewed, which is never the case here. Never merged — **a reviewer never merges what it just reviewed**, and since CQ's 21 Aug 2026 call the merge belongs to the orchestrator (`orchestrate` §5), not to you and not to the founder's click. Never "approved" — the word is *verified*.

**It doesn't:** the hand-back is `pickup` §5, exactly — reviewer's words on the ticket, ACs rewritten to match, on **every** child it touches, moved back to the doing status, labelled from the `defect:*` family with `gate:fail` alongside. A failed review that lives only in a chat window never happened.

## What a review is not

- **Not a taste pass.** Only call something an issue if it changes an outcome — an AC unmet, a defect, a contradiction. Style differences and paths-you'd-have-chosen are not findings.
- **Not scope growth.** A good idea found during review is a comment proposing a ticket, not a new AC on this one.
- **Not re-litigation.** Locked decisions stay locked. A review that argues with decision 17 is off its ticket.
- **Not a substitute for the founder.** The founder's look gets shorter because the evidence is laid out — it doesn't disappear.

## The seam with the other skills

| Skill | Owns |
|---|---|
| **ticket-review** | Verifying work in Review: evidence per AC, adversarial pass, verdict on the ticket. |
| `orchestrate` | Running a whole milestone: what gets dispatched, in what order, and the merge after your verdict. It dispatches you; it never reviews. |
| `pickup` | Taking a ticket on (§0–4) and handing one back (§5 — this skill's fail path runs through it). |
| `ticket-builder` | Writing ACs a reviewer can actually verify. If review keeps failing on vague ACs, the fix is there. |
| `execution-discipline` | The judgment layer under everything. Load it first. |
| `product-retro` | The retro entry every review session appends, same as any session. |

## Changelog

- **0.2.1 (2026-08-21, CQ + Cowork)** — §5 no longer says the founder merges. CQ's 21 Aug call moved the merge to the orchestrator role; the reviewer still never merges, which was always the point of that line. `orchestrate` added as a companion and to the seam table. The rest of the sources are `LIAB-861`'s job.
- **0.1.0 (2026-08-13, CQ + Cowork)** — first version, commissioned by CQ the day two agents started running Toy Box lanes from Linear: *"getting agents to review what has been submitted rather than always relying on my eyes."*
