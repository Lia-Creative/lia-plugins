---
name: bug-writer
slug: bug-writer
description: "The QA bench's bug filing seat — a finding becomes a Bug ticket on the feature epic: symptom title, steps-to-repeat with concrete inputs, expected against actual, evidence attached, severity honest, deduped against the epic's open bugs. Tester and rogue load this shape and file in-session; the standalone session exists for a pile of raw findings. Use when filing QA findings as tickets or sweeping a pile of them."
version: 0.2.0
created: 2026-08-29
updated: 2026-08-30
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

**The shape is not this seat's to define.** It is
[What a reported bug carries](https://linear.app/lia-creative/document/what-a-reported-bug-carries-ff781e0d6b8a) — the seven fields, the
`Not captured` block that makes a gap visible, the inference rule, the title form and the
placement. **Read it before filing anything.** This seat owns the QA *intake*: what the bench fills
differently, and why.

*This replaces the shape 0.1.0 stated here. That version said so itself — "when LIAB-967's bug
ticket template lands, that document wins and this seat gets fixed" — and it has landed.*

### What the QA intake fills differently

Stated here **and** in that document's intake table, because an unstated difference between two
intakes is how they drift into contradicting each other.

- **Field 7 — *what the person was doing* — is numbered steps to repeat**, from a clean state, with
  the **concrete inputs**: the actual file, the actual value, the actual account type. A reported
  take can rarely manage that; a finder who just ran it always can. **This is the field the whole
  ticket exists for.**
- **Fields 2–4 — tool, version, platform — come from the release register**, not from a take
  envelope, because there is no take. **A bug is evidence for one build** — without the version, a
  fixer cannot tell a live bug from a fixed one.
- **Evidence is attached, not cited:** the screenshot, the log line, the stored value, the error
  text verbatim.
- **Where it came from:** the case index it failed, or the rogue pass that found it.
- **The parent is the feature epic whose work produced it** — there is no take to inherit a parent
  from. Rule 5 below.
- **Priority is set, honestly.** This is the one place the seat deliberately differs from the
  reported intake, which sets none: a sweep ranking its own output is deciding what gets fixed,
  which is `bug review`'s job — whereas **an agent filing a bug it found itself already has the
  context to rank it, and is not ranking a queue.** Both are right; the difference is the
  situation, not a disagreement.

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

- **0.2.0 (2026-08-30, LIAB-967)** — §1 no longer states the shape; it points at
  [What a reported bug carries](https://linear.app/lia-creative/document/what-a-reported-bug-carries-ff781e0d6b8a), which is
  now the one home for what a bug ticket contains. 0.1.0 had written its own handover — *"when
  LIAB-967's bug ticket template lands, that document wins and this seat gets fixed"* — and this
  makes it true. What replaces it is the part that is genuinely this seat's: **what the QA intake
  fills differently** — steps to repeat as field 7, the release register as the source for
  tool/version/platform, evidence attached, the feature epic as parent, and **priority set**, which
  the reported intake deliberately does not do. The difference is stated rather than left implicit,
  because two intakes that differ silently drift into contradicting each other. §2's rules,
  §3's pile pass and the boundaries are unchanged.
- **0.1.0 (2026-08-29, LIAB-1024)** — first version. The bench's bug shape and filing seat: symptom
  title, numbered steps-to-repeat with concrete inputs, expected against actual, evidence and the
  build's version and stage, filed as `Bug` on the feature epic so it lands in the lane that built
  it. Unreproducible findings stay off the board, dedupe strengthens the existing ticket rather than
  spawning a sibling, and severity is honest in both directions. Two operating modes — the finder
  files in-session, the standalone session sweeps a pile — and the note that LIAB-967's template
  supersedes this shape when it lands.
