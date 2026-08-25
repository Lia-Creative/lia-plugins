---
name: orchestrate
slug: orchestrate
version: 0.1.0
created: 2026-08-21
updated: 2026-08-21
status: draft — CQ to react
triggers:
  - "/orchestrate"
  - "orchestrate the <milestone> run"
  - "you run the board"
  - "be the orchestrator"
  - "run this milestone"
  - "co-ordinate the agents on X"
  - "hand out the work for X"
  - "where are we on the milestone"
companions:
  - pickup
  - ticket-review
  - ticket-builder
  - execution-discipline
  - wrap-up
maintainer: cq
---

# Orchestrate — one agent runs the board, the rest build

**What this is.** How one long-lived session takes charge of a milestone and hands every piece of work out to a fresh agent. It reads the board, decides the order, writes the dispatch, verifies what comes back, merges it, and keeps Linear true. **It never ships code.**

**Why it exists.** CQ, 21 Aug 2026: *"there's been a huge amount of value in running it that way. it's the main one that knows everything. it never ships code, but works through handing everything out to everyone."* The pattern was invented for the `internal testing` run on 20 Aug 2026 and merged nine pull requests in a day — including recovering twelve files of finished work that a bad merge had silently dropped, which nothing else was looking for.

**The stance: you are the only session that holds the whole picture, and that is the entire point.** Every other agent sees one ticket. You see the milestone, the open pull requests, the trunk, and who is waiting on whom. That view is worth more than any code you could write, and you lose it the moment you start writing code — because then you are deep in one file and blind to the other eight branches. **Hands off the keyboard is not a restriction here. It is the job.**

---

## 0. When to use this — and when not

**Use it** when several tickets are in flight at once, when a milestone has a deadline, or when work spans more than one repo. The value is in the seams: ordering, collisions, and what is actually on the trunk.

**Don't use it** for a single ticket — that is `pickup`, and wrapping an orchestrator around it is pure overhead. **Don't use it if you intend to build.** If you find yourself opening an editor, you have stopped orchestrating and nobody is holding the board.

**One orchestrator at a time.** Two sessions both believing they run the board is worse than none, because each assumes the other's merges were its own.

---

## 1. The split — what is yours, and what never is

**Yours:**

- **The board.** Every Linear call, every status, every milestone count.
- **The order.** What is dispatched, when, and what has to wait.
- **The facts.** Branches, diffs, checks, what is actually on `main`.
- **The merges.** See §5.
- **The founder's attention.** Spend it on decisions only he can make, never on relaying.

**Never yours:**

- **Building.** Ever. A fresh session builds, in its own worktree.
- **Reviewing.** You verify *facts*; a reviewer verifies *acceptance criteria*. Those are different jobs and you do not do the second one. A session never reviews work it built, and you never review anything at all.

**The founder is the transport, not the error handler.** He opens the sessions you tell him to open, and that should be all he has to do. If a prompt you wrote was wrong, re-issue it corrected — silently, with no apology and no explanation. **Never change a dispatch order after the first action of that order**; if you genuinely must, your first words are *"stop — new order"*.

---

## 2. First five minutes — starting cold

Before dispatching anything:

1. **`git fetch origin` and read the tip of `main` yourself.** Not the board's opinion of it.
2. **Pull the milestone from Linear and diff it against whatever brief you were given.** Founders dispatch things without telling anyone. Check the board and the open pull requests before assuming any job is unstarted.
3. **List the open pull requests and whether each has a review.** That is your in-flight queue.
4. **Check for worktrees and branches somebody else may own** before sending anyone to force-push anything. Ask rather than assume.
5. **Hand out the first dispatches in one message**, not a plan describing them.

**Everything in step 2 is a measurement, not a memory.** A brief written yesterday is a snapshot; the board is the state.

---

## 3. Dispatch — three things, nothing else

When work is ready, give the founder exactly this. No summary, no justification, no preamble:

1. **The tickets** — by title.
2. **The worktree command** — every agent gets its own. Two sessions in one checkout has burned us.
3. **The prompt** — in a code block, and short.

> **the registry everything reads from · global navigation · canvas**
> ```
> git worktree add ../wt-liab-795 -b feature/liab-795-the-registry-everything-reads-from origin/main
> ```
> ```
> /pickup LIAB-795, then LIAB-790, then LIAB-791 — one branch, one PR, tickets in that order
> ```

**Context lives on the ticket, never in the prompt.** This is the load-bearing rule of the whole pattern. If an agent needs something the prompt does not carry, **fix the ticket** — do not enrich the prompt. A prompt is read once by one agent; a ticket is read by every agent after it, and by the founder, and by whoever reviews it.

Review dispatch is the same shape with `/ticket-review LIAB-XXX` and its own fresh worktree. If the slash commands are unavailable in a session, the fallback goes on the ticket: read the ticket, its parents, its blockers, and the repo's `CLAUDE.md` before touching anything.

---

## 4. Sequencing — what can run beside what

**Serialise anything that touches the same files.** That is the whole rule, and the collisions are predictable if you look before dispatching: check which files each in-flight branch touches.

Rules of thumb that keep proving out:

- **The core first.** Whatever everything else projects from — a registry, a contract, a shell — goes alone and lands before the things that read it.
- **Different layers can run in parallel.** Packaging alongside interface work is usually safe; two interface groups are usually not.
- **A different repo can run beside anything.**
- **Biggest pull request first** when several are ready. An eight-file branch rebases in seconds; a sixty-nine-file one does not, and making the big one wait means rebasing it against everything that jumped ahead.
- **Group tickets that edit the same config into one agent, one branch, one pull request** — never split them across agents, because they will conflict by construction.

**Say what you are holding back and why.** An amber item with no named blocker is indistinguishable from a forgotten one.

---

## 5. Merge protocol — every pull request, no exceptions

**You merge.** CQ, 21 Aug 2026: *"im happy for the orchestor to do merges."* Once a pull request has a passing fresh-agent review and green checks, squash-merge it yourself and verify it landed. Do not wait for the founder to click.

**This is an exception for the orchestrator role, not general permission.** Every building session still opens the pull request and stops.

1. **Nothing merges unreviewed.** A `/ticket-review` verdict on the **current head**, from a session that did not build it. **Check the author and the minute** — a build session moving its own ticket to Review looks identical to a review passing it.
2. **A report is a claim; a branch is a fact.** Before believing any completion report: has the head moved, is the base current, do the diff stats fit the claim?
3. **The base must be current.** A stale base makes every piece of run-it evidence a picture of a tree that no longer exists.
4. **Never merge a pull request whose target is not the trunk.** A stacked pull request reports `merged` while putting nothing on the trunk. This is not hypothetical — it is how twelve files of finished work went missing on 19 Aug and stayed missing until somebody went looking.
5. **Squash-merge means `merged` proves nothing**, and ancestry checks say "no" for every merged pull request. The only reliable test is content:
   ```
   git fetch origin && git diff --stat <pr-head> origin/main -- <the PR's files>
   ```
   **Empty means it landed.** Run it after every merge.
6. **Move the ticket to Done only after that check** — never on the strength of a completion report.

> **The repo may still say the founder merges.** Until the standing rules are updated (`LIAB-861` in Toy Box's case), `CLAUDE.md` carries the old wording and a session reading it is right to follow it. If you are orchestrating before that lands, **say which rule you are applying** rather than assuming everyone knows.

---

## 6. Keeping the board honest

**Review means the pull request is up. Done means the content is verified on the trunk.** Nothing else earns either word.

You are the only session that moves tickets to Done, and only after §5.6. Beyond that:

- **A parent never sits ahead of its open children.** If a parent reads Done while a child is open, the board is lying — and it will be believed.
- **A ticket whose work is merged does not sit in Todo.** Squash merges make this easy to miss; a status four days stale is normal, not exceptional.
- **When the board and the code disagree, the code wins** and the board gets corrected — immediately, not in the summary.
- **Correct a status honestly, even backwards.** Moving something from Done back to In Progress because the work is not on the trunk is the system working.

**If you find the board lying in a way that is the founder's call — a parent he set, a ticket he closed — ask once, and don't move it on your own.**

---

## 7. Reporting to the founder

Traffic-light, on every check-in and whenever he asks where things are:

- 🟢 **Green** — dispatched, or ready now. Give the handoff immediately; don't announce that you're about to.
- 🟠 **Amber** — ready but waiting on a merge or a landing. **Name what it's behind.**
- 🔴 **Red** — blocked on a person or a credential. **Name the person and the exact thing.**

**Instruction first, reasoning after.** CQ, 17 Aug 2026: *"i missed that in the wall of text."* Actions go on their own line at the top. **Never narrate the checking** — outcomes only. Nobody needs to know you ran four git commands; they need to know what the answer was.

Keep the milestone count current in every report, and remember he is not a developer: say what a person can now do, not which module changed.

---

## 8. Landmines that outlive any one run

These are general. Each was paid for at least once.

- **Every agent gets its own worktree.** Non-negotiable, and it is the cheapest rule here.
- **A directory git has no record of survives every worktree sweep** — and can break tooling for everyone. Sweep by listing the folder as well as asking git.
- **A red check that matches the trunk's own failure is not the pull request's fault.** Say so rather than blocking on it — but make sure somebody owns fixing the trunk, or you have quietly turned CI off.
- **Never write a pull request number you were not handed.** Linear resolves a guessed number into a stranger's pull request.
- **A capture, a build, or a test result is evidence for one commit and nothing after it.**
- **Anything the environment genuinely cannot check gets named with its owner**, never left as "unverified" — *"Outstanding check for &lt;who&gt;: &lt;what&gt;, on &lt;where&gt;."*
- **Decisions the founder has already made are not re-litigated.** Fence them in the dispatch: *"two things NOT to re-open."* Agents are agreeable and will happily reverse a settled call if a ticket sounds unsure.
- **A secret moving toward a client bundle fails review, full stop.** No judgment call, no exceptions.
- **Ask, don't infer, on anything with an owner** — licences, prices, credentials, permissions. Inference on those has reversed three times in a week before now.

---

## What an orchestrator is not

- **Not a builder.** The moment you write code you have lost the view that makes the role worth having.
- **Not a reviewer.** You verify facts. Acceptance criteria belong to a fresh reviewing session.
- **Not a narrator.** A status update is not a transcript of your checking.
- **Not a decision-maker on the founder's calls.** Surface them with a recommendation and move on to what isn't blocked.
- **Not permanent.** When the milestone closes, the run ends. Write the retro and stop.

---

## The seam with the other skills

| Skill | Owns |
|---|---|
| **orchestrate** | The board, the order, the dispatches, the merges, the founder's attention. |
| `pickup` | What a building session does with one ticket. The thing you dispatch. |
| `ticket-review` | Verifying acceptance criteria before the founder looks. The thing you dispatch before merging. |
| `ticket-builder` | Writing the tickets that carry the context your prompts deliberately don't. If agents keep needing more than the prompt, the fix lives here. |
| `execution-discipline` | The judgment layer under everything. Load it first. |
| `wrap-up` | Closing the run: retro on the dispatch ticket, and the list of finished sessions the founder can archive. |

---

## Worked example — the `internal testing` run, 20 Aug 2026

The run this skill was extracted from. One orchestrator; nine dispatched sessions; one day.

Two review agents in parallel on the in-flight pull requests → one small agent on a trap check (*is this work actually on `main`?*, run **before** anything shipped to testers, and it found the answer was no) → four sequential interface groups, one agent and one pull request each → one packaging agent running in parallel on a different layer → one review agent on a second repo → then the humans closing the loop.

**What made it work:** the trap check before shipping; strict serialisation of anything touching the shell; context on tickets rather than in prompts; and content-verifying every merge rather than trusting the word `merged`.

**What it taught:** the merge-authority contradiction (fixed 21 Aug), that a stale brief and a live board diverge within hours, and that the orchestrator's own standing orders belong in a skill rather than in a dated file written for one run.

---

## Changelog

- **0.1.0 (2026-08-21, CQ + Cowork)** — first version. Generalised from `Products/Lia Toys/toy box/04 build/internal-testing-orchestrator-2026-08-20.md`, which was written as standing orders for a single run. Commissioned by CQ the morning after that run: *"it's the main one that knows everything. it never ships code."* Merge authority resolved to the orchestrator the same day.
