---
name: pickup
slug: pickup
version: 0.8.0
created: 2026-08-12
updated: 2026-08-26
status: active
triggers:
  - "/pickup"
  - "pickup LIAB-XXX"
  - "work LIAB-XXX"
  - "here's a ticket for you"
  - "picking this up"
  - "take this ticket"
  - "I'm passing you LIAB-XXX"
  - "what's the context on LIAB-XXX"
  - "/handback"
  - "this isn't right, send it back"
  - "put the feedback on the ticket"
  - "push the ticket back"
  - "reject LIAB-XXX"
  - "pickup the epic"
  - "take the whole epic"
companions:
  - execution-discipline
  - orchestrate
  - epic-builder
  - story-writer
  - task-writer
  - wrap-up
  - product-retro
maintainer: cq
---

# Pickup — how to take on a Linear ticket

**What this is.** The reading order for anyone handed a Lia ticket, person or agent. Read the ticket, check the context, check the vault, get into the work. Four beats, in that order, every time.

**Why it exists.** Lia passes work between three founders and a lot of agents. **Linear is the pointer** — it's the one place everyone can see, so a ticket has to be the front door to everything behind it. This skill is the other half of `ticket-builder`: that one is how you leave work, this one is how you take it.

**Never require the vault.** (Reversed 26 Aug 2026 — this line used to say *assume the vault is mounted*.) A build agent likely cannot mount it, so **the ticket has to suffice**: the spec on the ticket, the decisions in the project's context doc and the [Decisions register](https://linear.app/lia-creative/document/decisions-register-lia-toys-34348df61a5f), the process in this plugin. If understanding the ticket genuinely needs the vault, **the ticket isn't ready — hand it back** (§5) naming what has to travel onto it, rather than guessing around the gap. When the vault *is* mounted, §3's pointers still pay — depth, never dependence.

---

## 0. The dispatch rule — a prompt is a pointer

When work is sent to any agent — Cursor via Linear delegation, a Cowork session, a Claude Code run — **the prompt is the ticket id and this skill. Nothing else.**

> work LIAB-693. /pickup.

Everything the agent needs is already where it belongs: the ticket (the spec), the project's context doc (the decisions), and the vault (the depth). **If you feel the need to paste context into a kickoff prompt, the ticket isn't ready — fix the ticket, then send the pointer.** A context-rich prompt is invisible to the next agent, drifts from the ticket the day either changes, and dies with the chat window. CQ's rule, 13 Aug 2026: *"we dont want extra context in a prompt… we should be able to send an agent at a Lia-000 ticket and it know what to do."*

**Choosing what to work when no ticket is named:** unblocked (nothing unfinished in blocked-by) and highest priority in your lane. **The order lives in Linear — priority and blocked-by — never in a doc, a prompt, or a memory of a conversation.** A run-order written anywhere else is a cached copy of the board, and it's stale the moment anyone moves a ticket.

Who does what, so dispatch stays this small: the writers (`epic-builder` / `story-writer` / `task-writer`) make the work ready · `ready-review` gates it · the `project-manager` dispatches it · this skill is how it's picked up (`build` for a whole epic) · the lead engineer's `review-and-merge` is how the result gets checked.

---

## 0.5 Taking a whole epic — load `build` (moved 26 Aug 2026, same day it landed here)

When the dispatch names an **epic** — *"the whole epic"* — you're taking the version, not a ticket, and the builder's seat is its own skill now: **load `build`.** It carries what briefly lived here as §0.5 (plan mode first, the plan posted to the tickets, story-by-story on one branch, one PR, the hold for the review loop) plus the seat's full discipline: the four-part context map, **question batching**, progress comments in user terms, and the indexed self-check before Review.

**Single-ticket mode is this skill, unchanged** — everything below works ticket-at-a-time, one ticket one PR, exactly as before.

---

## 1. Read the ticket, and the ones above it

The ticket is the job. The tickets above it are why the job exists, and you'll do it wrong without them.

- **The ticket** — what's being asked, and its acceptance criteria. Those are the spec, not a suggestion.
- **Its parent** — why this group of work exists and what "done" looks like across it.
- **The epic** — who it's for and what success is in their terms.
- **Its blockers.** If something blocks it, open that and check it's actually finished. A ticket sitting in Todo behind unfinished work is not ready, whatever the board says.

Also read the sibling tickets around it. Half the time the thing you were about to build is explicitly someone else's ticket.

**The status is the answer. Don't ask a human to repeat the board.**

If a ticket is assigned and in progress, it's in progress — that's what the board is *for*. Don't report an in-flight ticket back to a founder as a risk they need to look at, don't ask who's on something the assignee field already names, and don't treat Todo as *nobody has thought about this*. Reading the board is part of doing the work, not a step you can outsource to whoever you're talking to.

The corollary is the price of it: **a board is only the source of truth if people move things.** So when you learn something the board doesn't know — a ticket is actually underway, a blocker cleared, work finished — **move it**. That isn't editing someone else's ticket, it's maintaining the shared instrument. The one exception stays: **never close your own work** — if you built or reviewed it, Review is the ceiling and the approver closes it.

If the status looks wrong and you can't tell what's true, that's a comment on the ticket, not a question in a chat window.


## 2. Check the context doc

Every Lia project should carry one Linear document — the decisions already made, where the code lives, the working rules, what's still open. It's attached to the epic and its workstreams.

Read it before the vault. It's shorter, it's current, and it tells you which vault pages are worth opening.

**If there isn't one, that's a flag, not a licence to guess.** Say so on the ticket.

## 3. Check the vault — when you have it

**This step is depth, not a dependency** (26 Aug 2026). No vault mounted → skip it; the ticket plus the context doc must already carry what you need, and if they don't, that's a hand-back naming the gap — never a guess. With the vault mounted:

The context doc points into the vault. **Follow its pointers rather than searching** — a search finds you five superseded documents and the live one, with nothing to tell them apart.

What you're usually after:

| Looking for | Where |
|---|---|
| What was decided and why | the product's build plan, in `01 planning/` or `Outputs/` |
| How it's put together | the ADR in `Products/Platform/ADRs/`, then the product's `03 strategy/` |
| The founder's actual words | the source recording page, quoted rather than paraphrased |
| What the last session hit | the retro-log tail, and the ACTIVE handover if there is one (`wrap-up` owns those) |

**The dated note wins over the undated one. The file wins over what you remember.** Conventions here change monthly.

## 3.5 What each status means — and the one rule that isn't obvious

**Statuses are claims about reality, and reality is the branch.** Written after 13 Aug 2026, when four separate problems hid behind a status that meant nothing:

| Status | Means, exactly |
|---|---|
| **Todo** | Nothing has started. Its blockers may or may not be finished — check them, don't trust the column. |
| **Build / In Progress** | Someone is on it now. |
| **Review** | **The PR is open** (or the document is filed). The work exists and is waiting on a human. |
| **Done** | **The work is on `main`.** For a document, it's filed and approved. |

**Review means the PR is up. Done means it's merged.** That distinction is the whole rule, and it is the one that gets lost — a PR that is open, green and approved is still `Review`. Clicking Done before merging tells everyone downstream the code is there when it isn't.

**Never close your own work.** If you built it or reviewed it, it goes to Review and the approver closes it. (Revised 2026-08-20, Dan: you *may* close a ticket you neither built nor reviewed, but only against a verified merge — never against a report, including your own. Full rule in `CLAUDE.md`.) And **do** say plainly when a ticket sitting in Done isn't merged. That's not second-guessing the approver, it's reporting the branch.

### The three things this prevents, all of which happened in one day

- **A ticket Done with an open PR.** `main` didn't have the change; a ticket wired blocked-by it read as clear to start, so the next agent would have built against a contract that didn't exist yet.
- **Two tickets Done with their work on a stacked branch.** PRs merged into each other's *feature branches* rather than the trunk. Both marked Done. **Neither's content was on `main` for a day** — including the CI workflow, so every green check in that period was measured against a trunk with no workflow. *A merged PR means its own base moved, not that `main` did.*
- **A ticket Done with an acceptance criterion that could never be met.** It was a known compromise that then hid a real gap. **If an AC is genuinely blocked on something outside the work — a plan upgrade, a credential, another team — split it into its own ticket** so the first one closes on what it delivered and the blocker is tracked where it can actually be worked.

### Before you move anything to Review or read a Done as finished

- **Check the branch, not the board.** `mergeStatus`, the head SHA, whether the merge commit is an ancestor of `main`. A status is a claim; the branch is the fact.
- **Check the PR's own status too.** A **draft** PR is not reviewable and not mergeable — a ticket in Review over a draft PR is the board lying in the other direction.
- **A brief may be stale on arrival.** Three times in one day, guidance was overtaken by minutes because it was written from a document describing the state instead of the state itself. **Verify the done-when list before doing the work it describes** — the work may already be done, and re-doing it is the expensive mistake.

## 4. Then get into the work

- Load `execution-discipline` first. It's the judgment layer and it isn't restated here.
- Move the ticket to the status that's true. **Never close your own work** — if you built or reviewed it, that's the approver's.
- **Open a PR and hold at Review.** In epic mode (`build`), the lead engineer reviews and loops with you, then merges. Standalone, a fresh review checks it — and who clicks merge is the standing rule of the repo you're in (the orchestrator where one is running; see `LIAB-861` for the written form). **Either way it is never you.**
- Append a retro entry before you finish — as a comment on the ticket you were dispatched at; to the product's retro-log too when the vault is mounted. `product-retro` owns the shape.

---

## 5. Handing it back — when you're the one reviewing

Work comes back wrong sometimes. **The feedback goes on the ticket, and the ticket goes back.** Not into a chat window, not into a fresh prompt, not into a new ticket. The person or agent who picks it up next reads the ticket and has everything.

Four moves, in order:

1. **Comment, in the reviewer's own words.** Paste what was actually said, not a tidied summary of it. The words carry the register — *"it feels more like a tin shed that will blow over"* tells the next reader something *"requirements lacked robustness"* doesn't. Quote first, interpret underneath if interpretation is needed.
2. **Rewrite the acceptance criteria to match.** A comment nobody has to satisfy is a wish. If the feedback changes what done means, the ACs change too — otherwise the ticket still asks for the thing that got rejected. Comment = why. ACs = what.
3. **Put it on every ticket it applies to, not just the parent.** A child ticket gets picked up on its own; if the feedback only lives on the parent, whoever takes the child never sees it. Same words on each child, plus the line that makes it specific to that one.
4. **Move it back to the doing status** — Todo or Build, whatever's true. Never leave rejected work sitting in Review.

**Label where the defect came from.** The label family already exists on Lia Build (Atom 09) — use it, don't invent one:

| Label | Means |
|---|---|
| `defect:discovery` | The brief was wrong. Kicked back to discovery. |
| `defect:design` | The acceptance criteria were wrong. Kicked back to design. |
| `defect:build` | The execution was wrong. Kicked back to build. |
| `defect:review` | Review passed something it shouldn't have; found later. |

The point of the four is that they survive the round trip, so you can later ask *where do our defects start* separately from *where do we catch them*. Three `defect:discovery` labels in a month means the briefs need work, not the builders. (`gate:fail` used to ride alongside — the `gate:*` labels were deleted 25 Aug 2026; the verdict lives in the review comment, which cannot contradict the status.)

**Same agent or a fresh one?** If the framing is what's being rejected, start fresh — a session that's holding the wrong frame will defend it. If it's a specific fix inside a frame that's still right, go back to the same one. Either way it costs nothing to decide, because **the ticket carries the context, not the session.** That's the whole point.

---

## When to stop and comment instead

Four things mean the ticket isn't ready, and none of them are yours to resolve alone:

1. **The ticket contradicts the context doc or the vault.** Say which two things disagree and let a founder call it. Don't pick.
2. **A decision you need isn't recorded anywhere.** Not in the ticket, not the doc, not the vault. That's a real gap — name it.
3. **Its blocker isn't actually done.** Say so rather than working around it.
4. **It points at something that doesn't exist** — a path, a ticket, a convention. Report it; don't reconstruct what you imagine was there.

Comment on the ticket, then move to another one. A blocked ticket said out loud costs an hour. A guess costs a week.

---

## The seam with the other skills

| Skill | Owns |
|---|---|
| **pickup** | Taking on a ticket and handing one back. The ticket is the unit of exchange in both directions. |
| `build` | The builder's seat for a whole epic — plan mode, batching, self-check, the loop. |
| `epic-builder` / `story-writer` / `task-writer` | Writing the work in the first place. |
| `ready-review` | Gating it ready before anything downstream spends work on it. |
| `project-manager` | The dispatch and the board — the seat that sent you this ticket. |
| `lead-engineer` (`build-prep` · `ticket-review` · `review-and-merge`) | The other end: prep before you start, the pickability check at dispatch, the review loop and the merge when you hold. |
| `wrap-up` | Ending a session and resuming your own thread later. Different axis: across time, same person. |
| `execution-discipline` | How to execute anything well once you've started. |
| `product-retro` | The mandatory retro entry. |

---

## Changelog

- **0.8.0 (2026-08-26, CQ voice memos + Fable 5)** — epic mode moves to the new `build` seat the same day it arrived; §0.5 becomes the pointer. Seam table updated for the orchestrator split (`project-manager` + `lead-engineer`); the hand-back and single-ticket flows unchanged.
- **0.7.0 (2026-08-26, CQ voice memos + Fable 5)** — **epic mode** (§0.5): a builder takes a whole designed epic — plan mode first, the plan posted to the tickets, story-by-story commits on one branch, one PR, then the review loop with the orchestrator, who merges. **The vault posture reverses:** *never require the vault* — the ticket has to suffice, and a ticket that doesn't is handed back, not guessed around (§3 becomes depth-when-mounted). Retro lands on the dispatch ticket (vault log too when mounted). `gate:fail` reference removed — the `gate:*` labels were deleted 25 Aug. Seam table gains the writers, `ready-review` and `orchestrate`. Recorded in the [Decisions register](https://linear.app/lia-creative/document/decisions-register-lia-toys-34348df61a5f); the model is [Tool shop](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8).
- **0.6.0 (2026-08-20, Dan) — logged retroactively on 2026-08-26**, having shipped without a changelog entry; recovered from §3.5's own dated revision note: you may close a ticket you neither built nor reviewed, but only against a verified merge, never a report.
- **0.5.0 (2026-08-13, CQ + Cowork)** — added §3.5 *what each status means*. **Review = the PR is up; Done = it's on `main`.** Written the day four problems hid behind that conflation: a ticket Done with an open PR, two Done with their work stranded on a stacked branch (so CI ran against a trunk with no workflow for a day), and one Done with an unmeetable AC. Plus the split rule for ACs blocked on something outside the work, and *check the branch, not the board*. CQ: *"thats good to know re status. how do we fix that?"*
- **0.4.0 (2026-08-13, CQ + Cowork)** — added §0 *the dispatch rule*. CQ: *"we dont want extra context in a prompt. we want it to all be either rules as part of the project… and then context for a clearly written ticket in linear."* Written the same hour a kickoff prompt for LIAB-693 carried three paragraphs that belonged on the ticket — the exact failure 0.1.0 was written against, back in a new coat. Also: order lives in Linear (priority + blocked-by), never in prompts or docs; seam table gains `ticket-review`.
- **0.3.0 (2026-08-12, CQ + Cowork)** — added *the status is the answer*. CQ: *"we want linear to be the source of truth for status. if it's assigned to luke and in progress then it's in progress."* Written after a session flagged an in-flight ticket back to him as though it were news, which is the board doing its job and the reader not doing theirs.
- **0.2.0 (2026-08-12, CQ + Cowork)** — added *Handing it back*. CQ's rule: *"in future we want feedback added to the ticket and then just push the ticket back so the feedback loop is there. the ticket should have everything within it."* Written the same day a PRD kick-back went onto the parent ticket only, so the five children were picked up without it.

- **0.1.0 (2026-08-12, CQ + Cowork)** — first draft. Written after a toy box session where the context for a build had to be assembled by hand into a pasted markdown prompt, twice. The fix is that Linear carries the pointers and the pickup is a known reading order.
