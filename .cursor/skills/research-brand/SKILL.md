---
name: research-brand
slug: research-brand
description: "The brand domain of a research plan — the tenets in play: what a competitor's brand actually promises and how consistently it holds, what the category's conventions are, and what the evidence says about how people read them. Observation with citations, never our own brand work. Use when dispatched at the brand domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-brand"
  - "research the brand domain"
  - "what are the brand tenets here"
companions:
  - researcher
  - research-lead
  - research-competitors
  - ui-capture
  - lia-voice-check
  - execution-discipline
maintainer: cq
---

# Research — brand

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **What does this brand actually promise?** The tenets as expressed, not as summarised in a deck —
  taken from the words and the surfaces the customer meets.
- **How consistently does it hold?** Where the promise and the product disagree, and where the voice
  changes between the marketing site, the app, the error states and the support reply.
- **What are the category's conventions?** The visual and verbal defaults everyone in this space
  shares — and what breaking one signals.
- **Who is it for, in its own telling?** The audience the brand is speaking to, evidenced by how it
  speaks.
- **What is the tone under pressure?** How the brand behaves in an outage, a price rise or a
  complaint — the most revealing and least curated evidence there is.
- **What does the audience say it reads as?** Reception, quoted and dated, where a source exists.

## Method

1. **Take it from the surfaces, not the manifesto.** A brand book is a source for the intent; the
   product's own copy, empty states and errors are the source for the practice. `ui-capture` for the
   surfaces, cited as locators.
2. **Sample the seams deliberately** — onboarding, the paywall, the failure, the goodbye. The voice
   holds or it does not, and the seams are where it breaks.
3. **Quote the words.** Verbal tenets are evidenced by lines of copy, verbatim and located. A
   paraphrase cannot be checked.
4. **Name the convention before the deviation.** "Everyone in this category does X" needs the several
   examples that make it a convention, each cited.
5. **Keep our own voice out of it.** This domain describes what is there; judging copy against Lia's
   voice is `lia-voice-check`, and it runs on our drafts, not on this research.

## Quality bar

- **Counts as a source:** captured surfaces with their dates, verbatim copy with a locator, published
  brand guidelines where a company has them, dated press and audience reception with attribution,
  the company's own public statements in a real moment.
- **Fails:** an adjective about a brand with nothing quoted under it, a colour or type claim from
  memory rather than a capture, reception asserted without a source.
- **`DEVELOPING`** fits a repositioning visible in recent surfaces but not stated.

## Output

`researcher`'s corpus entry, `domain: brand`. Findings pair each tenet with the copy or surface that
evidences it, note where it holds and where it breaks, and record the category conventions with
their examples. Gaps names the surfaces you could not reach — a paywalled onboarding is a real gap.

## What this seat is not

- **Not our brand work.** What Lia's brand should hold to is not researched here; this brings back
  what others do and what the category expects.
- **Not `lia-voice-check`.** That audits our drafted copy for AI tells and voice drift. This observes
  someone else's voice as evidence.
- **Not a design teardown.** The interface read is `ui-teardown`'s; this domain reads the promise and
  the voice.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The brand domain: tenets evidenced from the
  surfaces rather than the manifesto, the seams sampled deliberately, copy quoted verbatim with
  locators, category conventions established with several examples, and our own voice work kept out.
