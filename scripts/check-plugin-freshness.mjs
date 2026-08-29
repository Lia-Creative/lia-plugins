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
// Exit 1 when HELD is behind CURRENT — that is the defect. Exit 0 when they
// match or HELD is ahead (a working clone legitimately runs ahead of release).
// Exit 0 with a stated boundary when a side cannot be read: an unknown is
// reported as unchecked, never as a pass, which is the `cannot check` rule
// from `review-and-merge` §2 applied to this script's own output.
//
// --self-test plants the failures and proves each is caught, because a check
// nobody has watched fail is a check nobody knows works (CLAUDE.md, §Make the
// check fail on purpose). LIAB-1052 AC4 says it outright: "A check that has
// never been red has proved nothing."

import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir, homedir } from 'node:os';
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

// Where Claude Code materialises an installed plugin. Checked in order; the
// first that exists wins. A machine with none of these is not running an
// install, which is a legitimate state (a --plugin-dir session, or CI).
export function cacheCandidates(home = homedir()) {
  return [
    join(home, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '.claude-plugin', 'plugin.json'),
    join(home, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, 'plugin.json'),
    join(home, '.claude', 'plugins', MARKETPLACE, PLUGIN, '.claude-plugin', 'plugin.json'),
  ];
}

export function findHeldManifest(explicit, home = homedir()) {
  if (explicit) {
    return existsSync(explicit)
      ? { path: explicit, version: readManifestVersion(explicit) }
      : { path: explicit, version: null, missing: true };
  }
  for (const candidate of cacheCandidates(home)) {
    if (existsSync(candidate)) return { path: candidate, version: readManifestVersion(candidate) };
  }
  return { path: null, version: null, missing: true };
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

// Pure, so the self-test can drive it without touching a filesystem.
export function verdict(held, current) {
  if (held == null && current == null) {
    return { code: 0, state: 'unchecked', message: 'unchecked — neither the held nor the current version could be read. This is not a pass: nothing was compared.' };
  }
  if (held == null) {
    return { code: 0, state: 'unchecked', message: `unchecked — no installed ${PLUGIN} manifest found, so nothing was compared against ${current}. A --plugin-dir session or a fresh checkout is served from the tree, not a cache.` };
  }
  if (current == null) {
    return { code: 0, state: 'unchecked', message: `unchecked — holding ${held}, but the released version could not be read, so nothing was compared.` };
  }
  const cmp = compareVersions(held, current);
  if (cmp === null) {
    return { code: 0, state: 'unchecked', message: `unchecked — could not compare "${held}" against "${current}"; one of them is not a plain x.y.z version.` };
  }
  if (cmp < 0) {
    return {
      code: 1,
      state: 'stale',
      message:
        `STALE — you are holding ${PLUGIN} ${held}; the marketplace serves ${current}.\n\n` +
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
    return { code: 0, state: 'ahead', message: `ok — holding ${PLUGIN} ${held}, ahead of the released ${current}. Expected in a working clone; machines get it at the next promotion.` };
  }
  return { code: 0, state: 'current', message: `ok — holding ${PLUGIN} ${held}, which is what the marketplace serves.` };
}

// ---------------------------------------------------------------- self-test

function selfTest() {
  const scenarios = [
    { name: 'behind by a minor', held: '1.13.0', current: '1.16.0', expect: 'stale' },
    { name: 'behind by a patch', held: '1.16.0', current: '1.16.1', expect: 'stale' },
    { name: 'behind across a two-digit minor (1.9.0 vs 1.10.0)', held: '1.9.0', current: '1.10.0', expect: 'stale' },
    { name: 'exactly current', held: '1.16.0', current: '1.16.0', expect: 'current' },
    { name: 'working clone ahead of release', held: '1.17.0', current: '1.16.0', expect: 'ahead' },
    { name: 'held unreadable', held: null, current: '1.16.0', expect: 'unchecked' },
    { name: 'current unreadable', held: '1.16.0', current: null, expect: 'unchecked' },
    { name: 'neither readable', held: null, current: null, expect: 'unchecked' },
    { name: 'unparseable version is unknown, not equal', held: 'main', current: '1.16.0', expect: 'unchecked' },
  ];

  const failures = [];
  for (const s of scenarios) {
    const got = verdict(s.held, s.current);
    if (got.state !== s.expect) failures.push(`${s.name}: expected ${s.expect}, got ${got.state}`);
    const wantCode = s.expect === 'stale' ? 1 : 0;
    if (got.code !== wantCode) failures.push(`${s.name}: expected exit ${wantCode}, got ${got.code}`);
  }

  // The end-to-end half: plant a real stale cache on disk and prove the
  // detection path — not just the comparison — goes red on it. This is the
  // half that would have caught the 1.13.0-against-1.15.0 skew.
  const tmp = mkdtempSync(join(tmpdir(), 'freshness-selftest-'));
  try {
    const staleManifest = join(tmp, 'home', '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '.claude-plugin', 'plugin.json');
    mkdirSync(dirname(staleManifest), { recursive: true });
    writeFileSync(staleManifest, JSON.stringify({ name: PLUGIN, version: '1.13.0' }, null, 2));

    const found = findHeldManifest(null, join(tmp, 'home'));
    if (found.version !== '1.13.0') failures.push(`planted stale cache: expected to read 1.13.0, got ${found.version}`);
    const planted = verdict(found.version, '1.15.0');
    if (planted.state !== 'stale' || planted.code !== 1) {
      failures.push('planted stale cache: the exact LIAB-1052 skew was NOT caught');
    }

    // And the inverse, so the check is not simply always-red: same cache,
    // release that matches, must go green.
    const matched = verdict(found.version, '1.13.0');
    if (matched.state !== 'current' || matched.code !== 0) {
      failures.push('planted matching cache: a correct install was reported as a defect');
    }

    // A manifest with no version field is unknown, never a pass-by-default.
    const noVersion = join(tmp, 'noversion.json');
    writeFileSync(noVersion, JSON.stringify({ name: PLUGIN }));
    if (readManifestVersion(noVersion) !== null) failures.push('manifest with no version: expected null');

    // A file that is not JSON at all.
    const notJson = join(tmp, 'broken.json');
    writeFileSync(notJson, 'this is not json');
    if (readManifestVersion(notJson) !== null) failures.push('unparseable manifest: expected null');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  if (failures.length) {
    console.error('self-test FAILED');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `self-test ok — ${scenarios.length} scenarios plus 5 on-disk cases: the exact LIAB-1052 skew (1.13.0 held against 1.15.0 released) caught from a planted cache, behind-by-patch and 1.9.0-vs-1.10.0 caught, a matching install left green so the check is not always-red, ahead-of-release left green, and unreadable/unparseable reported as unchecked rather than passed`,
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

  const held = findHeldManifest(arg('--held'));
  const current = arg('--current') ?? releaseVersion(arg('--repo') ?? process.cwd(), arg('--ref') ?? 'origin/release');

  const result = verdict(held.version, current);
  if (held.path && held.version) console.log(`held:    ${held.version}  (${held.path})`);
  if (current) console.log(`current: ${current}`);
  console.log(result.message);
  process.exit(result.code);
}

main();
