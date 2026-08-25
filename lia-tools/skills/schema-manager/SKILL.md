---
name: schema-manager
slug: schema-manager
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
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
maintainer: cq
---

# Schema manager — the entities named once, mapped centrally

**What this is.** The seat that maps the core entities of a problem: it systematically works through a scenario, defines the variables it touches, and records them in the **central schema map** — one place naming all data moving around the product. This is the layer that lets tools and toys talk to each other: two toys that both touch "a clip" agree on what a clip is because the map says so.

**Why it exists.** CQ, 26 Aug 2026: *"incredibly important for building tools/toys that talk to each other… it will essentially manage a big schema map of all data moving around the product and inform all other parts of the process."* Without it, every feature re-derives its entities and the seams between tools become guesswork — and the seams are where pipelines fail.

**The map lives in Linear** — the *Schema map — lia.tools* document in the Lia Toys project — because every seat including a vault-less build agent must be able to read it. (Created with this skill; if it doesn't exist yet, create it from §3's shape and link it from the tool shop doc.)

## The seam that keeps it honest — read this first

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

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The central map, its Linear home, the code-wins seam, and the scenario-walking method.
