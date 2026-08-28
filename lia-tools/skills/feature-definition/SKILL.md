---
name: feature-definition
slug: feature-definition
description: "Shape a raw idea into a defined feature before an epic is written — the idea captured verbatim, the context block (source, insight, surrounding variables, data with known split from inferred), and mandatory analogue research into what the world already does. Use when an idea, complaint or hunch is about to become work and nobody has looked at how it has been solved elsewhere."
version: 0.2.0
created: 2026-08-27
updated: 2026-08-28
status: active
triggers:
  - "/feature-definition"
  - "define this feature"
  - "shape this idea up"
  - "turn this idea into a feature"
  - "what does the world already do about this"
  - "run the analogues"
companions:
  - problem-definition
  - jtbd
  - epic-builder
  - story-writer
  - ui-teardown
maintainer: cq
---

# Feature definition — the idea shaped, and the world checked, before the epic

**What this is.** The seat between `jtbd` and `epic-builder`. The job says what someone is hiring for; the epic says what we are building about it this version. This is the step in between: the idea captured in the founder's own words, the context that makes it decidable, and **an honest look at how the world already solves this** — so the epic is written by someone who has seen the field, not from a blank page.

**Why it exists.** CQ, 26 Aug 2026: *"there are some good feature definition ones in there"* — the shaping pass Chris had been running in his personal bundle since June 2026, brought onto the bench (LIAB-996). Its two load-bearing parts were the ones the shop had nowhere else: the **context block** with its known-versus-inferred split, and **mandatory analogue research**. Everything else it used to carry — user stories, acceptance criteria, the Linear push — is now owned by `story-writer`, `acceptance-criteria` and `ticket-builder`, and is not repeated here.

---

## 1. Capture and clarify

**Capture the rough idea verbatim before shaping it.** The original words are the record if the framing later drifts.

Then ask **three to five questions, maximum** — only the ones you genuinely cannot infer. Give your guess and let it be corrected; that is faster than asking blind, and it is the difference between a conversation and a form.

What you actually need:

1. **Source.** Where did this come from — an adventure chat, a feedback video, a founder's own friction, a support message? Be specific enough to cite.
2. **Person.** Who is this for? A named adventurer first, a named face from who-we-serve second, "the user" never (the `jtbd` rule travels).
3. **Need.** The progress underneath the request. If a job statement already exists, cite it instead of rewriting it.
4. **Solved looks like.** If this worked perfectly, what would the person say or do differently?
5. **Evidence.** What data, observation or pattern backs this — and how confident are we?

If the brief already answered it, don't re-ask. Acknowledge and move.

## 2. The context block

The why-this-matters, written for whoever picks the work up without you in the room. Four parts, all of them:

- **Source** — where this came from, precisely enough to check. Chat and timestamp, ticket, message and date.
- **Insight** — what this reveals about the person's world, not a restatement of the problem. *"Musicians treat their file library as a creative memory, not a database — so duplicates feel like memory errors, not disk waste."*
- **Surrounding variables** — constraints, dependencies, what it touches. What has to exist first; which toy or surface it lands in.
- **Data** — the signals, with **known split from inferred, explicitly**. *"Known: this adventurer has 2,400 duplicates. Inferred: the pattern likely holds for others working across two machines. Not yet validated."*

**The hard rule: if you are inferring, say so.** A guess presented as a fact propagates into the epic, the stories, and eventually a build.

## 3. Analogue research — not optional

Find **two to four analogues** — products already solving a version of this — and write what they teach. Full method, including the three rings and where to look: `references/analogue-research.md`.

The short version:

- **Ring 1** — same problem, same person. The obvious ones.
- **Ring 2** — same problem, different person or context. Often the most useful: you see the invariant shape of the solution separate from the audience-specific decoration.
- **Ring 3** — different problem, same underlying shape. Where the non-derivative ideas come from.

**Include at least one Ring 2 or Ring 3.** Pure Ring 1 research produces derivative features.

Per analogue: the pattern, what is good, what is missing, what we would borrow, and **the source URL** so it can be re-checked. Then a pattern summary — what these collectively say about the shape of the solution, including where the good ones *diverge*, because that is where the opportunity usually is.

Analogues are read, not assumed: use search and actually fetch the source. A remembered analogue is a fabrication with a brand name on it.

## 4. Shape and hand off

What this seat produces:

- **Title** — plain and action-shaped. *"Duplicate detection in the library"*, not *"Library Cleanup 2.0"*.
- **Problem statement** — one or two sentences in the person's language, citing the `problem-definition` brief where one exists.
- **The context block** (section 2) and **the analogue findings** (section 3).
- **Out of scope** — two or three things explicitly not included, so the epic inherits non-goals instead of inventing them.
- **Open questions** — what still needs a founder or a real chat before design or build.

Then hand off, and stop:

| Next | Seat |
|---|---|
| The versioned chunk of value this becomes | `epic-builder` |
| The capabilities a person gets | `story-writer` |
| The flows walked with concrete inputs | `scenario-builder` |
| The criteria frozen as the contract | `acceptance-criteria` |
| Anything reaching the board | `ticket-builder` |

The definition lives with the work: on the epic, in the toy's `01 planning/` or `02 analysis/`, or in the product's Outputs. **Say where you are about to write it before you write it**, and let it be redirected in one sentence.

## What this seat is not

- **Not the story writer.** No `As a / I want / so that`, no Given/When/Then here — those shapes belong to `story-writer` and `acceptance-criteria`, and a second copy of them drifts from the first.
- **Not the problem.** No brief, no evidence — go back to `problem-definition`. A feature definition standing on an unstated problem is a solution looking for one.
- **Not a competitor teardown.** Analogues are a light, sourced read of the field. Screen-by-screen evidence with a feature matrix is `ui-teardown`.
- **Not technical.** If you are writing *how* — endpoint, schema, function — stop and write what the person experiences. Implementation notes are `build-prep`'s.

## What was not ported, and why

The source skill's later stages are deliberately absent (LIAB-996 asks for this to be named): its **user-stories** and **acceptance-criteria** references and its **Linear push** were written before the shop had `story-writer`, `acceptance-criteria` and `ticket-builder`. Those seats now own that ground and are stricter about it — Dan North narrative shape, numbered criteria frozen as the contract, delivery checks split out. Carrying the older versions across would have meant two answers to the same question, which is the drift the plugin exists to end.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.
- **0.1.0 (2026-08-27, LIAB-996)** — first version. Ported from Chris's `cq` bundle (`feature-definition`, v0.5.0, 28 Jul 2026) and scoped to what the bench lacked: capture, the context block, and mandatory analogue research; `references/analogue-research.md` carried over intact. Stories, criteria and the Linear push dropped to their owning seats.
