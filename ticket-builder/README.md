# ticket-builder

How Lia builds **Linear tickets and epics properly** with Claude Code.

Encodes the principles a good ticket holds to, the epic and ticket shapes (matched to the project's siblings), plain no-number titles ordered by priority and dependency, blocked-by sequencing, grounding every ticket in real vault sources, the team/status/label/priority conventions, the doc-vs-ticket line, the Linear MCP mechanics, and the wrap-up rules (logging, cross-founder courtesy, project-description sync).

## Skill

The `ticket-builder` skill loads whenever you're creating, restructuring, or breaking work into Linear issues for the Lia team — triggers include "build a ticket", "build an epic", "break this into tickets", "draft a backlog", "add this to Linear".

## When to use

- **Turning shaped work into Linear issues (epics, tickets, sub-issues, backlogs) →** ticket-builder.

## Source

Canonical skill lives in the Lia Vault at `_meta/skills/ticket-builder/`; this plugin packages it for install. Sync one-way from the vault when the canonical version bumps.

Part of the [`lia-plugins`](https://github.com/Lia-Creative/lia-plugins) marketplace.
