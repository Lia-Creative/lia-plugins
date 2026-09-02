# Agent rules — lia-plugins

This repo is Lia Creative's Claude Code marketplace, and since 26 Aug 2026 the
**`lia-tools/` directory in it is the source of truth for the build-process,
toys and design skills** (LIAB-919 — canonical moved out of the vault). Editing
a skill anywhere else is editing a frozen copy.

**One surface: Claude Code.** The CLI, the desktop app and cloud/web sessions are
the same Claude Code, and `/design` runs inside it, so there is one channel and
one artifact. Cowork was dropped as a publish target on 26 Aug 2026 (LIAB-924)
along with the hand-carried `.plugin` zip.

## The rules

1. **Edit skills in `lia-tools/skills/<name>/SKILL.md` only.** The vault's
   `_meta/skills/` copies, the claude.ai `lia-build`/`lia-toys` plugins and the
   claude.ai standalone skills that duplicate this roster are frozen and being
   retired under LIAB-924 — never sync from them, never "fix" them. They are
   still live until Chris switches them off, and a session can still be handed
   one instead of the plugin's copy: measured 26 Aug, the account's standalone
   `ticket-builder` was 0.3.0 against this repo's 0.5.1. The switch-off list is
   in [lia-tools/AUDIT.md](lia-tools/AUDIT.md#the-switch-off-list--chriss-action-in-claudeai-settings).
2. **Every skill carries `description:` frontmatter.** It is what a session's
   skill listing shows and what auto-triggering runs on — a skill without one
   has been invisible to real sessions (proved 26 Aug). Keep it: what the skill
   does + when to use it.

   **No `<` or `>` anywhere in a skill's frontmatter, or in a plugin
   manifest's `description` — write placeholders as `[name]`.** This rule is
   kept on purpose after the surface that enforced it stopped being a target:
   Cowork read angle brackets as an XML tag and refused the whole plugin
   (LIAB-959), and while nothing in the current pipeline enforces it, the guard
   is free to run and the alternative is re-learning it the expensive way. A
   command's `argument-hint:` line is the one exception — angle brackets there
   are Claude Code's own convention — but the rest of a command's frontmatter,
   its `description:` included, is held to the same rule.
   `node scripts/check-skill-frontmatter.mjs` is the guard; CI runs it on every
   PR. The full story is in
   [lia-tools/README.md](lia-tools/README.md#writing-frontmatter--no-angle-brackets).
3. **A content change bumps the skill's `version:` with a changelog line, and
   bumps `lia-tools/.claude-plugin/plugin.json`.** Version numbers have lied
   here before (`lia-tools/AUDIT.md` has the story) — the changelog line is
   what makes them mean something.
4. **One ticket, one PR; a lead merges — never their own work.** Reviewing and
   landing is part of what a lead *is*, not a permission one seat holds:
   `engineering-lead`, `design-lead`, `discovery-lead`, `research-lead`,
   `testing-lead`, `project-manager` and
   `plugin-manager` each land work in their own lane under `review-and-merge`
   (its §5 carries the landing rules; §5.7 is the one declared exception, and
   its bar is narrow — a fresh session holding a lead seat counts as another
   lead, so a lane having one seat does not qualify). The widening is a duty redistributed, not
   a gate loosened — a lead can judge because a lead does not produce, so the
   seat that made the change is never the seat that lands it. Verify a branch
   before merging with
   `claude --plugin-dir <path-to-lia-tools> -p` — invoke the changed skills in
   a fresh session; don't just read them.
5. **Publishing: merge lands, promotion ships.** The marketplace serves
   `lia-tools` from the `release` ref (LIAB-986), so a merge to `main` reaches
   nobody until someone fast-forwards `release` to `main` — one command, and
   rollback is one command back; both are in
   [lia-tools/README.md](lia-tools/README.md#how-a-change-publishes). The
   version bump rule 3 demands is what makes a promotion deliver — machines
   only fetch when the version field changes — and CI fails a `lia-tools/**`
   PR without one (`scripts/check-version-bump.mjs`). Machines follow on
   `/plugin marketplace update lia-plugins` and `claude plugin update
   lia-tools@lia-plugins` — **by hand, both of them.** Marketplace auto-update
   exists and does not fire on a desktop machine: `DISABLE_AUTOUPDATER=1` is
   set in that session environment and the plugin pass returns on it before
   the marketplace's own flag is read (LIAB-1030, measured — 1.6.1 installed
   against a released 1.8.0 with both settings correct). A promotion is not
   delivered until an install has been pulled and invoked. Cloud and web
   sessions are the exception: they provision fresh each time and always run
   what `release` serves. There is no
   second channel to republish to and no zip to build.

   **Cloud and web sessions are the exception worth remembering:** they have no
   `/plugin` command, so they get this plugin only where a repo declares it in
   `.claude/settings.json`. Add that to a repo *before* retiring anything its
   sessions rely on — see
   [lia-tools/README.md](lia-tools/README.md#the-one-gap-worth-knowing-about).
6. **The process the skills implement lives in Linear**, deliberately —
   [How we build tools](https://linear.app/lia-creative/document/how-we-build-tools-4a9cfacc41c8)
   and [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b),
   joined 30 Aug 2026 by
   [What a reported bug carries](https://linear.app/lia-creative/document/what-a-reported-bug-carries-ff781e0d6b8a)
   (LIAB-967), which owns what a bug ticket contains for every intake.
   Skills point at those docs; they never restate them. Where a skill and the
   docs disagree, the docs win and the skill gets fixed.
7. **Retired from this marketplace, and not to be revived without a ticket:**
   the standalone `ticket-builder` plugin (26 Aug 2026, LIAB-924 — superseded
   by `lia-tools`, which carries `ticket-builder` and its successor seats), and
   `squeaks` (26 Aug 2026, LIAB-962). Both are `null` entries in
   `marketplace.json`'s `renames` so existing installs migrate rather than
   dangle.

   *(On `squeaks`: the rule here used to protect it on the grounds that it had
   its own upstream — which was false. `Lia-Creative/squeaks` is a Vite scaffold
   template and never carried the plugin's manifest, skill or command. The only
   copy was here.)*

8. **A directory under `lia-tools/skills/` carries a `SKILL.md`, and the plugin
   README names it.** Claude Code's skill loader keys on `SKILL.md`, and the
   whole `lia-tools/` directory ships to installers — so a directory without
   one installs, cannot be invoked, and stays greppable by any agent working in
   the tree. That is what both guards passed green on PR #20 (LIAB-1005):
   `skills/ux-writing/references/*.md`, 468 lines, no `SKILL.md` — one walks
   *for* `SKILL.md` files, the other counts changed paths, so a directory that
   cannot load is not something either can see. **It never reached `main`: a
   human reading the diff stopped it,** which is the one check this repo has
   already decided not to rely on. The roster half is the same drift pointing
   the other way: a skill with no row in
   [lia-tools/README.md](lia-tools/README.md#whats-in-it) is a skill nobody
   knows we carry, and a row with no directory points at nothing.
   `node scripts/check-skill-roster.mjs` is the guard; CI runs it on every PR.
   *(Rules go on the end as they arrive — the numbers here are cited from
   skills and scripts, so inserting one would shift five references and a
   plugin version with it.)*

## Make the check fail on purpose

**Earned in this repo, 26 Aug 2026 (LIAB-959), three times in one day.** A rule
nothing executes became a guard nothing tested became a fixture that could not
tell the fix from the bug:

1. The placeholder convention was written in prose. It passed every check we had
   and made `lia-tools` 1.2.0 uninstallable on a whole surface.
2. Its guard's first self-test still printed `ok` with the guard's core check
   deleted — so it proved nothing.
3. Its BOM fixture was red *either way* — with the fix as the defect, without it
   as an unreadable file. Coverage that could not distinguish the two.

Each layer looked like coverage. **A check nobody has watched fail is a check
nobody knows works** — so break it deliberately and watch it go red before you
trust it green. That is what `--self-test` is for, and why CI runs it *before*
the real check.

The same rule applied to acceptance criteria: **`grep -ri squeak` passed on two
live references because neither contained the word.** A string test for a
conceptual change is green in a way that means less than it looks like.

**A fourth, a day later (LIAB-1005).** Both guards were green on a PR carrying a
skill directory that could not load, and both were *right*: one walks **for**
`SKILL.md` files, so a missing one is not a failure it can report, it is a file
it never sees. What stopped it was a human reading the diff — the check this
repo has already decided not to rely on. A guard's blind spot is not in what it
checks; it is in the shape of what it enumerates. Ask what a check cannot see
before believing what it says.

And when you find a gap you are not fixing: **it becomes a ticket, not a
paragraph.** Three gaps recorded in READMEs this day were invisible until
someone asked.

9. **A PR that adds a skill owes it a row in
   [lia-tools/AUDIT.md](lia-tools/AUDIT.md), in that PR.** The row answers
   three things: **where it came from · what it superseded (or that nothing
   did) · how that was established.** One line is a complete row when the
   answer is *new writing, no competing copy* — the point is that there *is*
   an answer, not that it is long.

   This is rule 3's question one level up: rule 3 makes a version mean
   something, this makes the skill's origin mean something. It exists because
   **34 of 52 skills had no row by 28 Aug 2026** (LIAB-1003) — eight PRs'
   worth, each addition individually too small to seem worth a line, and the
   answer to *where did this come from* then costs an archaeology session
   instead of a sentence. It matters most for the ports: four skills supersede
   a frozen vault copy and two came out of Chris's personal `cq` bundle, which
   is exactly the "which copy won" question `AUDIT.md` was written to answer.

   **Nothing enforces this mechanically** — a guard cannot read what a skill's
   provenance *is* — so it is a review question, and `review-and-merge`'s
   reviewer is the one who asks it. The dated LIAB-918 measurement tables at
   the top of that file are a record of a moment, not a live list: add to the
   section below them, never edit them.

10. **Take the smallest bump that is true, and move exactly one step.** The
    policy is [lia-tools/README.md](lia-tools/README.md#versioning) — **patch**
    it got better, **minor** it does something new, **major** something that
    worked stops working — and it governs all three things this line ships: the
    plugin, a tool, the toolbox. From `X.Y.Z` the only legal next numbers are
    `X.Y.(Z+1)`, `X.(Y+1).0`, `(X+1).0.0`.

    This is rule 3 finishing its own sentence. Rule 3 makes a version *move*;
    nothing said how far, so habit answered: `1.0.0 → 1.21.0` in 26 releases, 21
    of them minors, never a major, a wording fix costing the same digit as a new
    bench of skills. A bump free to land anywhere above the last one claims only
    that a release happened. **The size is a claim about the change** — which is
    why the one-step half matters as much as the table: `1.19.0 → 1.21.0` and
    `1.3.0 → 1.3.3` are both in this repo's history, and neither can be read.

    The guard (`scripts/check-version-bump.mjs`) enforces the step for the
    plugin and its skills. **It cannot enforce the table** — no check can read
    what a change *means* — so that half is a review question, and it is
    outside the guard entirely for tools and the toolbox, whose versions live in
    `lia-toy-box` ([LIAB-1188](https://linear.app/lia-creative/issue/LIAB-1188)).
    A promotion never picks the digit; a stage lives in the release register.
    The one exception: `0.x` is not-yet-production, and production is `1.0.0`.

Roster and what belongs: [lia-tools/README.md](lia-tools/README.md). The
audit trail of which copy won, why, and what was retired:
[lia-tools/AUDIT.md](lia-tools/AUDIT.md).
