---
name: ready-review
slug: ready-review
description: "Gate epics and stories before design or build spend work on them — a context that did not write them (a spawned subagent counts) grades every story on the five checks (Title/Narrative/Scenarios/Completeness/Scope) with quoted evidence, plus the vault-dependence test; verdict as one comment. Use when asked if an epic or its stories are ready."
version: 0.4.0
created: 2026-08-26
updated: 2026-09-02
status: active
triggers:
  - "/ready-review"
  - "ready-review LIAB-XXX"
  - "is this epic ready"
  - "gate these stories"
  - "review the tickets before build"
companions:
  - epic-builder
  - story-writer
  - task-writer
  - ticket-review
  - engineering-lead
  - project-manager
maintainer: cq
---

# Ready review — fresh eyes before anything downstream spends work

**What this is.** The gate between Discovery and Design in [Tool shop](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8): a context that did not produce them evaluates an epic and its children against the standard *before* design or build spend anything on them. It is the evaluation of what would classically be a human PM's judgment call — run every time instead of when someone remembers.

**Why it exists.** A gap caught here costs a rewrite of prose. The same gap caught in QA costs a built wrong thing, a review round-trip, and a builder's day. CQ, 26 Aug: *"a review agent that is designed to review stories and epics against our criteria of success — so that we are creating evaluation of effectively what would typically be a human task."*

**The sibling seat:** `ticket-review` checks **built work** against its acceptance criteria (the exit side). This seat checks **the tickets themselves** before work starts (the entry side). Same discipline — evidence, never approval — different end of the pipeline.

---

## 0. Two hard rules

1. **A context that did not produce the work being graded.** That is the whole rule, and it is a **context** boundary, not a **bench** boundary — it names no seat. A session that shaped the frame will defend it, so the session that wrote the tickets, or led the writing, never grades them. Every other context may, whatever bench it sits on.
   - **A spawned subagent satisfies it.** Its context window is its own. So any seat holding the work — the discovery lead, the engineering lead, the PM — runs this gate by **spawning** it, and nobody opens a terminal to achieve freshness (LIAB-1044: this gate was refused to an engineering lead on the grounds that `ready-review` sits with the discovery bench; that reading was wrong and it cost a round trip).
   - **The parent hands down ticket ids and this rubric — only.** Never its own reading of the tickets, never a summary, never "I think 3 and 5 are the weak ones". A conclusion passed downward arrives pre-formed, which is precisely what freshness exists to prevent. The parent may compare afterwards; a disagreement is worth more than an agreement it manufactured.
2. **Evidence, never vibes.** Every verdict line quotes the ticket or names the absence. "Looks good" is not a verdict.

## 1. What to check — the epic

Read the epic and every child first, then the [shape doc](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b) and the [Decisions register](https://linear.app/lia-creative/document/decisions-register-lia-toys-34348df61a5f)'s relevant calls. Then, for the epic:

- [ ] **Versioned chunk of value.** Name carries the version; body carries value / why now / what it is not / how you'd know. Not too chunky — buildable as one run, one branch, one PR.
- [ ] **Scope lives in the stories.** No sub-feature list in the epic prose. What 1.0 means is answerable from the children alone.
- [ ] **No acceptance criteria on the parent. No type label on the parent.**
- [ ] **Grounded.** At least one real source wired as a relation or link — and it says what the epic claims it says.
- [ ] **Doesn't re-derive a settled call.** Check the register; an epic quietly reversing a recorded decision fails here, loudly.

## 2. What to check — every story: the five checks, evidence quoted

Since 26 Aug (LIAB-949), stories are graded on the **five-check rubric** — one check per part of the anatomy, **pass / partial / fail with a quoted line of evidence for each**. The full rubric with fail-tells lives in the vault (`Operations/Processes/user-stories-assessment-and-proposal-2026-08-26.md` §3 — read it when mounted; it stays a document, not a skill, until it has run at 2–3 real gates). The five:

1. **Title** — a name, two to four words, sayable in a standup; not a sentence, not a number.
2. **Narrative** — *As a [role], I want [feature], so that [benefit]*, all three present and honest: a consultable named role (never "the user"), a capability (not a smuggled design), a non-circular benefit the feature would actually deliver. The applicability rule: user-facing Feature = full narrative; enabling work = Goal + named beneficiary; a bare one-liner passes nothing.
3. **Scenarios** — each behavioural AC a numbered Given/When/Then, decidable without judgement (or honestly marked *[Graded at Review]*); implementation instructions, process notes and understanding-statements are not AC — Delivery checks or gone.
4. **Completeness** — the two probes: the **missing Given** (could two outcomes both be true under this context?) and the **forgotten Then** (every material outcome verified?); one event per scenario.
5. **Scope & size** — non-goals present (≥2), at most 5–7 scenarios, split along user value never technical layers.

Plus the check that predates the rubric and still fails tickets first:

- [ ] **The vault-dependence test — the load-bearing one.** Read the story as a build agent with Linear and this plugin and *nothing else*. **If understanding it needs the vault, it isn't ready** — name exactly what has to travel onto the ticket.

## 3. What to check — tasks

- [ ] Named work, one type of the six, right parent, one job.
- [ ] **Not plan line-items.** A run of tasks that read like steps of one plan fails as a set — the plan belongs on the story as the builder's plan-mode comment.

## 4. The verdict — one comment on the epic

One comment, on the epic, in this shape — **verdicts are comments, never labels** (the `gate:*` labels were deleted 25 Aug):

```markdown
**Ready review — <date> · fresh context: <what this session did not produce>**

**Epic:** ready | not ready — <the specific gap, quoted or named>
**<story name>:** Title ✓/~/✗ · Narrative ✓/~/✗ · Scenarios ✓/~/✗ · Completeness ✓/~/✗ · Scope ✓/~/✗ — <the quoted evidence line for anything not ✓> → fix is <which seat, whose>
…one line per child…

**Verdict:** ready for design | not ready — <n> gaps above.
```

Four rules for it:

1. **The verdict says what makes it fresh** — *"spawned by the engineering lead; did not write these tickets"*. One clause, and it is the only part of the comment a reader cannot reconstruct later.
2. **A gap names its fix and its seat.** "Not ready" with no named fix blocks silently, which is worse than passing it.
3. **Not-ready goes back, labelled.** `defect:discovery` on the tickets that failed, per the round-trip convention — that's the data the pipeline learns from.
4. **Don't grow the scope.** You're checking readiness against the standard, not redesigning the epic. A better idea you had is a comment marked as such, not a failure.
5. **When this seat's own post is blocked, the parent posts it on your behalf — verbatim.** The comment opens *Posted by [parent seat] on behalf of ready-review · dispatch [id] — the text is the gate's verbatim* and changes nothing inside. A summarised verdict is the parent's reading, which is exactly what rule 0.1 forbids (LIAB-1089, 1 Sep 2026: the gate's post was policy-blocked and the lead relayed it — the right move, now written down).

---

## What this seat is not

- **Not `ticket-review`.** That's built work; this is tickets.
- **Not the founder.** What's *worth building* stays a human call — this gate checks that what was called worth building is ready to be built.
- **Not a taste pass.** The checklist is the contract; a story can be ready and still get better in design.

## Changelog

- **0.4.0 (2026-09-02, LIAB-1165)** — §4 rule 5: when the gate's own Linear write is blocked, the parent posts the verdict verbatim, attributed to the gate and its dispatch id — never summarised (LIAB-1089's relay, LIAB-1165).
- **0.3.1 (2026-09-02, LIAB-1161)** — `lead-engineer` is `engineering-lead` — reference only: the seat's name now follows its discipline, like the other four leads. No rule changed.
- **0.3.0 (2026-08-29, LIAB-1044)** — rule 0.1 said *"a fresh session only"*, and *session* was being read as *a terminal a human opens* and, worse, as *a seat that is not yours*. It is neither: the rule is **did not produce the work being graded** — a context boundary that names no bench. **A spawned subagent satisfies it**, so any seat holding the work runs this gate by spawning it rather than handing a founder a command; and **the parent hands down ticket ids and this rubric only, never its own reading of them**, since a conclusion passed downward arrives pre-formed. The verdict block gains a clause naming what makes the grading context fresh — the one thing a later reader cannot reconstruct. The §What this is line said *"a fresh agent"* and is corrected to the same wording, so the file does not define the rule one way and describe itself another.
- **0.2.0 (2026-08-26, LIAB-949 + Fable 5)** — stories graded on the five-check rubric with quoted evidence per check; the verdict line carries the five marks. The rubric stays a vault document run by hand at real gates (the brief's own rule — no story-eval skill yet); this seat is where it runs.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The entry gate: shape, grounding, user-terms ACs, sizing, the vault-dependence test, and a verdict format with named fixes. Working name — renaming is Chris's.
