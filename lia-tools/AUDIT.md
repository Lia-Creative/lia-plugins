# Roster audit — every skill's current copy, named (LIAB-918)

The verdict file LIAB-918 requires — in the repo, so the next restructuring session doesn't re-derive it. Measured 26 Aug 2026 with `cmp` / `diff -rq` / `wc -c` on every reachable channel: the Lia Vault `_meta/skills/`, the claude.ai plugins (materialised per session under `local-agent-mode-sessions/*/rpm/plugin_<id>/`), the claude.ai standalone skills, and this repo.

## The winners — all of them the vault's copy

| Skill | Winner | The measurement |
| -- | -- | -- |
| `ticket-builder` | vault **0.4.0, updated 26 Aug** (26,523 B) | The three-way split resolved by **content**, not version numbers: the git marketplace copy also claims 0.4.0 but is dated 5 Aug (23,844 B) — its "extra 3 KB" is the older long-form shape sections that the 25 Aug canonical doc replaced with pointers, so it was **dropped deliberately, nothing merged**: keeping it would restate what the shape doc now owns, which is the drift this whole epic exists to end. lia-build copy 20,459 B (exported at 0.3.1); standalone 19,720 B (0.3.0). |
| `ticket-review` | vault 0.2.1 (6,181 B) | lia-build copy 5,595 B, older export. |
| `pickup` | vault 0.6.0 (14,914 B) | lia-build copy 14,802 B, older export. |
| `wrap-up` | vault 1.2.0 (14,298 B) | standalone 9,786 B, far older. |
| `backlog-grooming` | vault 0.1.0 (9,474 B) | standalone 8,904 B. |
| `orchestrate` | vault 0.1.0 (14,650 B) | sole copy — in no plugin before this repo. |
| the toys eight (`new-toy` · `toy-pickup` · `toy-status` · `toy-tidy` · `toys-digest` · `toy-jam` · `toy-feedback-ingest` · `adventure-chat-ingest`) | vault == claude.ai `lia-toys` 0.3.0, **byte-identical** (re-verified 26 Aug) | either copy is the winner; the vault's was used. |
| `toy-release` | vault 0.2.0 (6,601 B) | standalone 6,168 B. In no Lia plugin before this repo. |
| `ui-capture` | vault 0.3.0 (12,577 B) **+ `reference/` + `scripts/`** | standalone 11,166 B, and without the bundles. |
| `ui-teardown` | vault 0.2.1 (7,651 B) + `reference/` | standalone 7,192 B. |
| `execution-discipline` | vault 1.1.0 (11,135 B) | sole copy. Added to the roster (argued on LIAB-921): the load-first judgment layer every seat names; a vault-less builder couldn't load it. |

All winners are in `skills/` as of PRs #2, #5, #4 and #6, each move `cmp`/`diff -rq`-verified against its source at copy time. The 26 Aug tool-shop changes (`story-writer` 0.2.0, `ready-review` 0.2.0, the seat split, the new seats) were **content work layered on top of the named winners** — tracked on LIAB-943/949/950, not part of this audit.

## The two decisions, not diffs

- **`ticket-engineering` (claude.ai standalone 3.0.0, no vault copy): OUT as a skill, absorbed as discipline.** Its 6-criteria entry gate lives on in `build-prep` + `ticket-review` (the pickability check) + the vault's dev-ready checklist; its 4-point completion gate lives on in `review-and-merge` and the QA stage's real-data proof. Bringing the file in whole would have restated Cursor-era mechanics beside the seats that superseded them. The standalone remains Chris's claude.ai skill until the LIAB-924 retirement review looks at it.
- **`excalidraw-diagram` ships in both `cq` 0.5.0 and `chris-quinton-diagrams` 0.2.0** — same defect class, out of this plugin's scope (personal bundles). Flagged for Chris here and on the ticket; nothing moved.

## The retirement (LIAB-924)

**Started 26 Aug 2026.** LIAB-919's freeze held until the plugin was proven on the
surface we actually publish to; [LIAB-924](https://linear.app/lia-creative/issue/LIAB-924)
retires the copies it replaced. The ordering rule is unchanged: **nothing is
deleted before its replacement is live.**

Cowork was dropped as a publish target in the same pass. That removes the surface
LIAB-922 existed to keep in sync, and it removes the only channel that needed a
hand-built `.plugin` zip. Claude Code — CLI, desktop, and cloud/web sessions —
is the whole distribution story now.

### Done in this repo

| What | State |
|---|---|
| `ticket-builder/` standalone plugin | **Removed.** Superseded by `lia-tools`' `ticket-builder` 0.5.1. Its unique 3 KB was resolved by LIAB-918 above — the older long-form shape sections, dropped deliberately because the canonical shape doc now owns them. |
| `.claude-plugin/marketplace.json` entry | **Removed**, with `renames: {"ticket-builder": null}` so existing installs migrate instead of dangling. `squeaks` got the same treatment retroactively — it was removed on 26 Aug (LIAB-962) without one. |
| `ticket-builder/skills/ticket-builder/handover-2026-06-25.md` | Not carried forward. It is a session handover from the v0.3.0 review (LIA-388), not skill content, and shipping it to every install was never right. It lives in git history at `3f719c4` and earlier. **If it matters, it belongs in the vault** — say so and it gets moved rather than left in a commit. |
| Publish sequence in `README.md` | Rewritten for one surface. The three-surface table is gone. |

### The shadowing is real, and it was measured here

Not inferred — observed in a Claude Code session on 26 Aug 2026, which loaded 36
skills from the account's synced standalone skills at `~/.claude/skills/synced/`.
**The `lia-tools` plugin was not installed in that session at all.** Thirteen of
the synced skills duplicate this roster, and eight were behind:

| Skill | This repo | The synced standalone the session actually loaded |
|---|---|---|
| `ticket-builder` | 0.5.1 (26 Aug) | **0.3.0 (25 Jun)** — predates the writer-seat split entirely |
| `ui-capture` | 0.3.0 | 0.2.0 |
| `ui-teardown` | 0.2.1 | 0.2.0 |
| `backlog-grooming` | 0.1.1 | 0.1.0 |
| `new-toy` | 0.1.1 | 0.1.0 |
| `toy-feedback-ingest` | 0.1.1 | 0.1.0 |
| `wrap-up` | 1.2.2 | **no `version:` field at all** |
| `toy-jam` · `toy-pickup` · `toy-release` · `toy-status` · `toy-tidy` · `toys-digest` | current | same version — matching today, unguarded tomorrow |

A session asked to build a ticket there would have used the June standard,
confidently, and nothing would have said so. **This is the drift this file exists
to end, still running.** Plugin skills are namespaced (`/lia-tools:ticket-builder`)
and standalones are not, so the two coexist rather than one overriding the
other — which is worse, not better.

### The switch-off list — Chris's action, in claude.ai settings

Fourteen standalone skills to disable, each with what replaces it. Nothing here
needs a decision except the last row.

| Disable this standalone | Replaced by |
|---|---|
| `backlog-grooming` | `lia-tools` → `backlog-grooming` 0.1.1 |
| `new-toy` | `lia-tools` → `new-toy` 0.1.1 |
| `ticket-builder` | `lia-tools` → `ticket-builder` 0.5.1, plus the seats it routes to (`epic-builder`, `story-writer`, `task-writer`) |
| `toy-feedback-ingest` | `lia-tools` → `toy-feedback-ingest` 0.1.1 |
| `toy-jam` | `lia-tools` → `toy-jam` 0.1.0 |
| `toy-pickup` | `lia-tools` → `toy-pickup` 0.1.0 |
| `toy-release` | `lia-tools` → `toy-release` 0.2.0 |
| `toy-status` | `lia-tools` → `toy-status` 0.1.0 |
| `toy-tidy` | `lia-tools` → `toy-tidy` 0.1.0 |
| `toys-digest` | `lia-tools` → `toys-digest` 0.1.0 |
| `ui-capture` | `lia-tools` → `ui-capture` 0.3.0 (**and** its `reference/` + `scripts/` bundles, which the standalone never had) |
| `ui-teardown` | `lia-tools` → `ui-teardown` 0.2.1 (+ `reference/`) |
| `wrap-up` | `lia-tools` → `wrap-up` 1.2.2 |
| `ticket-engineering` | **Disable — CQ's call, 26 Aug 2026.** No 1:1 replacement; absorbed as discipline, its 6-criteria entry gate into `build-prep` + `ticket-review` and its completion gate into `review-and-merge`. The Cursor-era mechanics go with it, deliberately. |

And the two claude.ai plugins, same action, same place: **`lia-build` 0.2.0** and
**`lia-toys` 0.3.0** — both superseded whole by `lia-tools`. Leave `cq`,
`chris-music`, `file-runner` and `chris-quinton-diagrams` alone; personal
bundles, out of scope.

### Before switching anything off

**A session must be able to reach the replacement, or disabling the standalone
just removes the skill.** Two prerequisites, in this order:

1. `lia-tools` installed and loading in the Claude Code you actually use — proven by invoking a skill, not by reading a list.
2. For **cloud and web sessions**, the `.claude/settings.json` declaration in [README.md](README.md#the-one-gap-worth-knowing-about), in each repo those sessions open. They have no `/plugin` command, so without it they have no path to the plugin at all — and today they are being fed by exactly the standalones this list disables.

**Dropping Cowork makes this sharper, not softer.** These fourteen skills will
not exist in Cowork afterwards: no plugin there, and no standalone either. If any
of them earns its keep in a Cowork session — `toys-digest` on its Monday
schedule is the obvious candidate — that is a reason to keep the standalone or
move the work to Claude Code, and it is a decision to make deliberately rather
than discover.

### The vault

`_meta/skills/`'s roster directories come out, and `_meta/skills/README.md`
records where they went, when, and why — an empty directory with no note is how
the next person concludes they were lost. **What stays is as deliberate as what
goes:** the research skills (`discover`, `enrich`, `research-*`, `wiki-ingest`,
`slack-ingest`) and the one-offs were never part of this roster. The README
should say so. Not doable from a build machine — Chris's, on his own filesystem.

### The unbacked personal skills — inventory, with a recommendation

LIAB-924 asked where these came from and whether they should be somewhere
durable. They are claude.ai standalone skills, they are not in this repo, and
LIAB-924 established none of their `SKILL.md` files is in the vault. Several
*reference* vault paths as the canonical source of their **assets** — that is a
different thing from the skill itself being backed up.

| Skill | Version | Reading |
|---|---|---|
| `chris-vault-lint` | 0.4.0 | Names a canonical source in the vault — confirm whether that covers the `SKILL.md` or only what it lints. |
| `design-system` | — | Names `02 studio/chris quinton/design-system/` as canonical for its **tokens and style guide**. The skill file itself still needs a home. |
| `voice-note-transcription` | 0.1.0 | Names a canonical source; machine-specific (runs on `chris-mac-mini`). |
| `creative-retro-jam` · `recording-description` · `unlisted-youtube-upload` · `shoot-planning` · `morning` | — | Write into the vault, aren't backed by it. One copy, no history, no backup. |
| `writing-style-core` · `writing-style-social` | — | Also ship in the `cq` plugin, so these two are backed. Named here so it isn't a surprise later. |

**Recommendation: a `cq-skills` repo, not this one.** They fail this plugin's
membership test — *does an agent building a lia.tools product need it?* — but
they pass the one that matters here: they exist in exactly one place, editable
from a web UI, with no history and no diff. A git repo with the same PR shape as
this one fixes that without mixing personal tooling into the build plugin. Which
repo is Chris's call; that they need one is not.
