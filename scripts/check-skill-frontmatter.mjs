#!/usr/bin/env node
// Guard: no angle brackets anywhere in a skill's YAML frontmatter.
//
// Why this exists (LIAB-959): `epic-builder`'s description carried the prose
// placeholder `<name>`. The git marketplace accepted it and `claude plugin
// validate` passed it; the claude.ai/Cowork validator parsed it as an XML tag
// and refused the whole plugin — "SKILL.md description cannot contain XML
// tags". One plugin, one build, two verdicts, and nothing in between saying so.
//
// The rule is deliberately wider than the failure. The Cowork validator names
// `description`, but which other fields it reads is not published, and a
// placeholder in `triggers:` gets copied into a `description:` sooner or later.
// So: no `<` or `>` in any frontmatter VALUE, in any field. Write placeholders
// as `[name]`.
//
// YAML block-scalar headers (`description: >-`) are the one exception: that `>`
// is YAML structure, never reaches the description text, and ten skills here
// use it. A guard that fails on valid YAML is a guard someone deletes.
//
//   node scripts/check-skill-frontmatter.mjs              # check the repo
//   node scripts/check-skill-frontmatter.mjs --self-test  # prove it goes red

import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules"]);

function findSkillFiles(root) {
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name));
      } else if (entry.name === "SKILL.md") {
        found.push(join(dir, entry.name));
      }
    }
  };
  walk(root);
  return found.sort();
}

// The frontmatter block: a leading `---` line, up to the next `---` line.
// Returns [] for a file without one — that is repo rule 2's problem, not ours.
function frontmatterLines(text) {
  const lines = text.split("\n");
  if (lines[0]?.trimEnd() !== "---") return [];
  const end = lines.findIndex((line, i) => i > 0 && line.trimEnd() === "---");
  if (end === -1) return [];
  return lines.slice(1, end).map((content, i) => ({ number: i + 2, content }));
}

// `description: >-`, `body: |2+` — the indicator is YAML structure, not value.
const BLOCK_SCALAR_HEADER = /^\s*(?:-\s*)?[\w.-]+:\s*[>|][-+]?\d*\s*$/;

function findOffences(root) {
  const offences = [];
  for (const file of findSkillFiles(root)) {
    for (const { number, content } of frontmatterLines(readFileSync(file, "utf8"))) {
      if (BLOCK_SCALAR_HEADER.test(content)) continue;
      if (/[<>]/.test(content)) {
        offences.push({ file: relative(root, file), line: number, content: content.trim() });
      }
    }
  }
  return offences;
}

function report(offences, scanned) {
  if (offences.length === 0) {
    console.log(`ok — ${scanned} SKILL.md frontmatter blocks, no angle brackets`);
    return 0;
  }
  console.error(`Angle brackets in skill frontmatter (${offences.length}) — Cowork reads these as XML tags and refuses the whole plugin:\n`);
  for (const { file, line, content } of offences) console.error(`  ${file}:${line}\n    ${content}\n`);
  console.error("Write placeholders as [name], not <name>.");
  return 1;
}

// Copy the repo's frontmatter guard onto a throwaway skill that is broken on
// purpose, and assert the guard goes red. A check nobody has seen fail is a
// check nobody knows works — that is how the one-way-sync note failed.
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "frontmatter-guard-"));
  try {
    mkdirSync(join(dir, "skills", "broken"), { recursive: true });
    writeFileSync(
      join(dir, "skills", "broken", "SKILL.md"),
      ['---', 'name: broken', 'description: "Use when asked \'epic: <name>\'."', '---', '', '# Broken on purpose', ''].join("\n"),
    );
    mkdirSync(join(dir, "skills", "clean"), { recursive: true });
    writeFileSync(
      join(dir, "skills", "clean", "SKILL.md"),
      ['---', 'name: clean', 'description: "Use when asked \'epic: [name]\'."', '---', '', '# Fine', ''].join("\n"),
    );
    // The false positive that would get this guard deleted: valid folded YAML.
    mkdirSync(join(dir, "skills", "folded"), { recursive: true });
    writeFileSync(
      join(dir, "skills", "folded", "SKILL.md"),
      ['---', 'name: folded', 'description: >-', '  Use when asked for an epic.', '---', '', '# Fine', ''].join("\n"),
    );

    const offences = findOffences(dir);
    const caught = offences.filter((o) => o.file.includes("broken"));
    const falsePositives = offences.filter((o) => !o.file.includes("broken"));

    if (caught.length !== 1 || falsePositives.length !== 0) {
      console.error(`self-test FAILED — caught ${caught.length} of 1 planted defect, ${falsePositives.length} false positives`);
      for (const o of falsePositives) console.error(`  false positive: ${o.file}:${o.line} — ${o.content}`);
      return 1;
    }
    console.log(`self-test ok — planted <name> caught at ${caught[0].file}:${caught[0].line}; [name] and a folded \`>-\` description left alone`);
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const exitCode = process.argv.includes("--self-test")
  ? selfTest()
  : report(findOffences(REPO_ROOT), findSkillFiles(REPO_ROOT).length);

process.exit(exitCode);
