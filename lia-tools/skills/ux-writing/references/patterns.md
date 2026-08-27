# The pattern library

One entry per surface. Each gives the **shape**, the **rules**, and worked examples in
Lia's own words. Write from here; `apple-distilled.md` is the reasoning underneath.

Examples marked *(shipped)* are real strings from `lia-toy-box` — the house patterns
already exist in the product, and several of them are good. Where a shipped string is
listed as wrong, it is wrong today and worth fixing.

---

## 1. Action labels — buttons, links, menu items

**Shape:** a verb, or verb + object. Title case. No ending punctuation. One to three
words; four is the ceiling.

- The label says what happens **after** the press, not what the screen is.
- Same action, same word, every time — check `lexicon.md` before inventing one.
- `…` at the end is a promise that something further opens ("Choose a Photo…"). Nothing
  opens, no ellipsis. Never three dots.
- A link says where it goes: "Learn About Versions", never "Learn More" floating alone,
  never "Click Here" — screen readers read links out of context.
- Icon-only controls still need words: the accessible label is real copy, held to this
  same rule.

| Write | Not | Why |
|---|---|---|
| Add a Toy | Add a toy *(shipped)* | House case rule |
| Put It Back | Undo | The product's own word for it, and it says what happens |
| Send Feedback | Submit | Submit is a form's word, not a person's |
| Check Again | Retry / Try again | Plain, and it's what the person is doing |
| Choose a Photo… | Choose a Photo | The picker opens; the ellipsis says so |
| Turn On Notifications | Enable Notifications | *Turn on* acts now; *enable* is developer framing |

## 2. Destructive confirmations

**Shape:** alert title that names the consequence · one line of informative text only if
it adds something · a specific verb on the destructive button · always "Cancel" on the
other.

- Confirm only what is **uncommon and unrecoverable**. If it's routine and undoable, do
  it and offer "Put It Back" — a confirmation on an undoable action trains people to
  press through confirmations.
- The destructive button is the verb: "Delete", "Erase", "Remove", "Stop". Never "OK",
  never "Yes"/"No" — "OK" can't tell the difference between agreeing and understanding.
- Don't explain the buttons in the text. If the buttons need explaining, the buttons are
  wrong.
- Title as a fragment → title case, no full stop. Title as a question → sentence case,
  question mark.

```
Delete this run?                          ← sentence case, it's a sentence
The files it moved stay where they are.   ← only because it adds something
[Cancel]  [Delete]                        ← verb, not OK
```

## 3. Failures and errors

**Shape:** what happened, in the person's terms · what is true about their stuff · the way
forward. Present it next to the thing that failed. An error is never a notification.

The house pattern is already in the product and it is a good one: **name the failure
plainly, then say nothing was lost.** Keep it.

| Write | Not |
|---|---|
| Couldn't reach Lia just now. *(shipped)* | We're having trouble connecting |
| Something went wrong. Nothing was lost. *(shipped)* | Oops! An unexpected error occurred |
| Restarting takes a second. Nothing you've done is lost. *(shipped)* | Please wait while the application restarts |
| That folder is full. Choose another folder, or clear some space. | Not enough room. *(shipped — true, but it stops before the way out)* |
| Couldn't send that. Check Again. | Edge Function returned a non-2xx status code *(shipped — a system string reaching a person)* |
| Use only letters for your name. | Invalid name |

- No blame, no "you didn't", no "invalid".
- No "Oops", "Uh-oh", "Sorry", no exclamation marks.
- No "we" — the product isn't a committee having a hard time.
- **No raw system text, ever.** Status codes, exception names, `undefined`, `null`,
  stack fragments and library messages are for the log. If the underlying detail matters
  to support, put it behind a **Show Details** disclosure, not in the sentence — the
  control reads **Hide Details** once it's open.
- If a single message can't rescue the situation, the message isn't the problem — the
  interaction is. Raise it rather than writing a better apology.

## 4. Empty states

**Shape:** one line saying the space is empty and why that's normal · one line of what to
do · a control that does it, where one exists.

- Empty states are temporary. Never put information here that someone will need after
  they've filled the space.
- No hard sell, no exclamation, no mascot.

```
No toys yet.                                          (shipped)
When a toy is promoted to your group it turns up here. (shipped — says why, no action needed)

Nothing in the box yet.                               (shipped)
Pick a toy and it turns up in the strip above.        (shipped — points at the next move)
[Add a Toy]
```

## 5. Waiting — progress, running, long jobs

**Shape:** name what is happening in the person's terms, and where you can, how much is
left. Say what's safe to do meanwhile.

- Say the work, not the machinery: "Reading your library", not "Initialising worker".
- Counts beat spinners when you have them: "208 copied · 4 skipped · 0 missing"
  *(shipped)* is exactly right — plain, countable, no adjectives.
- If a job can be left alone, say so once: "You can close this — it keeps running."
- If it stopped early, say so without drama: "A run stopped early · nothing was added"
  *(shipped)*.

## 6. Permission and access asks

**Shape:** what you want access to · what the person gets for it · asked at the moment it
is needed, not at first launch.

- Ask when the feature is first used, unless the product cannot function without it — in
  which case the ask belongs inside first run, with the reason attached.
- Say the benefit in their terms, once. No pleading, no second ask after a no.
- "Toy Box is in testing. Signing in is how we know which toys to show you." *(shipped)*
  is the shape: the state of the world, then why the ask exists.

## 7. Settings and toggles

**Shape:** a label that names the thing · a description that says what happens **when it's
on**.

- Describe the on state only. People infer the off state; saying both doubles the words
  and halves the clarity.
- Label practically enough to be found by someone scanning: name over cleverness.
- To send someone to a setting, link or button them there. Never describe the route.

```
Open at Login
Toy Box starts when you sign in to your Mac.
```

## 8. Fields and validation

**Shape:** every field labelled · hint text that shows the format · errors beside the
field, phrased as instruction.

- Hint text is an example ("name@example.com") or a plain description ("Your name") —
  and it never replaces the label.
- Validation says how to succeed: "Choose a password with at least 8 characters", not
  "That password is too short".
- Validate when someone has finished, not on every keystroke.

## 9. Notifications

**Shape:** a title worth reading at a glance · a body in complete sentences · no errors,
ever.

- Title: title case, no ending punctuation, and only if it adds context beyond the app
  name. A generic title is worse than none.
- Body: sentence case, complete sentences, full stop. Don't truncate — the system does.
- Never assume the screen is private. Nothing sensitive in a preview.
- Don't send the same thing twice, and don't instruct someone to go and do something in
  the app — they won't be holding the sentence by the time they get there.

## 10. First run

**Shape:** the shortest possible path to the person doing the thing.

- Teach by letting them do it. A tip beside the control beats a carousel in front of it.
- Skippable, and never shown again once skipped — findable later if they want it.
- "Get Started" opens a flow, "Continue" or "Next" moves through it, "Done" closes it.
  Pick one set and hold it across the whole product.

## 11. Success and completion

**Shape:** state the result. Stop.

- "Filed 12 files." — not "Success!", not "All done! 🎉".
- The strongest confirmation is usually the interface itself changing; a toast that adds
  nothing is noise.
- Where a result can be walked back, that's the moment to offer it: "Put It Back".

---

## The never-ship list

Any of these in a user-facing string is a defect, not a preference:

1. Raw system or library text (status codes, `undefined`, `null`, exception names,
   "non-2xx", "Failed to fetch", ENOENT).
2. "Oops", "Uh-oh", "Whoops", "Sorry".
3. "Please" in instructional text.
4. "We", "we're", "our" as the product's voice.
5. "Invalid", "illegal", "forbidden", "failure" aimed at the person.
6. "Are you sure?" as an alert title — say what will happen instead.
7. "Click here", or a bare "Learn More" as the whole link.
8. "Error" as a title on its own, and any error number shown without words.
9. Exclamation marks in errors, and mostly everywhere else.
10. American spelling — the product is Australian English.
