#!/usr/bin/env node
//
// ui-capture — Playwright capture engine for PUBLIC (unauthenticated) pages.
// Logged-in pages are captured via Claude-in-Chrome instead (see SKILL.md) — this
// script handles the pixel-perfect public side of the hybrid.
//
// Usage:
//   node capture.mjs job.json [--out dir]      directed capture from a job file
//   node capture.mjs --discover startUrl [--out dir]   crawl nav -> candidates.json
//
// Logged-in apps (CRM dashboards) — inherit a real Chrome login via a persistent profile:
//   node capture.mjs job.json --user-data-dir <dir> [--channel chrome] [--login-wait 45]
//   First run: pass --login-wait <sec> and log in by hand in the window that opens; the
//   session persists in <dir> for every later run. Screenshots write straight to disk as PNG.
//   Use a DEDICATED dir (e.g. ~/.lia/ui-capture/chrome-profile), not your everyday Chrome
//   profile, so it doesn't clash with an open Chrome (profile lock).
//
// job.json:
//   {
//     "target": "HubSpot",
//     "type": "competitor",            // competitor | own | crm | adhoc
//     "archetype": "crm",              // crm | project | creator | ecommerce | analytics | social | saas
//     "viewport": { "width": 1440, "height": 900, "deviceScaleFactor": 2 },
//     "fullPage": true,
//     "dismissCookies": true,
//     "pages": [ { "slug": "dashboard", "url": "https://..." }, ... ]
//   }
//
// Output (into --out, default "."): NN-slug.png + manifest.json + manifest.md
// (discover mode: candidates.json). The verification pass / ui-teardown fills the
// coverage block in manifest.md.
//
// Standard: 1440x900 @2x, full-page, PNG, numbered NN-slug.png.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Resolve playwright from wherever the user installed it (their cwd's node_modules first,
// since the script itself lives in the Drive-synced vault where we don't keep node_modules),
// then fall back to a normal/global resolution.
async function loadChromium() {
  try {
    const requireCwd = createRequire(path.join(process.cwd(), "package.json"));
    return requireCwd("playwright").chromium;
  } catch (_) {}
  try {
    const mod = await import("playwright");
    return mod.chromium;
  } catch (_) {}
  return null;
}

const MIN_BYTES = 8192;
const MIN_TEXT = 30;
const SETTLE_MS = 800;
const NAV_TIMEOUT = 30000;
const ERROR_MARKERS = /(404|not found|page not found|access denied|forbidden|something went wrong|this page (isn.?t|is not) available)/i;
const COOKIE_NAMES = /^(accept all|accept|i agree|agree|got it|allow all|allow|ok, got it|continue|close)$/i;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") args.out = argv[++i];
    else if (a === "--discover") args.discover = argv[++i];
    else if (a === "--user-data-dir") args.userDataDir = argv[++i];
    else if (a === "--channel") args.channel = argv[++i];
    else if (a === "--head") args.head = true;
    else if (a === "--login-wait") args.loginWait = parseInt(argv[++i], 10) || 0;
    else args._.push(a);
  }
  args.out = args.out || ".";
  return args;
}

function pngSize(buf) {
  // PNG: 8-byte sig, then IHDR (len4 + "IHDR" + width4 + height4)
  if (buf.length < 24) return { width: 0, height: 0 };
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function tryDismissCookies(page) {
  try {
    const btn = page.getByRole("button", { name: COOKIE_NAMES }).first();
    if (await btn.count()) {
      await btn.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(300);
      return true;
    }
  } catch (_) {}
  // common consent containers
  for (const sel of ["#onetrust-accept-btn-handler", "button[aria-label*='accept' i]", ".cc-allow", "[data-testid*='accept' i]"]) {
    try {
      const el = page.locator(sel).first();
      if (await el.count()) { await el.click({ timeout: 1200 }).catch(() => {}); return true; }
    } catch (_) {}
  }
  return false;
}

async function settle(page) {
  try { await page.waitForLoadState("networkidle", { timeout: 8000 }); } catch (_) {}
  await page.waitForTimeout(SETTLE_MS);
}

async function captureOne(context, shot, idx, outDir, opts) {
  const page = await context.newPage();
  const row = {
    index: idx,
    slug: shot.slug,
    url: shot.url,
    final_url: null,
    engine: "playwright",
    status: null,
    width: 0,
    height: 0,
    bytes: 0,
    file: null,
    qa: { status: "ok", reasons: [] },
    pii: false,
    captured_at: new Date().toISOString(),
  };
  const file = `${String(idx).padStart(2, "0")}-${shot.slug}.png`;
  const dest = path.join(outDir, file);

  async function attempt() {
    let resp = null;
    try {
      resp = await page.goto(shot.url, { waitUntil: "load", timeout: NAV_TIMEOUT });
    } catch (e) {
      row.qa.reasons.push("nav-error: " + e.message.split("\n")[0]);
    }
    row.status = resp ? resp.status() : null;
    row.final_url = page.url();
    if (opts.dismissCookies) await tryDismissCookies(page);
    await settle(page);
    const buf = await page.screenshot({ fullPage: opts.fullPage !== false });
    fs.writeFileSync(dest, buf);
    const dim = pngSize(buf);
    row.width = dim.width; row.height = dim.height; row.bytes = buf.length; row.file = file;
    // content presence + error markers
    let textLen = 0, title = "";
    try { textLen = await page.evaluate(() => (document.body ? document.body.innerText.length : 0)); } catch (_) {}
    try { title = await page.title(); } catch (_) {}
    let bodyText = "";
    try { bodyText = await page.evaluate(() => (document.body ? document.body.innerText.slice(0, 400) : "")); } catch (_) {}
    return { textLen, title, bodyText };
  }

  let { textLen, title, bodyText } = await attempt();

  // QA assessment
  const reasons = row.qa.reasons;
  const errHit = ERROR_MARKERS.test(title) || ERROR_MARKERS.test(bodyText);
  if (row.status && row.status >= 400) reasons.push("http-" + row.status);
  if (row.bytes < MIN_BYTES) reasons.push("blank-or-tiny-image");
  if (textLen < MIN_TEXT) reasons.push("almost-no-text");
  if (errHit) reasons.push("error-page-markers");

  let qa = reasons.length ? "fail" : "ok";
  if (qa === "ok" && (textLen < 200 || (row.status && row.status >= 300 && row.status < 400))) {
    qa = "warn";
    if (textLen < 200) reasons.push("low-text-content");
    if (row.status >= 300 && row.status < 400) reasons.push("redirected");
  }

  // one retry on a hard fail
  if (qa === "fail") {
    row.qa.reasons = [];
    const r2 = await attempt();
    const reasons2 = row.qa.reasons;
    const errHit2 = ERROR_MARKERS.test(r2.title) || ERROR_MARKERS.test(r2.bodyText);
    if (row.status && row.status >= 400) reasons2.push("http-" + row.status);
    if (row.bytes < MIN_BYTES) reasons2.push("blank-or-tiny-image");
    if (r2.textLen < MIN_TEXT) reasons2.push("almost-no-text");
    if (errHit2) reasons2.push("error-page-markers");
    qa = reasons2.length ? "fail" : (r2.textLen < 200 ? "warn" : "ok");
  }
  row.qa.status = qa;

  await page.close();
  return row;
}

// Create a browsing context. With userDataDir we launch a PERSISTENT context against a real
// Chrome profile (headful) so the run inherits a logged-in session — the path for authenticated
// apps (CRM dashboards). Without it, a clean context (headless unless --head) for public pages.
async function makeContext(chromium, vp, opts) {
  if (opts.userDataDir) {
    const context = await chromium.launchPersistentContext(opts.userDataDir, {
      headless: false,
      channel: opts.channel || "chrome",
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor || 2,
    });
    return { context, close: () => context.close() };
  }
  const browser = await chromium.launch({ headless: !opts.head });
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor || 2,
  });
  return { context, close: () => browser.close() };
}

// On a fresh profile the app may show a login wall. With --login-wait <sec> we open the first
// URL and pause so you can log in by hand; the session then persists in the profile dir.
async function maybeLogin(context, opts, firstUrl) {
  if (!opts.loginWait) return;
  const p = await context.newPage();
  await p.goto(firstUrl, { waitUntil: "load", timeout: NAV_TIMEOUT }).catch(() => {});
  console.log(`\n>>> If a login screen is showing, log in now. Capturing in ${opts.loginWait}s...\n`);
  await p.waitForTimeout(opts.loginWait * 1000);
  await p.close();
}

async function runDirected(job, outDir, chromium, opts = {}) {
  const vp = job.viewport || { width: 1440, height: 900, deviceScaleFactor: 2 };
  const ctx = await makeContext(chromium, vp, { ...opts, userDataDir: opts.userDataDir || job.userDataDir });
  const context = ctx.context;
  if (opts.loginWait && job.pages.length) await maybeLogin(context, opts, job.pages[0].url);
  const started = new Date().toISOString();
  const shots = [];
  for (let i = 0; i < job.pages.length; i++) {
    const shot = job.pages[i];
    process.stdout.write(`  [${i + 1}/${job.pages.length}] ${shot.slug} ... `);
    const row = await captureOne(context, shot, i + 1, outDir, {
      fullPage: job.fullPage, dismissCookies: job.dismissCookies !== false,
    });
    shots.push(row);
    console.log(row.qa.status.toUpperCase() + (row.qa.reasons.length ? " (" + row.qa.reasons.join(", ") + ")" : ""));
  }
  await ctx.close();
  const finished = new Date().toISOString();

  const manifest = {
    target: job.target, type: job.type || "adhoc", archetype: job.archetype || null,
    engine: (opts.userDataDir || job.userDataDir) ? "playwright-auth" : "playwright", viewport: vp,
    standard: { size: `${vp.width}x${vp.height}`, scale: vp.deviceScaleFactor || 2, fullPage: job.fullPage !== false, format: "png" },
    started_at: started, finished_at: finished,
    shots,
    coverage: {
      archetype: job.archetype || null,
      expected_total: null, captured_expected: null, score: null,
      expected_missing: [], discovered_uncaptured: [],
      note: "FILL via the verification pass (see SKILL.md > Coverage). ui-teardown reads this to set its confidence score.",
    },
  };
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(outDir, "manifest.md"), renderManifestMd(manifest));
  const fails = shots.filter((s) => s.qa.status === "fail").length;
  const warns = shots.filter((s) => s.qa.status === "warn").length;
  console.log(`\nCaptured ${shots.length} shots -> ${outDir}  (${fails} fail, ${warns} warn)`);
  console.log("NEXT: run the verification pass to fill the Coverage block in manifest.md, then hand to ui-teardown.");
}

function renderManifestMd(m) {
  const rows = m.shots.map((s) =>
    `| ${String(s.index).padStart(2, "0")} | ${s.slug} | ${s.qa.status} | ${s.status ?? "-"} | ${s.width}x${s.height} | ${s.pii ? "yes" : "no"} | ${s.qa.reasons.join("; ") || ""} | ${s.url} |`
  ).join("\n");
  return `# Capture manifest — ${m.target}

- type: ${m.type}  ·  archetype: ${m.archetype || "(set this)"}  ·  engine: ${m.engine}
- standard: ${m.standard.size} @${m.standard.scale}x, ${m.standard.fullPage ? "full-page" : "viewport"} ${m.standard.format}
- run: ${m.started_at} -> ${m.finished_at}
- shots: ${m.shots.length}

| # | surface | qa | http | size | pii | notes | url |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Coverage

> Fill this during the verification pass (SKILL.md > Coverage + the eval). This block is the
> handoff contract ui-teardown reads to set its confidence score. Do not leave it as a TODO.

- archetype: ${m.archetype || "(classify: crm | project | creator | ecommerce | analytics | social | saas)"}
- captured: ${m.shots.length} surfaces
- expected (from feature-taxonomy.md): _N_
- captured of expected: _N_  ->  coverage score: _N/N (NN%)_
- **expected but missing:** _list each taxonomy surface with no shot + why (not-found / auth-walled / out-of-scope)_
- **discovered but uncaptured:** _list nav destinations found but not shot + why_
- gap-fill: _second targeted pass needed? which surfaces?_
`;
}

async function runDiscover(startUrl, outDir, chromium, opts = {}) {
  const vp = { width: 1440, height: 900, deviceScaleFactor: 2 };
  const ctx = await makeContext(chromium, vp, opts);
  const context = ctx.context;
  if (opts.loginWait) await maybeLogin(context, opts, startUrl);
  const page = await context.newPage();
  await page.goto(startUrl, { waitUntil: "load", timeout: NAV_TIMEOUT }).catch(() => {});
  await tryDismissCookies(page);
  await settle(page);
  const origin = new URL(startUrl).origin;
  const links = await page.evaluate((origin) => {
    const seen = new Map();
    for (const a of Array.from(document.querySelectorAll("a[href]"))) {
      const href = a.href;
      try {
        const u = new URL(href);
        if (u.origin !== origin) continue;
        if (/\.(png|jpg|jpeg|svg|pdf|zip|css|js)$/i.test(u.pathname)) continue;
        const text = (a.innerText || a.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 60);
        const key = u.pathname + u.search;
        if (!seen.has(key)) seen.set(key, { text, href: u.href });
      } catch (_) {}
    }
    return Array.from(seen.values());
  }, origin);
  await ctx.close();
  const out = { start_url: startUrl, origin, count: links.length, discovered: links, collected_at: new Date().toISOString() };
  fs.writeFileSync(path.join(outDir, "candidates.json"), JSON.stringify(out, null, 2));
  console.log(`Discovered ${links.length} same-origin destinations -> ${path.join(outDir, "candidates.json")}`);
  console.log("NEXT: curate candidates.json into a job.json (slug + url per surface), then run the directed capture.");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  fs.mkdirSync(args.out, { recursive: true });

  const chromium = await loadChromium();
  if (!chromium) {
    console.error("Playwright not found. From your working dir run:  npm i playwright && npx playwright install chromium");
    process.exit(2);
  }

  const opts = { userDataDir: args.userDataDir, channel: args.channel, head: args.head, loginWait: args.loginWait };
  if (args.discover) {
    await runDiscover(args.discover, args.out, chromium, opts);
    return;
  }
  const jobPath = args._[0];
  if (!jobPath) {
    console.error("Usage: node capture.mjs job.json [--out dir]  |  node capture.mjs --discover url [--out dir]");
    process.exit(1);
  }
  const job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
  if (!Array.isArray(job.pages) || !job.pages.length) {
    console.error("job.json has no pages[]");
    process.exit(1);
  }
  console.log(`ui-capture: ${job.target} — ${job.pages.length} pages -> ${args.out}`);
  await runDirected(job, args.out, chromium, opts);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) main().catch((e) => { console.error(e); process.exit(1); });

export { parseArgs, pngSize, renderManifestMd };
