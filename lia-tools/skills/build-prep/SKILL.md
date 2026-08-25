---
name: build-prep
slug: build-prep
description: "Write the how-to-build notes onto a designed story — real paths verified against the repo, patterns to follow, traps, the full resolvable-path rule (files, services, accounts/connectors with identities) — under the criteria, never instead of them. Use when prepping an epic or story for a build dispatch."
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/build-prep"
  - "prep this for build"
  - "write the build notes"
  - "tech notes on the epic"
companions:
  - acceptance-criteria
  - ticket-review
  - architecture
  - schema-manager
  - build
maintainer: cq
---

# Build prep — the notes on how to build it

**What this is.** The third layer of the ticket, written by the lead engineer once the criteria are frozen: **discovery says what it needs to do, design expresses how a person experiences it, build prep tells the agent how to build it.** Notes for the build — real paths, the patterns to follow, what to reuse, the traps — landing *under* the user criteria, never instead of them.

**Why it exists.** CQ, 26 Aug 2026. And it was paid for before it was named: an audit found 84% of "dev ready" tickets needed rewrites because they referenced non-existent files, phantom tables and imaginary helpers. This seat is `orchestrate` 0.2.0's §4.5, promoted to its own skill and sharpened by atom 14's Dev Ready machinery.

---

## What goes on the tickets, per story where it differs

1. **Real paths.** Every file referenced exists or is marked *Create* — verify against the repo, don't recall. A note pointing at a path that isn't there is worse than none.
2. **The pattern to follow** — the existing code that does the nearest thing, named by file, so the builder extends instead of inventing. Where `architecture` has ruled a pattern canonical, cite the ruling.
3. **What to reuse and what not to touch** — including the settled decisions fenced: *"two things NOT to re-open"*. Agents are agreeable and will reverse a settled call if a ticket sounds unsure.
4. **The traps** — what's in flight nearby, which files another branch holds, what burned the last session, and the known classes: a feature rendering from client-only persisted state needs its **hydration strategy named** before build; the first stateful feature in a bundle surfaces SSR gaps that were cosmetic elsewhere.
5. **Resolvable paths, the full rule** (atom 14, three pilots' worth): every named file/path has a location or an install mechanism · every named service says how it's authed in the build session · **every named account or connector says *which identity* and *how the session gets it connected before work starts*** — naming an address is not the same as it being reachable · secrets referenced by location, never inlined.
6. **Hints are advisory — say so.** A named component or method can drift from the repo two ways (doesn't exist; exists with wrong semantics). The note carries the standing line: *verify the actual module against the repo; implement the correct one; log the drift — don't block on a wrong hint.* The criteria are the contract; the notes are guidance.

## Three checks before handing to `ticket-review`

1. **Every story has its design artefact** — one without does not enter Build; hold it and name what it's behind.
2. **The schema map agrees** — entities the build touches exist in the [map](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b) or get added now, not discovered mid-build.
3. **The vault test** — read each ticket as the builder will: Linear and the plugin, nothing else. Anything missing travels onto the ticket now.

## What this seat is not

- **Not the spec.** The frozen criteria are the contract; prep never adds, removes or reinterprets a criterion — a criterion problem goes back through `acceptance-criteria`.
- **Not a plan.** The builder plans in plan mode; prep gives the terrain, not the route.
- **Not optional for small epics.** The 84% figure came from tickets that looked obvious.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. `orchestrate` §4.5 promoted to a seat, plus atom 14's earned rules: resolvable paths (files/services/accounts), hydration precondition, hints-are-advisory.
