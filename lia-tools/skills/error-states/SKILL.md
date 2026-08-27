---
name: error-states
slug: error-states
description: "The state sweep after hi-fi — error, empty, loading and edge states hunted per flow, each one designed or explicitly ruled out with why; happy-path-only never leaves this seat as done. Use when hi-fi screens exist and the design believes itself finished, or when asked what happens when a flow goes wrong."
version: 0.1.1
created: 2026-08-27
updated: 2026-08-28
status: active
triggers:
  - "/error-states"
  - "sweep the states"
  - "what happens when it fails"
  - "error states for [story]"
companions:
  - hifi-design
  - design-flows
  - design-handoff
  - design-lead
  - ux-writing
maintainer: cq
---

# Error states — the sweep that makes a happy path a design

**What this is.** The seat that hunts the states the happy path skips: per flow, the error, empty, loading and edge states — each one **designed, or explicitly ruled out with the reason written down.** The sweep runs after hi-fi and is deliberately a different seat: the session that drew the happy path believes in it.

**Why it exists.** CQ, 26 Aug 2026: *"error states"* is its own step in the design stage. The most repeated design failure isn't an ugly screen — it's a builder inventing what the design never showed, at midnight, in the error branch. The `.dc.html` format itself says so: its state class *"lists the real interaction states the build must solve for"* — this seat is where that list gets earned.

---

## 1. The sweep, per flow

The flow list from `design-flows` is the checklist; every flow gets all four passes:

| Pass | The question |
|---|---|
| **Error** | Each transition that can fail — what does the person see, what can they do next? A dead end with a message is not an answer to the second half. |
| **Empty** | First run, zero items, nothing yet — what does the screen teach? Empty is most people's first impression of the feature. |
| **Loading** | Each wait the flow contains — what holds the layout, what's skeleton, what's spinner, what happens if it never finishes (that's an error state; cross-reference it). |
| **Edge** | The awkward realities: one item and ten thousand, the absurdly long title, offline mid-step, permission missing, the stale tab acting on gone data. |

**The sources of truth:** the scenarios' Givens (a Given that can be false is a state), the flows' transitions (a transition that can fail is a state), and the schema (`schema-manager` knows which fields can be null, huge, or absent).

## 2. Designed, or ruled out loud

Every state found gets one of exactly two outcomes on the ticket:

- **Designed** — the state drawn in `hifi-design`'s artefact, in the same on-system discipline, listed in the artefact's state class.
- **Ruled out, with why** — *"offline mid-upload: not designed; the toys run local-only"* is a decision the builder can trust. Silence is neither; silence is the builder inventing.

The sweep's output is the completed list, and it is what `design-lead`'s coverage verdict cites for its **States** row.

## 3. Hand off

`design-handoff` carries the artefact — now state-complete — onto the ticket; the state class in the tail script is the sweep made machine-readable for the builder.

## What this seat is not

- **Not new flows.** A state lives inside a flow; a sweep that discovers a missing *flow* routes it back to `design-flows`.
- **Not QA of the build.** `polish` checks the built states against the artefact later; this seat makes sure the artefact has them at all.
- **Not a completeness performance.** Ruling a state out with a reason is a first-class outcome — the sin is silence, not scoping.

## Changelog

- **0.1.1 (2026-08-28, LIAB-1004)** — names `ux-writing` back, closing the one-way link. This seat finds the states that need words; that one writes them. Every state this sweep surfaces arrives at `ux-writing` needing a string.
- **0.1.0 (2026-08-27, CQ + LIAB-995)** — first version. The error-states step of CQ's design stage as its own seat: the four-pass sweep per flow, designed-or-ruled-out-loud as the only two outcomes, and the state class as where the sweep lands for the builder.
