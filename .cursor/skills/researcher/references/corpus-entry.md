# The corpus entry — the shape every domain files

One file per domain per plan, at the repo and path the plan named (default:
`research/[plan-slug]/[domain].md` in the product repo the research serves). The insights seat reads
ten of these and must not have to learn ten formats.

```markdown
---
plan: [plan-slug]
domain: [problem | solution-space | solution-patterns | psychology | strategy | competitors | brand | ux-patterns | technology | schema-scrape]
questions: [the plan's question ids or lines this entry answers]
researcher: [agent id]
collected: [YYYY-MM-DD]
ticket: [LIAB-nnn, the commissioning ticket]
---

# [Domain] — [plan name]

## What was asked

The plan's questions for this domain, verbatim. Not paraphrased — the insights seat checks
coverage against them.

## Findings

Numbered, so a review and the insight log can cite them by index.

1. **[The claim, in one sentence.]** `FACT`
   - Source: [title, author or organisation]
   - Locator: [URL, page, section, or the captured screen and where it lives]
   - Accessed: [YYYY-MM-DD]
   - Note: [what the source actually says, where the claim needs the qualifier]

2. **[The claim.]** `DEVELOPING`
   - Source / Locator / Accessed as above
   - Why developing: [what would have to be true, or what is missing, for this to be a fact]

## Disagreements

Where credible sources conflict — both recorded, neither settled here.

- **[The question in dispute.]**
  - [Position A] — source, locator, accessed
  - [Position B] — source, locator, accessed
  - What would settle it: [the evidence that does not exist yet, or where it would be found]

## Gaps

What the plan asked and this entry could not establish. Each one names what was tried, so the next
session does not repeat it and the lead can decide whether to re-dispatch.

- **[The open question.]** Tried: [sources searched, why they did not answer it].

## Sources

Every source used, once, in full — so the list can be checked without reading the findings.
```

## The rules this shape encodes

- **`FACT` or `DEVELOPING` on every finding.** No third state, and no unmarked line.
- **Four citation parts, always**: source, locator, accessed date, and the note that says what the
  source actually supports.
- **Numbered findings.** Review verdicts, the insight log and the story all cite by index.
- **Gaps are content.** An entry with an honest Gaps section is finished; one that quietly has none
  is usually padded.
- **No interpretation anywhere in this file** — no ranking, no "so we should", no recommendation.
  That is `research-insights`', and a corpus entry carrying it fails review.
