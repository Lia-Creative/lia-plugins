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

### The renames migration, watched working (LIAB-989)

The `renames: {"ticket-builder": null, "squeaks": null}` block was written on
faith in a docs page; nobody had watched a machine holding a retired plugin go
through it. Watched on 26 Aug 2026 — real `claude` CLI 2.1.246, isolated
config, marketplace served from this repo at `5ba29ed` (ticket-builder still
listed), then updated to `83d8f0d` (renames live):

- **At `claude plugin marketplace update` time**, the
  `"ticket-builder@lia-plugins": true` key is dropped from the machine's
  `enabledPlugins` — the settings rewrite the docs promise is real and
  immediate.
- **The next session loads nothing from it.** `claude plugin list` shows the
  plugin **disabled**, annotated `Removed from the "lia-plugins" marketplace`.
- **It is a disable, not an uninstall.** The cached copy stays in the list
  with that note. `claude plugin uninstall ticket-builder@lia-plugins` is
  optional tidy-up, not a required manual step — nothing dangles, nothing
  breaks, and auto-update's marketplace refresh triggers the same migration
  with no command typed *(conditional, and the condition does not hold on CLI or desktop — see README §How a change publishes, step 3. This migration was watched working on a manual update; the sentence is left as written because it is a dated record of what was tested)*.

Caveats, recorded rather than rounded off: observed at **user scope**, which
is how team machines install. A managed-settings install cannot be rewritten
(per the docs) and would re-notify until an admin updates managed settings —
not our case today. `squeaks` rides the identical mechanism; `ticket-builder`
is the observed instance. A team-machine spot check on the next real
promotion confirms what the clean room predicts.

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

**The versions below are minimums, not pins** — they name what the replacement
was at or after the moment this row was written, and a later bump only makes the
replacement newer. Read them as "this version or later"; a row is wrong only if
the plugin's copy is *behind* it. (The table above is the opposite: a dated
measurement, left as the record.)

| Disable this standalone | Replaced by |
|---|---|
| `backlog-grooming` | `lia-tools` → `backlog-grooming` 0.1.1 |
| `new-toy` | `lia-tools` → `new-toy` 0.1.1 |
| `ticket-builder` | `lia-tools` → `ticket-builder` 0.5.1, plus the seats it routes to (`epic-builder`, `story-writer`, `task-writer`) |
| `toy-feedback-ingest` | `lia-tools` → `toy-feedback-ingest` 0.1.2 |
| `toy-jam` | `lia-tools` → `toy-jam` 0.1.0 |
| `toy-pickup` | `lia-tools` → `toy-pickup` 0.1.0 |
| `toy-release` | `lia-tools` → `toy-release` 0.2.0 |
| `toy-status` | `lia-tools` → `toy-status` 0.1.0 |
| `toy-tidy` | `lia-tools` → `toy-tidy` 0.1.0 |
| `toys-digest` | `lia-tools` → `toys-digest` 0.1.0 |
| `ui-capture` | `lia-tools` → `ui-capture` 0.3.0 (**and** its `reference/` + `scripts/` bundles, which the standalone never had) |
| `ui-teardown` | `lia-tools` → `ui-teardown` 0.2.1 (+ `reference/`) |
| `wrap-up` | `lia-tools` → `wrap-up` 1.2.3 |
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

---

# After the audit — the 28 skills added since (LIAB-1003)

The tables above are a dated measurement of the LIAB-918 roster and are **not a
live list** — nothing here edits them. But `AUDIT.md` answers one question per
skill (*which copy won, and how do we know*) so a later session doesn't re-derive
it, and by 28 Aug 2026 **34 of the 52 skills had no answer recorded**.

The gap was larger than it looked, twice over. The ticket named 13 from two PRs.
Listing `skills/` and grepping this file for each name found 28 — and **that
count was still wrong**, because a grep for the name matches a skill *mentioned*
anywhere, including as a destination in someone else's row. Six seats named at
the end of §The winners as *"not part of this audit"* (`epic-builder`,
`story-writer`, `task-writer`, `ready-review`, `build-prep`, `review-and-merge`)
were therefore counted as covered while having no origin recorded anywhere. A
reviewer caught it. **The check's blind spot was in the shape of what it
enumerated** — mentions, not rows — which is the same failure this file keeps
recording about guards, arriving in a hand-grep. The six are answered below.

**Every row here was established from the repo, not from memory:** the commit
that first added each `SKILL.md` (`git log --diff-filter=A`) and that skill's
own earliest changelog entry.

**The PR numbers were confirmed against `gh pr view`, not inferred.** They are
the one column here that cannot be established from the repo alone — three of
these merge commits carry no `(#NN)` in their subject. Confirmed: #19 → `8826a17`,
#20 → `c9603e4`, #22 → `7819b12`, #25 → `6f49080`.

One of them reads like a contradiction and is not, so it is written down once:
`CLAUDE.md` rule 8 says the unloadable `ux-writing/references/*.md` diff *"passed
green on PR #20 (LIAB-1005)"*, while the table below attributes #20 to
`design-reference`. Both are true — those files sat on **PR #20's branch** and
were removed before it merged, which is what rule 8 means by *"it never reached
`main`: a human reading the diff stopped it."* PR #20's merged file list contains
no `ux-writing` path; the guard that came out of it is PR #21.

**The dates are commit dates, not authoring dates**, and the two differ. A first
draft of this table said `ux-writing` landed 27 Aug because its changelog entry
is dated 27 Aug; `7819b12` is dated the 28th. Caught in review, and every other
date in the table re-checked against `git log` afterwards rather than only the
one that was reported.

## New writing, no competing copy

Nothing was superseded — these were written for this plugin and have never
existed anywhere else. The answer to *which copy won* is *there was only one*.

This includes the tool-shop seats that §The winners set aside as *"content work
layered on top of the named winners … not part of this audit"*. That was right
for a roster audit of competing copies — there were none to compare — but it
left six seats named and unanswered, which is not the same as answered *"new
writing"*. Saying so explicitly is the row.

| Landed | Skills |
|---|---|
| `436b2b6` — tool shop 1.0, the writer seats + the ready gate (26 Aug, CQ voice memos + Fable 5) | `epic-builder` · `story-writer` · `task-writer` · `ready-review` |
| `a886164` — tool shop 1.1, the seats filled (26 Aug, CQ voice memos + Fable 5) | `acceptance-criteria` · `architecture` · `build` · `build-prep` · `jtbd` · `lead-engineer` · `polish` · `problem-definition` · `project-manager` · `review-and-merge` · `scenario-builder` · `schema-manager` · `security` |
| `555986a` — the toys nine + the design pair, 1.2.0 (26 Aug, LIAB-921) | `design-handoff` |
| `7a73874` — the other benches, PR #18 (27 Aug, LIAB-995) | `design-exploration` · `design-flows` · `design-lead` · `discovery-lead` · `error-states` · `hifi-design` · `plugin-manager` |
| `c9603e4` — PR #20 (27 Aug, LIAB-1000) | `design-reference` |
| `7819b12` — PR #22 (**28 Aug**, LIAB-1004) | `ux-writing` |
| PR #34 (28 Aug, LIAB-1028) | *(none — both skills in this PR were ports; see §The later ports)* |
| `6f49080` — PR #25 (28 Aug, LIAB-1008) | `file-management` |
| the research bench (**29 Aug**, LIAB-1023) | `research-lead` · `researcher` · `research-problem` · `research-solution-space` · `research-solution-patterns` · `research-psychology` · `research-strategy` · `research-competitors` · `research-brand` · `research-ux-patterns` · `research-technology` · `research-schema-scrape` · `research-insights` |
| the QA bench (**29 Aug**, LIAB-1024) | `testing-lead` · `test-analyst` · `tester` · `rogue` · `bug-writer` |

**The research bench needs its second and third answers spelled out, because one
of them looks like a port and is not.** Where it came from: CQ's LIAB-1023, the
seat structure and the ten domains taken from the ticket, written fresh for this
plugin. What it superseded: **nothing** — and specifically **not the vault
research engine**. `research-plan`, `research-run`, `research-verify`,
`research-library` and `acquired-ingest` remain canonical in the vault for vault
research and its claims library; none of them was copied, adapted or read into
these files. How that was established: the README's *What doesn't belong here*
still excludes them by name, and the bench's own skills say so in their
*What this seat is not* sections — the two copies answer different questions
(a ticket's commission, filed beside a product; versus vault research, filed in
the vault's library), which is why both can be live without the drift LIAB-918
spent a ticket undoing. `research-insights` is the one seat with a plugin
neighbour: it **loads** `insight-extraction` as its method rather than restating
it, so there is one copy of that rubric, in the seat that already owned it.

**The QA bench**: from CQ's LIAB-1024, seats and all, written fresh. It
superseded nothing — the plugin had no QA seat, and the pipeline's QA stage had
named no crew since it was written. Established by the same reading that raised
the overlap question on the ticket: `review-and-merge` reviews code against its
criteria before a merge, `ticket-review` checks pickability before dispatch, and
the toys' own testing loop handles bugs reported by real people afterwards — none
of them tests the merged build, which is the gap this bench fills. The one shape
it deliberately does **not** invent is the bug: `bug-writer` adopts the house bug
convention and hands over to
[LIAB-967](https://linear.app/lia-creative/issue/LIAB-967)'s template when it
lands, so QA-found and user-reported bugs stay one population.

## Ports out of the vault — PR #19, LIAB-997

These **supersede a `_meta/skills/` copy that CLAUDE.md rule 1 now freezes.**
The version at the moment of the port is recorded so the freeze has a record,
and so a future sync attempt has something concrete to refuse against.

| Skill | Frozen vault copy | Vault version | Plugin version at 28 Aug |
|---|---|---|---|
| `product-retro` | `Lia Vault/_meta/skills/product-retro/` | `1.0.0` | `1.2.0` |
| `prototype-feedback-loop` | `Lia Vault/_meta/skills/prototype-feedback-loop/` | `0.5.0` | `0.6.0` |
| `synthetic-users` | `Lia Vault/_meta/skills/synthetic-users/` | `2026-06-25` (pre-semver) | `1.0.0` |
| `lia-voice-check` | `Lia Vault/_meta/skills/lia-voice-check/` | `0.1.0` | `0.2.4` |

**The vault copies still exist and are not to be deleted** — LIAB-919's freeze
holds. They are frozen, not canonical: every one of them is now behind, which is
the point. Never sync *from* them.

*(Vault versions were re-read from `Lia Vault/_meta/skills/` on 28 Aug 2026 by
the session that wrote this row — that vault **was** mounted, unlike Chris's
personal one below. They are current as at that date; the plugin versions move,
so treat the right-hand column as the moment of this row, not a live figure. A
reviewer without the Lia Vault mounted cannot re-check this column, which is why
it says who read it and when.)*

## The later ports — PR #34, LIAB-1028

CQ's call, 28 Aug 2026, closing the roster question carried in every handover
since PR #19. `figma-dls-build` was considered and **stays out**.

| Skill | Came from | Version at the port | What happened to it |
|---|---|---|---|
| `doc-iteration-loop` | `Lia Vault/_meta/skills/doc-iteration-loop/` | `0.1.0` | Copied **byte-identical** (`cmp` clean on `SKILL.md` and all three templates) **and then repaired**, because the source carried four defects. It had **no `description:`** — the field a session's skill listing shows and auto-triggering runs on, so it would have installed invisible and CI would have refused it. Its templates and ticket prompt pointed at retired `_meta/skills/` paths a plugin install cannot reach, and one bare relative path (`execution-discipline/SKILL.md`) that nothing resolves. **Its frontmatter said `version: 0.1.0` while its changelog's newest entry was `0.2.0`** — one skill, two answers, the exact failure rule 3 exists to stop; it lands here as **0.3.0**, following the changelog. And **21 escaped apostrophes** — 14 in `SKILL.md`, 4 in `gate-rubric.md`, 3 in `ticket-prompt.md`, none in `execution-order.md`. Method unchanged. Vault copy frozen per rule 1. *(The port was faithful and the defects are the source's — worth recording, because "copied byte-identical" and "arrived correct" are not the same claim.)* |
| `decision-check` | `cq` 0.5.0 (`chris vault/00 inbox/_agent/cq-install/cq.plugin`, 28 Jul 2026) | `0.1.0` in `cq`, unversioned frontmatter | **Rewritten, not moved.** The original ran on *"Chris's slow-brain check"*, triggered on *"when Chris says"*, and closed with *"don't make the decision for Chris"*. A straight port would have put one founder's habit in a shared roster. The five checks are unchanged; the framing is now the seat, and the 13 May reset is kept as attributed provenance. |

**On `decision-check` specifically:** this is the "which copy won" question with a
real answer for once. The `cq` copy is **superseded, not synced from** — it stays
in Chris's bundle and will drift; this one is canonical for Lia work. The two are
no longer the same skill, and that is deliberate.

## Ports out of Chris's personal `cq` bundle — PR #19, LIAB-996

| Skill | Source artifact | What was left behind |
|---|---|---|
| `feature-definition` | `cq.plugin` v0.5.0, 28 Jul 2026 | recorded in the skill's own §"What was not ported" |
| `insight-extraction` | `cq.plugin` v0.5.0, 28 Jul 2026 | recorded in the skill's own §"What was not ported" |

The artifact is a plain zip at `chris vault/00 inbox/_agent/cq-install/cq.plugin`
— **cited from the LIAB-996 record, not re-verified in this pass: Chris's
personal vault was not mounted in the session that wrote these rows.** Anyone
re-checking should mount it and confirm before relying on the path. LIAB-996 had
been parked on the premise that a claude.ai upload cannot be read from a
filesystem, which is true of the upload and false of this artifact.

## Renamed — the same content under its discipline's name (LIAB-1161)

A rename is a new directory, so rule 9 asks its question here too. The answer is
that nothing competed: the content moved whole and its changelog says so.

| Skill | Where it came from | What it superseded | How that was established |
|---|---|---|---|
| `engineering-lead` | `lead-engineer` 0.6.0 (lineage `a886164`), renamed 2 Sep 2026 so the seat is named by its discipline like the other four leads | nothing — same content, continued as 0.7.0; `lead-engineer/` stays one release as a pointer, the `orchestrate` precedent | `git log --follow lia-tools/skills/engineering-lead/SKILL.md` |

## When a row is owed

**Every PR that adds a skill owes its row here, in that PR.** Not afterwards, and
not in a follow-up ticket — this section exists because eight PRs' worth of
additions each looked too small to be worth a line, and the answer to *where did
this come from* then costs an archaeology session instead of a sentence.

A row is three things: **where it came from · what it superseded (or that
nothing did) · how that was established.** One line is a complete row when the
answer is *new writing, no competing copy*.

This is `CLAUDE.md` rule 9, so it is a repo rule rather than something to
remember. Nothing enforces it mechanically — a guard that reads intent would
have to know what a skill's provenance *is* — so it is a review question, and
`review-and-merge`'s reviewer is the one who asks it.
