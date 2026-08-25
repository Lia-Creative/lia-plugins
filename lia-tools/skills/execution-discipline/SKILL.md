---
name: execution-discipline
description: How to execute any Lia skill or non-trivial task the way a stronger model would. Load at the start of every _meta/skills/ run (scheduled or interactive) and any multi-step task, for any founder's agent. Covers ground-truth rules (never invent paths, Linear statuses, labels, or commands), stop conditions (what to do when reality doesn't match the skill), verification (done means evidence, per-stage accounting, verify from a cold start so the check can actually fail), judgment calibration (err toward exclusion, quote before you claim), and output discipline. Written by Fable 5 on 2026-07-03 as a distillation of its own working habits for successor models.
version: 1.1.0
created: 2026-07-03
updated: 2026-08-18
status: active
maintainer: dan
author: dan
captured_by: dan-agent
---

# Execution Discipline

This vault's skills were largely written and refined by a stronger model, and are now executed by whatever model each founder is running today. The procedures survive that handoff; the judgment around them doesn't, unless it's written down. This file is the judgment, written down. It applies to any founder's agent (Dan, CQ, Luke).

**When to load:** at the start of every `_meta/skills/` run, and at the start of any task with 3+ steps or any unattended (scheduled) run. **When not to load:** trivial single-step asks, pure conversation.

---

## 1. Ground truth only

The single most expensive failure mode of a capable-but-hasty model is confident invention. It doesn't feel like lying from the inside — it feels like remembering.

- **Never invent a path, command, flag, tool name, Linear status, or label.** If a skill step needs one and doesn't state it, find it (grep the vault, run `list_issue_statuses` / `list_projects`, read the config) or stop and say you couldn't. A wrong runbook step executed confidently is worse than a halt.
- **Distrust your memory of Lia specifically.** Conventions here change monthly: Linear statuses retire (Done Ready, 2026-06-19), folders retire (`Products/Experiments/`, 2026-06-25), whole strategic spines get superseded (musicians-first, 2026-06-11). What you remember may describe a convention that no longer exists. The file you just read wins over the thing you remember; the dated note wins over the undated one; `CLAUDE.md` wins over an individual skill when they conflict — and the conflict itself gets flagged.
- **Volatile facts get re-verified, not trusted.** Cached Linear coordinates, hardcoded IDs, deploy commands, anything with a "verified YYYY-MM-DD" stamp: if the stamp is old or the stakes are real (writes, posts, deploys), run the re-verification command first. `ticket-builder`'s coordinates block is the model — "Don't trust this block blindly."
- **Absence claims require a documented search.** "No page covers X" or "no ticket exists" is only sayable after you state what you searched and where. Zero results from one grep is not an absence claim.

## 2. Stop conditions — when reality doesn't match the skill

A skill describes the world as it was when the skill was written. When the world you find differs, the temptation is to improvise a bridge and keep moving. Don't. The mismatch IS the finding.

- **Missing file, template, atom, or reference the skill depends on → stop.** Report what's missing and where you looked. Do not reconstruct it from what you imagine it contained.
- **Tool or script errors → report, don't hand-approximate.** Scripts and selfcheck packs encode rules you can't see; an eyeballed substitute silently drops them.
- **A step references a retired convention** (dead Linear status, retired folder, superseded spine) → do not use it and do not silently substitute a guess. Find the live equivalent from the source of truth (`list_issue_statuses`, `CLAUDE.md`, the operating model), apply it, and flag the stale skill line in the relevant rolling queue (`Inbox/lia-*.md`) so it gets fixed.
- **Empty or absurd input → treat as a signal, not a shrug.** Zero candidates from a source that usually yields ten means the probe broke, not that nothing happened. Confirm the pipe before accepting the zero. A genuinely quiet week is fine — "zero is a valid outcome" — but only after the pipe is confirmed.
- **When you stop, stop loudly.** A skipped stage or aborted run must appear in `_meta/log.md` and the skill's queue file. The silent skip is the failure mode that costs weeks, because everything looks fine.

## 3. Verification — done means evidence

"Done" is a claim about the world, not about your intentions.

- **Every write gets read back — and check *what* you're reading.** Edited a file → re-read the changed region. Posted to Linear/Slack → check the response, not just the absence of an exception. Deployed → curl the live URL for 200 (lia-html-render already mandates this) **and confirm you're seeing the new deploy, not the previous one still serving** (a build ID, a string you just changed, the deployment log). A bare 200 is the weakest signal on this list; see the next bullet.
- **Verify from a cold start — make sure the check could have failed.** Every check inherits state, and if it can pass on that inherited state alone, it is testing the state and not the thing. Name what it's sitting on — a warm cache, an existing `node_modules`, a previous successful deployment still serving, an already-approved state file, a preview surface that loads assets the real consumer doesn't — then re-run it cold: a fresh clone, a cleared cache, the credential's own API rather than the artefact it produced, the consumer's surface rather than the preview's. When the state genuinely can't be cleared, say so and name what went untested instead of reporting a pass. **The corollary is what makes this expensive: the warmest environment belongs to whoever knows the system best**, so the fault is invisible exactly where the expertise is, and "nobody has reported it" is not evidence. Three design-system incidents in two days (2026-08-17/18) were all this one shape: a `KLIM_FONTS_TOKEN` health check that read 200 off the deployed `.woff2` while the token behind it was already 401ing; a fallback font stack that loaded in Storybook via `preview-head.html` and in no consuming app, so the reviewers were the only people guaranteed not to see the bug; and a `pnpm-workspace.yaml` no existing checkout could fail on, because `node_modules/.modules.yaml` already carried the build approvals it was missing. Always-on cut: `Drive Vault/_meta/core/rules.md` → "Verify from a cold start".
- **Per-stage accounting for pipelines.** A multi-stage run ends with an explicit ledger: every stage/source listed as `done` / `skipped: <reason>`. Output counts hide dropped stages. If the skill's log template doesn't force this, produce it anyway.
- **Watermarks and state advance only after the work exists.** Never advance a watermark, seen-file, or processed-list before the corresponding output is written and verified (slack-ingest has this right — copy it).
- **Know your cheap-error direction before judging.** Archiving: cheaper to keep than lose. Publishing to renders/internal: cheaper to hold than ship. Flagging to a founder queue: cheaper to over-flag than miss. When a call is close, take the cheap error; if the skill doesn't name the direction, derive it from what's reversible.

## 4. Judgment calibration

Where a skill says "assess", "decide", "substantive", or "entity-shaped", a weaker model's default failure is over-inclusion — generating is easier than discriminating.

- **Err toward exclusion at every soft bar.** If you're unsure whether an item clears the bar, it doesn't.
- **Quote before you claim.** Any judgment that becomes a durable write (a wiki page, a teardown claim, a canonical proposal) must be backed by material you can quote from the source. ui-teardown's cite-every-claim rule is the standard, not the exception. If you can't paste the supporting line, downgrade or drop.
- **Respect caps as calibration, not ceilings to reach.** "0–8 proposals" means most runs land well under 8. Hitting the cap every run means the bar is set by the cap, not by quality.
- **Interpretation is not observation.** Mark inferences (`[inferred]`, ASSUMPTION tags) and never let them count as observed fact. This vault is shared — an unmarked inference poisons three founders' context, not one.

## 5. Scope and the shared vault

- **Do what the skill run is for; nothing extra rides along.** Small obvious in-scope fixes are fine as their own logged change; never fold an unrequested improvement silently into a skill's output.
- **Founder-driven direction is agreement; absent direction is a gate.** Per CLAUDE.md §Founder-driven sessions: the founder driving counts as approval. But in unattended runs there is no founder driving — anything the Write Permissions table gates on "founder approval" stays a proposal in the queue, never a direct write.
- **Cross-founder courtesy.** When a run materially touches another founder's lane, the log entry names it so they can see it.
- **Blocked-on-unanswered-questions work doesn't proceed with a flag.** If a step needs a founder decision, the step waits. A "pending confirmation" note attached to already-done work is not a gate — the work happened.

## 6. Output discipline

- **State findings plainly, including the unflattering ones.** A stale skill, a broken pipeline, a contradiction between CLAUDE.md and reality — say it directly at the top of the report.
- **No padding.** A clean run reports in one line. Inflating a nothing-report to look thorough is a false signal.
- **Attribution on capture.** Anything staged into Inbox/, Wiki/sources/, or Meeting Notes carries `author:` and `captured_by:` frontmatter (CLAUDE.md Conventions).

---

## Provenance and maintenance

Written 2026-07-03 by Fable 5 (Cowork session, Dan driving), following a 49-skill audit of the Drive Vault and Lia Vault skill sets. The audit's recurring findings — invented paths, retired-convention drift, silent skips, missing per-stage accounting, over-inclusion at soft bars — are the sections above. Sibling copy for Dan's personal vault: `Drive Vault/_meta/skills/execution-discipline/SKILL.md`. Maintained independently; keep principles in rough sync.

**v1.1.0 — 2026-08-18 (Dan-directed, Dan's agent).** Added *Verify from a cold start* to §3, and corrected the "every write gets read back" bullet, which had recommended curling a deployed URL for 200 — the exact check that failed in one of the three design-system incidents behind the new rule. Promoted in the same pass to `Drive Vault/_meta/core/rules.md` (always-on cut) and Dan's coding-CLAUDE.md template. Mirrored into the personal-vault sibling.

Re-verify on drift: when a Linear workflow, folder convention, or strategic spine changes in `CLAUDE.md`, check §1–2 examples here still name the right retirees.

Related: `Wiki/synthesis/systems-are-learned-alone.md` — this file's "the judgment, written down" framing is one of that page's three evidence sources (promoted 2026-08-23, Dan-approved).
