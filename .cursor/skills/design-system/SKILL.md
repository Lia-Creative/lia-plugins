---
name: design-system
slug: design-system
description: "The category standard for anything that draws or builds a Lia interface — the design system's rules shipped inside the plugin so a builder with no vault and no DS repo can work on-system: colour is reserved and Brand Blue is the only CTA, tokens by reference through the aliasing hierarchy, the owned type weights and the section-title exception, icons bare on the surface, both themes via class, the font-licence lines that bite, the known gaps, and where a gap routes. Use before drawing hi-fi, before polishing a built screen against its spec, before sweeping states, and whenever a build touches colour, type, icons or a component that might already exist."
version: 0.1.2
created: 2026-09-02
updated: 2026-09-02
status: active
triggers:
  - "/design-system"
  - "what does the design system say"
  - "which token"
  - "is this on-system"
  - "what colour is a CTA"
  - "can I use bold here"
companions:
  - hifi-design
  - polish
  - error-states
  - design-handoff
  - build
maintainer: dan
---

# Design system — the rules that hold, shipped where the builder is

**What this is.** The seat you load when you are about to put a Lia interface on a screen — drawing it at hi-fi, building it, polishing the build against its spec, or sweeping its states. It carries the design system's **rules** in full, in one file a plugin-only session can read: [`references/lia-design-system.md`](references/lia-design-system.md). Not the system itself — that is `@lia/design-system`, consumed and never forked — but what the system has decided, so a builder does not have to guess it or reach for a vault that is not mounted.

**Why it exists.** Tool-shop rule 1: *the builder has no vault.* Until this seat, every rule below lived in `Products/Design System/` in the Lia Vault and in the DS repo's own `CLAUDE.md` — both unreachable from a build machine — and no skill on the design bench cited any of them (measured 2 Sep 2026 on the installed 1.21.0, 72 skills, and re-checked on `main` at 1.27.0, 73 skills: the only design-system references across the roster were the two names *Toys DS* and `@lia/design-system`). A themed component library is not a design system; a system answers the question before the builder asks it. This file is where the answers live for the plugin.

**The split this seat holds.** *Rules travel; sources are cited.* The rules are here in full because a builder needs them and they are short. The evidence and the history behind them — the brand-foundations session, the Klim order, the retro logs — stay in the vault and the DS repo, pointed at, never copied. The reference carries a `verified-against` line naming the DS commit its rules were read from; when the DS moves, that line is what goes stale first and visibly.

---

## 1. Read the reference, then act

[`references/lia-design-system.md`](references/lia-design-system.md) is organised by the questions a builder actually asks, in this order: colour · tokens · type · components · icons · themes · fonts and licence · known gaps · what `polish` checks · where a gap goes · Toys DS. Read the section your question is in; read the whole file once per session if the work is a screen.

Three rules are load-bearing enough to restate here, because they are the ones that fail most quietly:

1. **Tokens by reference, never a literal.** A raw `#hex` or `oklch()` in app code is a defect, not a shortcut. A semantic token aliases a primitive; the primitive layer is the only place a literal lives.
2. **Colour is reserved — Brand Blue is the only CTA.** Accents are for content. A second button colour is a design decision that has already been made, and the answer is no.
3. **Never re-roll a DS component.** If a `Card`, `Badge`, `Button` exists, compose it. A hand-rolled div that imitates one is the drift this whole seat exists to stop.

## 2. A gap is a finding with an owner — never fudged

The system is not finished; the rule is that a gap is *named*, in the words of the reference, and routed:

- **`@lia/design-system` gaps → Dan**, on the ticket, with the `specialist:design-system` label (the shape doc: *"specifically means the gap is Dan's"*). Before declaring one, look in Storybook — `https://lia-design-system-v4.vercel.app` — the commonest gap is an unfamiliar token.
- **Toys DS gaps → Chris.** The reference's Toys DS section is a stub he fills; until then, Toys DS wins where a token name exists in both systems (`polish`'s standing rule), and a missing component is built shell-local, one implementation, listed per PR.
- **Never patch either system in the product repo.** Two exceptions only, both named in the reference and both recorded on the ticket as gaps: the light-scoped `--muted-foreground` override (§8) and a scoped app-local shim marked for removal (§4).

`polish` reads this seat to name gaps; `hifi-design` reads it one stage earlier, where a gap is cheaper.

## 3. The precedence, when sources disagree

The living brand library at `internal.lia.build/brand` wins, then the DS's `globals.css` at the commit the reference names, then the reference. If the reference says one thing and the DS ships another, the reference is stale — say so on the ticket and fix the reference by PR (it is Dan's file; a change to it lands like any skill). Do not resolve the disagreement by inventing a third value.

## What this seat is not

- **Not the design system.** `@lia/design-system` is Dan's lane, unforked by rule. This seat says what it has decided; changing what it decides is a DS PR, not a plugin edit.
- **Not Toys DS content.** Chris draws Toys DS; this seat carries a stub and the routing rule, nothing more, until he writes the section.
- **Not the brand checklist or the interaction library.** Those arrive as their own beats on the design bench and cite this file; this file does not grow to hold them.
- **Not the consumption wiring.** How an app installs the DS (transpile, fonts sync, `app://` protocol) is the vault guide's and the DS README's; a builder wiring a new consumer reads those, not this.

## Changelog

- **0.1.1 (2026-09-02, LIAB-1206, cold-review round 1)** — the exceptions are named where the absolutes are (§2, §4, §8, §10 agree); the two-theme declaration of semantics is stated, so the hierarchy actually yields the dark Brand Blue; accents marked mode-independent; Storybook's font serving scoped to the DS's own surface; H3 recorded as un-ruled rather than guessed; the section list carries all eleven; the measurement names both copies it was taken on. Round 2: the accent note cites the DS's own `-600` line and states fourteen checks of seven pairings, so neither number reads as invented.
- **0.1.2 (2026-09-02, LIAB-1206, Dan)** — the section-title exception is ruled for every heading level, H1–H4 (Dan, 2 Sep, provisional until he sees all four rendered); the reference now also records that the DS `.surface-ui` scope covers h1/h2/h4 only, so the H3 case is a named DS gap in Dan's lane rather than a question. `verified-against` re-confirmed against GitHub `main` the same day.
- **0.1.0 (2026-09-02, Dan + LIAB-1206)** — first version. The category standard for interface work, modelled on `file-management`: the rules travel in full in `references/lia-design-system.md`, read from `Products/Design System/using-the-lia-design-system.md` (updated 2026-08-17), `Context/brand-v4-reference.md` (updated 2026-08-18), the DS repo's `CLAUDE.md` at `798c2615`, and two of Dan's standing typographic rules that the vault guide had never carried. The gap-routing rule, the precedence rule, and the Toys DS stub. New writing, no competing copy.
