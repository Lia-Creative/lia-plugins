# Per-ticket prompts — doc iteration loop

> Copy-paste skeletons for the three roles. Keep the contexts separate: the reviewer never sees the drafting conversation.

## Draft

    Read, in order: the `execution-discipline` skill · <execution-order instance> ·
    Linear ticket <KEY-NNN> (live, with relations) · <distillation doc> · <current doc section(s)> ·
    the house-style refs the ticket names.

    Job: draft the "<section>" section of <doc> to the ticket's acceptance criteria. One job —
    respect Scope / non-goals. Strategy stays at the 12-month level; tactics point to the 90-day plan.
    Write into <working file>; do not touch other sections. Set the execution-order status to "drafted".

## Review (fresh context — subagent or second session)

    You did not write this draft. Load ONLY: <gate-rubric instance> · Linear ticket <KEY-NNN> ·
    the drafted section at <path>.

    Run Tier 1 mechanical checks, then Tier 2 judgment checks, then the ticket's acceptance
    criteria + quality metric. Output the verdict in the rubric's format. Do not fix anything yourself.

## Revise

    Findings from the reviewer: <paste verdict>. Address every finding, or state why one is wrong
    (rare — the rubric wins by default). Re-submit for review. Loop cap: 3 — then flag and move on.

## Wave gate

    All wave-N tickets passed: integrate the sections into <doc>, re-run Tier 1 across the WHOLE doc,
    set execution-order statuses to "integrated", and comment a wave summary on the epic <KEY-epic>:
    passed / flagged / what unblocks next.
