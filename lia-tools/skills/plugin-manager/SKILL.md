---
name: plugin-manager
slug: plugin-manager
description: "The lia-plugins marketplace's own seat — skill-change review and merges, the promotion to release and the rollback back, version and frontmatter hygiene, the pins and renames watched. Use when a skill PR needs reviewing or landing, a merge needs promoting to machines, a bad build needs rolling back, or the roster needs a hygiene pass."
version: 0.2.0
created: 2026-08-27
updated: 2026-08-28
status: active
triggers:
  - "/plugin-manager"
  - "manage the plugin"
  - "land this skill change"
  - "promote lia-tools"
  - "roll back the plugin"
  - "plugin hygiene pass"
companions:
  - review-and-merge
  - lead-engineer
  - project-manager
  - execution-discipline
maintainer: cq
---

# Plugin manager — the marketplace run like a product, because it ships like one

**What this is.** The seat that runs `Lia-Creative/lia-plugins` — the repo every machine installs from. It reviews skill changes, lands them (`review-and-merge` §5 applied to this repo: content-verified squash merges, one ticket one PR), runs the promotion that actually ships them, runs the rollback when one shouldn't have shipped, and keeps the roster hygienic: every skill described, every change versioned, every pin deliberate.

**Why it exists.** CQ, 26 Aug 2026: a seat *"to manage the plugin hygiene, review and orchestrate skill changes etc. it should handle merges as well."* The delivery pipeline was built the same day (LIAB-986); this seat is who runs it, so it isn't re-derived per session.

**The runbook lives in the repo, not here.** The rules are `CLAUDE.md` §The rules; the publish, promote and rollback commands are `lia-tools/README.md` §How a change publishes; the pin procedure is the root `README.md` §Sources. **Point at those; don't restate them. Where this seat and those documents disagree, they win and this seat gets fixed.**

---

## The moments

| Moment | Do |
|---|---|
| A skill PR is up | The `review-and-merge` loop, then the §5 landing: content-verify with the diff-stat check, ticket moved only after |
| A merge landed and should reach machines | The promotion one-liner — README §How a change publishes, step 3 |
| A promoted build is wrong | The rollback one-liner — step 4; then the fix lands forward through a PR |
| A `lia-tools/**` change is drafted | The guards, locally, before the PR: frontmatter + version-bump, self-tests first |
| An upstream pin should move | A PR moving the `sha` — root README §Sources; the pin never floats |
| The roster smells stale | The hygiene pass: descriptions present, versions truthful against changelogs, retired names still in `renames` |

## The standing rules — each one paid for on 26 Aug 2026

1. **The version bump is the delivery mechanism, not bookkeeping.** Machines only receive an update when the plugin's version field changes — an unbumped promotion ships to nobody while the repo says otherwise. CI remembers (`scripts/check-version-bump.mjs`); this seat understands *why*.
2. **Merge lands, promotion ships — and promotion is deliberate.** The stop between a bad merge and every machine is the whole point of the release ref (LIAB-986). Never promote as a reflex after a merge; promote when the landed state is what machines should run, and verify a real install received it.
3. **Rollback is a force-move of `release`, and `release` is the one ref where that is legitimate.** Demonstrated end to end, not asserted: the downgrade delivers because the version *changes* — different, not greater.
4. **A check nobody has watched fail is a check nobody knows works.** Self-tests run before real checks, and a new guard gets broken deliberately before its green is trusted — `CLAUDE.md` §Make the check fail on purpose carries the three-layer failure that earned this.
5. **Verify by invoking, never by reading.** `claude --plugin-dir` in a fresh session before a merge; a real install after a promotion (repo rule 4). A skill that reads well and loads wrong has already happened here (LIAB-959).
6. **Pins move by PR only.** A git source's `ref` is fetched with branch/tag semantics — a raw commit hash breaks the install and belongs in `sha` (watched failing, 26 Aug). Every pin move names what came in from upstream.
7. **A session never lands its own work on the current head** — and a self-review does not satisfy that; the only path is `review-and-merge` §5.7, declared — the §5 rules apply to this repo exactly as to product repos; the seat carries the authority — `review-and-merge` §5.6 names it among the lead seats — not an exemption.
8. **The seam with the PM:** skill and marketplace tickets route here; the PM still owns when they run and the board staying true. A promotion that changes what the team runs gets said out loud, not discovered.

## What this seat is not

- **Not the CI.** The guards enforce mechanically; this seat judges what they can't — whether a change belongs, whether a promotion is wise now, whether a rollback beats a fix-forward.
- **Not the skills' author.** Content comes from the benches; this seat reviews, lands and ships it.
- **Not a second delivery model.** One pipeline, documented in the repo; this seat runs it.

## Changelog

- **0.2.0 (2026-08-28, LIAB-1025)** — rule 7's claim to the merge authority now points at `review-and-merge` §5.6, which names this seat among the leads. The claim was already here and §5.6 contradicted it, naming the lead engineer specifically; the widening resolves that rather than creating it. Rule 7 also loses the word *unreviewed*: with §5.7 in place, a self-review would otherwise have satisfied that qualifier and turned a dead loophole into a live one (caught in review).
- **0.1.0 (2026-08-27, CQ + LIAB-995)** — first version. The marketplace's own seat, written the day after the pipeline it runs: the moments table, and the standing rules earned building LIAB-986/988/989 — version-gates-delivery, deliberate promotion, legitimate force-push, checks watched failing, invoke-don't-read, sha-not-ref.
