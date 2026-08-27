---
name: epic-builder
slug: epic-builder
description: "Shape a versioned chunk of value into an epic — charts 1.0, scope read from its stories, value/why-now/what-it-is-not/how-you'd-know body, no ACs on the parent. Use when opening a piece of work, shaping the next version of a tool, or asked 'epic: [name]'."
version: 0.3.0
created: 2026-08-26
updated: 2026-08-28
status: active
triggers:
  - "/epic-builder"
  - "epic: [name]"
  - "build an epic"
  - "shape this chunk of value"
  - "new epic for [toy/feature]"
  - "what should charts 1.0 be"
companions:
  - jtbd
  - problem-definition
  - story-writer
  - task-writer
  - ready-review
  - ticket-builder
maintainer: cq
---

# Epic builder — a versioned chunk of value

**What this is.** The PM seat that opens a piece of work: take a chunk of value — charts, share, onboarding — and shape it into an epic the rest of the shop can run on. The process around it is [Tool shop](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8); the shapes are [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b). Where this skill and those documents disagree, they win and this skill gets fixed.

**Why it exists.** CQ, 26 Aug 2026: an epic is *"about figuring out a big chunk of value… not too chunky though"* — and agents handed anything vaguer produce plausible mush. The epic is the goal every downstream seat inherits, so the quality ceiling of the whole build is set here.

---

## 1. An epic is a versioned chunk of value

**The name carries the version: `charts 1.0`, not `charts`.** Lowercase, the value in plain words, the version at the end.

Three rules that follow, each load-bearing:

1. **Scope is read from the stories, never from prose on the epic.** charts 1.0 has a lyric chart editor, a section editor and a transpose tool because three stories say so. It doesn't have share because no story says so. Writing a feature list on the epic gives the same fact two homes — the exact error the board-spine decision rejected for labels.
2. **The next slice of value is a new epic.** Share arrives as `charts 1.1`, a fresh epic with its own stories — never as stories quietly added to a closed 1.0. An epic's children never span versions, so a parent is done exactly when its children are, and the board can answer "what shipped in 1.0" forever.
3. **Not too chunky.** An epic is one build agent's goal for one run — a handful of stories, buildable on one branch as one PR. If the stories won't fit that, you're holding two versions; split them now, cheaply, rather than mid-build.

## 2. Ground it before you write it

The epic answers *what changes for a person* — and since the discovery seats landed (26 Aug pm), it stands on their output: a `problem-definition` brief says what hurts, and `jtbd` names the job being hired for — **cite the job; don't re-derive it.** Then find the person:

- **The adventure chats are the guide** (`Products/Lia Tools/02 discovery/` when the vault is mounted; the discovery material linked from the project otherwise). Where the who-we-serve cast and a real adventurer disagree, **the adventurer wins** (register, 25 Aug).
- **Check the [Decisions register](https://linear.app/lia-creative/document/decisions-register-lia-toys-34348df61a5f) before shaping** — the call you're about to re-derive is probably in it.
- **Record sources as relations and links, not prose chips.** If you can't name one real source, it's not an epic yet — it's an `idea` label or a Research ticket.

## 3. The shape

The canonical parent shape (shape doc, 25 Aug) — four beats, in the epic's body:

```markdown
**The value.** What changes for a person, in their terms. Name the person.

**Why now.** What makes this the next version — the trigger, the cost of waiting.

**What it is not.** The non-goals, each with where that work lives instead.

**How you'd know it worked.** The outcome observable from outside — not a feature list.
```

The JTBD → user → success → why thinking now lives in the `jtbd` seat — consume its statement; **write it down** as the four beats above. Then:

- **No acceptance criteria on the epic.** They belong to the stories.
- **No type label.** An epic is a position — top-level with children. Routing labels (`infra`, `design-system`, `human:chris`) are fine; type labels are not.
- **Milestone if one genuinely fits.** Forcing a wrong rung makes the milestone read false — leave it off and say so instead.
- **Priority is the bucket's rank against other epics.** Children re-rank within it (two scales, CQ 11 Aug).

## 4. Hand off

The epic alone is half the job. In the same session or the next:

1. **`story-writer`** turns the value into stories — the capabilities that define the version's scope.
2. **`task-writer`** catches the real work that isn't a story.
3. **`ready-review`** gates the lot before design or build spend anything on it — a fresh session, not yours.

Mechanics — team routing, `save_issue`, relations, sequencing, the wrap-up — live in `ticket-builder` and are not restated here.

---

## What this seat is not

- **Not the story writer.** The epic never enumerates its stories in prose.
- **Not design or build.** The epic says what changes for a person; how it looks and how it's built arrive at their own stages.
- **Not a plan.** If you're writing implementation steps on an epic, stop — that's the builder's plan-mode work, and it lands on tickets as comments later.

## Changelog

- **0.3.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.- **0.2.1 (2026-08-26, LIAB-959)** — the `<name>` placeholder in `description:` and in two `triggers:` becomes `[name]`. Cowork's validator parsed the angle brackets as an XML tag and refused the whole plugin; the git channel had accepted it. Wording and behaviour unchanged.
- **0.2.0 (2026-08-26 pm, Fable 5)** — the discovery seats land upstream: the epic cites `jtbd`'s job statement and `problem-definition`'s brief instead of carrying the JTBD lens itself. Shape unchanged.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. Carved out of `ticket-builder` 0.4.0's epic half (the JTBD/User/Success/Why thinking survives as the discovery lens; the written shape follows the 25 Aug shape doc). New here: the version in the name, scope-read-from-stories, next-version-is-a-new-epic, and the not-too-chunky rule sized to one build run.
