#!/usr/bin/env node
// Guard: the skill roster is real — every directory under a `skills/` folder
// can actually load, and every skill that loads is written down.
//
// Why this exists (LIAB-1005): PR #20 carried 468 lines of an unrelated,
// incomplete skill — `lia-tools/skills/ux-writing/references/*.md` with no
// `SKILL.md` on the branch or on main — and both existing guards passed it
// green. `check-skill-frontmatter.mjs` walks *for* `SKILL.md` files, so a
// directory without one is not a file it fails on, it is a file it never
// sees. `check-version-bump.mjs` counts changed `lia-tools/**` paths and
// checks the manifest moved; it did. Neither guard has any opinion about a
// directory under `skills/` that cannot load. A human reading the diff caught
// it, which is the one check this repo has already decided not to rely on.
//
// Why it matters past tidiness: the whole `lia-tools/` directory ships to
// installers at each version, and Claude Code's skill loader keys on
// `SKILL.md`. A directory without one installs and is unreachable — while
// still being greppable by any agent working in the tree. In this case that
// included lexicon rows marked "(proposed) — want a founder's yes before they
// harden", which read as settled house rules with nothing left to frame them.
//
// Two rules, one question — is the roster true? — pointing opposite ways:
//
//   1. UNLOADABLE. A directory directly under `skills/` that holds files but
//      no `SKILL.md` of its own. It ships and cannot be invoked.
//   2. UNDOCUMENTED / PHANTOM. A skill the plugin's README never names, or a
//      roster row naming a directory that isn't there. Same drift, other way:
//      the roster is how anyone knows what the plugin carries.
//
// Deliberately left alone, because a guard that fails on correct input is a
// guard someone deletes in a hurry:
//   - Directories that are not directly under a `skills/` folder. A skill's
//     own `references/`, `scripts/`, `assets/` are its business.
//   - Empty directories. Git cannot carry one, so it is a local leftover, not
//     something that reaches an installer.
//   - Dot-directories anywhere.
//   - How a skill is named in the README. A table row is the house shape, but
//     `orchestrate` is a deliberate one-line prose pointer and is documented.
//     The failure here is a skill nobody wrote down at all, so any backticked
//     mention counts.
//
//   node scripts/check-skill-roster.mjs              # check the repo
//   node scripts/check-skill-roster.mjs --self-test  # prove it goes red

import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules"]);

// Every `skills/` directory in the tree. Written as a walk rather than a
// hardcoded `lia-tools/skills` because the marketplace holds more than one
// plugin and the next one gets the same guard for free.
function findSkillsDirs(root) {
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.name === "skills") found.push(path);
      else walk(path);
    }
  };
  walk(root);
  return found.sort();
}

// Does anything at all live under here? An empty directory is not a shipped
// defect — git cannot carry one — so it is not worth a red build.
function holdsFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile()) return true;
    if (entry.isDirectory() && holdsFiles(join(dir, entry.name))) return true;
  }
  return false;
}

// A `SKILL.md` anywhere below the skill root, when there is none at the root
// itself. Not a separate rule — the directory is still unloadable — but the
// detail line should say "mis-nested", not "missing", or the fix reads as
// "write a new one" when the file is right there.
function nestedSkillFile(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const child = join(dir, entry.name);
    if (existsSync(join(child, "SKILL.md"))) return join(child, "SKILL.md");
    const deeper = nestedSkillFile(child);
    if (deeper) return deeper;
  }
  return null;
}

// A roster row: `| `name` | the seat |`. The header rows carry no backticks
// and fall out on their own.
const ROSTER_ROW = /^\|\s*`([a-z0-9][a-z0-9.-]*)`\s*\|/gm;

const rosterRows = (readme) => [...readme.matchAll(ROSTER_ROW)].map((m) => m[1]);

function scan(root) {
  const offences = [];
  const checked = { plugins: 0, skills: 0 };

  for (const skillsDir of findSkillsDirs(root)) {
    const pluginRoot = dirname(skillsDir);
    checked.plugins += 1;

    const names = readdirSync(skillsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name)
      .sort();

    const loadable = [];
    for (const name of names) {
      const dir = join(skillsDir, name);
      checked.skills += 1;
      if (existsSync(join(dir, "SKILL.md"))) {
        loadable.push(name);
        continue;
      }
      if (!holdsFiles(dir)) continue;
      const nested = nestedSkillFile(dir);
      offences.push({
        kind: "unloadable",
        file: `${relative(root, dir)}/`,
        detail: nested
          ? `no SKILL.md at the skill root — found one at ${relative(root, nested)}, which the loader does not key on.`
          : `holds files but no SKILL.md — this installs and cannot be invoked.`,
      });
    }

    const readmePath = join(pluginRoot, "README.md");
    if (!existsSync(readmePath)) {
      offences.push({
        kind: "unchecked",
        file: `${relative(root, pluginRoot)}/README.md`,
        detail: `no README at the plugin root, so ${loadable.length} skill(s) here have no roster to check against.`,
      });
      continue;
    }
    const readme = readFileSync(readmePath, "utf8");
    const readmeRelative = relative(root, readmePath);

    for (const name of loadable) {
      if (!readme.includes("`" + name + "`")) {
        offences.push({
          kind: "undocumented",
          file: `${relative(root, join(skillsDir, name))}/`,
          detail: `loads, but ${readmeRelative} never names it — nobody reading the roster knows it exists.`,
        });
      }
    }

    const present = new Set(names);
    for (const name of rosterRows(readme)) {
      if (!present.has(name)) {
        offences.push({
          kind: "phantom",
          file: readmeRelative,
          detail: `roster row for \`${name}\`, but ${relative(root, join(skillsDir, name))}/ does not exist.`,
        });
      }
    }
  }

  return { offences, checked };
}

const list = (offences) => offences.map(({ file, detail }) => `  ${file}\n    ${detail}\n`).join("");

function report({ offences, checked }) {
  if (offences.length === 0) {
    console.log(`ok — ${checked.skills} skill directories across ${checked.plugins} plugin(s), every one loadable and on its roster`);
    return 0;
  }

  // Three different fixes. Printing them under one headline is how whoever
  // hits the third is told to do the first — the mistake the frontmatter
  // guard already had to unpick.
  const unloadable = offences.filter((o) => o.kind === "unloadable");
  const undocumented = offences.filter((o) => o.kind === "undocumented");
  const phantom = offences.filter((o) => o.kind === "phantom");
  const unchecked = offences.filter((o) => o.kind === "unchecked");

  if (unloadable.length) {
    console.error(`Skill directories that cannot load (${unloadable.length}) — these ship to installers and are unreachable, but stay greppable:\n`);
    console.error(list(unloadable));
    console.error(`  → Add the SKILL.md, or take the directory out of this PR.\n`);
  }
  if (undocumented.length) {
    console.error(`Skills missing from the roster (${undocumented.length}):\n`);
    console.error(list(undocumented));
    console.error(`  → Add a row to the plugin README's roster table.\n`);
  }
  if (phantom.length) {
    console.error(`Roster rows with no skill behind them (${phantom.length}):\n`);
    console.error(list(phantom));
    console.error(`  → Drop the row, or restore the skill it names.\n`);
  }
  if (unchecked.length) {
    console.error(`NOT CHECKED (${unchecked.length}) — the guard could not read the roster, so these are unverified, not clean:\n`);
    console.error(list(unchecked));
  }
  console.error(`Read: ${checked.skills} skill directories across ${checked.plugins} plugin(s).`);
  return 1;
}

// Plant each defect on a throwaway copy and assert the guard goes red — and
// assert the legal shapes stay green. A check nobody has watched fail is a
// check nobody knows works, and a self-test that still prints ok with the core
// check deleted proves nothing (LIAB-959, the second of that day's three
// lessons). So the kind is asserted per fixture, not just the count: an
// unloadable directory reported as undocumented is the guard being red for the
// wrong reason.
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "skill-roster-guard-"));
  const write = (path, body) => {
    mkdirSync(join(dir, dirname(path)), { recursive: true });
    writeFileSync(join(dir, path), body);
  };
  const skillMd = (name) => ["---", `name: ${name}`, "description: fixture", "---", "", "# fixture", ""].join("\n");

  try {
    // --- plugin-a: the real defects ---------------------------------------
    // The ticket's own case, to the letter: reference files, no SKILL.md
    // anywhere. This is what shipped through PR #20.
    write("plugin-a/skills/ux-writing/references/lexicon.md", "# lexicon\n\n(proposed) — want a founder's yes before they harden\n");
    write("plugin-a/skills/ux-writing/references/patterns.md", "# patterns\n");
    // A SKILL.md that exists but one level too deep — still unloadable, and
    // the detail line has to say so or the fix is misread.
    write("plugin-a/skills/mis-nested/inner/SKILL.md", skillMd("inner"));
    // Loads fine, but the roster never heard of it.
    write("plugin-a/skills/ghost/SKILL.md", skillMd("ghost"));
    // A row pointing at nothing.
    write("plugin-a/skills/kept/SKILL.md", skillMd("kept"));
    write(
      "plugin-a/README.md",
      ["# plugin-a", "", "| Skill | The seat |", "|---|---|", "| `kept` | Still here. |", "| `vanished` | Deleted last week. |", ""].join("\n"),
    );

    // --- plugin-b: correct input, must stay green -------------------------
    write("plugin-b/skills/normal/SKILL.md", skillMd("normal"));
    // A skill's own subdirectories are its business — `references/` here must
    // not be read as a skill of its own.
    write("plugin-b/skills/normal/references/notes.md", "# notes\n");
    // Documented in prose rather than a table row — the `orchestrate` shape.
    write("plugin-b/skills/pointer/SKILL.md", skillMd("pointer"));
    // A directory next to skills/ that holds files and no SKILL.md, because
    // the rule is about `skills/`, not about every folder in the plugin.
    write("plugin-b/.claude-plugin/plugin.json", JSON.stringify({ name: "plugin-b", version: "1.0.0" }, null, 2));
    write("plugin-b/docs/how-it-works.md", "# docs\n");
    write(
      "plugin-b/README.md",
      ["# plugin-b", "", "| Skill | The seat |", "|---|---|", "| `normal` | The usual shape. |", "", "*(`pointer` remains as a pointer.)*", ""].join("\n"),
    );

    // --- plugin-c: no roster to check against -----------------------------
    write("plugin-c/skills/lonely/SKILL.md", skillMd("lonely"));

    const expected = [
      { file: "plugin-a/skills/ux-writing/", kind: "unloadable" },
      { file: "plugin-a/skills/mis-nested/", kind: "unloadable" },
      { file: "plugin-a/skills/ghost/", kind: "undocumented" },
      { file: "plugin-a/README.md", kind: "phantom" },
      { file: "plugin-c/README.md", kind: "unchecked" },
    ];

    const { offences } = scan(dir);
    const normalise = (o) => ({ ...o, file: o.file.split("\\").join("/") });
    const actual = offences.map(normalise);

    const failures = [];
    for (const { file, kind } of expected) {
      const hit = actual.find((o) => o.file === file);
      if (!hit) failures.push(`  missed planted defect: ${file} (expected ${kind})`);
      else if (hit.kind !== kind) failures.push(`  wrong kind for ${file}: expected ${kind}, got ${hit.kind}`);
    }
    for (const o of actual) {
      if (!expected.some((e) => e.file === o.file)) failures.push(`  false positive: ${o.file} — ${o.detail}`);
    }
    // The mis-nested detail must name the file it found. Without this the two
    // unloadable fixtures are interchangeable and the nested branch could be
    // deleted with the self-test still green.
    const misNested = actual.find((o) => o.file === "plugin-a/skills/mis-nested/");
    if (misNested && !misNested.detail.includes("inner/SKILL.md")) {
      failures.push(`  mis-nested defect did not name the file it found: ${misNested.detail}`);
    }

    if (failures.length) {
      console.error("self-test FAILED");
      for (const line of failures) console.error(line);
      return 1;
    }
    console.log(
      `self-test ok — ${expected.length} planted defects caught (the ux-writing case, a mis-nested SKILL.md, an undocumented skill, a phantom roster row, a plugin with no README); a skill's own references/, a prose-documented skill and a non-skills folder left alone`,
    );
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

process.exit(process.argv.includes("--self-test") ? selfTest() : report(scan(REPO_ROOT)));
