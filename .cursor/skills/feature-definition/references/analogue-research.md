# Analogue research — reference

Analogue research is the "what does the world already do?" step of feature definition. Done well, it saves weeks of design exploration and shows you patterns you'd never invent from a blank page.

## Why we always do this

Three reasons:

1. **Most problems have been solved somewhere.** A musician's duplicate-file problem has been solved by Apple Photos, Lightroom, Gemini, Hazel, Files.app. You don't need to invent the wheel — you need to choose which wheels are worth borrowing from.
2. **Showing analogues makes the feature definition more credible.** A designer or dev picking up the feature can see what good looks like, not just a written description.
3. **The differences matter as much as the similarities.** Often the most interesting insight is *where* good analogues diverge — that's where there's design opportunity.

## What counts as an analogue

Cast a wide net. Three rings, in order of closeness:

### Ring 1 — Direct competitors / same problem, same user
The obvious ones. Other products doing the same thing for similar users.

### Ring 2 — Same problem, different user / context
The same problem solved for a different audience. (Duplicate management in Apple Photos for consumers vs. Lightroom for pro photographers.) Often the most useful — you see the *invariant* shape of the solution vs. the user-specific decoration.

### Ring 3 — Different problem, similar shape
Indirect analogues — products solving a different problem but with the same underlying pattern. (For "review and bulk-act on a list of items": email inbox triage, Tinder swipe, Spotify Liked Songs cleanup.) These are gold for breaking out of conventional thinking.

**Rule of thumb:** include at least one Ring 2 or Ring 3 analogue. Pure Ring 1 research produces derivative features.

---

## Where to look

For visual / UX patterns:
- **Mobbin** (mobbin.com) — screenshots of real apps, searchable by feature.
- **Page Flows** (pageflows.com) — recorded user flows from real apps.
- **Land-book** (land-book.com) — landing page patterns.
- **NN/g** (nngroup.com) — UX research and pattern articles.
- **Refactoring UI / Hover States** — design pattern collections.

For product mechanics:
- The app's own help docs / support center
- Product Hunt launch posts (often describe the mechanic)
- App Store / Play Store screenshots and descriptions
- YouTube product walkthroughs (search "[product] tutorial" or "review")
- Reddit discussions on the product (search "site:reddit.com [product] [feature]")
- The product's own marketing pages

For research-backed patterns:
- NN/g articles (UX patterns with research)
- Baymard Institute (e-commerce specific but generalizable)
- Inclusive design patterns (a11y considerations)

**Tool:** use `WebSearch` to find candidates, `WebFetch` to read the source. Always cite the source URL so the analogue can be re-checked.

---

## What to capture per analogue

Five fields. Be tight — 2-3 sentences per field.

### 1. Pattern
**How they solve it.** Describe the mechanic in plain language. What does the user see / do / experience?

> *Lightroom's "Find Duplicates" plugin groups files by metadata hash and shows a side-by-side preview with file size, date, and folder path. The user selects which to keep per group and can apply rules across all groups (e.g., "keep the largest").*

### 2. What's good
**Strengths worth noticing.** What does this analogue do well? Why does it work?

> *The side-by-side preview removes ambiguity — you're not deleting blind. The "apply across all groups" pattern lets power users move fast after a few manual decisions.*

### 3. What's missing
**Gaps or weaknesses.** What doesn't this analogue do well? Where does it frustrate?

> *No way to undo bulk decisions once committed. No way to detect "near-duplicates" (slightly different exports of the same recording). Setup is plugin-based, not native — friction to even try it.*

### 4. Borrow
**What we could take into our feature.** Be specific — name the pattern or behavior.

> *Borrow: side-by-side preview, "apply rule to all groups" power-user shortcut. Don't borrow: plugin-based setup, irreversible bulk actions.*

### 5. Source
**Direct URL** so it can be re-checked. If the analogue is a paid product or behind a login, link to a screenshot tour, YouTube walkthrough, or marketing page.

---

## The pattern summary

After capturing 2-4 analogues, write a **pattern summary** — what they collectively tell us. This is the most valuable output of this stage.

A good pattern summary names:

1. **The invariant** — what every good analogue has in common.
2. **The variations** — where they differ and what that tells you about user preferences or trade-offs.
3. **The gap** — what none of them do well that your feature could.

**Example:**

> *Every good duplicate manager (Lightroom, Gemini, Apple Photos) shows a side-by-side comparison before any destructive action — the invariant is "no blind deletes". They diverge on grouping logic (hash-only vs. perceptual hashing vs. metadata heuristics) — perceptual hashing is the more user-friendly default but costs CPU. None of them treat duplicates as a "creative memory" problem — they all frame it as storage cleanup. That's the gap for us: framing duplicate detection as "find the version you actually want" rather than "free up space".*

This summary is what makes the research load-bearing rather than decorative.

---

## How many analogues

**Sweet spot: 2-4.**

- **1 analogue** — shallow. Read like you forgot to do the research.
- **2-4 analogues** — enough to triangulate the pattern without overwhelming the doc.
- **5+** — overkill. Reads as research for research's sake. Pick the best.

Quality > quantity. One well-captured Ring 2 analogue beats three lazy Ring 1 ones.

---

## Common pitfalls

### 1. Only Ring 1 analogues
Three direct competitors = derivative features. Always include a Ring 2 or Ring 3.

### 2. No "what's missing"
If every analogue is great, you're not looking hard enough. Find the gaps — that's where your feature has room.

### 3. Vague "borrow"
**Bad:** "Borrow: the clean UI."
**Good:** "Borrow: the single-column list with inline action buttons (vs. modal-based actions)."

Be specific enough that someone could implement the borrow.

### 4. No source
Without a source URL, the analogue is unverifiable and might be wrong. Always cite.

### 5. Made-up analogues
Don't fabricate. If you can't find a real analogue, write fewer analogues, not invented ones. Real beats comprehensive.

### 6. Skipping the pattern summary
The summary is where the value compounds. Without it, you have a list of products, not insight.

---

## Quick template per analogue

Copy-paste this into your feature definition:

```markdown
### [Analogue name — what it is]
- **Pattern:** [how they solve it]
- **What's good:** [strengths]
- **What's missing:** [gaps]
- **Borrow:** [specific patterns or behaviors]
- **Source:** [URL]
```
