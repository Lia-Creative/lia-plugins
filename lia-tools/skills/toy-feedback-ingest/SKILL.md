---
name: toy-feedback-ingest
description: >-
  Ingest one of Chris's toys feedback videos into the Lia Vault and Linear.
  Input is a youtu.be URL plus a transcript; output is a tidied transcript, a
  meeting note in the right meetings/ folder, per-toy feedback summaries in
  04 build/feedback/, bugs auto-ticketed to the toy's epic, and everything
  else proposed as a tick-list. Use when Chris says "ingest this video",
  "feedback video for the toys / for dump / for drip / for the toy box",
  "log the bugs and ideas from the video", "toys walkthrough", or drops an
  unlisted YouTube URL and transcript about toy work. Covers every video
  type he records: new ideas, scenario mapping, problem work, design
  feedback, bugs, feature feedback, process feedback. Toys mentioned
  generally files at the line level; a specific toy files into that toy's
  folder.
version: 0.1.2
created: 2026-08-16
updated: 2026-08-19
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-pickup, toy-release, ticket-builder, prototype-feedback-loop]
---

# Toy feedback ingest

**What this is.** The ingest half of the toys feedback loop. Chris tests toys the human way: he gets the build to a point worth reviewing, records a walkthrough, uploads it unlisted to the whoiscq channel, and hands over the URL and transcript. This skill turns that recording into durable, routed context — so the next feature gets planned with everything the video knew.

The upload half is his (with his personal `recording-description` skill drafting the title, description and chapters). This skill starts when the URL and transcript exist.

**Load `_meta/skills/execution-discipline/SKILL.md` first**, as with any Lia skill run. Never invent Linear ticket IDs, statuses, or vault paths — verify everything live.

## Step 0 — Scope the video

Read the first 30–40 lines of the transcript plus whatever Chris said in chat. Work out what the recording is *about*, then route:

| The video is about | The meeting note lands in |
|---|---|
| The toy line generally (strategy, process, several toys) | `Products/Lia Toys/meetings/` |
| The toy box shell | `Products/Lia Toys/toy box/meetings/` |
| One specific toy | `Products/Lia Toys/toys/<toy>/meetings/` |

One video → **one meeting note**, at the most general scope it genuinely spans. The per-toy feedback summaries (Step 5) do the specific work; don't duplicate the note per toy. Create the `meetings/` folder if it doesn't exist yet — it's part of the toy shape (CQ, 2026-08-16), unnumbered, sits alongside the numbered lifecycle folders.

If the scope is genuinely ambiguous, ask — one question, widget where possible.

## Step 1 — Inputs

- **The URL.** Verify it read-only before writing it anywhere: the watch page loads, the title matches the recording, visibility is unlisted. Never change any video setting.
- **The transcript.** A timestamped `.srt` is the load-bearing format — it's what makes chapter marks, ticket timestamps, and frame grabs possible. If only a plain `.md` shows up, ask for the `.srt` before settling for less. If there's no transcript at all but a local `.mp4` exists, transcribe per the whisper recipe in `prototype-feedback-loop` §3 (the video-first variant).
- **The local `.mp4`, if it still exists.** Note its path now — it's the source for frame grabs in Step 6, and it tends to get cleared to `_to_delete/` after upload.

## Step 2 — Tidy the transcript

Per the rules in `_meta/internal-videos.md`: fix the recurring mishears ("Leah" / "Lear" / "Leo" → **Lia**, confirmed on every recording so far; watch for toy names too — "dump", "drip" mis-hear easily), fix others you're confident about in context, leave genuinely uncertain proper nouns as heard and flag the inferred correction in the meeting note's prose. Mark `transcript_status: tidied`. The tidied `.srt` files beside the meeting note as `<slug>-transcript.srt`.

## Step 3 — The stage gate

**Before extracting anything, apply the stage-appropriate-feedback rule** from `prototype-feedback-loop` §1 — the gate above that loop, in this plugin. If the artefact under review is structure-stage (Chris says so, usually in the opening seconds — "ruthless simplicity", "I pulled the detail out", wireframe framing), then: shape feedback only, **no tickets**, no missing-detail inventory. The typed extraction below still happens, but everything routes to the proposed list, nothing auto.

A built toy being product-tested (which is the normal case for these videos) is not structure-stage — bugs on it are real bugs.

## Step 4 — The meeting note

The driving record. `<scope>/meetings/YYYY-MM-DD-<slug>.md`:

```yaml
---
title: <recording title, his lowercase format>
type: meeting
author: cq
captured_by: <agent id>
created: YYYY-MM-DD
toys: [dump]            # every toy the video touches; toy-box counts
video: true
visibility: internal
platform: youtube
url: https://youtu.be/...
transcript_status: tidied
sources: [<slug>-transcript.srt]
---
```

Body, in order:

1. **Overall read** — his own framing, lightly tightened, never reworded into something he didn't say.
2. **The walkthrough** — sections following his narration's natural order (don't impose a structure), each with its timestamp.
3. **Typed extraction** — only the sections the video actually contains: `## Bugs` · `## Ideas` · `## Scenarios` · `## Design feedback` · `## Feature feedback` · `## Process feedback` · `## Open items needing a jam`. Every item carries a timestamp and his words. The bugs/jam split matters most: don't guess which bucket something belongs in if he didn't say — ask.
4. **Proposed tickets** — the tick-list from Step 6, recorded here so the note is the audit trail.
5. **Related** — the video URL, the transcript, the toy README(s), the feedback summaries this note produced.

## Step 5 — Per-toy feedback summaries

For each toy the video gives product feedback on (design, bugs, features, build quality), write `toys/<toy>/04 build/feedback/YYYY-MM-DD-<slug>.md` — a **clear summary of the feedback on that toy**, nothing else. This is what a build agent reads before the next feature: what's working, what's broken, what he asked for, each item linking back to the meeting note and its timestamp. Create the `feedback/` folder on first use.

Substantial scenario-mapping content additionally becomes (or updates) a doc in the toy's `02 research/`. Ideas stay in the meeting note until Chris promotes them.

## Step 6 — Linear

**Bugs go straight to tickets.** For each item in `## Bugs` (unless the stage gate said otherwise):

- Team **Lia Build**, project **Lia Toys**, child of the toy's epic — verify the epic ID live (dump LIAB-608, drip LIAB-599, toy box LIAB-637 at time of writing; **check, never trust this list**).
- Title `Bug · <toy>: <symptom>`, label `Bug`, status Backlog, priority Medium.
- Description: his words quoted, the video timestamp, expected vs actual where stated.
- **Frame grab attached when the local `.mp4` exists**: `ffmpeg -nostdin -y -ss <HH:MM:SS> -i "<video>.mp4" -frames:v 1 -q:v 3 frame.jpg`, timestamp grepped from the `.srt`, uploaded via the Linear attachment flow (`prepare_attachment_upload` → `curl PUT` → `create_attachment_from_upload`).

**Everything else is proposed, not created.** Present ideas, features, improvements and jam-worthy items as one tick-list (chat + mirrored in the meeting note). On approval: `Feature`/`Improvement`/`idea` labels per the CLAUDE.md label rules; jam items become `Jam · <topic>` with label `Research`. Never mark any ticket Done — Review is the ceiling, and only when work was actually done.

## Step 7 — Housekeeping (not optional)

1. Row in `_meta/internal-videos.md` §Log.
2. `_meta/index.md` — the meeting note + each feedback summary.
3. `_meta/log.md` — one `ingest` entry, **appended at the bottom of the file** (corrected 2026-08-19, Dan-directed; was "newest-at-top" — top-inserting rewrites the whole file and loses whatever a concurrent session added since it loaded): what landed where, tickets created by ID, what was proposed.
4. Retro entry in the `00 handover/retro-log.md` of each toy that got a feedback summary (`### YYYY-MM-DD · feedback round · <video url>`). Shell feedback → toy box's log.

## Step 8 — Report back

Short: the meeting note path, the summaries written, tickets created (IDs), the proposed tick-list, and anything flagged rather than decided. If the video contradicted something already written in the vault (a locked decision, a strategy doc), that goes here too — flag it, never silently overwrite canon. Remember the six open strategy questions (pricing, layers, price band, store count, live-toy cap, permanence) are **not settled**; a video riffing on them updates nothing without a founder decision on the record.

## When it goes sideways

- **No transcript and no local video** — stop; the note can't be built from memory of a video you can't read.
- **URL won't verify** — write the note anyway, leave `url:` blank, flag it. A page with `video: true` and no URL is an unfinished job to come back to.
- **Epic missing for a toy** — don't invent one; propose creating it (or run `new-toy` if the whole toy has no home).
- **Two buckets both plausible for an item** — ask, don't guess. The bugs-vs-jam split is the most useful thing this doc does.

## Changelog

- **0.1.2 (2026-08-27, LIAB-997)** — the stage gate and the whisper recipe now point at `prototype-feedback-loop` in this plugin rather than the retired vault path. No change to the ingest itself. First entry here; earlier versions are unrecorded.
