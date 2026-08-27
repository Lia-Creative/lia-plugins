---
name: lia-voice-check
slug: lia-voice-check
description: "Audit already-drafted Lia copy for AI tells and voice drift — the structural pattern scan, the deterministic word-check backstop, and the brand and product-voice checks, reported before anything is changed. Use before shipping any Lia-facing words: product UI text, empty states, onboarding, release notes, site or store copy."
version: 0.2.2
created: 2026-07-06
updated: 2026-08-27
status: active
triggers:
  - "/lia-voice-check"
  - "voice-check this"
  - "AI-check this copy"
  - "check this for AI tells"
  - "run the voice pass"
companions:
  - polish
  - design-handoff
  - story-writer
  - review-and-merge
maintainer: shared
---

# lia-voice-check — the copy held to the voice

**Where it sits.** The words are part of the interface. `polish` holds the built screen to its design spec; this holds the copy inside it to the voice. Run it before a story with user-facing text is called done, and on anything about to leave the building. It is an **audit, not an author** — it runs after a draft exists.

**Trigger:** "lia voice check", "voice-check this", "AI-check this copy", "run the voice pass", "check this for AI tells", or auto-triggered after any AI/Fable content pass and before shipping Lia-facing copy.

**Purpose:** Audit an existing draft of Lia product/brand copy for AI-writing patterns and brand-voice drift, against `references/lia-voice.md`. Produces a structured report the founder can act on. Does not rewrite by default.

**This is not a writing skill.** It runs *after* a draft exists (an AI content pass, a Fable rewrite, a hand-drafted page). The writing itself should already follow `references/lia-voice.md`; this is the lint that catches the patterns a single read misses. AI-generated copy is the highest-value input — models leave a recognisable signature that survives a casual read.

**Lineage.** The structural AI-pattern layer is adapted from Dan's personal `voice-check` skill (Robson Studio vault), itself built on Jacob Shultz's humaniser/soul references. This is the **Lia/brand-voice sibling**: the register-agnostic AI-tell detectors are shared; the voice standard here is Lia's, not Dan's. For Dan's own outward content use his `voice-check`; for CQ's, use the `chris-quinton-writing-style` plugin. This skill is for **Lia product + brand copy** (any founder's agent may run it).

**Read `references/lia-voice.md` first** — every time. It's the voice source of truth (the Lia brand voice + the per-product profiles). The `ai-patterns.md` reference detects how AI writes by default; `lia-voice.md` says what the copy should sound like instead.

---

## Step 0 — Confirm scope

Before running, confirm:

- **Which draft.** Pasted text, a file path, or "the last thing the agent drafted."
- **Which voice profile.** Lia brand (default), or a named product profile in `lia-voice.md` (e.g. **Held**). The profile sets the product-specific vocabulary and voice rules on top of the Lia base.
- **Hard vs soft pass.** Soft (default) = flag and let the founder decide. Hard = apply the fixes surgically and return the cleaned file.

If unspecified, default to: the most recent draft in thread, Lia brand profile, soft pass.

---

## Step 1 — Read the references

1. `references/lia-voice.md` — the Lia brand voice + the named product-voice profile in scope. Source of truth.
2. `references/ai-patterns.md` — the structural + lexical AI patterns to scan for.

---

## Step 2 — Structural AI-pattern scan

Run every check in `references/ai-patterns.md` against the draft, in order. For each: scan the **whole** draft (don't stop at the first hit), log every match with the exact text + location, and note the suggested fix. **Collect findings — don't fix during the scan** (fixing loses signal across the full draft). For long, templated documents (a catalogue, a spec), quantify: how many instances of each pattern, so the founder sees which tells are systemic vs one-off.

## Step 3 — Brand-voice quality checks

Run the quality checks in `references/lia-voice.md` §Quality checks. These are qualitative reads, not pattern matches — does the draft do what the Lia voice is meant to do (trust the reader, plain over performed, emotion created not broadcast, AI invisible / outcomes in front, no manufactured significance)? Pass/fail each with a one-line note.

## Step 4 — Word-check backstop

Run the deterministic script as a backstop for the lexical patterns:

```bash
python3 "[this skill]/scripts/word-check.py" path/to/draft.md
# or:  python3 ... --text "draft text"   ·  --stdin and --json also work
# installed, the script sits at ${CLAUDE_PLUGIN_ROOT}/skills/lia-voice-check/scripts/word-check.py
```

Four tiers:

| Tier | Behaviour | What's in it |
|---|---|---|
| `HARD-AVOID` | error, exit 1 | corporate verbs and AI-buzz nouns with no legitimate use (leverage, empower, synergy, **seamless**, transformative, utilise/utilize), plus unambiguous US spelling |
| `spelling to check by sense` | warn | US in one sense, correct Australian in the other — `license` the verb versus `licence` the noun, `meter` the device versus `metre` the unit. The script cannot read the sense, so it refuses to block |
| `WATCHLIST` | warn | AI-tell vocabulary that *does* have legitimate uses — delve, robust, navigate, elevate, landscape, crucial. Run the filler test: real meaning = keep, decoration = cut |
| `SOFT-AVOID` | warn | filler — actually, really, just, simply, in order to |

**Why some words `ai-patterns.md` §22 calls hard-avoid are only a warning here.** That section is written for the LLM scan, which reads context; the script cannot. A word goes in the script's hard tier only when no legitimate use exists — *utilise* is always *use*. `navigate` and `robust` are AI tells in nine drafts out of ten and correct in the tenth ("navigate to the folder", "a robust test suite"), so the script warns and you judge. **`ai-patterns.md` still wins on the verdict; the tiers only decide what the script may fail a run on.** The script is the deterministic net under the LLM scan — it catches exact matches buried in long copy. `lia-voice.md` wins any disagreement; keep the script's word lists in sync when the voice doc changes.

## Step 5 — Report

Produce a single report:

```
# lia-voice-check report — [draft]

Profile: [Lia brand / Held / …]     Pass: [soft / hard]
Word-check: [✓ clean | ✗ N hard-avoid, ⚠ N sense-check, ⚠ N watchlist, ⚠ N soft-avoid]

## Structural patterns flagged   (grouped by pattern, with counts + examples + fix)
## Quality-check results          (pass/fail table, notes on fails)
## Word-check output              (verbatim, false positives noted)
## Summary                        (what's working, the top tells to fix, priority order)
```

**Hard pass** — after the report, apply the fixes **surgically**: subtraction, not authorship. Touch only the flagged patterns; preserve structure, headings, data, links, and all unflagged copy byte-for-byte. Do NOT regenerate sentences or add flourishes — a rewrite re-introduces the tells. Verify after (re-run word-check, recount the systemic tells), then report the before/after counts.

**Soft pass** — stop at the report; let the founder decide.

## Step 6 — Log notable misses

If the scan surfaces a new AI pattern the references don't cover, or a Lia-voice rule `lia-voice.md` doesn't capture, propose it — a note on the ticket, and `_meta/log.md` when the session is in the vault. Don't edit the references without founder direction; they shape every future draft.

---

## Notes

- **Audit, not author.** This evaluates a draft; it doesn't write one.
- **`lia-voice.md` is canonical.** When the script and the voice doc disagree, the voice doc wins; the script is the deterministic backstop.
- **Profiles compose.** A product profile (Held) layers its own vocabulary + rules on top of the Lia base voice — apply both.
- **Intended warmth ≠ AI tell.** Some Lia copy is deliberately warm (Held's felt-cost lines). Flag the mechanical tells (em-dash crutch, antithesis reflex, significance closers, filler); distinguish those from earned warmth, and say which is which in the report.

## Related seats

- `polish` — the visual half of the same gate: the interface held to the design spec, in design-system terms.
- `design-handoff` — the artefact the copy usually arrives inside; the spec wins over ticket prose, and that includes its words.
- `story-writer` — where user-facing wording first gets written down, in the person's terms.
- `review-and-merge` — the review that should not pass user-visible copy this seat has never seen.

## Changelog

- **0.2.2 (2026-08-27, PR #19 second review)** — five more script defects, all reproduced before fixing. The `-ize` allow-list matched on `startswith`, so every prefixed correct word (`resize`, `downsizing`, `supersized`) hard-failed a draft; it now matches listed prefixes plus e-dropping stems, and still catches `emphasizing`. The US-spelling net gained the `-yze` family and the metric units (`kilometer`, `liter`) — as an explicit list, because a general `\w+meter` net would fail on `parameter`, `diameter` and `thermometer`, which are correct. Multi-word phrases now match across a hard wrap (they silently no-opped on wrapped markdown, which is most of the vault). `utilise` joins `utilize` in the hard tier — one word, one verdict. The sense-check notes are printed instead of defined and dropped. And the tier table above now says what the script actually enforces.
- **0.2.1 (2026-08-27, PR #19 review)** — two script defects found in review. One match now reports once (`utilize` sat in both the corporate-verb list and the `-ize` pattern and was counted twice, in a report the skill tells you to quote counts from). And `license` and `meter` stop blocking correct Australian English — the verb and the device are standard AU, the script cannot read the sense, so they moved to a warn-only sense-check tier instead of failing the run.
- **0.2.0 (2026-08-27, LIAB-997)** — lands in the plugin, beside `polish` as the copy half of the gate. Script path repointed at the skill's own bundle instead of the retired vault path; bench placement and related seats added. The references and the word lists are unchanged.
- 2026-07-06: v0.1.0. Initial skill (LIAB-486, Luke-driven). Built from Dan's `voice-check` AI-pattern layer + a new Lia brand-voice standard with a Held product profile. First real use: the Held role-catalogue-v2 hard pass.
