---
name: task-writer
slug: task-writer
description: "Ticket the named work that isn't a story — typed per the six, under a story or epic, sparse by design; plan-grain detail is refused and routed to plan-mode notes on the ticket. Use when work like 'core security setup' needs a ticket, or when deciding whether something is a task at all."
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/task-writer"
  - "write the tasks"
  - "this isn't a story, ticket it"
  - "task under <story/epic>"
companions:
  - epic-builder
  - story-writer
  - ready-review
  - ticket-builder
maintainer: cq
---

# Task writer — the named work that isn't a story

**What this is.** The seat for work that is real but serves no narrative: *"set up security protocols"* is not something a person wants so that something else — it's a task. Tasks sit **under a story** (specifying how part of it gets done) or **directly under an epic** (work the version needs that no story owns). Process: [Tool shop](https://linear.app/lia-creative/document/tool-shop-how-a-liatools-product-gets-built-4a9cfacc41c8); shapes: [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b).

**Why it exists.** Forcing a narrative onto plumbing produces fiction (*"as a user I want RLS policies"* — no they don't), and skipping the ticket entirely makes real work invisible. CQ, 26 Aug: a task is *"about figuring out individual tasks that need to be completed in order to capture a specific chunk of value."*

---

## 1. The sparse rule — read this before writing anything

**Ideally we are not putting task-grain work into Linear at all.** The fine grain of *how* is the build agent's plan, made in plan mode and **posted onto the story as a comment**. Linear holds goals and value; plans are notes on tickets.

So before ticketing, one question: **is this a goal someone could be dispatched at, or a line item of a plan?**

- A goal → a task ticket.
- A plan line item → refuse it. Say where it belongs: the builder's plan-mode notes on the story.

If you're translating a plan into tickets, stop — you're duplicating the plan into a form that goes stale the moment the builder re-plans.

## 2. The shape

- **Title names the unit of work** — two to four words, lowercase: `core security setup`, `account admin endpoint`. Bugs keep symptom titles; Decisions name the call.
- **Exactly one type** of the six: usually `Foundation` (a layer other work stands on) or `Improvement`; a `Bug` found mid-build; a `Decision` waiting on a call; `Research` for a genuine unknown.
- **The body says why it exists, the work, and checkable acceptance criteria** — where a claim about code is made, file and line. Tasks are where technical detail *belongs* (unlike stories), so be concrete.
- **Parent:** the story it specifies, or the epic when no story owns it. Never floating — a task with no parent is invisible by next morning (measured, 25 Aug).
- **Scope / non-goals** — one job; anything smuggled in by "and" is a second task or nothing.

## 3. Hand off

`ready-review` gates tasks along with the epic and stories. Mechanics — `save_issue`, relations, blocked-by sequencing, priority — live in `ticket-builder`.

---

## What this seat is not

- **Not the plan.** The sparse rule above is the whole seat. When in doubt, don't ticket it.
- **Not a story with the narrative filed off.** If a person would notice the capability, it's a story — send it to `story-writer`.
- **Not triage.** A bug pile has its own doors (`ticket-builder` grounding rules, the admission test in the shape doc).

## Changelog

- **0.1.0 (2026-08-26, CQ voice memos + Fable 5)** — first version. The task level (under story or epic), the six-types rule applied at task grain, and the sparse rule: plans live on tickets as comments, not as tickets.
