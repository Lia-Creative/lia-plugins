#!/usr/bin/env node
// Keep `.cursor/skills/` a real-file mirror of `lia-tools/skills/`.
//
// Why this exists: Cursor discovers project skills from `.cursor/skills/<name>/SKILL.md`
// (and `.agents/skills/…`). A skills-*root* symlink (`.cursor/skills` → `lia-tools/skills`)
// packages cleanly on disk but is not injected into Cloud Agent `agent_skills` —
// measured on PR #41 (`cursor/install-lia-plugins-4ce6`), and consistent with
// https://forum.cursor.com/t/cursor-doesnt-follow-symlinks-to-discover-skills/149693.
//
// `lia-tools/skills/` remains the only place to edit. This script copies that tree
// into `.cursor/skills/` as real directories/files so Cursor's walker can see them.
// CI runs `--check` so a skill change without a re-sync fails the build.
//
//   node scripts/sync-cursor-skills.mjs           # write the mirror
//   node scripts/sync-cursor-skills.mjs --check   # fail if out of date
//   node scripts/sync-cursor-skills.mjs --self-test
//
// `--self-test` runs the real `syncWrite` and `syncCheck` against a temp tree and
// watches each go red (LIAB-1169). The first version asserted on its own copy of
// the rules and never called either function, so a neutered sync still printed
// `self-test ok` and CI trusted it — the exact shape CLAUDE.md §Make the check
// fail on purpose is about. `syncWrite` and `syncCheck` take `{ source, dest }`
// for that reason; the CLI passes nothing and gets the repo paths.

import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(REPO_ROOT, "lia-tools", "skills");
const DEST = join(REPO_ROOT, ".cursor", "skills");

const SKIP_NAMES = new Set([".DS_Store"]);

function listFiles(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_NAMES.has(entry.name) || entry.name.startsWith(".")) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile()) out.push(path);
    }
  };
  walk(root);
  return out.sort();
}

function fileDigest(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function mirrorMap(root) {
  const map = new Map();
  if (!existsSync(root)) return map;
  const rootStat = lstatSync(root);
  if (rootStat.isSymbolicLink()) {
    // A symlink root is never a valid Cursor mirror for this repo.
    map.set("__ROOT_IS_SYMLINK__", "1");
    return map;
  }
  for (const abs of listFiles(root)) {
    map.set(relative(root, abs), fileDigest(abs));
  }
  return map;
}

function diffMaps(source, dest) {
  const missing = [];
  const extra = [];
  const changed = [];
  for (const [rel, hash] of source) {
    if (!dest.has(rel)) missing.push(rel);
    else if (dest.get(rel) !== hash) changed.push(rel);
  }
  for (const rel of dest.keys()) {
    if (!source.has(rel)) extra.push(rel);
  }
  return { missing, extra, changed };
}

function syncWrite({ source = SOURCE, dest = DEST, quiet = false } = {}) {
  const log = quiet ? () => {} : console.log;
  const fail = quiet ? () => {} : console.error;
  if (!existsSync(source)) {
    fail(`missing source: ${relative(REPO_ROOT, source)}`);
    return 1;
  }
  mkdirSync(dirname(dest), { recursive: true });
  // Replace whatever is there (symlink or stale tree) with a clean copy.
  rmSync(dest, { recursive: true, force: true });
  cpSync(source, dest, { recursive: true, dereference: true });
  // Drop junk macOS sometimes leaves; Cursor only needs skill folders.
  for (const name of SKIP_NAMES) {
    const p = join(dest, name);
    if (existsSync(p)) rmSync(p, { force: true });
  }
  const n = listFiles(dest).length;
  log(`ok — mirrored ${n} file(s) from lia-tools/skills → .cursor/skills`);
  return 0;
}

function syncCheck({ source = SOURCE, dest = DEST, quiet = false } = {}) {
  const log = quiet ? () => {} : console.log;
  const fail = quiet ? () => {} : console.error;
  if (!existsSync(source)) {
    fail(`missing source: ${relative(REPO_ROOT, source)}`);
    return 1;
  }
  if (!existsSync(dest)) {
    fail(`.cursor/skills is missing — run: node scripts/sync-cursor-skills.mjs`);
    return 1;
  }
  if (lstatSync(dest).isSymbolicLink()) {
    fail(
      `.cursor/skills is a symlink — Cursor does not discover skills through a skills-root symlink. Replace it with a real mirror: node scripts/sync-cursor-skills.mjs`,
    );
    return 1;
  }
  const { missing, extra, changed } = diffMaps(mirrorMap(source), mirrorMap(dest));
  if (!missing.length && !extra.length && !changed.length) {
    log(`ok — .cursor/skills matches lia-tools/skills (${mirrorMap(source).size} file(s))`);
    return 0;
  }
  fail(`.cursor/skills is out of sync with lia-tools/skills:\n`);
  for (const rel of missing) fail(`  missing in mirror: ${rel}`);
  for (const rel of changed) fail(`  content differs:   ${rel}`);
  for (const rel of extra) fail(`  extra in mirror:   ${rel}`);
  fail(`\n  → Edit skills only under lia-tools/skills/, then run: node scripts/sync-cursor-skills.mjs\n`);
  return 1;
}

// Every assertion below goes through the real `syncWrite` / `syncCheck`, pointed at a
// temp tree. Nothing here re-implements a rule: if a rule stops holding in the code
// the CLI runs, the same call stops holding here. Failures are collected rather than
// stopping at the first, so a broken function shows every assertion it takes down and
// the message names it. Watched red under both of LIAB-1169's mutations before it was
// trusted green — the transcripts are on the PR.
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "sync-cursor-skills-"));
  const source = join(dir, "lia-tools", "skills");
  const dest = join(dir, ".cursor", "skills");
  const real = { source, dest, quiet: true };

  const failures = [];
  let assertions = 0;
  const expect = (broken, ok) => {
    assertions += 1;
    if (!ok) failures.push(broken);
  };
  const put = (root, rel, body) => {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), body);
  };
  const sameBytes = (a, b) => existsSync(a) && existsSync(b) && readFileSync(a).equals(readFileSync(b));
  const reads = (path, body) => existsSync(path) && readFileSync(path, "utf8") === body;

  const fixtures = {
    "demo/SKILL.md": "---\nname: demo\ndescription: fixture\n---\n# demo\n",
    "demo/templates/note.md": "# a nested file — the mirror is recursive\n",
    "other/SKILL.md": "---\nname: other\ndescription: second skill\n---\n# other\n",
  };
  const rels = Object.keys(fixtures);

  try {
    for (const rel of rels) put(source, rel, fixtures[rel]);

    // 1. A symlink skills root. The real check refuses it; the real write replaces it
    //    with a real tree — and must not reach through the link and delete the source.
    mkdirSync(dirname(dest), { recursive: true });
    symlinkSync(source, dest);
    expect("syncCheck accepted a symlink skills root", syncCheck(real) === 1);
    expect("syncWrite over a symlink root did not return ok", syncWrite(real) === 0);
    expect("syncWrite left the skills root a symlink", existsSync(dest) && !lstatSync(dest).isSymbolicLink());
    expect(
      "syncWrite over a symlink root deleted the source through the link",
      rels.every((rel) => existsSync(join(source, rel))),
    );

    // 2. A fresh mirror. The real write, then every file byte-equal — read back here,
    //    not hashed by the code under test — then the real check green.
    rmSync(dest, { recursive: true, force: true });
    expect("syncWrite did not return ok on a fresh mirror", syncWrite(real) === 0);
    for (const rel of rels) {
      expect(`syncWrite did not mirror ${rel} byte-for-byte`, sameBytes(join(source, rel), join(dest, rel)));
    }
    expect("syncCheck reported a matching mirror red", syncCheck(real) === 0);

    // 3. A drifted mirror, three ways. Each must be red to the real check, and green
    //    again once the real write has repaired it.
    const drifts = [
      ["a changed byte", () => put(dest, "demo/SKILL.md", fixtures["demo/SKILL.md"].replace("fixture", "fixturE"))],
      ["an extra file", () => put(dest, "stray/SKILL.md", "# not in the source\n")],
      ["a removed file", () => rmSync(join(dest, "demo/templates/note.md"), { force: true })],
    ];
    for (const [what, drift] of drifts) {
      drift();
      expect(`syncCheck passed a mirror with ${what}`, syncCheck(real) === 1);
      expect(`syncWrite did not return ok repairing ${what}`, syncWrite(real) === 0);
      expect(`syncCheck was still red after syncWrite repaired ${what}`, syncCheck(real) === 0);
    }
    expect("syncWrite left the stray file in the mirror", !existsSync(join(dest, "stray/SKILL.md")));
    expect(
      "syncWrite did not restore the removed file",
      sameBytes(join(source, "demo/templates/note.md"), join(dest, "demo/templates/note.md")),
    );

    // 4. The source moves — the CI case. An edit under lia-tools/skills with no re-sync
    //    is red; the re-sync carries the edit across and is green.
    const edited = fixtures["demo/SKILL.md"].replace("description: fixture", "description: changed");
    put(source, "demo/SKILL.md", edited);
    expect("syncCheck passed a mirror behind an edited source", syncCheck(real) === 1);
    expect("syncWrite did not return ok after a source edit", syncWrite(real) === 0);
    expect("syncWrite did not carry the source edit into the mirror", reads(join(dest, "demo/SKILL.md"), edited));
    expect("syncCheck was still red after the re-sync", syncCheck(real) === 0);

    // 5. No mirror at all is red, not "nothing to compare".
    rmSync(dest, { recursive: true, force: true });
    expect("syncCheck passed a missing mirror", syncCheck(real) === 1);
  } catch (err) {
    failures.push(`threw: ${err?.stack ?? err}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  if (failures.length) {
    console.error(`self-test failed — ${failures.length} of ${assertions} assertion(s) red:`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    return 1;
  }
  console.log(
    `self-test ok — ${assertions} assertions against the real syncWrite and syncCheck: symlink root refused and replaced, fresh mirror byte-equal and green, drift red by changed byte / extra file / removed file / edited source, missing mirror red`,
  );
  return 0;
}

const args = new Set(process.argv.slice(2));
if (args.has("--self-test")) process.exit(selfTest());
if (args.has("--check")) process.exit(syncCheck());
if (args.size > 0) {
  console.error("usage: node scripts/sync-cursor-skills.mjs [--check|--self-test]");
  process.exit(2);
}
process.exit(syncWrite());
