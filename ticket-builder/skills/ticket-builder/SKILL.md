---
name: ticket-builder
slug: ticket-builder
description: How Lia builds Linear tickets and epics properly. The principles a good ticket holds to, the epic and ticket shapes (matched to the project's siblings), plain no-number titles ordered by priority and dependency, blocked-by sequencing, grounding every ticket in real vault sources with links kept in the relation field and the reasoning kept in the description, the same context bar for projects and milestones (not just issues), the team/status/label/priority conventions, the doc-vs-ticket line, the Linear MCP mechanics, and the wrap-up rules (logging, cross-founder courtesy, project-description sync). Use whenever creating, restructuring, or breaking work into Linear issues, projects or milestones for the Lia team.
version: 0.4.0
created: 2026-06-03
updated: 2026-08-05
status: active
maintainer: dan
reviewed_by: chris (2026-06-24/25, LIA-388)
triggers:
  - "build a ticket"
  - "build the tickets"
  - "create tickets"
  - "build an epic"
  - "break this into tickets"
  - "draft a backlog"
  - "write the sub-issues"
  - "add this to Linear"
  - "ticket builder"
companions:
  - enrich
  - wiki-ingest
  - lia-html-render
---

# Ticket Builder

**Trigger:** any request to create, restructure, sequence, or break work into Linear issues for the Lia team. Also "ticket builder" by name.

**Purpose:** make Lia's Linear tickets consistently good — human-readable, grounded in real vault material, and sequenced so the board tells the truth. A founder should be able to read an epic in one glance and know the job, who it's for, and what success looks like.

---

## What a good ticket feels like

Before the procedure, the feel. If a principle and a step ever disagree, the principle wins — the steps are just the usual way of getting here.

1. **Grounded.** It's anchored in something real — the actual strategy doc, wiki page, design-system state, or sibling ticket — found *before* writing. Record the link as a relation, not as chips smeared through the prose. A ticket with nothing real behind it is either too early, or it's a doc and not a ticket.
2. **It carries its own context.** The *link* lives in the relation panel; the *thinking* lives in the description. A reader in three months, who wasn't in the room and can't see the chat, should get why this exists, what was considered and dropped, and what's still unresolved — without opening anything else. Quote the real words from the meeting where they're better than a paraphrase. **This is not in tension with "link-light" below** — that rule is about `LIAB-xx` chips, never about reasoning. A tidy ticket that lost the argument behind it has failed at the only job it had.
3. **One job.** A ticket makes *one* thing true. If the goal needs an "and," it's probably two tickets. Honest scope beats a tidy-looking pile.
4. **Reads in thirty seconds.** What it is, who it's for, when it's done — without a meeting or a DM.
5. **The board tells the truth.** Status and blocked-by reflect reality. If a ticket is blocked, its upstream genuinely isn't done. A glance at the board should be an honest picture of the work — not aspiration. **And a parent never runs ahead of its children:** don't move an epic — or any ticket with sub-issues — into Review or QA until all its sub-issues are Done or Cancelled. A parent in a review state while its children are still open is the board lying.
6. **Human-first, not spec-first.** An epic reads like a job to be done for a real person — outcome and value up front. A ticket reads like a user story with a clear "done." Plain language. If a human can't grasp it at a glance, it's agent-mush — rewrite it. Mechanics (links, IDs, dependencies) live in Linear's relation fields and the sidebar, not sprinkled through the prose.

**The rule the skill was built on (Dan, 2026-06-03):** tickets reference real data and files. Before writing, find the source. The grounding is what makes a ticket real instead of decorative — just keep the *link* in the relation field and the *prose* human (CQ, 2026-06-25). **"Human" means readable, not thin** (Dan, 2026-08-05): the reasoning, the rejected options and the open questions belong in the description.

Read the Lia Vault `CLAUDE.md` first (founder switcher, write rules, voice, and the canonical Linear conventions). Default lens is Dan's; switch if CQ or Luke is driving.

---

## Ticket or doc?

Decide this before you open Linear. A ticket has a finish line; a doc holds durable knowledge.

- **Ticket** = work with a done-state. It ends. (It can *produce* a doc as its deliverable — that's normal.)
- **Doc** = a decision, standard, or reference that persists after the work is done. Lives in the vault, indexed in `_meta/index.md`.
- **Rule of thumb:** if you'd want to read it again in three months, it's a doc. If it's something to *finish*, it's a ticket. Most real work is a ticket that produces or updates a doc — write both, and link them to each other.

**Intake (where tickets come from).** This skill is about writing a ticket well, not deciding it should exist. The "is this worth doing" gate — idea → vault → the "hell yeah" test — is **Phase 0 (Capture)** of the Product Development Process (`LIA-281`). When an idea clears that bar *and* has real sources behind it, it becomes a ticket in the shape below.

---

## Seam with the Product Development Process (`LIA-281`)

Two different things, on purpose — they cross-reference, they don't overlap:

- **This skill = how we *write* a ticket.** The shape, the grounding, the sequencing, the mechanics. Applies to any ticket, on any team, in any phase.
- **`LIA-281` = how an idea *becomes* a shipped product.** The phases (Capture → Discovery & Evidence → Investment case → Build → GTM → Support), the gates, and *which* tickets exist at each phase.

The join: `LIA-281`'s per-phase ticket templates (its sub-issue 7) are written in *this* shape. So — deciding *what work exists and when*? That's `LIA-281`. Writing *the work up well*? That's here. If you find this skill trying to define phases, or `LIA-281` trying to define ticket formatting, something has drifted — pull them back apart.

---

## Projects and milestones are not exempt

This skill is named for tickets, but the same bar applies to **every Linear object you create** — project, milestone, epic, issue. If it exists in Linear, it carries its own context.

- **A project description** says what this is, where it came from (the meeting, the doc, the decision), what the shape is, and what is deliberately not in it.
- **A milestone description** says why that date is that date. A milestone reading "3 toys launched, 30 Nov" is a marker, not a decision — it should carry what "launched" was agreed to mean, what was considered and dropped, and who said so. Milestones are where context goes to die, because the UI makes them look like they only want a name.
- **Don't hoard the substance in the parent.** The most common failure is a rich project description with bare children hanging off it. Nobody reads a project description when they open a milestone.
- **"Set it up in Linear" means tickets.** Projects and milestones are scaffolding. If there is real work, there are issues with owners and a done-state — or you say plainly that you didn't create them and why. Structure without tickets is a board that looks planned and can't be worked.

**Two mechanics worth knowing before you build:**

- **A milestone cannot be moved between projects.** `save_milestone` with an existing `id` and a different `project` silently no-ops — verified 2026-08-05. Moving means recreating, and there is no milestone-delete in the MCP either, so the originals have to be deleted by hand in the UI. Decide which project a milestone belongs to *before* creating it.
- **Milestones have no URL of their own.** You can only ever link someone to the project. Don't promise a deep link.

---

## Step 0 — Linear coordinates (two teams)

Lia runs **two** Linear teams. Route before you write:

- **`Lia Build`** (key `LIAB`, id `f400296b-7041-49a5-ab36-eb28a27cf034`) — the software business. Anything that touches the codebase or ships a software product: File Runner, experiments, design system, platform, Memory System.
- **`Lia`** (key `LIA`, id `54cdae87-19f0-4a0c-945b-4ca106312b60`) — company / strategy / operations / creative: Lia Studio, Lia Education, cross-entity, content. Everything that isn't software.

> **Don't trust this block blindly — confirm it.** Coordinates and statuses drift (this skill shipped knowing one team and one workflow; three weeks later both had changed). The **canonical source of truth for teams, statuses, labels, and conventions is the Lia Vault `CLAUDE.md`** (Conventions → Linear). The values below are a cache, last verified **2026-06-24**. If the date is old, re-read `CLAUDE.md` and re-confirm with `list_teams` / `list_projects` / `list_cycles` / `list_issue_statuses` / `list_issue_labels`, then update this block and bump the version.

**Statuses (cache, verified 2026-06-24) — the two teams run different workflows:**

- **`Lia` (Creative):** `Backlog → Todo → In Progress → In Review → Done` (+ `Cancelled`, `Duplicate`). The simple six.
- **`Lia Build`:** `Backlog → Discovery → Design → Build → Review → QA → Done`, the Team Topologies pipeline. Plus `In Progress` (lighter lane for non-pipeline work), `Todo` (placeholder), `Cancelled`, `Duplicate`. Gates are checkpoints expressed as `gate:*` labels, **not** statuses.
- **Retired 2026-06-19:** `Done Ready` and the old per-phase Creative states (Discovery/Design/QA/Dev Ready/Done Ready on the Creative team). Do not set them. An agent moving work to a status that no longer exists is the classic stale-skill failure.

**Project + cycle:** read these live — cycles rotate, so confirm the active cycle with `list_cycles` rather than hard-coding a number.

---

## Step 1 — Orient and ground (do this before writing anything)

1. **Read the parent context.** If the work sits under a project or initiative, read the project description and the relevant existing epics so the new work fits the established narrative and doesn't duplicate.
2. **Read the siblings.** Open two or three existing tickets in the same project and copy their shape — heading set, title style, level of detail. The siblings are the house style; match them (see Step 2 / Step 3). Don't import a shape from another project.
3. **Find the real vault sources.** For each piece of work, locate the canonical material it should reference. Common anchors:
   - Strategy: `Company/Strategy/lia-1-pager.md`, `product-vision-tools-for-your-adventure-2026-06-10.md`, `who-we-serve/the-people.md`
   - Product: the product's own `Outputs/` (PRD, roadmap) and `Context/`
   - Design system: `Products/Design System/Context/design-system-state-*.md`
   - Founder lenses: `Company/Founders/{dan,chris,luke}-*.md`
4. **Find the sibling tickets to wire to.** Use `list_issues` (filter by project/parent) to find what this work depends on, blocks, or relates to. Capture their IDs — they become **relations**, not prose links.

The output of Step 1 is a short list of real IDs and file paths. **If that list is empty, you have not grounded the work yet** — go back, or reconsider whether this is a doc rather than a ticket.

---

## Step 2 — The ticket shape (match the siblings)

There is no single global template — **match the shape the project's sibling tickets already use.** Two shapes are in use across Lia. Read the siblings (Step 1) and copy theirs.

**Shape A — feature / build tickets (Lia Build; e.g. File Runner).** Atomic product work. This is the default for anything an engineer picks up and builds.

```markdown
**User story**
As a <person from who-we-serve>, I want <the thing>, so that <the outcome>.

**Why it matters**
One or two plain sentences — the value, not the mechanics.

**Acceptance criteria**

- [ ] Observable, testable statements. A reviewer can tick each one.
- [ ] Cover the happy path and the obvious edge ("no location" / "nothing to do").
- [ ] Each one is a real check, not a restatement of the goal.

**Scope / non-goals**

* What this ticket deliberately doesn't do (and where that lives instead).
```

**Shape B — workstream / ops tickets (Lia Creative; e.g. Foundations).** Broader, founder-run work that isn't a single buildable feature.

```markdown
**Goal:** One sentence. What this ticket makes true.

**In scope**
* The 3–5 concrete things this covers.

**Definition of done:** The observable end state — what exists, where, signed off by whom.

**Review beat:** Who signs it off and what they're confirming.

**Creative injection:** The bit worth sweating (or "light — this one's plumbing").

**Depends on:** Plain-language dependency.
```

Rules for both:
- **Plain verb-phrase titles. No numbers.** `Read capture location from footage`, not `1. Read capture location…`. Numbers in titles fight the real ordering and break the moment you reorder — **priority + blocked-by drive order, not numbers** (see Step 4).
- **Links live in relations, not prose.** Don't smear `LIAB-xx` chips through the body. Wire the dependency as a blocked-by/related relation; the prose stays clean. (You still *grounded* the work — the link just lives in the sidebar where it belongs.)
- **One job, honest scope.** If something belongs in another ticket, name it in scope/non-goals and wire the relation rather than absorbing it.
- **Speak to a person.** Use a named face from `who-we-serve/the-people.md` (Devon, Mara, Linda…) over "the user."

---

## Step 3 — The epic shape (a job to be done)

An epic is **not** a plan or a list of its own children. It's a one-glance answer to: what job, for whom, what does success look like, and why does it matter. Lead with outcome and value; let the sub-issues carry the how.

```markdown
### JTBD
* The job the user is hiring this for — in their terms, plainly.

### User
* The named person we're serving (from who-we-serve), in their situation.

### Success
* What "it worked" looks like for them — the outcome, concretely.

### Why
* Why it's worth doing now — the value / the strategic reason.
* (Optional) the one seam line: what this does NOT own, in plain words.
```

Rules:
- **Don't list the sub-features.** The sub-issues *are* the list — Linear shows them under the epic. Repeating them as bullets is mush.
- **Keep it link-light.** The relation panel holds the dependencies and the seam; the description stays human. An epic full of chips reads like a plan, not a job.
- **Match the siblings' naming.** File Runner epics are `Epic · <name>` (plain noun); Foundations epics are lowercase-versioned (`brand 1.0`). Copy whichever the project uses. The JTBD/User/Success/Why bones stay the same either way.

---

## Step 4 — Sequence with blocked-by relations

Order comes from **priority + blocked-by**, never from numbers in titles. Tickets link with **blocked by** so the board self-orders: if a ticket is blocked, its upstream isn't finished. Build the dependency graph deliberately — it's usually a DAG, not a single chain.

- A ticket that needs the catalogue is blocked by the ingest ticket.
- A ticket that needs the brand kit is blocked by the brand epic (cross-epic blocker is fine).
- A review/lock ticket is blocked by all the substantive deliverables.

In `save_issue`, `blockedBy` and `blocks` are **append-only** — they never remove existing relations. To remove, use `removeBlockedBy` / `removeBlocks`. Use `relatedTo` for a non-blocking association (a seam, a soft reference, the research a ticket reads) — this is where the links that used to clutter the prose now live.

---

## Step 5 — Labels, priority, estimates, assignee

**Labels — type and workflow only.** Never a label for an epic, milestone, phase, or sprint. Live set (verified 2026-06-24): `Experiment`, `POC` (legacy — use `Experiment`), `Bug`, `Improvement`, `Feature`. `CLAUDE.md` is canonical for the fuller taxonomy. Anti-pattern to never create: a label like "FR MVP" or "Phase 1".

**Priority — set a deliberate one on every ticket.** Don't leave it at None. `1=Urgent, 2=High, 3=Medium, 4=Low`. Make it a real call that reflects sequence and stakes. Exploratory/`Experiment` tickets default to **Medium**.

**Estimates — skip them.** Lia sequences with blocked-by, not story points. Don't set the estimate field.

**Assignee — assign to whoever does the work.** Build tickets go to the builder (e.g. Callum on File Runner), matching the siblings. The epic and any review/lock gate go to the owner.

---

## Step 6 — Linear mechanics (the MCP)

Create or update with `save_issue` (`mcp__<linear>__save_issue`):

- **Create:** omit `id`. Required: `title`, `team`. Set `project`, `assignee`, `cycle`, `state`, `parentId`, `priority`, `labels`, `milestone`, `description`.
- **Update:** pass `id`. Only the fields you pass change.
- **Description is Markdown.** Literal newlines, no escape sequences. **Don't paste issue IDs into the prose to "link" them** — wire `blockedBy` / `relatedTo` instead so the link lives in the relation panel.
- **Parent/child:** set `parentId` on each sub-issue to the epic's id.
- **Order of operations:** create the epic first (you need its id), then the sub-issues with `parentId`, then a pass to wire `blockedBy` / `relatedTo`.

Always finish with `get_issue ... includeRelations:true` on the epic and on the most-blocked ticket to verify parentage, cycle, project, assignee, labels, priority, and relations landed.

---

## Step 7 — Reference-ability checklist

Before calling a ticket done, confirm:

- [ ] It does **one job** (no smuggled "and").
- [ ] It reads in 30 seconds: an epic answers job/user/success/why; a feature ticket has a clear user story + tickable acceptance criteria.
- [ ] It speaks to a real person, in plain language — no spec-mush.
- [ ] It's grounded in a real source (found before writing) — and the link lives as a **relation**, not chips in the prose.
- [ ] **It carries its own context.** Someone reading it cold in three months gets the why, the rejected options, and what's still open — without opening anything else. Quotes used where the real words beat a paraphrase.
- [ ] Dependencies are wired as blocked-by/related and match reality.
- [ ] On the right team (software → `Lia Build`; else → `Lia`), valid status, deliberate priority, right type label, assigned to whoever does it.
- [ ] Title is a plain verb phrase with **no number**; order is carried by priority + blocked-by.
- [ ] If it has sub-issues, it isn't in **Review/QA** ahead of them — a parent only advances to Review/QA once all its sub-issues are **Done/Cancelled**.

---

## Step 8 — Wrap up

1. **Log it.** Append to `Lia Vault/_meta/log.md` (`## YYYY-MM-DD | create | <epic> (LIA-NNN)`): epic + sub-issue IDs, the sequencing graph, what each references, and any seam edits to other tickets. Per the founder-driven rule, the founder asking = agreement; don't add review gates.
2. **Cross-founder courtesy.** If the work touches another founder's lane, flag it in the log for visibility — not as a gate.
3. **Project description doesn't auto-update.** Linear project descriptions are hand-written. If you add an epic to a project whose description enumerates the workstreams, surface it and offer to edit.
4. **Index.** Add/update the `_meta/index.md` row if you created skill or doc files alongside the tickets.

---

## Worked example A — `social media 1.0` (LIA-370), Lia Creative / Shape B

Built 2026-06-03, Dan-driven, Foundations project. The reference for the **workstream** shape.

- **Epic** `LIA-370 social media 1.0` — framed as the account stand-up + operations layer, delineated from Lia Productions, with the per-channel-strategy seam pointing at `LIA-313`.
- **8 sub-issues** in the six-part shape (Goal → In scope → DoD → Review beat → Creative injection → Depends on): platform picks → secure handles → profile assets (blocked by brand) → access → publishing rhythm → measurement → personal-channel seam → review + lock (blocked by the substantive four).
- Grounded in the growth plan + brand epic; seam noted both ways with a `relatedTo`; logged.

## Worked example B — `Epic · Location` (LIAB-312), Lia Build / Shape A

Built 2026-06-24 via this skill (CQ-driven dogfood for `LIA-388`), File Runner 2, v0.3 milestone. The reference for the **feature** shape — and the build that taught v0.3.0.

- **Epic** `LIAB-312 Epic · Location` — `JTBD / User (Devon) / Success / Why`, one seam line ("the manual version stays — they reconcile, not compete"). No subfeature list, no chips. The relation panel carries the seam to `LIAB-44`.
- **6 sub-issues** in Shape A (User story / Why it matters / Acceptance criteria / Scope · non-goals), plain titles with no numbers, assigned to Callum, ordered by priority + blocked-by: read location → turn coordinates into place names → separate same-day shoots → name events by place → reconcile typed vs captured → review and lock.
- Dependencies live as relations (e.g. read-location blocked by Ingest; reconcile blocked by the manual `LIAB-44`); the soft references (research, privacy, templates) are `relatedTo`, not prose.
- **What it taught:** the first cut was agent-mush — generic epic template, a redundant subfeature list, numbered titles, and chips smeared through every line. The fixes became v0.3.0: lead epics with the job; match the siblings' shape; drop numbers; keep links in relations.

This is the bar: grounded, one-job, reads like a job for a person, sequenced, logged.

---

## Changelog

- **0.4.0 (2026-08-05, Dan):** Context is the point. New principle 2 — *it carries its own context* — with the explicit note that "link-light" governs `LIAB-xx` chips, never reasoning; the old "keep the prose human" line had been read as "keep it thin." New section **Projects and milestones are not exempt**: the same bar applies to every Linear object, the substance must not be hoarded in the parent, and "set it up in Linear" means tickets exist or you say why they don't. Two MCP mechanics recorded: a milestone cannot be reparented (`save_milestone` silently no-ops) and milestones have no URL. Principles renumbered 3–6.

- **0.3.1 (2026-06-25, CQ):** Board-integrity rule — a parent (an epic, or any ticket with sub-issues) must not sit in **Review or QA** until all its sub-issues are **Done/Cancelled**. Added to Principle 5 (was 4) + the Step 7 checklist.
- **0.3.0 (2026-06-25, CQ review — LIA-388):** Reshaped around readability after dogfooding the skill on `Epic · Location` (LIAB-312). Epics now lead with **JTBD / User / Success / Why** (a job for a named person), and never list their own sub-features. Step 2 now teaches **two ticket shapes** — Shape A (User story / Why / Acceptance criteria / Scope, for Lia Build features) and Shape B (the six-part, for Lia Creative workstreams) — and says to **match the project's siblings** rather than force one template. **Plain titles, no numbers** (priority + blocked-by drive order). **Links live in relations, not prose.** Added principle 6 (human-first, not spec-first) and an assignee rule (build tickets → the builder). Added worked example B (File Runner location).
- **0.2.1 (2026-06-25):** Version/date touch-up.
- **0.2.0 (2026-06-24, CQ review — LIA-388):** Principles preamble; "Ticket or doc?" + intake; the `LIA-281` seam; two-team Step 0 + post-2026-06-19 workflows (retired `Done Ready`); self-healing coordinates via `CLAUDE.md`; labels/priority/estimates conventions.
- **0.1.1 (2026-06-10, Dan):** Initial house-style capture from the `social media 1.0` build.
