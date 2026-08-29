---
name: review-and-merge
slug: review-and-merge
description: "Review built work against its acceptance criteria by index — verdict, evidence tier and falsifiability per criterion, with cannot check a real answer that must take one of three named exits and never a resting place, the adversarial pass, the named anti-patterns, boundaries stated, feedback looped to the same build session until the same reviewer passes it on the current head — then the merge, which needs every criterion disposed of, content-verified. Use when a PR is up, when asked to review work in Review, or to run a merge."
version: 0.6.0
created: 2026-08-26
updated: 2026-08-29
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

**Who runs it: any lead seat, in its own lane** — `lead-engineer` for build, `design-lead` for design, `discovery-lead` for discovery, `research-lead` for the research bench, `testing-lead` for the QA stage, `project-manager` for the board's and the process's own work, `plugin-manager` for the marketplace. CQ, 28 Aug 2026: *"make it so any 'lead' can approve and manage PRs. in fact it's their job to do so."* Reviewing and landing work is part of what a lead **is**, not a permission granted to one of them.

> [!important] **Never your own work.**
> A lead may land anything in its lane except the thing it made. This is not the formality the widening relaxes — it is the reason the widening is safe. **A lead can judge because a lead does not produce:** the lead engineer never builds, the design lead never designs, the discovery lead never writes, the research lead never researches, the testing lead never tests, the project manager produces none of the work it moves, the plugin manager authors none of the skills it lands. Remove the non-production rule from a seat and nothing is left that qualifies it — so a seat that gains this authority keeps its non-production rule. §5.7 is the one declared departure from it — recorded in the PR *and* on the ticket, never repealed and never quiet, and gated by a bar it states.

**Lineage.** The built-work discipline here is `ticket-review` 0.1.0–0.2.1, absorbed verbatim on 26 Aug 2026 when that name was reassigned; the loop and merge protocol are `orchestrate` 0.2.0 §5. Nothing softened in the move.

**The stance: the acceptance criteria are the review.** Not taste, not scope, not what you'd have built. Since LIAB-949 they arrive as numbered Given/When/Then — **cite them by index.** A reviewer who finds the criteria themselves wrong has found a `defect:design`; that goes back through the hand-back, not into a quiet rewrite.

---

## 1. Read it like a pickup, then find the whole deliverable

The ticket, its parents, blockers, the context doc — you cannot verify criteria you don't understand the reason for. **A session never reviews work it built** — a lead produces nothing in its own lane, which is why the seat can review at all.

> [!important] **Freshness is a context boundary, not a bench boundary.**
> The rule is **did not produce the work being graded**. It names no seat, no bench and no human. **A spawned subagent has its own context window, so spawning one satisfies it** — a lead holding work its own session produced runs this review by spawning a reviewer, not by handing a person a command to open a terminal. Requiring a human to achieve freshness is making a person do a scheduler's job (LIAB-1044).
> **What the parent hands down is ticket ids and this rubric — only.** Never its own reading of them, never a summary of what it thinks the diff does, never "I checked 1–4, look at 5". A conclusion passed downward arrives pre-formed, which is the exact thing freshness exists to prevent; the parent may compare afterwards, and a disagreement is worth more than an agreement it manufactured.

A standalone ticket this session somehow authored goes to a reviewer it spawns, or to another session. **The one exception is §5.7, and it is declared, never assumed.** Then the whole deliverable: the PR diff, the document, the schema — not the summary comment. What you can't reach, you name as the boundary of the review — a review that silently skipped the code reads as one that passed it.

## 2. The rubric — per criterion, never per pull request

**Every criterion carries three fields, and an overall verdict is not a substitute for any of them.** A review that posts one verdict for the PR has not run this rubric, whatever it concluded.

| Field | Values |
|---|---|
| **Verdict** | met · not met · **cannot check** |
| **Evidence tier** | I ran it · I read the code path · I read a report ← never sufficient alone |
| **Falsifiable** | I saw this check fail · I did not |

- **`cannot check` is a first-class verdict and is never rounded up to met.** The 19 Aug [LIAB-769](https://linear.app/lia-creative/issue/LIAB-769) review is the worked example: six verified, two unverified, one partial, each said plainly — **and the two unverified ones turned out to be the whole ticket.** A reviewer that rounds has destroyed exactly the information the founder needed.
- **`cannot check` is a blocker, not a resting place.** A criterion that is not `met` — `not met` and `cannot check` alike — **does not merge** (§5.1). `cannot check` has **three exits and no fourth**, and the review says beside the verdict which one it took:
  1. **Check it.** Get the credential, the device, the data, the access — then check it. First choice every time, because it is the only exit that turns the verdict into a real one.
  2. **Hand it back.** The criterion is not checkable as built; the builder supplies the evidence, the hook or the fixture that makes it checkable, and the loop runs again (§4).
  3. **Take it to the founder as a named gap.** The call is not this seat's. It goes up as *what is unproved · what closing it would cost · what merging without it risks*, and **the founder's answer on the ticket is what disposes of it** — not the reviewer's note that it was hard.

  A review that closes with a `cannot check` and no exit named has **parked** the criterion — and parking is what rounding used to do out loud. **The verdict counts them: *n met · n not met · n cannot check*,** and names, for each `cannot check`, the exit it took. A `not met` has no exit to name — it hands back (§4). This is the forcing function 0.3.0 had structurally and 0.4.0 lost: two outcomes left an unprovable criterion nowhere to sit but `fail`, so it went back through the loop. `cannot check` is the better *report*; it must not become a better *hiding place* (LIAB-1046).
- **The evidence tier is what you did, not what you believe.** *I read a report* is an honest tier and never carries a criterion alone: a report is a claim, the artifact is the fact.
- **Falsifiability is asked of every check you lean on.** If you did not watch it go red — you broke it deliberately, or it failed before the fix and passes after — the answer is *I did not*, and the criterion does not rest on it. **A check nobody has watched fail is a check nobody knows works** (`CLAUDE.md` §Make the check fail on purpose).

Then the doing. One line per criterion, by index: the AC quoted → what you actually did → the three fields. **Done means evidence, not intention** — run what can be run:

- **Code:** lint, typecheck, tests; real data, no mocks. If an AC says *"verified by doing it"* — do it. `[Graded at Review]` criteria are graded now, here, with the judgement written down.
- **Documents:** fence parity first, then the seams — the docs this one consumes or amends, checked at the join — then the what's-missing question.
- **Anything:** read back what was written. A file the builder says exists gets opened.
- **Delivery checks too** — their own list, verified the same way.

## 3. The adversarial pass, the boundaries, the anti-patterns

### 3a. One deliberate attempt to break it

Pick **the two criteria most likely to be wrong and actively try to falsify them.** Not a re-read — an attempt: run the thing in the state that would embarrass it. The standing angles: **the empty state** · **the offline path** · **the wrong input** · **the second reader** (does it contradict a sibling doc or ticket?). Add the ticket's own "most likely to be missed" line if it names one. `security`'s checks ride along here when the work touches secrets, data flows or a client bundle.

### 3b. Boundaries — name what this seat could not see

A named section in every verdict: **what could not be checked from here, and why** — no device, no credential, no production data, an artifact that only exists after a step this session cannot run. **A review that names no boundary has not looked for one.**

This is not the same as `cannot check` on a criterion. That is one criterion's verdict; this is the shape of the whole seat's blind spot, and the blind spot is where the defects have actually been: *a guard's blind spot is not in what it checks, it is in the shape of what it enumerates* (`CLAUDE.md`). Ask what this review **cannot** see before believing what it says.

### 3c. The anti-patterns — and which ones you looked for

Every one of these has happened here, which is why each carries its ticket. **The verdict states which of the six this review looked for** — a list nobody claims against is decoration.

1. **Green that has never been red.** A guard that pins a constant but cannot fail on the thing that matters. [LIAB-907](https://linear.app/lia-creative/issue/LIAB-907), [LIAB-882](https://linear.app/lia-creative/issue/LIAB-882), [LIAB-877](https://linear.app/lia-creative/issue/LIAB-877), [LIAB-852](https://linear.app/lia-creative/issue/LIAB-852), [LIAB-896](https://linear.app/lia-creative/issue/LIAB-896) — four of them inside one week. *If a check has never been seen to fail, it has proved nothing.*
2. **A success that proves nothing.** [LIAB-815](https://linear.app/lia-creative/issue/LIAB-815): a Supabase `update()` matching **zero rows** returns no error, so the route answered `200` having written nothing. *A call that succeeds both ways is not evidence either way.*
3. **Grading the summary instead of the criteria.** 29 Aug 2026: [LIAB-692](https://linear.app/lia-creative/issue/LIAB-692) and [LIAB-710](https://linear.app/lia-creative/issue/LIAB-710) both read as closeable from their summaries; the numbered criteria said otherwise — **two of five calls wrong.** An agent will do this more often than a human, because a summary is the most fluent thing in the ticket.
4. **Reviewing something that is not the merge target's head.** [LIAB-804](https://linear.app/lia-creative/issue/LIAB-804) — a PR merged onto a dead branch and the board recorded Done. Squash merges make `git branch --merged`, `git cherry` and `git diff` all lie the same way; the test that works is *is this tip reachable from an* `origin/` *ref* (§5.4).
5. **Inheriting the prior pass's reading.** The 28 Aug gate found a contradiction between [LIAB-930](https://linear.app/lia-creative/issue/LIAB-930) and [LIAB-899](https://linear.app/lia-creative/issue/LIAB-899) that **two earlier passes had both classified as harmless redundancy.** *Prior assessments are leads, not findings* — including the parent's, which is why §1 forbids handing one down.
6. **Evidence that cannot contain the answer.** A screenshot of the top-right corner used to make a claim about the top-left; a build log used to answer a packaging question when only mounting the DMG could ([LIAB-1007](https://linear.app/lia-creative/issue/LIAB-1007)). *Before citing evidence, ask whether the answer could have been in it.*

### 3d. Load-bearing criteria get diverse lenses, not more of the same

Three identical reviewers find the same things three times. Where a criterion is **load-bearing — data loss, auth, money, a migration —** spawn reviewers with **distinct lenses**, one each:

- **Does it do what it says** — the criteria by index, as written.
- **Can it be broken** — the adversarial seat, aimed at that criterion alone.
- **Does it reproduce from cold** — a fresh clone, a cleared cache, the consumer's surface rather than the preview's (`execution-discipline` §3).

**Redundancy catches slips; diversity catches blind spots.** The lead spawning them says which lens each carries, and merges the three into one verdict rather than posting three.

## 4. The loop — feedback that lands

**Feedback goes straight back to the same build session**, specific enough to act on — the builder holds the context; a fresh session would re-derive it. Comments cite AC indices and files/lines; the register of what failed goes on the ticket, not just the PR. The builder fixes, recommits, answers with evidence — and the loop runs again **on the new head**. What you never do — **in the loop or in a standalone review**: fix it yourself (you'd become the builder and disqualify the review), or wave through a criterion you couldn't evidence. *(The second half read "in the loop" only until LIAB-1046; scoping it there left a standalone review free to park a criterion.)*

**Re-review is the *same* reviewer, on the current head.** Not a fresh one: the reviewer that raised the finding knows what it asked for, and a new reviewer re-derives the whole thing and grades something subtly different. It re-runs §2 on the criteria it failed, re-checks anything the fix could have moved, and says so per criterion. Freshness was satisfied when the review began — it is not re-earned each round, and a reviewer that fixed nothing has produced nothing.

**A standalone review that does not dispose of every criterion** hands back per `pickup` §5 — any criterion `not met`, or `cannot check` taking exit 2 — reviewer's words on the ticket, ACs rewritten to match, on every child it touches, moved back to the doing status, labelled from the `defect:*` family. *(This said "a failed standalone review" until LIAB-1046, and `cannot check` was not defined to be a failure, so it triggered nothing.)* (The verdict lives in the comment — the `gate:*` labels were deleted 25 Aug.)

## 5. The merge — every PR, one declared exception

Carried intact from the 21 Aug decision and the rules that were each paid for at least once:

1. **Nothing merges without a review that disposes of every criterion, on the current head, by someone who did not write it.** *Unreviewed* was the old wording and §5.7 makes it a loophole — an author reviewing themselves satisfies it. It is the independence that is required, not the ritual — and *someone* is a **context**, not a person: a subagent this session spawned, which did not produce the work, satisfies §5.1 in full (§1). A build session moving its own ticket to Review looks identical to a review passing it — check the author and the minute.

   **Disposed of** means one of three things, and they are not interchangeable. A criterion **`met`** is disposed of. A **`cannot check`** is disposed of when it took one of §2's three exits **and the exit completed** — the access was got and the check run, the hand-back landed and was re-reviewed, or the founder's answer is on the ticket. A **`not met` has no exits**: it hands back (§4), and it is disposed of only when the fix landed and the same reviewer passed it on the new head. **A founder's answer can dispose of an unproved criterion; it never disposes of a failed one** — that is the line between a gap and a defect, and collapsing it would buy the merge a way past a *known* failure, which is a door 0.3.0 never had. A reviewer's note that an exit *was needed* is not the exit. Until LIAB-1046 this rule was satisfied by a review merely **existing**: a review returning `cannot check` on every criterion, with an honest boundaries section and no exit anywhere, is a review — and nothing in this file stopped the merge.
2. **The base must be current**; a stale base makes every piece of evidence a picture of a tree that no longer exists.
3. **Never merge a PR whose target is not the trunk** — a stacked PR reports `merged` while landing nothing.
4. **Squash-merge means `merged` proves nothing.** The only landing test is content: `git fetch origin && git diff --stat <pr-head> origin/main -- <the PR's files>` — **empty means it landed.** Run it after every merge.
5. **A ticket leaves Review only after that check** — and that move is this seat's, nobody else's. **Where a QA stage follows, the move is to QA, not to Done.** `project-manager` §2c owns the pipeline; the QA stage exits on `testing-lead`'s quality report, and the PM moves the ticket on that verdict. Done still never comes before a check like this one — it is simply no longer always this seat's move to make, because this seat is no longer always the last stage. *(This read "tickets move to Done only after that check — and moving them is this seat's, nobody else's" until LIAB-1023/1024. Both halves were true while review-and-merge was the last stage and false the moment a stage was added after it — and the Lia Build board had already run Review → QA → Done for longer than that. Caught in review.)*
6. **The seat is any lead, in its own lane** — `lead-engineer`, `design-lead`, `discovery-lead`, `research-lead`, `testing-lead`, `project-manager`, `plugin-manager`. Every building session still opens the PR and stops. What no lead may do is land its own work: that rule is what the seat costs, not its fine print. (`CLAUDE.md` rule 4 states the same thing; `LIAB-861` settled the question for one seat — CQ's call on **21 Aug** 2026; the ticket closed on the 25th — and is closed.)
7. **When no lead session can be reached.** A stalled queue is a real cost, so a lead who reviewed a change **in its own lane** may make and land the repair that review found. This is an exception to three rules at once — §1's *never your own work*, §5.1's *review by someone who did not write it*, and the seat's own non-production rule — which is why it is the narrowest thing in this file: **a repair the review identified, nothing else.** New work is never landed this way.

   **It is declared in the PR body *and* as a comment on the ticket** — the PR body is read once, the ticket is the record an audit can find. The declaration names four things: what it built, what it reviewed, which leads it tried and could not reach, and what the sign-off therefore does not certify. **"Could not reach" has a bar, and it is a high one.** A *lead* here is **a session holding a lead seat**, not the seat as an abstraction — and a fresh session can hold one, which is how every review in this repo is already run (`claude --plugin-dir …`). So a second lead is nearly always available. *"This lane has only one seat"* is **not** the bar and never was: §5.6 names one seat per lane, so that reading would make the exception permanently available on demand — the same shape as the loophole §5.1 just closed. The honest trigger is narrow: **no session holding any lead seat could be started, or reach the work, before it had to land.** The declaration names what was actually tried. **Since LIAB-1044 this is narrower still:** a lead runs a review by *spawning* one (§1), so "could not be started" now means the spawn itself was impossible — not that no second terminal happened to be open. **§5.7 relaxes independence and nothing else. It is not a disposition exception:** every criterion still has to be disposed of per §5.1, and a `cannot check` still has to take one of §2's three exits — a lane with no second lead does not make an unproved criterion mergeable, it only makes the one who proves it the same one who wrote it. **It certifies that the criteria were checked by index and that the landing was content-verified. It does not certify independence** — nobody who did not write the change has read it. That is a gap in the roster, not a property of the work: it never becomes the routine path, and the next lead into that lane re-reads it. A lane needing this twice is a staffing ticket, not a habit.

## What this seat is not

- **Not a taste pass, not scope growth, not re-litigation** — an issue is an AC unmet, a defect, or a contradiction; a good idea is a comment proposing a ticket; locked decisions stay locked.
- **Not a substitute for the founder.** His look gets shorter because the evidence is laid out — it doesn't disappear.
- **Not the pre-dispatch check** — that's `ticket-review` (since the reassignment).

## Changelog

- **0.6.0 (2026-08-29, LIAB-1023 + LIAB-1024)** — two lanes join the model: `research-lead` for the research bench and `testing-lead` for the QA stage, added to the "who runs it" line and to §5.6. Both arrive with the non-production rule already stated in their own seats — *the research lead never researches*, *the testing lead never tests* — and the callout's list names them, because a lane added without that rule would be a lane with nothing qualifying it to judge. **§5.5 moves with them, and it had to:** this pair of tickets puts a QA stage *after* the merge, which made §5.5 false in both halves at once — the ticket no longer goes to Done on a merge, and the seat that moves it on is the PM reading `testing-lead`'s quality report. It now scopes itself to the move it actually owns, leaving Review, and names the QA case. An earlier cut of this version said *"nothing else moves"* while shipping exactly that contradiction; the review caught it. Everything else does hold: the landing rules, and the §5.7 exception with the same bar. *(Written against 0.3.0 and rebased over 0.4.0 and 0.5.0; outside §5.5 it touches only the three lists of lanes, so the LIAB-1045 rubric and the LIAB-1046 disposition rules are untouched — §2's three exits, §5.1's *disposed of*, and the founder-answers-an-unproved-not-a-failed line all stand as 0.5.0 wrote them.)*
- **0.5.0 (2026-08-29, LIAB-1046)** — **`cannot check` gets an exit.** 0.4.0 made it a first-class verdict, which was right, and left it with nowhere to go, which was not: §2 and §3b were reporting rules, §4's *never wave through* was scoped to the loop, §4's hand-back trigger was *"a failed standalone review"* and `cannot check` was not defined to be a failure, and **§5.1 was satisfied by a review merely existing.** A reviewer could mark every criterion `cannot check`, write an honest boundaries section, and nothing stopped the merge — a strictly better report with a respectable-sounding box to park in. Now: **§2 gains the three exits and no fourth** — check it · hand it back · take it to the founder as a named gap — with the review naming which it took and the verdict counting *n met · n not met · n cannot check*; **§4's *never wave through* is unscoped** from the loop to any review, and its hand-back trigger becomes *does not dispose of every criterion*; **§5.1 requires a review that disposes of every criterion**, with *disposed of* defined per verdict: `met` is disposed of; a `cannot check` needs one of the three exits **completed**, not merely named; and a **`not met` has no exits at all** — it hands back and is disposed of only when the fix landed and the same reviewer passed it on the new head. **A founder's answer disposes of an unproved criterion, never a failed one.** That last distinction was missing from the first cut of this version and was caught in review: as first written, §5.1 offered the three exits to `not met` as well, which would have let a founder's answer wave through a *known* failure — a door 0.3.0 did not have, and precisely the widening AC 4 exists to prevent. §2's count clause carried the same slip (*"the exit taken for each of the last two"*) and was corrected with it. **§5.7 is annotated as an independence exception only**, because the reviewer's proposed wording tied the non-zero counts to it and that would have turned a staffing gap into a licence to merge unproved criteria. Nothing in §5 renumbered — `CLAUDE.md`, `plugin-manager`, `lead-engineer`, `design-lead`, `discovery-lead` and `pickup` cite it, and §2 keeps its number for `lead-engineer`'s chain table.
  **The record, corrected.** The PR #36 body and the LIAB-1045 build comment both say 0.3.0 *"collapsed the unreachable criterion into `NOT EVIDENCED (treat as FAIL)`"*. **That string is nowhere in 0.3.0** — a control reviewer improvised it and two readers repeated it. What 0.3.0 actually carried was §2's binary *"pass or fail"* plus §4's *"never wave through a criterion you couldn't evidence"*: a two-outcome forcing function that left an unprovable criterion nowhere to sit but `fail`, and therefore in the hand-back. 0.4.0 replaced the binary with three verdicts and did not replace the forcing function. That is the whole of what this version restores; the LIAB-1045 rubric is otherwise untouched.
- **0.4.0 (2026-08-29, LIAB-1045 + LIAB-1044)** — **the rubric gets teeth.** §2 was *"one line per criterion: quoted, what you did, pass or fail"*, which an agent satisfies with a fluent sentence; it is now three named fields per criterion — **verdict / evidence tier / falsifiability** — with **`cannot check` a first-class verdict that is never rounded up to met** (the LIAB-769 worked example: the two unverified criteria were the whole ticket). §3 gains three parts it did not have: **3b boundaries** (a review that names no boundary has not looked for one), **3c the six anti-patterns with their ticket citations kept** — green-that-was-never-red, a success that proves nothing, grading the summary, reviewing a dead head, inheriting the prior pass, evidence that cannot contain the answer — and **3d diverse lenses** for load-bearing criteria, because three identical reviewers find the same things three times. §3a's adversarial pass is sharpened from *one attempt* to *the two criteria most likely to be wrong, actively falsified*. §4 states that the **re-review is the same reviewer on the current head**, which the loop implied and never said. From LIAB-1044: **freshness is restated as a context boundary, not a bench boundary** — *did not produce the work being graded* — with a spawned subagent satisfying it, and the parent handing down **ticket ids and this rubric only, never its own reading**; §5.1's *someone who did not write it* is annotated with the same, and §5.7's already-narrow trigger narrows again, since a lead that can spawn a reviewer can nearly always reach one. Nothing in §5 renumbered — `CLAUDE.md`, `plugin-manager`, `lead-engineer`, `design-lead`, `discovery-lead` and `pickup` all cite it by number.
- **0.3.0 (2026-08-28, LIAB-1030)** — §5.6 dated LIAB-861 to 25 Aug, which is when the ticket *closed*; CQ's decision was **21 Aug**. `lia-toy-box`'s rule 2 and the vault standard both said 21 Aug and were right. Introduced by 0.2.0, caught by the LIAB-1026 review.
- **0.2.0 (2026-08-28, LIAB-1025)** — **any lead seat runs this, in its own lane**, on CQ's call: *"in fact it's their job to do so."* The merge seat was written as one named role, so `design-lead`, `discovery-lead` and `project-manager` could land nothing and the queue stalled on one seat — twice on 28 Aug a session reviewed and then built the same PR because there was no second lead. Widening *who* merges, not *what* merging requires: `never your own work` is promoted out of a mid-paragraph clause in §1 into a callout at the top, stated as the reason the widening is safe rather than the thing it relaxes. New §5.7 writes down the case where no lead session can be reached — what the declaration must contain, and that it certifies the criteria and the landing but never independence. **§5.1 is strengthened, not softened:** *nothing merges unreviewed* becomes *nothing merges without a review on the current head by someone who did not write it*, because §5.7 turns "unreviewed" into a loophole an author can satisfy by reviewing themselves — the same residual qualifier was caught and removed from `plugin-manager` rule 7 in the same pass, and §5.1 is the canonical rule it was copied from. §5's heading drops *no exceptions*, which §5.7 made untrue. §5.7 gains a bar for "could not reach" — and then a second pass, because the first bar could not fail: §5.6 names one seat per lane, so "the lane has no second lead" was permanently true and the exception was available on demand. A *lead* is now explicitly a **session holding a seat**, and a fresh session counts, which makes the trigger genuinely rare. The `LIAB-861` pointer is kept but annotated as closed, since it is the dated record of the same question being settled for one seat.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version under this name; the content is `ticket-review` 0.1.0–0.2.1 (evidence per AC, adversarial pass, two-outcome verdict, never-your-own-work) + `orchestrate` 0.2.0 §5 (the epic loop, the merge protocol) joined into one seat, with AC-by-index made explicit and the stale `gate:fail` reference dropped (labels deleted 25 Aug).
