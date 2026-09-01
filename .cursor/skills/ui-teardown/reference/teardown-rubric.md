# Teardown rubric

Ten fixed sections. Same shape every time, so any two teardowns are comparable and a reader knows
where to look. Every claim cites a shot (`[NN-slug.png]`); inference is flagged `[inferred]`; a
surface that wasn't captured is named as "not captured", never invented.

Open the doc with a one-line **confidence** statement (High / Medium / Low + why, from the capture
coverage). Carry confidence into any section that leans on a thin or missing surface.

---

## 1. Snapshot
What it is, archetype, who it's clearly built for, the pricing posture if seen. Coverage +
confidence for this run (N surfaces captured, score, what's missing). 3–4 sentences.

## 2. First run & onboarding
Signup → first value. How fast does a new user reach something useful? Empty states, setup wizards,
sample data, the "aha" path. Cite `signup` / `onboarding` / `empty-state` shots.

## 3. Information architecture & navigation
The mental model the product imposes. Nav structure (sidebar/top/nested), primary objects, how you
move between them, how deep it goes. Is the structure legible or sprawling? Cite `global-nav` shots.

## 4. Key flows
The 2–4 core jobs the product exists to do (for a CRM: find a contact → see history → act). Walk
each as a short numbered sequence with shot refs. This is the meat — where the product lives or dies.

## 5. Visual & interaction design
Layout, density, type, colour, spacing, motion, component quality. Read it against the heuristics
appendix below. Is it modern, dated, cluttered, calm? Density vs clarity trade-offs. Cite specific
surfaces.

## 6. Content, empty & error states
Microcopy voice, guidance quality, how the product handles nothing-yet and something-broke. The
states most teams neglect — and where craft shows. Cite `empty-state` / any error shots.

## 7. The AI angle
If the product has AI features: how is it framed — **invisible (outcomes in front)** or
**chat/prompt-forward**? Where does it sit in the flow? How much does it ask of the user? This maps
directly onto Lia's "AI invisible, outcomes in front" principle, so be specific. If no AI surface
was seen, say so.

## 8. Standout patterns
The 3–5 things genuinely worth learning from — a slick flow, a smart default, a piece of IA, a
delightful state. The "borrow this" list. Each tied to a shot.

## 9. Weaknesses & gaps
Where it's frustrating, dated, thin, or over-built. Friction in the core flows, density problems,
missing capabilities. Honest, evidence-cited — and flag where a "weakness" is really just a coverage
gap (low confidence).

## 10. What this means for Lia
The point of the whole exercise. 3–6 decision-shaped takeaways, read against the strategy docs
(`who-we-serve/the-people.md`, the product vision, `trust-is-the-advantage.md`; for our own
products, the design system). Each takeaway is a move: **borrow / avoid / the-gap-we'd-own /
parity-bar**. Frame at least one against a named person from the cast (would this serve a Mara? where
does it fail a Theo?). No vague admiration — every line should help a build decision.

---

## Heuristics appendix (the lens for §5–6)

Use Nielsen's 10 usability heuristics as the consistent yardstick, so visual/UX judgements are
principled rather than taste:

1. Visibility of system status — does the product tell you what's happening?
2. Match to the real world — language/concepts the user already has.
3. User control & freedom — undo, exits, escape hatches.
4. Consistency & standards — internal + platform conventions.
5. Error prevention — stops mistakes before they happen.
6. Recognition over recall — options visible, not memorised.
7. Flexibility & efficiency — shortcuts for power users, simple for new ones.
8. Aesthetic & minimalist design — signal over noise.
9. Help users recover from errors — plain-language, constructive error states.
10. Help & documentation — available when needed, in context.

Don't grade all ten every time — name the 3–4 the product most clearly wins or loses on, with shots.

## Length + voice

Tight and scannable (Chris reads fast): lead each section with the point, then the evidence. Bullets
fine inside sections; no wall of prose. This is an internal analysis doc — direct register, not the
CQ public writing voice. If a polished external write-up is wanted, hand the teardown to the writing
voice afterward.
