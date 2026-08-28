---
name: adventure-chat-ingest
description: >-
  Ingest one of Chris's adventure chats — a recorded conversation with a real
  person about who they are, their adventure, and how they actually work —
  into the discovery layer at Products/Lia Tools/02 discovery/. Input is a
  recording URL plus a transcript; output is a tidied transcript, a chat note,
  a created-or-updated adventurer profile, problem pages, scenario updates,
  insight candidates, and full housekeeping. Use when Chris says "ingest this
  adventure chat", "adventure chat with X", "log my chat with X",
  "process the interview with X", or drops an unlisted URL + transcript of a
  conversation with a person (not a product walkthrough — that's
  toy-feedback-ingest). Person-first, not product-first: the unit of work is
  the human, and every downstream page cites the chat.
version: 0.3.0
created: 2026-08-19
updated: 2026-08-28
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-feedback-ingest, toy-pickup, execution-discipline, research-verify]
---

# Adventure chat ingest

**What this is.** The intake for Lia's discovery backbone. Chris records conversations with real people — collaborators, users, people from the cast's world — that run story first (*who they are, where they've come from, where they are, where they're going*), workflow second. This skill turns one recording into durable, sourced product context across the five discovery layers at `Products/Lia Tools/02 discovery/`.

The theory it serves: our customers are our adventurers; Lia = solving people's problems, which gets them back to their adventure. The chat is where the problems come from.

**Load `execution-discipline` first** (in this plugin), as with any Lia skill run. Never invent paths, ticket IDs, or things a person didn't say.

## Step 0 — Scope check

Two intakes exist and they route differently:

| The recording is... | Route |
|---|---|
| A conversation **with a person** about their adventure and how they work | **This skill.** |
| Chris walking through **a tool or the toolbox** (bugs, design, features) | `toy-feedback-ingest`. |

A chat that wanders into product feedback stays **one chat note here**; route the product-feedback moments per `toy-feedback-ingest`'s conventions (per-toy summary in `04 build/feedback/`, bugs proposed) and cross-link, rather than writing two competing records. If genuinely ambiguous, ask — one question, widget where possible.

Read `02 discovery/README.md` before the first run of a session — the standing rules (sourcing, no duplicates, adventure-not-private-life, internal-by-default) govern everything below.

## Step 1 — Inputs

- **The URL.** Verify read-only: page loads, title matches, visibility unlisted. Never change a video setting. Not uploaded yet is fine — leave `url:` blank and flag it.
- **The transcript.** Timestamped `.srt` is the load-bearing format. Plain `.md` only → ask for the `.srt` before settling. No transcript at all → stop; a chat note can't be built from memory of a conversation you can't read.
- **Consent.** Find what was asked at the top of the recording and fill `consent_internal` / `consent_public_clips` to match. Not asked → record `not asked`, don't assume.

## Step 2 — Tidy the transcript

Per `_meta/internal-videos.md`: the Leah/Lear → **Lia** quirk (100% hit rate so far), toy names ("dump", "drip" mis-hear easily), other confident context fixes. Uncertain proper nouns stay as heard, flagged in the note's prose. Mark `transcript_status: tidied`; file as `YYYY-MM-DD-firstname-lastname-transcript.srt` beside the note.

## Step 3 — The chat note (podcast host)

From `01 adventure chats/_template-chat.md` → `01 adventure chats/YYYY-MM-DD-firstname-lastname.md`. Story in their telling order; walkthrough in the conversation's natural order; verbatim quotes with timestamps; the typed extraction (problems heard / scenario material / insight candidates / ideas / open threads). His and their framing, lightly tightened, never reworded into something they didn't say. Add the row to `01 adventure chats/README.md` §The chats.

## Step 4 — The adventurer profile (UX researcher)

Check the roster (`02 adventurers/README.md`) first.

- **First chat with this person** → create from `_template-adventurer.md`.
- **Returning person** → update the existing profile: every touched section, plus a chat-log row saying what changed. **Contradictions get updated openly** — change the claim, note it in the chat-log row, never leave two versions standing.

Fill the cast-echoes section against `Company/Strategy/who-we-serve/the-people.md`; a shape the cast doesn't carry is an insight candidate. **The adventure, not the private life:** sensitive personal disclosures stay off the profile.

## Step 5 — Problems (product manager)

For each problem heard, check `04 problems/README.md` §register first:

- **Existing problem** → add an evidence row (adventurer, words, timestamp) and update `adventurers:`/`sources:` frontmatter. Accumulation is the point.
- **New problem** → page from `_template-problem.md`, same shape every time, plus a register row.

Problem pages stay in problem space — hooks, not specs.

## Step 6 — Scenarios (analyst)

Workflow material that describes a sequence end to end feeds `05 scenarios/`: add a variation row (and evidence at the steps) to an existing scenario, or create one from `_template-scenario.md` if the chat mapped a genuinely new sequence. Update the coverage section honestly — one chat is n=1.

## Step 7 — Insights

Candidate patterns → entries (or evidence added to existing entries) in `03 insights/insights-ledger.md`, confidence per that folder's scale — one chat can never make an insight firm. Never push an insight into strategy docs from here; firm ones get proposed through the normal channels.

## Step 8 — Linear

**Nothing is created automatically.** Adventure chats are discovery, not bugs. If something is clearly actionable (a named candidate feature, a jam-worthy open thread), present a proposed tick-list in chat and mirror it on the chat note; create tickets only on approval, per the CLAUDE.md label rules. Bugs about a toy heard mid-chat follow `toy-feedback-ingest`'s bug convention instead.

## Step 9 — Housekeeping (not optional)

1. Register rows: chat index, adventurer roster, problem register, scenario register — whichever this run touched.
2. Row in `_meta/internal-videos.md` §Log.
3. `_meta/index.md` — the chat note + any new pages.
4. `_meta/log.md` — one `ingest` entry, **appended at the bottom of the file**.
5. Retro entry in the **line** retro-log (`Products/Lia Tools/00 handover/retro-log.md`) — discovery is line-level work. If the chat also produced per-toy feedback, that toy's retro-log gets its own entry per `toy-feedback-ingest`.

## Step 10 — Report back

Short: the chat note path, profile created/updated, problems created/fed, scenarios touched, insight candidates added, the proposed tick-list, and anything flagged rather than decided.

## When it goes sideways

- **No transcript** — stop (Step 1).
- **The person asked for something to stay off the record** — it stays off the record, everywhere, including the transcript if they asked mid-recording. Note the redaction exists; not what it was.
- **A chat contradicts vault canon** (a strategy doc, a locked decision) — flag it in the report; never silently overwrite. A real person's evidence against a hypothesis is exactly what discovery is for, and exactly what needs a founder's eyes.
- **The same person exists in another research track** (e.g. the dump interview set) — cross-link, don't merge. Scoped product interviews stay toy-local; the profile here links to them.

## Changelog

- **0.3.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.
- **0.2.0 (2026-08-28, LIAB-1006 + LIAB-963)** — where a chat wanders into product feedback, the hand-off names `04 build/feedback/`: the line gained a `03 design/` stage on 28 Aug and build moved up one. The `execution-discipline` load line names the sibling seat in this plugin rather than the retired vault `_meta/skills/` path. `02 discovery/`, the line-level home this skill writes into, is unaffected by the renumber. First entry here; earlier versions are unrecorded.
