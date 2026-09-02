---
name: architecture
slug: architecture
description: "Keep architecture honest — docs follow code promptly (code wins), patterns stay singular, standards hold under deadline, and a standard every tool inherits is filed as the line's rather than left inside whichever tool wrote it; breaches become Decision tickets, never quiet exceptions. Use when a merge changes what a strategy doc says, a pattern forks, a build pushes on a bright line, or a decision is being written into one tool that binds them all."
version: 0.2.1
created: 2026-08-26
updated: 2026-09-02
status: active
triggers:
  - "/architecture"
  - "keep the architecture honest"
  - "does this fit the architecture"
  - "update the architecture docs"
  - "is this pattern right"
companions:
  - engineering-lead
  - schema-manager
  - build-prep
  - file-management
maintainer: cq
---

# Architecture — the docs current, the patterns clean, the standards high

**What this is.** The engineering lead's architecture duty as a skill: keep the architecture documentation true to what's built, keep patterns from forking, and hold the standards line when a build pushes on it.

**Why it exists.** CQ, 26 Aug 2026. Architecture documentation is a **Foundation** (25 Aug register) — dispatched agents build *from* the strategy docs before reading a line of code, so a wrong doc does foundational damage. And **a document that lies is a bug** (the shape doc's own rule): the next reader acts on it.

**The canon this seat guards (per repo):** in `lia-toy-box`, the three strategy docs (`toy-contract` / `shell-architecture` / `toy-data-model`) with the standing rule that **the contract as code — `src/shared/toy-contract.ts` — is the source of truth; if code and doc drift, the code wins and the doc gets updated.** In `lia-tools`, the CLAUDE.md's account-service facts, read off the running project. Product-wide, the [schema map](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b) — `schema-manager` maintains it; this seat rules on the collisions it flags.

---

## The four duties

1. **Docs follow code, promptly.** When a merge changes what a strategy doc describes, the doc update is part of the epic's scope — the engineering lead holds the merge's ticket open until the doc is true (or a ticket carries it, like LIAB-931). A doc updated "later" is a doc that lies for the interim.
2. **Patterns stay singular.** Two implementations of one idea is a finding: name the canonical one, ticket the migration of the other, and put the pattern in the build-prep notes so the next builder extends instead of inventing. The bright lines are non-negotiable — toy boundaries (no `electron`/Node/raw IPC in a toy's renderer; scope injected, never a toy id in an API; the shell never names a toy), server-only values behind `server-env.ts`, tokens by reference.
3. **Standards hold under deadline.** A build that wants to breach a bright line gets a ruling, not a shrug: either the line holds and the build adapts, or the line genuinely needs to move — which is a **Decision ticket and a register entry**, never a quiet exception. Quiet exceptions are how a standard stops existing.
4. **A standard everything inherits is filed as the line's, not as one tool's.** See the inheritance test below.

## The inheritance test

Ask of any decision being written down:

> **Would every tool inherit this, or only the one being built?**

Inherited → it is a **line-level standard** and it is filed as one. Only this tool's → it stays with the tool.

**Why this is a duty and not a filing preference.** Measured 28 Aug 2026 during the tools restructure: of the nine documents sitting in the toolbox's own strategy folder, **eight failed the test** — the toy contract, the data model, sign-in and accounts, the error spec, versioning and environments, git and release conventions, signing and distribution, agent visual verification. Every tool inherits all eight. They were filed under the toolbox for one reason: it was built first. Only the shell architecture was genuinely the toolbox's own.

The cost is not tidiness. A standard filed inside one tool is a standard the **second** tool's builder never reads — so it gets re-derived, differently, and duty 2's fork appears with nobody having decided anything. **First-built is not the same as owns**, and the test is what separates them while the decision is still cheap to file correctly.

Two edges worth naming rather than guessing at:

- **Applies to two of five tools** — not a line standard yet. Say so on the ticket and revisit at the third. Premature promotion is its own cost.
- **The line's standards home is mid-restructure** (Chris, 28 Aug 2026). Until it lands, apply the *test* and record the verdict on the ticket; do not invent a path to file it at. `execution-discipline` §1 — never invent a path.

## What this seat is not

- **Not a rewrite licence.** Ruling on patterns is not refactoring the codebase; improvements are tickets with the admission test applied.
- **Not the schema map's editor** — `schema-manager` maintains it; this seat arbitrates when entries collide.
- **Not taste.** A ruling cites a doc, a contract, or a measured cost. "I'd have done it differently" is not architecture.

## Changelog

- **0.2.1 (2026-09-02, LIAB-1161)** — `lead-engineer` is `engineering-lead` — reference only: the seat's name now follows its discipline, like the other four leads. No rule changed.
- **0.2.0 (2026-08-28, CQ + LIAB-1008)** — a fourth duty: the inheritance test, earned on the measurement that eight of the toolbox's nine strategy documents are actually the line's. Names first-built-is-not-owns as the trap, the two-of-five edge as not-yet, and holds the filing verdict on the ticket while the standards home is mid-restructure rather than inventing a path for it.
- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. Docs-follow-code, patterns-stay-singular, standards-hold — with the code-wins rule and the bright lines cited rather than restated.
