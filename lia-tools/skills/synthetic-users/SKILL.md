---
name: synthetic-users
slug: synthetic-users
description: "Build and run a synthetic-user panel — psychologically-coherent, deliberately critical customer profiles a team can interview to surface objections and hypotheses fast. Use to pressure-test a problem, a job, an epic or a flow before build spends on it. Hypotheses only, never insight and never validation."
version: 1.0.0
created: 2026-06-25
updated: 2026-08-27
status: active
triggers:
  - "/synthetic-users"
  - "synthetic users"
  - "synthetic user panel"
  - "run a synthetic panel"
  - "pressure-test this brief"
  - "interview my personas"
  - "synthetic focus group"
  - "proto personas"
companions:
  - problem-definition
  - jtbd
  - ready-review
  - scenario-builder
  - ui-teardown
maintainer: shared
---

# Synthetic users — the panel you interview before you build

Turn research artefacts, or a thin brief, into a panel of **synthetic users**: AI customer profiles a team can interview any time. They answer in character, critically and psychologically coherently, for **rapid exploration and hypothesis generation** — never for validation.

The whole method exists to defeat one failure mode: an LLM asked to play a customer defaults to flattery. Every part below is built to force realism, lead with objections, and keep the speculative reasoning visible and reviewable.

> **The honesty line, everywhere:** synthetic users produce *observations, patterns and hypotheses*. Insight needs human judgement and real people. Never present synthetic output as evidence, research or validation. Use it to pressure-test an idea, surface likely objections, and aim real discovery where it matters.

## Where it sits on the bench

A **discovery-stage specialist, called — not a gate.** `problem-definition` says what hurts and `jtbd` names the progress someone is hiring for; both stand on real evidence. This seat is what you run when a brief is about to be expensive and nobody has tested it against a hostile reader yet. Its strongest output is a shortlist of objections and unmet-need hypotheses; the best of those become questions for a real adventure chat, or a `research-plan` jam.

**The discovery backbone's rule travels intact: chats with real people are the only intake.** Synthetic output never becomes a problem page, never enters the insights ledger, and never counts toward an insight's confidence. It belongs in the working doc it was run for, labelled as synthetic, or in the epic's own thinking — nowhere that a later reader could mistake it for a person.

## When to invoke

- A problem brief, job statement, epic or flow needs its objections found before design or build spends on it.
- A `ready-review` verdict flagged a story whose value nobody has stress-tested.
- Two starting conditions, both supported:
  - **Rich inputs** — existing chats, jobs/pains/gains, journey maps. Encode and run.
  - **Thin inputs** — little real data. Start with the cold-start proto-profiles generator (`references/proto-profiles-prompt.md`), flagging grounded / inferred / speculative, and deepen as real chats land.

## When NOT to invoke

- A request for **real** research, recruitment or validation. This is the opposite — say so, and point at `adventure-chat-ingest`.
- A single quick persona sketch nobody intends to interrogate. Overkill; write a short profile.
- Anything that would reach a founder or a ticket without the assumption trace and the not-insight framing intact.

## The pipeline (4 stages)

Run in order. Stages 1–2 build the panel; 3 assembles the engine; 4 operates it. For a thin-data start, Stage 1 begins with the proto-profiles prompt.

### Stage 1 — Build the persona profiles
The first of two inputs per persona. A profile is **optimised around actionable Jobs, Pains and Gains**, not demography. Use `templates/persona-profile.template.md`. Spec and rules: `references/persona-profile-spec.md`.

Each profile carries: overview, key goals, customer jobs (functional / emotional / social), pains (grouped + intensity where known), gains, and behavioural motivations. Differentiate personas *behaviourally*, not just by demographics.

For thin data: run `references/proto-profiles-prompt.md` first to generate differentiated archetypes from a business brief, each tagged grounded / inferred / speculative, plus a "who are you missing" pass (edge cases, reluctant users, affected non-users).

### Stage 2 — Encode the behavioural journey map
The second input, and the method's real edge. A normal journey map (stages / actions / feelings) is built for workshops. This one is built for **psychological simulation** — a behavioural dataset the model computes from. Use `templates/journey-map.template.csv`. Full spec: `references/journey-map-spec.md`.

Per stage, encode: stage metadata (goal, decision type, perceived risk, cognitive load), active jobs matrix (functional/emotional/social *for that stage*), pain intensity scaling (top 3, 1–5, typed), emotional arc **with residue carried forward**, identity at risk, likely bias trigger, situational context, and the decision threshold ("what must be true to proceed").

Guardrail: do not over-determine. If the map is too deterministic the persona becomes predictable and inhuman. Encode tendencies, not scripts.

### Stage 3 — Assemble the config (the engine)
One system prompt runs the whole panel as a focus-group facilitator. Use `templates/synthetic-user-config.template.md`. Anatomy and rationale: `references/config-anatomy.md`.

The config's prime directive is the **Anti-Idealism Protocol**: lead with objections before positives, find 2–3 specific problems with anything shown, speak from lived experience never from documentation, disagree across personas, never soften criticism with filler praise. Before each response the model sets a behavioural filter — primary job in context → dominant pain → emotional temperature → cognitive bias → identity to protect → micro-context → a trade-off. It explicitly counters six failure modes: sycophancy, idealism, gender/race bias, missing business context, generic responses, fabrication.

### Stage 4 — Run + facilitate
Pose a question to the panel (`@PersonaName: …`, `@P1,P2: …`, or to all). Each response is in-character and followed by an **Assumption Trace** (GROUNDED / INFERENCE / ASSUMPTION / BIAS-RISK). After all responses, a **Facilitator Summary** consolidates emotional range, conflicts, key themes, deal-breakers, opportunities, repeated assumptions, bias-risk flags, and validation priorities. Output discipline and formats: `references/facilitation-and-assumption-trace.md`.

## How this runs as a skill

- **Now (Claude / vault):** assemble the persona files + journey CSVs + config as a Claude Project's knowledge, or paste the config as the system prompt and attach the inputs. Claude reads all audience files first, then answers in-character per the config.
- **Platform-agnostic (later):** the same three artefact types (profile `.md`, journey `.csv`, config `.md`) drop into a Custom GPT (instructions field + uploaded knowledge) or any system-prompt + file-context setup. Keep the artefacts clean and tool-neutral so they port without rework.

## Operating style

- The **method is generic** — reusable for any audience. Don't bake a product's own hopes into the personas.
- **Surface options, don't decide.** Where output could be mistaken for insight, label it in the same breath.
- Default panel size: 3–6 personas. More than 6 is noise; fewer than 3 loses the disagreement that makes a panel worth running.

## What it's good and bad at (set expectations)

Good: natural language grounded in micro-context, realistic trade-offs and hesitancy, sensible response length, an actionable facilitator "go-do" summary.

Limits: can be *hyper-real* (one job/pain colours every answer); prone to **pain-point fixation** if the pain data is thin or unweighted; and it is **hypotheses, not insight**. If responses flatten onto a single pain, that's a signal the journey map needs richer pain-intensity data, not a finding.

## Files in this skill

**If any `references/` or `templates/` file below is missing, stop and say which — do not improvise the spec from memory.** The method's edge lives in those files; an improvised panel is exactly the flattery machine this skill exists to beat.

- `references/method-principles.md` — the foundational thinking (anti-idealism, JTBD, double diamond, HCD, synthetic-persona ethics).
- `references/persona-profile-spec.md` — how to build a Stage 1 profile.
- `references/journey-map-spec.md` — the behaviourally-encoded (Stage 2) journey map spec.
- `references/config-anatomy.md` — what every block of the config does and why.
- `references/facilitation-and-assumption-trace.md` — Stage 4 output rules and formats.
- `references/proto-profiles-prompt.md` — cold-start archetype generator for thin data.
- `templates/persona-profile.template.md`
- `templates/journey-map.template.csv`
- `templates/synthetic-user-config.template.md`

## What this seat is not

- **Not evidence.** It cannot make an insight `firming`, cannot source a problem page, cannot settle a decision.
- **Not a persona library.** The panel is built for a question and thrown away with it; a durable audience picture lives in who-we-serve and the adventurer profiles.
- **Not competitor work.** What other products actually do is `ui-teardown`, cited to screenshots.

## Related seats

- `problem-definition` · `jtbd` — the real-evidence seats this pressure-tests, and never replaces.
- `ready-review` — the gate whose flags often trigger a panel.
- `adventure-chat-ingest` — the real intake; the panel's best output is a sharper question for one of these.
- `scenario-builder` — where an objection that survives becomes a walked-through flow.

## Provenance

Distilled from an external practitioner's synthetic-persona method, generalised to be domain-agnostic. Adopted into Lia's discovery stage 2026-06-26 (LIAB-397). The worked example in the source material was test data and has been stripped out.

## Changelog

- **1.0.0 (2026-08-27, LIAB-997)** — lands in the plugin, on the discovery bench. Semver replaces the date version; the bench placement, the "chats are the only intake" guardrail and the not-evidence rules added; Dan-specific framing generalised. The four-stage method and every reference file are unchanged.
- **2026-06-25 → 2026-07-03 (Dan)** — the four-stage method, made canonical in the vault per LIAB-397.
