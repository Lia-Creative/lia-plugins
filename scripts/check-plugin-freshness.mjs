#!/usr/bin/env node
// Guard: an agent can tell which version of this plugin it is holding, and
// whether that version is behind what the marketplace serves.
//
// Why this exists (LIAB-1052), measured 29 Aug 2026: a lead was dispatched to
// run the orchestration chain that LIAB-1044 had merged an hour earlier. The
// skill loader served it `lead-engineer` 0.2.0 (the seat now called `engineering-lead`) — the version with no §The
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
//             Auto-detected from Claude Code's registry + plugins tree AND
//             Cursor's plugins tree (union, never a fallback), or named with
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
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

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
  return readManifest(path)?.version ?? null;
}

// A manifest states its own name. Trusting that beats inferring identity from
// where the file sits: a directory merely *named* `lia-tools` can hold another
// plugin's manifest, and reading it as ours produced a false CLEAN — the worst
// direction. Path position is a hint; `name` is the fact.
export function readManifest(path) {
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    const version = typeof parsed.version === 'string' ? parsed.version : null;
    const name = typeof parsed.name === 'string' ? parsed.name : null;
    return version ? { name, version } : null;
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
// So: do not guess, and do not enumerate. Three sources, unioned — never one
// as a fallback for another (LIAB-1168: a Cursor-installed copy under
// `~/.cursor/plugins` was a real install the Claude-only search never saw).
//
//   1. `installed_plugins.json` — the registry Claude Code keeps, and the one
//      artefact this repo has actually cited (LIAB-917 read it directly). It
//      is the authoritative answer when it holds a record. Cursor keeps no
//      equivalent registry (measured 2 Sep 2026 on the LIAB-1168 Mac).
//   2. A bounded SEARCH of `~/.claude/plugins` for any `plugin.json` belonging
//      to this plugin, at whatever depth it sits. A search survives a layout
//      this author has not seen — version-partitioned, scope-partitioned or
//      flat.
//   3. The same bounded SEARCH of `~/.cursor/plugins`. Measured layout
//      (LIAB-1168, do not invent): cache keyed by git SHA at
//      `cache/<marketplace-id>/lia-tools/<sha>/.claude-plugin/plugin.json`,
//      and a marketplace clone at
//      `marketplaces/github.com/lia-creative/lia-plugins/<sha>/lia-tools/…`.
//      Identity is the manifest's `name: "lia-tools"`. The sibling
//      `.cursor-plugin/plugin.json` carries no `version`; `readManifest`
//      already returns null, so it is not double-counted.
//
// Each copy is tagged with an origin so a straddle is legible:
// `claude:user` / `claude:project` from the registry record, `claude:cache` /
// `claude:marketplace-clone` / `cursor:cache` / `cursor:marketplace-clone`
// from the path. Marketplace clones stay in the version set — ignoring them
// would be a silent verdict change, which this ticket does not make.
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
export function searchForManifests(root, dir = root, depth = 0, found = []) {
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
      searchForManifests(root, full, depth + 1, found);
    } else if (e.name === 'plugin.json') {
      // Segments BELOW the search root only. Splitting the absolute path made
      // a home directory containing a `lia-tools` segment (a devcontainer at
      // /workspaces/lia-tools, say) match every manifest on the machine.
      const rel = full.slice(root.length).split(sep).filter(Boolean);
      const m = readManifest(full);
      if (!m) continue;
      // Identity: the manifest's own name is authoritative. Where a manifest
      // omits `name`, fall back to the path — but require the MARKETPLACE
      // segment too, so another marketplace's copy of a same-named plugin is
      // not read as this install.
      const isOurs = m.name
        ? m.name === PLUGIN
        : rel.includes(PLUGIN) && rel.includes(MARKETPLACE);
      if (isOurs) found.push({ path: full, version: m.version });
    }
  }
  return found;
}

// Versions carried by a value sitting under a key that names this plugin.
//
// SHAPE-TOLERANT ON PURPOSE. The registry's layout is not guaranteed across
// Claude Code versions, and the previous reader only recognised ONE shape —
// a value that is itself an object carrying `version`. A review found the
// consequence: where the value is an ARRAY of records (one per scope or
// project) whose elements carry no `name` of their own, identity lives only
// in the parent key, `typeof value.version === 'string'` is false for an
// array, and the recursive descent then skips every unnamed element. Result:
// zero records, and the source this file documents as #1 — "the authoritative
// answer when it holds a record" — was inert.
//
// So this does not pattern-match one reported layout, which would be the same
// mistake as the path list that started all this: a shape the author chose,
// one level removed. Under a key that names us, take versions from a record,
// from an array of records, or from a map of records keyed by scope. Bounded
// by depth and by the key check, so a stray `version` elsewhere in the file
// still cannot be read as an install.
export function harvestVersions(value, out = [], depth = 0) {
  if (!value || typeof value !== 'object' || depth > 3) return out;
  if (Array.isArray(value)) {
    for (const v of value) harvestVersions(v, out, depth + 1);
    return out;
  }
  if (typeof value.version === 'string') {
    out.push({ version: value.version, scope: value.scope ?? value.projectPath ?? null });
    return out;
  }
  for (const v of Object.values(value)) harvestVersions(v, out, depth + 1);
  return out;
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
  const visit = (node, depth = 0) => {
    if (!node || typeof node !== 'object' || depth > 6) return;
    if (Array.isArray(node)) return node.forEach((n) => visit(n, depth + 1));
    // A record that carries its own name.
    const name = String(node.name ?? node.plugin ?? '');
    if (typeof node.version === 'string' && namesThisPlugin(name)) {
      records.push({ version: node.version, scope: node.scope ?? node.projectPath ?? null });
    }
    for (const [key, value] of Object.entries(node)) {
      if (value && typeof value === 'object') {
        // A key that names us: harvest whatever it holds.
        if (namesThisPlugin(key)) harvestVersions(value, records);
        visit(value, depth + 1);
      }
    }
  };
  visit(parsed);
  // A record reachable both ways (named node under a naming key) lands twice.
  // Harmless to the verdict, which de-duplicates versions, but a record count
  // that overstates what is installed is the kind of number that later gets
  // quoted, so collapse it here.
  const seen = new Set();
  const unique = records.filter((r) => {
    const k = `${r.version}|${r.scope ?? ''}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return { path, records: unique };
}

// Origin labels — so a straddle names *which* copy is which, not just the
// version numbers. Registry records carry Claude's own scope; search hits
// are labelled from the first segment under the plugins root. Unknown
// layouts under a search root still count (the search is the point) and
// inherit the cache label for that tree rather than inventing a third one.
export function originFromRegistry(record) {
  return record?.scope === 'user' ? 'claude:user' : 'claude:project';
}

export function originFromSearchPath(fullPath, searchRoot, tree) {
  const rel = fullPath.slice(searchRoot.length).split(sep).filter(Boolean);
  if (rel[0] === 'marketplaces') return `${tree}:marketplace-clone`;
  return `${tree}:cache`;
}

function copyOf(version, origin, path) {
  return { version, origin, path };
}

// Returns { versions: [...], source, path, copies } — versions is every
// distinct version this machine appears to hold. Empty means genuinely not
// found, which is `unchecked`, never a pass. `copies` is one entry per
// install so `main` can print origin + path per copy; `verdict()` still
// sees only the version strings.
export function findHeld(explicit, home = homedir()) {
  if (explicit) {
    const version = existsSync(explicit) ? readManifestVersion(explicit) : null;
    return {
      versions: version ? [version] : [],
      source: 'explicit',
      path: explicit,
      copies: version ? [copyOf(version, 'explicit', explicit)] : [],
    };
  }

  // UNION, never short-circuit. An earlier version returned on the registry
  // and never looked at disk — so a registry recording 1.19.0 over a cache
  // still holding 1.13.0 reported *green*: the exact LIAB-1052 defect, passed
  // by the guard built to catch it. The registry's shape is not guaranteed
  // across versions, which is precisely why it must not be allowed to suppress
  // the on-disk evidence. Collect every source and let the verdict ask
  // whether the disagreement reaches it.
  //
  // Cursor is a second search root, not a fallback (LIAB-1168). A machine
  // whose only install is under `~/.cursor/plugins` was reporting `unchecked`
  // because this function never looked there.
  const registry = readRegistry(home);
  const claudeRoot = join(home, '.claude', 'plugins');
  const cursorRoot = join(home, '.cursor', 'plugins');
  const claudeHits = searchForManifests(claudeRoot);
  const cursorHits = searchForManifests(cursorRoot);

  const copies = [
    ...registry.records.map((r) => copyOf(r.version, originFromRegistry(r), registry.path)),
    ...claudeHits.map((h) => copyOf(h.version, originFromSearchPath(h.path, claudeRoot, 'claude'), h.path)),
    ...cursorHits.map((h) => copyOf(h.version, originFromSearchPath(h.path, cursorRoot, 'cursor'), h.path)),
  ];

  const versions = [...new Set(copies.map((c) => c.version))];
  if (!versions.length) return { versions: [], source: 'none', path: null, copies: [] };

  const sources = [];
  if (registry.records.length) sources.push('installed_plugins.json');
  if (claudeHits.length) sources.push('cache search');
  if (cursorHits.length) sources.push('cursor plugins');
  return {
    versions,
    source: sources.join(' + '),
    path: [
      registry.records.length ? registry.path : null,
      ...claudeHits.map((h) => h.path),
      ...cursorHits.map((h) => h.path),
    ].filter(Boolean).join(', '),
    records: registry.records,
    copies,
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
// The same advice serves both stale paths — one copy behind, or every copy
// behind. Written once so the two cannot drift apart.
function staleAdvice() {
  return (
    `  Every skill you have loaded may be the older copy. A rule you cannot find is\n` +
    `  more likely missing from your copy than absent from the plugin — check before\n` +
    `  concluding it does not exist.\n\n` +
    `  To update:  /plugin marketplace update ${MARKETPLACE}\n` +
    `              claude plugin update ${PLUGIN}@${MARKETPLACE}\n\n` +
    `  Auto-update does not deliver on a CLI or desktop machine (LIAB-1030), and a\n` +
    `  session already running keeps the copy it started with — reloading is the\n` +
    `  lead's call, but knowing is not optional.`
  );
}

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

  // WHEN THE COPIES DISAGREE, ASK WHETHER IT MATTERS.
  //
  // Two wrong answers have already shipped here. The first judged several held
  // versions on the OLDEST, which reports a current machine with a leftover
  // directory as `stale` — false in the damaging direction, since it tells a
  // correct agent its rules may be missing. The second over-corrected: ANY
  // disagreement returned `unchecked`, which declines to report staleness even
  // when every copy on the machine is behind. That is the case LIAB-1052 was
  // measured on — a registry spanning 1.2.0 to 1.13.0 against a released
  // 1.16.0 — so the guard shrugged at precisely the machine it was written for.
  //
  // The question is not "do the copies agree" but "does the disagreement reach
  // the verdict". Three cases, and only one is genuinely ambiguous:
  //
  //   every copy behind          -> STALE. Whichever is served, it is stale.
  //   every copy current/ahead   -> OK. Whichever is served, it is fine.
  //   some behind, some not      -> UNCHECKED. This is the real ambiguity, and
  //                                the only one worth refusing to answer.
  // Sorted for the READER only. Every verdict below is computed with
  // compareVersions, never from position — the newest-held reduce correctly
  // named 1.13.0 from a set whose lexical maximum is 1.9.0. But the list was
  // printed in whatever order the sources happened to yield, so a human
  // scanning "1.9.0, 1.13.0, 1.2.0" had to sort it in their head to check the
  // script's arithmetic. Anything unparseable sorts last rather than being
  // dropped: it is part of what the machine holds.
  const distinct = [...new Set(versions)].sort((a, b) => {
    const c = compareVersions(a, b);
    if (c !== null) return c;
    return parseVersion(a) ? -1 : parseVersion(b) ? 1 : String(a).localeCompare(String(b));
  });
  if (distinct.length > 1) {
    const cmps = distinct.map((v) => compareVersions(v, current));
    if (cmps.some((c) => c === null)) {
      return { code: EXIT.UNCHECKED, state: 'unchecked', message: `unchecked — this machine holds ${distinct.join(', ')}, and not all of those compare against "${current}" as plain x.y.z versions.` };
    }
    // Behind on every copy: certain, so say it. Named on the NEWEST held,
    // because "even your newest copy is behind" is the strongest claim that is
    // still true — naming the oldest would overstate what is being served.
    if (cmps.every((c) => c < 0)) {
      const newest = distinct.reduce((a, b) => (compareVersions(a, b) >= 0 ? a : b));
      return {
        code: EXIT.STALE,
        state: 'stale',
        message:
          `STALE — this machine holds ${distinct.length} copies of ${PLUGIN} (${distinct.join(', ')}) and\n` +
          `  EVERY ONE is behind the released ${current}. Which one you are being served does not\n` +
          `  matter: the newest you hold is ${newest}.\n\n` +
          staleAdvice(),
      };
    }
    if (cmps.every((c) => c >= 0)) {
      return { code: EXIT.OK, state: 'current', message: `ok — this machine holds ${distinct.join(', ')}; every one is at or ahead of the released ${current}, so whichever is served is current.` };
    }
    return {
      code: EXIT.UNCHECKED,
      state: 'unchecked',
      message:
        `unchecked — this machine holds ${distinct.length} versions of ${PLUGIN} (${distinct.join(', ')}),\n` +
        `  straddling the released ${current}: some are behind it and some are not, and which one is\n` +
        `  being served cannot be determined from here.\n\n` +
        `  Not a pass and not a failure. To settle it, pass --held with the manifest you are actually\n` +
        `  loaded from. If you cannot tell which that is — and an agent generally cannot — treat your\n` +
        `  version as UNVERIFIED and say so, rather than assuming the newest copy is the live one.`,
    };
  }
  const held0 = distinct[0];
  const cmp = compareVersions(held0, current);
  if (cmp === null) {
    return { code: EXIT.UNCHECKED, state: 'unchecked', message: `unchecked — could not compare "${held0}" against "${current}".` };
  }
  if (cmp < 0) {
    return {
      code: EXIT.STALE,
      state: 'stale',
      message:
        `STALE — you are holding ${PLUGIN} ${held0}; the marketplace serves ${current}.\n\n` +
        staleAdvice(),
    };
  }
  if (cmp > 0) {
    return { code: EXIT.OK, state: 'ahead', message: `ok — holding ${PLUGIN} ${held0}, ahead of the released ${current}. Expected in a working clone; machines get it at the next promotion.` };
  }
  return { code: EXIT.OK, state: 'current', message: `ok — holding ${PLUGIN} ${held0}, which is what the marketplace serves.` };
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
    // Disagreement is judged on whether it REACHES the verdict. Two wrong
    // answers shipped before this one: oldest-wins (a false stale on a current
    // machine with a leftover directory) and blanket-unchecked (a shrug at the
    // very machine LIAB-1052 was measured on, where every copy was behind).
    //
    // The second scenario below is the one that matters most: an earlier
    // version of this suite asserted `unchecked` for it — the defect written in
    // as the expectation, which no mutation of the code could ever find. Caught
    // in review, 29 Aug 2026.
    { name: 'straddling the release: unchecked, since it genuinely cannot tell', held: ['1.16.0', '1.13.0'], current: '1.16.0', expect: 'unchecked', code: 2 },
    { name: 'EVERY copy behind: stale, because it is certain either way', held: ['1.15.0', '1.13.0'], current: '1.16.0', expect: 'stale', code: 1 },
    { name: 'the measured LIAB-1052 machine: many copies, all behind', held: ['1.2.0', '1.5.0', '1.11.0', '1.13.0'], current: '1.16.0', expect: 'stale', code: 1 },
    { name: 'EVERY copy current or ahead: ok, also certain either way', held: ['1.16.0', '1.20.0'], current: '1.16.0', expect: 'current', code: 0 },
    { name: 'one unparseable among several: unchecked, and SAYS WHY', held: ['main', '1.13.0'], current: '1.16.0', expect: 'unchecked', code: 2, says: /do not all compare|not all of those compare/ },
    { name: 'straddling says it straddles, not that it is unreadable', held: ['1.20.0', '1.13.0'], current: '1.16.0', expect: 'unchecked', code: 2, says: /straddling/ },
    { name: 'the same version twice is not a disagreement', held: ['1.16.0', '1.16.0'], current: '1.16.0', expect: 'current', code: 0 },
    { name: 'one version, behind: still a plain STALE', held: ['1.13.0'], current: '1.16.0', expect: 'stale', code: 1 },
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
    // Some rules change only the EXPLANATION, and an exit code cannot see
    // them. Deleting the unparseable guard in the multi-version branch left
    // every code identical (a null comparison fails both `every` tests, so it
    // falls through to the straddling answer by accident) while the message
    // went from naming the unreadable version to claiming the set straddles
    // the release — which is not true and not useful. Caught by mutation,
    // 29 Aug 2026: a scenario that asserts only a code cannot cover a rule
    // whose whole job is to say something accurate.
    if (s.says && !s.says.test(got.message)) failures.push(`${s.name}: the message did not match ${s.says} — got: ${got.message.split('\n')[0]}`);
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
  const plantManifest = (p, version, name = PLUGIN) => {
    mkdirSync(dirname(p), { recursive: true });
    // `name: null` plants a manifest with NO name field, which is the only way
    // to exercise the path fallback — the code path the original substring bug
    // lived in.
    const body = name === null ? { version } : { name, version };
    writeFileSync(p, JSON.stringify(body, null, 2));
  };
  try {
    // (a) VERSION-PARTITIONED cache — a shape the old path list could not see.
    const a = join(tmp, 'a');
    plantManifest(join(a, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.13.0', '.claude-plugin', 'plugin.json'), '1.13.0');
    const foundA = findHeld(null, a);
    if (!foundA.versions.includes('1.13.0')) failures.push('version-partitioned layout: auto-detect FAILED to find 1.13.0');
    if (!(foundA.copies ?? []).some((c) => c.origin === 'claude:cache')) failures.push(`version-partitioned layout: expected origin claude:cache, got ${JSON.stringify(foundA.copies)}`);
    const vA = verdict(foundA.versions, '1.16.0');
    if (vA.state !== 'stale') failures.push('version-partitioned layout: the real LIAB-1052 skew was NOT caught by auto-detect');

    // (b) A marketplaces/ checkout — another shape not in any path list.
    const b = join(tmp, 'b');
    plantManifest(join(b, '.claude', 'plugins', 'marketplaces', MARKETPLACE, PLUGIN, '.claude-plugin', 'plugin.json'), '1.10.0');
    const foundB = findHeld(null, b);
    if (!foundB.versions.includes('1.10.0')) failures.push('marketplaces layout: auto-detect FAILED');
    if (!(foundB.copies ?? []).some((c) => c.origin === 'claude:marketplace-clone')) failures.push(`marketplaces layout: expected origin claude:marketplace-clone, got ${JSON.stringify(foundB.copies)}`);

    // (c) THE REGISTRY IS READ, and several records mean several versions.
    //     It does not *win* — `400f81d` made this a union precisely so a
    //     registry claiming current cannot suppress a stale copy on disk;
    //     fixture (g) is that case. This one only proves it is read at all.
    const c = join(tmp, 'c');
    const reg = join(c, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(reg), { recursive: true });
    writeFileSync(reg, JSON.stringify({
      version: 2,
      plugins: { [`${PLUGIN}@${MARKETPLACE}`]: { version: '1.13.0', scope: 'user' } },
    }));
    const foundC = findHeld(null, c);
    if (!foundC.source.includes('installed_plugins.json')) failures.push(`registry: expected it to be read, got ${foundC.source}`);
    if (!foundC.versions.includes('1.13.0')) failures.push('registry: FAILED to read the recorded version');

    // (d) A machine holding TWO versions STRADDLING the release: both are
    //     seen, and the answer is that it cannot tell which is served.
    const d = join(tmp, 'd');
    plantManifest(join(d, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.16.0', '.claude-plugin', 'plugin.json'), '1.16.0');
    plantManifest(join(d, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.2.0', '.claude-plugin', 'plugin.json'), '1.2.0');
    const foundD = findHeld(null, d);
    if (foundD.versions.length !== 2) failures.push(`two installs: expected 2 versions, got ${foundD.versions.length}`);
    if (verdict(foundD.versions, '1.16.0').code !== 2) failures.push('two installs straddling the release: expected UNCHECKED');
    // ...but the same two BOTH behind is certain, and must be reported.
    if (verdict(foundD.versions, '1.20.0').code !== 1) failures.push('two installs both behind: expected STALE, not a shrug');

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

    // (f) A manifest for a DIFFERENT plugin must not be mistaken for ours —
    //     including one sitting in a directory named after us. Identity comes
    //     from the manifest's own `name`, not from where the file sits; reading
    //     a foreign manifest as ours produced a false CLEAN, the worst
    //     direction.
    const g = join(tmp, 'g');
    const foreign = join(g, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '.claude-plugin', 'plugin.json');
    mkdirSync(dirname(foreign), { recursive: true });
    writeFileSync(foreign, JSON.stringify({ name: 'some-other-plugin', version: '9.9.9' }));
    if (findHeld(null, g).versions.length) failures.push("a foreign manifest in a directory named after us was read as ours (false CLEAN)");

    // (f2) A HOME PATH containing our name must not match everything on the
    //      machine. Splitting the ABSOLUTE path did exactly that: a checkout at
    //      /workspaces/lia-tools/lia-plugins puts both our segments above the
    //      search root, so every manifest under it read as ours.
    //
    //      This fixture's first shape gave the unrelated manifest a `name`, so
    //      the name-authoritative branch settled it and the path fallback never
    //      ran — green with the fix and green without it. Proved by mutating
    //      `rel` back to the absolute split and watching this suite stay green
    //      (29 Aug 2026). It is CLAUDE.md's third layer exactly: a fixture that
    //      could not tell the fix from the bug. So the manifest here carries NO
    //      name, which is the only way to reach the code under test, and the
    //      home path carries BOTH our segments, since the fallback requires
    //      both.
    const homeNamed = join(tmp, PLUGIN, MARKETPLACE, 'home');
    const other = join(homeNamed, '.claude', 'plugins', 'cache', 'other-market', 'unrelated', 'plugin.json');
    mkdirSync(dirname(other), { recursive: true });
    writeFileSync(other, JSON.stringify({ version: '0.0.7' }));
    if (findHeld(null, homeNamed).versions.includes('0.0.7')) failures.push('a home path containing our name matched an unrelated plugin');

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
    // The original defect returned exit 0 here (a pass). It must not: the two
    // sources disagree, so the answer is UNCHECKED — never a clean bill.
    if (verdict(foundH.versions, '1.19.0').code === 0) failures.push('registry-vs-disk: a machine with a stale copy on disk was reported as a PASS');
    if (verdict(foundH.versions, '1.19.0').code !== 2) failures.push('registry-vs-disk: expected UNCHECKED on disagreement');

    // (h) A SIBLING PLUGIN IS NOT US. Substring matching read `lia-tools-extras`
    //     as ours, and oldest-wins turned one bad hit into a false STALE.
    //     Two fixtures, because there are two ways to get this wrong:
    //       - it declares its own name, so identity settles it; and
    //       - it declares NO name, so the path fallback decides — and that is
    //         where the substring bug actually lived. A path-segment match
    //         passes this; `full.includes(PLUGIN)` does not.
    const i = join(tmp, 'i');
    plantManifest(join(i, '.claude', 'plugins', 'cache', MARKETPLACE, `${PLUGIN}-extras`, '.claude-plugin', 'plugin.json'), '0.0.1', `${PLUGIN}-extras`);
    if (findHeld(null, i).versions.length) failures.push(`a sibling plugin (${PLUGIN}-extras) was read as ours`);
    const iNameless = join(tmp, 'i2');
    plantManifest(join(iNameless, '.claude', 'plugins', 'cache', MARKETPLACE, `${PLUGIN}-extras`, '.claude-plugin', 'plugin.json'), '0.0.2', null);
    if (findHeld(null, iNameless).versions.length) failures.push(`an unnamed manifest under ${PLUGIN}-extras was read as ours by path`);

    // (h3) ANOTHER MARKETPLACE'S COPY of a same-named plugin is not this
    //      install. The path fallback requires the marketplace segment as well
    //      as the plugin one, and nothing tested that: dropping the marketplace
    //      half left this suite green (mutation sweep, 29 Aug 2026).
    const iOther = join(tmp, 'i3');
    plantManifest(join(iOther, '.claude', 'plugins', 'cache', 'someone-elses-market', PLUGIN, '.claude-plugin', 'plugin.json'), '0.0.3', null);
    if (findHeld(null, iOther).versions.length) failures.push("another marketplace's copy of a same-named plugin was read as this install");
    const j = join(tmp, 'j');
    const jReg = join(j, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(jReg), { recursive: true });
    writeFileSync(jReg, JSON.stringify({ version: 2, plugins: { [`${PLUGIN}@${MARKETPLACE}`]: { version: '1.19.0' }, [`${PLUGIN} marketplace`]: { version: '0.0.3' } } }));
    if (findHeld(null, j).versions.includes('0.0.3')) failures.push('a registry metadata node was read as a plugin version (false STALE)');
    // (h5) THE REGISTRY'S OTHER BRANCH. Records can arrive as a list of nodes
    //      carrying their own `name`, and that branch had no fixture at all:
    //      loosening it to a substring left this suite green (mutation sweep,
    //      29 Aug 2026). Both directions, so it cannot pass by always saying no.
    const l = join(tmp, 'l');
    const lReg = join(l, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(lReg), { recursive: true });
    writeFileSync(lReg, JSON.stringify({
      version: 2,
      plugins: [
        { name: `${PLUGIN}-extras`, version: '0.0.4' },
        { name: `${PLUGIN}@${MARKETPLACE}`, version: '1.19.0' },
      ],
    }));
    const foundL = findHeld(null, l);
    if (foundL.versions.includes('0.0.4')) failures.push(`a registry record named ${PLUGIN}-extras was read as ours`);
    if (!foundL.versions.includes('1.19.0')) failures.push('a registry record listed by name was MISSED');

    // (h6) THE REGISTRY'S SHAPES — and the case that proves it works at all.
    //
    // A review found `readRegistry()` returning ZERO records for a registry
    // whose identity lives in the PARENT KEY over an ARRAY of records carrying
    // no name of their own. The old key branch required
    // `typeof value.version === 'string'`, which an array never satisfies, and
    // the descent then skipped the unnamed elements. Source #1 — the one this
    // file calls "the authoritative answer when it holds a record" — was inert,
    // and nothing here could see it, because every registry fixture planted a
    // shape the reader already expected.
    //
    // BE CLEAR ABOUT WHAT THESE ARE. None of these shapes was observed on disk
    // from here: this container's registry is `{"version":2,"plugins":{}}`,
    // with no install of anything. Deriving a fixture from a live file is the
    // right instinct and is not available, so these test SHAPE TOLERANCE and
    // are not a claim about any machine's layout. That is also why the reader
    // harvests generically rather than matching one reported shape — a fixture
    // and a reader built from the same guess prove each other and nothing else.
    const shapes = {
      'key over an array of unnamed records': [{ version: '1.13.0', installPath: '/x', scope: 'user' }, { version: '1.2.0', projectPath: '/p' }],
      'key over a single record': { version: '1.13.0', scope: 'user' },
      'key over a map of records by scope': { user: { version: '1.13.0' }, project: { version: '1.2.0', projectPath: '/p' } },
    };
    for (const [why, value] of Object.entries(shapes)) {
      const dir = join(tmp, `shape-${Object.keys(shapes).indexOf(why)}`);
      const rf = join(dir, '.claude', 'plugins', 'installed_plugins.json');
      mkdirSync(dirname(rf), { recursive: true });
      writeFileSync(rf, JSON.stringify({ version: 2, plugins: { [`${PLUGIN}@${MARKETPLACE}`]: value } }));
      const got = findHeld(null, dir).versions;
      if (!got.includes('1.13.0')) failures.push(`registry shape, ${why}: 1.13.0 was NOT found (got ${JSON.stringify(got)})`);
    }

    // (h7) THE REGISTRY ALONE, WITH NOTHING ON DISK. Every other registry
    //      fixture would also pass on a machine where the cache search finds
    //      the same version, so none of them can tell a working registry reader
    //      from an inert one. This one can: no cache, no marketplaces
    //      checkout, nothing to search — if the registry does not work, the
    //      answer is `unchecked` and the verdict below goes red.
    const only = join(tmp, 'registry-only');
    const onlyReg = join(only, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(onlyReg), { recursive: true });
    writeFileSync(onlyReg, JSON.stringify({ version: 2, plugins: { [`${PLUGIN}@${MARKETPLACE}`]: [{ version: '1.13.0', scope: 'user' }] } }));
    const foundOnly = findHeld(null, only);
    if (!foundOnly.versions.includes('1.13.0')) failures.push('registry ALONE: source #1 is inert — nothing on disk, and the registry found nothing either');
    if (!foundOnly.source.includes('installed_plugins.json')) failures.push(`registry ALONE: expected the registry as the source, got ${foundOnly.source}`);
    if (verdict(foundOnly.versions, '1.16.0').code !== 1) failures.push('registry ALONE: the LIAB-1052 skew was not reported STALE from the registry alone');

    // (h8) AND THE SAME HARVEST MUST NOT WIDEN THE NET. A sibling key and a
    //      metadata key hold arrays too, and neither is an install of ours.
    const harvestFP = join(tmp, 'harvest-fp');
    const fpReg = join(harvestFP, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(fpReg), { recursive: true });
    writeFileSync(fpReg, JSON.stringify({ version: 2, plugins: {
      [`${PLUGIN}-extras`]: [{ version: '0.0.1' }],
      [`${PLUGIN} marketplace`]: [{ version: '0.0.3' }],
      'unrelated@other': [{ version: '5.0.0' }],
    } }));
    if (findHeld(null, harvestFP).versions.length) failures.push(`the key harvest read a sibling or metadata key as ours: ${JSON.stringify(findHeld(null, harvestFP).versions)}`);

    // (h9) THE DISPLAY IS SORTED, because the reader has to check the
    //      arithmetic and was being handed an unordered list to do it from.
    const shown = verdict(['1.9.0', '1.13.0', '1.2.0'], '1.16.0').message;
    if (!shown.includes('1.2.0, 1.9.0, 1.13.0')) failures.push('the held-version list is not sorted semver-ascending for display');

    // (j) LIAB-1168 — PLANTED INSTALLS AT EACH REAL LAYOUT. A Cursor copy
    //     under `~/.cursor/plugins` was a real install this finder never
    //     looked for. Each layout gets its own home so hiding that plant
    //     (or dropping the search root that reaches it) turns THIS
    //     assertion red, not a neighbour's. Cursor has no registry: the
    //     search is the whole finder for that tree.
    const sha = '3fd3dede00000000000000000000000000000000';
    const originsOf = (home) => (findHeld(null, home).copies ?? []).map((c) => c.origin);

    // (j1) Claude user scope — registry record, nothing on disk.
    const claudeUser = join(tmp, 'claude-user');
    const claudeUserReg = join(claudeUser, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(claudeUserReg), { recursive: true });
    writeFileSync(claudeUserReg, JSON.stringify({
      version: 2,
      plugins: { [`${PLUGIN}@${MARKETPLACE}`]: { version: '1.26.0', scope: 'user' } },
    }));
    const foundClaudeUser = findHeld(null, claudeUser);
    if (!foundClaudeUser.versions.includes('1.26.0')) failures.push('claude:user plant: auto-detect FAILED to find 1.26.0');
    if (!originsOf(claudeUser).includes('claude:user')) failures.push(`claude:user plant: expected origin claude:user, got ${JSON.stringify(originsOf(claudeUser))}`);
    if (verdict(foundClaudeUser.versions, '1.26.0').code !== 0) failures.push('claude:user plant matching the release: expected current, not a miss');

    // (j2) Claude project scope — identity in the parent key, scope from projectPath.
    const claudeProject = join(tmp, 'claude-project');
    const claudeProjectReg = join(claudeProject, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(claudeProjectReg), { recursive: true });
    writeFileSync(claudeProjectReg, JSON.stringify({
      version: 2,
      plugins: { [`${PLUGIN}@${MARKETPLACE}`]: { version: '1.18.0', projectPath: '/gone/wt-liab-1168' } },
    }));
    const foundClaudeProject = findHeld(null, claudeProject);
    if (!foundClaudeProject.versions.includes('1.18.0')) failures.push('claude:project plant: auto-detect FAILED to find 1.18.0');
    if (!originsOf(claudeProject).includes('claude:project')) failures.push(`claude:project plant: expected origin claude:project, got ${JSON.stringify(originsOf(claudeProject))}`);

    // (j3) Cursor cache keyed by git SHA (measured layout). Sibling
    //      `.cursor-plugin/plugin.json` has no version and must not
    //      double-count. Dropping the `~/.cursor/plugins` union makes
    //      this go red — that is AC4.
    const cursorCache = join(tmp, 'cursor-cache');
    const cursorCacheManifest = join(
      cursorCache, '.cursor', 'plugins', 'cache', 'lia-creative-lia-plugins', PLUGIN, sha,
      '.claude-plugin', 'plugin.json',
    );
    plantManifest(cursorCacheManifest, '1.25.0');
    const cursorPluginSibling = join(
      cursorCache, '.cursor', 'plugins', 'cache', 'lia-creative-lia-plugins', PLUGIN, sha,
      '.cursor-plugin', 'plugin.json',
    );
    mkdirSync(dirname(cursorPluginSibling), { recursive: true });
    writeFileSync(cursorPluginSibling, JSON.stringify({ name: PLUGIN }));
    const foundCursorCache = findHeld(null, cursorCache);
    if (!foundCursorCache.versions.includes('1.25.0')) failures.push('cursor:cache plant: auto-detect FAILED to find 1.25.0 — is ~/.cursor/plugins in the union?');
    if (foundCursorCache.versions.length !== 1) failures.push(`cursor:cache plant: expected 1 version (sibling without version must not count), got ${JSON.stringify(foundCursorCache.versions)}`);
    if (!originsOf(cursorCache).includes('cursor:cache')) failures.push(`cursor:cache plant: expected origin cursor:cache, got ${JSON.stringify(originsOf(cursorCache))}`);
    if (!foundCursorCache.source.includes('cursor plugins')) failures.push(`cursor:cache plant: expected source to name cursor plugins, got ${foundCursorCache.source}`);
    if (verdict(foundCursorCache.versions, '1.25.0').code !== 0) failures.push('cursor:cache plant matching the release: expected current');
    if (verdict(foundCursorCache.versions, '1.26.0').code !== 1) failures.push('cursor:cache plant behind the release: expected STALE, not unchecked-because-missed');

    // (j4) Cursor marketplace clone (measured layout, depth 7 under the
    //      search root — inside MAX_SEARCH_DEPTH, and a regression if
    //      that bound is silently lowered).
    const cursorMp = join(tmp, 'cursor-mp');
    const cursorMpManifest = join(
      cursorMp, '.cursor', 'plugins', 'marketplaces', 'github.com', 'lia-creative', 'lia-plugins', sha,
      PLUGIN, '.claude-plugin', 'plugin.json',
    );
    plantManifest(cursorMpManifest, '1.25.0');
    const foundCursorMp = findHeld(null, cursorMp);
    if (!foundCursorMp.versions.includes('1.25.0')) failures.push('cursor:marketplace-clone plant: auto-detect FAILED to find 1.25.0');
    if (!originsOf(cursorMp).includes('cursor:marketplace-clone')) failures.push(`cursor:marketplace-clone plant: expected origin cursor:marketplace-clone, got ${JSON.stringify(originsOf(cursorMp))}`);
    // Marketplace clones stay in the version set. Ignoring this hit would
    // be a silent verdict change; a clone ahead of release must still
    // straddle when a behind copy sits beside it.
    plantManifest(
      join(cursorMp, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, '1.13.0', '.claude-plugin', 'plugin.json'),
      '1.13.0',
    );
    const foundCloneKept = findHeld(null, cursorMp);
    if (!foundCloneKept.versions.includes('1.25.0')) failures.push('marketplace clone was DROPPED from the version set');
    if (verdict(foundCloneKept.versions, '1.16.0').code !== 2) failures.push('marketplace clone + a behind copy must still straddle (do not ignore the clone)');

    // (j5) All four on one home, and an empty tree still UNCHECKED.
    const allFour = join(tmp, 'all-four');
    const allFourReg = join(allFour, '.claude', 'plugins', 'installed_plugins.json');
    mkdirSync(dirname(allFourReg), { recursive: true });
    writeFileSync(allFourReg, JSON.stringify({
      version: 2,
      plugins: {
        [`${PLUGIN}@${MARKETPLACE}`]: [
          { version: '1.26.0', scope: 'user' },
          { version: '1.18.0', projectPath: '/gone/wt' },
        ],
      },
    }));
    plantManifest(
      join(allFour, '.cursor', 'plugins', 'cache', 'lia-creative-lia-plugins', PLUGIN, sha, '.claude-plugin', 'plugin.json'),
      '1.25.0',
    );
    plantManifest(
      join(allFour, '.cursor', 'plugins', 'marketplaces', 'github.com', 'lia-creative', 'lia-plugins', sha, PLUGIN, '.claude-plugin', 'plugin.json'),
      '1.24.0',
    );
    const foundAllFour = findHeld(null, allFour);
    for (const origin of ['claude:user', 'claude:project', 'cursor:cache', 'cursor:marketplace-clone']) {
      if (!originsOf(allFour).includes(origin)) failures.push(`all-four plant: missing origin ${origin} (got ${JSON.stringify(originsOf(allFour))})`);
    }
    if (!foundAllFour.versions.includes('1.26.0') || !foundAllFour.versions.includes('1.18.0') || !foundAllFour.versions.includes('1.25.0') || !foundAllFour.versions.includes('1.24.0')) {
      failures.push(`all-four plant: expected 1.26.0, 1.18.0, 1.25.0, 1.24.0 — got ${JSON.stringify(foundAllFour.versions)}`);
    }

    const emptyCursor = join(tmp, 'empty-cursor');
    mkdirSync(join(emptyCursor, '.claude', 'plugins'), { recursive: true });
    mkdirSync(join(emptyCursor, '.cursor', 'plugins'), { recursive: true });
    const foundEmptyCursor = findHeld(null, emptyCursor);
    if (foundEmptyCursor.versions.length) failures.push('empty claude+cursor trees: invented a version from nothing');
    if (verdict(foundEmptyCursor.versions, '1.16.0').code !== 2) failures.push('empty claude+cursor trees: reported something other than UNCHECKED');

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

  // ------------------------------------------------------------------
  // THE WIRING LAYER — proved by RUNNING THIS FILE, not by calling into it.
  //
  // Everything above tests `verdict()` and `findHeld()` as functions. `main()`
  // was tested by nothing at all, and since CI runs only `--self-test`, it
  // executed in no automated context whatever. A review mutated 30 rules: all
  // 20 inside the covered layer went red, and ALL TEN in the wiring layer
  // survived. The worst of them was one character —
  //
  //     process.exit(result.code)  ->  process.exit(0)
  //
  // — which keeps this suite green while a genuinely stale machine reports a
  // clean exit 0. That is the false clean this file's own header calls its
  // worst possible failure, and the exit code is exactly what
  // `execution-discipline` tells every agent to read.
  //
  // The three sibling guards do not have this gap by construction: each ends
  // in a single `process.exit(cond ? selfTest() : report(...))`, with no
  // wiring to miss. This one introduced a wiring layer, so this one has to
  // test it. The lesson generalises past this file: a check's blind spot is
  // the shape of what it enumerates, and a suite that only ever imports can
  // never see what the executable does.
  // ------------------------------------------------------------------
  if (!process.env.FRESHNESS_NO_SUBPROCESS) {
  const selfPath = fileURLToPath(import.meta.url);
  const tmp2 = mkdtempSync(join(tmpdir(), 'freshness-cli-'));
  try {
    const manifest = (version) => {
      const f = join(tmp2, `${version}.json`);
      writeFileSync(f, JSON.stringify({ name: PLUGIN, version }));
      return f;
    };
    const emptyHome = join(tmp2, 'empty-home');
    mkdirSync(join(emptyHome, '.claude', 'plugins'), { recursive: true });

    // HOME is redirected so auto-detect cannot reach the real machine, and
    // --current is passed so no case depends on a git clone being present.
    const run = (args, home = emptyHome) =>
      spawnSync(process.execPath, [selfPath, ...args], {
        encoding: 'utf8',
        env: { ...process.env, HOME: home, FRESHNESS_NO_SUBPROCESS: '1' },
      });

    // Literal exit codes, never the EXIT constants: asserting against the same
    // constant the code uses moves both sides together and proves nothing.
    // That tautology already shipped here once (caught 29 Aug 2026).
    const cli = [
      { why: 'behind the release exits 1', args: ['--held', manifest('1.13.0'), '--current', '1.16.0'], code: 1, expect: /STALE/ },
      { why: 'matching the release exits 0', args: ['--held', manifest('1.16.0'), '--current', '1.16.0'], code: 0, expect: /^ok/m },
      { why: 'ahead of the release exits 0', args: ['--held', manifest('1.20.0'), '--current', '1.16.0'], code: 0, expect: /ahead/ },
      { why: 'a --held path that does not exist exits 2', args: ['--held', join(tmp2, 'nope.json'), '--current', '1.16.0'], code: 2, expect: /unchecked/ },
      { why: 'no install and no --held exits 2', args: ['--current', '1.16.0'], code: 2, expect: /unchecked/ },
      { why: 'no readable release exits 2', args: ['--held', manifest('1.13.0'), '--repo', tmp2], code: 2, expect: /unchecked/ },
      { why: '--self-test still runs and still reports', args: ['--self-test'], code: 0, expect: /^self-test ok/ },
    ];
    for (const c of cli) {
      const got = run(c.args);
      const out = `${got.stdout ?? ''}${got.stderr ?? ''}`;
      if (got.status !== c.code) failures.push(`CLI: ${c.why} — got exit ${got.status}`);
      if (!c.expect.test(out)) failures.push(`CLI: ${c.why} — output did not match ${c.expect}`);
    }

    // W5: THE MULTI-VERSION PATH MUST REACH THE CLI. Every case above holds
    // exactly one version, so `verdict(held.versions[0], ...)` — throwing away
    // every copy but the first — behaved identically and survived. A STRADDLING
    // home discriminates: the whole set is unchecked (2), while either single
    // member alone is stale (1) or ok (0).
    const straddle = join(tmp2, 'straddle-home');
    for (const v of ['1.20.0', '1.13.0']) {
      const f = join(straddle, '.claude', 'plugins', 'cache', MARKETPLACE, PLUGIN, v, '.claude-plugin', 'plugin.json');
      mkdirSync(dirname(f), { recursive: true });
      writeFileSync(f, JSON.stringify({ name: PLUGIN, version: v }));
    }
    const straddled = run(['--current', '1.16.0'], straddle);
    if (straddled.status !== 2) failures.push(`CLI: a home straddling the release should be unchecked (2), got ${straddled.status} — is the multi-version set reaching verdict()?`);
    // ...and the same home against a release ahead of BOTH is a certain stale.
    const bothBehind = run(['--current', '9.9.9'], straddle);
    if (bothBehind.status !== 1) failures.push(`CLI: a home whose every copy is behind should be stale (1), got ${bothBehind.status}`);

    // W7/W9: THE RELEASE READ MUST BE EXERCISED FOR REAL. Every case above
    // passes --current, so `releaseVersion` never succeeded in this suite:
    // pointing it at a bogus ref path, or making its catch return a hardcoded
    // version, changed nothing. A throwaway git repo with a `release` branch
    // exercises it without a network or the real clone's state.
    const repo = join(tmp2, 'repo');
    mkdirSync(join(repo, PLUGIN, '.claude-plugin'), { recursive: true });
    writeFileSync(join(repo, PLUGIN, '.claude-plugin', 'plugin.json'), JSON.stringify({ name: PLUGIN, version: '7.7.7' }));
    const git = (...args) => spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
    git('init', '-q', '-b', 'release');
    git('-c', 'user.email=t@t', '-c', 'user.name=t', 'add', '-A');
    git('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'x');
    const fromRef = run(['--held', manifest('1.13.0'), '--repo', repo, '--ref', 'release']);
    if (!/current: 7\.7\.7/.test(`${fromRef.stdout ?? ''}`)) failures.push('CLI: the released version was NOT read from the ref — releaseVersion is not exercised');
    if (fromRef.status !== 1) failures.push(`CLI: 1.13.0 against a release of 7.7.7 should be stale (1), got ${fromRef.status}`);
    const badRef = run(['--held', manifest('1.13.0'), '--repo', repo, '--ref', 'no-such-ref']);
    if (badRef.status !== 2) failures.push(`CLI: an unreadable ref should be unchecked (2), not a guess — got ${badRef.status}`);

    // --held must actually be READ, not merely accepted: point it at two
    // different versions and require the verdict to follow the file.
    const a1 = run(['--held', manifest('1.13.0'), '--current', '1.16.0']);
    const a2 = run(['--held', manifest('1.16.0'), '--current', '1.16.0']);
    if (a1.status === a2.status) failures.push('CLI: --held was ignored — two different manifests gave the same verdict');
    // ...and so must --current.
    const b1 = run(['--held', manifest('1.16.0'), '--current', '1.16.0']);
    const b2 = run(['--held', manifest('1.16.0'), '--current', '9.9.9']);
    if (b1.status === b2.status) failures.push('CLI: --current was ignored — two different releases gave the same verdict');

    // W-CURSOR: a Cursor-only home must reach main(), not just findHeld().
    // Dropping the Cursor union leaves findHeld empty and the CLI exits 2
    // "no install" instead of 0/1 — the same miss LIAB-1168 measured.
    const cursorOnly = join(tmp2, 'cursor-only');
    const cursorOnlyManifest = join(
      cursorOnly, '.cursor', 'plugins', 'cache', 'lia-creative-lia-plugins', PLUGIN,
      '3fd3dede00000000000000000000000000000000', '.claude-plugin', 'plugin.json',
    );
    mkdirSync(dirname(cursorOnlyManifest), { recursive: true });
    writeFileSync(cursorOnlyManifest, JSON.stringify({ name: PLUGIN, version: '1.16.0' }));
    const cursorOk = run(['--current', '1.16.0'], cursorOnly);
    if (cursorOk.status !== 0) failures.push(`CLI: a Cursor-only current install should be ok (0), got ${cursorOk.status} — is ~/.cursor/plugins reaching main()?`);
    if (!/cursor:cache/.test(`${cursorOk.stdout ?? ''}`)) failures.push('CLI: a Cursor-only install must print the cursor:cache origin so a straddle is legible');
    const cursorStale = run(['--current', '9.9.9'], cursorOnly);
    if (cursorStale.status !== 1) failures.push(`CLI: a Cursor-only install behind the release should be stale (1), got ${cursorStale.status}`);
  } finally {
    rmSync(tmp2, { recursive: true, force: true });
  }
  }

  if (failures.length) {
    console.error('self-test FAILED');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `self-test ok — ${scenarios.length} comparator scenarios plus detector assertions. The detector is proved against layouts this script has NO path list for: version-partitioned cache, a marketplaces/ checkout, the installed_plugins.json registry (read alongside disk, never suppressing it), and the four LIAB-1168 plants — Claude user scope, Claude project scope via projectPath, Cursor cache keyed by git SHA, Cursor marketplace clone. Cursor is a second search root, unioned, never a fallback; a Cursor-only home reaches the CLI. Versions that disagree are judged on whether the disagreement reaches the verdict: every copy behind is STALE (certain either way), every copy current-or-ahead is ok, and only a set straddling the release is UNCHECKED. Marketplace clones stay in the version set. Origin labels (claude:user / claude:project / claude:cache / claude:marketplace-clone / cursor:cache / cursor:marketplace-clone) print one line per copy. Not-always-red: an empty tree (claude and cursor) is UNCHECKED (exit 2) not a pass, a matching install is green, a foreign manifest in a directory named after us is not mistaken for ours and a home path containing our name matches nothing, a registry claiming current cannot suppress a stale copy on disk, a sibling named lia-tools-extras and a registry metadata node are not read as us, a .cursor-plugin sibling without version is not double-counted, and --held is honoured. The REGISTRY is proved on three shapes and, crucially, ALONE with nothing on disk to search — the case that separates a working registry reader from an inert one, which no fixture covered while it was in fact inert. Mutation-swept: 30 deliberate reversions of this script's own rules were each confirmed to turn this suite RED (29 Aug 2026), across the comparator, the detector, the registry reader and the CLI wiring. Five did not, first time round: the marketplace half of the path fallback, the registry's node-name branch, a fixture that was green either way, and the whole of main(), which no test touched. Break it again after changing it; green here means nothing until you have watched it go red.`,
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
  if (held.versions.length) {
    console.log(`held:    ${held.versions.join(', ')}  (via ${held.source})`);
    for (const c of held.copies ?? []) {
      console.log(`  ${c.version}  ${c.origin}${c.path ? `  ${c.path}` : ''}`);
    }
  }
  if (current) console.log(`current: ${current}`);
  console.log(result.message);
  process.exit(result.code);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
