---
name: execution-discipline
description: How to execute any Lia skill or non-trivial task the way a stronger model would. Load at the start of every Lia skill run (scheduled or interactive) and any multi-step task, for any founder's agent. Covers ground-truth rules (never invent paths, Linear statuses, labels, or commands), stop conditions (what to do when reality doesn't match the skill), verification (done means evidence, per-stage accounting, verify from a cold start so the check can actually fail), judgment calibration (err toward exclusion, quote before you claim), and output discipline. Written by Fable 5 on 2026-07-03 as a distillation of its own working habits for successor models.
version: 1.10.0
created: 2026-07-03
updated: 2026-09-02
status: active
maintainer: dan
author: dan
captured_by: dan-agent
---

# Execution Discipline

This vault's skills were largely written and refined by a stronger model, and are now executed by whatever model each founder is running today. The procedures survive that handoff; the judgment around them doesn't, unless it's written down. This file is the judgment, written down. It applies to any founder's agent (Dan, CQ, Luke).

**When to load:** at the start of every Lia skill run, and at the start of any task with 3+ steps or any unattended (scheduled) run. **When not to load:** trivial single-step asks, pure conversation.

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
- **A rule you cannot find is more likely missing from your copy than absent from the plugin.** You may be holding an old one. The two explanations are indistinguishable from the inside, and the second is far more likely — so suspect it *before* concluding a rule does not exist, and certainly before writing a ticket saying so.

### Which copy am I holding?

**The version you hold is the top entry of the skill's own `## Changelog`** — the version-bump guard requires every change to head an entry there, so the first entry is what you were served. That is the only version visible in-band: **frontmatter is not served to you** (measured 29 Aug 2026), so a skill's `version:` field is not something you can read from what you were given.

Knowing your version is half the answer. The other half is what the marketplace *currently* serves, and for that there is a check:

```
node scripts/check-plugin-freshness.mjs        # from a clone of Lia-Creative/lia-plugins
```

**You need that clone.** `scripts/` sits at the repo root, *outside* the shipped plugin — an installed copy carries `skills/` and its manifest, not the guards — so this command does not exist for a session that only has the plugin. **If you have no clone, you cannot run it, and the honest move is to say your version is unverified rather than to assume it is current.** That is itself the answer LIAB-1052 wants: an agent that knows it cannot check has still avoided concluding a rule does not exist.

It finds your install by reading Claude Code's own `installed_plugins.json` **and** searching the plugins tree — both, never one as a fallback for the other — then compares against the `release` ref. The union is deliberate: when the registry was allowed to answer alone, a registry recording a current version over a cache still holding an old one reported *green*, which is this very defect passed by the check built to catch it.

Three outcomes, and the third is the one that matters: **exit 0** current or ahead · **exit 1** stale · **exit 2 unchecked**. `unchecked` has its own exit code on purpose, so *"I could not find your install"* can never be read as *"you are fine"*. If you are running from a real install and still get `unchecked`, **the finder is wrong and worth a ticket** — pass `--held [path-to-plugin.json]` meanwhile. A session served from `--plugin-dir`, a clone or CI has no install to find, and that is the honest `unchecked`, not a fault.

**A machine can hold several versions at once** (per-scope or per-project installs, or a leftover directory beside a current one). The script reports all of them, and then asks whether the disagreement actually reaches the verdict:

- **every copy behind the release → stale.** Certain whichever one is served, so it says so. This is the shape the LIAB-1052 machine was in.
- **every copy at or ahead of the release → fine.** Also certain either way.
- **the set straddles the release → `unchecked`.** The one genuine ambiguity, and the only one worth refusing to answer.

`--held [path]` settles that last case, and **you probably cannot supply it** — which is the same gap this section opens with. Two different things are numbered here: a **skill's** version (`engineering-lead` 0.7.0, readable in-band from its changelog) and the **plugin's** (1.17.0, what the script compares). Knowing the first does not tell you the second. So on a straddling answer the honest report is *unverified*, not a guess at which copy is live.

**Why this rule exists** ([LIAB-1052](https://linear.app/lia-creative/issue/LIAB-1052), measured 29 Aug 2026): a lead was dispatched to run the orchestration chain that had merged an hour earlier, and **the loader served it the version from before that merge** — no `§The chain`, no rules 10 or 11. The mandate was invisible to the exact seat built to run it, and two build agents hit the same thing independently. The installed cache was three versions behind `main`. **Nothing merged into this plugin takes effect for a session already running, and until you check, no session can tell.**

Knowing is the deliverable. What to do about it — reload, carry on with the gap named, or stop — is the lead's call, not this skill's.

**Say it once.** The held versions and the freshness answer go in the session's After Action Report — `wrap-up`, Watch-outs — and nowhere else. Ten tickets carried *plugin freshness unverified* on every comment between 29 Aug and 2 Sep 2026 and nobody acted on any of them; a line that appears everywhere is read nowhere.

## 3. Verification — done means evidence

"Done" is a claim about the world, not about your intentions.

- **Every write gets read back — and check *what* you're reading.** Edited a file → re-read the changed region. Posted to Linear/Slack → check the response, not just the absence of an exception. Deployed → curl the live URL for 200 (lia-html-render already mandates this) **and confirm you're seeing the new deploy, not the previous one still serving** (a build ID, a string you just changed, the deployment log). A bare 200 is the weakest signal on this list; see the next bullet.
- **Verify from a cold start — make sure the check could have failed.** Every check inherits state, and if it can pass on that inherited state alone, it is testing the state and not the thing. Name what it's sitting on — a warm cache, an existing `node_modules`, a previous successful deployment still serving, an already-approved state file, a preview surface that loads assets the real consumer doesn't — then re-run it cold: a fresh clone, a cleared cache, the credential's own API rather than the artefact it produced, the consumer's surface rather than the preview's. When the state genuinely can't be cleared, say so and name what went untested instead of reporting a pass. **The corollary is what makes this expensive: the warmest environment belongs to whoever knows the system best**, so the fault is invisible exactly where the expertise is, and "nobody has reported it" is not evidence. Three design-system incidents in two days (2026-08-17/18) were all this one shape: a `KLIM_FONTS_TOKEN` health check that read 200 off the deployed `.woff2` while the token behind it was already 401ing; a fallback font stack that loaded in Storybook via `preview-head.html` and in no consuming app, so the reviewers were the only people guaranteed not to see the bug; and a `pnpm-workspace.yaml` no existing checkout could fail on, because `node_modules/.modules.yaml` already carried the build approvals it was missing. Always-on cut: `Drive Vault/_meta/core/rules.md` → "Verify from a cold start".
- **Name the harness in every gate table.** *typecheck green* means nothing without *on what*: the machine (a Mac, a Linux cloud seat), the dependency set (the real design system or a stand-in), the inherited environment (`ELECTRON_RUN_AS_NODE` from a Cursor shell broke an app probe on 31 Aug 2026). Two gates went red on 1 Sep 2026 for a stand-in package rather than the code, and both needed a correction comment (LIAB-1088, LIAB-1083); a table that names its harness makes a false red say so itself.
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
- **End by naming what the skill got wrong.** Every run closes with the After Action Report (`wrap-up`), and its `Skill change proposed:` line names what the skill you ran got wrong or left you guessing — addressed to the lead of the seat you sat in, who raises the PR through `plugin-manager`. *None* is an answer; silence is not. This is the one place the loop is universal, because every seat loads this file first.
- **Attribution on capture.** Anything staged into Inbox/, Wiki/sources/, or Meeting Notes carries `author:` and `captured_by:` frontmatter (CLAUDE.md Conventions).

---

## Provenance and maintenance

Written 2026-07-03 by Fable 5 (Cowork session, Dan driving), following a 49-skill audit of the Drive Vault and Lia Vault skill sets. The audit's recurring findings — invented paths, retired-convention drift, silent skips, missing per-stage accounting, over-inclusion at soft bars — are the sections above. Sibling copy for Dan's personal vault: `Drive Vault/_meta/skills/execution-discipline/SKILL.md`. Maintained independently; keep principles in rough sync.

**v1.1.0 — 2026-08-18 (Dan-directed, Dan's agent).** Added *Verify from a cold start* to §3, and corrected the "every write gets read back" bullet, which had recommended curling a deployed URL for 200 — the exact check that failed in one of the three design-system incidents behind the new rule. Promoted in the same pass to `Drive Vault/_meta/core/rules.md` (always-on cut) and Dan's coding-CLAUDE.md template. Mirrored into the personal-vault sibling.

Re-verify on drift: when a Linear workflow, folder convention, or strategic spine changes in `CLAUDE.md`, check §1–2 examples here still name the right retirees.

Related: `Wiki/synthesis/systems-are-learned-alone.md` — this file's "the judgment, written down" framing is one of that page's three evidence sources (promoted 2026-08-23, Dan-approved).

## Changelog

- **1.10.0 (2026-09-02, LIAB-1165)** — §Which copy am I holding? gains *say it once* — held versions and freshness go in the AAR's Watch-outs, not on every comment (ten tickets carried the line per comment; none acted on). §3 gains *name the harness in every gate table* — machine, dependency set, inherited env — after two false reds from a design-system stand-in on 1 Sep 2026 (LIAB-1165).
- **1.9.0 (2026-09-02, LIAB-1163)** — §6 gains the universal half of the improvement loop: every run ends by naming what its skill got wrong, in the AAR's `Skill change proposed:` line, to its lead. CQ, 2 Sep 2026: *"make sure the sub agents are suggesting changes to the leads across all of the agents"* — 2 of 72 skills carried the loop, both leads; no worker seat did. Placed here because every seat loads this file first.
- **1.8.1 (2026-09-02, LIAB-1161)** — `lead-engineer` is `engineering-lead` — reference only: the seat's name now follows its discipline, like the other four leads. No rule changed.
- **1.8.0 (2026-08-29, LIAB-1052)** — this section said the tree search runs *"failing that"*, i.e. as a **fallback** to the registry. It is a **union**, and the union is the whole point: reading the registry alone is what let a registry claiming current suppress a stale copy on disk. Third time in two days that prose here has described behaviour the script no longer had — in the section whose own 1.6.0 entry was written about exactly that. The pattern is worth more than the fix: **a sentence about a check is a copy of the check, and copies drift.** When the script changes, this section is part of the change.
- **1.7.0 (2026-08-29, LIAB-1052)** — 1.6.0 over-corrected. Saying *any* disagreement returns `unchecked` meant the guard shrugged at the machine this ticket was measured on, where a registry spanning 1.2.0 to 1.13.0 sat against a released 1.16.0 — every copy behind, staleness certain whichever was served, and nothing said so. The rule is now whether the disagreement **reaches the verdict**, in three cases. Also names the thing that makes the `--held` escape hatch hard to use: the skill version you can read in-band and the plugin version the script compares are **different numbers**, so knowing one does not give you the other.
- **1.6.0 (2026-08-29, LIAB-1052)** — the multiple-installs paragraph described behaviour the script no longer has. 1.4.0 said it *judges on the oldest*; a review found that reports a **current** machine with a leftover directory beside it as `stale`, which is false in the damaging direction — it tells a correct agent its rules may be missing. Disagreeing copies now return `unchecked`, and this section says what the script does rather than what it used to. Same lesson as the version numbers this repo has already had lie to it: prose about a check goes stale the moment the check changes.
- **1.5.0 (2026-08-29, LIAB-1052)** — the command this section names **does not exist for the agents it is aimed at**, caught in review: `scripts/` is at the repo root, outside the shipped plugin, so an installed session has no such file — and this skill loads on every run, for any agent, in any repo, while its own §1 forbids naming a command that is not there. It now says the clone is required and, more usefully, what to do without one: report your version as unverified rather than assume it is current, which is still the answer the ticket wants.
- **1.4.0 (2026-08-29, LIAB-1052)** — the freshness check this section points at was **unsound on the point it was written for**, caught by an independent review the same day: it looked for the install at three guessed paths, none of them verified and nothing in the repo documenting the real layout — *"never invent a path"* broken inside the guard meant to be authoritative about versions. It now reads `installed_plugins.json` and otherwise **searches** the tree, so a layout its author never saw is still found; `unchecked` gets **exit 2**, so silence cannot read as a pass; and several versions held at once are all reported, judged on the oldest. This section says so.
- **1.3.0 (2026-08-29, LIAB-1052)** — §2 gains the case it was missing: **a rule you cannot find is more likely missing from your copy than absent from the plugin.** Measured that day — a lead was served the `lead-engineer` from *before* the orchestration chain merged an hour earlier, so the mandate was invisible to the seat built to run it, and two build agents hit it independently with the installed cache three versions behind `main`. §2 already covered a skill that disagrees with the world; it had nothing for a skill that is simply *old*, and the two are indistinguishable from the inside. New §Which copy am I holding? — the held version is the top changelog entry (**frontmatter is not served to an agent**, measured, so `version:` is not readable from what you were given), the current version comes from `scripts/check-plugin-freshness.mjs`, and an unknown is reported as unchecked rather than passed. Knowing is the deliverable; what to do about it stays the lead's call.
- **1.2.0 (2026-08-28, LIAB-963)** — this skill described itself by a home it no longer has. `_meta/skills/` was retired on 26 Aug (LIAB-919), and the `description:` is the string auto-triggering matches on, so "every `_meta/skills/` run" was both false and the most load-bearing sentence in the file. It now says *every Lia skill run*, which is what it always meant and stays true wherever canonical lives next. The §Grounding line naming Dan's `Drive Vault/_meta/skills/execution-discipline/` is **kept on purpose**: that is a real, separate file in his personal vault, maintained independently, and the note says so.
