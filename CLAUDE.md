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
4. **One ticket, one PR; the lead engineer merges** under `review-and-merge`
   (its §5 carries the landing rules). Verify a branch before merging with
   `claude --plugin-dir <path-to-lia-tools> -p` — invoke the changed skills in
   a fresh session; don't just read them.
5. **Publishing: merge = live.** Team machines follow on `/plugin marketplace
   update lia-plugins` and `claude plugin update lia-tools@lia-plugins`, or
   automatically with auto-update enabled for the marketplace (off by default
   for third-party marketplaces). There is no second channel to republish to
   and no zip to build.

   **Cloud and web sessions are the exception worth remembering:** they have no
   `/plugin` command, so they get this plugin only where a repo declares it in
   `.claude/settings.json`. Add that to a repo *before* retiring anything its
   sessions rely on — see
   [lia-tools/README.md](lia-tools/README.md#the-one-gap-worth-knowing-about).
6. **The process the skills implement lives in Linear**, deliberately —
   [How we build tools](https://linear.app/lia-creative/document/how-we-build-tools-4a9cfacc41c8)
   and [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b).
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

And when you find a gap you are not fixing: **it becomes a ticket, not a
paragraph.** Three gaps recorded in READMEs this day were invisible until
someone asked.

Roster and what belongs: [lia-tools/README.md](lia-tools/README.md). The
audit trail of which copy won, why, and what was retired:
[lia-tools/AUDIT.md](lia-tools/AUDIT.md).
