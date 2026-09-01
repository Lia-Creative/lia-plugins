---
name: ui-capture
slug: ui-capture
description: >-
  The screenshot engine behind ui-teardown — and usable on its own when you want screens with no
  analysis. Captures a web product to a consistent, standard size (1440x900 full-page PNG at 2x,
  numbered) into a dated vault run with a manifest. Two modes: directed (you hand it a list of URLs,
  including logged-in pages like a CRM contact record) and explore (point it at a product and it
  discovers plus captures the key feature surfaces). Hybrid engine: Playwright for public pages,
  Claude-in-Chrome for logged-in pages (your live browser session, no credentials handled). Every run
  writes a coverage report so you can see what was captured and what is missing. Use directly when
  someone says "capture the screens of a product", "grab screenshots of these pages", or "screenshot
  these CRM pages" — for the full capture-and-analyse flow, ui-teardown calls this automatically.
version: 0.4.0
created: 2026-06-26
updated: 2026-08-28
status: active
type: skill
maintainer: shared
trigger-phrases:
  - "capture the screens of a product"
  - "screenshot this app"
  - "grab screenshots of these pages"
  - "capture these CRM / profile pages"
  - "screenshot every feature of an app"
  - "do a UX capture run"
companions:
  - ui-teardown
  - cowork-creative-strategy
---

# ui-capture

The capture engine: take a consistent, standard-size set of screenshots of a web product, save them
into the vault as a dated run, and write a manifest + coverage report so the run is analysable and
re-findable. Usually invoked automatically by `ui-teardown` (the front door — "teardown of X"); call
it directly when you want the screens with no analysis. Points at competitors, at our own products,
or at a specific list of logged-in pages (e.g. CRM contact / profile pages).

One rule above all: **a capture run is only "done" when its coverage is known.** We never hand off a
pile of screenshots with silent gaps — the verification pass (below) is mandatory.

## When to invoke directly

- "Capture / screenshot the screens of a competitor" — recon, screens only.
- "Capture these pages" + a list of URLs — directed run (works for logged-in pages too).
- "I need screenshots of a bunch of CRM profile pages" — directed run against authenticated URLs.
- Inside another workflow that needs raw screens (e.g. the cowork-creative-strategy passes).

For the full capture-and-analyse in one step, the founder just says "teardown of X" and `ui-teardown`
invokes this for them.

## When NOT to invoke

- You want the UX/feature analysis → that is `ui-teardown` (which calls this first if needed).
- Reading one page's text → use Chrome MCP / WebFetch, no run needed.
- A native desktop app, not a website → use computer-use; this skill is web-first.

## Two modes

**Directed** — a list of URLs (with optional slugs). Captures each to the standard and writes the
manifest. This is the mode for logged-in CRM pages: paste the URLs of the records you want and the
skill walks them in order.

**Explore** — a product name (and a start URL). First *discovers* the feature surfaces (crawl the
nav, sidebar, footer, account menu; cross-check against the archetype taxonomy), proposes a capture
list for a quick confirm, then captures. Explore always records discovered-vs-captured (crawl
completeness).

Most real runs blend the two: explore to find the surfaces, then a directed top-up to fill named gaps.

## Engine routing (the hybrid)

Pick the engine per page, not per run:

| Page | Engine | Why |
| --- | --- | --- |
| Public, unauthenticated | Playwright (`scripts/capture.mjs`) | pixel-perfect, runs in the background, batches cleanly, exact 1440x900 at 2x |
| Logged-in / behind auth (CRM, dashboards) | Claude-in-Chrome MCP | uses your live session — no credentials touched, no login automation |
| Native desktop app | computer-use | only when the target is not a website |

### Where each engine runs (important)

- **Playwright** runs on **a founder's Mac** — a local Cowork session or Claude Code — where it can
  install the Chromium binary + its system libraries (`npm i playwright && npx playwright install
  chromium`, once). It does **not** run in the hosted Cowork sandbox: that environment has no
  permission to install the browser's system dependencies, so the browser fails to launch there.
  (Verified 2026-06-26.)
- **Claude-in-Chrome** runs **anywhere Cowork runs** — it drives your real Chrome via the extension,
  no local install. So in a hosted-sandbox session, use Chrome MCP for *all* pages (public +
  logged-in); on your Mac, prefer Playwright for the public batch and Chrome for the logged-in set.
- **Persistence caveat (verified 2026-06-26, Attio run):** in a **hosted** Cowork session, Chrome MCP
  can *view* screenshots but **cannot write them to disk** (`save_to_disk` no-ops). You can still do a
  full teardown from live viewing — cite surfaces by slug and note in the manifest that shots were
  viewed-not-archived (**this manifest note is mandatory, not a courtesy — a run without it reads as archived to the next agent, and re-verification becomes impossible**) — but to get the actual PNG/JPEG files into the run folder, run from a founder's
  **Mac** (local Cowork / Claude Code), where Chrome persistence + Playwright both work.

Rule of thumb: **on your Mac, hybrid as designed; in a hosted session, Chrome MCP for everything.**
Either way the manifest + standard are identical, so runs stay comparable regardless of engine.

## The screenshot standard (consistency)

Every shot, every engine, aims at the same spec so shots line up across products and runs:

- **Viewport 1440 x 900**, device scale factor 2 (retina — crisp text).
- **Full-page** capture (the entire scroll height), saved as **PNG**.
- **One surface per shot.** Do not cram two features into one screenshot.
- **Numbered, slugged filenames:** `NN-surface-slug.png`, zero-padded (`01-dashboard.png`,
  `02-contact-record.png`). Use the taxonomy's surface slugs where they fit, so the *same* surface
  sits in the *same* row when `ui-teardown` builds the cross-product matrix.

Playwright hits this exactly. Claude-in-Chrome: resize the window to about 1440 wide and full-page
capture — not byte-identical, but consistent within the authenticated set, which is what matters.

## The QA gate (per shot)

`scripts/capture.mjs` runs these automatically for public pages; apply the same spirit to Chrome shots:

- HTTP status is 2xx/3xx (flag anything else).
- Page is settled before the shot: load + network-idle + an 800ms settle.
- Cookie/consent banner dismissed (common "Accept / Agree / Got it" buttons are tried first).
- Content is actually present (body text over a threshold; not an unexpected 404, error, or login wall).
- File is not blank (bytes over ~8KB) and dimensions match the standard.

Each shot gets a QA status in the manifest: `ok` · `warn` (with reasons) · `fail` (with reasons).
Fails get one automatic retry. Any warn/fail shots surface in `manifest.md` so they are never invisible.

## Coverage + the verification pass (the "are we missing features" eval)

The quality mechanism that answers *"how do we know we did not miss a feature?"* — **mandatory**, a
run is not complete without it.

1. **Classify the archetype.** CRM, project/work tool, content/creator tool, e-commerce, generic
   SaaS, analytics, social. Load the expected surfaces from `reference/feature-taxonomy.md`.
2. **Record the discovered set (explore).** From the nav/sidebar/footer/account menu, list the
   candidate destinations. Captured-vs-discovered = crawl completeness.
3. **Run the verification pass after capturing.** Compare what you captured against (a) the taxonomy
   checklist for that archetype and (b) the discovered set. Write a `## Coverage` block into
   `manifest.md`: captured (N), expected-but-missing (each with a reason), discovered-but-uncaptured
   (each with a reason), and a coverage score (captured expected / total expected).
4. **Close the gaps.** If the gaps are material, propose (and, with a nod, run) a second targeted
   directed pass to fill the named surfaces. Only then is the run "done."

This coverage block is the contract `ui-teardown` reads to set its confidence score — so gaps
propagate honestly into the analysis instead of disappearing.

## Where runs are saved (storage convention)

Type decides the home; every run is a **dated folder** so re-runs stack chronologically. Replace the
braces with real values:

- **Competitor** → `Research/Competitors/{competitor-slug}/captures/{date}-{target-slug}/`
- **Our own product** → `Products/{Product}/Resources/captures/{date}-{slug}/`
- **Ad-hoc / CRM page sets / cross-tool** → `Research/UX Captures/{target-slug}/{date}/`

(`{date}` is `YYYY-MM-DD`.) Each run folder holds: the numbered PNGs, `manifest.json`
(machine-readable), `manifest.md` (human-readable + the coverage block), and for explore runs
`candidates.json` (the discovered set before curation). Create parent folders if they do not exist.

## The manifest

Two files per run, both written by the skill — see `reference/manifest-template.md` for the full
schema. `manifest.json` is the structured record (run meta + one row per shot + the coverage object).
`manifest.md` is the readable table plus the `## Coverage` block. The manifest is the **handoff
contract**: any `ui-teardown` run picks up the analysis from these files alone.

## Running the capture script (public pages, on your Mac)

```bash
cd "RUN_FOLDER"                                     # or pass --out
# one-off, first time on this machine:
npm i playwright && npx playwright install chromium

# directed capture from a job file:
node "[this skill]/scripts/capture.mjs" job.json --out .
# installed, the script sits at ${CLAUDE_PLUGIN_ROOT}/skills/ui-capture/scripts/capture.mjs

# explore: discover candidate surfaces from a start URL first
node "[this skill]/scripts/capture.mjs" --discover https://app.example.com --out .
#   -> writes candidates.json; curate it into job.json, then run the directed capture

# logged-in app (CRM): a persistent Chrome profile inherits your session; first run logs in by hand
npm i playwright && npx playwright install chromium
node "[this skill]/scripts/capture.mjs" job.json --out . \
  --user-data-dir ~/.lia/ui-capture/chrome-profile --channel chrome --login-wait 45
```

`job.json` shape (see the script header for all fields):

```jsonc
{
  "target": "HubSpot",
  "type": "competitor",                 // competitor | own | crm | adhoc
  "archetype": "crm",                   // drives the taxonomy in the verification pass
  "viewport": { "width": 1440, "height": 900, "deviceScaleFactor": 2 },
  "fullPage": true,
  "dismissCookies": true,
  "pages": [
    { "slug": "dashboard",       "url": "https://app.example.com/home" },
    { "slug": "contact-record",  "url": "https://app.example.com/contacts/123" }
  ]
}
```

**Logged-in pages, two ways.** On a **Mac** the script handles auth itself with `--user-data-dir` (a
dedicated persistent Chrome profile; `--login-wait <sec>` on the first run lets you log in once, then
the session persists for every later run) — screenshots write straight to disk as PNG at the standard,
and URL-addressable surfaces (record tabs, list views, settings) need no clicking. Alternatively drive
Claude-in-Chrome (your live session, no profile setup) — but it only persists to disk in a Mac
session, not a hosted one (see the persistence caveat above). With Chrome-in-the-loop, resize the
window to 1440 wide, full-page screenshot each URL, save as `NN-slug.png`, and add the manifest rows by
hand. Keep the numbering continuous
across both engines.

## Logged-in pages + sensitive data

Per the founder decision: **capture, flag any PII, keep local.**

- Use Claude-in-Chrome so we never handle credentials or automate a login.
- Prefer a demo/sandbox account when one exists.
- Scan each authenticated shot; if real customer PII is visible, set `pii: true` on that manifest row
  and note what is shown.
- These runs stay **in the vault, local**. Never push authenticated shots to `renders.lia.build` or
  any external surface, and never send them to an external API — `ui-teardown` reads them locally.

## Cross-founder

Canonical here in the `lia-tools` plugin — script and all — since 26 Aug 2026; Dan, CQ, and Luke all
use the same engine, and the manifest is the shared contract between a capture run and a teardown run. The normal entry point is "teardown of X"
(see `ui-teardown`); reach for `ui-capture` directly when you want screens only.

## Changelog

- **0.4.0 (2026-08-28, LIAB-963)** — every command example invoked `VAULT/_meta/skills/ui-capture/scripts/capture.mjs`, a path retired on 26 Aug (LIAB-919) and one a plugin install has no way to reach. This plugin ships its own `scripts/capture.mjs` — verified byte-identical to the vault copy with `cmp` before the switch — so the examples now use the house form the other script-carrying skills use (`[this skill]/scripts/…`, with `${CLAUDE_PLUGIN_ROOT}` spelled out once for the installed path). §Cross-founder says canonical is the plugin, not the vault folder. No change to the capture method, the screenshot standard, or the manifest.
