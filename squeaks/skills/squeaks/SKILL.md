---
name: squeaks
description: The Squeaks lo-fi prototyping methodology — copy-first, deliberately rough, clickable wireframes. Use whenever working inside a Squeaks prototype (a Vite + React project scaffolded from Lia-Creative/squeaks) or when the user wants to explore an idea or flow that isn't shaped yet.
---

# Squeaks — lo-fi, copy-first prototyping

Squeaks exists to keep the *thinking* ahead of the *polish*. Whiteboard sketches can't be clicked. Figma looks finished before the thinking is finished. Vibe-coding skips the thinking entirely. Squeaks sits in the gap: a clickable wireframe you can navigate, with intentionally unfinished styling so nobody mistakes it for a final design.

## The philosophy (do not violate)

- **Rough is the feature.** Comic Neue, monochrome (black / white / grays), 2px borders. Never apply brand colours, never pull in the Lia design system, never make it look done. If it looks finished, it has failed at its job — that work belongs in `design-and-refine`.
- **Copy first.** Real words beat lorem ipsum and beat pretty boxes. The content is the thinking. Write the actual labels, headings, empty states, and button text.
- **Clickable beats beautiful.** Every screen should be navigable. Wire the routes so the user can walk the flow.

## The loop

1. **Describe a screen** in plain language, or paste an ASCII wireframe. ASCII is encouraged — it forces layout decisions without styling decisions.
2. **Build the page and wire its route** (React Router, client-side, no backend).
3. **Click through it** in the browser (http://localhost:5173) and iterate by describing what's wrong, not by polishing.
4. **Version directions via URL prefixes** — `/v1/dashboard`, `/v2/dashboard` — so two ideas can be compared by clicking between them.

## Tech (already wired in the template)

Vite + React 19 + TypeScript, React Router, Tailwind v4, shadcn UI primitives (button, card, table, dialog, form), Comic Neue. No backend. Don't add a backend, auth, a database, or a component library — if a prototype needs those, it has outgrown Squeaks.

## When to leave Squeaks

When the idea and flow are settled and you want to make a real component look right in an actual product repo, switch to **design-and-refine** (`/design-and-refine:start`) — that's the hi-fi, on-brand half of the pair.
