---
name: toys-digest
description: >-
  Draft the weekly toys movement post for the #toys Slack channel: what
  shipped, what moved on the board, what feedback landed, what's waiting on
  a founder. Draft-first, always — this skill never posts to a channel;
  Chris reviews and sends. Runs on a Monday-morning schedule and on demand
  when Chris says "toys digest", "draft the toys update", "what happened
  with the toys this week", or "catch the channel up".
version: 0.1.0
created: 2026-08-17
updated: 2026-08-17
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
companions: [toy-status, toy-tidy, toy-feedback-ingest]
---

# Toys digest — the weekly #toys draft

**What this is.** The #toys channel already gets Linear's ticket noise. This is the human-readable weekly line on top of it: seven days of movement across the toy line, in one short post, drafted for Chris to send.

**Load `_meta/skills/execution-discipline/SKILL.md` first.** The standing Slack rule is absolute here: **never post to a channel without Chris seeing the draft.** Scheduled runs draft and stop.

## The window

The last 7 days (or since the previous digest if Chris names a gap). Everything reported must trace to a live source — the digest is downstream of `toy-status`'s discipline: no invented statuses, honest gaps.

## Gather

1. **Board movement** — Lia Toys project, live: tickets moved to Review or Done this week, new tickets from feedback rounds, promotions run (and their register rows).
2. **Feedback that landed** — new `meetings/` notes and `04 build/feedback/` summaries this week: one line each, with the video link.
3. **Waiting on a founder** — tickets sitting in Review, promotion gates needing a call on the ticket, jam items that aged past two weeks. This is usually the most useful section.
4. **Vault movement** — `_meta/log.md` toys entries this week, anything structural (new toy, convention change).

A quiet week is a fine digest: two lines saying so beat padding.

## The draft

Per the house Slack shape: **short summary in channel, detail in thread, no emoji.** The channel message is 3–6 lines — one per toy that moved plus the waiting-on-you line. The thread reply carries the detail: links to meeting notes, tickets by ID, register rows.

Write it plainly — it's an internal ops note, not brand copy. Chris's voice rules apply only if he asks for the post in his voice.

Deliver as a Slack draft when the tooling allows (draft message to the #toys channel), otherwise paste-ready blocks in chat: channel message first, thread detail second. Then stop — sending is his.

## Scheduled runs

The schedule fires Monday 8am Sydney. A scheduled run behaves identically but assumes Chris is not watching: it prepares the draft, delivers it, and never waits on questions — anything ambiguous gets flagged inside the draft rather than asked. If the vault or board is unreachable from the scheduled session, report that and stop; a digest built from memory is worse than a missed week.

Nothing is written to the vault except when a digest surfaces drift worth recording — then one line in `_meta/log.md` and a pointer at `toy-tidy`.
