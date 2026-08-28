---
name: product-retro
slug: product-retro
description: "The mandatory per-session product entry — one short retro appended to the product's retro-log by every session that touched it, no judgment call on whether. Use at the end of any session that did build, feedback, discovery, strategy or cleanup work on a product; wrap-up and pickup both call it."
version: 1.2.0
created: 2026-07-07
updated: 2026-08-28
status: active
triggers:
  - "(automatic — every product-touching session, see The rule)"
  - "/product-retro"
  - "append the retro"
  - "write the retro entry"
companions:
  - wrap-up
  - pickup
  - prototype-feedback-loop
  - toy-pickup
  - execution-discipline
maintainer: cq
---

# Product retro — every product-touching session leaves a trace

**What this is.** A standing rule, decided by CQ 2026-07-07: **any session that does work on a product appends one retro entry to that product's retro-log before it ends.** Not "if it seems worth it" — that judgment call was considered and deliberately rejected, because the sessions that skip the entry are exactly the ones whose lessons go missing.

**Why it exists.** The board says what moved and the handover says where to pick up. Neither says *what we learned*. Without this, the friction that slowed a build gets rediscovered by the next agent, and the decision that quietly ruled something out leaves no trace at all. `wrap-up` writes the handover; this writes the chronicle beside it — **handover = where to start, retro = what it cost and what it taught.**

---

## 1. The rule

If your session's work was about a specific product — build, feedback, discovery, strategy, research, a jam, a cleanup pass, anything — it touched that product and it writes one entry. A session that only glanced at a product README while routing somewhere else did not. **When in doubt, write it**: the template is built to be fast even for a routine session.

Touched more than one product? One entry per product.

An agent working a single ticket writes the same entry as a comment on the ticket it was dispatched at, and into the product's retro-log as well when the session reached the vault (`pickup`, finishing).

## 2. The entry

Copy this per session:

```
### YYYY-MM-DD · [what this session was about, a few words] · [agent/session]
- **What happened:** one or two lines
- **Learning or decision:** what this confirmed, changed, or ruled out — or "none, routine work"
- **Friction:** anything that slowed the session or should change next time — or "none"
- **Carried forward:** open items or questions for next time — or "none"
```

**Append only. Never edit or delete an earlier entry.** Newest at the bottom, under the previous one.

There is deliberately no category enum for the "what this was about" field — a few free-text words (`build`, `feedback round 2`, `discovery jam`, `cleanup`, `strategy call`) is enough. **This is thin machinery on purpose: mandatory to write, not mandatory to be elaborate.** An honest "none" on three of the four fields is a correct entry, not a failed one. Don't pad an entry to make a routine session look substantial — a padded log is one nobody reads.

## 3. Where the file lives

| The work | The log |
|---|---|
| Anything under `Products/Lia Tools/` — the line, the toolbox, a toy | that scope's `00 handover/retro-log.md` (the line's own numbered shape) |
| A standard-shape product (Context / Outputs / Resources) | `Products/[Product]/Context/retro-log.md` |
| A product that keeps loose docs at its root | `retro-log.md` at the product root, matching that product's convention |
| A new product from the template | already seeded — `Products/_Product Template/Context/retro-log.md` ships empty |

No log yet? Create it, in the place the table names, with its frontmatter filled in on first use. Don't invent a second location because the first one is awkward — one log per product is the whole point.

## 4. What this seat is not

- **Not the handover.** `wrap-up` writes the pick-up-here doc, one ACTIVE per thread. The retro is append-only history and is never superseded.
- **Not a status report.** Nothing here goes to the board — statuses live in Linear, per `project-manager`.
- **Not optional because the session was small.** Small sessions are cheap to log, and the entries are what make a pattern visible across ten of them.

## Related seats

- `wrap-up` — the session full stop; it appends this entry and writes the handover. The retro happens whether or not a handover does.
- `pickup` — reads the retro-log tail before starting, and appends its own entry before finishing.
- `toy-pickup` — the same read on the toys line, where the log is `00 handover/retro-log.md`.
- `prototype-feedback-loop` — a feedback round's entry is one type of entry in this log; name it `feedback round N` so it is findable among the build entries.

## Changelog

- **1.2.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.
- **1.1.0 (2026-08-27, LIAB-997)** — lands in the plugin. The toys-line log path (`00 handover/retro-log.md`) promoted into the location table; the 2026-07-07 seeding list and its retired scenario-OS products dropped (those products are archived, the rule is not); vault `_meta/skills/` pointers replaced with the seats that now carry the work.
- **1.0.0 (2026-07-07, CQ)** — the standing rule: mandatory per-session entry, four-field template, append-only, one log per product.
