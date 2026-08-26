#!/usr/bin/env node
// Guard: a lia-tools change without a version bump is a publish that reaches
// nobody.
//
// Why this exists (LIAB-986): machines install `lia-tools` from the `release`
// ref, and Claude Code only delivers an update when the plugin's `version`
// field changes — the docs say it plainly: "users only receive updates when
// this field changes". So the bump is not bookkeeping, it is the delivery
// mechanism: promote a commit whose version matches what a machine already
// has, and that machine keeps the old build while the repo says otherwise.
// CLAUDE.md rule 3 already demands the bump; this makes CI remember it,
// because version numbers have lied here before (lia-tools/AUDIT.md has the
// story) and 1.2.1-with-no-enforcement was the worst of both worlds.
//
// What it checks: if anything under lia-tools/ differs between the base ref
// and the working tree, lia-tools/.claude-plugin/plugin.json must carry a
// different `version` than it does at the base. Different, not greater — a
// revert that moves the version backwards still delivers, because the string
// still changes. Everything under lia-tools/ counts, docs included: the whole
// directory ships to installers.
//
//   node scripts/check-version-bump.mjs                     # against origin/main
//   node scripts/check-version-bump.mjs --base origin/main  # explicit base
//   node scripts/check-version-bump.mjs --self-test         # prove it goes red

import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_DIR = "lia-tools/";
const MANIFEST = "lia-tools/.claude-plugin/plugin.json";

const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

// What a PR shows: merge-base of the base ref and HEAD, against the working
// tree — so the check answers the same question locally with uncommitted
// changes as it does in CI on the PR head.
function check(root, base) {
  let mergeBase;
  try {
    mergeBase = git(root, "merge-base", base, "HEAD");
  } catch {
    return { ok: false, kind: "unreadable", detail: `cannot resolve merge-base of ${base} and HEAD — fetch the base ref first.` };
  }

  const changed = git(root, "diff", "--name-only", mergeBase).split("\n").filter(Boolean);
  const touched = changed.filter((path) => path.startsWith(PLUGIN_DIR));
  if (touched.length === 0) {
    return { ok: true, kind: "untouched", detail: `no lia-tools/ change against ${base}` };
  }

  let baseVersion;
  try {
    baseVersion = JSON.parse(git(root, "show", `${mergeBase}:${MANIFEST}`)).version;
  } catch {
    // No manifest at the base: the plugin is being introduced, there is no
    // installed version to signal against.
    return { ok: true, kind: "new", detail: `${MANIFEST} does not exist at ${base}` };
  }

  let headVersion;
  try {
    headVersion = JSON.parse(readFileSync(join(root, MANIFEST), "utf8")).version;
  } catch (error) {
    return { ok: false, kind: "unreadable", detail: `${MANIFEST} unreadable in the working tree (${error.message}).` };
  }

  if (baseVersion === headVersion) {
    return {
      ok: false,
      kind: "no-bump",
      detail: `${touched.length} lia-tools file(s) changed but version is "${headVersion}" on both sides`,
      touched,
    };
  }
  return { ok: true, kind: "bumped", detail: `version ${baseVersion} -> ${headVersion} for ${touched.length} lia-tools file(s)` };
}

function report(outcome) {
  if (outcome.ok) {
    console.log(`ok — ${outcome.detail}`);
    return 0;
  }
  if (outcome.kind === "no-bump") {
    console.error(`lia-tools changed with no version bump — this promotion would deliver to nobody:\n`);
    for (const path of outcome.touched) console.error(`  ${path}`);
    console.error(`\n  → Bump "version" in ${MANIFEST} (and the changed skills' version: frontmatter, per CLAUDE.md rule 3).\n`);
  } else {
    console.error(`NOT CHECKED — ${outcome.detail}\n`);
    console.error(`  → The guard could not compare versions, so this change is unverified, not clean.\n`);
  }
  return 1;
}

// Plant the defect on a throwaway repo and assert the guard goes red — and
// assert the legal shapes stay green, because a guard that cries wolf on a
// docs-only root change gets deleted. A check nobody has watched fail is a
// check nobody knows works.
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "version-bump-guard-"));
  const write = (path, body) => {
    mkdirSync(join(dir, dirname(path)), { recursive: true });
    writeFileSync(join(dir, path), body);
  };
  const manifest = (version) => JSON.stringify({ name: "lia-tools", version }, null, 2);
  const reset = () => {
    git(dir, "checkout", "-q", "--", ".");
    git(dir, "clean", "-qfd");
  };

  try {
    git(dir, "init", "-q", "-b", "main");
    write("lia-tools/.claude-plugin/plugin.json", manifest("1.0.0"));
    write("lia-tools/skills/demo/SKILL.md", "---\nname: demo\ndescription: fixture\n---\n");
    write("README.md", "# fixture\n");
    git(dir, "add", "-A");
    git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "base");

    const scenarios = [
      {
        name: "skill changed, no bump",
        mutate: () => write("lia-tools/skills/demo/SKILL.md", "---\nname: demo\ndescription: edited\n---\n"),
        expect: { ok: false, kind: "no-bump" },
      },
      {
        name: "skill changed, version bumped",
        mutate: () => {
          write("lia-tools/skills/demo/SKILL.md", "---\nname: demo\ndescription: edited\n---\n");
          write("lia-tools/.claude-plugin/plugin.json", manifest("1.0.1"));
        },
        expect: { ok: true, kind: "bumped" },
      },
      {
        name: "root docs changed only",
        mutate: () => write("README.md", "# fixture, edited\n"),
        expect: { ok: true, kind: "untouched" },
      },
      {
        name: "version moved backwards still counts as a change",
        mutate: () => {
          write("lia-tools/skills/demo/SKILL.md", "---\nname: demo\ndescription: reverted\n---\n");
          write("lia-tools/.claude-plugin/plugin.json", manifest("0.9.9"));
        },
        expect: { ok: true, kind: "bumped" },
      },
      {
        name: "manifest made unreadable",
        mutate: () => {
          write("lia-tools/skills/demo/SKILL.md", "---\nname: demo\ndescription: edited\n---\n");
          write("lia-tools/.claude-plugin/plugin.json", "{ not json");
        },
        expect: { ok: false, kind: "unreadable" },
      },
    ];

    const failures = [];
    for (const { name, mutate, expect } of scenarios) {
      mutate();
      const outcome = check(dir, "main");
      // Kind is asserted, not just ok/red: a no-bump reported as unreadable
      // (or the reverse) is the guard being red for the wrong reason, which
      // is how a deleted core check hides behind a crashing one.
      if (outcome.ok !== expect.ok || outcome.kind !== expect.kind) {
        failures.push(`  ${name}: expected ${expect.ok ? "green" : "red"}/${expect.kind}, got ${outcome.ok ? "green" : "red"}/${outcome.kind} (${outcome.detail})`);
      }
      reset();
    }

    if (failures.length) {
      console.error("self-test FAILED");
      for (const line of failures) console.error(line);
      return 1;
    }
    console.log(`self-test ok — ${scenarios.length} scenarios: no-bump caught, bump and backwards-bump pass, root-only change ignored, unreadable manifest reported as unchecked`);
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const baseFlag = process.argv.indexOf("--base");
const base = baseFlag !== -1 ? process.argv[baseFlag + 1] : "origin/main";
process.exit(process.argv.includes("--self-test") ? selfTest() : report(check(REPO_ROOT, base)));
