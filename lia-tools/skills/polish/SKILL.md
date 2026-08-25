---
name: polish
slug: polish
description: "Hold the built interface to the design spec (the HTML artefact, which wins over prose) in design-system terms — and where Toys DS can't yet express the spec, name the acceptable gap and leave the note, never silently approximate. Use before calling any story with a design spec done."
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/polish"
  - "match the design spec"
  - "polish this against the design"
  - "does the interface match the spec"
companions:
  - build
  - review-and-merge
maintainer: cq
---

# Polish — the interface held to the spec, gaps named not fudged

**What this is.** The build agent's design-conformance pass: review the design spec (the HTML artefact on the story — the interface itself, not a description of it) and make the built interface match it. And the honest half: **Toys DS is still being built**, so some of what a spec shows can't yet be expressed in system terms — those are **acceptable gaps**, and this seat's job is to *identify* them and *leave notes*, never to silently approximate.

**Why it exists.** CQ, 26 Aug 2026: *"in toys scenario we are still building the DS, so there will be some acceptable gaps that the polish skill will identify and leave notes for gaps to fill."* Without this pass, gaps get filled with inventions — raw hex, one-off components — and the design system stops being one.

---

## 1. The conformance pass, per story with a spec

1. **Open the artefact and the build side by side** — the spec is the HTML on the ticket; where prose and artefact disagree, **the artefact wins** (the standing rule, stated on the ticket).
2. **Walk it visually, both themes.** Structure, spacing, states (empty, hover, focus, error), type, motion where specified. In toy-box work: `pnpm screenshot` (and `--toy <id>`) is how you look — a visual change you didn't look at isn't done, and a capture is evidence for one commit only.
3. **Express everything in system terms.** Toys DS tokens by reference — no raw hex/rgb/oklch in app code; Toys DS wins over `@lia/design-system` where a token name exists in both. A spec detail achievable with existing tokens/components gets built with them, full stop.

## 2. The gaps — named, noted, never fudged

Where the spec shows something the DS can't yet express:

1. **Decide it's genuinely a gap** — not a token you missed. Search the DS first; the commonest "gap" is an unfamiliar token.
2. **Build the nearest system-true expression** — the closest existing token/component, *not* a hand-rolled approximation of the spec. A one-off `#hex` "just for now" is exactly how a design system dies.
3. **Leave the note, twice:** a short comment in code only if a constraint needs stating; and **the gap on the ticket** — what the spec shows, what was built instead, which token/component is missing. Gaps route by owner: **Toys DS gaps → Chris** (he draws Toys DS); **`@lia/design-system` gaps → Dan** (`design-system` label). Never fork or patch either system in the repo.
4. **The gap list rides the story's Review** — the lead engineer sees conformance *and* the named gaps in one place; "matches except these three named gaps, tickets left" is a pass; "roughly matches" is not.

## What this seat is not

- **Not design.** The spec is decided upstream; polish matches it, it doesn't negotiate with it. A spec that seems wrong is a batched question, not a silent improvement.
- **Not a DS build licence.** Missing tokens get noted and routed, never invented in-repo.
- **Not pixel litigation.** Conformance is the interface a person meets — structure, tokens, states — not a screenshot-diff fetish. Judgement edges land as `[Graded at Review]` and get graded there.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The conformance walk, system-terms rule, and the named-gap discipline with owner routing (Toys DS → Chris, DS → Dan).
