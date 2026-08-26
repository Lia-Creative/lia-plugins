# Agent rules — lia-plugins

This repo is Lia Creative's Claude Code marketplace, and since 26 Aug 2026 the
**`lia-tools/` directory in it is the source of truth for the build-process,
toys and design skills** (LIAB-919 — canonical moved out of the vault). Editing
a skill anywhere else is editing a frozen copy.

## The rules

1. **Edit skills in `lia-tools/skills/<name>/SKILL.md` only.** The vault's
   `_meta/skills/` copies and the claude.ai `lia-build`/`lia-toys` plugins are
   frozen, retiring via LIAB-924 — never sync from them, never "fix" them.
2. **Every skill carries `description:` frontmatter.** It is what a session's
   skill listing shows and what auto-triggering runs on — a skill without one
   has been invisible to real sessions (proved 26 Aug). Keep it: what the skill
   does + when to use it.

   **No `<` or `>` anywhere in frontmatter — write placeholders as `[name]`.**
   Cowork reads angle brackets as an XML tag and refuses the whole plugin, while
   the git channel and `claude plugin validate` take it happily (LIAB-959).
   `node scripts/check-skill-frontmatter.mjs` is the guard; CI runs it on every
   PR. The full story, and what is and isn't known about that validator, is in
   [lia-tools/README.md](lia-tools/README.md#writing-frontmatter--no-angle-brackets).
3. **A content change bumps the skill's `version:` with a changelog line, and
   bumps `lia-tools/.claude-plugin/plugin.json`.** Version numbers have lied
   here before (`lia-tools/AUDIT.md` has the story) — the changelog line is
   what makes them mean something.
4. **One ticket, one PR; the lead engineer merges** under `review-and-merge`
   (its §5 carries the landing rules). Verify a branch before merging with
   `claude --plugin-dir <path-to-lia-tools> -p` — invoke the changed skills in
   a fresh session; don't just read them.
5. **Publishing:** merge = live on the git channel (team machines follow on
   `/plugin marketplace update lia-plugins`; upgrades need `claude plugin
   update lia-tools@lia-plugins`). The claude.ai/Cowork republish is Chris's
   manual step until LIAB-922's match-check exists — the git channel is the
   truth if the two disagree.
6. **The process the skills implement lives in Linear**, deliberately —
   [How we build tools](https://linear.app/lia-creative/document/how-we-build-tools-4a9cfacc41c8)
   and [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b).
   Skills point at those docs; they never restate them. Where a skill and the
   docs disagree, the docs win and the skill gets fixed.
7. **`squeaks` and the standalone `ticket-builder` plugin are not yours to
   restructure** — squeaks has its own upstream; the standalone ticket-builder
   is superseded and awaits LIAB-924.

Roster and what belongs: [lia-tools/README.md](lia-tools/README.md). The
audit trail of which copy won and why: [lia-tools/AUDIT.md](lia-tools/AUDIT.md).
