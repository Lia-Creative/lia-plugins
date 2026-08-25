---
name: story-writer
slug: story-writer
version: 0.2.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/story-writer"
  - "write the stories"
  - "break this epic into stories"
  - "user stories for <epic>"
  - "story for <capability>"
companions:
  - epic-builder
  - scenario-builder
  - task-writer
  - ready-review
  - acceptance-criteria
  - ticket-builder
maintainer: cq
---

# Story writer — one capability, in the user's terms

**What this is.** The seat that turns an epic's value into stories: the capabilities that define the version's scope. The story format is [Dan North's "What's in a Story?"](https://dannorth.net/blog/whats-in-a-story/) — the best-practice user story shape, adopted 26 Aug 2026. The surrounding process is [Tool shop](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8); the ticket rules are [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b).

**Why it exists.** The stories *are* the scope — `charts 1.0` contains exactly what its stories say. And a story is the goal a build agent gets dispatched at, so a vague one doesn't produce vague work, it produces confident wrong work. CQ, 26 Aug: acceptance criteria are *"not technical specs but essentially what we would deem as success against that user story."*

---

## 1. What a story is

**One capability the version gives a person.** A lyric chart editor. A transpose tool. Not "the frontend", not "phase 2", not "set up the database" — the first two are slices of architecture, the last is a task (`task-writer`'s).

A story is:

- **A child of its epic**, defining part of that version's scope by existing.
- **Usually type `Feature`** — someone can do something they couldn't. (A story that hardens or speeds something is an `Improvement`; exactly one type either way.)
- **Sized to be held as one goal** inside the epic's single build run. If it needs its own branch to be sane, it's an epic pretending.

## 2. The shape

**The title is a name** — two to four words, lowercase, sayable in a standup: `lyric chart editor`, `transpose tool`. **The story itself goes in the body** (CQ, 26 Aug: *"every story has a title. The ticket name is the title, and the story itself goes onto the ticket"*).

```markdown
**Story.** As a [named person], I want [the capability], so that [the benefit].

**Why this exists.** One paragraph — where it came from, what it costs to not have.
The sources live as relations, not prose chips.

**Acceptance criteria**

1. Given [context], when [event], then [outcome].
2. Given [context], when [event], then [outcome].
3. Given [the empty state / the obvious wrong input, as a person meets it], when [event], then [outcome].
4. [A judgement call, honestly marked.] [Graded at Review]

**Delivery checks**

1. [Non-behavioural obligations — process attestations, ops steps. Own list, own numbers.]

**Scope / non-goals.** What this story is not, and where that lives instead.
```

The rules that hold it together:

1. **The narrative is real, not ritual.** *As a* names a person from the discovery material — the adventure chats first; where the cast and a real adventurer disagree, the adventurer wins. *So that* carries the benefit — if you can't finish it honestly, the capability doesn't belong in this version.
2. **Acceptance criteria are user acceptance criteria, written as numbered Given/When/Then scenarios** (LIAB-949 P2 — numbering preserved, because everything downstream cites them by index). Success in the person's terms — what they can now do — never implementation ("uses the store's debounced write" is tech notes, and they arrive later, from the lead engineer, *underneath* the user criteria, never instead of them). Still checkable by someone who wasn't in the session — "it feels nice" is not a criterion unless it is honestly marked **"[Graded at Review]"**; "the chart follows the transposed key everywhere it's shown" is one.
3. **Non-behavioural obligations are not acceptance criteria** (P3). Process attestations, ops steps, "recorded either way" notes go under **Delivery checks** — their own numbered list — so the AC list is purely behaviour and the two probes (the missing Given, the forgotten Then) can actually run.
4. **The narrative-required rule** (P4): user-facing Feature work carries the full narrative with a named face; enabling or infrastructure work may run a Goal line but must name its beneficiary; **a bare one-liner never enters Build** — `ready-review` fails it.
5. **Five or six scenarios at most.** More means the story is too big — split it along business lines, by scenario, not by technical layer (North's rule; `scenario-builder` walks the flows this cap is counted over).
6. **Bugs keep symptom titles, Decisions name the call** — unchanged carve-outs; those aren't stories and don't get narratives bolted on.

## 3. Hand off

- **`ready-review`** gates the stories (fresh session). Expect it to fail anything a build agent would need the vault to understand — fix the story, not the prompt.
- **Design picks stories up next** — each story gets its design, then the epic gets its cross-story pass, before build. Don't write design into the story; leave the seam clean.
- **`task-writer`** for the real work your stories surfaced that isn't a story.

Mechanics — `save_issue`, relations, sequencing, priority-in-two-scales, the wrap-up — live in `ticket-builder`.

---

## What this seat is not

- **Not the epic.** If you're writing value-and-why-now, you're in `epic-builder`'s seat.
- **Not the spec.** No component names, no file paths, no API shapes. That's what the design stage and the lead engineer's build prep are *for* — collapsing them into the story is the failure this whole shop exists to prevent.
- **Not the plan.** The builder plans in plan mode and posts it to your story as a comment. Leave room for it.

## Changelog

- **0.2.0 (2026-08-26, LIAB-949 + Fable 5)** — the Dan North install (P1–P5): behavioural ACs are **numbered Given/When/Then scenarios** with "[Graded at Review]" for the honest judgement calls; the **Delivery-checks split**; the **narrative-required rule**; `scenario-builder` and `acceptance-criteria` named as the seats either side. This carries the brief's item 2, which targeted the vault ticket-builder's Shape A — the shape had moved here the same morning (LIAB-919/920), so the change follows the canon.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The Dan North narrative + user-terms acceptance criteria, name-titles per the 26 Aug title call, scenario cap, and the two clean seams (design, tech notes) that keep a story from becoming a spec.
