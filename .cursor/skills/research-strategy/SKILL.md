---
name: research-strategy
slug: research-strategy
description: "The strategy domain of a research plan — the set of strategies available for the goal being chased, with 7 Powers as the named lens: what durable advantage each one rests on, what it costs to hold, who has run it in this market and what happened. Evidence about strategies, never a recommendation of one. Use when dispatched at the strategy domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-strategy"
  - "research the strategy domain"
  - "what strategies exist for this goal"
companions:
  - researcher
  - research-lead
  - research-competitors
  - research-insights
  - decision-check
  - execution-discipline
maintainer: cq
---

# Research — strategy

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **What strategies are actually available for this goal?** Not what we should do — the set on the
  table, each one named and described as its practitioners describe it.
- **What durable advantage does each rest on?** **7 Powers is the named lens** (Hamilton Helmer):
  scale economies, network economies, counter-positioning, switching costs, branding, cornered
  resource, process power. Which power a strategy is trying to build, or whether it is building none.
- **What does it cost to hold?** Every power has a maintenance bill — the entry brings back what
  operators say it is.
- **Who has run this in a comparable market, and what happened?** With the outcome, dated, including
  the ones that failed.
- **What has to be true for it to work?** The conditions the sources name — market structure, timing,
  capital, distribution.
- **What does it foreclose?** A strategy taken is options given up; the sources usually say which.

## Method

1. **Name the power before describing the play.** Classifying by 7 Powers is what stops this domain
   producing a list of tactics that all sound reasonable.
2. **Go to the operator account.** Shareholder letters, founder write-ups, published case studies,
   post-mortems and analyst reports that name their method — before the strategy commentary that
   summarises them.
3. **Take failures as seriously as wins**, and look for them deliberately: a strategy is defined by
   the conditions under which it does not work, and survivorship is this domain's standing bias.
4. **Distinguish the strategy from the story told about it afterwards.** A retrospective narrative is
   a source for what the company says now; contemporaneous evidence is stronger and is marked as
   such.
5. **Where a strategy depends on a competitor's position**, the competitive facts come from
   `research-competitors` and are cited from that entry rather than re-derived.

## Quality bar

- **Counts as a source:** the primary strategy text where one is being applied (Helmer's *7 Powers*
  for the powers themselves), shareholder and investor communications, dated founder or operator
  accounts, published case studies and post-mortems, analyst reports that state their method.
- **Fails:** a strategy framework applied from memory without the text, a "lesson" from a company
  with nothing contemporaneous behind it, a business-press narrative with no primary source under it.
- **`DEVELOPING`** fits a play with early evidence and no completed cycle — common and worth having,
  marked honestly.

## Output

`researcher`'s corpus entry, `domain: strategy`. One finding per strategy: the name, the power it
rests on, the conditions it needs, the maintenance cost, who has run it with what outcome, and what
it forecloses. Disagreements is where the commentary conflicts about why something worked.

## What this seat is not

- **Not our strategy.** Which play we take is a founder decision — `decision-check` is the seat that
  pressure-tests it, and `research-insights` is what turns this corpus into the story that informs
  it. This entry never recommends.
- **Not `research-competitors`.** That domain is who we are up against and how they move; this is the
  set of plays available, whoever runs them.
- **Not a framework tour.** 7 Powers is the lens because it is named in the commission, not the
  subject; the subject is this goal, in this market.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The strategy domain with 7 Powers as the named
  lens per the commission: classify by power before describing the play, operator accounts over
  commentary, failures sought deliberately against survivorship bias, and the recommendation kept out
  and routed to insights and the founder.
