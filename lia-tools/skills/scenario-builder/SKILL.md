---
name: scenario-builder
slug: scenario-builder
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/scenario-builder"
  - "build the scenarios"
  - "walk the flows"
  - "what are the scenarios for this story"
  - "scenario the story"
companions:
  - story-writer
  - schema-manager
  - acceptance-criteria
  - ready-review
maintainer: cq
---

# Scenario builder — a user walked through the flow, inputs in hand

**What this is.** The seat that formally creates the scenarios a user story covers: **a user walking through a flow with a set of inputs**, documented in a standard shape, prescribing exactly what the app has to solve for. Scenarios are the raw material the numbered Given/When/Then acceptance criteria are cut from — this seat walks them; `acceptance-criteria` freezes them.

**Why it exists.** CQ, 26 Aug 2026. The user-stories assessment found the scenario structure — *the load-bearing half of Dan North's anatomy* — absent from every canonical template, which is why AC lists blurred behaviour with process notes and nobody could run the two probes that matter. The canonical scenario definition is `Wiki/concepts/user-stories.md` (vault) and [Dan North's article](https://dannorth.net/blog/whats-in-a-story/); this seat operationalises it.

---

## 1. One scenario, the standard shape

> **Scenario N — [what differs about this one]** *(the title expresses what's different between scenarios — North's rule)*
> **Given** [the context — all of it, and no more]
> **When** [one event — a single simple action]
> **Then** [every material outcome — the state written, the thing shown, the side effect, the event emitted]
> **Inputs:** [the concrete set this walk carries — values, files, states; constraints named]

Rules, each one paid for in the 26 Aug assessment:

1. **The Givens are all of, and no more than, the required context.** The probe: *could two different outcomes both be true under the stated context?* Then a Given is missing. An extra Given is a distraction — cut it.
2. **One event per When.** An AC packing surface + confirm + write-back + track into one line is three scenarios (the Show Booking F2 fail, 9-AC bloat included).
3. **The Thens cover the forgotten outcomes** — the state change, the sidecar written, the event downstream features consume. The forgotten Then is the commonest gap in eleven of eleven artefacts graded.
4. **Inputs are concrete.** "A file" walks nothing; "a 4 GB `.braw` clip with no sidecar, on a nearly-full volume" walks something. The input set is what makes a scenario *prescriptive* — the app must solve for these, not for the happy abstraction.
5. **The set covers the edges as a person meets them** — the empty state, the obvious wrong input, the second run over the same data. Five or six scenarios per story at most; more means the story is too big — split along user value, never technical layers.

## 2. Where scenarios land

- **On the story**, under its narrative — they are the story's behavioural spec, numbered, because everything downstream cites them by index.
- **Every entity and variable a walk touches goes to `schema-manager`** — a scenario that invents an undeclared variable has found either a schema gap (record it) or its own bug.
- `ready-review` grades the set (checks 3–4 of the five-check rubric); `acceptance-criteria` reconciles it with the design and freezes the final numbered ACs.

## What this seat is not

- **Not the narrative.** `story-writer` owns who wants what and why; this seat owns what happens when they do it.
- **Not test code.** Scenarios are the spec tests get written from — Build consumes them as the test spec; writing the tests is Build's.
- **Not exhaustive-path enumeration.** Material outcomes and real edges, not a combinatorial sweep. If a walk teaches nothing, it isn't a scenario.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The scenario form installed as a seat (LIAB-949 P2's raw material), with the missing-Given and forgotten-Then probes and the concrete-inputs rule.
