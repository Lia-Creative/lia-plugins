# lia-plugins

Lia Creative's Claude Code marketplace — the one place the team installs Lia tooling from.

## Setup (once per person)

```
/plugin marketplace add Lia-Creative/lia-plugins
```

Then install what you need:

```
/plugin install lia-tools@lia-plugins
/plugin install design-and-refine@lia-plugins
```

That's it. New tools added here later show up with a `/plugin marketplace update lia-plugins`, and updates to a plugin you already have come with `claude plugin update lia-tools@lia-plugins`. **Run both by hand** — auto-update for the marketplace exists (`/plugin` → **Marketplaces** → `lia-plugins`, off by default) but does not fire on a desktop machine, for a reason recorded in [lia-tools/README.md](lia-tools/README.md#how-a-change-publishes) step 3. Cloud and web sessions are the exception: they provision fresh each time and always run what `release` serves.

**Cloud and web sessions** (claude.ai/code, the mobile app) have no `/plugin` command. They pick these up only where a repo declares them in `.claude/settings.json` — see [lia-tools/README.md](lia-tools/README.md#the-one-gap-worth-knowing-about).

## Cursor

Same skills, same files — Cursor reads `lia-tools/` as a plugin instead of going through Claude Code's `/plugin`. This is not a second artifact.

**This repo.** A Cursor session that opens `lia-plugins` loads `lia-tools` from the checkout: [`.cursor/skills`](.cursor/skills) is a symlink onto `lia-tools/skills`, and `lia-tools/.cursor-plugin/plugin.json` is the Cursor plugin manifest. Cloud Agents included — they never fire `workspaceOpen`, so the symlink is the install, not a hook.

**Other repos, and everyone on the team.** Import this repository as a Cursor team marketplace (Dashboard → Plugins → Add Marketplace → Import from Repo → `https://github.com/Lia-Creative/lia-plugins`). Cursor reads [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json), which lists `lia-tools`. Mark it Required if every Cloud Agent should arrive with the roster. Auto-refresh tracks the branch the marketplace is pointed at; point it at `release` so Cursor follows the same promotion as Claude Code.

`design-and-refine` is not in this tree (it is a pin on `Lia-Creative/design-plugin`). It stays a Claude Code install until that repo carries a Cursor manifest of its own.

## What's in here

### lia-tools — the build process

Everything an agent needs to build lia.tools products: writing epics, stories and tasks, the ready gate, pickup, orchestration, review and wrap-up. **The `lia-tools/` directory is the source of truth for the skills it carries** — since 26 Aug 2026 ([LIAB-919](https://linear.app/lia-creative/issue/LIAB-919)) canonical lives here, not in the Lia Vault; the vault keeps strategy docs and stopped holding skills. See [lia-tools/README.md](lia-tools/README.md).

### design-and-refine — hi-fi UI work

Refining a real component in an existing repo: `/design-and-refine:start` generates and compares UI variations on-brand.

*(Two plugins were retired from this marketplace on 26 Aug 2026: the standalone `ticket-builder`, superseded by `lia-tools` — [LIAB-924](https://linear.app/lia-creative/issue/LIAB-924) — and the `squeaks` lo-fi prototyping plugin, [LIAB-962](https://linear.app/lia-creative/issue/LIAB-962). The [Squeaks scaffold template](https://github.com/Lia-Creative/squeaks) it started from is unaffected. Both are `renames` entries in the marketplace, so existing installs migrate rather than dangle.)*

## Sources

- `design-and-refine` is referenced from our fork [`Lia-Creative/design-plugin`](https://github.com/Lia-Creative/design-plugin) (upstream: [`0xdesign/design-plugin`](https://github.com/0xdesign/design-plugin)).

It's an MIT-licensed fork kept in the Lia org so we own the source of truth and can pull upstream updates — *deliberately*. The marketplace entry pins the fork to a **fixed commit SHA**, never a moving branch ([LIAB-988](https://linear.app/lia-creative/issue/LIAB-988)): a git source with no explicit version uses the commit as its version, so a `ref: main` pin meant every unreviewed commit on the fork shipped to whoever had the plugin installed.

**Pulling an upstream update is a PR here, not a fetch there:**

1. On the fork: `git fetch upstream && git merge upstream/main` (or cherry-pick), push to the fork's `main`.
2. Read the diff you just pulled — the pin is the review record, so the commit it names is a commit someone has looked at.
3. Open a PR on this repo moving the `sha` in `.claude-plugin/marketplace.json` to the new fork commit. The PR body says what came in from upstream.

The pin never floats; moving it is always a reviewed change on this repo.

*(Mechanics, learned by watching an install fail on 26 Aug 2026: the source's `ref` field is fetched like a branch or tag name — a raw commit hash there breaks the install with "Remote branch not found". A commit pin goes in the `sha` field, which is also what wins if both are set.)*
