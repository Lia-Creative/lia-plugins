---
name: wrap-up
slug: wrap-up
description: "Land a working session — finish or deliberately park loose ends, write the pick-up-here handover (one ACTIVE per thread), append the retro, do the housekeeping; the pickup side reads the ACTIVE handover before any work resumes. Use at end of day, on 'wrap up', or when closing out a session with work carrying forward."
version: 1.2.3
created: 2026-07-25
updated: 2026-08-27
status: active
triggers:
  - "/wrap-up"
  - "wrap up"
  - "wrap it up"
  - "finish up for the day"
  - "that's a wrap"
  - "done for today"
  - "close out the session"
  - "handover"
  - "write the handover"
  - "pick up [project]"
  - "where did we leave off"
  - "what's the latest on [project]"
  - "continue the work on [project]"
companions:
  - product-retro
  - execution-discipline
  - ticket-builder
  - prototype-feedback-loop
maintainer: cq
---

# Wrap up — finish the day properly, and the first read of the next one

**What this is.** One consistent way to wrap up the work and finish for the day — and to pick it back up — decided by CQ 2026-07-25 (via widget; renamed from `handover` to `wrap-up` the same day: **the ritual is the wrap-up, the doc it writes is still a handover**). `/wrap-up` is the close-out command: it lands the session — quick loose ends finished, half-done work parked deliberately — then writes the pick-up-here handover doc, appends the product retro entry, and does the housekeeping. One command, full stop on the day, nothing lingering. The pickup side is the mirror rule: **before non-trivial work on a product or area, read its active handover first.** Together they mean no session starts from memory and no session ends without a trail.

**Why it exists.** By July 2026 the vault held 25+ handover docs in four naming patterns (`handover-<date>-<slug>`, `session-handover-<date>`, `<slug>-handover-<date>`, bare `HANDOVER.md`), scattered across product roots, Context folders, `_meta/ops/`, and an Inbox pile that had to be swept to `_archive/2026-06-21-inbox-handovers/`. Several were marked "ACTIVE PICKUP POINT" and then went stale because nothing ever superseded them. The format that worked — orientation line, decisions with their why, open questions marked as open, next steps in order, watch-outs — emerged organically in File Runner's 2026-07-13 handover. This skill codifies that shape and kills the drift.

---

## The rules at a glance

1. **Location:** every work home gets one `handovers/` subfolder, sitting **next to that home's retro-log**.
2. **Naming:** `handover-YYYY-MM-DD-<thread-slug>.md` — lowercase-with-hyphens, date = day written, slug names the thread of work. (The doc keeps the handover name — it's written for the next agent; `wrap-up` names the ritual that produces it.)
3. **One dated doc per close-out** — never one growing file. The retro-log is the growing chronicle; a handover is a snapshot of *current state*, and old state is noise there.
4. **Status vocabulary: `active` · `superseded` · `complete` (`complete` added 2026-08-19, Dan's call).** `active` = the pickup point for its thread. `superseded` = replaced by a named successor, and it **must** carry `superseded_by:`. **`complete` = the thread finished rather than being replaced** — the work is done and nothing succeeds it, so there is no `superseded_by:` to give. Before `complete` existed, a finished thread had no honest value and got left `active`, which advertised dead work as a live pickup point; the 2026-08-19 sweep found ~50 files in that state. **Never mark something `superseded` without a successor just to get it out of `active` — that is what `complete` is for.** Preserve any prose the old status carried in `state_note:`.
5. **One ACTIVE handover per thread.** The `thread:` frontmatter field is the match key. A new handover flips the previous one on its thread to `status: superseded` with a pointer forward, so pickup always reads exactly one doc per thread.
6. **Same day, same thread: extend** the existing handover instead of opening a second file — bump `updated:`, rewrite the orientation line.

### Where the `handovers/` folder lives

| Work home | Folder |
|---|---|
| Standard-shape product (`Context/Outputs/Resources`) | `Products/<Product>/Context/handovers/` |
| Shape-deviant product (retro-log at root, e.g. Musician OS) | `Products/<Product>/handovers/` |
| An Operations initiative | `Operations/<Area>/handovers/` |
| Company strategy work | `Company/Strategy/handovers/` |
| A vault skill or pipeline | `_meta/skills/<skill-slug>/handovers/` |
| Vault infra / cross-cutting ops | `_meta/ops/handovers/` |

Rule of thumb: the folder you'd file the work's *outputs* in gets the subfolder. One subfolder per work home — never a central vault-wide pile, and a handover's final home is never an Inbox.

---

## Offering it (decided 2026-07-25)

When the founder signals wrap-up ("that's a wrap", "done for today") and meaningful state carries forward — a decision in flight, an open thread, a next step — offer `/wrap-up` **once**, in one line. Don't run it unbidden, don't nag. If declined, the retro entry still happens. A session where nothing carries forward (trivial lookups, pure Q&A) doesn't need one.

## CLOSE — running `/wrap-up`

Run this when the founder invokes `/wrap-up` or asks to wrap the session / finish for the day. Unattended runs (scheduled tasks, pipelines) load `execution-discipline` first, per its own rule; an interactive founder-driven close doesn't need it.

1. **Land the session.** Name the thread(s) this session actually ran — usually one. Finish any loose end that takes a few minutes (a half-saved file, an unsent deliverable, a comment half-written); everything bigger gets parked *deliberately* in the handover rather than left dangling. Leave no surface broken — vault consistent, files saved, nothing mid-edit. A session that touched two genuinely separate homes writes one handover per home.
2. **Resolve the home** from the table above. Torn between two homes? Pick where the work's outputs live. Still unsure? Ask the founder — short widget where the surface supports it, plain question otherwise, with 2–3 candidates and your recommendation. Don't guess.
3. **Draft from the template** (`templates/handover-template.md`). Hold the bar the File Runner 2026-07-13 doc set:
   - The orientation line carries the whole doc: where things stand + the next session's job. Write it last.
   - **Decisions carry their why.** A call without its reason gets re-litigated next session. If a call's why never got captured, write "rationale not captured in-session" — never invent one.
   - **The trail is links, not prose** — file paths, ticket IDs, URLs (ticket-builder ethos).
   - **Open threads run in dependency order** — item 1 is the first unblocked action; name the gate on anything blocked. Open questions are marked **"not decided — don't treat as settled."**
   - **Watch-outs are the gift to the next agent** — drifted ticket IDs, sync races, superseded framings, auth quirks. If this session got bitten, say where. An item lives once: actionable → open thread, hazard → watch-out (the retro's Friction field may echo it — different audience, that's fine).
   - Reads in ~2 minutes. Overflow is usually durable knowledge that belongs in a Wiki page or canonical doc — write it there and link it from the trail.
4. **Supersede sweep.** In the target `handovers/` folder, find any still-`active` handover with the same `thread:`. Set `status: superseded`, add `superseded_by: <new filename>` (bare filename), and drop a banner directly under its H1, above its old orientation line (which stays): `> Superseded by [[<new file>]] — read that instead.` The new file records `supersedes: <old filename>`. Threads this handover absorbs get the same flip. **This is also when legacy migration happens:** loose `handover-*.md` files in this home (pre-2026-07-25 patterns) move into `handovers/` now — update their index rows, log the moves.
5. **Retro entries** per `product-retro` — mandatory for any product-touching session regardless of the handover; append at the file's end. The retro entry is the lessons chronicle; the handover's Lessons section can simply point at it.
6. **Housekeeping.** Add the new file to `_meta/index.md` with an "ACTIVE handover — pickup here" description; re-point the superseded file's row so the index never advertises a stale pickup point; sweep in anything else this session created or materially changed that the index doesn't reflect. Append to `_meta/log.md`. If the state affects Dan's or Luke's lane, say so in the log entry — courtesy flag, not gate.
7. **Board truth.** If the session touched Linear, leave statuses and comments reflecting reality (ticket-builder wrap-up rules); never invent statuses. Linear unreachable? Record the intended updates as a watch-out in the handover plus a line in the log — the next pickup verifies.
8. **Close out loud.** Give the founder the file path, a few-line summary, and the open-thread count (the numbered list's length). That's the full stop — the day is finished.

## PICKUP — before working on anything

1. **Trigger:** about to do non-trivial work on a product or area — or the founder says "pick up X", "continue X", "where did we leave off".
2. **Read the active handover** in that home's `handovers/` folder (resolve the home the same way CLOSE does; `_meta/index.md` knows the paths) — fully, not skimmed, trusting file frontmatter over index labels. A home can hold several actives (parallel threads): read the newest first, and when the founder's ask spans more than one, say which threads exist and confirm the target. Then skim the retro-log tail (last 2–3 entries) — retro entries may postdate the handover; on contradiction the newer artefact wins, and fixing the stale one joins your session's work. No `handovers/` folder, or only superseded files? Follow `superseded_by` pointers to the newest doc, check for loose legacy `handover-*.md` in the home, then the README and retro-log — and say you're working from partial context.
3. **Verify before acting.** Ticket IDs, statuses, and paths drift between sessions (the 2026-07-13 File Runner handover had to warn that LIA-xxx ids had become LIAB-xxx). Read the `relates:` docs the open threads depend on; existence-check the rest. Board unreachable? Proceed with stated caveats and verify before any ticket writes.
4. **Open out loud:** start your reply with "Picking up from `handover-<date>-<slug>` — next step is <the first unblocked action>", then caveats and verification results in the same reply. Surface the handover's open questions as still-open — pickup is exactly where an open question gets mistaken for a decision.
5. **Drift repair.** Two actives on one thread means a past close-out missed the sweep: newest wins — flip the others, fix their index rows, note it in the log.

---

## The template

Canonical: `templates/handover-template.md` — the file wins if this summary drifts. The shape:

```markdown
---
title: "Handover — <thread>: <one-phrase state>"
type: handover
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: <cq | dan | luke>
captured_by: <e.g. cq-cowork, dan-code, luke-claude-code>
thread: <thread-slug>
supersedes: <previous filename, or "none — first on this thread">
relates: ["[[key-doc]]", "LIAB-000"]
tags: [handover, <project-slug>]
---

# Handover YYYY-MM-DD — <thread>: <one-phrase state>

> <One line: where things stand + the next session's job. Write it last.>

## What happened
## Decisions            (| Decision | Call | Why |)
## The trail            (paths · ticket IDs · URLs)
## Open threads — next agent, in order   (+ open questions flagged not-settled)
## Watch-outs
## Lessons & observations   (or delete and let the retro entry carry it)
```

`relates:` carries the 2–4 key anchors (for graph and search); The trail carries the full human-readable list. Sections with nothing real in them get deleted, not padded. `author`/`captured_by` follow the vault's attribution convention.

---

## Guardrails

- **Sensitivity.** Lia Vault is a shared surface. No personal Tier-3+/healing material, no Endava client content (the firewall is one-way), no secret values — in any handover here, ever.
- **Propose-first zones.** Founder-driven sessions may write `handovers/` folders in `Company/` and `Operations/Processes/` directly (founders agree by pushing). Unattended runs stage to their rolling queues or `Inbox/` instead.
- **Not a doc dump.** Durable knowledge goes to `Wiki/` or the canonical doc and gets linked; the handover stays a snapshot.

## Legacy

**Migration complete 2026-08-19 — there are no loose handovers left.** All 67 legacy files (every pre-2026-07-25 naming pattern: `handover-<date>-<slug>`, `<slug>-handover-<date>`, `session-handover-<date>`, bare `HANDOVER.md`) were swept into their work home's `handovers/` folder, and all 93 now carry a `thread:`. The opportunistic "migrate when next touched" rule below is therefore spent — kept as the record of how it worked. **Two exceptions that are correctly filed and must not be swept:** anything under `Products/Lia Toys/**/00 handover/` (the toy line's own numbered-lifecycle shape) and `_meta/cowork-history/` (append-only session archive). Original wording: handovers written before 2026-07-25 sat loose in Context folders, product roots and `_meta/ops/`; they stayed valid where they were until their thread was next touched — then they migrated into the home's `handovers/` subfolder as part of the supersede sweep (CLOSE step 4), with index rows updated and moves logged. `Products/File Runner/Context/handovers/` is the worked example — migrated and status-normalised 2026-07-25. (This skill itself shipped as `handover` and was renamed `wrap-up` the same day; older log entries reference `_meta/skills/handover/`, which is this folder.)

## Related

- `product-retro` — in this plugin — the per-session chronicle this composes with (retro = what we learned over time; handover = where things stand now)
- `execution-discipline` — in this plugin — load first for unattended runs
- `ticket-builder` — in this plugin (canonical since 26 Aug 2026) — wrap-up rules; board truth
- `Products/File Runner/Context/handovers/` — the worked example, including the supersede chain
- Chris's Cowork account carries a synced copy of this skill (`/wrap-up`) so it triggers outside vault-mounted sessions. **This file — in the lia-tools plugin — is canonical since 26 Aug 2026** ([LIAB-919](https://linear.app/lia-creative/issue/LIAB-919)); if you change it, refresh the account copy (the vault copy is frozen pending [LIAB-924](https://linear.app/lia-creative/issue/LIAB-924)).

## Changelog

- **1.2.3 (2026-08-27, LIAB-997)** — `product-retro` and `execution-discipline` stop being named as absent: both are in the plugin now, and §Related says so.
- **1.2.2 (2026-08-26, LIAB-959)** — the three `<project>` placeholders in `triggers:` become `[project]`, per the frontmatter rule that came out of the Cowork install failure. First entry here: this skill reached the plugin without a changelog, so earlier versions are unrecorded.
