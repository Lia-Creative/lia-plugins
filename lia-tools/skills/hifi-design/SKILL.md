---
name: hifi-design
slug: hifi-design
description: "The flows taken to hi-fi — every flow screen designed on the design system, expressed in its tokens and components, DS gaps named and routed never fudged, produced as the artefact the handoff will carry. Use when flows are ready for real screens, when asked for the hi-fi, or when a design needs to become a .dc.html or canvas artboard."
version: 0.1.0
created: 2026-08-27
updated: 2026-08-27
status: active
triggers:
  - "/hifi-design"
  - "take this to hi-fi"
  - "hi-fi for [story]"
  - "design the screens"
companions:
  - design-flows
  - error-states
  - design-handoff
  - design-lead
maintainer: cq
---

# Hi-fi design — the screens for real, on the system, as the artefact

**What this is.** The seat that draws the screens for keeps: every screen the flows name, at hi-fi, **expressed in the design system** — its tokens, its components, its two themes — and produced in the form the handoff carries (a `.dc.html` folder or Claude Design artboards that export to one, per `design-handoff` §1). What this seat makes is what the builder will be held to.

**Why it exists.** CQ, 26 Aug 2026: *"hifi design"* is its own step, after flows. Hi-fi drawn before flows answers layout questions with structure guesses; hi-fi drawn off-system produces screens the build can only approximate — and the approximations become the product.

---

## 1. Draw to the flows, not around them

The flow list is the work list: every screen in every flow, each in the states its flow names. A screen the flows don't contain doesn't get drawn — it gets its flow first (`design-flows`), which usually means it gets its scenario first. Fidelity is now the point: real copy over lorem, real data shapes over placeholders, both themes checked, the awkward-length content drawn on purpose.

## 2. On-system, or named — never fudged

Same stance as `polish`, one stage earlier, where it's cheaper:

- **Expressed in DS terms.** Tokens for colour, type and spacing; the system's components where they exist. The `.dc.html`'s helmet declares which system and snapshot it renders with — that declaration is a promise the build inherits.
- **A gap in the system is a finding with an owner** — Toys DS gaps route to Chris, `@lia/design-system` gaps to Dan — recorded on the ticket, and the screen carries the *intended* token, not an invented one. A one-off `#hex` "just for now" in the hi-fi is exactly how a design system dies one screen upstream of the build.
- **In toys work the DS is still growing** (CQ, 26 Aug: acceptable gaps exist) — acceptable means *named and routed*, not silent.

## 3. The artefact is the output

Not screenshots of it, not prose about it: the folder — prototype plus its sidecars and DS snapshot — that `design-handoff` will move. Interaction behaviour worth specifying goes in the artefact's state class, where the builder is told to read it. If the work happened on a canvas, export lands it in the same folder shape.

## 4. Hand off

`error-states` sweeps every flow against what's drawn — hi-fi leaves this seat happy-path-complete, and the sweep is what makes it design-complete. Then `design-handoff` carries the artefact onto the ticket.

## What this seat is not

- **Not the flows.** Structure is decided upstream; hi-fi that quietly reroutes a flow is a finding, not a flourish.
- **Not the sweep.** Error, empty, loading and edge live in `error-states` — deliberately separate, because the seat that drew the happy path believes in it.
- **Not a DS build licence.** Gaps are named and routed; the system changes through its owners.

## Changelog

- **0.1.0 (2026-08-27, CQ + LIAB-995)** — first version. The hi-fi step of CQ's design stage as its own seat: flows as the work list, the on-system-or-named rule carried upstream from `polish`, and the artefact (not pictures of it) as the output.
