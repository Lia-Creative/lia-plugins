---
name: toy-release
description: How any agent works a toy through the Lia Tools environments — versioning a toy correctly, knowing which stage it may move, running a promotion after the founder gate, and verifying the result. Load whenever a session creates a toy, bumps a toy's version, or is asked to promote a toy to test, uat, or production. Canonical model lives in Products/Lia Tools/standards/toy-versioning-and-environments-2026-08-13.md — this skill is the runbook, not the model.
version: 0.6.0
created: 2026-08-13
updated: 2026-09-02
status: active
maintainer: cq
author: cq
captured_by: cq-cowork
---

# Toy release — the agent runbook

Load `execution-discipline` first (in this plugin), as with any skill run. Then this.

**The model in one breath:** four stages (`build → test → uat → production`), three account groups (`internal / uat / external`), one app. Stage lives in the release register (server), and **only there** — the version number does not echo it. Read the full standard before your first promotion: `Products/Lia Tools/standards/toy-versioning-and-environments-2026-08-13.md`.

## Rule zero — the gates

| You are asked to | You may |
|---|---|
| Create a toy | Yes — version starts `0.0.1`, stage is `build` by definition (no register row needed). |
| Iterate a toy in build/test | Yes — bump per §Version bumps: a patch for a fix or tweak, a minor if it gained a capability. |
| Move build → test | Yes, your own call — **only if** the entry bar is met: lint/typecheck/tests green and the toy does its one job on Chris's machine. Record the move. |
| Move test → uat | **Only after a founder's call is written on the promotion ticket.** No comment on the ticket = no promotion, regardless of what the conversation says. Ask for it to be put on the ticket. |
| Move uat → production | Same — founder call on the ticket, always. |
| Move any stage down | Same — founder call on the ticket. |

Chat approval is not ticket approval. The ticket is the paper trail; promotions found without one are defects.

## Version bumps

**Take the smallest bump that is true.** The size of the change picks the digit — not the promotion, not the ceremony.

| Bump | Means | For a tool |
|---|---|---|
| **patch** | It got better. | A fix, a tweak, tuning, copy. **The default.** |
| **minor** | It does something new. | The tool gains a capability, or its job changed. |
| **major** | Something that worked stops working. | It breaks someone's saved work or a flow they rely on. **A breaking change below `1.0.0` takes the minor instead** — see below. |

The toolbox takes the same three rows, read against the shell: a patch fixes it, a minor gives it a new capability, a major breaks a tool or someone's saved state.

Two rules make the number mean something:

1. **One step at a time.** From `X.Y.Z` the only legal next numbers are `X.Y.(Z+1)`, `X.(Y+1).0`, `(X+1).0.0`. No skipping.
2. **A promotion never picks the digit.** `build → test → uat` is a stage change; the stage lives in the register. A small fix promoted to uat is a **patch**, and it stays a patch however much ceremony the promotion carries.

**Worked, because this is the question that gets asked:** a tool at `0.4.0` gets one small fix and is promoted `test → uat` on a founder's gate. It becomes **`0.4.1`**. The fix is a patch; the promotion adds nothing. It would have been `0.5.0` before 2 Sep 2026, and that is the habit this rule replaces.

The fixed points: a **new toy starts at `0.0.1`**; `0.x` means not yet in production; and **the promotion to production is `1.0.0`** — the single time a promotion sets a number. After that the three rows, unchanged.

**Below `1.0.0`, a breaking change — and only a breaking change — takes the minor** — the ordinary semver convention, and the only answer available: one step from `0.4.1` reaches `1.0.0`, which is reserved above, so a pre-production break has nowhere else to go. It is also the right shape: nobody outside the uat group is relying on a `0.x` tool yet, which is the whole meaning of `0.x`. **This changes nothing else about a `0.x` tool** — an ordinary fix is still a patch, `0.4.1 → 0.4.2`, and the three rows above apply as written.

**An epic's version is not a tool's version.** `epic-builder` names a chunk of value `charts 1.0`, then `charts 1.1` — that is a name for a slice of work, and it never sets what the manifest says. A `charts 1.0` epic can land as a patch on a tool sitting at `0.3.4`. Under the old table the two roughly co-moved, because every uat promotion was a minor; they do not any more, so read them as separate numbering schemes that happen to share a shape.

Never parse a version to learn a stage — read the register. Never set the manifest `version` and the register to disagreeing values in the same pass.

*(Both rules are new on 2 Sep 2026 ([LIAB-1184](https://linear.app/lia-creative/issue/LIAB-1184), CQ) — the old table had no step rule, and it let the promotion pick the digit — so a one-line fix cost `0.1.0 → 0.2.0` and tools climbed for ceremony rather than change. That is retired; rule 2 above is what holds now. It also had the version encode the stage while this skill says twice that it does not; dropping that settles a contradiction rather than creating one. Same policy as the plugin and the toolbox: `lia-tools/README.md` §Versioning, `CLAUDE.md` rule 10. The canonical standard has not caught up — see Grounding.)*

## The promotion run

After the gate is confirmed **on the ticket**:

1. **Re-read the promotion ticket immediately before starting** (tickets on this board move under sessions' feet — known, recorded 12 Aug).
2. **Only if code changed, bump the toy's manifest `version`** in `lia-toy-box` per §Version bumps. **Its own PR, containing nothing else** — titled `release(<toy>): <version> — promote to <stage>`, body linking the promotion ticket. **Open the PR and stop — Chris merges.** The promotion is paused here until he does. **A promotion carrying no code change bumps nothing and raises no PR** — the stage moves in the register at step 4, and an empty release PR is a promotion dressed up as a change. (Before 2 Sep 2026 every uat promotion moved the minor, so this step always had something to do; it no longer does — LIAB-1184.)
3. If step 2 raised a PR, then after merge: tag the merge commit `<toy>@<version>`. **One tag per version** — a promotion that bumped nothing keeps the tag the code already has, and never writes a second one. Then cut a release build of Toy Box containing it. **Once the updater is live (`LIAB-700`, decision 26), publishing that build is one upload to the update feed** — not four hand-deliveries.
4. Insert the register row (`toy_releases`: toy_id, version, stage, `git_ref`, promoted_at, promoted_by, notes). Insert, never update — history is the promotion log. `git_ref` is the tag from step 3. Your `promoted_by` is your agent id; the founder who gated is in the notes.
5. **Verify both directions:** a test account of the target group sees the toy on refresh; an account of the group below does not. A promotion without this check is not done.
6. **Distribution reality check:** the group only truly has the toy once a build containing it is on their machines. **With the updater live** (decision 26 — Electron's standard updater on Cloudflare R2, `LIAB-700`): publish the build to the feed and machines take it on next launch; the closing comment records the published version. **Before it's live:** run the `LIAB-673`/`675` pipeline if the run's scope includes distribution, and if not, say plainly in the closing comment that the register is updated but builds are not yet on machines. Never let a register write alone read as *the panel has it*.
7. Close out: Linear comment on the promotion ticket (version, stage, tag, register row, verification evidence, distribution status) → ticket to **Review, never Done** → `_meta/log.md` entry → the session's After Action Report per `wrap-up`, on the promotion ticket.

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

- `Products/Lia Tools/standards/toy-versioning-and-environments-2026-08-13.md` — the standard (the four jam calls, 13 Aug 2026). **Its version-bump table is stale**: §Version bumps here carries the 2 Sep 2026 call and [LIAB-1185](https://linear.app/lia-creative/issue/LIAB-1185) brings the standard in line. Everything else in it stands.
- `Products/Lia Tools/toolbox/04 build/requirements/prd-06-environments.md` + `prd-07-groups-and-register.md` — what the app and service do with what you write
- `Products/Lia Tools/standards/toy-contract-2026-08-12.md` — the manifest `version` field
- `Products/Lia Tools/standards/git-and-release-conventions-2026-08-13.md` — branches, commit scopes, the release PR shape, tags
- `execution-discipline` — in this plugin — load first, always

## Changelog

- **0.6.0 (2026-09-02, LIAB-1184)** — the version bump table stops being a list of events and becomes a question about the change: patch it got better, minor it does something new, major something that worked stops working, moving exactly one step. **A promotion no longer picks the digit.** The old table made every uat promotion a minor, so a one-line fix cost `0.1.0 → 0.2.0` and tools climbed for ceremony — dump's history is mostly that. **Minor, not patch**, under the rule it adds: this skill now gives a different answer to its central question, which is its job changing. Four places had to move with the table, and review found every one of them: *The model in one breath* still said the version echoes the stage pre-1.0 — the sentence a session skims first, and the one an invocation of the old copy quoted back verbatim; the rule-zero gate row hard-pinned build iteration to `0.0.x`; §The promotion run still ordered a version bump on **every** promotion, which under the new rule means an empty PR and a second tag at the same version; and the major example read `2.0.0`, unreachable in one step from any `0.x`. A breaking change below `1.0.0` now has a stated answer — it takes the minor, since one step from `0.4.1` reaches `1.0.0` and that is reserved for the production promotion. What survives: `0.0.1` for a new toy, `0.x` as not-yet-production, and `1.0.0` for production. The toolbox gets a row for the first time; it had no version policy anywhere, appearing only as an unversioned container for a versioned tool. Same policy as the plugin (`README.md` §Versioning, `CLAUDE.md` rule 10). The canonical standard is stale until [LIAB-1185](https://linear.app/lia-creative/issue/LIAB-1185), flagged once in Grounding rather than in three places — a caveat in `description:` would outlive the caveat.
- **0.5.0 (2026-09-02, LIAB-1162)** — the retro entry is the After Action Report: one per session, as a comment on the dispatch ticket per `wrap-up` 2.0.0, the vault copy in `00 handover/` when mounted; retro-logs are archives.
- **0.4.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.
- **0.3.0 (2026-08-28, LIAB-1006 + LIAB-963)** — the environments PRD pointer was stale twice: the toy box renumbered `04 build/` to `04 build/` on 28 Aug (CQ, LIAB-1006), and the PRDs sit in a `requirements/` subfolder, not at the build root — verified on disk, both halves fixed. `execution-discipline` is named as the sibling seat in this plugin rather than pathed at the retired vault `_meta/skills/`. The versioning model itself is untouched; the standard in `02 analysis/` remains canonical and did not move. First entry here; earlier versions are unrecorded.
