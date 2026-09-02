# The Lia design system — the rules, for a builder

**verified-against:** `Lia-Creative/lia-design-system-v4` @ `798c2615e7efdff488d3bbaea59d93f54aa36d74` (`main`, last commit 18 Aug 2026)
**verified:** 2026-09-02, by Dan's session, from a local clone of the DS repo and the vault's `Products/Design System/` docs (`using-the-lia-design-system.md` updated 2026-08-17; `Context/brand-v4-reference.md` updated 2026-08-18)
**owner:** Dan. A change to this file is a PR on `lia-plugins`, like any skill.
**precedence when sources disagree:** `internal.lia.build/brand` (the living library) → the DS `globals.css` at the commit above → this file. A disagreement means this file is stale; say so and fix it, never invent a third value.

The system in one line: **a warm, editorial brand — eggshell and warm charcoal do the heavy lifting, colour is reserved for moments that matter, Martina Plantijn carries the voice, Söhne runs the interface, hand-done illustration and block-print icons bring the play.** Every rule below follows from that.

Every rule is written as something a builder can act on. Where a rule has a known exception, the exception is here too. Where the system has a known gap, it is named, not hidden.

---

## 1. Colour

**Colour is reserved. Brand Blue is the only CTA colour.** The accents are for *content* — chips, tags, status, illustration, charts — never for calls to action and never for backgrounds ("never the walls"). A second button colour is a decision that has already been made, and the answer is no.

### Brand and accents

| Name | Light | Dark | Tailwind | Role |
|---|---|---|---|---|
| **Brand Blue** | `#0044F9` | `#3C6EFD` | `bg-primary` / `text-primary` | The one CTA colour. The only colour a primary action takes. |
| Orange | `#F97316` | same | `bg-lia-orange` | Accent — content only |
| Magenta | `#C663D6` | same | `bg-lia-magenta` | Accent — content only |
| Gold | `#FACC15` | same | `bg-lia-gold` | Accent — content only |
| Brick | `#B91C1C` | same | `bg-lia-brick` | Accent — content only |
| Pink | `#F0ABFC` | same | `bg-lia-pink` | Accent — content only |
| Sky | `#BAE6FD` | same | `bg-lia-sky` | Accent — content only |
| Pale | `#FEF08A` | same | `bg-lia-pale` | Accent — content only |

The hex values are for recognising a colour, not for typing one — see §2. Brand Blue has a light and a dark value because `--primary` is declared once per theme (§2); the accents resolve to their fixed `-600` step in both themes, so they are mode-independent and need no dark override.

### Neutrals — the workhorses

| Name | Hex | Tailwind | Role |
|---|---|---|---|
| Cream (the desk) | `#F2F0EB` | `bg-background` | Page background |
| White (cards) | `#F9F8F3` | `bg-card` | Cards, raised surfaces |
| Muted | `#E7E5DF` | `bg-muted` / `border-border` | Borders, muted fills |
| Ink | `#1A1714` | `text-foreground` | Text |

**The neutral ramp is Lia's warm ramp.** `text-neutral-900` / `bg-neutral-100` resolve to the warm `--neutral-*` steps, not Tailwind's stock cool greys (fixed 2026-08-14 — before that they silently fell through and looked plausibly right). Reach for the semantic tokens (`text-foreground`, `bg-muted`) for anything themeable; `neutral-*` steps are for the rare surface that genuinely needs a fixed step.

**Ink is disputed.** Two "final" values exist — `#1A1714` / `oklch(0.205 0.005 55)` here, and `oklch(0.205 0.0025 56)` ≈ `#181716` from the 2026-06-24 brand-foundations session. Dan is settling it visually. Use `text-foreground` and do not pick a side; if a ticket needs the number, it is a question for Dan, not a value to reason out.

### Text on an accent — only through the Badge variants

**Never hand-pair an accent with a foreground** (`bg-lia-sky text-white` is a defect). Use the Badge accent variants — `sky`, `pale`, `gold`, `pink`, `orange`, `magenta`, `brick` — each pairs its accent with a `--lia-[accent]-foreground` chosen by measured contrast; all fourteen combinations (seven accents × two themes) verified at ≥ 5.24:1.

```tsx
<Badge variant="sky">Draft</Badge>
<Badge variant="brick">Overdue</Badge>
```

Six take ink. **`brick` is the only accent that takes paper** — ink on brick is 2.77:1, a fail. On the pale accents a hand-paired white foreground produces unreadable text with no error.

## 2. Tokens — by reference, through the aliasing hierarchy

**Tokens by reference, never a literal.** In app code: `bg-primary`, `text-foreground`, `bg-card`, `border-border`, `rounded-lg`, the `bg-lia-*` accents. **Never a raw `#hex`, `rgb()`, `hsl()` or `oklch()` in a component file, a page file, or a story.** If a token does not exist for what you need, that is a gap to flag (§10), not a value to type.

The hierarchy the DS is built on, and which every consumer inherits:

```
primitive ramp            →  semantic CSS var  →  Tailwind theme name  →  component utility
  --lia-blue-600             --primary             --color-primary          bg-primary
  (the only place a           (var(--lia-blue-600)) (var(--primary))         (resolves through)
   literal may live)
```

- **Raw colour literals live only in the primitive layer** — `--neutral-*` / `--lia-*` in the DS's `globals.css`. Nowhere else, in any repo.
- **Every semantic token is an alias to a primitive.** `--primary: var(--lia-blue-600)`. Never a literal inlined into a semantic; never a semantic aliasing another semantic. **The semantics are declared twice — in `:root` (light) and in `.dark` — and each declaration aliases its own primitive.** That is how one token, `--primary`, is `#0044F9` on the light ground and `#3C6EFD` on the dark one with no literal anywhere outside the primitive layer.
- **Consumers do not re-declare the DS's tokens.** The tokens arrive via `@import "@lia/design-system/globals.css"`; an app that re-declares `--primary` has forked the system. **One sanctioned exception:** §8's light-scoped `--muted-foreground` override, held only until the DS fix lands and removed then.
- **A consumer never edits a token.** A colour change is a change to the primitive in the DS, propagated by `pnpm update`; it is Dan's PR, not the app's.

## 3. Type

| Face | Role | Weights owned and shipped |
|---|---|---|
| **Martina Plantijn** (serif) | The voice — display and headings | Regular (400) + Regular Italic. **Nothing else.** |
| **Söhne** (sans) | The interface — body, UI, controls | Buch (400) + Buch Kursiv, Halbfett (600) + Halbfett Kursiv |
| **Söhne Mono** | Data, code, mono | Buch (400) |

- **Headings are Martina Plantijn Regular (400). Size carries hierarchy, not weight.** There is no Martina Medium or Bold — none was bought. A heading that "needs bold" needs a larger size.
- **Only the weights above exist.** `@font-face` is scoped to the owned weights with `font-synthesis-weight: none`, so an unowned weight (`font-medium`/500, `font-bold` on Martina) **silently falls back** rather than faux-bolding — the design will look right in one place and wrong in another with no error. Söhne emphasis is `font-semibold` (Halbfett 600); quiet UI and serif titles are `font-normal`. A design that needs a weight not listed needs a licence purchase first, never a CSS workaround.
- **Martina carries the voice, Söhne runs the interface — with the section-title exception.** A section title at the H1/H2/H4 levels stays Martina *even on a functional surface* (the ruling names those three levels; H3 is not named — treat an H3 section title as a question for Dan, not as a rule either way): the title is brand voice, the dense content beneath it is interface. Implemented as the `.surface-ui` scope in the DS. This resolved a real drift where card UI text had fallen through to the serif default; watch for the reverse drift too, where a section title on a dense screen gets set in Söhne.
- **No widows or orphans.** The last line of a heading or paragraph is never one lone word. Set it once at the base level — `text-wrap: balance` on headings, `text-wrap: pretty` on body copy — so nobody hand-fixes strings. For word pairs that must never break under any wrap (a brand name, a number and its unit, a name and a title) bind them with `&nbsp;`. This is a copywriting rule as much as a layout rule: when writing copy, read the last line. (Dan, 2026-06-10, a standing rule across all work.)
- **Punctuation is typographic.** Real apostrophes and quotes (’ “ ”), a real ellipsis (…), a real em dash (—) in user-facing copy. No straight quotes. Tooling trap: never run `perl -0pi` over UTF-8 source to convert them — it double-encodes; use the editor or Python with an explicit `utf-8` encoding. (Lia v4, 2026-06-24.)
- **Fallback stacks are OS faces only** — `Charter, Georgia` / `"Helvetica Neue", Arial` / `ui-monospace` — chosen on measured width delta against the real Klim faces. Do not add a Google Fonts fallback; that is the mistake that once made Storybook the only place a fallback rendered (fixed 2026-08-17).

## 4. Components

**Consume the DS. Do not fork it.** `@lia/design-system` is a git dependency (`github:Lia-Creative/lia-design-system-v4`), the same package name v3 used. v4 is Dan's lane.

- **Never re-roll a DS component.** Compose the real `Card`, `Badge`, `Button`, `Dialog`; never a hand-rolled div that imitates one, never a copy of a component's JSX into the app. The render-suite refactor on LIAB-373 is the standard.
- **Check Storybook before declaring a gap** — `https://lia-design-system-v4.vercel.app` shows every component live. The commonest "gap" is an unfamiliar token or a component that was there all along. Storybook is the DS's own preview: it serves the real faces under the DS repo's own arrangement (`KLIM_FONTS_TOKEN`, `--strict`), which is Dan's licence call for that one surface — a place to look, never a pattern for how a product serves fonts (§7 governs that).
- **The v4 public surface (LIAB-373):** Accordion · Alert · Avatar · Badge · Button · Card · Checkbox · Dialog · Input · Label · RadioGroup · Select · Separator · Slider · Sonner · Switch · Table · Tabs · Textarea · Tooltip — plus `Logo`, `BarChartFigure` (shadcn Chart + Recharts), and the block-print icon layer. Import from the barrel: `import { Button, Card, Logo } from "@lia/design-system"`.
- **Polymorphism is the Base UI `render` prop** (`<TooltipTrigger render={<Button … />} />`), never a wrapper component and never prop-spreading to mimic one.
- **`dark:` variants in a component are allowed only when the semantic token cannot carry the difference** (an opacity tweak, a ring contrast). The default is that the token carries it.
- **A gap is named and routed, never patched in the app** (§10). The one allowance: an app-local shim, only when genuinely needed, scoped, and marked for removal — and named on the ticket as a gap, so it is a finding with an owner rather than a quiet fork.
- **Squircles and pill CTAs** are the v4 shape language; they come from the components, not from per-screen radius values.

## 5. Icons

Two icon languages, and the job decides which:

- **Block-print icons** (`@lia/design-system/blockprint-icons`, 1,512 of them, Phosphor-derived, `currentColor`-tintable, tree-shakeable) — for **empty states, onboarding, feature cards, brand moments.** The expressive layer.
- **Crisp Phosphor / Lucide** — for **dense controls, nav, tables.** Never block-print there.

**Never put an icon in a bubble.** No coloured or rounded chip background behind an icon. The icon-in-a-tinted-rounded-square is a dead giveaway of unmodified shadcn and is banned outright — icons sit bare on the surface.

## 6. Themes

- Both themes, always. A screen is not done until it has been checked in light and dark; a token that only works on one ground is a defect.
- **Dark mode is the `.dark` class on `<html>`, toggled by `next-themes`** (`ThemeProvider attribute="class"`, framework-agnostic — works unchanged in a Vite SPA). **Never read `prefers-color-scheme` directly** — it bypasses the toggle.
- The DS is theme-aware through its tokens; a consumer that hard-codes a light or dark colour has left the system.

## 7. Fonts and the licence — the three lines that bite

The Klim faces are licensed (order 26061276, 30 Jun 2026: Desktop, Web on `lia.build`, App per application). What a builder must not do:

1. **Never put the Klim `.woff2` anywhere publicly downloadable** — not a public repo, not an unauthenticated CDN, not a page served off a domain other than `lia.build`. The DS itself no longer ships the binaries (removed 2026-08-14, the repo is public). Consumers sync them into their own public dir on postinstall, gitignored, from a non-public source: `node node_modules/@lia/design-system/scripts/sync-klim-fonts.mjs --out public/fonts`.
2. **A missing font fails silently.** Nothing errors, the build succeeds, type renders in whatever the browser finds. `sync-klim-fonts.mjs --strict` turns that into a build failure; any build that must not ship fallback type runs it (`build:vercel` does; a packaged toolbox build must).
3. **The Web format is domain-bound to `lia.build`.** A public surface on any other domain needs its own licence — that is a domain limit, not a timing gate. **The App format is assigned to the toolbox** (Dan, 2026-08-17): every tool that runs inside it is covered by the one licence; a distributed application that is not a Lia tool, with its own binary and name, is its own licence question — ask.

## 8. Known gaps — named so nobody discovers them twice

- **`--muted-foreground` fails WCAG AA** (≈ 4.05:1 on card, 3.81:1 on page; AA is 4.5:1). Dan's lane, LIAB-319. An app may hold a **light-scoped** override (→ olive-600, a token, not a literal) until the DS source fix lands — the one exception to §2's re-declare rule, and it comes out when the fix ships. Do not rely on muted text passing AA, and do not "fix" it by picking a darker literal.
- **Two console warnings originate in the DS Button and are expected, not the app's bug:** the paper-feel `Math.random()` hydration mismatch, and the Base UI `nativeButton` warning. Do not spend a ticket on them.
- **Ink's exact value is disputed** (§1). Use the token.

## 9. What `polish` checks, in the reference's own words

The conformance pass names a gap against one of these lines, or passes. A `polish` verdict that cannot cite a line here is grading by taste.

| The line | Where |
|---|---|
| No literal colour outside the DS primitive layer | §2 |
| Brand Blue is the only CTA; accents on content only | §1 |
| Text on an accent only through a Badge variant | §1 |
| Headings Martina 400; owned weights only; `font-semibold` for Söhne emphasis | §3 |
| Section titles stay Martina on functional surfaces (`.surface-ui`) | §3 |
| No widows or orphans; typographic punctuation | §3 |
| No re-rolled DS component; Storybook checked before a gap is declared | §4 |
| Block-print vs crisp icons by job; no icon in a bubble | §5 |
| Both themes; `.dark` class, not `prefers-color-scheme` | §6 |
| Fonts synced, gitignored, `--strict` where the build must not fall back | §7 |
| Muted text not relied on for AA | §8 |

## 10. Where a gap goes

- **`@lia/design-system` gap → Dan.** On the ticket: what the spec shows, what was built instead, which token or component is missing; label `specialist:design-system` (the board's label — it means *the gap is Dan's*). Check Storybook first.
- **Toys DS gap → Chris.** See §11.
- **Never fork or patch either system in the product repo.** Never hand-pair, never re-declare, never a "just for now" literal — that is how a design system dies one screen upstream of the build. The two named exceptions, and only these: §8's light-scoped `--muted-foreground` override, and §4's scoped shim marked for removal — both recorded on the ticket as gaps.

## 11. Toys DS — a stub, and the rule that holds until it is written

**This section is a stub. Chris draws Toys DS and fills it** (LIAB-788 / LIAB-789 own the shell's system). Nothing below is a Toys DS token; do not guess one.

What is settled (CQ, 2026-08-18): **Toys DS runs permanently beside v4.** It is the toolbox shell's own system and the one new tool designs are drawn in; v4 stays installed untouched (dump, and the Klim font sync); the two coexist by scoping and are never merged or forked. **Where a token name exists in both, Toys DS wins** in the toolbox (`polish`'s standing rule). A component Toys DS lacks is built shell-local — one implementation each, listed per PR — and how those eventually land in the real DS is an open Chris + Dan question on LIAB-788.

---

*Sources read for this file, in order of authority: `internal.lia.build/brand` (not re-read for this version — the vault snapshot stands in), `Lia-Creative/lia-design-system-v4/CLAUDE.md` at the commit above, `Products/Design System/Context/brand-v4-reference.md`, `Products/Design System/using-the-lia-design-system.md`, and Dan's `typographic-standing-rules` (Drive Vault, promoted 2026-08-18). What was deliberately left out: the install and wiring steps (the vault guide's and the DS README's), the licence history, the v3 record, and the shadcn/studio registry order (a DS-repo rule, not a consumer's).*
