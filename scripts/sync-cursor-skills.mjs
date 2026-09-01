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

function syncWrite() {
  if (!existsSync(SOURCE)) {
    console.error(`missing source: ${relative(REPO_ROOT, SOURCE)}`);
    return 1;
  }
  mkdirSync(dirname(DEST), { recursive: true });
  // Replace whatever is there (symlink or stale tree) with a clean copy.
  rmSync(DEST, { recursive: true, force: true });
  cpSync(SOURCE, DEST, { recursive: true, dereference: true });
  // Drop junk macOS sometimes leaves; Cursor only needs skill folders.
  for (const name of SKIP_NAMES) {
    const p = join(DEST, name);
    if (existsSync(p)) rmSync(p, { force: true });
  }
  const n = listFiles(DEST).length;
  console.log(`ok — mirrored ${n} file(s) from lia-tools/skills → .cursor/skills`);
  return 0;
}

function syncCheck() {
  if (!existsSync(SOURCE)) {
    console.error(`missing source: ${relative(REPO_ROOT, SOURCE)}`);
    return 1;
  }
  if (!existsSync(DEST)) {
    console.error(`.cursor/skills is missing — run: node scripts/sync-cursor-skills.mjs`);
    return 1;
  }
  if (lstatSync(DEST).isSymbolicLink()) {
    console.error(
      `.cursor/skills is a symlink — Cursor does not discover skills through a skills-root symlink. Replace it with a real mirror: node scripts/sync-cursor-skills.mjs`,
    );
    return 1;
  }
  const { missing, extra, changed } = diffMaps(mirrorMap(SOURCE), mirrorMap(DEST));
  if (!missing.length && !extra.length && !changed.length) {
    console.log(`ok — .cursor/skills matches lia-tools/skills (${mirrorMap(SOURCE).size} file(s))`);
    return 0;
  }
  console.error(`.cursor/skills is out of sync with lia-tools/skills:\n`);
  for (const rel of missing) console.error(`  missing in mirror: ${rel}`);
  for (const rel of changed) console.error(`  content differs:   ${rel}`);
  for (const rel of extra) console.error(`  extra in mirror:   ${rel}`);
  console.error(`\n  → Edit skills only under lia-tools/skills/, then run: node scripts/sync-cursor-skills.mjs\n`);
  return 1;
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "sync-cursor-skills-"));
  const source = join(dir, "lia-tools", "skills");
  const dest = join(dir, ".cursor", "skills");
  mkdirSync(join(source, "demo"), { recursive: true });
  writeFileSync(join(source, "demo", "SKILL.md"), "---\nname: demo\ndescription: fixture\n---\n# demo\n");

  // 1. Symlink root must fail --check.
  mkdirSync(dirname(dest), { recursive: true });
  symlinkSync(source, dest);
  const symlinkCheck = (() => {
    // Inline the same rules against this fixture root.
    if (lstatSync(dest).isSymbolicLink()) return 1;
    return 0;
  })();
  if (symlinkCheck !== 1) {
    rmSync(dir, { recursive: true, force: true });
    console.error("self-test failed — symlink root was not treated as a defect");
    return 1;
  }
  rmSync(dest, { force: true });

  // 2. Fresh sync then check must be green.
  cpSync(source, dest, { recursive: true });
  const green = diffMaps(mirrorMap(source), mirrorMap(dest));
  if (green.missing.length || green.extra.length || green.changed.length) {
    rmSync(dir, { recursive: true, force: true });
    console.error("self-test failed — identical trees reported a diff");
    return 1;
  }

  // 3. Drift must be red.
  writeFileSync(join(source, "demo", "SKILL.md"), "---\nname: demo\ndescription: changed\n---\n# demo\n");
  const red = diffMaps(mirrorMap(source), mirrorMap(dest));
  if (!red.changed.length) {
    rmSync(dir, { recursive: true, force: true });
    console.error("self-test failed — content drift was not detected");
    return 1;
  }

  rmSync(dir, { recursive: true, force: true });
  console.log("self-test ok — symlink root refused, matching mirror green, drifted mirror red");
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
