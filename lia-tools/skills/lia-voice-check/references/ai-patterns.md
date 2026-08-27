# AI patterns — structural lint

Mechanical AI-writing patterns to scan for. Each is a pattern match → suggested fix. Run every check in order; scan the full draft and log every match, don't stop at the first. Adapted from Dan's `voice-check` (Robson Studio vault), itself from Jacob Shultz's humaniser — trimmed to the **register-agnostic** tells that apply to any Lia copy, with the Dan-personal rules removed.

This is not a voice guide. It detects how AI writes by default and fixes it. The voice guide is `lia-voice.md`.

---

## Structural patterns

**1. Negative parallelism / antithesis reflex.** "It's not X. It's Y.", "Not just this, but that", "Less about X, more about Y", "X, not Y" clipped endings, "a signal, not scenery". The single most common AI tell. Fix: state the thing plainly, drop the contrast frame. Keep at most one or two per document, only where the contrast genuinely earns its place.

**2. Rule of threes.** Lists of exactly three items, three stacked adjectives, three examples. Ask whether three is the real number. Fix: use the real number — two is fine, four is fine. Three-by-default is the tell.

**3. False ranges.** "From X to Y" dressing two loosely related things up as comprehensive ("from strategy to execution"). Fix: if there's a real range, describe it; if not, drop it.

**4. Compulsive summaries.** "Overall…", "In conclusion…", "Ultimately…", "In summary…", any standalone closing paragraph that restates what came before. Fix: cut. Land on one quiet line.

**5. Copula inflation.** "serves as", "stands as", "represents", "marks", "features", "offers", "boasts", "maintains" where "is" would work. Fix: use "is".

**6. Tacked-on participles.** Sentences ending in a dangling present participle: "…helping teams collaborate", "…making the invisible visible". Fix: give the second idea its own sentence, or cut it.

**7. Synonym cycling / verb tic.** Rotating near-synonyms for one thing (designers → practitioners → makers → creators), OR the inverse — the *same* distinctive verb on every item across a long list (every entry opening "you clock…" / "registers with you"). Fix: pick one word for cycling; vary the sentence shape when one verb repeats across a templated list.

**8. Significance inflation.** Ordinary facts grafted onto sweeping arcs: "marking a pivotal moment", "setting the stage for", "a key turning point". Fix: state what the thing is and does; cut the arc.

**9. Manufactured-significance closer / "X matters".** A sentence whose only job is to tell the reader the thing was meaningful: "which is exactly why it needs a name", "This is the work that matters", "It's real work", "That's the point", "This catalogue says so out loud". Fix: cut it. If the preceding description doesn't carry its own weight, strengthen the description instead.

**10. Persuasive authority tropes.** "At its core…", "The real question is…", "What really matters is…", "The deeper issue is…", "Fundamentally…". Fix: drop the framing, state the point.

**11. Signposting.** "Let's dive in", "Let's explore", "Here's what you need to know", "Let's break this down", "the interesting bit is", "the thing I didn't expect". Fix: cut, start with the content.

**12. Fragmented headers.** A heading followed by a one-line paragraph that restates the heading. Fix: cut the restating line.

**13. Tailing negations.** Clipped fragments tacked on for punch: "…no guessing", "…no exceptions", "…not scenery". Fix: write the thought as a real clause (overlaps with #1).

**14. Engagement-bait closers.** "The future looks bright", "Exciting times ahead", "Agree?", "Sound about right?", "What's your workflow?". Fix: end on a plain statement or a soft, concrete recommendation.

**15. Formatting as thinking.** Heavy bolding, compulsive bullets, numbered lists where prose would work. Fix: hold the argument in sentences. (Genuinely list-shaped content — a catalogue, a checklist — is exempt; the tell is bullets *substituting* for a thought.)

**16. Em dashes as default.** The em-dash crutch. In prose, default to commas, full stops, or parentheses; reserve the em dash for a deliberate beat (aim ≤1 per paragraph/entry). Fix: flag every prose em dash and ask whether it earns its place. Structural em dashes used as a consistent label separator (e.g. a bullet label — content) are a formatting convention, not a prose tell — leave those.

**17. Urgency framing.** "everyone's rushing to X", "teams are racing to Y", "while most are still stuck on Z". Fix: cut. Show the thing and let the reader decide why it matters.

**18. Manufactured surprise setups.** "Here's what I didn't expect", "What's wild is", "Plot twist", "the bit that got me". Fix: state the observation directly.

**19. Staccato sentence stacking.** Three or more consecutive sub-8-word sentences: "It's clear. It's repeatable. It's working." AI's default punchy-conclusion style. Fix: combine into a flowing sentence, or vary length so a short sentence lands by contrast. "Direct" means clear, not clipped.

**20. Uniform openings.** If more than half of paragraphs/entries open with a short sentence of the same shape, the rhythm is monotonously AI. Fix: vary the openings.

**21. Interpretive overreach.** A sentence telling the reader what to conclude about what was just shown: "That's the point", "And that's what matters". Fix: cut it; strengthen the observation if it doesn't stand alone.

---

## Lexical patterns

**22. Hard-avoid AI vocabulary.** *delve, tapestry, pivotal, seamless, transformative, navigate, unlock, foster, elevate, landscape, leverage, robust, holistic, synergy, crucial, powerful, groundbreaking, innovative, testament, underscore, enhance, streamline, empower, utilise/utilize.* Fix: replace with a precise word or cut. Catch close variants too ("seamlessly", "elevating", "fostering"). The word-check script catches the base forms deterministically. Note: literal uses are not the tell ("the unlocked door" is a door, not "unlock potential") — judge in context.

**23. AI filler words.** "actually" (the worst offender), "really" as a hedge, "literally", "basically", "essentially", "simply", "just". Fix: cut; they almost always mean nothing in context.

**24. Lazy passive phrases.** "is shaped by", "is driven by", "is informed by", "is defined by", "is underpinned by". Fix: name the actor.

**25. Throat-clears.** "This is where…", "It's worth noting that…", "At the end of the day…", "Here's where it gets interesting…". Fix: cut, start with the substance.

**26. Filler phrases.** "In order to…" → "To…" · "Due to the fact that…" → "Because…" · "Has the ability to…" → "Can…" · "It is important to note that…" → cut · "Plays a role in…" → name the role · "In terms of…" → cut or use a direct preposition.

---

## Hedging, emotion, attribution

**27. Vague attributions.** "Experts believe…", "Research suggests…", "Studies show…". Fix: name the source or own the claim.

**28. Absolutes / unsourced generalisations.** "most", "always", "never", "all", "every", "consistently". "Most" is the most common offender. Fix: source it, qualify it, replace with "many", or cut. (Established facts and named research can use appropriate confidence.)

**29. Fabricated specifics.** Concrete details (numbers, names, dates, quotes) that weren't sourced from the brief or the vault. A plausible detail with no source is still fabricated. Fix: replace with a general observation or flag `[confirm or replace]`. Specificity is credibility only when it's true.

**30. Emotion broadcasting.** Phrasing that tells the reader how to feel: "What's striking is…", "It's hard not to be moved by…", "money worry is heavier carried alone". Fix: cut the broadcasting sentence. If the observation is specific enough, the reader feels it themselves. (Held's deliberate felt-cost lines are the edge case — keep the ones that *show*, cut the ones that *announce*.)

---

## Spelling and convention (Australian)

**31. American spelling slips.** Lia writes Australian English.
- `-ize` → `-ise` (organize → organise, realize → realise)
- `-or` → `-our` (color → colour, behavior → behaviour)
- `-er` → `-re` (center → centre, meter → metre)
- `-led` → `-lled` (traveled → travelled, modeled → modelled)
- `-og` → `-ogue` (catalog → catalogue, dialog → dialogue)
- `defense/offense` → `defence/offence`
- `practice` (noun) vs `practise` (verb)
- `program` (computing) vs `programme` (event/curriculum)

Default to the Macquarie Dictionary, not Merriam-Webster.

**32. Sentence-case headings.** Headings and labels use sentence case, not Title Case. "What done looks like", not "What Done Looks Like".
