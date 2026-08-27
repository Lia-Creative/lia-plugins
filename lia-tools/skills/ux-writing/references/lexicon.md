# The Lia action lexicon

**One action, one word, everywhere.** This is the file that makes the product feel like
one product. Before you write a label, look here. If the action isn't here, add it — the
last section says how.

Status: seeded 27 Aug 2026 from the strings already shipping in `lia-toy-box`, plus the
Apple verdicts in `apple-distilled.md`. Everything not marked below is either already in
the product or is Apple's rule, which we've adopted.

---

## 0. Not settled — do not treat these as house rules

These rows are this skill's suggestion and **have not had a founder's yes.** Each one is
marked inline as well, because a table row gets read on its own far more often than a
file's header does — an agent greps for a verb, finds a row, and ships it.

| Row | What's open | Who decides |
|---|---|---|
| **Show Details** (§1) | Whether the disclosure control is called *Show Details*, and whether Lia wants that pattern at all rather than keeping the detail in the log. `patterns.md` §3 leans on it in the meantime. | Chris |

Use a proposed word if you need one — but say in the PR that you did, and don't cite this
file as the reason. Settling a row means Chris says yes, the marker comes off, and the
changelog says when.

---

## 1. The verbs

| The action | The word | Never |
|---|---|---|
| Put something into the box / a list | **Add** | Create (unless it makes a new thing from nothing), New, Insert, Import |
| Make a new thing that didn't exist | **New** | Create (in a label — "New Toy" beats "Create Toy") |
| Take something out, reversibly | **Remove** | Delete |
| Destroy something, irreversibly | **Delete** | Remove, Erase, Purge, Destroy, Trash (as a verb) |
| Undo the last thing | **Put It Back** | Undo, Revert, Restore *(the product's own phrase — keep it)* |
| Start a job | **Run** | Execute, Process, Go, Start (reserve *Start* for things with a duration) |
| Stop a job in progress | **Stop** | Abort, Kill, Terminate, Halt, Cancel *(Cancel belongs to dialogs)* |
| Back out of a dialog or an ask | **Cancel** | Dismiss, Nevermind, Close, No |
| Close a view without deciding anything | **Close** | Dismiss, Exit, OK |
| Finish and leave a flow | **Done** | Finish, Complete, OK, Save & Close |
| Move forward one step in a flow | **Continue** | Next, Proceed, Onward *(pick one per flow; **Continue** is the house default)* |
| Open a flow from its front door | **Get Started** | Begin, Start Now, Let's Go |
| Try a failed thing again | **Check Again** | Retry, Try Again, Refresh *(when re-checking a state)* |
| Turn a setting on or off | **Turn On** / **Turn Off** | Enable, Disable, Activate, Deactivate |
| Attach an account or service | **Connect** / **Disconnect** | Link, Unlink, Authorise, Revoke |
| Get into the product | **Sign In** / **Sign Out** | Log in, Log out, Login (a noun), Sign up *(use **Create Account**)* |
| Choose from a menu or a list the system offers | **Choose** | Select, Pick |
| Mark a thing you already see | **Select** | Choose, Check, Tick, Highlight |
| Give it a new name | **Rename** | Edit name, Change name |
| Send words back to us | **Send Feedback** | Submit, Report, Contact Us |
| Look at something in more detail | **Show Details** — **NOT SETTLED: proposed only, no founder's yes. Don't cite this row as house style.** (see §0) | More info, Details…, Expand, Learn More |
| Go to a thing's own screen | **Open** | View, Go To, Launch |
| Keep changes | **Save** | Apply, Commit, Update, Confirm |

**Pairs stay paired.** If you use one half, use the other half's word for the reverse:
Add/Remove · Turn On/Turn Off · Connect/Disconnect · Sign In/Sign Out · Open/Close ·
Run/Stop · Save/Cancel.

## 2. The nouns

The product's own words. Written exactly like this, in copy and in code comments, so the
vocabulary doesn't fork.

| The thing | The word | Notes |
|---|---|---|
| The desktop shell every toy runs in | **the box** — capitalised as **Toy Box** when it's the app's name | Not "the app", not "the shell", not "the container" |
| One tool inside the box | **a toy** | Becoming *tool* at the line level — copy follows the product's own naming when that lands |
| One execution of a toy's job | **a run** | Not "a job", not "a task", not "a process" |
| A recorded conversation with a person | **an adventure chat** | Discovery vocabulary; rarely in UI |
| The person using it | **you** | Never "the user" in copy. Never "we" for the product |

Any product with its own vocabulary (Held has one — see
`lia-voice-check/references/lia-voice.md`) layers it on top of this table, and its words
win inside its own surfaces.

## 3. Gestures and surfaces

- **Toy Box is a Mac app.** People **click**. Never "tap", never "press" for something
  onscreen — *press* is a physical button.
- **lia.tools is a website**, reached from both. Prefer naming the target and skipping the
  gesture entirely — "Choose a Photo" works on every device; "Tap Choose a Photo" is wrong
  on half of them.
- A **dialog** is a dialog to a person. Never "modal", never "sheet", never "dialog box".
- A control that can't be used right now is **dimmed**, not "greyed out" or "disabled" —
  and if you find yourself explaining why it's dimmed in a tooltip, consider whether it
  should be there at all.

## 4. Words we don't use

Beyond the never-ship list in `patterns.md`:

**Developer vocabulary**: execute, abort, kill, terminate, invalid, illegal, null,
parameter, config, endpoint, sync failure, payload, instance, initialise, native.

**Corporate vocabulary**: leverage, empower, seamless, transformative, utilise, robust,
unlock, supercharge, effortless, delight (as a verb), journey (for using a product).

**Filler**: simply, just, easily, quickly, actually, really — if the thing is easy, the
interface shows it; saying it is easy when it isn't is the fastest way to lose someone.

**AI vocabulary in the interface**: AI-powered, smart, intelligent, magic, powered by.
The product principle is AI invisible, outcomes in front — the copy names what the person
gets, never the machinery.

## 5. Adding to the lexicon

When you need an action that isn't here:

1. Check the product for a word already in use — `grep` the strings before you invent one.
2. Check whether Apple has a verdict (`apple-distilled.md` §2, or the Style Guide itself).
3. Pick the plainest verb that names the result, and write both halves of the pair.
4. Add the row here **and** a line in §0, both marked *NOT SETTLED*, in the same PR as the
   copy that needed it. The row's own cell has to say it — §0 alone isn't enough, because
   a row gets read on its own.
5. Say so in the PR description — a lexicon that grows silently is a lexicon nobody trusts.

The point of this file isn't to be complete. It's that when two screens disagree about
what an action is called, there is somewhere to go and settle it.
