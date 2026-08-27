# Apple's interface language, distilled

The source of the mechanics this skill enforces. Read it once to understand *why* a rule
is a rule; `patterns.md` is what you actually write from.

**Where this came from.** Read and distilled 27 Aug 2026 from Apple's own current
guidance, not from second-hand articles about it:

| Source | What it gave us |
|---|---|
| [HIG — Writing](https://developer.apple.com/design/human-interface-guidelines/writing) (change log: 16 Dec 2025) | The principles: voice vs tone, action orientation, language patterns, possessive pronouns, empty states, error messages, settings, text fields |
| [HIG — Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts) | Alert titles, informative text, button titles, the OK problem, destructive/Cancel rules |
| [HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) | Label content, the verb rule, roles (primary / cancel / destructive) |
| [HIG — Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications) · [Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) | Notification titles vs body, previews-off text, onboarding as optional and interactive |
| [Apple Style Guide, June 2026](https://help.apple.com/pdf/applestyleguide/en_US/apple-style-guide.pdf) (244pp) | The mechanics: capitalisation rules word by word, the terminology verdicts, inclusive writing |

Apple is not quoted at length here on purpose — this is the working distillation, in
Lia's words, of rules that are Apple's. Go to the sources when a case is genuinely new.

---

## 1. The seven moves

The things Apple does that most product copy doesn't. Everything in `patterns.md` is one
of these seven applied to a surface.

**1. The label names the result, not the mechanism, and not the mood.**
Almost every button and link is a verb. Clarity beats personality: "Send" beats
"Let's do it!", every time. The test for a label is whether someone who has never seen
the screen can say what will happen after they press it.

**2. Voice is fixed. Tone moves with the situation.**
One voice for the product; the tone shifts with what the person is doing when they read
it. Apple's own comparison is a warning on Apple Watch (direct, serious) against a
closed activity ring (light, congratulatory) — same voice, different room. This is the
rule that keeps a product from being relentlessly cheerful at the worst possible moment.

**3. Consistency is a feature, not a tidiness preference.**
Build language patterns and reuse them: the same action always gets the same word, the
same flow always signals its steps the same way ("Get Started" to open, "Continue" or
"Next" through, "Done" to close). Consistency makes the product feel intuitive, and it
makes writing the next screen cheap. This is why `lexicon.md` exists.

**4. Never blame. Say what to do instead.**
Apple's own example is exact: telling someone their password is too short is worse than
telling them to choose a password with at least 8 characters. Same fact, one is a verdict
on the person, the other is the next step. And errors are frustrating already, so "Oops"
and "Uh-oh" don't soften them — they read as insincere.

**5. No "we". Possessives only when they earn their place.**
"We" is unclear about who is speaking and shows up worst in failures: rather than saying
*we're* having trouble loading this, say the content can't be loaded. Possessives go the
same way — "Favourites" says everything "Your Favourites" says, in fewer words. If you do
use them, use them everywhere and never switch person mid-product.

**6. Every word has to justify itself.**
Check each word to see whether it needs to be there; if fewer words will do, use fewer.
Read it aloud when unsure. Brevity is not clipped — it is one clear line instead of three
punchy ones.

**7. Match the delivery to the urgency.**
Alerts interrupt, so they have to earn it — an alert that only informs is a design
failure, and belongs inline in the context it's about. Notifications are glanceable and
must not carry error messages. Errors show up next to the thing that failed. Choosing
the wrong vehicle makes even perfect words wrong.

---

## 2. The mechanics

### Capitalisation — the Lia house rule

Apple names two styles: **title-style** ("Skip This Backup") and **sentence-style**
("This line is an example"), and calls title case formal, sentence case casual. Lia
chose **Apple-exact** on 27 Aug 2026 (CQ): title case for the things Apple title-cases,
sentence case for the things it sentence-cases. One rule, applied everywhere, so it can
be checked by a machine.

| Element | Case | Ending punctuation |
|---|---|---|
| Button and link labels | **Title** — "Add a Toy", "Put It Back" | None. Except `…` (see below) |
| Menu items, tabs, section and screen titles | **Title** | None |
| Alert title that is a **fragment** | **Title** — "Not Enough Room" | None |
| Alert title that is a **complete sentence** | **Sentence** — "Delete this run?" | Yes |
| Informative text under an alert title | **Sentence**, complete sentences | Yes |
| Body copy, empty-state copy, help text, setting descriptions | **Sentence** | Yes |
| Notification title | **Title** | None |
| Notification body | **Sentence**, complete sentences | Yes |
| Placeholder / hint text | **Sentence** | None |

**The rules inside title case**, from the Style Guide, and exactly what `copy-lint.py`
implements:

- Capitalise the **first and last word**, whatever part of speech it is.
- Capitalise nouns, pronouns, verbs, adjectives and adverbs — however short (Is, Are, Be,
  It, My, You).
- Capitalise conjunctions except the coordinating ones, and prepositions of **five letters
  or more** (About, Between, Through).
- Capitalise a preposition of **any** length when it is part of a phrasal verb — Turn On,
  Start Up, Log In, Put Back — or is doing another job in the sentence.
- Capitalise the second word of a hyphenated compound (High-Level Events), except
  "Built-in" and "Plug-in".
- **Don't** capitalise: articles (a, an, the) unless first or straight after a colon;
  the coordinating conjunctions (and, but, or, nor, for, yet, so); "to" in an infinitive;
  "as" in any role; prepositions of four letters or fewer (at, by, for, from, in, into,
  of, off, on, onto, out, over, to, up, with); and words that are always lowercase
  (iPhone, macOS — and, for us, lia.tools and lia.build).
- Names of onscreen elements are written **exactly as they appear onscreen**. If the
  element itself is all caps or all lowercase, title-case it when you write *about* it.

### Punctuation

- **No full stop on a label or fragment title.** Full stops belong to complete sentences.
- **A label ending in `…` promises more input** — a dialog, a picker, a further step —
  and it is a real ellipsis character, never three dots.
- **Question marks** belong on alert titles that genuinely ask ("Delete this run?").
- **Exclamation marks**: essentially never, and absolutely never in an error.
- Contractions are correct and recommended — don't, can't, you're, it's — because they
  are how people speak. Don't form them from nouns ("The computer's not working" is out).
- Use the typographic apostrophe (’), not the straight one.

### The words themselves

Apple's terminology verdicts that change what we write:

| Instead of | Write | Because |
|---|---|---|
| "Enable file sharing" | "Turn On File Sharing" | *Turn on* starts something now; *enable* means making something possible later |
| "Please follow the steps" | "Follow the steps" | *Please* is out of instructional text |
| "Error message" (to a person) | "message" / "alert" | *Error message* is developer vocabulary |
| "Invalid name" | "Use only letters for your name" | Say how to get it right, not that it's wrong |
| "We recommend…" | "For best results…" | No first person |
| "Abort" / "Kill" | "Stop", "Cancel", "Quit", "End" | Both are violent developer words |
| "Grayed out" | "Dimmed" | Dimmed items can't be selected or chosen |
| "Click on" / "Click and drag" | "Click" / "Drag" | Neither compound is a thing |
| "Dialog box" | "Dialog" | And a *sheet* is never called a sheet to a person |
| "Check the checkbox" | "Select…" | You can't tell someone to check a box whose state you don't know; a checkbox is selected or unselected, never checked |
| "Native app" | "designed for [device]" | Native is developer framing |

And the verbs of interaction: you **choose** a menu item, you **select** a thing (a file,
some text, a checkbox), you **click** with a pointer, you **tap** on touch, you **press**
a physical button. Describe the gesture the device actually has — never "click" on a
phone. Best of all, where you can, name the target and skip the gesture.

---

## 3. What we take, and what we don't

Taking a house style from another company wholesale is how you end up sounding like a
tribute act. The line:

**We take** the mechanics (capitalisation, punctuation, the ellipsis promise), the
action-orientation of labels, the blame-free error rule, the no-"we" rule, the
consistency discipline, the delivery-method matching, and the terminology verdicts above.
These are craft, not personality — they'd be right for any careful product.

**We don't take:**

- **American spelling.** Lia is Australian English, Macquarie. That is the one place where
  the Apple Style Guide is simply not our guide. `lia-voice-check`'s `word-check.py`
  is the backstop.
- **Apple's product vocabulary.** Their nouns are theirs. Ours are in `lexicon.md`.
- **Apple's tolerance for "OK".** They allow it in purely informational alerts; we don't
  need it at all, because our alerts should be actionable or shouldn't be alerts.
- **Any of it over the Lia voice.** Where Apple's mechanics and
  `lia-voice-check/references/lia-voice.md` disagree, the Lia voice wins — the mechanics
  say how a label is capitalised, not what Lia sounds like. In practice they agree almost
  everywhere: plain over performed, trust the reader, no hype, no manufactured
  significance.
