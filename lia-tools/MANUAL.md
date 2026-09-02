# Lia Tools — The Manual

**For everyone at Lia. Read this before you install anything.**

Lia Tools is a plugin for Claude Code. It gives an AI agent the whole Lia build
process — how a piece of work is discovered, designed, built, reviewed, tested
and shipped — as 73 skills it can load and run.

You do not memorise the process. You install the plugin, and the process is
already in the room.

**Manual version 1.2 · Plugin version 1.28.0 · 2 September 2026**

> **Hit a word you don't know?** Section 13 defines the five that matter —
> worktree, frontmatter, squash merge, Given/When/Then, CI. Nothing else in here
> assumes you have seen it before.

---

## Contents

1. [What Lia Tools Is](#1-what-lia-tools-is)
2. [Start Here](#2-start-here)
3. [Install Lia Tools](#3-install-lia-tools)
4. [Your First Session](#4-your-first-session)
5. [How the Build Process Works](#5-how-the-build-process-works)
6. [How the Agent Teams Work Together](#6-how-the-agent-teams-work-together)
7. [How Work Gets Reviewed and Merged](#7-how-work-gets-reviewed-and-merged)
8. [How a Change Reaches Your Machine](#8-how-a-change-reaches-your-machine)
9. [Where to Send Feedback](#9-where-to-send-feedback)
10. [The Feedback Loops](#10-the-feedback-loops)
11. [Change a Skill Yourself](#11-change-a-skill-yourself)
12. [Changelog](#12-changelog)
13. [Words This Manual Uses](#13-words-this-manual-uses)
14. [Where Everything Lives](#14-where-everything-lives)

---

## 1. What Lia Tools Is

### In One Sentence

Lia Tools is the Lia build process, written down in a form an AI agent can run.

### The Problem It Solves

Before Lia Tools, the process lived in people's heads and in a vault that build
machines could not reach. Every session started by re-explaining how Lia writes
a ticket, what "ready" means, and who is allowed to merge. Every explanation
came out slightly different.

Now there is one copy. You install it, and any agent you talk to holds the same
standard you do.

### What You Get

Seventy-three skills, grouped into benches. A bench is a team: one lead that
decides and routes, and the specialist seats that do the work.

| Bench | What it covers | Seats |
|---|---|---|
| **Discovery** | Problems, jobs, epics, stories, tasks, the ready gate | 14 |
| **Research** | Evidence gathered and cited — problems, competitors, patterns, tech | 13 |
| **Toys** | The Lia Toys product line's own process | 9 |
| **Design** | Reference, exploration, flows, hi-fi screens, error states, the words | 8 |
| **Engineering** | Architecture, acceptance criteria, build prep, review and merge, security | 7 |
| **Judgment and recon** | Screen capture, teardown, voice, decisions, the discipline every seat loads first | 7 |
| **Build** | The builder's seat, polish, pickup, and the wrap-up that writes the report | 4 |
| **QA** | Test plans, cases, the hostile pass, bug filing | 5 |
| **Management** | The project manager, the marketplace's own seat | 2 |
| **Category standards** | What a whole class of tool is held to, whatever the story is | 1 |
| **Pointers** | `orchestrate`, `lead-engineer` and `product-retro` — superseded names kept as signposts so older tickets and handovers still resolve | 3 |

The full roster, seat by seat, is in
[`lia-tools/README.md`](README.md#whats-in-it).

### What It Is Not

- **Not a chatbot.** It is a set of instructions Claude Code loads when the
  moment calls for one.
- **Not the process itself.** The process lives in Linear, in
  [How we build tools](https://linear.app/lia-creative/document/how-we-build-tools-4a9cfacc41c8)
  and its sibling documents. The skills point at those documents; they do not
  restate them.

  **There is one order of precedence, and it runs the same way the whole way
  down:** the Linear process documents beat the skills, and the skills beat this
  manual. Each layer describes the one above it and never overrules it. So a
  skill that disagrees with the Linear documents is a skill to fix, and a
  paragraph here that disagrees with a skill is a paragraph to fix — including
  every paragraph in this file.
- **Not something you have to use all of.** Most people touch four or five
  skills. The other sixty-seven are there for the agent to reach for.

---

## 2. Start Here

Three steps, about ten minutes.

1. **Install the plugin.** See [Install Lia Tools](#3-install-lia-tools).
2. **Run one skill.** See [Your First Session](#4-your-first-session).
3. **Send back what you found.** See
   [Where to Send Feedback](#9-where-to-send-feedback).

Step 3 is not politeness. The plugin improves from the sessions that use it, and
a session nobody reports on teaches nothing.

### Which Parts Are Yours

You do not need to be technical to use Lia Tools. You do need to know which jobs
are yours, so you can hand the rest on rather than get stuck.

| Section | Who does it |
|---|---|
| **3 · Install**, on the CLI or desktop app | You. Two commands. |
| **3 · Install**, for a cloud or web session | Anyone comfortable opening a pull request on that repository. If that is not you, ask — it is a five-minute job for someone who is. |
| **3 · Check which version you have** | Ask your Claude session to run it. You do not have to type it yourself. |
| **4 · Your first session** | You. |
| **5, 6, 7 · The process, the teams, the reviews** | Nobody "does" these — they describe what the agents already do. Read them to know what to expect. |
| **8 · Promotions and rollbacks** | Whoever holds the plugin-manager seat. Ask for a promotion; you do not run it. |
| **9 · Feedback** | You, and this is the part that matters most. |
| **11 · Changing a skill** | Anyone, including you — a skill is a Markdown file. The commands in it are copy-and-paste. |

---

## 3. Install Lia Tools

Lia Tools installs differently depending on where you run Claude Code. Find your
surface below.

### Before You Begin

You need two things:

- **Claude Code**, on whichever surface you use.
- **Access to the `Lia-Creative` organisation on GitHub.** The marketplace is
  served from a repository in it. If `/plugin marketplace add` fails saying it
  cannot find the repository, that is what is missing — ask Chris, rather than
  retyping the command.

### On the CLI or Desktop App

Do this once per machine.

1. Add the marketplace:

   ```
   /plugin marketplace add Lia-Creative/lia-plugins
   ```

2. Install the plugin:

   ```
   /plugin install lia-tools@lia-plugins
   ```

3. Restart your session.

To update later, run both commands by hand:

```
/plugin marketplace update lia-plugins
claude plugin update lia-tools@lia-plugins
```

> **Important:** Run those two by hand every time. Auto-update does not deliver
> on a CLI or desktop machine, even with every setting switched on. The desktop
> app manages its own binary, so it sets `DISABLE_AUTOUPDATER=1` in the session
> environment, and the plugin update pass stops there — before it reads the
> marketplace's own auto-update flag. This was measured on 28 August 2026: a
> machine sat on version 1.6.1 against a released 1.8.0 with both settings
> correct. Switching the toggle on costs nothing and is right if the gate ever
> moves. Pull by hand anyway.

### For a Cloud or Web Session

**You do not install anything in the session. You add it to the repository.**

Sessions started from claude.ai/code or the mobile app have no `/plugin`
command — there is no command to run and nothing to type. They get Lia Tools
only when the repository they open asks for it, so this is a one-off change to
that repository, made once by anyone, and every later session on it benefits.

1. Open the repository you work in, on your own machine.
2. Check whether `.claude/settings.json` exists and contains this:

   ```json
   {
     "extraKnownMarketplaces": {
       "lia-plugins": {
         "source": { "source": "github", "repo": "Lia-Creative/lia-plugins" },
         "autoUpdate": true
       }
     },
     "enabledPlugins": { "lia-tools@lia-plugins": true }
   }
   ```

3. If it does not, copy the working version from
   [`.claude/settings.json`](../.claude/settings.json) in this repository. Only
   the marketplace name and the plugin name matter.
4. Commit it the way that repository takes any other change — a branch and a
   pull request. It changes the behaviour of every future session on the
   repository, so it is reviewed like anything else.

Once it lands, every cloud session on that repository arrives with the plugin.

> **Note:** Cloud and web sessions provision fresh at the start of every session,
> so they always run the version currently being served. They are the one
> surface that is genuinely up to date without you doing anything — which also
> means "it worked in my cloud session" tells you nothing about your laptop.

### In Cursor

Cursor reads the same skills through a layout of its own.

- **In this repository**, they are already there: [`.cursor/skills/`](../.cursor/skills/)
  is a real-file copy of `lia-tools/skills/`, kept in step by a script.
- **In any other repository**, import Lia Tools as a team marketplace:
  Dashboard → Plugins → Add Marketplace → Import from Repo →
  `https://github.com/Lia-Creative/lia-plugins`. Point the marketplace at the
  `release` branch so Cursor follows the same promotions Claude Code does. Mark
  it Required if every agent on every repository should arrive with the roster.

Copying `.claude/settings.json` does nothing for Cursor. They are separate paths.

### Check Which Version You Have

Ask your session to check. From a clone of this repository:

```
node scripts/check-plugin-freshness.mjs
```

It finds Claude Code's install (the `installed_plugins.json` registry and
`~/.claude/plugins`) **and** a Cursor install under `~/.cursor/plugins` —
cache and/or marketplace clone — and answers one of three ways:

| Result | Meaning | What to do |
|---|---|---|
| **Current** | Your install matches what is being served. | Carry on. |
| **Stale** | You are behind. | Run the two update commands above. |
| **Unchecked** | It could not find your install, or found copies on both sides of the release. | Treat your version as unverified. Do not assume you are current. |

`Unchecked` has its own result on purpose. "I could not find your install" must
never read as "you are fine". A Cursor-only machine is a real install; the
script looks under `~/.cursor/plugins` for it.

> **Note:** An agent cannot read its own version number directly — the plugin's
> frontmatter is not passed to it. What it can read is the top entry of a skill's
> own changelog, which is the version it was served. This matters more than it
> sounds: on 29 August 2026 an agent was handed the version of a skill from
> before a merge an hour earlier, and the rules it was dispatched to follow were
> invisible to it.

---

## 4. Your First Session

Here is the shortest useful thing you can do with Lia Tools.

1. Open Claude Code in a repository you work in.
2. Type:

   ```
   /lia-tools:ticket-builder
   ```

3. Describe a piece of work in your own words. A sentence is enough.
4. Read what comes back.

You will get a Linear ticket in the house shape: a plain title with no numbers,
a goal written as a job, numbered acceptance criteria in Given/When/Then form,
delivery checks, and an explicit statement of what is out of scope.

That is the whole idea. You brought a sentence; the standard was already there.

### Skills Worth Knowing by Name

| Type this | When |
|---|---|
| `/lia-tools:pickup` | You are about to start work on a single ticket. |
| `/lia-tools:ticket-builder` | You need a ticket, an epic or a story written properly. |
| `/lia-tools:build` | You are building something and want the builder's discipline. |
| `/lia-tools:review-and-merge` | A pull request is up and needs reviewing. |
| `/lia-tools:wrap-up` | You are finishing a session. It writes the After Action Report. |
| `/lia-tools:toy-pickup` | You are starting any session on the Lia Toys line. |

You do not have to type any of them. Skills also trigger on plain language —
"write me a ticket for this", "pick up LIAB-1181", "wrap up". Typing the name is
just faster when you know what you want.

---

## 5. How the Build Process Works

Work moves through six stages. Each stage has an owner, and each hands on only
when a gate says it can.

```
Discovery  →  Design  →  Build  →  Review  →  QA  →  Done
     ↑                                                  ↓
     └──────────── Research, commissioned by any stage ──┘
```

| Stage | What happens | The gate out of it |
|---|---|---|
| **Discovery** | The problem is named, the job behind it mapped, and the work written as an epic with stories and tasks. | `ready-review` — a fresh agent that did not write the tickets grades them on five checks. |
| **Design** | Reference gathered, directions explored, flows walked, screens drawn on the design system, error and empty states swept, the words written. | The design lead confirms every step of every flow is covered before the engineer preps the build. |
| **Build** | Acceptance criteria frozen, build notes written, then one agent builds in its own worktree and opens a pull request. | `ticket-review` asks one question before dispatch: could an agent start this without asking anything? |
| **Review** | A different agent grades the work against every acceptance criterion by index, with evidence. | Every criterion disposed of, on the current head, by someone who did not write it. |
| **QA** | The merged build is tested as a person will meet it — planned cases first, then a deliberately hostile pass. | The quality report. Findings become Bug tickets on the feature epic. |
| **Done** | The project manager moves it, on the QA verdict. | — |

**Research runs sideways, not in sequence.** Any stage can commission it. A
question goes to the research lead, comes back as a corpus of cited sources, and
becomes an insight a story can point at. Nothing in a Lia ticket is meant to rest
on someone's recollection.

### Two Things That Are Always True

- **Context lives on the ticket, never in the prompt.** A prompt is read once. A
  ticket is read by every agent that touches the work afterwards. If an agent
  needs something the ticket does not carry, the ticket gets fixed first.
- **Done means evidence.** A report is a claim; a branch is a fact. No stage
  accepts "it works" without something checkable behind it.

---

## 6. How the Agent Teams Work Together

This is the part most worth understanding, because it is what makes the output
trustworthy rather than merely fast.

### The Shape

Every bench has the same shape:

- **A lead** that holds the whole picture, decides what happens next, and routes
  the work. The lead **never does the work itself**.
- **Seats** that do one thing each, well, and hand back.

There are seven leads: discovery, design, engineering, research, testing, the
project manager, and the plugin manager.

### Why the Lead Never Produces

This is the rule the whole system rests on, so it is worth saying plainly.

**A lead can judge because a lead does not produce.** The moment a lead writes
the code, it has disqualified itself from reviewing the code. A fix the lead
could make in a minute goes back to the builder as feedback, not as a commit.

The same rule, stated from the other side: **no agent grades work it produced.**
Not because a self-review would be dishonest, but because it cannot see what it
did not think of.

Freshness here is about **context**, not about people. When a lead needs a fresh
pair of eyes, it spawns a new agent, which has its own empty context and
satisfies the rule on its own. The lead hands that agent the ticket numbers and
the rubric — never its own reading of them. A conclusion passed down arrives
pre-formed, and you have spent a fresh context to hear your own opinion back.

### The Project Manager Is the Traffic

The project manager does not do stage work. It passes tickets between the stage
leads on gate verdicts, keeps every status true, and writes the updates a human
actually reads.

Three things it does that are easy to miss:

- **It spawns agents itself.** A dispatch is something the session does, not a
  command block handed to a person to paste.
- **It checks nobody already holds the ticket** — the board, the branches, the
  worktrees and the open pull requests — before dispatching anyone. On 29 August
  2026 two live sessions held the same worktree because this check was skipped.
- **It stops for exactly three things**: a credential it cannot hold, a founder
  decision, and a machine that is not ours. Everything else it routes.

### The Chain, End to End

When the engineering lead is pointed at a goal, it runs all six beats without
coming back to a human in between:

| # | Beat | Who runs it |
|---|---|---|
| 1 | **Gate** — is this ticket actually startable? | A fresh agent |
| 2 | **Build** | One agent per epic or story, in its own worktree |
| 3 | **Review** | A different agent — one that did not build it |
| 4 | **Feedback** | Back to the same builder, whose context is intact |
| 5 | **Re-review** | The same reviewer, on the new head |
| 6 | **Merge** | The lead, after checking the content actually landed |

The chain ends in one of two places: the final report, or a wall it names out
loud. There is no third. Ending a turn with a beat still running abandons the
chain just as surely as asking permission does — and more dangerously, because it
does not look like a hand-off to anyone.

### A Worked Example

A bug is reported in a toy.

1. **You** file it, or `bug-writer` shapes it into a Bug ticket on the feature
   epic: symptom title, steps to repeat with real inputs, expected against
   actual, evidence attached.
2. **The project manager** sees it on the board and checks nobody holds it.
3. **The engineering lead** is dispatched. It runs `ticket-review` on the ticket
   — could an agent start this without asking anything? If not, the ticket gets
   fixed before anyone is dispatched.
4. **A build agent** picks it up in its own worktree, fixes it, opens a pull
   request, and stops.
5. **A second agent** reviews it against each acceptance criterion, with a
   verdict, an evidence tier and a falsifiability note for each one.
6. **The engineering lead** merges, then verifies the content actually landed —
   not that GitHub said "merged".
7. **The testing bench** tests the merged build, runs a hostile pass over it, and
   writes the quality report.
8. **The project manager** moves the ticket on that verdict.

Eight steps, and the only human in them is the one who reported the bug.

---

## 7. How Work Gets Reviewed and Merged

### One Ticket, One Pull Request

Every change starts as a Linear ticket and lands as one pull request. No ticket,
no pull request.

### The Review

A review is not a read-through. It grades **every acceptance criterion by index**,
and gives each one three things:

- **A verdict** — `met`, `not met`, or `cannot check`.
- **An evidence tier** — what was actually observed, and how directly.
- **A falsifiability note** — what would have shown this to be wrong.

`cannot check` is a real verdict, never rounded up to `met`. But it is not a
place to rest: it has to take one of three exits — get the access and run the
check, hand it back, or take it to the founder as a named gap. A review that
returns `cannot check` on everything with an honest note attached is still a
review that has not disposed of anything.

`not met` has no exits at all. It hands back, and it is disposed of only when the
fix lands and the same reviewer passes it on the new head.

**One review per head.** Before grading anything, a reviewer checks whether that
exact commit already carries a verdict. If it does, it is not reviewed cold a
second time — the only way onto it is the same reviewer who graded it before.
Two cold reviews of one commit cost two contexts and, measured over five days in
late August, disagreed with each other four times in ten.

### Who Merges

**Any lead, in its own lane. Never their own work.**

Reviewing and landing is part of what a lead *is*, not a permission one person
holds. The engineering lead lands engineering work, the design lead lands design
work, the plugin manager lands skill changes.

What no lead may do is land something it produced. That rule is what the seat
costs, not its fine print.

There is one declared exception, and it is worth being blunt about what it is:
**it genuinely breaks the rule above.** It is not a clarification or a special
case that turns out to be consistent — a lead using it has signed off something
it wrote. That is exactly why it is the narrowest thing in the rules, why it must
be declared in writing, and why it says out loud what it fails to certify.

It applies only when **no session holding any lead seat could be started or
reached** before the work had to land. That bar is high: a fresh session counts
as a lead, and any lead can start one, so a second lead is nearly always
available. A lane having only one seat is not the bar and never was.

In that case a lead who reviewed a change in its own lane may land the repair
that review found. Three conditions come with it:

1. **The repair only.** Never new work.
2. **Declared twice** — in the pull request body, and as a comment on the ticket.
   The body is read once; the ticket is the record an audit can find.
3. **The declaration names four things:** what it built, what it reviewed, which
   leads it tried and could not reach, and what the sign-off therefore does not
   certify.

What it certifies is that the criteria were checked and the landing verified.
What it does not certify is independence — nobody who did not write the change
has read it. That is a gap in the roster, not a property of the work, and the
next lead into that lane re-reads it.

### Merged Is Not Landed

A squash merge reports success whether or not your content arrived. The only
landing test is content:

```
git fetch origin && git diff --stat <pr-head> origin/main -- <the PR's files>
```

Empty means it landed. Run it after every merge. A ticket leaves Review only
after that check.

---

## 8. How a Change Reaches Your Machine

**Merge lands. Promotion ships.** These are two separate events, and the gap
between them is the whole point.

```
   PR merged to main  ──────►  reaches nobody
                                    │
                          someone promotes
                                    │
                                    ▼
   release branch moves  ──────►  machines can now update
                                    │
                          you run the two commands
                                    │
                                    ▼
                                you have it
```

- **`main`** is where work lands.
- **`release`** is what every machine actually runs.

The promotion is one command, from any clone:

```
git fetch origin && git push origin origin/main:release
```

Rollback is one command back:

```
git fetch origin && git push --force-with-lease origin <last-good-sha>:release
```

The stop between a bad merge and the whole team is the reason this exists. The
`release` branch is deliberately left unprotected so the rollback stays one
command; `main` is the opposite, and requires a pull request.

> **Important:** A version bump is what makes a promotion deliver. Machines only
> fetch when the version number changes, so a promotion without a bump ships to
> nobody while the repository insists it shipped. CI fails any pull request that
> changes the plugin without one.
>
> And a promotion is not delivered until someone has pulled it and invoked a
> changed skill. Reading it is not proving it.

---

## 9. Where to Send Feedback

**One route: a ticket on the Lia Tools project, Lia Build team, in Linear.**

[linear.app/lia-creative/project/lia-tools](https://linear.app/lia-creative/project/lia-tools-0ffde7990ded)

That is where every skill change, bug and improvement in this plugin already
lives, so a report filed there lands next to its own history.

### What to Send

Anything. Genuinely — a skill that did the wrong thing, a step that did not make
sense, a rule that got in your way, a thing you expected to exist and did not.
"This felt wrong and I can't say why" is a useful ticket.

### What Makes a Report Actionable

The bar the whole company set for a bug report: **nobody should need to ask you a
follow-up question before they can try to reproduce it.**

So include:

| Include | Example |
|---|---|
| **Which skill** | `ticket-builder` |
| **What you did** | "Typed `/lia-tools:ticket-builder` and described a bug in Drip." |
| **What you expected** | "A Bug ticket on the Drip epic." |
| **What happened instead** | "A story on the wrong project, with no acceptance criteria." |
| **Evidence** | Paste the output, or a screenshot. |
| **Which version** | Ask your session for the top entry of the skill's changelog. |

The version line matters more than it looks. Half the confusing behaviour in this
plugin's first month was an agent running a skill from before the fix.

### If You Are Not Sure It Is Worth a Ticket

File it. The rule this repository runs on is:
**a gap you find and do not fix becomes a ticket, not a paragraph.** Three gaps
recorded in READMEs in a single day were invisible to everyone until someone
went looking.

---

## 10. The Feedback Loops

Lia Tools is built to learn from being used. There are five loops, and they run
at different speeds.

| Loop | Runs when | What it produces |
|---|---|---|
| **The After Action Report** | Every session, without exception | One report as a comment on the ticket the session worked: what was intended, what actually happened, why they differed, what to sustain, what to improve. Every seat writes one — builder, reviewer, gate, lead, PM. A routine session's is one line per section with honest "none"s; padding is the failure, not brevity. The next session on that thread reads it before starting. |
| **The QA loop** | After every merge | Findings become Bug tickets on the feature epic, filed in one shape, deduplicated, so the lane that built the work sees them in context. |
| **The improvement loop** | Every run of every skill | Each After Action Report carries a `Skill change proposed:` line naming what the skill it ran got wrong or left it guessing, addressed to that seat's lead, who raises the pull request. *None* is an answer; silence is not. |
| **The founder walkthrough** | When Chris records a walkthrough of a build | The stage gate first, then the record, then tickets attached to the exact frames the feedback is about. |
| **The jam** | When decisions have piled up that need a human conversation | One agenda from every open item, and afterwards the decisions written back into strategy docs and Linear. |

### Where You Fit

The first two run whether you do anything or not. The third now runs on every
session too — but it only catches what an *agent* noticed. **If a skill got
something wrong for you, say so.** A person's confusion is the one signal no
agent's report contains.

> **Note:** The improvement loop went from two benches to every seat on 2 September
> 2026 ([LIAB-1163](https://linear.app/lia-creative/issue/LIAB-1163/the-improvement-loop)),
> and the per-session retro became the After Action Report the day before
> ([LIAB-1162](https://linear.app/lia-creative/issue/LIAB-1162/after-action-reports)).
> Both are new. **An automatic loop that has run for a day is not yet a loop you
> should rely on** — section 9 still matters, because a person noticing is the
> path with a track record.

---

## 11. Change a Skill Yourself

You do not need to be an engineer. A skill is a Markdown file.

### Before You Start

**Edit skills in `lia-tools/skills/<name>/SKILL.md` only.** Older copies exist —
in the vault, and as standalone skills on claude.ai — and they are frozen. Editing
one of those is editing a copy that goes nowhere.

### The Steps

1. **Open a ticket** on the Lia Tools project. One ticket, one pull request.
2. **Branch** from `main`.
3. **Edit the skill** at `lia-tools/skills/<name>/SKILL.md`.
4. **Bump the skill's `version:`** and add a line to its changelog saying what
   changed and why. The changelog line is what makes the number mean something —
   version numbers in this repository have lied before.
5. **Bump the plugin version** in `lia-tools/.claude-plugin/plugin.json`. Without
   this, your change reaches nobody.

   **How big?** Take the smallest bump that is true, and move exactly one step.

   | | |
   |---|---|
   | **patch** | It got better — a fix, a tweak, wording. **Most changes.** |
   | **minor** | It does something new — a skill added, retired, or given a new job. |
   | **major** | Something that worked stops working. |

   Nothing else is legal: move **exactly one step** from whatever the plugin is
   on now — the patch digit up by one, or the minor up by one with the patch
   back to zero, or the major up by one with both back to zero. If the guard says your number is already served,
   somebody released while you were working — **merge `main` in and take one
   step from what they landed**, rather than reaching for a bigger number. The
   full policy, and why it exists, is `lia-tools/README.md` §Versioning.
6. **Sync the Cursor copy** if you touched anything under `skills/`:

   ```
   node scripts/sync-cursor-skills.mjs
   ```

7. **Run the guards** before you push:

   ```
   node scripts/check-skill-frontmatter.mjs --self-test
   node scripts/check-skill-frontmatter.mjs
   node scripts/check-skill-roster.mjs
   node scripts/check-version-bump.mjs
   ```

   These three, plus step 6's sync, are the four CI jobs that can block your
   pull request. The fifth, `freshness`, runs only its own self-test and cannot
   block you.

8. **Open a pull request.** A lead reviews it and lands it. Never land your own.
9. **Ask for a promotion** once it is merged, or it stays on `main` and reaches
   nobody.

### Two Rules That Will Trip You Up

**No angle brackets in a skill's frontmatter.** Write placeholders as `[name]`,
never `<name>`. One placeholder in one description made an entire release
uninstallable on a whole surface in August 2026. The surface that enforced it is
gone; the rule stays, because the guard is free to run and re-learning it is not.

**Every skill needs a `description:`.** It is what a session's skill listing
shows and what auto-triggering matches on. A skill without one is invisible to
real sessions — proved, not theorised.

### The Habit Behind the Guards

This repository has a rule earned the expensive way, four times in one week:

> **A check nobody has watched fail is a check nobody knows works.**

A rule written in prose passed every check and shipped a broken release. Its
guard's first self-test printed "ok" with the guard's core check deleted. Its
test fixture was red whether the bug was present or not. And two green guards
both passed a skill directory that could not load — because one walks *for* the
file that was missing, and the other counts changed paths.

So: break your check deliberately and watch it go red before you trust it green.
That is what `--self-test` is for, and why CI runs it before the real check.

And ask what a check **cannot see** before believing what it says. A guard's blind
spot is never in what it checks. It is in the shape of what it enumerates.

---

## 12. Changelog

Every version of Lia Tools that has been served to a machine, newest first. The
ticket number in each row is where the reasoning lives.

| Version | Date | What changed |
|---|---|---|
| **1.28.1** | 2 Sep 2026 | The freshness detector looks under `~/.cursor/plugins` as well as Claude Code's tree, so a machine with a real Cursor install is no longer reported as having none. (LIAB-1168) |
| **1.28.0** | 2 Sep 2026 | One versioning policy for the plugin, the tools and the toolbox: take the smallest bump that is true, move exactly one step, and never let a promotion pick the digit. Before this, nothing said how *big* a bump should be, so habit answered — 21 minors in 26 releases, a wording fix priced like a new bench of skills. CI now also refuses a number the base already serves, which it caught it repeatedly on its own branch. (LIAB-1184) |
| **1.27.0** | 2 Sep 2026 | This manual. The plugin got a document written for a person rather than for an agent, and `plugin-manager` got the rule that keeps it true. (LIAB-1181) |
| **1.26.0** | 2 Sep 2026 | Dispatch and hygiene: a dead session's work is salvaged by rule rather than abandoned, every worktree is accounted for, and a red that is not yours gets named as one. Plus the Cursor mirror's self-test now actually exercises the sync, so it can go red. (LIAB-1165, LIAB-1169) |
| **1.25.0** | 2 Sep 2026 | One review per head, not two. A commit that already carries a verdict is never cold-reviewed again, a base-only move gets a re-check rather than a fresh review, and a landing goes through the pull request. Measured: ten of twenty-three tickets had been reviewed cold twice on the same commit, and four of those pairs disagreed. (LIAB-1164) |
| **1.24.0** | 2 Sep 2026 | The improvement loop reached all seven leads. Every seat now ends its report by naming what the skill it ran got wrong; before this, two benches out of seven did. (LIAB-1163) |
| **1.23.0** | 2 Sep 2026 | The close-out became one After Action Report on the ticket — intended against actual, the gap and why, sustain and improve — replacing five different retro shapes and, on eight tickets, none at all. (LIAB-1162) |
| **1.22.0** | 2 Sep 2026 | `lead-engineer` became `engineering-lead`, so the seat is named by its discipline like the other four leads. A pointer stays for one release so older tickets still resolve. (LIAB-1161) |
| **1.21.0** | 1 Sep 2026 | Cursor can load the roster. `.cursor/skills/` became a real-file copy of the skills, because Cursor does not follow symlinks into a skills tree. **No ticket** — landed as [PR #41](https://github.com/Lia-Creative/lia-plugins/pull/41) with no LIAB number, the only released version without one. |
| **1.19.0** | 1 Sep 2026 | Recorded that the `release` branch stays unprotected on purpose, so rollback stays one command. (LIAB-994) |
| **1.18.0** | 31 Aug 2026 | What the orchestration chain's first real run taught: a lead must block on each beat rather than backgrounding it, an agent must be able to tell which version of a skill it holds, and re-dispatching a quiet agent is how two sessions end up in one worktree. (LIAB-1051, LIAB-1052, LIAB-1053) |
| **1.17.0** | 30 Aug 2026 | The bug shape got one home — a Linear document every intake points at, instead of each skill carrying its own version. (LIAB-967) |
| **1.16.0** | 29 Aug 2026 | The research bench and the QA bench landed: 13 research seats and 5 testing seats, each with a lead that never does the work itself. (LIAB-1023, LIAB-1024) |
| **1.15.0** | 29 Aug 2026 | `cannot check` stopped being a resting place. It now has three exits and no fourth, and a review that disposes of nothing no longer clears a merge. (LIAB-1046) |
| **1.14.0** | 29 Aug 2026 | A lead runs its own chain by spawning agents rather than handing a person commands, and a reviewer grades each criterion on verdict, evidence tier and falsifiability. (LIAB-1044, LIAB-1045) |
| **1.13.0** | 28 Aug 2026 | `doc-iteration-loop` and `decision-check` joined the roster. (LIAB-1028) |
| **1.12.0** | 28 Aug 2026 | Established that auto-update does not deliver on CLI or desktop machines, and why. (LIAB-1030) |
| **1.11.0** | 28 Aug 2026 | Every skill now owes a provenance row saying where it came from and what it superseded — 34 of 52 had none. (LIAB-1003) |
| **1.10.0** | 28 Aug 2026 | The guards got stricter: all of the version rule enforced, a misnamed skill caught, a backwards version refused. (LIAB-1016, LIAB-1002) |
| **1.9.0** | 28 Aug 2026 | Any lead can approve and merge in its own lane — it is the job, not a permission. The queue had twice stalled on one seat. (LIAB-1025) |
| **1.8.0** | 28 Aug 2026 | The skills follow the folder — a sweep onto the Lia Tools project. (LIAB-1020) |
| **1.7.0** | 28 Aug 2026 | Standards and schemas land in code as the work happens, not afterwards. (LIAB-1008) |
| **1.6.1** | 28 Aug 2026 | "Show Details" settled as house style, and it comes with "Hide Details". (LIAB-1004) |
| **1.6.0** | 28 Aug 2026 | The toys line got a design stage, and sibling skills stopped routing through the vault. (LIAB-1006, LIAB-963) |
| **1.5.0** | 28 Aug 2026 | `ux-writing` landed whole — the copy half of the design bench, on Apple's mechanics and Lia's voice. (LIAB-1004) |
| **1.4.0** | 27 Aug 2026 | `design-reference` — the vault's swipe file became a design seat. (LIAB-1000) |
| **1.3.3** | 27 Aug 2026 | Six skills joined: the four everything else depended on, and a shaping pair taken out of Chris's personal bundle. (LIAB-997, LIAB-996) |
| **1.3.0** | 27 Aug 2026 | The other benches arrived — leads for discovery and design, the marketplace's own seat, and a project manager that routes between the stages. (LIAB-995) |
| **1.2.4** | 27 Aug 2026 | Documented what actually turns auto-update on, surface by surface. (LIAB-987) |
| **1.2.3** | 27 Aug 2026 | The retirement migration was watched working on a real machine, rather than trusted from a docs page. (LIAB-989) |
| **1.2.2** | 27 Aug 2026 | **Merge lands, promotion ships.** The `release` branch became what machines run, so a bad merge no longer reaches the team automatically. (LIAB-986) |
| **1.2.1** | 26 Aug 2026 | Angle-bracket placeholders removed from skill frontmatter. One of them had made 1.2.0 uninstallable on a whole surface. (LIAB-959) |
| **1.2.0** | 26 Aug 2026 | The toys nine, the design pair, `design-handoff` and `execution-discipline` landed. (LIAB-921) |
| **1.1.0** | 26 Aug 2026 | Tool shop 1.1 — every seat filled, and stories moved to the Given/When/Then shape (see section 13). (LIAB-950, LIAB-949) |
| **1.0.0** | 26 Aug 2026 | The plugin exists, and this repository became the source of truth for its skills — canonical moved out of the vault, because a vault build machines cannot mount is a poor distribution channel. (LIAB-919, LIAB-920) |

> **Note:** 1.21.0 in the row above is the last version this manual did not ship
> with. Everything from 1.22.0 down landed on 2 September while this manual was
> in review — which is exactly the drift `plugin-manager` rule 9 exists to catch,
> arriving before the rule had shipped.
>
> Version numbers 1.3.1, 1.3.2 and 1.20.0 were never served — each was
> superseded on its own branch before it could be promoted. 1.20.0 says so in its
> own commit: *"PR #43 took 1.19.0. Rebase + re-bump so version-bump CI can
> pass."* None of the three appears anywhere in the history of either `main` or
> `release`. The rows above are the versions that actually reached machines.

### Two Things That Were Retired

- **The standalone `ticket-builder` plugin** (26 Aug 2026) — superseded by Lia
  Tools, which carries `ticket-builder` and the seats it routes to.
- **The `squeaks` plugin** (26 Aug 2026). The
  [Squeaks scaffold template](https://github.com/Lia-Creative/squeaks) is a
  separate thing and is unaffected.

Both were left in the marketplace as migration entries, so an existing install
migrates cleanly instead of breaking.

---

## 13. Words This Manual Uses

Five terms appear above that are worth ten seconds each.

| Term | What it means here |
|---|---|
| **Worktree** | A second working copy of a repository, checked out to its own folder, so two agents can work on different branches at the same time without treading on each other. Every build agent gets its own. Two sessions sharing one is a real failure that has happened here. |
| **Frontmatter** | The block at the very top of a skill file, between two `---` lines, holding its name, description, version and triggers. It is what the skill *listing* shows and what auto-triggering matches on — which is why an error there breaks a skill that reads perfectly well below it. |
| **Squash merge** | Merging a pull request by collapsing all its commits into one on the target branch. Because the content is rewritten rather than replayed, GitHub reporting "merged" does not prove your changes arrived — hence the content check in section 7. |
| **Given / When / Then** | The shape every acceptance criterion is written in. *Given* the starting state, *when* someone does a thing, *then* this is true. It forces a criterion to be decidable — you can tell whether it passed. |
| **CI** | Continuous integration: the checks GitHub runs automatically on every pull request. For this plugin that is **five** jobs — `frontmatter`, `version-bump`, `roster`, `cursor-skills-mirror` and `freshness`. You see all five on the pull request page. Four of them can block your PR; `freshness` only runs its own self-test, because what it actually answers is an agent's question — *which copy of these skills am I holding?* |

---

## 14. Where Everything Lives

| You want | It is here |
|---|---|
| **The roster** — every skill and what it is for | [`lia-tools/README.md`](README.md#whats-in-it) |
| **The rules an agent follows in this repository** | [`CLAUDE.md`](../CLAUDE.md) |
| **Which copy of a skill won, and why** | [`lia-tools/AUDIT.md`](AUDIT.md) |
| **Installing anything from the marketplace** | [`README.md`](../README.md) |
| **The publish, promote and rollback commands** | [`lia-tools/README.md`](README.md#how-a-change-publishes) |
| **The process itself** | [How we build tools](https://linear.app/lia-creative/document/how-we-build-tools-4a9cfacc41c8) in Linear |
| **What a ticket looks like** | [How a Lia Toys ticket is shaped](https://linear.app/lia-creative/document/how-a-lia-toys-ticket-is-shaped-a5d28e39709b) |
| **What a bug report carries** | [What a reported bug carries](https://linear.app/lia-creative/document/what-a-reported-bug-carries-ff781e0d6b8a) |
| **The board** | [Lia Tools project](https://linear.app/lia-creative/project/lia-tools-0ffde7990ded), Lia Build team |

---

## Keeping This Manual True

This manual is maintained by the `plugin-manager` seat, which also runs the
merges and the promotions. A change that makes a section of this file wrong
updates it in the same pull request, and a promotion carries its changelog row.

If you find something here that does not match what the plugin actually does,
**the plugin is right and this manual is wrong** — that is the bottom rung of
the precedence named in section 1, not a separate rule. File it on the Lia Tools
project and it gets fixed.

The one thing this manual is never wrong about is your own experience of it. If a
section did not make sense, that is a defect in the section, whatever the section
technically says. Report it the same way.
