---
description: Scaffold a new deliberately-rough lo-fi Squeaks prototype and start the dev server.
argument-hint: <prototype-name>
allowed-tools: Bash, Read, Edit, Write
---

You are starting a new **Squeaks** lo-fi prototype. The point of Squeaks is to think *before* the thing looks finished — copy-first, clickable, intentionally rough. Do **not** polish it, do **not** apply brand styling, do **not** reach for the Lia design system. Rough is the feature.

## 1. Scaffold

The prototype name is: **$ARGUMENTS** (if empty, ask the user for a short kebab-case name before continuing).

From the user's current working directory, scaffold a clean copy of the Lia Squeaks template (no shared git history):

```bash
npx degit Lia-Creative/squeaks "$ARGUMENTS"
cd "$ARGUMENTS"
npm install
```

If `npx degit` is unavailable or fails, fall back to:
```bash
git clone --depth=1 https://github.com/Lia-Creative/squeaks.git "$ARGUMENTS" && rm -rf "$ARGUMENTS/.git"
```

Initialise a fresh git repo so this prototype is its own thing:
```bash
cd "$ARGUMENTS" && git init -q && git add -A && git commit -q -m "chore: scaffold Squeaks prototype"
```

## 2. Run it

Start the dev server and confirm it's serving:
```bash
npm run dev
```
It runs on http://localhost:5173. If the preview tools are available, open it and show the user it's live rather than asking them to check.

## 3. Hand back to the user with the methodology

Tell the user, briefly, how to drive it (this is the whole pattern — see the `squeaks` skill for the full methodology):

- **Describe a screen in plain language, or paste an ASCII wireframe.** Claude builds the page + wires the route.
- **Click through it** in the browser and iterate by describing what's wrong.
- **Version ideas via URL prefixes** — `/v1/dashboard` vs `/v2/dashboard` — so you can compare directions side by side.
- **Keep it rough.** Comic Neue, monochrome, 2px borders. If it starts looking finished, you've gone too far — that's design-and-refine's job, not Squeaks'.

Do not over-explain. Scaffold, run, show it's live, then wait for the user's first screen description.
