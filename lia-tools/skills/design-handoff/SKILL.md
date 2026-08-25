---
name: design-handoff
slug: design-handoff
description: "How a design reaches a builder — the .dc.html prototype folder, how to read it (markup, DS helmet, the state class that lists the real interaction states), and the rule that the artefact outranks ticket prose. Use when a story carries a design spec, when opening a .dc.html, or when writing a design onto a ticket."
version: 0.1.0
created: 2026-08-26
updated: 2026-08-26
status: active
triggers:
  - "/design-handoff"
  - "open the design spec"
  - "read the dc.html"
  - "how does the design reach the builder"
companions:
  - polish
  - build-prep
  - build
maintainer: cq
---

# Design handoff — the interface itself, not a description of it

**What this is.** How a design travels from a design session to a build agent: what the artefact is, how to read it, and the standing rule — **a design-led ticket attaches the artefact and links the Claude Design project id; it never transcribes the design into prose.** Prose and artefact drift (LIAB-805 carried a stale prose transcription of its own attached design), and where they disagree, **the artefact wins** — the ticket says so in one line.

**Why it exists.** LIAB-859's finding, plus a paid cost: reading a `.dc.html` cost a session roughly forty tool calls the first time and was re-derived from scratch by a later one. This is the route, written down once — **verified 26 Aug 2026 against two real prototypes** (`design/toybox-shell/Toybox Shell.dc.html` and `design/feedback-capture/Feedback in the shell.dc.html` in lia-toy-box), not from memory. That verification mattered: the previously-remembered route described a different variant and would have been wrong for these files.

---

## 1. The artefact is a folder, not a file

A prototype ships as `<name>.dc.html` **plus its sidecars**, and the handoff moves the folder:

```
design/<spec-name>/
  <Name>.dc.html          the prototype — readable HTML (see §2)
  support.js              the runtime the prototype's directives need
  _ds/<ds-project-id>/    the design system snapshot it renders with:
    tokens/*.css          the token sheets (fonts, theme, semantic, base…)
    styles.css            component styles
    _ds_bundle.js         the DS runtime
    _ds_manifest.json     what the snapshot contains
  <companion docs>        build spec / prompts / handover, when the designer wrote them
```

The `_ds/` directory name carries the **Claude Design project id** (for Toys DS work: `toys-ds-aa52a0d1-…`, matching CLAUDE.md rule 5). A `.dc.html` copied without its folder renders wrong and reads incomplete — attach or commit the folder.

## 2. Reading it — the current format (both repo prototypes, verified 26 Aug 2026)

The file is **plain, readable HTML**. Open it raw; no decoding needed:

1. **The top comment** often self-identifies — the feedback prototype opens with the tickets it serves (*"LIAB-770 / LIAB-771"*) and what it changes relative to its base. Read it first.
2. **`<x-dc>`** is the root element, immediately inside `<body>`.
3. **`<helmet>`** lists the DS stylesheets it renders with — which token sheets, from which DS project id. This is the design's statement of what system it's expressed in; `polish` holds the build to it.
4. **The markup** is the interface: ordinary elements plus directives — `<x-import>` (pulls in a shared fragment) and `sc-for`-style bindings (template iteration/state hooks) that `support.js` resolves.
5. **The tail `<script>` is the behaviour spec.** One class holding the state keys (`login`, `usage`, `codeShown`, …), the derived display values, and the interaction helpers (`flip` / `knob` / `track`). **The state keys in that class are the real interaction states the build must solve for** — read them as the definitive list, alongside the story's scenarios.

**To look at it rendered:** serve or open the *folder* so the sidecars resolve (a lone file 404s its DS). The visual walk against the build is `polish`'s job.

## 3. The older export variant — if the file is not readable raw

An earlier claude.ai-exported variant exists (seen and unpacked in an August session): the page content lives compressed — a **base64+gzip manifest**, the page under a `__bundler/template` key, the interaction logic in an `x-dc` block at the tail, and a **scenario enum** as the state list. If you open a `.dc.html` and see a wall of base64 instead of markup, it's that variant: decode the manifest (base64 → gunzip → JSON), read the template and the scenario enum. Don't force one variant's route onto the other — check readability first.

## 4. What goes on the ticket

- **The artefact attached or committed** (the folder), and the **Claude Design project id** linked.
- **One line:** *"Where prose and this artefact disagree, the artefact wins."*
- **No transcription.** Ticket prose carries the story and criteria; the design carries itself. A designer's build spec or handover doc rides along as a companion file, not as pasted prose.
- The lead engineer's `build-prep` cites the artefact's path and its state class; `ready-review`/`ticket-review` treat a design-led story without its artefact as not ready.

## What this seat is not

- **Not design production** — that's the design session's; this is the seam.
- **Not `polish`** — polish verifies the build against the artefact; this skill gets the artefact to the builder readable.
- **Not a Figma route.** These are `.dc.html` prototypes; Figma-based handoff, if it returns, gets its own dated section rather than being squeezed in here.

## Changelog

- **0.1.0 (2026-08-26, LIAB-921 + Fable 5)** — first version, written against the two real prototypes in lia-toy-box `design/` (opened and probed, not recalled); the older base64 variant documented from the prior session's unpack with a readability check to tell them apart. LIAB-859 points here rather than repeating it.
