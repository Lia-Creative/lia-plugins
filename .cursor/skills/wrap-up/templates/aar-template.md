# After Action Report — the template

Copy the block between the rules. Keep the headings verbatim — a reader scans thirty of these by heading; a renamed section is one they cannot find. Sign it on the closing line with the **seat** you sat in and the dispatch id, never a model name. One line per section with honest "none"s is a complete report for a routine session; padding is the failure, not brevity.

---

## After Action Report — [LIAB-000] · [seat] · YYYY-MM-DD

> [Orientation, one line: where things stand, and the next session's first unblocked action.]

**Intended.** [What this session was dispatched to do — the ticket(s) by id, the criteria by index, the plan comment it followed.]

**Actual.** [What exists now — PR and head · statuses as they stand · what was verified and at what evidence tier (ran it / read the code path / read a report) · what was not verified.]

**The gap, and why.** [Where actual differs from intended, and the systemic cause — the ticket, the skill, the environment, the sequencing. Never a person. Or: none.]

**Sustain.** [What worked and must be kept — a gate that caught a real defect, a check watched going red, a rule that saved an hour. Or: none, routine.]

**Improve → actions.**
- [One line · owner · home — a ticket id, or a skill/template change proposed to [lead], or a founder call (transcribed answers listed here).]
- Skill change proposed: [skill — one line addressed to its lead | none]

**Watch-outs.** [Traps for the next agent — worktrees left (path · branch · state) · stale SHAs · blocked writes and what was posted on whose behalf · versions held: [skill x.y.z, …] from changelog tops; freshness: [checked | unchecked], said once, here.]

**Trail.** [PRs · comment ids · artefacts. Decisions point at the register, never restated.]

*Signed: [seat] · dispatch [id | interactive, founder driving] · YYYY-MM-DD*

---

## The vault copy — when the vault is mounted

Save the same text as `00 handover/aar-YYYY-MM-DD-[thread].md` in the scope's folder (`wrap-up` §4 has the table), wrapped in this frontmatter. The `thread:` field is the match key for **one ACTIVE per thread**; the previous ACTIVE report on the thread flips to `superseded` with `superseded_by:` set to this filename.

```markdown
---
title: "AAR — [thread]: [one-phrase state]"
type: aar
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: [cq | dan | luke]
captured_by: [seat]-[surface]
thread: [thread-slug]
supersedes: [previous aar-*.md or handover-*.md filename, or "none — first on this thread"]
linear: LIAB-000
relates: ["LIAB-000"]
tags: [aar, [product-slug]]
---
```

Same day, same thread: extend the existing file and bump `updated:` rather than opening a second one.
