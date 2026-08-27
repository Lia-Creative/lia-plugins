---
name: file-management
slug: file-management
description: "The seat for building anything that moves, renames, files or reorganises a person's own files — the ten bright lines that hold across every story, the person-outranks-the-tool rule, and trust as a build requirement rather than a marketing claim. Use when a story touches someone's files on disk, when a safety rule is being weighed against a deadline, or when picking up work in the file-management category."
version: 0.2.0
created: 2026-08-28
updated: 2026-08-28
status: active
triggers:
  - "/file-management"
  - "moving someone's files"
  - "is this safe to build"
  - "the file safety rules"
  - "picking up file management"
companions:
  - architecture
  - schema-manager
  - build-prep
  - acceptance-criteria
maintainer: cq
---

# File management — the rules that hold whatever the story is

**What this is.** The seat you take when building anything that moves, copies, renames, files or reorganises **a person's own files on their own disk**. It carries the bright lines that are not re-decided per story, the rule about whose decision wins, and what a build has to prove before it ships.

**Why it exists.** CQ, 28 Aug 2026, on the tools rename: file management is a **category**, not a product name — which is why File Runner and dump are the same tool. The discipline that governs the category was earned across 2,800 real files and three adventure chats, and it currently lives in a PRD, a strategy doc and a retro log **inside a vault build machines cannot mount**. That is the same argument that moved canonical out of the vault under [LIAB-919](https://linear.app/lia-creative/issue/LIAB-919): rules that a builder cannot reach are rules that do not apply.

**The split this seat holds.** *Rules travel; evidence is cited.* The bright lines below are here in full, because a build agent needs them and they are short. The problems, scenarios and entities behind them are **pointed at, never copied** — they change, and a copy in a skill is a copy that lies.

---

## The ten bright lines

Non-negotiable across every story in the category. A story that needs one relaxed is a **Decision ticket and a register entry** — `architecture` duty 3 — never a quiet exception in a build.

| | The line |
|---|---|
| 1 | **Never overwrite.** Two files wanting one name is *reported*, both left intact. |
| 2 | **Never delete.** Anything displaced moves somewhere obvious and the person is told where. |
| 3 | **The record of what is about to happen is written before the first file moves.** Pull the power mid-run and the whole plan plus what got done is still on disk. |
| 4 | **Across drives: copy, verify the copy, then remove the original.** Never move-then-hope. |
| 5 | **Every run is undoable** — and **undo never overrides a later human decision.** A file the person has since moved or renamed themselves is left alone and reported. |
| 6 | **Nothing fails silently and nothing is skipped silently.** A file that cannot be dated or identified still gets filed, into a plainly named unknown bucket, and is reported. |
| 7 | **A missing drive is a named, visible state** — not a silent skip, not a crash, and never a quiet fallback to somewhere else. |
| 8 | **Running it again finds nothing left to do.** Applying the same plan twice duplicates nothing. |
| 9 | **The record lives with the files, not in the app** — so it survives a reinstall and travels when the library moves. |
| 10 | **Infer freely, apply nothing silently.** Show the inference, say how confident it is, let the person correct it *before* anything moves. |

Source of record: dump's requirement groups 5, 6 and 7 (never overwrite, never delete, record-first, copy-verify-remove, undo, halt-on-failure) and the folder-templates evidence for line 10. Both are cited in `04 build/` and `02 analysis/` of the file-management tool, under `Products/Lia Tools/tools/`. The **problems and scenarios** behind them are at the line's `02 discovery/`.

## The person outranks the tool

The single rule underneath half the lines above, and the one most likely to be lost in a refactor:

> **A name or a decision a person made themselves survives everything the tool does next.** A folder they named stays named. A camera name they set is not overwritten by an app update. A file they moved by hand is not dragged back by an undo.

When a story's behaviour and a person's earlier decision collide, the person wins and the tool reports. There is no case where the tool is right and quiet.

## Trust is a build requirement here, not a marketing line

Two of the category's own problems are about trust rather than mechanics: working shooters who will not hand originals to software they cannot verify, and the fact that the highest-stakes moment in the whole workflow — *is it safe to format this card* — has no mechanical answer today, only a human squint.

The consequence for a build: **the verifiable half is the feature.** A run that worked but cannot be shown to have worked has not met the bar. That is why lines 3, 5 and 9 exist as *product* requirements and not as engineering hygiene — the record is the thing a person checks before they wipe a card.

## Before you build in this category

Read, in this order, and cite what you use:

1. **The problems register** and **the scenarios** in the tools line's discovery backbone. They are sourced from adventure chats with real people; every one carries who said it. Do not re-derive the problem from the PRD.
2. **The schema map** — [Schema map — lia.tools](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b) — for the entities this touches, and `schema-manager` if the story introduces one. Entities in this category cross tool seams constantly; a clip that means two things in two tools is the failure this category cannot afford.
3. **The tool's own analysis and build notes** for what has already been settled.

Then `build-prep` writes the how, `acceptance-criteria` freezes the what, and the bright lines above become **named Delivery checks on the story** — not assumed, and not left for review to remember.

## What this seat is not

- **Not the PRD.** Requirements live in Linear; this is the discipline they are written against.
- **Not a general file-utility library.** These lines are about *someone else's irreplaceable files*. A tool moving its own cache owes none of this.
- **Not permission to relax a line because a story is small.** The lines cost the least when they are cheapest to add, which is always before the first move is written.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1020)** — the restructure landed, so the source-of-record paths stop hedging and name where the evidence actually is. The line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.- **0.1.0 (2026-08-28, CQ + LIAB-1008)** — first version. The ten bright lines lifted from dump's requirement groups 5–7 and the folder-templates evidence, the person-outranks-the-tool rule, and trust framed as a build requirement. Rules travel in full; problems, scenarios and entities are cited rather than copied, because the line is mid-restructure and a copied path would be stale on arrival.
