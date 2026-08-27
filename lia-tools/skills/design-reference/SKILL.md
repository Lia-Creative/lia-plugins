---
name: design-reference
slug: design-reference
description: "Reference already in the vault, put to work — find the flows worth looking at, break them down screen by screen with every claim cited to a frame, then apply them to the feature at hand as take/adapt/drop with the open decisions named. Use when designing a screen or flow and someone asks what good looks like, or says shortcut this off the reference we captured."
version: 0.1.0
created: 2026-08-27
updated: 2026-08-27
status: active
triggers:
  - "/design-reference"
  - "what reference do we have for this"
  - "how does [product] do this"
  - "break down the [flow] reference"
  - "shortcut this off the reference"
  - "look at the design inspiration for [feature]"
companions:
  - design-exploration
  - design-flows
  - hifi-design
  - design-lead
  - ui-capture
  - ui-teardown
maintainer: cq
---

# Design reference — the swipe file put to work, not admired

**What this is.** The seat that turns reference material already sitting in the vault into something a design session can build on: **find** what we hold that's relevant, **break it down** into the decisions the reference actually makes, and **apply** it to the feature in front of us — each pattern marked take, adapt, drop or doesn't-apply, with what's still ours to decide named out loud.

**Why it exists.** CQ, 27 Aug 2026, on 307 sorted Dropbox Paper frames: *"it will be useful for short cutting flow specs for the app set up… the skill will look at references, break them down and then apply to whatever feature we're looking at."* The material exists. Without a seat that knows how to find it, a design session either re-derives how a product works from memory — which is how a wrong pattern gets built confidently — or never opens the folder at all. `design-exploration` already demands *"steal honestly… cite the shot, not the memory"*; this is the route that makes that possible for reference we already own.

---

## 1. Find — the search order, in order

Reference lives in more than one place and the cheap sources come first. **Read the register before the frames:** every source folder carries a README listing its flows, and a teardown has already done the looking. Stop as soon as you have enough for the feature; you are not surveying the vault.

| Order | Where | What it is | Cost |
|---|---|---|---|
| 1 | `Products/Lia Toys/toy box/02 research/design inspiration/[source]/` | The swipe file — full-resolution screens grouped by source product, then by flow. Each source's `README.md` is the flow index. | Frames: expensive. Register: free. |
| 2 | `Research/Competitors/[product]/` | `ui-teardown` runs — analysis already written, claims already cited. A finished teardown beats re-reading its screenshots. | Cheap |
| 3 | `Products/[product]/Resources/` and `Research/Competitors/[run]/captures/` | `ui-capture` runs from either our products or theirs, with manifests. | Medium |
| 4 | `Research/Design/` | Brand culture studies — for tone and posture questions, not flow structure. | Cheap |
| 5 | The repo's own `design/[spec-name]/` prototypes and the Toys DS | **What we have already decided.** Check before borrowing anything: a pattern we've already settled is a settled decision, not an open question. | Cheap |

**Naming the flow you need.** Match on the *job*, not the product's label for it: an account-setup flow is `sign-up` plus `onboarding` plus the first-run part of a file browser, across three folders. The swipe file's flow boundaries are, in its own README's words, *"a best-effort read of the screens, not an authoritative record"* — treat a boundary as a hint, and follow the sequence across it when the walk continues.

**When nothing relevant exists** — say so, and route: `ui-capture` to go and get the screens, `ui-teardown` for a product worth judging as well as mining. **Never fill the gap from memory of the product.** An uncited claim about how a real product behaves is the specific failure this seat exists to prevent, and it is indistinguishable from a correct one until it's built.

## 2. Break down — bounded reads, cited claims

### The read budget

Frames are full-page screenshots and a flow can hold hundreds — the Dropbox Paper `document-editor` alone is 191. **Never open a whole flow blind.**

- **12 frames or fewer:** read the flow.
- **More than 12:** read the first three, the last two, and an even sample of the middle up to **twelve total**. Then do one targeted follow-up pass on the steps that turned out to matter — by then you know which those are.
- **Record what you read.** Every breakdown states the frames opened and the frames skipped. Confidence follows coverage, the same discipline `ui-teardown` runs on: a thin read produces a thin read's confidence, not a confident summary of a thin read.

### What a breakdown contains

Reference is only worth the decisions it encodes. For each screen in the walk:

- **The step** — where the person is, and what the screen is for.
- **What it asks and what it offers** — fields, actions, the primary path versus the escape hatches.
- **The decision the screen makes** — what got deferred to later, what got asked up front, what got defaulted, what got explained and what got assumed. This is the part worth having. *"Terms consent is a checkbox on the create form, not a separate step"* is a decision; *"there is a sign-up form"* is a description.
- **The frame** — a real path, always: `dropbox paper/sign-up/001.png`. A claim without one doesn't go in.

Then, across the walk: how many steps to the first useful moment, what the flow refuses to ask, where it branches, what it does when the person arrives already half-set-up.

## 3. Apply — to our feature, honestly

### The model check, before anything is borrowed

Name where their product differs from ours **first**, because a pattern that only makes sense inside their model is a trap that reads as a shortcut. Dropbox Paper is multiplayer cloud documents on a web app with an account gate on the front door; a toy is a single-purpose tool in a local-first desktop shell. Their sign-up carries an account because nothing works without one — ours has to survive `dev mode needs no account`. Same screens, different reason for existing.

### The verdict, per pattern

| Verdict | Means |
|---|---|
| **Take** | The pattern holds in our model. Say which scenario reaches it. |
| **Adapt** | The shape is right, one decision changes — name which, and why. |
| **Drop** | Deliberately not doing this. The reason is the value; a silent drop gets re-proposed next month. |
| **Doesn't apply** | Their model, not ours. Name the model difference so nobody re-litigates it. |

**A pattern only enters our design if a scenario reaches it.** `design-flows`' rule holds here and this seat is where it gets tested most: reference is the easiest place in the whole stage to acquire scope by admiration. A borrowed screen with no scenario behind it is scope invented sideways — it goes back to `discovery-lead` as a question, not forward into a flow.

**What's still ours to decide** closes every breakdown. The reference answers what it answers; the gaps it leaves are the design work, and naming them is what stops a borrowed flow reading as a finished one.

## 4. The form, and where it goes

A breakdown is a short document — a flow it takes ten minutes to read is a flow nobody reads:

```
[Source] — [flow] — reference breakdown
  Read: frames opened / frames skipped, and why
  Model difference: theirs vs ours, before anything is borrowed
  The walk: step | what it does | the decision it makes | frame
  Applied to [our feature]: take / adapt / drop / doesn't apply
  Still ours to decide
```

It lives with the design work, named `reference-[source]-[flow].md`: beside the artefact in `design/[spec-name]/` in the repo, or in the scope's `04 design/` folder for vault-side work in the toys line (the line's own numbered shape — `02 research/design inspiration/` is where the *frames* live, not the breakdown). And **the applied half travels onto the ticket.** That matters for one reason: a builder must never need the vault to understand a design. Same rule `ticket-review` enforces on resolvable paths; a breakdown that only exists in a Drive folder is a breakdown the build stage can't see.

## The standing rules

1. **Cite the frame or don't claim it.** Every statement about how the reference behaves carries a path. Memory of a product is not a source, however well you know it.
2. **Reference is inspiration, not a spec.** The swipe file's own README: *"Nothing here is a Lia design."* This seat mines structure and decisions; it never hands over a screen to copy.
3. **Structure travels, expression doesn't.** Borrow the shape of a flow; never the visual. Everything we draw is Toys DS in Toys DS terms — `hifi-design`'s on-system-or-named rule, one seat upstream.
4. **Don't lift their words or their assets.** Their microcopy is theirs, and the frames carry a third-party watermark (*"curated by Mobbin"*) — internal reference only, never into a shipped screen, a render, or anything outward-facing.
5. **Coverage is stated, never implied.** What you didn't read is part of the output.
6. **A settled decision beats a borrowed one.** Check source 5 before proposing a pattern we've already chosen against; the register wins, exactly as it does in `design-exploration`.

## What this seat is not

- **Not `ui-capture`.** That engine goes and gets screens; this seat reads what we hold and routes to it when we hold nothing.
- **Not `ui-teardown`.** Teardown judges a product against a rubric and asks what it means for Lia. This mines one flow for structure a feature can use — and it happily consumes a teardown as input rather than redoing it.
- **Not `design-exploration`.** Reference informs directions; it doesn't choose one. A direction that is *"do what they did"* hasn't explored anything.
- **Not the flows.** `design-flows` decides our flows from our scenarios. This shortens that work; it never replaces the scenario as the reason a screen exists.

## Changelog

- **0.1.0 (2026-08-27, CQ + LIAB-1000)** — first version. The vault's reference material as a seat on the design bench: the five-source search order, the read budget and coverage honesty, the frame-cited breakdown, and the model check plus take/adapt/drop/doesn't-apply that lands it on the feature.
