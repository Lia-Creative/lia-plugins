---
name: research-ux-patterns
slug: research-ux-patterns
description: "The UX-patterns domain of a research plan — the flow a person already expects because everyone ships it: the standard steps, states and affordances of a share panel, a sign-in, a destructive confirm, an upload, and what the evidence says breaking the convention costs. Captured and torn down, never recalled. Use when dispatched at the UX-patterns domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-ux-patterns"
  - "research the ux patterns"
  - "what is the standard flow for this"
companions:
  - researcher
  - research-lead
  - ui-capture
  - ui-teardown
  - design-flows
  - error-states
  - execution-discipline
maintainer: cq
---

# Research — UX patterns

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **What is the standard flow for this interaction?** The steps, in order, that a person has already
  learned from every other product — a share panel, a sign-in, a destructive confirm, an upload, a
  search, an undo.
- **What is the minimum a person expects to be covered?** The states that are always there: loading,
  empty, error, success, and the way back out.
- **What are the affordances and their conventional labels?** The words on the buttons are part of
  the pattern; changing them costs comprehension.
- **Where do implementations diverge, and does the divergence matter?** Real variation is a finding;
  cosmetic variation is not.
- **What does breaking the convention cost?** Where a study, a guideline or a documented failure says
  what happens.
- **What do the platform guidelines require?** Apple's and the platform's rules where they apply —
  and where they are enforced rather than advisory.

## Method

1. **Capture several implementations, then compare.** `ui-capture` for the screens, `ui-teardown` for
   the flow read — the pattern is what survives across four or five products, and each step cites the
   shots it was read from. A pattern claimed from one product is not a pattern.
2. **Walk the whole flow, including the exits.** The cancel path, the error path and the second run
   are where conventions actually live and where a from-memory description always thins out.
3. **Take the platform guidance from the platform**, primary and dated — Human Interface Guidelines,
   Material, WCAG where accessibility is part of the pattern.
4. **Separate the mechanism from the flow.** How sharing works underneath is
   `research-solution-patterns`; what the person sees and expects is this domain.
5. **Note the accessibility floor** the convention carries: focus order, announcement, target size,
   the keyboard path. A pattern described without it is half a pattern.

## Quality bar

- **Counts as a source:** captured flows across several products with dates, platform guidelines and
  accessibility standards, published usability studies, documented failures where a deviation caused
  measurable harm, design-system documentation from a maintained system.
- **Fails:** a pattern asserted from recall, a single product treated as the convention, a guideline
  cited without version or date.
- **`DEVELOPING`** fits a convention mid-shift — where the new products do one thing and the
  installed base still does another. Naming which is which is the finding.

## Output

`researcher`'s corpus entry, `domain: ux-patterns`. One finding per pattern: the steps in order, the
required states, the conventional labels, the accessibility floor, the observed variants with their
captures, and what deviating costs where a source says so. Gaps names the flows you could not reach.

## What this seat is not

- **Not `design-flows` or `error-states`.** Those design *our* flows and sweep our states. This
  brings back the convention they are designed against.
- **Not `ui-teardown`.** That is the tool; this seat runs it across several products and files the
  pattern that survives.
- **Not a design decision.** Which convention we follow or break is design's call, made with this
  evidence.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The UX-patterns domain: several implementations
  captured and compared before anything is called a convention, exits and second runs walked, the
  platform guidance taken primary and dated, the accessibility floor treated as part of the pattern,
  and the mechanism half routed to the solution-patterns domain.
