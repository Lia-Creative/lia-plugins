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
//   - every commands/*.md frontmatter, except its `argument-hint:` line
//   - every .claude-plugin and .cursor-plugin plugin.json and marketplace.json `description`
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
//   - A command's `argument-hint:` line, and only that line. Angle brackets
//     there are Claude Code's own documented convention — but a command's
//     `description:` is published prose like any other, so the rest of its
//     frontmatter is read.
//
//   node scripts/check-skill-frontmatter.mjs              # check the repo
//   node scripts/check-skill-frontmatter.mjs --self-test  # prove it goes red

import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules"]);
// `.cursor/skills` (and `.agents/skills`) are a byte mirror of lia-tools/skills
// for Cursor discovery — see scripts/sync-cursor-skills.mjs. Walking them
// would double-count every SKILL.md without catching a second defect class.
const SKIP_SKILL_MIRROR_DIRS = new Set([".cursor/skills", ".agents/skills"]);
const MANIFESTS = new Set(["plugin.json", "marketplace.json"]);
const PLUGIN_DIRS = new Set([".claude-plugin", ".cursor-plugin"]);

// `description: >-`, `body: |2-`, `text: |-2` — the indicator is YAML
// structure, not value. YAML 1.2 permits the indentation and chomping
// indicators in either order, so both spellings are accepted here.
const BLOCK_SCALAR_HEADER = /^\s*(?:-\s*)?[\w.-]+:\s*[>|](?:[-+]\d?|\d[-+]?)?\s*$/;

const hasAngleBracket = (s) => /[<>]/.test(s);

function findFiles(root) {
  const skills = [];
  const commands = [];
  const manifests = [];
  const walk = (dir, inCommands) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      const rel = relative(root, path);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name) || SKIP_SKILL_MIRROR_DIRS.has(rel)) continue;
        walk(path, inCommands || entry.name === "commands");
      } else if (entry.name === "SKILL.md") {
        skills.push(path);
      } else if (inCommands && entry.name.endsWith(".md")) {
        commands.push(path);
      } else if (MANIFESTS.has(entry.name) && PLUGIN_DIRS.has(basename(dir))) {
        manifests.push(path);
      }
    }
  };
  walk(root, false);
  skills.sort();
  commands.sort();
  manifests.sort();
  return { skills, commands, manifests };
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

// The value in the file is JSON-escaped, so search for the escaped form first.
// Never guess: `indexOf` returning -1 used to make `slice(0, -1)` report the
// file's LAST line as the offence. The JSON path in the detail is the real
// locator; line 1 is an honest fallback.
function lineOf(text, value) {
  for (const needle of [JSON.stringify(value).slice(1, 31), value.slice(0, 30)]) {
    const at = text.indexOf(needle);
    if (at !== -1) return text.slice(0, at).split("\n").length;
  }
  return 1;
}

const ARGUMENT_HINT = /^\s*argument-hint:/;

function scan(root) {
  const { skills, commands, manifests } = findFiles(root);
  const offences = [];
  let blocksRead = 0;

  // A command file's frontmatter is read like a skill's, minus `argument-hint:`.
  for (const [file, isCommand] of [...skills.map((f) => [f, false]), ...commands.map((f) => [f, true])]) {
    const text = readFileSync(file, "utf8");
    const lines = frontmatterLines(text);
    if (lines === null) {
      offences.push({
        kind: "unchecked",
        file: relative(root, file),
        line: 1,
        detail: "no frontmatter block — a BOM before `---`, or no closing `---`.",
      });
      continue;
    }
    blocksRead += 1;
    for (const { number, content } of lines) {
      if (BLOCK_SCALAR_HEADER.test(content)) continue;
      if (isCommand && ARGUMENT_HINT.test(content)) continue;
      if (hasAngleBracket(content)) {
        offences.push({ kind: "brackets", file: relative(root, file), line: number, detail: content.trim() });
      }
    }
  }

  for (const file of manifests) {
    const text = readFileSync(file, "utf8");
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      offences.push({ kind: "unchecked", file: relative(root, file), line: 1, detail: `unparseable JSON (${error.message}).` });
      continue;
    }
    for (const { path, value } of descriptions(parsed)) {
      if (hasAngleBracket(value)) {
        offences.push({ kind: "brackets", file: relative(root, file), line: lineOf(text, value), detail: `${path} — ${value}` });
      }
    }
  }

  return {
    offences,
    checked: { blocks: blocksRead, files: skills.length + commands.length, commands: commands.length, manifests: manifests.length },
  };
}

const list = (offences) => offences.map(({ file, line, detail }) => `  ${file}:${line}\n    ${detail}\n`).join("");

function report({ offences, checked }) {
  if (offences.length === 0) {
    console.log(
      `ok — ${checked.blocks} frontmatter blocks (${checked.commands} of them commands) + ${checked.manifests} plugin manifests, no angle brackets`,
    );
    return 0;
  }

  // Two different problems: one needs a placeholder rewritten, the other needs
  // the file made readable. Printing them under one headline told whoever hit
  // the second to fix the first.
  const brackets = offences.filter((o) => o.kind === "brackets");
  const unchecked = offences.filter((o) => o.kind === "unchecked");

  if (brackets.length) {
    console.error(`Angle brackets in a published description (${brackets.length}) — Cowork reads these as XML tags and refuses the whole plugin:\n`);
    console.error(list(brackets));
    console.error(`  → Write placeholders as [name], not <name>.\n`);
  }
  if (unchecked.length) {
    console.error(`NOT CHECKED (${unchecked.length}) — the guard could not read these, so they are unverified, not clean:\n`);
    console.error(list(unchecked));
    console.error(`  → Make the frontmatter readable: drop the BOM, or close the \`---\` fence.\n`);
  }
  console.error(`Read: ${checked.blocks}/${checked.files} frontmatter blocks, ${checked.manifests} manifests.`);
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
  const command = (name, body) => {
    mkdirSync(join(dir, "commands"), { recursive: true });
    writeFileSync(join(dir, "commands", `${name}.md`), body);
  };
  const DEFECT = `description: "Use when asked 'epic: <name>'."`;
  const falsePositiveFixtures = 8; // [name], folded >-, indented >2-, body, BOM, command argument-hint, clean claude manifest, clean cursor manifest

  try {
    // Must be caught.
    skill("broken", ["---", "name: broken", DEFECT, "---", "", "# Broken on purpose", ""].join("\n"));
    skill("broken-bom", "﻿" + ["---", "name: bom", DEFECT, "---", "", "# BOM before the fence", ""].join("\n"));
    skill("broken-unterminated", ["---", "name: unterminated", DEFECT, "", "# No closing fence", ""].join("\n"));
    skill("broken-folded", ["---", "name: folded-defect", "description: >-", "  Use when asked 'epic: <name>'.", "---", "", "# Defect on a continuation line", ""].join("\n"));
    command("broken-command", ["---", `description: "Scaffold an <thing>."`, "argument-hint: <prototype-name>", "---", "", "# A command description is published prose too", ""].join("\n"));
    mkdirSync(join(dir, "broken-plugin", ".claude-plugin"), { recursive: true });
    writeFileSync(
      join(dir, "broken-plugin", ".claude-plugin", "plugin.json"),
      JSON.stringify({ name: "broken-plugin", version: "1.0.0", description: "Use when asked 'epic: <name>'." }, null, 2),
    );
    mkdirSync(join(dir, "broken-cursor-plugin", ".cursor-plugin"), { recursive: true });
    writeFileSync(
      join(dir, "broken-cursor-plugin", ".cursor-plugin", "plugin.json"),
      JSON.stringify({ name: "broken-cursor-plugin", version: "1.0.0", description: "Use when asked 'epic: <name>'." }, null, 2),
    );

    // Must NOT be caught.
    skill("clean", ["---", "name: clean", `description: "Use when asked 'epic: [name]'."`, "---", "", "# Fine", ""].join("\n"));
    skill("clean-folded", ["---", "name: folded", "description: >-", "  Use when asked for an epic.", "---", "", "# Fine", ""].join("\n"));
    skill("clean-indented", ["---", "name: indented", "description: >2-", "  Both indicator orders are valid YAML.", "---", "", "# Fine", ""].join("\n"));
    skill("clean-body", ["---", "name: body", `description: "Fine."`, "---", "", "# Angle brackets below the fence are fine", "", "`handover-<date>-<slug>`", ""].join("\n"));
    // Without the BOM strip this file goes red as NOT CHECKED — a false
    // positive on correct input. `broken-bom` alone cannot catch that: it is
    // red either way, just for a different reason. This fixture is what pins
    // the strip down, together with the kind/line assertion below.
    skill("clean-bom", "\ufeff" + ["---", "name: clean-bom", `description: "Perfectly fine, behind a BOM."`, "---", "", "# Fine", ""].join("\n"));
    command("clean-command", ["---", `description: "Scaffold a prototype."`, "argument-hint: <prototype-name>", "---", "", "# argument-hint is Claude Code's own convention", ""].join("\n"));
    mkdirSync(join(dir, "clean-plugin", ".claude-plugin"), { recursive: true });
    writeFileSync(
      join(dir, "clean-plugin", ".claude-plugin", "marketplace.json"),
      JSON.stringify({ name: "m", description: "Fine.", plugins: [{ name: "p", description: "Also fine." }] }, null, 2),
    );
    mkdirSync(join(dir, "clean-cursor-plugin", ".cursor-plugin"), { recursive: true });
    writeFileSync(
      join(dir, "clean-cursor-plugin", ".cursor-plugin", "marketplace.json"),
      JSON.stringify({ name: "m", description: "Fine.", plugins: [{ name: "p", description: "Also fine." }] }, null, 2),
    );

    const expectedRed = ["broken", "broken-bom", "broken-unterminated", "broken-folded", "broken-plugin", "broken-cursor-plugin", "broken-command"];
    const { offences } = scan(dir);
    const nameOf = (o) => o.file.split(/[\\/]/).map((s) => s.replace(/\.md$/, "")).find((s) => s.startsWith("broken") || s.startsWith("clean"));

    const missed = expectedRed.filter((name) => !offences.some((o) => nameOf(o) === name));
    const falsePositives = offences.filter((o) => o.file.includes("clean"));

    // `broken-bom` must be caught as the DEFECT on line 3, not as an unreadable
    // file. Without that, dropping the BOM strip leaves the self-test green.
    const bom = offences.find((o) => nameOf(o) === "broken-bom");
    const bomWrong = bom && (bom.kind !== "brackets" || bom.line !== 3);

    if (missed.length || falsePositives.length || bomWrong) {
      console.error("self-test FAILED");
      for (const name of missed) console.error(`  missed planted defect: ${name}`);
      for (const o of falsePositives) console.error(`  false positive: ${o.file}:${o.line} — ${o.detail}`);
      if (bomWrong) console.error(`  BOM not stripped: broken-bom reported as ${bom.kind} at line ${bom.line}, expected brackets at line 3`);
      return 1;
    }
    console.log(
      `self-test ok — ${expectedRed.length} planted defects caught (raw, BOM at the real line, unterminated, folded continuation, plugin.json, cursor plugin.json, command); ${falsePositiveFixtures} legal spellings left alone`,
    );
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

process.exit(process.argv.includes("--self-test") ? selfTest() : report(scan(REPO_ROOT)));
