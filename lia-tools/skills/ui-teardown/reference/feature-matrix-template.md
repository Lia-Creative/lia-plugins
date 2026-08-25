# Feature matrix

A controlled-vocabulary grid: capability surfaces down the side, products across the top. The
controlled vocabulary is the whole point — a `contact-record` row means the same thing in every CRM
teardown, so matrices from different runs **stack** into a comparison without re-keying.

## Rules

- **Rows come from `ui-capture/reference/feature-taxonomy.md`** (the same slugs). Add a capability
  row only when the product genuinely has a surface the taxonomy lacks — then propose it back to the
  taxonomy so the next run lines up.
- **Cells are evidence-bound.** A cell is `present` only if a shot proves it. No shot → `unknown`,
  never a guess.
- **One column per product**, even for a single-product run (so a later comparison drops a column in).
- Keep the per-cell note to one line; the depth lives in the teardown doc.

## Legend

| mark | meaning |
| --- | --- |
| `✓` | present — captured and working as expected |
| `◐` | partial — exists but limited / basic / gated |
| `✗` | absent — confirmed not present |
| `?` | unknown — not captured, or inferred only |

## Markdown template

```markdown
# Feature matrix — {archetype} — {date}

Legend: ✓ present · ◐ partial · ✗ absent · ? unknown. Evidence in brackets.

| surface | Product A | Product B |
| --- | --- | --- |
| contact-record    | ✓ rich timeline [02] | ✓ basic [A-02] |
| pipeline-board    | ✓ kanban [05]        | ◐ list only [A-04] |
| automation        | ◐ templates [11]     | ✗ [A-07] |
| ai-assist         | ✓ invisible enrich [08] | ? not captured |
| import-data       | ? auth-walled        | ✓ CSV map [A-09] |

Confidence: Product A High (coverage 11/13) · Product B Medium (coverage 7/13).
```

`[02]` = shot index in that product's run (`02-...png`). For multi-product, prefix with a product
key (`A-02`) and note each run folder under the matrix.

## CSV variant

When the matrix is going into a spreadsheet, also emit `feature-matrix.csv`:

```csv
surface,Product A,Product A evidence,Product B,Product B evidence
contact-record,present,02,present,A-02
pipeline-board,present,05,partial,A-04
automation,partial,11,absent,A-07
```

Keep the same controlled vocabulary in the cells (`present/partial/absent/unknown`) so the CSV
sorts and filters cleanly.

## Why this earns its keep

The matrix is the second half of the "are we missing features" answer: the taxonomy rows make
*absence visible*. An empty `✗`/`?` column isn't a hole in the doc — it's the finding. Paired with
the capture coverage block, you can always say not just "here's what they have" but "here's the
share of what they *could* have that we actually verified."
