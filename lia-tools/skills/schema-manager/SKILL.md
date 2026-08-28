---
name: schema-manager
slug: schema-manager
description: "Map the core entities of a problem across three layers — shared typed code is the truth, the Linear map is the directory, the vault holds the analysis and never a field list. Use when a scenario or feature touches data, when an entity crosses a tool seam and needs a contract in code, when tools need to talk to each other, or when asked what data moves where."
version: 0.2.0
created: 2026-08-26
updated: 2026-08-28
status: active
triggers:
  - "/schema-manager"
  - "map the entities"
  - "add this to the schema map"
  - "what data does this touch"
  - "update the schema map"
companions:
  - scenario-builder
  - build-prep
  - security
  - file-management
maintainer: cq
---

# Schema manager — the entities named once, mapped centrally

**What this is.** The seat that maps the core entities of a problem: it systematically works through a scenario, defines the variables it touches, and records them in the **central schema map** — one place naming all data moving around the product. This is the layer that lets tools and toys talk to each other: two toys that both touch "a clip" agree on what a clip is because the map says so.

**Why it exists.** CQ, 26 Aug 2026: *"incredibly important for building tools/toys that talk to each other… it will essentially manage a big schema map of all data moving around the product and inform all other parts of the process."* Without it, every feature re-derives its entities and the seams between tools become guesswork — and the seams are where pipelines fail.

**The map lives in Linear** — [Schema map — lia.tools](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b) in the Lia Toys project — because every seat including a vault-less build agent must be able to read it. Its header carries its own rules; they match §3 below.

## The three layers — read this first

CQ, 28 Aug 2026: *"we probably want a space where schemas are managed. especially given every app relys on quality schemas talking to each other."* **A document cannot make two tools agree; a compiler can.** So the discipline runs across three layers, each doing exactly one job:

| Layer | Holds | Job |
|---|---|---|
| **Shared typed code** | the contract itself — fields, types, constraints | **The truth.** Two tools agree because they import the same type and the build fails when they do not |
| **The Linear map** | one entry per entity: what it is, who touches it, what it connects to, where its code lives | **The directory.** Readable by a build agent that has Linear and nothing else |
| **The vault** | the analysis — why an entity is shaped this way, which scenarios pushed on it, what collided and how it was settled, what is still open | **The reasoning.** The part that is lost when only the shape survives |

**And the rule that keeps three layers from becoming three truths: only the code carries a field list.** The map summarises and cites; the vault explains and cites. A field list written anywhere but the code is a second copy with no compiler behind it, and it will be wrong before anyone notices — the failure this whole seat exists to prevent, reintroduced by the documentation meant to prevent it.

## In code as we go — the forward step

The map records what exists. This step decides what has to exist **before** a story is built, and it is the half that was missing until 28 Aug 2026:

> **An entity that crosses a tool seam gets its contract in shared typed code as part of the story that introduces it — not after, and not in the tool that happened to need it first.**

Applied:

1. **Working a scenario, ask the seam question of every entity: does anything outside this tool read or write it?** Crosses a seam → it belongs in the shared package. Stays inside one tool → it stays local, and the map still names it so the next tool finds it rather than reinventing it.
2. **A shared entity's contract lands with the story, and `build-prep` names the file it goes in.** A builder must never be the one deciding whether a type is shared — that decision is this seat's, taken at design time, written on the ticket.
3. **Two tools defining the same concept differently is a finding for `architecture`, not a third name.** Already true of the map (§1.4); it matters more once code is the truth, because the fork compiles.
4. **A change to a shared contract is a ticket** — it has consumers by definition, and the map plus every consumer moves with it.

Where the shared package lives — inside `lia-toy-box` for now, or its own repo from the start — is a build decision and a separate ticket. **What is not open is that the contract is code.**

## The seam that keeps it honest

**Code contracts stay authoritative.** `src/shared/toy-contract.ts`, `src/shared/account.ts` and their kin are the source of truth for implementation — the code wins, per the architecture docs. **The map names and connects; it never redefines.** An entry that describes a coded entity *cites the file* and stays at the conceptual level (what it is, who touches it, what connects to it). If the map and the code disagree, the code wins and the map gets fixed — same rule as everywhere else in this shop.

---

## 1. Working a scenario

For each scenario `scenario-builder` hands over (or any feature entering design):

1. **List every entity the walk touches** — the things with identity (a clip, an account, a chart, a release) — and **every variable** — the values that move (a stage, a version, a timestamp, a setting).
2. **For each, check the map first.** Exists → cite the entry (and note the new consumer on it). New → define it: one line of what it is, its variables with types/constraints, where it lives (which store, which side of the IPC boundary, server or local), and who reads/writes it.
3. **Draw the connections** — what produces it, what consumes it, which seam it crosses (toy ↔ shell, app ↔ account service, tool ↔ tool). The Connections discipline is atom 14's fields 3/4/7 applied product-wide.
4. **Flag the collisions loudly.** Two features defining the same concept differently is a finding for the lead engineer (`architecture`), not something to paper over with a third name.

## 2. What an entry looks like

> **`clip`** — one captured media file as dump sees it.
> Variables: `path` (local, absolute) · `capturedAt` (ISO) · `camera` (string, display name) · `sidecars` (list) …
> Lives: the toy's own store (local, never synced). Code: `src/toys/dump/shared/…`.
> Produced by: ingest. Consumed by: the library, undo, (future) the longitudinal story.
> Notes: sidecar pairing rules are the code's; see the file.

Short, citing, connective. The map is a directory, not a spec dump.

## 3. The map's own rules (seeded in the doc's header)

- Entries are **added once and cited thereafter** — a duplicate entry is a defect.
- Every entry names its **authoritative source** (a code file, a migration, a strategy doc) or is marked `conceptual — not yet built`.
- **Sensitive data is marked** (`personal`, `credential-adjacent`) — `security` reads the map to know where to look.
- Changes that alter a coded contract are **tickets, not map edits** — the map follows the code, never leads it silently.

## What this seat is not

- **Not the database schema.** Migrations and types are engineering artefacts; this is the shared conceptual layer above them.
- **Not a gate.** It informs every other seat; it blocks none of them. A gap found mid-build is a batched question, not a halt.
- **Not speculative.** Entities enter the map when a scenario or a build touches them, not because they might exist someday.
- **Not a fourth copy of the fields.** The three layers above are the whole model. A page, a README or a ticket that restates a field list is a defect, however convenient it was to write.

## Changelog

- **0.2.0 (2026-08-28, CQ + LIAB-1008)** — the three layers made explicit (shared typed code is the truth, Linear is the directory, the vault is the reasoning) with the only-code-carries-a-field-list rule that keeps them from becoming three truths. Adds the forward step: an entity crossing a tool seam gets its contract in shared code as part of the story that introduces it, with the seam question asked at design time so a builder never decides it. Answers the half of [LIAB-322](https://linear.app/lia-creative/issue/LIAB-322) that a map alone could not.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The central map, its Linear home, the code-wins seam, and the scenario-walking method.
