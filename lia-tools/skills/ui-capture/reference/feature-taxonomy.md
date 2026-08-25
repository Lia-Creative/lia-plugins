# Feature taxonomy — the coverage checklist

The expected feature *surfaces* a product of a given archetype almost always has. The capture
verification pass walks this list to answer the only question that matters for completeness:
**what surface does this product have that we have no screenshot of?**

How to use it:

1. Classify the target into one archetype (or the closest). If it spans two (e.g. a CRM with a
   built-in analytics tab), use both lists.
2. The archetype's surfaces + the universal surfaces = the **expected set**.
3. After capturing, mark each expected surface `captured` / `missing` / `n-a`. Missing ones with a
   reason go in the manifest `## Coverage` block. Coverage score = captured / (expected − n-a).
4. Slugs here are the canonical filenames — use them (`NN-slug.png`) so the same surface lines
   up across products when `ui-teardown` builds the matrix.

This is a checklist, not a cage. If the product has a surface that isn't listed, capture it and add
it to the run (and, if it recurs, propose a new taxonomy row). Novel surfaces are often the
interesting ones.

---

## Universal surfaces (every web product)

| slug | what to look for |
| --- | --- |
| `marketing-home` | the public landing/marketing page — positioning, hero, primary CTA |
| `pricing` | pricing/plans page — tiers, what gates what |
| `signup` | account creation flow (first screen at least) |
| `login` | sign-in screen |
| `onboarding` | first-run / empty account — setup wizard, checklist, sample data |
| `home-dashboard` | the logged-in landing surface |
| `global-nav` | the primary navigation (sidebar/top nav) expanded |
| `search` | global search + a results state |
| `settings` | account/workspace settings landing |
| `profile-account` | the user's own profile / account menu |
| `billing` | billing & subscription management |
| `notifications` | notification centre / activity feed |
| `empty-state` | a key surface with no data yet (these reveal the product's POV) |
| `help-support` | help centre, docs entry, or in-app support |
| `mobile-home` | the same product at a phone width (if responsive / has an app) |

---

## CRM (`archetype: crm`)

| slug | what to look for |
| --- | --- |
| `contact-record` | a single contact/person profile page — **the page Chris cares about most** |
| `company-record` | a single company/account profile page |
| `deal-record` | a single deal/opportunity detail page |
| `contacts-list` | the contacts index/table view |
| `pipeline-board` | the deal pipeline / kanban |
| `activity-timeline` | the per-record interaction history (emails, calls, notes) |
| `tasks-activities` | tasks / to-dos / reminders surface |
| `email-compose` | compose/send email or sequence enrolment from a record |
| `list-segmentation` | building a filtered list / segment / saved view |
| `reports` | reporting/dashboard builder |
| `import-data` | data import / CSV mapping |
| `automation` | workflow/automation builder |
| `record-customization` | customising fields / record layout |

## Project / work management (`archetype: project`)

| slug | what to look for |
| --- | --- |
| `board-view` | kanban board |
| `list-view` | list/table of items |
| `timeline-gantt` | timeline / gantt |
| `calendar-view` | calendar |
| `item-detail` | a single task/issue detail panel |
| `create-item` | the create-task flow |
| `my-work` | a per-person "assigned to me" view |
| `project-overview` | a project home / portfolio view |
| `filters-views` | filtering + saved views |
| `automation` | rules/automation |
| `reporting` | dashboards / burndown / load |

## Content / creator tool (`archetype: creator`) — closest to Lia's own world

| slug | what to look for |
| --- | --- |
| `library` | the asset/file/content library |
| `editor` | the primary creation/editing surface |
| `asset-detail` | a single asset's detail/metadata view |
| `organise` | folders / tags / collections / boards |
| `upload-import` | bringing content in |
| `publish-export` | publishing / scheduling / export |
| `templates` | template gallery |
| `versions-history` | version history / revisions |
| `collaborate` | comments / sharing / collaborators |
| `ai-assist` | any AI feature surface (how is it framed — invisible vs chat?) |
| `analytics` | performance/insights on the content |

## E-commerce (`archetype: ecommerce`)

| slug | what to look for |
| --- | --- |
| `storefront-home` · `category` · `product-detail` · `cart` · `checkout` | the buy path |
| `account-orders` | order history / account |
| `admin-catalog` · `admin-orders` · `admin-analytics` | the seller/admin side (if in scope) |

## Analytics / BI (`archetype: analytics`)

| slug | what to look for |
| --- | --- |
| `dashboard` · `chart-builder` · `report-detail` · `data-explore` · `filters-segments` · `share-export` · `alerts` | build → view → share path |

## Social / community (`archetype: social`)

| slug | what to look for |
| --- | --- |
| `feed` · `post-detail` · `compose` · `profile` · `messaging` · `discover` · `notifications` | the core loop |

## Generic SaaS (`archetype: saas`)

Use the universal surfaces + capture whatever the product's primary object and primary action are
(`primary-object-list`, `primary-object-detail`, `primary-create-flow`), plus any integrations/marketplace
surface (`integrations`).

---

## Crawl-completeness (explore mode)

The taxonomy catches *expected* surfaces. Explore mode also records the *discovered* set — every
same-origin destination found in the nav, sidebar, footer, and account menu (`candidates.json`). The
two cross-checks together are the eval:

- **taxonomy coverage** = did we get the surfaces this *kind* of product should have?
- **crawl completeness** = did we get the destinations *this specific* product actually exposes?

A surface can be expected-but-undiscovered (probably auth-walled or named oddly) or
discovered-but-unexpected (often the differentiator). Both belong in the manifest coverage block.
