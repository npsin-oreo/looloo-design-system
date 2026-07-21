# RFC — Collapse the component-tier COLOR tokens into the semantic tier

Status: **Phase 1 (code) DONE on branch `refactor/color-tier-collapse` (uncommitted)** · Owner: DS · Updated 2026-07-21

> **Phase 1 result:** +18 solid-shade surfaces (light in semantic, dark in mode/dark.json);
> −356 component color leaves; 11 `.tsx` repointed (57 tokens → semantic/new-surface). Tokens
> 1700→1344. Gates green: `typecheck`, `tokens:validate` (0/0), `tokens:build`,
> `audit:styles --strict` (0 HIGH), `tokens:audit --strict` (0 below AA-large), 0 dangling refs.
> **NEXT:** visual-regression review (esp. dark mode + the file-upload 8/12→10% shift) → Phase 2
> compat.css → Phase 3 Figma → commit/PR.

## 1. Goal

Repoint every consumer of a **component-tier color token** to the **semantic** tier
directly, and remove the component color tier entirely. Mirror the same change in the Figma
variable collection (repoint component instance bindings → semantic variables, then delete the
component color variables).

Component *non-color* tokens (radius, spacing, size, height, padding, typography) are **out of
scope** — this RFC only touches color.

## 2. Consumption reality (corrected during Phase 1)

**Correction:** an initial `grep var(--…)` suggested components didn't consume these tokens. In
fact **11 components DO consume them at runtime** via Tailwind v4 **arbitrary-property syntax**
— `bg-(--badge-color-success-surface)`, `border-(--alert-color-info-border)` — which
`var()`-based greps miss. **57 distinct component color tokens** are wired across
alert, alert-dialog, badge, checkbox, empty, file-upload, label, popover, radio-group, spinner,
table. The remaining ~300 are an unwired "captured/DRAFT" layer (e.g. button.json) not yet
consumed. **Implication:** deletion alone breaks the 11 components — Phase 1 therefore also
**repoints those `.tsx` refs to the semantic / new-surface tokens** (done, §7 Phase 1).

## 3. Phase-0 inventory (from `dist/tokens/component.css`)

**354 distinct component color tokens, 0 mode-split.** Categorised by value shape:

| category | count | action |
|---|---:|---|
| (a) pure alias — `var(--<semantic>)` | 290 | repoint → semantic, delete |
| (b) derived — `color-mix(...)` surface/tint | 37 (**18 distinct**) | **replace with a new SOLID-shade semantic token** (§4), then delete |
| (c) opacity / non-colour var | 26 | **repoint to existing `--ll-opacity-*` / `--interaction-*` primitives**, delete — *unchanged, see §5* |
| (?) other | 1 | `--spinner-color-inherit: currentColor` → inline |

> Reproduce: `scratchpad/categorize_component_colors.py`.

## 4. Surface tokens — SOLID shades, per-mode (⟵ design direction 2026-07-21)

**Direction change:** surfaces do **not** use `color-mix(hue X%, transparent)` opacity tints.
Instead each surface is a **solid palette shade of the SAME hue family**, with **separate
light/dark values** (light = base in `tokens/semantic/`, dark override in
`tokens/mode/dark.json`). Rationale: predictable, no bleed-through over coloured backgrounds,
cleaner tokens. Because `color-mix` auto-adapts to the mode and a solid shade does not, the
per-mode split is **required** to keep dark mode correct.

> This is a **deliberate visual change** (solid ≠ translucent) — the earlier "byte-for-byte /
> no drift" rule is **superseded for these 18 surfaces**; they are validated by **visual
> regression + design sign-off**, not byte-diff. All *pure aliases* (§3a) and *opacity* tokens
> (§5) remain exact.

### Shade convention

| level (old tint) | light shade | dark shade |
|---|---|---|
| `surface` (was 10%) | **50** | **950** |
| `surface-hover` (was 20%) | **100** | **900** |
| `border` (was 25%) | **200** | **800** |

### 18 new semantic surface tokens

| # | new semantic token | hue | light | dark | replaces (example) |
|---|---|---|---|---|---|
| 1 | `--destructive-surface` | red | `red.50` | `red.950` | `--*-color-destructive-surface` (×7) |
| 2 | `--status-success-surface` | green | `green.50` | `green.950` | `--*-confirm/success-surface` (×4) |
| 3 | `--status-warning-surface` | amber | `amber.50` | `amber.950` | `--*-warning-surface` (×4) |
| 4 | `--status-info-surface` | blue | `blue.50` | `blue.950` | `--alert-color-info-surface` (×2) |
| 5 | `--destructive-surface-hover` | red | `red.100` | `red.900` | `--*-destructive-hover-surface` |
| 6 | `--status-success-surface-hover` | green | `green.100` | `green.900` | `--badge-color-success-hover-surface` |
| 7 | `--status-warning-surface-hover` | amber | `amber.100` | `amber.900` | `--badge-color-warning-hover-surface` |
| 8 | `--status-info-surface-hover` | blue | `blue.100` | `blue.900` | `--badge-color-info-hover-surface` |
| 9 | `--destructive-border` | red | `red.200` | `red.800` | `--alert-color-destructive-border` |
| 10 | `--status-success-border` | green | `green.200` | `green.800` | `--alert-color-success-border` |
| 11 | `--status-warning-border` | amber | `amber.200` | `amber.800` | `--alert-color-warning-border` |
| 12 | `--status-info-border` | blue | `blue.200` | `blue.800` | `--alert-color-info-border` |
| 13 | `--secondary-surface-hover` | gray | `gray.100` | `gray.800` | `--badge-color-secondary-hover-surface` |
| 14 | `--secondary-hover` | gray | `gray.200` | `gray.700` | `--button-color-secondary-hover-surface` |
| 15 | `--muted-surface` | gray | `gray.50` | `gray.900` | `--table-color-row-hover-surface` (×2) |
| 16 | `--input-surface` | gray | `gray.100` | `gray.800` | `--command-input-background` (×2) |
| 17 | `--primary-surface` | brand-primary | `brand-primary.50` | `brand-primary.950` | `--table-color-row-selected-background` **+ file-upload dropzone-active** (was 8%) |
| 18 | `--ring-subtle` | gray | `gray.200` | `gray.700` | `--card-color-ring-paint` |

**file-upload unify:** its old 8% / 12% one-off tints collapse into the shared surfaces —
dropzone-active → `--primary-surface`, media-success → `--status-success-surface`,
media-error → `--destructive-surface`. (Was the sole "keep-distinct vs unify" decision; **unify** chosen.)

> Shade levels above are the **proposed** convention (50/100/200 ↔ 950/900/800). Exact shade per
> token is confirmed in the visual-regression pass; nudge ±1 step if a specific surface reads too
> strong/weak on its real background (card vs muted vs page).

## 5. Opacity tokens (category c) — unchanged

Per direction (2026-07-21) the **opacity scale stays as-is**. The 26 opacity tokens already
alias existing primitives (`--ll-opacity-{10,20,30,50,70}`, `--interaction-hover-opacity`,
`--focus-ring-*`, `--interaction-secondary-hover-mix`) — they repoint straight to those and
delete. **No new tokens, no scale change.** (These are genuine opacity *uses* — focus glow,
disabled state, ring — not surface tints, so they are not converted to solid shades.)

## 6. Numeric (dimension) scale — principle only, no restructure

Per direction (2026-07-21): keep the **×4 multiple** as the backbone of the spacing/sizing
scale, **retain the existing off-grid steps** already in use (`space` half-steps 2/6/10/14px,
`size` 14/18px) — do **not** rip them out. Any *new* dimensional token added during this
migration should prefer a ×4 multiple. **Opacity scale unchanged.** No numeric tokens are
added by this refactor, so this is guidance, not an action item.

## 7. Method (code first → Figma mirror → compat window → hard cut)

**Phase 1 — code**
1. Add the 18 surface tokens to `tokens/semantic/` (light shade) + `tokens/mode/dark.json`
   (dark shade).
2. Codemod `tokens/component/*.json`: delete every color leaf; pure-alias consumers already
   point at semantic (Tailwind), derived ones now point at the new surface tokens, opacity ones
   at the `--ll-opacity-*` primitives.
3. `npm run tokens:build` → regenerates `dist/tokens/*.css`, the TS map, and the contract.
4. `npm run tokens:validate` + `npm run check` green.

**Phase 2 — compat window (≥ 1 minor):** emit `dist/tokens/compat.css` re-declaring the old
`--*-color-*` names as thin aliases to the new semantic values (`deprecated: true`, excluded
from the primary contract).

**Phase 3 — Figma mirror** (after code green): script/plugin repoints every component instance
binding old component-color var → semantic var, audits zero remaining bindings, marks old vars
deprecated/hidden. *(MCP note: reading this file's variables needs a layer selected in Figma
desktop.)*

**Phase 4 — hard cut** (with a major bump): drop `compat.css`; delete the Figma component color
variables.

## 8. Validation gates

- **Surface visual regression + sign-off** (§4): the 18 solid surfaces are an *intended*
  appearance change — capture each consuming component × 8 states × **light + dark**, review
  against the old tints, tune shade ±1 step where needed. This replaces byte-diff for surfaces.
- **No drift on the rest**: byte-diff every pure-alias (§3a) and opacity (§5) repoint — those
  must be pixel-identical.
- **Non-Tailwind literal consumers**: repo-wide grep for the 354 literal `--*-color-*` names
  (contract, POC templates, Storybook, docs) before any hard cut.
- **Contract count assertion** in CI: `oldColorCount − 354 + 18`; fail on mismatch.
- **TS typecheck**: catches removed component-color exports from the generated token map.
- **Figma per-variable binding audit** before deleting each variable (guards instance overrides).
- **New `validate.mjs` rule**: assert zero component-tier color tokens remain outside
  `compat.css`, and `dist/tokens/*.css` emits no component-color custom property post-migration.

## 9. Risk / trade-off

- Removing the component color tier removes the per-component override hook; acceptable since no
  divergent component-private colors exist today (all were aliases/derivations of semantic).
- Solid surfaces (vs `color-mix`) trade auto dark-mode adaptation for explicit per-mode values —
  more predictable, but every surface now needs a light **and** dark shade kept in sync (guarded
  by the dark-mode visual-regression frames).
- Semantic surface set grows +18; gate names with a review to avoid sprawl.
