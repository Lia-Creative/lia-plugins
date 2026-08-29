#!/usr/bin/env node
// Guard: an agent can tell which version of this plugin it is holding, and
// whether that version is behind what the marketplace serves.
//
// Why this exists (LIAB-1052), measured 29 Aug 2026: a lead was dispatched to
// run the orchestration chain that LIAB-1044 had merged an hour earlier. The
// skill loader served it `lead-engineer` 0.2.0 — the version with no §The
// chain and no rules 10 or 11. **The orchestration mandate was invisible to
// the exact seat built to run it**, and both build agents independently hit
// the same thing. The installed cache topped out at 1.13.0 while `main` was
// at 1.15.0, so everything merged that day was invisible to every running
// session, and no session could tell.
//
// The failure is not delivery — that is LIAB-922. It is that a stale skill
// reads *exactly* like a current one. An agent that cannot find a rule has
// two explanations available, and today they are indistinguishable:
//
//     (a) the rule does not exist
//     (b) I am holding an old copy
//
// (b) is far more likely and there is nothing in-band that says so. This
// script is the something. Run it and the two become distinguishable.
//
// What it compares:
//
//   HELD    — the plugin manifest an agent is actually being served from.
//             Auto-detected from the Claude Code plugin cache, or named with
//             --held <path-to-plugin.json>.
//   CURRENT — what the marketplace serves. Read from the `release` ref of a
//             repo clone, or named outright with --current <version>.
//
// Exit 0 when HELD matches CURRENT or is ahead (a working clone legitimately
// runs ahead of release). Exit 1 when HELD is behind — the defect. Exit 2 when
// a side could not be read: `unchecked` gets its OWN code, so a caller can
// never mistake silence for a pass. That is `review-and-merge` §2's `cannot
// check` rule applied to this script's own output.
//
// --self-test plants the failures and proves each is caught, because a check
// nobody has watched fail is a check nobody knows works (CLAUDE.md, §Make the
// check fail on purpose). LIAB-1052 AC4 says it outright: "A check that has
// never been red has proved nothing."

import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const PLUGIN = 'lia-tools';
const MARKETPLACE = 'lia-plugins';

// ---------------------------------------------------------------- semver

// Returns [major, minor, patch] or null when the string is not a plain
// three-part version. Anything we cannot parse is unknown, not equal —
// the version-bump guard learned the same lesson in LIAB-1002.
export function parseVersion(raw) {
  if (typeof raw !== 'string') return null;
  const m = raw.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

// -1 held behind current, 0 same, 1 held ahead, null if either is unparseable.
export function compareVersions(held, current) {
  const a = parseVersion(held);
  const b = parseVersion(current);
  if (!a || !b) return null;
  for (let i = 0; i < 3; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

export function readManifestVersion(path) {
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    return typeof parsed.version === 'string' ? parsed.version : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- sources

// HOW THE INSTALL IS FOUND — and why this does not hard-code a path.
//
// The first version of this script listed three guessed cache paths. Nothing
// in this repo documents the real layout, no install exists in CI or in a
// cloud container to check against, and the guesses were never verified —
// which is `execution-discipline` §1's "never invent a path", broken inside
// the guard whose whole job is to be authoritative about versions. A review
// caught it (29 Aug 2026), and the deeper point stands whatever any single
// machine's layout turns out to be: **a path list can only find the layouts
// its author already imagined.**
//
// So: do not guess, and do not enumerate. Two sources, in order.
//
//   1. `installed_plugins.json` — the registry Claude Code keeps, and the one
//      artefact this repo has actually cited (LIAB-917 read it directly). It
//      is the authoritative answer when it holds a record.
//   2. A bounded SEARCH of the plugins tree for any `plugin.json` belonging to
//      this plugin, at whatever depth it sits. A search survives a layout this
//      author has not seen — version-partitioned, scope-partitioned or flat.
//
// **A machine can legitimately hold more than one version at once** (per-scope
// or per-project installs). There is then no single "held version", and this
// script says so rather than picking one and sounding certain.

const MAX_SEARCH_DEPTH = 8;

// A substring match reads a SIBLING as us. `lia-tools-extras`, another
// marketplace's copy, a registry node named "lia-tools marketplace", or a home
// directory that happens to contain the string — each matched, and because the
// verdict is oldest-wins one spurious low version is enough to report a
// correct machine STALE. A false STALE is damaging in the direction that
// matters: it tells a correct agent its rules may be missing, which is
// LIAB-1052's confusion pointed backwards. So: exact identity only.
export function namesThisPlugin(name) {
  return name === PLUGIN || name.startsWith(`${PLUGIN}@`);
}

// Every plugin.json under `dir` whose path names this plugin. Depth-bounded so
// a stray symlink cannot walk the disk.
export function searchForManifests(dir, depth = 0, found = []) {
  if (depth > MAX_SEARCH_DEPTH) return found;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      searchForManifests(full, depth + 1, found);
    } else if (e.name === 'plugin.json' && full.split(sep).includes(PLUGIN)) {
      const version = readManifestVersion(full);
      if (version) found.push({ path: full, version });
    }
  }
  return found;
}

// The registry. Shape is not guaranteed across versions, so read defensively
// and treat anything unrecognised as "no record" rather than as an answer.
export function readRegistry(home = homedir()) {
  const path = join(home, '.claude', 'plugins', 'installed_plugins.json');
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return { path, records: [] };
  }
  const records = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(visit);
    const name = String(node.name ?? node.plugin ?? '');
    if (typeof node.version === 'string' && namesThisPlugin(name)) {
      records.push({ version: node.version, scope: node.scope ?? node.projectPath ?? null });
    }
    for (const [key, value] of Object.entries(node)) {
      if (value && typeof value === 'object') {
        if (typeof value.version === 'string' && namesThisPlugin(key)) {
          records.push({ version: value.version, scope: value.scope ?? value.projectPath ?? null });
        }
        visit(value);
      }
    }
  };
  visit(parsed);
  return { path, records };
}

// Returns { versions: [...], source, path } — versions is every distinct
// version this machine appears to hold. Empty means genuinely not found, which
// is `unchecked`, never a pass.
export function findHeld(explicit, home = homedir()) {
  if (explicit) {
    const version = existsSync(explicit) ? readManifestVersion(explicit) : null;
    return { versions: version ? [version] : [], source: 'explicit', path: explicit };
  }

  // UNION, never short-circuit. An earlier version returned on the registry
  // and never looked at disk — so a registry recording 1.19.0 over a cache
  // still holding 1.13.0 reported *green*: the exact LIAB-1052 defect, passed
  // by the guard built to catch it. The registry's shape is not guaranteed
  // across versions, which is precisely why it must not be allowed to suppress
  // the on-disk evidence. Collect both and let oldest-wins do its job.
  const registry = readRegistry(home);
  const hits = searchForManifests(join(home, '.claude', 'plugins'));

  const versions = [...new Set([
    ...registry.records.map((r) => r.version),
    ...hits.map((h) => h.version),
  ])];
  if (!versions.length) return { versions: [], source: 'none', path: null };

  const sources = [];
  if (registry.records.length) sources.push('installed_plugins.json');
  if (hits.length) sources.push('cache search');
  return {
    versions,
    source: sources.join(' + '),
    path: [registry.records.length ? registry.path : null, ...hits.map((h) => h.path)].filter(Boolean).join(', '),
    records: registry.records,
  };
}

// What the marketplace serves: the manifest on the `release` ref. Read from
// git, so it needs a clone but no network beyond whatever the caller fetched.
export function releaseVersion(repoDir, ref = 'origin/release') {
  try {
    const out = execFileSync(
      'git',
      ['show', `${ref}:${PLUGIN}/.claude-plugin/plugin.json`],
      { cwd: repoDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const parsed = JSON.parse(out);
    return typeof parsed.version === 'string' ? parsed.version : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- verdict

// EXIT CODES — 0 current or ahead · 1 STALE · 2 UNCHECKED.
//
// `unchecked` used to exit 0, which made "I could not find anything" read to
// any caller exactly like "I checked and you are fine". That is the same shape
// as the `cannot check` defect `review-and-merge` 0.5.0 was written to kill:
// a respectable-sounding box to park in. It gets its own code so no caller can
// mistake silence for a pass.
export const EXIT = { OK: 0, STALE: 1, UNCHECKED: 2 };

// `held` may be a single version string or an array of them — a machine can
// hold several at once (per-scope or per-project installs), and picking one to
// sound confident is exactly the invention this script exists to prevent.
// Pure, so the self-test can drive it without touching a filesystem.
export function verdict(held, current) {
  const versions = held == null ? [] : Array.isArray(held) ? held : [held];

  if (!versions.length && current == null) {
    return { code: EXIT.UNCHECKED, state: 'unchecked', message: 'unchecked — neither the held nor the current version could be read. Nothing was compared, so this is not a pass.' };
  }
  if (!versions.length) {
    return {
      code: EXIT.UNCHECKED,
      state: 'unchecked',
      message:
        `unchecked — no installed ${PLUGIN} was found, so nothing was compared against ${current}.\n\n` +
        `  This is NOT a clean bill of health. It means one of:\n` +
        `    - this session is served from a tree (--plugin-dir, a clone, CI), not an install; or\n` +
        `    - an install exists in a layout this search did not reach.\n` +
        `  If you are running from an install and see this, say so — the finder is wrong,\n` +
        `  and pass --held [path-to-plugin.json] meanwhile.`,
    };
  }
  if (current == null) {
    return { code: EXIT.UNCHECKED, state: 'unchecked', message: `unchecked — holding ${versions.join(', ')}, but the released version could not be read, so nothing was compared. Pass --current [version] or run from a clone with an up-to-date origin/release.` };
  }

  // Several versions held at once: judge on the OLDEST, because that is the
  // copy most likely to be serving a stale skill to somebody.
  const parsed = versions.map((v) => ({ v, p: parseVersion(v) }));
  if (parsed.some((x) => !x.p)) {
    return { code: EXIT.UNCHECKED, state: 'unchecked', message: `unchecked — could not compare ${versions.map((v) => `"${v}"`).join(', ')} against "${current}"; not every one is a plain x.y.z version.` };
  }
  const oldest = parsed.reduce((a, b) => (compareVersions(a.v, b.v) <= 0 ? a : b)).v;
  const multi = versions.length > 1
    ? `\n\n  NOTE: ${versions.length} versions are installed (${versions.join(', ')}). There is no single\n  held version on this machine; the verdict is on the oldest, since that is the copy\n  most likely to be serving an out-of-date skill.`
    : '';
  const held0 = oldest;
  const cmp = compareVersions(held0, current);
  if (cmp === null) {
    return { code: EXIT.UNCHECKED, state: 'unchecked', message: `unchecked — could not compare "${held0}" against "${current}".` };
  }
  if (cmp < 0) {
    return {
      code: EXIT.STALE,
      state: 'stale',
      message:
        `STALE — you are holding ${PLUGIN} ${held0}; the marketplace serves ${current}.${multi}\n\n` +
        `  Every skill you have loaded may be the older copy. A rule you cannot find is\n` +
        `  more likely missing from your copy than absent from the plugin — check before\n` +
        `  concluding it does not exist.\n\n` +
        `  To update:  /plugin marketplace update ${MARKETPLACE}\n` +
        `              claude plugin update ${PLUGIN}@${MARKETPLACE}\n\n` +
        `  Auto-update does not deliver on a CLI or desktop machine (LIAB-1030), and a\n` +
        `  session already running keeps the copy it started with — reloading is the\n` +
        `  lead's call, but knowing is not optional.`,
    };
  }
  if (cmp > 0) {
    return { code: EXIT.OK, state: 'ahead', message: `ok — holding ${PLUGIN} ${held0}, ahead of the released ${current}.${multi} Expected in a working clone; machines get it at the next promotion.` };
  }
  return { code: EXIT.OK, state: 'current', message: `ok — holding ${PLUGIN} ${held0}, which is what the marketplace serves.${multi}` };
}

// ---------------------------------------------------------------- self-test

function selfTest() {
  const scenarios = [
    { name: 'behind by a minor', held: '1.13.0', current: '1.16.0', expect: 'stale', code: 1 },
    { name: 'behind by a patch', held: '1.16.0', current: '1.16.1', expect: 'stale', code: 1 },
    { name: '1.9.0 against 1.10.0', held: '1.9.0', current: '1.10.0', expect: 'stale', code: 1 },
    { name: 'exactly current', held: '1.16.0', current: '1.16.0', expect: 'current', code: 0 },
    { name: 'working clone ahead', held: '1.17.0', current: '1.16.0', expect: 'ahead', code: 0 },
    { name: 'nothing held is UNCHECKED, not a pass', held: null, current: '1.16.0', expect: 'unchecked', code: 2 },
    { name: 'no release readable', held: '1.16.0', current: null, expect: 'unchecked', code: 2 },
    { name: 'neither side readable', held: null, current: null, expect: 'unchecked', code: 2 },
    { name: 'unparseable is unknown, not equal', held: 'main', current: '1.16.0', expect: 'unchecked', code: 2 },
    { name: 'several versions held: judged on the oldest', held: ['1.16.0', '1.13.0'], current: '1.16.0', expect: 'stale', code: 1 },
    { name: 'several versions held, all current', held: ['1.16.0', '1.16.0'], current: '1.16.0', expect: 'current', code: 0 },
  ];

  const failures = [];

  // The exit codes are a CONTRACT with callers, so assert the literal numbers.
  // Asserting `got.code === EXIT.UNCHECKED` is tautological: redefine the
  // constant and both sides move together. Proved by breaking it on purpose —
  // setting UNCHECKED to 0 left this self-test green until this check existed.
  if (EXIT.OK !== 0) failures.push(`EXIT.OK must be 0, is ${EXIT.OK}`);
  if (EXIT.STALE !== 1) failures.push(`EXIT.STALE must be 1, is ${EXIT.STALE}`);
  if (EXIT.UNCHECKED !== 2) failures.push(`EXIT.UNCHECKED must be 2 — an unchecked run must never share an exit code with a pass. Is ${EXIT.UNCHECKED}`);

  for (const s of scenarios) {
    const got = verdict(s.held, s.current);
    if (got.state !== s.expect) failures.push(`${s.name}: expected ${s.expect}, got ${got.state}`);
    if (got.code !== s.code) failures.push(`${s.name}: expected exit ${s.code}, got ${got.code}`);
  }

  // ------------------------------------------------------------------
  // THE DETECTOR, against layouts this script does NOT have a path for.
  //
  // The first version of this self-test planted a manifest at a path
  // `cacheCandidates()` itself listed, so it could only ever confirm the
  // author's own guess — "evidence that cannot contain the answer", and the
  // review that caught it was right. These fixtures are deliberately shaped
  // the way this script was NOT written to expect.
  // ------------------------------------------------------------------
  const tmp = mkdtempSync(join(tmpdir(), 'freshness-selftest-'));
  const plantManifest = (p, version) => {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, JSON.stringify({ name: PLUGIN, version }, null, 2));
  };
  try {
    // (a) VERSION-PARTITIONED cache — a shape the old path list could not see.
    const a = join(tmp, 'a');
    plantManifest(join(a, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.13.0', '.claude-plugin', 'plugin.json'), '1.13.0');
    const foundA = findHeld(null, a);
    if (!foundA.versions.includes('1.13.0')) failures.push('version-partitioned layout: auto-detect FAILED to find 1.13.0');
    const vA = verdict(foundA.versions, '1.16.0');
    if (vA.state !== 'stale') failures.push('version-partitioned layout: the real LIAB-1052 skew was NOT caught by auto-detect');

    // (b) A marketplaces/ checkout — another shape not in any path list.
    const b = join(tmp, 'b');
    plantManifest(join(b, '.claude', 'plugins', 'marketplaces', MARKETPLACE, PLUGIN, '.claude-plugin', 'plugin.json'), '1.10.0');
    if (!findHeld(null, b).versions.includes('1.10.0')) failures.push('marketplaces layout: auto-detect FAILED');

    // (c) The REGISTRY wins, and several records mean several versions.
    const c = join(tmp, 'c');
    const reg = join(c, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(reg), { recursive: true });
    writeFileSync(reg, JSON.stringify({
      version: 2,
      plugins: { [`${PLUGIN}@${MARKETPLACE}`]: { version: '1.13.0', scope: 'user' } },
    }));
    const foundC = findHeld(null, c);
    if (foundC.source !== 'installed_plugins.json') failures.push(`registry: expected it to win, got ${foundC.source}`);
    if (!foundC.versions.includes('1.13.0')) failures.push('registry: FAILED to read the recorded version');

    // (d) A machine holding TWO versions is judged on the oldest.
    const d = join(tmp, 'd');
    plantManifest(join(d, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.16.0', '.claude-plugin', 'plugin.json'), '1.16.0');
    plantManifest(join(d, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.2.0', '.claude-plugin', 'plugin.json'), '1.2.0');
    const foundD = findHeld(null, d);
    if (foundD.versions.length !== 2) failures.push(`two installs: expected 2 versions, got ${foundD.versions.length}`);
    if (verdict(foundD.versions, '1.16.0').state !== 'stale') failures.push('two installs: the stale one was NOT surfaced');

    // (e) THE NOT-ALWAYS-RED HALF. An empty tree must be UNCHECKED (exit 2),
    //     never a pass — and a matching install must come back green.
    const e = join(tmp, 'e');
    mkdirSync(join(e, '.claude', 'plugins'), { recursive: true });
    const foundE = findHeld(null, e);
    if (foundE.versions.length) failures.push('empty tree: invented a version from nothing');
    if (verdict(foundE.versions, '1.16.0').code !== 2) failures.push('empty tree: reported something other than UNCHECKED');
    const f = join(tmp, 'f');
    plantManifest(join(f, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.16.0', '.claude-plugin', 'plugin.json'), '1.16.0');
    if (verdict(findHeld(null, f).versions, '1.16.0').code !== 0) failures.push('matching install: a correct machine was reported as a defect');

    // (f) A manifest for a DIFFERENT plugin must not be mistaken for ours.
    const g = join(tmp, 'g');
    plantManifest(join(g, '.claude', 'plugins', 'cache', MARKETPLACE, 'some-other-plugin', '.claude-plugin', 'plugin.json'), '9.9.9');
    if (findHeld(null, g).versions.length) failures.push("another plugin's manifest was read as ours");

    // (g) THE REGISTRY MUST NOT SUPPRESS DISK. A registry claiming current
    //     over a cache still holding an old copy is the exact LIAB-1052 defect;
    //     an earlier version of this finder returned green on it.
    const h = join(tmp, 'h');
    const hReg = join(h, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(hReg), { recursive: true });
    writeFileSync(hReg, JSON.stringify({ version: 2, plugins: { [`${PLUGIN}@${MARKETPLACE}`]: { version: '1.19.0' } } }));
    plantManifest(join(h, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.13.0', '.claude-plugin', 'plugin.json'), '1.13.0');
    const foundH = findHeld(null, h);
    if (!foundH.versions.includes('1.13.0')) failures.push('registry-vs-disk: the stale on-disk copy was SUPPRESSED by the registry');
    if (verdict(foundH.versions, '1.19.0').code !== 1) failures.push('registry-vs-disk: a stale machine was reported as a pass');

    // (h) A SIBLING PLUGIN IS NOT US. Substring matching read `lia-tools-extras`
    //     as ours, and oldest-wins turns one bad hit into a false STALE.
    const i = join(tmp, 'i');
    plantManifest(join(i, '.claude', 'plugins', 'cache', MARKETPLACE, `${PLUGIN}-extras`, '.claude-plugin', 'plugin.json'), '0.0.1');
    if (findHeld(null, i).versions.length) failures.push(`a sibling plugin (${PLUGIN}-extras) was read as ours`);
    const j = join(tmp, 'j');
    const jReg = join(j, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(jReg), { recursive: true });
    writeFileSync(jReg, JSON.stringify({ version: 2, plugins: { [`${PLUGIN}@${MARKETPLACE}`]: { version: '1.19.0' }, [`${PLUGIN} marketplace`]: { version: '0.0.3' } } }));
    if (findHeld(null, j).versions.includes('0.0.3')) failures.push('a registry metadata node was read as a plugin version (false STALE)');

    // (i) --held IS THE ESCAPE HATCH THE UNCHECKED MESSAGE POINTS AT, so it is
    //     tested. It was not, and ignoring it entirely left this suite green.
    const k = join(tmp, 'k', 'somewhere', 'plugin.json');
    plantManifest(k, '1.13.0');
    const foundK = findHeld(k);
    if (!foundK.versions.includes('1.13.0')) failures.push('--held: an explicitly named manifest was ignored');
    if (verdict(foundK.versions, '1.16.0').code !== 1) failures.push('--held: explicit path did not reach the verdict');

    if (readManifestVersion(join(tmp, 'nope.json')) !== null) failures.push('missing manifest: expected null');
    const broken = join(tmp, 'broken.json');
    writeFileSync(broken, 'not json');
    if (readManifestVersion(broken) !== null) failures.push('unparseable manifest: expected null');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  if (failures.length) {
    console.error('self-test FAILED');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `self-test ok — ${scenarios.length} comparator scenarios plus 11 on-disk detector cases. The detector is proved against layouts this script has NO path list for: version-partitioned cache, a marketplaces/ checkout, and the installed_plugins.json registry (which wins). A machine holding two versions is judged on the oldest. Not-always-red: an empty tree is UNCHECKED (exit 2) not a pass, a matching install is green, another plugin's manifest is not mistaken for ours, a registry claiming current cannot suppress a stale copy on disk, a sibling named lia-tools-extras and a registry metadata node are not read as us, and --held is honoured.`,
  );
}

// ---------------------------------------------------------------- main

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--self-test')) return selfTest();

  const arg = (name) => {
    const i = argv.indexOf(name);
    return i !== -1 && argv[i + 1] ? argv[i + 1] : null;
  };

  const held = findHeld(arg('--held'));
  const current = arg('--current') ?? releaseVersion(arg('--repo') ?? process.cwd(), arg('--ref') ?? 'origin/release');

  const result = verdict(held.versions, current);
  if (held.versions.length) console.log(`held:    ${held.versions.join(', ')}  (via ${held.source}: ${held.path})`);
  if (current) console.log(`current: ${current}`);
  console.log(result.message);
  process.exit(result.code);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
