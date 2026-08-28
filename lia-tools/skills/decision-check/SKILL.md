---
name: decision-check
slug: decision-check
description: "Pressure-test one decision before it is committed — name the incentive pulling toward the fast answer, state that answer plainly, surface the cost it hides, test reversibility, and check what it is optimising for. Use when someone says pressure-test this, should we do X or Y, what are we trading, are we rushing this, or is about to commit to a call worth slowing down."
version: 0.1.0
created: 2026-08-28
updated: 2026-08-28
status: active
triggers:
  - "/decision-check"
  - "pressure-test this decision"
  - "should we do X or Y"
  - "check this call"
  - "what are we trading"
  - "are we rushing this"
companions:
  - execution-discipline
  - brainstorm
  - architecture
  - lead-engineer
maintainer: cq
---

# Decision check — the slow-brain pass on one call

**What this is.** A tight check that catches the shortcut before it is locked in. Not an analysis, not a options paper: five questions applied to **one decision**, fast enough to run in the moment someone is about to commit.

**Why it exists.** Named in a 13 May 2026 reset, as CQ's own working discipline: *"when the team feels the pull to move fast and pick something, name the incentive, pause, check what's being traded."* It generalises because the failure it catches is not personal — the pull toward the fast answer is strongest exactly when a call is expensive, and it is invisible from inside the decision.

---

## The check

1. **Name the incentive.** What is pulling toward the fast answer? Speed, relief, looking decisive, sunk cost, someone waiting, the sexy option, a queue that is stalling. **Say it out loud** — an unnamed incentive is the one that wins.
2. **Pause, and state the fast choice plainly.** Write down what would be chosen if nobody stopped. It cannot be examined while it is still implicit.
3. **What is being traded?** Name the cost the fast choice hides — the thing given up that is not yet on the table. If nothing is being traded, this is not a decision, it is a task.
4. **Reversibility.** One-way door or two-way door? Cheap to undo or expensive? **Two-way doors deserve less agonising; one-way doors deserve the slow-brain.** Getting this backwards is the common failure in both directions — labouring a reversible call, and sleepwalking an irreversible one.
5. **Optimising-for check.** What is this choice optimising for, and is that the thing that actually matters here? Speed, cost, reversibility, learning, and someone's comfort are all legitimate answers — but only one of them is usually true, and it is worth saying which.

## How to land it

**Surface the real trade and the one or two options that genuinely differ.** Do not manufacture false choices to look thorough; two real options beat five padded ones.

**Do not make the decision.** This seat sharpens a call so the person who owns it can make it — it never makes it for them, and it never leaves them with a recommendation dressed as a summary. When there is a recommendation worth giving, give it as one, plainly labelled.

**When it is cheap and reversible, say so and say move.** A two-way door that has already had five minutes of thought has had enough. Running the full check on a trivial call is its own failure — it spends the attention this skill exists to protect.

## What this seat is not

- **Not a decision record.** Where a settled call gets written down is the decisions register; this is the pass *before* that.
- **Not a brainstorm.** `brainstorm` opens the space; this closes it on one option.
- **Not an architecture review.** A technical call with system consequences goes to `architecture`; this is the general shape underneath.

## Changelog

- **0.1.0 (2026-08-28, LIAB-1028)** — lands in the plugin, on CQ's call, **de-personalised in the same pass rather than moved as-is.** The `cq` 0.5.0 original ran on *"Chris's slow-brain check"*, triggered on *"when Chris says"*, and closed with *"don't make the decision for Chris"* — a straight port would have put one founder's habit in a shared roster and quietly made his judgment everyone's default. The five checks are unchanged because the failure they catch is not personal; the framing is now the seat, and the 13 May reset is kept as attributed provenance rather than as the operating instruction. Added: the *nothing traded means it is a task* test, the both-directions note on reversibility, and §What this seat is not. Personal-bundle copy at `cq` 0.5.0 (`chris vault/00 inbox/_agent/cq-install/cq.plugin`, 28 Jul 2026) is superseded, not synced from.
