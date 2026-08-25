---
name: ticket-builder
slug: ticket-builder
description: How Lia builds Linear tickets and epics properly. The principles a good ticket holds to, the epic and ticket shapes (matched to the project's siblings), titles that name the unit of work with the story kept in the body, priority-and-dependency ordering, blocked-by sequencing, grounding every ticket in real vault sources with links kept in the relation field, the team/status/label/priority conventions, the doc-vs-ticket line, the Linear MCP mechanics, and the wrap-up rules (logging, cross-founder courtesy, project-description sync). Use whenever creating, restructuring, or breaking work into Linear issues for the Lia team.
version: 0.4.0
created: 2026-06-03
updated: 2026-08-26
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

> [!important] **On ticket *shape*, *types* and *titles*, the canonical source is the Linear doc [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b)** (Lia Toys project, written 25 Aug 2026).
> **This skill owns the mechanics** — grounding, sequencing, the MCP calls, the wrap-up. It should **point at that doc, not restate it.** Where the two disagree the doc wins and this skill gets fixed. Restating it here is exactly how this skill spent two months teaching a title convention the board had moved off.

**Trigger:** any request to create, restructure, sequence, or break work into Linear issues for the Lia team. Also "ticket builder" by name.

**Purpose:** make Lia's Linear tickets consistently good — human-readable, grounded in real vault material, and sequenced so the board tells the truth. A founder should be able to read an epic in one glance and know the job, who it's for, and what success looks like.

---

## What a good ticket feels like

Before the procedure, the feel. If a principle and a step ever disagree, the principle wins — the steps are just the usual way of getting here.

1. **Grounded.** It's anchored in something real — the actual strategy doc, wiki page, design-system state, or sibling ticket — found *before* writing. Record the link as a relation, not as chips smeared through the prose. A ticket with nothing real behind it is either too early, or it's a doc and not a ticket.
2. **One job.** A ticket makes *one* thing true. If the goal needs an "and," it's probably two tickets. Honest scope beats a tidy-looking pile.
3. **Reads in thirty seconds.** What it is, who it's for, when it's done — without a meeting or a DM.
4. **The board tells the truth.** Status and blocked-by reflect reality. If a ticket is blocked, its upstream genuinely isn't done. A glance at the board should be an honest picture of the work — not aspiration. **And a parent never runs ahead of its children:** don't move an epic — or any ticket with sub-issues — into Review or QA until all its sub-issues are Done or Cancelled. A parent in a review state while its children are still open is the board lying.
5. **Human-first, not spec-first.** An epic reads like a job to be done for a real person — outcome and value up front. A ticket reads like a user story with a clear "done." Plain language. If a human can't grasp it at a glance, it's agent-mush — rewrite it. Mechanics (links, IDs, dependencies) live in Linear's relation fields and the sidebar, not sprinkled through the prose.

**The rule the skill was built on (Dan, 2026-06-03):** tickets reference real data and files. Before writing, find the source. The grounding is what makes a ticket real instead of decorative — just keep the *link* in the relation field and the *prose* human (CQ, 2026-06-25).

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
2. **Read the siblings.** Open two or three existing tickets in the same project and copy their **shape** — heading set, level of detail. The siblings are the house style; match them (see Step 2 / Step 3). Don't import a shape from another project. **Titles are the exception: they follow the Lia-wide rule in Step 3, not the siblings.** Anything created before 26 Aug 2026 is on the old verb-phrase convention, so copying a sibling's title style now copies a retired rule.
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
- **Titles name the thing. No numbers.** A ticket's title is a **noun phrase you can say out loud and point at** — `core security setup`, `single account identity`, `account admin endpoint`, `place-name lookup`. Two to four words, lowercase. **Not a verb phrase and not a sentence.** CQ, 26 Aug 2026, **Lia-wide**: *"sub tickets are the breakdown of how we get to the value of the epic… they aren't stories"* and *"every story has a title. The ticket name is the title, and the story itself goes onto the ticket."*
  - **The story isn't lost, it moves.** What used to be the title becomes the **Goal / User story line in the body**. `sign in with Google or Apple and land on the account you already have` is the goal; `google and apple sign-in` is the name.
  - **Three carve-outs.** A **Bug** keeps the symptom in its title — that's how you recognise the same thing twice. A **Decision** names the call to be made (`stage and group naming`). An **epic** carries the value in plain words.
  - **The test:** does it survive being spoken in a standup? *"How's core security setup?"* works. *"How's the account service's security rules are written down and tested?"* doesn't.
  - **Numbers stay banned** — they fight the real ordering and break the moment you reorder. **Priority + blocked-by drive order** (see Step 4).
  - **This replaced the verb-phrase rule** that shipped 2026-06-25. Titles created before 26 Aug 2026 read as legacy; **don't retitle finished work** to match.
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
- **Match the siblings' naming — for epics.** File Runner epics are `Epic · <name>` (plain noun); Foundations epics are lowercase-versioned (`brand 1.0`); Lia Toys uses plain lowercase (`authentication and account management 1.1`). Copy whichever the project uses. The JTBD/User/Success/Why bones stay the same either way. **An epic's title may be a sentence — it carries the value.** Its children may not; they follow Step 3.

---

## Step 4 — Sequence with blocked-by relations

Order comes from **priority + blocked-by**, never from numbers in titles. Tickets link with **blocked by** so the board self-orders: if a ticket is blocked, its upstream isn't finished. Build the dependency graph deliberately — it's usually a DAG, not a single chain.

- A ticket that needs the catalogue is blocked by the ingest ticket.
- A ticket that needs the brand kit is blocked by the brand epic (cross-epic blocker is fine).
- A review/lock ticket is blocked by all the substantive deliverables.

In `save_issue`, `blockedBy` and `blocks` are **append-only** — they never remove existing relations. To remove, use `removeBlockedBy` / `removeBlocks`. Use `relatedTo` for a non-blocking association (a seam, a soft reference, the research a ticket reads) — this is where the links that used to clutter the prose now live.

---

## Step 5 — Labels, priority, estimates, assignee

**Labels — type and workflow only.** Never a label for an epic, milestone, phase, or sprint. Anti-pattern to never create: a label like "FR MVP" or "Phase 1".

**Six types, exactly one per leaf, never on an epic** (verified live 2026-08-25): `Bug` · `Feature` · `Improvement` · `Decision` · `Research` · `Foundation`. `Decision` and `Foundation` were both added 25 Aug 2026 — `Foundation` on CQ's call that *architecture is foundations, not improvements* (identity, data models, contracts, security rules; its test is that other work becomes possible or safe because it exists). **`POC` no longer exists**; `Experiment` is a live label but not one of the six. **An epic carries no type** — it is a position, not a label.

**Workflow and routing labels sit alongside a type:** `human:chris` (blocked on a specific human action — the most under-used label on the board), `promotion` (**the one exemption — it replaces a type**), `idea`, `gate:*`, `defect:*`, `override:*`, and the **`specialist` group — `infra` / `auth` / `design-system` / `eval-harness` — which is mutually exclusive: passing two of them to `save_issue` is a 400, not a merge.**

[How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b) is canonical for the taxonomy and gives each type its test. Re-confirm with `list_issue_labels` if this block's date looks old.

**Priority — set a deliberate one on every ticket.** Don't leave it at None. `1=Urgent, 2=High, 3=Medium, 4=Low`. Make it a real call that reflects sequence and stakes. Exploratory/`Experiment` tickets default to **Medium**.

**Priority is two scales, not one (CQ, 2026-08-11).** A **parent's** priority ranks that bucket against the *other parents*. A **child's** priority ranks it *within its own bucket*. So a Medium child of an Urgent parent outranks a High child of a Low parent — you read the parent first, then the child. Never set a child's priority by comparing it to a child in a different bucket, and never flatten a parent to match its children.

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
- [ ] Dependencies are wired as blocked-by/related and match reality.
- [ ] On the right team (software → `Lia Build`; else → `Lia`), valid status, deliberate priority, right type label, assigned to whoever does it.
- [ ] Title **names the unit of work** — noun phrase, two to four words, lowercase, **no number**. Bugs carry the symptom; Decisions name the call. The story sits in the body, not the title. Order is carried by priority + blocked-by.
- [ ] If it has sub-issues, it isn't in **Review/QA** ahead of them — a parent only advances to Review/QA once all its sub-issues are **Done/Cancelled**.

---

## Step 8 — Wrap up

1. **Log it.** Append to `Lia Vault/_meta/log.md` (`## YYYY-MM-DD | create | <epic> (LIA-NNN)`). **At the bottom of the file — append your block, never rewrite the file to insert at the top** (CLAUDE.md housekeeping rule 2, tightened 2026-08-19). Content: epic + sub-issue IDs, the sequencing graph, what each references, and any seam edits to other tickets. Per the founder-driven rule, the founder asking = agreement; don't add review gates.
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

> [!note] **These titles are pre-26-Aug-2026 and shown as built, not as a model.** They are verb phrases, which the titling rule in Step 3 replaced. Under the current rule they would be **`location extraction` · `place-name lookup` · `same-day shoot split` · `event naming` · `capture reconciliation` · `review and lock`** — and the verb phrases they replace become each ticket's User story line. The example is left as it shipped because rewriting it would hide the change; use the conversion, not the originals.
- Dependencies live as relations (e.g. read-location blocked by Ingest; reconcile blocked by the manual `LIAB-44`); the soft references (research, privacy, templates) are `relatedTo`, not prose.
- **What it taught:** the first cut was agent-mush — generic epic template, a redundant subfeature list, numbered titles, and chips smeared through every line. The fixes became v0.3.0: lead epics with the job; match the siblings' shape; drop numbers; keep links in relations.

This is the bar: grounded, one-job, reads like a job for a person, sequenced, logged.

---

## Changelog

- **0.4.0 (2026-08-26, CQ):** **Titles name the unit of work** — noun phrase, two to four words, lowercase — replacing the verb-phrase rule from 0.3.0. **Lia-wide**, on CQ's call: *"sub tickets are the breakdown of how we get to the value of the epic… they aren't stories"* and *"every story has a title. The ticket name is the title, and the story itself goes onto the ticket."* The old title becomes the body's Goal / User story line. Carve-outs: Bugs keep the symptom, Decisions name the call, epics carry the value. "Match the siblings" narrowed to **shape**, since sibling titles are now pre-convention. Label block rebuilt: **six types** including `Decision` and `Foundation` (both 25 Aug 2026), `POC` removed, specialist-group exclusivity noted. Added a pointer making [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b) canonical for shape/types/titles, so this skill stops restating what it can only drift from. Worked example B annotated with the conversion rather than rewritten.
- **0.3.2 (2026-08-19) — logged retroactively on 2026-08-26**, having been shipped without a changelog entry. Two changes, recovered by diffing against the plugin export: **priority is two scales, not one** (CQ, 2026-08-11 — a parent's priority ranks its bucket against other parents, a child's ranks it within its own bucket), and **append log entries at the bottom of `_meta/log.md`, never rewrite the file to insert at the top** (CLAUDE.md housekeeping rule 2, tightened 2026-08-19).
- **0.3.1 (2026-06-25, CQ):** Board-integrity rule — a parent (an epic, or any ticket with sub-issues) must not sit in **Review or QA** until all its sub-issues are **Done/Cancelled**. Added to Principle 4 + the Step 7 checklist.
- **0.3.0 (2026-06-25, CQ review — LIA-388):** Reshaped around readability after dogfooding the skill on `Epic · Location` (LIAB-312). Epics now lead with **JTBD / User / Success / Why** (a job for a named person), and never list their own sub-features. Step 2 now teaches **two ticket shapes** — Shape A (User story / Why / Acceptance criteria / Scope, for Lia Build features) and Shape B (the six-part, for Lia Creative workstreams) — and says to **match the project's siblings** rather than force one template. **Plain titles, no numbers** (priority + blocked-by drive order). **Links live in relations, not prose.** Added principle 5 (human-first, not spec-first) and an assignee rule (build tickets → the builder). Added worked example B (File Runner location).
- **0.2.1 (2026-06-25):** Version/date touch-up.
- **0.2.0 (2026-06-24, CQ review — LIA-388):** Principles preamble; "Ticket or doc?" + intake; the `LIA-281` seam; two-team Step 0 + post-2026-06-19 workflows (retired `Done Ready`); self-healing coordinates via `CLAUDE.md`; labels/priority/estimates conventions.
- **0.1.1 (2026-06-10, Dan):** Initial house-style capture from the `social media 1.0` build.
