---
name: insight-extraction
slug: insight-extraction
description: "Mine a corpus for the insights that would change a decision — ranked by novelty times decision-relevance times evidence, each one sourced, deduped against the ledger and confidence-capped by what actually backs it. Use when pointed at the adventure chats, a research pack or a pile of feedback and asked what stands out."
version: 0.1.0
created: 2026-08-27
updated: 2026-08-27
status: active
triggers:
  - "/insight-extraction"
  - "what's interesting in this"
  - "pull the insights"
  - "mine this corpus"
  - "what stands out across these chats"
  - "what are the patterns in the feedback"
companions:
  - adventure-chat-ingest
  - problem-definition
  - jtbd
  - toy-jam
  - synthetic-users
maintainer: cq
---

# Insight extraction — the patterns pulled out, ranked and sourced

**What this is.** A repeatable pass that turns a pile — the adventure chats, a feedback round, a research pack — into a **short, ranked, sourced list of insights**, deduped against what the ledger already holds. It replaces ad-hoc digging, which surfaces whatever was read most recently rather than whatever matters most.

**Why it exists.** Discovery accumulates faster than anyone reads it. Without a pass like this, the same pattern gets rediscovered every few weeks, and the strongest one — the pattern no single chat states, only visible when several are held together — never gets found at all, because nobody holds them together.

**An insight is a claim that would change a decision.** *"Caleb edits in Final Cut"* is an observation. *"Creative systems are inherited from heroes, not designed"* is an insight — it changes how onboarding should work.

---

## 1. What counts as interesting

Score every candidate against these. The best hit several.

| Criterion | What it means | Why it matters |
|---|---|---|
| **Convergent** | the same finding appears across independent sources | load-bearing, higher confidence |
| **Emergent** | only visible when several things are held together; no single source states it | the rarest and most valuable |
| **Surprising** | overturns the obvious, the folklore, or a prior assumption | changes minds |
| **Tension** | two credible findings disagree — the *resolution* is the insight | sharp, and usually the best jam material |
| **Decision-relevant** | it would change what gets built, prioritised, or dropped | actionable, not trivia |

**Interestingness is novelty times decision-relevance times evidence-strength.** Rank by that product. Drop what is true-but-obvious or interesting-but-unactionable. A single-source claim dressed as a finding gets flagged as thin, never promoted.

## 2. The pass

1. **Scope it.** Name the corpus out loud: which chats, which folder, which feedback rounds, what date range. If it is genuinely ambiguous, ask once; otherwise take the obvious reading and state it.
2. **Read the distilled layer first.** Summaries, chat notes, registers, READMEs, the existing ledger — not the raw transcripts. These carry most of the signal fast. **Drill into raw material only for candidates that make the shortlist.** This is what keeps the pass a pass rather than a re-read of everything.
3. **Extract candidates.** Every claim that is non-obvious and load-bearing, in the source's own words, with where it came from.
4. **Score and rank.** Keep the top three to seven. Three strong beats seven padded.
5. **Dedupe against the ledger.** Surface what is *new*. A pattern the ledger already holds is a **re-confirmation** — say so explicitly and strengthen that entry instead of opening a second one.
6. **Confidence, honestly, and evidence-capped.** `forming` (one person, first sighting) → `firming` (two or three people) → `firm` (consistent across the roster, or triangulated with outside research). **One chat can never make an insight firm.** Read whose evidence it stands on before weighting it: a customer beats a founder on what customers want; a founder beats everyone on what the work actually costs. **An insight standing on founder evidence alone stays `forming` however much of it there is** — one household of practice is not a sample.
7. **Write the entries.** Append the new ones to the ledger; update the ones that gained evidence.
8. **Hand off** (section 4).

## 3. The output shape

One block per insight, lead with the strongest:

```
INSIGHT     the claim, one plain sentence
WHY         which criteria it hits — e.g. emergent + decision-relevant
EVIDENCE    who and what backs it: chats, timestamps, relation (customer / founder / collaborator)
CONFIDENCE  forming | firming | firm
SO WHAT     the decision it would change
```

**Where it lands.** For the toys line, the discovery ledger at `Products/Lia Toys/02 discovery/03 insights/insights-ledger.md`, newest at top, one entry per insight, updated in place as evidence arrives. When an insight grows big enough to need its own argument, it graduates to its own page there and the ledger entry points at it. Contradicting evidence goes **on the entry**, not in a drawer; an insight that stopped being true is marked `retired` with the source that killed it.

## 4. Hand off

| What it turned out to be | Where it goes |
|---|---|
| A specific pain, evidenced | `problem-definition` — a brief, with a home |
| Progress someone is hiring for | `jtbd` |
| A decision the founders owe | `toy-jam` — the agenda, not a ticket |
| A claim strong enough to touch strategy | **proposed** upward through the normal channels — the enrich queue, a jam, a founder call |

**Firm insights get proposed, never promoted.** This seat does not rewrite canon, does not edit who-we-serve, and does not open tickets off a pattern. Before anything here feeds a real decision, it goes through the vault's `research-verify` pass — the claim-by-claim check that the source says what the insight says it does.

## What this seat is not

- **Not the intake.** Chats become chat notes, profiles and problem pages through `adventure-chat-ingest`; feedback rounds through `toy-feedback-ingest`. This reads what those produced.
- **Not synthetic.** A `synthetic-users` panel produces hypotheses, and hypotheses never enter the ledger. The ledger is for what real people said or were watched doing.
- **Not strategy.** An insight is a hypothesis with sources. Settled positions live in the strategy docs and get there deliberately.

## Changelog

- **0.1.0 (2026-08-27, LIAB-996)** — first version. The rubric and the distilled-layer-first pass come from Chris's `cq:insight-extraction` (v0.5.0, 28 Jul 2026); the ledger, the evidence-capped confidence ladder, the relation weighting and the propose-never-promote rule come from the discovery backbone's own standing rules. The personal cross-project ledger and the diagram handoff stay in the `cq` bundle.
