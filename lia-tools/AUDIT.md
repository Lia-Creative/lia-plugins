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

## What happens to the losing copies

Nothing yet, deliberately — LIAB-919's freeze holds: the vault copies stay in place behind the dated pointer banner in `_meta/skills/README.md`, and the claude.ai plugins/standalones stay live for Cowork until the new plugin is proven on that surface. **LIAB-924 retires them**; deleting anything before then recreates the drift this file exists to end.
