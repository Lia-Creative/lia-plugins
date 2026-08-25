# Manifest schema

Every capture run writes two manifests into the run folder. They are the **handoff contract**:
`ui-teardown` (and any founder picking the run up later) works from these alone. The Playwright
script writes both automatically; for Claude-in-Chrome (logged-in) shots, append rows by hand using
the same fields and keep the numbering continuous.

## `manifest.json` (machine-readable)

```jsonc
{
  "target": "HubSpot",
  "type": "competitor",                       // competitor | own | crm | adhoc
  "archetype": "crm",
  "engine": "playwright",                      // or "claude-in-chrome", or "mixed"
  "viewport": { "width": 1440, "height": 900, "deviceScaleFactor": 2 },
  "standard": { "size": "1440x900", "scale": 2, "fullPage": true, "format": "png" },
  "started_at": "2026-06-26T...Z",
  "finished_at": "2026-06-26T...Z",
  "shots": [
    {
      "index": 1,
      "slug": "contact-record",
      "url": "https://app.example.com/contacts/123",
      "final_url": "https://app.example.com/contacts/123",
      "engine": "claude-in-chrome",
      "status": 200,
      "width": 2880, "height": 4120,           // px of the saved PNG (2x of layout)
      "bytes": 481233,
      "file": "01-contact-record.png",
      "qa": { "status": "ok", "reasons": [] }, // ok | warn | fail
      "pii": true,                             // true if real customer PII is visible
      "pii_note": "shows a real contact name + email",
      "captured_at": "2026-06-26T...Z"
    }
  ],
  "coverage": {
    "archetype": "crm",
    "expected_total": 13,
    "captured_expected": 11,
    "score": "11/13 (85%)",
    "expected_missing": [
      { "slug": "automation", "reason": "auth-walled — needs admin seat" },
      { "slug": "import-data", "reason": "not found in nav" }
    ],
    "discovered_uncaptured": [
      { "text": "Playbooks", "href": "https://.../playbooks", "reason": "out of scope this run" }
    ],
    "note": "second pass would need an admin account for automation + import"
  }
}
```

## `manifest.md` (human-readable)

A header (target / type / archetype / standard / run times / shot count), a table of shots
(`# · surface · qa · http · size · pii · notes · url`), and the `## Coverage` block. The script
seeds the table and leaves the Coverage block as a fill-in prompt — **the verification pass must
complete it before the run is "done."**

## Field notes

- **slug** — from `feature-taxonomy.md` where it fits; that's what makes surfaces line up across
  products in the teardown matrix. Novel surfaces get a sensible new slug.
- **qa.status** — `ok` clean · `warn` captured but check it (low text, redirect) · `fail`
  (blank / error page / http error). The script auto-retries a `fail` once.
- **pii** — set `true` for any authenticated shot showing real customer data; keep the run local,
  never push externally, never send to an external API.
- **coverage** — the eval. Empty/!null `expected_missing` with honest reasons is the point; a 100%
  score with no reasoning is a red flag, not a win.
