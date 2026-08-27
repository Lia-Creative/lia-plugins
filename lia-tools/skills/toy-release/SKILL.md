---
name: toy-release
description: How any agent works a toy through the Lia Tools environments — versioning a toy correctly, knowing which stage it may move, running a promotion after the founder gate, and verifying the result. Load whenever a session creates a toy, bumps a toy's version, or is asked to promote a toy to test, uat, or production. Canonical model lives in Products/Lia Tools/standards/toy-versioning-and-environments-2026-08-13.md — this skill is the runbook, not the model.
version: 0.4.0
created: 2026-08-13
updated: 2026-08-28
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
---

# Toy release — the agent runbook

Load `execution-discipline` first (in this plugin), as with any skill run. Then this.

**The model in one breath:** four stages (`build → test → uat → production`), three account groups (`internal / uat / external`), one app. Stage lives in the release register (server); the version number echoes it pre-1.0. Read the full standard before your first promotion: `Products/Lia Tools/standards/toy-versioning-and-environments-2026-08-13.md`.

## Rule zero — the gates

| You are asked to | You may |
|---|---|
| Create a toy | Yes — version starts `0.0.1`, stage is `build` by definition (no register row needed). |
| Iterate a toy in build/test | Yes — bump patch (`0.0.x`) for each named iteration. |
| Move build → test | Yes, your own call — **only if** the entry bar is met: lint/typecheck/tests green and the toy does its one job on Chris's machine. Record the move. |
| Move test → uat | **Only after a founder's call is written on the promotion ticket.** No comment on the ticket = no promotion, regardless of what the conversation says. Ask for it to be put on the ticket. |
| Move uat → production | Same — founder call on the ticket, always. |
| Move any stage down | Same — founder call on the ticket. |

Chat approval is not ticket approval. The ticket is the paper trail; promotions found without one are defects.

## Version bumps

| Event | Version action |
|---|---|
| New toy | `0.0.1` |
| Internal iteration | patch: `0.0.x` |
| Promotion to uat | minor: first uat release `0.1.0`, next `0.2.0`, … |
| Fix shipped to uat testers | patch on the uat line: `0.1.1` |
| Promotion to production | `1.0.0` |
| Post-1.0 | normal semver; the register's stage field alone carries stage |

Never parse a version to learn a stage — read the register. Never set the manifest `version` and the register to disagreeing values in the same pass.

## The promotion run

After the gate is confirmed **on the ticket**:

1. **Re-read the promotion ticket immediately before starting** (tickets on this board move under sessions' feet — known, recorded 12 Aug).
2. Bump the toy's manifest `version` in `lia-toy-box` per the table. **Its own PR, containing nothing else** — titled `release(<toy>): <version> — promote to <stage>`, body linking the promotion ticket. **Open the PR and stop — Chris merges.** The promotion is paused here until he does.
3. After merge: tag the merge commit `<toy>@<version>`, then cut a release build of Toy Box containing it. **Once the updater is live (`LIAB-700`, decision 26), publishing that build is one upload to the update feed** — not four hand-deliveries.
4. Insert the register row (`toy_releases`: toy_id, version, stage, `git_ref`, promoted_at, promoted_by, notes). Insert, never update — history is the promotion log. `git_ref` is the tag from step 3. Your `promoted_by` is your agent id; the founder who gated is in the notes.
5. **Verify both directions:** a test account of the target group sees the toy on refresh; an account of the group below does not. A promotion without this check is not done.
6. **Distribution reality check:** the group only truly has the toy once a build containing it is on their machines. **With the updater live** (decision 26 — Electron's standard updater on Cloudflare R2, `LIAB-700`): publish the build to the feed and machines take it on next launch; the closing comment records the published version. **Before it's live:** run the `LIAB-673`/`675` pipeline if the run's scope includes distribution, and if not, say plainly in the closing comment that the register is updated but builds are not yet on machines. Never let a register write alone read as *the panel has it*.
7. Close out: Linear comment on the promotion ticket (version, stage, tag, register row, verification evidence, distribution status) → ticket to **Review, never Done** → `_meta/log.md` entry → retro entry in the toy's `00 handover/retro-log.md`.

## Git, in one breath

Full conventions: `Products/Lia Tools/standards/git-and-release-conventions-2026-08-13.md`. What you need while working:

- **Branch:** the one Linear generated (`chris/liab-689-…`). Don't invent one.
- **Commits:** `type(scope): subject`, where **scope is the toy's id** — `feat(dump): read capture time from exif`. Shell work is `shell`; tooling is `repo`.
- **Release commits:** `release(dump): 0.1.0`, alone in their own PR.
- **Tags:** `dump@0.1.0` on the merge commit. **A tag records code, never stage** — never write a tag that implies uat, and never read one to learn a stage.

## Stop conditions (beyond execution-discipline's)

- The register or account service doesn't exist yet, or the write path fails → stop, report. Do not simulate a register in a local file; a promotion that only exists on one machine is worse than none.
- No founder comment on the promotion ticket → stop and ask for one. A decision made in chat is not a decision on the record, and this is the one rule with no judgement in it.
- The manifest version and the register disagree when you arrive → stop, flag it as a defect. The register wins, but a session that finds drift fixes the *finding* into a ticket, not silently into the data.
- The toy's entry bar for the target stage isn't met → the promotion waits. "Promote with a caveat" is not a thing.

## Grounding

- `Products/Lia Tools/standards/toy-versioning-and-environments-2026-08-13.md` — the standard (the four jam calls, 13 Aug 2026)
- `Products/Lia Tools/toolbox/04 build/requirements/prd-06-environments.md` + `prd-07-groups-and-register.md` — what the app and service do with what you write
- `Products/Lia Tools/standards/toy-contract-2026-08-12.md` — the manifest `version` field
- `Products/Lia Tools/standards/git-and-release-conventions-2026-08-13.md` — branches, commit scopes, the release PR shape, tags
- `execution-discipline` — in this plugin — load first, always

## Changelog

- **0.4.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.- **0.3.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the environments PRD pointer was stale twice: the toy box renumbered `04 build/` to `04 build/` on 28 Aug (CQ, LIAB-1006), and the PRDs sit in a `requirements/` subfolder, not at the build root — verified on disk, both halves fixed. `execution-discipline` is named as the sibling seat in this plugin rather than pathed at the retired vault `_meta/skills/`. The versioning model itself is untouched; the standard in `02 analysis/` remains canonical and did not move. First entry here; earlier versions are unrecorded.
