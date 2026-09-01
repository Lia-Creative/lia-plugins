---
name: research-technology
slug: research-technology
description: "The technology domain of a research plan — what a specific technology actually does, what it costs to run, where it fails, what its limits and licence terms are, and who has run it at our shape of problem. Evidence about the technology, never the choice of one. Use when dispatched at the technology domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-technology"
  - "research the technology domain"
  - "what are the risks with this technology"
companions:
  - researcher
  - research-lead
  - research-solution-patterns
  - architecture
  - security
  - execution-discipline
maintainer: cq
---

# Research — technology

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **What does it actually do, per its own documentation** — and what does it explicitly not do?
- **What are the limits?** Rate limits, quotas, size and payload caps, cold starts, supported
  platforms and versions. Numbers, from the documentation, dated.
- **What does it cost to run at our shape?** The pricing model, and the dimension that actually
  drives the bill.
- **Where does it fail?** Known issues, published incidents, the failure modes practitioners report
  — and what the recovery path is.
- **What are the licence and data terms?** Licence, data residency, retention, what the vendor may do
  with what passes through. **Anything with an owner is asked, never inferred.**
- **Who has run it at this shape of problem, and what did they say afterwards?**
- **What is its maintenance state?** Release cadence, open issue burden, whether it is one person's
  weekend, and what the migration path off it looks like.

## Method

1. **Primary documentation first**, at the version we would use. Version and date every claim — a
   limit from two majors ago is misinformation.
2. **Read the issue tracker and the incident history**, not just the README. The gap between what a
   project claims and what its issues show is the most valuable finding in this domain.
3. **Prove the limits where you can reach them**, and say so; where you cannot, cite the
   documentation and mark it as documented rather than observed.
4. **Licence, data and cost terms are quoted verbatim** with their locator. A summary of a licence is
   not a licence, and this is the domain where a paraphrase does real damage.
5. **Route the mechanism question out.** The general shape of the answer is
   `research-solution-patterns`; this domain is the specific technology and its consequences.
6. **Where the finding is a security or compliance matter**, record it and name it as one — `security`
   is the seat that rules on it downstream.

## Quality bar

- **Counts as a source:** official documentation at a named version, the licence text itself, the
  public issue tracker and incident or status history, published benchmarks that state their method,
  dated practitioner reports at comparable scale, our own reproducible measurement with the command
  recorded.
- **Fails:** a benchmark with no method, a limit quoted without version or date, a licence
  characterised rather than quoted, "it does not scale" with nobody named as having tried.
- **`DEVELOPING`** fits a young technology with real adopters and no long record — say that plainly
  rather than borrowing confidence.

## Output

`researcher`'s corpus entry, `domain: technology`. Findings carry the capability, the numbered
limits with their versions, the cost driver, the failure modes with sources, the verbatim licence and
data terms, and the maintenance signals. Gaps names what only a trial would answer — which is a
legitimate outcome and often the recommendation-shaped hole `research-insights` fills honestly.

## What this seat is not

- **Not `architecture`.** That seat decides what we use and keeps our patterns singular; this brings
  back the evidence it decides on.
- **Not `research-solution-patterns`.** That is the shape of the answer; this is the specific thing
  and its bill.
- **Not a spike.** Building a proof of concept is Build's work on its own ticket; this domain can
  recommend that one is needed and say what it would settle.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The technology domain: primary documentation at
  a named version, the issue tracker and incident history read as evidence, limits marked observed
  versus documented, licence and data terms quoted verbatim, maintenance state included, and the
  ask-never-infer rule carried onto anything with an owner.
