# Gate rubric — <doc name>

> Instance of `[this skill]/templates/gate-rubric.md` (installed: `${CLAUDE_PLUGIN_ROOT}/skills/doc-iteration-loop/templates/gate-rubric.md`). The reviewer loads ONLY this file + the ticket + the drafted section. Rubric changes happen between iterations with founder sign-off — never mid-run.

**Sources of truth:** <the distillation doc> (through-lines) · each ticket\'s acceptance criteria + quality metric · <the founder\'s annotated pages> for calibration.

## Tier 1 — mechanical (run first; grep settles these)

| # | Check | How |
| --- | --- | --- |
| M1 | <banned term or framing> absent | grep "<term>" |
| M2 | Required blocks present per section | headings scan |

## Tier 2 — judgment (reviewer persona)

**Persona:** <e.g. a sharp brand strategist reading cold> — calibrate on the founder\'s own annotations at <path>.

| # | Check | Source |
| --- | --- | --- |
| J1 | <doc-level read> | <through-line> |

Always in addition: the ticket\'s own acceptance criteria (tick each) and its quality metric (state how the draft meets it, or why it fails).

## Verdict format

`PASS` or `REVISE`, then findings, most severe first:

- **[M# / J#] <what>** — where (section) · suggested one-line fix

Escalation: 3 REVISE loops without a pass -> mark the ticket **flagged** in the execution order, comment the open findings on the ticket, move on. Never soften a check to get a pass.
