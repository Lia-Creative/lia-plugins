#!/usr/bin/env node
// Guard: a lia-tools change that does not move the numbers is a publish that
// reaches nobody — or, worse, one that reaches everybody with a lie attached.
//
// Why this exists (LIAB-986): machines install `lia-tools` from the `release`
// ref, and Claude Code only delivers an update when the plugin's `version`
// field changes — the docs say it plainly: "users only receive updates when
// this field changes". So the bump is not bookkeeping, it is the delivery
// mechanism: promote a commit whose version matches what a machine already
// has, and that machine keeps the old build while the repo says otherwise.
//
// CLAUDE.md rule 3 has three parts:
//
//   "A content change bumps the skill's `version:` **with a changelog line**,
//    and bumps lia-tools/.claude-plugin/plugin.json."
//
// Until LIAB-1016 this guard enumerated the *manifest* and nothing else, so
// two of those three parts were outside what it could report. A skill could
// change its content, ship to every machine, and carry a version number that
// had not moved and a changelog that did not mention it — green. That is the
// precise failure `lia-tools/AUDIT.md` records having happened before, and
// rule 3's own sentence says "the changelog line is what makes them mean
// something". The changelog line was the half nothing checked.
//
// The lesson it is an instance of (CLAUDE.md, "Make the check fail on
// purpose"): a guard's blind spot is not in what it checks, it is in the
// shape of what it enumerates.
//
// What it checks:
//
//   1. MANIFEST MOVED. If anything under lia-tools/ differs between the base
//      ref and the working tree, lia-tools/.claude-plugin/plugin.json must
//      carry a different `version` than it does at the base.
//   2. MANIFEST MOVED FORWARD (LIAB-1002). Not merely different. A version
//      that goes backwards still *delivers* — the string changed — so every
//      machine silently rolls back to an older build with nothing saying so.
//      Found live twice on PR #19: main was at 1.3.0 while the branch carried
//      1.2.5, and resolving the conflict by keeping 1.2.5 would have gone
//      green in CI while publishing a downgrade. A deliberate rollback has its
//      own sanctioned path — the `release` force-push in lia-tools/README.md
//      §Roll back — which does not run this check.
//   3. EACH CHANGED SKILL BUMPED. A changed file under lia-tools/skills/<name>/
//      means that skill's own `version:` moved in the same diff.
//   4. THE BUMP IS CHANGELOGGED. A moved `version:` has a line naming it in
//      that skill's `## Changelog`, and the section exists at all.
//   5. THE BUMP MOVES EXACTLY ONE STEP (LIAB-1184). From `X.Y.Z` the only legal
//      heads are `X.Y.(Z+1)`, `X.(Y+1).0` and `(X+1).0.0`. Alone among these
//      five, this one is not about a broken delivery — a skipped version
//      delivers fine. It is about the number meaning something: under rules 1-4
//      a bump could land anywhere above the last one, so "we bumped it" was the
//      only claim a version made. CLAUDE.md rule 10 makes the *size* a claim
//      too — patch it got better, minor it does something new, major something
//      that worked stops working — and a claim you can make from any number is
//      not a claim. The two jumps in this file's own history (1.3.0 -> 1.3.3,
//      1.19.0 -> 1.21.0) are what it looks like when nobody is reading.
//
//   6. THE NUMBER IS STILL FREE (LIAB-1184, review D2). The head's version, and
//      each changed skill's, is strictly above what the *base ref* serves — not
//      merely above the merge-base. Rules 1-5 all ask "did this branch move the
//      number", which stops being the same question the moment someone else
//      lands: two branches that pick the same version merge without a conflict,
//      because both wrote the same string, and the result delivers nothing. The
//      first cut of rule 5 read the base ref only *after* the step check had
//      already failed, so the one case it could not see was the exact
//      collision — and that is the case it met, on its own branch, twice.
//
// Deliberately not checked: whether a changelog line is any *good*, and whether
// the size of a bump is the *right* size — a guard cannot read what a change
// means. Presence of a line naming the new version is the bar, and one step is
// the bar; judging both is review's job.
//
// Known boundary: the diff is `git diff <merge-base>`, which does not see
// untracked files. In CI that is exactly right — everything on a PR head is
// committed — but a local run before `git add` will not flag a brand-new file.
// CI is the authority; a green local run on an uncommitted tree is not a
// clean bill of health.
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
const SKILLS_DIR = "lia-tools/skills/";
const MANIFEST = "lia-tools/.claude-plugin/plugin.json";

const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const gitShow = (cwd, ref, path) => {
  try {
    return execFileSync("git", ["show", `${ref}:${path}`], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    return null;
  }
};

// Frontmatter is read with a deliberately small parser rather than a YAML
// dependency: the only fields that matter here are flat scalars, and the
// frontmatter guard already owns the question of whether a block is
// well-formed at all.
function frontmatterVersion(source) {
  if (source == null) return null;
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source.replace(/^﻿/, ""));
  if (!m) return null;
  const v = /^version:[ \t]*(\S+)[ \t]*$/m.exec(m[1]);
  return v ? v[1].replace(/^["']|["']$/g, "") : null;
}

function changelogBody(source) {
  if (source == null) return null;
  const m = /^##[ \t]+Changelog[ \t]*$/m.exec(source);
  return m ? source.slice(m.index + m[0].length) : null;
}

// The version must head a changelog *entry*, not merely appear somewhere in
// the section. Substring-anywhere was the first implementation and it was
// trivially satisfiable: entries here routinely name other versions in prose
// ("reverted from 0.4.0"), so bumping to a version an older entry happens to
// mention passed with nothing added. Checked against all 52 skills before
// tightening — 51 pass, none newly fail. Two skills carry pre-semver history
// in a different shape (`lia-voice-check`, `synthetic-users`); both head their
// *current* entry in the house shape, which is all this looks at.
function changelogNamesVersion(body, version) {
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^[ \t]*[-*][ \t]+\\*{0,2}v?${escaped}\\b`, "m").test(body);
}

// Numeric where it can be, string-inequality where it cannot. A version this
// cannot parse is not silently treated as forward: it falls back to "changed",
// which keeps rule 1 enforced and declines to guess about rule 2.
function compareVersions(a, b) {
  const parse = (v) => {
    const core = String(v).split(/[-+]/)[0].split(".");
    if (core.length === 0 || core.some((p) => !/^\d+$/.test(p))) return null;
    return core.map(Number);
  };
  const pa = parse(a);
  const pb = parse(b);
  if (!pa || !pb) return a === b ? 0 : null;
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

// The three legal moves from a version, and nothing else (LIAB-1184). A bump
// that jumps two patches or skips a minor leaves numbers unused and
// unexplained, and both instances in this repo's history — 1.3.0 -> 1.3.3 and
// 1.19.0 -> 1.21.0 — read as a hand slipping rather than a decision. Requiring
// one step is also what makes the *size* of a bump a claim worth reading: a
// release that may land anywhere above the last one says nothing by landing.
//
// Three components exactly. `1.0 -> 1.1` orders fine under compareVersions but
// has no defined successor, so it is not silently blessed.
function stepFrom(base, head) {
  const b = threePart(base);
  const h = threePart(head);
  if (!b || !h) return null;
  if (h[0] === b[0] && h[1] === b[1] && h[2] === b[2] + 1) return "patch";
  if (h[0] === b[0] && h[1] === b[1] + 1 && h[2] === 0) return "minor";
  if (h[0] === b[0] + 1 && h[1] === 0 && h[2] === 0) return "major";
  return null;
}

function threePart(v) {
  const core = String(v).split(/[-+]/)[0].split(".");
  if (core.length !== 3 || core.some((p) => !/^\d+$/.test(p))) return null;
  return core.map(Number);
}

// What the author should have typed. Null when the base has no successors to
// name, which is its own thing worth saying rather than guessing at.
function nextVersions(base) {
  const b = threePart(base);
  if (!b) return null;
  return { patch: `${b[0]}.${b[1]}.${b[2] + 1}`, minor: `${b[0]}.${b[1] + 1}.0`, major: `${b[0] + 1}.0.0` };
}

// The skills touched by this diff, by directory name. A change anywhere under
// a skill — its references/, its scripts/, its templates/ — is a content
// change to that skill, which is what rule 3 governs.
// The version the base ref is actually serving right now — which is not the
// merge-base's version the moment anyone else lands. Read unconditionally
// (LIAB-1184, review D2): the first cut consulted this only when the step check
// had already failed, so the one shape it could not see was the base taking
// your *exact* number. Then stepFrom succeeds against the stale merge-base, the
// guard returns ok, and the merge delivers a zero net bump — a success that
// proves nothing, in the check written to stop exactly that. Found on the very
// branch that introduced it: main released 1.25.0 while the branch sat at
// 1.25.0, and `ok` is what it printed.
function refVersion(root, ref) {
  try {
    return JSON.parse(git(root, "show", `${ref}:${MANIFEST}`)).version ?? null;
  } catch {
    return null;
  }
}

function touchedSkills(changed) {
  const names = new Set();
  for (const path of changed) {
    if (!path.startsWith(SKILLS_DIR)) continue;
    const rest = path.slice(SKILLS_DIR.length);
    const slash = rest.indexOf("/");
    if (slash > 0) names.add(rest.slice(0, slash));
  }
  return [...names].sort();
}

function checkSkills(root, mergeBase, changed, baseRef) {
  const offences = [];
  for (const name of touchedSkills(changed)) {
    const rel = `${SKILLS_DIR}${name}/SKILL.md`;
    let head;
    try {
      head = readFileSync(join(root, rel), "utf8");
    } catch {
      // No SKILL.md in the working tree: either the skill was deleted, or the
      // directory cannot load at all. The roster guard owns that question and
      // reports it properly; failing here too would just be a second voice
      // saying the same thing in worse words.
      continue;
    }
    const headVersion = frontmatterVersion(head);
    if (headVersion == null) {
      offences.push({ kind: "skill-no-version", file: rel, detail: `changed, but its frontmatter carries no version: field — rule 3 has nothing to move.` });
      continue;
    }

    const base = gitShow(root, mergeBase, rel);
    const baseVersion = frontmatterVersion(base);
    const isNew = base == null;

    if (!isNew && baseVersion === headVersion) {
      offences.push({ kind: "skill-no-bump", file: rel, detail: `content changed but version: is "${headVersion}" on both sides — this ships with a version number that did not move.` });
      continue;
    }
    if (!isNew && baseVersion != null) {
      const direction = compareVersions(headVersion, baseVersion);
      if (direction === -1) {
        offences.push({ kind: "skill-regressed", file: rel, detail: `version: moved backwards, ${baseVersion} -> ${headVersion}.` });
        continue;
      }
      // Same bar as the manifest, and for the same reason (LIAB-1029). The
      // asymmetry this replaces was argued at the time — the manifest is the
      // delivery mechanism, so that is where a bad version does its harm — but
      // the argument got weaker once the code to close it sat three lines
      // away, and an unparseable skill version is a version nobody can order.
      //
      // Known edge: this also fires when the BASE is unparseable and the head
      // is a genuine repair (v0.1.0 -> 0.2.0), because the pair still cannot
      // be ordered. No such base exists on the tree today, and it fails loudly
      // rather than passing silently, which is the right direction to be wrong
      // in. If one ever does, fix the base in its own commit first.
      if (direction !== 1) {
        offences.push({ kind: "skill-unconfirmed", file: rel, detail: `version: cannot be confirmed to move forward, ${baseVersion} -> ${headVersion} — either it does not parse as numeric components, or its numeric core is unchanged while the string differs.` });
        continue;
      }
      // LIAB-1184. A skill's number is read by the sessions holding it —
      // execution-discipline tells an agent the version it holds is the top
      // changelog entry — so a jump here is a gap in a record someone reads,
      // not just untidy arithmetic. `execution-discipline` went 1.2.0 -> 1.8.0
      // in one move under the old rule, and nothing anywhere says what the six
      // skipped numbers were.
      if (stepFrom(baseVersion, headVersion) === null) {
        const next = nextVersions(baseVersion);
        const legal = next ? ` — from ${baseVersion} the legal moves are ${next.patch} (patch), ${next.minor} (minor), ${next.major} (major).` : ` — use a three-component version one step above ${baseVersion}.`;
        offences.push({ kind: "skill-skipped", file: rel, detail: `version: skips a step, ${baseVersion} -> ${headVersion}${legal}` });
        continue;
      }
    }

    // Same question as the manifest's rule 6, asked of a skill (LIAB-1184,
    // review D2). A skill has less protection, not more: two branches bumping
    // it to the same number merge cleanly and only one changelog entry
    // survives, with no ref anywhere recording that the other existed.
    if (!isNew && baseRef != null) {
      const tip = frontmatterVersion(gitShow(root, baseRef, rel));
      if (tip != null && compareVersions(headVersion, tip) !== 1) {
        offences.push({ kind: "skill-taken", file: rel, detail: `version: ${headVersion} is not above what ${baseRef} serves (${tip}) — the base moved and this number is spoken for.` });
        continue;
      }
    }

    const body = changelogBody(head);
    if (body == null) {
      offences.push({ kind: "skill-no-changelog", file: rel, detail: `version: is "${headVersion}" but the file has no "## Changelog" section — the line is what makes the number mean something.` });
      continue;
    }
    if (!changelogNamesVersion(body, headVersion)) {
      offences.push({ kind: "skill-no-changelog-line", file: rel, detail: `version: moved to "${headVersion}" but no ## Changelog entry begins with it — a mention buried in another entry's prose does not count.` });
    }
  }
  return offences;
}

// What a PR shows: merge-base of the base ref and HEAD, against the working
// tree — so the check answers the same question locally with uncommitted
// changes as it does in CI on the PR head.
function check(root, base) {
  let mergeBase;
  try {
    mergeBase = git(root, "merge-base", base, "HEAD");
  } catch {
    return { ok: false, kind: "unreadable", detail: `cannot resolve merge-base of ${base} and HEAD — fetch the base ref first.`, skills: [] };
  }

  const changed = git(root, "diff", "--name-only", mergeBase).split("\n").filter(Boolean);
  const touched = changed.filter((path) => path.startsWith(PLUGIN_DIR));
  if (touched.length === 0) {
    return { ok: true, kind: "untouched", detail: `no lia-tools/ change against ${base}`, skills: [] };
  }

  const skills = checkSkills(root, mergeBase, changed, base);

  let baseVersion;
  try {
    baseVersion = JSON.parse(git(root, "show", `${mergeBase}:${MANIFEST}`)).version;
  } catch {
    // No manifest at the base: the plugin is being introduced, there is no
    // installed version to signal against.
    return { ok: skills.length === 0, kind: "new", detail: `${MANIFEST} does not exist at the merge-base with ${base}`, skills };
  }

  let headVersion;
  try {
    headVersion = JSON.parse(readFileSync(join(root, MANIFEST), "utf8")).version;
  } catch (error) {
    return { ok: false, kind: "unreadable", detail: `${MANIFEST} unreadable in the working tree (${error.message}).`, skills };
  }

  if (baseVersion === headVersion) {
    return { ok: false, kind: "no-bump", detail: `${touched.length} lia-tools file(s) changed but version is "${headVersion}" on both sides`, touched, skills };
  }
  const direction = compareVersions(headVersion, baseVersion);
  if (direction === -1) {
    return { ok: false, kind: "regressed", detail: `version moves backwards, ${baseVersion} -> ${headVersion}`, touched, skills, baseVersion, headVersion };
  }
  // Not provably forward is not good enough for a delivery mechanism. Two
  // shapes land here: a version this cannot parse (`v1.1.0`, `abc`), and one
  // whose numeric core is unchanged while the string differs (1.0.0 ->
  // 1.0.0-beta), which delivers while arguably going backwards. Both used to
  // pass, because the check asked "is it not less?" rather than "is it more?"
  if (direction !== 1) {
    return { ok: false, kind: "unconfirmed", detail: `cannot confirm the version moved forward, ${baseVersion} -> ${headVersion}`, touched, skills, baseVersion, headVersion };
  }
  // 6. AHEAD OF WHAT THE BASE SERVES. Rules 1 and 2 ask whether this branch
  // moved the number; this asks whether the number is still free. They are
  // different questions the moment someone else lands, and only this one
  // survives a race: a head equal to the base ref's version merges without a
  // conflict (both sides wrote the same string), passes every other rule, and
  // delivers nothing. A head *below* it lands a downgrade the same way.
  const tipVersion = refVersion(root, base);
  if (tipVersion != null && compareVersions(headVersion, tipVersion) !== 1) {
    return { ok: false, kind: "taken", detail: `version ${headVersion} is not above what ${base} serves (${tipVersion})`, touched, skills, baseVersion, headVersion, tipVersion };
  }

  // LIAB-1184, and the last of the four to be added because it is the only one
  // that is not about a broken delivery — a skipped version delivers perfectly
  // well. What it breaks is the reading: the size of a bump is a claim about
  // what changed, and a bump free to land anywhere makes no claim at all.
  const step = stepFrom(baseVersion, headVersion);
  if (step === null) {
    // *Why* it is red matters more than that it is red, and the commonest cause
    // is not a typo — it is a base that moved while the branch sat. Then the
    // numbers "skipped" are releases that already happened, and successors
    // computed from the merge-base name one that is already taken. Measured on
    // this rule's own PR within twenty minutes of opening it: main went
    // 1.21.0 -> 1.23.0 mid-review, and advice derived from the fork point said
    // "use 1.22.0", which was gone. Handing someone a taken number is how
    // 1.19.0 -> 1.21.0 happens, so the guard would have been teaching the
    // defect it exists to catch.
    return { ok: false, kind: "skipped", detail: `version skips a step, ${baseVersion} -> ${headVersion}`, touched, skills, baseVersion, headVersion, tipVersion: tipVersion === baseVersion ? null : tipVersion };
  }
  // The size is a claim, so print the claim — for every artifact the guard can
  // see, not just the manifest (review D5). A reviewer reading CI should not
  // have to diff two frontmatter blocks to learn what a skill claimed.
  const names = touchedSkills(changed);
  const sizes = names
    .map((name) => {
      const rel = `${SKILLS_DIR}${name}/SKILL.md`;
      const from = frontmatterVersion(gitShow(root, mergeBase, rel));
      let to = null;
      try { to = frontmatterVersion(readFileSync(join(root, rel), "utf8")); } catch { /* deleted; the roster guard owns it */ }
      const kind = from && to ? stepFrom(from, to) : null;
      return kind ? `${name} ${kind}` : name;
    })
    .join(", ");
  return { ok: skills.length === 0, kind: "bumped", step, detail: `lia-tools ${baseVersion} -> ${headVersion} (${step}), ${touched.length} file(s)${sizes ? ` — ${sizes}` : ""}`, touched, skills };
}

const list = (offences) => offences.map(({ file, detail }) => `  ${file}\n    ${detail}\n`).join("");

function report(outcome) {
  const skills = outcome.skills ?? [];

  if (outcome.ok) {
    console.log(`ok — ${outcome.detail}`);
    return 0;
  }

  if (outcome.kind === "no-bump") {
    console.error(`lia-tools changed with no version bump — this promotion would deliver to nobody:\n`);
    for (const path of outcome.touched) console.error(`  ${path}`);
    console.error(`\n  → Bump "version" in ${MANIFEST} (and the changed skills' version: frontmatter, per CLAUDE.md rule 3).\n`);
  } else if (outcome.kind === "regressed") {
    console.error(`lia-tools version moves BACKWARDS: ${outcome.baseVersion} -> ${outcome.headVersion}\n`);
    console.error(`  A decrease delivers exactly the way an increase does — the served version changed — so every\n  install would silently roll back to an older build with nothing anywhere saying so. This is what a\n  bad conflict resolution looks like, and the guard cannot tell it from a deliberate one.\n`);
    console.error(`  → Set "version" in ${MANIFEST} above ${outcome.baseVersion}.\n`);
    console.error(`  → A genuine rollback is the release force-push in lia-tools/README.md §Roll back, not a lower number on main.\n`);
  } else if (outcome.kind === "taken") {
    const next = nextVersions(outcome.tipVersion);
    console.error(`lia-tools version ${outcome.headVersion} is NOT ABOVE what the base ref serves: ${MANIFEST} is ${outcome.tipVersion} on ${base}\n`);
    console.error(`  Rules 1 and 2 ask whether this branch moved the number. They pass — against the base you forked\n  from. Someone landed since, and this number is spoken for, so merging changes nothing a machine can\n  see: same served version, no fetch, and the repo saying a release happened.\n`);
    console.error(`  → Merge the base branch in, then take one step from ${outcome.tipVersion}:\n`);
    if (next) {
      console.error(`    ${next.patch} (patch: it got better) · ${next.minor} (minor: it does something new) · ${next.major} (major:\n    something that worked stops working)\n`);
    }
    console.error(`  → The policy is lia-tools/README.md §Versioning (CLAUDE.md rule 10).\n`);
  } else if (outcome.kind === "skipped") {
    const stale = outcome.tipVersion;
    const from = stale ?? outcome.baseVersion;
    const next = nextVersions(from);
    console.error(`lia-tools version SKIPS a step: ${outcome.baseVersion} -> ${outcome.headVersion}\n`);
    if (stale) {
      console.error(`  Your base moved. ${MANIFEST} is ${stale} on the base ref, not the ${outcome.baseVersion} this\n  branch forked from, so the numbers in between are releases that already happened — and\n  ${outcome.headVersion} may be taken as well.\n`);
      console.error(`  → Merge the base branch in first. That is the fix, not a workaround: the numbers below are\n    computed from ${from}, and picking one without merging is how a version collides.\n`);
    } else {
      console.error(`  A bump moves exactly one step, so the number stays a record of what the release was. This one\n  leaves the versions between unused and unexplained.\n`);
    }
    if (next) {
      console.error(`  → Set "version" in ${MANIFEST} to ${next.patch} (patch: it got better) · ${next.minor} (minor: it does\n    something new) · ${next.major} (major: something that worked stops working)\n`);
    } else {
      console.error(`  → Use a three-component version exactly one step above ${from} in ${MANIFEST}\n`);
    }
    console.error(`  → The policy is lia-tools/README.md §Versioning (CLAUDE.md rule 10).\n`);
  } else if (outcome.kind === "unconfirmed") {
    console.error(`lia-tools version cannot be confirmed to move FORWARD: ${outcome.baseVersion} -> ${outcome.headVersion}\n`);
    console.error(`  Either it does not parse as numeric components, or its numeric core did not change while the\n  string did. A machine sees only that the served version changed, so it fetches either way — which is\n  the same harm as a decrease, arrived at differently.\n`);
    console.error(`  → Use a numeric version strictly above ${outcome.baseVersion} in ${MANIFEST}.\n`);
  } else if (outcome.kind !== "bumped" && outcome.kind !== "new") {
    console.error(`NOT CHECKED — ${outcome.detail}\n`);
    console.error(`  → The guard could not compare versions, so this change is unverified, not clean.\n`);
  }

  if (skills.length) {
    const of = (kind) => skills.filter((s) => s.kind === kind);
    const nobump = [...of("skill-no-bump"), ...of("skill-no-version"), ...of("skill-regressed"), ...of("skill-unconfirmed"), ...of("skill-taken")];
    const nolog = [...of("skill-no-changelog"), ...of("skill-no-changelog-line")];
    const skipped = of("skill-skipped");
    if (nobump.length) {
      console.error(`Skills changed without their own version moving (${nobump.length}) — CLAUDE.md rule 3, first half:\n`);
      console.error(list(nobump));
      console.error(`  → Bump version: in the skill's frontmatter.\n`);
    }
    if (skipped.length) {
      console.error(`Skills whose version skips a step (${skipped.length}) — CLAUDE.md rule 10:\n`);
      console.error(list(skipped));
      console.error(`  → Move one step. A version nobody can reason from is the thing the number exists to prevent.\n`);
      console.error(`  → If the manifest above reports a moved base, these are the same cause: merge the base branch\n    in and each skill recomputes against what actually landed.\n`);
    }
    if (nolog.length) {
      console.error(`Version bumps with nothing in the changelog (${nolog.length}) — CLAUDE.md rule 3, second half:\n`);
      console.error(list(nolog));
      console.error(`  → Add a "- **<version> (<date>, <ticket>)** — what changed" line under ## Changelog.\n`);
      console.error(`  → Add the line; never sweep an existing one. A dated entry is a record, not prose to update.\n`);
    }
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
  // A well-formed skill: frontmatter version, and a changelog naming it. The
  // fixtures below deform exactly one thing at a time from this.
  const skill = (version, { changelog = version, section = true } = {}) =>
    ["---", "name: demo", "description: fixture", `version: ${version}`, "---", "", "# fixture", ""]
      .concat(section ? ["## Changelog", "", `- **${changelog} (2026-08-28, LIAB-1016)** — fixture.`, ""] : [])
      .join("\n");
  const reset = () => {
    git(dir, "reset", "-q");
    git(dir, "checkout", "-q", "--", ".");
    git(dir, "clean", "-qfd");
  };

  try {
    git(dir, "init", "-q", "-b", "main");
    write("lia-tools/.claude-plugin/plugin.json", manifest("1.0.0"));
    write("lia-tools/skills/demo/SKILL.md", skill("0.1.0"));
    write("README.md", "# fixture\n");
    git(dir, "add", "-A");
    git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "base");
    const baseCommit = git(dir, "rev-parse", "HEAD");
    const rewindTo = (sha) => { git(dir, "reset", "-q", "--hard", sha); git(dir, "clean", "-qfd"); };

    const bump = (v) => write("lia-tools/.claude-plugin/plugin.json", manifest(v));

    const scenarios = [
      {
        name: "skill changed, no manifest bump",
        mutate: () => write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")),
        expect: { ok: false, kind: "no-bump", skills: [] },
      },
      {
        name: "skill changed, everything bumped and changelogged (the must-stay-green control)",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("1.0.1"); },
        expect: { ok: true, kind: "bumped", skills: [] },
      },
      {
        name: "root docs changed only",
        mutate: () => write("README.md", "# fixture, edited\n"),
        expect: { ok: true, kind: "untouched", skills: [] },
      },
      {
        // LIAB-1002. This scenario used to assert green, and its comment read
        // as a considered decision, which is why it survived: "different, not
        // greater — a revert that moves the version backwards still delivers".
        // It does still deliver. That is the bug, not the justification.
        name: "manifest version moves backwards",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("0.9.9"); },
        expect: { ok: false, kind: "regressed", skills: [] },
      },
      {
        name: "manifest made unreadable",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); write("lia-tools/.claude-plugin/plugin.json", "{ not json"); },
        expect: { ok: false, kind: "unreadable", skills: [] },
      },
      {
        // LIAB-1016 finding 1, reproduced from the ticket to the letter: the
        // manifest moves, the skill's own number does not.
        name: "manifest bumped, skill's own version left behind",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.1.0").replace("# fixture", "# fixture, edited")); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-no-bump"] },
      },
      {
        // LIAB-1016 finding 2.
        name: "skill version bumped, no changelog line naming it",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0", { changelog: "0.1.0" })); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-no-changelog-line"] },
      },
      {
        // LIAB-1016 finding 3.
        name: "skill version bumped, no ## Changelog section at all",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0", { section: false })); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-no-changelog"] },
      },
      {
        name: "a skill's own version moves backwards",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.0.9")); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-regressed"] },
      },
      {
        // LIAB-1029 gap 1: the manifest already refused these; a skill did not.
        name: "a skill's own version does not parse",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("v0.2.0")); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-unconfirmed"] },
      },
      {
        name: "a skill's own version changes string but not numeric core",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.1.0-beta")); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-unconfirmed"] },
      },
      {
        // A file beside SKILL.md is a content change to the skill, so rule 3
        // applies to it — this is the shape that would otherwise slip through,
        // since the skill's own file never appears in the diff.
        name: "only a reference file changed, skill version left behind",
        mutate: () => { write("lia-tools/skills/demo/references/lexicon.md", "# edited\n"); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-no-bump"] },
      },
      {
        // The check added alongside the others and, until review caught it,
        // the one with no fixture — a check nobody had watched fail.
        name: "skill changed and its version: field removed entirely",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0").replace(/^version: .*$/m, "")); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-no-version"] },
      },
      {
        // Double-digit minor: the case that made this a real bug on PR #19,
        // and the one a string comparison gets wrong. 1.10.0 is ABOVE 1.9.0.
        name: "1.9.0 -> 1.10.0 is forward, not backward",
        mutate: () => {
          write("lia-tools/.claude-plugin/plugin.json", manifest("1.9.0"));
          git(dir, "add", "-A");
          git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "at 1.9.0");
          write("lia-tools/skills/demo/SKILL.md", skill("0.2.0"));
          bump("1.10.0");
        },
        expect: { ok: true, kind: "bumped", skills: [] },
        rewind: true,
      },
      {
        name: "version string changes but its numeric core does not",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("1.0.0-beta"); },
        expect: { ok: false, kind: "unconfirmed", skills: [] },
      },
      {
        name: "version that does not parse as numeric",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("v1.1.0"); },
        expect: { ok: false, kind: "unconfirmed", skills: [] },
      },
      {
        // The changelog line must HEAD an entry. Naming the new version only
        // inside an older entry's prose is the trivially-satisfiable shape
        // the first implementation allowed.
        name: "new version mentioned only in an older entry's prose",
        mutate: () => {
          write("lia-tools/skills/demo/SKILL.md",
            ["---", "name: demo", "description: fixture", "version: 0.2.0", "---", "", "# fixture", "",
             "## Changelog", "", "- **0.1.0 (2026-08-28, LIAB-1016)** — reverted from 0.2.0 after a bad run.", ""].join("\n"));
          bump("1.0.1");
        },
        expect: { ok: false, kind: "bumped", skills: ["skill-no-changelog-line"] },
      },
      {
        name: "a brand-new skill needs no bump, only a changelog",
        mutate: () => { write("lia-tools/skills/fresh/SKILL.md", skill("0.1.0")); bump("1.1.0"); },
        expect: { ok: true, kind: "bumped", skills: [] },
      },
      // LIAB-1184. The shape this repo actually produced twice, reproduced from
      // its own history: 1.19.0 -> 1.21.0 left 1.20.0 unused, and 1.3.0 -> 1.3.3
      // skipped two patches. Both were green.
      {
        // Review D2, shape 1 — the one the first cut could not see, and the one
        // this branch was sitting in when it printed `ok`. main released the
        // exact number the branch had chosen. There is no merge conflict to
        // warn anyone: both sides wrote the same string.
        name: "the base already released this exact version",
        mutate: () => {
          git(dir, "checkout", "-q", "-b", "collide");
          git(dir, "checkout", "-q", "main");
          write("lia-tools/skills/demo/SKILL.md", skill("0.2.0"));
          bump("1.1.0");
          git(dir, "add", "-A");
          git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "main releases 1.1.0");
          git(dir, "checkout", "-q", "collide");
          write("lia-tools/skills/demo/SKILL.md", skill("1.0.0"));
          bump("1.1.0");
        },
        expect: { ok: false, kind: "taken", skills: [] },
        restore: () => {
          git(dir, "reset", "-q", "--hard"); git(dir, "clean", "-qfd");
          git(dir, "checkout", "-q", "main");
          git(dir, "reset", "-q", "--hard", baseCommit);
          git(dir, "branch", "-qD", "collide"); git(dir, "clean", "-qfd");
        },
      },
      {
        // Review D2, shape 2. Landing this puts a LOWER version on the base
        // than the one it serves — a downgrade delivered to every machine,
        // arrived at by standing still rather than by typing a smaller number.
        name: "the base has moved past this version",
        mutate: () => {
          git(dir, "checkout", "-q", "-b", "behind");
          git(dir, "checkout", "-q", "main");
          write("lia-tools/skills/demo/SKILL.md", skill("0.2.0"));
          bump("1.2.0");
          git(dir, "add", "-A");
          git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "main releases 1.2.0");
          git(dir, "checkout", "-q", "behind");
          write("lia-tools/skills/demo/SKILL.md", skill("1.0.0"));
          bump("1.1.0");
        },
        expect: { ok: false, kind: "taken", skills: [] },
        restore: () => {
          git(dir, "reset", "-q", "--hard"); git(dir, "clean", "-qfd");
          git(dir, "checkout", "-q", "main");
          git(dir, "reset", "-q", "--hard", baseCommit);
          git(dir, "branch", "-qD", "behind"); git(dir, "clean", "-qfd");
        },
      },
      {
        // Review D2, shape 3 — a skill collides while the manifest is entirely
        // legal (2.0.0 is one major step from the fork point and above what the
        // base serves). Nothing about two branches picking the same skill
        // version conflicts; one changelog entry simply disappears.
        name: "a skill's number was taken while the branch sat",
        mutate: () => {
          git(dir, "checkout", "-q", "-b", "skillcollide");
          git(dir, "checkout", "-q", "main");
          write("lia-tools/skills/demo/SKILL.md", skill("0.2.0"));
          bump("1.1.0");
          git(dir, "add", "-A");
          git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "main takes demo 0.2.0");
          git(dir, "checkout", "-q", "skillcollide");
          write("lia-tools/skills/demo/SKILL.md", skill("0.2.0"));
          bump("2.0.0");
        },
        expect: { ok: false, kind: "bumped", skills: ["skill-taken"] },
        restore: () => {
          git(dir, "reset", "-q", "--hard"); git(dir, "clean", "-qfd");
          git(dir, "checkout", "-q", "main");
          git(dir, "reset", "-q", "--hard", baseCommit);
          git(dir, "branch", "-qD", "skillcollide"); git(dir, "clean", "-qfd");
        },
      },
      {
        // The stale-base path, measured live on this rule's own PR within
        // twenty minutes of opening it. main moved 1.0.0 -> 1.2.0 while the
        // branch sat; the branch, having noticed, set 1.3.0 — one step above
        // what actually landed, three above where it forked. Red, and the
        // report must blame the moved base: successors named from the fork
        // point would offer 1.1.0, which main has already used.
        name: "base moved while the branch sat",
        mutate: () => {
          git(dir, "checkout", "-q", "-b", "sidebranch");
          git(dir, "checkout", "-q", "main");
          write("lia-tools/skills/demo/SKILL.md", skill("0.2.0"));
          bump("1.2.0");
          git(dir, "add", "-A");
          git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "main moves to 1.2.0");
          git(dir, "checkout", "-q", "sidebranch");
          write("lia-tools/skills/demo/SKILL.md", skill("1.0.0"));
          bump("1.3.0");
        },
        // `tip` is asserted, not just the kind: without it this fixture is red
        // either way — the base check already returns "skipped" here — and a
        // fixture that cannot tell the fix from the bug is the third failure in
        // CLAUDE.md §Make the check fail on purpose, repeated.
        expect: { ok: false, kind: "skipped", skills: [], tip: "1.2.0" },
        restore: () => {
          git(dir, "reset", "-q", "--hard");
          git(dir, "clean", "-qfd");
          git(dir, "checkout", "-q", "main");
          git(dir, "reset", "-q", "--hard", baseCommit);
          git(dir, "branch", "-qD", "sidebranch");
          git(dir, "clean", "-qfd");
        },
      },
      {
        name: "manifest skips a minor",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("1.2.0"); },
        expect: { ok: false, kind: "skipped", skills: [] },
      },
      {
        name: "manifest skips patches",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("1.0.3"); },
        expect: { ok: false, kind: "skipped", skills: [] },
      },
      {
        // Moving two components at once is the shape that reads as a bump and
        // is not one: 1.1.1 is forward of 1.0.0 by every earlier rule.
        name: "manifest moves a minor and a patch at once",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("1.1.1"); },
        expect: { ok: false, kind: "skipped", skills: [] },
      },
      {
        name: "manifest skips a major",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("3.0.0"); },
        expect: { ok: false, kind: "skipped", skills: [] },
      },
      {
        // The must-stay-green control for the top of the range: a major is a
        // legal step, and this guard must never be the reason nobody takes one.
        // 1.x has held for 26 releases; that should be a decision, not a cage.
        name: "a major bump is one step",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.2.0")); bump("2.0.0"); },
        expect: { ok: true, kind: "bumped", skills: [] },
      },
      {
        name: "a skill's own version skips a step",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("0.4.0")); bump("1.0.1"); },
        expect: { ok: false, kind: "bumped", skills: ["skill-skipped"] },
      },
      {
        // 0.1.0 -> 1.0.0 is a major, which is one step. The pre-1.0 skills are
        // where this matters — a toy reaching production takes exactly this
        // move, and it must not read as a jump.
        name: "a skill going 0.x to 1.0.0 is one step",
        mutate: () => { write("lia-tools/skills/demo/SKILL.md", skill("1.0.0")); bump("1.0.1"); },
        expect: { ok: true, kind: "bumped", skills: [] },
      },
      {
        // Double-digit again, this time as a step rather than an ordering:
        // 0.9.0 -> 0.10.0 is one minor, and an implementation that reasoned
        // about digits rather than numbers would call it a skip.
        name: "0.9.0 -> 0.10.0 is one minor step, not a skip",
        mutate: () => {
          write("lia-tools/skills/demo/SKILL.md", skill("0.9.0"));
          git(dir, "add", "-A");
          git(dir, "-c", "user.email=guard@self.test", "-c", "user.name=guard", "commit", "-qm", "skill at 0.9.0");
          write("lia-tools/skills/demo/SKILL.md", skill("0.10.0"));
          bump("1.0.1");
        },
        expect: { ok: true, kind: "bumped", skills: [] },
        rewind: true,
      },
    ];

    const scenariosNeedingRewind = new Set(scenarios.filter((s) => s.rewind).map((s) => s.name));
    const failures = [];
    for (const { name, mutate, expect, restore } of scenarios) {
      mutate();
      // Intent-to-add, so a *new* fixture file appears in `git diff` the way a
      // committed one does in CI. Without this, the two scenarios that add a
      // file rather than editing one were green because the guard never saw
      // them — a fixture that cannot fail, which is the thing this repo has
      // already been bitten by three times (CLAUDE.md, "Make the check fail on
      // purpose"). It was the self-test that caught it, on its first run.
      git(dir, "add", "-A", "-N");
      const outcome = check(dir, "main");
      if (expect && scenariosNeedingRewind.has(name)) rewindTo(baseCommit);
      // A scenario that moves refs or branches puts them back itself. Without
      // this the fixture leaks into every scenario after it, and the one that
      // needs it (a moved base) is exactly the one whose leak would make later
      // scenarios compare against the wrong main.
      if (restore) restore();
      const kinds = (outcome.skills ?? []).map((s) => s.kind).sort();
      // Kind is asserted, not just ok/red: a no-bump reported as unreadable
      // (or the reverse) is the guard being red for the wrong reason, which
      // is how a deleted core check hides behind a crashing one.
      const tipMismatch = "tip" in expect && (outcome.tipVersion ?? null) !== expect.tip;
      if (outcome.ok !== expect.ok || outcome.kind !== expect.kind || String(kinds) !== String([...expect.skills].sort()) || tipMismatch) {
        const tipSaid = "tip" in expect ? `, tip ${outcome.tipVersion ?? "not detected"} (wanted ${expect.tip})` : "";
        failures.push(`  ${name}: expected ${expect.ok ? "green" : "red"}/${expect.kind}/[${expect.skills}], got ${outcome.ok ? "green" : "red"}/${outcome.kind}/[${kinds}]${tipSaid} (${outcome.detail})`);
      }
      reset();
    }

    if (failures.length) {
      console.error("self-test FAILED");
      for (const line of failures) console.error(line);
      return 1;
    }
    console.log(`self-test ok — ${scenarios.length} scenarios: no-bump caught, backwards-bump CAUGHT (manifest and skill), not-provably-forward caught on BOTH (unparseable, and a changed string with an unchanged core), skill-version-left-behind and a removed version: caught, a changelog line that only heads an entry accepted (prose mentions rejected), 1.9.0 -> 1.10.0 confirmed forward, SKIPPED STEPS CAUGHT on both (a skipped minor, skipped patches, a minor-and-patch at once, a skipped major, a skill jumping, and a base that moved under the branch), A TAKEN NUMBER CAUGHT on all three shapes (an exact collision, a base moved past, and a skill's number gone) while a major, a 0.x -> 1.0.0 and 0.9.0 -> 0.10.0 stay green, bump-and-changelog and root-only and new-skill left green, unreadable manifest reported as unchecked`);
    return 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const baseFlag = process.argv.indexOf("--base");
const base = baseFlag !== -1 ? process.argv[baseFlag + 1] : "origin/main";
process.exit(process.argv.includes("--self-test") ? selfTest() : report(check(REPO_ROOT, base)));
