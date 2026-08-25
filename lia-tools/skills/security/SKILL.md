---
name: security
slug: security
description: "Check work against security and data-compliance basics as it moves — no secret toward a client bundle, secrets by location only, RLS discipline, personal data marked and minimal; a shell that grows one real case at a time, gaps named not skipped. Use when a change touches secrets, auth, personal data, a bundle, or a signing path."
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active — deliberately a shell
triggers:
  - "/security"
  - "security check this"
  - "does this leak anything"
  - "data compliance check"
companions:
  - lead-engineer
  - review-and-merge
  - schema-manager
maintainer: cq
---

# Security — checked along the way, not discovered at the end

**What this is.** The lead engineer's security and data-compliance check, run as work moves — at build prep (does the plan touch anything sensitive?), in the review loop (did the diff?), and at QA. **This is a shell on purpose** (CQ, 26 Aug 2026: *"this will be a shell early on but will expand as we go"*): it carries the rules Lia has already paid for, and it grows one real case at a time — never by speculative policy.

---

## The known rules — each one already earned

1. **A secret moving toward a client bundle fails review, full stop.** No judgment call, no exceptions. In `lia-tools` (the site): every server-only value goes through `src/lib/server-env.ts` (`import "server-only"`); **no env var holding a secret may carry `NEXT_PUBLIC_`**; `pnpm verify:bundle` checks the built output and runs in CI. The service-role key is the one unrecoverable mistake in that repo — it bypasses RLS.
2. **Secrets live in `~/.secrets/*.env`, never in a repo, never in the vault, never inlined in a ticket.** Reference by location. A credential that reaches a transcript or a ticket is a **Bug** (the LIAB-864 precedent) — rotate at source, then fix the leak path.
3. **Command lines leak.** `ps` argv is world-readable — redact `--password`/`--token` style arguments before printing anything, and treat a leaked one as rule 2.
4. **RLS is the floor on the account service.** Changes to `public.accounts` or its policies go through migrations with the severity split read first (an unknown `group` value fails the whole payload — a signed-in tester with every toy gone reads as data loss). Never hand a service key to anything client-side; the anon key + RLS is the path.
5. **Personal data is marked and minimal.** The [schema map](https://linear.app/lia-creative/document/schema-map-liatools-7c33b96fb34b) flags `personal` and `credential-adjacent` entries — read it to know where to look. A person's own footage stays on their own disk and stays readable regardless of billing state (a settled rule: billing gates *the tool*, never *the work*).
6. **Signing and notarisation checks never get removed because they've never failed** — each check in `pnpm dist` exists because that failure is silent.

## Running the check

At each point (prep / review / QA): does the change touch **secrets, auth, personal data, a client bundle, or a signing path**? No → say so in one line, move on. Yes → walk the relevant rules above, record the verdict as a comment with evidence (what you ran or read), and **name what this shell couldn't check** — a gap named is a rule waiting to be earned; a gap skipped silently is the failure mode this seat exists to end.

## Growing the shell

A new rule enters when a real case pays for it — a finding in review, an advisor warning (`supabase` advisors run on account-service changes), an incident. Each addition cites its case and lands here with a version bump; speculative rules don't.

## What this seat is not

- **Not a compliance framework.** No SOC 2 theatre at three founders and ten subscribers; terms-of-sale obligations (refunds in writing before the first charge) live with LIAB-939/941, not here.
- **Not a blocker by default.** One line when nothing applies; the full walk only when something does.
- **Not the secrets manager.** It checks paths and policies; it never handles values.

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — the shell: six earned rules (bundle rule, secrets locations, argv leaks, RLS floor, personal-data marking, dist checks), the three checkpoints, and the grow-by-real-case rule.
