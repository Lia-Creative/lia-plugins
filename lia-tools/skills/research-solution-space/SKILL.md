---
name: research-solution-space
slug: research-solution-space
description: "The solution-space domain of a research plan — what already exists against this problem, why each one wins or loses, and what its own customers say about it in their words. Evidence about the market's answers, not a recommendation of one. Use when dispatched at the solution-space domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-solution-space"
  - "research the solution space"
  - "what already exists for this"
companions:
  - researcher
  - research-lead
  - research-competitors
  - ui-teardown
  - feature-definition
  - execution-discipline
maintainer: cq
---

# Research — the solution space

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **What exists against this problem today?** Products, features inside larger products, services,
  and the manual workaround people actually run — the spreadsheet counts.
- **Why does each one win?** The specific thing it does that keeps people paying or returning.
- **Why does each one lose?** Where it is abandoned, worked around, or complained about — with the
  complaint quoted.
- **What do its customers say, in their own words?** Reviews, forum threads, support archives,
  churn write-ups. Quoted, attributed and dated.
- **What is nobody serving?** The segment every existing answer treats as an edge case.
- **What did the market try and drop?** A dead feature is evidence, and its post-mortem is often the
  best source in this domain.

## Method

1. **Inventory before analysis.** List what exists, including the non-product answers, before
   forming any view of the space's shape.
2. **Use the product, or capture it.** Where a solution is reachable, its own behaviour is the
   primary source — run `ui-capture` and `ui-teardown` rather than describing screens from memory,
   and cite the captured shot as the locator.
3. **Take the win and loss from users, not from marketing.** A vendor's page is a source for what it
   *claims*; a review is a source for what someone *experienced*. The entry never mixes them.
4. **Quote the complaint.** A paraphrased complaint loses the thing that made it useful. Quote,
   attribute, date.
5. **Record the pricing and the model** where they are published — they explain most wins and losses
   in this domain and are cheap to capture.

## Quality bar

- **Counts as a source:** the product itself (captured), published pricing and documentation, dated
  user reviews with a locator, forum and support threads, published post-mortems and shutdown
  notices, analyst or industry reports that name their method.
- **Fails:** a feature list assembled from a comparison site nobody maintains, a claim about why
  users left with no user saying so, sentiment summarised without a quotable source.
- **`DEVELOPING`** fits a pattern you can see across several products but no source states.

## Output

`researcher`'s corpus entry, `domain: solution-space`. Each existing answer gets its findings —
what it does, its win, its loss, the quoted user voice, price where published. Gaps names the
solutions you could not reach (paywalled, invite-only, dead) so the lead can decide whether it
matters.

## What this seat is not

- **Not `research-competitors`.** That domain is about the companies and how they move; this is
  about the answers people currently use, whoever ships them — including the spreadsheet.
- **Not `research-solution-patterns`.** That names the standard shape of a solved problem; this
  inventories the actual instances in this market.
- **Not a recommendation.** Which answer we should take, or what the gap means for us, is
  `research-insights`'.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The solution-space domain: the inventory
  including non-product answers, win and loss taken from users rather than marketing, the customer
  voice quoted and dated, published pricing captured, and dead attempts treated as evidence.
