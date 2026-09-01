---
name: ui-teardown
slug: ui-teardown
description: >-
  Teardown of a product, page, or competitor — the one command. Say "teardown of X" and it captures
  the screens itself (via the ui-capture engine) if they do not exist yet, then analyses them: a UX
  and feature teardown against a fixed rubric, plus a controlled-vocabulary feature matrix, every
  claim cited to a specific screenshot, framed against what Lia is building. Gives an honest
  confidence score from capture coverage, so gaps show up instead of disappearing. Works on a single
  page, a whole product, a competitor, or an existing capture run. Use when someone says "teardown of
  X", "tear down this page", "tear down this product", "UX teardown", "feature teardown", "analyse
  this product's UX", "analyse these screenshots", or "what can we learn from X".
version: 0.2.2
created: 2026-06-26
updated: 2026-08-28
status: active
type: skill
maintainer: shared
trigger-phrases:
  - "teardown of [thing]"
  - "tear down this page / product / competitor"
  - "teardown [thing] page"
  - "UX teardown of [thing]"
  - "feature teardown of [thing]"
  - "analyse this product's UX / these screenshots"
  - "what can we learn from [thing]"
companions:
  - ui-capture
  - cowork-creative-strategy
---

# ui-teardown

The front door for product analysis. **One command: "teardown of X."** It captures the screens
itself (using the `ui-capture` engine) when they do not exist yet, then produces the analysis — a UX
and feature teardown plus a feature matrix, every claim tied to a screenshot, framed against what Lia
is building. You never have to run capture as a separate step.

The discipline that makes it trustworthy: **every claim is cited to a screenshot, and the capture's
coverage sets the analysis's confidence** — so a thin capture produces a low-confidence read, not a
confident wrong one.

## The flow (what "teardown of X" does)

Work out what X is, then route:

1. **X is an existing capture run** (a folder with a `manifest.json`) → skip straight to analysis.
2. **X is a single page or URL** ("teardown of this CRM contact page") → run `ui-capture` in directed
   mode on that page (and any obviously-related ones), then analyse.
3. **X is a whole product or competitor** ("teardown of Pipedrive") → run `ui-capture` in explore
   mode (discover the feature surfaces, capture them), run the coverage verification pass, then
   analyse.

In every case the capture lands as a dated run + manifest in the vault (see `ui-capture` for the
storage convention), and the analysis is written alongside it. If a page needs a login, `ui-capture`
uses your live Chrome session — no credentials handled.

## When to invoke

- "Teardown of X" / "tear down this page or product" — the main path.
- Competitor recon — what they do well, where they are thin, what is worth borrowing.
- A self-audit of one of our own products before a design pass.
- A head-to-head across several products (comparison matrix).

## When NOT to invoke

- You only want the raw screenshots, no analysis → call `ui-capture` directly.
- The target is a native desktop app, not a website → capture via computer-use first, then point a
  teardown at the screenshots.

## How it reads

Read the manifest first (target, archetype, shot list, the `## Coverage` block), then walk the shots
in order off disk (the Read tool views PNGs). Authenticated shots flagged `pii: true` stay local —
never send them to an external API; do the analysis here.

## Evidence rules (the anti-hallucination core)

Non-negotiable — this is what makes the teardown worth trusting:

- **Cite every claim.** A feature or judgement references the shot it is grounded in, e.g.
  `[02-contact-record.png]`. No citation, it does not go in.
- **Flag inference.** Something you reasonably infer but cannot see is marked `[inferred]` and never
  counts as present in the matrix (it is `unknown` at most).
- **Name the absence.** If a surface was not captured, write "not captured" — never guess what it
  probably looks like. A missing surface is a coverage gap, not an analysis to invent.
- **No feature is `present` in the matrix without a shot to prove it.**

## Confidence scoring

From the capture's coverage block, stated at the top of the teardown and wherever a claim leans on a
thin surface:

- **High** — coverage at or above 80% of expected surfaces, few warn/fail shots.
- **Medium** — coverage 50–80%, or several warn shots.
- **Low** — coverage under 50%, many fail shots, or no coverage block.

"Their automation is weak", off a run that never captured the automation surface, is a low-confidence
inference — and it says so.

## The rubric + the matrix

**If `reference/teardown-rubric.md` or `../ui-capture/reference/feature-taxonomy.md` is missing, stop and say so — never improvise the sections or the vocabulary.** The controlled vocabulary is what makes teardowns comparable across products and runs; an improvised one silently breaks every comparison.

- **Teardown doc** — ten fixed sections (so any two teardowns are comparable) against the Nielsen
  heuristics. See `reference/teardown-rubric.md`.
- **Feature matrix** — rows are capability surfaces from the shared feature taxonomy
  (`../ui-capture/reference/feature-taxonomy.md`), so a `contact-record` row means the same thing for
  every product you ever tear down and matrices stack into comparisons. Cells: present / partial /
  absent / unknown, each with a one-line note and the evidence shot. See
  `reference/feature-matrix-template.md`.

## What this means for Lia (the closing section)

The point of the exercise. The last section reads the product against Lia's strategy — look up exact
paths in `_meta/index.md`:

- `Company/Strategy/who-we-serve/the-people.md` — frame it for the named cast (does this serve a
  Mara, a Theo? where would it fail them?).
- `Company/Strategy/product-vision-tools-for-your-adventure-2026-06-10.md` — tools-first, memory
  underneath, AI invisible.
- `Wiki/concepts/trust-is-the-advantage.md` — where the product earns or burns trust.
- For our own products, also `Products/Design System/` for where the UI diverges from the DS.

Output: 3–6 decision-shaped takeaways — borrow / avoid / the-gap-we-would-own / parity-bar — not
vague admiration.

## Outputs + where they are saved

Written into the capture run folder, so analysis sits with its evidence:

- `teardown.md` — the rubric-structured doc.
- `feature-matrix.md` — the matrix (plus `feature-matrix.csv` if it is going to a sheet).

For a comparison across runs, write `comparison-YYYY-MM-DD.md` + a combined `feature-matrix.md` into
the most relevant home — `Research/Competitors/_comparisons/` for competitor sets, or a product's
`Resources/` for an "us vs them" read. Update `_meta/index.md` and append to `_meta/log.md`. **At the bottom of the file — append your block, never rewrite the file to insert at the top** (CLAUDE.md housekeeping rule 2, tightened 2026-08-19).

## Just want the screens?

If you only want screenshots and no analysis, call `ui-capture` directly ("capture the screens of
X"). `ui-teardown` is the front door that does capture-then-analyse in one go; `ui-capture` is the
engine underneath, usable on its own.

## Cross-founder + lifecycle

Canonical here; Dan, CQ, and Luke all run it with the same one-word entry. Because capture writes the
shared manifest contract, a teardown can be run by a different founder than the one who captured. Drop
it into the product-dev lifecycle at competitive discovery, before a design sprint, or when sizing a
feature against the field.

## Changelog

- **0.2.2 (2026-08-28, LIAB-1027)** — adds this section, and nothing else. The skill had no `## Changelog` at all: the last of the six PR #24 found, and a latent trap for the guard LIAB-1016 adds — the next change to this file would have failed CI on its history rather than on its own content, and the cheap escape would have been a hollow line. No behaviour change.
- **0.2.1 and earlier — not reconstructed.** This skill arrived in the plugin whole, in the 1.2.0 landing (`555986a`, LIAB-921), so its 0.1.0 → 0.2.1 history happened in the vault before LIAB-919 made this repo canonical and cannot be recovered from here. Recorded as a gap on purpose: `AUDIT.md` exists because version numbers have lied in this repo before, and an invented changelog is worse than a missing one.
