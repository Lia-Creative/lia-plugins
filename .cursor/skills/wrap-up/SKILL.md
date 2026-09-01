---
name: wrap-up
slug: wrap-up
description: "Close a working session with one After Action Report on the ticket it worked — intended against actual, the gap and why, what to sustain, what to improve with an owner per action, the watch-outs and the trail; the vault copy, when mounted, supersedes the thread's previous report so pickup reads exactly one. Use at the end of any session, on 'wrap up', 'AAR' or 'after action report', or when closing out work that carries forward."
version: 2.0.0
created: 2026-07-25
updated: 2026-09-02
status: active
triggers:
  - "/wrap-up"
  - "wrap up"
  - "wrap it up"
  - "after action report"
  - "write the AAR"
  - "finish up for the day"
  - "that's a wrap"
  - "done for today"
  - "close out the session"
  - "handover"
  - "pick up [project]"
  - "where did we leave off"
  - "what's the latest on [project]"
  - "continue the work on [project]"
companions:
  - execution-discipline
  - pickup
  - toy-pickup
  - project-manager
  - plugin-manager
  - ticket-builder
maintainer: cq
---

# Wrap up — the After Action Report, one artefact at the full stop

**What this is.** Every session ends by writing one **After Action Report (AAR)** as a comment on the ticket it was dispatched at, and — when the vault is mounted — the same text as a dated file in the scope's `00 handover/`, superseding the thread's previous report. The AAR answers the four questions the format has answered since the US Army wrote it down: *what was intended · what actually happened · why they differed · what to sustain and what to improve*, with every improvement carried as an action with an owner. The pickup side is the mirror: **before resuming a thread, read its latest AAR first.** Nothing starts from memory and nothing ends without a record.

**Why it changed — CQ, 2 Sep 2026: *"i want to turn wrap up into after action reports."*** Measured that day across 27 tickets and four days of agent work (LIAB-1162): the close-out came in five shapes — a four-field retro, an embedded handover, prose paragraphs, a builder's own field names, or nothing at all on eight tickets; seats signed as model names; vault handovers went stale within hours (*"Yesterday's handover said next was design-lead. That already ran"*); the template this skill cited was never shipped in the plugin; and one `/wrap-up` died on `resource_exhausted` under the weight of index rows, log entries, a supersede sweep, a retro append and a handover write. The 1.x design carried two artefacts — a handover for *where to pick up* and a retro entry for *what it taught* — and the two drifted apart because they were written separately. One artefact answers both, and the ticket is where the next reader looks.

**Why the AAR fits this shop exactly.** A session here is dispatched at a ticket with numbered criteria and a posted plan, so *intended* is already written down before the work starts — the first question costs nothing, and the gap is measurable by criterion index. Retrospectives run on a cadence and review habits; post-mortems review failures; the AAR is per event, blameless (the system is under review, never the operator), written soon after, specific (what failed, when, with what consequence), and records what worked as carefully as what did not. Sources: [AlertMedia](https://www.alertmedia.com/blog/after-action-report/) · [Asana](https://asana.com/resources/after-action-review-template) · [LogRocket](https://blog.logrocket.com/product-management/after-action-review-aar/) · [Wikipedia](https://en.wikipedia.org/wiki/After-action_review).

---

## 1. The rules at a glance

1. **One AAR per session, on the dispatch ticket.** A comment, in the template's shape — `templates/aar-template.md` in this skill, headings verbatim. Linear is the record (LIAB-820; the register). A session that touched two genuinely separate threads writes one per thread.
2. **Every seat writes one.** Builder, reviewer, gate, lead, PM, writer — the rule that used to be `product-retro`'s is this skill's now, and it has no judgement call: *when in doubt, write it*. A routine session's AAR is six lines with honest "none"s. **Padding is the failure, not brevity.**
3. **Signed by seat and dispatch id, never a model name.** *`engineering-lead` · dispatch `f875e891`*, not *GPT-5.6 Sol* or *cq-cursor-agent*. The seat is what the next reader routes on.
4. **The gap is systemic, never personal.** The cause is the ticket, the skill, the environment or the sequencing. A report that blames a session has stopped learning.
5. **Every improvement has an owner and a home.** A ticket id · a skill or template change proposed to a named lead · a founder call. An improvement with neither is a wish. The report always ends its actions with `Skill change proposed: [skill — one line | none]` — that line is how the plugin improves (LIAB-1163).
6. **Versions and freshness are stated once, here.** Held skill versions from changelog tops, and whether freshness was checked — in **Watch-outs**, not on every comment of the session (`execution-discipline` §Which copy am I holding?).
7. **Decisions go to the [Decisions register](https://linear.app/lia-creative/document/decisions-register-lia-toys-34348df61a5f), never into the AAR.** A decision has one home and it is not a session's own account (LIAB-862). The Trail points at the entry.
8. **The vault copy, when mounted:** the same text saved as `00 handover/aar-YYYY-MM-DD-[thread].md` with the template's frontmatter; **one ACTIVE per thread** — the previous ACTIVE on the thread flips to `superseded` with `superseded_by:`. No separate `handover-*.md` and no `retro-log.md` append: both are archives as of 2 Sep 2026. Same day, same thread: extend the file.

## 2. CLOSE — running `/wrap-up`

Unattended runs load `execution-discipline` first, per its own rule; an interactive founder-driven close does not need to.

1. **Land the session.** Finish any loose end that takes a few minutes; park everything bigger deliberately in the report. Leave no surface broken — nothing mid-edit, nothing half-saved. **List your worktrees** (`git worktree list`) — every tree this session made goes in Watch-outs with its branch and state, or gets removed now if its PR is merged or closed.
2. **Write the AAR from the template**, section by section:
   - **Orientation** — write it last. Where things stand + the next session's first unblocked action.
   - **Intended** — the ticket ids, the criteria by index, the plan comment. Copy, don't paraphrase.
   - **Actual** — PR and head, statuses as they stand now (read the board, don't recall it), what was verified and at what tier (*ran it · read the code path · read a report*), what was not.
   - **The gap, and why** — per criterion where actual differs. Systemic cause only. "None" is a real answer.
   - **Sustain** — the gate that caught something, the check watched going red, the rule that saved an hour. This is where the good news stops being lost.
   - **Improve → actions** — one line each, owner and home. The `Skill change proposed:` line is addressed to the lead of the seat you sat in: discovery seats → `discovery-lead`, design seats → `design-lead`, engineering and build seats → `engineering-lead`, research seats → `research-lead`, QA seats → `testing-lead`, board and process → `project-manager`, the plugin itself → `plugin-manager`.
   - **Watch-outs** — worktrees left, stale SHAs, blocked writes and what was posted on whose behalf, transcribed founder answers, versions held, freshness once.
   - **Trail** — links, not prose: PRs, comment ids, artefact paths, register entries.
3. **Post it on the dispatch ticket.** If the seat cannot write to Linear, hand the verbatim text to the parent session to post *on behalf*, attributed to the seat and its dispatch id (`ready-review` §on-behalf).
4. **The vault copy, if mounted.** Resolve the scope's folder (§4), save `aar-YYYY-MM-DD-[thread].md` with the frontmatter, then the **supersede sweep**: any still-`active` `aar-*.md` **or legacy `handover-*.md`** on the same `thread:` flips to `status: superseded`, gains `superseded_by: <this filename>`, and a banner under its H1: `> Superseded by [[<this file>]] — read that instead.` The new file records `supersedes:`. Nothing else in the vault is touched by this ritual.
5. **Board truth.** Statuses reflect reality — the newest comment on a ticket is the live instruction, so say plainly if an earlier one is overtaken. Never Done for your own work (Review is the ceiling; `pickup` §3.5). Linear unreachable → the AAR is the file, and the next pickup posts it.
6. **Close out loud.** One line to the founder: the ticket, the next action, the open-thread count. That is the full stop.

## 3. PICKUP — before working on anything

1. **Trigger:** about to do non-trivial work on a product or thread, or the founder says *pick up X*, *continue X*, *where did we leave off*.
2. **Read the latest AAR on the ticket first** — the newest comment is the live instruction; an older AAR, plan or park is overtaken by it. Then, with the vault mounted, the ACTIVE `aar-*.md` in the scope's `00 handover/` (follow `superseded_by` pointers to the newest). A legacy `handover-*.md` that no AAR has superseded is still a valid pickup point and is read the same way. `retro-log.md` files are archives — read for history, never for the next step.
3. **Verify before acting.** Ticket ids, statuses, paths and SHAs drift between sessions; the AAR's Watch-outs say which. Read the tickets its Trail names; existence-check the rest. Board unreachable → proceed with stated caveats and verify before any ticket write.
4. **Open out loud:** *"Picking up from the AAR on LIAB-xxx (date) — next step is …"*, then the caveats and verification results in the same reply. Surface the report's open questions as still open — pickup is exactly where an open question gets mistaken for a decision.
5. **Drift repair.** Two ACTIVE reports on one thread means a past close-out missed the sweep: the newer wins, flip the other, say so in your own AAR.

## 4. Where the vault copy lives

| Work home | Folder |
|---|---|
| Anything under `Products/Lia Tools/` — the line, the toolbox, a tool | that scope's `00 handover/` |
| Standard-shape product (`Context/Outputs/Resources`) | `Products/<Product>/Context/handovers/` |
| Shape-deviant product (loose docs at root) | `Products/<Product>/handovers/` |
| An Operations initiative | `Operations/<Area>/handovers/` |
| Company strategy work | `Company/Strategy/handovers/` |
| Vault infra / cross-cutting ops | `_meta/ops/handovers/` |

The folder names outside Lia Tools keep their `handovers/` name — the files inside are `aar-*.md` from 2 Sep 2026. Torn between two homes? The folder you would file the work's outputs in. Still unsure? Ask, with two candidates and a recommendation; don't guess.

## 5. Guardrails

- **Sensitivity.** The vault is a shared surface. No personal Tier-3+ material, no Endava client content, no secret values — in an AAR, ever. A credential that reached a transcript is a Bug ticket, not a Watch-out line.
- **Propose-first zones.** Founder-driven sessions write `Company/` and `Operations/Processes/` folders directly; unattended runs stage to their queues or `Inbox/`.
- **Not a doc dump.** Durable knowledge goes to a Wiki page or the canonical doc and is linked from the Trail.

## What this seat is not

- **Not the decisions register.** Decisions have one home (LIAB-862); the AAR links to it.
- **Not a status report.** Statuses live on the board (`project-manager` §4); the AAR reads them, it does not replace them.
- **Not optional because the session was small.** Small sessions are cheap to report, and the reports are what make a pattern visible across ten of them — which is how LIAB-1162's fourteen patterns were found.
- **Not a handover plus a retro.** That was 1.x. Two artefacts written separately drift; one answers both questions.

## Legacy — the 1.x handovers and retro-logs

Every `handover-*.md` and `retro-log.md` written before 2 Sep 2026 stays exactly as written: dated records are never rewritten. A legacy ACTIVE handover remains the pickup point for its thread until an AAR supersedes it (§2.4 flips it). Retro-logs stop growing and are read as archives. No migration — the next session on each thread supersedes the old record by writing its AAR, which is also how the 25 Jul 2026 naming clean-up worked. The toolbox's own retro-log was already frozen on 20 Aug 2026 (LIAB-820); the per-tool logs freeze with this version.

## Related

- `templates/aar-template.md` — in this skill — the shape; the file wins if this summary drifts.
- `pickup` / `toy-pickup` — in this plugin — the reading order that starts with the AAR.
- `execution-discipline` §6 — every run ends by naming what the skill got wrong, in the AAR.
- `project-manager` §4 — the board the AAR reads; §2b — the worktree hygiene the Watch-outs feed.
- `plugin-manager` — where a `Skill change proposed:` line becomes a PR.
- `product-retro` — superseded pointer; its mandatory rule lives in §1.2 here.

## Changelog

- **2.0.0 (2026-09-02, LIAB-1162)** — **the close-out is one After Action Report, on the ticket.** CQ, 2 Sep 2026: *"i want to turn wrap up into after action reports."* Replaces the 1.x pair (a `handover-*.md` for where to pick up, a `product-retro` entry for what it taught) with one artefact in the AAR's shape — intended · actual · the gap and why · sustain · improve → actions with owners · watch-outs · trail — posted as a comment on the dispatch ticket, signed by seat, and saved to the vault as `aar-YYYY-MM-DD-[thread].md` when mounted, keeping one-ACTIVE-per-thread and the supersede sweep. The template ships (`templates/aar-template.md` — 1.x cited a `handover-template.md` that was never in the plugin). Versions and freshness are said once, in Watch-outs. Decisions go to the register, never the report. `_meta/index.md` / `_meta/log.md` housekeeping is no longer part of the ritual. Retro-logs and handovers become archives; no migration. Measured cause on LIAB-1162: five close-out shapes across 27 tickets, eight with none, vault handovers stale within hours, one `/wrap-up` dead on `resource_exhausted`.
- **1.3.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.
- **1.2.3 (2026-08-27, LIAB-997)** — `product-retro` and `execution-discipline` stop being named as absent: both are in the plugin now, and §Related says so.
- **1.2.2 (2026-08-26, LIAB-959)** — the three `<project>` placeholders in `triggers:` become `[project]`, per the frontmatter rule that came out of the Cowork install failure. First entry here: this skill reached the plugin without a changelog, so earlier versions are unrecorded.
