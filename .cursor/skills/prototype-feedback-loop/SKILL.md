---
name: prototype-feedback-loop
slug: prototype-feedback-loop
description: "Turn a founder's video walkthrough of a prototype into a structured, linkable record — the stage-appropriate gate first, then the distilled doc that splits build-this-straight from needs-a-jam, chapter marks from the srt, and the frame-attached tickets when the round calls for them. Use when a founder records feedback on a build or design and the reaction needs to become something the team can act on."
version: 0.6.0
created: 2026-07-07
updated: 2026-08-27
status: active
triggers:
  - "/prototype-feedback-loop"
  - "distill this feedback video"
  - "video walkthrough feedback"
  - "I recorded feedback on every screen"
  - "turn my feedback video into tickets"
  - "feedback loop for this prototype"
companions:
  - toy-feedback-ingest
  - product-retro
  - ticket-builder
  - backlog-grooming
  - wrap-up
maintainer: cq
---

# Prototype feedback loop — the read side of the build

**What this is.** The standing way a founder's screen-by-screen video reaction to a live prototype becomes a structured, searchable, actionable record. Founders review builds by talking through the screen, not by writing; that is the fast path for capture, but raw video is not searchable, cannot be cited from a ticket, and does not separate *build this straight* from *we need to jam on this first*. This is the distillation step that makes the fast format usable by everyone else.

**Where it sits.** This is the **read** side of the loop. `toy-feedback-ingest` is the toys-line intake built on top of it and loads the stage gate below before it extracts anything. Anything that becomes work goes out through `ticket-builder` and the writer seats; anything that lands as a decision goes through `toy-jam`.

---

## 1. Stage-appropriate feedback — read this before reviewing anything

**This gate sits above the loop.** If the artefact is structure-stage, the ticket-oriented steps below do not apply.

**The rule: match the feedback to the stage of the artefact.** A detail-completeness review of a structure-stage design is noise, and it has cost real time — it is a live cause of a product being redesigned repeatedly.

**How to tell you are looking at a structure-stage artefact.** The founder usually says so in the opening seconds. Listen for: *"I'm trying to create the limitations and the structure to then get the details right"* · *"this doesn't cover every scenario"* · *"I pulled a lot of detail out because I want feedback on what to add back in"* · *"ruthless simplicity"* · lo-fi or wireframe framing. **In that case the missing detail is the method, not a gap.**

**What to give back:**

- Where the shape **contradicts itself**.
- Where **one element is doing two jobs**.
- Whether the **limitation the founder picked actually holds**.
- Nothing about missing features or uncovered scenarios.

**What not to do:**

- **Don't score it against a detail rubric.** Check what stage a rubric was written for before scoring anything against it.
- **Don't create tickets off it** — not even by asking "should I ticket these?", because the question sets the frame. Tickets during invention are backlog pressure on a shape that is not settled. If the founder asks for tickets in their own words, that is different.
- **Don't lead the record with what is missing.** Detail observations go in one clearly-marked parking lot at the bottom, labelled as not-asks, or nowhere at all.
- **Ask what shape of input is wanted** before producing any.

**Why this is a hard gate.** 2026-08-01: an agent scored a deliberately stripped-back structure wireframe against an 11-point detail rubric written for a hi-fi round, then turned two passing curiosities into tickets — both cancelled the next day. CQ: *"you're just adding more noise to a problem that we're obviously still trying to work through… ruthless simplicity is harder than smashing through features."* And on what good looks like: *"the value you provide is a yes and, not a here's all the shit you missed."* The toy thesis is limitation-first; a stripped-back wireframe is that thesis applied to a screen. Read it that way.

## 2. The loop

1. **Founder records.** A screen-by-screen walkthrough of the current build, narrated in the moment — reactions, not a script. Ask them to say up front (a) the overall read and (b) which parts will need massaging versus can be built straight. That framing carries the whole doc.
2. **Transcript in.** Plain-text `.md`, and a timestamped `.srt` when the tool produces one. **The `.srt` is load-bearing** — it is what makes chapter marks and frame timestamps possible. Ask for it if only the `.md` arrives.
3. **Distil into the product's record.** For a toy, `toy-feedback-ingest` owns the filing; for any other product, `Products/[Product]/Context/prototype-feedback-[YYYY-MM-DD].md`. Structure:
   - Frontmatter: `type: source`, `author:` (whoever recorded), `captured_by:`, `sources:` pointing at the transcript files and the video URL.
   - **Overall read** — the founder's own framing, lightly tightened, never reworded into something they did not say.
   - **Section by section**, matching the screens their narration naturally falls into. Don't impose a different structure.
   - **Open items needing a jam**, split out from items that read as a direct build. **This split is the single most useful thing the doc does** for whoever picks up the work next. Don't skip it, and don't guess a bucket the founder did not name — ask.
   - **Related** — the transcripts, the video, the product README, any thread this answers.
4. **Chapter marks from the `.srt`.** Grep it for the first line of each section's opening sentence to get its timestamp; don't eyeball a long paste. Use the marks for a footnote in the doc and, when the recording is being posted, a drafted description (chapters, one line each, pointing back at the written doc).
5. **File the raw transcripts beside the doc**, named to match, and fix every path that referenced their old home.
6. **Housekeeping** — the product README's doc map, `_meta/index.md`, `_meta/log.md`.
7. **Retro** — one entry per `product-retro`, named `feedback round N` so it is findable among the build entries.
8. **Hand back** — a short summary, the drafted description if there is a video, and the open items the founder still owns.

## 3. Video-first variant — frame-attached tickets

When the input is a **raw video file** with no transcript, and the output should be build tickets. Treat this as the default whenever a founder hands over a video path instead of a transcript.

1. **Transcribe locally.** `ffmpeg` plus `openai-whisper`, once per machine:
   ```bash
   ffmpeg -nostdin -y -i "recording.mp4" -ar 16000 -ac 1 audio.wav
   whisper audio.wav --model small.en --language en --output_dir out --output_format all
   ```
   `small.en` is the accuracy/speed sweet spot — a 31-minute video runs in a few minutes on Apple Silicon.
2. **Sanity-check the transcript against the frames.** Whisper mishears product terms. When a term drives a ticket, confirm it against a frame or the codebase before it lands in a title. (Chris's voice also mis-transcribes "Lia" as "Leah" or "Lear" — fix it on sight.)
3. **File and distil as in section 2.**
4. **Tickets, one per surface or theme, each with the frame attached.** Pull the frame at the timestamp where the founder discusses the item, so the building agent has the visual without opening the video:
   ```bash
   ffmpeg -nostdin -y -ss 00:12:34 -i "recording.mp4" -frames:v 1 -q:v 3 frame.jpg
   ```
   Timestamps come from grepping the `.srt` for the item's opening phrase. Attach through the Linear MCP upload flow — `prepare_attachment_upload`, then `curl -X PUT --data-binary` with the signed headers verbatim (60-second window, one file at a time), then `create_attachment_from_upload`. Title each attachment `Video frame M:SS — what it shows`. More than one frame per ticket is fine when the item spans sections.
5. **Ticket shape is `ticket-builder`'s, not this skill's.** What is specific here: the description quotes the founder's own words, cites the video timestamp, and references the prior round's ticket it iterates. A founder saying *"we need a ticket for a brainstorm about X"* gets a jam ticket (label `Research`) — explicitly not a build ticket.
6. **Preserve before building.** Snapshot the current build before the next round starts on it — a `snapshot/vN-[date]` branch and its own deployment — so the state the founder reviewed still exists after the next merge.

## 4. What this seat is not

- **Not the toys intake.** On the toys line, `toy-feedback-ingest` runs the filing, the per-toy summaries and the auto-ticketed bugs; it reads section 1 from here rather than restating it.
- **Not a review of built work against its criteria.** That is `review-and-merge`, by AC index, on a PR.
- **Not the writer.** Feedback that becomes scope goes to `story-writer` and `acceptance-criteria` through `epic-builder`; it does not become criteria by being said on a video.

## Related seats

- `toy-feedback-ingest` — the toys-line intake that sits on top of this.
- `toy-jam` — where "needs a jam" items go, and how the decisions come back.
- `ticket-builder` — the shape of anything this produces on the board.
- `backlog-grooming` — the sweep after a round dumps a batch of tickets.
- `product-retro` — the entry every round appends.

## Changelog

- **0.6.0 (2026-08-27, LIAB-997)** — lands in the plugin. Stage gate promoted to section 1 where `toy-feedback-ingest` reads it; vault `_meta/skills/` pointers replaced with the seats that carry the work; filing routed to `toy-feedback-ingest` for toys; ticket shape deferred to `ticket-builder` instead of restating a per-product convention.
- **0.5.0 (2026-08-01, CQ)** — the stage-appropriate-feedback gate, after a structure-stage wireframe was scored against a hi-fi rubric.
- **0.4.0 (2026-07-08, Luke)** — the video-first variant: local transcription, frame grabs attached to tickets, preserve-before-building.
- **0.1.0 (2026-07-07, CQ)** — the loop itself, from the first prototype round.
