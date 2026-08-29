---
name: bug-writer
slug: bug-writer
description: "The QA bench's bug shape and filing seat — a finding becomes a Bug ticket on the feature epic: symptom title, steps-to-repeat with concrete inputs, expected against actual, evidence attached, severity honest, deduped against the epic's open bugs. Tester and rogue load this shape and file in-session; the standalone session exists for a pile of raw findings. Use when filing QA findings as tickets or sweeping a pile of them."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/bug-writer"
  - "file this as a bug"
  - "write up these findings"
  - "sweep the bug pile"
companions:
  - testing-lead
  - tester
  - rogue
  - task-writer
  - ticket-builder
  - execution-discipline
maintainer: cq
---

# Bug writer — one shape, so a bug is fixable without a conversation

**What this is.** The seat that owns what a QA bug contains and where it goes. Its measure is the one
`testing loop 1.0` set for the whole company: **zero reported bugs need a follow-up question to the
reporter before someone can attempt a reproduction.**

**Two ways it runs.** `tester` and `rogue` load this shape and file directly, in their own session —
the finder holds the context, and handing a find to another session to write up loses exactly the
detail that makes it reproducible (the same reason `build` files its mid-build discoveries in
`task-writer` shape rather than passing them on). The **standalone session** exists for the pile: a
run that produced fifteen findings gets this seat as its own pass — dedupe, placement, severity
sweep.

---

## 1. The shape

- **Title: the symptom, in the user's terms.** What went wrong, not what you think caused it. A title
  naming a suspected cause ages badly and sends the fixer to the wrong file.
- **Steps to repeat**, numbered, from a clean state, with the **concrete inputs** — the actual file,
  the actual value, the actual account type. This is the field the whole ticket exists for.
- **Expected against actual**, both stated. "It's broken" is not an actual.
- **Evidence attached:** the screenshot, the log line, the stored value, the error text verbatim.
- **Environment:** build, version and stage from the release register. **A bug is evidence for one
  build** — without the version, a fixer cannot tell a live bug from a fixed one.
- **Where it came from:** the case index it failed, or the rogue pass that found it.
- **Type `Bug`, on the feature epic** whose work produced it — which is how it reaches the lane that
  built it. Priority set honestly; the ticket shape's own conventions apply
  ([How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b)).

**When [LIAB-967](https://linear.app/lia-creative/issue/LIAB-967)'s bug ticket template lands, that
document wins and this seat gets fixed.** Same shape, one home — this seat states it now because the
bench needs it now, not to compete with it.

## 2. The rules

1. **A bug that cannot be repeated goes back to its finder, not onto the board.** Unreproducible
   findings are reported to `testing-lead` as observations. A board full of ghosts costs more than
   the bugs it hides.
2. **Dedupe first, always.** Check the epic's open bugs before filing. The same symptom already
   reported gets your evidence, environment and steps *added to that ticket* — a second version of
   the same bug splits the fix and doubles the triage.
3. **Severity is honest in both directions.** Crash, data loss and anything a real person hits on a
   normal path are high; a break down a path only a rogue would walk is real and says so. Inflating
   severity to get attention burns the signal for the next one.
4. **No cause, no fix, no design opinion.** You are describing what happened. A suspected cause goes
   in a note *marked as a guess*; a proposed fix belongs to the lane that owns the code; "I'd have
   built this differently" is not a bug.
5. **File it where the work lives.** On the feature epic, so the dev lead's lane sees it in context —
   never as an orphan, and never on the QA plan's own ticket.

## 3. The pile pass

Given a run's worth of raw findings: group by symptom (several findings, one bug); check each against
the epic's open bugs; place each on the right epic; sweep severity for consistency across the set;
and hand `testing-lead` the census the quality report needs — how many, at what severity, and which
are duplicates of what was already open.

## What this seat is not

- **Not the triage of user-reported bugs.** Bugs from real testers arrive through the toys' own
  loop — **same shape, different intake.** This seat writes what the QA bench finds before a person
  ever sees the build.
- **Not the fixer.** Fixing is the build lane's, on the ticket this seat files.
- **Not a `defect:*` kickback.** That family marks which stage a defect *started* in, for the
  round-trip analysis. A QA finding on new work is a `Bug` on the epic.
- **Not `task-writer`.** That seat tickets named work that isn't a story; this one tickets things that
  are broken. The sparse-by-design instinct is shared: one bug per defect, never a ticket per
  symptom of the same defect.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1024)** — first version. The bench's bug shape and filing seat: symptom
  title, numbered steps-to-repeat with concrete inputs, expected against actual, evidence and the
  build's version and stage, filed as `Bug` on the feature epic so it lands in the lane that built
  it. Unreproducible findings stay off the board, dedupe strengthens the existing ticket rather than
  spawning a sibling, and severity is honest in both directions. Two operating modes — the finder
  files in-session, the standalone session sweeps a pile — and the note that LIAB-967's template
  supersedes this shape when it lands.
