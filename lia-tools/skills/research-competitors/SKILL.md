---
name: research-competitors
slug: research-competitors
description: "The competitors domain of a research plan — how the competitive market actually works: who the players are, what they can and cannot do, where they cross into our lane, how they move and how fast. Screens captured through ui-capture and torn down through ui-teardown rather than described from memory. Use when dispatched at the competitors domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-competitors"
  - "research the competitors"
  - "who are we up against here"
companions:
  - researcher
  - research-lead
  - ui-capture
  - ui-teardown
  - research-solution-space
  - research-brand
  - execution-discipline
maintainer: cq
---

# Research — competitors

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **Who is actually in this market?** The direct players, the adjacent ones with a foot in it, and
  the platform that could absorb the category tomorrow.
- **What can each one do, and what can it not?** Capabilities and constraints — team, distribution,
  data, capital, the installed base that both funds them and holds them still.
- **Where do they cross into our lane, and how far?** The overlap stated precisely, feature by
  feature, not as a vibe about positioning.
- **How do they move?** Release cadence, what they have shipped recently, what they have announced
  and not shipped, what they have quietly removed.
- **What is their pricing and packaging**, and who is it aimed at?
- **What do they say they are for?** Their own words about their market — the claim, cited, without
  us grading it.

## Method

1. **Capture before you characterise.** Where the product is reachable, run `ui-capture` for the
   screens and `ui-teardown` for the flow and feature read — every claim about what a competitor does
   cites a shot, not a memory. The teardown is the primary source this domain files against.
2. **Read the changelog and the release notes.** Cadence and direction are visible there and nowhere
   else; a dated list of what shipped is one of the strongest artefacts in this domain.
3. **Take capability claims from what is documented or shipped**, not from a landing page — a
   promise on a marketing site is a source for the promise.
4. **Include the platform risk.** The player who could add this as a feature is a competitor even
   without a product today, and the entry says what would have to be true for them to.
5. **Keep the customer voice with the solution.** Reviews and complaints belong to
   `research-solution-space`; cite across rather than duplicating.

## Quality bar

- **Counts as a source:** captured screens and the teardown built from them, published changelogs and
  release notes, official documentation and pricing pages, filings and funding records, dated press
  and analyst coverage that names its sources, the company's own public statements.
- **Fails:** a feature comparison table from an unmaintained third-party site, a capability claim
  based on a screenshot with no date, competitor gossip with no attribution.
- **`DEVELOPING`** fits a direction visible across several releases that the company has not stated.

## Output

`researcher`'s corpus entry, `domain: competitors`. One finding block per player: capabilities,
constraints, the overlap with our lane stated feature by feature, cadence with dated evidence,
pricing, and their stated market. Locators are the captured shots and the release notes. Gaps names
the players you could not reach — a competitor behind a sales call is a real gap and is written down.

## What this seat is not

- **Not `research-solution-space`.** That inventories the answers people use, including the
  spreadsheet; this is about the companies and how the market moves.
- **Not `ui-teardown`.** That is the tool this seat runs, and its output is the evidence. This seat
  turns it into a competitive read and files it in the corpus shape.
- **Not a positioning statement.** What the overlap means for us is `research-insights`', and where
  we sit is a founder call.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The competitors domain: capture before
  characterise via `ui-capture` and `ui-teardown`, changelogs read for cadence and direction,
  capability claims taken from what is shipped or documented, platform risk included by default, and
  the customer voice left with the solution-space domain rather than duplicated.
