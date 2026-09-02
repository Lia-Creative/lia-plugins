---
name: plugin-manager
slug: plugin-manager
description: "The lia-plugins marketplace's own seat — skill-change review and merges, the promotion to release and the rollback back, version and frontmatter hygiene, the pins and renames watched, and MANUAL.md kept true for the humans who read it. Use when a skill PR needs reviewing or landing, a merge needs promoting to machines, a bad build needs rolling back, the roster needs a hygiene pass, or the manual has gone stale."
version: 0.6.0
created: 2026-08-27
updated: 2026-09-02
status: active
triggers:
  - "/plugin-manager"
  - "manage the plugin"
  - "land this skill change"
  - "promote lia-tools"
  - "roll back the plugin"
  - "plugin hygiene pass"
  - "update the manual"
  - "is the manual still right"
companions:
  - review-and-merge
  - engineering-lead
  - project-manager
  - execution-discipline
maintainer: cq
---

# Plugin manager — the marketplace run like a product, because it ships like one

**What this is.** The seat that runs `Lia-Creative/lia-plugins` — the repo every machine installs from. It reviews skill changes, lands them (`review-and-merge` §5 applied to this repo: content-verified squash merges, one ticket one PR), runs the promotion that actually ships them, runs the rollback when one shouldn't have shipped, and keeps the roster hygienic: every skill described, every change versioned, every pin deliberate. It also owns [`MANUAL.md`](../../MANUAL.md) — the one document written **for a person** rather than for an agent, and therefore the one that goes stale silently.

**Why it exists.** CQ, 26 Aug 2026: a seat *"to manage the plugin hygiene, review and orchestrate skill changes etc. it should handle merges as well."* The delivery pipeline was built the same day (LIAB-986); this seat is who runs it, so it isn't re-derived per session.

**The runbook lives in the repo, not here.** The rules are `CLAUDE.md` §The rules; the publish, promote and rollback commands are `lia-tools/README.md` §How a change publishes; the pin procedure is the root `README.md` §Sources. **Point at those; don't restate them. Where this seat and those documents disagree, they win and this seat gets fixed.**

---

## The moments

| Moment | Do |
|---|---|
| A skill PR is up | The `review-and-merge` loop, then the §5 landing: content-verify with the diff-stat check, ticket moved only after |
| A merge landed and should reach machines | The promotion one-liner — README §How a change publishes, step 3 |
| A promoted build is wrong | The rollback one-liner — step 4; then the fix lands forward through a PR |
| A `lia-tools/**` change is drafted | The guards, locally, before the PR: frontmatter + version-bump, self-tests first. Then the size question — usually a patch (README §Versioning) |
| An upstream pin should move | A PR moving the `sha` — root README §Sources; the pin never floats |
| The roster smells stale | The hygiene pass: descriptions present, versions truthful against changelogs, retired names still in `renames` |
| A seat's After Action Report proposes a skill or template change | The bench's lead raises the PR; this seat runs the `review-and-merge` loop and lands it — with the version bump, the changelog line and the provenance row the repo rules require |
| A change lands that makes a section of `MANUAL.md` wrong | The manual is fixed **in that same PR** — rule 9. A doc-drift ticket is what you file when you missed it, not the plan |
| A promotion is about to run | `MANUAL.md`'s changelog table gains the released version's row, and its version stamp moves. A promotion whose row is missing is a release nobody outside this repo can read |
| A reader reports the manual is wrong | The plugin wins. Verify against the skills and the repo, then fix the manual — never the other way round, and never by arguing the reader misread it |

## The standing rules — each one paid for

1. **The version bump is the delivery mechanism, not bookkeeping.** Machines only receive an update when the plugin's version field changes — an unbumped promotion ships to nobody while the repo says otherwise. CI remembers (`scripts/check-version-bump.mjs`); this seat understands *why*.
2. **Merge lands, promotion ships — and promotion is deliberate.** The stop between a bad merge and every machine is the whole point of the release ref (LIAB-986). Never promote as a reflex after a merge; promote when the landed state is what machines should run, and **verify a real install received it** — which is not a formality, because **auto-update does not deliver on a CLI or desktop machine.** `DISABLE_AUTOUPDATER=1` is set in that session environment and the plugin pass returns on it before the marketplace's own `autoUpdate` flag is read, so both settings can be correct while nothing updates (measured 28 Aug 2026: 1.6.1 installed against a released 1.8.0). Cloud and web sessions are the exception — they provision fresh each time and run whatever `release` serves — so *"it updated for me"* from a cloud session is not evidence about anyone's laptop. A promotion is not delivered until an install has been pulled and invoked. Full account: README §How a change publishes, step 3.
3. **Rollback is a force-move of `release`, and `release` is the one ref where that is legitimate.** Demonstrated end to end, not asserted: the downgrade delivers because the version *changes* — different, not greater.
4. **A check nobody has watched fail is a check nobody knows works.** Self-tests run before real checks, and a new guard gets broken deliberately before its green is trusted — `CLAUDE.md` §Make the check fail on purpose carries the three-layer failure that earned this.
5. **Verify by invoking, never by reading.** `claude --plugin-dir` in a fresh session before a merge; a real install after a promotion (repo rule 4). A skill that reads well and loads wrong has already happened here (LIAB-959).
6. **Pins move by PR only.** A git source's `ref` is fetched with branch/tag semantics — a raw commit hash breaks the install and belongs in `sha` (watched failing, 26 Aug). Every pin move names what came in from upstream.
7. **A session never lands its own work.** No qualifier: a self-review does not satisfy it, and the only path is `review-and-merge` §5.7, declared. The §5 rules apply to this repo exactly as to product repos, and the seat carries the authority — §5.6 names it among the lead seats — not an exemption.
8. **The seam with the PM:** skill and marketplace tickets route here; the PM still owns when they run and the board staying true. A promotion that changes what the team runs gets said out loud, not discovered.
9. **`MANUAL.md` is part of the change, never a follow-up.** Every other artifact this seat guards has a machine watching it — frontmatter, the roster, the version bump, the Cursor mirror. **The manual has none, and it cannot have one:** no guard can read whether a paragraph still describes what a skill does. So it goes stale the ordinary way, silently, and the first person to notice is a newcomer who follows an instruction that no longer works — which is the one reader who cannot tell the manual is wrong rather than themselves.

   **Four things make it stale, and each is caught by asking rather than by CI:** an install, update or promotion command changes · a bench gains or loses a seat, or a lead's routing moves (§What You Get's counts and §How the Agent Teams Work Together both name them) · a rule a person is told to follow changes — who merges, what disposes of a criterion, where feedback goes · **a version promotes**, which always owes its changelog row and the version stamp at the top. Ask the four before landing any `lia-tools/**` PR; the answer is usually no, and the cost of asking is a sentence.

   Two directions this rule does not run. **The manual never becomes the source.** It restates for a person what `CLAUDE.md`, the skills and the Linear documents own; where it disagrees with them, they win and the manual gets fixed — the same subordination rule this seat lives under itself. And **a reader is never wrong about their own confusion**: a report that a section did not make sense is a defect in the section, whatever the section technically says.
10. **The size of the bump is a claim about the change.** Take the smallest bump that is true — **patch** it got better, **minor** it does something new, **major** something that worked stops working — and move exactly one step: from `X.Y.Z` only `X.Y.(Z+1)`, `X.(Y+1).0`, `(X+1).0.0`. Patch is the ordinary answer here, because the ordinary change is a skill that already exists getting better; a minor means the roster moved or a skill's job did. Rule 1 says the bump *delivers*; this says what it *claims*, and they are not the same duty. **A number is not yours until it lands:** the guard also refuses a version the base ref already serves, because two branches picking the same one merge without a conflict and deliver nothing. CI holds the step and the collision **on the runs it gets** — it does not re-run when the base moves, so a green tick can be stale about a number someone took since; **no check can hold the table**, so this seat is where the size is judged. Policy, and why it was written: `lia-tools/README.md` §Versioning (`CLAUDE.md` rule 10). The same three rows govern a tool and the toolbox.


## What this seat is not

- **Not the CI.** The guards enforce mechanically; this seat judges what they can't — whether a change belongs, whether a promotion is wise now, whether a rollback beats a fix-forward.
- **Not the skills' author.** Content comes from the benches; this seat reviews, lands and ships it.
- **Not a second delivery model.** One pipeline, documented in the repo; this seat runs it.

## Changelog

- **0.6.0 (2026-09-02, LIAB-1184)** — a new standing rule 10: the *size* of a bump is a claim about the change, it moves exactly one step, and a number is not yours until it lands. Rule 1 already made the bump the delivery mechanism, which is why nothing had ever said how far to move — habit answered for 26 releases, 21 of them minors, a wording fix priced like a whole new bench. The rule is the plugin's half of one policy now shared with tools and the toolbox (`README.md` §Versioning, `CLAUDE.md` rule 10). CI holds the step and the collision; the table is this seat's judgement, which is the split the rule states rather than hides. **Minor, not patch**, under the rule it adds: a seat that gains a duty does something new. **Appended as rule 9, not inserted** — rules 1-8 keep their numbers, per the convention `engineering-lead` states twice; an earlier cut of this change inserted at 8 and pushed the PM seam to 9, and review caught it. The moments row for a drafted change also names the size question. The section heading loses "on 26 Aug 2026", which stopped being true when rules 2 and 3 were amended on the 28th.
- **0.5.0 (2026-09-02, LIAB-1181)** — this seat gains the reader it never had. Everything it guarded was addressed to an agent: `CLAUDE.md` is agent rules, `README.md` is a roster plus a runbook, `AUDIT.md` is a provenance record, and the root README is four install commands with nothing saying what gets installed. A person joining the shop met 73 skills across ten benches, a two-ref pipeline and a merge protocol, all of it written for the machines that run them. [`MANUAL.md`](../../MANUAL.md) is the human copy, and **this seat owns keeping it true** — four moments rows and rule 9. The rule names *why* it needs a rule at all: every other artifact here has a guard, and the manual can never have one, because no check can read whether a paragraph still describes what a skill does. So it names the four staleness triggers to ask by hand, and closes both directions the rule must not run in — the manual never becomes the source (the skills and the Linear docs win, as they win over this seat), and a reader is never wrong about their own confusion. The promotion row is the load-bearing one: a released version whose changelog row is missing is a release nobody outside this repo can read. *(CQ's call, 2 Sep 2026, taken on a widget: extend this seat rather than add a `manual-keeper` — the manual is one more thing the marketplace's own seat keeps, not a bench of its own.)* **Written against 0.4.0 and merged over 0.4.1 and 0.4.2**, which landed while this was in review: the moments row it touches is now the After Action Report trigger, kept as they wrote it, and the seat this file names is `engineering-lead`. One defect of this version's own was found resolving that merge and fixed here: the rule 9 insertion had swallowed the `## What this seat is not` heading, orphaning three bullets under rule 9. Neither the guards nor the review caught it — a lost heading is not a frontmatter error, not a roster error and not a missing version, and it reads as prose either way. That is the blind-spot lesson `CLAUDE.md` already carries, arriving in this seat's own file.*
- **0.4.2 (2026-09-02, LIAB-1162)** — the moments row's trigger is a seat's After Action Report, not a bench retro (`wrap-up` 2.0.0) — reference only.
- **0.4.1 (2026-09-02, LIAB-1161)** — `lead-engineer` is `engineering-lead` — reference only: the seat's name now follows its discipline, like the other four leads. No rule changed.
- **0.4.0 (2026-08-29, LIAB-1023 + LIAB-1024)** — a moments row for the loop the new benches depend on: a bench retro that proposes a skill or template change raises a PR through its lead, and this seat lands it under the ordinary rules. Both bench tickets ask their agents to *"suggest improvements to their skills and templates and raise [PRs] to the plugins manager"*; the seat already said content comes from the benches, so this names the moment rather than adding a rule.
- **0.3.0 (2026-08-28, LIAB-1030)** — rule 2 says *why* verifying a real install is not a formality: auto-update does not deliver here. `DISABLE_AUTOUPDATER=1` is set in the desktop session environment and the plugin pass returns on it before the marketplace's `autoUpdate` flag is read, so both settings read correct while nothing updates. Scoped to CLI and desktop: cloud and web sessions provision fresh each time and are unaffected, so an update seen there says nothing about a laptop. Measured, not inferred — 1.6.1 installed against a released 1.8.0, and the gate found in the shipped code.
- **0.2.0 (2026-08-28, LIAB-1025)** — rule 7's claim to the merge authority now points at `review-and-merge` §5.6, which names this seat among the leads. The claim was already here and §5.6 contradicted it, naming the lead engineer specifically; the widening resolves that rather than creating it. Rule 7 also loses **both** narrowing qualifiers, *unreviewed* and *on the current head*: with §5.7 in place, a self-review would otherwise have satisfied the first, turning a dead loophole into a live one. It now reads flat — *a session never lands its own work* — with the declared §5.7 path named as the only exception. Both caught in review.
- **0.1.0 (2026-08-27, CQ + LIAB-995)** — first version. The marketplace's own seat, written the day after the pipeline it runs: the moments table, and the standing rules earned building LIAB-986/988/989 — version-gates-delivery, deliberate promotion, legitimate force-push, checks watched failing, invoke-don't-read, sha-not-ref.
