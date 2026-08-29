---
name: research-schema-scrape
slug: research-schema-scrape
description: "The schema-scrape domain of a research plan — read an existing product and recover the data model behind it: the entities, their fields and types, the relationships and the rules the interface enforces, each one evidenced by the screen, export or endpoint it was read from. Use when dispatched at the schema-scrape domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-schema-scrape"
  - "research the schema domain"
  - "scrape the schema from [product]"
companions:
  - researcher
  - research-lead
  - schema-manager
  - ui-capture
  - security
  - execution-discipline
maintainer: cq
---

# Research — schema scrape

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

**The worked example from the commission:** the person record in Folk CRM — go through the product
and recover what a person actually is: every field, its type, what is required, what it relates to.

## What this domain asks

- **What are the entities?** The nouns the product is built on, in its own vocabulary.
- **What fields does each carry?** Name, type, whether it is required, its default, its constraint —
  and the label the product shows for it.
- **What relates to what, and with what cardinality?** One-to-many, many-to-many, and what happens to
  the children when the parent is deleted.
- **What rules does the interface enforce?** Validation, uniqueness, ordering, permissions and what
  is immutable once set.
- **What is derived rather than stored?** A computed field read as a stored one is the classic error
  in this domain.
- **What does the product's own vocabulary reveal?** Their name for a thing usually encodes a model
  decision.

## Method

1. **Prefer the documented model to the inferred one.** A public API reference, a schema endpoint, an
   import template or an export file states the model; the interface only implies it. Cite the
   strongest source available for each field and say which kind it is.
2. **The export and the import template are the best evidence in this domain** and are routinely
   overlooked — a CSV template names the fields, their order and their required set.
3. **Where only the interface is available, capture it.** `ui-capture` for the forms and detail
   views; the shot is the locator for every field claimed. A field claimed from memory is not a field.
4. **Test constraints only where you legitimately can** — in your own account, on your own data,
   within terms. **Never scrape at scale, never touch another person's data, never bypass access
   control.** A constraint you cannot test honestly is recorded as inferred.
5. **Mark inferred versus documented on every line.** This domain's whole value is a reader knowing
   which is which.
6. **Use `schema-manager`'s vocabulary for the write-up** so the entry can feed the schema map
   without a translation step — but the map itself is that seat's to change, not this one's.

## Quality bar

- **Counts as a source:** official API or schema documentation, an export file or import template, a
  captured form or detail view with its date, a developer or integration guide, a support article
  that states a limit.
- **Fails:** a field asserted from familiarity with the product, a type guessed from a value seen
  once, a relationship inferred from a screen that could equally show a filter.
- **`DEVELOPING`** fits a model you have read only through the interface — honest, useful, and
  clearly not a specification.
- **The line that does not move:** terms of service, access control and other people's data. A
  finding is worth nothing that costs an account or takes data that is not ours; where that boundary
  binds, it becomes a Gap. `security` is the seat to raise it with if the plan asks for more.

## Output

`researcher`'s corpus entry, `domain: schema-scrape`. Findings are per entity: a field table (name,
type, required, constraint, product label, documented-or-inferred), then relationships with
cardinality, then the enforced rules, then the derived fields. Locators are the export, the endpoint
or the captured screen. Gaps names what only an account tier or a permission you do not have would
show.

## What this seat is not

- **Not `schema-manager`.** That seat owns *our* entity map across its three layers. This one reads
  someone else's product and hands back a corpus entry it can consume.
- **Not a data extraction.** The model is the product, never the contents. No records are collected.
- **Not an integration spike.** Whether we can talk to the thing is `research-technology`'s question
  and, if it needs proving, Build's ticket.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The schema-scrape domain: documented model
  preferred over inferred with the kind marked per line, exports and import templates named as the
  overlooked best evidence, `ui-capture` shots as locators for interface-only fields, the derived
  versus stored trap called out, `schema-manager`'s vocabulary borrowed for the write-up, and the
  terms-and-other-people's-data line stated as a boundary that turns into a Gap rather than a
  workaround.
