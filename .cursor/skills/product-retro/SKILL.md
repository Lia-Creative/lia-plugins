---
name: product-retro
slug: product-retro
description: "Superseded pointer (2 Sep 2026): the per-session retro entry is the After Action Report — one per session, as a comment on the ticket the session worked, in wrap-up's template. The mandatory rule survives whole: every seat that finishes writes one. Load wrap-up."
version: 2.0.0
created: 2026-07-07
updated: 2026-09-02
status: superseded — pointer
triggers:
  - "/product-retro"
  - "append the retro"
  - "write the retro entry"
companions:
  - wrap-up
  - pickup
  - toy-pickup
maintainer: cq
---

# Product retro — the entry is the After Action Report since 2 Sep 2026

**The rule this skill carried since 7 Jul 2026 is intact and lives in `wrap-up` §1.2:** any session that does work on a product writes a report before it ends — no judgement call on whether, because the sessions that skip it are exactly the ones whose lessons go missing. What changed is the shape and the place (CQ, 2 Sep 2026, LIAB-1162):

| 1.x retro field | Where it lives in the After Action Report |
|---|---|
| **What happened** | **Actual** — with the evidence tier per claim |
| **Learning or decision** | **Sustain** for what worked; **The gap, and why** for what didn't; a decision goes to the register and the **Trail** points at it |
| **Friction** | **The gap, and why** (systemic cause) and **Watch-outs** (traps for the next agent) |
| **Carried forward** | **Improve → actions** — each with an owner and a home |

**Where it goes:** a comment on the ticket the session was dispatched at — Linear is the record (LIAB-820). The vault copy, when mounted, is `00 handover/aar-YYYY-MM-DD-[thread].md`. **Retro-logs stop growing** — every `retro-log.md` is an archive as of this date, read for history and never appended.

Load **`wrap-up`**; its `templates/aar-template.md` is the shape.

## Changelog

- **2.0.0 (2026-09-02, LIAB-1162)** — becomes this pointer. The mandatory per-session entry is the After Action Report in `wrap-up` 2.0.0; the four 1.x fields map onto its sections as tabled above; retro-logs are archives. Nothing about *whether* a session writes one was relaxed.
- **1.2.0 (2026-08-28, LIAB-1020)** — the line is **Lia Tools**: `Products/Lia Toys/` → `Products/Lia Tools/`, `toy box/` → `toolbox/`, `toys/` → `tools/`, and the shape is six numbered stages (`02 analysis` replaced `03 strategy`; research left tool folders; requirements live in Linear) plus the line's unnumbered `standards/` · `research/` · `design/`. Paths only — no behaviour changed.
- **1.1.0 (2026-08-27, LIAB-997)** — lands in the plugin. The toys-line log path (`00 handover/retro-log.md`) promoted into the location table; the 2026-07-07 seeding list and its retired scenario-OS products dropped (those products are archived, the rule is not); vault `_meta/skills/` pointers replaced with the seats that now carry the work.
- **1.0.0 (2026-07-07, CQ)** — the standing rule: mandatory per-session entry, four-field template, append-only, one log per product.
