---
name: architecture
slug: architecture
description: "Keep architecture honest — docs follow code promptly (code wins), patterns stay singular, standards hold under deadline; breaches become Decision tickets, never quiet exceptions. Use when a merge changes what a strategy doc says, a pattern forks, or a build pushes on a bright line."
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/architecture"
  - "keep the architecture honest"
  - "does this fit the architecture"
  - "update the architecture docs"
  - "is this pattern right"
companions:
  - lead-engineer
  - schema-manager
  - build-prep
maintainer: cq
---

# Architecture — the docs current, the patterns clean, the standards high

**What this is.** The lead engineer's architecture duty as a skill: keep the architecture documentation true to what's built, keep patterns from forking, and hold the standards line when a build pushes on it.

**Why it exists.** CQ, 26 Aug 2026. Architecture documentation is a **Foundation** (25 Aug register) — dispatched agents build *from* the strategy docs before reading a line of code, so a wrong doc does foundational damage. And **a document that lies is a bug** (the shape doc's own rule): the next reader acts on it.

**The canon this seat guards (per repo):** in `lia-toy-box`, the three strategy docs (`toy-contract` / `shell-architecture` / `toy-data-model`) with the standing rule that **the contract as code — `src/shared/toy-contract.ts` — is the source of truth; if code and doc drift, the code wins and the doc gets updated.** In `lia-tools`, the CLAUDE.md's account-service facts, read off the running project. Product-wide, the [schema map](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b) — `schema-manager` maintains it; this seat rules on the collisions it flags.

---

## The three duties

1. **Docs follow code, promptly.** When a merge changes what a strategy doc describes, the doc update is part of the epic's scope — the lead engineer holds the merge's ticket open until the doc is true (or a ticket carries it, like LIAB-931). A doc updated "later" is a doc that lies for the interim.
2. **Patterns stay singular.** Two implementations of one idea is a finding: name the canonical one, ticket the migration of the other, and put the pattern in the build-prep notes so the next builder extends instead of inventing. The bright lines are non-negotiable — toy boundaries (no `electron`/Node/raw IPC in a toy's renderer; scope injected, never a toy id in an API; the shell never names a toy), server-only values behind `server-env.ts`, tokens by reference.
3. **Standards hold under deadline.** A build that wants to breach a bright line gets a ruling, not a shrug: either the line holds and the build adapts, or the line genuinely needs to move — which is a **Decision ticket and a register entry**, never a quiet exception. Quiet exceptions are how a standard stops existing.

## What this seat is not

- **Not a rewrite licence.** Ruling on patterns is not refactoring the codebase; improvements are tickets with the admission test applied.
- **Not the schema map's editor** — `schema-manager` maintains it; this seat arbitrates when entries collide.
- **Not taste.** A ruling cites a doc, a contract, or a measured cost. "I'd have done it differently" is not architecture.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. Docs-follow-code, patterns-stay-singular, standards-hold — with the code-wins rule and the bright lines cited rather than restated.
