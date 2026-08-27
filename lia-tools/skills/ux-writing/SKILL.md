---
name: ux-writing
slug: ux-writing
description: "Write the words in the interface — action labels, alerts, errors, empty states, notifications — to Apple's mechanics and Lia's voice: one verb per action from the shared lexicon, Apple-exact title case on labels, no blame, no system text, checked by a deterministic lint. Use when a screen needs its copy written or repaired, when button labels are being chosen, or when a flow's language has drifted."
version: 0.1.1
created: 2026-08-27
updated: 2026-08-28
status: active
triggers:
  - "/ux-writing"
  - "write the copy for this screen"
  - "what should this button say"
  - "fix the labels"
  - "the wording is off"
  - "name this action"
companions:
  - lia-voice-check
  - polish
  - error-states
  - design-handoff
maintainer: cq
---

# ux-writing — the words in the interface, written

**What this is.** The authoring seat for interface language: every string a person reads
inside a Lia product. Action labels first — buttons, menu items, links — because they are
the ones people act on, then the alerts, errors, empty states, hints and notifications
around them.

**Where it sits.** `hifi-design` draws the screen, `error-states` finds the states it
skipped, **this writes what all of them say**, `polish` holds the built thing to the
design spec, and `lia-voice-check` audits the finished words for AI tells and voice drift.
This seat is the **author**; `lia-voice-check` is the **audit**. Running the audit on
copy this seat never wrote is normal. Writing copy without this seat is how a product ends
up with three words for one action.

**Why it exists.** CQ, 27 Aug 2026: Apple is the company that does this best, so take
their method rather than admire it. `references/apple-distilled.md` is that distillation —
read from Apple's current HIG and the June 2026 Apple Style Guide, not from articles about
them. The mechanics are Apple's. The voice stays Lia's.

> **House decision, 27 Aug 2026 (CQ): Apple-exact capitalisation.**
> Title case for labels, menu items, tabs, screen and section titles, alert titles that
> are fragments, and notification titles. Sentence case for anything that is a complete
> sentence. One rule, everywhere, checkable by a machine. Most of what ships today is
> sentence case — expect real changes, and make them in one pass rather than screen by
> screen.

---

## The references — read before writing, every time

1. `references/lexicon.md` — **first.** One action, one word. This is what stops the
   product forking its own vocabulary. Read **§0 before §1**: some rows are proposed and
   have no founder's yet — usable, but never quotable as house style.
2. `references/patterns.md` — the shape for the surface you're writing (labels,
   confirmations, errors, empty states, waiting, permissions, settings, fields,
   notifications, first run, success).
3. `references/apple-distilled.md` — the mechanics and the reasoning, when a case is new.
4. `lia-voice-check/references/lia-voice.md` — the voice itself, and any product profile
   in scope. **Where the mechanics and the voice disagree, the voice wins.**

## The run

### 1. Scope it

Which product, which surface, which strings, and is this **new copy** or a **repair pass**
over what exists. If it's a repair pass on a repo, inventory before you write:

```bash
grep -rhoE '(aria-label|title|label|placeholder)="[^"]{2,60}"' --include="*.tsx" src | sort -u
grep -rhoE '"[A-Z][^"]{6,90}(\.|\?|…)"' --include="*.ts" --include="*.tsx" src | sort -u
```

A string you can't find in the source is a string you can't change — note it and move on.

### 2. Kind every string

Each one is a `label`, `title`, `sentence`, `body` or `placeholder` (the kinds the lint
uses). This is the decision that sets its case and its punctuation, so make it
deliberately: an alert title that is a fragment and one that is a question are different
kinds and get different treatment.

### 3. Write, pattern by pattern

Work through `patterns.md` for the surface. The rules that carry most of the weight:

- **A label is a verb that names the result.** "Send", not "Let's do it!". "Delete", not
  "OK". If the label needs the sentence above it to make sense, it isn't finished.
- **Check the lexicon before you name an action.** If the action isn't there, add the row
  in the same change, marked *NOT SETTLED* in the row itself and listed in `lexicon.md`
  §0 — a marker only in the header is a marker the next grep won't see.
- **Never blame.** Say what to do next: "Use only letters for your name", not
  "Invalid name".
- **No "we", no "please", no "oops", no exclamation marks in a failure.**
- **No system text reaches a person.** Status codes and library messages belong in the
  log, or behind Show Details.
- **Cut every word that isn't doing work.** Read it aloud. If fewer words say it, use
  fewer.
- **Say what's true about their stuff after a failure** — the house pattern is already in
  the product ("Nothing was lost."), and it's the difference between an error and a
  frightening error.

### 4. Hold the flow together

Read the strings in the order a person meets them, not as a list. One flow uses one set of
step words (Get Started → Continue → Done). One concept keeps one name across every screen
it appears on. Two screens disagreeing is the defect this seat exists to catch.

### 5. Lint it

```bash
python3 "[this skill]/scripts/copy-lint.py" strings.txt
# installed: ${CLAUDE_PLUGIN_ROOT}/skills/ux-writing/scripts/copy-lint.py
# --text "Add a Toy" --kind label   ·   --stdin   ·   --json   ·   --self-test
```

Input is one string per line, optionally `kind` then a tab then the string; `.json` works
too. `E-` findings are defects and fail the run: title case, ending punctuation on a
label, banned words, first person, raw system text. `W-` findings are judgment calls you
answer for — the lint never overrules a writer, and one that blocked on judgment would
just get switched off.

**The lint is a backstop, not the standard.** It can't tell whether a label names the
right result. Run it after the writing, never instead of it.

`--self-test` switches off each of its nine rule families in turn and requires the fixture
suite to go red every time — a rule no fixture exercises is reported `NOT COVERED` and
fails the run. **Run it whenever you touch the script.** Half its fixtures are correct
Australian product copy that must come back clean, because the expensive failures here
have all been false positives, not misses: a lint that flags "450 files were copied" as a
system leak is a lint the next writer ignores on the string that mattered.

### 6. Hand it over

For a repair pass, deliver a table — **where · kind · now · proposed · why** — and let the
founder read the diff in one place rather than across twenty files. For new copy, the
strings go straight onto the story or into the build, in the person's terms.

Anything you couldn't fix with words goes back as a note, not a nicer sentence: if a
message can't rescue the situation, the interaction is what's wrong. Say so.

## Judgment

- **Subtraction, not authorship.** On a repair pass, change what's broken and leave the
  rest byte-for-byte. Rewriting a string that already works reintroduces the tells the
  original avoided.
- **Some shipped copy is already right.** "Something went wrong. Nothing was lost." is
  the standard, not a candidate for improvement. Recognise it and protect it.
- **Warmth that's earned isn't an AI tell.** Flatten performance, not personality.
- **When the lexicon and the screen disagree**, the lexicon wins — unless the screen is
  right, in which case update the lexicon and say why.

## What this seat doesn't do

Marketing and brand copy (that's the voice plugins), release notes and Slack posts,
ticket prose, and documentation. It also doesn't audit finished copy for AI tells —
`lia-voice-check` does, and does it better.

## Related seats

- `lia-voice-check` — the audit half. Run it after this seat on anything shipping.
- `error-states` — finds the states that need words before this seat writes them.
- `polish` — the visual half of the same gate.
- `design-handoff` — the `.dc.html` artefact the copy usually lives inside; the artefact
  wins over ticket prose, and that includes its words.

## Changelog

- **0.1.1 (2026-08-28)** — first shipped version (LIAB-1004). `copy-lint.py` was run
  against real Australian product copy for the first time and produced four false
  positives, every one a hard error: it demanded "Add To Library" (a preposition pointing
  at an object isn't a phrasal particle, and Apple ships "Add to Home Screen"); it read any
  three-digit number starting 4 or 5 as an HTTP status, so "450 files were copied" was a
  system leak; it read the ordinary noun *stack* the same way; and it matched "us" case-
  insensitively, so "the US team" was first person. All four fixed, each with a fixture
  that keeps it fixed. `--self-test` grew from one negative control to a defect planted in
  each of nine rule families, because one control proves one rule and the other eight
  could have been deleted silently — the LIAB-959 lesson, one layer up. `lexicon.md`'s
  proposed rows now carry the marker in the row itself, not only the file header, since a
  row is what a grep returns.
- **0.1.0 (2026-08-27)** — first version, parked unshipped. Apple's HIG (Writing, Alerts, Buttons,
  Notifications, Onboarding) and the June 2026 Apple Style Guide distilled into
  `references/apple-distilled.md`; the surface-by-surface `patterns.md` seeded from the
  strings shipping in `lia-toy-box`; `lexicon.md` seeded from the product's own verbs;
  `copy-lint.py` implements Apple's title-case rules word by word, with a self-test that
  includes a negative control.
