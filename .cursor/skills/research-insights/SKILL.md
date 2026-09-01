---
name: research-insights
slug: research-insights
description: "Understand a finished research corpus and turn it into the story a human reads — the insight log kept per plan, entries ranked by impact times relevance, facts and developing insights marked apart, the story raised as a PR to the research lead and looped on feedback. May reject a corpus and send it back with the gap named. Loads insight-extraction as its mining method. Use when a corpus is complete, or an insight log or research story is asked for."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-insights"
  - "turn this research into insights"
  - "write the insight story"
  - "what does this corpus say"
companions:
  - insight-extraction
  - research-lead
  - researcher
  - discovery-lead
  - doc-iteration-loop
  - execution-discipline
maintainer: cq
---

# Research insights — the corpus understood, and told

**What this is.** The seat that reads a finished corpus and produces the thing a person actually
uses: a ranked insight log, and a story that stands on it. CQ, 28 Aug 2026
([LIAB-1023](https://linear.app/lia-creative/issue/LIAB-1023)): *"an agents job is to UNDERSTAND the
work"* — which is why this is a seat and not a summarising step at the end of collection.

**The method is `insight-extraction`; load it and do not restate it here.** That skill already
carries the mining rubric — novelty × decision-relevance × evidence, sourcing, confidence caps. This
seat adds what the research bench needs on top: the log, the ranking against the plan, the story, and
the return path.

---

## 1. The insight log

One log per research plan, kept beside the corpus in the same repo and path, maintained by PR like
everything else on this bench.

- **An entry is `insight-extraction`'s block plus two things:** an **impact × relevance** rank — how
  much it would change what we do, times how directly it bears on the commissioning ticket's decision
  — and a **`FACT` or `DEVELOPING`** marker inherited from the finding it rests on.
- **Every entry cites the corpus by domain and finding index.** An insight that cannot point at a
  finding is a hypothesis, and it either goes back as a question for the lead to dispatch or it does
  not exist.
- **A `DEVELOPING` finding can only carry a `DEVELOPING` insight.** Confidence never increases on the
  way through this seat.
- **The log is cumulative and dated.** It is built as the corpus lands, not written in one pass at
  the end — that is what "slowly collect an insight log" means, and it is why the ranking is
  trustworthy by the time the story is due.

## 2. The story

The deliverable a human reads. Not a report of what was researched — the small number of things that
change what we do.

- **Lead with what changed**, not with method. The reader is deciding something.
- **Every claim traces to a corpus citation**, and the story carries enough of the source that a
  reader can check one without opening the corpus.
- **Facts and developing insights stay visibly apart** in the prose, not only in the log. This is the
  commission's own rule: proven outcomes stated as proven, trends welcome and clearly marked.
- **Name what the research could not settle.** A story that answers everything is the one to
  distrust, and the open questions are usually the most valuable page.
- `doc-iteration-loop` is the craft pointer if the story runs long enough to need waves and a
  fresh-eyes gate.
- **Raise it as a PR to `research-lead`**, loop on feedback the same way a build loops with its
  reviewer. Once approved, the story is **also published to Linear and linked from the commissioning
  ticket** — that is where a person reads it.

## 3. The return path

**A corpus that cannot back a story goes back.** Name the specific gap — the question the plan asked
that no finding answers, or the claim the story would need and the corpus does not carry — as a
verdict with evidence on the commissioning ticket, routed through `research-lead`.

**This seat never closes the gap itself.** Doing your own collection makes you the researcher, and
the corpus then has nobody independent reading it — the same reason a lead does not review its own
work. The return is not a failure of the bench; it is the bench working.

## What this seat is not

- **Not `insight-extraction`.** That seat is the method, and it mines the discovery backbone — chats
  with real people — into the ledger. This seat applies it to a commissioned corpus and adds the
  bench's duties. Neither replaces the other.
- **Not a researcher.** No new claims, no new sources. What is not in the corpus goes back to the
  lead.
- **Not strategy.** An insight can say what the evidence implies; choosing the play is the founder's,
  informed by this. Propose, never promote.
- **Not the lead.** The plan, the dispatch and the merge are `research-lead`'s; this seat raises PRs
  to it like any other producing seat.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The bench's understanding seat: the cumulative
  insight log with impact × relevance ranking and inherited confidence markers, every entry cited to
  a corpus finding by index, the story written for a decision with facts and developing insights kept
  visibly apart and published to Linear once approved, and the return path that sends an
  unsupportable corpus back through the lead rather than quietly patching it.
