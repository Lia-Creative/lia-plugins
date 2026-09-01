---
name: design-flows
slug: design-flows
description: "Transform the reqs and the chosen direction into clear flows — every scenario walked as screens, states and transitions, each flow named after the scenario it serves, gaps routed back as findings not filled by invention. Use when a chosen direction needs its flows, when asked how a user moves through a feature, or before hi-fi starts."
version: 0.1.1
created: 2026-08-27
updated: 2026-08-27
status: active
triggers:
  - "/design-flows"
  - "map the flows for this"
  - "flows for [story]"
  - "how does the user move through this"
companions:
  - design-reference
  - design-exploration
  - hifi-design
  - scenario-builder
  - design-lead
maintainer: cq
---

# Design flows — every scenario walked as screens, before any screen is drawn

**What this is.** The seat that turns the chosen direction into **clear flows**: each scenario from the story walked as a sequence of screens, the states each screen can be in, and the transitions between them. The flows are the design's skeleton — hi-fi puts skin on them, it doesn't decide them.

**Why it exists.** CQ, 26 Aug 2026: *"transforming them into clear flows"* is its own step. A hi-fi screen drawn before its flow exists answers a question nobody asked; the expensive design failures are missing screens, not ugly ones.

---

## 1. The scenarios are the flow list

`scenario-builder`'s Given/When/Then walks are this seat's raw material — **one flow per scenario, named after it.** The Givens say what state the flow starts in; the Whens are the transitions; the Thens are what each screen must show for the walk to succeed. A flow with no scenario behind it is scope invented sideways; a scenario with no flow is the stage not yet covered.

## 2. Walking a flow honestly

- **Every screen earns its place** by a scenario reaching it. A screen no scenario reaches gets cut or gets its scenario — through discovery, not by editing the flow.
- **The missing-Given probe becomes the missing-screen probe:** what does the person see *before* the happy path starts, and *between* the steps? First-run, mid-task interruption, coming back later — if a scenario implies them, the flow shows them.
- **Transitions are decisions.** Name what triggers each move (the person acts, the system finishes, time passes) — "then the next screen" hides exactly the logic the builder will have to invent.
- **A flow that needs a state the story never mentions is a finding**, routed back through `design-lead` (a `defect:discovery` or a scenario gap), never quietly absorbed. Filling gaps by invention is how design and discovery drift apart.

## 2b. Reference as a shortcut, never as the reason

Where reference exists for a flow of this shape, `design-reference` shortens the walk — someone has already
solved the ordering, and its breakdown says which decisions they made. Two limits hold: **a borrowed screen
still needs a scenario reaching it** (the rule above does not soften for a good reference), and **the model
check comes first** — a step that exists because of their product's model is not a step in ours.

## 3. The form

Flows live with the design artefact — a flow page on the canvas or in the `design/[spec-name]/` folder — legible enough that `error-states` can sweep them and `hifi-design` can build to them: screens as boxes with their states listed, transitions as labelled arrows. Fidelity stays low; this seat's output is structure.

## 4. Hand off

`hifi-design` takes the flows and draws the screens. The flow list is also `error-states`' checklist — every flow gets swept.

## What this seat is not

- **Not visual design.** Boxes and arrows, not layouts; the system's look arrives at hi-fi.
- **Not new scope.** Flows serve the scenarios that exist; more scenarios is discovery's call.
- **Not the state sweep.** Flows note the states a walk touches; `error-states` hunts the ones it doesn't.

## Changelog

- **0.1.0 (2026-08-27, CQ + LIAB-995)** — first version. The clear-flows step of CQ's design stage as its own seat: scenario-to-flow mapping, the missing-screen probe, transitions as named decisions, and gaps routed back instead of invented over.
- **0.1.1 (2026-08-27, CQ + LIAB-1000)** — reference named as a legitimate shortcut into the walk, under the scenario rule and the model check.
