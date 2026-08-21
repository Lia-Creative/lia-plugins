# lia-toys

How Lia builds toys with agents.

Toys get built by a lot of sessions running at once — building, reviewing, packaging, across more than one repo. This plugin packages the practices that make that work rather than collide.

## Skills

### `orchestrate`

**One agent runs the board, the rest build.**

A single long-lived session takes charge of a milestone and hands every piece of work out to a fresh agent. It reads the board, decides the order, writes the dispatch, verifies what comes back, merges it, and keeps Linear true. **It never ships code.**

That last part is the point rather than a restriction. The orchestrator is the only session holding the whole picture — the milestone, the open pull requests, the trunk, and who is waiting on whom — and it loses that view the moment it is deep in one file and blind to the other eight branches.

Covers the role split, starting cold, the three-part dispatch format, sequencing and collisions, the merge protocol, keeping the board honest, traffic-light reporting, and the landmines that outlive any one run.

Triggers on `/orchestrate`, "be the orchestrator", "run this milestone", "you run the board", "where are we on the milestone".

**Use it** when several tickets are in flight, when a milestone has a deadline, or when work spans more than one repo. **Don't** use it for a single ticket — that's `pickup` — and don't use it if you intend to build.

It was extracted from the run that built Toy Box's internal testing milestone on 20 August 2026: nine pull requests merged in a day, including recovering twelve files of finished work that a bad merge had silently dropped and nothing else was looking for.

## Companions

`orchestrate` dispatches sessions that run other skills — `pickup` to take a ticket on, `ticket-review` to verify it before the founder looks. It never runs either itself.

## Source

Canonical skills live in the Lia Vault at `_meta/skills/`; this plugin packages them for install. Sync one-way from the vault when a canonical version bumps.

Part of the [`lia-plugins`](https://github.com/Lia-Creative/lia-plugins) marketplace.
