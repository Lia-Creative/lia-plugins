---
name: research-solution-patterns
slug: research-solution-patterns
description: "The solution-patterns domain of a research plan — the known, established shape of a solved problem: how authentication, sync, permissions, billing or search are conventionally done, what each variant costs, and where the convention is settled versus still contested. Use when dispatched at the solution-patterns domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-solution-patterns"
  - "research the solution patterns"
  - "what is the standard way to solve this"
companions:
  - researcher
  - research-lead
  - research-technology
  - architecture
  - execution-discipline
maintainer: cq
---

# Research — solution patterns

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **Is this a solved problem with a name?** Authentication, sync and conflict resolution,
  permissions, billing, search, undo, offline — each has an established shape, and reinventing it is
  how a build spends a fortnight on a known answer.
- **What are the variants, and what does each cost?** The two or three canonical approaches, with
  their trade-offs stated by the sources that use them.
- **What does the convention assume?** Every pattern has a context where it holds and a context where
  it breaks; the entry names both.
- **Where is the convention settled, and where is it still argued?** A contested pattern is a
  decision the build will have to make deliberately.
- **What does the pattern imply downstream** — for the data model, the interface, the operational
  burden?

## Method

1. **Name the pattern first**, in the field's own words. The name is what makes the rest of the
   research findable and what stops two seats describing the same thing differently.
2. **Go to the primary statements of it** — specifications, RFCs, the framework's own documentation,
   the canonical write-up practitioners cite. Blog restatements are secondary and are cited as such.
3. **Take the trade-offs from implementers**, not from advocates: migration write-ups, incident
   reports and "why we moved off X" posts state costs that a specification never does.
4. **Where the pattern is a user-facing flow rather than a mechanism**, hand that half to
   `research-ux-patterns` — this domain covers the mechanism, that one covers what the person
   expects to happen.
5. **Check the pattern's age.** A settled convention from a decade ago may have been superseded;
   date every source and say when the field moved.

## Quality bar

- **Counts as a source:** specifications and RFCs, official framework or platform documentation, the
  canonical practitioner write-up the field cites by name, published implementation and migration
  reports, a named organisation's engineering post with detail.
- **Fails:** a tutorial with no author or date, a pattern asserted from a model's recollection, "best
  practice" with nobody named as holding it.
- **`DEVELOPING`** fits an emerging approach with real adopters but no settled convention — which is
  a genuinely useful finding, marked honestly.

## Output

`researcher`'s corpus entry, `domain: solution-patterns`. One finding per pattern: the name, the
variants, the trade-offs with their sources, the assumptions, and the downstream implications.
Disagreements is where a contested convention belongs, with both positions cited.

## What this seat is not

- **Not `research-technology`.** That covers specific technologies, their risks and their prior art;
  this covers the shape of the answer regardless of what it is built with.
- **Not `architecture`.** That seat decides what *we* do and keeps our patterns singular. This one
  brings back what the field does so that decision is informed.
- **Not a choice.** Which variant we take is a decision, made downstream with the evidence this entry
  provides.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The solution-patterns domain: name the pattern
  in the field's words, primary statements over restatements, trade-offs taken from implementers,
  the settled-versus-contested split, and the seam with the UX-pattern domain for user-facing flows.
