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

That's it. New tools added here later show up with a `/plugin marketplace update lia-plugins`, and updates to a plugin you already have come with `claude plugin update lia-tools@lia-plugins` — or on their own, if you switch on auto-update for the marketplace (`/plugin` → **Marketplaces** → `lia-plugins`), which is off by default.

**Cloud and web sessions** (claude.ai/code, the mobile app) have no `/plugin` command. They pick these up only where a repo declares them in `.claude/settings.json` — see [lia-tools/README.md](lia-tools/README.md#the-one-gap-worth-knowing-about).

## What's in here

### lia-tools — the build process

Everything an agent needs to build lia.tools products: writing epics, stories and tasks, the ready gate, pickup, orchestration, review and wrap-up. **The `lia-tools/` directory is the source of truth for the skills it carries** — since 26 Aug 2026 ([LIAB-919](https://linear.app/lia-creative/issue/LIAB-919)) canonical lives here, not in the Lia Vault; the vault keeps strategy docs and stopped holding skills. See [lia-tools/README.md](lia-tools/README.md).

### design-and-refine — hi-fi UI work

Refining a real component in an existing repo: `/design-and-refine:start` generates and compares UI variations on-brand.

*(Two plugins were retired from this marketplace on 26 Aug 2026: the standalone `ticket-builder`, superseded by `lia-tools` — [LIAB-924](https://linear.app/lia-creative/issue/LIAB-924) — and the `squeaks` lo-fi prototyping plugin, [LIAB-962](https://linear.app/lia-creative/issue/LIAB-962). The [Squeaks scaffold template](https://github.com/Lia-Creative/squeaks) it started from is unaffected. Both are `renames` entries in the marketplace, so existing installs migrate rather than dangle.)*

## Sources

- `design-and-refine` is referenced from our fork [`Lia-Creative/design-plugin`](https://github.com/Lia-Creative/design-plugin) (upstream: [`0xdesign/design-plugin`](https://github.com/0xdesign/design-plugin)).

It's an MIT-licensed fork kept in the Lia org so we own the source of truth and can pull upstream updates.
