#!/usr/bin/env node
// Guard: no angle brackets in a published description.
//
// Why this exists (LIAB-959): `epic-builder`'s description carried the prose
// placeholder `<name>`. The git marketplace accepted it and `claude plugin
// validate` passed it; the claude.ai/Cowork validator parsed it as an XML tag
// and refused the whole plugin — "SKILL.md description cannot contain XML
// tags". One plugin, one build, two verdicts, and nothing in between saying so.
//
// What it reads:
//   - every SKILL.md's YAML frontmatter — all fields, not just `description`
//   - every .claude-plugin/plugin.json and marketplace.json `description`
//
// The rule is deliberately wider than the failure. The Cowork validator names
// a skill's `description`, but which other fields and files it reads is not
// published, and a placeholder in `triggers:` gets copied into a `description:`
// sooner or later. So: no `<` or `>` in any of it. Write placeholders as
// `[name]`.
//
// Two exemptions, both because a guard that fails on correct input is a guard
// someone deletes in a hurry:
//   - YAML block-scalar headers (`description: >-`). That `>` is structure and
//     never reaches the description text; ten skills here use it.
//   - Command files (`argument-hint: <name>`) are not scanned. Angle brackets
//     there are Claude Code's own documented convention.
//
//   node scripts/check-skill-frontmatter.mjs              # check the repo
//   node scripts/check-skill-frontmatter.mjs --self-test  # prove it goes red

import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules"]);
const MANIFESTS = new Set(["plugin.json", "marketplace.json"]);

// `description: >-`, `body: |2-`, `text: |-2` — the indicator is YAML
// structure, not value. YAML 1.2 permits the indentation and chomping
// indicators in either order, so both spellings are accepted here.
const BLOCK_SCALAR_HEADER = /^\s*(?:-\s*)?[\w.-]+:\s*[>|](?:[-+]\d?|\d[-+]?)?\s*$/;

const hasAngleBracket = (s) => /[<>]/.test(s);

function findFiles(root) {
  const skills = [];
  const manifests = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(path);
      } else if (entry.name === "SKILL.md") {
        skills.push(path);
      } else if (MANIFESTS.has(entry.name) && basename(dir) === ".claude-plugin") {
        manifests.push(path);
      }
    }
  };
  walk(root);
  skills.sort();
  manifests.sort();
  return { skills, manifests };
}

// The frontmatter block: a leading `---` line, up to the next `---` line.
// Returns null — never an empty list — when there is no such block, so the
// caller can tell "nothing to flag" from "nothing was read". A file this
// returns null for is unchecked, and unchecked is reported, not skipped: a BOM
// before `---` or a missing closing fence used to sail through while the
// success line counted the file as checked.
function frontmatterLines(text) {
  const lines = text.replace(/^﻿/, "").split("\n");
  if (lines[0]?.trimEnd() !== "---") return null;
  const end = lines.findIndex((line, i) => i > 0 && line.trimEnd() === "---");
  if (end === -1) return null;
  return lines.slice(1, end).map((content, i) => ({ number: i + 2, content }));
}

// Every `description` at any depth: plugin.json's own, and each entry under
// marketplace.json's `plugins`.
function descriptions(node, path = "$") {
  if (Array.isArray(node)) return node.flatMap((v, i) => descriptions(v, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) =>
      key === "description" && typeof value === "string"
        ? [{ path: `${path}.${key}`, value }]
        : descriptions(value, `${path}.${key}`),
    );
  }
  return [];
}

const lineOf = (text, needle) => text.slice(0, text.indexOf(needle)).split("\n").length;

function scan(root) {
  const { skills, manifests } = findFiles(root);
  const offences = [];
  let blocksRead = 0;

  for (const file of skills) {
    const text = readFileSync(file, "utf8");
    const lines = frontmatterLines(text);
    if (lines === null) {
      offences.push({
        file: relative(root, file),
        line: 1,
        detail: "no frontmatter block — a BOM before `---`, or no closing `---`. NOT CHECKED.",
      });
      continue;
    }
    blocksRead += 1;
    for (const { number, content } of lines) {
      if (BLOCK_SCALAR_HEADER.test(content)) continue;
      if (hasAngleBracket(content)) {
        offences.push({ file: relative(root, file), line: number, detail: content.trim() });
      }
    }
  }

  for (const file of manifests) {
    const text = readFileSync(file, "utf8");
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      offences.push({ file: relative(root, file), line: 1, detail: `unparseable JSON (${error.message}). NOT CHECKED.` });
      continue;
    }
    for (const { path, value } of descriptions(parsed)) {
      if (hasAngleBracket(value)) {
        offences.push({ file: relative(root, file), line: lineOf(text, value.slice(0, 30)), detail: `${path} — ${value}` });
      }
    }
  }

  return { offences, checked: { blocks: blocksRead, skills: skills.length, manifests: manifests.length } };
}

function report({ offences, checked }) {
  if (offences.length === 0) {
    console.log(`ok — ${checked.blocks} skill frontmatter blocks + ${checked.manifests} plugin manifests, no angle brackets`);
    return 0;
  }
  console.error(`Angle brackets in a published description (${offences.length}) — Cowork reads these as XML tags and refuses the whole plugin:\n`);
  for (const { file, line, detail } of offences) console.error(`  ${file}:${line}\n    ${detail}\n`);
  console.error(`Write placeholders as [name], not <name>.`);
  console.error(`Read: ${checked.blocks}/${checked.skills} skill frontmatter blocks, ${checked.manifests} manifests.`);
  return 1;
}

// Plant each defect on a throwaway copy and assert the guard goes red — and
// assert the legal spellings stay green, because a guard that cries wolf on
// valid YAML gets deleted. A check nobody has watched fail is a check nobody
// knows works: that is how the one-way-sync note failed.
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "frontmatter-guard-"));
  const skill = (name, body) => {
    mkdirSync(join(dir, "skills", name), { recursive: true });
    writeFileSync(join(dir, "skills", name, "SKILL.md"), body);
  };
  const DEFECT = `description: "Use when asked 'epic: <name>'."`;

  try {
    // Must be caught.
    skill("broken", ["---", "name: broken", DEFECT, "---", "", "# Broken on purpose", ""].join("\n"));
    skill("broken-bom", "﻿" + ["---", "name: bom", DEFECT, "---", "", "# BOM before the fence", ""].join("\n"));
    skill("broken-unterminated", ["---", "name: unterminated", DEFECT, "", "# No closing fence", ""].join("\n"));
    skill("broken-folded", ["---", "name: folded-defect", "description: >-", "  Use when asked 'epic: <name>'.", "---", "", "# Defect on a continuation line", ""].join("\n"));
    mkdirSync(join(dir, "broken-plugin", ".claude-plugin"), { recursive: true });
    writeFileSync(
      join(dir, "broken-plugin", ".claude-plugin", "plugin.json"),
      JSON.stringify({ name: "broken-plugin", version: "1.0.0", description: "Use when asked 'epic: <name>'." }, null, 2),
    );

    // Must NOT be caught.
    skill("clean", ["---", "name: clean", `description: "Use when asked 'epic: [name]'."`, "---", "", "# Fine", ""].join("\n"));
    skill("clean-folded", ["---", "name: folded", "description: >-", "  Use when asked for an epic.", "---", "", "# Fine", ""].join("\n"));
    skill("clean-indented", ["---", "name: indented", "description: >2-", "  Both indicator orders are valid YAML.", "---", "", "# Fine", ""].join("\n"));
    skill("clean-body", ["---", "name: body", `description: "Fine."`, "---", "", "# Angle brackets below the fence are fine", "", "`handover-<date>-<slug>`", ""].join("\n"));
    mkdirSync(join(dir, "clean-plugin", ".claude-plugin"), { recursive: true });
    writeFileSync(
      join(dir, "clean-plugin", ".claude-plugin", "marketplace.json"),
      JSON.stringify({ name: "m", description: "Fine.", plugins: [{ name: "p", description: "Also fine." }] }, null, 2),
    );

    const expectedRed = ["broken", "broken-bom", "broken-unterminated", "broken-folded", "broken-plugin"];
    const { offences } = scan(dir);
    const flagged = new Set(offences.map((o) => o.file.split(/[\\/]/).find((s) => s.startsWith("broken") || s.startsWith("clean"))));

    const missed = expectedRed.filter((name) => !flagged.has(name));
    const falsePositives = offences.filter((o) => o.file.includes("clean"));

    if (missed.length || falsePositives.length) {
      console.error("self-test FAILED");
      for (const name of missed) console.error(`  missed planted defect: ${name}`);
      for (const o of falsePositives) console.error(`  false positive: ${o.file}:${o.line} — ${o.detail}`);
      return 1;
    }
    console.log(`self-test ok — ${expectedRed.length} planted defects caught (raw, BOM, unterminated, folded continuation, plugin.json); 5 legal spellings left alone`);
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

process.exit(process.argv.includes("--self-test") ? selfTest() : report(scan(REPO_ROOT)));
