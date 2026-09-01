---
name: research-problem
slug: research-problem
description: "The problem domain of a research plan — go deep on what the problem actually is: who has it, how often, what it costs them, what is already studied and known about it, and how the field names it. Evidence about the problem only, never about what to build. Use when dispatched at the problem domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-problem"
  - "research the problem domain"
  - "what is known about this problem"
companions:
  - researcher
  - research-lead
  - problem-definition
  - jtbd
  - execution-discipline
maintainer: cq
---

# Research — the problem

**Load `researcher` first.** The method, the citation shape, the FACT/DEVELOPING marking and the
filing rules live there. This seat adds the domain.

## What this domain asks

- **Who actually has this problem, and how many of them are there?** Named populations with a number
  behind them, not "people who".
- **How often does it bite, and what does it cost when it does?** Frequency and consequence — time,
  money, risk, abandonment.
- **What is already studied?** The literature, the industry research, the survey data. A problem that
  looks new is usually a problem with a name in someone's field.
- **What does the field call it?** The term of art, so later work can search on the right word.
- **What has been tried against it, and what happened?** Attempts and their published outcomes — not
  the products (that is `research-solution-space`), the *record* of the problem resisting.
- **Who says it is not a problem, and on what evidence?** The counter-case, sourced.

## Method

1. **Start where the problem is measured, not where it is discussed.** Studies, industry surveys,
   regulator or platform data, published post-mortems. Forums and reviews are real evidence of
   experience — cite them as that, and never as prevalence.
2. **Find the field's own name for it** early; it changes what every later search returns.
3. **Separate the problem from its current workaround.** A person describing a workaround is
   describing a symptom; the entry records both, and says which is which.
4. **Bring back the counter-case.** A problem nobody credible disputes is usually stated too vaguely
   to dispute.
5. Where the plan's questions came from an internal source — a ticket, a chat, a support pile — cite
   it like any other source, with its locator. Internal evidence is evidence; unsourced recollection
   is not.

## Quality bar

- **Counts as a source:** peer-reviewed or industry study, regulator or platform data, a named
  organisation's published research, primary documentation, a dated first-hand account with a
  locator, an internal record that can be linked.
- **Fails:** "it is well known", a statistic with no traceable origin, a vendor's marketing claim
  about the problem their product solves (that is a competitor claim — cite it as one), a model's
  recollection of a study it cannot name.
- **`DEVELOPING` is the right mark** for a problem that the sources agree is growing but nobody has
  yet sized.

## Output

`researcher`'s corpus entry, `domain: problem`. Findings carry the population, frequency and cost
figures with their sources; Disagreements carries the counter-case where one exists; Gaps names any
question the literature does not answer — which is itself the most useful thing this domain returns.

## What this seat is not

- **Not `problem-definition`.** That discovery seat formalises *our* problem statement onto the
  board. This one brings back what the world already knows about it, so that statement can cite
  something.
- **Not `jtbd`.** The job is what the person is trying to get done; this is the evidence that the
  obstacle is real.
- **Not the solution.** What exists against the problem is `research-solution-space`.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The problem domain: prevalence, frequency and
  cost with sources, the field's own name for it, the record of what has been tried, and the
  counter-case treated as required rather than optional.
