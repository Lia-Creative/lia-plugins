---
name: jtbd
slug: jtbd
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/jtbd"
  - "what's the job to be done"
  - "name the job"
  - "define the JTBD"
  - "map the requirements for this job"
companions:
  - problem-definition
  - epic-builder
  - story-writer
maintainer: cq
---

# JTBD — the job named consistently, before the epic cites it

**What this is.** The seat that defines jobs-to-be-done the same way every time and maps what a job requires. It sits right beside `epic-builder` — the job is what the epic's value statement stands on, and the JTBD/User/Success/Why thinking that used to live inside the epic seat is this seat's whole work.

**Why it exists.** CQ, 26 Aug 2026: *"a skill designed to consistently define jobs to be done and map requirements."* A job written differently every time can't be compared, deduplicated, or traced through the stories that serve it.

---

## 1. The job statement — one shape, always

> **When** [the situation, concretely], **[person]** wants to **[the progress they're trying to make]**, **so they can** [the outcome in their life — not in the product].

Rules that keep it honest:

1. **The person is real.** A named adventurer from the discovery chats first; a named face from who-we-serve second; "the user" never. Where the cast and a real adventurer disagree, **the adventurer wins** (register, 25 Aug).
2. **The situation carries the job.** "When the shoot is done and the cards are full" locates a job; "when using the app" locates nothing.
3. **Progress, not features.** People hire for progress — *get the day's footage somewhere safe without deciding anything* — not for capabilities. If a product name appears in the job statement, start again.
4. **The outcome is the lie detector.** Same rule as the story's so-that clause: if the progress wouldn't actually produce the stated outcome, there's a missing job underneath.
5. **Cite the problem.** Every job traces to a `problem-definition` brief or a discovery source. A job with no problem behind it is invented demand.

## 2. Mapping the requirements

Under the statement, what serving the job requires — the bridge to the epic:

- **Must be true for the person** — the outcomes the job needs, in their terms (these become story candidates).
- **Must be true of the system** — the capabilities and data the job depends on (these route to `schema-manager` and become task candidates).
- **Out of the job** — adjacent progress deliberately not served, so the epic inherits non-goals instead of inventing them.

## 3. Hand off

`epic-builder` cites the job (relation or link) and writes the versioned chunk of value that serves it; scope still lives in the stories. One job can span several epic versions; a job that needs three epics at once is probably two jobs.

## What this seat is not

- **Not the epic.** The job says what someone is hiring for; the epic says what we're building about it this version.
- **Not personas.** No demographic sketches — situations and progress only.
- **Not a shortcut past the problem.** No brief, no job.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. Carved from the JTBD lens inside `epic-builder` 0.1.0 into its own seat, with the requirements map as the epic bridge.
