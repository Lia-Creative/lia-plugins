---
name: ticket-review
slug: ticket-review
version: 0.3.0
created: 2026-08-13
updated: 2026-08-26
status: active
triggers:
  - "/ticket-review"
  - "is this ticket ready to dispatch"
  - "can an agent pick this up"
  - "check the ticket before it goes"
companions:
  - build-prep
  - review-and-merge
  - ready-review
  - build
maintainer: cq
---

# Ticket review — could an agent start from this, without asking anything?

> [!important] **This name was reassigned on 26 Aug 2026** (CQ's lead-engineer bench; decisions register). Until then, `ticket-review` meant verifying **built work** sitting in Review — that discipline moved whole, unchanged, into **`review-and-merge`**. If you were sent here to "review LIAB-XXX" meaning *check the finished work*, load `review-and-merge`. This skill is the **pre-dispatch check**.

**What this is.** The lead engineer's quick last look before a ticket is dispatched: one question — **could an agent start from this ticket alone, without asking anything?** Minutes, not an hour. It is the dev-ready gate's one question, applied at the moment of dispatch, after `acceptance-criteria` and `build-prep` have done their work.

---

## The check — one pass down the ticket, as the builder

Read the ticket cold, pretending you hold only Linear and this plugin. Then:

1. **The goal is stated** — narrative or Goal line present per the narrative rule; the criteria are numbered Given/When/Then; Delivery checks are split out. (Shape problems this late are a `ready-review` miss — flag the miss too.)
2. **The three layers are all there** — what (discovery), how it's experienced (the design artefact, on the ticket, winning over prose), how to build it (`build-prep`'s notes).
3. **Every path resolves** — files exist or say *Create*; services say how they're authed; **accounts and connectors name the identity and how the session gets connected before work starts**; secrets by location only.
4. **No vault required.** Anything the builder would need the vault for travels onto the ticket now — this is the failure most tickets have, and it fails the check on its own.
5. **Relations are true** — blockers genuinely finished, the parent's state honest, nothing pointing at a ticket that doesn't exist.

**Pass:** say so in one line on the ticket — dispatch proceeds. **Fail:** one comment naming each gap and **which seat fixes it**, and the dispatch waits. Never fix-by-dispatch-note — a gap patched in a prompt is invisible to the next reader.

## What this seat is not

- **Not `ready-review`.** That gate grades epics and stories on the five checks at discovery-exit; this is the last look at dispatch, after design and prep. Both exist because they catch different escapes.
- **Not the built-work review** — `review-and-merge`, since the 26 Aug reassignment.
- **Not thorough by volume.** If this check takes an hour, prep failed — send it back rather than doing prep's job here.

## Changelog

- **0.3.0 (2026-08-26, CQ voice memos + Fable 5)** — **the reassignment.** This name now means the lead engineer's pre-dispatch pickability check; the built-work verification discipline (0.1.0–0.2.1's content) moved verbatim into `review-and-merge`, where its changelog continues. Recorded in the decisions register with reasons.
- **0.2.1 (2026-08-21, CQ + Cowork)** — *(as built-work review)* §5 no longer says the founder merges; the orchestrator merges per CQ's 21 Aug call.
- **0.1.0 (2026-08-13, CQ + Cowork)** — first version, as the built-work review: *"getting agents to review what has been submitted rather than always relying on my eyes."*
